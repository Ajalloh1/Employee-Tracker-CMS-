// requiring the dependencies
const inquirer = require('inquirer');
const util = require('util');
const mysql = require('mysql2');
const fs = require('fs');
const cTable = require('console.table');

//creating logo using asciiart dependency conneting to the json file//
const logoStamp = require('asciiart-logo');
const config = require('./package.json');
console.log(logoStamp(config).render());

//connecting mysql with credentials//

const connect = mysql.createConnect({
    host: 'localhost',
    port: 3001,
    user: 'root',
    password: 'Conakry1',
    database: 'employee_db'

});
//logic or if statement for connect//
connect.connect((err) => {
    if (err) {
        console.log('sorry, you are not connected');
        return
    } else { console.log("congrats you're connected!") };

    // data prompt function for inquirer return.
    search();

})

connect.query = util.promisify(connect.query);

// data prompt function object//
function search() {
    inquirer
        .prompt({
            name: "options",
            type: "list of options",
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
            switch (answers.action) {
                case "all employees":

                    byEmployees();
                    runSearch();

                    break;
                //new case //
                case "departments":

                    byDepartment();
                    runSearch();

                    break;

                case "all roles":

                    byRole();
                    runSearch();

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
                            search();
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
                            search();
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
                            search();
                        })
                    break;
                //new input for removing employees from db//

                case "Remove ":
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
                            search();
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

    var results = connection.query("select employee.id, employee.last_name, employee.first_name, role.title, department.d_name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;",


        function (error, results) {
            if (error) throw error
            console.log("\n")
            console.table(results)
        })

};

// "View alL departments",
function byDepartment() {

    var department = connection.query("SELECT department.id, department.d_name FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department department on role.department_id = department.id WHERE department.id;",


        function (error, department) {
            if (error) throw error
            console.log("\n")
            console.table(department)
        })
};