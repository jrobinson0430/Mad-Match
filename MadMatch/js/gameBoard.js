// generates a number range from 0-4
const randTileGenerator = () => Math.floor(Math.random() * 5);
const { updateUserScores } = scoresStorageHelper; // destructured method
const { gameOptions: { gameMode: currentGameMode, theme: usersColorTheme } } = loggedInUser;
let userChoice, timerInterval, selectedGameMode, gameTimer, boardArr = [], availableMove = false, endOfLevel = false;
const gameTilesLookup = { // lookup for the various tile styles
  math: ['plus', 'minus', 'divide', 'times', 'percent'],
  sports: ['soccer', 'basketball', 'football', 'softball', 'pool'],
  pattern: ['pattern1', 'pattern2', 'pattern3', 'pattern4', 'pattern5'],
  animals: ['cat', 'dog', 'fox', 'mouse', 'bear'],
  insects: ['ladybug', 'butterfly', 'caterpillar', 'spider', 'bee']
};

// // sets background color based on users game preferences
document.getElementsByTagName('body')[0].style.backgroundColor = usersColorTheme;

// constructor function to create initial tile objects
function CreateBoardTiles(num, gamePieces) {
  this.tile = 'tile' + num,
    this.gamePiece = gamePieces[randTileGenerator()],
    this.match = false
};

// creates a board specs object thats used to find game matches
const createBoardSpecs = () => {
  // reads the screen size to determine the total rows/columns
  const totalRows = Math.floor((window.innerHeight - 75) / 42) - 1;
  let totalColumns = Math.floor($('#gameBoard').innerWidth() / 42);
  totalColumns = (totalColumns > 27) ? 27 : totalColumns; // sets max # of columns to 27
  const totalTiles = totalColumns * totalRows;
  let topIndices = [], bottomIndices = [], leftIndices = [], rightIndices = [], topindex = 0, leftIndex = 0;
  let bottomIndex = totalTiles - 1;
  let rightIndex = totalColumns - 1;

  // set excluded top indices
  while (topindex < totalColumns) {
    topIndices.push(topindex);
    topindex++;
  };
  // set excluded bottom indices
  while (bottomIndex >= totalTiles - totalColumns) {
    bottomIndices.push(bottomIndex);
    bottomIndex--;
  };
  // set excluded left indices
  while (leftIndex < totalTiles) {
    leftIndices.push(leftIndex);
    leftIndex = leftIndex + totalColumns;
  };
  // set excluded right indices
  while (rightIndex < totalTiles) {
    rightIndices.push(rightIndex);
    rightIndex = rightIndex + totalColumns;
  };
  return { // board specs object utilized throughout the program
    totalColumns,
    totalTiles,
    excludedIndices: {
      topIndices,
      bottomIndices,
      leftIndices,
      rightIndices
    }
  };
};

const currentBoardSpecs = createBoardSpecs(); // sets the boards specs

// checks to make sure game isnt over due to no moves left
const availableMoveCheck = (boardSpecs, currentBoardArr) => {
  const { totalColumns, excludedIndices } = boardSpecs;
  const { rightIndices, bottomIndices } = excludedIndices;
  if (availableMove === true) return availableMove;
  currentBoardArr.forEach((element, idx) => {
    if (!rightIndices.includes(idx)) {
      if (element.gamePiece === currentBoardArr[idx + 1].gamePiece) {
        availableMove = true;
      };
    };
    if (!bottomIndices.includes(idx)) {
      if (element.gamePiece === currentBoardArr[idx + totalColumns].gamePiece) {
        availableMove = true;
      };
    };
  });
  return availableMove;
};

const createGameBoard = (boardSpecs, pieces) => {
  const tiles = pieces;
  const { totalTiles, totalColumns } = boardSpecs;
  let i = 0, rowNumber = 0, newBoardArr = [];
  while (i < totalTiles) { // populates arr with tile objects using constructor function
    newBoardArr = [...newBoardArr, new CreateBoardTiles(i, tiles)];
    i++;
  };
  // loops through newBoardArr and dynamically creates the gameboards HTML
  newBoardArr.map((element, idx) => {
    let tileId = 'tile' + idx;
    if ((idx % totalColumns === 0) && idx !== 0) {
      rowNumber++;
      $('#gameBoard').append(`
        <div class="row justify-content-center" id="row${rowNumber}"></div>
      `);
    };
    $(`#row${rowNumber}`).append(`
      <div class="tiles border border-dark ${element.gamePiece}" id="${tileId}"></div>
    `);
  });
  boardArr = [...newBoardArr]; // updates global variable
};

