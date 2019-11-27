const http = require("http");
const crypto = require('crypto');
const net = require('net');

var httpServer = http.createServer();

httpServer.listen(9100,function()
{
    console.log("listening at 9100");
});

httpServer.on('upgrade', function(req, socket)
{
    if (req.headers['sec-websocket-key1'] && req.headers['sec-websocket-key2']) {
        console.log('Old Header hybi-00(hixi-76) to hybi-03');
    }

    var version = parseInt(req.headers['sec-websocket-version']);

    // 13 is hibi-13 to 17 & RFC
    if (version !== 13) {
      var v;
      switch (version) {
      case 4:
        v = '04';
        break;
      case 5:
        v = '05';
        break;
      case 6:
        v = '06';
        break;
      case 7:
        v = '07';
        break;
      case 8:
        v = '08-12';
        break;
      default:
        v = 'unknown';
      }
      console.log('Old version hibi-' + v);
    }
  
  
    if (req.headers['sec-websocket-origin']) {
      console.log('Old Header');
    }

    // Subprotocol selector
    // this case, use first one
    var protocol = req.headers['sec-websocket-protocol'] !== undefined ? req.headers['sec-websocket-protocol'].split(',')[0] : null;

    // list of extensions support by the client
    // this used to indecate application-level protocol
    // server selects one or none of acceptable protocol
    // echoes that value in its handshake.
    var extensions = req.headers['sec-websocket-extensions'];

    // use for reject browser if not acceptable
    // you can reject by sending appropriate HTTP error code
    var origin = req.headers['origin'];

    // to prove the client that handshake was recieved,
    // use the sec-websocket-key to prevent an attacker
    // from sending crafted XHR or Form packet.
    var key = req.headers['sec-websocket-key'];

    key = require('crypto')
         .createHash('sha1')
         .update(key + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11')
         .digest('base64');

    var headers = [
            // The first line is an HTTP Status-Line
            // code 101, Switching Protocols
            'HTTP/1.1 101 Switching Protocols'
            // Upgrade, Connection fields complete the Upgrade
          , 'Upgrade: websocket'
          , 'Connection: Upgrade'
            // Accept will checked by client which is expected
          , 'Sec-WebSocket-Accept: ' + key
            // option fields can be included
            // main is subprotocol that indicates server has selected
    ].concat('', '').join('\r\n');
       
    socket.write(headers);

    if (req.headers['upgrade'] !== 'websocket')
    {
        socket.end('HTTP/1.1 400 Bad Request');
        return;
    }

    socket.on('data', function(chunk) {
        parseData(chunk, socket)
    });
});

function parseData(receivedData, socket)
{
    var firstByte = receivedData[0];

    var fin = (firstByte & 0x80) >>> 7;

    var opcode = firstByte & 0x0f;

    var payloadType;

    switch (opcode)
    {
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

    if (payloadType !== 'text')
    {
       console.log('this script dosen\'t supports without text');
       return;
    }

    var secondByte = receivedData[1];

    var mask = (secondByte & 0x80) >>> 7;

    if (mask === 0) {
      console.log('browse should always mask the payload data');
      return;
    }

    var payloadLength = (secondByte & 0x7f);
    if (payloadLength === 0x7e) {
      console.log('next 16bit is length but not supported');
    }
    if (payloadLength === 0x7f) {
      console.log('next 64bit is length but not supported');
    }


    /**
     * masking key
     * 3rd to 6th byte
     * (total 32bit)
     */
    var maskingKey = receivedData.readUInt32BE(2);

    /**
     * Payload Data = Extention Data + Application Data
     */

    /**
     * extention data
     * 0 byte unless negotiated during handshake
     */
    var extentionData = null;

    /**
     * application data
     * remainder of frame after extention data.
     * length of this is payload length minus
     * extention data.
     */
    var applicationData = receivedData.readUInt32BE(6);

    /**
     * unmask the data
     * application data XOR mask
     */
    var unmasked = applicationData ^ maskingKey;

    /**
     * write to temp buffer and
     * encoding to utf8
     */
    var unmaskedBuf = Buffer.alloc(15);
    unmaskedBuf.writeInt32BE(unmasked, 0);

    var encoded = unmaskedBuf.toString();

    console.log('======== Parsed Data ===============');
    console.log('fin:', fin);
    console.log('opcode:', payloadType);
    console.log('mask:', mask);
    console.log('payloadLength:', payloadLength);
    console.log('maskingkey:', maskingKey);
    console.log('applicationData:', applicationData);
    console.log('unmasked', unmasked);
    console.log('encoded data:', encoded);
    console.log('\n======== Recieved Frame ===============');
    display(receivedData);

    /**
     * Sending data to client
     * data must not mask
     */
    var sendData = [];

    var msg = "test value test value";
    var strLen = msg.length;

    // FIN:1, opcode:1
    // 0x81 = 10000001
    sendData[0] = 0x81;
    // MASK:0, len:4
    // 0x4 = 100
    sendData[1] = strLen;

    // payload data
    // send data "test"
    for(var i=0;i<msg.length;i++)
    {
      sendData[i + 2] = msg[i].charCodeAt(0);
    }

    console.log(sendData);

    console.log('\n======== Sending Frame ===============');
    display(sendData);

    // send to client
    socket.write(Buffer.from(sendData));
}

function display(buffer) {
    // display data frame
    function zeropadding(str, len) {
      while (str.length < len) {
        str = '0' + str;
      }
      return str;
    }
    var temp = [];
    for (var i = 0; i < buffer.length; i++) {
      var d = buffer[i];
      var hex = d.toString(2);
      hex = zeropadding(hex, 8);
      temp.push(hex);
    }


    for (var j = 0; j < temp.length; j += 4) {

        if(temp[j + 1] !== undefined)
        {
           console.log(temp[j],temp[j + 1],temp[j + 2],temp[j + 3]);
        }
    }
}


function substr(string, start, length, newStr = '') {
    if(typeof(length) == "number")
    {
        return string.substr(0, start) + newStr + string.substr(start + length);
    }
    else
    {
        return string.substr(0, start) + newStr + string.substr(start + (string.length - 1));
    }
}

function unmask(text)
{
    length = text.charCodeAt(0) & 127;

    if(length == 126)
    {
        masks = substr(text, 4, 4);
        data = substr(text, 8);
    }
    else if(length == 127)
    {
        masks = substr(text, 10, 4);
        data = substr(text,14);
    }
    else
    {
        masks = substr(text,2, 4);
        data = substr(text,6);
    }

    text = "";

    for (i = 0; i < data.length; ++i)
    {
        text = data[i] ^ masks[i%4];
    }

    return text;
}

function ord (string) {
    //  discuss at: https://locutus.io/php/ord/
    // original by: Kevin van Zonneveld (https://kvz.io)
    // bugfixed by: Onno Marsman (https://twitter.com/onnomarsman)
    // improved by: Brett Zamir (https://brett-zamir.me)
    //    input by: incidence
    //   example 1: ord('K')
    //   returns 1: 75
    //   example 2: ord('\uD800\uDC00'); // surrogate pair to create a single Unicode character
    //   returns 2: 65536
  
    var str = string + ''
    var code = str.charCodeAt(0)
  
    if (code >= 0xD800 && code <= 0xDBFF) {
      // High surrogate (could change last hex to 0xDB7F to treat
      // high private surrogates as single characters)
      var hi = code
      if (str.length === 1) {
        // This is just a high surrogate with no following low surrogate,
        // so we return its value;
        return code
        // we could also throw an error as it is not a complete character,
        // but someone may want to know
      }
      var low = str.charCodeAt(1)
      return ((hi - 0xD800) * 0x400) + (low - 0xDC00) + 0x10000
    }
    if (code >= 0xDC00 && code <= 0xDFFF) {
      // Low surrogate
      // This is just a low surrogate with no preceding high surrogate,
      // so we return its value;
      return code
      // we could also throw an error as it is not a complete character,
      // but someone may want to know
    }
  
    return code
  }

// const server = new net.Server();

// server.on('connection', function(socket) {
//     console.log('A new connection has been established.');

//     var data = "";
//     // The server can also receive data from the client by reading from its socket.
    

//     // When the client requests to end the TCP connection with the server, the server
//     // ends the connection.
//     socket.on('end', function() {
        
//     });

//     // Don't forget to catch error, for your own sake.
//     socket.on('error', function(err) {
        
//     });
// });

// server.listen(httpServer);

function upgradeServer(req, res)
{
    

    headerResp = Buffer.from(headerResp);

    res.statusCode = 101;
    res.write(headerResp);
}