#!/usr/bin/env node
/**
 * scripts/cache-reconstruct.cjs
 *
 * Rebuild cache/<kind>/index.jsonl from blob files when the index is corrupted
 * or missing. Scans cache/<kind>/*.out.md, parses each blob's cache-meta header,
 * reconstructs index rows. Atomic via temp+rename on the index file.
 *
 * Usage:
 *   node scripts/cache-reconstruct.cjs            Rebuild both kinds (det + grader).
 *   node scripts/cache-reconstruct.cjs --kind det Rebuild only det cache index.
 *   node scripts/cache-reconstruct.cjs --kind grader
 */

const cache = require('../lib/cache.cjs');

function parseArgs(argv) {
  const out = { kinds: ['det', 'grader'] };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--kind') {
      out.kinds = [argv[i + 1]];
      i++;
    }
  }
  return out;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const summary = [];
  for (const kind of args.kinds) {
    try {
      const result = cache.rebuild_index(kind);
      summary.push(result);
      process.stdout.write(`reconstruct: kind=${kind} rebuilt=${result.rebuilt_count}\n`);
    } catch (err) {
      summary.push({ kind, error: err.message });
      process.stderr.write(`reconstruct: kind=${kind} ERROR ${err.message}\n`);
      process.exitCode = 1;
    }
  }
  process.stdout.write(JSON.stringify({ summary }, null, 2) + '\n');
}

main();
