var mysql = require('mysql');

var connection = mysql.createConnection({
  host : 'localhost',
  port : 3306,
  user : 'deanly88',
  password : '',
  database : 'c9'
});
connection.connect(function(err) {
    if (err) {
        console.error('mysql connection error');
        console.error(err);
        throw err;
    }
});

// connection.query('USE c9');
exports.connection = connection;