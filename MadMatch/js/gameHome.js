// prevents user from navigating to game home without being logged in
if (!loggedInUser) location.assign(location.pathname.replace('html/gameHome.html', 'index.html'));
const { updateUser } = userStorageHelper; // destructured method
$('#gameHomeUserMessage')[0].textContent = `Welcome ${loggedInUser.userName}!`;

// toggles game title based on background color
const updateGameTitle = (theme) => {
  const themeLookup = ['rgb(220, 53, 69)', 'lightcoral', 'chocolate'];
  if (themeLookup.includes(theme)) {
    $('.gameTitle').removeClass('gameTitleRed-js');
    $('.gameTitle').addClass('gameTitleWhite-js');
  } else {
    $('.gameTitle').removeClass('gameTitleWhite-js');
    $('.gameTitle').addClass('gameTitleRed-js');
  };
};
updateGameTitle(loggedInUser.gameOptions.theme);

// updates background color when user's game preferences are changed
const changeColorTheme = () => {
  const newTheme = event.target.value
  $('body')[0].style.backgroundColor = newTheme;
  updateGameTitle(newTheme)
}

// updates tile previews in game preferences menu
const updateTileDisplayContainer = () => {
  const currentSelection = event.target.value;
  const previewTiles = gameTilesLookup[currentSelection];
  $('#tileDisplayContainer').empty();

  // dynamically updates preview tile container  
  previewTiles.map(tile => $('#tileDisplayContainer')
    .append(`<div class='tiles border ${tile}'></div>`));
};

// updates users game preferences
const processGameOptionsForm = (currentUser) => {
  event.preventDefault();
  const form = event.target;
  const { gameOptions } = currentUser;
  // updates game options object
  gameOptions.tiles = `${form.tileChoice.value}`;
  gameOptions.theme = `${form.colorTheme.value}`;  
  updateUser(currentUser); // updates local storage
  loggedInUser = currentUser; // updates global object
  // updates UI
  displayMenu('optionsMenu', 'mainMenu');
  setTimeout(() => form.reset(), 400);
};

// sets the game mode variable and toggles a css class for visual effect
const setGameMode = () => {
  if (selectedGameMode) $(`#${selectedGameMode}`).removeClass('highlight-js');
  selectedGameMode = event.target.id;
  $(`#${selectedGameMode}`).addClass('highlight-js');
  $('#startGameButton').slideDown(500); // displays button
};

// displays screen overlay
const toggleGameHomeOverlay = () => {
  if (window.innerWidth < 450) {
    $('#gameHomeOverlayContainer').show();
    return true;
  };
  return false;
};

const updateGameMode = (currentUser) => {
  // updates local storage with currently selected game mode
  currentUser.gameOptions.gameMode = selectedGameMode;
  updateUser(currentUser);
  // checks screen width size to determine if landscape mode is needed
  if (toggleGameHomeOverlay()) return;
  location.assign('gameBoard.html');
};

const adjustScreenSize = () => {
  if (window.innerWidth > 450) {
    if (selectedGameMode) $(`#${selectedGameMode}`).removeClass('highlight-js');
    $('#startGameButton').hide();
    $('#gameHomeOverlayContainer').hide();
  };
};

// displays main menu
const processPreferencesMenuBackBtn = () => {
  const currentTheme = loggedInUser.gameOptions.theme
  displayMenu('optionsMenu', 'mainMenu');
  // resets background color to users last saved theme preference
  setTimeout(() => {
    $('#optionsMenu')[0].reset();
    $('body')[0].style.backgroundColor = currentTheme;
    updateGameTitle(currentTheme);
  }, 400);
};

// displays game preferences menu
const displayGamePreferencesMenu = () => {
  const defaultTiles = gameTilesLookup.sports;
  displayMenu('mainMenu', 'optionsMenu');
  $('#tileDisplayContainer').empty();
  // appends default preview tiles to preview container
  defaultTiles.map(tile => $('#tileDisplayContainer')
    .append(`<div class='tiles border ${tile}'></div>`));
};

const processGameModeMenuBackBtn = () => {
  // clears highlight-js class from buttons
  if (selectedGameMode) $(`#${selectedGameMode}`).removeClass('highlight-js');
  displayMenu('gameModeMenu', 'mainMenu');
  $('#startGameButton').fadeOut();
};

// updates local storage and navigates to landing page
const logOut = (currentUser) => {
  currentUser.isLoggedIn = false;
  updateUser(currentUser);
  location.assign(location.pathname.replace('html/gameHome.html', 'index.html'));
};

// Event Listeners
$('#optionsMenu').on('submit', () => processGameOptionsForm(loggedInUser));
$('#optionsButton').on('click', displayGamePreferencesMenu);
$('#userColorOptions').on('change', changeColorTheme);
$('#usersTileOptions').on('click', 'input', updateTileDisplayContainer);
$('#gameModeButtonContainer').on('click', 'button', setGameMode);
$('#startGameButton').on('click', () => updateGameMode(loggedInUser));
$('.logoutButton').on('click', () => logOut(loggedInUser));
$('#gameModeMenuBackBtn').on('click', processGameModeMenuBackBtn);
// displays the relevent menus based on user clicks
$('#gameModeButton').on('click', () => displayMenu('mainMenu', 'gameModeMenu'));
$('#gameModeMenuHelpBtn').on('click', () => displayMenu('gameModeMenu', 'gameModeHelpMenu'));
$('#gameModeHelpBackBtn').on('click', () => displayMenu('gameModeHelpMenu', 'gameModeMenu'));
$('#leaderBoardMenuHelpBtn').on('click',() => displayMenu('leaderBoardMenu', 'leaderBoardHelpMenu'));
$('#leaderBoardHelpBackBtn').on('click',() => displayMenu('leaderBoardHelpMenu', 'leaderBoardMenu'));
$('#gamePreferenceHelpBtn').on('click',() => displayMenu('optionsMenu', 'gamePreferencesHelpMenu'));
$('#gamePreferencesHelpBackBtn').on('click',() => displayMenu('gamePreferencesHelpMenu', 'optionsMenu'));
$('#gamePreferenceMenuBackBtn').on('click', processPreferencesMenuBackBtn);

window.onresize = () => adjustScreenSize(); // listens for window size change
