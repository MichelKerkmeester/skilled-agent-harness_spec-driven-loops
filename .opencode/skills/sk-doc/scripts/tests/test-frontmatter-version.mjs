#!/usr/bin/env node
// Unit/integration tests for frontmatter-version.mjs.
// Builds an isolated fixture skills-root, drives the engine via its CLI, and
// asserts derivation, insertion placement, idempotency, conflict handling, and
// trigger_phrases intactness. Run: node test_frontmatter_version.mjs

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const ENGINE = path.join(here, '..', 'frontmatter-version.mjs');

let pass = 0;
let fail = 0;
function ok(cond, msg) { if (cond) { pass += 1; } else { fail += 1; console.error(`  FAIL: ${msg}`); } }

// ─── build fixture tree ─────────────────────────────────────────
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'fmv-'));
const skillsRoot = path.join(tmp, 'skills');
const skill = path.join(skillsRoot, 'fixt-skill');
fs.mkdirSync(path.join(skill, 'changelog'), { recursive: true });
fs.mkdirSync(path.join(skill, 'references'), { recursive: true });
fs.mkdirSync(path.join(skill, 'assets'), { recursive: true });

// SKILL.md with a stale 3-part version; changelog is higher -> anchor 2.3.0.0
fs.writeFileSync(path.join(skill, 'SKILL.md'),
  '---\nname: fixt-skill\ndescription: A fixture skill for engine tests\nallowed-tools: [Read]\nversion: 2.1.0\n---\n# Fixt\n');
fs.writeFileSync(path.join(skill, 'changelog', 'v2.3.0.0.md'), '## [2.3.0.0]\n');
fs.writeFileSync(path.join(skill, 'changelog', 'v2.0.0.0.md'), '## [2.0.0.0]\n');

// README adjacent to SKILL.md (in scope), 3-field, no version
fs.writeFileSync(path.join(skill, 'README.md'),
  '---\ntitle: "fixt-skill"\ndescription: "Readme"\ntrigger_phrases:\n  - "fixt skill readme"\n---\n# Readme\n');

// 5-field reference, no version (trigger_phrases list must survive)
fs.writeFileSync(path.join(skill, 'references', 'ref-5field.md'),
  '---\ntitle: Ref Five Field\ndescription: A reference doc\ntrigger_phrases:\n  - "phrase one"\n  - "phrase two"\n  - "phrase three"\nimportance_tier: normal\ncontextType: general\n---\n# Ref\n');

// already-versioned correctly -> skip-equal
fs.writeFileSync(path.join(skill, 'references', 'ref-ok.md'),
  '---\ntitle: Ref OK\ndescription: Already versioned\ntrigger_phrases:\n  - "ok one"\n  - "ok two"\n  - "ok three"\nimportance_tier: normal\ncontextType: general\nversion: 2.3.0.0\n---\n# Ref OK\n');

// already-versioned with a conflicting human value -> skip-conflict (no --update)
fs.writeFileSync(path.join(skill, 'references', 'ref-conflict.md'),
  '---\ntitle: Ref Conflict\ndescription: Conflicting version\ntrigger_phrases:\n  - "c one"\n  - "c two"\n  - "c three"\nimportance_tier: normal\ncontextType: general\nversion: 9.9.9.9\n---\n# Ref Conflict\n');

// already-versioned with a 3-part value that normalizes to the SAME derived value ->
// must be canonicalized to 4-part even without --update (format-only normalization).
fs.writeFileSync(path.join(skill, 'references', 'ref-3part.md'),
  '---\ntitle: Ref 3part\ndescription: Three-part version\ntrigger_phrases:\n  - "tp one"\n  - "tp two"\n  - "tp three"\nimportance_tier: normal\ncontextType: general\nversion: 2.3.0\n---\n# Ref 3part\n');

// 2-field asset (playbook-leaf style), no version
fs.writeFileSync(path.join(skill, 'assets', 'asset-2field.md'),
  '---\ntitle: Asset Two Field\ndescription: A 2-field asset\n---\n# Asset\n');

// no frontmatter at all -> skip-no-frontmatter
fs.writeFileSync(path.join(skill, 'assets', 'plain.md'), '# Plain doc\nNo frontmatter here.\n');

// ─── helpers ────────────────────────────────────────────────────
function run(mode, extra = []) {
  return execFileSync('node', [ENGINE, mode, '--skills-root', skillsRoot, ...extra],
    { encoding: 'utf8' });
}
function manifest() {
  const out = path.join(tmp, 'man');
  run('compute', ['--manifest-out', out]);
  return JSON.parse(fs.readFileSync(`${out}.json`, 'utf8'));
}
function byName(rows, frag) { return rows.find((r) => r.path.endsWith(frag)); }

