#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Shipped Instruction Check Engine Tests
// ───────────────────────────────────────────────────────────────────
'use strict';

// The check engine answers one question per repository: what do we hold against what
// was shipped, and what would be lost by replacing it. Its whole value is that the
// answer is trustworthy in a repository nobody inspected, so this suite proves each
// answer on a synthetic repository carrying exactly one shape of drift, and proves the
// run itself leaves the tree untouched.
//
// Every fixture is composed from the manifest's derived bodies into a throwaway
// directory, never committed and never read twice. A fixture is therefore a statement
// about the manifest that ships today rather than a snapshot of the template at the
// time the fixture was written: refreshing a released body refreshes every fixture in
// the same edit, and a fixture cannot describe a template the manifest does not ship.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS AND PATHS
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const crypto = require('node:crypto');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const { buildReport, main } = require('../agents-md-check.cjs');
const { segment } = require('../lib/agents-md-sections.cjs');

const SCRIPTS_DIR = path.resolve(__dirname, '..');
const REPO_ROOT = path.resolve(SCRIPTS_DIR, '../../../..');
const ENGINE = path.join(SCRIPTS_DIR, 'agents-md-check.cjs');
const MANIFEST_PATH = path.join(SCRIPTS_DIR, '../assets/agents-md-manifest.json');
const FIXTURES = path.join(__dirname, 'fixtures/agents-md');
const POINTER_SYNC = path.join(
  REPO_ROOT,
  '.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-gate1-pointers.cjs',
);

const { TARGETS, applyBlock, readGateOneLine, renderBlock } = require(POINTER_SYNC);

const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));

// The rows every report carries, in the order the engine prints them.
const ROWS = ['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'A9', 'A10', 'A11', 'A12'];

// ─────────────────────────────────────────────────────────────────────────────
// 2. FIXTURE COMPOSER
// ─────────────────────────────────────────────────────────────────────────────

function loadRecipe(name) {
  return JSON.parse(fs.readFileSync(path.join(FIXTURES, name, 'fixture.json'), 'utf8'));
}

function derivedBody(id) {
  const entry = manifest.derived.sections[id];
  assert.ok(entry, `the manifest's derived key holds section ${id}`);
  return entry.body;
}

// The older body the manifest's release history holds for one section, found by the
// heading the body opens with rather than by a tag, so the fixture names a section and
// the history decides which released wording stands in for it.
function historyBody(id) {
  const entry = manifest.sections.find((row) => row.id === id);
  assert.ok(entry, `the manifest declares section ${id}`);
  const hit = manifest.derived.history.find((row) => row.body.split('\n')[0].includes(entry.match));
  assert.ok(hit, `the manifest's history holds an older body for ${id}`);
  return hit.body;
}

// A local line belongs inside the section it was written into, ahead of the divider that
// closes it, so the fixture reads like an edit somebody made rather than a line appended
// after the rule.
function insertIntoSection(body, line) {
  const divider = body.lastIndexOf('\n---\n');
  if (divider === -1) return `${body}${line}\n`;
  return `${body.slice(0, divider)}\n${line}\n${body.slice(divider)}`;
}

function composeDocument(recipe) {
  if (recipe.base === 'none') return null;
  if (recipe.base === 'own') return recipe.own_document;

  const parts = [];
  for (const entry of manifest.sections) {
    let body = (recipe.replace_with_history || []).includes(entry.id)
      ? historyBody(entry.id)
      : derivedBody(entry.id);
    for (const line of (recipe.section_edits || {})[entry.id] || []) {
      body = insertIntoSection(body, line);
    }
    for (const row of recipe.insert_sections || []) {
      if (row.before === entry.id) parts.push(row.text);
    }
    parts.push(body);
  }
  return parts.join('');
}

function blockText(recipe) {
  const { markers } = manifest;
  return `\n${markers.heading}\n\n${markers.note}\n${recipe.block.text || ''}`.trimEnd();
}

function composeDocumentWithBlock(recipe) {
  const shipped = composeDocument(recipe);
  if (!recipe.block) return shipped;

  const { markers } = manifest;
  if (recipe.block.markers === 'reversed') {
    const filler = Array.from(
      { length: recipe.block.pad_lines || 0 },
      (_, index) => `${String(index + 1).padStart(2, '0')}. A repository note kept out of the shipped sections.`,
    ).join('\n');
    return `${shipped}${markers.end}\n${filler}\n${markers.start}\n`;
  }
  return `${shipped}${markers.start}\n${blockText(recipe)}\n${markers.end}\n`;
}

// The Cursor rule every runtime mirror is generated from. Writing it with the sync's own
// renderer is what makes the fixture a repository that has run the generator, instead of
// one carrying a hand-copied block that would only prove the copy.
function writePointerMirror(dir) {
  const line = readGateOneLine(dir);
  if (!line) return;
  const target = path.join(dir, TARGETS[0].file);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, applyBlock('', renderBlock(TARGETS[0].intro, line)), 'utf8');
}

