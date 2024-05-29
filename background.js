chrome.alarms.create('pomodoroTimer', {
  periodInMinutes: 1 / 60,
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'pomodoroTimer') {
    chrome.storage.local.get(['timer', 'isRunning'], (result) => {
      if (result.isRunning) {
        let timer = result.timer + 1;
        let isRunning = true;
        if (timer === 60 * 25) {
          this.registration.showNotification('Pomodoro Timer', {
            body: '25 Minutes has passed!',
            icon: 'icon.png',
          });
          timer = 0;
          isRunning = false;
        }
        chrome.storage.local.set({
          timer,
          isRunning,
        });
      }
    });
  }
});

chrome.storage.local.get(['timer', 'isRunning'], (result) => {
  chrome.storage.local.set({
    timer: 'timer' in result ? result.timer : 0,
    isRunning: 'isRunning' in result ? result.isRunning : false,
  });
});
