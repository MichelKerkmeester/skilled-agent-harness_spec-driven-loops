#!/usr/bin/env node
// Unit/integration tests for frontmatter-version.mjs.
// Builds an isolated fixture skills-root, drives the engine via its CLI, and
// asserts that only SKILL.md is versioned: anchor reconciliation, idempotency,
// and that child docs are neither discovered, written, verified nor gated.
// Run: node test-frontmatter-version.mjs

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
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
const packet = path.join(skill, 'fixt-mode');
fs.mkdirSync(path.join(skill, 'changelog'), { recursive: true });
fs.mkdirSync(path.join(skill, 'references'), { recursive: true });
fs.mkdirSync(path.join(skill, 'assets'), { recursive: true });
fs.mkdirSync(path.join(skill, 'manual-testing-playbook', 'routing'), { recursive: true });
fs.mkdirSync(packet, { recursive: true });

// SKILL.md with a stale 3-part version; changelog is higher -> anchor 2.3.0.0
fs.writeFileSync(path.join(skill, 'SKILL.md'),
  '---\nname: fixt-skill\ndescription: A fixture skill for engine tests\nallowed-tools: [Read]\nversion: 2.1.0\n---\n# Fixt\n');
fs.writeFileSync(path.join(skill, 'changelog', 'v2.3.0.0.md'), '## [2.3.0.0]\n');
fs.writeFileSync(path.join(skill, 'changelog', 'v2.0.0.0.md'), '## [2.0.0.0]\n');

// Mode-packet SKILL.md with no changelog -> its own frontmatter-only anchor
fs.writeFileSync(path.join(packet, 'SKILL.md'),
  '---\nname: fixt-mode\ndescription: A fixture mode packet\nversion: 1.4.0.0\n---\n# Mode\n');

// Child docs: none of them may be discovered, written, verified or gated.
const README = path.join(skill, 'README.md');
const REF = path.join(skill, 'references', 'ref-5field.md');
const CONFLICT = path.join(skill, 'references', 'ref-conflict.md');
const ASSET = path.join(skill, 'assets', 'asset-2field.md');
const SCENARIO = path.join(skill, 'manual-testing-playbook', 'routing', 'route.md');
fs.writeFileSync(README, '---\ntitle: "fixt-skill"\ndescription: "Readme"\n---\n# Readme\n');
fs.writeFileSync(REF,
  '---\ntitle: Ref Five Field\ndescription: A reference doc\ntrigger_phrases:\n  - "phrase one"\nimportance_tier: normal\ncontextType: general\n---\n# Ref\n');
fs.writeFileSync(CONFLICT,
  '---\ntitle: Ref Conflict\ndescription: A stale child version\nversion: 9.9.9.9\n---\n# Ref Conflict\n');
fs.writeFileSync(ASSET, '---\ntitle: Asset Two Field\ndescription: A 2-field asset\n---\n# Asset\n');
fs.writeFileSync(SCENARIO, '---\ntitle: Route\ndescription: A scenario\nversion: 1.0.0\n---\n# Route\n');
const childBefore = new Map([README, REF, CONFLICT, ASSET, SCENARIO].map((f) => [f, fs.readFileSync(f, 'utf8')]));

// ─── helpers ────────────────────────────────────────────────────
function run(mode, extra = []) {
  return execFileSync('node', [ENGINE, mode, '--skills-root', skillsRoot, ...extra], { encoding: 'utf8' });
}
function runStatus(mode, extra = []) {
  return spawnSync('node', [ENGINE, mode, '--skills-root', skillsRoot, ...extra], { encoding: 'utf8' });
}
function manifest() {
  const out = path.join(tmp, 'man');
  run('compute', ['--manifest-out', out]);
  return JSON.parse(fs.readFileSync(`${out}.json`, 'utf8'));
}
function byName(rows, frag) { return rows.find((r) => r.path.endsWith(frag)); }
function childrenUnchanged() {
  return [...childBefore].every(([f, text]) => fs.readFileSync(f, 'utf8') === text);
}

