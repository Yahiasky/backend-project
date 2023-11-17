const connection_MySQL=require('../../MySql/connect')

var getUsers=async (req,res)=>{
        
    connection_MySQL.query(`INSERT INTO access (  URL, METHOD) VALUES ( '${"users"+req.url}','${req.method}' );`)
    var [data]= await connection_MySQL.query(`SELECT * FROM deleted_users;`)
    res.json(data)

}
module.exports={getUsers}