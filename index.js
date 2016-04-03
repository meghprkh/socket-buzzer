var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var queue = [];
var teams = [];

function getTeamById(id) {
  return teams.indexOf(id) + 1;
}

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/queue', function(req, res){
  res.send(queue);
});

io.of('/buzzer').on('connection', function(socket){
  teams.push(socket.id);
  socket.on('buzzer', function () {
    const team = getTeamById(socket.id)
    if (queue.indexOf(team) == -1) {
      queue.push(team);
    }
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
