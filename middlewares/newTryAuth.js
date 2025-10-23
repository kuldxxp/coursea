export const tryAuth = (req, _res, next) => {
    if (req.isAuthenticated?.() && req.user?._id) {
        req.userId = req.user._id.toString();
    }

    next();
};