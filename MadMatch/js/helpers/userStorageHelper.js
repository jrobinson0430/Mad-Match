// IFFE sets existingUsers array on page load
const existingUsers = ((window) => {
  if (window) { // grabs registered users from local storage
    if (localStorage.getItem('users')) {
      return JSON.parse(localStorage.getItem('users'));
    } else { // creates the users
      localStorage.setItem('users', JSON.stringify([]));
      return [];
    };
  };
})(window);

let loggedInUser = existingUsers.filter(user => user.isLoggedIn)[0];

const userStorageHelper = {
  createNewUser: (newUser) => {
    const [userExists] = existingUsers.filter(existingUser => existingUser.email === newUser.email);
    if (userExists) return `${newUser.email} already registered. Please try a different email.`;
    if (!userExists) {
      existingUsers.push(newUser);
      localStorage.setItem('users', JSON.stringify(existingUsers)); // update local storage
      return newUser;
    };
  },
  updateUser: (updatedUser) => { // matches unique email and replaces objects
    existingUsers.map((user, idx) => {
      if (updatedUser.email === user.email) {
        existingUsers[idx] = updatedUser;
      };
    });
    // resets local storage with updated information
    localStorage.setItem('users', JSON.stringify(existingUsers));
    return updatedUser;
  },
  getLoggedInUser: () => {
    return existingUsers.filter(user => user.isLoggedIn)[0];
  }
};
