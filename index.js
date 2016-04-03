var app = require('express')();
var bodyParser = require('body-parser');
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var jwt = require('jsonwebtoken');
const config = require('./config')

var queue = [];
var incorrectTeams = [];
var teams = [];

function getTeamById(id) {
  return teams.indexOf(id) + 1;
}

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(require('express').static('public'))

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/queue', function(req, res){
  res.send(queue)
});

app.get('/admin', function(req, res){
  res.sendFile(__dirname + '/admin.html');
});

app.post('/adminAuth', function (req, res) {
  var password = req.body.password;
  if (password == config.ADMIN_PASSWORD) {
    var token = jwt.sign({}, config.PRIVATE_KEY, {
      expiresIn: '5h',
      subject: 'admin'
    });
    res.send(token)
  } else res.status(401).send()
})

io.of('/admin').use(function(socket, next) {
  var token = socket.request._query.token;
  if (jwt.verify(token, config.PRIVATE_KEY, {subject: 'admin'}))
    next();
  else next(new Error("not authorized"))
});

io.of('/admin').on('connection', function(socket) {
  socket.emit('queue', queue)
  socket.on('correctAnswer', function () {
    queue = []
    incorrectTeams = []
    socket.emit('queue', queue)
  })
  socket.on('incorrectAnswer', function () {
    incorrectTeams.push(queue[0])
    queue = queue.slice(1)
    socket.emit('queue', queue)
  })
})

app.post('/buzzerAuth', function (req, res) {
  var password = req.body.password;
  if (password == config.BUZZER_PASSWORD) {
    var token = jwt.sign({}, config.PRIVATE_KEY, {
      expiresIn: '5h',
      subject: 'buzzer'
    });
    res.send(token)
  } else res.status(401).send()
})

io.of('/buzzer').use(function(socket, next) {
  var token = socket.request._query.token;
  if (jwt.verify(token, config.PRIVATE_KEY, {subject: 'buzzer'}))
    next();
  else next(new Error("not authorized"))
});

io.of('/buzzer').on('connection', function(socket){
  teams.push(socket.id);
  socket.on('buzzer', function () {
    const team = getTeamById(socket.id)
    if (queue.indexOf(team) == -1 && incorrectTeams.indexOf(team) == -1) {
      queue.push(team);
      io.of('/admin').emit('queue', queue)
    }
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
