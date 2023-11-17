const connection_MySQL=require('../../MySql/connect')
var getAccounts=async(req,res)=>{
  
    var username=req.username
    var [data]= await  connection_MySQL.query(`select * from socialmedia where username='${username}'`)
    var [icons]=await  connection_MySQL.query(`select * from icons `)
    return res.json({data,icons})

}

module.exports={getAccounts}