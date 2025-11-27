import crypto from "crypto";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

export const generateShortCode = (length = 8) => {
    let code = "";

    for(let i =0;i<length;i++){
        const index = crypto.randomInt(0,ALPHABET.length);
        code+=ALPHABET[index];
    }

    return code;
}