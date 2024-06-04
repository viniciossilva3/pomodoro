let tasks = [];

function updateTime() {
  chrome.storage.local.get(['timer', 'timeOption'], (result) => {
    const time = document.getElementById('time');
    const minutes = `${
      result.timeOption - Math.ceil(result.timer / 60)
    }`.padStart(2, '0');
    let seconds = '00';
    if (result.timer % 60 !== 0) {
      seconds = `${60 - (result.timer % 60)}`.padStart(2, '0');
    }
    time.textContent = `${minutes}:${seconds}`;
  });
}
updateTime();
setInterval(updateTime, 1000);

const startTimerBtn = document.getElementById('start-timer-btn');
startTimerBtn.addEventListener('click', () => {
  chrome.storage.local.get(['isRunning'], (result) => {
    chrome.storage.local.set(
      {
        isRunning: !result.isRunning,
      },
      () => {
        startTimerBtn.textContent = !result.isRunning
          ? 'Pause Timer'
          : 'Start Timer';
      }
    );
  });
});

const resetTimerBtn = document.getElementById('reset-timer-btn');
resetTimerBtn.addEventListener('click', () => {
  chrome.storage.local.set(
    {
      timer: 0,
      isRunning: false,
    },
    () => {
      startTimerBtn.textContent = 'Start Timer';
    }
  );
});

const addTaskBtn = document.getElementById('add-task-btn');
addTaskBtn.addEventListener('click', () => addTask());

chrome.storage.sync.get(['tasks'], (result) => {
  tasks = result.tasks ? result.tasks : [''];
  renderTasks();
});

function saveTasks() {
  chrome.storage.sync.set({
    tasks,
  });
}

function renderTask(taskNum) {
  const taskRow = document.createElement('div');

  const text = document.createElement('input');
  text.type = 'text';
  text.placeholder = 'Enter a task...';
  text.value = tasks[taskNum];
  text.addEventListener('change', () => {
    tasks[taskNum] = text.value;
    saveTasks();
  });

  const deleteBtn = document.createElement('input');
  deleteBtn.type = 'button';
  deleteBtn.value = 'X';
  deleteBtn.addEventListener('click', () => {
    deleteTask(taskNum);
  });

  taskRow.appendChild(text);
  taskRow.appendChild(deleteBtn);

  const taskContainer = document.getElementById('task-container');
  taskContainer.appendChild(taskRow);
}

function addTask() {
  const taskNum = tasks.length;
  tasks.push('');
  renderTask(taskNum);
  saveTasks();
}

function deleteTask(taskNum) {
  tasks.splice(taskNum, 1);
  renderTasks();
  saveTasks();
}

function renderTasks() {
  const taskContainer = document.getElementById('task-container');
  taskContainer.textContent = '';
  tasks.forEach((taskText, taskNum) => {
    renderTask(taskNum);
  });
}
