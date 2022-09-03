USE employees_db;

INSERT INTO department
    (d_name)
VALUES
    ('marketing'),
    ('Engineering'),
    ('legal'),
    ('finance');

INSERT INTO role
    (title, salary, department_id)
VALUES
    ('Account manager', 120000, 1),
    ('Accountant', 90000, 1),
    ('Tech Lead', 150000, 2),
    ('Senior Engineer', 130000, 2),
    ('Sales Person', 700000, 3),
    ('Accountant', 80000, 3),
    ('Legal Team Lead', 120000, 4),
    ('Attorney', 130000, 4);

INSERT INTO employee
    (last_name, first_name, role_id, manager_id)
VALUES
    ('Jalloh', 'Ahmadu', 1, 1),
    ('Barry', 'Ibrahim', 2, NULL),
    ('Jackson', 'Jean', 3, NULL),
    ('Jones', 'Tom', 4, NULL),
    ('King', 'Matthew', 5, NULL),
    ('Torres', 'Arreona', 6, NULL),
    ('Arsen', 'Derick', 7, NULL),
    ('Saka', 'Bakayo', 8, NULL);