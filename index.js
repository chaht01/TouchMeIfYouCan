var express = require("express");
var http = require("http");
var app = express();
var server = http.createServer(app);
var port = 3333;

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.use(express.static(__dirname));
server.listen(port, function() {
  console.log(`listen on ${port}`);
});

var game_sockets = {};
var controller_sockets = {};
var io = require("socket.io").listen(server);

io.sockets.on("connection", function(socket) {
  socket.emit("ios_connected", "helloworld");

  socket.on("down__ar__server", function(data) {
    console.log(data);
    socket.broadcast.emit("down__server__web", data);
  });
  socket.on("item_selected__web__server", function(color) {
    socket.broadcast.emit("item_selected__server__ar", color);
  });

  socket.on("up__ar__server", function(data) {
    socket.broadcast.emit("up__server__web", data);
  });

  socket.on("circles__web__server", function(data) {
    console.log(data);
    socket.broadcast.emit("circles__server__ar", data); //mirroring
  });

  // socket.on("dragging", function(data) {
  //   socket.broadcast.emit("changing", data);
  //   console.log(data);
  // });
});
