// Dependency-free tests for the dispatch hard-rule engine. Run: node --test <this file>
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseHardRules, readHardRules, evaluate, CHECKS, KNOWN_CHECKS } from './dispatch-rule-checks.mjs';
import { DISPATCH_SHAPES, matchDispatchShape } from './dispatch-audit.mjs';

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

// A runtime with no pre-execution adapter records a wrong dispatch after it ran and never
// stops it, and nothing failed loudly while two runtimes sat in that state. Assert the
// adapter file AND its registration, because either alone leaves the guard unreachable.
test('every runtime with a preflight adapter has it registered', () => {
  const REPO = path.resolve(HERE, '../../../..');
  const adapters = {
    claude: '.opencode/hooks/dispatch/claude/dispatch-preflight-lint.mjs',
    codex: '.opencode/hooks/dispatch/codex/dispatch-preflight-lint.mjs',
    devin: '.opencode/hooks/dispatch/devin/dispatch-preflight-lint.mjs',
    cursor: '.opencode/hooks/dispatch/cursor/dispatch-preflight-lint.mjs',
  };
  for (const [runtime, rel] of Object.entries(adapters)) {
    assert.ok(fs.existsSync(path.join(REPO, rel)), `${runtime} preflight adapter missing: ${rel}`);
  }
  const registry = JSON.parse(fs.readFileSync(
    path.join(REPO, '.opencode/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json'), 'utf8'));
  const entry = registry.hooks.find((h) => h.id === 'dispatch-preflight-lint');
  assert.ok(entry, 'dispatch-preflight-lint is absent from the hook registry');
  for (const runtime of Object.keys(adapters)) {
    const bindings = entry.bindings[runtime];
    assert.ok(Array.isArray(bindings) && bindings.length > 0, `${runtime} has no preflight binding`);
    assert.equal(bindings[0].script, adapters[runtime], `${runtime} binding points elsewhere`);
  }
  // OpenCode enforces in-process rather than through a registered command hook.
  const ocPlugin = fs.readFileSync(path.join(REPO, '.opencode/plugins/cli-dispatch-audit.js'), 'utf8');
  assert.match(ocPlugin, /tool\.execute\.before/, 'the opencode plugin has no pre-execution hook');
});

test('pi dispatches need --offline and a provider-qualified model', () => {
  const CP = path.join(CLI_ORCHESTRATION, 'cli-pi/SKILL.md');
  const rules = readHardRules(CP).filter((r) => r.check !== 'command-v-pi-required');
  const ids = (cmd) => evaluate(cmd, rules).map((v) => v.id).sort();
  assert.deepEqual(ids('pi -p --offline --model llmgateway/glm-5.3-flash "task" </dev/null'), []);
  assert.deepEqual(ids('pi -p --model llmgateway/glm-5.3-flash "task" </dev/null'), ['pi-offline-required']);
  assert.deepEqual(ids('pi -p --offline --model glm-5.3-flash "task" </dev/null'), ['pi-provider-qualified-model']);
  // No --model at all is the model rule's silence, not a qualification failure.
  assert.deepEqual(ids('pi -p --offline "task" </dev/null'), []);
  assert.deepEqual(ids('git status'), []); // not a pi dispatch
});

// Each of these spellings reached the runtime unflagged while its sibling was caught, so the
// rule read as enforced while the equals form and the unquoted prompt walked straight past.
test('predicate bypasses: equals-form flags and unquoted slash prompts are caught', () => {
  const rules = readHardRules(CO);
  const ids = (cmd) => evaluate(cmd, rules).map((v) => v.id).sort();
  assert.deepEqual(ids('opencode run -m p/m --agent=general "x" </dev/null'), ['no-bare-agent-general']);
  assert.deepEqual(ids('opencode run -m p/m "x" --share=public </dev/null'), ['share-requires-confirmation']);
  assert.deepEqual(ids('opencode run -m p/m /memory:search q </dev/null'), ['command-flag-for-slash-prompt']);
  // The correct forms still pass, so the widened patterns discriminate rather than blanket-fire.
  assert.deepEqual(ids('opencode run -m p/m --agent=build "x" </dev/null'), []);
  assert.deepEqual(ids('opencode run -m p/m --command memory/search /memory:search q </dev/null'), []);
  // Negative control: a URL and a POSIX path must not read as a slash prompt.
  assert.deepEqual(ids('opencode run -m p/m "see https://example.com/a:b" </dev/null'), []);
  assert.deepEqual(ids('opencode run -m p/m "read /tmp/x:y" </dev/null'), []);
});

