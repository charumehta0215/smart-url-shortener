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

    const clicks = await Click.find({slug}).lean();

    const clicksByDate = {};
    clicks.forEach((click) => {
        const date = click.createdAt.toISOString().split("T")[0];
        clicksByDate[date] = (clicksByDate[date] || 0 ) + 1;
    });
    
    const browsers = {};
    clicks.forEach(click => {
        console.log("click : ",click);
        const browser = click.device?.browser || "Unknown";
        browsers[browser] = (browsers[browser] || 0) + 1;
    });

    const referrers = {};
    clicks.forEach(click => {
        const ref = click.referrer || "direct";
        referrers[ref] = (referrers[ref] || 0) + 1;
    });

    const geo = {};

    const countries = await Promise.all(
        clicks.map(c => 
            geoLookup(c.ip).catch(() => "Unknown") 
        )
    );

    countries.forEach(country => {
        geo[country] = (geo[country] || 0) + 1;
    });


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


export const getGlobalAnalyticsService = async(userId) => {
    const cacheKey = `analytics:global:${userId}`;
    const cached = await redisClient.get(cacheKey);
    if(cached) {
        return JSON.parse(cached);
    }

    const links = await Link.find({ userId }).lean();
    const slugs = links.map(l => l.slug);

    if(slugs.length === 0 ){
        return {
            totalLinks: 0,
            totalClicks: 0,
            clicksByDate : {},
            browsers : {},
            referrers : {},
            geo : {},
            topLinks : [],
            aiSummary : "No Data available",
        }
    }

    const clicks = await Click.find({slug : {$in : slugs}}).lean()

    const clicksByDate = {};
    clicks.forEach((click) => {
        const date = click.createdAt.toISOString().split("T")[0];
        clicksByDate[date] = (clicksByDate[date] || 0 ) + 1;
    });

    const browsers = {};
    clicks.forEach(click => {
        const browser = click.device?.browser || "Unknown";
        browsers[browser] = (browsers[browser] || 0) + 1;
    });

    const referrers = {};
    clicks.forEach(click => {
        const ref = click.referrer || "direct";
        referrers[ref] = (referrers[ref] || 0) + 1;
    });

    const geo = {};

    const countries = await Promise.all(
        clicks.map(c => 
            geoLookup(c.ip).catch(() => "Unknown")
        )
    );

    countries.forEach(country => {
        geo[country] = (geo[country] || 0) + 1;
    });


    const topLinksMap = {};
    clicks.forEach(click => {
        topLinksMap[click.slug] = (topLinksMap[click.slug] || 0) + 1;
    });

    const topLinks = Object.entries(topLinksMap)
        .map(([slug,count]) => ({
            slug,
            clicks: count,
            longURL: links.find(l => l.slug === slug)?.longURL || "",
        }))
        .sort((a,b) => b.clicks -a.clicks)
        .slice(0,5);

    let aiSummary = null;
    try{
        const summaryData = JSON.stringify({
            totalLinks: links.length,
            totalClicks: clicks.length,
            topLinks,
            clicksByDate,
            referrers,
            browsers,
            geo,
        });

        aiSummary = await callAI(`
            Give a short human-friendly summary of this global analytics data.
            Keep it concise and avoid technical terms.
            ${summaryData}
        `);
    } catch (err) {
        aiSummary = "AI summary unavailable";
    }

    const result = {
        totalLinks: links.length,
        totalClicks: clicks.length,
        clicksByDate,
        browsers,
        referrers,
        geo,
        topLinks,
        aiSummary,
    };

    await redisClient.set(cacheKey, JSON.stringify(result), { EX: 300 });
    return result;

}