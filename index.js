var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
    console.log('a user connected');
    io.emit('broadcast', 'a user connected!');
    socket.on('disconnect', function() {
        console.log('a user disconnect');
    })
    socket.on('chat message', function(msg) {
        io.emit('show message', msg);
        console.log('message:' + msg);
    });

});

http.listen(3000, function() {
    console.log('listening on *:3000');
});
