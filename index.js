const inquirer = require('inquirer');
const { queryAllFrom, addDataTo, updateDataIn, getEmployeeNames, getRoleTitles, deleteDataFrom, getDeptNames } = require("./helpers/queries");

// create function to run as soon as the application is ran
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
					getQueryAll("departments");
					break;
				case 'View all roles':
					getQueryAll("roles");
					break;
				case 'View all employees':
					getQueryAll("employees");
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
					updateEmployeeManager();
					break;
				case 'Delete employee':
					deleteEmployee();
					break;
				case 'Delete role':
					deleteRole();
					break;
				case 'Delete department':
					deleteDepartment();
					break;
				case 'View employees by manager':
					employeesByManager();
					break;
				case 'View employees by department':
					employeesByDept();
					break;
				case 'View total utilized budget by department':
					utilizedBudget();
					break;
				default:
					console.log("THERE IS SOMETHING WRONG WITH YOUR CODE... FIX IT!")
			}
		});
}
// create a function to run basic query select statements depending on the table being queried
function getQueryAll(tableName) {
	queryAllFrom(tableName)
}
// create function for generalized text validation for text response questions
function validatorText(response) {
	// Make sure the response is not a number, and that it exists
	let validation = response && isNaN(response) ? true : 'This response is required & it needs to be text! Try again!';
	return validation;
};
// create function for generalized number validation for number response questions
function validatorNumber(response) {
	// Make sure the response is not a number, and that it exists
	let validation =
		response && !isNaN(response) ? true : 'This response is required & it need to be a number! Try again!';
	return validation;
};
// create function to add a department based on the data the user enters in the inquirer prompts 
function addDepartment() {
	inquirer
		.prompt([
			{
				type: "input",
				name: "deptName",
				message: "What is the name of the new department you want to add? ",
				validate: validatorText
			}
		])
		.then((response) => {
			addDataTo("departments", response);
		})
}
// create function to add a role based on the data the user enters in the inquirer prompts 
function addRole() {
	inquirer
		.prompt([
			{
				type: "input",
				name: "title",
				message: "What is the title/name of the new role you want to add? ",
				validate: validatorText
			},
			{
				type: "input",
				name: "salary",
				message: "What will the yearly salary of this new position be? ",
				validate: validatorNumber
			},{
				type: "input",
				name: "departmentId",
				message: "What department id does this role belong to? ",
				validate: validatorNumber
			}
		])
		.then((response) => {
			addDataTo("roles", response);
		})
}
// create function to add a role based on the data the user enters in the inquirer prompts 
function addEmployee() {
	inquirer
		.prompt([
			{
				type: "input",
				name: "firstName",
				message: "What is the employee's first name? ",
				validate: validatorText
			},
			{
				type: "input",
				name: "lastName",
				message: "What is the employee's last name? ",
				validate: validatorNumber
			},
			{
				type: "input",
				name: "roleId",
				message: "What role id does this employee belong to? ",
				validate: validatorNumber
			},
			{
				type: "input",
				name: "managerId",
				message: "What manager id does this employee belong to? ",
				validate: validatorNumber
			}
		])
		.then((response) => {
			addDataTo("employees", response);
		})
}
// create function to update a role based on the data the user enters in the inquirer prompts
async function updateEmployee() {
	const currentEmployees = await getEmployeeNames();
	const currentRoleTitles = await getRoleTitles();
	inquirer
		.prompt([
			{
				type: "list",
				name: "selectedEmployee",
				message: "Which employee would you like to update? ",
				options: currentEmployees
			},
			{
				type: "list",
				name: "roleTitle",
				message: "What is the new role that you would like this employee to belong to? ",
				options: currentRoleTitles
			}
		]).then((response) => {
			updateDataIn("employees", response, "role");
		})
}
// create function to update the manager of an employee based on data entered by user
async function updateEmployeeManager() {
	const currentEmployees = await getEmployeeNames();
	inquirer
		.prompt([
			{
				type: "list",
				name: "selectedEmployee",
				message: "Which employee would you like to update? ",
				options: currentEmployees
			},
			{
				type: "list",
				name: "selectedManager",
				message: "What is the new manager that you would like this employee to have? ",
				options: currentEmployees
			}
		]).then((response) => {
			updateDataIn("employees", response, "manager");
		})
}
// create function to allow user to delete employees
async function deleteEmployee() {
	const currentEmployees = await getEmployeeNames();
	inquirer
		.prompt([
			{
				type: "list",
				name: "deletedEmployee",
				message: "Which employee would you like to delete? ",
				options: currentEmployees
			}
		]).then((response) => {
			deleteDataFrom("employees", response);
		})
}
// create function to allow user to delete roles
async function deleteRole() {
	const currentRoles = await getRoleTitles();
	inquirer
		.prompt([
			{
				type: "list",
				name: "deletedRole",
				message: "Which role would you like to delete? ",
				options: currentRoles
			}
		]).then((response) => {
			deleteDataFrom("roles", response);
		})
}
// create function to allow user to delete departments
async function deleteDepartment() {
	const currentDepartments = await getDeptNames();
	inquirer
		.prompt([
			{
				type: "list",
				name: "deletedDept",
				message: "Which department would you like to delete? ",
				options: currentDepartments
			}
		]).then((response) => {
			deleteDataFrom("departments", response);
		})
}
// create function to allow user to view employees by manager
function employeesByManager() {
// TODO - FINISH THIS FUNCTION
}
// create function to allow user to view employees by department
function employeesByDept() {
// TODO - FINISH THIS FUNCTION
}
// create function to allow the user to see the utilized budget for each department
function utilizedBudget() {
// TODO - FINISH THIS FUNCTION	
}

// initialize the application
start();