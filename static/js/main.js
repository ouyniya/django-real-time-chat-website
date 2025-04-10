
let chatName = ''
let chatSocket = null
let chatWindowURL = window.location.href
let chatRoomUuid = Math.random().toString(36).slice(2, 12)

console.log('chatid', chatRoomUuid)

// elements

const chatElement = document.querySelector("#chat");
const chatJoinElement = document.querySelector("#chat_join");
const chatRoomElement = document.querySelector("#chat_room");
const chatIconElement = document.querySelector("#chat_icon");
const chatOpenElement = document.querySelector("#chat_open");
const chatWelcomeElement = document.querySelector("#chat_welcome");

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

    return false;
  };
} else {
  console.log("Button not found.");
}
