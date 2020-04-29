var mysql = require('mysql');

var connection = mysql.createConnection({
	port: '3306',
	host: '127.0.0.1',
	user: 'root',
	password: 'root',
	database: 'myDB',
	insecureAuth: true
});

connection.connect((err)=>{
	if(err)
		console.log(err);
	else
	{
		console.log("SQL Connected");
		connection.query("SELECT 1 FROM otptable LIMIT 1",(err,result)=>{
			if(err)
			{
				connection.query("CREATE TABLE otptable (email VARCHAR(255),code VARCHAR(255),expiryTime DATETIME DEFAULT CURRENT_TIMESTAMP)",(err,result)=>{
					if(err)
						console.log(err);
					else
						console.log("Table Created");
				})
			}
			else
				console.log(result);
		});
	}
});

module.exports = connection;