import React from "react"

export default function({ name }) {
  return (
    <div className="chat-room-head">
      <div className="chat-room-head__title">{name}</div>
    </div>
  )
}
