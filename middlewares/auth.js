import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || 'dev_secret'; 

export const auth = (req, res, next) => {
    const authHeader = req.headers.authorization || '';
    const [scheme, token] = authHeader.split(" ");

    if (scheme !== 'Bearer' || !token) {
        return res.status(400).json({ error: 'Auth token required.' });
    }

    try {
        const payload = jwt.verify(token, JWT_SECRET_KEY);
        req.userId = payload.id;

        return next();
    } catch (err) {
        console.error(`Error authenticating user: ${err}`);
        
        return res.status(401).json({ error: 'Invalid or expired token.' });
    }
}