// ─── 1. compute: only SKILL.md files are in scope ───────────────
const rows = manifest();
ok(rows.length === 2, `discovers only the 2 SKILL.md files (got ${rows.length})`);
ok(rows.every((r) => r.fileClass === 'skill-md'), 'every discovered row is classed skill-md');
ok(byName(rows, 'fixt-skill/SKILL.md').derivedVersion === '2.3.0.0', 'SKILL.md anchor = max(2.1.0, changelog 2.3.0.0) = 2.3.0.0');
ok(byName(rows, 'fixt-skill/SKILL.md').anchorSource === 'max(fm,changelog)', 'anchorSource records max');
ok(byName(rows, 'fixt-mode/SKILL.md').derivedVersion === '1.4.0.0', 'mode-packet SKILL.md resolves its own anchor');
ok(rows.every((r) => !('realEditCount' in r)), 'manifest rows carry no per-doc build count');
const csvHeader = fs.readFileSync(path.join(tmp, 'man.csv'), 'utf8').split('\n')[0];
ok(!csvHeader.split(',').includes('realEditCount'), `manifest CSV has no realEditCount column (got ${csvHeader})`);

// ─── 2. apply reconciles SKILL.md and writes no child doc ───────
run('apply');
const skillMd = fs.readFileSync(path.join(skill, 'SKILL.md'), 'utf8');
ok(/^version: 2\.3\.0\.0$/m.test(skillMd), 'SKILL.md reconciled to 2.3.0.0');
ok(childrenUnchanged(), 'apply leaves every child doc byte-identical');

// ─── 3. idempotency: second apply changes nothing ──────────────
const before = fs.readFileSync(path.join(skill, 'SKILL.md'), 'utf8');
run('apply', ['--update']);
ok(fs.readFileSync(path.join(skill, 'SKILL.md'), 'utf8') === before, 'second apply is a byte-level no-op');
ok(childrenUnchanged(), 'apply --update still leaves every child doc byte-identical');

// ─── 4. verify and gate ignore child docs ──────────────────────
const verify = runStatus('verify');
ok(verify.status === 0, `verify exits 0 while a child doc still carries a stale 9.9.9.9 (got ${verify.status})`);
const gate = runStatus('gate');
ok(gate.status === 0, `gate exits 0 while child docs carry no version (got ${gate.status})`);
ok(/^\[gate\] 2 files/m.test(gate.stdout), `gate checks only the 2 SKILL.md files (got ${gate.stdout.trim()})`);

// ─── 5. an explicit child target is refused ─────────────────────
const pathsFile = path.join(tmp, 'paths.txt');
fs.writeFileSync(pathsFile, `${REF}\n`);
const explicit = runStatus('verify', ['--paths', pathsFile]);
ok(explicit.status !== 0 && /outside the versioned document scope/.test(explicit.stderr),
  'an explicit child-doc target is refused as out of scope');

// ─── 6. --help in the positional slot ──────────────────────────
// The mode is positional, so a lone --help lands where the mode is read from.
// It must answer as help rather than become a mode name, and it must answer
// without walking git history first, which is why no skills-root is passed.
let helpExit = 0;
let helpOut = '';
try {
  helpOut = execFileSync('node', [ENGINE, '--help'], { encoding: 'utf8' });
} catch (e) {
  helpExit = e.status;
  helpOut = String(e.stdout || '');
}
ok(helpExit === 0, 'lone --help exits 0');
ok(helpOut.startsWith('frontmatter-version.mjs'), 'lone --help prints the usage text');

// ─── cleanup + report ───────────────────────────────────────────
fs.rmSync(tmp, { recursive: true, force: true });
console.log(`\n${fail === 0 ? 'PASS' : 'FAIL'} — ${pass} passed, ${fail} failed`);
process.exit(fail === 0 ? 0 : 1);
