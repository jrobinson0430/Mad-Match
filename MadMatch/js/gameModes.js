const { updateUser } = userStorageHelper; // destructured method
let replayChallenge = false;

const setGameStats = (currentUser) => {
  const { savedGameData } = currentUser;
  const { gameOptions: { gameMode: currentGameMode} } = loggedInUser
  // sets UI based on currentGameMode being 'freePlayMode' or not
  $('#livesLeftOutput')[0].textContent = (currentGameMode === 'freePlayMode')
    ? 0
    : savedGameData[currentGameMode].livesLeft;
  $('#highestComboOutput')[0].textContent = (currentGameMode === 'freePlayMode')
    ? 0
    : savedGameData[currentGameMode].highestCombo;
  $('#levelOutput')[0].textContent = (currentGameMode === 'freePlayMode')
    ? null
    : +savedGameData[currentGameMode].lastLevel + 1;
  $('#score')[0].textContent = (currentGameMode === 'freePlayMode')
    ? 0
    : +savedGameData[currentGameMode].totalScore;

  //sets mode spefic UI and calls corresponding to game mode functions
  switch (currentGameMode) {
    case 'timeMode':
      $('#gameBoardHeading')[0].textContent = `Time Attack`;
      $('#movesLeft').hide();
      $('#objectivesLeft').hide();
      $('#objectiveContainer').hide();
      runTimeMode(currentUser);
      break;
    case 'challengeMode':
      $('#gameBoardHeading')[0].textContent = `Challenges`;
      $('#target').hide();
      $('#timer').hide();
      $('#remainingScore').hide();
      runChallengeMode(currentUser);
      break;
    default: // freePlay Mode
      $('#gameBoardHeading')[0].textContent = `Free Play`;
      $('#exitGameMessage').hide();
      gameTimer = timer(); // starts timer at 0:00
      $('#objectivesLeft').hide();
      $('#movesLeft').hide();
      $('#livesLeft').hide();
      $('#target').hide();
      $('#level').hide();
      $('#objectiveContainer').hide();
      $('#remainingScore').hide();
      break;
  };
};

const runTimeMode = (currentUser) => {
  const { savedGameData: { timeMode } } = currentUser;
  const { lastLevel } = timeMode;
  const currentLevel = lastLevel + 1;
  // equation that grows exponentially based on users current level
  const targetScore = Math.pow(currentLevel * 10, 2);
  const startingSeconds = calculateStartTime(loggedInUser);
  gameTimer = timer(startingSeconds); // sets initial time based on users level
  gameTimer.displayTime(); // updates UI with levels initial start time
  $('#targetOutput')[0].textContent = targetScore; // updates targetscore on UI
};

const runChallengeMode = (currentUser) => {
  const { savedGameData } = currentUser;
  const currentLevel = savedGameData.challengeMode.lastLevel + 1;
  const bonusMoves = savedGameData.challengeMode.bonusMoves;
  const { // destructures out of current levels challenge object
    challengeType,
    startingMoves,
    targetObjective,
    targetTile,
    targetCombo,
    targetScore } = levelChallenges[currentLevel];
  const currentTargetScore = +$('#score')[0].textContent + +targetScore;
  // resets/updates initial UI 
  $('#movesLeftOutput')[0].textContent = startingMoves + bonusMoves;
  $('#objectivesLeft')[0].textContent = 'times';
  $('#objectiveCount').show();
  $('#challengeObjective').show();
  $('#objectivesLeft').show();
  $('#remainingScore').show();

  // updates UI based on current levels challenge type
  switch (challengeType) {
    case 'tile':
      $('#remainingScore').hide();
      $('#challengeType')[0].textContent = 'Match';
      $('#objectiveCount')[0].textContent = targetObjective;
      $('#challengeObjective').addClass(targetTile);
      break;
    case 'combo':
      $('#remainingScore').hide();
      $('#challengeObjective').hide();
      $('#challengeType')[0].textContent = `Get a ${targetCombo} tile combo`;
      $('#objectiveCount')[0].textContent = targetObjective;
      break;
    case 'score':
      $('#challengeObjective').hide();
      $('#objectiveCount').hide();
      $('#objectivesLeft').hide();
      $('#challengeType')[0].textContent = `Get a score of ${currentTargetScore}`;
      $('#remainingScoreOutput')[0].textContent = targetScore;
      break;
  };
};

const nextLevel = (currentUser, totalLevelMoves = 0) => {
  clearInterval(timerInterval); // stops clock/timer
  const { savedGameData } = currentUser;
  const oldSavedGameData = savedGameData[currentGameMode];
  const { lastLevel, livesLeft, totalMoves } = oldSavedGameData;
  // regex matches only the digits and the '+' converts value back to a number
  let bonusTime = +$('#timerOutput')[0].textContent.toString().match(/\d/g).join('');
  let remainingMoves = +$('#movesLeftOutput')[0].textContent;
  const bonusMoves = Math.ceil(remainingMoves / 4);

  replayChallenge = false; //resets boolean for next level
  if (bonusTime > 30) bonusTime = 30; // limits max bonus time allowed

  // update UI
  $('#gameBoard').addClass('fadeElement');
  $('#boardOverlay').show(); // prevents user from clicking on gameboard
  $('#levelMenu').delay(400).fadeIn();
  $('#levelMenuHeading')[0].textContent = `Level ${lastLevel + 1} Complete!`;
  $('#levelButton')[0].textContent = 'Next level';
  // updates UI based on currentGameMode
  $('#levelStatsHeading')[0].textContent = (currentGameMode === 'timeMode')
    ? 'Bonus Time Awarded:'
    : 'Bonus Moves Awarded';
  $('#levelStatsOutput')[0].textContent = (currentGameMode === 'timeMode')
    ? `+${bonusTime} seconds`
    : bonusMoves;
  const updatedSavedGameData = { // create new updated game data
    lastLevel: lastLevel + 1,
    totalScore: +$(`#score`)[0].textContent,
    highestCombo: +$('#highestComboOutput')[0].textContent,
    totalMoves: totalMoves + totalLevelMoves,
    livesLeft,
    bonusTime,
    bonusMoves
  };
  // updates local storage, loggedInUser, and game stats
  currentUser.savedGameData[currentGameMode] = updatedSavedGameData;
  updateUser(currentUser);
  setGameStats(currentUser);
  loggedInUser = { ...currentUser };
};

// sets initial game stats
setGameStats(loggedInUser);