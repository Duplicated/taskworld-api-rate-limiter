import config from '../config';
import redis from './redis';

export const invalidAuth = async (req, res, next) =>
  new Promise(async (resolve, reject) => {
    try {
      if (!req.get('x-user-id')) {
        resolve(
          res
            .status(401)
            .send({ successful: false, message: 'Missing user id' })
        );
      } else {
        resolve(next());
      }
    } catch (error) {
      reject(error);
    }
  });

const validateLimit = async (req) => {
  const userId = req.get('x-user-id');
  // increment request count for this userId
  const res = await redis.incr(userId);
  if (res > config.requestLimit) {
    return true;
  }
  await redis.expire(userId, 60);
};

export const rateLimit = async (req, res, next) => {
  const status = await validateLimit(req);
  if (status) {
    return res
      .status(429)
      .send({
        successful: false,
        message: 'Too many requests, please try again later',
      });
  }
  return res.status(200).send({ successful: true, message: 'forwarding...' });
  // forward to reverse proxy or load balancer endpoint
};
