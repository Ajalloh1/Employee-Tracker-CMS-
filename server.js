// requiring the dependencies
const inquirer = require('inquirer');
const util = require('util');
const mysql = require('mysql2');
const fs = require('fs');
const cTable = require('console.table');
require('dotenv').config();

const connection = mysql.createConnection({
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})

//creating logo using asciiart dependency conneting to the json file//
// const logoStamp = require('asciiart-logo');
const config = require('./package.json');
// console.log(logoStamp(config).render());
// data prompt function object//
function runSearch() {
    inquirer
        .prompt({
            name: "options",
            type: "list",
            message: "Please select from the list below to view?",
            choices: [
                "View all employees",
                "View all roles",
                "View all departments",
                "Add Department",
                "Add employee",
                "Add Role",
                "Update employee role",
                "Update employee manager",
                "Remove employee",
            ]
        }).then(answers => {
            // changing or switching statement//
            switch (answers.options) {
                case "View all employees":

                    byEmployees();


                    break;
                //new case //
                case "View all departments":

                    byDepartment();
                    break;

                case "View all roles":

                    byRole();
                    break;
                //case for adding employees data input//
                case "Add employee":
                    inquirer
                        .prompt([
                            {
                                name: "employees last name",
                                type: "input",
                                message: "What is the employee's last name?",
                                validate: answer => {
                                    if (answer !== "") {
                                        return true;
                                    }
                                    return "you must enter employee's last name";
                                }
                            },
                            {
                                name: "employee first name",
                                type: "input",
                                message: "What is the employee's first name",
                                validate: answer => {
                                    if (answer !== "") {
                                        return true;
                                    }
                                    return "you must enter employee's first name";
                                }
                            },
                            {
                                name: "department",
                                type: "input",
                                message: "please enter the id of role",

                            },
                            {
                                name: "manager",
                                type: "input",
                                message: "Please enter manager id",
                            }
                        ]).then(answers => {

                            addEmployee(answers.employeeFirst, answers.employeeLast, answers.department, answers.manager);
                            runSearch();
                        })
                    break;
                // New case prompt data input for adding department to database//
                case "Add Department":
                    inquirer
                        .prompt([
                            {
                                name: "Department",
                                type: "input",
                                message: "What department would you like to add?",
                                validate: answer => {
                                    if (answer !== "") {
                                        return true;
                                    }
                                    return "You must enter a department.";
                                }
                            },

                        ]).then(answers => {
                            //adding the information to the database//
                            addDepartment(answers.Department);
                            runSearch();
                        })
                    break;
                ///adding role//
                case "Add Role":
                    inquirer
                        .prompt([
                            {
                                name: "tittle",
                                type: "input",
                                message: "What is the tittle of the role you are adding?",
                                validate: answer => {
                                    if (answer !== "") {
                                        return true;
                                    }
                                    return "You must enter tittle";
                                }
                            },
                            {
                                name: "salary",
                                type: "input",
                                message: "What is the salary for the role?",

                            },
                            {
                                name: "department_id",
                                type: "input",
                                message: "Waht is the id of the department.",

                            }

                        ]).then(answers => {
                            // Adds role to database
                            addRole(answers.title, answers.salary, answers.department_id);
                            runSearch();
                        })
                    break;
                //new input for removing employees from db//

                case "Remove employee":
                    inquirer
                        .prompt([
                            {
                                name: "id",
                                type: "input",
                                message: "What is the employee's id?",

                            }
                        ]).then(answers => {
                            // Removes employee to database
                            removeEmployee(answers.id);
                            runSearch();
                        })
                    break;
                // to udate employees//
                case "Update employee role":

                    inquirer
                        .prompt([
                            {
                                name: "employeeId",
                                type: "input",
                                message: "Waht is the employee's id?",
                            },
                            {
                                name: "roleId",
                                type: "input",
                                message: "What is the role's id?",

                            }

                        ]).then(answers => {
                            // Updates employee's role
                            updateByRole(answers.employeeId, answers.roleId);
                            runSearch();

                        })

                    break;
                //prompt for updating employee manager//
                case "Update manager":

                    inquirer
                        .prompt([
                            {
                                name: "manager",
                                type: "input",
                                message: "wat is the manager id?",
                            },
                            {
                                name: "Employee",
                                type: "input",
                                message: "please enter employee id",

                            }
                        ]).then(answers => {
                            updateByManager(answers.manager, answers.Employee);
                            runSearch();
                        })

                    break;
            }
        });
}
// fucntion for all employee view//
function byEmployees() {
    ////start here//
    var results = connection.promise().query("select employee.id, employee.last_name, employee.first_name, role.title, department.d_name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;")
        .then(([rows]) => {
            console.table(rows)
            console.log('\n')
            runSearch();
        })
    //to here ///
    // console.log(results.catch((err) => console.error(err)))
};
// "View alL departments",
function byDepartment() {

    var department = connection.promise().query("SELECT department.id, department.d_name FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department department on role.department_id = department.id WHERE department.id;")
        .then(([rows]) => {
            console.table(rows)
            console.log('\n')
            runSearch();
        })
};
// function for all roles vie//
function byRole() {

    var manager = connection.promise().query("SELECT employee.id, role.title, department.d_name AS department, role.salary AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;")

        .then(([rows]) => {
            console.table(rows)
            console.log('\n')
            runSearch();
        })

};
//function for updating manager //
function updateByManager(managerId, employeeId) {

    var updateManager = connection.promise.query("UPDATE employee SET manager_id = ? WHERE id = ?")
        // [managerId, employeeId],
        .then(([rows]) => {
            console.table(rows)
            console.log('\n')
            runSearch();
        })

};
// function for adding employee //
function addEmployee(employeeFirst, employeeLast, department, manager) {

    var add = connection.query(
        "INSERT INTO employee SET first_name = ?, last_name = ?, role_id = ?, manager_id = ?",
        [employeeFirst, employeeLast, department, manager],
        function (error, add) {
            if (error) throw error
        })

    byEmployees();
}

// fucntion for displaying departments//
function departmentTable() {
    var depTable = connection.query("SELECT d_name FROM department;",


        function (error, depTable) {
            if (error) throw error
            console.table(depTable)
        })
}
//function for adding department///
// "Add Department"
function addDepartment(department) {

    var department = connection.query(
        "INSERT INTO department SET d_name = ?",
        [department],
        function (error, department) {
            if (error) throw error
        })

    departmentTable();
}

//displaying only role///

function roleTable() {
    var roleT = connection.query("SELECT title, salary, department_id FROM role;",

        function (error, roleT) {
            if (error) throw error
            console.table(roleT)
        })
}
function addRole(title, salary, department_id) {

    var newRole = connection.query(
        "INSERT INTO role SET title = ?, salary = ?, department_id = ?",
        [title, salary, department_id],
        function (error, newRole) {
            if (error) throw error
        })

    roleTable();
}


// fucntions for removing employee///
function removeEmployee(id) {

    var add = connection.query(
        "DELETE FROM employee WHERE id = ?",
        [id],
        function (error, id) {
            if (error) throw error
        })

    byEmployees();
}

// functions for updating the role of employee//
function updateByRole(employeeId, roleId) {

    var byRole = connection.query(
        "UPDATE employee SET role_id = ? WHERE id = ?",

        [roleId, employeeId],
        function (error, role) {
            if (error) throw error

        })
    byDepartment();

}

runSearch();