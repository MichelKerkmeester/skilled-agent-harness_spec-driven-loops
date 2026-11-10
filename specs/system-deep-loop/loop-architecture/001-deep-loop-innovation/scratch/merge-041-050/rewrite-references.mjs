// Path-anchored reference rewrite for a packet-nesting merge.
//
// Why path-anchored: only strings carrying the `system-deep-loop/<slug>` prefix are rewritten, so branch
// names, session ids and bare slugs that merely mention a packet keep their history. Rewriting is
// idempotent because replacement targets never contain a prefixed old slug.
//
// Why a skip list: the packets' run records (research, review and scratch trees) are provenance, not
// documentation; a structural move rewrites no run record. They are reported, never edited.
//
// Usage:
//   node rewrite-references.mjs --dry-run     # write rewrite-plan.txt, change nothing
//   node rewrite-references.mjs --apply       # rewrite and write rewrite-applied.txt

import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const HERE = path.dirname(new URL(import.meta.url).pathname);
const REPO = path.resolve(HERE, '..', '..', '..', '..', '..');
const file = (name) => path.join(HERE, name);
const config = JSON.parse(readFileSync(file('mapping.json'), 'utf8'));

const mode = process.argv[2] === '--apply' ? 'apply' : 'dry-run';
const sha256 = (text) => createHash('sha256').update(text).digest('hex');

const detectors = config.packets.map(({ old, new: next }) => ({
  old,
  next,
  // `(specs/)?` keeps the scan blind to which prefix spelling a document used.
  pattern: new RegExp(`(specs/)?${old}(?![A-Za-z0-9_-])`, 'g'),
}));

function* walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (entry.isFile()) yield full;
  }
}

function isRunRecord(relPath) {
  return relPath.split(path.sep).some((segment) => config.skipPathSegments.includes(segment));
}

const plan = [];
const applied = [];
let scanned = 0;
let hitFiles = 0;
let replacements = 0;
let skippedWithHits = 0;

for (const root of config.scanRoots) {
  const absolute = path.join(REPO, root);
  let cursor;
  try {
    cursor = statSync(absolute);
  } catch {
    throw new Error(`scan root missing: ${root}`);
  }
  if (!cursor.isDirectory()) throw new Error(`scan root is not a directory: ${root}`);

  for (const full of walk(absolute)) {
    if (!config.extensions.includes(path.extname(full))) continue;
    scanned += 1;
    const rel = path.relative(REPO, full);
    const original = readFileSync(full, 'utf8');
    let text = original;
    const findings = [];

    for (const { old, next, pattern } of detectors) {
      pattern.lastIndex = 0;
      let match;
      while ((match = pattern.exec(text)) !== null) {
        findings.push({ old, next, prefix: match[1] ?? '' });
      }
      text = text.replace(pattern, (_m, prefix = '') => `${prefix}${next}`);
    }

    if (findings.length === 0) continue;
    hitFiles += 1;

    if (isRunRecord(rel)) {
      skippedWithHits += 1;
      plan.push(`SKIP  ${rel}  (${findings.length} hit(s) inside a run record; left as provenance)`);
      continue;
    }

    replacements += findings.length;
    for (const { old, next, prefix } of findings) {
      plan.push(`EDIT  ${rel}  ${prefix}${old}  ->  ${prefix}${next}`);
    }

    if (mode === 'apply' && text !== original) {
      writeFileSync(full, text, 'utf8');
      applied.push(`${rel}  ${sha256(original)} -> ${sha256(text)}  (${findings.length} replacement(s))`);
    } else if (mode === 'apply') {
      applied.push(`${rel}  unchanged (replacement was a no-op)`);
    }
  }
}

const header = [
  `mode: ${mode}`,
  `scanned md files: ${scanned}`,
  `files with hits: ${hitFiles}`,
  `files skipped as run records: ${skippedWithHits}`,
  `planned replacements: ${replacements}`,
  '',
];
writeFileSync(file('rewrite-plan.txt'), header.concat(plan, ['']).join('\n'));
if (mode === 'apply') writeFileSync(file('rewrite-applied.txt'), header.concat(applied, ['']).join('\n'));

console.log(`mode=${mode} scanned=${scanned} hitFiles=${hitFiles} skippedRunRecords=${skippedWithHits} replacements=${replacements}`);
