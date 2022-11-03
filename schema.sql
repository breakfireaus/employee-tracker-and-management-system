DROP DATABASE IF EXISTS employee_tracker_db;
CREATE DATABASE employee_tracker_db;

USE employee_tracker_db;

CREATE TABLE departments(
id INT AUTO_INCREMENT,
PRIMARY KEY (id),
department_name VARCHAR(30)
);

CREATE TABLE roles(
id INT AUTO_INCREMENT,
title VARCHAR(30),
salary DECIMAL(10, 2),
department_id INT,
PRIMARY KEY (id),
FOREIGN KEY (department_id) 
REFERENCES departments(id)
);

CREATE TABLE employees(
id INT AUTO_INCREMENT,
first_name VARCHAR(30) NOT NULL,
last_name VARCHAR(30) NOT NULL,
role_id INT,
manager_id INT,
PRIMARY KEY (id),
FOREIGN KEY (role_id)
REFERENCES roles(id),
FOREIGN KEY (manager_id)
REFERENCES employees(id)
);