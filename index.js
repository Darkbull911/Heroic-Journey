var rp = require("rpio");
var app = require('http').createServer(handler);
var io = require('socket.io')(app);
var fs = require('fs');
var url = require('url');

var FORWARD = 16
var BACK = 15
var LEFT = 18
var RIGHT = 22

app.listen(8000);

rp.open(FORWARD, rp.OUTPUT,rp.LOW);
rp.open(BACK, rp.OUTPUT,rp.LOW);
rp.open(LEFT, rp.OUTPUT,rp.LOW);
rp.open(RIGHT, rp.OUTPUT,rp.LOW);
/*
while(true)
{
	off(rp);
	rp.msleep(500);
	on(rp);
	rp.msleep(500);
}
*/
off(rp, FORWARD);


io.on('connection', socket => {
	console.log('got connection');
	
	socket.on('OFF', () => {
		off(rp, FORWARD);
		off(rp, BACK);
		off(rp, LEFT);
		off(rp, RIGHT);
	});
	
	socket.on('FORWARD', () => on(rp, FORWARD));
	socket.on('BACK', () => {
		console.log('yep');
		on(rp, BACK)
	});
	socket.on('LEFT', () => on(rp, LEFT));
	socket.on('RIGHT', () => on(rp, RIGHT));
});


function handler (req, res) {
	var parsedUrl = url.parse(req.url);
	var pathname = parsedUrl.pathname === '/'
		? '/index.html'
		: parsedUrl.pathname;

	fs.readFile(__dirname + '/public' + pathname,
		function (err, data) {
			if (err) {
				res.writeHead(500);
				return res.end('Error loading ' + pathname);
			}

			res.writeHead(200);
			res.end(data);
		});
}


function on(rp, pin)
{
	rp.write(pin, rp.HIGH);
}

function off(rp, pin)
{
	rp.write(pin, rp.LOW);
}
