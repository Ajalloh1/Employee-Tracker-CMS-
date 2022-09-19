const mysql = require("mysql2")
const dotenv = require("dotenv")

dotenv.config()
//connecting mysql with credentials//
const connConfig = {
    host: "localhost",
    port: process.env.DB_PORT || 27017,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME


}

const connection = mysql.createConnection(
    connConfig

);

module.exports = connection

//logic or if statement for connect//
// connection.connect((err) => {
//     if (err) {
//         console.log('sorry, you are not connected');
//         return
//     } else { console.log("congrats you're connected!") };

//     // data prompt function for inquirer return.
//     runSearch();

// })