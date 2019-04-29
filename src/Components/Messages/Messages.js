import React, { Component } from "react"

export default class Messages extends Component {
  constructor(props) {
    super(props)

    this.scrollDown = this.scrollDown.bind(this)
  }
  scrollDown() {
    const { messages_container } = this.refs

    messages_container.scrollTop = messages_container.scrollHeight
  }

  componentDidMount() {
    this.scrollDown()
  }

  componentDidUpdate() {
    this.scrollDown()
  }

  render() {
    const { messages, user, typingUsers } = this.props

    return (
      <div className="messages">
        <div className="messages-list" ref="messages_container">
          {messages.map(mes => {
            return (
              <div
                key={mes.id}
                className={`message-item ${mes.sender === user.name &&
                  "right"}`}
              >
                <div className="message">
                  <div className="message__text">{mes.message}</div>
                  <div className="message__info">
                    <div className="message__sender">{mes.sender}</div>
                    <div className="message__time">{mes.time}</div>
                  </div>
                </div>
              </div>
            )
          })}
          {typingUsers.map(name => {
            return (
              <div key={name} className="typing-users">
                {`${name} пишет...`}
              </div>
            )
          })}
        </div>
      </div>
    )
  }
}
