import { AsyncLocalStorage } from 'async_hooks';
import { format, transports } from 'winston';
import 'winston-daily-rotate-file';
export const traceStorage = new AsyncLocalStorage<Map<string, string>>();
const customFormat = format.printf(({ timestamp, level, message, context }) => {
  const store = traceStorage.getStore();
  const traceId = store?.get('traceId') || 'NO-TRACE';
  const ctx = context ? ` [${context}]` : '';
  return `${timestamp} [${traceId}]${ctx} ${level.toUpperCase()}:${message}`;
});

export const winstonConfig = {
  transports: [
    new transports.Console({
      format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        customFormat,
        format.colorize({ all: true }),
      ),
      level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    }),
    new transports.DailyRotateFile({
      filename: 'logs/%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      format: format.combine(format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), customFormat),
      level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    }),
    new transports.DailyRotateFile({
      filename: 'logs/error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '30d',
      level: 'error',
      format: format.combine(format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), customFormat),
    }),
  ],
};
