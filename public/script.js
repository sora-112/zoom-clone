
const socket = io('/');
const videoGrid = document.getElementById('video-grid')
const myVideo = document.createElement('video');
myVideo.muted = true


var myPeer = new Peer(undefined, {
    path: '/peerjs',
    host: '/',
    port: '443'
})
myPeer.on('open', id => {
    socket.emit('join-room', ROOM_ID, id)
})

let myVideoStream;
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
    myVideoStream = stream
    addVideoStream(myVideo, stream)
    myPeer.on('call', call => {
        call.answer(stream)
        const video = document.createElement('video')
        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream)
        })
    })
    socket.on('user-connected', userId => {
        console.log(userId)
        connectToNewUser(userId, stream)
    })

})




const connectToNewUser = (userId, stream) => {
    const call = myPeer.call(userId, stream)
    const Video = document.createElement('video')
    call.on('stream', userVideoStream => {
        addVideoStream(Video, userVideoStream)
    })
}


const addVideoStream = (video, stream) => {

    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        video.play()
    })
    videoGrid.append(video)

};

let text = $('input')

$('html').keydown((e) => {
    if (e.which == 13 && text.val().length !== 0) {
        socket.emit('message', text.val());
        text.val('')
    }
})



socket.on('createMessage', message => {
    console.log(message)
    $('ul.messages').append(`<li class="message"><b>user</b><br/>${message}</li>`)
    scrollBottom()
})


const scrollBottom = () => {
    var d = $('.main__chat__window');
    d.scrollTop(d.prop("scrollHeight"));

}

//Mute our video
const muteUnmute = () => {
    const enabled = myVideoStream.getAudioTracks()[0].enabled;
    if (enabled) {
        myVideoStream.getAudioTracks()[0].enabled = false;
        setUnmuteButton();
    } else {
        setMuteButton()
        myVideoStream.getAudioTracks()[0].enabled = true;
    }
}

const playStop = () => {
    console.log('object')
    let enabled = myVideoStream.getVideoTracks()[0].enabled;
    if (enabled) {
        myVideoStream.getVideoTracks()[0].enabled = false;
        setPlayVideo()
    } else {
        setStopVideo()
        myVideoStream.getVideoTracks()[0].enabled = true;
    }
}

const setMuteButton = () => {
    const html = `
      <i class="fas fa-microphone"></i>
      <span>Mute</span>
    `
    document.querySelector('.main__mute__button').innerHTML = html;
}

const setUnmuteButton = () => {
    const html = `
      <i class="unmute fas fa-microphone-slash"></i>
      <span>Unmute</span>
    `
    document.querySelector('.main__mute__button').innerHTML = html;
}

const setStopVideo = () => {
    const html = `
      <i class="fas fa-video"></i>
      <span>Stop Video</span>
    `
    document.querySelector('.main__video__button').innerHTML = html;
}

const setPlayVideo = () => {
    const html = `
    <i class="stop fas fa-video-slash"></i>
      <span>Play Video</span>
    `
    document.querySelector('.main__video__button').innerHTML = html;
}