const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 4000;
const {v4:uuidv4} = require('uuid');
const {ExpressPeerServer} = require('peer')
const peer = ExpressPeerServer(server , {
  debug:true
});
app.use('/peerjs', peer); //peerServer
app.set('view engine', 'ejs') 
app.use(express.static('public'));
app.get('/' , (req,res)=>{
  res.send(uuidv4());
  // res.send("WELCOME");
  // res.redirect(`/${uuidv4()}`);  //CHNGES
});
app.get( '/', ( req, res ) => {
  res.render( __dirname + '/views/index.ejs' );
} );
app.get('/:roomID' , (req,res)=>{
    res.render('index' , {RoomId:req.params.room});
});

server.listen(port , ()=>{
  console.log("Server running on port : " + port);
});
io.on("connection" , (socket)=>{
  socket.on('newUser' , (id , room)=>{
    socket.join(room);

    //test added
    // socket.to(room).emit('message', {      // Emits a status message to the connect room when a socket client is connected
      // type: 'status',
      // text: 'Is now connected',
      // created: Date.now(),
      // username: socket.request.user.username
    // });
    // socket.to(room).broadcast.emit('userJoined',{
    //   text:'User connected'
    // });
    //test added ends

    socket.to(room).broadcast.emit('userJoined' , id);
    socket.on('disconnect' , ()=>{
        socket.to(room).broadcast.emit('userDisconnect' , id);
    });
  });
});