(function(){

})();

var Chatroom = {
	userNameSubmit: function(){
		var username = $('#userNameInput').val();
		if (username == '') {
			alert('请输入用户名！');
		}
	}
}

var socket = io();

$('form').submit(function() {
    socket.emit('clinet_chat_message', $('#m').val());
    $('#m').val('');
    return false;
});

socket.on('broadcast', function(data){
	console.log(data);
	$('#messages').append($('<div class="broadcast"></div>').text(data));
});

socket.on('server_chat_message', function(msg){
	$('#messages').append($('<div class="chatLi"></div>').text(msg));
});