// Devin never sees past the delivery prefix of the root document, so a repository with a
// non-empty block is expected to carry the generated mirror of it.
function writeRepoLocalMirror(dir, recipe) {
  if (!recipe.block || recipe.block.markers === 'reversed') return;
  const target = path.join(dir, '.cursor/rules/repo-local.md');
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, `---\nalwaysApply: true\n---\n${blockText(recipe)}\n`, 'utf8');
}

// The tree a recipe describes: the root document, the files the recipe adds, and the two
// runtime mirrors a repository that ran its generators would carry.
function materialize(dir, recipe) {
  fs.mkdirSync(dir, { recursive: true });
  const document = composeDocumentWithBlock(recipe);
  if (document !== null) fs.writeFileSync(path.join(dir, manifest.root_file), document, 'utf8');
  for (const [relative, content] of Object.entries(recipe.files || {})) {
    const target = path.join(dir, relative);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, content, 'utf8');
  }
  writePointerMirror(dir);
  writeRepoLocalMirror(dir, recipe);
}

// Every file under a tree that the recipe is responsible for, as relative path to bytes.
// The recipe itself is not part of the tree a repository would hold.
function treeFiles(dir, { skip = [] } = {}) {
  const files = new Map();
  const walk = (current) => {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const target = path.join(current, entry.name);
      const relative = path.relative(dir, target).split(path.sep).join('/');
      if (skip.includes(relative)) continue;
      if (entry.isDirectory()) walk(target);
      else files.set(relative, fs.readFileSync(target));
    }
  };
  walk(dir);
  return files;
}

function fixtureNames() {
  return fs.readdirSync(FIXTURES).sort();
}

// The committed fixture is the artifact a reader opens and the path every command in the
// packet names, while every engine run happens on a throwaway copy of it. The recipe and
// this composer stay in the suite so the committed tree is derived, never hand-written:
// the freshness case below recomposes it and fails when the manifest moved underneath.
const REWRITE = process.env.AGENTS_MD_FIXTURE_WRITE === '1';

function buildFixture(t, name) {
  const parent = fs.mkdtempSync(path.join(os.tmpdir(), `agents-md-check-${name}-`));
  t.after(() => fs.rmSync(parent, { recursive: true, force: true }));
  const dir = path.join(parent, name);
  fs.cpSync(path.join(FIXTURES, name), dir, {
    recursive: true,
    filter: (from) => path.basename(from) !== 'fixture.json',
  });
  const documentPath = path.join(dir, manifest.root_file);
  return {
    dir,
    recipe: loadRecipe(name),
    document: fs.existsSync(documentPath) ? fs.readFileSync(documentPath, 'utf8') : null,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. RUNNERS AND READERS
// ─────────────────────────────────────────────────────────────────────────────

function runCheck(args) {
  const result = spawnSync(process.execPath, [ENGINE, ...args], { encoding: 'utf8' });
  return { code: result.status, out: result.stdout || '', err: result.stderr || '' };
}

function runJson(args) {
  const run = runCheck([...args, '--json']);
  let report = null;
  try {
    report = JSON.parse(run.out);
  } catch {
    report = null;
  }
  return { ...run, report };
}

function rowOf(report, id) {
  const row = report.rows.find((entry) => entry.id === id);
  assert.ok(row, `the report carries row ${id}`);
  return row;
}

// The text form prints one line per row, ending in the row's verdict, so the two
// renderers can be compared without re-implementing either.
function textRowStates(out) {
  const states = {};
  for (const line of out.split('\n')) {
    const hit = /^(A\d+) .*\((PASS|FINDING|UNKNOWN|INFO)\)$/.exec(line);
    if (hit) states[hit[1]] = hit[2];
  }
  return states;
}

function listFiles(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const target = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...listFiles(target));
    else files.push(target);
  }
  return files;
}

