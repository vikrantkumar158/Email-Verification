var mysql = require('mysql');
var bcrypt = require('.././models/bcrypt');
var connection = require('.././db/db');
var moment = require('moment');

exports.save = (email,code,cb)=>
{
	console.log(connection.state);
	connection.query("SELECT * FROM otptable WHERE email = ?",[email],(err,result,fields)=>{
		if(err)
			cb(err);
		if(result.length==0)
		{
			connection.query("INSERT INTO otptable (email,code) VALUES (?,?)",[email,bcrypt.encrypt(code)],(err,result,fields)=>{
				if(err)
					cb(err);
				cb(null,result);
			});
		}
		else
		{
			connection.query("UPDATE otptable SET code = ?, expiryTime = ? WHERE email = ?",[bcrypt.encrypt(code),moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),email],(err,result,fields)=>{
				if(err)
					cb(err);
				cb(null,result);
			});
		}	
	});
}

exports.match = (email,code,cb)=>
{
	connection.query("SELECT * FROM otptable WHERE email = ? AND TIMESTAMPDIFF(MINUTE,expiryTime,CURRENT_TIMESTAMP)<2",[email],(err,result,fields)=>{
		if(err)
			cb(err);
		if(result.length==0)
		{
			connection.query("DELETE FROM otptable WHERE email = ?",email,(err,result,fields)=>{
				if(err)
					cb(err);
				cb(null,undefined);
			});
		}
		else
			cb(null,bcrypt.match(code,result[0].code));
	});
}

exports.remove = (email,cb)=>
{
	connection.query("DELETE FROM otptable WHERE email = ?",email,(err,result,fields)=>{
		if(err)
			cb(err);
		cb(null,result);
	});
}