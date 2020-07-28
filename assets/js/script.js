const btn = document.querySelector('#save-task');
const tasksToDo = document.querySelector('#tasks-to-do');
const formEl = document.querySelector('#task-form');
const pageContentEl = document.querySelector('.page-content');
const tasksInProgressEl = document.querySelector('#tasks-in-progress'); 
const tasksCompletedEl = document.querySelector('#tasks-completed');
let taskIdCounter = 0;
let tasks = [];

function taskFormHandler(e) {
    e.preventDefault();

    let taskNameInput = document.querySelector('input[name = "task-name"]').value;
    let taskTypeInput = document.querySelector('select[name = "task-type"]').value;
    if (!taskNameInput || !taskTypeInput) {
        alert('You need to fill out the task form!');
        return false;
    };

    formEl.reset();

    let isEdit = formEl.hasAttribute('data-task-id');

    if (isEdit) {
        let taskId = formEl.getAttribute('data-task-id');
        completeEditTask(taskNameInput, taskTypeInput, taskId);
    } else {
        let taskDataObj = {
            name: taskNameInput,
            type: taskTypeInput,
            status: 'to do'
        }
        createTaskEl(taskDataObj);
    }
};

function createTaskEl(taskDataObj) {
    let taskItemEl = document.createElement('li');
    taskItemEl.setAttribute('data-task-id', taskIdCounter);
    taskItemEl.setAttribute('draggable', 'true');
    taskItemEl.className = 'task-item';
   
    
    let taskInfoEl = document.createElement('div');
    taskInfoEl.className = 'task-info';
    
    taskInfoEl.innerHTML = `<h3 class = "task-name">${taskDataObj.name}</h3><span class = "task-type">${taskDataObj.type}</span>`;

    let taskActionsEl = createTaskActions(taskIdCounter);

    taskItemEl.appendChild(taskInfoEl);
    taskItemEl.appendChild(taskActionsEl);
    tasksToDo.appendChild(taskItemEl);

    taskDataObj.id = taskIdCounter;
    tasks.push(taskDataObj);

    saveTasks();

    taskIdCounter ++;
};

function createTaskActions(taskId) {
    let actionContainerEl = document.createElement('div');
    actionContainerEl.className = 'task-actions';

    let editButtonEl = document.createElement('button');
    editButtonEl.textContent = 'Edit';
    editButtonEl.className = 'btn edit-btn';
    editButtonEl.setAttribute('data-task-id', taskId);

    actionContainerEl.appendChild(editButtonEl);

    let deleteButtonEl = document.createElement('button');
    deleteButtonEl.textContent = 'Delete';
    deleteButtonEl.className = 'btn delete-btn';
    deleteButtonEl.setAttribute('data-task-id', taskId);

    actionContainerEl.appendChild(deleteButtonEl);

    var statusSelectEl = document.createElement('select'); 
    statusSelectEl.className = 'select-status'; 
    statusSelectEl.setAttribute('name', 'status-change'); 
    statusSelectEl.setAttribute('data-task-id', taskId);

    actionContainerEl.appendChild(statusSelectEl);

    var statusChoices = ['To Do', 'In Progress', 'Completed'];
    for (var i = 0; i < statusChoices.length; i++) {
        let statusOptionEl = document.createElement('option');
        statusOptionEl.textContent = statusChoices[i];
        statusOptionEl.setAttribute('value', statusChoices[i]);

        statusSelectEl.appendChild(statusOptionEl);
    }

    return actionContainerEl;
};

function taskButtonHandler(e) {
    let targetEl = e.target;

    if (targetEl.matches('.delete-btn')) {
        let taskId = targetEl.getAttribute('data-task-id');
        deleteTask(taskId);
    } else if (targetEl.matches('.edit-btn')) {
        let taskId = targetEl.getAttribute('data-task-id');
        editTask(taskId);
    }
};

function deleteTask(taskId) {
    let selectedTask = document.querySelector(`.task-item[data-task-id = "${taskId}"]`);

    selectedTask.remove();

    let updatedTaskArr = [];

    for (var i = 0; i < tasks.length; i++) {
        if(tasks[i].id !== parseInt(taskId)) {
            updatedTaskArr.push(tasks[i]);
        }
    }

    tasks = updatedTaskArr;

    saveTasks();
};

