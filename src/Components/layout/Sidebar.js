import React, { Component } from "react"

export default class Sidebar extends Component {
  render() {
    const { chats, activeChat, users, user, setActiveChat, logout } = this.props

    return (
      <aside className="sidebar">
        <div className="sidebar__block">
          {/* <div className="add-chat">
            <input type="text" placeholder="Создай свой чат" />
          </div> */}
          <div className="chat-list">
            {chats.map(chat => {
              if (chat.name) {
                const lastMessage = chat.messages[chat.messages.length - 1]
                const user = chat.users.find(({ name }) => {
                  return name !== this.props.name
                }) || { name: "Общий чат" }
                const classNames =
                  activeChat && activeChat.id === chat.id ? "active" : ""
                return (
                  <div
                    key={chat.id}
                    className={`chat-item ${classNames}`}
                    onClick={() => {
                      setActiveChat(chat)
                    }}
                  >
                    <div className="chat-item__name">{user.name}</div>
                    {lastMessage && (
                      <div className="chat-item__last-message">
                        {lastMessage.sender}: {lastMessage.message}
                      </div>
                    )}
                  </div>
                )
              }

              return null
            })}
          </div>
          <div className="user-list">
            {users.map(user => {
              return (
                <div key={user.id} className="user-item">
                  {user.name}
                </div>
              )
            })}
          </div>
        </div>
        <div className="sidebar__block">
          <div className="user">
            <div className="user__name">{user.name}</div>
            <div
              className="logout"
              onClick={() => {
                logout()
              }}
              title="Выйти"
            >
              Выйти
            </div>
          </div>
        </div>
      </aside>
    )
  }
}