// ─── 1. compute: anchor reconciliation + normalization ──────────
let rows = manifest();
ok(byName(rows, 'fixt-skill/SKILL.md').derivedVersion === '2.3.0.0', 'SKILL.md anchor = max(2.1.0, changelog 2.3.0.0) = 2.3.0.0');
ok(byName(rows, 'fixt-skill/SKILL.md').anchorSource === 'max(fm,changelog)', 'anchorSource records max');
ok(byName(rows, 'references/ref-5field.md').derivedVersion === '2.3.0.0', 'child inherits 2.3.0.0 (W=0, untracked)');
ok(byName(rows, 'assets/asset-2field.md').derivedVersion === '2.3.0.0', '2-field asset inherits anchor');
ok(byName(rows, 'README.md').derivedVersion === '2.3.0.0', 'README inherits anchor');
ok(rows.length === 8, `discovers 8 in-scope files (got ${rows.length}); plain.md is discovered but skipped at apply (no frontmatter)`);

// ─── 2. apply (no --update) ─────────────────────────────────────
run('apply');
const skillMd = fs.readFileSync(path.join(skill, 'SKILL.md'), 'utf8');
ok(/^version: 2\.3\.0\.0$/m.test(skillMd), 'SKILL.md reconciled to 2.3.0.0');
ok(!skillMd.includes('version: 2.1.0\n'), 'old 2.1.0 removed from SKILL.md');

const ref5 = fs.readFileSync(path.join(skill, 'references', 'ref-5field.md'), 'utf8');
const lines = ref5.split('\n');
const closeIdx = lines.indexOf('---', 1);
ok(lines[closeIdx - 1] === 'version: 2.3.0.0', 'version inserted as LAST key before closing ---');
ok(ref5.includes('  - "phrase one"\n  - "phrase two"\n  - "phrase three"'), 'trigger_phrases array intact (not reflowed)');

const asset2 = fs.readFileSync(path.join(skill, 'assets', 'asset-2field.md'), 'utf8');
ok(/description: A 2-field asset\nversion: 2\.3\.0\.0\n---/.test(asset2), '2-field asset: version after description, before ---');

const conflict = fs.readFileSync(path.join(skill, 'references', 'ref-conflict.md'), 'utf8');
ok(conflict.includes('version: 9.9.9.9'), 'conflict file NOT overwritten without --update');

const ref3 = fs.readFileSync(path.join(skill, 'references', 'ref-3part.md'), 'utf8');
ok(/^version: 2\.3\.0\.0$/m.test(ref3) && !/^version: 2\.3\.0$/m.test(ref3), '3-part version canonicalized to 2.3.0.0 without --update');

const plain = fs.readFileSync(path.join(skill, 'assets', 'plain.md'), 'utf8');
ok(!plain.includes('version:'), 'no-frontmatter file left untouched (no synthesized block)');

// apply actions via a fresh manifest after apply
const applyOut = path.join(tmp, 'applyman');
run('apply', ['--manifest-out', applyOut]);
const arows = JSON.parse(fs.readFileSync(`${applyOut}.json`, 'utf8'));
ok(byName(arows, 'references/ref-ok.md').action === 'skip-equal', 'ref-ok -> skip-equal');
ok(byName(arows, 'references/ref-conflict.md').action === 'skip-conflict', 'ref-conflict -> skip-conflict');
ok(byName(arows, 'assets/plain.md').action === 'skip-no-frontmatter', 'plain.md -> skip-no-frontmatter');

// ─── 3. idempotency: second apply changes nothing ──────────────
const before = fs.readFileSync(path.join(skill, 'references', 'ref-5field.md'), 'utf8');
run('apply');
const after = fs.readFileSync(path.join(skill, 'references', 'ref-5field.md'), 'utf8');
ok(before === after, 'second apply is a byte-level no-op (idempotent)');

// ─── 4. verify: passes except the untouched conflict ───────────
let verifyExit = 0;
try { run('verify'); } catch (e) { verifyExit = e.status; }
ok(verifyExit === 1, 'verify exits 1 while the conflict file is still 9.9.9.9');

// ─── 5. --update resolves the conflict; verify then passes ─────
run('apply', ['--update']);
const conflict2 = fs.readFileSync(path.join(skill, 'references', 'ref-conflict.md'), 'utf8');
ok(conflict2.includes('version: 2.3.0.0') && !conflict2.includes('9.9.9.9'), '--update overwrites conflict to 2.3.0.0');
let verifyExit2 = 0;
try { run('verify'); } catch (e) { verifyExit2 = e.status; }
ok(verifyExit2 === 0, 'verify exits 0 after --update resolves the conflict');

// ─── cleanup + report ───────────────────────────────────────────
fs.rmSync(tmp, { recursive: true, force: true });
console.log(`\n${fail === 0 ? 'PASS' : 'FAIL'} — ${pass} passed, ${fail} failed`);
process.exit(fail === 0 ? 0 : 1);
