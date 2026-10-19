// ───────────────────────────────────────────────────────────────────
// MODULE: OpenCode Version Resolver
// ───────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import { execFile, spawnSync } from 'node:child_process';
import { accessSync, constants, realpathSync, statSync } from 'node:fs';
import { delimiter, join } from 'node:path';

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

// The single list of OpenCode families the rule engine treats as supported.
const SUPPORTED_FAMILIES = Object.freeze(['v1', 'v2']);
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

// The async resolver races this probe against a timer. execFile returns control to the event
// loop between spawn and exit, so that timer can fire; spawnSync stays with the sync resolver,
// which has no timer to starve.
function probeBinaryAsync(binary) {
  return new Promise((resolve, reject) => {
    execFile(binary, ['--version'], { timeout: PROBE_TIMEOUT_MS }, (error, stdout, stderr) => {
      // execFile reports a non-zero exit as an error, so this covers both failures.
      if (error) {
        reject(error);
        return;
      }

      resolve([stdout, stderr].filter((output) => output.length > 0).join('\n'));
    });
  });
}

function executableFile(candidate) {
  try {
    accessSync(candidate, constants.X_OK);
    return candidate;
  } catch {
    return null;
  }
}

function fileIdentity(candidate, realpath, stat) {
  try {
    const canonicalPath = realpath(candidate);
    const metadata = stat(canonicalPath);
    if (
      typeof canonicalPath !== 'string'
      || canonicalPath.length === 0
      || !Number.isFinite(metadata?.size)
      || !Number.isFinite(metadata?.mtimeMs)
    ) {
      return null;
    }
    return JSON.stringify([canonicalPath, metadata.size, metadata.mtimeMs]);
  } catch {
    return null;
  }
}

function trustedExecutables() {
  const trusted = [];
  for (const name of ['opencode', 'opencode2']) {
    const resolved = resolveOnPath(name);
    if (resolved) trusted.push(resolved);
  }

  const configured = process.env.OPENCODE_BIN;
  if (typeof configured === 'string' && configured.length > 0) {
    const resolved = hasPathSeparator(configured) ? configured : resolveOnPath(configured);
    if (resolved) trusted.push(resolved);
  }

  return trusted;
}

// The guard resolves the version before it decides whether to refuse a dispatch, so it must
// not run a file the command merely names. A path-qualified value is trusted only when its
// canonical file is one the operator already put in reach, and the caller spawns the trusted
// path this returns: the command's pathname is only ever compared, never executed, so a
// symlink swapped after the check cannot decide what the guard runs.
function trustedExecutableFor(candidate, realpath, stat) {
  const identity = fileIdentity(candidate, realpath, stat);
  if (!identity) return null;

  for (const trusted of trustedExecutables()) {
    if (fileIdentity(trusted, realpath, stat) === identity) return trusted;
  }

  return null;
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
 * Resolve a named or path-qualified OpenCode executable from its version output and file metadata.
 *
 * @param {string} binary - Executable name or path from the dispatch command.
 * @param {Object} [deps={}] - Optional probe and filesystem dependency overrides.
 * @param {(binary: string) => (string | Promise<string>)} [deps.probe] - Version probe.
 * @param {(binary: string) => {size: number, mtimeMs: number}} [deps.stat] - File stat provider.
 * @param {(binary: string) => string} [deps.realpath] - Canonical path provider.
 * @returns {Promise<'v1' | 'v2' | 'unknown'>} The resolved version family.
 */
async function resolveOpencodeVersion(binary, deps = {}) {
  if (typeof binary !== 'string' || binary.length === 0) return 'unknown';

  const executable = probeTarget(binary);
  if (typeof executable !== 'string' || executable.length === 0) return 'unknown';

  const probe = typeof deps.probe === 'function' ? deps.probe : probeBinaryAsync;
  const stat = typeof deps.stat === 'function' ? deps.stat : statSync;
  const realpath = typeof deps.realpath === 'function' ? deps.realpath : realpathSync;
  let probePath;
  if (hasPathSeparator(executable)) {
    const candidate = executableFile(executable);
    if (!candidate) return 'unknown';
    probePath = trustedExecutableFor(candidate, realpath, stat);
    if (!probePath) return 'unknown';
  } else {
    // A bare name is looked up on PATH, or handed to an injected realpath seam instead.
    probePath = typeof deps.realpath === 'function' ? executable : resolveOnPath(executable);
  }
  if (!probePath) return 'unknown';

  const cacheKey = fileIdentity(probePath, realpath, stat);
  if (!cacheKey) return 'unknown';

  if (versionCache.has(cacheKey)) return versionCache.get(cacheKey);

  const { version, cacheable } = await probeWithTimeout(probe, probePath);
  if (cacheable) versionCache.set(cacheKey, version);
  return version;
}

/**
 * Resolve a named or path-qualified OpenCode executable through the bounded synchronous version probe.
 *
 * @param {string} binary - Executable name or path from the dispatch command.
 * @returns {'v1' | 'v2' | 'unknown'} The resolved version family.
 */
function resolveOpencodeVersionSync(binary) {
  try {
    if (typeof binary !== 'string' || binary.length === 0) return 'unknown';

    const executable = probeTarget(binary);
    if (typeof executable !== 'string' || executable.length === 0) return 'unknown';

    let probePath;
    if (hasPathSeparator(executable)) {
      const candidate = executableFile(executable);
      if (!candidate) return 'unknown';
      probePath = trustedExecutableFor(candidate, realpathSync, statSync);
      if (!probePath) return 'unknown';
    } else {
      probePath = resolveOnPath(executable);
    }
    if (!probePath) return 'unknown';

    const cacheKey = fileIdentity(probePath, realpathSync, statSync);
    if (!cacheKey) return 'unknown';

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
  SUPPORTED_FAMILIES,
};
