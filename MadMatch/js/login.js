// destructured method
const { updateUser } = userStorageHelper;

const processLogin = (event) => {
  event.preventDefault();
  const form = event.target;
  // verifies form inputs with users in local storage
  const [validatedUser] = existingUsers.filter(user =>
    user.userName === form.userName.value
    && user.password === form.password.value);
    
  if (validatedUser) { // updates user object property
    validatedUser.isLoggedIn = true;
    updateUser(validatedUser);
  } else { // alerts user if login information is wrong
    return $('#invalidLoginAlert').slideDown(500);
  };


  // navigates to games home
  return location.assign(location.pathname.replace('index.html', 'html/gameHome.html'));
}

// switches out menus and resets the form
const processLoginMenuBackBtn = () => {
  displayMenu('loginMenu', 'landingMenu');
  setTimeout(() => $('#loginForm')[0].reset(), 400);
  $('#invalidLoginAlert').slideUp(500);  
};

// event listeners
$('#loginForm').on('submit', processLogin); // listens for form submission
// listens for back button click
$('#loginMenuBackBtn').on('click', () => processLoginMenuBackBtn());
