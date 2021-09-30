// Node server for socket io connections
const io = require("socket.io")(8000,{
    cors:{
        origin: "*",
    }
});

const users = {};

io.on('connection', socket => {
    // If any new user joins, let users know who joined
    socket.on('new-user-joined', name => {
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });
// If anyone sends a message , broadcast it to other people
    socket.on('send', message => {
        socket.broadcast.emit('receive', {message: message, name: users[socket.id]})
    });
// if anyone leaves the chat, let others know
    socket.on('disconnect', message => {
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    });
})