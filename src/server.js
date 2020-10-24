import config from './config';
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { invalidAuth, rateLimit } from './services/middleware';

const app = express();

(async () => {
  // basic validation
  app.use(cookieParser());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  app.use(
    '*',
    async (req, res, next) =>
      new Promise((resolve) => {
        if (
          req.method === 'GET' ||
          req.method === 'PUT' ||
          req.method === 'PATCH' ||
          req.method === 'DELETE'
        ) {
          return resolve(
            res
              .status(501)
              .send({ successful: false, message: 'Not implemented yet' })
          );
        } else {
          resolve(next());
        }
      })
  );
  app.post('*', [invalidAuth, rateLimit]);

  app.listen(config.port, config.hostName, () =>
    console.log(
      `Example app available on ${process.env.HOSTNAME} listening on port ${process.env.PORT}!`
    )
  );
})();
