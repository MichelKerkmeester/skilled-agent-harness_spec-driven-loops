#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ CLI: CANONICAL COMPILED-ROUTE MANIFEST                                  ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const path = require('node:path');
const { spawnSync } = require('node:child_process');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

// Private CLI-to-library handoff naming the runtime closure an explicit
// --runtime-root operation must serve. Exported main() only ever sets it
// inside a dedicated child process it spawns. PRIVATE_CHILD_ENV is the marker
// that tells a re-entered CLI it is already that private child; it is separate
// from the root binding so a caller-preloaded binding can never put the caller
// into child mode and reuse its cached library. The library
// realpath-canonicalizes the binding so every spelling of one closure derives
// one writer lock and one require-cache root.
const RUNTIME_ROOT_ENV = 'SPECKIT_COMPILED_ROUTING_MANIFEST_RUNTIME_ROOT';
const PRIVATE_CHILD_ENV = 'SPECKIT_COMPILED_ROUTING_MANIFEST_PRIVATE_CHILD';

const USAGE = 'usage: compiled-route-manifest.cjs <mint|refresh|freshness> '
  + '--hub <hub-id> --skill-root <path> [--runtime-root <path>] [--pretty]';

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function parseArgs(argv) {
  const verb = argv[0];
  if (verb !== 'mint' && verb !== 'refresh' && verb !== 'freshness') return null;
  const values = { verb, pretty: false };
  const seen = new Set();
  for (let index = 1; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--pretty') {
      if (seen.has(arg)) return null;
      seen.add(arg);
      values.pretty = true;
      continue;
    }
    if (arg !== '--hub' && arg !== '--skill-root' && arg !== '--runtime-root') return null;
    if (seen.has(arg) || index + 1 >= argv.length || argv[index + 1].startsWith('--')) {
      return null;
    }
    seen.add(arg);
    const value = argv[index + 1];
    if (arg === '--runtime-root') {
      if (!value) return null;
      values.runtimeRoot = value;
    } else {
      values[arg === '--hub' ? 'hubId' : 'skillRoot'] = value;
    }
    index += 1;
  }
  if (!values.hubId || !values.skillRoot) return null;
  return values;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. CLI
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Run one manifest operation and emit a single JSON record.
 *
 * An explicit --runtime-root operation runs in a dedicated child process, so
 * this exported function never mutates the caller's environment and never
 * shares its cached library module with the operation. A default operation
 * drops any private binding and reloads the library so a preloaded override
 * cannot capture it.
 *
 * @param {string[]} argv - CLI arguments after the executable path.
 * @returns {number} Process exit code.
 */
function main(argv = process.argv.slice(2)) {
  const parsed = parseArgs(argv);
  if (!parsed) {
    process.stderr.write(`${USAGE}\n`);
    return 2;
  }
  if (!parsed.runtimeRoot) {
    // Default operations always target the promoted runtime root: drop any
    // private bindings an outer process may carry and reload the library so
    // its module-level root cannot be captured by a stale override.
    delete process.env[RUNTIME_ROOT_ENV];
    delete process.env[PRIVATE_CHILD_ENV];
    delete require.cache[require.resolve('./lib/compiled-route-manifest.cjs')];
    return runOperation(parsed);
  }
  if (process.env[PRIVATE_CHILD_ENV] !== undefined) {
    // Already inside the private child: bind from argv so the operation always
    // matches the requested root, then run directly without respawning. The
    // cache purge is a no-op in a freshly spawned child and only matters if an
    // outer process manually opted into child mode over a preloaded library.
    process.env[RUNTIME_ROOT_ENV] = parsed.runtimeRoot;
    delete require.cache[require.resolve('./lib/compiled-route-manifest.cjs')];
    return runOperation(parsed);
  }
  return runInPrivateChild(parsed, argv);
}

function runOperation(parsed) {
  const manifest = require('./lib/compiled-route-manifest.cjs');
  const input = { hubId: parsed.hubId, skillRoot: parsed.skillRoot };
  const result = parsed.verb === 'mint'
    ? manifest.mintCanonicalManifest(input)
    : parsed.verb === 'refresh'
      ? manifest.refreshCanonicalManifest(input)
      : manifest.checkCanonicalManifestFreshness(input);
  const output = parsed.pretty ? JSON.stringify(result, null, 2) : JSON.stringify(result);
  process.stdout.write(`${output}\n`);
  return result.manifestValid && result.fresh ? 0 : 1;
}

/**
 * Run an explicit-root operation in a fresh process bound to the requested
 * root through the private sentinel, then relay its stdout, stderr and exit
 * code unchanged.
 *
 * @param {Object} parsed - Parsed CLI arguments.
 * @param {string[]} argv - Original CLI arguments after the executable path.
 * @returns {number} The child's exit code, or 1 when the child could not run.
 */
function runInPrivateChild(parsed, argv) {
  const child = spawnSync(process.execPath, [__filename, ...argv], {
    cwd: process.cwd(),
    env: {
      ...process.env,
      [RUNTIME_ROOT_ENV]: parsed.runtimeRoot,
      [PRIVATE_CHILD_ENV]: '1',
    },
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  if (child.stdout) process.stdout.write(child.stdout);
  if (child.stderr) process.stderr.write(child.stderr);
  if (child.error) {
    process.stderr.write('[compiled-route-manifest] could not start isolated operation\n');
    return 1;
  }
  if (child.signal) {
    process.stderr.write(`[compiled-route-manifest] isolated operation terminated by ${child.signal}\n`);
    return 1;
  }
  return child.status === null ? 1 : child.status;
}

if (require.main === module) {
  try {
    process.exitCode = main();
  } catch {
    process.stderr.write('[compiled-route-manifest] operation failed\n');
    process.exitCode = 1;
  }
}

module.exports = { main, parseArgs, USAGE, RUNTIME_ROOT_ENV, PRIVATE_CHILD_ENV };
