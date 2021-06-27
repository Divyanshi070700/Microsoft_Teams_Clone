const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 4000;
const { v4: uuidv4 } = require('uuid');
const { ExpressPeerServer } = require('peer')
const peer = ExpressPeerServer(server, {
  debug: true
});
app.use('/peerjs', peer); //peerServer
app.set('view engine', 'ejs')
app.use(express.static('public'));
app.get('/', (req, res) => {
  res.send(uuidv4());
});
app.get('/:room', (req, res) => {
  res.render('index', { RoomId: req.params.room });
});

server.listen(port, () => {
  console.log("Server running on port : " + port);
});

const users = {}
io.on("connection", (socket) => {
  socket.on('newUser', (id, room) => {
    console.log('New User')
    users[socket.id] = id
    socket.broadcast.emit('User-connected', id)
    socket.join(room);
    socket.to(room).broadcast.emit('userJoined', id);
  })
  socket.emit('chat-message', 'Hellouser')
  socket.on('send-chat-message', message => {
    socket.broadcast.emit('chat-message', { message: message, name: users[socket.id] })

  })
  socket.on('disconnect', (id, room) => {
    console.log('User disconnected')
    socket.to(room).broadcast.emit('userDisconnect', id);
  })

})
