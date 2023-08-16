


  // redirects user to game home if already logged in
  if(loggedInUser && location.pathname.includes('index.html')) {
    location.assign(location.pathname.replace( 'index.html', 'html/gameHome.html'));
  };
  console.log($('#landingMenu'))
  
  // adds a visual effect when switching between menus
  const displayMenu = (fadeOut, fadeIn) => {
  
    $(`#${fadeOut}`).fadeOut();
    $(`#${fadeIn}`).delay(400).fadeIn();
  };
  
  // event listeners that switch between the various menus based on user clicks
  $('#loginButton').on('click', () => displayMenu('landingMenu', 'loginMenu'));
  $('#createAccountButton').on('click', () => displayMenu('landingMenu', 'createAccountMenu'));
  $('#aboutUsButton').on('click', () => displayMenu('landingMenu', 'aboutUsMenu'));
  $('#aboutUsBackBtn').on('click', () => displayMenu('aboutUsMenu', 'landingMenu'));
