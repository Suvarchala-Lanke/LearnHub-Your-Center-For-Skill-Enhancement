// middleware/isAdmin.js
export const isAdmin = (req, res, next) => {
  if (req.user?.type === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Admins only.' });
  }
};
