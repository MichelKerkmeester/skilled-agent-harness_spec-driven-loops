// ───────────────────────────────────────────────────────────────────
// MODULE: sk-code-quality Gate Runner Tests — Surfaces and Coverage
// ───────────────────────────────────────────────────────────────────
'use strict';

// Each case seeds one change and reads which surface the runner resolved and which
// checklists that surface carries, so the group holds the checklist seats a repository
// boundary hands out, the language a shebang selects, and the files no check can read.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const { REAL_CHECKER, REPO_ROOT, SPEC_FOLDER_CHECKLIST, STYLE_CHECKLISTS, ADR_LABEL, withRepo, check, hygieneFindings, checklistFiles, surfaceOf, firstSpecFile, onlyNodeOnPath, envelopeFields, HYGIENE_REPORT } = require('./quality-gate-helpers.cjs');
const { assertSnapshotUnchanged } = require('./fixtures.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CASES
// ─────────────────────────────────────────────────────────────────────────────

test('F05 nothing applicable: a language with no comment family and a binary are listed as unchecked', () => withRepo({
  change: {
    'main.zig': 'const std = @import("std");\n',
    'blob.js': Buffer.from([0x50, 0x00, 0x01, 0x02]),
  },
}, (repo) => {
  const { status, verdict } = assertSnapshotUnchanged(repo, () => repo.run([]));
  assert.equal(status, 2);
  assert.equal(verdict.gate, 'NOTHING_CHECKED');
  assert.deepEqual(verdict.coverage.unchecked, [
    { file: 'blob.js', reason: 'binary' },
    { file: 'main.zig', reason: 'no comment family' },
  ]);
}));

test('F10 no git: named files run with every line changed, and no scope fails closed', () => withRepo({
  git: false,
  change: { 'a.py': 'x = 1  # see ' + ADR_LABEL + '\n' },
}, (repo) => {
  fs.writeFileSync(path.join(repo.parent, 'outside.py'), 'y = 2\n');
  assertSnapshotUnchanged(repo, () => {
    const bare = repo.run([]);
    assert.equal(bare.status, 3);
    assert.equal(bare.verdict.gate, 'ERROR');
    assert.equal(bare.verdict.errors[0].code, 'NO_GIT_REPOSITORY');
    const named = repo.run(['--files', 'a.py']);
    assert.equal(named.status, 1);
    assert.equal(named.verdict.scope.mode, 'files');
    const [entry] = hygieneFindings(named.verdict);
    assert.deepEqual([entry.origin, entry.blocking], ['changed-line', true]);
    assert.equal(repo.run(['--files', 'missing.py']).verdict.errors[0].code, 'FILE_NOT_FOUND');
    assert.equal(repo.run(['--files', '../outside.py']).verdict.errors[0].code, 'FILE_OUTSIDE_ROOT');
  });
}));

test('F13 shebang dispatch: the shebang picks the parser before the extension does', () => withRepo({
  change: {
    'tool.sh': '#!/usr/bin/env python3\nimport sys\nprint(sys.argv)\n',
    'bad.sh': '#!/bin/bash\nif true; then\n  echo hi\n',
  },
}, (repo) => {
  const { status, verdict } = assertSnapshotUnchanged(repo, () => repo.run([]));
  assert.equal(status, 1);
  assert.equal(check(verdict, 'syntax-python').state, 'RAN_CLEAN');
  assert.equal(check(verdict, 'syntax-shell').state, 'RAN_FAIL');
  const parse = verdict.findings.filter((entry) => entry.rule.startsWith('syntax.'));
  assert.deepEqual(parse.map((entry) => [entry.file, entry.rule, entry.severity, entry.blocking]), [['bad.sh', 'syntax.shell', 'P0', true]]);
}));

test('F14 CI target: a changed workflow lists the CI checklist the real hub declares', () => withRepo({
  hub: 'real',
  change: { '.github/workflows/x.yml': 'name: x\non: push\njobs:\n  a:\n    runs-on: ubuntu-latest\n    steps:\n      - run: echo hi\n' },
}, (repo) => {
  const { verdict } = assertSnapshotUnchanged(repo, () => repo.run([]));
  const files = checklistFiles(verdict);
  assert.ok(files.includes('hub:sk-code/sk-code-ci/references/ci-workflow-standards.md'));
  assert.ok(files.includes('hub:sk-code/shared/references/universal/code-quality-standards.md'));
  assert.equal(check(verdict, 'syntax-yaml').files, 1);
}));

test('F16 SKILLED target: a hub file gets the house checklist and the override never moves a command', () => withRepo({
  hub: 'inside',
  base: { '.skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh': '#!/usr/bin/env node\n' + HYGIENE_REPORT + '\n' },
  change: {
    '.skilled/skills/demo/run.py': 'import sys\nprint(sys.argv)\n',
    'src/run.py': 'x = 1  # see ' + ADR_LABEL + '\n',
  },
}, (repo) => {
  const { status, verdict } = assertSnapshotUnchanged(repo, () => repo.run([]));
  assert.ok(verdict.resolved_surface.includes('SKILLED'));
  assert.deepEqual(surfaceOf(verdict, '.skilled/skills/demo/run.py'), ['SKILLED']);
  assert.deepEqual(surfaceOf(verdict, 'src/run.py'), ['UNKNOWN']);
  const house = verdict.checklists.find((entry) => entry.file === 'hub:sk-code/sk-code-skilled/assets/checklists/universal-checklist.md');
  assert.deepEqual(house.files, ['.skilled/skills/demo/run.py']);
  assert.ok(checklistFiles(verdict).includes('hub:sk-code/shared/references/universal/code-quality-standards.md'));
  assert.equal(check(verdict, 'comment-hygiene').argv[3], REAL_CHECKER);
  assert.equal(status, 1);
  assert.equal(hygieneFindings(verdict)[0].file, 'src/run.py');
}));

test('F17 python3 absent: hygiene is skipped, never clean, and the run is unverified', () => withRepo({
  change: { 'a.js': 'module.exports = 1;\n' },
}, (repo) => {
  const bin = onlyNodeOnPath(repo.parent);
  const { status, verdict } = assertSnapshotUnchanged(repo, () => repo.run(['--files', 'a.js'], { env: { PATH: bin } }));
  assert.equal(status, 4);
  assert.equal(verdict.gate, 'UNVERIFIED');
  const hygiene = check(verdict, 'comment-hygiene');
  assert.equal(hygiene.state, 'SKIPPED_ABSENT');
  assert.match(hygiene.repair, /python3/);
  assert.ok(verdict.summary.unverified.includes('comment-hygiene'));
  assert.equal(check(verdict, 'conflict-markers').state, 'RAN_CLEAN');
  assert.equal(check(verdict, 'syntax-node').state, 'RAN_CLEAN');
}));

// The spec-folder checklist is a framework-specific standard, so it is scoped to the repository
// that owns this hub. A foreign repository with a specs/ folder would otherwise be handed a
// standard the runner cannot check. The JavaScript and CSS house style is SKILLED's, so a foreign
// .js file is handed only the universal floor.
test('F21 foreign repository: a specs/ folder lists no spec-folder checklist and no house style', () => withRepo({
  hub: 'real',
  change: {
    'specs/demo/spec.md': '# Demo\n\nA fixture specification.\n',
    'specs/demo/notes.js': 'module.exports = 1;\n',
  },
}, (repo) => {
  const { verdict } = assertSnapshotUnchanged(repo, () => repo.run([]));
  assert.deepEqual(surfaceOf(verdict, 'specs/demo/spec.md'), ['UNKNOWN']);
  assert.deepEqual(surfaceOf(verdict, 'specs/demo/notes.js'), ['UNKNOWN']);
  const files = checklistFiles(verdict);
  assert.ok(!files.includes(SPEC_FOLDER_CHECKLIST), 'a foreign repository was handed the spec-folder checklist');
  for (const file of STYLE_CHECKLISTS) assert.ok(!files.includes(file), `${file} reached a foreign .js file`);
  assert.deepEqual(files, ['hub:sk-code/shared/references/universal/code-quality-standards.md']);
}));

// The house style moved to the SKILLED surface rather than disappearing, so the hub's own
// .js and .css files must keep every row the base layer used to hand them.
test('F21a hub repository: a .js and a .css file under .skilled/ list the JavaScript and CSS house style', () => withRepo({
  hub: 'inside',
  change: {
    '.skilled/tools/run.js': 'module.exports = 1;\n',
    '.skilled/tools/look.css': '.a { opacity: 1; }\n',
  },
}, (repo) => {
  const { verdict } = assertSnapshotUnchanged(repo, () => repo.run(['--files', '.skilled/tools/run.js', '.skilled/tools/look.css']));
  assert.deepEqual(surfaceOf(verdict, '.skilled/tools/run.js'), ['SKILLED']);
  assert.deepEqual(surfaceOf(verdict, '.skilled/tools/look.css'), ['SKILLED']);
  const files = checklistFiles(verdict);
  for (const file of STYLE_CHECKLISTS) assert.ok(files.includes(file), `${file} left a SKILLED file`);
}));

// The hub's OpenCode plugins live in .opencode/plugins beside .skilled/. A plugin there is
// still the hub's own code, so it resolves to SKILLED and keeps the house style.
test('F21b hub repository: a plugin in .opencode/plugins resolves to SKILLED', () => withRepo({
  hub: 'inside',
  change: { '.opencode/plugins/a.js': 'module.exports = 1;\n' },
}, (repo) => {
  const { verdict } = assertSnapshotUnchanged(repo, () => repo.run(['--files', '.opencode/plugins/a.js']));
  assert.deepEqual(surfaceOf(verdict, '.opencode/plugins/a.js'), ['SKILLED']);
  const files = checklistFiles(verdict);
  for (const file of STYLE_CHECKLISTS) assert.ok(files.includes(file), `${file} left a plugin`);
}));

// Only the plugins folder is hub code. Another .opencode folder, or a nested .opencode
// elsewhere, claims nothing, and a missing plugins folder changes no other surface.
test('F21c hub repository: other .opencode files resolve to no surface', () => withRepo({
  hub: 'inside',
  change: {
    '.opencode/agents/b.js': 'module.exports = 1;\n',
    'vendor/.opencode/plugins/d.js': 'module.exports = 1;\n',
    '.skilled/tools/x.js': 'module.exports = 1;\n',
  },
}, (repo) => {
  const { verdict } = assertSnapshotUnchanged(repo, () => repo.run(['--files', '.opencode/agents/b.js', 'vendor/.opencode/plugins/d.js', '.skilled/tools/x.js']));
  assert.deepEqual(surfaceOf(verdict, '.opencode/agents/b.js'), ['UNKNOWN']);
  assert.deepEqual(surfaceOf(verdict, 'vendor/.opencode/plugins/d.js'), ['UNKNOWN']);
  assert.deepEqual(surfaceOf(verdict, '.skilled/tools/x.js'), ['SKILLED']);
}));

// A plugins link whose target holds the hub would make every file below it hub code, so the
// plugins folder is read only when the hub does not sit inside it. The files beside such a
// link therefore stay unknown rather than inheriting the hub's surfaces.
for (const target of ['..', '../..']) {
  test(`F21d hub repository: an .opencode/plugins link to ${target} claims no other file`, () => withRepo({
    hub: 'inside',
    change: { '.opencode/agents/b.js': 'module.exports = 1;\n', 'vendor/.opencode/d.js': 'module.exports = 1;\n' },
    links: { '.opencode/plugins': target },
  }, (repo) => {
    const { verdict } = assertSnapshotUnchanged(repo, () => repo.run(['--files', '.opencode/agents/b.js', 'vendor/.opencode/d.js']));
    assert.deepEqual(surfaceOf(verdict, '.opencode/agents/b.js'), ['UNKNOWN']);
    assert.deepEqual(surfaceOf(verdict, 'vendor/.opencode/d.js'), ['UNKNOWN']);
  }));
}

// A plugins link that dangles or loops resolves to no folder of hub code, and the run still
// reads every other file the way it would without the link.
test('F21e hub repository: a dangling or looping .opencode/plugins link changes no surface', () => {
  for (const links of [{ '.opencode/plugins': '../.opencode/missing' }, { '.opencode/plugins': 'plugins' }]) {
    withRepo({ hub: 'inside', change: { '.opencode/agents/b.js': 'module.exports = 1;\n', '.skilled/tools/x.js': 'module.exports = 1;\n' }, links }, (repo) => {
      const { verdict } = assertSnapshotUnchanged(repo, () => repo.run(['--files', '.opencode/agents/b.js', '.skilled/tools/x.js']));
      assert.deepEqual(surfaceOf(verdict, '.opencode/agents/b.js'), ['UNKNOWN']);
      assert.deepEqual(surfaceOf(verdict, '.skilled/tools/x.js'), ['SKILLED']);
    });
  }
});

// The same row still lists for this repository's own spec docs, which resolve to no surface, so
// the scope is the repository boundary and not the file's label.
test('F22 own repository: a spec file keeps the spec-folder checklist', () => withRepo({ hub: 'real' }, (repo) => {
  const spec = firstSpecFile();
  assert.ok(spec, 'this repository keeps no spec.md under specs/');
  const rel = path.relative(REPO_ROOT, spec);
  const { verdict } = assertSnapshotUnchanged(repo, () => repo.run(['--files', rel], { cwd: REPO_ROOT }));
  assert.ok(checklistFiles(verdict).includes(SPEC_FOLDER_CHECKLIST), 'this repository lost its own spec-folder checklist');
}));

test('unit: real-path guard', () => withRepo({
  hub: 'inside',
  base: {
    '.skilled/skills/demo/inside.py': 'A = 1\n',
    '.skilled/skills/my tool/a b.py': 'B = 1\n',
    'other dir/c.py': 'C = 1\n',
    'src/d.py': 'D = 1\n',
  },
}, (repo) => {
  const elsewhere = path.join(repo.parent, 'elsewhere');
  fs.mkdirSync(path.join(elsewhere, '.skilled'), { recursive: true });
  fs.writeFileSync(path.join(elsewhere, '.skilled', 'tool.py'), 'E = 1\n');
  repo.git(['-C', elsewhere, 'init', '-q']);
  const privateDir = path.join(repo.parent, 'private', 'local-example');
  fs.mkdirSync(privateDir, { recursive: true });
  fs.writeFileSync(path.join(privateDir, 'f.py'), 'F = 1\n');
  fs.symlinkSync(elsewhere, path.join(repo.root, 'vendor'));
  fs.symlinkSync(privateDir, path.join(repo.root, '.skilled', 'skills', 'local-example'));
  fs.symlinkSync(path.join(repo.root, '.skilled', 'skills', 'demo'), path.join(repo.root, 'alias'));
  const files = [
    'vendor/.skilled/tool.py',
    '.skilled/skills/local-example/f.py',
    'src/../.skilled/skills/demo/inside.py',
    '.skilled/../src/d.py',
    '.skilled/skills/my tool/a b.py',
    'other dir/c.py',
    'alias/inside.py',
  ];
  const { verdict } = assertSnapshotUnchanged(repo, () => repo.run(['--files', ...files]));
  assert.deepEqual(surfaceOf(verdict, 'vendor/.skilled/tool.py'), ['UNKNOWN']);
  assert.deepEqual(surfaceOf(verdict, '.skilled/skills/local-example/f.py'), ['UNKNOWN']);
  assert.deepEqual(surfaceOf(verdict, '.skilled/skills/demo/inside.py'), ['SKILLED']);
  assert.deepEqual(surfaceOf(verdict, 'src/d.py'), ['UNKNOWN']);
  assert.deepEqual(surfaceOf(verdict, '.skilled/skills/my tool/a b.py'), ['SKILLED']);
  assert.deepEqual(surfaceOf(verdict, 'other dir/c.py'), ['UNKNOWN']);
  assert.deepEqual(surfaceOf(verdict, 'alias/inside.py'), ['SKILLED']);
}));

test('unit: private label', () => withRepo({
  hub: 'inside',
  base: {
    '.skilled/skills/local-example/graph-metadata.json': JSON.stringify({
      skill_id: 'local-example',
      family: 'sk-code',
      surface_detection: { label: 'example', role: 'specific', pathMarkers: ['local-example/'] },
    }),
  },
  change: {
    '.skilled/skills/local-example/run.js': 'module.exports = 1;\n',
    '.local-env.sh': 'echo hi\n',
    'nonlocal-config.js': 'module.exports = 2;\n',
    'docs/(local-draft).js': 'module.exports = 3;\n',
  },
}, (repo) => {
  const { stdout } = assertSnapshotUnchanged(repo, () => repo.run(['--format', 'envelope']));
  const value = Object.fromEntries(envelopeFields(stdout));
  assert.equal(value.resolved_surface, 'EXAMPLE, SKILLED');
  assert.ok(stdout.includes('EXAMPLE'));
  assert.doesNotMatch(stdout, /(?:^|[^A-Za-z0-9_.-])local-/m);
  assert.deepEqual(value.modified_files.split(', ').sort(),
    ['.local-env.sh', '.skilled/skills/<EXAMPLE>/run.js', 'docs/(<PRIVATE>).js', 'nonlocal-config.js']);
}));
