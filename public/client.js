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
    sendMsg: function() {
        var msg = $('#m').val();
        if (msg != '') {
            var message = {
                userid: this.userid,
                msg: msg
            }
            this.socket.emit('clinet_chat_message', message);
        }
        return false;
    },
    init: function(username) {
        this.userid = this.giveUid();
        this.username = username;
        self.myHtml = this.myHtml();
        self.userid = this.userid;
        this.socket = io();

        // 发送登录信息
        this.socket.emit('login', { userid: this.userid, username: this.username });

        // 接收登录信息
        this.socket.on('logined', function(msg) {
            // console.log(msg);
            $('#chatCon').append('<div class="welcomeCon"><span>欢迎<b>' + msg.user.username + '</b>加入</span></div>');
            $('#onlineNum').html('在线用户：' + msg.onlineNum + '人');
        });

        // 接收退出信息
        this.socket.on('logout', function(msg) {
            $('#chatCon').append('<div class="welcomeCon"><span><b>' + msg.user + '</b>退出！</span></div>');
            $('#onlineNum').html('在线用户：' + msg.onlineNum + '人');
        });

        // 接收聊天信息
        this.socket.on('server_chat_message', function(msg) {      
            var messages = Chatroom.myHtml(msg.msg);
            console.log(msg.userid);
            console.log(self.userid);
            if (msg.userid == self.userid) {
            	console.log(msg);
                $('#chatCon').append(messages);
            }
            // $('#messages').append('<div class="chatLi">' + msg + '</div>');
        });
    },
    myHtml: function(msg) {
        var myHtml = '<div class="messageCon my clear">' +
            '<div class="img"></div>' +
            '<div class="messageBox clear">' +
            '<div class="info">' + msg + '</div>' +
            '</div>' +
            '</div>';
        return myHtml;
    }
}

$('form').submit(function() {
    Chatroom.sendMsg();
    $('#m').val('');
    return false;
});

$(function() {
    var h = $(window).height();
    $('body').css('min-height', h);
})
