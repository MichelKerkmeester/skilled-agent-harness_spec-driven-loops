// Dependency-free tests for the dispatch hard-rule engine. Run: node --test <this file>
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseHardRules, readHardRules, evaluate, CHECKS, KNOWN_CHECKS } from './dispatch-rule-checks.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const CLI_ORCHESTRATION = path.resolve(HERE, '../../../skills/cli-external-orchestration');
const CO = path.join(CLI_ORCHESTRATION, 'cli-opencode/SKILL.md');
const CC = path.join(CLI_ORCHESTRATION, 'cli-claude-code/SKILL.md');

test('parses the flat hard_rules list from real SKILL.md frontmatter', () => {
  const co = readHardRules(CO);
  assert.deepEqual(co.map((r) => r.id), [
    'stdin-redirect-required', 'explicit-model-required', 'no-bare-agent-general',
    'command-flag-for-slash-prompt', 'share-requires-confirmation',
  ]);
  // Assert the ids, not a bare count: this line read `length, 1` while the packet had
  // carried two rules since its permission-mode rule was added, so the count drifted
  // silently and the assertion was failing rather than guarding anything.
  assert.deepEqual(readHardRules(CC).map((r) => r.id), [
    'stdin-redirect-required', 'non-interactive-permission-mode-risk',
  ]);
  assert.ok(co.every((r) => r.message && r.severity)); // full shape survives parsing
});

// This guard used to name CO and CC explicitly. Those were the only two packets whose
// checks were all implemented, so the four that declared unimplemented ones were never
// looked at: eleven rules, several at severity `error`, silently doing nothing for as
// long as they had existed. Enumerate the directory instead of listing packets by hand.
test('CI GUARD: every declared check id maps to a known check (a typo fails loudly)', () => {
  const packets = fs.readdirSync(CLI_ORCHESTRATION, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name.startsWith('cli-'))
    .map((entry) => path.join(CLI_ORCHESTRATION, entry.name, 'SKILL.md'))
    .filter((md) => fs.existsSync(md));

  assert.ok(packets.length >= 6, `expected every cli-* packet to be scanned, saw ${packets.length}`);
  for (const md of packets) {
    for (const rule of readHardRules(md)) {
      assert.ok(KNOWN_CHECKS.includes(rule.check), `unknown check "${rule.check}" in ${md}`);
    }
  }
});

test('stdin-redirect-required covers every headless CLI shape, not just opencode run', () => {
  const shapes = [
    'opencode run "task"',
    'pi -p "task"',
    'claude -p "task"',
    'codex exec "task"',
    'devin -p "task"',
    'cursor-agent -p "task"',
  ];
  for (const cmd of shapes) {
    assert.equal(CHECKS['stdin-redirect-required'](cmd), false, `unredirected: ${cmd}`);
    assert.equal(CHECKS['stdin-redirect-required'](`${cmd} </dev/null`), true, `redirected: ${cmd}`);
  }
  assert.equal(CHECKS['stdin-redirect-required']('npm test'), true); // not a dispatch → n/a
});

test('availability checks pass for a resolvable binary and never refuse without PATH', () => {
  // `sh` is on PATH anywhere this suite can run, so it stands in for a present binary.
  const present = CHECKS['command-v-pi-required'];
  assert.equal(present('npm test'), true); // command does not invoke pi → n/a

  const savedPath = process.env.PATH;
  try {
    delete process.env.PATH;
    assert.equal(present('pi -p "task"'), true); // no PATH to resolve against → cannot refuse
    process.env.PATH = '/nonexistent-dir-for-this-test';
    assert.equal(present('pi -p "task"'), false); // conclusively absent → refuse
  } finally {
    process.env.PATH = savedPath;
  }
});

test('AC-1: opencode run without </dev/null is flagged; with it, clean (mutation-proof)', () => {
  const rules = readHardRules(CO);
  const flagged = evaluate('opencode run -m p/m "do a thing"', rules).map((v) => v.id);
  assert.deepEqual(flagged, ['stdin-redirect-required']);
  // Mutation guard: the SAME command with a redirect must NOT flag — proves the check discriminates.
  assert.deepEqual(evaluate('opencode run -m p/m "do a thing" </dev/null', rules), []);
  assert.deepEqual(evaluate('cat x | opencode run -m p/m "x"', rules), []); // pipe closes inherited stdin
});

test('other checks discriminate correctly', () => {
  const rules = readHardRules(CO);
  const ids = (cmd) => evaluate(cmd, rules).map((v) => v.id).sort();
  assert.deepEqual(ids('opencode run -m p/m --agent general "x" </dev/null'), ['no-bare-agent-general']);
  assert.deepEqual(ids('opencode run -m p/m "/memory:search q" </dev/null'), ['command-flag-for-slash-prompt']);
  assert.deepEqual(ids('opencode run -m p/m --command memory/search "/memory:search q" </dev/null'), []);
  assert.deepEqual(ids('opencode run -m p/m "x" --share </dev/null'), ['share-requires-confirmation']);
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

test('severity maps error and block to a blocking violation; anything else advises', () => {
  const rules = [
    { id: 'err', check: 'always-fail', message: 'e', severity: 'error' },
    { id: 'blk', check: 'always-fail', message: 'b', severity: 'block' },
    { id: 'wrn', check: 'always-fail', message: 'w', severity: 'warn' },
    { id: 'bare', check: 'always-fail', message: 'n', severity: undefined },
  ];
  const saved = CHECKS['always-fail'];
  CHECKS['always-fail'] = () => false;
  try {
    const bySev = Object.fromEntries(evaluate('opencode run "x"', rules).map((v) => [v.id, v.severity]));
    assert.equal(bySev.err, 'block');
    assert.equal(bySev.blk, 'block');
    assert.equal(bySev.wrn, 'warn');
    assert.equal(bySev.bare, 'warn');
  } finally {
    if (saved === undefined) delete CHECKS['always-fail']; else CHECKS['always-fail'] = saved;
  }
});
