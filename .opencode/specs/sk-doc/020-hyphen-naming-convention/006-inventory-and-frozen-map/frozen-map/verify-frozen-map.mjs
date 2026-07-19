#!/usr/bin/env node
// Independent verifier for the frozen rename map artifact.
//
// The map is the single executable source of truth for every rename in the later
// phases, so its invariants are re-checked here against the live worktree rather
// than trusted from the builder. Run from the repo root:
//   node <thisfile> [path-to-frozen-rename-map.json]
// Exits non-zero on any violation.

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const ROOT = execFileSync('git', ['rev-parse', '--show-toplevel'], { encoding: 'utf8' }).trim();
const TIP = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
const mapPath = process.argv[2]
  || path.join(ROOT, '.opencode/specs/sk-doc/020-hyphen-naming-convention/006-inventory-and-frozen-map/frozen-map/frozen-rename-map.json');

const map = JSON.parse(fs.readFileSync(mapPath, 'utf8'));
const entries = map.entries || [];
const onDisk = (p) => { try { fs.lstatSync(path.join(ROOT, p)); return true; } catch { return false; } };

const v = { baseShaMismatch: 0, existenceFlag: 0, diskRecheck: 0, bothPresent: 0, bothAbsent: 0, dupTarget: 0, observedShaMismatch: 0, snakeTarget: 0, unknownClass: 0 };
if (map.base_sha !== TIP) v.baseShaMismatch = 1;

const CLASSES = new Set(['rename', 'exempt', 'frozen', 'generated', 'tool-mandated']);
const seenTargets = new Map();
let pending = 0, applied = 0;

for (const x of entries) {
  if (!CLASSES.has(x.classification)) v.unknownClass++;
  if (x.observed_at_sha && x.observed_at_sha !== TIP) v.observedShaMismatch++;
  if (x.classification !== 'rename') continue;

  const { source: s, target: t } = x;
  if (x.disposition === 'pending') {
    pending++;
    if (!(x.source_exists === true && x.target_exists === false)) v.existenceFlag++;
    if (onDisk(s) !== true || onDisk(t) !== false) v.diskRecheck++;
  } else if (x.disposition === 'already-applied') {
    applied++;
    if (!(x.source_exists === false && x.target_exists === true)) v.existenceFlag++;
    if (onDisk(s) !== false || onDisk(t) !== true) v.diskRecheck++;
  }
  if (x.source_exists && x.target_exists) v.bothPresent++;
  if (!x.source_exists && !x.target_exists) v.bothAbsent++;
  if (t) {
    if (seenTargets.has(t)) v.dupTarget++;
    seenTargets.set(t, 1);
    const b = path.basename(t);
    // A migrated target keeps kebab-case; Python filenames stay snake by exemption.
    if (/[a-z0-9]_[a-z0-9]/.test(b) && !b.endsWith('.py')) v.snakeTarget++;
  }
}

const total = Object.values(v).reduce((a, b) => a + b, 0);
console.log(`map: ${path.relative(ROOT, mapPath)}`);
console.log(`tip: ${TIP}  base_sha_matches: ${map.base_sha === TIP}`);
console.log(`entries: ${entries.length}  rename_pending: ${pending}  already_applied: ${applied}`);
console.log(`violations: ${JSON.stringify(v)}`);
console.log(total === 0 ? 'RESULT: PASS' : 'RESULT: FAIL');
process.exit(total === 0 ? 0 : 1);
