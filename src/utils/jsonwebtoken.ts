import jwt from "jsonwebtoken";
import dontEnv  from "dotenv";
import { Types } from "mongoose";

dontEnv.config();

type UserPaylod = {
    id: string
}

export const generateJWT = (payload : UserPaylod)=> {
    const secret = process.env.JWT_SECRET; 
    if (!secret) {
        throw new Error("ENV unde")
    }    
    const token = jwt.sign(payload, secret, {
        expiresIn: "1d"
    });
    return token
}