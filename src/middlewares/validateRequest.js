import { HTTP_STATUS } from "../constants/httpStatus.js";

export const validate = (schema) => (req, res, next) => {

  const parsed = schema.safeParse(req.body);

  if (!parsed.success) {
    const firstError = parsed.error.issues[0].message; 
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: firstError,
    });
  }

  next();
};





