const socket = io('/');
const peer = new Peer();
let myVideoStream;
let myId;
let currentPeer;
var videoGrid = document.getElementById('video-grid')
var myvideo = document.createElement('video');
const showChat = document.querySelector("#showChat");
const backBtn = document.querySelector(".header__back");
const inviteButton = document.querySelector("#inviteButton");
const muteButton = document.querySelector("#muteButton");
const stopVideo = document.querySelector("#stopVideo");

myvideo.muted = true;

//WHEN THE USER ENTERS THE ROOM
const user = prompt("Enter your name")

//FUNCTIONING OF BACK BUTTON OF CHAT
backBtn.addEventListener("click", () => {
  document.querySelector(".main__left").style.display = "flex";
  document.querySelector(".main__left").style.flex = "1";
  document.querySelector(".main__right").style.display = "none";
  document.querySelector(".header__back").style.display = "none";
});

//WHEN THE CHAT ICON IS CLICKED
showChat.addEventListener("click", () => {
  document.querySelector(".main__right").style.display = "flex";
  document.querySelector(".main__right").style.flex = "0.3";
  document.querySelector(".main__left").style.display = "flex";
  document.querySelector(".main__left").style.flex = "0.7";
  document.querySelector(".header__back").style.display = "block";
});

//WHEN STREAM STARTS
const peerConnections = {}
navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then((stream) => {
  myVideoStream = stream;
  addVideo(myvideo, stream);
  peer.on('call', (call) => {
    call.answer(stream);
    const vid = document.createElement('video');
    call.on('stream', (userStream) => {
      addVideo(vid, userStream);
      currentPeer = call.peerConnection
    });
    call.on('error', (err) => {
      alert(err)
    });
  });
}).catch(err => {
  alert(err.message)
});
peer.on('open', (id) => {
  myId = id;
  socket.emit("newUser", id, roomID);
})
peer.on('error', (err) => {
  alert(err.type);
});

//WHEN A USER JOINS THE ROOM
socket.on('userJoined', id => {
  console.log("new user joined")
  const call = peer.call(id, myVideoStream);
  const vid = document.createElement('video');
  call.on('error', (err) => {
    alert(err);
  })
  call.on('stream', userStream => {
    addVideo(vid, userStream);
    currentPeer = call.peerConnection
  })
  call.on('close', () => {
    vid.remove();
    console.log("user disconect")
  })
  peerConnections[id] = call;
});

//WHEN THE USER DISCONNECTS
socket.on('userDisconnect', id => {
  if (peerConnections[id]) {
    peerConnections[id].close();
  }
});

//ADDING VIDEO OF USER ON THE SCREEN
function addVideo(video, stream) {
  video.srcObject = stream;
  video.addEventListener('loadedmetadata', () => {
    video.play();
  })
  videoGrid.append(video);
};

//WHEN MUTE AUDIO ICON IS CLICKED
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

//WHEN MUTE VIDEO ICON IS CLICKED
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

//WHEN INVITE ICON IS CLICKED
inviteButton.addEventListener("click", (e) => {
  prompt(
    "Copy this link and send it to people you want to meet with",
    window.location.href
  );
});

//VARIABLES USED IN IMPLEMENTING CHAT
const messageContainer = document.getElementById('chatting')
const messageForm = document.getElementById('send-container')
const messageInput = document.getElementById('chat_message')
appendMessage('You Joined')

//WHEN A USER SENDS THE MESSAGE
socket.on('chat-message', (data) => {
  appendMessage(`Anonymous: ${data.message}`)
})

//WHEN THE USER CONNECTS
socket.on('User-connected', user => {
  appendMessage(`A new User connected`)
})

//WHEN THE USER DISCONNECTS
socket.on('userDisconnect', user => {
  appendMessage(`One User disconnected`)
})

// SEND MESSAGE 
messageForm.addEventListener("submit", (e) => {
  e.preventDefault()
  const message = messageInput.value
  appendMessage(`You: ${message}`)
  socket.emit('send-chat-message', message)
  messageInput.value = ''
})

//FUNCTION TO APPEND MESSAGE
function appendMessage(message) {
  const messageElement = document.createElement('div')
  messageElement.innerText = message
  messageContainer.append(messageElement)
}

//SCREEN SHARING IMPLMENTATION
const shareScreen = document.querySelector("#screenshare");
shareScreen.addEventListener('click', (e) => {
  navigator.mediaDevices.getDisplayMedia({
    video: {
      cursor: "always"
    }, audio: {
      echoCancellation: true,
      noiseSuppression: true
    }
  }).then((stream) => {
    let videoTrack = stream.getVideoTracks()[0];
    videoTrack.onended = function () {
      stopScreenShare();
    }
    let sender = currentPeer.getSenders().find(function (s) {
      return s.track.kind == videoTrack.kind
    })
    sender.replaceTrack(videoTrack)
  }).catch((err) => {
    console.log("unable to display media" + err)
  })
})

