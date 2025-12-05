import mongoose  from "mongoose";

const clickSchema = new mongoose.Schema(
    {
        slug :{
            type :String,
            required : [true,"Slug is required"],
        },
        ip :{
            type : String,
            required : [true ,"Ip address is required"],
            validate(value) {
                if(!value.match(/^(?:\d{1,3}\.){3}\d{1,3}$/)){
                    throw new Error("Invalid IP address format");
                }
            }
        },
        device: {
            raw: { type: String },
            os: { type: String },
            browser: { type: String },
            type: { type: String },
        },
        referrer : {
            type : String,
            validate(value) {
                if (value === "direct") return true;
                if (/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) return true;
                if (/^https?:\/\/.+/.test(value)) return true;
                throw new Error("Invalid referrer value");
            }
        },
         userId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'User',
        },
    },
    {timestamps : true}
);

const Click = mongoose.model("Click",clickSchema);
export default Click;