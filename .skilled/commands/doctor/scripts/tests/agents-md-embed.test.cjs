#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Shipped Instruction Embed Engine Tests
// ───────────────────────────────────────────────────────────────────
'use strict';

// The embed engine is the only part of this command that writes, and every line it
// touches belongs to somebody else. Its value is therefore a property rather than an
// output: what it showed is what it wrote, a backup exists before the first byte, and no
// repository line survived only in the old file. This suite proves those properties
// against synthetic repositories, and proves each failure path leaves the tree as it was.
//
// Every case runs on a tree composed for it from the manifest into a throwaway
// directory, never on a committed document and never on this repository's own files. A
// case that needs a real write path, a real router or a real copied rule corpus builds
// it inside that directory, so the engine meets the same shapes it meets in a consumer
// checkout without any of those shapes being committed here.
//
// The backup the engine leaves behind is the rollback, so the engine never deletes it.
// These cases remove only the single run directory their own run created, and only after
// proving it sits under the operating system's temporary directory.

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

const embed = require('../agents-md-embed.cjs');
const {
  MANIFEST_PATH,
  REPO_ROOT,
  SCRIPTS_DIR,
  composeFixture,
  moveBlockBefore,
} = require('./fixtures/agents-md/compose-fixture.cjs');

const ENGINE = path.join(SCRIPTS_DIR, 'agents-md-embed.cjs');
const REPO_RULES_CHECKER = path.join(REPO_ROOT, '.skilled/skills/sk-doc/sk-create-repo-rule/scripts/check-repo-rules.cjs');
const SOURCE = fs.readFileSync(ENGINE, 'utf8');

const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));

// ─────────────────────────────────────────────────────────────────────────────
// 2. TREES, FILES AND DIGESTS
// ─────────────────────────────────────────────────────────────────────────────

// One composed tree per case, removed with the case. Composition reads the manifest, so
// a case always describes the template that ships today.
function composeTree(t, name) {
  const parent = fs.mkdtempSync(path.join(os.tmpdir(), `agents-md-embed-${name}-`));
  t.after(() => fs.rmSync(parent, { recursive: true, force: true }));
  const dir = path.join(parent, name);
  composeFixture(name, dir);
  return dir;
}

function listFiles(dir, prefix = '') {
  const found = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const relative = prefix === '' ? entry.name : `${prefix}/${entry.name}`;
    if (entry.isDirectory()) found.push(...listFiles(path.join(dir, entry.name), relative));
    else found.push(relative);
  }
  return found.sort();
}

// Anything the engine leaves behind in a tree changes this number, which is what makes a
// "writes nothing" claim checkable rather than promised.
function treeDigest(dir) {
  const hash = crypto.createHash('sha256');
  for (const relative of listFiles(dir)) {
    hash.update(relative);
    hash.update('\0');
    hash.update(fs.readFileSync(path.join(dir, relative)));
    hash.update('\0');
  }
  return hash.digest('hex');
}

function readInside(dir, relative) {
  return fs.readFileSync(path.join(dir, relative), 'utf8');
}

function existsInside(dir, relative) {
  return fs.existsSync(path.join(dir, relative));
}

function writeInside(dir, relative, text) {
  fs.writeFileSync(path.join(dir, relative), text, 'utf8');
}

function trimmedLines(text) {
  return text.split('\n').map((line) => line.trim()).filter((line) => line !== '' && line !== '---');
}

function occurrences(text, needle) {
  let count = 0;
  let at = text.indexOf(needle);
  while (at !== -1) {
    count += 1;
    at = text.indexOf(needle, at + needle.length);
  }
  return count;
}

// The repository block of a composed document, with the markers stripped.
function blockIn(text) {
  const { start, end } = manifest.markers;
  const from = text.indexOf(start);
  const to = text.indexOf(end);
  assert.ok(from !== -1 && to > from, 'the composed document carries one well-formed block');
  return text.slice(from + start.length, to);
}

// The engine prints one field per line, so a case reads the plan the way an operator
// does instead of reaching into the engine's internals.
function field(text, name) {
  const match = new RegExp(`^${name}: (.*)$`, 'mu').exec(text);
  return match === null ? null : match[1].trim();
}

