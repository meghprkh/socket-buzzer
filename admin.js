var jwt = require('jsonwebtoken');
var fs = require('fs')
var state = require('./state');
var scoring = require('./scoring');
const config = require('./config')

module.exports = function (app, io) {
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
    socket.emit('queue', state.queue)
    socket.on('correctAnswer', function () {
      if (state.queue.length) {
        var team = state.queue[0];
        state.scores[team] = scoring.correctAnswer(state.scores[team])
      }
      state.queue = []
      state.incorrectTeams = []
      state.questionNumber++
      fs.readFile('./questions/' + require('./getFileName')(state.questionNumber), 'utf8', function (err, data) {
        if (err) throw err;
        state.currentQuestion = data
        state.questionBuzzable = require('./questionBuzzable')(state.questionNumber)
        io.of('/public').emit('newQuestion', data)
        io.of('/buzzer').emit('questionBuzzable', state.questionBuzzable)
      });
      socket.emit('queue', state.queue)
      io.of('/public').emit('scoreboard', state.scores)
    })
    socket.on('incorrectAnswer', function () {
      if (state.queue.length) {
        var team = state.queue[0];
        state.scores[team] = scoring.incorrectAnswer(state.scores[team])
        state.incorrectTeams.push(team)
        state.queue = state.queue.slice(1)
      }
      socket.emit('queue', state.queue)
      io.of('/public').emit('scoreboard', state.scores)
    })
  })
}
