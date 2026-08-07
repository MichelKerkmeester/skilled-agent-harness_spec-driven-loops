#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────
// MODULE: Frozen-Scorer Contract
// ───────────────────────────────────────────────────────────────
//
// An activation or serving flip must never ride along with a scorer change:
// if the advisor's scoring surface moved since the last conscious freeze, the
// routing comparison that justified the ceremony is no longer measuring the
// same system, so the ceremony refuses to run. Reconstructed from its two
// call sites after the original module was found to have never been
// committed; unlike the original, the digest registry is a committed JSON
// file beside this module and re-freezing is an explicit CLI action, so the
// contract can never again exist only on one machine.
//
// Usage:
//   assertScorerFrozen(repoRoot, phaseLabel)  -> digest map, throws on drift
//   node frozen-scorer-contract.cjs --refreeze  # re-pin after a gated change

'use strict';

const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const PINS_PATH = path.join(__dirname, 'frozen-scorer-pins.json');
// The scoring surface: every TypeScript source under the advisor's scorer
// directory. Anything here changes ranking behavior; nothing else does at the
// granularity this contract protects.
const SCORER_DIR = path.join('.opencode', 'skills', 'system-skill-advisor', 'mcp-server', 'lib', 'scorer');

function sha256(filePath) {
  return crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
}

function listScorerFiles(repoRoot) {
  const root = path.join(repoRoot, SCORER_DIR);
  const out = [];
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const abs = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name === '__tests__') continue;
        walk(abs);
      } else if (entry.name.endsWith('.ts')) {
        out.push(path.relative(repoRoot, abs).split(path.sep).join('/'));
      }
    }
  };
  walk(root);
  return out.sort();
}

function currentDigests(repoRoot) {
  return Object.fromEntries(listScorerFiles(repoRoot).map((rel) => (
    [rel, sha256(path.join(repoRoot, rel))]
  )));
}

/**
 * Assert the scorer surface matches the committed freeze pins.
 *
 * @param {string} repoRoot - Absolute repository root.
 * @param {string} phaseLabel - Human label for the operation being gated.
 * @returns {Object} The verified digest map.
 */
function assertScorerFrozen(repoRoot, phaseLabel) {
  if (!fs.existsSync(PINS_PATH)) {
    throw new Error(
      `scorer freeze pins missing (${PINS_PATH}); run this module with --refreeze before ${phaseLabel}`,
    );
  }
  const pinned = JSON.parse(fs.readFileSync(PINS_PATH, 'utf8')).files || {};
  const current = currentDigests(repoRoot);
  const drifted = [];
  for (const rel of new Set([...Object.keys(pinned), ...Object.keys(current)])) {
    if (pinned[rel] !== current[rel]) drifted.push(rel);
  }
  if (drifted.length > 0) {
    throw new Error(
      `scorer surface changed since the freeze — re-freeze consciously before ${phaseLabel}: ${drifted.join(', ')}`,
    );
  }
  return current;
}

function refreeze(repoRoot) {
  const files = currentDigests(repoRoot);
  fs.writeFileSync(PINS_PATH, `${JSON.stringify({
    note: 'Conscious scorer-surface freeze. Re-pin only after the routing gate battery is green on the new scorer.',
    frozenAt: new Date().toISOString(),
    files,
  }, null, 2)}\n`);
  return files;
}

module.exports = { assertScorerFrozen, refreeze };

function findRepoRoot(start) {
  let current = start;
  for (let i = 0; i < 12; i += 1) {
    if (fs.existsSync(path.join(current, '.opencode', 'skills'))) return current;
    const parent = path.dirname(current);
    if (parent === current) break;
    current = parent;
  }
  throw new Error(`repository root not found above ${start}`);
}

if (require.main === module) {
  const repoRoot = findRepoRoot(__dirname);
  if (process.argv.includes('--refreeze')) {
    const files = refreeze(repoRoot);
    process.stdout.write(`frozen ${Object.keys(files).length} scorer files -> ${PINS_PATH}\n`);
  } else {
    assertScorerFrozen(repoRoot, 'a manual check');
    process.stdout.write('scorer surface matches the freeze pins\n');
  }
}
