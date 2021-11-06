-- get departments
SELECT * FROM departments; 



-- get roles
SELECT title, roles.id, salary, dept_name 
FROM roles 
JOIN departments 
ON roles.department_id = departments.id;




-- get employees
SELECT e.id, e.first_name, e.last_name, r.title, d.dept_name, salary, m.last_name AS manager 
FROM employees e 
LEFT JOIN roles r ON e.role_id = r.id 
LEFT JOIN departments d ON r.department_id = d.id 
LEFT JOIN employees m ON e.manager_id = m.id;




-- insert employees
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?);

-- insert role
INSERT INTO roles (title, salary, department_id) VALUES (?,?,?);

-- insert department
INSERT INTO departments (dept_name) VALUES (?);

-- get employee names
SELECT first_name, last_name FROM employees;

-- get role titles
SELECT title FROM roles;

-- get department names
SELECT dept_name from departments;

-- find role id
SELECT id FROM roles WHERE title= ?;

-- find employee id
SELECT id FROM employees WHERE first_name= ? AND last_name= ?;

-- find department id
SELECT id FROM departments WHERE dept_name= ?;

-- update role for employee
UPDATE employees SET role_id= ? WHERE first_name= ? ;

-- update manager for employee
UPDATE employees SET manager_id= ? WHERE last_name= ?;

-- delete employee
DELETE FROM employees WHERE id= ?;

-- delete role
DELETE FROM roles WHERE id= ?;

-- delete department
DELETE FROM departments WHERE id= ?;

-- get all mangers
SELECT DISTINCT m.first_name, m.last_name FROM employees e JOIN employees m ON e.manager_id = m.id;

-- get manager id
SELECT id FROM employees WHERE first_name= ? AND last_name= ?;

-- view employees by manager
SELECT e.first_name, e.last_name, r.title FROM employees JOIN roles r ON e.role_id = r.id AND e.id = ?;

-- view employees by department
SELECT e.first_name, e.last_name, r.title FROM employees JOIN roles r ON e.role_id = r.id JOIN departments d ON r.department_id = d.id AND dept_name= ?;

-- get utilized budget from department
SELECT d.dept_name AS department, SUM(r.salary) AS utilized_budget FROM employees e LEFT JOIN roles r ON r.id = e.role_id LEFT JOIN departments d ON r.department_id = d.id GROUP BY d.dept_name;