var express = require("express");
var http = require("http");
var app = express();
var server = http.createServer(app);
var port = 3333;
var chroma = require("chroma-js");

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.use(express.static(__dirname));
var game_setting;
server.listen(port, function() {
  game_setting = setupGame();
  console.log(`listen on ${port}`);
});

function setupGame() {
  let circle_cnt = 5;
  let ret = {
    A: [],
    B: []
  };
  for (let i = 0; i < circle_cnt; i++) {
    left = Math.random() - 0.5;
    top = (Math.random() * 440) / 400 - 440 / 400 / 2;
    color = chroma.random().num();
    ret.A.push({ left, top, color });
  }
  for (let i = 0; i < circle_cnt; i++) {
    left = Math.random() - 0.5;
    top = (Math.random() * 440) / 400 - 440 / 400 / 2;
    color = chroma.random().num();
    ret.B.push({ left, top, color });
  }
  return ret;
}

var io = require("socket.io").listen(server);

io.sockets.on("connection", function(socket) {
  socket.emit("connected", game_setting);

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
    game_setting = data;
    socket.broadcast.emit("circles__server__ar", data);
  });
  socket.on("circles__ar__server", function(data) {
    game_setting = data;
    socket.broadcast.emit("circles__server__web", data);
  });

  // socket.on("dragging", function(data) {
  //   socket.broadcast.emit("changing", data);
  //   console.log(data);
  // });
});