test('hermes headless shapes need stdin handled: --query-file counts, a bare -q does not', () => {
  const stdin = CHECKS['stdin-redirect-required'];
  assert.equal(stdin('hermes chat -Q --oneshot -q "task"'), false);
  assert.equal(stdin('hermes chat -Q --oneshot -q "task" </dev/null'), true);
  assert.equal(stdin('hermes chat -Q --oneshot --query-file prompt.md --yolo'), true);
  assert.equal(stdin('cat prompt.md | hermes chat -Q --oneshot --query-file -'), true);
  assert.equal(stdin('hermes -z "task"'), false);
  assert.equal(stdin('hermes skills list'), true); // not a dispatch shape
});

test('hermes rules discriminate on the flags the packet contract pins', () => {
  const CH = path.join(CLI_ORCHESTRATION, 'cli-hermes/SKILL.md');
  const rules = readHardRules(CH).filter((r) => r.check !== 'command-v-hermes-required');
  const ids = (cmd) => evaluate(cmd, rules).map((v) => v.id).sort();
  const good = 'hermes chat -Q --oneshot --query-file p.md --provider llmgateway --model deepseek-v4.1-flash --ignore-rules --source tool -t terminal,file,skills,todo,web --yolo';
  assert.deepEqual(ids(good), []);
  // A read-only run names no terminal toolset, so it may omit --yolo; `file` alone is reading.
  assert.deepEqual(ids('hermes chat -Q --oneshot --query-file p.md --ignore-rules -t file,todo'), []);
  // Preloading a project skill does NOT excuse --ignore-rules: a live A/B proved the preload
  // survives the flag, so the old carve-out sanctioned the context bleed the rule prevents.
  assert.deepEqual(ids('hermes chat -Q --oneshot --query-file p.md -s cli-hermes --source tool -t file,todo'), ['ignore-rules-required']);
  assert.deepEqual(ids('hermes chat -Q --oneshot --query-file p.md --skills=cli-hermes -t file,todo'), ['ignore-rules-required']);
  // A preloading dispatch that also passes the flag is the correct shape and stays clean.
  assert.deepEqual(ids('hermes chat -Q --oneshot --query-file p.md --ignore-rules -s cli-hermes --source tool -t file,todo'), []);
  // `search` is web search, so a list without `file` yields a leaf that reads nothing.
  assert.deepEqual(ids('hermes chat -Q --oneshot --query-file p.md --ignore-rules -t search,todo'), ['explicit-toolsets-required']);
  assert.deepEqual(ids(good.replace(' --yolo', '')), ['yolo-required-for-writes']);
  assert.deepEqual(ids(good.replace(' --ignore-rules', '')), ['ignore-rules-required']);
  assert.deepEqual(ids(good.replace(' -t terminal,file,skills,todo,web', '')), ['explicit-toolsets-required']);
  assert.deepEqual(ids(good.replace('todo,web', 'todo,web,delegation')), ['explicit-toolsets-required']);
  assert.deepEqual(ids(`${good} --worktree`), ['no-worktree-flag']);
  assert.deepEqual(ids(`${good} --accept-hooks`), ['hooks-user-level']);
  assert.deepEqual(ids('hermes mcp add code_mode --command node'), ['mcp-config-operator-required']);
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

// Every documented headless dispatch must resolve to its own skill, or that runtime's whole
// rule set is silently skipped: the preflight bails before evaluating when no shape matches.
test('every runtime dispatch shape resolves to its skill (mutation-proof)', () => {
  const documented = [
    ['opencode run --model x "task" </dev/null', 'cli-opencode'],
    ['claude -p "task" </dev/null', 'cli-claude-code'],
    ['codex exec --model gpt-5.5 -c approval_policy=never --sandbox workspace-write "task" </dev/null', 'cli-codex'],
    ['devin -p "task" </dev/null', 'cli-devin'],
    ['cursor-agent -p "task" </dev/null', 'cli-cursor'],
    ['pi -p --offline "task" </dev/null', 'cli-pi'],
    ['hermes chat -Q --oneshot --query-file p.md </dev/null', 'cli-hermes'],
  ];
  for (const [cmd, skill] of documented) {
    const shape = DISPATCH_SHAPES.find((d) => d.test.test(cmd));
    assert.equal(shape?.skill, skill, `no shape matched the documented ${skill} dispatch: ${cmd}`);
    assert.equal(matchDispatchShape(cmd)?.skill, skill, `tokenizer disagreed with the shape list for: ${cmd}`);
  }
  // Negative control: a non-dispatch command resolves to nothing, so a shape that matched
  // everything could not pass the loop above by accident.
  assert.equal(DISPATCH_SHAPES.find((d) => d.test.test('git status && ls -la')), undefined);
  assert.equal(matchDispatchShape('git status && ls -la'), null);
});
