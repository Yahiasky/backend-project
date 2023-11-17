require('dotenv').config()


let PORT=process.env.PORT || 3000;
let express=require('express')
let app=express()
let credentials=require('./config/credentials')
const connection_MySQL=require('./MySql/connect')
const path=require('path')
const cors=require('cors')
const corsOptions=require('./config/corsOptions')
const verifyJwt=require('./middlewares/verifyJWT')
let bodyParser=require('body-parser');
let cookieParser=require('cookie-parser')
app.use(express.json())
app.use(express.urlencoded({extended:false}))


//* for using request.body
app.use(bodyParser.json())
//* cors (who can access to server)

app.use(cors(corsOptions))
app.use(credentials)
//* for using cookies
app.use(cookieParser())

// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000'); 
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//     next();
// });


//=>
//*static files 
app.use('/',express.static(path.join(__dirname,'public')))
app.use('/users',express.static(path.join(__dirname,'public')))
app.use('/deletedUsers',express.static(path.join(__dirname,'public')))

// app.use((req,res,next)=>{
//     console.log(` Url : ${req.url} \n`)
//     console.log(` Method : ${req.method} \n`)
//     console.log(` origin : ${req.headers.origin} \n`)
//     console.log(`auth ${req.headers.Authorization}`)
//     next()
// })
//* routes







 app.use('/',require('./routes/root.js'))
app.use('/register',require('./routes/APIs/register.js'))
app.use('/verifyEmail',require('./routes/APIs/verifyEmail.js'))
app.use('/login',require('./routes/APIs/Login.js'))
app.use('/logout',require('./routes/APIs/logout.js'))

app.use('/AccessToken',require('./routes/APIs/AccessToken.js'))
app.use('/deletedUsers',require('./routes/APIs/deletedUsers.js'))


app.use(verifyJwt)
app.use('/users',require('./routes/APIs/users.js'))
app.use('/updatePassword',require('./routes/APIs/updatePassword.js'))
app.use('/Status',require('./routes/APIs/models/Status'))
app.use('/Jobs',require('./routes/APIs/models/Jobs'))
app.use('/socialMedia',require('./routes/APIs/models/socialMedia'))   




















//* listen
app.listen(PORT,()=>console.log(`server runnig on port : ${PORT}`))
//*error
app.use((err,req,res,next)=>{

    connection_MySQL.query(`INSERT INTO error ( typeErr, contentErr) VALUES ( '500','${err.stack}' );`)
   
})
