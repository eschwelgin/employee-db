CREATE database employee_db;
USE employee_db; 

CREATE TABLE employee (
    id INT AUTO_INCREMENT,
    first_name varchar(30) NOT NULL,
    last_name varchar(30) NOT NULL,
    role_id INT NOT NULL, 
    manager_id INT,
    PRIMARY KEY(id)
);

CREATE TABLE role(
    id INT AUTO_INCREMENT,
    title varchar(30) NOT NULL,
    salary decimal NOT NULL, 
    PRIMARY KEY(id)
);

CREATE TABLE department (
    id INT AUTO_INCREMENT,
    name varchar(30),
    PRIMARY KEY(id)
);

INSERT INTO 