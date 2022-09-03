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