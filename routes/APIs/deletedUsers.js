let express=require('express')
let app=express.Router()
const connection_MySQL=require('../../MySql/connect')
const path=require('path')
const { getUsers } = require('../../controllers/users_controller/deletedUsers')




app.route('/')
            .get(getUsers)




//*404
app.all('*',(req,res)=>{
    connection_MySQL.query(`INSERT INTO access (  URL, METHOD) VALUES ( '${req.url}','${req.method}' );`)
    res.status(404)
       .sendFile(path.join(__dirname,'..','..','views','404.html'))
    connection_MySQL.query(`INSERT INTO error ( typeErr, contentErr) VALUES ( '404','NOT FOUND ERROR AT /deletedUsers' );`)
})
module.exports=app