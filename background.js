chrome.alarms.create('pomodoroTimer', {
  periodInMinutes: 1 / 60,
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'pomodoroTimer') {
    chrome.storage.local.get(['timer', 'isRunning'], (result) => {
      if (result.isRunning) {
        let timer = result.timer + 1;
        console.log(timer);
        chrome.storage.local.set({
          timer,
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
