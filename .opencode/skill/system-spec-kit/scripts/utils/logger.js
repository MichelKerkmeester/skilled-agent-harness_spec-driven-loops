// ───────────────────────────────────────────────────────────────
// UTILS: STRUCTURED LOGGER
// ───────────────────────────────────────────────────────────────

'use strict';

/* ─────────────────────────────────────────────────────────────
   1. LOGGING
────────────────────────────────────────────────────────────────*/

function structuredLog(level, message, data = {}) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...data
  };
  
  const jsonOutput = JSON.stringify(logEntry);
  
  if (level === 'error') {
    console.error(jsonOutput);
  } else if (level === 'warn') {
    console.warn(jsonOutput);
  } else if (level === 'debug' && process.env.DEBUG) {
    console.log(jsonOutput);
  } else if (level === 'info') {
    console.log(jsonOutput);
  }
}

/* ─────────────────────────────────────────────────────────────
   2. EXPORTS
────────────────────────────────────────────────────────────────*/

module.exports = {
  structuredLog,
};
