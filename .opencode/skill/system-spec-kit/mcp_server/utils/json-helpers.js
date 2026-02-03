// ───────────────────────────────────────────────────────────────
// UTILS: JSON HELPERS
// ───────────────────────────────────────────────────────────────
'use strict';

/* ─────────────────────────────────────────────────────────────
   1. SAFE JSON PARSING
────────────────────────────────────────────────────────────────*/

function safe_json_parse(str, fallback = []) {
  if (!str) return fallback;
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
}

function safe_json_stringify(value, fallback = 'null', space) {
  try {
    return JSON.stringify(value, null, space);
  } catch {
    return fallback;
  }
}

function safe_json_parse_typed(str, expected_type, fallback) {
  const parsed = safe_json_parse(str, fallback);

  switch (expected_type) {
    case 'array':
      return Array.isArray(parsed) ? parsed : fallback;
    case 'object':
      return (parsed && typeof parsed === 'object' && !Array.isArray(parsed))
        ? parsed
        : fallback;
    case 'string':
      return typeof parsed === 'string' ? parsed : fallback;
    case 'number':
      return typeof parsed === 'number' && !isNaN(parsed) ? parsed : fallback;
    default:
      return parsed;
  }
}

/* ─────────────────────────────────────────────────────────────
   2. EXPORTS
────────────────────────────────────────────────────────────────*/

module.exports = {
  safe_json_parse,
  safe_json_stringify,
  safe_json_parse_typed,

  // Backward compatibility aliases
  safeJsonParse: safe_json_parse,
  safeJsonStringify: safe_json_stringify,
  safeJsonParseTyped: safe_json_parse_typed
};
