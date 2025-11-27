import { createShortLink,getLongURLService,logClickService} from "../services/linkService.js";
import { HTTP_STATUS } from "../constants/httpStatus.js";

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

        const ip = req.headers["x-forwarded-for"]?.split(",")[0] ||req.ip ||req.connection?.remoteAddress || "";
        const userAgent = req.get("user-agent") || "Unknown Device";
        const referrer = req.get("referer") || "direct";

        const clickData = {
            slug,
            ip,
            device : {raw : userAgent},
            referrer,
        }

        await logClickService(slug,clickData);
        return res.redirect(link.longURL);

    }catch(err){
        next(err);
    }
}