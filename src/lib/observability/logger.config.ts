import { AsyncLocalStorage } from 'async_hooks';
import { format, transports } from 'winston';
import 'winston-daily-rotate-file';
import { LOGGER_CONSTANTS } from '../common/constants/logger.constants';

export const traceStorage = new AsyncLocalStorage<Map<string, string>>();

const currentLogLevel =
  process.env.NODE_ENV === 'production'
    ? LOGGER_CONSTANTS.LEVELS.PRODUCTION
    : LOGGER_CONSTANTS.LEVELS.DEVELOPMENT;

const customFormat = format.printf(({ timestamp, level, message, context }) => {
  const store = traceStorage.getStore();
  const traceId = store?.get(LOGGER_CONSTANTS.TRACE.KEY) || LOGGER_CONSTANTS.TRACE.DEFAULT_ID;
  const ctx = context ? ` [${context}]` : '';

  return `${timestamp} [${traceId}]${ctx} ${level.toUpperCase()}:${message}`;
});

export const winstonConfig = {
  transports: [
    // Console Transport
    new transports.Console({
      level: currentLogLevel,
      format: format.combine(
        format.timestamp({ format: LOGGER_CONSTANTS.FORMAT.TIMESTAMP }),
        customFormat,
        format.colorize({ all: true }),
      ),
    }),

    // Combined Logs Transport
    new transports.DailyRotateFile({
      level: currentLogLevel,
      filename: LOGGER_CONSTANTS.FILES.COMBINED_NAME,
      datePattern: LOGGER_CONSTANTS.FORMAT.DATE_PATTERN,
      zippedArchive: true,
      maxSize: LOGGER_CONSTANTS.FILES.MAX_SIZE,
      maxFiles: LOGGER_CONSTANTS.FILES.MAX_FILES_COMBINED,
      format: format.combine(
        format.timestamp({ format: LOGGER_CONSTANTS.FORMAT.TIMESTAMP }),
        customFormat,
      ),
    }),

    // Error Logs Transport
    new transports.DailyRotateFile({
      level: LOGGER_CONSTANTS.LEVELS.ERROR,
      filename: LOGGER_CONSTANTS.FILES.ERROR_NAME,
      datePattern: LOGGER_CONSTANTS.FORMAT.DATE_PATTERN,
      zippedArchive: true,
      maxSize: LOGGER_CONSTANTS.FILES.MAX_SIZE,
      maxFiles: LOGGER_CONSTANTS.FILES.MAX_FILES_ERROR,
      format: format.combine(
        format.timestamp({ format: LOGGER_CONSTANTS.FORMAT.TIMESTAMP }),
        customFormat,
      ),
    }),
  ],
};
