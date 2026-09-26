// Update warning shown before a command's output: checks npm at most once per
// day, cached on disk, so most invocations never touch the network.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { compareVersions } from "./commands/update.js";
import { configPath } from "./config.js";

const DEFAULT_TTL_MS = 24 * 60 * 60 * 1000;

interface VersionCache {
  latest: string;
  checkedAt: number;
}

export function versionCachePath(env: NodeJS.ProcessEnv = process.env): string {
  return env.JEV_VERSION_CACHE || join(dirname(configPath(env)), "update-check.json");
}

function readCache(path: string): VersionCache | undefined {
  if (!existsSync(path)) return undefined;
  try {
    const parsed = JSON.parse(readFileSync(path, "utf8"));
    if (parsed && typeof parsed.latest === "string" && typeof parsed.checkedAt === "number") return parsed;
    return undefined;
  } catch {
    return undefined;
  }
}

function writeCache(path: string, cache: VersionCache): void {
  try {
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, JSON.stringify(cache), "utf8");
  } catch {
    // Best-effort: a stale or missing cache just means the next run checks again.
  }
}

export interface CheckForUpdateOptions {
  env?: NodeJS.ProcessEnv;
  currentVersion: string;
  /** Returns the latest published version; only called when the cache is missing or stale. */
  fetchLatest: () => string;
  now?: number;
  ttlMs?: number;
}

/** Latest version newer than `currentVersion`, or undefined if up to date or the check failed. */
export function checkForUpdate(opts: CheckForUpdateOptions): string | undefined {
  const env = opts.env ?? process.env;
  const now = opts.now ?? Date.now();
  const ttlMs = opts.ttlMs ?? DEFAULT_TTL_MS;
  const path = versionCachePath(env);

  let cache = readCache(path);
  if (!cache || now - cache.checkedAt > ttlMs) {
    try {
      cache = { latest: opts.fetchLatest(), checkedAt: now };
      writeCache(path, cache);
    } catch {
      return undefined;
    }
  }

  return compareVersions(cache.latest, opts.currentVersion) > 0 ? cache.latest : undefined;
}
