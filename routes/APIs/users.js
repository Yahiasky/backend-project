let express=require('express')
let app=express.Router()
const connection_MySQL=require('../../MySql/connect')
const path=require('path')

const { getUsers, putUser, postUser, getUser, deleteUser,updateUsername } = require('../../controllers/users_controller/users')



app.route('/')
            .get(getUsers)
            .put(putUser)
            .post(postUser)


app.route('/:username')
            .get(getUser)
            .delete(deleteUser)
            
app.route('/updateUsername').put(updateUsername)









//*404
app.all('*',(req,res)=>{
    connection_MySQL.query(`INSERT INTO access (  URL, METHOD) VALUES ( '${req.url}','${req.method}' );`)
    res.status(404)
       .sendFile(path.join(__dirname,'..','..','views','404.html'))
    connection_MySQL.query(`INSERT INTO error ( typeErr, contentErr) VALUES ( '404','NOT FOUND ERROR AT users' );`)
})
module.exports=app