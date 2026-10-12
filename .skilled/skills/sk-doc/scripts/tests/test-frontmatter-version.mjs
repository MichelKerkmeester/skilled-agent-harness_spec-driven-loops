#!/usr/bin/env node
// Unit/integration tests for frontmatter-version.mjs.
// Builds an isolated fixture skills-root, drives the engine via its CLI, and
// asserts the per-doc contract: SKILL.md reconciles to its anchor, every other
// in-scope doc carries its own valid version, verify fails a doc with none, and
// test input and generated output stay out of scope.
// Run: node test-frontmatter-version.mjs

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const ENGINE = process.env.FMV_ENGINE || path.join(here, '..', 'frontmatter-version.mjs');

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
fs.mkdirSync(path.join(skill, 'scripts', 'tests', 'fixtures', 'references'), { recursive: true });
fs.mkdirSync(path.join(skill, 'runtime', 'lib'), { recursive: true });
fs.mkdirSync(path.join(skill, 'runtime', 'feature-catalog'), { recursive: true });
fs.mkdirSync(packet, { recursive: true });

// SKILL.md with a stale 3-part version; changelog is higher -> anchor 2.3.0.0
fs.writeFileSync(path.join(skill, 'SKILL.md'),
  '---\nname: fixt-skill\ndescription: A fixture skill for engine tests\nallowed-tools: [Read]\nversion: 2.1.0\n---\n# Fixt\n');
fs.writeFileSync(path.join(skill, 'changelog', 'v2.3.0.0.md'), '## [2.3.0.0]\n');
fs.writeFileSync(path.join(skill, 'changelog', 'v2.0.0.0.md'), '## [2.0.0.0]\n');

// Mode-packet SKILL.md with no changelog -> its own frontmatter-only anchor
fs.writeFileSync(path.join(packet, 'SKILL.md'),
  '---\nname: fixt-mode\ndescription: A fixture mode packet\nversion: 1.4.0.0\n---\n# Mode\n');

// In-scope child docs, each with its own edition or none yet.
const README = path.join(skill, 'README.md');
const REF = path.join(skill, 'references', 'ref-5field.md');
const OWN = path.join(skill, 'references', 'ref-own.md');
const ASSET = path.join(skill, 'assets', 'asset-2field.md');
const SCENARIO = path.join(skill, 'manual-testing-playbook', 'routing', 'route.md');
const RUNTIME_CATALOG = path.join(skill, 'runtime', 'feature-catalog', 'entry.md');
fs.writeFileSync(README, '---\ntitle: "fixt-skill"\ndescription: "Readme"\n---\n# Readme\n');
fs.writeFileSync(REF,
  '---\ntitle: Ref Five Field\ndescription: A reference doc\ntrigger_phrases:\n  - "phrase one"\nimportance_tier: normal\ncontextType: general\n---\n# Ref\n');
fs.writeFileSync(OWN,
  '---\ntitle: Ref Own\ndescription: A doc with its own edition\nversion: 9.9.9.9\n---\n# Ref Own\n');
fs.writeFileSync(ASSET, '---\ntitle: Asset Two Field\ndescription: A 2-field asset\n---\n# Asset\n');
fs.writeFileSync(SCENARIO, '---\ntitle: Route\ndescription: A scenario\nversion: 1.0.0\n---\n# Route\n');
fs.writeFileSync(RUNTIME_CATALOG, '---\ntitle: Runtime Catalog\ndescription: A catalog entry under runtime\n---\n# Entry\n');

// Out of scope: test input and runtime internals keep whatever they carry.
const FIXTURE = path.join(skill, 'scripts', 'tests', 'fixtures', 'references', 'fixture.md');
const RUNTIME_README = path.join(skill, 'runtime', 'lib', 'README.md');
fs.writeFileSync(FIXTURE, '---\ntitle: Fixture\ndescription: Test input\n---\n# Fixture\n');
fs.writeFileSync(RUNTIME_README, '---\ntitle: Runtime lib\ndescription: Runtime internals\n---\n# Lib\n');
const outBefore = new Map([FIXTURE, RUNTIME_README].map((f) => [f, fs.readFileSync(f, 'utf8')]));

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
function versionOf(f) { return (fs.readFileSync(f, 'utf8').match(/^version: (.*)$/m) || [])[1]; }
function outOfScopeUnchanged() {
  return [...outBefore].every(([f, text]) => fs.readFileSync(f, 'utf8') === text);
}

// ─── 1. compute: SKILL.md and every in-scope child doc ──────────
const rows = manifest();
ok(rows.length === 8, `discovers the 2 SKILL.md files and 6 child docs (got ${rows.length})`);
ok(!byName(rows, 'fixture.md') && !byName(rows, 'lib/README.md'), 'test input and runtime internals are not discovered');
ok(byName(rows, 'entry.md') !== undefined, 'a catalog under a runtime folder stays in scope');
ok(byName(rows, 'fixt-skill/SKILL.md').derivedVersion === '2.3.0.0', 'SKILL.md anchor = max(2.1.0, changelog 2.3.0.0) = 2.3.0.0');
ok(byName(rows, 'fixt-skill/SKILL.md')?.anchorSource === 'max(fm,changelog)', 'anchorSource records max');
ok(byName(rows, 'fixt-mode/SKILL.md').derivedVersion === '1.4.0.0', 'mode-packet SKILL.md resolves its own anchor');
ok(byName(rows, 'ref-own.md')?.derivedVersion === '9.9.9.9', 'a child doc keeps its own edition, not the skill anchor');
ok(byName(rows, 'ref-5field.md')?.derivedVersion === '1.0.0.0', 'a child doc with no version starts at 1.0.0.0');
ok(rows.every((r) => !('realEditCount' in r)), 'manifest rows carry no per-doc build count');

