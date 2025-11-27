import { registerUserService, loginUserService } from "../services/authService.js";
import { HTTP_STATUS } from "../constants/httpStatus.js";

export const registerController = async(req,res,next) => {
    try{
        const data = await registerUserService(req.body);

        return res.status(HTTP_STATUS.CREATED).json({
            success : true,
            message : "User Registered Successfully",
            data,
        });

    } catch(err){
        next(err);
    }
};

export const loginController = async(req,res,next) => {
    try{
        const data = await loginUserService(req.body);
        return res.status(HTTP_STATUS.CREATED).json({
            success : true,
            message : "Login Successfully",
            data,
        });
        
    } catch (err) {
        next(err);
    }
}