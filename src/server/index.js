var app = require("http").createServer()
var io = (module.exports.io = require("socket.io")(app))

const PORT = process.env.PORT || 3231

const socketIo = require("./socket-io")

io.on("connection", socketIo)

app.listen(PORT, () => {
  console.log("Сервер запущен на порту" + PORT)
})
