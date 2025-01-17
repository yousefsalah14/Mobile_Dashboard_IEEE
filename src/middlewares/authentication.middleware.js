import jwt  from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../../DB/models/user.model.js";
import { Token } from "../../DB/models/token.model.js";

export const isAuthenticated =asyncHandler(async(req,res,next)=>{
    const {token} = req.headers
    //check token exist 
    if(!token) return next( new Error("token missed!😏"),{cause:500})
    // check token is valid ?
       const tokenDB = await Token.findOne({token,isValid:true})
       if(!tokenDB) return next(new Error("token invaild!!😠"),{cause:401})
    // verify token 
        const payload = jwt.verify(token,process.env.SECERT_KEY)

        //check user 
        const isUser = await User.findById(payload.id)
        if(!isUser) return next( new Error("user not found😁"),{cause:404})
        // check logged in 
        if(isUser.status=="offline") return next(new Error("you Must be logged in!😏",{cause:400}))
    //pass user to next middleware
    req.user =isUser
    //call next controller
     return next() 
})
  