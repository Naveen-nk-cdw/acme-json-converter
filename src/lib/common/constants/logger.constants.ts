export const LOGGER_CONSTANTS = {
  TRACE: {
    DEFAULT_ID: 'NO-TRACE',
    KEY: 'traceId',
  },
  FORMAT: {
    TIMESTAMP: 'YYYY-MM-DD HH:mm:ss',
    DATE_PATTERN: 'YYYY-MM-DD',
  },
  FILES: {
    DIR: 'logs',
    COMBINED_NAME: 'logs/%DATE%.log',
    ERROR_NAME: 'logs/error-%DATE%.log',
    MAX_SIZE: '20m',
    MAX_FILES_COMBINED: '14d',
    MAX_FILES_ERROR: '30d',
  },
  LEVELS: {
    PRODUCTION: 'info',
    DEVELOPMENT: 'debug',
    ERROR: 'error',
  },
} as const;
