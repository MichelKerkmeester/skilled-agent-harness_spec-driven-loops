// ───────────────────────────────────────────────────────────────────
// MODULE: OpenCode Binary Resolver
// ───────────────────────────────────────────────────────────────────
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const { spawnSync } = require('node:child_process');
const {
  accessSync,
  constants,
  realpathSync,
  statSync,
} = require('node:fs');
const path = require('node:path');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const PROBE_TIMEOUT_MS = 3000;
const VERSION_PATTERN = /^\s*(?:[A-Za-z][\w.-]*\s+)?[vV]?(\d+)\.(\d+)\.(\d+)(?:[-+][\w.-]+)?\s*$/;
const versionCache = new Map();

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function hasPathSeparator(binary) {
  return binary.includes('/') || binary.includes('\\');
}

function unresolvedError(reason, output = '') {
  const probeOutput = output.length > 0 ? output : '<none>';
  const error = new Error(
    `Unable to resolve OpenCode binary (opencode2 or opencode). ${reason}. `
      + `Probe output: ${probeOutput}`,
  );
  error.code = 'E_OPENCODE_UNRESOLVED';
  return error;
}

function findExecutable(candidatePath) {
  try {
    const executablePath = realpathSync(candidatePath);
    if (!statSync(executablePath).isFile()) return null;
    accessSync(executablePath, constants.X_OK);
    return executablePath;
  } catch {
    return null;
  }
}

function resolveOnPath(binary, searchPath) {
  if (typeof searchPath !== 'string' || searchPath.length === 0) return null;

  for (const directory of searchPath.split(path.delimiter)) {
    if (!directory) continue;
    const executablePath = findExecutable(path.join(directory, binary));
    if (executablePath) return executablePath;
  }

  return null;
}

function probeExecutable(executablePath, env) {
  const result = spawnSync(executablePath, ['--version'], {
    timeout: PROBE_TIMEOUT_MS,
    env,
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  const stdout = result.stdout?.toString() ?? '';
  const stderr = result.stderr?.toString() ?? '';
  const output = [stdout, stderr].filter((value) => value.length > 0).join('\n');

  if (result.error) return { output, failure: result.error.message };
  if (result.status !== 0) return { output, failure: `probe exited with status ${result.status}` };
  return { output, failure: null };
}

function resolveCandidate(command, executablePath, env, deps) {
  let metadata;
  try {
    metadata = statSync(executablePath);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw unresolvedError(`Could not stat '${executablePath}': ${message}`);
  }
  if (!metadata.isFile()) {
    throw unresolvedError(`Resolved path is not a regular file: '${executablePath}'`);
  }

  const cacheKey = JSON.stringify([executablePath, metadata.size, metadata.mtimeMs]);
  let version = versionCache.get(cacheKey);
  if (!version) {
    let probeResult;
    try {
      probeResult = typeof deps.probe === 'function'
        ? { output: deps.probe(executablePath), failure: null }
        : probeExecutable(executablePath, env);
    } catch (error) {
      const output = typeof error?.probeOutput === 'string' ? error.probeOutput : '';
      const message = error instanceof Error ? error.message : String(error);
      throw unresolvedError(`Version probe failed for '${command}': ${message}`, output);
    }

    if (probeResult.failure) {
      throw unresolvedError(
        `Version probe failed for '${command}': ${probeResult.failure}`,
        probeResult.output,
      );
    }
    if (typeof probeResult.output !== 'string') {
      throw unresolvedError(`Version probe returned no text for '${command}'`);
    }

    version = parseOpencodeVersion(probeResult.output);
    if (version === 'unknown') {
      throw unresolvedError(
        `Version probe output for '${command}' was not supported`,
        probeResult.output,
      );
    }
    versionCache.set(cacheKey, version);
  }

  return { command, executablePath, version };
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
 * Resolve and probe an executable OpenCode binary.
 *
 * @param {NodeJS.ProcessEnv} [env=process.env] - Environment used for PATH and probing.
 * @param {Object} [deps={}] - Optional dependency overrides.
 * @param {(executablePath: string) => string} [deps.probe] - Synchronous version probe.
 * @returns {{command: string, executablePath: string, version: 'v1' | 'v2'}} The resolved binary.
 * @throws {Error} With code E_OPENCODE_UNRESOLVED when resolution or probing fails.
 */
function resolveOpencodeBinary(env = process.env, deps = {}) {
  const hasOverride = Object.prototype.hasOwnProperty.call(env, 'OPENCODE_BIN')
    && env.OPENCODE_BIN !== undefined;

  if (hasOverride) {
    const command = env.OPENCODE_BIN;
    if (typeof command !== 'string' || command.length === 0) {
      throw unresolvedError('OPENCODE_BIN is empty or invalid');
    }
    const executablePath = hasPathSeparator(command)
      ? findExecutable(command)
      : resolveOnPath(command, env.PATH);
    if (!executablePath) {
      throw unresolvedError(
        `OPENCODE_BIN '${command}' did not resolve to an executable regular file`,
      );
    }
    return resolveCandidate(command, executablePath, env, deps);
  }

  const searchPath = typeof env.PATH === 'string' ? env.PATH : '';
  for (const directory of searchPath.split(path.delimiter)) {
    if (!directory) continue;
    for (const command of ['opencode2', 'opencode']) {
      const executablePath = findExecutable(path.join(directory, command));
      if (executablePath) return resolveCandidate(command, executablePath, env, deps);
    }
  }

  throw unresolvedError('No executable regular file was found on PATH');
}

/** Clear successful version probe results. */
function clearOpencodeVersionCache() {
  versionCache.clear();
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  parseOpencodeVersion,
  resolveOpencodeBinary,
  clearOpencodeVersionCache,
  PROBE_TIMEOUT_MS,
};
