#!/usr/bin/env node
// Tests for frontmatter-version.mjs bump, the mode behind the pre-commit raise and the
// pull-request check. Each case runs the engine inside a throwaway git repository, so
// the staged blobs, the merge base and the working tree are all real.
// Run: node test-frontmatter-version-bump.mjs

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

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'fmv-bump-'));
const env = { ...process.env, GIT_CONFIG_GLOBAL: '/dev/null', GIT_CONFIG_NOSYSTEM: '1' };
for (const k of ['GIT_DIR', 'GIT_WORK_TREE', 'GIT_INDEX_FILE', 'GIT_CONFIG_COUNT']) delete env[k];

function git(...args) { return execFileSync('git', args, { cwd: tmp, env, encoding: 'utf8' }); }
function bump(...args) { return spawnSync('node', [ENGINE, 'bump', ...args], { cwd: tmp, env, encoding: 'utf8' }); }
function write(rel, text) { const f = path.join(tmp, rel); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, text); }
function read(rel) { return fs.readFileSync(path.join(tmp, rel), 'utf8'); }
function staged(rel) { return git('show', `:${rel}`); }
function doc(version, body, extra = '') {
  const v = version === null ? '' : `version: ${version}\n`;
  return `---\ntitle: Fixture\ndescription: A fixture doc${extra}\n${v}---\n# Fixture\n\n${body}\n`;
}

const REF = '.skilled/skills/fixt/references/ref.md';
const QUOTED = '.skilled/skills/fixt/references/quoted.md';
const SKILL = '.skilled/skills/fixt/SKILL.md';
const FIXTURE = '.skilled/skills/fixt/scripts/tests/fixtures/sample.md';

git('init', '-q', '-b', 'main');
git('config', 'user.email', 't@example.com');
git('config', 'user.name', 'test');
write(REF, doc('1.2.0.0', 'Original body.'));
write(QUOTED, doc('"1.2.0.0"', 'Original body.'));
write(SKILL, '---\nname: fixt\ndescription: Fixture skill\nversion: 1.0.0.0\n---\n# Fixt\n');
write(FIXTURE, doc('1.0.0.0', 'Fixture body.'));
git('add', '-A');
git('commit', '-qm', 'init');

// 1. a body change with no raise fails the check and names the one fix command
write(REF, doc('1.2.0.0', 'Changed body.'));
git('add', REF);
let r = bump('--check');
ok(r.status === 1, `check fails on an unraised body change (got ${r.status})`);
ok(/NOT RAISED .*ref\.md/.test(r.stderr), 'check names the doc');
ok(/Fix: node \S*frontmatter-version\.mjs bump --base HEAD/.test(r.stderr), 'check prints the fix command');

// 2. the raise writes the next edition, prints the path for staging, and the check then passes
r = bump();
ok(r.status === 0, `bump exits 0 (got ${r.status}: ${r.stderr})`);
ok(r.stdout.trim() === REF, `bump prints the raised path (got ${r.stdout.trim()})`);
ok(/^version: 1\.2\.1\.0$/m.test(read(REF)), 'body change raises the third segment and resets the fourth');
git('add', REF);
ok(bump('--check').status === 0, 'check passes once the raise is staged');
git('commit', '-qm', 'raise');

// 3. a frontmatter-only change raises nothing
write(REF, doc('1.2.1.0', 'Changed body.', ' with a new description'));
git('add', REF);
r = bump();
ok(r.status === 0 && r.stdout.trim() === '', 'a frontmatter-only change raises nothing');
ok(/^version: 1\.2\.1\.0$/m.test(read(REF)), 'version unchanged after a frontmatter-only change');
git('commit', '-qm', 'fm only');

// 4. a quoted value is raised in the same quoting
write(QUOTED, doc('"1.2.0.0"', 'Changed body.'));
git('add', QUOTED);
r = bump();
ok(/^version: "1\.2\.1\.0"$/m.test(read(QUOTED)), `quoted value keeps its quotes (got ${read(QUOTED).match(/^version:.*$/m)})`);
git('add', QUOTED);
git('commit', '-qm', 'quoted');

