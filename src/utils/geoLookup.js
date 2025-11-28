import geoip from "geoip-lite";
import { getName } from "country-list";
import logger from "../config/logger.js";

export const geoLookup = (ip) => {
    try{
        if(!ip) return "Unknown";
        const cleanIp = ip.replace("::ffff:", "");
        const lookup = geoip.lookup(cleanIp);
        if(!lookup) return "Unknown";
        const countryCode = lookup.country;
        return getName(countryCode) || countryCode || "Unknown";

    }catch(err){
        logger.error(`Geo lookup error: ${err.message}`);
        return "Unknown";
    }
}