// listens for which tile the user clicks and updates the tile objects match property
// updates the global boardArr variable
const getUserChoice = (event, boardArrCopy) => {
  if (!event.target.id.includes('tile')) return;
  boardArrCopy.map(element => {
    if (event.target.id === element.tile) {
      userChoice = element;
      userChoice.match = true;
    };
  });
  boardArr = [...boardArrCopy];
};

// recursive function utilizes the board specs object and the tiles objects match property
// to determine which tiles are valid matches for the users current tile selection
const findCurrentMoveMatches = (boardSpecs, boardArrCopy) => {
  const { totalColumns, excludedIndices } = boardSpecs;
  const { leftIndices, rightIndices, topIndices, bottomIndices } = excludedIndices;
  let validMove = [];
  let newMatch = false;

  boardArrCopy.forEach((element, idx) => {
    if (element.match === true) {
      if (!leftIndices.includes(idx)) { // matches tiles to the left
        if (element.gamePiece === boardArrCopy[idx - 1].gamePiece) {
          if (boardArrCopy[idx - 1].match === false) {
            boardArrCopy[idx - 1].match = true;
            newMatch = true;
          };
        };
      };
      if (!rightIndices.includes(idx)) { // matches tiles to the right
        if (element.gamePiece === boardArrCopy[idx + 1].gamePiece) {
          if (boardArrCopy[idx + 1].match === false) {
            boardArrCopy[idx + 1].match = true;
            newMatch = true;
          };
        };
      };
      if (!topIndices.includes(idx)) { // matches tiles above
        if (element.gamePiece === boardArrCopy[idx - totalColumns].gamePiece) {
          if (boardArrCopy[idx - totalColumns].match === false) {
            boardArrCopy[idx - totalColumns].match = true;
            newMatch = true;
          };
        };
      };
      if (!bottomIndices.includes(idx)) { // matches tiles below
        if (element.gamePiece === boardArrCopy[idx + totalColumns].gamePiece) {
          if (boardArrCopy[idx + totalColumns].match === false) {
            boardArrCopy[idx + totalColumns].match = true;
            newMatch = true;
          };
        };
      };
    };
  });

  // checks to make sure userChoice is a valid move
  validMove = boardArrCopy.filter(element => element.match);
  if (validMove.length === 1) {
    userChoice.match = false;
    return;
  };

  // recursive: runs until all matches are found (newMatch boolean is false)
  if (newMatch) return findCurrentMoveMatches(currentBoardSpecs, boardArrCopy);
  boardArr = [...boardArrCopy]; // updates global variable
};

// creates a visual effect for tiles being removes from board
const matchedTilesEffect = (boardArrCopy) => {
  if (!event.target.id.includes('tile')) return false;
  const removePieces = boardArrCopy.filter(element => element.match);
  if (removePieces.length === 0) return false;
  $('#boardOverlay').show(); // prevents user from clicking while board updates
  removePieces.forEach(element => $(`#${element.tile}`).fadeOut(200));
  setTimeout(removePieces.forEach(element => $(`#${element.tile}`).fadeIn(100)), 150);
  return true;
};

const updateGameTilePositions = (boardSpecs, boardArrCopy) => {
  const { totalColumns } = boardSpecs;
  let newBoardArr = [...boardArrCopy];
  // gets all the tiles that need to be removed
  const removePieces = newBoardArr.filter(element => element.match);
  if (!removePieces.length) return; // prevents running if no matches
  updateGameStats(removePieces, removePieces[0].gamePiece, loggedInUser);

  removePieces.forEach(element => {
    // formats the tile property value in order to utilize corresponding number as an index
    let idx = parseInt(element.tile.replace(/[tile]/g, ''));

    // updates the tiles objects with the tile directly above the tile being removed
    // until it reaches the top of the board and moves to the next tile to be removed
    while (idx >= totalColumns) {
      newBoardArr[idx] = { ...newBoardArr[idx], gamePiece: newBoardArr[idx - totalColumns].gamePiece };
      idx = idx - totalColumns;
    };

    // sets the gamePiece property value to null so they can be repopulated with new tiles
    if (idx < totalColumns) {
      newBoardArr[idx] = { ...newBoardArr[idx], gamePiece: newBoardArr[idx].gamePiece = null };
    };
  });
  boardArr = [...newBoardArr]; // updates global array
};

