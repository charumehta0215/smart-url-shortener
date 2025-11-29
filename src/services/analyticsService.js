import Link from "../models/link.js";
import Click from "../models/click.js";
import { geoLookup } from "../utils/geoLookup.js";
import { callAI } from "../utils/callAI.js";
import redisClient from "../config/redis.js";

export const getAnalyticsService = async (slug,userId) => {

    const cacheKey = `analytics:${slug}`;
    const cached = await redisClient.get(cacheKey);
    if (cached) {
        return JSON.parse(cached);
    }

    const link = await Link.findOne({slug});

    if(!link){
        throw new Error("Short Url not found");
    }

    if(link.userId && link.userId.toString() !== userId){
        throw new Error("Not authorized to view analytics");
    }

    const clicks = await Click.find({slug});

    const clicksByDate = {};
    clicks.forEach((click) => {
        const date = click.createdAt.toISOString().split("T")[0];
        clicksByDate[date] = (clicksByDate[date] || 0 ) + 1;
    });

    const browsers = {};
    clicks.forEach((click) => {
        const ua = click.device?.raw || "Unknown";

        let browser = "Unknown";
        if(ua.includes("Chrome")) browser = "Chrome";
        else if (ua.includes("Firefox")) browser = "Firefox";
        else if(ua.includes("Safari")) browser = "Safari";
        else if(ua.includes("Edge")) browser = "Edge";

        browsers[browser] = (browsers[browser] || 0) + 1;
    });

    const referrers = {};
    clicks.forEach((click) => {
        const ref = click.referrer || "direct";
        referrers[ref] = (referrers[ref] || 0) + 1;
    });

    const geo = {};
    for(const click of clicks){
        const country = await geoLookup(click.ip);
        geo[country] =(geo[country] || 0) + 1;
    }

    let aiSummary = null;
    try {
        const analyticsData = JSON.stringify({
            totalClicks: clicks.length,
            clicksByDate,
            browsers,
            referrers,
            geo,
        });

        aiSummary = await callAI(
            `Summarize the following analytics data in simple, human-friendly terms. 
            Do not add unnecessary details. Keep it short: ${analyticsData}`);

    }catch(err){
        aiSummary = "AI summary unavailable";
    }

    const analyticsResult = {
        slug : link.slug,
        longURL : link.longURL,
        totalClicks : clicks.length,
        clicksByDate,
        browsers,
        referrers,
        geo,
        aiSummary,
        createdAt : link.createdAt,
    }

    await redisClient.set(cacheKey, JSON.stringify(analyticsResult), { EX: 300 });

    return analyticsResult;
};