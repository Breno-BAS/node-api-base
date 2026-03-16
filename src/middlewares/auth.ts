import { Request, Response, NextFunction } from 'express';
import { usuarioTable } from '../db/schema'
import { db } from '../libs/drizzle';
import { eq, and } from 'drizzle-orm';

export const Auth = {
    private: async (req: Request, res: Response, next: NextFunction) => {
        let success = false; 
        
        if(req.headers.authorization) {
            let hash: string = req.headers.authorization.substring(6);
            let decoded: string = Buffer.from(hash, 'base64').toString();
            let data: string[] = decoded.split(':');

            if(data.length === 2) {
                let hasUser = await db
                .select()
                .from(usuarioTable)
                .where(
                    and(
                        eq(usuarioTable.email, data[0]),
                        eq(usuarioTable.password, data[1])
                    )
                );
                if(hasUser) {
                    success = true;
                }
            }
        };


        if(success) {
            next();
        } else {
            res.status(403).json({ error: "Unauthorized" });
        }
    }
}