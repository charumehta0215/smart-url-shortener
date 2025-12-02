import { getAnalyticsService,getGlobalAnalyticsService } from "../services/analyticsService.js";
import { HTTP_STATUS } from "../constants/httpStatus.js";

export const getAnalyticsController = async(req,res,next) => {
    try{
        const { slug } = req.params;
        const userId = req.user._id.toString();
        const data = await getAnalyticsService(slug,userId);

        return res.status(HTTP_STATUS.OK).json({
            success : true,
            message : "Analytics fetched Successfully",
            data,
        });

    }catch(err){
        next(err);
    }
};

export const getGlobalAnalyticsController = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const result = await getGlobalAnalyticsService(userId);

        res.status(200).json({
            success: true,
            message: "Global analytics fetched successfully",
            data: result,
        });

    } catch (err) {
        next(err);
    }
};
