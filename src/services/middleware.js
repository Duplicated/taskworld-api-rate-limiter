export const invalidAuth = (req, res, next) => {
  if (!req.get('x-user-id')) {
    return res
      .status(401)
      .send({ successful: false, message: 'Missing user id' });
  }
  next();
};

export const rateLimit = (req, res, next) => {
  return res.send({ successful: true, message: 'Received POST request' });
};
