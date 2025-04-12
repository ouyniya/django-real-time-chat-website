import json  # Importing the JSON library to work with JSON data

# Importing sync_to_async, which is used to make synchronous functions callable from asynchronous code
from asgiref.sync import sync_to_async

# Importing AsyncJsonWebsocketConsumer from Django Channels to create a consumer for handling WebSocket connections.
from channels.generic.websocket import AsyncJsonWebsocketConsumer

from django.utils.timesince import timesince
from account.models import User
from .models import Room, Message

from .templatetags.chatextras import initials


# This class will handle WebSocket connections for chat rooms. It inherits from AsyncJsonWebsocketConsumer to handle JSON messages asynchronously.
class ChatConsumer(AsyncJsonWebsocketConsumer):

    # This is called when the WebSocket connection is established.
    async def connect(self):
        # Extracts the 'room_name' from the URL, which is passed to the consumer through the routing configuration.
        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]

        # Creates a unique group name for the chat room by prefixing 'chat_' to the room name.
        # This ensures that multiple rooms don't overlap.
        self.room_group_name = f"chat_{self.room_name}"

        self.user = self.scope.get("user", None)
        if self.user is None:
            await self.close()
            return

        # Joins the room group by adding the channel to a group. This makes it possible to broadcast messages to all members of the group.
        await self.get_room()
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)

        # Accept the WebSocket connection, allowing further communication through it.
        await self.accept()

        # Inform user
        if self.user.is_staff:
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "users_update",
                },
            )

    # This is called when the WebSocket connection is closed.
    async def disconnect(self, close_code):
        # Leaves the room group by removing the channel from the group. This ensures the WebSocket won't receive messages anymore.
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)
        # print('****' , self.user.is_staff)
        if not self.user.is_staff:
            await self.set_room_closed()

    async def receive(self, text_data):
        # receive message from Websocket front end
        text_data_json = json.loads(text_data)
        type = text_data_json["type"]
        message = text_data_json["message"]
        name = text_data_json["name"]
        # agent = text_data_json["agent"]
        agent = text_data_json.get("agent", None)

        print("Receive: ", type)

        if type == "message":
            new_message = await self.create_message(name, message, agent)
            # send message to group
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "chat_message",
                    "message": message,
                    "name": name,
                    "agent": agent,
                    "initials": initials(name),
                    "created_at": timesince(new_message.created_at),
                },
            )

    async def chat_message(self, event):
        # send message to WebSocket (front end)
        await self.send(
            text_data=json.dumps(
                {
                    "type": event["type"],
                    "message": event["message"],
                    "name": event["name"],
                    "agent": event["agent"],
                    "initials": event["initials"],
                    "created_at": event["created_at"],
                }
            )
        )

    async def users_update(self, event):
        # Send information to the web socket
        await self.send(text_data=json.dumps({"type": "users_update"}))

    @sync_to_async
    def get_room(self):
        self.room = Room.objects.get(uuid=self.room_name)

    @sync_to_async
    def set_room_closed(self):
        self.room = Room.objects.get(uuid=self.room_name)
        self.room.status = Room.CLOSED
        self.room.save()

    @sync_to_async
    def create_message(self, sent_by, message, agent):
        message = Message.objects.create(body=message, sent_by=sent_by)

        if agent:
            message.created_by = User.objects.get(pk=agent)
            # message.agent = User.objects.get(pk=agent)
            message.save()

        self.room.messages.add(message)

        return message
