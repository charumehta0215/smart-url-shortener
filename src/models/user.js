import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import validator from "validator";

const userSchema = new mongoose.Schema(
    {
        email:{
            type: String,
            required : [true,"Email is required"],
            unique : true,
            trim : true,
            lowercase : true,
            validate(value) {
                if(!validator.isEmail(value)){
                    throw new Error('Invalid Email');
                }
            },
        },
        password :{
            type: String,
            required: [true,"password is required"],
            minlength: 8,
            trim : true,
            validate(value){
                if(!value.match(/\d/) || !value.match(/[a-zA-Z]/)){
                    throw new Error('Password must contain at least one letter and one number');
                }
            },
            select: false,
        }
    },
    { timestamps : true }
);

userSchema.pre("save",async function(next) {
    if(!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt);
    next();
})

userSchema.methods.comparePassword = async function(plainPassword) {
    return bcrypt.compare(plainPassword,this.password);
}

const User = mongoose.model("User",userSchema);
export default User;
