import redis from "../config/redis.js";
import { HTTP_STATUS } from "../constants/httpStatus.js";

const redisRateLimit = (limit,windowSec) => {
    return async(req,res,next) => {
        const key = `rate:${req.ip}`;
        const current = await redis.incr(key);

        if(current == 1){
            await redis.expire(key,windowSec);
        }

        if(current > limit){
            return res.status(HTTP_STATUS.TOO_MANY_REQUESTS).json({
                success: false,
                message: "Too many requests.Slow down",
            });
        }

        next();
    };
};

export default redisRateLimit;