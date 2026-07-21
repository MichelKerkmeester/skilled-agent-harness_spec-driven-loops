#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ CLI: CANONICAL COMPILED-ROUTE MANIFEST                                  ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const {
  checkCanonicalManifestFreshness,
  mintCanonicalManifest,
} = require('./lib/compiled-route-manifest.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const USAGE = 'usage: compiled-route-manifest.cjs <mint|freshness> '
  + '--hub <hub-id> --skill-root <path> [--pretty]';

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function parseArgs(argv) {
  const verb = argv[0];
  if (verb !== 'mint' && verb !== 'freshness') return null;
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
    if (arg !== '--hub' && arg !== '--skill-root') return null;
    if (seen.has(arg) || index + 1 >= argv.length || argv[index + 1].startsWith('--')) {
      return null;
    }
    seen.add(arg);
    values[arg === '--hub' ? 'hubId' : 'skillRoot'] = argv[index + 1];
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
 * @param {string[]} argv - CLI arguments after the executable path.
 * @returns {number} Process exit code.
 */
function main(argv = process.argv.slice(2)) {
  const parsed = parseArgs(argv);
  if (!parsed) {
    process.stderr.write(`${USAGE}\n`);
    return 2;
  }
  const input = { hubId: parsed.hubId, skillRoot: parsed.skillRoot };
  const result = parsed.verb === 'mint'
    ? mintCanonicalManifest(input)
    : checkCanonicalManifestFreshness(input);
  const output = parsed.pretty ? JSON.stringify(result, null, 2) : JSON.stringify(result);
  process.stdout.write(`${output}\n`);
  return result.manifestValid && result.fresh ? 0 : 1;
}

if (require.main === module) {
  try {
    process.exitCode = main();
  } catch {
    process.stderr.write('[compiled-route-manifest] operation failed\n');
    process.exitCode = 1;
  }
}

module.exports = { main, parseArgs, USAGE };
