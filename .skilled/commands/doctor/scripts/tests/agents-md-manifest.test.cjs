#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Shipped Manifest and Segmenter Tests
// ───────────────────────────────────────────────────────────────────
'use strict';

// The manifest claims to hold the template a consumer receives, so its claims have to be
// checkable without trusting the file that makes them: the segmenter must tile the root
// document, the generator must refuse a surface it does not recognise, every pin's
// consumer must still hold the text the pin promises, the authored ceilings must be the
// ones the canary enforces, and the rule-copy canary must find its own AGENTS.md strings
// inside the pin set alone.
//
// The suite ships with the manifest into consumer repositories, whose root AGENTS.md is
// their own file. The cases that read this repository's root document are therefore
// gated on the origin remote naming the manifest's source repository; everywhere else
// they skip and print the reason, so a consumer sees why instead of a wall of failures.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS AND PATHS
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const { classifyBody, matchSections, segment, sha256 } = require('../lib/agents-md-sections.cjs');
const {
  MANIFEST_PATH,
  composeDerived,
  dedupeBodies,
  limitDrift,
  main,
  readCanaryLimits,
  sourceStatus,
} = require('../agents-md-manifest.cjs');

const SCRIPTS_DIR = path.resolve(__dirname, '..');
const REPO_ROOT = path.resolve(SCRIPTS_DIR, '../../../..');
const GENERATOR = path.join(SCRIPTS_DIR, 'agents-md-manifest.cjs');
const CANARY = path.join(REPO_ROOT, '.skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js');
const MANIFEST_RELATIVE = '.skilled/commands/doctor/assets/agents-md-manifest.json';

const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
const rootText = fs.readFileSync(path.join(REPO_ROOT, manifest.root_file), 'utf8');

// One answer for every case that reads this repository's own root document.
const source = sourceStatus({ root: REPO_ROOT, manifest });
const NOT_SOURCE = source.isSource ? false : source.reason;

// ─────────────────────────────────────────────────────────────────────────────
// 2. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function runGenerator(args, env = process.env) {
  const result = spawnSync(process.execPath, [GENERATOR, ...args], { encoding: 'utf8', env });
  return { code: result.status, out: result.stdout || '', err: result.stderr || '' };
}

// A throwaway directory the case removes itself, so a failed assertion never leaves a
// tree behind for the next run to read.
function scratch(t) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'agents-md-manifest-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  return dir;
}

function copyManifest(dir) {
  const target = path.join(dir, 'agents-md-manifest.json');
  fs.copyFileSync(MANIFEST_PATH, target);
  return target;
}

// The canary resolves its other pins under --root, so a throwaway root still needs the
// skill tree. A symlink keeps that free; a filesystem without symlinks falls back to a
// copy that skips the installed packages.
function linkSkills(tempRoot) {
  try {
    fs.symlinkSync(path.join(REPO_ROOT, '.skilled'), path.join(tempRoot, '.skilled'), 'dir');
  } catch {
    fs.cpSync(path.join(REPO_ROOT, '.skilled'), path.join(tempRoot, '.skilled'), {
      recursive: true,
      filter: (from) => !from.split(path.sep).includes('node_modules'),
    });
  }
}

function blockLines(content) {
  return content
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line !== '');
}

