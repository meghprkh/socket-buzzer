module.exports = function (qno) {
  if (qno % 3 == 0) return (Math.floor(qno/3) + 1) + '_pre' + '.html';
  else if (qno % 3 == 1) return (Math.floor(qno/3) + 1) + '_main' + '.html';
  else return (Math.floor(qno/3) + 1) + '_post' + '.html';
}