function treeDigest(dir) {
  const hash = crypto.createHash('sha256');
  for (const file of listFiles(dir).sort()) {
    hash.update(path.relative(dir, file));
    hash.update(fs.readFileSync(file));
  }
  return hash.digest('hex');
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. THE FIXTURES DESCRIBE THE MANIFEST THAT SHIPS TODAY
// ─────────────────────────────────────────────────────────────────────────────

test('the committed fixtures are what the recipes derive from the manifest today', (t) => {
  const drift = [];
  for (const name of fixtureNames()) {
    const recipe = loadRecipe(name);
    const parent = fs.mkdtempSync(path.join(os.tmpdir(), `agents-md-derived-${name}-`));
    t.after(() => fs.rmSync(parent, { recursive: true, force: true }));
    const derived = path.join(parent, name);
    materialize(derived, recipe);
    const expected = treeFiles(derived);

    if (REWRITE) {
      for (const [relative, content] of expected) {
        const target = path.join(FIXTURES, name, relative);
        fs.mkdirSync(path.dirname(target), { recursive: true });
        fs.writeFileSync(target, content);
      }
    }

    const committed = treeFiles(path.join(FIXTURES, name), { skip: ['fixture.json'] });
    for (const relative of new Set([...expected.keys(), ...committed.keys()])) {
      if (!expected.has(relative)) drift.push(`${name}/${relative}: committed but not derived`);
      else if (!committed.has(relative)) drift.push(`${name}/${relative}: derived but not committed`);
      else if (!expected.get(relative).equals(committed.get(relative))) {
        drift.push(`${name}/${relative}: differs from what the manifest derives`);
      }
    }
  }
  assert.deepEqual(drift, [],
    'recompose the committed fixtures with AGENTS_MD_FIXTURE_WRITE=1 node --test .skilled/commands/doctor/scripts/tests/agents-md-check.test.cjs');
});

test('composer: the pure fixture rebuilds the shipped document from the manifest', (t) => {
  const fixture = buildFixture(t, 'pure');
  const { sections } = segment(fixture.document, manifest.markers, manifest.sections);

  assert.equal(sections.length, manifest.sections.length, 'the composed document carries every shipped section');
  for (const section of sections) {
    assert.ok(section.id, `the composed heading ${JSON.stringify(section.heading)} matches a manifest entry`);
    assert.equal(section.sha256, manifest.derived.sections[section.id].sha256,
      `section ${section.id} is byte-identical to the manifest's derived body`);
  }
  const rootDocument = fs.readFileSync(path.join(REPO_ROOT, manifest.root_file), 'utf8');
  assert.ok(rootDocument.startsWith(fixture.document),
    'the composed document is the root document up to its repository block');
});

test('composer: each fixture declares the install state it plants', () => {
  const names = fs.readdirSync(FIXTURES).sort();
  assert.equal(names.length, 9, 'there are nine fixture trees');
  for (const name of names) {
    const recipe = loadRecipe(name);
    assert.equal(recipe.name, name, `${name} names itself`);
    assert.ok(recipe.expect_state, `${name} declares its expected install state`);
    assert.ok(recipe.notes, `${name} says what defect it plants`);
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// 5. A1 INSTALL STATE, ONE FIXTURE PER STATE
// ─────────────────────────────────────────────────────────────────────────────

for (const name of ['pure', 'adopted', 'stale', 'forked', 'foreign', 'claude-only', 'absent', 'shadowed-pin', 'over-budget']) {
  test(`A1 install state: the ${name} fixture classifies as ${loadRecipe(name).expect_state}`, (t) => {
    const fixture = buildFixture(t, name);
    const run = runJson(['--root', fixture.dir]);

    assert.ok(run.report, `the engine prints a JSON report for ${name}; stderr: ${run.err}`);
    assert.equal(run.report.state, fixture.recipe.expect_state);
    assert.match(run.out, new RegExp(`"state": "${fixture.recipe.expect_state}"`));
  });
}

test('A1 install state: this repository is the source template and classifies as pure', () => {
  const report = buildReport({ root: REPO_ROOT });
  assert.equal(report.state, 'pure', 'the shipped template carries every section current and an empty block');
});

// ─────────────────────────────────────────────────────────────────────────────
// 6. UNMARKED CONTENT AND UNMARKED EDITS
// ─────────────────────────────────────────────────────────────────────────────

test('forked: A8 lists the unmarked section with its byte range and A9 lists the local line', (t) => {
  const fixture = buildFixture(t, 'forked');
  const run = runJson(['--root', fixture.dir]);

  assert.equal(run.code, 1, 'a forked repository is a finding, not a pass');
  assert.equal(rowOf(run.report, 'A1').detail, 'forked');

  const unmarked = rowOf(run.report, 'A8');
  assert.equal(unmarked.state, 'FINDING');
  const section = unmarked.entries.find((entry) => entry.heading.includes('Local release checklist'));
  assert.ok(section, "A8 lists the repository's own section by heading");
  assert.ok(section.byte_start > 0 && section.byte_end > section.byte_start, 'A8 gives the section a byte range');
  assert.equal(section.line_start, fixture.document.split('\n').indexOf('## Local release checklist') + 1,
    'A8 gives the section a line range that a reader can open');
  assert.equal(section.in_prefix, false, 'the section sits outside the delivery prefix');

  const edits = rowOf(run.report, 'A9');
  assert.equal(edits.state, 'FINDING');
  const edited = edits.entries.find((entry) => entry.id === 's6-spec-folder');
  assert.ok(edited, 'A9 names the edited section');
  assert.equal(edited.state, 'edited');
  assert.deepEqual(edited.lines, ['Local rule: name the packet in the first line of every pull request.']);
});

// ─────────────────────────────────────────────────────────────────────────────
// 7. PINS, BUDGET AND BLOCK SHAPE
// ─────────────────────────────────────────────────────────────────────────────

test('shadowed-pin: A5 fails because the local lookup line comes before Gate 1', (t) => {
  const fixture = buildFixture(t, 'shadowed-pin');
  const run = runJson(['--root', fixture.dir]);

  const pins = rowOf(run.report, 'A5');
  assert.equal(pins.state, 'FINDING');
  const pin = pins.entries.find((entry) => entry.id === 'gate1-lookup');
  assert.ok(pin, 'A5 names the pin the local line shadows');
  assert.equal(pin.state, 'FINDING');
  assert.match(pin.detail, /first occurrence/i);
});

test('over-budget: A6 and A7 both fail', (t) => {
  const fixture = buildFixture(t, 'over-budget');
  const total = Buffer.byteLength(fixture.document, 'utf8');
  assert.ok(total > manifest.budget.max_bytes, `the fixture is ${total} bytes, past the ${manifest.budget.max_bytes}-byte ceiling`);

  const run = runJson(['--root', fixture.dir]);
  assert.equal(rowOf(run.report, 'A6').state, 'FINDING');
  const block = rowOf(run.report, 'A7');
  assert.equal(block.state, 'FINDING');
  assert.match(block.lines.join(' '), /end marker sits before the start marker/i);
  assert.match(block.lines.join(' '), /exceeds the 32768-byte ceiling/);
});

test('a missing canary leaves A6 UNKNOWN, never a pass, and fails the run', (t) => {
  const report = buildReport({
    root: REPO_ROOT,
    tools: { canary: path.join(REPO_ROOT, 'no-such-canary.js') },
  });

  const budget = report.rows.find((row) => row.id === 'A6');
  assert.equal(budget.state, 'UNKNOWN', 'an absent canary cannot be reported as a pass');
  assert.match(budget.detail, /not installed|absent|missing/i);
  assert.equal(report.exitCode, 1, 'a row that could not be proven keeps the run from claiming a pass');
  assert.equal(report.status, 'UNKNOWN');

  // Installed on a throwaway root, the same row measures instead of giving up.
  const fixture = buildFixture(t, 'pure');
  assert.notEqual(rowOf(runJson(['--root', fixture.dir]).report, 'A6').state, 'UNKNOWN');
});

// ─────────────────────────────────────────────────────────────────────────────
// 8. RUNTIME COPIES
// ─────────────────────────────────────────────────────────────────────────────

test('a divergent CLAUDE.md fails A10 and lists the lines only it carries', (t) => {
  const fixture = buildFixture(t, 'adopted');
  const run = runJson(['--root', fixture.dir]);

  const copies = rowOf(run.report, 'A10');
  assert.equal(copies.state, 'FINDING');
  const copy = copies.entries.find((entry) => entry.path === 'CLAUDE.md');
  assert.ok(copy, 'A10 names the CLAUDE.md row');
  assert.equal(copy.state, 'FINDING');
  assert.equal(copy.kind, 'divergent copy');
  assert.deepEqual(copy.lines, [
    '# Project notes',
    'Run `make check` before you open a pull request.',
    'Update the changelog in the same commit as the code.',
  ]);
});

test('A10 reports a pointer-only CLAUDE.md and an absent .codex/AGENTS.md without a finding', (t) => {
  const fixture = buildFixture(t, 'pure');
  fs.writeFileSync(
    path.join(fixture.dir, 'CLAUDE.md'),
    '# Claude\n\nAll project instructions live in `AGENTS.md`.\n',
    'utf8',
  );
  const report = buildReport({ root: fixture.dir });

  const copies = report.rows.find((row) => row.id === 'A10');
  const claude = copies.entries.find((entry) => entry.path === 'CLAUDE.md');
  assert.equal(claude.kind, 'pointer');
  assert.equal(claude.state, 'PASS');
  const codex = copies.entries.find((entry) => entry.path === '.codex/AGENTS.md');
  assert.equal(codex.kind, 'absent');
  assert.equal(codex.state, 'PASS');
});

// ─────────────────────────────────────────────────────────────────────────────
// 9. EXIT CODES AND THE READ-ONLY PROMISE
// ─────────────────────────────────────────────────────────────────────────────

test('exit codes: 0 on this repository, 1 on a finding, 2 on a failed precondition', (t) => {
  const clean = runCheck([]);
  assert.equal(clean.code, 0, `this repository reports no finding; output: ${clean.out}`);

  const fixture = buildFixture(t, 'forked');
  const finding = runCheck(['--root', fixture.dir]);
  assert.equal(finding.code, 1, 'a finding exits 1');

  const missingRoot = runCheck(['--root', path.join(fixture.dir, 'no-such-directory')]);
  assert.equal(missingRoot.code, 2, 'a missing root is a failed precondition');
  assert.match(missingRoot.err, /no-such-directory/, 'the failure names the path it could not read');

  const missingManifest = runCheck(['--root', fixture.dir, '--manifest', path.join(fixture.dir, 'no-such-manifest.json')]);
  assert.equal(missingManifest.code, 2, 'a missing manifest is a failed precondition');
  assert.match(missingManifest.err, /no-such-manifest\.json/);
});

test('exit codes: an absent instruction file is a finding, not a precondition failure', (t) => {
  const fixture = buildFixture(t, 'absent');
  const run = runCheck(['--root', fixture.dir]);
  assert.equal(run.code, 1, 'nothing to compare is an answer about the repository, not a broken run');
});

test('the write-spy records no filesystem write while every row executes', (t) => {
  const fixture = buildFixture(t, 'forked');
  const watched = [
    'writeFileSync', 'appendFileSync', 'mkdirSync', 'rmSync', 'rmdirSync', 'unlinkSync',
    'copyFileSync', 'renameSync', 'symlinkSync', 'linkSync', 'truncateSync', 'chmodSync',
    'writeFile', 'appendFile', 'mkdir', 'rm', 'unlink', 'copyFile', 'rename', 'openSync',
  ];
  const calls = [];
  const originals = new Map();
  for (const name of watched) {
    if (typeof fs[name] !== 'function') continue;
    originals.set(name, fs[name]);
    fs[name] = (...args) => {
      calls.push(`${name}(${String(args[0])})`);
      return originals.get(name).apply(fs, args);
    };
  }

  let report = null;
  try {
    report = buildReport({ root: fixture.dir });
  } finally {
    for (const [name, original] of originals) fs[name] = original;
  }

  assert.deepEqual(calls, [], 'the run wrote nothing');
  assert.equal(report.rows.length, ROWS.length, 'every row ran with the spy in place');
});

test('every fixture run leaves its tree byte-identical', (t) => {
  for (const name of ['pure', 'adopted', 'stale', 'forked', 'foreign', 'claude-only', 'absent', 'shadowed-pin', 'over-budget']) {
    const fixture = buildFixture(t, name);
    const before = treeDigest(fixture.dir);
    runCheck(['--root', fixture.dir, '--json']);
    runCheck(['--root', fixture.dir]);
    assert.equal(treeDigest(fixture.dir), before, `the ${name} fixture was not touched`);
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// 10. REPORT SHAPE
// ─────────────────────────────────────────────────────────────────────────────

test('every row appears in the report, once, in order', (t) => {
  const fixture = buildFixture(t, 'pure');
  const run = runCheck(['--root', fixture.dir]);
  const printed = run.out.split('\n').map((line) => /^(A\d+) /.exec(line)).filter(Boolean).map((hit) => hit[1]);
  assert.deepEqual(printed, ROWS);

  const report = buildReport({ root: fixture.dir });
  assert.deepEqual(report.rows.map((row) => row.id), ROWS);
});

test('--json carries the same rows and the same state as the text form', (t) => {
  const fixture = buildFixture(t, 'forked');
  const text = runCheck(['--root', fixture.dir]);
  const json = runJson(['--root', fixture.dir]);

  assert.equal(json.code, text.code, 'the two forms agree on the exit code');
  assert.equal(json.report.state, 'forked');
  const fromText = textRowStates(text.out);
  assert.deepEqual(Object.keys(fromText).sort(), ROWS.slice().sort());
  for (const row of json.report.rows) {
    assert.equal(row.state, fromText[row.id], `row ${row.id} reads the same in both forms`);
  }
});

test('this repository reports STATUS=OK and a pure install state', () => {
  const run = runCheck([]);
  assert.equal(run.code, 0);
  assert.match(run.out, /^STATUS=OK/m);
  assert.match(run.out, /^A1 install state: pure/m);
});

test('A11 embeds the repo-rules checker\'s own summary line instead of re-deriving it', () => {
  const report = buildReport({ root: REPO_ROOT });
  const row = report.rows.find((entry) => entry.id === 'A11');
  assert.equal(row.state, 'PASS');
  assert.match(row.detail, /\[repo-rules-check\] RESULT: PASSED \(\d+\/\d+ checks\)/);
});

test('A12 reports INFO outside the source repository and runs inside it', (t) => {
  const fixture = buildFixture(t, 'pure');
  const outside = buildReport({ root: fixture.dir });
  const row = outside.rows.find((entry) => entry.id === 'A12');
  assert.equal(row.state, 'INFO');
  assert.match(row.detail, /source repository/);

  const inside = buildReport({ root: REPO_ROOT });
  assert.equal(inside.rows.find((entry) => entry.id === 'A12').state, 'PASS');
});

test('a precondition failure exits 2 rather than printing an empty report', (t) => {
  const fixture = buildFixture(t, 'pure');
  const code = main(['--root', fixture.dir, '--manifest', path.join(fixture.dir, 'missing.json')]);
  assert.equal(code, 2);
});
