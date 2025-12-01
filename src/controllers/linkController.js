import { createShortLink,getLongURLService,logClickService} from "../services/linkService.js";
import { HTTP_STATUS } from "../constants/httpStatus.js";
import { isImageUrl } from "../utils/url.js";
import { getAllLinks } from "../services/linkService.js";
import { success } from "zod";

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

        const link = await getLongURLService(slug);

        if(!link){
            return res.status(HTTP_STATUS.NOT_FOUND).json({
                success : false,
                message : "Short URL not found",
            });
        }

        let ip = req.headers["x-forwarded-for"]?.split(",")[0] ||req.ip ||req.connection?.remoteAddress || "" ||
             "127.0.0.1";

        if (ip === "::1") ip = "127.0.0.1";          
        if (ip.startsWith("::ffff:")) ip = ip.split(":").pop();

        const userAgent = req.get("user-agent") || "Unknown Device";
        const referrer = req.get("referer") || "direct";

        const clickData = {
            slug,
            ip,
            device : {raw : userAgent},
            referrer,
        }

        await logClickService(slug,clickData);

        if (isImageUrl(link.longURL)) {
            return res.redirect(link.longURL);
        }
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

        const result = await getAllLinks(userId,page,limit);

        return res.status(HTTP_STATUS.OK).json({
            success: true,
            message: "Links fetched Successfully",
            data: result,
        })
    }catch(err){
        next(err);
    }
}