// 5. a new doc with no version starts at 1.0.0.0
const NEW = '.skilled/skills/fixt/assets/new.md';
write(NEW, doc(null, 'New body.'));
git('add', NEW);
r = bump();
ok(/^version: 1\.0\.0\.0$/m.test(read(NEW)), 'a new doc with no version gets 1.0.0.0');
ok(/^version: 1\.0\.0\.0\n---$/m.test(read(NEW)), 'the seeded version is the last frontmatter key');
git('add', NEW);
git('commit', '-qm', 'new');

// 6. a hand raise is left alone
write(REF, doc('2.0.0.0', 'Rewritten body.'));
git('add', REF);
r = bump();
ok(r.status === 0 && /^version: 2\.0\.0\.0$/m.test(read(REF)), 'a version already raised by hand is left alone');
git('commit', '-qm', 'hand');

// 7. a doc staged and unstaged at once is refused and nothing is written
write(REF, doc('2.0.0.0', 'Staged body.'));
git('add', REF);
write(REF, doc('2.0.0.0', 'Unstaged body.'));
r = bump();
ok(r.status === 3, `a partly staged doc is refused with exit 3 (got ${r.status})`);
ok(/STAGED AND UNSTAGED .*ref\.md/.test(r.stderr), 'the refusal names the doc');
ok(/^version: 2\.0\.0\.0$/m.test(read(REF)) && /^version: 2\.0\.0\.0$/m.test(staged(REF)), 'nothing was written');
write(REF, doc('2.0.0.0', 'Staged body.'));

// 8. a malformed version is not guessed at
write(QUOTED, doc('1.2', 'Another body.'));
git('add', QUOTED, REF);
r = bump();
ok(r.status === 1 && /malformed version '1\.2'/.test(r.stderr), `a malformed version blocks (got ${r.status})`);
ok(/^version: 1\.2$/m.test(read(QUOTED)), 'the malformed value is left for the author');
git('reset', '-q', '--hard');

// 9. SKILL.md, test fixtures and changelog entries are never raised
write(SKILL, '---\nname: fixt\ndescription: Fixture skill\nversion: 1.0.0.0\n---\n# Fixt changed\n');
write(FIXTURE, doc('1.0.0.0', 'Fixture changed.'));
write('.skilled/skills/fixt/changelog/v1.0.0.0.md', '# Changelog\n');
git('add', '-A');
r = bump();
ok(r.status === 0 && r.stdout.trim() === '', `SKILL.md, fixtures and changelog are out of scope (got ${r.stdout.trim()})`);
git('commit', '-qm', 'out of scope');

// 10. the pull-request form: a commit made without the raise fails against the branch base,
//     and the printed fix, run on the branch, raises against the merge base
git('checkout', '-q', '-b', 'feature');
write(REF, doc('2.0.0.0', 'Branch body.'));
git('add', REF);
git('commit', '-qm', 'unraised on a branch');
git('checkout', '-q', 'main');
write(QUOTED, doc('"1.2.1.0"', 'Main moved on.'));
git('add', QUOTED);
git('commit', '-qm', 'main change');
git('checkout', '-q', 'feature');
r = bump('--check', '--base', 'main');
ok(r.status === 1 && /NOT RAISED .*ref\.md/.test(r.stderr), 'the pull-request check fails on the unraised branch change');
ok(!/quoted\.md/.test(r.stderr), 'a doc only the base changed is not blamed on the branch');
ok(/bump --base main/.test(r.stderr), 'the fix names the same base');
r = bump('--base', 'main');
ok(r.status === 0 && /^version: 2\.0\.1\.0$/m.test(read(REF)), `the fix raises against the merge base (got ${read(REF).match(/^version:.*$/m)})`);
git('add', REF);
git('commit', '-qm', 'raised');
ok(bump('--check', '--base', 'main').status === 0, 'the pull-request check passes after the fix');

fs.rmSync(tmp, { recursive: true, force: true });
console.log(`\n${fail === 0 ? 'PASS' : 'FAIL'} - ${pass} passed, ${fail} failed`);
process.exit(fail === 0 ? 0 : 1);
