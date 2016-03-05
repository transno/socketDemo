var Chatroom = {
    username: null,
    userid: null,
    socket: null,
    userNameSubmit: function() {
        var username = $('#userNameInput').val();
        if (username == '') {
            alert('请输入用户名！');
            return;
        }
        $('.loginCon').hide();
        this.init(username);
        return false;
    },
    giveUid: function() {
        return new Date().getTime() + '' + Math.floor(Math.random() * 1000);
    },
    init: function(username) {
        this.userid = this.giveUid();
        this.username = username;

        this.socket = io();

        // 发送登录信息
        this.socket.emit('login', { userid: this.userid, username: this.username });

        // 接收登录信息
        this.socket.on('logined', function(msg) {
            // var user = msg.onlineUsers.
            // console.log(msg);
            $('#loginUser').html('欢迎' + msg.user.username);
            $('#onlineNum').html('在线用户：' + msg.onlineNum + '人');
        });

        // 接收退出信息
        this.socket.on('logout', function(msg) {
            console.log(msg);
            $('#logoutUser').html(msg.user + '退出！');
            $('#onlineNum').html('在线用户：' + msg.onlineNum + '人');
        });
    }
}

$('form').submit(function() {
    socket.emit('clinet_chat_message', $('#m').val());
    $('#m').val('');
    return false;
});
