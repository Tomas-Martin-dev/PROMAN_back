import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken"
import dontenv from "dotenv"
import User, { IUser } from "../models/Auth";

declare global {
    namespace Express {
        interface Request {
            user?: IUser
        }
    }
}

dontenv.config();

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const bearer = req.headers.authorization
    if(!bearer) {
        const error = new Error('No Autorizado')
        res.status(401).json({error: error.message})
    }

    const [, token] = bearer.split(' ')
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        console.log(decoded);
        
        if(typeof decoded === 'object' && decoded.id) {
            const user = await User.findById(decoded.id).select('_id name email')
            if(user) {
                req.user = user
                next()
            } else {
                res.status(500).json({error: 'Token No Válido'})
            }
        }
    } catch (error) {
        res.status(500).json({error: 'Token No Válido'})
    }

}