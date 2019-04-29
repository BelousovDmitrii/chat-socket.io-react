import React, { Component } from "react"
import { VERIFY_USER } from "../Events"

export default class LoginForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
      name: "",
      error: ""
    }
  }

  setUser = ({ user, isUser }) => {
    if (isUser) {
      this.setError("Имя пользователя занято")
    } else {
      this.setError("")
      this.props.setUser(user)
    }
  }

  handleSubmit = e => {
    const { socket } = this.props
    const { name } = this.state
    socket.emit(VERIFY_USER, name, this.setUser)

    e.preventDefault()
  }

  setError = error => {
    this.setState({ error })
  }

  handleChange = e => {
    this.setState({ name: e.target.value })
  }

  render() {
    const { name, error } = this.state
    return (
      <div className="login">
        <form onSubmit={this.handleSubmit} className="login-form">
          <label htmlFor="name">
            <h2>Введите имя</h2>
          </label>
          <input
            ref={input => {
              this.textInput = input
            }}
            type="text"
            id="name"
            value={name}
            onChange={this.handleChange}
            placeholder="Имя"
          />
          <div className="error">{error ? error : null}</div>
        </form>
      </div>
    )
  }
}
