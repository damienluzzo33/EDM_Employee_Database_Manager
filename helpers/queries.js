const mysql = require('mysql2'); // or use import if you use TS
const util = require('util');
const cTable = require('console.table');
const { printTable, Table } = require('console-table-printer');
// create the connection, specify bluebird as Promise
const connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'password',
	database: 'my_employees'
});

const query = util.promisify(connection.query).bind(connection);

// create function to query all data from selected database
async function queryFrom(tableSelection) {
	try {
		const rows = await query(`SELECT * FROM ${tableSelection};`);	
		const table = new Table();
		table.addRows(rows, { color: 'cyan' });
		table.printTable();
	} finally {
		connection.end();
	}
}

// call function to query all data from selected database
// queryFrom(tableSelection);

// create function to query all data from selected database
async function addTo(tableSelection, params) {
	if (tableSelection == "employees") {
		const {firstName, lastName, roleId, managerId} = params;
		try {
			const rows = await query(`INSERT INTO ${tableSelection} (first_name, last_name, role_id) VALUES (${firstName}, ${lastName}, ${roleId}, ${managerId});`);	
			const table = new Table();
			table.addRows(rows, { color: 'cyan' });
			table.printTable();
		} finally {
			connection.end();
		}
	} else if (tableSelection == "roles") {
		const { title, salary, departmentId } = params;
		try {
			const rows = await query(`INSERT INTO ${tableSelection} (first_name, last_name, role_id) VALUES (${title}, ${salary}, ${departmentId});`);
			const table = new Table();
			table.addRows(rows, { color: 'cyan' });
			table.printTable();
		} finally {
			connection.end();
		}
	}
}