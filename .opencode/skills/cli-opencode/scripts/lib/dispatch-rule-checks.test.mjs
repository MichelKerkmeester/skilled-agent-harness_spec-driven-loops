// Dependency-free tests for the dispatch hard-rule engine. Run: node --test <this file>
import { test } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseHardRules, readHardRules, evaluate, CHECKS, KNOWN_CHECKS } from './dispatch-rule-checks.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SKILLS = path.resolve(HERE, '../../../'); // .opencode/skills
const CO = path.join(SKILLS, 'cli-opencode/SKILL.md');
const CC = path.join(SKILLS, 'cli-claude-code/SKILL.md');

test('parses the flat hard_rules list from real SKILL.md frontmatter', () => {
  const co = readHardRules(CO);
  assert.deepEqual(co.map((r) => r.id), [
    'stdin-redirect-required', 'no-bare-agent-general',
    'command-flag-for-slash-prompt', 'share-requires-confirmation',
  ]);
  assert.equal(readHardRules(CC).length, 1);
  assert.ok(co.every((r) => r.message && r.severity)); // full shape survives parsing
});

test('CI GUARD: every declared check id maps to a known check (a typo fails loudly)', () => {
  for (const md of [CO, CC]) {
    for (const rule of readHardRules(md)) {
      assert.ok(KNOWN_CHECKS.includes(rule.check), `unknown check "${rule.check}" in ${md}`);
    }
  }
});

test('AC-1: opencode run without </dev/null is flagged; with it, clean (mutation-proof)', () => {
  const rules = readHardRules(CO);
  const flagged = evaluate('opencode run "do a thing"', rules).map((v) => v.id);
  assert.deepEqual(flagged, ['stdin-redirect-required']);
  // Mutation guard: the SAME command with a redirect must NOT flag — proves the check discriminates.
  assert.deepEqual(evaluate('opencode run "do a thing" </dev/null', rules), []);
  assert.deepEqual(evaluate('cat x | opencode run "x"', rules), []); // pipe closes inherited stdin
});

test('other checks discriminate correctly', () => {
  const rules = readHardRules(CO);
  const ids = (cmd) => evaluate(cmd, rules).map((v) => v.id).sort();
  assert.deepEqual(ids('opencode run --agent general "x" </dev/null'), ['no-bare-agent-general']);
  assert.deepEqual(ids('opencode run "/memory:search q" </dev/null'), ['command-flag-for-slash-prompt']);
  assert.deepEqual(ids('opencode run --command memory/search "/memory:search q" </dev/null'), []);
  assert.deepEqual(ids('opencode run "x" --share </dev/null'), ['share-requires-confirmation']);
  assert.deepEqual(ids('git status && ls -la'), []); // non-dispatch bash never fires
});

test('fail-open: a check that throws never produces a violation', () => {
  const throwing = [{ id: 'boom', check: 'boom', message: 'x', severity: 'block' }];
  const saved = CHECKS.boom;
  CHECKS.boom = () => { throw new Error('kaboom'); };
  try {
    assert.deepEqual(evaluate('opencode run "x"', throwing), []);
  } finally {
    if (saved === undefined) delete CHECKS.boom; else CHECKS.boom = saved;
  }
});

test('parseHardRules returns [] for frontmatter without the key or malformed input', () => {
  assert.deepEqual(parseHardRules('---\nname: x\n---\nbody'), []);
  assert.deepEqual(parseHardRules(''), []);
  assert.deepEqual(parseHardRules(null), []);
});
