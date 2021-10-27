let selectEmployees = `SELECT e.id, e.first_name, e.last_name, r.title, d.dept_name, r.salary, m.last_name AS manager FROM employees e LEFT JOIN roles r ON e.role_id = r.id LEFT JOIN departments d ON r.department_id = d.id LEFT JOIN employees m ON e.manager_id = m.id;`;

let selectDepartments = `SELECT * FROM departments;`;

let selectRoles = `SELECT r.title, r.id, r.salary, d.dept_name AS department FROM roles r JOIN departments d ON r.department_id = d.id;`;

let insertEmployee = `INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (${firstName}, ${lastName}, ${roleId}, ${managerId});`;

let insertRole = `INSERT INTO roles (title, salary, department_id) VALUES (${title}, ${salary}, ${departmentId});`;

let insertDepartment = `INSERT INTO departments (dept_name) VALUES ("${deptName}");`;

let employeeNames = 'SELECT first_name, last_name FROM employees;';

let roleTitles = 'SELECT title FROM roles;';

let departmentNames = 'SELECT dept_name from departments;';

let findRoleId = `SELECT id FROM roles WHERE title="${roleTitle}";`;

let updateRole = `UPDATE employees SET role_id="${roleId}" WHERE first_name="${firstName}";`;

let findManagerId = `SELECT id FROM employees WHERE last_name="${managerLast}";`;

let updateManager = `UPDATE employees SET manager_id=${managerId} WHERE last_name="${lastName}";`;

let findEmployeeId = `SELECT id FROM employees WHERE first_name="${firstName}" AND last_name="${lastName}";`;

let deleteEmployee = `DELETE FROM employees WHERE id="${employeeId}";`;

//! you already have findRoleId
let getRoleId = `SELECT id FROM roles WHERE title="${deletedRole}";`;

let deleteRole = `DELETE FROM roles WHERE id="${roleId}";`;

let findDepartmentId = `SELECT id FROM departments WHERE dept_name="${deletedDept}";`;

let deleteDepartment = `DELETE FROM departments WHERE id="${deptId}";`;

let getAllManagers = `SELECT DISTINCT m.first_name, m.last_name FROM employees e JOIN employees m ON e.manager_id = m.id;`;

let getManagerId = `SELECT id FROM employees WHERE first_name=${managerFirstName} AND last_name= ${managerLastName};`;

let viewManagerEmployees = `SELECT e.first_name, e.last_name, r.title FROM employees JOIN roles r ON e.role_id = r.id AND e.id = ${managerEmployeeId};`;

let getEmployeesByDept = `SELECT e.first_name, e.last_name, r.title FROM employees JOIN roles r ON e.role_id = r.id JOIN departments d ON r.department_id = d.id AND dept_name= ${departmentName};`

module.exports = { selectEmployees, selectRoles, selectDepartments, insertEmployee, insertRole, insertDepartment, employeeNames, roleTitles, findRoleId, updateRole, findManagerId, updateManager, findEmployeeId, deleteEmployee, departmentNames, getRoleId, deleteRole, findDepartmentId, deleteDepartment, getAllManagers, viewManagerEmployees, getManagerId, getEmployeesByDept }