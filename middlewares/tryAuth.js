import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || 'dev_secret'; 

export const tryAuth = (req, _res, next) => {
    const authHeader = req.headers.authorization || '';
    const [scheme, token] = authHeader.split(' ');

    if (scheme === 'Bearer' && token) {
        try {
            const payload = jwt.verify(token, JWT_SECRET_KEY);
            
            req.userId = payload.id;
        } catch (_) {}
    }

    next();
};