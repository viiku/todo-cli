#!/usr/bin/env node

const { program } = require('commander');
const chalk = require('chalk');
const fs = require('fs');

const filePath = './tasks.json';

// Load existing tasks or initialize with an empty array
const loadTasks = () => {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

// Save tasks to file
const saveTasks = (tasks) => {
  fs.writeFileSync(filePath, JSON.stringify(tasks, null, 2));
};

// Add a new task
program
  .command('add <task>')
  .description('Add a new task')
  .action((task) => {
    const tasks = loadTasks();
    tasks.push({ task, done: false });
    saveTasks(tasks);
    console.log(chalk.green('Task added!'));
  });

// View all tasks
program
  .command('list')
  .description('List all tasks')
  .action(() => {
    const tasks = loadTasks();
    if (tasks.length === 0) {
      console.log(chalk.yellow('No tasks found.'));
    } else {
      tasks.forEach((t, index) => {
        console.log(`${index + 1}. ${t.task} - ${t.done ? chalk.green('Done') : chalk.red('Pending')}`);
      });
    }
  });

// Delete a task
program
  .command('delete <index>')
  .description('Delete a task by its index')
  .action((index) => {
    const tasks = loadTasks();
    if (index > 0 && index <= tasks.length) {
      tasks.splice(index - 1, 1);
      saveTasks(tasks);
      console.log(chalk.green('Task deleted!'));
    } else {
      console.log(chalk.red('Invalid task index.'));
    }
  });

program.parse(process.argv);
