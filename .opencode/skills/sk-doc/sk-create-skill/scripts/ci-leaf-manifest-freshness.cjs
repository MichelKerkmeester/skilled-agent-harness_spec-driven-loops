#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ ci-leaf-manifest-freshness — fleet-wide generated-manifest drift gate     ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

/**
 * ci-leaf-manifest-freshness.cjs — CI freshness gate for generated
 * leaf-manifest.json artifacts across the whole skill fleet.
 *
 * Walks the skills tree for every committed leaf-manifest.json, regenerates each
 * from its on-disk packets via the existing generator (generate-leaf-manifest),
 * and fails (nonzero exit) on ANY byte drift — so a hand-edited manifest, a moved
 * or renamed leaf, or a stale committed baseline can never pass CI silently. This
 * is the same byte-compare `generate-leaf-manifest --check` runs, applied to
 * every manifest-bearing skill at once instead of one at a time.
 *
 * Usage:
 *   node .opencode/skills/sk-doc/sk-create-skill/scripts/ci-leaf-manifest-freshness.cjs
 *        [--skills-dir <dir>]   default: the repo .opencode/skills (resolved from
 *                               this file's location)
 *        [--format text|json]   default: text
 *
 * Exit codes (aligned with ci-skill-root-metadata):
 *   0  every committed leaf-manifest.json regenerates byte-identical
 *   1  one or more manifests are stale or failed to regenerate
 *   2  the gate could not run (skills dir missing or not a directory)
 *
 * To fix a stale manifest, re-run the generator for that skill:
 *   node .../generate-leaf-manifest.cjs --write <skillDir>
 */

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('fs');
const path = require('path');
const { buildManifestBytes } = require('./generate-leaf-manifest.cjs');
const contract = require('./lib/leaf-resource-contract.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function parseArgs(argv) {
  const args = { skillsDir: null, format: 'text' };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--skills-dir') { args.skillsDir = argv[i + 1]; i += 1; }
    else if (argv[i] === '--format') { args.format = argv[i + 1]; i += 1; }
  }
  return args;
}

// Recursively collect the directory of every committed leaf-manifest.json under
// skillsDir. node_modules and .git are skipped so a vendored copy can never
// enter the gate. Order is stable (sorted) for deterministic reporting.
function findManifestDirs(skillsDir) {
  const roots = [];
  const failures = [];
  const stack = [skillsDir];
  while (stack.length) {
    const cur = stack.pop();
    let entries;
    try {
      entries = fs.readdirSync(cur, { withFileTypes: true });
    } catch (err) {
      // Preserve attempted reads so omitted subtrees cannot produce a clean gate.
      failures.push({
        path: cur,
        code: err && err.code ? err.code : 'ERROR',
        message: err && err.message ? err.message : String(err),
      });
      continue;
    }
    for (const entry of entries) {
      if (entry.name === 'node_modules' || entry.name === '.git') continue;
      const full = path.join(cur, entry.name);
      if (entry.isDirectory()) { stack.push(full); continue; }
      if (entry.isFile() && entry.name === 'leaf-manifest.json') roots.push(cur);
    }
  }
  return {
    roots: [...new Set(roots)].sort(),
    failures: failures.sort((a, b) => a.path.localeCompare(b.path)),
  };
}

// Regenerate one skill's manifest and byte-compare against its committed file.
function checkOne(skillDir) {
  const committed = fs.readFileSync(path.join(skillDir, 'leaf-manifest.json'));
  let fresh;
  try {
    fresh = buildManifestBytes(skillDir);
  } catch (err) {
    return { skillDir, status: 'error', error: `${err.code || 'ERROR'}: ${err.message}` };
  }
  if (Buffer.compare(committed, fresh) === 0) {
    return { skillDir, status: 'fresh', digest: contract.digestManifestBytes(fresh) };
  }
  return {
    skillDir,
    status: 'stale',
    committed: contract.digestManifestBytes(committed),
    fresh: contract.digestManifestBytes(fresh),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

function run(args) {
  const skillsDir = path.resolve(args.skillsDir || path.resolve(__dirname, '..', '..', '..'));
  // Exit 2 == "cannot run" (bad input), aligned with ci-skill-root-metadata;
  // exit 1 stays reserved for a real stale/failed manifest. An existing
  // non-directory used to pass the existsSync check and report a false-green
  // zero-manifest success, so require a real directory here.
  let skillsStat;
  try {
    skillsStat = fs.statSync(skillsDir);
  } catch {
    skillsStat = null;
  }
  if (!skillsStat || !skillsStat.isDirectory()) {
    process.stderr.write(`ci-leaf-manifest-freshness: skills dir not found or not a directory: ${skillsDir}\n`);
    return 2;
  }
  const discovery = findManifestDirs(skillsDir);
  const results = discovery.roots.map(checkOne);
  const rel = (p) => path.relative(skillsDir, p) || '.';
  const manifestFailures = results.filter((r) => r.status !== 'fresh');
  const traversalFailures = discovery.failures.map((failure) => ({
    ...failure,
    path: rel(failure.path),
  }));
  const failed = manifestFailures.length + traversalFailures.length;

  if (args.format === 'json') {
    process.stdout.write(`${JSON.stringify({
      skillsDir,
      checked: results.length,
      fresh: results.length - manifestFailures.length,
      failed,
      results: results.map((r) => ({ ...r, skill: rel(r.skillDir) })),
      traversalFailures,
    }, null, 2)}\n`);
  } else {
    for (const r of results) {
      if (r.status === 'fresh') {
        process.stdout.write(`OK    ${rel(r.skillDir)}  ${r.digest}\n`);
      } else if (r.status === 'stale') {
        process.stdout.write(`STALE ${rel(r.skillDir)}  committed=${r.committed} fresh=${r.fresh}\n`);
      } else {
        process.stdout.write(`ERROR ${rel(r.skillDir)}  ${r.error}\n`);
      }
    }
    for (const failure of traversalFailures) {
      process.stdout.write(`ERROR ${failure.path}  traversal ${failure.code}: ${failure.message}\n`);
    }
    process.stdout.write(`\nchecked=${results.length} fresh=${results.length - manifestFailures.length} failed=${failed}\n`);
    if (manifestFailures.length) {
      process.stdout.write('Re-run `generate-leaf-manifest.cjs --write <skillDir>` for each STALE skill to regenerate.\n');
    }
  }
  return failed ? 1 : 0;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = { findManifestDirs, checkOne, run };

if (require.main === module) {
  process.exit(run(parseArgs(process.argv.slice(2))));
}
