import * as dotenv from 'dotenv';

dotenv.config();

export default {
  application: {
    appName: process.env.APP_NAME || 'Discord Task Manager',
    nodeEnv: process.env.NODE_ENV?.toLowerCase() || 'development',
    port: Number(process.env.PORT) || 5000,
    baseUrl: process.env.APP_URL || 'http://localhost:5000',
    isProd: process.env.NODE_ENV?.toLowerCase() === 'production',
    isDev: process.env.NODE_ENV?.toLowerCase() === 'development',
    database: {
      mongodb_uri: process.env.MONGODB_URI || '',
      serverSelectionTimeoutMS: Number(process.env.DB_SELECTION_TIMEOUT) || 30000,
      socketTimeoutMS: Number(process.env.DB_SOCKET_TIMEOUT) || 45000,
      maxPoolSize: Number(process.env.DB_MAX_POOL_SIZE) || 10,
      minPoolSize: Number(process.env.DB_MIN_POOL_SIZE) || 2
    },
    timezone: {
      application_timezone: process.env.TIMEZONE || 'Asia/Kolkata'
    }
  },
  discord: {
    webhooks: {
      reminder: process.env.DISCORD_WEBHOOK_REMINDER || '',
      complete: process.env.DISCORD_WEBHOOK_COMPLETE || '',
      delete: process.env.DISCORD_WEBHOOK_DELETE || ''
    }
  },
  cron: {
    dailyNotificationCheck: process.env.CRON_DAILY_CHECK || '0 9 * * *', // 9 AM IST daily
    sixHourlyCheck: process.env.CRON_SIX_HOURLY || '0 */6 * * *' // Every 6 hours
  }
};
