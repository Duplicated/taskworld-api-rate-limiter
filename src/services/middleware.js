import moment from 'moment';
import config from '../config';
import redis from './redis';

const TIME_WINDOW_DURATION_SECONDS = 60;

export const invalidAuth = async (req, res, next) =>
  new Promise(async (resolve, reject) => {
    try {
      if (!req.get('x-user-id')) {
        return resolve(
          res
            .status(401)
            .send({ successful: false, message: 'Missing user id' })
        );
      } else {
        resolve(next());
      }
    } catch (error) {
      console.log('error: ', error);
      return reject(
        res
          .status(500)
          .send({ successful: false, message: 'Internal Server Error' })
      );
    }
  });

export const notImplementedRoutes = async (req, res, next) =>
  new Promise((resolve) => {
    if (req.method !== 'POST') {
      return resolve(
        res
          .status(501)
          .send({ successful: false, message: 'Not implemented yet' })
      );
    } else {
      resolve(next());
    }
  });

export const rateLimit = async (req, res, next) =>
  new Promise(async (resolve, reject) => {
    try {
      const now = moment();
      const userId = req.get('x-user-id');
      const existingUser = await redis.get(userId);
      console.log('existingUserRecord >>>>> ', existingUser);
      // if there is no log of this particular user, initialize
      // this user's request counter
      if (!existingUser) {
        const newUserLogs = [];
        newUserLogs.push({
          requestTimestamp: now.unix(),
          counter: 1,
        });
        redis.set(userId, JSON.stringify(newUserLogs));
        redis.expireat(userId, now.clone().add(1, 'day').startOf('day').unix());
        // TODO: replace with proxy call
        return resolve(
          res.status(200).send({ successful: true, message: 'forwarding...' })
        );
      }
      // otherwise, generate starting timestamp for the current time window
      // (from 60 seconds in the past up until now), then sum all counters
      // of requests that belong within this time window only
      const parsedRequestLogs = JSON.parse(existingUser);
      console.log('parsedRequestLogs >>>>> ', parsedRequestLogs);
      const windowBeginTimestamp = now
        .clone()
        .subtract(TIME_WINDOW_DURATION_SECONDS, 'seconds')
        .unix();
      console.log('windowBeginTimestamp: ', windowBeginTimestamp);
      const validTimestampRequests = parsedRequestLogs.filter(
        (log) => log.requestTimestamp > windowBeginTimestamp
      );
      console.log('validTimestampRequests >>>>>', validTimestampRequests);
      const totalValidRequestsCount = validTimestampRequests.reduce(
        (sum, request) => sum + request.counter,
        0
      );

      // limit exceeded
      if (totalValidRequestsCount >= config.requestLimit) {
        return resolve(
          res.status(429).send({
            successful: false,
            message: 'request limit exceeded, please try again later',
          })
        );
      }

      // since moment().unix() gives time granularity at second level,
      // one can increment the most recent log's counter in case of burst
      // requests (where they all occur within the same second)
      let latestUserLog = parsedRequestLogs[parsedRequestLogs.length - 1];
      if (now.unix() <= latestUserLog.requestTimestamp) {
        latestUserLog.counter += 1;
      } else {
        // start a new counter for this timestamp
        parsedRequestLogs.push({
          requestTimestamp: now.unix(),
          counter: 1,
        });
      }
      redis.set(userId, JSON.stringify(parsedRequestLogs));
      // TODO: replace with proxy call
      return resolve(
        res.status(200).send({ successful: true, message: 'forwarding...' })
      );
    } catch (error) {
      console.log('error: ', error);
      return reject(
        res
          .status(500)
          .send({ successful: false, message: 'Internal Server Error' })
      );
    }
  });
