var app = require('express')();
var bodyParser = require('body-parser');
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var jwt = require('jsonwebtoken');
const config = require('./config')
var state = require('./state');

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(require('express').static('public'))

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/queue', function(req, res){
  res.send(state.queue)
});

app.get('/admin', function(req, res){
  res.sendFile(__dirname + '/admin.html');
});

app.get('/question', function(req, res){
  res.sendFile(__dirname + '/question.html');
});

app.get('/scoreboard', function(req, res){
  res.sendFile(__dirname + '/scoreboard.html');
});

require('./admin')(app, io)
require('./buzzer')(app, io)
require('./public')(app, io)

http.listen(3000, function(){
  console.log('listening on *:3000');
});
