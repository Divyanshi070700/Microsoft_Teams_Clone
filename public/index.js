// import helpers from './helpers.js';

const socket = io('/');
const peer = new Peer();
let myVideoStream;
let myId;
var videoGrid = document.getElementById('video-grid')
var myvideo = document.createElement('video');


// start of new
const showChat = document.querySelector("#showChat");
const backBtn = document.querySelector(".header__back"); 
// end of news

myvideo.muted = true;

const user = prompt("Enter your name");  //added
//start of news
backBtn.addEventListener("click", () => {
  document.querySelector(".main__left").style.display = "flex";
  document.querySelector(".main__left").style.flex = "1";
  document.querySelector(".main__right").style.display = "none";
  document.querySelector(".header__back").style.display = "none";
});

showChat.addEventListener("click", () => {
  document.querySelector(".main__right").style.display = "flex";
  document.querySelector(".main__right").style.flex = "1";
  document.querySelector(".main__left").style.display = "none";
  document.querySelector(".header__back").style.display = "block";
});
//end of news

const peerConnections = {}
navigator.mediaDevices.getUserMedia({
  video:true,
  audio:true
}).then((stream)=>{
  myVideoStream = stream;
  addVideo(myvideo , stream);
  peer.on('call' , (call)=>{
    call.answer(stream);
      const vid = document.createElement('video');
    call.on('stream' , (userStream) =>{
      addVideo(vid , userStream);
    });
    call.on('error' , (err)=>{
      alert(err)
    });
  });
}).catch(err=>{
    alert(err.message)
});
peer.on('open' , (id)=>{
  myId = id;
  socket.emit("newUser" , id , roomID);
})
peer.on('error' , (err)=>{
  alert(err.type);
});


socket.on('userJoined' , id=>{
  console.log("new user joined")
  const call  = peer.call(id , myVideoStream);
  const vid = document.createElement('video');
  call.on('error' , (err)=>{
    alert(err);
  })
  call.on('stream' , userStream=>{
    addVideo(vid , userStream);
  })
  call.on('close' , ()=>{
    vid.remove();
    console.log("user disconect")
  })
  peerConnections[id] = call;
});


socket.on('userDisconnect' , id=>{
  if(peerConnections[id]){
    peerConnections[id].close();
  }
});


function addVideo(video , stream){
  video.srcObject = stream;
  video.addEventListener('loadedmetadata', () => {
    video.play();
  })
  videoGrid.append(video);
};




// adding new things
let text = document.querySelector("#chat_message");
let send = document.getElementById("send");
let messages = document.querySelector(".messages");

send.addEventListener("click", (e) => {
  if (text.value.length !== 0) {
    socket.emit("message", text.value);
    text.value = "";
  }
});

text.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && text.value.length !== 0) {
    socket.emit("message", text.value);
    text.value = "";
  }
});


// added for chats start
// addChat( data, senderType ) {
//   let chatMsgDiv = document.querySelector( '#chat-messages' );
//   let contentAlign = 'justify-content-end';
//   let senderName = 'You';
//   let msgBg = 'bg-white';

//   if ( senderType === 'remote' ) {
//       contentAlign = 'justify-content-start';
//       senderName = data.sender;
//       msgBg = '';

//       this.toggleChatNotificationBadge();
//   }

//   let infoDiv = document.createElement( 'div' );
//   infoDiv.className = 'sender-info';
//   infoDiv.innerHTML = `${ senderName } - ${ moment().format( 'Do MMMM, YYYY h:mm a' ) }`;

//   let colDiv = document.createElement( 'div' );
//   colDiv.className = `col-10 card chat-card msg ${ msgBg }`;
//   colDiv.innerHTML = xssFilters.inHTMLData( data.msg ).autoLink( { target: "_blank", rel: "nofollow"});

//   let rowDiv = document.createElement( 'div' );
//   rowDiv.className = `row ${ contentAlign } mb-2`;


//   colDiv.appendChild( infoDiv );
//   rowDiv.appendChild( colDiv );

//   chatMsgDiv.appendChild( rowDiv );

//   /**
//    * Move focus to the newly added message but only if:
//    * 1. Page has focus
//    * 2. User has not moved scrollbar upward. This is to prevent moving the scroll position if user is reading previous messages.
//    */
//   if ( this.pageHasFocus ) {
//       rowDiv.scrollIntoView();
//   }
// };
// added for chat ends

const inviteButton = document.querySelector("#inviteButton");
const muteButton = document.querySelector("#muteButton");
const stopVideo = document.querySelector("#stopVideo");

//new added
// const exitRoom = document.querySelector('#exitRoom');
// exitRoom.addEventListener("click", () => {
//   // process.exit(1);
//   prompt("LEAVE BUTTON PRESSED");
// });
//new added ends

muteButton.addEventListener("click", () => {
  const enabled = myVideoStream.getAudioTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getAudioTracks()[0].enabled = false;
    html = `<i class="fas fa-microphone-slash"></i>`;
    muteButton.classList.toggle("background__red");
    muteButton.innerHTML = html;
  } else {
    myVideoStream.getAudioTracks()[0].enabled = true;
    html = `<i class="fas fa-microphone"></i>`;
    muteButton.classList.toggle("background__red");
    muteButton.innerHTML = html;
  }
});

stopVideo.addEventListener("click", () => {
  const enabled = myVideoStream.getVideoTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getVideoTracks()[0].enabled = false;
    html = `<i class="fas fa-video-slash"></i>`;
    stopVideo.classList.toggle("background__red");
    stopVideo.innerHTML = html;
  } else {
    myVideoStream.getVideoTracks()[0].enabled = true;
    html = `<i class="fas fa-video"></i>`;
    stopVideo.classList.toggle("background__red");
    stopVideo.innerHTML = html;
  }
});

inviteButton.addEventListener("click", (e) => {
  prompt(
    "Copy this link and send it to people you want to meet with",
    window.location.href
  );
});

socket.on("createMessage", (message, userName) => {
  messages.innerHTML =
    messages.innerHTML +
    `<div class="message">
        <b><i class="far fa-user-circle"></i> <span> ${
          userName === user ? "me" : userName
        }</span> </b>
        <span>${message}</span>
    </div>`;
});
