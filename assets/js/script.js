const btn = document.querySelector('#save-task');
const tasksToDo = document.querySelector('#tasks-to-do');
const formEl = document.querySelector('#task-form')

function taskFormHandler(e) {
    e.preventDefault();

    let taskNameInput = document.querySelector('input[name = "task-name"]').value;
    let taskTypeInput = document.querySelector('select[name = "task-type"]').value;
    if (!taskNameInput || !taskTypeInput) {
        alert('You need to fill out the task form!');
        return false;
    }

    formEl.reset();

    let taskDataObj = {
        name: taskNameInput,
        type: taskTypeInput
    }

    createTaskEl(taskDataObj);
};

function createTaskEl(taskDataObj) {
    let taskItemEl = document.createElement('li');
    taskItemEl.className = 'task-item';
    
    let taskInfoEl = document.createElement('div');
    taskInfoEl.className = 'task-info';
    
    taskInfoEl.innerHTML = `<h3 class = "task-name">${taskDataObj.name}</h3><span class = "task-type">${taskDataObj.type}</span>`;

    taskItemEl.appendChild(taskInfoEl);
    tasksToDo.appendChild(taskItemEl);
}

btn.addEventListener('click', taskFormHandler);