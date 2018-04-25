const rp = require("rpio");
const app = require('http').createServer(handler);
const io = require('socket.io')(app);
const fs = require('fs');
const url = require('url');

const LEFT_POS = 11;
const LEFT_NEG = 13;
const RIGHT_POS = 29;
const RIGHT_NEG = 31;


const ALL_PINS = [
	LEFT_POS,
	LEFT_NEG,
	RIGHT_POS,
	RIGHT_NEG,
];
const ALL_POS = [
	LEFT_POS,
	RIGHT_POS,
];
const ALL_NEG = [
	LEFT_NEG,
	RIGHT_NEG,
];

const initPin = pin => rp.open(pin, rp.OUTPUT, rp.LOW);

const initPins = () => ALL_PINS.forEach(initPin);

const pinOff = pin => {
	console.log('Turning OFF pin: ' + pin);
	rp.write(pin, rp.LOW)
};

const pinOn = pin => {
	console.log('Turning ON pin: ' + pin);
	rp.write(pin, rp.HIGH);
};

const allOff = () => ALL_PINS.forEach(pinOff);

const goForward = () => {
	allOff();
	ALL_POS.forEach(pinOn);
};

const goBackwards = () => {
	allOff();
	ALL_NEG.forEach(pinOn);
};

const goLeft = () => {
	allOff();
	pinOn(LEFT_NEG);
	pinOn(RIGHT_POS);
};

const goRight = () => {
	allOff();
	pinOn(RIGHT_NEG);
	pinOn(LEFT_POS);
};

app.listen(8000);

initPins();

io.on('connection', socket => {
	console.log('got connection');
	
	socket.on('OFF', () => {
		allOff();
	});
	
	socket.on('FORWARD', goForward);
	socket.on('BACK', goBackwards);
	socket.on('LEFT', goLeft);
	socket.on('RIGHT', goRight);
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
