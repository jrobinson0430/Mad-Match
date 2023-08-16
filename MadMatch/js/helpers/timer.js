//===================Singleton Timer========================//
// increment and decrement are used depending on which game mode is currently running
const timer = (startTime = 0) => {
  let minutes = Math.floor(startTime / 60);
  let seconds = startTime % 60;
  return {
    displayTime() {
      // triggers end of level
      if (minutes === 0 && seconds === 0 && currentGameMode !== 'freePlayMode') {
        $('#boardOverlay').show();
        clearInterval(timerInterval);
        processFailedLevel(loggedInUser); // called when user runs out of time in timeMode
      };
      (seconds < 10) // updates UI
        ? $('#timerOutput').empty().append(`${minutes}:0${seconds}`)
        : $('#timerOutput').empty().append(`${minutes}:${seconds}`);
    },
    increment() {
      seconds += 1;
      if (seconds === 60) {
        minutes += 1;
        seconds = 0;
      };
    },
    decrement() {
      if (seconds === 0) {
        minutes -= 1;
        seconds = 60;
      };
      seconds -= 1;
    }
  };
};
