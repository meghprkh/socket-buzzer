function correctAnswer(previousScore) {
  return previousScore + 50
}

function incorrectAnswer(previousScore) {
  return previousScore - 25
}

module.exports = {
  correctAnswer: correctAnswer,
  incorrectAnswer: incorrectAnswer,
}