function derivedOf(id) {
  const entry = manifest.derived.sections[id];
  assert.ok(entry, `the manifest's derived key holds section ${id}`);
  return entry;
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. SOURCE-REPOSITORY GATE
// ─────────────────────────────────────────────────────────────────────────────

test('source gate: a foreign origin yields a skip reason that names it', () => {
  const foreign = 'https://example.invalid/someone-else/their-fork.git';
  const answer = sourceStatus({ root: REPO_ROOT, manifest, readOrigin: () => foreign });

  assert.equal(answer.isSource, false);
  assert.match(answer.reason, /example\.invalid\/someone-else\/their-fork/, 'the reason names the origin it read');
  assert.match(answer.reason, /manifest\.source_repository/, 'the reason names what it compared against');
});

test('source gate: this worktree is the source repository', { skip: NOT_SOURCE }, () => {
  assert.equal(source.isSource, true, `origin ${source.origin} matches the manifest`);
  assert.match(source.identity, /^[A-Za-z0-9._-]+\/[A-Za-z0-9._-]+$/);
});

// ─────────────────────────────────────────────────────────────────────────────
// 4. SEGMENTER
// ─────────────────────────────────────────────────────────────────────────────

test('segmenter: 44 sections tile the root document and their start bytes match the table', { skip: NOT_SOURCE }, () => {
  const { sections, block } = segment(rootText, manifest.markers, manifest.sections);
  assert.ok(block, 'the published template carries the repository block');

  assert.equal(sections.length, 44, 'the shipped surface is 44 headings deep');
  assert.equal(manifest.sections.length, 44, 'every authored entry is one shipped section');
  assert.equal(sections[0].start, 0, 'the first section starts at byte 0');

  for (let index = 0; index < sections.length; index += 1) {
    const section = sections[index];
    const recorded = derivedOf(section.id);
    assert.equal(section.start, recorded.start, `section ${section.id}: start byte`);
    assert.equal(section.end, recorded.end, `section ${section.id}: end byte`);
    assert.equal(section.sha256, recorded.sha256, `section ${section.id}: body hash`);
    assert.equal(section.body, recorded.body, `section ${section.id}: body`);
    if (index > 0) {
      assert.equal(section.start, sections[index - 1].end, `section ${section.id} starts where the previous one ends`);
    }
  }
  assert.equal(sections[sections.length - 1].end, block.start, 'the last section runs to where the repository block begins');
});

test('segmenter: every authored match prefix finds exactly one section, at its heading', { skip: NOT_SOURCE }, () => {
  const { sections } = segment(rootText, manifest.markers);
  const { matched, unregistered, unmatched } = matchSections(sections, manifest.sections);

  assert.deepEqual(unregistered, [], 'no heading is left unregistered');
  assert.deepEqual(unmatched, [], 'no authored entry matches nothing');
  assert.equal(matched.length, 44);

  for (const row of matched) {
    assert.equal(row.section.heading.includes(row.entry.match), true, `${row.entry.id}: the match prefix is part of the heading`);
    assert.equal(row.entry.level, row.section.level, `${row.entry.id}: heading level`);
  }
});

test('segmenter: the block heading is not a shipped section', () => {
  const text = [
    '# Root',
    '',
    '## Shipped section',
    '',
    'body line',
    '',
    manifest.markers.start,
    manifest.markers.heading,
    '',
    manifest.markers.note,
    manifest.markers.end,
    '',
  ].join('\n');
  const { sections, block } = segment(text, manifest.markers);

  assert.equal(sections.length, 2, 'the block heading belongs to the block, not to the shipped surface');
  assert.equal(block.complete, true);
  assert.deepEqual(blockLines(block.content), [manifest.markers.heading, manifest.markers.note], 'the empty block holds no repository content');
  assert.equal(sections[1].end, block.start, 'the last shipped section ends where the block begins');
});

// A repository documents the block by writing its markers inside a sentence. The same bytes
// are the block's edge only when the line carries nothing else, because an edge in the
// middle of a line leaves the text on either side in no section, in no prelude and in no
// block, where a rewrite deletes it and nothing is left holding a claim about it.
test('segmenter: a marker is the whole line, and the block reports the lines it owns', () => {
  const shipped = manifest.sections.map((entry) => manifest.derived.sections[entry.id].body).join('');
  const quoted = 'The block is fenced by `<!-- skilled:repo-local:start -->` and `<!-- skilled:repo-local:end -->` in this framework.';

  const prose = segment(`${shipped}${quoted}\n`, manifest.markers, manifest.sections);
  assert.equal(prose.block, null, 'prose that quotes both markers is not a block');
  assert.ok(prose.sections[prose.sections.length - 1].body.includes(quoted), 'the sentence is a line of the section it ends');
  assert.equal(prose.prelude, null, 'nothing sits above the first heading');

  // Whitespace around a marker does not stop it being one, and the block names the line
  // range it owns so a caller that reports where it sits has the figure already.
  const block = [`  ${manifest.markers.start}`, manifest.markers.heading, '', manifest.markers.note, `  ${manifest.markers.end}`, ''].join('\n');
  const found = segment(`${shipped}${block}`, manifest.markers);
  assert.equal(found.block.complete, true, 'an indented marker line is still a marker line');
  assert.equal(found.block.markerLines.start.length, 1);
  assert.equal(found.block.rows.last - found.block.rows.first + 1, block.split('\n').length - 1, 'the block owns its five lines, markers included');
});

// ─────────────────────────────────────────────────────────────────────────────
// 5. GENERATOR REFUSALS
// ─────────────────────────────────────────────────────────────────────────────

test('generator refusal: a heading no authored entry matches exits 1 and names it', (t) => {
  const dir = scratch(t);
  // Inside the shipped surface, above the repository block: a heading added there would
  // be dropped from every consumer's template at the next release.
  const at = rootText.indexOf(manifest.markers.start);
  const injected = `${rootText.slice(0, at)}#### A Heading The Template Never Shipped\n\n${rootText.slice(at)}`;
  fs.writeFileSync(path.join(dir, manifest.root_file), injected);
  const result = runGenerator(['--check', '--root', dir]);

  assert.equal(result.code, 1, `exit 1, stdout=${result.out} stderr=${result.err}`);
  assert.match(`${result.err}${result.out}`, /A Heading The Template Never Shipped/);
  assert.match(`${result.err}${result.out}`, /unregistered/i);
});

test('generator refusal: an authored entry that matches nothing exits 1 and names it', (t) => {
  const dir = scratch(t);
  const copy = copyManifest(dir);
  const edited = JSON.parse(fs.readFileSync(copy, 'utf8'));
  edited.sections.push({ id: 'a-section-that-does-not-exist', match: '#### Never Written', level: 4, parent: 'four-laws' });
  fs.writeFileSync(copy, `${JSON.stringify(edited, null, 2)}\n`);

  const result = runGenerator(['--check', '--root', REPO_ROOT, '--manifest', copy]);
  assert.equal(result.code, 1, `exit 1, stdout=${result.out} stderr=${result.err}`);
  assert.match(`${result.err}${result.out}`, /a-section-that-does-not-exist/);
  assert.match(`${result.err}${result.out}`, /no heading matches/i);
});

test('generator: a missing root file exits 2 with a named cause and writes nothing', (t) => {
  const dir = scratch(t);
  const copy = copyManifest(dir);
  const before = fs.readFileSync(copy, 'utf8');
  const result = runGenerator(['--check', '--root', dir, '--manifest', copy]);

  assert.equal(result.code, 2, `exit 2, stdout=${result.out} stderr=${result.err}`);
  assert.match(`${result.err}${result.out}`, /AGENTS\.md/);
  assert.equal(fs.readFileSync(copy, 'utf8'), before, 'the manifest is untouched');
});

// Text above the first heading belongs to no section, so no derived body can carry it and
// a `--write` would persist a copy of the template that quietly omits the line. The check
// engine reports that text; the generator has to refuse it for the same reason.
test('generator refusal: text above the first heading exits 1 and names the line', (t) => {
  const dir = scratch(t);
  const template = manifest.sections.map((entry) => manifest.derived.sections[entry.id].body).join('');
  const line = 'Read this first: the harness ships these instructions.';
  fs.writeFileSync(path.join(dir, manifest.root_file), `${line}\n${template}`);

  const composed = composeDerived({ root: dir, manifest, history: [] });
  assert.equal(composed.ok, false, 'a template with a prelude is not the clean surface the derived key describes');
  const prelude = (composed.errors || []).find((error) => error.code === 'unmarked-prelude');
  assert.ok(prelude, `the refusal names the text above the first heading: ${JSON.stringify(composed.errors)}`);
  assert.match(prelude.message, /before its first heading/u);
  assert.match(prelude.message, /line 1\b/u, 'the message names the line it sits on');
  assert.ok(prelude.message.includes(line), 'and carries the line itself');

  const result = runGenerator(['--check', '--root', dir]);
  assert.equal(result.code, 1, `exit 1, stdout=${result.out} stderr=${result.err}`);
  assert.match(`${result.err}${result.out}`, /unmarked-prelude/u);
  assert.match(`${result.err}${result.out}`, /before its first heading/u);
});

test('generator: --write outside the source repository exits 2 and names the origin', (t) => {
  const dir = scratch(t);
  const copy = copyManifest(dir);
  const before = fs.readFileSync(copy, 'utf8');
  const result = runGenerator(['--write', '--root', dir, '--manifest', copy]);

  assert.equal(result.code, 2, `exit 2, stdout=${result.out} stderr=${result.err}`);
  assert.match(`${result.err}${result.out}`, /source repository/);
  assert.equal(fs.readFileSync(copy, 'utf8'), before, 'the manifest is untouched');
});

test('generator: a CI job names its own checkout, so another root is still refused', (t) => {
  const dir = scratch(t);
  const copy = copyManifest(dir);
  const env = {
    ...process.env,
    GITHUB_REPOSITORY: manifest.source_repository.replace(/^https:\/\/github\.com\//, ''),
    GITHUB_WORKSPACE: REPO_ROOT,
  };
  const result = runGenerator(['--write', '--root', dir, '--manifest', copy], env);

  assert.equal(result.code, 2, `exit 2, stdout=${result.out} stderr=${result.err}`);
  assert.match(`${result.err}${result.out}`, /source repository/);
});

// ─────────────────────────────────────────────────────────────────────────────
// 6. DERIVED KEY FRESHNESS
// ─────────────────────────────────────────────────────────────────────────────

test('derived key: --check passes and names the section and pin counts', { skip: NOT_SOURCE }, () => {
  const result = runGenerator(['--check']);
  assert.equal(result.code, 0, `exit 0, stdout=${result.out} stderr=${result.err}`);
  assert.match(result.out, new RegExp(`PASS: 44 sections, ${manifest.pins.length} pins, derived matches AGENTS\\.md`));
});

test('derived key: a one-byte edit to a copy of a derived body exits 1', (t) => {
  const dir = scratch(t);
  const copy = copyManifest(dir);
  const edited = JSON.parse(fs.readFileSync(copy, 'utf8'));
  const id = Object.keys(edited.derived.sections)[10];
  const entry = edited.derived.sections[id];
  const position = entry.body.indexOf('\n') + 1;
  const flipped = entry.body[position] === 'x' ? 'y' : 'x';
  entry.body = `${entry.body.slice(0, position)}${flipped}${entry.body.slice(position + 1)}`;
  fs.writeFileSync(copy, `${JSON.stringify(edited, null, 2)}\n`);

  const result = runGenerator(['--check', '--root', REPO_ROOT, '--manifest', copy]);
  assert.equal(result.code, 1, `exit 1, stdout=${result.out} stderr=${result.err}`);
  assert.match(`${result.err}${result.out}`, new RegExp(id), 'the failure names the section that drifted');
});

test('derived key: --write composes the same derived key and writes only the manifest', { skip: NOT_SOURCE }, (t) => {
  const dir = scratch(t);
  const copy = copyManifest(dir);
  const writes = [];
  const realWrite = fs.writeFileSync;
  fs.writeFileSync = (file, ...rest) => {
    writes.push(path.resolve(String(file)));
    return realWrite(file, ...rest);
  };
  let code;
  try {
    code = main(['--write', '--root', REPO_ROOT, '--manifest', copy]);
  } finally {
    fs.writeFileSync = realWrite;
  }

  assert.equal(code, 0);
  assert.deepEqual(writes, [path.resolve(copy)], 'exactly one path is written, and it is the manifest');
  const written = JSON.parse(fs.readFileSync(copy, 'utf8'));
  assert.deepEqual(written.derived.sections, manifest.derived.sections);
});

test('derived key: the router rows come from the router file', { skip: NOT_SOURCE }, () => {
  const composed = composeDerived({ root: REPO_ROOT, manifest });
  assert.equal(composed.ok, true, JSON.stringify(composed.errors));
  assert.ok(composed.derived.repo_rules.trigger_rows.length >= 10, 'the trigger table is carried');
  assert.ok(composed.derived.repo_rules.index_rows.length >= 10, 'the index table is carried');
  assert.deepEqual(composed.derived.repo_rules, manifest.derived.repo_rules);
});

// ─────────────────────────────────────────────────────────────────────────────
// 7. PINS AND THEIR CONSUMERS
// ─────────────────────────────────────────────────────────────────────────────

test('pins: every consumer file still holds the text its pin promises', () => {
  assert.ok(manifest.pins.length >= 28, 'the pin set covers the canary strings, the delivery anchors and the tooling reads');
  for (const pin of manifest.pins) {
    const consumerPath = path.join(REPO_ROOT, pin.consumer);
    assert.ok(fs.existsSync(consumerPath), `${pin.id}: consumer ${pin.consumer} exists`);
    assert.ok(
      Array.isArray(pin.consumer_evidence) && pin.consumer_evidence.length > 0,
      `${pin.id}: names the evidence its consumer still holds`,
    );
    const consumerText = fs.readFileSync(consumerPath, 'utf8');
    for (const evidence of pin.consumer_evidence) {
      assert.equal(
        consumerText.includes(evidence),
        true,
        `${pin.id}: ${pin.consumer} no longer holds ${JSON.stringify(evidence)}`,
      );
    }
  }
});

// A pin whose text nobody reads is a stale copy waiting for a rename to pass unnoticed, so
// the strings are checked where the document itself puts them, not just their consumers.
test('pins: every pinned string still sits inside the section it names', { skip: NOT_SOURCE }, () => {
  const { sections } = segment(rootText, manifest.markers, manifest.sections);
  for (const pin of manifest.pins) {
    if (!pin.section) continue;
    const section = sections.find((candidate) => candidate.id === pin.section);
    assert.ok(section, `${pin.id}: names a shipped section`);
    for (const text of pin.texts) {
      assert.equal(section.body.includes(text), true, `${pin.id}: ${pin.section} no longer holds ${JSON.stringify(text)}`);
    }
  }
});

test('pins: the rule-copy canary finds every AGENTS.md string inside the pin set', { skip: NOT_SOURCE }, (t) => {
  const dir = scratch(t);
  linkSkills(dir);
  // Every pin text, one per line, and nothing else, so a canary string the pin set misses
  // has no other place to come from.
  fs.writeFileSync(path.join(dir, manifest.root_file), `${manifest.pins.flatMap((pin) => pin.texts).join('\n')}\n`);

  const result = spawnSync(process.execPath, [CANARY, '--root', dir], { encoding: 'utf8' });
  const output = `${result.stdout}${result.stderr}`;
  assert.equal(result.status, 0, `the canary passes on the pin set alone:\n${output}`);
  assert.match(output, /OK: all rule invariants present/);
  assert.doesNotMatch(output, /MISSING: AGENTS\.md/);
});

test('pins: the gate 1 lookup first appears inside its named section', { skip: NOT_SOURCE }, () => {
  const pin = manifest.pins.find((entry) => entry.id === 'gate1-lookup');
  assert.ok(pin, 'the gate 1 lookup is a pin');
  const { sections } = segment(rootText, manifest.markers, manifest.sections);
  const gateOne = sections.find((section) => section.id === pin.section);
  const first = Buffer.byteLength(rootText.slice(0, rootText.indexOf(pin.texts[0])), 'utf8');
  assert.ok(first >= gateOne.start && first < gateOne.end, `first occurrence at ${first} sits inside ${pin.section}`);
});

test('pins: each delivery anchor ends inside the delivery prefix', { skip: NOT_SOURCE }, () => {
  const { sections } = segment(rootText, manifest.markers, manifest.sections);
  const anchors = manifest.pins.filter((pin) => pin.kind === 'delivery-anchor');
  assert.equal(anchors.length, manifest.budget.anchor_count, 'the pinned anchor count matches the budget key');

  let deepest = null;
  for (const anchor of anchors) {
    const end = anchorEndByte(anchor, sections);
    assert.notEqual(end, null, `${anchor.id}: the anchor text is present in ${anchor.section}`);
    assert.ok(end <= manifest.budget.prefix_bytes, `${anchor.id}: ends at ${end}, inside ${manifest.budget.prefix_bytes}`);
    if (deepest === null || end > deepest.end) deepest = { id: anchor.id, end };
  }
  assert.equal(deepest.id, manifest.budget.last_anchor_id, 'the deepest anchor is the one the budget names');
  assert.equal(deepest.id, 'anchor-blast-radius-management', 'the deepest anchor is the blast-radius section');
});

function anchorEndByte(anchor, sections) {
  const section = sections.find((candidate) => candidate.id === anchor.section);
  if (!section) return null;
  if (anchor.scope !== 'line') return section.end;

  let byte = section.start;
  for (const line of section.body.split('\n')) {
    const next = byte + Buffer.byteLength(line, 'utf8') + 1;
    if (line.includes(anchor.texts[0])) return next;
    byte = next;
  }
  return null;
}

test('pins: the recorded delivery-prefix end is the one the canary reports', { skip: NOT_SOURCE }, () => {
  const result = spawnSync(process.execPath, [CANARY], { encoding: 'utf8', cwd: REPO_ROOT });
  assert.equal(result.status, 0, `the canary passes:\n${result.stdout}${result.stderr}`);

  const rows = result.stdout
    .split('\n')
    .map((line) => line.match(/^\s*(\d+)\s+(\S.*)$/u))
    .filter((match) => match !== null)
    .map((match) => ({ bytes: Number(match[1]), text: match[2] }));
  assert.ok(rows.length >= manifest.budget.anchor_count, 'the canary reports at least every pinned anchor');

  const deepest = rows.reduce((best, row) => (best === null || row.bytes > best.bytes ? row : best), null);
  assert.equal(deepest.text, '#### Blast-Radius Management', 'the deepest anchor is still the blast-radius clause');
  assert.equal(deepest.bytes, manifest.derived.budget.prefix_end_bytes, 'the manifest records the byte the canary measured');
});

// ─────────────────────────────────────────────────────────────────────────────
// 8. RELEASE-TAG HISTORY
// ─────────────────────────────────────────────────────────────────────────────

test('history: bodies are deduped by sha256 and never repeat a current body', () => {
  const bodies = [
    { body: '# One\n', tag: 'v1' },
    { body: '# One\n', tag: 'v2' },
    { body: '# Two\n', tag: 'v3' },
    { body: '# Two\n', tag: 'v4' },
  ];
  const known = new Set([sha256('# Two\n')]);
  const deduped = dedupeBodies(bodies, known);

  assert.equal(deduped.length, 1, 'a body given twice is stored once, and a current body is not stored at all');
  assert.equal(deduped[0].sha256, sha256('# One\n'));
  assert.equal(deduped[0].first_tag, 'v1', 'the first tag that carried the body is recorded');
});

test('history: the derived key holds one entry per distinct body', { skip: NOT_SOURCE }, () => {
  const history = manifest.derived.history;
  console.log(`[agents-md-manifest] history bodies: ${history.length}, read from the last ${manifest.history.tags} release tags`);

  const seen = new Set();
  const current = new Set(Object.values(manifest.derived.sections).map((section) => section.sha256));
  for (const entry of history) {
    assert.equal(seen.has(entry.sha256), false, `history body ${entry.sha256} appears once`);
    seen.add(entry.sha256);
    assert.equal(sha256(entry.body), entry.sha256, 'the recorded hash is the body hash');
    assert.equal(current.has(entry.sha256), false, 'a current body is not repeated in the history');
  }
});

// A shallow CI checkout fetches no tags. Its empty tag list is not a release that dropped a
// body, so the comparison is skipped there and the gate still passes; this reproduces that
// checkout with the source origin and no tags at all.
test('history: a checkout holding no release tags skips the comparison and passes', { skip: NOT_SOURCE }, (t) => {
  const dir = scratch(t);
  fs.copyFileSync(path.join(REPO_ROOT, manifest.root_file), path.join(dir, manifest.root_file));
  fs.copyFileSync(path.join(REPO_ROOT, manifest.router_file), path.join(dir, manifest.router_file));
  const copy = copyManifest(dir);
  const git = (...args) => spawnSync('git', ['-C', dir, ...args], { encoding: 'utf8' });

  const init = git('init', '--quiet');
  assert.equal(init.status, 0, `a throwaway repository is initialised: ${init.stderr}`);
  const remote = git('remote', 'add', 'origin', manifest.source_repository);
  assert.equal(remote.status, 0, `the origin names the source repository: ${remote.stderr}`);
  assert.equal(git('tag', '--list').stdout.trim(), '', 'the checkout holds no release tags');

  const result = runGenerator(['--check', '--root', dir, '--manifest', copy]);
  assert.equal(result.code, 0, `exit 0, stdout=${result.out} stderr=${result.err}`);
  assert.match(result.out, /history was not compared because no release tags are available/);
  assert.match(result.out, /PASS: 44 sections/);
});

// ─────────────────────────────────────────────────────────────────────────────
// 9. CLASSIFIER
// ─────────────────────────────────────────────────────────────────────────────

test('classifier: a body is current, stale-known, edited or unknown-base', { skip: NOT_SOURCE }, () => {
  const current = manifest.derived.sections['gate-1'];
  const known = {
    current: Object.entries(manifest.derived.sections).map(([id, entry]) => ({ id, sha256: entry.sha256, body: entry.body })),
    history: manifest.derived.history,
  };

  assert.equal(classifyBody(current.body, known).state, 'current');

  const stale = known.history[0];
  const staleAnswer = classifyBody(stale.body, known);
  assert.equal(staleAnswer.state, 'stale-known');
  assert.equal(staleAnswer.base, stale.sha256);

  const editedLines = current.body.split('\n');
  editedLines[1] = `- **Local tightening.** ${editedLines[1]}`;
  const edited = classifyBody(editedLines.join('\n'), known);
  assert.equal(edited.state, 'edited', 'one changed line leaves the closest base identifiable');
  assert.equal(edited.base, current.sha256);

  assert.equal(classifyBody('# A document from somewhere else\n\nNothing shared here.\n', known).state, 'unknown-base');
});

// ─────────────────────────────────────────────────────────────────────────────
// 10. MANIFEST SHAPE AND THE TEMPLATE BLOCK
// ─────────────────────────────────────────────────────────────────────────────

test('manifest: every required key is present and the file sits at its documented path', () => {
  for (const key of ['schema_version', 'source_repository', 'root_file', 'router_file', 'markers', 'budget', 'history', 'sections', 'pins', 'runtime_copies', 'derived']) {
    assert.ok(Object.prototype.hasOwnProperty.call(manifest, key), `manifest key ${key}`);
  }
  assert.equal(manifest.sections.length, 44);
  assert.equal(manifest.root_file, 'AGENTS.md');
  assert.equal(fs.existsSync(path.join(REPO_ROOT, MANIFEST_RELATIVE)), true, 'the manifest lives at its documented path');
});

test('manifest: the template carries exactly one empty marked block after the last section', { skip: NOT_SOURCE }, () => {
  assert.equal(rootText.split(manifest.markers.start).length - 1, 1, 'exactly one start marker');
  assert.equal(rootText.split(manifest.markers.end).length - 1, 1, 'exactly one end marker');
  assert.ok(rootText.indexOf(manifest.markers.start) < rootText.indexOf(manifest.markers.end), 'start before end');

  const { sections, block } = segment(rootText, manifest.markers, manifest.sections);
  assert.ok(block, 'the block is present');
  assert.equal(block.complete, true, 'both markers are present and ordered');
  assert.ok(sections[sections.length - 1].end <= block.start, 'the block sits after the last shipped section');
  assert.deepEqual(blockLines(block.content), [manifest.markers.heading, manifest.markers.note], 'the shipped block is empty');
});

test('manifest: the measured budget is recorded and inside the canary ceiling', { skip: NOT_SOURCE }, () => {
  const limits = readCanaryLimits();
  assert.equal(limits.ok, true, `the canary's ceilings are readable: ${limits.reason}`);
  assert.deepEqual(
    Object.keys(manifest.budget).sort(),
    ['anchor_count', 'last_anchor_id', 'max_bytes', 'prefix_bytes'],
    'the authored budget names decisions; the document size is only ever measured',
  );
  assert.equal(manifest.budget.max_bytes, limits.maxBytes, 'the authored ceiling is the one the canary enforces');

  const total = Buffer.byteLength(rootText, 'utf8');
  assert.equal(manifest.derived.budget.total_bytes, total, 'the recorded document size is the live one');
  assert.ok(total <= limits.maxBytes, `${total} bytes is inside the canary's ${limits.maxBytes}-byte ceiling`);

  const { sections } = segment(rootText, manifest.markers, manifest.sections);
  const blast = sections.find((section) => section.id === 'blast-radius');
  assert.equal(manifest.derived.budget.prefix_end_bytes, blast.end, 'the recorded delivery-prefix end is the live one');
  assert.ok(blast.end <= manifest.budget.prefix_bytes, `the delivery prefix ends at ${blast.end}, inside ${manifest.budget.prefix_bytes}`);
});

test('limits: the canary states the ceiling and the concepts the pins claim', { skip: NOT_SOURCE }, () => {
  const limits = readCanaryLimits();
  assert.equal(limits.ok, true, limits.reason);
  assert.equal(manifest.budget.prefix_bytes, limits.prefixBytes, 'the authored delivery prefix is the canary prefixBytes');

  const ceiling = manifest.pins.find((pin) => pin.id === 'max-bytes');
  assert.equal(ceiling.limit_key, 'max_bytes', 'the byte-ceiling pin names the budget key it is about');
  assert.ok(ceiling.texts.includes(String(limits.maxBytes)), 'the pinned text is the ceiling the canary enforces');

  const ironLaw = manifest.pins.find((pin) => pin.id === 'iron-law');
  for (const concept of limits.ironLawRequired) {
    assert.ok(ironLaw.requires.includes(concept), `the iron law pin requires ${JSON.stringify(concept)}`);
  }

  assert.deepEqual(limitDrift(manifest, limits), [], 'the manifest and the canary agree today');
});

test('limits: a budget ceiling the canary does not state exits 1', { skip: NOT_SOURCE }, (t) => {
  const dir = scratch(t);
  const copy = copyManifest(dir);
  const edited = JSON.parse(fs.readFileSync(copy, 'utf8'));
  edited.budget.max_bytes = 40960;
  fs.writeFileSync(copy, `${JSON.stringify(edited, null, 2)}\n`);

  const result = runGenerator(['--check', '--root', REPO_ROOT, '--manifest', copy]);
  assert.equal(result.code, 1, `exit 1, stdout=${result.out} stderr=${result.err}`);
  assert.match(`${result.err}${result.out}`, /max_bytes: the manifest states 40960, the canary enforces 32768/);
  assert.doesNotMatch(result.err, /--write/, 'no regeneration is offered, because no write can change an authored ceiling');
});
