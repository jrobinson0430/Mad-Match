// handles form validation to prevent duplicate accounts
// and creates new users game object
const processNewUser = (event) => {
  event.preventDefault();
  const form = event.target;
  const [validEmail] = existingUsers.filter(user => user.email === form.email.value);
  const [validUserName] = existingUsers.filter(user => user.userName === form.userName.value);
  $('#registeredEmailAlert').slideUp(800);
  $('#existingUserNameAlert').slideUp(800);
  if (validEmail) return $('#registeredEmailAlert').slideDown(500);
  if (validUserName) return $('#existingUserNameAlert').slideDown(500);
  const user = { // populates data object used in local storage
    userName: form.userName.value,
    email: form.email.value,
    password: form.password.value,
    isLoggedIn: true,
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
  createNewUser(user); // sets new user into local Storage existing users object
  // creates the new users scoring object and sets into existing high scores object
  createUserScoreObject([form.userName.value], existingHighScores);
  return location.assign(location.pathname.replace('index.html', 'html/gameHome.html'));
};

// switches out menus and resets the form
const processCreateAccnMenuBackBtn = () => {
  displayMenu('createAccountMenu', 'landingMenu');
  setTimeout(() => $('#createAccForm')[0].reset(), 400);
  $('#registeredEmailAlert').slideUp(500);
  $('#existingUserNameAlert').slideUp(500);
};

// event listeners
$('#createAccForm').on('submit', processNewUser); // listens for form submits
// listens for back button click
$('#createAccountMenuBackBtn').on('click', () => processCreateAccnMenuBackBtn());
