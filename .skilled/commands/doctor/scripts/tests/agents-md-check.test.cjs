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
// Each synthetic repository is composed from the manifest's derived bodies into a
// throwaway directory, never committed and never read twice. A fixture folder therefore
// holds a recipe and no document: the tree is a statement about the template that ships
// today rather than a snapshot of it at the time the recipe was written, and a fixture
// cannot describe a template the manifest does not ship. Refreshing a released body in
// the manifest refreshes every fixture in the same edit, and no copy of the template
// sits in the tree for a link checker or a runtime to pick up.

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

const { buildReport, main, renderText } = require('../agents-md-check.cjs');
const { segment } = require('../lib/agents-md-sections.cjs');
const {
  FIXTURES,
  MANIFEST_PATH,
  REPO_ROOT,
  SCRIPTS_DIR,
  composeFixture,
  fixtureNames,
  loadRecipe,
  moveBlockBefore,
} = require('./fixtures/agents-md/compose-fixture.cjs');

const ENGINE = path.join(SCRIPTS_DIR, 'agents-md-check.cjs');

const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));

// The rows every report carries, in the order the engine prints them.
const ROWS = ['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'A9', 'A10', 'A11', 'A12'];

// ─────────────────────────────────────────────────────────────────────────────
// 2. FIXTURE TREES
// ─────────────────────────────────────────────────────────────────────────────

// Every engine run happens on a tree composed for it and removed afterwards, so no case
// can read a stale copy of a document, and the tree a case runs against is always the
// template that ships in this repository.
function buildFixture(t, name) {
  const parent = fs.mkdtempSync(path.join(os.tmpdir(), `agents-md-check-${name}-`));
  t.after(() => fs.rmSync(parent, { recursive: true, force: true }));
  const dir = path.join(parent, name);
  composeFixture(name, dir);
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

// A fixture's document is rewritten by a case that needs a shape no recipe describes,
// so the tree a case reads is always the template the manifest ships today.
function rewriteDocument(fixture, text) {
  fs.writeFileSync(path.join(fixture.dir, manifest.root_file), text, 'utf8');
}

// A throwaway manifest: pin kinds and root file names are the two places a case needs a
// declaration the shipped manifest does not carry.
function writeManifest(t, patch) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'agents-md-check-manifest-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  const target = path.join(dir, 'agents-md-manifest.json');
  fs.writeFileSync(target, `${JSON.stringify({ ...manifest, ...patch }, null, 2)}\n`, 'utf8');
  return target;
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
// 4. THE FIXTURES ARE RECIPES, NOT COPIES
// ─────────────────────────────────────────────────────────────────────────────

// A composed tree committed beside its recipe would be a second copy of the template,
// and the copy is what the repository would then have to keep: relative links would
// resolve against the fixture folder, a runtime loading nested instruction files would
// read it as somebody's own document, and each template edit would need a regeneration
// commit. This case holds the rule the fixtures are arranged by.
test('every fixture folder holds its recipe and no composed tree', () => {
  const stray = [];
  for (const name of fixtureNames()) {
    for (const entry of fs.readdirSync(path.join(FIXTURES, name), { withFileTypes: true })) {
      if (entry.name !== 'fixture.json' || entry.isDirectory()) stray.push(`${name}/${entry.name}`);
    }
  }
  assert.deepEqual(stray, [],
    'compose a fixture into a temporary folder with the suite\'s composer instead of committing the tree it describes');
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
  const names = fixtureNames();
  assert.equal(names.length, 9, 'there are nine fixture recipes');
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

// The same sentence written twice is two lines a replacement would lose, so the row
// counts occurrences: a set would report one line and hide the other.
test('A9 counts a repeated local line once per occurrence', (t) => {
  const fixture = buildFixture(t, 'forked');
  const line = 'Local rule: name the packet in the first line of every pull request.';
  rewriteDocument(fixture, fixture.document.replace(line, `${line}\n${line}`));

  const run = runJson(['--root', fixture.dir]);
  const edits = rowOf(run.report, 'A9');
  assert.equal(edits.state, 'FINDING');
  const edited = edits.entries.find((entry) => entry.id === 's6-spec-folder');
  assert.deepEqual(edited.lines, [line, line], 'the repeated line is listed twice');
  assert.match(edits.detail, /1 section\(s\) carry 2 local line\(s\)/);
});

// A repository that wrote its block between two shipped sections still carries every
// shipped section, and the block is in the one place the template does not put it. Read
// only above the block, the document looks like somebody else's file and the position is
// never named.
test('a block placed between shipped sections is reported by A7 with its position', (t) => {
  const fixture = buildFixture(t, 'adopted');
  const moved = moveBlockBefore(fixture.document, '#### The Four Laws');
  rewriteDocument(fixture, moved);

  const run = runJson(['--root', fixture.dir]);
  assert.equal(rowOf(run.report, 'A1').detail, 'adopted', 'every shipped section is still current');
  assert.equal(rowOf(run.report, 'A2').detail, '44/44 matched', 'the sections below the block are shipped ones');
  assert.equal(rowOf(run.report, 'A8').state, 'PASS', 'nothing below the block is unmarked content');

  const block = rowOf(run.report, 'A7');
  assert.equal(block.state, 'FINDING');
  const position = block.lines.join(' ');
  // Offsets in the report are bytes, and the template carries multi-byte headings above
  // the block, so the character index is not the figure to compare against.
  const blockByte = Buffer.byteLength(moved.slice(0, moved.indexOf(manifest.markers.start)), 'utf8');
  assert.ok(position.includes(`byte ${blockByte}`), `A7 names where the block sits: ${position}`);
  assert.match(position, /The Four Laws/, 'A7 names the shipped section the block sits in front of');
});

// The end marker is not the end of the file: a line typed below it is the repository's
// own, and a rewrite that keeps only the block would drop it without a word.
test('a line after the block end marker is reported as a local edit', (t) => {
  const fixture = buildFixture(t, 'adopted');
  const line = 'Ship the release note in the same commit as the tag.';
  rewriteDocument(fixture, `${fixture.document}${line}\n`);

  const run = runJson(['--root', fixture.dir]);
  assert.equal(rowOf(run.report, 'A1').detail, 'forked');

  const edits = rowOf(run.report, 'A9');
  assert.equal(edits.state, 'FINDING');
  const carrier = edits.entries.find((entry) => entry.lines.includes(line));
  assert.ok(carrier, `A9 lists the line below the end marker: ${JSON.stringify(edits.entries)}`);
});

// Text above the first heading belongs to no section, so it is the one piece of
// repository content a heading-shaped comparison cannot see. Left unreported, a document
// carrying it reads as a pure template and a rewrite drops it.
test('text before the first shipped heading is reported as unmarked repository content', (t) => {
  const fixture = buildFixture(t, 'pure');
  const line = 'Read me first.';
  rewriteDocument(fixture, `${line}\n${fixture.document}`);

  const run = runJson(['--root', fixture.dir]);
  assert.equal(rowOf(run.report, 'A1').detail, 'forked');

  const unmarked = rowOf(run.report, 'A8');
  assert.equal(unmarked.state, 'FINDING');
  const prelude = unmarked.entries.find((entry) => entry.heading === null);
  assert.ok(prelude, `A8 names the text above the first heading: ${JSON.stringify(unmarked.entries)}`);
  assert.equal(prelude.byte_start, 0, 'the region starts at the first byte');
  assert.equal(prelude.line_start, 1);
  assert.match(unmarked.lines.join(' '), /before the first heading/);
});

// A body can carry every line the shipped body carries and still not be it: one extra
// space on an indented bullet is a real difference and a rewrite replaces it. A finding
// with nothing under it names no line to look at, so the row says what the difference is
// and where the two bodies part company.
test('A9 names a body that differs only in whitespace, by line', (t) => {
  const fixture = buildFixture(t, 'pure');
  const shipped = manifest.derived.sections['gate-3'].body;
  const lines = shipped.split('\n');
  const indented = lines.findIndex((row) => row.startsWith('  '));
  assert.notEqual(indented, -1, 'the shipped body carries an indented line');
  lines[indented] = ` ${lines[indented]}`;
  assert.notEqual(lines[indented], shipped.split('\n')[indented]);
  rewriteDocument(fixture, fixture.document.replace(shipped, lines.join('\n')));

  const run = runJson(['--root', fixture.dir]);
  assert.equal(rowOf(run.report, 'A4').entries.find((entry) => entry.id === 'gate-3').state, 'edited', 'the body is not the shipped one');

  const edits = rowOf(run.report, 'A9');
  assert.equal(edits.state, 'FINDING', 'the section is not the shipped one, so the row reports it');
  assert.ok(edits.lines.length > 0, 'a finding names at least one line to act on');
  assert.match(edits.lines[0], /gate-3/u, 'the line names the section');
  assert.match(edits.lines[0], new RegExp(`line ${indented + 1}\\b`, 'u'), 'and the line of the body where the two differ');
  assert.match(edits.lines[0], /whitespace/u, 'and says the difference is whitespace');

  const text = runCheck(['--root', fixture.dir]);
  assert.match(text.out, /A9 unmarked local edits: .*\(FINDING\)/u);
  assert.match(text.out, /gate-3: only whitespace/u, 'the text form prints the same line');
});

// A marker is the whole line, so a sentence that quotes both markers is prose. Counting
// the bytes instead would report a document with no block as carrying two of them, which
// is a finding about a file nobody can fix.
test('A7 counts marker lines, not the marker text quoted inside a sentence', (t) => {
  const fixture = buildFixture(t, 'pure');
  const sentence = 'The block is fenced by `<!-- skilled:repo-local:start -->` and `<!-- skilled:repo-local:end -->` in this framework.';
  rewriteDocument(fixture, `${fixture.document}${sentence}\n`);

  const run = runJson(['--root', fixture.dir]);
  const block = rowOf(run.report, 'A7');
  assert.equal(block.state, 'PASS', `a sentence quoting both markers is prose, not a block: ${block.lines.join(' | ')}`);
  assert.match(block.detail, /no block/u, 'the document carries no block, because neither marker is a line of its own');
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

// A pin the engine has no rule for is a pin nobody measured. Counting it as a hold is
// how a manifest edit that adds a kind is reported as verified instead of unmeasured.
test('a pin kind with no rule is UNKNOWN, never a hold', (t) => {
  const fixture = buildFixture(t, 'pure');
  const manifestPath = writeManifest(t, {
    pins: [...manifest.pins, { id: 'invented-pin', kind: 'invented', texts: ['nothing'] }],
  });

  const run = runJson(['--root', fixture.dir, '--manifest', manifestPath]);
  const pins = rowOf(run.report, 'A5');
  assert.equal(pins.state, 'UNKNOWN');
  const entry = pins.entries.find((candidate) => candidate.id === 'invented-pin');
  assert.equal(entry.state, 'UNKNOWN', 'the entry is not recorded as a pass');
  assert.match(pins.detail, /1 unmeasured/);
  assert.equal(run.report.unknown, 1);
  assert.match(run.out, /"unknown": 1/);
});

// An empty classification is not a verified one. The rows around it already say the
// document is empty or foreign, so a PASS here reads as "currency checked, all current".
test('A4 reports INFO when there is no matched section to classify', (t) => {
  const fixture = buildFixture(t, 'foreign');
  const run = runJson(['--root', fixture.dir]);

  const currency = rowOf(run.report, 'A4');
  assert.equal(currency.state, 'INFO');
  assert.match(currency.detail, /no shipped section/i);
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

// A copy whose own tool is missing was not checked. Recorded only in the JSON entries, it
// prints as a pass line with no detail and leaves the run reporting unknown=0.
test('an unmeasured runtime copy makes A10 UNKNOWN and is counted in unknown=', (t) => {
  const fixture = buildFixture(t, 'pure');
  const report = buildReport({
    root: fixture.dir,
    tools: { pointerSync: path.join(fixture.dir, 'no-such-pointer-sync.cjs') },
  });

  const copies = report.rows.find((row) => row.id === 'A10');
  assert.equal(copies.state, 'UNKNOWN', 'a copy that could not be checked is not a pass');
  const entry = copies.entries.find((candidate) => candidate.path === '.cursor/rules/skill-routing.md');
  assert.equal(entry.state, 'UNKNOWN');
  assert.ok(copies.lines.some((line) => line.includes('.cursor/rules/skill-routing.md')),
    `the unmeasured copy is printed, not only recorded: ${JSON.stringify(copies.lines)}`);
  assert.equal(report.unknown, 1);
  assert.equal(report.exitCode, 1);
  assert.match(renderText(report), /unknown=1/u);
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

// The root file's name is the manifest's to declare. Naming it here means a manifest that
// moves the document leaves this precondition reading a file nobody ships.
test('the readability precondition reads the manifest\'s root file, not a fixed name', (t) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'agents-md-check-root-file-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  // A directory under the name the script used to hardcode: reading it throws, so a run
  // that reads it exits 2 instead of classifying the tree.
  fs.mkdirSync(path.join(root, 'AGENTS.md'));
  const manifestPath = writeManifest(t, { root_file: 'GUIDE.md' });

  const run = runCheck(['--root', root, '--manifest', manifestPath]);
  assert.equal(run.code, 1, `the tree is classified rather than refused: ${run.err}`);
  assert.doesNotMatch(run.err, /cannot read/u);
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