// updates the tile and match properties of the tile objects
// and updates the game board
const replaceGameTiles = (boardArrCopy) => {
  const newBoard = boardArrCopy.map(element => {
    const removeClasses = $(`#${element.tile}`)[0].className;
    $(`#${element.tile}`).removeClass(removeClasses);
    $(`#${element.tile}`).addClass(`tiles border border-dark ${element.gamePiece}`);
    return { ...element, match: false };
  });
  boardArr = [...newBoard]; // updates global array
};

// generates new tile pieces to replace removed tiles
// and updates the game board
const replaceEmptyGameTiles = (gamePieces, boardArrCopy) => {
  const newBoardArr = boardArrCopy.map((element) => {
    if (element.gamePiece === null) {
      element.gamePiece = gamePieces[randTileGenerator()];
      $(`#${element.tile}`).addClass(`tiles border border-dark ${element.gamePiece}`);
    };
    return element;
  });
  availableMove = false;
  boardArr = [...newBoardArr];
};

// sets timer interval and initial timer direction based on current game mode
const setTimerInterval = () => {
  gameTimer.displayTime();
  timerInterval = setInterval(() => {
    currentGameMode === 'timeMode'
      ? gameTimer.decrement()
      : gameTimer.increment();
    gameTimer.displayTime();
  }, 1000);
};

// set time mode clock based on current level
const calculateStartTime = (currentUser) => {
  const { savedGameData: { timeMode } } = currentUser;
  const { lastLevel, bonusTime } = timeMode;
  const currentLevel = lastLevel + 1;
  const secondsLookup = {
    0: 45, 1: 60, 2: 75, 3: 90, 4: 105, 5: 120, 6: 135, 7: 150, 8: 165,
    9: 180, 10: 195, 11: 210, 12: 225, 13: 240, 14: 255, 15: 270, 16: 285
  };
  const totalSeconds = (currentLevel <= 85)
    ? secondsLookup[Math.floor(currentLevel / 5)]
    : 300;
  return totalSeconds + bonusTime;
};

const updateGameStats = (removePiecesArr, tileTypeRemoved, currentUser) => {
  if (!availableMoveCheck(currentBoardSpecs, boardArr)) return processFailedLevel(currentUser);
  const $highestCombo = $('#highestComboOutput')[0];
  const totalTilesRemoved = removePiecesArr.length;
  const pointsEarned = Math.ceil(Math.pow(totalTilesRemoved, 3) / 6);
  const oldScore = +$('#score')[0].textContent;
  const totalScore = oldScore + pointsEarned;
  const highestCombo = (totalTilesRemoved > +$highestCombo.textContent)
    ? totalTilesRemoved
    : +$highestCombo.textContent;
  // updates UI game stats
  $('#score')[0].textContent = totalScore;
  $highestCombo.textContent = highestCombo;
  switch (currentGameMode) { // updates game specific information
    case 'timeMode':
      const { savedGameData: { timeMode } } = currentUser;
      const targetScore = +$('#targetOutput')[0].textContent;
      // exponential equation to calculate the next levels target score
      const nextLevelTargetScore = Math.pow((timeMode.lastLevel + 2) * 10, 2);
      // sets a max score based on current and next target scores
      const maxLevelScore = (nextLevelTargetScore - targetScore) / 2 + targetScore;
      if (totalScore >= targetScore) { // triggers end of level
        // prevents user from skipping levels when total score exceeds next level target score
        $('#score')[0].textContent = (totalScore > maxLevelScore)
          ? maxLevelScore
          : totalScore;
        endOfLevel = true;
        return nextLevel(currentUser);
      };
      break;
    case 'challengeMode':
      updateChallenge(pointsEarned, totalTilesRemoved, tileTypeRemoved, currentUser);
      if (+$('#movesLeftOutput')[0].textContent === 0) { // when level is failed
        endOfLevel = true; // used to toggle board overlay
        replayChallenge = true; // indicates level needs to be replayed
        return processFailedLevel(currentUser);
      };
      break;
  };
  endOfLevel = false;
};

