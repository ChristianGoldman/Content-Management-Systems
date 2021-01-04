USE employee_tracker_db;

INSERT INTO department(name)
VALUES
('Sales'), 
('IT'), 
('HR');

INSERT INTO role(title, salary, department_id)
VALUES
('Sales person', 100000, 1), 
('Sales Manager', 100000, 1), 
('IT Manager', 780, 2), 
('Engineer', 90000, 2), 
('Hugh Manager', 40000, 1),
('Steve Manager', 40000, 2),
('Counselor', 50000, 3);


INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES
('Steve', 'Stevens', 6, NULL),
('Hugh', 'Jackman', 5, NULL),
('Michael', 'Fasbender', 2, 1),
('Christian', 'Goldman', 1, 2),
('Chris', 'Gold', 2, 2),
('Terry', 'Guy', 4, 1);


