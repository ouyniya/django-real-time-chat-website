let chatName = "";
let chatSocket = null;
let chatWindowURL = window.location.href;
let chatRoomUuid = Math.random().toString(36).slice(2, 12);

// console.log("chatid", chatRoomUuid);

// elements

const chatElement = document.querySelector("#chat");
const chatJoinElement = document.querySelector("#chat_join");
const chatRoomElement = document.querySelector("#chat_room");
const chatIconElement = document.querySelector("#chat_icon");
const chatOpenElement = document.querySelector("#chat_open");
const chatCloseElement = document.querySelector("#chat_close");
const chatWelcomeElement = document.querySelector("#chat_welcome");
const chatNameElement = document.querySelector("#chat_name");
const chatLogElement = document.querySelector("#chat_log");
const chatSubmitElement = document.querySelector("#chat_message_submit");
const chatInputElement = document.querySelector("#chat_message_input");

// function

function scrollToBottom() {
  chatLogElement.scrollTop = chatLogElement.scrollHeight;
}

function getCookie(name) {
  let cookieValue = null;

  if (document.cookie && document.cookie !== "") {
    let cookies = document.cookie.split(";");

    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i].trim();

      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));

        break;
      }
    }
  }

  return cookieValue;
}

async function joinChatRoom() {
  console.log("join.....");

  chatName = chatNameElement.value;

  console.log("Join as: ", chatName);
  console.log("Room uuid: ", chatRoomUuid);

  const data = new FormData();
  data.append("name", chatName);
  data.append("url", chatWindowURL);

  await fetch(`/api/create-room/${chatRoomUuid}/`, {
    method: "POST",
    headers: {
      "X-CSRFToken": getCookie("csrftoken"),
      // "X-CSRFToken": "test123",
    },
    body: data,
  }).then(function (data) {
    console.log("data: ", data);
  });

  chatSocket = new WebSocket(
    `ws://${window.location.host}/ws/${chatRoomUuid}/`
  );

  chatSocket.onmessage = function (e) {
    console.log("onMessage");

    onChatMessage(JSON.parse(e.data));
  };

  chatSocket.onopen = function (e) {
    console.log("onOpen - chat socket was opened");
    scrollToBottom();
  };

  chatSocket.onclose = function (e) {
    console.log("onClose - chat socket was closed");
  };
}

function sendMessage() {
  chatSocket.send(
    JSON.stringify({
      type: "message",
      message: chatInputElement.value,
      name: chatName,
    })
  );

  chatInputElement.value = "";
}

function onChatMessage(data) {
  // delete writing message when send a message
  let tmpInfo = document.querySelector(".tmp-info");

  if (tmpInfo) {
    tmpInfo.remove();
  }

  // send a message

  if (data.type === "chat_message") {
    // console.log("agent***", data.agent);
    if (data.agent) {
      chatLogElement.innerHTML += `<div class="flex w-full mt-2 space-x-3">
          <div class="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300 text-center pt-2">
            ${data.initials}
          </div>
          <div>  
            <div class="bg-gray-300 p-3 rounded-r-lg rounded-bl-lg">
              <p class="text-sm">${data.message}</p>
            </div>
            <span class="text-xs text-gray-500 leading-none">${data.created_at} ago</span>
          </div>
        </div>`;
    } else {
      chatLogElement.innerHTML += `<div class="flex w-full mt-2 space-x-3 ml-auto justify-end">
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
  } else if (data.type == "users_update") {
    chatLogElement.innerHTML += `<p class="flex gap-1 mt-2 text-xs text-gray-500">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
  <path stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
</svg>

    The admin or agent has joined the chat!`;
  } else if (data.type == "writing_active" && data.agent) {
    let tmpInfo = document.querySelector(".tmp-info");

    if (tmpInfo) {
      tmpInfo.remove();
    }

    chatLogElement.innerHTML += `<div class="tmp-info flex w-full mt-2 space-x-3">
  <!-- Avatar Placeholder -->
  <div class="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300 text-center pt-2">
    ${data.initials}
  </div>

  <!-- Message Placeholder -->
  <div class="bg-gray-300 p-3 rounded-r-lg rounded-bl-lg">
    <div class="animate-pulse flex justify-center items-center space-x-1 h-full">
      <div class="rounded-full bg-gray-400 h-2 w-2"></div>
      <div class="rounded-full bg-gray-400 h-2 w-2"></div>
      <div class="rounded-full bg-gray-400 h-2 w-2"></div>
    </div>
  </div>
</div>
`;
  }

  scrollToBottom();
}

// add Event Listener
if (chatOpenElement) {
  // console.log("Button found!");
  chatOpenElement.onclick = function (e) {
    e.preventDefault();
    // console.log("hello");
    chatIconElement.classList.add("hidden");
    chatWelcomeElement.classList.remove("hidden");

    return false;
  };
} else {
  // console.log("Button not found.");
}

if (chatCloseElement) {
  chatCloseElement.onclick = function (e) {
    e.preventDefault();
    console.log("Button found!");
    chatWelcomeElement.classList.add("hidden");
    chatIconElement.classList.remove("hidden");

    return false;
  };
} else {
  console.log("Button not found.");
}

if (chatJoinElement) {
  // console.log("Button found!");
  chatJoinElement.onclick = function (e) {
    e.preventDefault();
    // console.log("hello");
    chatWelcomeElement.classList.add("hidden");
    chatRoomElement.classList.remove("hidden");

    joinChatRoom();

    return false;
  };
} else {
  // console.log("Button not found.");
}

if (chatSubmitElement) {
  chatSubmitElement.onclick = function (e) {
    e.preventDefault();
    if (chatInputElement.value.trim() === "") {
      chatSubmitElement.disabled = true;
      return false;
    }
    sendMessage();
    return false;
  };
} else {
  // console.log("Button not found.");
}

if (chatInputElement) {
  chatInputElement.onfocus = function (e) {
    e.preventDefault();

    chatSubmitElement.disabled = false;
    return false;
  };
} else {
  // console.log("Button not found.");
}

if (chatInputElement) {
  chatInputElement.onkeyup = function (e) {
    if (e.keyCode !== 13 || chatInputElement.value.trim() === "") {
      chatSubmitElement.disabled = true;

      return false;
    }
    sendMessage();
  };
} else {
  // console.log("Button not found.");
}

if (chatInputElement) {
  chatInputElement.oninput = function () {
    if (chatInputElement.value.trim().length > 0) {
      chatSocket.send(
        JSON.stringify({
          type: "update",
          message: "writing_active",
          name: chatName,
        })
      );
    }
  };
} else {
  // console.log("Input element not found.");
}
