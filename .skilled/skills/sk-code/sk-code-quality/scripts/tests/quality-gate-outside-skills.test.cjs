// ───────────────────────────────────────────────────────────────────
// MODULE: sk-code-quality Gate Runner Tests — Outside Skill Declarations
// ───────────────────────────────────────────────────────────────────
'use strict';

// Each case writes a sibling skill beside the fixture hub and declares a quality block in
// its graph-metadata.json, so the group covers the rows a skill outside the hub may list,
// the rows that are refused, and the folder name that never reaches the output.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const { OUTSIDE_SKILL, OUTSIDE_SURFACE, OUTSIDE_CHECKLIST, OUTSIDE_CHECKLISTS, SHARED_SURFACE, SHARED_CHECKLIST, PEER_SKILL, PEER_SURFACE, PEER_CHECKLIST, FOLDER_SKILL, FOLDER_SURFACE, UPPER_FOLDER_SKILL, withRepo, check, checklistFiles, surfaceOf, stableShape, writeOutsideSkill, SYMLINK_SUPPORT, CASE_INSENSITIVE_FS, envelopeFields } = require('./quality-gate-helpers.cjs');
const { assertSnapshotUnchanged } = require('./fixtures.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CASES
// ─────────────────────────────────────────────────────────────────────────────

test('F15 outside skill: its quality checklist is listed under its public label', () => withRepo({
  hub: 'sibling',
  change: { 'xsrc/run.js': 'module.exports = 1;\n' },
}, (repo) => {
  writeOutsideSkill(repo, OUTSIDE_SKILL, OUTSIDE_SURFACE, OUTSIDE_CHECKLISTS);
  const runs = assertSnapshotUnchanged(repo, () => ({ envelope: repo.run(['--format', 'envelope']), json: repo.run([]) }));
  const fields = Object.fromEntries(envelopeFields(runs.envelope.stdout));
  const listed = runs.json.verdict.checklists.find((entry) => entry.file.endsWith(`/${OUTSIDE_CHECKLIST}`));
  assert.ok(listed, 'the outside checklist was never listed');
  assert.match(listed.why, /^EXAMPLE surface, extensions \.js$/);
  assert.deepEqual(listed.files, ['xsrc/run.js']);
  assert.ok(fields.checklists_loaded.includes(OUTSIDE_CHECKLIST));
  assert.equal(fields.resolved_surface, 'EXAMPLE');
  assert.doesNotMatch(runs.envelope.stdout, /(?:^|[^A-Za-z0-9_.-])local-/m);
  assert.deepEqual(runs.json.verdict.errors, []);
}));

test('F15 negative: a file outside the outside surface\'s markers lists no outside checklist', () => withRepo({
  hub: 'sibling',
  change: { 'ysrc/run.js': 'module.exports = 1;\n' },
}, (repo) => {
  writeOutsideSkill(repo, OUTSIDE_SKILL, OUTSIDE_SURFACE, OUTSIDE_CHECKLISTS);
  const runs = assertSnapshotUnchanged(repo, () => ({ envelope: repo.run(['--format', 'envelope']), json: repo.run([]) }));
  const fields = Object.fromEntries(envelopeFields(runs.envelope.stdout));
  assert.deepEqual(surfaceOf(runs.json.verdict, 'ysrc/run.js'), ['UNKNOWN']);
  assert.deepEqual(runs.json.verdict.checklists.filter((entry) => entry.file.endsWith(`/${OUTSIDE_CHECKLIST}`)), []);
  assert.ok(!fields.checklists_loaded.includes(OUTSIDE_CHECKLIST));
  assert.doesNotMatch(fields.resolved_surface, /EXAMPLE/);
  assert.deepEqual(runs.json.verdict.errors, []);
}));

test('F42 outside skill escape: a row outside the skill folder is refused, never read and never listed', () => withRepo({
  hub: 'sibling',
  change: { 'xsrc/run.js': 'module.exports = 1;\n' },
}, (repo) => {
  const escapeRows = [
    Object.freeze({ extensions: ['.js'], file: '../../../SECRET.md' }),
    Object.freeze({ extensions: ['.js'], file: '../sk-code/SKILL.md' }),
    Object.freeze({ extensions: ['.js'], file: '/etc/hosts' }),
  ];
  writeOutsideSkill(repo, OUTSIDE_SKILL, OUTSIDE_SURFACE, escapeRows);
  // The first two rows name a file that really sits above the skill folder, so a reader
  // that followed the row out would find it and list it.
  fs.writeFileSync(path.join(repo.parent, 'SECRET.md'), '# Escaped fixture\n');
  const { status, verdict } = assertSnapshotUnchanged(repo, () => repo.run([]));
  assert.equal(status, 3);
  assert.equal(verdict.gate, 'ERROR');
  assert.deepEqual(verdict.config.errors.map((entry) => entry.code), escapeRows.map(() => 'CHECKLIST_OUTSIDE_SKILL'));
  escapeRows.forEach((row, index) => {
    const entry = verdict.config.errors[index];
    assert.match(entry.message, new RegExp(`^EXAMPLE quality\\.checklists\\[${index}\\] `));
    assert.ok(entry.message.includes(JSON.stringify(row.file)), entry.message);
    assert.equal(typeof entry.repair, 'string');
  });
  assert.deepEqual(checklistFiles(verdict).filter((file) => file.startsWith(`hub:${OUTSIDE_SKILL}/`)), []);
  assert.deepEqual(surfaceOf(verdict, 'xsrc/run.js'), ['EXAMPLE']);
  assert.equal(check(verdict, 'syntax-node').state, 'RAN_CLEAN');
}));

test('F43 outside skill row shape: every malformed row is skipped by name and the run is otherwise the same', () => withRepo({
  hub: 'sibling',
  change: { 'xsrc/run.js': 'module.exports = 1;\n' },
}, (repo) => {
  const good = Object.freeze({ extensions: ['.js'], file: OUTSIDE_CHECKLIST });
  const malformed = [
    [null, /must be a JSON object/],
    [Object.freeze({ extensions: ['.js'] }), /file must name a \.md path/],
    [Object.freeze({ extensions: ['.js'], file: 42 }), /file must name a \.md path/],
    [Object.freeze({ file: 'no-selector.md' }), /names no selector/],
    [Object.freeze({ extensions: '.js', file: 'string-extensions.md' }), /extensions must be a non-empty array/],
    [Object.freeze({ extensions: ['.js'], file: '' }), /file must name a \.md path/],
  ];
  writeOutsideSkill(repo, OUTSIDE_SKILL, OUTSIDE_SURFACE, [good]);
  const baseline = assertSnapshotUnchanged(repo, () => repo.run([]));
  writeOutsideSkill(repo, OUTSIDE_SKILL, OUTSIDE_SURFACE, [...malformed.map(([row]) => row), good]);
  const { status, verdict } = assertSnapshotUnchanged(repo, () => repo.run([]));
  assert.equal(status, 3);
  assert.equal(verdict.gate, 'ERROR');
  assert.deepEqual(verdict.config.errors.map((entry) => entry.code), malformed.map(() => 'CHECKLIST_ROW_INVALID'));
  malformed.forEach(([, pattern], index) => {
    const entry = verdict.config.errors[index];
    assert.match(entry.message, new RegExp(`^EXAMPLE quality\\.checklists\\[${index}\\] `));
    assert.match(entry.message, pattern);
  });
  assert.deepEqual(stableShape(verdict), stableShape(baseline.verdict));
  const listed = verdict.checklists.find((entry) => entry.file.endsWith(`/${OUTSIDE_CHECKLIST}`));
  assert.ok(listed, 'the well-formed row stopped listing');
  assert.deepEqual(listed.files, ['xsrc/run.js']);
}));

test('F44 shared label: two outside skills each list only the row they shipped', () => withRepo({
  hub: 'sibling',
  change: { 'asrc/run.js': 'module.exports = 1;\n', 'bsrc/run.js': 'module.exports = 2;\n' },
}, (repo) => {
  writeOutsideSkill(repo, OUTSIDE_SKILL, SHARED_SURFACE, [Object.freeze({ extensions: ['.js'], file: SHARED_CHECKLIST })]);
  writeOutsideSkill(repo, PEER_SKILL, PEER_SURFACE, [Object.freeze({ extensions: ['.js'], file: PEER_CHECKLIST })]);
  const { verdict } = assertSnapshotUnchanged(repo, () => repo.run([]));
  assert.deepEqual(verdict.resolved_surface, ['SHARED']);
  const ownRow = (skill, checklist) => verdict.checklists.find((entry) => entry.file === `hub:${skill}/${checklist}`);
  const alpha = ownRow(OUTSIDE_SKILL, SHARED_CHECKLIST);
  const beta = ownRow(PEER_SKILL, PEER_CHECKLIST);
  assert.ok(alpha && beta, 'an outside row was never listed');
  assert.deepEqual(alpha.files, ['asrc/run.js']);
  assert.deepEqual(beta.files, ['bsrc/run.js']);
  assert.deepEqual(verdict.config.errors, []);
}));

test('F45 outside skill folder and skill id: the hub label follows the folder and no private folder prints', () => withRepo({
  hub: 'sibling',
  change: { 'fsrc/run.js': 'module.exports = 1;\n' },
}, (repo) => {
  writeOutsideSkill(repo, FOLDER_SKILL, FOLDER_SURFACE, OUTSIDE_CHECKLISTS, { skillId: 'folder-identity' });
  const runs = assertSnapshotUnchanged(repo, () => ({ envelope: repo.run(['--format', 'envelope']), json: repo.run([]) }));
  const listed = runs.json.verdict.checklists.find((entry) => entry.file.endsWith(`/${OUTSIDE_CHECKLIST}`));
  assert.ok(listed, 'the row the folder names was never listed');
  assert.equal(listed.file, `hub:${FOLDER_SKILL}/${OUTSIDE_CHECKLIST}`);
  assert.ok(fs.existsSync(listed.path), `${listed.path} is not the file the skill shipped`);
  assert.deepEqual(runs.json.verdict.config.errors, []);
  assert.deepEqual(runs.json.verdict.resolved_surface, ['FOLDER']);
  const fields = Object.fromEntries(envelopeFields(runs.envelope.stdout));
  assert.ok(fields.checklists_loaded.includes(`hub:<FOLDER>/${OUTSIDE_CHECKLIST}`), fields.checklists_loaded);
  assert.doesNotMatch(runs.envelope.stdout, /(?:^|[^A-Za-z0-9_.-])local-/m);
}));

test('F46 outside skill link escape: a row that links out of the skill folder is refused', { skip: !SYMLINK_SUPPORT && 'symbolic links are unavailable' }, () => withRepo({
  hub: 'sibling',
  change: { 'xsrc/run.js': 'module.exports = 1;\n' },
}, (repo) => {
  const outside = path.join(repo.parent, 'outside');
  fs.mkdirSync(outside);
  fs.writeFileSync(path.join(repo.parent, 'SECRET.md'), '# Escaped fixture\n');
  fs.writeFileSync(path.join(outside, 'x.md'), '# Escaped fixture\n');
  const linkRows = [
    Object.freeze({ extensions: ['.js'], file: 'link.md' }),
    Object.freeze({ extensions: ['.js'], file: 'd/x.md' }),
    Object.freeze({ extensions: ['.js'], file: 'gone.md' }),
  ];
  writeOutsideSkill(repo, OUTSIDE_SKILL, OUTSIDE_SURFACE, linkRows);
  // The helper writes a stub at each row path, so the three inside paths a link takes over
  // start as regular files and are replaced here: one names a file above the skill folder,
  // one a folder above it, and one a target that is not there at all.
  const skillDir = path.join(path.dirname(repo.hub), OUTSIDE_SKILL);
  fs.rmSync(path.join(skillDir, 'link.md'));
  fs.symlinkSync(path.join(repo.parent, 'SECRET.md'), path.join(skillDir, 'link.md'));
  fs.rmSync(path.join(skillDir, 'd'), { recursive: true, force: true });
  fs.symlinkSync(outside, path.join(skillDir, 'd'));
  fs.rmSync(path.join(skillDir, 'gone.md'));
  fs.symlinkSync(path.join(skillDir, 'nowhere.md'), path.join(skillDir, 'gone.md'));
  const { status, verdict } = assertSnapshotUnchanged(repo, () => repo.run([]));
  assert.equal(status, 3);
  assert.equal(verdict.gate, 'ERROR');
  assert.deepEqual(verdict.config.errors.map((entry) => entry.code), ['CHECKLIST_OUTSIDE_SKILL', 'CHECKLIST_OUTSIDE_SKILL', 'CHECKLIST_MISSING']);
  // The two rows that read out are refused before a path is tested. The third has no
  // target to resolve, so it is a row whose file is not there, never a path outside.
  assert.deepEqual(checklistFiles(verdict).filter((file) => file.startsWith(`hub:${OUTSIDE_SKILL}/`)), [`hub:${OUTSIDE_SKILL}/gone.md`]);
  assert.deepEqual(surfaceOf(verdict, 'xsrc/run.js'), ['EXAMPLE']);
}));

test('F47 shared hub label: an outside skill that reuses a hub label pulls no hub row', () => withRepo({
  hub: 'sibling',
  change: { 'xsrc/run.js': 'module.exports = 1;\n' },
}, (repo) => {
  const reused = Object.freeze({ label: 'skilled', role: 'specific', pathMarkers: ['xsrc/'] });
  writeOutsideSkill(repo, OUTSIDE_SKILL, reused, OUTSIDE_CHECKLISTS);
  const { status, verdict } = assertSnapshotUnchanged(repo, () => repo.run([]));
  assert.equal(status, 0);
  assert.equal(verdict.gate, 'NO_BLOCKER_FOUND');
  assert.deepEqual(surfaceOf(verdict, 'xsrc/run.js'), ['SKILLED']);
  const own = verdict.checklists.find((entry) => entry.file === `hub:${OUTSIDE_SKILL}/${OUTSIDE_CHECKLIST}`);
  assert.ok(own, 'the row the skill shipped was never listed');
  assert.deepEqual(own.files, ['xsrc/run.js']);
  // A hub row from a mode's detection block reads `hub:<hub>/...` and names its owner's
  // surface in `why`, so the row a reused label would pull is the one that says SKILLED
  // surface. The outside row names its own folder instead, and the base-layer rows name
  // no owner at all.
  assert.deepEqual(verdict.checklists.filter((entry) => entry.file.startsWith('hub:sk-code/') && entry.why.startsWith('SKILLED surface')), []);
  assert.deepEqual(verdict.config.errors, []);
}));

test('F48 shared skill id: two skills with one id each list only the row they shipped', () => withRepo({
  hub: 'sibling',
  change: { 'asrc/run.js': 'module.exports = 1;\n', 'bsrc/run.js': 'module.exports = 2;\n' },
}, (repo) => {
  const identity = Object.freeze({ skillId: 'shared-identity' });
  writeOutsideSkill(repo, OUTSIDE_SKILL, SHARED_SURFACE, [Object.freeze({ extensions: ['.js'], file: SHARED_CHECKLIST })], identity);
  writeOutsideSkill(repo, PEER_SKILL, PEER_SURFACE, [Object.freeze({ extensions: ['.js'], file: PEER_CHECKLIST })], identity);
  const { verdict } = assertSnapshotUnchanged(repo, () => repo.run([]));
  const alpha = verdict.checklists.find((entry) => entry.file === `hub:${OUTSIDE_SKILL}/${SHARED_CHECKLIST}`);
  const beta = verdict.checklists.find((entry) => entry.file === `hub:${PEER_SKILL}/${PEER_CHECKLIST}`);
  assert.ok(alpha && beta, 'a row one of the skills shipped was never listed');
  assert.deepEqual(alpha.files, ['asrc/run.js']);
  assert.deepEqual(beta.files, ['bsrc/run.js']);
  assert.deepEqual(verdict.config.errors, []);
}));

test('F49 outside skill dot segments: a .. segment is refused and a dotted name is not', () => withRepo({
  hub: 'sibling',
  change: { 'xsrc/run.js': 'module.exports = 1;\n' },
}, (repo) => {
  const dotted = Object.freeze({ extensions: ['.js'], file: '..notes.md' });
  writeOutsideSkill(repo, OUTSIDE_SKILL, OUTSIDE_SURFACE, [
    Object.freeze({ extensions: ['.js'], file: 'a/../c.md' }),
    Object.freeze({ extensions: ['.js'], file: `./../${OUTSIDE_SKILL}/c.md` }),
    dotted,
  ]);
  const { status, verdict } = assertSnapshotUnchanged(repo, () => repo.run([]));
  assert.equal(status, 3);
  assert.equal(verdict.gate, 'ERROR');
  const errors = verdict.config.errors;
  assert.deepEqual(errors.map((entry) => entry.code), ['CHECKLIST_ROW_INVALID', 'CHECKLIST_ROW_INVALID']);
  assert.match(errors[0].message, /^EXAMPLE quality\.checklists\[0\] names "a\/\.\.\/c\.md", which holds a \.\. segment$/);
  assert.match(errors[1].message, /^EXAMPLE quality\.checklists\[1\] names "\.\/\.\.\/local-example\/c\.md", which holds a \.\. segment$/);
  const own = verdict.checklists.find((entry) => entry.file === `hub:${OUTSIDE_SKILL}/${dotted.file}`);
  assert.ok(own, 'the row whose name only begins with dots was refused');
  assert.deepEqual(own.files, ['xsrc/run.js']);
}));

test('F50 outside skill block shape: a quality block a reader cannot follow is refused', () => withRepo({
  hub: 'sibling',
  change: { 'xsrc/run.js': 'module.exports = 1;\n' },
}, (repo) => {
  // One block carries an unknown key beside a string where the list belongs, the other
  // carries an empty list. Neither can name a row, and neither may read as no block. The
  // peer's surface reaches no scoped file, so only the block the change reaches gates.
  writeOutsideSkill(repo, OUTSIDE_SKILL, OUTSIDE_SURFACE, [], { quality: { checklists: 'nope', command: 'x' } });
  writeOutsideSkill(repo, PEER_SKILL, PEER_SURFACE, [], { quality: { checklists: [] } });
  const { status, verdict } = assertSnapshotUnchanged(repo, () => repo.run([]));
  assert.equal(status, 3);
  assert.equal(verdict.gate, 'ERROR');
  assert.deepEqual(verdict.config.errors.map((entry) => entry.code), ['CHECKLIST_ROW_INVALID', 'CHECKLIST_ROW_INVALID']);
  assert.deepEqual(verdict.config.warnings.map((entry) => entry.code), ['CHECKLIST_ROW_INVALID']);
  const messages = verdict.config.errors.map((entry) => entry.message);
  assert.match(messages[0], /^EXAMPLE quality holds unknown key command\. A skill names checklists only, never a command$/);
  assert.match(messages[1], /^EXAMPLE quality checklists must be a non-empty array$/);
  assert.match(verdict.config.warnings[0].message, /^SHARED quality checklists must be a non-empty array$/);
  assert.equal(typeof verdict.config.warnings[0].repair, 'string');
  assert.deepEqual(verdict.checklists.filter((entry) => /^(?:EXAMPLE|SHARED) surface/.test(entry.why)), []);
  assert.deepEqual(surfaceOf(verdict, 'xsrc/run.js'), ['EXAMPLE']);
}));

test('F52 outside skill block type: a quality value that is not an object is refused', () => withRepo({
  hub: 'sibling',
  change: { 'xsrc/run.js': 'module.exports = 1;\n' },
}, (repo) => {
  // A string or a null where the block belongs names no row, and neither may read as
  // a skill that declared nothing. Only the peer's block reaches no scoped file.
  writeOutsideSkill(repo, OUTSIDE_SKILL, OUTSIDE_SURFACE, [], { quality: 'nope' });
  writeOutsideSkill(repo, PEER_SKILL, PEER_SURFACE, [], { quality: null });
  const { status, verdict } = assertSnapshotUnchanged(repo, () => repo.run([]));
  assert.equal(status, 3);
  assert.equal(verdict.gate, 'ERROR');
  assert.deepEqual(verdict.config.errors.map((entry) => entry.message), ['EXAMPLE quality must be a JSON object']);
  assert.deepEqual(verdict.config.warnings.map((entry) => entry.message), ['SHARED quality must be a JSON object']);
}));

// A malformed declaration is reported whether or not the change reaches it. The two cases
// below hold one row and differ only in the scoped file, so surface detection is the whole
// difference between a warning and a gate.
test('outside skill fault: a malformed row whose surface reaches no scoped file never gates', () => withRepo({
  hub: 'sibling',
  change: { 'ysrc/run.js': 'module.exports = 1;\n' },
}, (repo) => {
  writeOutsideSkill(repo, OUTSIDE_SKILL, OUTSIDE_SURFACE, [Object.freeze({ file: 'no-selector.md' })]);
  const runs = assertSnapshotUnchanged(repo, () => ({ json: repo.run([]), text: repo.run(['--format', 'text']) }));
  assert.equal(runs.json.status, 0);
  assert.equal(runs.json.verdict.gate, 'NO_BLOCKER_FOUND');
  assert.deepEqual(runs.json.verdict.config.errors, []);
  assert.deepEqual(runs.json.verdict.config.warnings.map((entry) => entry.code), ['CHECKLIST_ROW_INVALID']);
  assert.match(runs.json.verdict.config.warnings[0].message, /^EXAMPLE quality\.checklists\[0\] names no selector/);
  assert.equal(typeof runs.json.verdict.config.warnings[0].repair, 'string');
  assert.deepEqual(surfaceOf(runs.json.verdict, 'ysrc/run.js'), ['UNKNOWN']);
  assert.match(runs.text.stdout, /^warning CHECKLIST_ROW_INVALID: EXAMPLE quality\.checklists\[0\] names no selector/m);
}));

test('outside skill fault: the same malformed row with a scoped file its surface reaches gates', () => withRepo({
  hub: 'sibling',
  change: { 'xsrc/run.js': 'module.exports = 1;\n' },
}, (repo) => {
  writeOutsideSkill(repo, OUTSIDE_SKILL, OUTSIDE_SURFACE, [Object.freeze({ file: 'no-selector.md' })]);
  const { status, verdict } = assertSnapshotUnchanged(repo, () => repo.run([]));
  assert.equal(status, 3);
  assert.equal(verdict.gate, 'ERROR');
  assert.deepEqual(verdict.config.errors.map((entry) => entry.code), ['CHECKLIST_ROW_INVALID']);
  assert.match(verdict.config.errors[0].message, /^EXAMPLE quality\.checklists\[0\] names no selector/);
  assert.deepEqual(verdict.config.warnings, []);
  assert.deepEqual(surfaceOf(verdict, 'xsrc/run.js'), ['EXAMPLE']);
}));

test('outside skill fault: one scoped file the surface reaches among several it does not still gates', () => withRepo({
  hub: 'sibling',
  change: {
    'xsrc/run.js': 'module.exports = 1;\n',
    'ysrc/a.js': 'module.exports = 2;\n',
    'ysrc/b.js': 'module.exports = 3;\n',
    'ysrc/c.js': 'module.exports = 4;\n',
  },
}, (repo) => {
  writeOutsideSkill(repo, OUTSIDE_SKILL, OUTSIDE_SURFACE, [Object.freeze({ file: 'no-selector.md' })]);
  const { status, verdict } = assertSnapshotUnchanged(repo, () => repo.run([]));
  assert.equal(status, 3);
  assert.equal(verdict.gate, 'ERROR');
  assert.deepEqual(verdict.config.errors.map((entry) => entry.code), ['CHECKLIST_ROW_INVALID']);
  assert.match(verdict.config.errors[0].message, /^EXAMPLE quality\.checklists\[0\] names no selector/);
  assert.deepEqual(verdict.config.warnings, []);
  assert.deepEqual(surfaceOf(verdict, 'xsrc/run.js'), ['EXAMPLE']);
  assert.deepEqual(surfaceOf(verdict, 'ysrc/a.js'), ['UNKNOWN']);
}));

test('outside skill fault: --explain reports a fault whose surface reaches no file as a warning', () => withRepo({
  hub: 'inside',
  base: { '.skilled/tools/x.js': 'module.exports = 1;\n' },
}, (repo) => {
  // The skill reuses the hub's own label, so the label this file resolves to is the one the
  // fault carries while the folder that declared it detected nothing.
  writeOutsideSkill(repo, OUTSIDE_SKILL, Object.freeze({ label: 'skilled', role: 'specific', pathMarkers: ['xsrc/'] }), [],
    { quality: { checklists: 'nope' } });
  const explained = assertSnapshotUnchanged(repo, () => repo.run(['--explain', '.skilled/tools/x.js']));
  assert.equal(explained.status, 2);
  assert.deepEqual(explained.verdict.surfaces, ['SKILLED']);
  assert.deepEqual(explained.verdict.errors, []);
  assert.deepEqual(explained.verdict.config.warnings.map((entry) => entry.message),
    ['SKILLED quality checklists must be a non-empty array']);
}));

test('F51 outside skill folder row: a row that names a folder is reported missing', () => withRepo({
  hub: 'sibling',
  change: { 'xsrc/run.js': 'module.exports = 1;\n' },
}, (repo) => {
  const row = Object.freeze({ extensions: ['.js'], file: 'notes.md' });
  writeOutsideSkill(repo, OUTSIDE_SKILL, OUTSIDE_SURFACE, [row]);
  // A folder spelled like a checklist satisfies an existence test and nothing else.
  const target = path.join(path.dirname(repo.hub), OUTSIDE_SKILL, row.file);
  fs.rmSync(target);
  fs.mkdirSync(target);
  const { status, verdict } = assertSnapshotUnchanged(repo, () => repo.run([]));
  assert.equal(status, 3);
  assert.equal(verdict.gate, 'ERROR');
  assert.deepEqual(verdict.config.errors.map((entry) => entry.code), ['CHECKLIST_MISSING']);
  assert.match(verdict.config.errors[0].message, /notes\.md is declared but .*notes\.md is not a regular file$/);
}));

test('F53 outside skill folder link without a file: the row is refused outside and never listed', { skip: !SYMLINK_SUPPORT && 'symbolic links are unavailable' }, () => withRepo({
  hub: 'sibling',
  change: { 'xsrc/run.js': 'module.exports = 1;\n' },
}, (repo) => {
  const row = Object.freeze({ extensions: ['.js'], file: 'd/gone.md' });
  writeOutsideSkill(repo, OUTSIDE_SKILL, OUTSIDE_SURFACE, [row]);
  // The helper writes a stub for the row, so the folder it sits in is replaced here by a
  // link whose target holds no checklist. The name reads as an inside path until the
  // link is resolved, and the folder it resolves through is the one that decides.
  const skillDir = path.join(path.dirname(repo.hub), OUTSIDE_SKILL);
  fs.rmSync(path.join(skillDir, 'd'), { recursive: true, force: true });
  fs.mkdirSync(path.join(repo.parent, 'outside'));
  fs.symlinkSync(path.join(repo.parent, 'outside'), path.join(skillDir, 'd'));
  const { status, verdict } = assertSnapshotUnchanged(repo, () => repo.run([]));
  assert.equal(status, 3);
  assert.equal(verdict.gate, 'ERROR');
  assert.deepEqual(verdict.config.errors.map((entry) => entry.code), ['CHECKLIST_OUTSIDE_SKILL']);
  assert.match(verdict.config.errors[0].message, /^EXAMPLE quality\.checklists\[0\] names "d\/gone\.md", which lies outside the skill folder$/);
  assert.deepEqual(checklistFiles(verdict).filter((file) => file.startsWith(`hub:${OUTSIDE_SKILL}/`)), []);
}));

test('F54 private folder in another case: the envelope carries the label, never the folder', () => withRepo({
  hub: 'sibling',
  change: { 'xsrc/run.js': 'module.exports = 1;\n' },
}, (repo) => {
  writeOutsideSkill(repo, UPPER_FOLDER_SKILL, OUTSIDE_SURFACE, OUTSIDE_CHECKLISTS, { skillId: 'public-id' });
  const runs = assertSnapshotUnchanged(repo, () => ({ envelope: repo.run(['--format', 'envelope']), json: repo.run([]) }));
  const listed = runs.json.verdict.checklists.find((entry) => entry.file === `hub:${UPPER_FOLDER_SKILL}/${OUTSIDE_CHECKLIST}`);
  assert.ok(listed, 'the row the folder names was never listed');
  assert.deepEqual(listed.files, ['xsrc/run.js']);
  assert.deepEqual(runs.json.verdict.config.errors, []);
  assert.deepEqual(runs.json.verdict.resolved_surface, ['EXAMPLE']);
  const fields = Object.fromEntries(envelopeFields(runs.envelope.stdout));
  assert.ok(fields.checklists_loaded.includes(`hub:<EXAMPLE>/${OUTSIDE_CHECKLIST}`), fields.checklists_loaded);
  // The match ignores case, because a repository that ignores case lets the same folder
  // be tracked under another spelling, and that spelling is just as private.
  assert.doesNotMatch(runs.envelope.stdout, /(?:^|[^A-Za-z0-9_.-])local-/im);
  assert.doesNotMatch(runs.envelope.stdout, new RegExp(UPPER_FOLDER_SKILL, 'i'));
}));

test('F55 outside skill link in another case: a link to the skill\'s own file reads inside', {
  skip: (!SYMLINK_SUPPORT && 'symbolic links are unavailable') || (!CASE_INSENSITIVE_FS && 'the filesystem distinguishes case'),
}, () => withRepo({
  hub: 'sibling',
  change: { 'xsrc/run.js': 'module.exports = 1;\n' },
}, (repo) => {
  const skillDir = path.join(path.dirname(repo.hub), OUTSIDE_SKILL);
  const row = Object.freeze({ extensions: ['.js'], file: 'l.md' });
  writeOutsideSkill(repo, OUTSIDE_SKILL, OUTSIDE_SURFACE, [row]);
  // The row's stub is replaced by a link whose target spells the skill folder in the
  // other case. Both ends resolve to the one folder on disk, so the row names the
  // skill's own file and no path outside it.
  fs.writeFileSync(path.join(skillDir, 'c.md'), '# Fixture checklist\n');
  fs.rmSync(path.join(skillDir, row.file));
  fs.symlinkSync(path.join(path.dirname(repo.hub), OUTSIDE_SKILL.toUpperCase(), 'c.md'), path.join(skillDir, row.file));
  const { status, verdict } = assertSnapshotUnchanged(repo, () => repo.run([]));
  assert.equal(status, 0);
  assert.equal(verdict.gate, 'NO_BLOCKER_FOUND');
  assert.deepEqual(verdict.config.errors, []);
  const listed = verdict.checklists.find((entry) => entry.file === `hub:${OUTSIDE_SKILL}/${row.file}`);
  assert.ok(listed, 'the row that links to the skill\'s own file was refused');
  assert.deepEqual(listed.files, ['xsrc/run.js']);
  assert.equal(fs.realpathSync.native(listed.path), fs.realpathSync.native(path.join(skillDir, 'c.md')));
}));
