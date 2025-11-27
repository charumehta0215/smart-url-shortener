import jwt from "jsonwebtoken";

export const generateJwt = (userId) => {
    return jwt.sign(
        { id : userId },
        process.env.JWT_SECRET,
        {expiresIn : "7d"}
    );
};

export const verifyJwt = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};


