// This file is used to simulate game users
const { createNewUser } = userStorageHelper;
const { createUserScoreObject } = scoresStorageHelper
const simulatedUser1 = {
  userName: 'Jrob0430',
  email: 'jrobinson61810@gmail.com',
  password: 'FishPark5',
  isLoggedIn: false,
  gameOptions: {
    gameMode: null,
    tiles: 'sports',
    theme: 'lightskyblue'
  },
  savedGameData: {
    timeMode: {
      lastLevel: 0,
      totalScore: 0,
      highestCombo: 0,
      livesLeft: 3,
      bonusTime: 0,
      totalMoves: 0
    },
    challengeMode: {
      lastLevel: 0,
      totalScore: 0,
      highestCombo: 0,
      livesLeft: 3,
      bonusTime: 0,
      bonusMoves: 0,
      totalMoves: 0
    }
  }
};
const simulatedUser2 = {
  userName: 'BoltAction13',
  email: 'bthurman@gmail.com',
  password: 'Shadow222',
  isLoggedIn: false,
  gameOptions: {
    gameMode: null,
    tiles: 'sports',
    theme: 'lightskyblue'
  },
  savedGameData: {
    timeMode: {
      lastLevel: 0,
      totalScore: 0,
      highestCombo: 0,
      livesLeft: 3,
      bonusTime: 0,
      bonusMoves: 0,
      totalMoves: 0
    },
    challengeMode: {
      lastLevel: 0,
      totalScore: 0,
      highestCombo: 0,
      livesLeft: 3,
      bonusTime: 0,
      totalMoves: 0
    }
  }
};

createNewUser(simulatedUser1);
createNewUser(simulatedUser2);
createUserScoreObject('Jrob0430', existingHighScores);
createUserScoreObject('BoltAction13', existingHighScores);
