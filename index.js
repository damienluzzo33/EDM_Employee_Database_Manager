// import helper constants
const { selectEmployees, selectRoles, selectDepartments, employeeNames, roleTitles, departmentNames, getAllManagers, getBudgetByDepartment } = require('./helpers/queryStatements');
// import modules for the queries page
const inquirer = require('inquirer');
const mysql = require('mysql2');
const util = require('util');
const { Table } = require('console-table-printer');

// create the connection
const connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'password',
	database: 'my_employees'
});

// create promisify version of query
const query = util.promisify(connection.query).bind(connection);
// create function that produces tables in console
function consoleTable(rows) {
	const table = new Table();
	table.addRows(rows, { color: 'cyan' });
	table.printTable();
}
// create function to run as soon as the application is ran
function start() {
	inquirer
		.prompt([
			{
				type: 'list',
				name: 'choice',
				message: 'What would you like to do? ',
				choices: [
					'view all departments',
					'view all roles',
					'view all employees',
					'add a department',
					'add a role',
					'add an employee',
					'update an employee role',
					'update employee managers',
					'delete employee',
					'delete role',
					'delete department',
					'view employees by manager',
					'view employees by department',
					'view utilized budget by department',
					'quit application'
				]
			}
		])
		.then((response) => {
			// create switch statement for choice selected
			switch (response.choice) {
				case 'view all departments':
					getQueryAll('departments');
					break;
				case 'view all roles':
					getQueryAll('roles');
					break;
				case 'view all employees':
					getQueryAll('employees');
					break;
				case 'add a department':
					addDepartment();
					break;
				case 'add a role':
					addRole();
					break;
				case 'add an employee':
					addEmployee();
					break;
				case 'update an employee role':
					updateEmployee();
					break;
				case 'update employee managers':
					updateEmployeeManager();
					break;
				case 'delete employee':
					deleteEmployee();
					break;
				case 'delete role':
					deleteRole();
					break;
				case 'delete department':
					deleteDepartment();
					break;
				case 'view employees by manager':
					employeesByManager();
					break;
				case 'view employees by department':
					employeesByDept();
					break;
				case 'view utilized budget by department':
					utilizedBudget();
					break;
				case 'quit application':
					connection.end();
					break;
				default:
					console.log('THERE IS SOMETHING WRONG WITH YOUR CODE...');
			}
		});
};
// create function to query all data from selected database
async function queryAllFrom(tableSelection) {
		try {
			if (tableSelection == 'departments') {
				const rows = await query(`SELECT * FROM departments;`);
				consoleTable(rows);
			} else if (tableSelection == 'roles') {
				const rows = await query(selectRoles);
				consoleTable(rows);
			} else if (tableSelection == 'employees') {
				const rows = await query(selectEmployees);
				consoleTable(rows);
			}
		} finally {
			start();
		}
}
// create function to query all data from selected database
async function addDataTo(tableSelection, params) {
	try {
		if (tableSelection == 'employees') {
			const { firstName, lastName, roleId, managerId } = params;
			await query(`INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?);`, [firstName, lastName, roleId, managerId]);
			const rows = await query(selectEmployees);
			consoleTable(rows);
		} else if (tableSelection == 'roles') {
			const { title, salary, departmentId } = params;
			await query(`INSERT INTO roles (title, salary, department_id) VALUES (?,?,?);`, [title, salary, departmentId]);
			const rows = await query(selectRoles);
			consoleTable(rows);
		} else if (tableSelection == 'departments') {
			const { deptName } = params;
			await query(`INSERT INTO departments (dept_name) VALUES (?);`, [deptName]);
			const rows = await query(selectDepartments);
			consoleTable(rows);
		}
	} finally {
		start();
	}
}
// create function to get the current list of employee names
async function getEmployeeNames() {
	let employeeData = await query(employeeNames);
	let employeeArray = [];
	for (let employee of employeeData) {
		employeeArray.push(`${employee.first_name} ${employee.last_name}`);
	}
	return employeeArray;
}
// create function to get the current list of manager names
async function getManagerNames() {
	let managerData = await query(getAllManagers);
	let managerArray = [];
	for (let manager of managerData) {
		managerArray.push(`${manager.first_name} ${manager.last_name}`);
	}
	return managerArray;
}
// create function to display the employees for each manager
async function queryManagerByEmployee(params) {
	try {
		let { manager } = params;
		let managerNameArr = manager.split(" ");
		let managerFirstName = managerNameArr[0];
		let managerLastName = managerNameArr[1];
		let managerIdArr = await query(`SELECT id FROM employees WHERE first_name=? AND last_name= ?;`, [managerFirstName, managerLastName]);
		let managerEmployeeId = managerIdArr[0].id;
		const rows = await query(`SELECT e.first_name, e.last_name, r.title FROM employees e JOIN roles r ON e.role_id = r.id AND e.manager_id = ?;`, [managerEmployeeId]);
		consoleTable(rows);
	} finally {
		start();
	}
}
// create function to get the current list of role titles
async function getRoleTitles() {
	let roleData = await query(roleTitles);
	let roleArray = [];
	for (let role of roleData) {
		roleArray.push(role.title);
	}
	return roleArray;
}
// create function to get the current list of departments
async function getDeptNames() {
	let deptData = await query(departmentNames);
	let deptArray = [];
	for (let dept of deptData) {
		deptArray.push(dept.dept_name);
	}
	return deptArray;
}
// create function to update specific things about employees
async function updateDataIn(tableSelection, params, identifier) {
	try {
		if (tableSelection == 'employees' && identifier == 'role') {
			const { selectedEmployee, roleTitle } = params;
			let employeeNameArray = selectedEmployee.split(' ');
			let firstName = employeeNameArray[0];
			let roleIdArr = await query(`SELECT id FROM roles WHERE title=?;`, [roleTitle]);
			let roleId = roleIdArr[0].id;
			await query(`UPDATE employees SET role_id=? WHERE first_name=?;`, [roleId, firstName]);
			const rows = await query(selectEmployees);
			consoleTable(rows);
		} else if (tableSelection == 'employees' && identifier == 'manager') {
			const { selectedEmployee, selectedManager } = params;
			let employeeNameArray = selectedEmployee.split(' ');
			let lastName = employeeNameArray[1];
			let managerNameArray = selectedManager.split(' ');
			let managerLast = managerNameArray[1];
			let managerIdArr = await query(`SELECT id FROM employees WHERE last_name=?;`, [managerLast]);
			let managerId = managerIdArr[0].id;
			await query(`UPDATE employees SET manager_id=? WHERE last_name=?;`, [managerId, lastName]);
			const rows = await query(selectEmployees);
			consoleTable(rows);
		}
	} finally {
		start()
	}
}
// create function to delete rows from chosen table
async function deleteDataFrom(tableSelection, params) {
	try {
		if (tableSelection == 'employees') {
			const { deletedEmployee } = params;
			let employeeNameArray = deletedEmployee.split(' ');
			let firstName = employeeNameArray[0];
			let lastName = employeeNameArray[1];
			let employeeIdArr = await query(`SELECT id FROM employees WHERE first_name=? AND last_name=?;`, [firstName, lastName]);
			let employeeId = employeeIdArr[0].id;
			await query(`DELETE FROM employees WHERE id=?;`, [employeeId]);
			const rows = await query(selectEmployees);
			consoleTable(rows);
		} else if (tableSelection == 'roles') {
			const { deletedRole } = params;
			let roleIdArr = await query(`SELECT id FROM roles WHERE title=?;`, [deletedRole]);
			let roleId = roleIdArr[0].id;
			await query(`DELETE FROM roles WHERE id=?;`, [roleId]);
			const rows = await query(selectRoles);
			consoleTable(rows);
		} else if (tableSelection == 'departments') {
			const { deletedDept } = params;
			let deptIdArr = await query(`SELECT id FROM departments WHERE dept_name=?;`, [deletedDept]);
			let deptId = deptIdArr[0].id;
			await query(`DELETE FROM departments WHERE id=?;`, [deptId]);
			const rows = await query(selectDepartments);
			consoleTable(rows);
		}
	} finally {
		start();
	}
}
// create function to query employees in given department
async function queryEmployeeByDepartment(params) {
	try {
		let { departmentName } = params;
		console.log(departmentName)
		let rows = await query(`SELECT e.first_name, e.last_name, r.title FROM employees e LEFT JOIN roles r ON e.role_id = r.id LEFT JOIN departments d ON r.department_id = d.id WHERE d.dept_name=?;`, [departmentName]);
		consoleTable(rows);
	} finally {
		start();
	}
}
// create function to find and display the current used budget of all individual departments
async function queryBudgetsByDepartment() {
	try {
		let rows = await query(getBudgetByDepartment);
		consoleTable(rows);
	} finally {
		start();
	}
}
// create function for generalized text validation for text response questions
function validatorText(response) {
	// Make sure the response is not a number, and that it exists
	let validation = response && isNaN(response) ? true : 'This response is required & it needs to be text! Try again!';
	return validation;
}
// create function for generalized number validation for number response questions
function validatorNumber(response) {
	// Make sure the response is not a number, and that it exists
	let validation =
		response && !isNaN(response) ? true : 'This response is required & it need to be a number! Try again!';
	return validation;
}
// create a function to run basic query select statements depending on the table being queried
function getQueryAll(tableName) {
	queryAllFrom(tableName);
}
// create function to add a department based on the data the user enters in the inquirer prompts
function addDepartment() {
	inquirer
		.prompt([
			{
				type: 'input',
				name: 'deptName',
				message: 'What is the name of the new department you want to add? ',
				validate: validatorText
			}
		])
		.then((response) => {
			addDataTo('departments', response);
		});
}
// create function to add a role based on the data the user enters in the inquirer prompts
function addRole() {
	inquirer
		.prompt([
			{
				type: 'input',
				name: 'title',
				message: 'What is the title/name of the new role you want to add? ',
				validate: validatorText
			},
			{
				type: 'input',
				name: 'salary',
				message: 'What will the yearly salary of this new position be? ',
				validate: validatorNumber
			},
			{
				type: 'input',
				name: 'departmentId',
				message: 'What department id does this role belong to? ',
				validate: validatorNumber
			}
		])
		.then((response) => {
			addDataTo('roles', response);
		});
}
// create function to add a role based on the data the user enters in the inquirer prompts
function addEmployee() {
	inquirer
		.prompt([
			{
				type: 'input',
				name: 'firstName',
				message: "What is the employee's first name? ",
				validate: validatorText
			},
			{
				type: 'input',
				name: 'lastName',
				message: "What is the employee's last name? ",
				validate: validatorText
			},
			{
				type: 'input',
				name: 'roleId',
				message: 'What role id does this employee belong to? ',
				validate: validatorNumber
			},
			{
				type: 'input',
				name: 'managerId',
				message: 'What manager id does this employee belong to? ',
				validate: validatorNumber
			}
		])
		.then((response) => {
			addDataTo('employees', response);
		});
}
// create function to update a role based on the data the user enters in the inquirer prompts
async function updateEmployee() {
	const currentEmployees = await getEmployeeNames();
	const currentRoleTitles = await getRoleTitles();
	inquirer
		.prompt([
			{
				type: 'list',
				name: 'selectedEmployee',
				message: 'Which employee would you like to update? ',
				choices: currentEmployees
			},
			{
				type: 'list',
				name: 'roleTitle',
				message: 'What is the new role that you would like this employee to belong to? ',
				choices: currentRoleTitles
			}
		])
		.then((response) => {
			updateDataIn('employees', response, 'role');
		});
}
// create function to update the manager of an employee based on data entered by user
async function updateEmployeeManager() {
	const currentEmployees = await getEmployeeNames();
	inquirer
		.prompt([
			{
				type: 'list',
				name: 'selectedEmployee',
				message: 'Which employee would you like to update? ',
				choices: currentEmployees
			},
			{
				type: 'list',
				name: 'selectedManager',
				message: 'What is the new manager that you would like this employee to have? ',
				choices: currentEmployees
			}
		])
		.then((response) => {
			updateDataIn('employees', response, 'manager');
		});
}
// create function to allow user to delete employees
async function deleteEmployee() {
	const currentEmployees = await getEmployeeNames();
	inquirer
		.prompt([
			{
				type: 'list',
				name: 'deletedEmployee',
				message: 'Which employee would you like to delete? ',
				choices: currentEmployees
			}
		])
		.then((response) => {
			deleteDataFrom('employees', response);
		});
}
// create function to allow user to delete roles
async function deleteRole() {
	const currentRoles = await getRoleTitles();
	inquirer
		.prompt([
			{
				type: 'list',
				name: 'deletedRole',
				message: 'Which role would you like to delete? ',
				choices: currentRoles
			}
		])
		.then((response) => {
			deleteDataFrom('roles', response);
		});
}
// create function to allow user to delete departments
async function deleteDepartment() {
	const currentDepartments = await getDeptNames();
	inquirer
		.prompt([
			{
				type: 'list',
				name: 'deletedDept',
				message: 'Which department would you like to delete? ',
				choices: currentDepartments
			}
		])
		.then((response) => {
			deleteDataFrom('departments', response);
		});
}
// create function to allow user to view employees by manager
async function employeesByManager() {
	const currentManagers = await getManagerNames();
	inquirer
		.prompt([
			{
				type: 'list',
				name: 'manager',
				message: "Which manager's employees would you like to view? ",
				choices: currentManagers
			}
		])
		.then((response) => {
			queryManagerByEmployee(response);
		});
}
// create function to allow user to view employees by department
async function employeesByDept() {
	const currentDepartments = await getDeptNames();
	inquirer
		.prompt([
			{
				type: 'list',
				name: 'departmentName',
				message: "Which department's employees would you like to view? ",
				choices: currentDepartments
			}
		])
		.then((response) => {
			queryEmployeeByDepartment(response);
		});
}
// create function to allow the user to see the utilized budget for each department
function utilizedBudget() {
	queryBudgetsByDepartment();
}
// initialize the application
start();