import { Request, Response, NextFunction } from 'express';
import jwt from "jsonwebtoken";
import dotenv from 'dotenv'
import { usuarioTable } from '../db/schema'
import { db } from '../libs/drizzle';
import { eq, and } from 'drizzle-orm';

dotenv.config();

export const Auth = {
    private: async (req: Request, res: Response, next: NextFunction) => {
        let success = false;

        if (req.headers.authorization) {

            const [authType, token] = req.headers.authorization.split(' ');
            if (authType === 'Bearer') {
                try {
                    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string)
                    console.log("Decoded token:", decoded);
                    success = true;
                } catch (error) {
                    console.error("Token verification failed:", error);
                }
            }

        }
        if (success) {
            next();
        } else {
            res.status(403).json({ error: "Unauthorized" });
        }
    }
}