// const { selectEmployees, selectRoles, selectDepartments, employeeNames, roleTitles, departmentNames, getAllManagers, getBudgetByDepartment } = require('./queryStatements');
// // import modules for the queries page
// const mysql = require('mysql2');
// const util = require('util');
// // const cTable = require('console.table');
// const { Table } = require('console-table-printer');
// require('dotenv').config();
// // create the connection
// const connection = mysql.createConnection({
// 	host: process.env.DB_HOST,
// 	user: process.env.DB_NAME,
// 	password: process.env.DB_PASSWORD,
// 	database: process.env.DB_NAME
// });
// // create promisify version of query
// const query = util.promisify(connection.query).bind(connection);

// // create function that produces tables in console
// function consoleTable(rows) {
// 	const table = new Table();
// 	table.addRows(rows, { color: 'cyan' });
// 	table.printTable();
// }

// // create function to query all data from selected database
// async function queryAllFrom(tableSelection) {
// 	if (tableSelection == 'departments') {
// 		try {
// 			const rows = await query(selectDepartments);
// 			consoleTable(rows);
// 		} finally {
// 			connection.end();
// 		}
// 	} else if (tableSelection == 'roles') {
// 		try {
// 			const rows = await query(selectRoles);
// 			consoleTable(rows);
// 		} finally {
// 			connection.end();
// 		}
// 	} else if (tableSelection == 'employees') {
// 		try {
// 			const rows = await query(selectEmployees);
// 			consoleTable(rows);
// 		} finally {
// 			connection.end();
// 		}
// 	}
// }
// // create function to query all data from selected database
// async function addDataTo(tableSelection, params) {
// 	if (tableSelection == 'employees') {
// 		const { firstName, lastName, roleId, managerId } = params;
// 		try {
// 			await query(`INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?);`, [firstName, lastName, roleId, managerId]);
// 			const rows = await query(selectEmployees);
// 			consoleTable(rows);
// 		} finally {
// 			connection.end();
// 		}
// 	} else if (tableSelection == 'roles') {
// 		const { title, salary, departmentId } = params;
// 		try {
// 			await query(`INSERT INTO roles (title, salary, department_id) VALUES (?,?,?);`, [title, salary, departmentId]);
// 			const rows = await query(selectRoles);
// 			consoleTable(rows);
// 		} finally {
// 			connection.end();
// 		}
// 	} else if (tableSelection == 'departments') {
// 		const { deptName } = params;
// 		try {
// 			await query(`INSERT INTO departments (dept_name) VALUES (?);`, [deptName]);
// 			const rows = await query(selectDepartments);
// 			consoleTable(rows);
// 		} finally {
// 			connection.end();
// 		}
// 	}
// }
// // create function to get the current list of employee names
// async function getEmployeeNames() {
// 	let employeeData = await query(employeeNames);
// 	let employeeArray = [];
// 	for (let employee of employeeData) {
// 		employeeArray.push(`${employee.first_name} ${employee.last_name}`);
// 	}
// 	return employeeArray;
// }
// // create function to get the current list of manager names
// async function getManagerNames() {
// 	let managerData = await query(getAllManagers);
// 	let managerArray = [];
// 	for (let manager of managerData) {
// 		managerArray.push(`${manager.first_name} ${manager.last_name}`);
// 	}
// 	return managerArray;
// }

// // create function to display the employees for each manager
// async function queryManagerByEmployee(params) {
// 	let { manager } = params;
// 	let managerNameArr = manager.split(" ");
// 	let managerFirstName = managerNameArr[0];
// 	let managerLastName = managerNameArr[1];
// 	let managerIdArr = await query(`SELECT id FROM employees WHERE first_name=? AND last_name= ?;`, [managerFirstName, managerLastName]);
// 	let managerEmployeeId = managerIdArr[0].id;
// 	try {
// 		const rows = await query(`SELECT e.first_name, e.last_name, r.title FROM employees JOIN roles r ON e.role_id = r.id AND e.id = ?;`, [managerEmployeeId]);
// 		consoleTable(rows);
// 	} finally {
// 		connection.end();
// 	}
// }

