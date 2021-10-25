USE my_employees

INSERT INTO departments (name)
VALUES ("HR"),
("Engineering"),
("Management");

INSERT INTO roles (title, salary, department_id)
VALUES ("Staffing", 60000.00, 1),
("Administration", 65000.00, 1),
("Software Delevoper", 90000.00, 2),
("Backend Engineer", 110000.00, 2),
("Senior Developer", 160000.00, 2),
("Project Manager", 80000.00, 3),
("Director", 75000.00, 3),
("Lead Engineer", 180000.00, 2);

INSERT INTO employees (first_name, last_name, role_id)
VALUES ("Damien", "Luzzo", 5),
("Good", "Person", 2),
("Richard", "Feynman", 3),
("Cole", "Cochran", 4),
("Jack", "Manzer", 3),
("Nathan", "Delman", 4),
("Ari", "Newman", 7),
("Walker", "Foley", 6),
("Luc", "Luzzo", 3),
("Christopher", "Kennard", 4),
("Luke", "Skywalker", 1),
("Darrell", "Luzzo", 8);

UPDATE employees
SET manager_id = 12
WHERE role_id IN (3,4,5);

UPDATE employees
SET manager_id = 8
WHERE role_id IN (1,2);

UPDATE employees
SET manager_id = 7
WHERE role_id IN (6,8);
