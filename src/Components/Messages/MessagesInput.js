import React, { Component } from "react"

export default class MessagesInput extends Component {
  constructor(props) {
    super(props)

    this.state = {
      message: "",
      isTyping: false
    }
  }

  sendMessage = () => {
    this.props.sendMessage(this.state.message)
  }

  handleSubmit = e => {
    e.preventDefault()
    this.sendMessage()
    this.setState({ message: "" })
  }

  componentWillUnmount() {
    this.stopCheckingTyping()
  }

  sendTyping = () => {
    this.lastUpdateTime = Date.now()
    if (!this.state.isTyping) {
      this.setState({ isTyping: true })
      this.props.sendTyping(true)
      this.startCheckingTyping()
    }
  }

  startCheckingTyping = () => {
    console.log("Typing")
    this.typingInterval = setInterval(() => {
      if (Date.now() - this.lastUpdateTime > 300) {
        this.setState({ isTyping: false })
        this.stopCheckingTyping()
      }
    }, 300)
  }

  stopCheckingTyping = () => {
    console.log("Stop Typing")
    if (this.typingInterval) {
      clearInterval(this.typingInterval)
      this.props.sendTyping(false)
    }
  }

  render() {
    const { message } = this.state

    return (
      <div className="message-input">
        <form className="message-form" onSubmit={this.handleSubmit}>
          <input
            id="message"
            ref={"message-input"}
            type="text"
            placeholder="Введите сообщение"
            value={message}
            className="input"
            autoComplete={"off"}
            onKeyUp={e => {
              e.keyCode !== 13 && this.sendTyping()
            }}
            onChange={e => {
              this.setState({ message: e.target.value })
            }}
          />

          <button
            type="submit"
            className="submit"
            disabled={message.length < 1}
          >
            Отправить
          </button>
        </form>
      </div>
    )
  }
}
