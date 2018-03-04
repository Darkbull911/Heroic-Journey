const rp = require("rpio");
const app = require('http').createServer(handler);
const io = require('socket.io')(app);
const fs = require('fs');
const url = require('url');

const FRONT_LEFT_POS = 11;
const FRONT_LEFT_NEG = 13;
const FRONT_RIGHT_POS = 12;
const FRONT_RIGHT_NEG = 16;
const BACK_LEFT_POS = 19;
const BACK_LEFT_NEG = 21;
const BACK_RIGHT_POS = 22;
const BACK_RIGHT_NEG = 24;

const FRONT_LEFT = [FRONT_LEFT_POS, FRONT_LEFT_NEG];
const FRONT_RIGHT = [FRONT_RIGHT_POS, FRONT_RIGHT_NEG];
const BACK_LEFT = [BACK_LEFT_POS, BACK_LEFT_NEG];
const BACK_RIGHT = [BACK_RIGHT_POS, BACK_RIGHT_NEG];

const ALL_PINS = [
	...FRONT_LEFT,
	...FRONT_RIGHT,
	...BACK_LEFT,
	...BACK_RIGHT
];
const ALL_POS = [
	FRONT_LEFT[0],
	FRONT_RIGHT[0],
	BACK_LEFT[0],
	BACK_RIGHT[0]
];
const ALL_NEG = [
	FRONT_LEFT[1],
	FRONT_RIGHT[1],
	BACK_LEFT[1],
	BACK_RIGHT[1]
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
	pinOn(FRONT_LEFT_NEG);
	pinOn(FRONT_RIGHT_POS);
	pinOn(BACK_LEFT_NEG);
	pinOn(BACK_RIGHT_POS);
};

const goRight = () => {
	allOff();
	pinOn(FRONT_LEFT_POS);
	pinOn(FRONT_RIGHT_NEG);
	pinOn(BACK_LEFT_POS);
	pinOn(BACK_RIGHT_NEG);
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
