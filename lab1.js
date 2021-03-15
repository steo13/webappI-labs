"use strict"

//exercise 0
let array = ['bella', 'ciao', 'la', 'casa', 'de', 'papel', 'spring'];

array = array.map(line => {
    if (line.length <= 2)
        return "";
    else
        return line.slice(0, 2).concat(line.slice(-2))
});

console.log(array);

//exercise 1
const dayjs = require('dayjs');
const { disableUnicode } = require('npmlog');

function Task (id, description, isUrgent = false, isPrivate = true, deadline = undefined){
    this.id = id;
    this.description = description;
    this.isUrgent = isUrgent;
    this.isPrivate = isPrivate;
    if (deadline != undefined)
        this.deadline = dayjs(deadline);
    this.toString = () => {
        if (this.deadline === undefined)
            return ("Id: "+this.id+", Description: "+this.description+", Urgent: "+this.isUrgent+", Private: "+this.isPrivate+", Deadline: <not defined>");
        else
            return ("Id: "+this.id+", Description: "+this.description+", Urgent: "+this.isUrgent+", Private: "+this.isPrivate+", Deadline: "+this.deadline.toString());
    }
}

function TaskList (){
    this.list = [];

    this.add = (task => {
        this.list.push(task);
    });


    //sortAndPrint
    this.sortAndPrint = () => {
        this.list.sort((a, b) => {
            if (a.deadline === undefined)
                return 1;
            if (b.deadline === undefined)
                return -1;
            return (a.deadline.isAfter(b.date) ? 1 : -1);
        });
        
        this.toString();
    };

    //filterAndPrint
    this.filterAndPrint = () => {
        this.list = this.list.filter(line => {
            if (line.isUrgent == true)
                return true;
            else
                return false;
        });

        this.toString();
    };

    //toString
    this.toString = () => {
        this.list.forEach(task => {
            console.log(task.toString());
        });
    };
    
}

let tasks = new TaskList();

let task1 = new Task (1, 'laundry');
let task2 = new Task (2, 'monday lab', false, false, '2021-03-16T10:00');
let task3 = new Task (3, 'phone call', true, false, '2021-03-08T16:20');

tasks.add(task1);
tasks.add(task2);
tasks.add(task3);

console.log("\n****** Tasks sorted by deadline (most recent first): ******");
tasks.sortAndPrint();

console.log("\n****** Tasks filtered, only (urgent == true): ******");
tasks.filterAndPrint();

//exercise 2
const sqlite = require('sqlite3');
const { resolve } = require("uri-js");

function TaskListDB () {
    const db = new sqlite.Database('tasks.db', (err) => { if (err) throw err; });

    //load
    this.load = () => {
        const tasks = new TaskList();
        return new Promise((resolve, reject) => {
            const sql = 'select * from tasks;';
            db.all(sql, [], function(err, rows) {
                if (err)
                    reject(err);
                else{
                    rows.forEach(row =>{
                        tasks.add(new Task (row.id, row.description, Boolean(row.urgent), Boolean(row.private), row.deadline));
                    });
                    resolve(tasks);
                }
            });
        });
    };

    //afterDeadLine
    this.afterDeadline = (deadLine => {
        const tasks = new TaskList();
        return new Promise ((resolve, reject) => {
            const sql = "select * from tasks where deadline > ?";
            db.all(sql, [deadLine], function (err, rows) {
                if (err)
                    reject(err);
                else{
                    rows.forEach(row =>{
                        tasks.add(new Task (row.id, row.description, Boolean(row.urgent), Boolean(row.private), row.deadline));
                    });
                    resolve(tasks);
                }
            });
        });
    });

    //givenWord
    this.givenWord = (word => {
        const tasks = new TaskList();
        return new Promise ((resolve, reject) => {
            const sql = 'select description from tasks where description like ?';
            db.all(sql, [word], function (err, rows) {
                if (err)
                    reject(err);
                else{
                    rows.forEach(row =>{
                        tasks.add(new Task (row.id, row.description, Boolean(row.urgent), Boolean(row.private), row.deadline));
                    });
                    resolve(tasks);
                }
            });
        });
    });
}

const main = async () => {
    const tasksDB = new TaskListDB();

    try {
        const listDB1 = await tasksDB.load();
        console.log("\n****** Tasks from DB 'tasks.db': ******");
        listDB1.toString();

        const deadLine = dayjs('2021-03-11').format('YYYY-MM-DD');
        const listDB2 = await tasksDB.afterDeadline(deadLine);
        console.log("\n****** Tasks from DB 'tasks.db' after the deadline "+deadLine+": ******");
        listDB2.toString();

        const word = 'laundry';
        const listDB3 = await tasksDB.givenWord('%'+word+'%');
        console.log("\n****** Tasks that contain the word "+word+": ******");
        listDB3.toString();

    }catch(error){
        console.log(error);
    }
}

main();