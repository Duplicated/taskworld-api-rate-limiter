import config from './config';
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import proxy from 'express-http-proxy';
import {
  invalidAuth,
  rateLimit,
  notImplementedRoutes,
  generateProxyTarget,
} from './services/middleware';

const app = express();

(async () => {
  // basic validation
  app.use(cookieParser());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  app.use('*', notImplementedRoutes);
  app.post('*', [
    invalidAuth,
    rateLimit,
    proxy(generateProxyTarget, {
      memoizeHost: false,
    }),
  ]);

  app.listen(config.port, config.hostName, () =>
    console.log(
      `Rate limiter is now online at ${process.env.HOSTNAME} and is listening on port ${process.env.PORT}!`
    )
  );
})();
