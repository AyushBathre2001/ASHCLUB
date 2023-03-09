const jwt = require('jsonwebtoken')

const fetchuser = (req,res,next)=>{
    const token = req.header('token')
    if(!token){
        res.json({"msg":"please authenticate using a valid token1"})
    }
    try {
        const data = jwt.verify(token,process.env.JWT_SECRET)
        req.user = data.id
        next()
        
    } catch (error) {
        res.json({"msg":"please authenticate using a valid token1"})

    }
        
    
}

module.exports = fetchuser