var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.use(express.static(__dirname + '/public'));

http.listen(3000, function() {
    console.log('server begin...3000');
});

var onlineUsers = {};
var onlineNum = 0;

io.on('connection', function(socket) {
    console.log('user connected');
    socket.broadcast.emit('broadcast', "user connected");

    socket.on('clinet_chat_message', function(msg) {
        console.log(msg);
        io.emit('server_chat_message', msg);
    });
})
