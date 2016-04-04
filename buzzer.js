var jwt = require('jsonwebtoken');
var state = require('./state');
const config = require('./config')

function getTeamById(id) {
  return state.teams.indexOf(id) + 1;
}

module.exports = function (app, io) {
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
    state.teams.push(socket.id);
    state.scores.push(0);
    io.of('/public').emit('scoreboard', state.scores)
    socket.on('buzzer', function () {
      const team = getTeamById(socket.id)
      if (state.queue.indexOf(team) == -1 && state.incorrectTeams.indexOf(team) == -1) {
        state.queue.push(team);
        io.of('/admin').emit('queue', state.queue)
      }
    });
  });
}
