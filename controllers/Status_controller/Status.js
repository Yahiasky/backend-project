const connection_MySQL=require('../../MySql/connect')

var addStatus=async(req,res)=>{
  var username=req.username
  var context=req.body.context
  var visibility=req.body.visibility
  var title=req.body.title
  var id=require('crypto').randomBytes(10).toString('hex').toUpperCase()
  if(!context) return res.status(400).send('you need context !')
  if(title.length==0) title='untitled'
  await connection_MySQL.query(`insert into Status (id,context,username,title,visibility) values (?,?,?,?,?);`,[id,context,username,title,visibility])
  return res.sendStatus(201)

}
var like=async(req,res)=>{

  var id=req.params.id
  var username=req.body.username
  
  let [data]=await connection_MySQL.query(`select likes from status where id= ?`,[id])
  var oldLikes=data[0].likes
  
  await connection_MySQL.query(`update status set likes=${oldLikes+=1} where id= ?`,[id])
  if(!data ) return res.json({"msg":"nodata"})
  await connection_MySQL.query(`insert into likedstatu (idStatu,username) values (?,?);`,[id,username])
 return   res.sendStatus(200)

}
var isLiked=async(req,res)=>{
  var username=req.body.username
  var idStatu=req.body.idStatu
  if(!idStatu) return res.json({'msg':'no id'})
  var [data]=await connection_MySQL.query(`select * from likedstatu  where idStatu= ? and username=?;`,[idStatu,username])
  return res.status(200).json(!(data.length==0))
  

}
var LikesByUsername=async(req,res)=>{
  var username=req.params.username
  var [data]=await connection_MySQL.query(`select * from likedstatu  where  username=?;`,[username])

  return res.status(200).json(data)
  

}



var dislike=async(req,res)=>{

  var id=req.params.id
  var username=req.body.username

  await connection_MySQL.query(`DELETE FROM likedstatu WHERE idStatu = ? AND username = ?;`,[id,username])
  let [data]=await connection_MySQL.query(`select likes from status where id= ?`,[id])
  var oldLikes=data[0].likes
  if(oldLikes==0) return res.sendStatus(204)
  await connection_MySQL.query(`update status set likes=? where id=?`,[oldLikes-=1,id])
  
 return   res.sendStatus(200)

}

var updateStatus=async (req,res)=>{

  var id=req.params.id
  var context=req.body.context
  var visibility=req.body.visibility
  var title=req.body.title
  if(title.length==0) title='untitled'
  await connection_MySQL.query(`update status set context=?  where id= ?`,[context,id])
  await connection_MySQL.query(`update status set title=?  where id= ?`,[title,id])
  await connection_MySQL.query(`update status set visibility=?  where id= ?`,[visibility,id])
  
 return   res.sendStatus(200)

}
var deleteStatus=async (req,res)=>{
  var id=req.params.id
  let [data]=await connection_MySQL.query(`delete   from status where id= ?`,[id])
  await connection_MySQL.query(`DELETE FROM likedstatu WHERE idStatu = ? ;`,[id])
  if(!data ) res.json({"msg":"nodata"})
 return   res.json(data)


}
var getStatusByUsername=async (req,res)=>{
  var username=req.params.username
  let [data]=await connection_MySQL.query(`select * from status where username= '${username}'`)
  if(!data ) res.json({"msg":"nodata"})
 return   res.json(data)
}
var getAllStatus=async (req,res)=>{
  
  let [data]=await connection_MySQL.query(`select * from status`)
  if(!data ) res.json({"msg":"nodata"})
 return   res.json(data)




}
var getPublicStatus=async (req,res)=>{
  
  let [data]=await connection_MySQL.query(`select * from status where visibility ='public'`)
  if(!data ) res.json({"msg":"nodata"})
 return   res.json(data)




}
var getPublicStatu=async (req,res)=>{
  try {
      var id=req.params.id
      if(!id) return res.json({'msg':'no id'})
  let [data]=await connection_MySQL.query(`select * from status where visibility ='public' and id=?`,[id])
  if(!data ) res.json({"msg":"this post may be removed or is private"})
  return   res.json(data)
  } catch (error) {
    return res.json(error.stack)
  }





}
module.exports={addStatus,updateStatus,deleteStatus,getStatusByUsername,getAllStatus,like,dislike,isLiked,getPublicStatus,LikesByUsername,getPublicStatu}

