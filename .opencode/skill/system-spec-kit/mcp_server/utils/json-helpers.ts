// ---------------------------------------------------------------
// MODULE: JSON Helpers
// UTILS: JSON HELPERS
// ---------------------------------------------------------------

/* ---------------------------------------------------------------
   1. TYPES
   --------------------------------------------------------------- */

/** Expected types for typed JSON parsing */
export type ExpectedJsonType = 'array' | 'object' | 'string' | 'number';

/* ---------------------------------------------------------------
   2. SAFE JSON PARSING
   --------------------------------------------------------------- */

export function safeJsonParse<T = unknown>(str: string | null | undefined, fallback: T): T {
  if (!str) return fallback;
  try {
    return JSON.parse(str) as T;
  } catch {
    return fallback;
  }
}

export function safeJsonStringify(value: unknown, fallback: string = 'null', space?: number): string {
  try {
    return JSON.stringify(value, null, space);
  } catch {
    return fallback;
  }
}

export function safeJsonParseTyped<T = unknown>(str: string | null | undefined, expectedType: ExpectedJsonType, fallback: T): T {
  const parsed = safeJsonParse(str, fallback);

  switch (expectedType) {
    case 'array':
      return (Array.isArray(parsed) ? parsed : fallback) as T;
    case 'object':
      return (parsed && typeof parsed === 'object' && !Array.isArray(parsed))
        ? parsed as T
        : fallback;
    case 'string':
      return (typeof parsed === 'string' ? parsed : fallback) as T;
    case 'number':
      return (typeof parsed === 'number' && !isNaN(parsed) ? parsed : fallback) as T;
    default:
      return parsed as T;
  }
}

/* ---------------------------------------------------------------
   3. (ESM exports above — no CommonJS module.exports needed)
   --------------------------------------------------------------- */
