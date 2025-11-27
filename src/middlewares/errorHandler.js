import { HTTP_STATUS } from "../constants/httpStatus.js";

export const errorHandler = (err,req,res,next) => {
    console.error(err);

    const statusCode = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
    const message = err.message || "Something went wrong";

    res.status(statusCode).json({
        success : false,
        message,
    });
};
