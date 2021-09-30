const socket = io('http://localhost:8000');

//Get DOM elements in resp. js variables
const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector('.container');

// Audio that will play while receving messages
var audio = new Audio('sound.mp3')

// Function which will append event info to the container
const append = (message, position) => {
    const messageElement = document.createElement('div')
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if(position == 'left'){
        audio.play();
    }
}

// Ask new user for his/her name and let the server know
const name = prompt('Enter your name to join');
socket.emit('new-user-joined', name);

// If a new user joined, receive the name from the server
socket.on('user-joined', name => {
    append(`${name} joined the chat`, 'right')
});

//If server sends a message, receive and display it
socket.on('receive', data => {
    append(`${data.name}: ${data.message}`, 'left')
});

// If user leave the chat, append the info to the container
socket.on('left', data => {
    append(`${name} left the chat`, 'right')
});

//If the form gets submitted ,  send it to server
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    append(`You : ${message}`,'right');
    socket.emit('send', message);
    messageInput.value = ''
});