import User from "../models/user.js";
import { generateJwt } from "../utils/jwt.js";
import admin from "../config/firebase.js";

export const registerUserService = async ({email,password}) => {
    const existingUser = await User.findOne({email});
    if(existingUser){
        throw new Error ("Email already Registered")
    }

    const user = await User.create({email,password});

    const token = generateJwt(user._id);
    return { token , user : {
        id : user._id,
        email : user.email,
        created_at : user.createdAt,
    }};
};


export const loginUserService = async({email,password}) =>{
    const user = await User.findOne({email}).select("+password");
    if(!user){
        throw new Error ("Invalid Email or Password");
    }

    const isMatch = await user.comparePassword(password);
    if(!isMatch) throw new Error ("Invalid Email or Password");

    const token = generateJwt(user._id);
    return {
        token,
        user : {
            id : user._id,
            email : user.email,
            createdAt : user.createdAt,
        },
    };
};

export const googleLoginService = async(idToken) => {

    const decoded = await admin.auth().verifyIdToken(idToken);

    const { email, uid } = decoded;
    if(!email){
        throw new Error("Google Account has no email");
    }

    let user = await User.findOne({email});
    if(!user){
        user = await User.create({
            email,
            googleId : uid, 
        });
    }else {
        if (!user.googleId) {
            user.googleId = uid;
            await user.save();
        }
  }

    const token = generateJwt(user._id);

    return {
        token,
        user: {
            id: user._id,
            email: user.email,
            createdAt: user.createdAt,
        }
    };
}
