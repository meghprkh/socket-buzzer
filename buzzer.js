var jwt = require('jsonwebtoken');
var state = require('./state');
const config = require('./config')

module.exports = function (app, io) {
  app.post('/buzzerAuth', function (req, res) {
    var password = req.body.password;
    var team = req.body.team;
    if (password == config.BUZZER_PASSWORD) {
      var token = jwt.sign({team: team}, config.PRIVATE_KEY, {
        expiresIn: '5h',
        subject: 'buzzer'
      });
      res.send(token)
    } else res.status(401).send()
  })

  io.of('/buzzer').use(function(socket, next) {
    var token = socket.request._query.token;
    var data = jwt.verify(token, config.PRIVATE_KEY, {subject: 'buzzer'})
    if (data) {
      socket.team = parseInt(data.team) - 1
      next();
    }
    else next(new Error("not authorized"))
  });

  io.of('/buzzer').on('connection', function(socket){
    while (state.scores.length <= socket.team) state.scores.push(0);
    io.of('/public').emit('scoreboard', state.scores)
    socket.on('buzzer', function () {
      if (!state.questionBuzzable) return;
      const team = socket.team
      if (state.queue.indexOf(team) == -1 && state.incorrectTeams.indexOf(team) == -1) {
        state.queue.push(team);
        io.of('/admin').emit('queue', state.queue)
      }
    });
  });
}
