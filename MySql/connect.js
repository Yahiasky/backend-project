
const mysql=require('mysql2')
require('dotenv').config()

let msg;
try{
 var connection=mysql.createPool({
    host:process.env.DATABASE_HOST,
    user:process.env.USER,
    password:process.env.PASSWORD,
    database:process.env.DATABASE_NAME
}).promise()
msg=  'connected'

}
catch(errr){
    msg='connection failed'
    connection.query(`INSERT INTO error ( typeErr, contentErr) VALUES ( '500','${errr}' );`)
}
finally{
    console.log(` My Sql :${msg}`)  
}


module.exports=connection