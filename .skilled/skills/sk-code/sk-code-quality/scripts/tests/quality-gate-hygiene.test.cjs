// ───────────────────────────────────────────────────────────────────
// MODULE: sk-code-quality Gate Runner Tests — Hygiene Findings
// ───────────────────────────────────────────────────────────────────
'use strict';

// Each case seeds a throwaway repository with one change and reads the verdict the way a
// user would, so the group covers which labels block, which stay debt, and the secrets and
// markers that block in a file no comment parser can read. Every label the hygiene checker
// must catch is joined at run time, and every secret is joined from fragments, so this file
// never carries one in its own text.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('node:assert/strict');
const path = require('node:path');
const test = require('node:test');

const { ADR_LABEL, REQ_SHORT, REQ_LONG, TASK_LABEL, AWS_KEY, AWS_KEY_TWO, GITHUB_TOKEN, OPEN, MIDDLE, CLOSE, CHECKER_REFUSED_PATTERN, NESTED_SET_REFUSED_PATTERN, withRepo, check, hygieneFindings, fakePython, leaksKey } = require('./quality-gate-helpers.cjs');
const { assertSnapshotUnchanged } = require('./fixtures.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CASES
// ─────────────────────────────────────────────────────────────────────────────

test('F01 foreign polyglot: seven seeded labels block and the surface stays unknown', () => withRepo({
  base: { 'README.txt': 'fixture\n' },
  change: {
    'a.go': 'package a\n\n// see ' + ADR_LABEL + '\nfunc A() {}\n',
    'b.rs': 'fn main() {}\n// fixes issue #88\n',
    'c.yaml': 'key: 1 # packet 042\n',
    'd.css': '.a { color: red; } /* ' + REQ_SHORT + ' */\n',
    'e.py': 'def f():\n    """Implements ' + REQ_LONG + '."""\n    return 1\n',
    'f.ts': 'const u = 1; // see specs/demo/001-alpha/spec.md and https://example.com/docs\n',
    'g.mts': 'export const a = 1; // ' + TASK_LABEL + '\n',
  },
}, (repo) => {
  const { status, verdict } = assertSnapshotUnchanged(repo, () => repo.run([]));
  assert.equal(status, 1);
  assert.equal(verdict.gate, 'BLOCKED');
  assert.deepEqual(verdict.resolved_surface, ['unknown']);
  const blocking = hygieneFindings(verdict).filter((entry) => entry.blocking && entry.confidence === 'exact');
  assert.equal(blocking.length, 7);
  assert.deepEqual(blocking.map((entry) => entry.file).sort(), ['a.go', 'b.rs', 'c.yaml', 'd.css', 'e.py', 'f.ts', 'g.mts']);
  assert.ok(blocking.every((entry) => entry.severity === 'P0' && entry.origin === 'changed-line'));
}));

test('F02 false-positive set: measurement, encoding and standard names raise nothing', () => withRepo({
  change: {
    'notes.js': '// 100/250\n// UTF-8\n// SHA-256\n// RFC 7231\n// HTTP 404\n// CWE-79\nmodule.exports = 1;\n',
    'notes.py': '# 100/250\n# UTF-8\n# SHA-256\n# RFC 7231\n# HTTP 404\n# CWE-79\nVALUE = 1\n',
  },
}, (repo) => {
  const { status, verdict } = assertSnapshotUnchanged(repo, () => repo.run([]));
  assert.equal(status, 0);
  assert.equal(verdict.gate, 'NO_BLOCKER_FOUND');
  assert.deepEqual(verdict.findings, []);
}));

test('F03 touched-file debt: an old label on an unchanged line is debt, not a blocker', () => withRepo({
  base: { 'app.go': 'package a\n\n// see ' + ADR_LABEL + '\nfunc A() {}\n' },
  change: {
    'app.go': 'package a\n\n// see ' + ADR_LABEL + '\nfunc A() {}\nfunc B() {}\n',
    'extra.js': 'module.exports = 1;\ndebugger;\n',
  },
}, (repo) => {
  const { status, verdict } = assertSnapshotUnchanged(repo, () => repo.run([]));
  assert.equal(status, 0);
  assert.equal(verdict.gate, 'NO_BLOCKER_FOUND');
  assert.equal(verdict.layers.ci_hygiene, 'absent');
  assert.equal(verdict.layers.pre_commit_hygiene, 'absent');
  const debt = hygieneFindings(verdict);
  assert.equal(debt.length, 1);
  assert.deepEqual([debt[0].file, debt[0].line, debt[0].origin, debt[0].severity, debt[0].blocking], ['app.go', 3, 'touched-file', 'P1', false]);
  assert.equal(verdict.summary.touched_file_debt, 1);
  const leftover = verdict.findings.find((entry) => entry.check === 'debug-leftovers');
  assert.deepEqual([leftover.file, leftover.line, leftover.origin, leftover.blocking], ['extra.js', 2, 'changed-line', false]);
}));

test('F12 conflict and secret: both block and the key never reaches the output', () => withRepo({
  change: {
    'app.go': ['package a', OPEN + ' HEAD', 'var a = 1', MIDDLE, 'var a = 2', CLOSE + ' topic', 'var key = "' + AWS_KEY + '"', ''].join('\n'),
  },
}, (repo) => {
  const { status, verdict, stdout } = assertSnapshotUnchanged(repo, () => repo.run([]));
  assert.equal(status, 1);
  const exact = verdict.findings.filter((entry) => entry.severity === 'P0' && entry.confidence === 'exact' && entry.blocking);
  assert.deepEqual(exact.map((entry) => [entry.rule, entry.line]), [['conflict.marker', 2], ['secret.aws-access-key', 7]]);
  assert.equal(exact[1].excerpt, null);
  for (const output of [stdout, repo.run(['--format', 'text']).stdout, repo.run(['--format', 'envelope']).stdout]) {
    assert.ok(!output.includes(AWS_KEY));
  }
}));

test('F18 heuristic .js: JSX in a plain .js file is a heuristic finding that does not block', () => withRepo({
  change: { 'view.js': 'const a = <div>hi</div>;\nmodule.exports = a;\n' },
}, (repo) => {
  const { status, verdict } = assertSnapshotUnchanged(repo, () => repo.run([]));
  assert.equal(status, 0);
  assert.equal(verdict.gate, 'NO_BLOCKER_FOUND');
  const [entry] = verdict.findings.filter((item) => item.rule === 'syntax.js');
  assert.deepEqual([entry.confidence, entry.blocking], ['heuristic', false]);
  assert.equal(verdict.summary.p0_heuristic, 1);
}));

test('unit: checker failure', () => withRepo({ change: { 'app.go': 'package a\n' } }, (repo) => {
  const garbage = fakePython(path.join(repo.parent, 'garbage'), 'process.stdout.write("not json"); process.exit(1);');
  const broken = assertSnapshotUnchanged(repo, () => repo.run([], { env: { PATH: `${garbage}${path.delimiter}${repo.env.PATH}` } }));
  assert.equal(broken.status, 4);
  assert.equal(check(broken.verdict, 'comment-hygiene').state, 'ERROR');
  const usage = fakePython(path.join(repo.parent, 'usage'),
    'process.stdout.write(JSON.stringify({ schema: "comment-hygiene/v1", exit_code: 3, files: [] })); process.exit(3);');
  const refused = repo.run([], { env: { PATH: `${usage}${path.delimiter}${repo.env.PATH}` } });
  assert.equal(refused.status, 4);
  assert.equal(check(refused.verdict, 'comment-hygiene').state, 'ERROR');
}));

test('unit: config fault: a pattern the checker cannot compile ends the run as a config error', () => withRepo({
  base: {
    '.skilled/skills/sk-code/sk-code-quality/repository/quality.json': `${JSON.stringify({ schemaVersion: 1, commentHygiene: { extraPatterns: [CHECKER_REFUSED_PATTERN] } })}\n`,
  },
  change: { 'app.go': 'package a\n' },
}, (repo) => {
  const { status, verdict } = assertSnapshotUnchanged(repo, () => repo.run([]));
  assert.equal(status, 3);
  assert.equal(verdict.gate, 'ERROR');
  assert.equal(verdict.errors[0].code, 'CONFIG_INVALID');
  const [field] = verdict.config.errors;
  assert.equal(field.code, 'CONFIG_INVALID');
  assert.equal(field.field, 'commentHygiene.extraPatterns');
  assert.match(field.message, /--extra-pattern/);

  const runnerFlag = fakePython(path.join(repo.parent, 'own-flag'),
    'process.stderr.write("ERROR: --json needs a value\\n"); process.exit(3);');
  const refused = assertSnapshotUnchanged(repo, () => repo.run([], { env: { PATH: `${runnerFlag}${path.delimiter}${repo.env.PATH}` } }));
  assert.equal(refused.status, 4);
  assert.equal(check(refused.verdict, 'comment-hygiene').state, 'ERROR');
  assert.deepEqual(refused.verdict.config.errors, []);
}));

test('unit: config fault: a checker warning above its refusal still names the field', () => withRepo({
  base: {
    '.skilled/skills/sk-code/sk-code-quality/repository/quality.json': `${JSON.stringify({ schemaVersion: 1, commentHygiene: { extraPatterns: [NESTED_SET_REFUSED_PATTERN] } })}\n`,
  },
  change: { 'app.go': 'package a\n' },
}, (repo) => {
  const { status, verdict } = assertSnapshotUnchanged(repo, () => repo.run([]));
  assert.equal(status, 3);
  assert.equal(verdict.gate, 'ERROR');
  assert.equal(verdict.errors[0].code, 'CONFIG_INVALID');
  const [field] = verdict.config.errors;
  assert.equal(field.code, 'CONFIG_INVALID');
  assert.equal(field.field, 'commentHygiene.extraPatterns');
  assert.match(field.message, /--extra-pattern/);
}));

test('unit: secret redaction: a key on a line that fails to parse, or past the excerpt limit, never prints', () => withRepo({
  change: {
    'a.mjs': 'export const k = 1 ' + AWS_KEY + ';\n',
    'b.cjs': 'const k = 1 ' + GITHUB_TOKEN + ';\n',
    'c.json': '{"k": ' + AWS_KEY_TWO + '}\n',
    'd.js': '// see ' + REQ_LONG + ' ' + 'x'.repeat(165) + ' ' + AWS_KEY + '\nmodule.exports = 1;\n',
  },
}, (repo) => {
  const { status, verdict, stdout } = assertSnapshotUnchanged(repo, () => repo.run([]));
  assert.equal(status, 1);
  const parse = verdict.findings.filter((entry) => entry.rule.startsWith('syntax.'));
  assert.deepEqual(parse.map((entry) => [entry.file, entry.rule]), [['a.mjs', 'syntax.mjs'], ['b.cjs', 'syntax.cjs'], ['c.json', 'syntax.json']]);
  assert.ok(parse.every((entry) => /withheld/.test(entry.reason)));
  const [label] = hygieneFindings(verdict);
  assert.deepEqual([label.file, label.excerpt], ['d.js', null]);
  for (const output of [stdout, repo.run(['--format', 'text']).stdout, repo.run(['--format', 'envelope']).stdout]) {
    for (const key of [AWS_KEY, AWS_KEY_TWO, GITHUB_TOKEN]) assert.ok(!leaksKey(output, key), `part of ${key.slice(0, 4)} printed`);
  }
}));

test('unit: sensors: a marker or a key in a file with no comment family still blocks', () => withRepo({
  change: {
    'README.md': [OPEN + ' HEAD', 'a', MIDDLE, 'b', CLOSE + ' topic', ''].join('\n'),
    '.env': 'AWS_KEY=' + AWS_KEY + '\n',
    'notes.md': 'debugger;\n',
  },
}, (repo) => {
  const { status, verdict, stdout } = assertSnapshotUnchanged(repo, () => repo.run([]));
  assert.equal(status, 1);
  assert.equal(verdict.gate, 'BLOCKED');
  assert.deepEqual(verdict.findings.map((entry) => [entry.file, entry.rule, entry.line, entry.blocking]),
    [['.env', 'secret.aws-access-key', 1, true], ['README.md', 'conflict.marker', 1, true]]);
  assert.deepEqual(verdict.coverage.unchecked.map((entry) => entry.reason), ['no comment family', 'no comment family', 'no comment family']);
  assert.equal(verdict.coverage.files_checked, 0);
  assert.ok(!leaksKey(stdout, AWS_KEY));
}));

test('unit: jsonc: tool configs parse as JSONC, and another .json that parses only as JSONC does not block', () => withRepo({
  change: {
    '.vscode/settings.json': '{\n  // editor\n  "a": 1,\n}\n',
    '.devcontainer/devcontainer.json': '{\n  // image\n  "a": 1\n}\n',
    '.eslintrc.json': '{\n  /* rules */\n  "a": 1\n}\n',
    'data.json': '{\n  // note\n  "a": 1\n}\n',
    'broken.json': '{"a": }\n',
  },
}, (repo) => {
  const { status, verdict } = assertSnapshotUnchanged(repo, () => repo.run([]));
  assert.equal(status, 1);
  assert.deepEqual(verdict.findings.map((entry) => [entry.file, entry.rule, entry.confidence, entry.blocking]),
    [['broken.json', 'syntax.json', 'exact', true], ['data.json', 'syntax.json', 'heuristic', false]]);
}));

test('unit: changed lines: a tracked file whose name holds a space keeps its changed lines', () => withRepo({
  base: { 'a b.js': 'module.exports = 1;\n', 'é f.py': 'A = 1\n' },
  change: { 'a b.js': 'module.exports = 1;\n// see ' + ADR_LABEL + '\n', 'é f.py': 'A = 1\n# see ' + REQ_LONG + '\n' },
}, (repo) => {
  const { status, verdict } = assertSnapshotUnchanged(repo, () => repo.run([]));
  assert.equal(status, 1);
  assert.deepEqual(hygieneFindings(verdict).map((entry) => [entry.file, entry.line, entry.origin, entry.blocking]),
    [['a b.js', 2, 'changed-line', true], ['é f.py', 2, 'changed-line', true]]);
}));
