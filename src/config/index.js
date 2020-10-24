import 'dotenv/config';

export default {
  hostName: process.env.HOSTNAME || 'localhost',
  port: process.env.PORT || 8081,
  redis: {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT || '6379',
    password: process.env.REDIS_PASS,
  },
};
