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
app.use('/peerjs', peer); //PEERSERVER
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
  //WHEN NEW USER CONNECTS
  socket.on('newUser', (id, room) => {
    console.log('New User')
    users[socket.id] = id
    socket.broadcast.emit('User-connected', id)
    socket.join(room);
    socket.to(room).broadcast.emit('userJoined', id);
  })
  //WHEN THERE IS A MESSAGE BY A USER
  socket.emit('chat-message', 'Hellouser')
  socket.on('send-chat-message', message => {
    socket.broadcast.emit('chat-message', { message: message, name: users[socket.id] })

  })

 //FOR SCREEN SHARING STARTS
 socket.on('share-screen',video => {
  socket.broadcast.emit('share-share', video)

})
//  socket.on("screen-data", function(data) {
//   data = JSON.parse(data);
//   var room = data.room;
//   var imgStr = data.image;
//   socket.broadcast.to(room).emit('screen-data', imgStr);
// })

  //WHEN A USER DISCONNECTS
  socket.on('disconnect', (id, room) => {
    console.log('User disconnected')
    socket.to(room).broadcast.emit('userDisconnect', id);
  })

})
