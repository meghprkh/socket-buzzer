var fs = require('fs');

module.exports = {
  queue: [],
  incorrectTeams: [],
  scores: [],
  questionNumber: 0,
  currentQuestion: fs.readFileSync('./questions/' + require('./getFileName')(0), 'utf8'),
  questionBuzzable: require('./questionBuzzable')(0),
}
