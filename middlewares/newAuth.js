export const auth = (req, res, next) => {
    if (req.isAuthenticated?.() && req.user?._id) {
        req.userId = req.user._id.toString();
        
        return next();
    }

    return res.status(401).json({ error: 'Not authenticated' });
};