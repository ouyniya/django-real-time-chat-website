// variables

const chatRoom = JSON.parse(document.getElementById("room_uuid").textContent);

let chatSocket = null;

console.log(chatRoom);

/* elements */

const chatLogElement = document.querySelector("#chat_log");
const chatInputElement = document.querySelector("#chat_message_input");
const chatSubmitElement = document.querySelector("#chat_message_submit");

/** function */

function scrollToBottom() {
  chatLogElement.scrollTop = chatLogElement.scrollHeight;
}

function sendMessage() {
  chatSocket.send(
    JSON.stringify({
      type: "message",
      message: chatInputElement.value,
      name: JSON.parse(document.getElementById("user_name").textContent),
      agent: JSON.parse(document.getElementById("user_id").textContent),
    })
  );

  chatInputElement.value = "";
}

function onChatMessage(data) {
  console.log("onChatMessage", data);

  if (data.type === "chat_message") {
    if (!data.agent) {
      chatLogElement.innerHTML += `<div class="flex w-full mt-2 space-x-3 max-w-md">
        <div class="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300 text-center pt-2">
          ${data.initials}
        </div>
        <div>  
          <div class="bg-gray-300 p-3 rounded-l-lg rounded-br-lg">
          <p class="text-sm">${data.message}</p>
        </div>
        <span class="text-xs text-gray-500 leading-none">${data.created_at} ago</span>
        </div>
      </div>`;
    } else {
      chatLogElement.innerHTML += `<div class="flex w-full mt-2 space-x-3 max-w-md ml-auto justify-end">
            <div>  
              <div class="bg-blue-300 p-3 rounded-l-lg rounded-br-lg">
                <p class="text-sm">${data.message}</p>
              </div>
              <span class="text-xs text-gray-500 leading-none">${data.created_at} ago</span>
            </div>
  
              <div class="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300 text-center pt-2">
              ${data.initials}
            </div>
          </div>`;
    }
  }
  scrollToBottom();
}

/* web socket */

chatSocket = new WebSocket(`ws://${window.location.host}/ws/${chatRoom}/`);

chatSocket.onmessage = function (e) {
  console.log("onmessage");

  onChatMessage(JSON.parse(e.data));
};

chatSocket.onopen = function (e) {
  console.log("onopen");
  scrollToBottom();
};

chatSocket.onclose = function (e) {
  console.log("chat socket closed unexpectedly");
};

/** Event listener */

chatSubmitElement.onclick = function (e) {
  e.preventDefault();
  sendMessage();
  return false;
};

if (chatInputElement) {
  chatInputElement.onkeyup = function (e) {
    if (e.keyCode === 13) {
      sendMessage();
    }
  };
} else {
  console.log("Button not found.");
}
