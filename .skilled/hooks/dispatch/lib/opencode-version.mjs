// ───────────────────────────────────────────────────────────────────
// MODULE: OpenCode Version Resolver
// ───────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import { spawnSync } from 'node:child_process';
import { accessSync, constants, realpathSync, statSync } from 'node:fs';
import { delimiter, join } from 'node:path';

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const PROBE_TIMEOUT_MS = 3000;
const VERSION_PATTERN = /^\s*(?:[A-Za-z][\w.-]*\s+)?[vV]?(\d+)\.(\d+)\.(\d+)(?:[-+][\w.-]+)?\s*$/;
const PROBE_TIMEOUT = Symbol('probe timeout');
const versionCache = new Map();

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function hasPathSeparator(binary) {
  return binary.includes('/') || binary.includes('\\');
}

function probeTarget(binary) {
  if (binary === '$OPENCODE_BIN' || binary === '${OPENCODE_BIN}') {
    return process.env.OPENCODE_BIN;
  }
  return binary;
}

function resolveOnPath(binary) {
  const searchPath = process.env.PATH;
  if (typeof searchPath !== 'string' || searchPath.length === 0) return null;

  for (const directory of searchPath.split(delimiter)) {
    if (!directory) continue;

    const candidate = join(directory, binary);
    try {
      accessSync(candidate, constants.X_OK);
      return candidate;
    } catch {
      continue;
    }
  }

  return null;
}

function probeBinary(binary) {
  const result = spawnSync(binary, ['--version'], {
    timeout: PROBE_TIMEOUT_MS,
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  if (result.error || result.status !== 0) {
    throw result.error ?? new Error('OpenCode version probe failed');
  }

  const stdout = result.stdout?.toString() ?? '';
  const stderr = result.stderr?.toString() ?? '';
  return [stdout, stderr].filter((output) => output.length > 0).join('\n');
}

async function probeWithTimeout(probe, binary) {
  let timeoutId;
  const timeout = new Promise((resolve) => {
    timeoutId = setTimeout(() => resolve(PROBE_TIMEOUT), PROBE_TIMEOUT_MS);
  });

  try {
    const output = await Promise.race([
      Promise.resolve().then(() => probe(binary)),
      timeout,
    ]);

    if (output === PROBE_TIMEOUT || typeof output !== 'string' || output.length === 0) {
      return { version: 'unknown', cacheable: false };
    }
    return { version: parseOpencodeVersion(output), cacheable: true };
  } catch {
    return { version: 'unknown', cacheable: false };
  } finally {
    if (timeoutId !== undefined) clearTimeout(timeoutId);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Parse the first supported version token in OpenCode version output.
 *
 * @param {string} text - Output returned by the version probe.
 * @returns {'v1' | 'v2' | 'unknown'} The supported major version or unknown.
 */
function parseOpencodeVersion(text) {
  if (typeof text !== 'string') return 'unknown';

  const trimmedText = text.trim();
  if (!trimmedText) return 'unknown';

  for (const line of trimmedText.split(/\r?\n/)) {
    const tokens = line.trim().split(/\s+/).filter(Boolean);

    for (let index = 0; index < tokens.length; index += 1) {
      const candidates = [tokens[index]];
      if (index + 1 < tokens.length) candidates.push(`${tokens[index]} ${tokens[index + 1]}`);

      for (const candidate of candidates) {
        const match = VERSION_PATTERN.exec(candidate);
        if (!match) continue;

        const major = Number(match[1]);
        if (major === 1) return 'v1';
        if (major === 2) return 'v2';
        return 'unknown';
      }
    }
  }

  return 'unknown';
}

/**
 * Resolve a bare OpenCode executable from its version output and file metadata.
 *
 * @param {string} binary - Bare executable name from the dispatch command.
 * @param {Object} [deps={}] - Optional probe and filesystem dependency overrides.
 * @param {(binary: string) => (string | Promise<string>)} [deps.probe] - Version probe.
 * @param {(binary: string) => {size: number, mtimeMs: number}} [deps.stat] - File stat provider.
 * @param {(binary: string) => string} [deps.realpath] - Canonical path provider.
 * @returns {Promise<'v1' | 'v2' | 'unknown'>} The resolved version family.
 */
async function resolveOpencodeVersion(binary, deps = {}) {
  if (typeof binary !== 'string' || binary.length === 0 || hasPathSeparator(binary)) return 'unknown';

  const executable = probeTarget(binary);
  if (typeof executable !== 'string' || executable.length === 0 || hasPathSeparator(executable)) return 'unknown';

  const probe = typeof deps.probe === 'function' ? deps.probe : probeBinary;
  const stat = typeof deps.stat === 'function' ? deps.stat : statSync;
  const realpath = typeof deps.realpath === 'function' ? deps.realpath : realpathSync;
  const probePath = typeof deps.realpath === 'function' ? executable : resolveOnPath(executable);
  if (!probePath) return 'unknown';

  let cacheKey;
  try {
    const canonicalPath = realpath(probePath);
    const metadata = stat(canonicalPath);
    if (
      typeof canonicalPath !== 'string'
      || canonicalPath.length === 0
      || !Number.isFinite(metadata?.size)
      || !Number.isFinite(metadata?.mtimeMs)
    ) {
      return 'unknown';
    }
    cacheKey = JSON.stringify([canonicalPath, metadata.size, metadata.mtimeMs]);
  } catch {
    return 'unknown';
  }

  if (versionCache.has(cacheKey)) return versionCache.get(cacheKey);

  const { version, cacheable } = await probeWithTimeout(probe, probePath);
  if (cacheable) versionCache.set(cacheKey, version);
  return version;
}

/**
 * Resolve a bare OpenCode executable through the bounded synchronous version probe.
 *
 * @param {string} binary - Bare executable name from the dispatch command.
 * @returns {'v1' | 'v2' | 'unknown'} The resolved version family.
 */
function resolveOpencodeVersionSync(binary) {
  try {
    if (typeof binary !== 'string' || binary.length === 0 || hasPathSeparator(binary)) return 'unknown';

    const executable = probeTarget(binary);
    if (typeof executable !== 'string' || executable.length === 0 || hasPathSeparator(executable)) return 'unknown';

    const probePath = resolveOnPath(executable);
    if (!probePath) return 'unknown';

    const canonicalPath = realpathSync(probePath);
    const metadata = statSync(canonicalPath);
    if (
      typeof canonicalPath !== 'string'
      || canonicalPath.length === 0
      || !Number.isFinite(metadata?.size)
      || !Number.isFinite(metadata?.mtimeMs)
    ) {
      return 'unknown';
    }

    const cacheKey = JSON.stringify([canonicalPath, metadata.size, metadata.mtimeMs]);
    if (versionCache.has(cacheKey)) return versionCache.get(cacheKey);

    const output = probeBinary(probePath);
    if (output.length === 0) return 'unknown';

    const version = parseOpencodeVersion(output);
    versionCache.set(cacheKey, version);
    return version;
  } catch {
    return 'unknown';
  }
}

/** Clear cached probe results. */
function clearOpencodeVersionCache() {
  versionCache.clear();
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

export {
  clearOpencodeVersionCache,
  parseOpencodeVersion,
  PROBE_TIMEOUT_MS,
  resolveOpencodeVersion,
  resolveOpencodeVersionSync,
};
