const socket = io('/');
const videoGrid = document.getElementById('video-grid')
const myVideo = document.createElement('video');
myVideo.muted = true


var myPeer = new Peer(undefined, {
    path: '/peerjs',
    host: '/',
    port: '3030'
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
    let newvideo = document.createElement('video')
    call.on('stream', userVideoStream => {
        console.log(userVideoStream)
        addVideoStream(newvideo, userVideoStream)
    })
}


const addVideoStream = (video, stream) => {

    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        video.play()
    })
    videoGrid.append(video)

};




