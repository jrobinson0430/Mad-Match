const { tiles, currentMode } = loggedInUser.gameOptions;
// index 0 set to null in order for level to match array index
let levelChallenges = [null];

// constructor function for created challenges
function Challenge(challengeType, targetObjective, targetScore, targetCombo, startingMoves) {
  this.challengeType = challengeType,
  this.targetTile = gameTilesLookup[tiles][randTileGenerator()],
  this.targetObjective = targetObjective,
  this.targetScore = targetScore
  this.targetCombo = targetCombo
  this.startingMoves = startingMoves
};

// IIFE creates challenge objects and populates level challenge array
const createChallenges = (() => {
  const challengeTypeLookup = ['tile', 'combo', 'score'];
  const comboNumberlookup = [2, 3, 4, 5];
  let level = 1, idx = 0, targetCombo, comboIdx = 0, targetObjective = 5, startingMoves = 30;
  while (level < 100) { // creates 100 levels
    let targetScore = Math.floor(Math.pow((level / 3) * 10, 2));
    let challengeType = challengeTypeLookup[idx];
    if (level % 5 === 0) {
      targetObjective += 5;
      startingMoves += 5;
    };
    if (challengeType === 'combo') { // sets challenge specific properties
      targetCombo = comboNumberlookup[comboIdx];
      comboIdx++;
    } else {
      targetCombo = null;
    };
    // resets counters
    if (comboIdx === 4) comboIdx = 0;
    if (idx === 2) idx = 0;

    // spreads objects into level challenge array
    levelChallenges = [
      ...levelChallenges,
      new Challenge(challengeType, targetObjective, targetScore, targetCombo, startingMoves)
    ];
    idx++;
    level++;
  };
})();