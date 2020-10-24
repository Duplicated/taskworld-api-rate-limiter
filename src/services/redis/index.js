import Redis from 'ioredis';
import config from '../../config';

const options = {
  ...config.redis,
  retry_strategy: options => Math.min(options.attempt * 100, 3000),
};

const redis = new Redis(options);

redis.on('error', (err) => console.log(`ERROR: ${err}`));

export default redis;
