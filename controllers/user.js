exports.authenticateUser = (req, res, next) => {
  const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];
  if (token === process.env.DEFAULT_TOKEN) {
    next();
  } else {
    res.status(401).json({ status: 'Failed', message: 'Invalid Token' });
  }
};
