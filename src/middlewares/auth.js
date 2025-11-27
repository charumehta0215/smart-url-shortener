import jwt from "jsonwebtoken";
import User from "../models/user.js";
import { HTTP_STATUS } from "../constants/httpStatus.js";

export const authMiddleware = async(req,res,next) => {
    try{
        const authorization = req.headers.authorization;

        if(!authorization || !authorization.startswith('Bearer')){
            return res.status(HTTP_STATUS.UNAUTHORIZED).json({
                success : false,
                message : "Authentication Required",
            })
        }

        const token = authorization.split("")[1];

        let decoded;
        try{
            decoded = jwt.verify(token,process.env.JWT_SECRET);
        }catch(err){
            return res.status(HTTP_STATUS.UNAUTHORIZED).json({
                success:false,
                message:"Invalid or expired token",
            })
        }

        const user = await User.findById(decoded.id)
        if(!user){
            return res.status(HTTP_STATUS.UNAUTHORIZED).json({
                success:false,
                message:"User not found",
            })
        }

        req.user = user;
        next();
    }catch(err){
        next(err);
    }
}