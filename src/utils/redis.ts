import logger from "./logger";

let client: any;

export const init = async (redisClient: any): Promise<any> => {
  client = redisClient;

  client.on("connect", (): any => {
    logger.info("REDIS CLIENT Connected");
  });

  client.on("error", (err: any): any => {
    if (err.message.includes("WRONGPASS")) {
      logger.error(`[REDIS AUTHENTICATION ERROR] ==> ${err}`);
      client.disconnect();
      process.exit(1);
    } else {
      logger.info(`[REDIS CONNECTION ERROR] ==> ${err}`);
    }
  });

  client.on("end", (): any => {
    logger.info("REDIS CLIENT Disconnected");
  });

  try {
    await client.ping();
    logger.info("REDIS CLIENT Authenticated");
  } catch (err) {
    logger.error(`[REDIS AUTHENTICATION ERROR] ==> ${err}`);
    client.disconnect();
    process.exit(1);
  }
};

export const get = async (key: string): Promise<any> => {
  try {
    const response = await client.get(key);
    return response;
  } catch (error) {
    return null;
  }
};

export const redisInstance = (): any => {
  return client;
};

export const set = async (
  key: string,
  value: any,
  expiryInSeconds: number | null = null
): Promise<any> => {
  const setValue = await client.set(key, value);
  if (expiryInSeconds) {
    client.expire(key, expiryInSeconds);
  }

  return setValue;
};

export const del = async (key: string): Promise<any> => {
  try {
    const response = await client.del(key);
    return response;
  } catch (error) {
    return null;
  }
};

export const hset = async (
  key: string,
  field: string,
  value: string
): Promise<any> => {
  return client.hset(key, field, value);
};

export const hget = async (key: string, field: string): Promise<any> => {
  return client.hget(key, field);
};

export const hdel = async (key: string, field: string): Promise<any> => {
  return client.hdel(key, field);
};

export const increment = async (key: string): Promise<any> => {
  return client.incr(key);
};

export const ttl = async (key: string): Promise<number> => {
  try {
    const timeLeft = await client.ttl(key);
    return timeLeft;
  } catch (error) {
    return 0;
  }
};

export const expire = async (
  key: string,
  expiryInSeconds: number
): Promise<any> => {
  return client.expire(key, expiryInSeconds);
};
