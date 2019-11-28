const WebSocket = require('ws');

const fs = require("fs");

const wss = new WebSocket.Server({ port: 9100 });

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {

    fs.appendFileSync("sample1.txt", message+"\r\n");
    console.log(message+"\r\n");
  });

//   ws.send('something');
});