// ─── 2. verify and gate fail a child doc with no version ───────
const verifyBefore = runStatus('verify');
ok(verifyBefore.status === 1, `verify exits 1 while a child doc has no version (got ${verifyBefore.status})`);
ok(/ref-5field\.md -> missing-version/.test(verifyBefore.stderr), 'verify names the doc with no version');
ok(/route\.md -> malformed:1\.0\.0/.test(verifyBefore.stderr), 'verify fails a 3-part child version');
const gateBefore = runStatus('gate');
ok(gateBefore.status === 1 && /MISSING version: .*asset-2field\.md/.test(gateBefore.stderr), 'gate fails a child doc with no version');

// ─── 3. apply seeds 1.0.0.0, keeps an own edition, reconciles SKILL.md ──
run('apply');
ok(/^version: 2\.3\.0\.0$/m.test(fs.readFileSync(path.join(skill, 'SKILL.md'), 'utf8')), 'SKILL.md reconciled to 2.3.0.0');
ok(versionOf(REF) === '1.0.0.0' && versionOf(ASSET) === '1.0.0.0' && versionOf(README) === '1.0.0.0', 'apply seeds 1.0.0.0 on child docs with none');
ok(versionOf(SCENARIO) === '1.0.0.0', 'apply normalizes a 3-part child version to 4 parts');
ok(versionOf(OWN) === '9.9.9.9', 'apply keeps a child doc\'s own edition');
ok(/^version: 1\.0\.0\.0\n---$/m.test(fs.readFileSync(REF, 'utf8')), 'the seeded version is the last frontmatter key');
ok(outOfScopeUnchanged(), 'apply leaves test input and runtime internals byte-identical');

// ─── 4. idempotency, then verify and gate pass ─────────────────
const snapshot = () => [path.join(skill, 'SKILL.md'), REF, OWN, ASSET, SCENARIO, README].map((f) => fs.readFileSync(f, 'utf8')).join('\0');
const once = snapshot();
run('apply', ['--update']);
ok(snapshot() === once, 'second apply is a byte-level no-op');
ok(runStatus('verify').status === 0, 'verify exits 0 once every in-scope doc carries a version');
const gate = runStatus('gate');
ok(gate.status === 0 && /^\[gate\] 8 files/m.test(gate.stdout), `gate checks the 8 in-scope docs (got ${gate.stdout.trim()})`);

// ─── 5. explicit targets: a child doc is accepted, test input is refused ──
const pathsFile = path.join(tmp, 'paths.txt');
fs.writeFileSync(pathsFile, `${REF}\n`);
ok(runStatus('verify', ['--paths', pathsFile]).status === 0, 'an explicit child-doc target is verified');
fs.writeFileSync(pathsFile, `${FIXTURE}\n`);
const explicit = runStatus('verify', ['--paths', pathsFile]);
ok(explicit.status !== 0 && /outside the versioned document scope/.test(explicit.stderr),
  'an explicit test-input target is refused as out of scope');

// ─── 5b. a leading zero reads as its tuple, an empty key is malformed ──
const LEAD = path.join(skill, 'references', 'ref-lead.md');
fs.writeFileSync(LEAD, '---\ntitle: Lead\ndescription: Leading zero\nversion: 01.2.0.0\n---\n# Lead\n');
fs.writeFileSync(pathsFile, `${LEAD}\n`);
ok(runStatus('verify', ['--paths', pathsFile]).status === 0, 'verify accepts a leading-zero version equal to its tuple');
runStatus('apply', ['--paths', pathsFile]);
ok(versionOf(LEAD) === '1.2.0.0', `apply writes the canonical form (got ${versionOf(LEAD)})`);
const EMPTY = path.join(skill, 'references', 'ref-empty.md');
fs.writeFileSync(EMPTY, '---\ntitle: Empty\ndescription: Empty key\nversion:\n---\n# Empty\n');
fs.writeFileSync(pathsFile, `${EMPTY}\n`);
const emptyRun = runStatus('verify', ['--paths', pathsFile]);
ok(emptyRun.status === 1 && /ref-empty\.md -> malformed/.test(emptyRun.stderr), `verify reports an empty version as malformed (got ${emptyRun.stderr.trim()})`);
fs.rmSync(LEAD);
fs.rmSync(EMPTY);

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
console.log(`\n${fail === 0 ? 'PASS' : 'FAIL'} - ${pass} passed, ${fail} failed`);
process.exit(fail === 0 ? 0 : 1);
