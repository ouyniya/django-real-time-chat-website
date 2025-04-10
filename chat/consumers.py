import json  # Importing the JSON library to work with JSON data

# Importing sync_to_async, which is used to make synchronous functions callable from asynchronous code
from asgiref.sync import sync_to_async

# Importing AsyncJsonWebsocketConsumer from Django Channels to create a consumer for handling WebSocket connections.
from channels.generic.websocket import AsyncJsonWebsocketConsumer

# This class will handle WebSocket connections for chat rooms. It inherits from AsyncJsonWebsocketConsumer to handle JSON messages asynchronously.
class ChatConsumer(AsyncJsonWebsocketConsumer):

    # This is called when the WebSocket connection is established.
    async def connect(self):
        # Extracts the 'room_name' from the URL, which is passed to the consumer through the routing configuration.
        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]

        # Creates a unique group name for the chat room by prefixing 'chat_' to the room name.
        # This ensures that multiple rooms don't overlap.
        self.room_group_name = f"chat_{self.room_name}"

        # Joins the room group by adding the channel to a group. This makes it possible to broadcast messages to all members of the group.
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)

        # Accept the WebSocket connection, allowing further communication through it.
        await self.accept()

    # This is called when the WebSocket connection is closed.
    async def disconnect(self, close_code):
        # Leaves the room group by removing the channel from the group. This ensures the WebSocket won't receive messages anymore.
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)
