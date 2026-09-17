// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Goal documentation contract — the prose has to keep matching the code    ║
// ╚══════════════════════════════════════════════════════════════════════════╝
//
// A research pass found six separate places where a goal document cited a path
// that had moved, a test count that had grown, or a variable name that never
// existed. Each was harmless alone and misleading together: an operator
// following them sets a dead variable, runs a command that cannot work, and
// trusts a number that is two releases old. Prose cannot be type-checked, but
// the handful of facts it repeats about the code can be, and these are those
// facts.
'use strict';

const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const { readFileSync, readdirSync } = require('node:fs');
const { join } = require('node:path');
const test = require('node:test');

const REPO_ROOT = join(__dirname, '..', '..', '..');
const read = (rel) => readFileSync(join(REPO_ROOT, rel), 'utf8');

test('every repository path a goal document cites still exists', () => {
  const DOCS = [
    '.opencode/hooks/goal/README.md',
    '.opencode/hooks/goal/goal-plugin.md',
    '.opencode/skills/system-skill-advisor/manual-testing-playbook/cli-hooks-and-plugin/goal-opencode-plugin.md',
    '.opencode/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/goal-hook/goal-hook.md',
    '.opencode/skills/cli-external-orchestration/cli-pi/manual-testing-playbook/goal-hook/goal-hook.md',
    '.opencode/skills/cli-external-orchestration/cli-cursor/manual-testing-playbook/goal-hook/goal-hook.md',
    '.opencode/skills/cli-external-orchestration/cli-devin/manual-testing-playbook/goal-hook/goal-hook.md',
  ];
  // Only paths inside the two trees this contract owns; a reference to a spec
  // packet or an external file is not this test's business.
  const CITED = /`((?:\.opencode\/(?:hooks|plugins|commands)|\.claude|\.codex|\.cursor|\.devin|\.pi)\/[A-Za-z0-9._/-]+\.(?:cjs|mjs|js|ts|md|json|yaml))`/g;
  const missing = [];
  for (const doc of DOCS) {
    let text;
    try { text = read(doc); } catch { continue; }
    for (const match of text.matchAll(CITED)) {
      const cited = match[1];
      try { readFileSync(join(REPO_ROOT, cited)); } catch { missing.push(`${doc} -> ${cited}`); }
    }
  }
  assert.deepEqual(missing, [], `goal documents cite paths that do not exist:\n${missing.join('\n')}`);
});

test('the plugin suite count a playbook states matches the suite it names', () => {
  const playbook = read('.opencode/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/goal-hook/goal-hook.md');
  const stated = [...playbook.matchAll(/(\d+)\/\1\b/g)].map((m) => Number(m[1]));
  assert.ok(stated.length > 0, 'the playbook states a suite count');

  const files = readdirSync(join(REPO_ROOT, '.opencode', 'plugins', 'tests'))
    .filter((name) => /^opencode-goal-.*\.test\.cjs$/.test(name))
    .map((name) => join(REPO_ROOT, '.opencode', 'plugins', 'tests', name));
  // The tap reporter's summary is a stable machine surface; the default
  // reporter's is decorated and has already changed shape once.
  const out = execFileSync(
    process.execPath,
    ['--test', '--test-reporter=tap', ...files],
    // The child is its own test run. Inheriting this process's runner context
    // makes it report into the parent instead of printing its own summary.
    {
      encoding: 'utf8',
      cwd: REPO_ROOT,
      stdio: ['ignore', 'pipe', 'ignore'],
      env: { ...process.env, NODE_TEST_CONTEXT: undefined, NODE_OPTIONS: undefined },
    },
  );
  const actual = Number((out.match(/^# pass (\d+)$/m) || [])[1]);
  assert.ok(Number.isInteger(actual), 'the suite reports a pass count');
  for (const n of new Set(stated)) {
    assert.equal(n, actual, `the playbook states ${n}/${n} but the suite reports ${actual}`);
  }
});

test('the disable variable a goal surface names is the concern its canonical name', () => {
  const resolver = read('.opencode/hooks/shared/hook-flags.cjs');
  const canonical = (resolver.match(/goal:\s*"([A-Z_]+)"/) || [])[1];
  assert.ok(canonical, 'the shared resolver declares a canonical name for the goal concern');

  for (const rel of ['.opencode/hooks/goal/lib/goal-core.cjs', '.opencode/plugins/opencode-goal.js']) {
    const named = (read(rel).match(/const DISABLED_ENV = '([A-Z_]+)';/) || [])[1];
    assert.equal(named, canonical, `${rel} prints ${named} where an operator must set ${canonical}`);
  }
});

// Two checks that would have caught defects this repository actually shipped: a
// configurable knob an operator can set but cannot discover, and a kill-switch
// name taught in a document that disables nothing. Both are cheap to state and
// both fail on the exact regression they describe.

test('every goal environment variable the code reads is documented', () => {
  const SOURCES = [
    '.opencode/plugins/opencode-goal.js',
    '.opencode/hooks/goal/lib/goal-core.cjs',
    '.opencode/hooks/goal/lib/goal-slice.cjs',
    '.opencode/hooks/goal/bin/goal.cjs',
  ];
  const names = new Set();
  for (const rel of SOURCES) {
    for (const m of read(rel).matchAll(/'(OPENCODE_GOAL_[A-Z0-9_]+)'/g)) names.add(m[1]);
  }
  assert.ok(names.size > 0, 'the sources name at least one goal variable');

  const example = read('.env.example');
  const undocumented = [...names].filter((name) => !example.includes(name)).sort();
  assert.deepEqual(
    undocumented,
    [],
    `these are read in code and appear in no example file, so an operator cannot discover them:\n${undocumented.join('\n')}`,
  );
});

test('every goal kill-switch name a document teaches actually disables something', () => {
  const resolver = read('.opencode/hooks/shared/hook-flags.cjs');
  const canonical = (resolver.match(/goal:\s*"([A-Z_]+)"/) || [])[1];
  const aliasBlock = (resolver.match(/goal:\s*\[([^\]]*)\]/) || [])[1] || '';
  const live = new Set([canonical, ...[...aliasBlock.matchAll(/"([A-Z_]+)"/g)].map((m) => m[1])]);
  assert.ok(canonical, 'the shared resolver declares a canonical goal flag');

  const ROSTERS = [
    '.env.example',
    '.opencode/plugins/README.md',
    '.opencode/hooks/goal/README.md',
    '.opencode/hooks/goal/goal-plugin.md',
  ];
  const dead = [];
  for (const rel of ROSTERS) {
    let text;
    try { text = read(rel); } catch { continue; }
    for (const m of text.matchAll(/\b([A-Z][A-Z0-9_]*GOAL[A-Z0-9_]*DISABLED)\b/g)) {
      if (!live.has(m[1])) dead.push(`${rel} -> ${m[1]}`);
    }
  }
  assert.deepEqual(dead, [], `documents teach kill-switch names the resolver does not honour:\n${dead.join('\n')}`);
});
