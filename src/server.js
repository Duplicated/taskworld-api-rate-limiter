import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import { invalidAuth, rateLimit } from './services/middleware';

const app = express();

app.use(bodyParser.json());
app.post('*', [invalidAuth, rateLimit]);
 
app.listen(process.env.PORT, () =>
  console.log(`Example app listening on port ${process.env.PORT}!`),
);