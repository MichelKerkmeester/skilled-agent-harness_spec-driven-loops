// ───────────────────────────────────────────────────────────────────
// MODULE: sk-code-quality Gate Runner Tests — Explain Output and Rule Overrides
// ───────────────────────────────────────────────────────────────────
'use strict';

// Each case seeds a repository checklist that carries a ## Rule overrides section, then
// reads either the run or its read-only explanation, so the group covers the seats a
// checklist reaches, the rows a run records, and the conflicts it leaves open.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const { OUTSIDE_SKILL, OUTSIDE_SURFACE, OUTSIDE_CHECKLIST, OUTSIDE_CHECKLISTS, withRepo, check, writeOutsideSkill, SYMLINK_SUPPORT, fakePython, envelopeFields, HYGIENE_REPORT } = require('./quality-gate-helpers.cjs');
const { assertSnapshotUnchanged, trustRepoChecks } = require('./fixtures.cjs');
const { lintOverrides } = require('../../../shared/scripts/check-rule-overrides.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS AND HELPERS
// ─────────────────────────────────────────────────────────────────────────────

// A repository checklist that a foreign file reaches by path, so an explanation of that file
// lists a seat no hub declaration can supply.
const FOREIGN_CONFIG = `${JSON.stringify({
  schemaVersion: 1,
  checklists: [
    { file: 'checks/valid.md', paths: ['src/**'] },
    { file: 'checks/floor.md', paths: ['src/**'] },
  ],
}, null, 2)}\n`;

const VALID_OVERRIDES = [
  '# Team checklist', '', '## Rule overrides', '',
  '| Rule | Action | Reason |', '| --- | --- | --- |',
  '| `review.function-length` | replace: A function stays under 60 lines | The team limit |',
  '| `hygiene.task` | none | Tickets live in the tracker |', '',
].join('\n');

const FLOOR_OVERRIDES = [
  '# Floor attempt', '', '## Rule overrides', '',
  '| Rule | Action | Reason |', '| --- | --- | --- |',
  '| `secret.aws-access-key` | none | Keys are fine here |', '',
].join('\n');

const EXPLAIN_TOP_KEYS = Object.freeze(['schema', 'status', 'exit_code', 'file', 'language', 'language_source', 'unchecked',
  'surfaces', 'surface_skills', 'config', 'checklists', 'checks', 'rule_conflicts', 'files', 'errors', 'note']);

const EXPLAIN_FILE_KEYS = Object.freeze(['file', 'language', 'language_source', 'unchecked', 'surfaces', 'surface_skills', 'checklists', 'checks',
  'rule_conflicts']);

function explainedFile(verdict, rel) {
  return verdict.files.find((entry) => entry.file === rel);
}

function overrideSection(title, rows) {
  return [`# ${title}`, '', '## Rule overrides', '', '| Rule | Action | Reason |', '| --- | --- | --- |', ...rows, ''].join('\n');
}

function repoChecklists(...files) {
  return `${JSON.stringify({ schemaVersion: 1, checklists: files.map((file) => ({ file, paths: ['src/**'] })) }, null, 2)}\n`;
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. CASES
// ─────────────────────────────────────────────────────────────────────────────

test('explain several files: a SKILLED file and a foreign file each get their own surfaces and seats', () => withRepo({
  hub: 'inside',
  base: {
    '.skilled/tools/x.js': 'module.exports = 1;\n',
    'src/a.go': 'package a\n',
    '.skilled/skills/sk-code/sk-code-quality/repository/quality.json': FOREIGN_CONFIG,
    'checks/valid.md': VALID_OVERRIDES,
    'checks/floor.md': FLOOR_OVERRIDES,
  },
}, (repo) => {
  const listed = assertSnapshotUnchanged(repo, () => repo.run(['--explain', '.skilled/tools/x.js', 'src/a.go']));
  const repeated = assertSnapshotUnchanged(repo, () => repo.run(['--explain', '.skilled/tools/x.js', '--explain', 'src/a.go']));
  assert.equal(listed.status, 2);
  assert.equal(listed.verdict.schema, 'code-quality-explain/v1');
  assert.deepEqual(repeated.verdict.files, listed.verdict.files);
  // Several files have no single top-level file, so the per-file fields live in files only.
  assert.deepEqual(Object.keys(listed.verdict), ['schema', 'status', 'exit_code', 'config', 'files', 'errors', 'note']);
  assert.deepEqual(listed.verdict.files.map((entry) => entry.file), ['.skilled/tools/x.js', 'src/a.go']);
  for (const entry of listed.verdict.files) assert.deepEqual(Object.keys(entry), EXPLAIN_FILE_KEYS);

  const skilled = explainedFile(listed.verdict, '.skilled/tools/x.js');
  assert.deepEqual(skilled.surfaces, ['SKILLED']);
  assert.deepEqual(skilled.surface_skills, [{ label: 'SKILLED', owner: 'hub', folder: path.join(repo.hub, 'sk-code-skilled') }]);
  const house = skilled.checklists.find((entry) => entry.file === 'hub:sk-code/sk-code-skilled/assets/checklists/universal-checklist.md');
  assert.deepEqual([house.source, house.sources], ['hub-surface', ['hub-surface']]);
  const floor = skilled.checklists.find((entry) => entry.file === 'hub:sk-code/shared/references/universal/code-quality-standards.md');
  assert.deepEqual([floor.source, floor.sources], ['default', ['default']]);
  assert.ok(!skilled.checklists.some((entry) => entry.file.startsWith('checks/')), 'a repository row for src/** reached a .skilled file');

  const foreign = explainedFile(listed.verdict, 'src/a.go');
  assert.deepEqual(foreign.surfaces, ['UNKNOWN']);
  assert.deepEqual(foreign.surface_skills, []);
  const team = foreign.checklists.find((entry) => entry.file === 'checks/valid.md');
  assert.deepEqual([team.source, team.sources, team.path], ['repo-config', ['repo-config'], path.join(repo.root, 'checks', 'valid.md')]);
  assert.ok(!foreign.checklists.some((entry) => entry.source === 'hub-surface'), 'a hub surface row reached a foreign file');
  assert.deepEqual(listed.verdict.errors, []);
}));

test('explain: a config written for another repository reads none and carries the ignored record', () => withRepo({
  base: {
    'app.go': 'package a\n',
    '.skilled/skills/sk-code/sk-code-quality/repository/quality.json': `\uFEFF${JSON.stringify({ schemaVersion: 1, repository: 'acme/widget' }, null, 2)}\n`,
  },
}, (repo) => {
  const skipped = assertSnapshotUnchanged(repo, () => repo.run(['--explain', 'app.go'], { env: { GITHUB_REPOSITORY: 'other/thing' } }));
  assert.equal(skipped.status, 2);
  assert.equal(skipped.verdict.config.source, 'none');
  assert.equal(skipped.verdict.config.path, null);
  assert.deepEqual(skipped.verdict.config.ignored, {
    path: path.join(repo.root, '.skilled/skills/sk-code/sk-code-quality/repository/quality.json'),
    repository: 'acme/widget',
    current: 'other/thing',
  });

  const applied = assertSnapshotUnchanged(repo, () => repo.run(['--explain', 'app.go'], { env: { GITHUB_REPOSITORY: 'acme/widget' } }));
  assert.equal(applied.verdict.config.source, 'repo');
  assert.ok(!('ignored' in applied.verdict.config));
}));

test('explain overrides: a valid section is read and a floor override is refused with its error', () => withRepo({
  base: {
    'src/a.go': 'package a\n',
    '.skilled/skills/sk-code/sk-code-quality/repository/quality.json': FOREIGN_CONFIG,
    'checks/valid.md': VALID_OVERRIDES,
    'checks/floor.md': FLOOR_OVERRIDES,
  },
}, (repo) => {
  const { status, verdict } = assertSnapshotUnchanged(repo, () => repo.run(['--explain', 'src/a.go']));
  assert.equal(status, 2);
  const byFile = Object.fromEntries(verdict.checklists.map((entry) => [entry.file, entry.overrides]));
  assert.deepEqual(byFile['checks/valid.md'], {
    found: true,
    refused: false,
    rows: [
      { line: 7, id: 'review.function-length', action: 'replace', text: 'A function stays under 60 lines', reason: 'The team limit' },
      { line: 8, id: 'hygiene.task', action: 'none', text: null, reason: 'Tickets live in the tracker' },
    ],
    errors: [],
  });
  const refused = byFile['checks/floor.md'];
  assert.deepEqual([refused.found, refused.refused, refused.rows], [true, true, []]);
  assert.equal(refused.errors.length, 1);
  assert.equal(refused.errors[0].line, 7);
  assert.match(refused.errors[0].message, /^`secret\.aws-access-key` is on the hard floor \(.+\) and cannot be overridden$/);
  // A checklist with no section reads as found false, never as refused.
  const plain = verdict.checklists.find((entry) => entry.source === 'default');
  assert.deepEqual([plain.overrides.found, plain.overrides.refused, plain.overrides.rows], [false, false, []]);
}));

test('run overrides: a refused section a changed file reaches ends the run CONFIG_INVALID, exit 3, naming the file and the reason', () => withRepo({
  base: { '.skilled/skills/sk-code/sk-code-quality/repository/quality.json': FOREIGN_CONFIG, 'checks/valid.md': VALID_OVERRIDES, 'checks/floor.md': FLOOR_OVERRIDES },
  change: { 'src/a.go': 'package a\n' },
}, (repo) => {
  const { status, verdict } = assertSnapshotUnchanged(repo, () => repo.run([]));
  assert.equal(status, 3);
  assert.equal(verdict.gate, 'ERROR');
  const refused = verdict.config.errors.filter((row) => row.code === 'CONFIG_INVALID');
  assert.equal(refused.length, 1);
  assert.match(refused[0].message, /^checks\/floor\.md has a refused ## Rule overrides section, so none of its rows apply: line 7: `secret\.aws-access-key` is on the hard floor/);
  assert.match(refused[0].repair, /check-rule-overrides\.cjs/);
  // The valid file in the same run is still read, and its rows are reported.
  assert.deepEqual(verdict.rule_overrides.map((row) => row.file), ['checks/valid.md', 'checks/valid.md']);
}));

test('run overrides: each valid row is recorded in the envelope decisions ahead of the pending marker, and a file reaching no override stays pending', () => withRepo({
  base: {
    '.skilled/skills/sk-code/sk-code-quality/repository/quality.json': `${JSON.stringify({ schemaVersion: 1, checklists: [{ file: 'checks/valid.md', paths: ['src/**'] }] }, null, 2)}\n`,
    'checks/valid.md': VALID_OVERRIDES,
  },
  change: { 'src/a.go': 'package a\n', 'lib/b.go': 'package b\n' },
}, (repo) => {
  const json = assertSnapshotUnchanged(repo, () => repo.run([]));
  assert.notEqual(json.verdict.gate, 'ERROR');
  assert.deepEqual(json.verdict.rule_overrides, [
    { file: 'checks/valid.md', line: 7, id: 'review.function-length', action: 'replace', text: 'A function stays under 60 lines', reason: 'The team limit', files: ['src/a.go'] },
    { file: 'checks/valid.md', line: 8, id: 'hygiene.task', action: 'none', text: null, reason: 'Tickets live in the tracker', files: ['src/a.go'] },
  ]);
  assert.deepEqual(json.verdict.rule_conflicts, []);
  const envelope = Object.fromEntries(envelopeFields(repo.run(['--format', 'envelope']).stdout));
  assert.equal(envelope.p0_p1_p2_decisions,
    'override review.function-length replace from checks/valid.md, override hygiene.task none from checks/valid.md, PENDING_AGENT_JUDGMENT');
  assert.match(repo.run(['--format', 'text']).stdout, /^override applied: hygiene\.task none from checks\/valid\.md$/m);
  const outside = Object.fromEntries(envelopeFields(repo.run(['--format', 'envelope', '--files', 'lib/b.go']).stdout));
  assert.equal(outside.p0_p1_p2_decisions, 'PENDING_AGENT_JUDGMENT');
}));

test('run overrides: a row whose id no documented rule carries refuses its file CONFIG_INVALID, exit 3, though the linter accepts it', () => withRepo({
  base: {
    '.skilled/skills/sk-code/sk-code-quality/repository/quality.json': repoChecklists('checks/valid.md', 'checks/typo.md'),
    'checks/valid.md': VALID_OVERRIDES,
    'checks/typo.md': overrideSection('Typo', ['| `review.function-lenght` | none | Misspelled on purpose |']),
  },
  change: { 'src/a.go': 'package a\n' },
}, (repo) => {
  // Existence is the mode's check, so the shared linter alone still accepts the row.
  assert.deepEqual(lintOverrides(fs.readFileSync(path.join(repo.root, 'checks', 'typo.md'), 'utf8')).errors, []);
  const { status, verdict } = assertSnapshotUnchanged(repo, () => repo.run([]));
  assert.equal(status, 3);
  assert.equal(verdict.gate, 'ERROR');
  const refused = verdict.config.errors.filter((row) => row.code === 'CONFIG_INVALID');
  assert.equal(refused.length, 1);
  assert.match(refused[0].message, /^checks\/typo\.md has a refused ## Rule overrides section, so none of its rows apply: line 7: `review\.function-lenght` names no rule/);
  assert.ok(!verdict.rule_overrides.some((row) => row.file === 'checks/typo.md'));
}));

test('run overrides: two repository checklists that disagree on one rule record an override-conflict, keep the default and leave the rule unverified', () => withRepo({
  base: {
    '.skilled/skills/sk-code/sk-code-quality/repository/quality.json': repoChecklists('checks/valid.md', 'checks/other.md'),
    'checks/valid.md': VALID_OVERRIDES,
    'checks/other.md': overrideSection('Other team', ['| `review.function-length` | none | No limit here |']),
  },
  change: { 'src/a.go': 'package a\n' },
}, (repo) => {
  const { status, verdict } = assertSnapshotUnchanged(repo, () => repo.run([]));
  assert.equal(status, 4);
  assert.equal(verdict.gate, 'UNVERIFIED');
  assert.ok(verdict.summary.unverified.includes('review.function-length'));
  assert.deepEqual(verdict.rule_conflicts, [{ id: 'review.function-length', files: ['checks/valid.md', 'checks/other.md'], scope: ['src/a.go'] }]);
  const byKey = Object.fromEntries(verdict.rule_overrides.map((row) => [`${row.file} ${row.id}`, row.files]));
  assert.deepEqual(byKey, { 'checks/valid.md review.function-length': [], 'checks/valid.md hygiene.task': ['src/a.go'], 'checks/other.md review.function-length': [] });
  const envelope = Object.fromEntries(envelopeFields(repo.run(['--format', 'envelope']).stdout));
  assert.equal(envelope.p0_p1_p2_decisions,
    'override hygiene.task none from checks/valid.md, override-conflict review.function-length checks/valid.md checks/other.md, PENDING_AGENT_JUDGMENT');
  assert.match(envelope.checker_outputs, / unverified=review\.function-length /);
}));

test('explain overrides: each file lists the rule conflicts a run would hold open on it, through the run\'s own precedence', () => withRepo({
  base: {
    '.skilled/skills/sk-code/sk-code-quality/repository/quality.json': repoChecklists('checks/valid.md', 'checks/other.md'),
    'checks/valid.md': VALID_OVERRIDES,
    'checks/other.md': overrideSection('Other team', ['| `review.function-length` | none | No limit here |']),
    'src/a.go': 'package a\n',
    'lib/b.go': 'package b\n',
  },
}, (repo) => {
  const { status, verdict } = assertSnapshotUnchanged(repo, () => repo.run(['--explain', 'src/a.go', 'lib/b.go']));
  assert.equal(status, 2);
  const conflict = [{ id: 'review.function-length', files: ['checks/valid.md', 'checks/other.md'] }];
  assert.deepEqual(explainedFile(verdict, 'src/a.go').rule_conflicts, conflict);
  assert.deepEqual(explainedFile(verdict, 'lib/b.go').rule_conflicts, []);
  const single = assertSnapshotUnchanged(repo, () => repo.run(['--explain', 'src/a.go'])).verdict;
  assert.deepEqual(single.rule_conflicts, conflict);
  // The overrides block stays the linter's alone, so both sections still read accepted.
  assert.ok(single.checklists.filter((entry) => entry.file.startsWith('checks/')).every((entry) => !entry.overrides.refused));
}));

test('run overrides: rows that give the same action and text agree, and a higher level wins over a lower one without a conflict', () => withRepo({
  hub: 'inside',
  base: {
    '.skilled/skills/sk-code/sk-code-quality/repository/quality.json': `${JSON.stringify({ schemaVersion: 1, checklists: [
      { file: 'checks/one.md', paths: ['src/**'] },
      { file: 'checks/two.md', paths: ['src/**'] },
      { file: 'checks/repo.md', paths: ['.skilled/**'] },
    ] }, null, 2)}\n`,
    'checks/one.md': overrideSection('One', ['| `review.kiss` | none | Same call |']),
    'checks/two.md': overrideSection('Two', ['| `review.kiss` | none | Same call, said again |']),
    'checks/repo.md': overrideSection('Repository', ['| `review.todo-tracking` | none | No TODO rule here |']),
    '.skilled/skills/sk-code/sk-code-skilled/assets/checklists/universal-checklist.md':
      overrideSection('SKILLED', ['| `review.todo-tracking` | replace: A TODO names its owner | House format |']),
  },
  change: { 'src/a.go': 'package a\n', '.skilled/tools/x.js': 'module.exports = 1;\n' },
}, (repo) => {
  const { status, verdict } = assertSnapshotUnchanged(repo, () => repo.run([]));
  assert.notEqual(status, 4, JSON.stringify(verdict.summary));
  assert.deepEqual(verdict.rule_conflicts, []);
  const byKey = Object.fromEntries(verdict.rule_overrides.map((row) => [`${row.file} ${row.id}`, row.files]));
  assert.deepEqual(byKey['checks/one.md review.kiss'], ['src/a.go']);
  assert.deepEqual(byKey['checks/two.md review.kiss'], ['src/a.go']);
  assert.deepEqual(byKey['checks/repo.md review.todo-tracking'], ['.skilled/tools/x.js']);
  assert.deepEqual(byKey['hub:sk-code/sk-code-skilled/assets/checklists/universal-checklist.md review.todo-tracking'], []);
}));

test('explain outside surface: a trusted private link with no quality block names its skill folder', {
  skip: !SYMLINK_SUPPORT && 'symbolic links are unavailable',
}, () => withRepo({
  hub: 'sibling',
  base: { 'xsrc/run.js': 'module.exports = 1;\n' },
}, (repo) => {
  const trusted = path.join(repo.parent, 'trusted');
  const target = path.join(trusted, 'example');
  fs.mkdirSync(target, { recursive: true });
  // The declaration carries no quality block, so the folder is the only way a reader can
  // reach the surface's own rules.
  fs.writeFileSync(path.join(target, 'graph-metadata.json'), `${JSON.stringify({
    schema_version: '1.0', skill_id: OUTSIDE_SKILL, family: 'sk-code', surface_detection: OUTSIDE_SURFACE,
  }, null, 2)}\n`);
  const link = path.join(path.dirname(repo.hub), OUTSIDE_SKILL);
  fs.symlinkSync(target, link, 'dir');
  const withRoot = assertSnapshotUnchanged(repo, () => repo.run(['--explain', 'xsrc/run.js'], { env: { SPECKIT_PRIVATE_SKILL_ROOTS: trusted } }));
  assert.equal(withRoot.status, 2);
  assert.deepEqual(withRoot.verdict.surfaces, ['EXAMPLE']);
  assert.deepEqual(withRoot.verdict.surface_skills, [{ label: 'EXAMPLE', owner: 'outside-skill', folder: link }]);
  assert.ok(!withRoot.verdict.checklists.some((entry) => entry.source === 'outside-skill'));
  assert.deepEqual(withRoot.verdict.errors, []);
  // The same link outside every trusted root is skipped by the shared rule, so no folder prints.
  const untrusted = assertSnapshotUnchanged(repo, () => repo.run(['--explain', 'xsrc/run.js'], { env: { SPECKIT_PRIVATE_SKILL_ROOTS: undefined } }));
  assert.deepEqual(untrusted.verdict.surfaces, ['UNKNOWN']);
  assert.deepEqual(untrusted.verdict.surface_skills, []);
}));

test('explain outside surface with a quality block: its rows carry the outside-skill seat', () => withRepo({
  hub: 'sibling',
  base: { 'xsrc/run.js': 'module.exports = 1;\n' },
}, (repo) => {
  writeOutsideSkill(repo, OUTSIDE_SKILL, OUTSIDE_SURFACE, OUTSIDE_CHECKLISTS);
  const { verdict } = assertSnapshotUnchanged(repo, () => repo.run(['--explain', 'xsrc/run.js']));
  const folder = path.join(path.dirname(repo.hub), OUTSIDE_SKILL);
  assert.deepEqual(verdict.surface_skills, [{ label: 'EXAMPLE', owner: 'outside-skill', folder }]);
  const row = verdict.checklists.find((entry) => entry.file === `hub:${OUTSIDE_SKILL}/${OUTSIDE_CHECKLIST}`);
  assert.deepEqual([row.source, row.sources], ['outside-skill', ['outside-skill']]);
  assert.deepEqual(row.overrides, { found: false, refused: false, rows: [], errors: [] });
}));

test('explain starts nothing: several files with a trusted command and a spy python write nothing', () => withRepo({
  base: {
    'a.go': 'package a\n',
    'b.py': 'B = 1\n',
    '.skilled/skills/sk-code/sk-code-quality/repository/quality.json': `${JSON.stringify({
      schemaVersion: 1,
      checks: [{ id: 'canary-check', argv: [process.execPath, '-e', 'require("fs").writeFileSync("canary", "ran")'], severity: 'P0' }],
    }, null, 2)}\n`,
  },
}, (repo) => {
  trustRepoChecks(repo);
  const canary = path.join(repo.parent, 'spy-ran');
  const spy = fakePython(repo.parent, `require("fs").writeFileSync(${JSON.stringify(canary)}, "ran");\n${HYGIENE_REPORT}`);
  const explained = assertSnapshotUnchanged(repo, () => repo.run(['--explain', 'a.go', 'b.py'],
    { env: { PATH: `${spy}${path.delimiter}${repo.env.PATH}` } }));
  assert.equal(explained.status, 2);
  assert.equal(explained.verdict.note, 'nothing was run');
  for (const entry of explained.verdict.files) {
    assert.equal(entry.checks.find((item) => item.id === 'canary-check').applies, true);
  }
  assert.ok(!fs.existsSync(canary), 'explain started python');
  assert.ok(!fs.existsSync(path.join(repo.root, 'canary')), 'explain started the configured command');
}));

test('explain one file: the old fields keep their place and only the resolver fields are added', () => withRepo({
  change: { 'app.go': 'package a\n' },
}, (repo) => {
  const { status, verdict } = assertSnapshotUnchanged(repo, () => repo.run(['--explain', 'app.go']));
  assert.equal(status, 2);
  assert.deepEqual(Object.keys(verdict), EXPLAIN_TOP_KEYS);
  assert.deepEqual([verdict.file, verdict.language, verdict.language_source, verdict.unchecked, verdict.surfaces],
    ['app.go', 'go', 'extension', null, ['UNKNOWN']]);
  for (const entry of verdict.checklists) assert.deepEqual(Object.keys(entry), ['file', 'path', 'why', 'source', 'sources', 'overrides']);
  assert.ok(verdict.checks.every((entry) => ['id', 'applies', 'why'].every((key) => key in entry)));
  // The one entry under files is the same explanation the top level carries.
  assert.equal(verdict.files.length, 1);
  for (const key of EXPLAIN_FILE_KEYS) assert.deepEqual(verdict.files[0][key], verdict[key], key);
  // A path that is not there still refuses the whole call, as a single path always did.
  const missing = repo.run(['--explain', 'app.go', 'missing.go']);
  assert.equal(missing.status, 3);
  assert.equal(missing.verdict.errors[0].code, 'FILE_NOT_FOUND');
  const bare = repo.run(['--explain']);
  assert.equal(bare.status, 3);
  assert.equal(bare.verdict.errors[0].code, 'USAGE');
}));
