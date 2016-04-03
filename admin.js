var jwt = require('jsonwebtoken');
var fs = require('fs')
var state = require('./state');
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
      state.queue = []
      state.incorrectTeams = []
      state.questionNumber++
      fs.readFile('./questions/' + state.questionNumber, 'utf8', function (err, data) {
        state.currentQuestion = data
        if (err) throw err;
        io.of('/public').emit('newQuestion', data)
      });
      socket.emit('queue', state.queue)
    })
    socket.on('incorrectAnswer', function () {
      state.incorrectTeams.push(state.queue[0])
      state.queue = state.queue.slice(1)
      socket.emit('queue', state.queue)
    })
  })
}
