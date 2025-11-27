import mongoose from "mongoose";

const linkSchema = new mongoose.Schema(
    {
        slug :{
            type : String,
            required : [true,"slug is required"],
            index : true,
            unique : true,
            validate(value) {
                if (!value.match(/^[A-Za-z0-9_-]+$/)) {
                    throw new Error("Slug can contain only letters,numbers, _ and - only");
                }
            }
        },
        longURL :{
            type: String,
            required: [true,"Original Url is required"],
            validate(value){
                if(!value.match(/^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/)){
                    throw new Error("Please provide a valid URL");
                }
            }
        },
        userId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'User',
            required : [true," is required"],
        },
        clicksCount : {
            type : Number,
            default : 0,
            validate(value){
                if(value<0){
                    throw new Error("clickCount cannot go below 0");
                }
            }
        }

    },
    { timestamps : true }
)

const Link = mongoose.model("Link",linkSchema);
export default Link;