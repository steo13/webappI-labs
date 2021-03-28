'use strict';

//Task
function Task (description, deadline, important=false, pubblic=false){
    this.description = description;
    if (deadline != '')
        this.deadline = dayjs(deadline).format('dddd, MMMM D, YYYY H:mm');
    else
        this.deadline = '';
    this.important = important;
    this.pubblic = pubblic;
}

//TaskList
function TaskList() {
    this.list = [];

    this.init = () => {
        this.list.push(
            new Task('Complete Lab 2', '2021/03/22'),
            new Task('Buy some groceries', '2021/03/28', false, true),
            new Task('Read a good book!', '', true, false)
        );
    };

    this.add = (task) => {
        this.list.push(task);
        initTable();
        fillTasks(this.list);
    }

    this.remove = () => {
        this.list.pop();
        initTable();
        fillTasks(this.list);
    }

    this.filterImportant = () => {
        let list = this.list.filter(line => {
            if (line.important == true)
                return true;
            else
                return false;
        });
        fillTasks(list);
    }

    this.filterToday = () => {
        let list = this.list.filter(line => {
            if (dayjs(line.deadline).format('YYYY/MM/DD') == dayjs().format('YYYY/MM/DD'))
                return true;
            else
                return false;
        });
        fillTasks(list);
    }

    this.filter7Days = () => {
        let list = this.list.filter(line => {
            if(dayjs(line.deadline).isAfter(dayjs()) && dayjs(line.deadline).diff(dayjs(), 'day') <= 6)
                return true;
            else
                return false;
        })
        fillTasks(list);
    }

    this.filterPrivate = () => {
        let list = this.list.filter(line => {
            if(line.pubblic == false)
                return true;
            else
                return false;
        })
        fillTasks(list);
    }

    this.getAll = () => {
        return this.list;
    }
}

//DOM manipulation
function createTaskRow(task){
    let description = task.description;
    let pubblic = '';

    if (task.important == true)
        description = `<p class="text-danger"><b>${task.description}</b></p>`;

    if (task.pubblic == true)
        pubblic = `<div><img src="https://raw.githubusercontent.com/steo13/webappI-labs/main/lab2/user.png" title="Pubblic" alt="" width="32" height="32" class="d-inline-block mx-auto"></div>`;

    return `<label class="list-group-item">
            <div class="d-flex justify-content-between">
                <div>
                    <input class="form-check-input me-1" type="checkbox" value="">
                    ${description}
                </div>
                ${pubblic}
                <div>
                    ${task.deadline}
                </div>
            </div>
            </label>`;        
}

//Riempo la tabella
function fillTasks(tasks){
    const taskList = document.getElementById('task-list');
    for (const task of tasks){
        const taskEl = createTaskRow(task);
        taskList.insertAdjacentHTML('afterbegin', taskEl);
    }
}

//inizializzo la tabella
function initTable(){
    const taskTable = document.getElementById('task-list');
    const taskTitle = document.getElementById('task-title');
    taskTitle.innerHTML = '';
    taskTable.innerHTML = '';
}

//ALL
document.querySelector('#all1').addEventListener('click', (event) => {
    initTable();
    const taskTitle = document.getElementById('task-title');
    taskTitle.insertAdjacentHTML('afterbegin', 'All');
    const tasks = taskList.getAll();
    fillTasks(tasks);
});
document.querySelector('#all2').addEventListener('click', (event) => {
    initTable();
    const taskTitle = document.getElementById('task-title');
    taskTitle.insertAdjacentHTML('afterbegin', 'All');
    const tasks = taskList.getAll();
    fillTasks(tasks);
});

//IMPORTANT
document.querySelector('#important1').addEventListener('click', (event) => {
    initTable();
    const taskTitle = document.getElementById('task-title');
    taskTitle.insertAdjacentHTML('afterbegin', 'Important');
    taskList.filterImportant();
});
document.querySelector('#important2').addEventListener('click', (event) => {
    initTable();
    const taskTitle = document.getElementById('task-title');
    taskTitle.insertAdjacentHTML('afterbegin', 'Important');
    taskList.filterImportant();
});

//TODAY
document.querySelector('#today1').addEventListener('click', (event) => {
    initTable();
    const taskTitle = document.getElementById('task-title');
    taskTitle.insertAdjacentHTML('afterbegin', 'Today');
    taskList.filterToday();
});
document.querySelector('#today2').addEventListener('click', (event) => {
    initTable();
    const taskTitle = document.getElementById('task-title');
    taskTitle.insertAdjacentHTML('afterbegin', 'Today');
    taskList.filterToday();
});

//NEXT 7 DAYS
document.querySelector('#next-71').addEventListener('click', (event) => {
    initTable();
    const taskTitle = document.getElementById('task-title');
    taskTitle.insertAdjacentHTML('afterbegin', 'Next 7 days');
    taskList.filter7Days();
});
document.querySelector('#next-72').addEventListener('click', (event) => {
    initTable();
    const taskTitle = document.getElementById('task-title');
    taskTitle.insertAdjacentHTML('afterbegin', 'Next 7 days');
    taskList.filter7Days();
});

//PRIVATE
document.querySelector('#private1').addEventListener('click', (event) => {
    initTable();
    const taskTitle = document.getElementById('task-title');
    taskTitle.insertAdjacentHTML('afterbegin', 'Private');
    taskList.filterPrivate();
});
document.querySelector('#private2').addEventListener('click', (event) => {
    initTable();
    const taskTitle = document.getElementById('task-title');
    taskTitle.insertAdjacentHTML('afterbegin', 'Private');
    taskList.filterPrivate();
});


const taskList = new TaskList();
taskList.init();
const tasks = taskList.getAll();
fillTasks(tasks);
taskList.add(new Task("Finish lab3!", '2021/03/30', true, true));

const taskTitle = document.getElementById('task-title');
taskTitle.innerHTML = 'All';

