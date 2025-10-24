export const requireAuthOrRemember = (req, res, next) => {
  if (req.isAuthenticated?.() && req.user?._id) {
    return next();
  }

  req.session.returnTo = req.originalUrl;
  
  return res.status(401).json({ redirect: '/user/login' });
};
