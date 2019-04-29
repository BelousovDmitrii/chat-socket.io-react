const io = require("./index.js").io
let connectedUsers = {}
const {
  VERIFY_USER,
  USER_CONNECTED,
  LOGOUT,
  COMMUNITY_CHAT,
  USER_DISCONNECTED,
  MESSAGE_RECIEVED,
  MESSAGE_SENT,
  TYPING
} = require("../Events")
const { createUser, createMessage, createChat } = require("../Creators")

var communityChat = createChat()

module.exports = function(socket) {
  console.log("Socket " + socket.id + " connected")
  let sendMessageToChatFromUser

  let sendTypingFromUser

  socket.on(VERIFY_USER, (name, callback) => {
    if (isUser(connectedUsers, name)) {
      callback({ isUser: true, user: null })
    } else {
      callback({
        isUser: false,
        user: createUser({ name: name, socketId: socket.id })
      })
    }
  })

  socket.on(USER_CONNECTED, user => {
    connectedUsers = addUser(connectedUsers, user)
    socket.user = user
    user.socketId = socket.id

    console.log(connectedUsers)

    sendMessageToChatFromUser = sendMessageToChat(user.name)
    sendTypingFromUser = sendTypingToChat(user.name)

    io.emit(USER_CONNECTED, connectedUsers)
  })

  socket.on("disconnect", () => {
    if ("user" in socket) {
      connectedUsers = removeUser(connectedUsers, socket.user.name)

      io.emit(USER_DISCONNECTED, connectedUsers)
    }
  })

  socket.on(LOGOUT, () => {
    connectedUsers = removeUser(connectedUsers, socket.user.name)
    io.emit(USER_DISCONNECTED, connectedUsers)
  })

  socket.on(COMMUNITY_CHAT, callback => {
    callback(communityChat)
  })

  socket.on(MESSAGE_SENT, ({ chatId, message }) => {
    sendMessageToChatFromUser(chatId, message)
  })

  socket.on(TYPING, ({ chatId, isTyping }) => {
    sendTypingFromUser(chatId, isTyping)
  })
}

function sendTypingToChat(user) {
  return (chatId, isTyping) => {
    io.emit(`${TYPING} - ${chatId}`, { user, isTyping })
  }
}

function addUser(userList, user) {
  let newList = Object.assign({}, userList)
  newList[user.name] = user

  return newList
}

function sendMessageToChat(sender) {
  return (chatId, message) => {
    io.emit(
      `${MESSAGE_RECIEVED} - ${chatId}`,
      createMessage({ message, sender })
    )
  }
}

function removeUser(userList, name) {
  let newList = Object.assign({}, userList)
  delete newList[name]
  return newList
}

function isUser(userList, name) {
  return name in userList
}
