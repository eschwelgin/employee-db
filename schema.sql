DROP DATABASE employee_db;
CREATE DATABASE employee_db;
USE employee_db; 

CREATE TABLE department (
    department_id INT AUTO_INCREMENT,
    dept_name varchar(30),
    PRIMARY KEY(department_id)
);

CREATE TABLE employee_role (
    role_id INT AUTO_INCREMENT,
    title varchar(30) NOT NULL,
    salary decimal NOT NULL, 
    department_id INT, 
    CONSTRAINT fk_dept
    FOREIGN KEY (department_id)
		REFERENCES department(department_id),
    PRIMARY KEY(role_id)
);

CREATE TABLE employee (
    employee_id INT AUTO_INCREMENT,
    first_name varchar(30) NOT NULL,
    last_name varchar(30) NOT NULL,
    employee_role INT,
	CONSTRAINT fk_role 
	FOREIGN KEY (employee_role)
		REFERENCES employee_role(role_id),
	manager_id INT, 
	CONSTRAINT fk_manager
	FOREIGN KEY (manager_id)
		REFERENCES employee(employee_id), 
    PRIMARY KEY(employee_id)
);

INSERT INTO department(dept_name)
    VALUES("Development"),
            ("Sales"),
            ("Customer Support")
            ;
INSERT INTO employee_role(title, salary, department_id)
    VALUES ("Lead Developer", 100000, 1),
            ("Developer", 75000, 1), 
            ("Sales Manager", 80000, 2),
            ("Customer Support Manager", 60000, 3),
            ("Salesman", 40000, 2), 
            ("Customer Support Specialist", 32000, 3)
            ;
INSERT INTO employee(first_name, last_name, employee_role, manager_id)
    VALUES("Eric", "Schwelgin", 1, 1),
            ("Katie", "Baker", 4, 1),
            ("John", "Lopo", 6, 2),
            ("Bobby", "BootCamp", 2, 1), 
            ("Jacob", "BootCamp", 2, 1), 
            ("Eric", "Susa", 3, 1), 
            ("Mike", "Wapo", 5, 6),
            ("Shane", "Dirt", 5, 6),
            ("Chris", "Cleveland", 6, 2)
            ;

SELECT employee.employee_id, employee.first_name, employee.last_name, department.dept_name, employee_role.title, employee_role.salary
FROM employee
LEFT JOIN employee_role ON employee.employee_role = employee_role.role_id
LEFT JOIN department ON employee_role.department_id = department.department_id
ORDER BY employee.employee_id ASC
;