function targetsOf(out) {
  const targets = [];
  for (const line of out.split('\n')) {
    const hit = /^target (\S+): (create|replace|remove|unchanged)$/.exec(line);
    if (hit !== null) targets.push({ path: hit[1], action: hit[2] });
  }
  return targets;
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. RUNNERS
// ─────────────────────────────────────────────────────────────────────────────

function run(args, options = {}) {
  const result = spawnSync(process.execPath, [ENGINE, ...args], {
    encoding: 'utf8',
    input: options.input === undefined ? '' : options.input,
  });
  return { code: result.status, out: result.stdout || '', err: result.stderr || '' };
}

function plan(dir, extra = []) {
  return run(['plan', '--root', dir, ...extra]);
}

function apply(dir, digest, extra = []) {
  return run(['apply', '--root', dir, '--plan-digest', digest, ...extra]);
}

// A plan followed by the apply it authorises, which is the only supported write path.
function planAndApply(dir, extra = []) {
  const planned = plan(dir, extra);
  assert.equal(planned.code, 0, `plan exits 0\n${planned.err}`);
  const digest = field(planned.out, 'plan-digest');
  assert.match(digest || '', /^[0-9a-f]{64}$/u, 'the plan prints a sha256 digest');
  const applied = apply(dir, digest, extra);
  return { planned, applied, digest };
}

// The engine never deletes a backup, so the case does: exactly one directory, and only
// when it sits under the temporary directory this run created it in.
function trackBackup(t, text) {
  const dir = field(text, 'backup');
  if (dir === null) return null;
  t.after(() => {
    const temporary = os.tmpdir();
    if (!dir.startsWith(temporary + path.sep)) return;
    fs.rmSync(dir, { recursive: true, force: true });
  });
  return dir;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. SCRIPTED WRITES THE ENGINE NEVER MAKES
// ─────────────────────────────────────────────────────────────────────────────

// A spy rather than a promise: the plan's own composition and report run inside this
// window, so any write path the engine gained would be recorded here.
function spyOnWrites(record) {
  const names = ['writeFileSync', 'appendFileSync', 'mkdirSync', 'mkdtempSync', 'copyFileSync', 'rmSync', 'unlinkSync', 'renameSync', 'rmdirSync'];
  const originals = new Map(names.map((name) => [name, fs[name]]));
  for (const name of names) {
    fs[name] = (...args) => {
      record.push({ name, first: String(args[0]) });
      return originals.get(name).apply(fs, args);
    };
  }
  return () => {
    for (const [name, original] of originals) fs[name] = original;
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. A REPOSITORY THAT CARRIES THE SHIPPED RULE CORPUS
// ─────────────────────────────────────────────────────────────────────────────

// The shipped rows point into `.skilled/repo-rules`, which arrives with the install. A
// synthetic repository therefore needs that corpus for its router to be checkable at all,
// so the case copies the installed rule files in rather than inventing rows for them. The
// references those rules link to travel with the install too, so each one is resolved and
// copied to the same relative path.
function seedRuleCorpus(dir) {
  const from = path.join(REPO_ROOT, '.skilled/repo-rules');
  const to = path.join(dir, '.skilled/repo-rules');
  fs.mkdirSync(to, { recursive: true });
  const copied = [];
  for (const name of fs.readdirSync(from)) {
    if (!name.endsWith('.md')) continue;
    fs.copyFileSync(path.join(from, name), path.join(to, name));
    copied.push(name);
  }
  for (const name of copied) {
    const text = fs.readFileSync(path.join(to, name), 'utf8');
    for (const match of text.matchAll(/\]\(([^)\s]+)\)/gu)) {
      const target = match[1].split('#')[0];
      if (target === '' || /^[a-z][a-z0-9+.-]*:/iu.test(target)) continue;
      const relative = path.posix.normalize(path.posix.join('.skilled/repo-rules', target));
      if (fs.existsSync(path.join(dir, relative))) continue;
      const source = path.join(REPO_ROOT, relative);
      if (!fs.existsSync(source)) continue;
      fs.mkdirSync(path.dirname(path.join(dir, relative)), { recursive: true });
      fs.copyFileSync(source, path.join(dir, relative));
    }
  }
}

function shippedRows() {
  return manifest.derived.repo_rules;
}

function renderRows(rows) {
  return rows.map((cells) => `| ${cells.join(' | ')} |`).join('\n');
}

// A router that carries only the first few shipped rows, which is the shape a repository
// is left in when an install replaced the rules but not the router.
function partialRouter(count) {
  const { trigger_rows: trigger, index_rows: index } = shippedRows();
  return [
    '# REPO RULES',
    '',
    'Repo-local operating rules. This document routes you to the rule files.',
    '',
    '---',
    '',
    '## 2. TRIGGER TABLE',
    '',
    '| You are about to… | Load | It settles |',
    '|-------------------|------|-----------|',
    renderRows(trigger.slice(0, count)),
    '',
    '---',
    '',
    '## 3. INDEX',
    '',
    '| Rule | Summary |',
    '|------|---------|',
    renderRows(index.slice(0, count)),
    '',
    '---',
    '',
  ].join('\n');
}

function tableRows(text, anchor) {
  const lines = text.split('\n');
  const start = lines.findIndex((line) => line.startsWith('#') && line.includes(anchor));
  assert.ok(start !== -1, `the router carries a ${anchor} table`);
  const rows = [];
  for (let index = start + 1; index < lines.length; index += 1) {
    const line = lines[index].trim();
    if (line.startsWith('#')) break;
    if (line === '') {
      if (rows.length > 0) break;
      continue;
    }
    if (!line.startsWith('|')) continue;
    if (/^\|[\s:|-]+\|$/u.test(line)) continue;
    rows.push(line);
  }
  return rows.slice(1);
}

function runRepoRulesChecker(dir) {
  const result = spawnSync(process.execPath, [REPO_RULES_CHECKER, '--root', dir], { encoding: 'utf8' });
  return {
    code: result.status,
    out: `${result.stdout || ''}\n${result.stderr || ''}`,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. THE PLAN WRITES NOTHING
// ─────────────────────────────────────────────────────────────────────────────

test('a plan run records zero writes', (t) => {
  const dir = composeTree(t, 'forked');
  const before = treeDigest(dir);

  const planned = plan(dir);
  assert.equal(planned.code, 0, planned.err);
  assert.equal(treeDigest(dir), before, 'a plan leaves the tree byte for byte');
  assert.match(planned.out, /plan-digest: [0-9a-f]{64}/u);

  // The plan names where the backup will go, so the location is reviewable, and the
  // names a write path it did not take.
  const backup = field(planned.out, 'backup');
  assert.ok(backup, 'the plan prints the backup location');
  assert.equal(fs.existsSync(backup), false, 'the plan creates no backup directory');

  const writes = [];
  const restore = spyOnWrites(writes);
  let code;
  try {
    code = embed.main(['plan', '--root', dir], { log: () => {}, warn: () => {} });
  } finally {
    restore();
  }
  assert.equal(code, 0);
  assert.deepEqual(writes, [], 'no write reached the filesystem during a plan');
  assert.equal(treeDigest(dir), before, 'the tree is unchanged after the spy window');
});

// ─────────────────────────────────────────────────────────────────────────────
// 7. APPLY IS GATED BY THE DIGEST
// ─────────────────────────────────────────────────────────────────────────────

test('apply without a plan digest exits 2 and writes nothing', (t) => {
  const dir = composeTree(t, 'forked');
  const before = treeDigest(dir);

  const refused = run(['apply', '--root', dir]);
  assert.equal(refused.code, 2, refused.out);
  assert.match(refused.err, /plan-digest/u);
  assert.equal(treeDigest(dir), before);
});

test('apply refuses a digest that the tree no longer produces', (t) => {
  const dir = composeTree(t, 'forked');
  const planned = plan(dir);
  const digest = field(planned.out, 'plan-digest');

  // The operator edits between the plan and the yes, so the shown bytes are stale.
  fs.appendFileSync(path.join(dir, 'AGENTS.md'), '\nOne more line typed after the plan.\n');
  const before = treeDigest(dir);

  const refused = apply(dir, digest);
  assert.equal(refused.code, 2, refused.out);
  assert.match(refused.err, /digest/u);
  assert.equal(treeDigest(dir), before, 'a refused apply writes nothing');
});

// ─────────────────────────────────────────────────────────────────────────────
// 8. THE PRESERVATION INVARIANT
// ─────────────────────────────────────────────────────────────────────────────

test('preservationCheck reports each part of the invariant', () => {
  const shipped = manifest.sections.map((entry) => manifest.derived.sections[entry.id].body).join('');
  const compose = (body) => {
    const block = `${manifest.markers.start}\n${manifest.markers.heading}\n\n${manifest.markers.note}\n${body === '' ? '' : `${body}\n`}${manifest.markers.end}\n`;
    return `${shipped}${block}`;
  };

  const clean = embed.preservationCheck(compose('One kept line.'), compose('One kept line.'), manifest);
  assert.deepEqual(clean.dropped, []);
  assert.deepEqual(clean.foreign, []);

  // Part one: lines from outside every shipped section left the document.
  const unmarked = `# Our own notes\n\nKeep this sentence.\n`;
  const partOne = embed.preservationCheck(compose(unmarked), compose(''), manifest);
  assert.deepEqual(partOne.dropped.map((entry) => entry.line), ['# Our own notes', 'Keep this sentence.']);
  assert.deepEqual(partOne.dropped.map((entry) => entry.part), [1, 1]);

  // Part two: a line typed inside a shipped section, which no shipped body carries.
  const sectionId = 's6-spec-folder';
  const edited = manifest.derived.sections[sectionId].body.replace('\n---\n', '\nA local tightening.\n\n---\n');
  const oldTwo = shipped.replace(manifest.derived.sections[sectionId].body, edited);
  const partTwo = embed.preservationCheck(oldTwo, compose(''), manifest);
  assert.equal(partTwo.dropped.length, 1);
  assert.equal(partTwo.dropped[0].part, 2);
  assert.equal(partTwo.dropped[0].line, 'A local tightening.');

  // Part three: a line that only a removed copy carried.
  const partThree = embed.preservationCheck(compose(''), compose(''), manifest, {
    removed: [{ path: 'CLAUDE.md', content: '# Notes\n\nRun the checks first.\n' }],
  });
  assert.deepEqual(partThree.dropped.map((entry) => entry.line), ['# Notes', 'Run the checks first.']);

  // Part four: a line outside the block that the shipped template does not carry.
  const foreign = embed.preservationCheck(compose(''), `A line above the block.\n${compose('')}`, manifest);
  assert.deepEqual(foreign.foreign.map((entry) => entry.line), ['A line above the block.']);
});

// ─────────────────────────────────────────────────────────────────────────────
// 9. THE FOREIGN AND FORKED SHAPES
// ─────────────────────────────────────────────────────────────────────────────

test('the foreign shape keeps its whole original document inside the block', (t) => {
  const dir = composeTree(t, 'foreign');
  const original = readInside(dir, manifest.root_file);

  const { planned, applied } = planAndApply(dir);
  trackBackup(t, applied.out);
  assert.equal(applied.code, 0, `${applied.err}${applied.out}`);
  assert.match(applied.out, /preservation: kept \d+, carried \d+, shipped-replaced 44, dropped 0/u);
  assert.match(applied.out, /STATUS=OK/u);

  const composed = readInside(dir, manifest.root_file);
  assert.ok(composed.startsWith(manifest.derived.sections.title.body), 'the shipped template arrives first');
  const block = blockIn(composed);
  assert.ok(block.includes(original.trim()), 'the original file sits inside the block verbatim');
  for (const line of trimmedLines(original)) {
    assert.equal(occurrences(block, line), occurrences(original, line), `${line} survives once per occurrence`);
  }

  // Part four, measured on the bytes that reached the disk rather than on the claim.
  const checked = embed.preservationCheck(original, composed, manifest);
  assert.deepEqual(checked.dropped, []);
  assert.deepEqual(checked.foreign, []);
  assert.match(planned.out, /BUDGET|budget: /u);
});

test('the forked shape carries its unmarked section before its edited section', (t) => {
  const dir = composeTree(t, 'forked');
  const original = readInside(dir, manifest.root_file);
  const localLine = 'Local rule: name the packet in the first line of every pull request.';

  const applied = planAndApply(dir).applied;
  trackBackup(t, applied.out);
  assert.equal(applied.code, 0, `${applied.err}${applied.out}`);
  assert.match(applied.out, /preservation: kept \d+, carried 0, shipped-replaced 44, dropped 0/u);

  const composed = readInside(dir, manifest.root_file);
  const block = blockIn(composed);
  const unmarkedAt = block.indexOf('## Local release checklist');
  const editedAt = block.indexOf('### Carried from s6-spec-folder');
  assert.ok(unmarkedAt !== -1, 'the unmarked section is carried');
  assert.ok(editedAt !== -1, 'the edited section is carried under its id');
  assert.ok(unmarkedAt < editedAt, 'unmarked sections come before edited sections');
  assert.equal(occurrences(composed, localLine), 1, 'the local line moved rather than duplicated');
  assert.equal(occurrences(composed, 'Run `make verify` and post the result in the release channel before tagging.'), 1);

  const checked = embed.preservationCheck(original, composed, manifest);
  assert.deepEqual(checked.dropped, []);
  assert.deepEqual(checked.foreign, []);
});

test('a released body is replaced with no carry', (t) => {
  const dir = composeTree(t, 'stale');
  const applied = planAndApply(dir).applied;
  trackBackup(t, applied.out);
  assert.equal(applied.code, 0, `${applied.err}${applied.out}`);

  const composed = readInside(dir, manifest.root_file);
  const current = manifest.derived.sections['operational-mandates'].body;
  assert.ok(composed.includes(current), 'the current body replaced the released one');
  assert.ok(!composed.includes('### Carried from operational-mandates'), 'nothing is carried from a released body');
});

// A block is the repository's block wherever it sits. Left above the point a rewrite cuts, its
// content is the first thing a replacement loses, and every shipped section below it is
// invisible, so the rewrite would duplicate them into the block instead of recognising them.
test('a block placed between shipped sections is carried into the block at the end', (t) => {
  const dir = composeTree(t, 'adopted');
  const original = moveBlockBefore(readInside(dir, manifest.root_file), '#### The Four Laws');
  writeInside(dir, manifest.root_file, original);
  const carried = 'Our stack is Node 20 with no web framework.';

  const applied = planAndApply(dir).applied;
  trackBackup(t, applied.out);
  assert.equal(applied.code, 0, `${applied.err}${applied.out}`);
  assert.match(applied.out, /\(state: adopted\)/u, 'the sections below the block are recognised as the template\'s');
  assert.match(applied.out, /preservation: kept \d+, carried \d+, shipped-replaced 44, dropped 0/u);

  const composed = readInside(dir, manifest.root_file);
  assert.equal(occurrences(composed, manifest.markers.start), 1, 'exactly one block survives');
  const block = blockIn(composed);
  assert.equal(occurrences(block, carried), 1, 'the block content moved into the one block at the end');
  assert.equal(occurrences(composed, carried), 1, 'it is not also left where it was');
  for (const id of ['four-laws', 's2-mandatory-gates', 'operational-mandates']) {
    assert.equal(occurrences(composed, manifest.derived.sections[id].body), 1, `the shipped body ${id} appears once, below the block`);
  }

  const checked = embed.preservationCheck(original, composed, manifest);
  assert.deepEqual(checked.dropped, []);
  assert.deepEqual(checked.foreign, []);
});

// The end marker is not the end of the file. A line typed below it is the repository's own,
// and a rewrite that keeps only the block and the shipped sections drops it silently.
test('a line after the end marker is carried into the block', (t) => {
  const dir = composeTree(t, 'adopted');
  const line = 'Ship the release note in the same commit as the tag.';
  const original = `${readInside(dir, manifest.root_file)}${line}\n`;
  writeInside(dir, manifest.root_file, original);

  const applied = planAndApply(dir).applied;
  trackBackup(t, applied.out);
  assert.equal(applied.code, 0, `${applied.err}${applied.out}`);
  assert.match(applied.out, /dropped 0/u);

  const composed = readInside(dir, manifest.root_file);
  assert.equal(occurrences(blockIn(composed), line), 1, 'the line sits in the block');
  assert.equal(occurrences(composed, line), 1, 'it is not also left below the block');

  const checked = embed.preservationCheck(original, composed, manifest);
  assert.deepEqual(checked.dropped, []);
  assert.deepEqual(checked.foreign, []);
});

// Text above the first heading belongs to no section, so nothing but the block can keep it.
// Carried nowhere, it is gone at the first rewrite while the document still reads as pure.
test('text before the first heading is carried into the block', (t) => {
  const dir = composeTree(t, 'pure');
  const line = 'Read me first.';
  const original = `${line}\n${readInside(dir, manifest.root_file)}`;
  writeInside(dir, manifest.root_file, original);

  const applied = planAndApply(dir).applied;
  trackBackup(t, applied.out);
  assert.equal(applied.code, 0, `${applied.err}${applied.out}`);
  assert.match(applied.out, /\(state: forked\)/u, 'the text above the template is repository content, not a pure template');
  assert.match(applied.out, /dropped 0/u);

  const composed = readInside(dir, manifest.root_file);
  assert.equal(occurrences(blockIn(composed), line), 1, 'the line sits in the block');
  assert.equal(occurrences(composed, line), 1, 'it is not also left above the template');

  const checked = embed.preservationCheck(original, composed, manifest);
  assert.deepEqual(checked.dropped, []);
  assert.deepEqual(checked.foreign, []);

  // The proof has to miss it too, or the next composition that drops the prelude ends in
  // the same silence: the line is gone and nothing was named.
  const lost = embed.preservationCheck(original, composed.replace(`${line}\n`, ''), manifest);
  assert.ok(lost.dropped.some((entry) => entry.line === line), `the proof counts the text above the template as repository content: ${JSON.stringify(lost.dropped)}`);
});

// ─────────────────────────────────────────────────────────────────────────────
// 10. THE PROOF, AND WHAT HAPPENS WHEN IT FAILS
// ─────────────────────────────────────────────────────────────────────────────

// The seam stands in for a writer that loses a line: the composition is intact, the
// digest matches, and the bytes that reach the disk are one line short. Only the
// post-write proof can catch that, which is exactly what it exists for.
function dropALineOnWrite(captured) {
  return (file, content) => {
    const bytes = Buffer.isBuffer(content) ? content : Buffer.from(String(content), 'utf8');
    const text = bytes.toString('utf8');
    const written = file.endsWith(manifest.root_file)
      ? text.replace('- Never commit a generated file.\n', '')
      : text;
    captured.push({ file, dropped: written !== text });
    fs.writeFileSync(file, written, 'utf8');
  };
}

test('a planted drop restores the backup and ends STATUS=FAIL', (t) => {
  const dir = composeTree(t, 'foreign');
  const original = readInside(dir, manifest.root_file);
  const out = [];
  const written = [];
  const hooks = {
    log: (line) => out.push(line),
    warn: (line) => out.push(line),
    write: dropALineOnWrite(written),
  };

  assert.equal(embed.main(['plan', '--root', dir], hooks), 0);
  const digest = field(out.join('\n'), 'plan-digest');
  assert.match(digest || '', /^[0-9a-f]{64}$/u);
  out.length = 0;

  const code = embed.main(['apply', '--root', dir, '--plan-digest', digest], hooks);
  const text = out.join('\n');
  trackBackup(t, text);

  assert.equal(code, 1, 'a drop is a failed run');
  assert.ok(written.some((entry) => entry.dropped), 'the seam lost a line on the way to the disk');
  assert.match(text, /STATUS=FAIL/u);
  assert.match(text, /- Never commit a generated file\./u, 'the dropped line is printed');
  assert.match(text, /restored/u);
  assert.equal(readInside(dir, manifest.root_file), original, 'the backup put the file back');
});

test('restore puts every recorded file back byte for byte', (t) => {
  const dir = composeTree(t, 'foreign');
  const before = treeDigest(dir);

  const applied = planAndApply(dir).applied;
  assert.equal(applied.code, 0, `${applied.err}${applied.out}`);
  const backup = trackBackup(t, applied.out);
  assert.ok(fs.existsSync(backup), 'the backup exists after the run');
  assert.ok(treeDigest(dir) !== before, 'the run changed the tree');

  const restored = run([`restore`, `--run=${backup}`], { input: 'yes\n' });
  assert.equal(restored.code, 0, `${restored.err}${restored.out}`);
  assert.match(restored.out, /restore: /u);
  assert.equal(treeDigest(dir), before, 'every recorded file is byte-identical to its backup');
  assert.ok(fs.existsSync(backup), 'the restore keeps the backup');
});

test('restore recreates a removed file and deletes a file the run created', (t) => {
  const dir = composeTree(t, 'claude-only');
  const claude = readInside(dir, 'CLAUDE.md');
  const applied = planAndApply(dir).applied;
  const backup = trackBackup(t, applied.out);
  assert.equal(applied.code, 0, `${applied.err}${applied.out}`);
  assert.equal(existsInside(dir, 'CLAUDE.md'), false, 'the folded copy is gone');
  assert.equal(existsInside(dir, manifest.root_file), true, 'the root document was created');

  const restored = run(['restore', `--run=${backup}`], { input: 'yes\n' });
  assert.equal(restored.code, 0, `${restored.err}${restored.out}`);
  assert.equal(readInside(dir, 'CLAUDE.md'), claude, 'the removed file is recreated byte for byte');
  assert.equal(existsInside(dir, manifest.root_file), false, 'the created file is removed again');
});

test('restore cancels without a yes', (t) => {
  const dir = composeTree(t, 'foreign');
  const applied = planAndApply(dir).applied;
  const backup = trackBackup(t, applied.out);
  const afterApply = treeDigest(dir);

  const cancelled = run(['restore', `--run=${backup}`], { input: 'no\n' });
  assert.equal(cancelled.code, 1, 'a cancelled restore is not a completed one');
  assert.match(cancelled.out, /cancelled/u);
  assert.equal(treeDigest(dir), afterApply, 'a cancelled restore writes nothing');
});

// ─────────────────────────────────────────────────────────────────────────────
// 11. IDEMPOTENCE
// ─────────────────────────────────────────────────────────────────────────────

test('a second run prints NOTHING TO DO', (t) => {
  const dir = composeTree(t, 'foreign');
  const first = planAndApply(dir);
  trackBackup(t, first.applied.out);
  assert.equal(first.applied.code, 0, `${first.applied.err}${first.applied.out}`);
  const afterApply = treeDigest(dir);

  const second = plan(dir);
  assert.equal(second.code, 0, second.err);
  assert.match(second.out, /NOTHING TO DO/u);
  assert.equal(treeDigest(dir), afterApply);

  // The writing target gives the same answer: a digest from the first plan names a
  // composition that no longer differs from the tree, so there is nothing to authorise.
  const again = run(['apply', '--root', dir, '--plan-digest', first.digest]);
  assert.equal(again.code, 0, again.err);
  assert.match(again.out, /NOTHING TO DO/u);
  assert.equal(treeDigest(dir), afterApply);
});

test('a plan on the source repository prints NOTHING TO DO', () => {
  const planned = plan(REPO_ROOT);
  assert.equal(planned.code, 0, planned.err);
  assert.match(planned.out, /NOTHING TO DO/u);
});

// ─────────────────────────────────────────────────────────────────────────────
// 12. THE WRITE ALLOWLIST
// ─────────────────────────────────────────────────────────────────────────────

test('every written path is inside the allowlist and a path outside it is refused', (t) => {
  const dir = composeTree(t, 'adopted');
  // A second copy of the shipped rules, so the router's rows resolve and the run has a
  // mirror and a removal to perform as well as the root document.
  seedRuleCorpus(dir);
  fs.writeFileSync(path.join(dir, manifest.router_file), partialRouter(3), 'utf8');

  const { planned, applied } = planAndApply(dir);
  trackBackup(t, applied.out);
  assert.equal(applied.code, 0, `${applied.err}${applied.out}`);

  const written = targetsOf(planned.out).filter((entry) => entry.action !== 'unchanged');
  assert.ok(written.length > 0, 'the plan names what it will write');
  for (const entry of written) {
    assert.ok(embed.ALLOWLIST.includes(entry.path), `${entry.path} is on the allowlist`);
  }

  assert.doesNotThrow(() => embed.assertWritable(dir, manifest.root_file));
  assert.throws(() => embed.assertWritable(dir, '.skilled/repo-rules/scope-discipline.md'), /allowlist/u);
  assert.throws(() => embed.assertWritable(dir, '../outside-the-root.md'), /outside/u);
  assert.throws(() => embed.assertWritable(dir, '.cursorrules'), /allowlist/u);
});

// A root document that is a link is the one shape where writing would change a file this
// repository does not own, so the run refuses before it backs anything up.
test('a symlinked root document is refused', (t) => {
  const dir = composeTree(t, 'absent');
  const target = path.join(path.dirname(dir), 'shared-agents.md');
  const shared = '# Shared instructions\n\nOne line of a file this tree does not own.\n';
  fs.writeFileSync(target, shared, 'utf8');
  fs.symlinkSync(target, path.join(dir, manifest.root_file));

  const refused = plan(dir);
  assert.equal(refused.code, 2, refused.out);
  assert.match(refused.err, /symlink/u);
  assert.equal(fs.readFileSync(target, 'utf8'), shared, 'the linked file is untouched');
});

test('.codex/AGENTS.md is folded into the block and then removed', (t) => {
  const dir = composeTree(t, 'adopted');
  fs.mkdirSync(path.join(dir, '.codex'), { recursive: true });
  fs.writeFileSync(path.join(dir, '.codex/AGENTS.md'), '# Codex notes\n\nAsk before regenerating the fixtures.\n', 'utf8');

  const applied = planAndApply(dir).applied;
  trackBackup(t, applied.out);
  assert.equal(applied.code, 0, `${applied.err}${applied.out}`);
  assert.equal(existsInside(dir, '.codex/AGENTS.md'), false);
  const block = blockIn(readInside(dir, manifest.root_file));
  assert.match(block, /### Carried from \.codex\/AGENTS\.md/u);
  assert.match(block, /Ask before regenerating the fixtures\./u);
});

// ─────────────────────────────────────────────────────────────────────────────
// 13. THE BACKUP LOCATION
// ─────────────────────────────────────────────────────────────────────────────

test('an ignored output path holds the backup and a non-ignored one falls back', (t) => {
  const dir = composeTree(t, 'forked');

  // The tree is not a git checkout, so the ignore check cannot match and the backup has
  // to leave the repository rather than land somewhere git would commit.
  const planned = plan(dir);
  const backup = field(planned.out, 'backup');
  assert.ok(backup, 'the plan prints the backup location');
  assert.ok(backup.startsWith(os.tmpdir() + path.sep), `${backup} is outside the tree`);
  assert.match(planned.out, /backup-fallback: /u);

  // This repository ignores its output directory, so the same question answers with the
  // path the operator expects there, and the answer creates nothing.
  const here = embed.backupPlan({ root: REPO_ROOT, manifest, stamp: '20260101T000000Z' });
  assert.equal(here.fallback, false, here.reason);
  assert.equal(here.dir, path.join(REPO_ROOT, '.skilled', 'output', 'doctor-agents-md', '20260101T000000Z'));
  assert.equal(fs.existsSync(here.dir), false, 'planning a backup location creates nothing');
});

test('the backup survives the run and records what it holds', (t) => {
  const dir = composeTree(t, 'foreign');
  const original = readInside(dir, manifest.root_file);
  const applied = planAndApply(dir).applied;
  const backup = trackBackup(t, applied.out);
  assert.equal(applied.code, 0, `${applied.err}${applied.out}`);

  assert.ok(fs.existsSync(backup), 'the run leaves the backup in place');
  const record = JSON.parse(fs.readFileSync(path.join(backup, 'manifest.json'), 'utf8'));
  assert.match(record.plan_digest, /^[0-9a-f]{64}$/u);
  const entry = record.paths.find((item) => item.path === manifest.root_file);
  assert.equal(entry.existed, true);
  assert.equal(entry.sha256, crypto.createHash('sha256').update(original, 'utf8').digest('hex'));

  // The engine stages and commits nothing: the restore command is the whole undo.
  assert.doesNotMatch(SOURCE, /git (add|commit|stash)\b/u);
});

// ─────────────────────────────────────────────────────────────────────────────
// 14. THE CLAUDE COPY
// ─────────────────────────────────────────────────────────────────────────────

test('claude-only creates the root document and removes the copy', (t) => {
  const dir = composeTree(t, 'claude-only');
  // The same sentence twice in the copy stays twice in the block, because the proof counts
  // occurrences rather than membership.
  fs.appendFileSync(path.join(dir, 'CLAUDE.md'), 'Run `make check` before you open a pull request.\n');
  const claude = readInside(dir, 'CLAUDE.md');

  const applied = planAndApply(dir).applied;
  trackBackup(t, applied.out);
  assert.equal(applied.code, 0, `${applied.err}${applied.out}`);
  assert.equal(existsInside(dir, manifest.root_file), true);
  assert.equal(existsInside(dir, 'CLAUDE.md'), false);

  const composed = readInside(dir, manifest.root_file);
  const block = blockIn(composed);
  for (const line of trimmedLines(claude)) {
    assert.equal(occurrences(block, line), occurrences(claude, line), `${line} survives once per occurrence`);
  }
});

test('--keep-claude-md keeps the copy it folded', (t) => {
  const dir = composeTree(t, 'claude-only');
  const claude = readInside(dir, 'CLAUDE.md');

  const applied = planAndApply(dir, ['--keep-claude-md']).applied;
  trackBackup(t, applied.out);
  assert.equal(applied.code, 0, `${applied.err}${applied.out}`);
  assert.equal(readInside(dir, 'CLAUDE.md'), claude, 'the copy is untouched');
  const block = blockIn(readInside(dir, manifest.root_file));
  assert.ok(block.includes('Run `make check` before you open a pull request.'), 'and its lines still reached the block');
});

// ─────────────────────────────────────────────────────────────────────────────
// 15. THE ROUTER
// ─────────────────────────────────────────────────────────────────────────────

test('a router missing shipped rows gains exactly those rows', (t) => {
  const dir = composeTree(t, 'pure');
  seedRuleCorpus(dir);
  const partial = partialRouter(3);
  fs.writeFileSync(path.join(dir, manifest.router_file), partial, 'utf8');

  const applied = planAndApply(dir).applied;
  trackBackup(t, applied.out);
  assert.equal(applied.code, 0, `${applied.err}${applied.out}`);

  const router = readInside(dir, manifest.router_file);
  for (const line of partial.split('\n').filter((entry) => entry.trim() !== '')) {
    assert.ok(router.includes(line), `${line} was not touched`);
  }
  assert.equal(tableRows(router, 'TRIGGER TABLE').length, shippedRows().trigger_rows.length);
  assert.equal(tableRows(router, 'INDEX').length, shippedRows().index_rows.length);

  const checked = runRepoRulesChecker(dir);
  assert.equal(checked.code, 0, checked.out);
  assert.match(checked.out, /RESULT: PASSED \(11\/11 checks\)/u);
});

test('a missing router is created only when asked for', (t) => {
  const dir = composeTree(t, 'pure');
  seedRuleCorpus(dir);

  const quiet = plan(dir);
  assert.equal(quiet.code, 0, quiet.err);
  assert.match(quiet.out, /NOTHING TO DO/u);
  assert.equal(existsInside(dir, manifest.router_file), false);

  const applied = planAndApply(dir, ['--create-router']).applied;
  trackBackup(t, applied.out);
  assert.equal(applied.code, 0, `${applied.err}${applied.out}`);
  assert.equal(existsInside(dir, manifest.router_file), true);

  const checked = runRepoRulesChecker(dir);
  assert.equal(checked.code, 0, checked.out);
  assert.match(checked.out, /RESULT: PASSED \(11\/11 checks\)/u);
});

// ─────────────────────────────────────────────────────────────────────────────
// 16. THE CURSOR MIRROR
// ─────────────────────────────────────────────────────────────────────────────

test('.cursor/rules/repo-local.md exists exactly when the block carries content', (t) => {
  const empty = composeTree(t, 'absent');
  const emptyApplied = planAndApply(empty).applied;
  trackBackup(t, emptyApplied.out);
  assert.equal(emptyApplied.code, 0, `${emptyApplied.err}${emptyApplied.out}`);
  assert.equal(existsInside(empty, manifest.root_file), true, 'the template arrives');
  assert.equal(existsInside(empty, '.cursor/rules/repo-local.md'), false, 'an empty block has nothing to mirror');
  assert.equal(existsInside(empty, manifest.router_file), false, 'a router nobody asked for is not created');

  const carried = composeTree(t, 'foreign');
  const carriedApplied = planAndApply(carried).applied;
  trackBackup(t, carriedApplied.out);
  assert.equal(carriedApplied.code, 0, `${carriedApplied.err}${carriedApplied.out}`);
  const mirror = readInside(carried, '.cursor/rules/repo-local.md');
  assert.match(mirror, /^---\nalwaysApply: true\n---\n/u);
  for (const line of trimmedLines(blockIn(readInside(carried, manifest.root_file)))) {
    assert.ok(mirror.includes(line), `${line} reaches the mirror`);
  }
});
