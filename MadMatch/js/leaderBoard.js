// uses a lookup to add commas to score in order to display in UI
const formatScore = (number) => {
  let str = number.toString(), result = '';
  const formatLookup = {
    2: '**', 3: '***', 4: '*,***', 5: '**,***',
    6: '***,***', 7: '*,***,***', 8: '**,***,***',
    9: '***,***,***', 10: '*,***,***,***'
  };
  const format = formatLookup[str.length];
  for (let i = 0, j = 0; i < format.length && j < str.length; i++) {
  result += format.charAt(i)=='*' ? str.charAt(j++) : format.charAt(i);
  };
  return result;
};

const displayHighScores = (sortBy = 'score') => { // default value set for initial board
  const leaderBoardType = $('#leaderBoardType')[0].value;
  const mode = $('#leaderBoardGameMode')[0].value;
  // when leaderBoardType is 'global', filters through existingHighScores values,
  // then maps through the objects and flattens array into one dimension.
  // Otherwise variable is set to specific users high scores
  const allScores = (leaderBoardType === 'Global')
    ? Object.values(existingHighScores).map(obj => obj[mode]).flat()
    : existingHighScores[loggedInUser.userName][mode];
  // sorts scores objects from high to low depending on the argument passed in
  const filteredScores = (sortBy === 'totalMoves')
    ? allScores.sort((b, a) => a[sortBy] < b[sortBy] ? 1 : -1)
    : allScores.sort((a, b) => a[sortBy] < b[sortBy] ? 1 : -1);
  let rank = 1;
  // only allows top 10 scores objects to be printed to UI
  if (filteredScores.length > 10) filteredScores.length = 10;
  $('#leaderBoardMenu').fadeOut(300);
  setTimeout(() => { // delays UI for visual effect
    // resets the categories visibility
    $('#leaderBoardOutput').empty();
    $('#levelCategory').show();
    $('#totalTime').show();
    $('#totalMoves').show();
    // prints personalized message to UI
    $('#leaderBoardsHeading')[0].textContent = leaderBoardType === 'Personal'
      ? `${loggedInUser.userName}'s Leader Board`
      : 'Global Leader Boards';

    switch (mode) { // hides categories based on mode selected
      case 'freePlayMode':
        $('#levelCategory').hide();
        $('#totalMoves').hide();
        break;
      case 'timeMode':
        $('#totalTime').hide();
        $('#totalMoves').hide();
        break;
      case 'challengeMode':
        $('#totalTime').hide();
        break;
    };

    // loops through scores objects and dynamically creates leaderboards
    filteredScores.map(obj => {
      const { time, userName, score, level, totalMoves, highestCombo } = obj;
      const formattedScore = formatScore(score);
      const formattedTime = (!time)
        ? null
        : time.length < 4
          ? `${time.slice(0, 1)}:${time.slice(1)}`
          : `${time.slice(0, 2)}:${time.slice(2)}`;

      // populate leaderboard UI
      $('#leaderBoardOutput').append(`
        <tr class="text-center">
        <th scope="row">${rank}</th>
        <td>${userName}</td>
        <td>${formattedScore}</td>
        <td class='levelData'>${level}</td>
        <td class='movesData'>${totalMoves}</td>
        <td class='timeData'>${formattedTime}</td>
        <td>${highestCombo}</td>
        </tr>
      `);
      // toggles table data categories depending on mode selected
      time ? $('.timeData').show() : $('.timeData').hide();
      level ? $('.levelData').show() : $('.levelData').hide();
      totalMoves ? $('.movesData').show() : $('.movesData').hide();
      rank++;
    });
  }, 350);
  $('#leaderBoardMenu').fadeIn();
};

displayHighScores(); // called to set initial default leaderboard
$('#leaderBoardMenu').hide(); // keeps menu hidden on page load

// updates leaderboard with users selected category sorted
$('#categorySortContainer').on('click', 'th', (event) => {
  const sort = event.currentTarget.dataset.sort;
  if (sort) displayHighScores(sort);
});

const displayLeaderBoards = () => {
  // checks screen width size to determine if landscape mode is needed
  if (toggleGameHomeOverlay()) return;
  displayMenu('mainMenu', 'leaderBoardMenu');
};

// updates board whenever leaderboard specs change
$('#leaderBoardSpecs').on('change', () => displayHighScores());
$('#leaderBoardButton').on('click', () => displayLeaderBoards());
$('#leaderBoardMenuBackBtn').on('click', () => displayMenu('leaderBoardMenu', 'mainMenu'));
