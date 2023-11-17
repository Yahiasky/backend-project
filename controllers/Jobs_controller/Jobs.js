
const connection_MySQL=require('../../MySql/connect')

var getJobs=async(req,res)=>{
    var username=req.params.username
  let [data]=await connection_MySQL.query(`select * from Jobs where username= '${username}'`)
  if(!data ) res.json({"msg":"nodata"})
  return   res.json(data)
}
var putJobs=async(req,res)=>{
  
}
var deleteJobs=async(req,res)=>{
  
}

module.exports={getJobs,putJobs,deleteJobs}