// IIFE that sets global high scores variable on page load
let existingHighScores = (function (window) {
  if (window) { // grabs registered users from local storage
    if (localStorage.getItem('highScores')) {
      return JSON.parse(localStorage.getItem('highScores'));
    } else { // creates the highScores
      localStorage.setItem('highScores', JSON.stringify({}));
      return {};
    };
  };
})(window);

const scoresStorageHelper = {
// sets initial score object for new users
  createUserScoreObject: (userName, allscores) => {
    if (allscores.hasOwnProperty(userName)) return; //prevents duplicates
    allscores[userName] = {
      timeMode: [],
      challengeMode: [],
      freePlayMode: []
    };
    existingHighScores = allscores;
    localStorage.setItem('highScores', JSON.stringify(existingHighScores));
  },
  updateUserScores: (newScore, allScores) => { // updates local storage 
    const { gameMode, userName } = newScore;
    const gameModeScores = allScores[userName][gameMode];
    for (let obj of gameModeScores) { // prevents duplicates
      if (obj.score === newScore.score && obj.level === newScore.level) return;
    };
    const updatedGameModeScores = [...gameModeScores, newScore];
    allScores[userName][gameMode] = updatedGameModeScores;
    existingHighScores = allScores;
    localStorage.setItem('highScores', JSON.stringify(existingHighScores));
  }
};