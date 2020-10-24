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

  app.post('*', [invalidAuth, rateLimit]);

  app.listen(config.port, config.hostName, () =>
    console.log(
      `Example app available on ${process.env.HOSTNAME} listening on port ${process.env.PORT}!`
    )
  );
})();
