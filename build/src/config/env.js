"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
dotenv.config();
exports.default = {
    application: {
        appName: process.env.APP_NAME || 'Discord Task Manager',
        nodeEnv: ((_a = process.env.NODE_ENV) === null || _a === void 0 ? void 0 : _a.toLowerCase()) || 'development',
        port: Number(process.env.PORT) || 5000,
        baseUrl: process.env.APP_URL || 'http://localhost:5000',
        isProd: ((_b = process.env.NODE_ENV) === null || _b === void 0 ? void 0 : _b.toLowerCase()) === 'production',
        isDev: ((_c = process.env.NODE_ENV) === null || _c === void 0 ? void 0 : _c.toLowerCase()) === 'development',
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
