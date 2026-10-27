// ───────────────────────────────────────────────────────────────────
// MODULE: sk-code Rule Overrides Linter Tests
// ───────────────────────────────────────────────────────────────────
'use strict';

// Each case writes a checklist into a throwaway folder and runs the linter the way a
// user would, then reads its exit code and output. The last cases read the contract
// reference and its JSON side by side, because the floor must be the same in both.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const checkRuleOverrides = require('../check-rule-overrides.cjs');

const { CONTRACT_PATH, lintOverrides, loadContract } = checkRuleOverrides;

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const LINTER = path.resolve(__dirname, '..', 'check-rule-overrides.cjs');
const REFERENCE_PATH = path.resolve(__dirname, '..', '..', 'references', 'universal', 'rule-overrides.md');
const HEADER = '| Rule | Action | Reason |\n| --- | --- | --- |\n';

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function runOn(content) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'rule-overrides-'));
  const file = path.join(dir, 'checklist.md');
  fs.writeFileSync(file, content);
  const run = spawnSync(process.execPath, [LINTER, file], { encoding: 'utf8' });
  fs.rmSync(dir, { recursive: true, force: true });
  return run;
}

function checklist(rows) {
  return `# Checklist\n\n## Rules\n\n- A rule.\n\n## Rule overrides\n\n${HEADER}${rows}\n## Related\n\n- Nothing.\n`;
}

// Reads the id column of the hard floor table in the reference's section 4.
function referenceFloorIds() {
  const text = fs.readFileSync(REFERENCE_PATH, 'utf8');
  const section = text.split(/^## 4\. THE HARD FLOOR$/m)[1].split(/^## 5\./m)[0];
  return section.split('\n')
    .map((line) => /^\| `([^`]+)` \|/.exec(line))
    .filter(Boolean)
    .map((match) => match[1]);
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. TESTS
// ─────────────────────────────────────────────────────────────────────────────

test('valid none and replace rows pass with exit 0', () => {
  const run = runOn(checklist(
    '| `hygiene.task` | none | No task ids here |\n'
    + '| review.function-length | replace: A function stays under 60 lines \\| or splits | Team limit |\n'
    + '| `floor.documentation` | none | |\n',
  ));
  assert.equal(run.status, 0, run.stderr);
  assert.match(run.stdout, /OK .*checklist\.md: 3 rule override\(s\)/);
  const result = lintOverrides(checklist('| review.function-length | replace: under 60 \\| or split | Team |\n'));
  assert.deepEqual(result.rows.map((row) => [row.id, row.action, row.text, row.reason]), [
    ['review.function-length', 'replace', 'under 60 | or split', 'Team'],
  ]);
});

test('a numbered upper-case heading is read as the same section', () => {
  const result = lintOverrides(`# C\n\n## 7. RULE OVERRIDES\n\n${HEADER}| hygiene.adr | none | |\n`);
  assert.equal(result.found, true);
  assert.equal(result.rows.length, 1);
});