function editTask(taskId) {
    let selectedTask = document.querySelector(`.task-item[data-task-id = "${taskId}"]`);
    
    let taskName = selectedTask.querySelector('h3.task-name').textContent;
    let taskType = selectedTask.querySelector('span.task-type').textContent;

    document.querySelector('input[name = "task-name"]').value = taskName;
    document.querySelector('select[name = "task-type"]').value = taskType;

    document.querySelector('#save-task').textContent = 'Save Task';

    formEl.setAttribute("data-task-id", taskId);
};

function completeEditTask(taskName, taskType, taskId) {
    let selectedTask = document.querySelector(`.task-item[data-task-id = "${taskId}"]`);

    selectedTask.querySelector('h3.task-name').textContent= taskName;
    selectedTask.querySelector('span.task-type').textContent = taskType;

    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) { 
            tasks[i].name = taskName; 
            tasks[i].type = taskType;
        } 
    }

    saveTasks();

    formEl.removeAttribute('data-task-id'); 
    document.querySelector('#save-task').textContent = 'Add Task';
};

function taskStatusChangeHandler(e) {
    let targetEl = e.target;

    let taskId = targetEl.getAttribute('data-task-id');
    let statusValue = targetEl.value.toLowerCase();

    let selectedTask = document.querySelector(`.task-item[data-task-id = "${taskId}"]`);

    if (statusValue === "to do") { 
        tasksToDoEl.appendChild(selectedTask);
    } else if (statusValue === "in progress") {
        tasksInProgressEl.appendChild(selectedTask); 
    } else if (statusValue === "completed") { 
        tasksCompletedEl.appendChild(selectedTask);
    }

    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) { 
            tasks[i].status = statusValue;
        } 
    }

    saveTasks();
};

function dragTaskHandler(e) {
    let targetEl = e.target;
    let taskId = targetEl.getAttribute('data-task-id');
    e.dataTransfer.setData('text/plain', taskId);
};

function dropZoneDragHandler(e) {
    let targetEl = e.target;
    let taskListEl = e.target.closest('.task-list');
    if(taskListEl) {
        e.preventDefault();
        taskListEl.setAttribute("style", "background: rgba(68, 233, 255, 0.7);")
    }
};

function dropTaskHandler(e) {
    let targetEl = e.target;
    let id = e.dataTransfer.getData('text/plain'); // we made a refrence to data-task-id we created in dragTaskHandler()
    let draggableEl = document.querySelector(`[data-task-id = "${id}"]`);
    let dropZoneEl = targetEl.closest('.task-list');
    let statusType = dropZoneEl.id;
    let statusSelectEl = draggableEl.querySelector('select[name="status-change"]');

    if (statusType === 'tasks-to-do') { 
        statusSelectEl.selectedIndex = 0;
    } else if (statusType === 'tasks-in-progress') {
        statusSelectEl.selectedIndex = 1; 
    } else if (statusType === 'tasks-completed') { 
        statusSelectEl.selectedIndex = 2;
    }

    dropZoneEl.removeAttribute("style");

    dropZoneEl.appendChild(draggableEl);

    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(id)) {
        tasks[i].status = statusSelectEl.value.toLowerCase();
        } 
    }

    saveTasks();
};

function dragLeaveHandler(e) {
    let targetEl = e.target;
    let taskListEl = targetEl.closest('.task-list'); 
    if (taskListEl) {
        taskListEl.removeAttribute('style'); 
    }
};

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks)); // localStorage only store STRING
}


btn.addEventListener('click', taskFormHandler);
pageContentEl.addEventListener('click', taskButtonHandler);
pageContentEl.addEventListener('change', taskStatusChangeHandler);
pageContentEl.addEventListener('dragstart', dragTaskHandler);
pageContentEl.addEventListener('dragover', dropZoneDragHandler);
pageContentEl.addEventListener('drop', dropTaskHandler);
pageContentEl.addEventListener('dragleave', dragLeaveHandler);