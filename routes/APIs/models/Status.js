let express=require('express')
let app=express.Router()
let connection_MySql=require('../../../MySql/connect')
let verifyRoles=require('../../../middlewares/verifyRoles')

const { addStatus,updateStatus,deleteStatus,getStatusByUsername,getAllStatus,like,dislike,isLiked,getPublicStatus,LikesByUsername,getPublicStatu} = require('../../../controllers/Status_controller/Status')



    app.route('/isLiked')
    .post(isLiked)
    app.route('/publicStatus').get(getPublicStatus)
    app.route('/publicStatu/:id').get(getPublicStatu)
    app.route('/likesByUsername/:username').get(LikesByUsername)
    app.route('/like/:id')
    .put(like)
    app.route('/dislike/:id')
    .put(dislike)

    app.route('/')
      .post(addStatus)
      .put(updateStatus)
      
      .get(getAllStatus)



    app.route('/:username')
      .get(getStatusByUsername)
     
    app.route('/:id')
      .delete(deleteStatus)
      .put(updateStatus)
    


  



module.exports=app