const processFailedLevel = (currentUser) => {
  const oldSavedGameData = currentUser.savedGameData[currentGameMode];
  const updatedLives = oldSavedGameData.livesLeft - 1;
  // decrements livesLeft/resets object if game is over, resets the entire object
  const newSavedGameData = (updatedLives > 0)
    ? { ...oldSavedGameData, livesLeft: updatedLives }
    : {
      lastLevel: 0, totalScore: 0, livesLeft: 3, bonusTime: 0,
      highestCombo: 0, totalMoves: 0, bonusMoves: 0
    };
  // updates local storage and loggedInUser
  currentUser.savedGameData[currentGameMode] = newSavedGameData;
  updateUser(currentUser);
  loggedInUser = { ...currentUser };
  if (updatedLives === 0) { // triggers game over functionality
    if (+oldSavedGameData.totalScore !== 0) { // prevents scores of 0 from being saved
      const score = {
        gameMode: currentGameMode,
        level: +oldSavedGameData.lastLevel + 1,
        userName: currentUser.userName,
        score: +oldSavedGameData.totalScore,
        highestCombo: +oldSavedGameData.highestCombo,
        totalMoves: +oldSavedGameData.totalMoves
      };
      updateUserScores(score, existingHighScores);
    };
    // update UI when player runs out of lives
    $('#levelMenuHeading')[0].textContent = `Game Over!!`;
    $('#levelButton')[0].textContent = 'Start Level One';
    $('#levelStatsHeading')[0].textContent = 'Levels Completed:';
    $('#levelStatsOutput')[0].textContent = `${oldSavedGameData.lastLevel + 1}`;
    replayChallenge = false;
  } else { // updates UI when player fails level
    $('#levelMenuHeading')[0].textContent = `Level ${oldSavedGameData.lastLevel + 1} Failed!`;
    $('#levelButton')[0].textContent = 'Replay Level';
    $('#levelStatsHeading')[0].textContent = 'Lives Left:';
    $('#levelStatsOutput')[0].textContent = updatedLives;
  };

  $('#boardOverlay').fadeIn();
  $('#levelMenu').delay(400).fadeIn();
  $('#gameBoard').addClass('fadeElement');
  setGameStats(currentUser); // resets level stats
  if (currentGameMode !== 'challengeMode') gameTimer.displayTime(); // updates timer on UI
};

const updateChallenge = (score, combo, removedTile, user) => {
  const { savedGameData } = user;
  const currentLevel = savedGameData[currentGameMode].lastLevel + 1;
  const bonusMoves = savedGameData.challengeMode.bonusMoves;
  const { challengeType, targetTile, startingMoves, targetCombo } = levelChallenges[currentLevel];
  const $objectiveCount = $('#objectiveCount')[0];
  const remainingObjective = $objectiveCount.textContent - 1;
  const $remainingScore = $('#remainingScoreOutput')[0];
  $('#movesLeftOutput')[0].textContent -= 1;
  const movesMade = (startingMoves + bonusMoves) - $('#movesLeftOutput')[0].textContent;

  // determines when challenge is completed based on challenge type
  switch (challengeType) {
    case 'tile':
      if (removedTile === targetTile) {
        $objectiveCount.textContent = `${remainingObjective}`;
        if (remainingObjective === 0) {
          $('#challengeObjective').removeClass(targetTile);
          return nextLevel(user, movesMade);
        };
      };
      break;
    case 'combo':
      if (combo === targetCombo) {
        $objectiveCount.textContent = `${remainingObjective}`;
        if (remainingObjective === 0) {
          return nextLevel(user, movesMade);
        };
      };
      break;
    case 'score':
      $remainingScore.textContent = $remainingScore.textContent - score;
      if ($remainingScore.textContent <= 0) return nextLevel(user);
      break;
  };
  if ($objectiveCount.textContent > 1) {
    $('#objectivesLeft')[0].textContent = 'times'
  } else {
    $('#objectivesLeft')[0].textContent = 'more time';
  }
};

