import Link from "../models/link.js";
import Click from "../models/click.js";
import { generateShortCode } from "../utils/generateShortCode.js";
import  redisClient  from "../config/redis.js";

export const createShortLink = async ({longURL,userId}) => {
    if (!longURL || !userId) {
        throw new Error("Missing fields: longURL and userId are required");
    }

    let slug = generateShortCode();
    let exists = await Link.findOne({slug});

    while(exists){
        slug = generateShortCode();
        exists = await Link.findOne({slug});
    }

    const newLink = await Link.create({
        slug,
        longURL,
        userId,
    });

    await redisClient.set(
        `link:${slug}`,
        JSON.stringify(newLink.toObject ? newLink.toObject() : newLink)
    );

    await redisClient.del(`analytics:global:${userId}`);

    return {
        _id :  newLink._id,
        slug : newLink.slug,
        longURL : newLink.longURL,
        clicksCount : newLink.clicksCount,
        createdAt : newLink.createdAt,
    }
}

export const getLongURLService = async (slug) => {
    const cacheKey = `link:${slug}`;
    const cached = await redisClient.get(cacheKey);

    if (cached) {
        return JSON.parse(cached);
    }

    const link = await Link.findOne({slug});

    if (!link) return null;

   await redisClient.set(
    cacheKey,
    JSON.stringify(link.toObject ? link.toObject() : link)
   );

    return link;
}

export const logClickService = async (slug,clickData) => {
    console.log("clickData : ",clickData);
    const a = await Click.create(clickData);
    console.log("a : ",a);
    await Link.updateOne({slug},{ $inc : {clicksCount : 1} });

    await redisClient.del(`analytics:${slug}`);  
    if (clickData.userId) {
        await redisClient.del(`analytics:global:${clickData.userId}`);
    }
}

export const getAllLinksService = async(userId,page = 1,limit = 20) => {
    if(!userId){
        throw new Error("userId is required");
    }

    const skip = (page-1)*limit;

    const links = await Link.find({userId})
        .sort({createdAt : -1})
        .skip(skip)
        .limit(limit)
        .lean();

    const total = await Link.countDocuments({userId});

    return {
        links,
        total,
        page,
        limit,
        totalPages: Math.ceil(total/limit),
    };
}


export const deleteLinkService = async (slug,userId) => {
    const link = await Link.findOne({slug});

    if(!link){
        throw new Error("Link not found")
    }

    if(link.userId.toString() !== userId.toString()){
        throw new Error("Not Authorized to delete this link");
    }

    await Link.deleteOne({slug});

    await Click.deleteMany({slug});

    await redisClient.del(`analytics:${slug}`);
    await redisClient.del(`analytics:global:${userId}`);

    return {message : "Link deleted successfully"};

}

export const updateLinkService = async (slug,userId,newSlug) => {
    const link = await Link.findOne({slug});

    if(!link){
        throw new Error("Link not found")
    }

    if(link.userId.toString() !== userId.toString()){
        throw new Error("Not authorized to update this link");
    }

    if (!newSlug || newSlug === slug) {
        throw new Error("New slug must be different");
    }

    const exists = await Link.findOne({ slug: newSlug });
    if (exists) {
        throw new Error("This back-half is already taken");
    }

    const newLink = await Link.create({
        slug: newSlug,
        longURL: link.longURL,    
        userId: link.userId,
        clicksCount: 0,         
    });

    await redisClient.del(`link:${slug}`); 
    await redisClient.del(`analytics:${slug}`);
    await redisClient.del(`analytics:${newSlug}`);
    await redisClient.del(`analytics:global:${userId}`);

    return {
        message: "Back-half updated successfully",
        oldSlug: slug,
        data: newLink,
    };

}