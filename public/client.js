var Chatroom = {
    username: null,
    userid: null,
    socket: null,
    picurl: 1,
    userNameSubmit: function(username, id, pic) {
        if (localStorage.getItem('user')) {
            var userinfo = JSON.parse(localStorage.getItem('user'));
            username = userinfo.username;
            id = userinfo.userid;
            pic = userinfo.pic;
        } else {
            username = $('#userNameInput').val();
            id = this.giveUid();
            pic = this.getRandom();
            if (username == '') {
                alert('少侠，行走江湖来个响亮的名头吧！');
                return;
            }
            if (username.length > 10) {
                alert('少侠，哪国人啊，名头太响了不能在这混喔！');
                return;
            }
        }

        $('.loginCon').hide();
        this.init(username, id, pic);
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
                msg: msg,
                avatar: this.picurl
            }
            this.socket.emit('clinet_chat_message', message);
        }
        return false;
    },
    getRandom: function() {
        return Math.ceil(Math.random() * 30);
    },
    init: function(username, id, pic) {
        this.userid = id;
        this.username = username;
        this.picurl = pic;
        self.myHtml = this.myHtml();
        self.userid = this.userid;
        this.socket = io();

        // 发送登录信息
        var userInfo = {
            userid: this.userid,
            username: this.username,
            pic: this.picurl
        }
        this.socket.emit('login', userInfo);
        localStorage.setItem('user', JSON.stringify(userInfo));
        // 接收登录信息
        this.socket.on('logined', function(msg) {
            // console.log(msg);
            $('#chatCon').append('<div class="welcomeCon"><span><b>' + msg.user.username + '</b>初入江湖！</span></div>');
            $('#onlineNum').html('在线用户：' + msg.onlineNum + '人');
            var dh = $(document).height();
            $('body').animate({ scrollTop: dh }, 500);
        });

        // 接收退出信息
        this.socket.on('logout', function(msg) {
            $('#chatCon').append('<div class="welcomeCon"><span><b>' + msg.user + '</b>淡出江湖！</span></div>');
            $('#onlineNum').html('在线用户：' + msg.onlineNum + '人');
            var dh = $(document).height();
            $('body').animate({ scrollTop: dh }, 500);
        });

        // 接收聊天信息
        this.socket.on('server_chat_message', function(msg) {
            var myMessages = Chatroom.myHtml(msg.msg, msg.username, msg.avatar);
            var otherMessages = Chatroom.otherHtml(msg.msg, msg.username, msg.avatar);
            if (msg.userid == self.userid) {
                $('#chatCon').append(myMessages);
            } else {
                $('#chatCon').append(otherMessages);
            }
            var dh = $(document).height();
            $('body').animate({ scrollTop: dh }, 500);
        });
    },
    myHtml: function(msg, username, url) {
        var myHtml = '<div class="messageCon my">' +
            '<div class="username">' + username + '</div>' +
            '<div class="clear">' +
            '<div class="img" style="background-image:url(avatar/' + url + '.jpg)"></div>' +
            '<div class="messageBox clear">' +
            '<div class="info">' + msg + '</div>' +
            '</div>' +
            '</div>' +
            '</div>';
        return myHtml;
    },
    otherHtml: function(msg, username, url) {
        var myHtml = '<div class="messageCon other">' +
            '<div class="username">' + username + '</div>' +
            '<div class="clear">' +
            '<div class="img" style="background-image:url(avatar/' + url + '.jpg)"></div>' +
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

    $('#userNameInput').keydown(function(event) {
        // console.log(event);
        if (event.keyCode == 13) {
            Chatroom.userNameSubmit();
        }
    });

    if (localStorage.getItem('user')) {
        var userinfo = JSON.parse(localStorage.getItem('user'));
        $('.hasNameLogin').css('display', 'block');
        $('#oldBtn').find('i').css('background-image', 'url(avatar/' + userinfo.pic + '.jpg)');
        $('#oldBtn').find('p').text(userinfo.username);
    } else {
        $('.hasNameLogin').css('display', 'none');
        $('.firstLogin').css('display', 'block');
    }

    $('#oldBtn').click(function(event) {
        event.preventDefault();
        Chatroom.userNameSubmit();
    });

    $('#newBtn').click(function(event) {
        event.preventDefault();
        $('.hasNameLogin').css('display', 'none');
        $('.firstLogin').css('display', 'block');
        localStorage.removeItem('user');
    });
})
