const { selectEmployees, selectRoles, selectDepartments, insertEmployee, insertRole, insertDepartment, employeeNames, roleTitles, findRoleId, updateRole, findManagerId, updateManager, findEmployeeId, deleteEmployee, departmentNames, getRoleId, deleteRole, findDepartmentId, deleteDepartment, getAllManagers, viewManagerEmployees, getManagerId, getEmployeesByDept } = require('./queryStatements');
// import modules for the queries page
const mysql = require('mysql2');
const util = require('util');
// const cTable = require('console.table');
const { printTable, Table } = require('console-table-printer');
const { fileURLToPath } = require('url');
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

// create function that produces tables in console
function consoleTable(rows) {
	const table = new Table();
	table.addRows(rows, { color: 'cyan' });
	table.printTable();
}

// create function to query all data from selected database
async function queryAllFrom(tableSelection) {
	if (tableSelection == 'departments') {
		try {
			const rows = await query(selectDepartments);
			consoleTable(rows);
		} finally {
			connection.end();
		}
	} else if (tableSelection == 'roles') {
		try {
			const rows = await query(selectRoles);
			consoleTable(rows);
		} finally {
			connection.end();
		}
	} else if (tableSelection == 'employees') {
		try {
			const rows = await query(selectEmployees);
			consoleTable(rows);
		} finally {
			connection.end();
		}
	}
}
// create function to query all data from selected database
async function addDataTo(tableSelection, params) {
	if (tableSelection == 'employees') {
		const { firstName, lastName, roleId, managerId } = params;
		try {
			await query(insertEmployee);
			const rows = await query(selectEmployees);
			consoleTable(rows);
		} finally {
			connection.end();
		}
	} else if (tableSelection == 'roles') {
		const { title, salary, departmentId } = params;
		try {
			await query(insertRole);
			const rows = await query(selectRoles);
			consoleTable(rows);
		} finally {
			connection.end();
		}
	} else if (tableSelection == 'departments') {
		const { deptName } = params;
		try {
			await query(insertDepartment);
			const rows = await query(selectDepartments);
			consoleTable(rows);
		} finally {
			connection.end();
		}
	}
}
// create function to get the current list of employee names
async function getEmployeeNames() {
	let employeeData = await query(employeeNames);
	// [{ first_name: f , last_name: l}]
	let employeeArray = [];
	for (let employee of employeeData) {
		employeeArray.push(`${employee.first_name} ${employee.last_name}`);
	}
	return employeeArray;
}
// create function to get the current list of manager names
async function getManagerNames() {
	let managerData = await query(getAllManagers);
	// [{ first_name: f , last_name: l}]
	let managerArray = [];
	for (let manager of managerData) {
		managerArray.push(`${manager.first_name} ${manager.last_name}`);
	}
	return managerArray;
}

// create function to display the employees for each manager
async function queryManagerByEmployee(params) {
	let { manager } = params;
	let managerNameArr = manager.split(" ");
	let managerFirstName = managerNameArr[0];
	let managerLastName = managerNameArr[1];
	let managerIdArr = await query(getManagerId);
	let managerEmployeeId = managerIdArr[0].id;
	try {
		const rows = await query(viewManagerEmployees);
		consoleTable(rows);
	} finally {
		connection.end();
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
	if (tableSelection == 'employees' && identifier == 'role') {
		const { selectedEmployee, roleTitle } = params;
		let employeeNameArray = selectedEmployee.split(' ');
		let firstName = employeeNameArray[0];
		try {
			let roleIdArr = await query(findRoleId);
			let roleId = roleIdArr[0].id;
			await query(updateRole);
			const rows = await query(selectEmployees);
			consoleTable(rows);
		} finally {
			connection.end();
		}
	} else if (tableSelection == 'employees' && identifier == 'manager') {
		const { selectedEmployee, selectedManager } = params;
		let employeeNameArray = selectedEmployee.split(' ');
		let firstName = employeeNameArray[0];
		let managerNameArray = selectedManager.split(' ');
		let managerLast = managerNameArray[1];
		try {
			let managerIdArr = await query(findManagerId);
			let managerId = managerIdArr[0].id;
			await query(updateManager);
			const rows = await query(selectEmployees);
			consoleTable(rows);
		} finally {
			connection.end();
		}
	}
}
// create function to delete rows from chosen table
async function deleteDataFrom(tableSelection, params) {
	if (tableSelection == 'employees') {
		const { deletedEmployee } = params;
		let employeeNameArray = deletedEmployee.split(' ');
		let firstName = employeeNameArray[0];
		let lastName = employeeNameArray[1];
		try {
			let employeeIdArr = await query(findEmployeeId);
			let employeeId = employeeIdArr[0].id;
			await query(deleteEmployee);
			const rows = await query(selectEmployees);
			consoleTable(rows);
		} finally {
			connection.end();
		}
	} else if (tableSelection == 'roles') {
		const { deletedRole } = params;
		try {
			let roleIdArr = await query(getRoleId);
			let roleId = roleIdArr[0].id;
			await query(deleteRole);
			const rows = await query(selectRoles);
			consoleTable(rows);
		} finally {
			connection.end();
		}
	} else if (tableSelection == 'departments') {
		const { deletedDept } = params;
		try {
			let deptIdArr = await query(findDepartmentId);
			let deptId = deptIdArr[0].id;
			await query(deleteDepartment);
			const rows = await query(selectDepartments);
			consoleTable(rows);
		} finally {
			connection.end();
		}
	}
}
// create function to query employees in given department
async function queryEmployeeByDepartment(params) {
	let { departmentName } = params;
	try {
		let rows = await query(getEmployeesByDept);
		consoleTable(rows);
	} finally {
		connection.end();
	}
}

// export the functions!
module.exports = {queryAllFrom, addDataTo, updateDataIn, getEmployeeNames, getRoleTitles, deleteDataFrom, getDeptNames, consoleTable, getManagerNames, queryManagerByEmployee, queryEmployeeByDepartment};