// // create function to get the current list of role titles
// async function getRoleTitles() {
// 	let roleData = await query(roleTitles);
// 	let roleArray = [];
// 	for (let role of roleData) {
// 		roleArray.push(role.title);
// 	}
// 	return roleArray;
// }
// // create function to get the current list of departments
// async function getDeptNames() {
// 	let deptData = await query(departmentNames);
// 	let deptArray = [];
// 	for (let dept of deptData) {
// 		deptArray.push(dept.dept_name);
// 	}
// 	return deptArray;
// }
// // create function to update specific things about employees
// async function updateDataIn(tableSelection, params, identifier) {
// 	if (tableSelection == 'employees' && identifier == 'role') {
// 		const { selectedEmployee, roleTitle } = params;
// 		let employeeNameArray = selectedEmployee.split(' ');
// 		let firstName = employeeNameArray[0];
// 		try {
// 			let roleIdArr = await query(`SELECT id FROM roles WHERE title=?;`, [roleTitle]);
// 			let roleId = roleIdArr[0].id;
// 			await query(`UPDATE employees SET role_id=? WHERE first_name=?;`, [roleId, firstName]);
// 			const rows = await query(selectEmployees);
// 			consoleTable(rows);
// 		} finally {
// 			connection.end();
// 		}
// 	} else if (tableSelection == 'employees' && identifier == 'manager') {
// 		const { selectedEmployee, selectedManager } = params;
// 		let employeeNameArray = selectedEmployee.split(' ');
// 		let lastName = employeeNameArray[1];
// 		let managerNameArray = selectedManager.split(' ');
// 		let managerLast = managerNameArray[1];
// 		try {
// 			let managerIdArr = await query(`SELECT id FROM employees WHERE last_name=?;`, [managerLast]);
// 			let managerId = managerIdArr[0].id;
// 			await query(`UPDATE employees SET manager_id=? WHERE last_name=?;`, [managerId, lastName]);
// 			const rows = await query(selectEmployees);
// 			consoleTable(rows);
// 		} finally {
// 			connection.end();
// 		}
// 	}
// }
// // create function to delete rows from chosen table
// async function deleteDataFrom(tableSelection, params) {
// 	if (tableSelection == 'employees') {
// 		const { deletedEmployee } = params;
// 		let employeeNameArray = deletedEmployee.split(' ');
// 		let firstName = employeeNameArray[0];
// 		let lastName = employeeNameArray[1];
// 		try {
// 			let employeeIdArr = await query(`SELECT id FROM employees WHERE first_name=? AND last_name=?;`, [firstName, lastName]);
// 			let employeeId = employeeIdArr[0].id;
// 			await query(`DELETE FROM employees WHERE id=?;`, [employeeId]);
// 			const rows = await query(selectEmployees);
// 			consoleTable(rows);
// 		} finally {
// 			connection.end();
// 		}
// 	} else if (tableSelection == 'roles') {
// 		const { deletedRole } = params;
// 		try {
// 			let roleIdArr = await query(`SELECT id FROM roles WHERE title=?;`, [deletedRole]);
// 			let roleId = roleIdArr[0].id;
// 			await query(`DELETE FROM roles WHERE id=?;`, [roleId]);
// 			const rows = await query(selectRoles);
// 			consoleTable(rows);
// 		} finally {
// 			connection.end();
// 		}
// 	} else if (tableSelection == 'departments') {
// 		const { deletedDept } = params;
// 		try {
// 			let deptIdArr = await query(`SELECT id FROM departments WHERE dept_name=?;`, [deletedDept]);
// 			let deptId = deptIdArr[0].id;
// 			await query(`DELETE FROM departments WHERE id=?;`, [deptId]);
// 			const rows = await query(selectDepartments);
// 			consoleTable(rows);
// 		} finally {
// 			connection.end();
// 		}
// 	}
// }
// // create function to query employees in given department
// async function queryEmployeeByDepartment(params) {
// 	let { departmentName } = params;
// 	try {
// 		let rows = await query(`SELECT e.first_name, e.last_name, r.title FROM employees JOIN roles r ON e.role_id = r.id JOIN departments d ON r.department_id = d.id AND dept_name=?;`, [departmentName]);
// 		consoleTable(rows);
// 	} finally {
// 		connection.end();
// 	}
// }

// async function queryBudgetsByDepartment() {
// 	try {
// 		let rows = await query(getBudgetByDepartment);
// 		consoleTable(rows);
// 	} finally {
// 		connection.end();
// 	}
// }

// // export the functions!
// module.exports = { queryAllFrom, addDataTo, updateDataIn, getEmployeeNames, getRoleTitles, deleteDataFrom, getDeptNames, getManagerNames, queryManagerByEmployee, queryEmployeeByDepartment, queryBudgetsByDepartment };
