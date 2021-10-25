const inquirer = require('inquirer');
const cTable = require('console.table');
// import the promise version of mysql2 package
const mysql = require('mysql2/promise');
// to get the promise implementation, we use bluebird
// const bluebird = require('bluebird');

function start() {
	inquirer
		.prompt([
			{
				type: 'list',
				name: 'choice',
				question: 'What would you like to do? ',
				choices: [
					'View all departments',
					'View all roles',
					'View all employees',
					'Add a department',
					'Add a role',
					'Add an employee',
					'Update an employee role'
				]
			}
		])
		.then((response) => {
            // create switch statement for choice selected
			switch (response.choice) {
				case 'View all departments':
					getDepartments();
					break;
				case 'View all roles':
					getRoles();
					break;
				case 'View all employees':
					getEmployees();
					break;
				case 'Add a department':
					addDepartment();
					break;
				case 'Add a role':
					addRole();
					break;
				case 'Add an employee':
					addEmployee();
					break;
				case 'Update an employee Role':
					updateEmployee();
					break;
				case 'Update employee managers':

			}
		});
}

// TODO - create functions for inquirer prompts called in switch

