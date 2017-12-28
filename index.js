var rp = require("rpio");
var app = require('http').createServer(handler);
var io = require('socket.io')(app);

app.listen(8000);	

rp.open(16, rp.OUTPUT,rp.HIGH);
/*
while(true) 
{
	off(rp);
	rp.msleep(500);
	on(rp);
	rp.msleep(500);
}
*/
off(rp);

io.on('connection', socket => {
	console.log('got connection');
	
	socket.on('ON', () => on(rp));
	socket.on('OFF', () => off(rp));
});


function handler(req, res)
{
	
}

function on(rp)

{
	rp.write(16, rp.HIGH);
}

function off(rp)
{
	rp.write(16, rp.LOW);
}
