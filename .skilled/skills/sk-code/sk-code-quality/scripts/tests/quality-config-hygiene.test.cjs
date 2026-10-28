// ───────────────────────────────────────────────────────────────────
// MODULE: sk-code-quality Repository Comment-Hygiene Config Tests
// ───────────────────────────────────────────────────────────────────
'use strict';

// The values a repository config may carry for the comment-hygiene checker: ticket prefixes,
// extra patterns, extension families and the rules it disables, beside the shipped template.
// A foreign repository writes its own tracker ids and model names in comments, so every label
// a case seeds is joined at run time and this part never carries one in its own text.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('node:assert/strict');
const fs = require('node:fs');
const test = require('node:test');

const { assertSnapshotUnchanged } = require('./fixtures.cjs');
const { CLEAN_GO, DEFAULTS, TARGET, fields, hygieneFindings, json, withRepo } = require('./quality-suite-helpers.cjs');
const { resolveHygieneFlags } = require('../hygiene-config-flags.cjs');
const {
  SPEC_KIT_HYGIENE_RULES, TEMPLATE_PATH, hygieneCheckerFlags, mergeConfig, readHygieneRules, validateConfig,
} = require('../lib/quality-config.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const ADR_LABEL = ['ADR', '12'].join('-');
const TICKET_LABEL = ['ACME', '12'].join('-');
const WIDGET_LABEL = ['widget', '42'].join('-');

// ─────────────────────────────────────────────────────────────────────────────
// 3. CASES
// ─────────────────────────────────────────────────────────────────────────────

test('ticket: a prefix with a symbol is a config error, and a valid prefix reaches the checker', () => {
  const refused = validateConfig({ schemaVersion: 1, commentHygiene: { ticketPrefixes: ['JI-RA', 'OK1', '9AB'] } });
  assert.deepEqual(refused.map((entry) => entry.field), ['commentHygiene.ticketPrefixes[0]', 'commentHygiene.ticketPrefixes[2]']);
  withRepo({
    base: { 'app.go': CLEAN_GO, [TARGET]: json({ schemaVersion: 1, commentHygiene: { ticketPrefixes: ['ACME'] } }) },
    change: { 'app.go': `${CLEAN_GO}// see ${TICKET_LABEL}\nfunc B() {}\n` },
  }, (repo) => {
    const { status, verdict } = assertSnapshotUnchanged(repo, () => repo.run([]));
    assert.equal(status, 1);
    assert.deepEqual(hygieneFindings(verdict).map((entry) => [entry.rule, entry.line]), [['hygiene.ticket-prefix', 4]]);
    const hygiene = verdict.checks.find((entry) => entry.id === 'comment-hygiene');
    assert.deepEqual(hygiene.argv.slice(hygiene.argv.indexOf('--json') + 1, -2), ['--ticket-prefix', 'ACME']);
  });
});

test('extraPatterns: a pattern over 200 characters or one that does not compile is a config error, and a valid one reaches the checker', () => {
  const refused = validateConfig({ schemaVersion: 1, commentHygiene: { extraPatterns: ['a'.repeat(201), '(', 'b'.repeat(200)] } });
  assert.deepEqual(refused.map((entry) => entry.field), ['commentHygiene.extraPatterns[0]', 'commentHygiene.extraPatterns[1]']);
  withRepo({
    base: { 'app.go': CLEAN_GO, [TARGET]: json({ schemaVersion: 1, commentHygiene: { extraPatterns: ['\\bwidget-[0-9]+\\b'] } }) },
    change: { 'app.go': `${CLEAN_GO}// see ${WIDGET_LABEL}\nfunc B() {}\n` },
  }, (repo) => {
    const { status, verdict } = assertSnapshotUnchanged(repo, () => repo.run([]));
    assert.equal(status, 1);
    assert.deepEqual(hygieneFindings(verdict).map((entry) => entry.rule), ['hygiene.extra-pattern']);

    // A variable-width lookbehind is JavaScript's and not Python's, and the validator
    // cannot see that, so the run names the field the refused value came from.
    repo.write({ [TARGET]: json({ schemaVersion: 1, commentHygiene: { extraPatterns: ['(?<=a+)b'] } }) });
    const refused = repo.run([]);
    assert.equal(refused.status, 3);
    assert.deepEqual(refused.verdict.config.errors.map((entry) => entry.field), ['commentHygiene.extraPatterns']);
    assert.match(refused.verdict.config.errors[0].message, /the checker refused the value: --extra-pattern is not a valid regular expression/);
  });
});

test('extraPatterns: a construct Python re rejects is a config error, and the lookbehind it accepts is not', () => {
  const refused = validateConfig({
    schemaVersion: 1,
    commentHygiene: { extraPatterns: ['\\p{L}', '(?<year>\\d+)', '\\k<year>'] },
  });
  assert.deepEqual(refused.map((entry) => entry.field), [
    'commentHygiene.extraPatterns[0]',
    'commentHygiene.extraPatterns[1]',
    'commentHygiene.extraPatterns[2]',
  ]);
  assert.match(refused[0].message, /property escape/);
  assert.match(refused[1].message, /named group/);
  assert.match(refused[2].message, /backreference/);
  assert.ok(refused.every((entry) => entry.message.includes('Python re')));
  // A lookbehind and a plain label pattern reach Python's re as they are.
  assert.deepEqual(validateConfig({ schemaVersion: 1, commentHygiene: { extraPatterns: ['(?<=x)y', '\\bwidget-[0-9]+\\b'] } }), []);
});

test('extraPatterns: a character class makes a construct literal, and \\p inside one is still a fault', () => {
  // Python reads the contents of a class literally, so a pattern whose only construct sits
  // inside one compiles there as it does here.
  assert.deepEqual(validateConfig({ schemaVersion: 1, commentHygiene: { extraPatterns: ['[(?<a]'] } }), []);
  const refused = validateConfig({
    schemaVersion: 1,
    commentHygiene: { extraPatterns: ['[\\]](?<y>x)', '(?<year>x)', '[\\p{L}]'] },
  });
  assert.deepEqual(refused.map((entry) => entry.field), [
    'commentHygiene.extraPatterns[0]',
    'commentHygiene.extraPatterns[1]',
    'commentHygiene.extraPatterns[2]',
  ]);
  // The class closes before the group, and the property escape is refused inside one.
  assert.match(refused[0].message, /named group/);
  assert.match(refused[1].message, /named group/);
  assert.match(refused[2].message, /property escape/);
});

test('extensions: a mapped extension gives a file a family the checker reads, and an unknown family is a config error', () => {
  const refused = validateConfig({ schemaVersion: 1, commentHygiene: { extensions: { '.zig': 'klingon', zig: 'c' } } });
  assert.deepEqual(refused.map((entry) => entry.field), ['commentHygiene.extensions..zig', 'commentHygiene.extensions.zig']);
  withRepo({
    base: { 'README.txt': 'fixture\n', [TARGET]: json({ schemaVersion: 1, commentHygiene: { extensions: { '.zig': 'c' }, exclude: ['skip/**'] } }) },
    change: { 'a.zig': `const a = 1; // see ${ADR_LABEL}\n`, 'skip/b.zig': `const b = 1; // see ${ADR_LABEL}\n` },
  }, (repo) => {
    const { status, verdict } = assertSnapshotUnchanged(repo, () => repo.run([]));
    assert.equal(status, 1);
    assert.deepEqual(hygieneFindings(verdict).map((entry) => entry.file), ['a.zig']);
    assert.deepEqual(verdict.coverage.unchecked, []);
  });
});

test('extensions: a repository adds an extension the shipped table lacks, and a remap is a config error', () => {
  const remapped = validateConfig({ schemaVersion: 1, commentHygiene: { extensions: { '.js': 'hash' } } });
  assert.deepEqual(remapped.map((entry) => entry.field), ['commentHygiene.extensions..js']);
  assert.match(remapped[0].message, /already owned by the shipped table/);
  assert.deepEqual(validateConfig({ schemaVersion: 1, commentHygiene: { extensions: { '.foo': 'hash' } } }), []);
  // A remap would read this file as a hash comment, so the run refuses the config before
  // any check starts and the label in the file stays reachable.
  withRepo({
    base: { 'a.js': `const a = 1; // see ${ADR_LABEL}\n` },
    change: { [TARGET]: json({ schemaVersion: 1, commentHygiene: { extensions: { '.js': 'hash' } } }) },
  }, (repo) => {
    const { status, verdict } = assertSnapshotUnchanged(repo, () => repo.run([]));
    assert.equal(status, 3);
    assert.deepEqual(fields(verdict), ['commentHygiene.extensions..js']);
  });
});

// A foreign repository writes its own tracker ids and model names in comments, and the
// core rules read them as planning labels. Each label is joined here, so this file never
// carries one in its own text.
const FOREIGN_COMMENTS = [
  `// ${['Fixes', '#1234'].join(' ')}`,
  `// See ${['ADR', '004'].join('-')}`,
  `// The ${['T', '1000'].join('')} model reads this`,
].join('\n');

test('disableRules: a foreign repository that disables issue, adr and task is no longer blocked by its own ids', () => withRepo({
  base: { 'app.js': 'const a = 1;\n' },
  change: { 'app.js': `const a = 1;\n${FOREIGN_COMMENTS}\nconst b = 2;\n` },
}, (repo) => {
  const blocked = assertSnapshotUnchanged(repo, () => repo.run([]));
  assert.equal(blocked.status, 1);
  assert.deepEqual(hygieneFindings(blocked.verdict).map((entry) => entry.rule), ['hygiene.issue', 'hygiene.adr', 'hygiene.task']);
  assert.deepEqual(blocked.verdict.config.hygiene, { disabled: [] });

  repo.write({ [TARGET]: json({ schemaVersion: 1, commentHygiene: { disableRules: ['issue', 'hygiene.adr', 'task'] } }) });
  const { status, verdict } = assertSnapshotUnchanged(repo, () => repo.run([]));
  assert.equal(status, 0);
  assert.deepEqual(hygieneFindings(verdict), []);
  assert.deepEqual(verdict.config.hygiene, { disabled: ['hygiene.issue', 'hygiene.adr', 'hygiene.task'] });
  const hygiene = verdict.checks.find((entry) => entry.id === 'comment-hygiene');
  assert.equal(hygiene.state, 'RAN_CLEAN');
  assert.deepEqual(hygiene.argv.slice(hygiene.argv.indexOf('--json') + 1, -2),
    ['--disable-rule', 'issue', '--disable-rule', 'adr', '--disable-rule', 'task']);
}));

test('disableRules: an unknown id and a fixed id are each CONFIG_INVALID, exit 3, before any check starts', () => {
  const refused = validateConfig({ schemaVersion: 1, commentHygiene: { disableRules: ['issue', 'nope', 'secret.private-key', 'conflict.markers', 'floor.input-validation'] } });
  assert.deepEqual(refused.map((entry) => entry.field), [
    'commentHygiene.disableRules[1]', 'commentHygiene.disableRules[2]', 'commentHygiene.disableRules[3]', 'commentHygiene.disableRules[4]',
  ]);
  assert.match(refused[0].message, /names no core comment-hygiene rule/);
  for (const entry of refused.slice(1)) assert.match(entry.message, /fixed by the shared rule-override contract/);
  assert.deepEqual(validateConfig({ schemaVersion: 1, commentHygiene: { disableRules: 'issue' } }).map((entry) => entry.field), ['commentHygiene.disableRules']);
  withRepo({
    base: { 'app.js': 'const a = 1;\n' },
    change: { 'app.js': `const a = 1;\n${FOREIGN_COMMENTS}\n`, [TARGET]: json({ schemaVersion: 1, commentHygiene: { disableRules: ['tsak'] } }) },
  }, (repo) => {
    const { status, verdict } = assertSnapshotUnchanged(repo, () => repo.run([]));
    assert.equal(status, 3);
    assert.equal(verdict.errors[0].code, 'CONFIG_INVALID');
    assert.deepEqual(fields(verdict), ['commentHygiene.disableRules[0]']);
    assert.deepEqual(verdict.checks, []);
  });
});

test('disableRules: the rule list comes from the checker, and the spec-kit suggestion names fifteen of its rules', () => {
  const rules = readHygieneRules();
  assert.equal(rules.length, 21);
  assert.equal(SPEC_KIT_HYGIENE_RULES.length, 15);
  for (const rule of SPEC_KIT_HYGIENE_RULES) assert.ok(rules.includes(rule), rule);
  assert.deepEqual(rules.filter((rule) => !SPEC_KIT_HYGIENE_RULES.includes(rule)).sort(), ['adr', 'chk', 'issue', 'rc', 'req', 'task']);
  assert.deepEqual(hygieneCheckerFlags(mergeConfig(DEFAULTS, { schemaVersion: 1, commentHygiene: { disableRules: ['hygiene.task', 'task'] } }).commentHygiene),
    ['--disable-rule', 'task']);
});

test('disableRules: the pre-commit and CI helper passes only the disabled rules, never the additions', () => withRepo({
  base: {
    'app.go': CLEAN_GO,
    [TARGET]: json({ schemaVersion: 1, commentHygiene: {
      ticketPrefixes: ['JIRA'], extraPatterns: ['(?<=a+)b'], extensions: { '.zig': 'c' }, disableRules: ['issue', 'hygiene.task'],
    } }),
  },
}, (repo) => {
  const result = resolveHygieneFlags({ root: repo.root, env: repo.env });
  assert.deepEqual(result.errors, []);
  assert.deepEqual(result.flags, ['--disable-rule', 'issue', '--disable-rule', 'task']);
  assert.deepEqual(result.disabled, ['hygiene.issue', 'hygiene.task']);
}));

test('template: the shipped template parses and passes the schema', () => {
  const template = JSON.parse(fs.readFileSync(TEMPLATE_PATH, 'utf8'));
  assert.equal(template.schemaVersion, 1);
  assert.deepEqual(validateConfig(template), []);
});
