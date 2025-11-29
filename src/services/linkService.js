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

    await redisClient.set(slug, longURL);

    return {
        id :  newLink._id,
        slug : newLink.slug,
        longURL : newLink.longURL,
        clicksCount : newLink.clicksCount,
        createdAt : newLink.createdAt,
    }
}

export const getLongURLService = async (slug) => {
    const cachedURL = await redisClient.get(slug);

    if (cachedURL) {
        return { longURL: cachedURL };
    }

    const link = await Link.findOne({slug});

    if (!link) return null;

    await redisClient.set(slug, link.longURL);

    return link;
}

export const logClickService = async (slug,clickData) => {
    await Click.create(clickData);
    await Link.updateOne({slug},{ $inc : {clicksCount : 1} });
}