// prevents user from refreshing/closing page in order to avoid failing a level
const preventCheating = () => {
  if (currentGameMode === 'freePlayMode') { // specific to freePlayMode
    if (+$('#score')[0].textContent > 0) {
      const freePlayScore = {
        gameMode: currentGameMode,
        level: null,
        userName: loggedInUser.userName,
        score: +$('#score')[0].textContent,
        time: $('#timerOutput')[0].textContent.toString().match(/\d/g).join(''),
        highestCombo: +$('#highestComboOutput')[0].textContent
      };
      updateUserScores(freePlayScore, existingHighScores);
    };
    return location.assign('gameHome.html');
  };

  const { savedGameData } = loggedInUser;
  const currentLevel = savedGameData[currentGameMode].lastLevel + 1;
  const bonusMoves = savedGameData.challengeMode.bonusMoves;
  const { startingMoves } = levelChallenges[currentLevel];
  const totalMoves = bonusMoves + startingMoves;
  const [currentMins, currentSecs] = $('#timerOutput')[0].textContent.split(':');
  const currentTime = ((+currentMins * 60) + +currentSecs);
  const startTime = calculateStartTime(loggedInUser);
  // conditions to determine if user is penalized for refreshing or navigating
  // away from page
  switch (currentGameMode) {
    case 'timeMode':
      if (currentTime < startTime) {
        processFailedLevel(loggedInUser);
      };
      break;
    case 'challengeMode':
      if (+$('#movesLeftOutput')[0].textContent < totalMoves) {
        processFailedLevel(loggedInUser);
      };
      break;
  };
  return location.assign('gameHome.html');
};

const processGameBoard = () => { // groups board related functions together
  if (!availableMoveCheck(currentBoardSpecs, boardArr)) return processFailedLevel(loggedInUser);
  getUserChoice(event, boardArr);
  findCurrentMoveMatches(currentBoardSpecs, boardArr);
  if (!matchedTilesEffect(boardArr)) return; // stops board processing when theres no matches
  setTimeout(() => { // waits for board animation to complete
    updateGameTilePositions(currentBoardSpecs, boardArr);
    replaceGameTiles(boardArr);
    replaceEmptyGameTiles(gameTilesLookup[loggedInUser.gameOptions.tiles], boardArr);
    if (!endOfLevel) $('#boardOverlay').hide();
  }, 200);
};

//=======================utility display functions==========================//
const startGame = () => {
  // starts the clock for time and freeplay modes
  if (currentGameMode !== 'challengeMode') setTimerInterval();
  $('#mainBoardMenu').fadeOut();
  $('#pauseButton').fadeIn();
  setTimeout(() => {
    $('#gameBoard').removeClass('fadeElement');
    $('#boardOverlay').hide();
  }, 500);
};

const pauseGame = () => {  
  clearInterval(timerInterval); // stops the clock when game is paused
  $('#playButton')[0].textContent = 'Resume';
  $('#gameBoard').addClass('fadeElement');
  $('#pauseButton').fadeOut();
  $('#mainBoardMenu').fadeIn();
  $('#boardOverlay').show();
};

const beginNextLevel = () => {
  // starts the clock for time and freeplay modes
  if (currentGameMode !== 'challengeMode') setTimerInterval();
  $('#levelMenu').fadeOut();
  setTimeout(() => {
    $('#gameBoard').removeClass('fadeElement');
    $('#boardOverlay').hide();
  }, 500);
};

const processInstructionsButton = () => {
  // updates instructions based on game mode selected
  const instructions = (currentGameMode === 'timeMode')
    ? 'Complete the level by reaching the target score before time runs out! If you fail, you will lose a life. The game is over when all lives are lost.'
    : (currentGameMode === 'challengeMode')
      ? `Complete the level by successfully reaching the objective displayed on the right side of the game stats box before you run out of moves. If you fail, you will lose a life. The game is over when all lives are lost.`
      : '';

  $('#instructionsOutput')[0].textContent = instructions;
  displayMenu('mainBoardMenu', 'instructionsMenu');
};

// creates the game board
createGameBoard(currentBoardSpecs, gameTilesLookup[loggedInUser.gameOptions.tiles]);

//========================Event Listeners========================//
$('#gameBoard').on('click', processGameBoard);
$('#playButton').on('click', startGame);
$('#levelButton').on('click', beginNextLevel);
$('#pauseButton').on('click', pauseGame);
$('#cancelButton').on('click', () => displayMenu('quitMenu', 'mainBoardMenu'));
$('#quitButton').on('click', () => displayMenu('mainBoardMenu', 'quitMenu'));
$('#instructionsButton').on('click', processInstructionsButton);
$('#instructionsMenuBackBtn').on('click', () => displayMenu('instructionsMenu', 'mainBoardMenu'));
$('#levelMenuBackBtn').on('click', () => location.assign('gameHome.html'));
$('#confirmButton').on('click', () => preventCheating());

window.onbeforeunload = () => preventCheating();
