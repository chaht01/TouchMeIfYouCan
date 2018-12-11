if (window.location.href.indexOf("?id=") > 0) {
  // phone
  var io = io();

  io.emit("controller_connect", window.location.href.split("?id=")[1]);
  io.on("controller_connected", function(connected) {
    if (connected) {
      alert("Connected!");
    } else {
      alert("Not connected!");
    }
  });
} else {
  var playerA = io();
  var playerB = io();
  const players = [playerA, playerB];
  players.map(io => {
    io.on("connect", function() {
      io.emit("game_connect");
    });

    var game_connected = function() {
      var url = "http://2a8688f2.ngrok.io?id=" + io.id;
      document.body.innerHTML += url;
      io.removeListener("game_connected", game_connected);
    };

    io.on("game_connected", game_connected);
    io.on("acc_recv", function(acc_val) {
      console.log(acc_val);
    });
  });
}
