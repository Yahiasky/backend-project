const connection_MySQL=require('../MySql/connect')
var log=(req)=>connection_MySQL.query(`INSERT INTO access (  URL, METHOD) VALUES ( '${"users"+req.url}','${req.method}' );`)
const logout=async(req,res)=>{
    log(req)
    const cookie=req.cookies
    if(!cookie?.refreshToken) return res.sendStatus(204)
    const refresh_token=cookie.refreshToken
    const [TheUser] = await connection_MySQL.query(`select * from login where refreshToken='${refresh_token}'`)
    if(!TheUser[0]) return res.sendStatus(204)
    res.clearCookie('refreshToken',{httpOnly:true,sameSite:'None',secure:true})
    connection_MySQL.query(`delete from login where username= '${TheUser[0].username}'`)
    return res.sendStatus(200)

    
}
module.exports=logout