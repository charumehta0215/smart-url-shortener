import geoip from "geoip-lite";
import { getName } from "country-list";
import logger from "../config/logger.js";
import redisClient from "../config/redis.js";

export const geoLookup = async (ip) => {
    try{
        if(!ip) return "Unknown";

        const cleanIp = ip.replace("::ffff:", "");

        const cacheKey = `geo:${cleanIp}`;

       const cachedCountry = await redisClient.get(cacheKey);

        if (cachedCountry) {
        return cachedCountry;
        }

        const lookup = geoip.lookup(cleanIp);

        if(!lookup) return "Unknown";
        const countryCode = lookup.country;
        const countryName = getName(countryCode) || countryCode || "Unknown";

        await redisClient.set(cacheKey, countryName, { EX: 86400 });

        return countryName;

    }catch(err){
        logger.error(`Geo lookup error: ${err.message}`);
        return "Unknown";
    }
}