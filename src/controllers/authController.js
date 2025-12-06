import { registerUserService, loginUserService } from "../services/authService.js";
import { HTTP_STATUS } from "../constants/httpStatus.js";
import { googleLoginService } from "../services/authService.js";

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

export const googleLoginController = async(req,res,next) => {
    try{
        const { idToken } = req.body;
        if (!idToken) {
            return res.status(400).json({
                success: false,
                message: "idToken is required"
            });
        }
        const data = await googleLoginService(idToken);

        return res.status(200).json({
            success: true,
            message: "Google login successful",
            data
        });

    }catch(err){
        next(err);
    }
}