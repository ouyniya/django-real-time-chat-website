let chatName = "";
let chatSocket = null;
let chatWindowURL = window.location.href;
let chatRoomUuid = Math.random().toString(36).slice(2, 12);

console.log("chatid", chatRoomUuid);

// elements

const chatElement = document.querySelector("#chat");
const chatJoinElement = document.querySelector("#chat_join");
const chatRoomElement = document.querySelector("#chat_room");
const chatIconElement = document.querySelector("#chat_icon");
const chatOpenElement = document.querySelector("#chat_open");
const chatWelcomeElement = document.querySelector("#chat_welcome");
const chatNameElement = document.querySelector("#chat_name");
const chatLogElement = document.querySelector("#chat_log");
const chatSubmitElement = document.querySelector("#chat_message_submit");
const chatInputElement = document.querySelector("#chat_message_input");

// function
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
  };

  chatSocket.onopen = function (e) {
    console.log("onOpen - chat socket was opened");
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
  console.log("Button not found.");
}

if (chatSubmitElement) {
  chatSubmitElement.onclick = function (e) {
    e.preventDefault();
    sendMessage();
    return false;
  };
} else {
  console.log("Button not found.");
}
