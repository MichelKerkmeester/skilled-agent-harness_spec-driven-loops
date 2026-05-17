/**
 * Type-guard for plain object records (i.e. excludes `null` and arrays).
 */
export declare function isRecord(value: unknown): value is Record<string, unknown>;
/**
 * Parse a JSON string and return it iff the result is a plain object.
 * Returns `null` on parse failure or any other shape (array, scalar, null).
 */
export declare function parseJsonObject(raw: string): Record<string, unknown> | null;
/**
 * Parse a JSON string and return it as a `string[]` filtered to string entries.
 * Returns `[]` on parse failure or any non-array shape. Non-string entries are
 * dropped.
 */
export declare function parseJsonStringArray(raw: string): string[];
/**
 * Read the file at `filePath` and parse it as a JSON object. Returns `null`
 * when the file does not exist, fails to parse, or does not parse to an
 * object shape. Throws only when `readFileSync` itself fails for a non-ENOENT
 * reason (the caller is expected to surface that as a hard error).
 */
export declare function readJsonObject(filePath: string): Record<string, unknown> | null;
//# sourceMappingURL=json-guard.d.ts.map