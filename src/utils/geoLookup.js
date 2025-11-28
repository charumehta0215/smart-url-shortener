import geoip from "geoip-lite";
import { getName } from "country-list";

export const geoLookup = (ip) => {
    try{
        if(!ip) return "unknown";
        const cleanIp = ip.replace("::ffff:","");
        const lookup = geoip.lookup(cleanIp);
        if(!lookup) return "unknown";
        const countryCode = lookup.country;
        return getName(countryCode) || countryCode || "Unknown";

    }catch(err){
        console.log("Geo lookup error:" , err.message);
        return "Unknown";
    }
}