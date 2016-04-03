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

app.get('/admin', function(req, res){
  res.sendFile(__dirname + '/admin.html');
});

io.of('/admin').on('connection', function(socket) {
  socket.emit('queue', queue)
})

io.of('/buzzer').on('connection', function(socket){
  teams.push(socket.id);
  socket.on('buzzer', function () {
    const team = getTeamById(socket.id)
    if (queue.indexOf(team) == -1) {
      queue.push(team);
      io.of('/admin').emit('queue', queue)
    }
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
