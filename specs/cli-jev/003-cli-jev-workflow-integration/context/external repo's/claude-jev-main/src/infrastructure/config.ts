export interface Config {
  /** Empty when no key is configured; tool calls then fail with an explanation. */
  readonly apiKey: string;
  readonly model: string;
  readonly allowSourceReading: boolean;
  readonly maxFileBytes: number;
  readonly maxFilesPerCall: number;
  readonly maxRequests: number;
}

export const DEFAULTS = {
  model: 'jev-latest',
  allowSourceReading: true,
  maxFileBytes: 65_536,
  maxFilesPerCall: 20,
  maxRequests: 8,
} as const;

type Env = Readonly<Record<string, string | undefined>>;

function text(env: Env, name: string): string | undefined {
  const value = env[name]?.trim();
  return value === undefined || value.length === 0 ? undefined : value;
}

function integer(env: Env, name: string, fallback: number, min: number, max: number): number {
  const raw = text(env, name);
  if (raw === undefined) return fallback;
  const parsed = Number.parseInt(raw, 10);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(max, Math.max(min, parsed));
}

function flag(env: Env, name: string, fallback: boolean): boolean {
  const raw = text(env, name)?.toLowerCase();
  if (raw === undefined) return fallback;
  if (raw === 'true' || raw === '1' || raw === 'yes') return true;
  if (raw === 'false' || raw === '0' || raw === 'no') return false;
  return fallback;
}

/**
 * `JEV_API_KEY` carries the plugin option, which substitutes to an empty string
 * when the user leaves it blank; `TYPESAFE_API_KEY` is the key they export
 * themselves and must survive that case.
 */
export function loadConfig(env: Env): Config {
  return {
    apiKey: text(env, 'JEV_API_KEY') ?? text(env, 'TYPESAFE_API_KEY') ?? '',
    model: text(env, 'JEV_MODEL') ?? DEFAULTS.model,
    allowSourceReading: flag(env, 'JEV_ALLOW_SOURCE_READING', DEFAULTS.allowSourceReading),
    maxFileBytes: integer(env, 'JEV_MAX_FILE_BYTES', DEFAULTS.maxFileBytes, 512, 1_048_576),
    maxFilesPerCall: integer(env, 'JEV_MAX_FILES_PER_CALL', DEFAULTS.maxFilesPerCall, 1, 200),
    maxRequests: integer(env, 'JEV_MAX_REQUESTS', DEFAULTS.maxRequests, 1, 64),
  };
}
