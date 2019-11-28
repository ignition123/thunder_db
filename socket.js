const http = require("http");

const crypto = require("crypto");

var server = http.createServer();

const fs = require("fs");

const os = require("os");

console.log(os.endianness());

server.addListener("upgrade",function(req,socket)
{
    var respHeader = crypto.createHash('sha1').update(req.headers["sec-websocket-key"]+"258EAFA5-E914-47DA-95CA-C5AB0DC85B11").digest('base64');

    var response = "HTTP/1.1 101 Switching Protocols\r\nConnection: Upgrade\r\nUpgrade: websocket\r\nSec-WebSocket-Accept: "+respHeader+"\r\n\r\n"; 

    socket.write(response);

    var totalBuffer = [];

    var buff;

    socket.setNoDelay(true);

    socket.setKeepAlive(true);

    var msgParse = new SocketParser(socket);

    socket.addListener("data",function(buffer)
    {    
        msgParse.GetPayload(buffer);
    });

    socket.addListener("end",function()
    {
        console.log("ok");
    });

    socket.addListener("error",function(err)
    {
        console.log(err);
    });
});

class SocketParser
{
    constructor(socket)
    {
        this.prevfin;
        this.prevOpCode;
        this.socket = socket;
        this.prevPacket = [];
        this.curPacket = [];
    }  

    GetPayload(buffer)
    {
        if(this.prevPacket.length > 0 && this.prevfin === 0)
        {
            var firstByte = buffer[0];

            this.prevfin = (firstByte & 0x80) >>> 7;

            this.prevOpCode = firstByte & 0x0f;

            var secondByte = buffer[1];

            var payloadLength = (secondByte & 0x7f);
            var offset = 2;

            // console.log("current fin is: "+this.prevfin);
            // console.log("current prevOpCode is: "+this.prevOpCode);
            // console.log("payload length is: "+payloadLength);

            if(payloadLength == 126)
            {
                payloadLength = buffer.slice(offset, 4);

                payloadLength = payloadLength.readUInt16BE(0);
            }
            else if(payloadLength == 127)
            {
                payloadLength = buffer.slice(offset, 16);

                payloadLength = payloadLength.readUInt64BE(0);
            }

            this.curPacket = Buffer.concat([, buffer]);

            this.prevPacket = [];

            this.parseMessage();
        }
        else
        {
            if(this.curPacket.length === 0)
            {
                this.curPacket = buffer;
            }
            else
            {
                this.curPacket = Buffer.concat([this.curPacket, buffer]);
            }

            if(this.prevfin === undefined || this.prevfin === 1)
            {
                var firstByte = this.curPacket[0];

                this.prevfin = (firstByte & 0x80) >>> 7;

                this.prevOpCode = firstByte & 0x0f;

                var payloadType;

                if ( this.prevOpCode >= 0x3 && this.prevOpCode <= 0x7  
                ||
                this.prevOpCode >= 0xB && this.prevOpCode <= 0xF)
                {
                    // console.log("Special frame recieved");
                    return;
                }

                if(this.prevOpCode == 0x0)
                {
                    payloadType = 'continuation';
                }
                else if(this.prevOpCode == 0x1)
                {
                    payloadType = 'text';
                }
                else if(this.prevOpCode == 0x2)
                {
                    payloadType = 'binary';
                }
                else if(this.prevOpCode == 0x8)
                {
                    payloadType = 'connection close';
                }
                else if(this.prevOpCode == 0x9)
                {
                    payloadType = 'ping';
                }
                else if(this.prevOpCode == 0xA)
                {
                    payloadType = 'pong';
                }
                else
                {
                    payloadType = 'reservedfornon-control';
                }
                
                console.log(payloadType);
                console.log("fin: "+this.prevfin);

                if(payloadType === "continuation")
                {
                    this.parseMessage();
                    return;
                }

                if(this.prevfin === 1 && (payloadType === "text" || payloadType === "binary"))
                {
                    this.parseMessage();
                    return;
                }
            }
            else if(this.prevfin === undefined || this.prevfin === 0)
            {
                if(this.prevPacket.length === 0)
                {
                    this.prevPacket = this.curPacket;
                }
                else
                {
                    this.prevPacket = Buffer.concat([this.prevPacket, this.curPacket]);
                }
            }
        }
    }

    parseMessage(consecutivePackLen)
    {
        var secondByte = this.curPacket[1];

        var mask = (secondByte & 0x80) >>> 7;

        if (mask === 0)
        {
            console.log('browse should always mask the payload data2');
            return;
        }

        var payloadLength = (secondByte & 0x7f);
        var decoded = [];
        var text = "";
        var offset = 2;

        if(payloadLength == 126)
        {
            payloadLength = this.curPacket.slice(offset, 4);

            payloadLength = payloadLength.readUInt16BE(0);

            offset += 2;
        }
        else if(payloadLength == 127)
        {
            payloadLength = this.curPacket.slice(offset, 16);

            payloadLength = payloadLength.readUInt64BE(0);

            offset += 8;
        }

        if(consecutivePackLen)
        {
            payloadLength += consecutivePackLen;
        }

        console.log("payloadLength:",payloadLength);
        console.log("currentBuffer:",this.curPacket.length);

        if(payloadLength >= this.curPacket.length)
        {
            return;
        }

        var masks = this.curPacket.slice(offset, (offset + 4));

        var actualPayload = offset + 4;

        var totalPayloadChunk = actualPayload + payloadLength;

        for (var i = actualPayload, j = 0; i < totalPayloadChunk; i++,j++)
        {
            decoded[j] = this.curPacket[i] ^ masks[j % 4];
            text += String.fromCharCode(this.curPacket[i] ^ masks[j % 4]);
        }

        this.curPacket = this.curPacket.slice(totalPayloadChunk);

        fs.appendFileSync("sample1.txt", text.length+"\r\n");

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

       this.socket.write(body);
    }
}

server.listen(9100);