const mysql = require('mysql2'); // or use import if you use TS
const util = require('util');
// const cTable = require('console.table');
const { printTable, Table } = require('console-table-printer');
require('dotenv').config();
// create the connection
const connection = mysql.createConnection({
	host: process.env.DB_HOST,
	user: process.env.DB_NAME,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME
});
// create promisify version of query
const query = util.promisify(connection.query).bind(connection);
// create function to query all data from selected database
async function queryAllFrom(tableSelection) {
	if (tableSelection == "departments") {
		try {
			const rows = await query(`SELECT * FROM ${tableSelection};`);
			const table = new Table();
			table.addRows(rows, { color: 'cyan' });
			table.printTable();
		} finally {
			connection.end();
		}
	} else if (tableSelection == "roles") {
		try {
			const rows = await query(`SELECT title, roles.id, salary, dept_name FROM ${tableSelection} JOIN departments ON roles.department_id = departments.id;`);
			const table = new Table();
			table.addRows(rows, { color: 'cyan' });
			table.printTable();
		} finally {
			connection.end();
		}
	} else if (tableSelection == "employees") {
		try {
			const rows = await query(`SELECT e.id, first_name, last_name, r.title, d.dept_name, salary, em.first_name FROM employees e JOIN roles r ON e.role_id = r.id JOIN departments d ON r.department_id = d.id JOIN employees em ON e.manager_id = em.id;`);
			const table = new Table();
			table.addRows(rows, { color: 'cyan' });
			table.printTable();
		} finally {
			connection.end();
		}
	}
}
// create function to query all data from selected database
async function addDataTo(tableSelection, params) {
	if (tableSelection == "employees") {
		const { firstName, lastName, roleId, managerId } = params;
		try {
			await query(`INSERT INTO ${tableSelection} (first_name, last_name, role_id, manager_id) VALUES (${firstName}, ${lastName}, ${roleId}, ${managerId});`);
			const rows = await query(`SELECT e.id, first_name, last_name, r.title, d.dept_name, salary, em.first_name FROM employees e JOIN roles r ON e.role_id = r.id JOIN departments d ON r.department_id = d.id JOIN employees em ON e.manager_id = em.id;`);
			const table = new Table();
			table.addRows(rows, { color: 'cyan' });
			table.printTable();
		} finally {
			connection.end();
		}
	} else if (tableSelection == "roles") {
		const { title, salary, departmentId } = params;
		try {
			await query(`INSERT INTO ${tableSelection} (title, salary, department_id) VALUES (${title}, ${salary}, ${departmentId});`);
			const rows = await query(`SELECT title, roles.id, salary, dept_name FROM ${tableSelection} JOIN departments ON roles.department_id = departments.id;`);
			const table = new Table();
			table.addRows(rows, { color: 'cyan' });
			table.printTable();
		} finally {
			connection.end();
		}
	} else if (tableSelection == "departments") {
		const { deptName } = params;
		try {
			await query(`INSERT INTO ${tableSelection} (dept_name) VALUES (${deptName});`);
			const rows = await query(`SELECT * FROM ${tableSelection};`);
			const table = new Table();
			table.addRows(rows, { color: 'cyan' });
			table.printTable();
		} finally {
			connection.end();
		}
	}
}
// create function to get the current list of employee names
async function getEmployeeNames() {
	let employeeData = await query('SELECT first_name, last_name FROM employees;')
	// [{ first_name: f , last_name: l}]
	let employeeArray = [];
	for (let employee of employeeData) {
		let employeeString = `${employee.first_name} ${employee.last_name}`;
		employeeArray.push(employeeString);
	}
	return employeeArray;
}
// create function to get the current list of role titles
async function getRoleTitles() {
	let roleData = await query('SELECT title FROM roles;');
	let roleArray = [];
	for (let role of roleData) {
		let roleTitle = role.title;
		roleArray.push(roleTitle);
	}
	return roleArray;
}
// create function to get the current list of departments
async function getDeptNames() {
	let deptData = await query('SELECT dept_name from departments;');
	let deptArray = [];
	for (let dept of deptData) {
		let deptName = dept.dept_name;
		deptArray.push(deptName);
	}
	return deptArray;
}
// create function to update specific things about employees
async function updateDataIn(tableSelection, params, identifier) {
	if (tableSelection == "employees" && identifier == "role") {
		const { selectedEmployee, roleTitle } = params;
		let employeeNameArray = selectedEmployee.split(' ');
		let firstName = employeeNameArray[0];
		try {
			let roleIdArr = await query(`SELECT id FROM roles WHERE title="${roleTitle}"`)
			let roleId = roleIdArr[0].id;
			await query(`UPDATE ${tableSelection} SET role_id="${roleId}" WHERE first_name="${firstName}";`);
			const rows = await query(`SELECT e.id, first_name, last_name, r.title, d.dept_name, salary, em.first_name FROM employees e JOIN roles r ON e.role_id = r.id JOIN departments d ON r.department_id = d.id JOIN employees em ON e.manager_id = em.id;`);
			const table = new Table();
			table.addRows(rows, { color: 'cyan' });
			table.printTable();
		} finally {
			connection.end();
		}
	} else if (tableSelection == "employees" && identifier == "manager") {
		const { selectedEmployee, selectedManager } = params;
		let employeeNameArray = selectedEmployee.split(' ');
		let firstName = employeeNameArray[0];
		let managerNameArray = selectedManager.split(' ');
		let managerFirst = managerNameArray[0];
		try {
			let managerIdArr = await query(`SELECT id FROM ${tableSelection} WHERE first_name="${managerFirst}";`);
			let managerId = managerIdArr[0].id;
			await query(`UPDATE ${tableSelection} SET manager_id="${managerId}" WHERE first_name="${firstName}";`);
			const rows = await query(`SELECT e.id, first_name, last_name, r.title, d.dept_name, salary, em.first_name FROM employees e JOIN roles r ON e.role_id = r.id JOIN departments d ON r.department_id = d.id JOIN employees em ON e.manager_id = em.id;`);
			const table = new Table();
			table.addRows(rows, { color: 'cyan' });
			table.printTable();
		} finally {
			connection.end();
		}
	}
}
// create function to delete rows from chosen table
async function deleteDataFrom(tableSelection, params) {
	if (tableSelection == "employees") {
		const { deletedEmployee } = params;
		let employeeNameArray = deletedEmployee.split(' ');
		let firstName = employeeNameArray[0];
		let lastName = employeeNameArray[1];
		try {
			let employeeIdArr = await query(`SELECT id FROM ${tableSelection} WHERE first_name="${firstName}", last_name="${lastName}";`)
			let employeeId = employeeIdArr[0].id;
			await query(`DELETE FROM ${tableSelection} WHERE id="${employeeId}";`)
			const rows = await query(`SELECT e.id, first_name, last_name, r.title, d.dept_name, salary, em.first_name FROM employees e JOIN roles r ON e.role_id = r.id JOIN departments d ON r.department_id = d.id JOIN employees em ON e.manager_id = em.id;`);
			const table = new Table();
			table.addRows(rows, { color: 'cyan' });
			table.printTable();
		} finally {
			connection.end();
		}
	} else if (tableSelection == "roles") {
		const { deletedRole } = params;
		try {
			let roleIdArr = await query(`SELECT id FROM ${tableSelection} WHERE title="${deletedRole}";`)
			let roleId = roleIdArr[0].id;
			await query(`DELETE FROM ${tableSelection} WHERE id="${roleId}";`)
			const rows = await query(`SELECT title, roles.id, salary, dept_name FROM ${tableSelection} JOIN departments ON roles.department_id = departments.id;`);
			const table = new Table();
			table.addRows(rows, { color: 'cyan' });
			table.printTable();
		} finally {
			connection.end();
		}
	} else if (tableSelection == "departments") {
		const { deletedDept } = params;
		try {
			let deptIdArr = await query(`SELECT id FROM ${tableSelection} WHERE dept_name="${deletedDept}";`)
			let deptId = deptIdArr[0].id;
			await query(`DELETE FROM ${tableSelection} WHERE id="${deptId}";`)
			const rows = await query(`SELECT * FROM ${tableSelection};`);
			const table = new Table();
			table.addRows(rows, { color: 'cyan' });
			table.printTable();
		} finally {
			connection.end();
		}
	}
}
// export the functions!
module.exports = { queryAllFrom, addDataTo, updateDataIn, getEmployeeNames, getRoleTitles, deleteDataFrom, getDeptNames }
