// ───────────────────────────────────────────────────────────────
// MODULE: Code Graph Logger Helper
// ───────────────────────────────────────────────────────────────

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const LEVEL_VALUES: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

function getMinLevel(): LogLevel {
  const env = process.env.LOG_LEVEL?.toLowerCase();
  if (env && env in LEVEL_VALUES) return env as LogLevel;
  return 'info';
}

function log(level: LogLevel, prefix: string, message: string, data?: Record<string, unknown>): void {
  if (LEVEL_VALUES[level] < LEVEL_VALUES[getMinLevel()]) return;
  const tag = level.toUpperCase().padEnd(5);
  const base = `${tag} ${prefix} ${message}`;
  if (data && Object.keys(data).length > 0) {
    console.error(`${base} ${JSON.stringify(data)}`);
  } else {
    console.error(base);
  }
}

export interface Logger {
  debug(message: string, data?: Record<string, unknown>): void;
  info(message: string, data?: Record<string, unknown>): void;
  warn(message: string, data?: Record<string, unknown>): void;
  error(message: string, data?: Record<string, unknown>): void;
}

export function createLogger(moduleName: string): Logger {
  const prefix = `[${moduleName}]`;
  return {
    debug: (message, data?) => log('debug', prefix, message, data),
    info:  (message, data?) => log('info',  prefix, message, data),
    warn:  (message, data?) => log('warn',  prefix, message, data),
    error: (message, data?) => log('error', prefix, message, data),
  };
}

export { log };
