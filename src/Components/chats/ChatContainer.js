import React, { Component } from "react"
import Sidebar from "../layout/Sidebar"
import {
  MESSAGE_SENT,
  TYPING,
  COMMUNITY_CHAT,
  MESSAGE_RECIEVED,
  USER_CONNECTED,
  USER_DISCONNECTED
} from "./../../Events"
import ChatHead from "../chats/ChatHead"
import Messages from "../Messages/Messages"
import MessagesInput from "../Messages/MessagesInput"
import { values } from "lodash"

export default class ChatContainer extends Component {
  constructor(props) {
    super(props)

    this.state = {
      chats: [],
      users: [],
      activeChat: null
    }
  }

  componentDidMount() {
    const { socket } = this.props
    this.initSocket(socket)
  }

  initSocket(socket) {
    socket.emit(COMMUNITY_CHAT, this.resetChat)
    socket.on(USER_CONNECTED, users => {
      this.setState({ users: values(users) })
    })

    socket.on(USER_DISCONNECTED, users => {
      this.setState({ users: values(users) })
    })
  }

  resetChat = chat => {
    return this.addChat(chat, true)
  }

  addChat = (chat, reset) => {
    const { socket } = this.props
    const { chats } = this.state

    const newChats = reset ? [chat] : [...chats, chat]
    this.setState({
      chats: newChats,
      activeChat: reset ? chat : this.state.activeChat
    })

    const messageEvent = `${MESSAGE_RECIEVED} - ${chat.id}`
    const typingEvent = `${TYPING} - ${chat.id}`

    socket.on(typingEvent, this.updateTypingInChat(chat.id))
    socket.on(messageEvent, this.addMessageToChat(chat.id))
  }

  addMessageToChat = chatId => {
    return message => {
      const { chats } = this.state
      let newChats = chats.map(chat => {
        if (chat.id === chatId) chat.messages.push(message)
        return chat
      })

      this.setState({ chats: newChats })
    }
  }

  updateTypingInChat = chatId => {
    return ({ isTyping, user }) => {
      if (user !== this.props.user.name) {
        const { chats } = this.state

        let newChats = chats.map(chat => {
          if (chat.id === chatId) {
            if (isTyping && !chat.typingUsers.includes(user)) {
              chat.typingUsers.push(user)
            } else if (!isTyping && chat.typingUsers.includes(user)) {
              chat.typingUsers = chat.typingUsers.filter(u => u !== user)
            }
          }
          return chat
        })
        this.setState({ chats: newChats })
      }
    }
  }

  sendMessage = (chatId, message) => {
    const { socket } = this.props

    socket.emit(MESSAGE_SENT, { chatId, message })
  }

  sendTyping = (chatId, isTyping) => {
    const { socket } = this.props
    socket.emit(TYPING, { chatId, isTyping })
  }

  setActiveChat = activeChat => {
    this.setState({ activeChat })
  }

  render() {
    const { user, logout } = this.props
    const { activeChat, chats, users } = this.state

    return (
      <div className="chat-container">
        <Sidebar
          logout={logout}
          chats={chats}
          user={user}
          users={users}
          activeChat={activeChat}
          setActiveChat={this.setActiveChat}
        />
        <div className="chat-room-container">
          {activeChat !== null ? (
            <div className="chat-room">
              <ChatHead name={activeChat.name} />
              <Messages
                messages={activeChat.messages}
                user={user}
                typingUsers={activeChat.typingUsers}
              />
              <MessagesInput
                sendMessage={message => {
                  this.sendMessage(activeChat.id, message)
                }}
                sendTyping={isTyping => {
                  this.sendTyping(activeChat.id, isTyping)
                }}
              />
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    )
  }
}
