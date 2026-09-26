import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join } from "node:path";
import { z } from "zod";
import { CliError } from "./errors.js";

export const PROVIDERS = ["auto", "typesafe", "openrouter", "cloudflare"] as const;
export type ProviderName = (typeof PROVIDERS)[number];

const prob = z.number().min(0).max(1);

/** Shape of the config file and of every override layer: everything optional, no defaults applied. */
export const partialConfigSchema = z.object({
  provider: z.enum(PROVIDERS).optional(),
  model: z.string().min(1).optional(),
  timeoutMs: z.number().int().positive().optional(),
  format: z.enum(["text", "json", "jsonl", "csv", "tsv", "md"]).optional(),
  verify: z.object({ autoAccept: prob.optional() }).optional(),
  screen: z.object({ blockAt: prob.optional(), reviewAt: prob.optional() }).optional(),
  find: z
    .object({
      topK: z.number().int().min(1).max(50).optional(),
      found: prob.optional(),
      absent: prob.optional(),
    })
    .optional(),
  classify: z.object({ minConfidence: prob.optional(), threshold: prob.optional() }).optional(),
  extract: z.object({ minConfidence: prob.optional() }).optional(),
  batch: z.object({ concurrency: z.number().int().min(1).max(64).optional() }).optional(),
  rerank: z.object({ topK: z.number().int().min(1).max(250).optional(), min: prob.optional() }).optional(),
  route: z.object({ minConfidence: prob.optional() }).optional(),
  compact: z
    .object({
      keepThreshold: prob.optional(),
      preserveRecent: z.number().int().min(0).optional(),
      maxStateTokens: z.number().int().positive().optional(),
      maxRequestTokens: z.number().int().positive().optional(),
      truncateHead: z.number().int().min(0).optional(),
      minReduction: prob.optional(),
      concurrency: z.number().int().min(1).max(64).optional(),
    })
    .optional(),
});

/** Fully resolved config with defaults. */
export const configSchema = z.object({
  provider: z.enum(PROVIDERS).default("auto"),
  model: z.string().min(1).default("jev-latest"),
  timeoutMs: z.number().int().positive().default(30_000),
  format: z.enum(["text", "json", "jsonl", "csv", "tsv", "md"]).default("text"),
  verify: z.object({ autoAccept: prob.default(0.8) }).prefault({}),
  screen: z.object({ blockAt: prob.default(0.75), reviewAt: prob.default(0.25) }).prefault({}),
  find: z
    .object({
      topK: z.number().int().min(1).max(50).default(5),
      found: prob.default(0.7),
      absent: prob.default(0.35),
    })
    .prefault({}),
  classify: z.object({ minConfidence: prob.default(0.6), threshold: prob.default(0.5) }).prefault({}),
  extract: z.object({ minConfidence: prob.default(0.6) }).prefault({}),
  batch: z.object({ concurrency: z.number().int().min(1).max(64).default(4) }).prefault({}),
  rerank: z
    .object({ topK: z.number().int().min(1).max(250).default(10), min: prob.default(0.5) })
    .prefault({}),
  route: z.object({ minConfidence: prob.default(0.6) }).prefault({}),
  compact: z
    .object({
      keepThreshold: prob.default(0.5),
      preserveRecent: z.number().int().min(0).default(6),
      maxStateTokens: z.number().int().positive().default(25_000),
      maxRequestTokens: z.number().int().positive().default(30_000),
      truncateHead: z.number().int().min(0).default(300),
      minReduction: prob.default(0.25),
      concurrency: z.number().int().min(1).max(64).default(4),
    })
    .prefault({}),
});

export type JevConfig = z.infer<typeof configSchema>;
export type PartialConfig = z.infer<typeof partialConfigSchema>;

export const DEFAULT_CONFIG: JevConfig = configSchema.parse({});

/** Location of the user config file. `JEV_CONFIG` overrides; otherwise XDG or ~/.config. */
export function configPath(env: NodeJS.ProcessEnv = process.env): string {
  if (env.JEV_CONFIG) return env.JEV_CONFIG;
  const base = env.XDG_CONFIG_HOME || join(env.HOME || homedir(), ".config");
  return join(base, "jev", "config.json");
}

