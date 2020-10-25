import 'dotenv/config';

export default {
  hostName: process.env.HOSTNAME || 'localhost',
  port: process.env.PORT || 8081,
  requestLimit: process.env.REQUEST_LIMIT || 10,
  redis: {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT || '6379',
    password: process.env.REDIS_PASS,
  },
  endpoint: {
    production: process.env.API_ENDPOINT || 'www.google.com',
    mock: process.env.MOCK_API_ENDPOINT || 'localhost',
  }
};
