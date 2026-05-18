function adminMiddleware(req, res, next) {
  if (req.userRole !== "admin") {
    return res.status(403).json({ error: "Acesso restrito a administradores" });
  }
  next();
}

module.exports = adminMiddleware;