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
            message: "Please choose from the list below?",
            choices: [
                "View all employees",
                "View all departments",
                "View all roles",
                "Add employee",
                "Add Department",
                "Add Role",
                "Remove employee",
                "Update employee role",
                "Update employee manager"
            ]