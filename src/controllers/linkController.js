import { createShortLink,getLongURLService,logClickService} from "../services/linkService.js";
import { HTTP_STATUS } from "../constants/httpStatus.js";
import { isImageUrl } from "../utils/url.js";
import { getAllLinksService ,updateLinkService,deleteLinkService } from "../services/linkService.js";
import * as UAParserModule from "ua-parser-js";
import redisClient from "../config/redis.js";
const UAParser =
  UAParserModule.UAParser || UAParserModule.default || UAParserModule;

export const createShortlinkController = async(req,res,next) => {
    try{
        const {longURL} = req.body;

        const data = await createShortLink({
            longURL,
            userId : req.user._id
        })

        return res.status(HTTP_STATUS.CREATED).json({
            success : true,
            message : "Short URL created successfully",
            data,
        })
    }catch(err){
        next(err);
    }
}

export const redirectController = async(req,res,next) => {
    try{
        const {slug} = req.params;

        const isInternal =
            req.query.source === "internal" ||
            req.query.internal === "true" ||
            req.query.from === "dashboard";

        const link = await getLongURLService(slug);

        if(!link){
            return res.status(HTTP_STATUS.NOT_FOUND).json({
                success : false,
                message : "Short URL not found",
            });
        }

        if (isInternal) {
            return res.redirect(link.longURL);
        }

        let ip = req.headers["x-forwarded-for"]?.split(",")[0] ||req.ip ||req.connection?.remoteAddress || "" ||
             "127.0.0.1";

        if (ip === "::1") ip = "127.0.0.1";          
        if (ip.startsWith("::ffff:")) ip = ip.split(":").pop();

        const rawRef = req.get("referer") || req.get("referrer") || "";

        let referrer = "direct";
        try {
            if (rawRef && rawRef !== "direct") {
                referrer = new URL(rawRef).hostname.replace("www.", "");
            }
        } catch {
            referrer = "direct";
        }

        const rawUA = req.get("user-agent") || "";
        const parser = new UAParser(rawUA);
        const parsed = parser.getResult();
        const browser = parsed.browser?.name || "Unknown";
        const os = parsed.os?.name || "Unknown";
        const deviceType = parsed.device?.type || "desktop";

        const dedupeKey = `click:${slug}:${ip}:${browser}`;

        const alreadyClicked = await redisClient.get(dedupeKey);
        if (alreadyClicked) {
            console.log("Duplicate click skipped");
            return res.redirect(link.longURL);
        }
        
        await redisClient.set(dedupeKey, "1", { EX: 10 });


        const clickData = {
            slug,
            ip,
            device: {
                raw: rawUA,
                browser,
                os,
                type: deviceType
            },
            referrer,
            userId: link.userId
        };

        await logClickService(slug,clickData);

        if (isImageUrl(link.longURL)) {
            return res.redirect(link.longURL);
        }

        await redisClient.del(`analytics:${slug}`);
        await redisClient.del(`analytics:global:${link.userId}`);

        return res.redirect(link.longURL);

    }catch(err){
        next(err);
    }
}

export const getAllLinksController = async(req,res,next) => {
    try{
        const userId = req.user._id;

        const page = parseInt(req.query.page || 1);
        const limit = parseInt(req.query.limit || 20);

        const result = await getAllLinksService(userId,page,limit);

        return res.status(HTTP_STATUS.OK).json({
            success: true,
            message: "Links fetched Successfully",
            data: result,
        })
    }catch(err){
        next(err);
    }
}

export const deleteLinkController = async(req,res,next) => {
    try{
        const { slug } = req.params;

        const result = await deleteLinkService(
            slug,
            req.user._id,
        )

        return res.status(HTTP_STATUS.OK).json({
            success: true,
            message : result.message,
        })
    }catch(err){
        next(err);
    }
}

export const updateLinkController = async(req,res,next) => {
    try{
        const { slug } = req.params;
        const { newSlug } = req.body;

        const result = await updateLinkService(
            slug,
            req.user._id,
            newSlug,
        )

        return res.status(HTTP_STATUS.OK).json({
            success: true,
            message: result.message,
            data: result.data,
            oldSlug: result.oldSlug
        });

    } catch(err){
        next(err);
    }
}