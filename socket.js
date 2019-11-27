const http = require("http");

const crypto = require("crypto");

var server = http.createServer();



server.on("upgrade",function(req,socket)
{
    var respHeader = crypto.createHash('sha1').update(req.headers["sec-websocket-key"]+"258EAFA5-E914-47DA-95CA-C5AB0DC85B11").digest('base64');

    var response = "HTTP/1.1 101 Switching Protocols\r\nConnection: Upgrade\r\nUpgrade: websocket\r\nSec-WebSocket-Accept: "+respHeader+"\r\n\r\n"; 

    socket.write(response);

    var totalBuffer = [];

    socket.on("data",function(buffer)
    {
        parseMessage(buffer, totalBuffer, socket)
    });

    socket.on("error",function(err)
    {
        console.log(err);
    })
});

function parseMessage(buffer, totalBuffer, socket)
{
    var firstByte = buffer[0];

    var fin = (firstByte & 0x80) >>> 7;

    var opcode = firstByte & 0x0f;

    var payloadType;
    
    switch (opcode) {
        case 0x0:
            payloadType = 'continuation';
            break;
        case 0x1:
            payloadType = 'text';
            break;
        case 0x2:
            payloadType = 'binary';
            break;
        case 0x8:
            payloadType = 'connection close';
            break;
        case 0x9:
            payloadType = 'ping';
            break;
        case 0xA:
            payloadType = 'pong';
            break;
        default:
            payloadType = 'reserved for non-control';
    }

    var secondByte = buffer[1];

    var payloadLength = (secondByte & 0x7f);

    if(payloadLength == 126)
	{
		masks = buffer.slice(4, 8);
		data = buffer.slice(8);
	}
	else if(payloadLength == 127)
	{
        masks = buffer.slice(10, 14);
        data = buffer.slice(14);
	}
	else
	{
        masks = buffer.slice(2, 6);
        data = buffer.slice(6);
    }

    var text = "";

    for (var i = 0; i < data.length; i++) {
        text += String.fromCharCode(data[i] ^ masks[i % 4]);
    }

    fs.writeFileSync("sample.txt", text);

    var message = "sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep1234568sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep1234568sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep1234568sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep1234568sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep1234568sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep1234568sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep1234568sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep1234568religaresudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep1234568sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep1234568sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep1234568sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep1234568sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep1234568sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep1234568sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep1234568sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep1234568religare";
    
    // message = "sudeep123456sudeep123456sudeep123456sudeep123456sudeep123456sudeep1"

    var messageSize = message.length;

    var header = [];
    var sendData = [];

    var b1 =  0x80 | (0x1 & 0x0f);

    header[0] = b1;

    if(messageSize <= 125)
	{
        header[1] = messageSize;
	}
	else if(messageSize > 125 && messageSize < 65536)
	{
        header[1] = 126;
        header[2] = (messageSize >> 8) & 255;
        header[3] = (messageSize) & 255;
	}
	else if(messageSize >= 65536)
	{
        header[1] = 127;
        header[2] = ( messageSize >> 56 ) & 255
        header[3] = ( messageSize >> 48 ) & 255
        header[4] = ( messageSize >> 40 ) & 255
        header[5] = ( messageSize >> 32 ) & 255
        header[6] = ( messageSize >> 24 ) & 255
        header[7] = ( messageSize >> 16 ) & 255
        header[8] = ( messageSize >>  8 ) & 255
        header[9] = ( messageSize       ) & 255
    }

    for(var i=0;i<messageSize;i++)
    {
        sendData[i] = message.charCodeAt(i); 
    }

    var arr = header.concat(sendData);

    console.log(header);

    var body = Buffer.from(arr);

    socket.write(body);
}

server.listen(9100);