test('a hard floor id is refused with exit 1 and names the rule', () => {
  const run = runOn(checklist('| `secret.private-key` | none | We trust our scanner |\n| floor.input-validation | replace: trust callers | |\n'));
  assert.equal(run.status, 1);
  assert.match(run.stderr, /checklist\.md:\d+: `secret\.private-key` is on the hard floor \(Credential signature/);
  assert.match(run.stderr, /`floor\.input-validation` is on the hard floor/);
  assert.match(run.stdout, /FAIL .*: 2 refused/);
});

test('lintOverrides, the only reading path, returns an error and no row for a floor id', () => {
  assert.equal(checkRuleOverrides.parseOverrides, undefined);
  const result = lintOverrides(checklist('| review.security-minimums | none | |\n| hygiene.adr | none | |\n'));
  assert.equal(result.errors.length, 1);
  assert.match(result.errors[0].message, /`review\.security-minimums` is on the hard floor/);
  assert.deepEqual(result.rows.map((row) => row.id), ['hygiene.adr']);
});

test('a replace row on a machine-checked id is refused, and a none row is accepted', () => {
  const run = runOn(checklist('| hygiene.task | replace: name the tracker | |\n| debug.pdb | replace: allowed in tests | |\n| dist.stale | none | |\n'));
  assert.equal(run.status, 1);
  assert.match(run.stderr, /`hygiene\.task` is checked by the runner, so it takes none but never replace:/);
  assert.match(run.stderr, /`debug\.pdb` is checked by the runner/);
  assert.doesNotMatch(run.stderr, /dist\.stale/);
  assert.match(run.stdout, /FAIL .*: 2 refused/);
});

test('malformed rows, bad ids and unknown actions are refused', () => {
  const run = runOn(checklist(
    '| hygiene.task |\n'
    + '| Hygiene Task | none | |\n'
    + '| hygiene.* | none | |\n'
    + '| hygiene.adr | disable | |\n'
    + '| hygiene.issue | replace: | |\n'
    + '| hygiene.chk | none | a | b |\n',
  ));
  assert.equal(run.status, 1);
  assert.match(run.stderr, /a row has 1 cells/);
  assert.match(run.stderr, /"Hygiene Task" is not a rule id/);
  assert.match(run.stderr, /"hygiene\.\*" is not a rule id/);
  assert.match(run.stderr, /unknown action "disable"/);
  assert.match(run.stderr, /the replace action needs the rule text/);
  assert.match(run.stderr, /a row has 4 cells/);
});

test('a repeated id and a second section are refused', () => {
  const repeated = lintOverrides(checklist('| review.function-length | none | |\n| review.function-length | replace: under 60 lines | |\n'));
  assert.equal(repeated.errors.length, 1);
  assert.match(repeated.errors[0].message, /already overridden at line/);
  const twice = lintOverrides(`## Rule overrides\n\n${HEADER}| hygiene.task | none | |\n\n## Rule overrides\n\n${HEADER}`);
  assert.match(twice.errors[0].message, /a second Rule overrides section/);
});

test('an absent section passes with exit 0, and a fenced example is not a section', () => {
  const absent = runOn('# Checklist\n\n## Rules\n\n- Comment the WHY.\n');
  assert.equal(absent.status, 0, absent.stderr);
  assert.match(absent.stdout, /no Rule overrides section/);
  const fenced = runOn(`# Doc\n\n\`\`\`markdown\n## Rule overrides\n\n${HEADER}| secret.private-key | none | |\n\`\`\`\n`);
  assert.equal(fenced.status, 0, fenced.stderr);
  assert.match(fenced.stdout, /no Rule overrides section/);
});

test('usage errors exit 2', () => {
  const none = spawnSync(process.execPath, [LINTER], { encoding: 'utf8' });
  assert.equal(none.status, 2);
  assert.match(none.stderr, /Usage: check-rule-overrides\.cjs/);
  const missing = spawnSync(process.execPath, [LINTER, path.join(os.tmpdir(), 'no-such-checklist.md')], { encoding: 'utf8' });
  assert.equal(missing.status, 2);
  assert.match(missing.stderr, /cannot read/);
});

test('the reference floor table and the JSON floor list hold the same ids', () => {
  const contract = loadContract(CONTRACT_PATH);
  const jsonIds = contract.fixed.map((entry) => entry.id);
  assert.ok(jsonIds.length > 0);
  assert.deepEqual(referenceFloorIds(), jsonIds);
  const reference = fs.readFileSync(REFERENCE_PATH, 'utf8');
  const named = /A row for a machine-checked id \(([^)]*)\)/.exec(reference)[1].match(/`([a-z-]+)\.\*`/g).map((id) => id.slice(1, -3));
  assert.deepEqual(named, contract.machineChecked);
});

test('the contract reference itself lints clean', () => {
  const run = spawnSync(process.execPath, [LINTER, REFERENCE_PATH], { encoding: 'utf8' });
  assert.equal(run.status, 0, run.stderr);
});
