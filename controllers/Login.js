const connection_MySQL=require('../MySql/connect')
let jwt=require('jsonwebtoken')
let bcrypt=require('bcrypt')
var log=(req)=>connection_MySQL.query(`INSERT INTO access (  URL, METHOD) VALUES ( '${"users"+req.url}','${req.method}' );`)
const Login=async (req,res)=>{
    log(req)
    //username passowrd
   
    if(!req.body.username || !req.body.password) return res.status(400).json({"message":"username & password are required"})
      
  
  
      
     const [TheUser]=await connection_MySQL.query(`select * from users where username='${req.body.username}'`)
     if(!TheUser[0]) return res.sendStatus(403)
      const match=await bcrypt.compare(req.body.password,TheUser[0].password)
      if(!match) return res.status(401).json({"message":"password incorrect"})
      let access_token=jwt.sign(
        {
            "userInfo":{
            "email": req.body.email,
            "username":TheUser[0].username,
            "idUser":TheUser[0].idUser,
            "Role":TheUser[0].role

            }
        },process.env.ACCESS_TOKEN_SECRET,{
            expiresIn:"30s"
        }
      )
      
      let refresh_token=jwt.sign(
        {
            "userInfo":{
            "email": req.body.email,
            "username":TheUser[0].username,
            "idUser":TheUser[0].idUser,
            }
        },process.env.refresh_TOKEN_SECRET,{
            expiresIn:"1d"
        }
      )
      connection_MySQL.query(`insert into login (refreshToken,username) values ('${refresh_token}','${TheUser[0].username}')`)
      res.cookie('refreshToken',refresh_token,{httpOnly:true,maxAge:24*60*60*1000,sameSite:'None',secure:true})
      return res.json({
        "access_token":access_token,
        "user":TheUser[0]
    
    })



      


}
module.exports=Login

