USE employee_tracker_db;

INSERT INTO departments (id, department_name)
VALUES  (001, 'OPERATIONS'),
        (002, 'FINANCE'),
        (003, 'MARKETING'),
        (004, 'IT'),
        (005, 'HR');
       
INSERT INTO roles (id, title, salary, department_id)
VALUES  (1,  'COMPANY Director', 200000, 001),
        (2,  'OPERATIONS Director', 150000, 001),
        (3,  'FINANCE Director', 150000, 2),
        (4,  'HR AND PEOPLE Director', 150000, 005),
        (5,  'IT Director', 150000, 004),
        (6,  'MARKETING Director', 100000, 003),
        (7,  'PRODUCT Manager', 100000, 004),
        (8,  'FINANCE Manager', 100000, 002),
        (9,  'PROGRAMMING Manager', 100000, 004),
        (10, 'HR AND PEOPLE Manager', 60000, 005),
        (11, 'MARKETING Manager', 100000, 003),
        (12, 'IT Manager', 100000, 004),
        (13, 'Opertions Manager', 100000, 001);

INSERT INTO employees (id, first_name, last_name, role_id, manager_id)
VALUES  (001, 'John', 'Jamiseon', 1, null),
        (002, 'Daniel', 'Fernandez', 2, 1),
        (003, 'Chol', 'Chamberlien', 3, 1),
        (004, 'Donald', 'Ferrer', 4, 1),
        (005, 'Kylie', 'Crock', 5, 1),
        (006, 'Janis', 'Parker', 6, 1),
        (007, 'Alex', 'Cain', 7, 4),
        (008, 'Lily', 'Lopez', 8, 3),
        (009, 'James', 'Rumple', 9, 5),
        (010, 'Parwiz', 'Rodriguez', 10, 4),
        (011, 'Patricia', 'Sanchez', 11, 6),
        (012, 'Patrick', 'Consate', 12, 5),
        (013, 'Neil', 'Supra', 13, 2);