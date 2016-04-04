var state = require('./state')

module.exports = function (app, io) {
  io.of('/public').on('connection', function(socket) {
    socket.emit('newQuestion', state.currentQuestion)
    socket.emit('scoreboard', state.scores)
  })
}
