var fs = require('fs');

module.exports = {
  queue: [],
  incorrectTeams: [],
  teams: [],
  scores: [],
  questionNumber: 1,
  currentQuestion: fs.readFileSync('./questions/1', 'utf8'),
}
