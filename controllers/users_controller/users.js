
const connection_MySQL=require('../../MySql/connect')
let {format}=require('date-fns')
var log=(req)=>connection_MySQL.query(`INSERT INTO access (  URL, METHOD) VALUES ( '${"users"+req.url}','${req.method}' );`)
var validator=require('validator')
var getUsers=async (req,res)=>{
        log(req)

        const [data]=await connection_MySQL.query(`SELECT * FROM users;`)
        res.json(data)

    }

var putUser=
    (req,res)=>{
    log(req)
     if(!req.body.username){
    res.status(500).json({
        "message":"you need username  "
    })
 connection_MySQL.query(`INSERT INTO error ( typeErr, contentErr) VALUES ( '500','id misssing  to put user' );`)      
}
else{ 
    
    connection_MySQL.query(`UPDATE users SET lastMod = "${format(new Date(),'yyyy-MM-dd  HH:mm:ss')}" WHERE users.username =${parseInt(req.body.username)} ;`)
    
    if(req.body.email) connection_MySQL.query(`UPDATE users SET email = "${req.body.email}" WHERE users.username = ${parseInt(req.body.username)};`)
    if(req.body.password) connection_MySQL.query(`UPDATE users SET password = "${req.body.password}" WHERE users.username = ${parseInt(req.body.username)};`)
    res.json({
        "message":"updated !"
    })
   
}




}
var updateUsername=async (req,res)=>{
    const cookie=req.cookies
    const refresh_token=cookie.refreshToken
    var newUsername=req.body.username
    var oldUsername=req.username
    var [data]=await connection_MySQL.query('select * from users where username=?',[newUsername])
    if(!(data.length==0)) return  res.status(401).json({"msf":"username already used "})

    // update username in all tables
    await connection_MySQL.query('update users set username=? where username = ?',[newUsername,oldUsername])
    await connection_MySQL.query('update status set username=? where username = ?',[newUsername,oldUsername])
    await connection_MySQL.query('update jobs set username=? where username = ?',[newUsername,oldUsername])



    await connection_MySQL.query(`UPDATE users SET lastMod = ? WHERE users.username =? ;`,[format(new Date(),'yyyy-MM-dd  HH:mm:ss'),newUsername])
    await connection_MySQL.query('update login set username=? where refreshToken = ?',[newUsername,refresh_token])
    const [TheUser]=await connection_MySQL.query(`select * from users where username=?`,[newUsername])
   res.status(201).json(TheUser[0])




}
var postUser=async (req,res)=>{
    log(req)
       const bcrypt=require('bcrypt')
       const hashedPassword= await bcrypt.hash( req.body.password,10)
     if(req.body.username  && req.body.email && req.body.password){
        
       if(req.body.password.length<8 || req.body.username.length<2){
         res.status(500).json({
                    "message":"incorrect info "
                })
        connection_MySQL.query(`INSERT INTO error ( typeErr, contentErr) VALUES ( '500','incorrect info to post user' );`)
       }
               
        else{

               if(!validator.isEmail(req.body.email)){
                res.status(500).json({
                    "message":`${req.body.email} is not valid email`
                })
                connection_MySQL.query(`INSERT INTO error ( typeErr, contentErr) VALUES ( '500','incorrect email to post user' );`)



                     }
                else{
                 
                
                connection_MySQL.query(`INSERT INTO users ( username, email, password,creationDate) VALUES ( "${req.body.username}","${req.body.email}" ,"${hashedPassword}","${format(new Date(),'yyyy-MM-dd  HH:mm:ss')}" );`)
                        res.json({
                            "message":"done!",
                            ...(req.body)
                            
                        })
                     



                }
             
    
    
    
    
    
    
    
    
    
    
     }


        
    }

     else{
       connection_MySQL.query(`INSERT INTO error ( typeErr, contentErr) VALUES ( '500','miss info to post user' );`)
       res.status(500)
       .json({
        "message":"you must to send all information {firstname,lastname,email,password}"
        })
      }
}

var getUser=async(req,res)=>{

    log(req)
        
   const data=await connection_MySQL.query(`SELECT * FROM users where username = '${req.params.username}';`)
   res.json(data)

}
var deleteUser=async(req,res)=>{
                             
    log(req)
  
    const data = await 
    connection_MySQL.query(`select *  FROM users WHERE users.username ='${req.params.username}'`)
    connection_MySQL
    .query(`INSERT INTO Deleted_users (username, email, password,creationDate,lastMod) VALUES ( "${data[0].username}"  ,"${data[0].email}","${data[0].password}" ,"${data[0].creationDate}","${data[0].lastMod}");`)


    connection_MySQL.query(`DELETE FROM users WHERE users.username ='${req.params.username}'`)
    connection_MySQL.query(`DELETE FROM likedstatu WHERE username ='${req.params.username}'`)
    connection_MySQL.query(`DELETE FROM jobs WHERE username ='${req.params.username}'`)
    connection_MySQL.query(`DELETE FROM socialmedia WHERE username ='${req.params.username}'`)


     res.json({
        "message":"deleted !"
     })





    
}


module.exports={getUser,putUser,postUser,getUsers,deleteUser,updateUsername}
    