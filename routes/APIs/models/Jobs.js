let express=require('express')
let app=express.Router()
let {getJobs}=require('../../../controllers/Jobs_controller/Jobs')
app.route('/:username').get(getJobs)

module.exports=app
