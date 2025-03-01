import RedisSession from "telegraf-session-redis";

const REDIS_URL = process.env.REDIS_URL;

export const sessionMiddleware = new RedisSession({
  store: {
    url: REDIS_URL,
  },
}).middleware();
