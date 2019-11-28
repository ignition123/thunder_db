var util = require("util");
var net = require("net");
var http = require("http");
const crypto = require("crypto");


function createTestServer(){
  return new testServer();
};

function testServer(){
  var server = this;
  http.Server.call(server, function(){});

  server.addListener("connection", function(){
    // requests_recv++;
  });

  server.addListener("request", function(req, res){
    res.writeHead(200, {"Content-Type": "text/plain"});
    res.write("okay");
    res.end();
  });

  server.addListener("upgrade", function(req, socket, upgradeHead){
    
    var respHeader = crypto.createHash('sha1').update(req.headers["sec-websocket-key"]+"258EAFA5-E914-47DA-95CA-C5AB0DC85B11").digest('base64');

    var response = "HTTP/1.1 101 Switching Protocols\r\nConnection: Upgrade\r\nUpgrade: websocket\r\nSec-WebSocket-Accept: "+respHeader+"\r\n\r\n"; 

    socket.write(response);

    request_upgradeHead = upgradeHead;

    socket.ondata = function(d, start, end){
      //var data = d.toString('utf8', start, end);
      var original_data = d.toString('utf8', start, end);
      var data = original_data.split('\ufffd')[0].slice(1);
      if(data == "kill"){
        socket.end();
      } else {
        socket.write("\u0000", "binary");
        socket.write(data, "utf8");
        socket.write("\uffff", "binary");
      }
    };
  });
};

util.inherits(testServer, http.Server);

var server = createTestServer();
server.listen(9100);