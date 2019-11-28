const http = require("http");

const crypto = require("crypto");

var server = http.createServer();

const fs = require("fs");

const os = require("os");

console.log(os.endianness());

server.on("upgrade",function(req,socket)
{
    var respHeader = crypto.createHash('sha1').update(req.headers["sec-websocket-key"]+"258EAFA5-E914-47DA-95CA-C5AB0DC85B11").digest('base64');

    var response = "HTTP/1.1 101 Switching Protocols\r\nConnection: Upgrade\r\nUpgrade: websocket\r\nSec-WebSocket-Accept: "+respHeader+"\r\n\r\n"; 

    socket.write(response);

    var totalBuffer = [];

    var buff;

    socket.setNoDelay(true);

    socket.setKeepAlive(true);

    socket.setTimeout(120000);

    socket.on('timeout', () => {
      console.log('socket timeout');
      socket.end();
    });

    var msgParse = new SocketParser();

    socket.on("data",function(buffer)
    {
        console.log(buffer);
        // msgParse.tempArr.push(buffer);
        // msgParse.totalBuffer = Buffer.concat(msgParse.tempArr);
        // msgParse.GetPayload(socket);
    });

    socket.on("end",function()
    {
        console.log("ok");
    });

    socket.on("error",function(err)
    {
        console.log(err);
    })
});

class SocketParser
{
    constructor()
    {
        this.tempArr = [];
        this.totalBuffer = [];
        this.stateFlag = 0;
        this.bufferCount = 0;
        this.status = true;
    }   

    GetPayload(socket)
    {
        while(this.totalBuffer.length > 0)
        {
            if(!this.status)
            {
                continue;
            }
            
            var firstByte = this.totalBuffer[0];

            var fin = (firstByte & 0x80) >>> 7;

            console.log("fin: "+fin);

            var opcode = firstByte & 0x0f;

            var payloadType;

            if ( opcode >= 0x3 && opcode <= 0x7  
                ||
                opcode >= 0xB && opcode <= 0xF)
            {
                console.log("Special frame recieved");
                return;
            }
            
            if(opcode == 0x0)
            {
                payloadType = 'continuation';
            }
            else if(opcode == 0x1)
            {
                payloadType = 'text';
            }
            else if(opcode == 0x2)
            {
                payloadType = 'binary';
            }
            else if(opcode == 0x8)
            {
                payloadType = 'connection close';
            }
            else if(opcode == 0x9)
            {
                payloadType = 'ping';
            }
            else if(opcode == 0xA)
            {
                payloadType = 'pong';
            }
            else
            {
                payloadType = 'reservedfornon-control';
            }
            
            console.log(payloadType);

            if(payloadType === "reservedfornon-control")
            {
                return;
            }

            this.status = false;

            if(fin === 1 && (payloadType === "text" || payloadType === "binary"))
            {
                this.parseMessage(socket)
            }
        }
    }

    isHex(h) {
        var a = parseInt(h,16);
        return (a.toString(16) === h)
    }

    parseMessage(socket)
    {
        var secondByte = this.totalBuffer[1];

        var mask = (secondByte & 0x80) >>> 7;

        if (mask === 0)
        {
            console.log('browse should always mask the payload data');
            return;
        }

        var payloadLength = (secondByte & 0x7f);

        var decoded = [],masks = [];
        var text = "";

        var indexFirstMask = 2 ;

        if(payloadLength == 126)
        {
            payloadLength = this.totalBuffer.slice(indexFirstMask, (indexFirstMask + 2));

            payloadLength = payloadLength.readUInt16BE(0);
            
            indexFirstMask = 4;
        }
        else if(payloadLength == 127)
        {
            indexFirstMask = 10;
        }

        masks = this.totalBuffer.slice(indexFirstMask, (indexFirstMask + 4));

        var indexFirstDataByte = indexFirstMask + 4;

        for (var i = indexFirstDataByte, j = 0; i < (indexFirstDataByte + payloadLength); i++,j++) {
            decoded[j] = this.totalBuffer[i] ^ masks[j % 4];
            text += String.fromCharCode(this.totalBuffer[i] ^ masks[j % 4]);
        }

        this.totalBuffer = this.totalBuffer.slice(indexFirstDataByte + payloadLength);

        console.log(payloadLength);

        this.status = true;

        fs.appendFileSync("sample1.txt", text+"\r\n");

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

        var body = Buffer.from(arr);

       socket.write(body);
    }
}

server.listen(9100);