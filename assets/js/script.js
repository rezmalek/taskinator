const btn = document.querySelector('.btn');
const tasksToDo = document.querySelector('#tasks-to-do');

function taskHandler() {
    let taskItem = document.createElement('li');
    taskItem.textContent = 'This is a new task';
    taskItem.className = 'task-item';
    tasksToDo.appendChild(taskItem);
};

btn.addEventListener('click', taskHandler);