//STOP SCREEN SHARING
function stopScreenShare() {
  let videoTrack = myVideoStream.getVideoTracks()[0];
  var sender = currentPeer.getSenders().find(function (s) {
    return s.track.kind == videoTrack.kind;
  })
  sender.replaceTrack(videoTrack)
}


// RECORDING VIDEO OR SCREEN
var mediaRecorder = '';
var recordedStream = [];
var screen = '';

document.getElementById('closeModal').addEventListener('click', () => {
  toggleModal('recording-options-modal', false);
});

//SAVE THE RECORDED VIDEO
function saveRecordedStream(stream, user) {
  let blob = new Blob(stream, { type: 'video/webm' });
  let file = new File([blob], `${user}-record.webm`);
  saveAs(file);
}

function toggleModal(id, show) {
  let el = document.getElementById(id);

  if (show) {
    el.style.display = 'block';
    el.removeAttribute('aria-hidden');
  }

  else {
    el.style.display = 'none';
    el.setAttribute('aria-hidden', true);
  }
}

//WHEN RECORD BUTTON IS CLICKED
document.getElementById('record').addEventListener('click', (e) => {

  //ASK USER WHAT THEY WANT TO RECORD AND GET THE STREAM BASED ON SELECTION AND START RECORDING
  if (!mediaRecorder || mediaRecorder.state == 'inactive') {
    toggleModal('recording-options-modal', true);
  }
  else if (mediaRecorder.state == 'paused') {
    mediaRecorder.resume();
  }
  else if (mediaRecorder.state == 'recording') {
    mediaRecorder.stop();
  }
});

//FUNCTION SHARESCREEN TO HELP IN RECORDING SCREEN
function shareScreenhelp() {
  if (this.userMediaAvailable()) {
    return navigator.mediaDevices.getDisplayMedia({
      video: {
        cursor: "always"
      },
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        sampleRate: 44100
      }
    });
  }

  else {
    throw new Error('User media not available');
  }
}

//WHEN USER CHOOSES TO RECORD HIS SCREEN
document.getElementById('record-screen').addEventListener('click', () => {
  toggleModal('recording-options-modal', false);
  if (screen && screen.getVideoTracks().length) {
    startRecording(screenStream);
  }
  else {
    shareScreenhelp().then((screenStream) => {
      startRecording(screenStream);
    }).catch(() => { });
  }
});

//WHEN USER DECIDES TO RECORD HIS VIDEO
document.getElementById('record-video').addEventListener('click', () => {
  toggleModal('recording-options-modal', false);

  if (myVideoStream && myVideoStream.getTracks().length) {
    startRecording(myVideoStream);
  }

  else {
    getUserFullMedia().then((videoStream) => {
      startRecording(videoStream);
    }).catch(() => { });
  }
});

function userMediaAvailable() {
  return !!(navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
}

function getUserFullMedia() {
  if (this.userMediaAvailable()) {
    return navigator.mediaDevices.getUserMedia({
      video: true,
      audio: {
        echoCancellation: true,
        noiseSuppression: true
      }
    });
  }

  else {
    throw new Error('User media not available');
  }
}

// FUNCTION TO TOGGLE RECORDING OPTION 
function toggleRecordingIcons(isRecording) {
  let e = document.getElementById('record');

  if (isRecording) {
    e.setAttribute('title', 'Stop recording');
    e.children[0].classList.add('text-danger');
    e.children[0].classList.remove('text-white');
  }

  else {
    e.setAttribute('title', 'Record');
    e.children[0].classList.add('text-white');
    e.children[0].classList.remove('text-danger');
  }
}

//WHEN RECORDING STARTS
function startRecording(stream) {
  mediaRecorder = new MediaRecorder(stream, {
    mimeType: 'video/webm;codecs=vp9'
  });

  mediaRecorder.start(1000);
  toggleRecordingIcons(true);
  
  mediaRecorder.ondataavailable = function (e) {
    recordedStream.push(e.data);
  };

  mediaRecorder.onstop = function () {
    toggleRecordingIcons(false);

    saveRecordedStream(recordedStream, user);

    setTimeout(() => {
      recordedStream = [];
    }, 3000);
  };

  mediaRecorder.onerror = function (e) {
    console.error(e);
  };
}

