/** Read and validate the config file. Missing file yields `{}`. */
export function readConfigFile(path: string): PartialConfig {
  if (!existsSync(path)) return {};
  let parsed: unknown;
  try {
    parsed = JSON.parse(readFileSync(path, "utf8"));
  } catch (err) {
    throw new CliError(`Config file ${path} is not valid JSON: ${(err as Error).message}`);
  }
  const result = partialConfigSchema.safeParse(parsed);
  if (!result.success) {
    throw new CliError(`Config file ${path} is invalid: ${formatZodError(result.error)}`);
  }
  return result.data;
}

/** Write the config file, creating parent directories. */
export function writeConfigFile(path: string, config: PartialConfig): void {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(config, null, 2)}\n`, "utf8");
}

/** Pull overrides from environment variables. */
export function configFromEnv(env: NodeJS.ProcessEnv): PartialConfig {
  const out: Record<string, unknown> = {};
  if (env.JEV_PROVIDER) out.provider = env.JEV_PROVIDER.toLowerCase();
  if (env.JEV_MODEL) out.model = env.JEV_MODEL;
  if (env.JEV_TIMEOUT_MS) {
    const n = Number(env.JEV_TIMEOUT_MS);
    if (!Number.isFinite(n) || n <= 0) throw new CliError("JEV_TIMEOUT_MS must be a positive number.");
    out.timeoutMs = n;
  }
  if (env.JEV_FORMAT) out.format = env.JEV_FORMAT;
  return out as PartialConfig;
}

/** Deep-merge partial configs; later sources win. */
export function mergeConfig(...layers: PartialConfig[]): PartialConfig {
  const out: Record<string, unknown> = {};
  for (const layer of layers) {
    for (const [key, value] of Object.entries(layer)) {
      if (value === undefined) continue;
      const existing = out[key];
      if (isPlainObject(value) && isPlainObject(existing)) {
        out[key] = { ...existing, ...value };
      } else {
        out[key] = value;
      }
    }
  }
  return out as PartialConfig;
}

export interface ResolveOptions {
  env?: NodeJS.ProcessEnv;
  flags?: PartialConfig;
  /** Set false to skip reading the config file (tests). */
  useFile?: boolean;
}

/** Resolve the effective config: defaults < file < env < flags. */
export function resolveConfig(opts: ResolveOptions = {}): JevConfig {
  const env = opts.env ?? process.env;
  const file = opts.useFile === false ? {} : readConfigFile(configPath(env));
  const merged = mergeConfig(file, configFromEnv(env), opts.flags ?? {});
  const result = configSchema.safeParse(merged);
  if (!result.success) throw new CliError(`Invalid configuration: ${formatZodError(result.error)}`);
  return result.data;
}

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

export function formatZodError(err: z.ZodError): string {
  return err.issues.map((i) => `${i.path.join(".") || "<root>"}: ${i.message}`).join("; ");
}

/** Set a dotted key on a partial config with type coercion, validating the result. */
export function setConfigValue(current: PartialConfig, dottedKey: string, rawValue: string): PartialConfig {
  const path = dottedKey.split(".");
  const next: Record<string, unknown> = structuredClone(current) as Record<string, unknown>;
  let cursor: Record<string, unknown> = next;
  for (const segment of path.slice(0, -1)) {
    const existing = cursor[segment];
    if (!isPlainObject(existing)) cursor[segment] = {};
    cursor = cursor[segment] as Record<string, unknown>;
  }
  cursor[path[path.length - 1]!] = coerce(rawValue);
  const known = knownConfigKeys();
  if (!known.has(dottedKey)) {
    throw new CliError(`Unknown config key "${dottedKey}". Known keys: ${[...known].join(", ")}.`);
  }
  const result = partialConfigSchema.safeParse(next);
  if (!result.success) throw new CliError(`Cannot set ${dottedKey}: ${formatZodError(result.error)}`);
  return result.data;
}

/** Every settable dotted key, derived from the schema so the list cannot drift. */
export function knownConfigKeys(): Set<string> {
  const keys = new Set<string>();
  const walk = (shape: Record<string, z.ZodType>, prefix: string) => {
    for (const [k, v] of Object.entries(shape)) {
      const inner = v instanceof z.ZodOptional ? v.unwrap() : v;
      if (inner instanceof z.ZodObject) walk(inner.shape as Record<string, z.ZodType>, `${prefix}${k}.`);
      else keys.add(`${prefix}${k}`);
    }
  };
  walk(partialConfigSchema.shape as Record<string, z.ZodType>, "");
  return keys;
}

function coerce(raw: string): unknown {
  if (raw === "true") return true;
  if (raw === "false") return false;
  if (raw.trim() !== "" && Number.isFinite(Number(raw))) return Number(raw);
  return raw;
}
