import mongoose  from "mongoose";

const clickSchema = new mongoose.Schema(
    {
        slug :{
            type :String,
            required : [true,"Slug is required"],
        },
        ip: {  
            type: String,
            required: [true, "IP address is required"],
            validate(value) {
            const ipv4 = /^(?:\d{1,3}\.){3}\d{1,3}$/;
            const ipv6 = /^([0-9a-fA-F]{0,4}:){2,7}[0-9a-fA-F]{0,4}$/;
            if (!ipv4.test(value) && !ipv6.test(value) && value !== "127.0.0.1") {
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
        referrer: {
            type: String,
            default: "direct",
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