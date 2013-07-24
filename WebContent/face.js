function dataURItoBlob(dataURI) {
	var binary = atob(dataURI.split(',')[1]);
	var array = [];
	for ( var i = 0; i < binary.length; i++) {
		array.push(binary.charCodeAt(i));
	}
	return new Blob([ new Uint8Array(array) ], {
		type : 'image/jpeg'
	});
}

video = document.getElementById("live")
var ws = new WebSocket("ws://127.0.0.1:9999");
ws.onopen = function() {
	console.log("Openened connection to websocket");
}
// use the chrome specific GetUserMedia function
navigator.webkitGetUserMedia({
	audio : true,
	video : true
}, function(stream) {
	video.src = webkitURL.createObjectURL(stream);
}, function(err) {
	console.log("Unable to get video stream!")
})

var video = $("#live").get()[0];
var canvas = $("#canvas");
var ctx = canvas.get()[0].getContext('2d');

timer = setInterval(function() {
	ctx.drawImage(video, 0, 0, 600, 600);
	var data = canvas.get()[0].toDataURL('image/jpeg', 1.0);
	newblob = dataURItoBlob(data);
	ws.send(newblob);
}, 250);

ws.onmessage = function(msg) {
	var target = document.getElementById("target");
	url = window.webkitURL.createObjectURL(msg.data);

	target.onload = function() {
		window.webkitURL.revokeObjectURL(url);
	};
	target.src = url;
}
