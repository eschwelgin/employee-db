DROP DATABASE employee_db;
CREATE DATABASE employee_db;
USE employee_db; 

CREATE TABLE department (
    id INT AUTO_INCREMENT,
    dept_name varchar(30),
    PRIMARY KEY(id)
);

CREATE TABLE employee_role (
    id INT AUTO_INCREMENT,
    title varchar(30) NOT NULL,
    salary decimal NOT NULL, 
    department_id INT, 
    CONSTRAINT fk_dept
    FOREIGN KEY (department_id)
		REFERENCES department(id),
    PRIMARY KEY(id)
);

CREATE TABLE employee (
    id INT AUTO_INCREMENT,
    first_name varchar(30) NOT NULL,
    last_name varchar(30) NOT NULL,
    employee_role INT,
	CONSTRAINT fk_role 
	FOREIGN KEY (employee_role)
		REFERENCES employee_role(id),
	manager_id INT, 
	CONSTRAINT fk_manager
	FOREIGN KEY (manager_id)
		REFERENCES employee(id), 
    PRIMARY KEY(id)
);

INSERT INTO department(dept_name)
    VALUES("Development"),
            ("Sales"),
            ("Customer Support");
INSERT INTO employee_role(title, salary, department_id)
    VALUES ("Lead Developer", 100000, 1),
            ("Developer", 75000, 1), 
            ("Sales Manager", 80000, 2),
            ("Customer Support Manager", 60000, 3),
            ("Salesman", 40000, 2), 
            ("Customer Support Specialist", 32000, 3);
INSERT INTO employee(first_name, last_name, employee_role, manager_id)
    VALUES("Eric", "Schwelgin", 1, 1),
            ("Katie", "Baker", 4, 1),
            ("John", "Lopo", 3, 2),
            ("Bobby", "BootCamp", 2, 1), 
            ("Jacob", "BootCamp", 2, 1), 
            ("Eric", "Susa", 2, 1), 
            ("Mike", "Wapo", 2, 6),
            ("Shane", "Dirt", 2, 6),
            ("Chris", "Dirt", 3, 2);

