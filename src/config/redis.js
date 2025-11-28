import {createClient} from "redis";
import logger from "./logger.js";
import config from "./env.js";

const redisClient = createClient({
    url: config.redisUrl,
});

redisClient.on("error",(err) => {
    logger.error("Redis error",err);
})

redisClient.on("connect",() => {
    logger.info("Connected to Redis");
})

await redisClient.connect();

export default redisClient;