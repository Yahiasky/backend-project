let express=require('express')
let app=express.Router()
var {getAccounts}=require('../../../controllers/socialMedia/socialMedia')
app.
route('/Accounts').get(getAccounts)



module.exports=app
