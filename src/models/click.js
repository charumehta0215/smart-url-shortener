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
            type: {
                os: String,
                browser: String,
                type: String,
            }
        },
        referrer : {
            type : String,
            validate(value) {
                if (value && !/^https?:\/\/.+/.test(value)) {
                    throw new Error("Invalid referrer URL");
                }
            }
        },
    },
    {timestamps : true}
);

const Click = mongoose.model("Click",clickSchema);
export default Click;