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
                username: this.username,
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
            var myMessages = Chatroom.myHtml(msg.msg, msg.username);
            var otherMessages = Chatroom.otherHtml(msg.msg, msg.username);
            if (msg.userid == self.userid) {
                $('#chatCon').append(myMessages);
            } else {
                $('#chatCon').append(otherMessages);
            }
        });
    },
    myHtml: function(msg, username) {
        var myHtml = '<div class="messageCon my">' +
            			'<div class="username">' + username + '</div>' +
            			'<div class="clear">' +
            				'<div class="img"></div>' +
            				'<div class="messageBox clear">' +
            					'<div class="info">' + msg + '</div>' +
            				'</div>' +
            			'</div>' +
            		'</div>';
        return myHtml;
    },
    otherHtml: function(msg, username) {
        var myHtml = '<div class="messageCon other">' +
            '<div class="username">' + username + '</div>' +
            '<div class="clear">' +
            '<div class="img"></div>' +
            '<div class="messageBox clear">' +
            '<div class="info">' + msg + '</div>' +
            '</div>' +
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