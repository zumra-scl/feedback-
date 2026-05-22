const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Burhan27",
  database: "feedback_support",
});

module.exports = connection.promise();

