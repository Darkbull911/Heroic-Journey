var io = require('socket.io-client');

var socket = io('http://192.168.1.111:8000');

process.stdin.resume();
process.stdin.setEncoding('utf8');

process.stdin.on('data', (text) => {
    if (text === "w\n") {
        console.log('on');
        socket.emit('ON');
    }
    else if (text === "s\n") {
        console.log('off');
        socket.emit('OFF');
    }
});
