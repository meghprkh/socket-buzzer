var fs = require('fs');

module.exports = {
  queue: [],
  incorrectTeams: [],
  scores: [],
  questionNumber: 1,
  currentQuestion: fs.readFileSync('./questions/1.html', 'utf8'),
}
