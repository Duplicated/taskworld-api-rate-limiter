import redis from './redis';

export const invalidAuth = async (req, res, next) => 
  new Promise(async (resolve, reject) => {
    try {
      if (!req.get('x-user-id')) {
        resolve(res.status(401).send({ successful: false, message: 'Missing user id' }));
      }
      else {
        resolve(next());
      }
    } catch (error) {
      reject(error);
    }
  });


export const rateLimit = async (req, res, next) => {
  await redis.set("foo", "bar");
  return res.send({ successful: true, message: 'Received POST request' });
};
