var net = require('net');
var SerialPort = require("serialport");

var HOST = '127.0.0.1';
var PORT = 6969;
//var TTY_PORT = "/dev/ttyMFD1"; // serial comms on the galileo/edison.
var TTY_PORT = "/dev/tty.usbserial-DN026H8V"; // local roomba usb cable.
// Create a server instance, and chain the listen function to it
// The function passed to net.createServer() becomes the event handler for the 'connection' event
// The sock object the callback function receives UNIQUE for each connection

function convert_telnet_to_bytes(data) {
  str = String.fromCharCode.apply(null, data);
  parts = str.split(',');
  buf = Buffer.allocUnsafe(parts.length);
  for(i=0; i < parts.length; i++) {
    num = parseInt(parts[i].trim(), 10);
    buf.writeUInt8(num, i);
  }
  console.log(buf);
  return buf;
}

net.createServer(function(sock) {

    // We have a connection - a socket object is assigned to the connection automatically
    console.log('CONNECTED: ' + sock.remoteAddress +':'+ sock.remotePort);


    var port = new SerialPort(TTY_PORT, {
        //Defaults for Roomba Open Interface:
        baudRate:115200, dataBits:8,
        parity:'none', stopBits:1,
        flowControl:false, autoOpen: false
    });

    console.log("Connect to TTY: "+ port);
    port.open(function (error) {
      if (error) {
        console.log('Failed to open: '+error);
      } else {
        console.log('open');
        port.on('data', function(data) {
          //console.log('data type: ' + Object.prototype.toString.call( data));
          //console.log('output received: ' + (typeof data) +data);
          sock.write(data);
        });
      }
    });

    // Add a 'data' event handler to this instance of socket
    sock.on('data', function(data) {
      console.log('data type: ' + Object.prototype.toString.call( data));
      bytes = convert_telnet_to_bytes(data);
      console.log('input received: ' + (typeof data) +data);
      port.write(bytes, function(err) {
        if(err) {
          console.log('err ' + err);
        }else{
          console.log('data written to serialport ');
        }
        console.log('DATA ' + sock.remoteAddress + ': ' + bytes + ' : ' + bytes.length);
      });
    });

    // Add a 'close' event handler to this instance of socket
    sock.on('close', function(data) {
      port.close();
      console.log('CLOSED: ' + sock.remoteAddress +' '+ sock.remotePort);
    });

}).listen(PORT, HOST);

console.log('Server listening on ' + HOST +':'+ PORT);
