const mysql = require("mysql2");

const config = require("../config");

// const pool = mysql.createPool({
//   host: "localhost",
//   user: "versavvy_proPlast",
//   database: "versavvy_warehouse",
//   password: "D57T08)YwgQF",
// });

//<<<<<<< HEAD
 //const pool = mysql.createPool({
  // host: "localhost",
  // user: config.DBUSER,
  // database: config.DBNAME,
  // password: config.DBPASSWORD,
 //});


//const pool = mysql.createPool({
 // host: "localhost",
 // user: "root",
 // database: "erp_db",
 // password: "",
//});
//=======
const pool = mysql.createPool({
  host: "localhost",
  user: config.DBUSER,
  database: config.DBNAME,
  password: config.DBPASSWORD,
});
//>>>>>>> 42dceaa8b3c36e2b06fabf96207a2a5573c13f50

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  database: "erp_db",
  password: "",
});

module.exports = pool.promise();
