import { Request, Response, NextFunction } from 'express';

export const Auth = {
    private: (req: Request, res: Response, next: NextFunction) => {
        // Fazer verificação de auth
        let success = true; 

        if(success) {
            next();
        } else {
            res.status(403).json({ error: "Unauthorized" });
        }
    }
}