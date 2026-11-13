#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Hook Wiring Check Tests
// ───────────────────────────────────────────────────────────────────
'use strict';

// Drives the hook wiring check as a process against throwaway checkouts. The
// cases pin both verdicts and the checkout that has no runtime folder at all.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS AND FIXTURES
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const SCRIPT = path.resolve(__dirname, '..', 'hook-wiring-check.cjs');
const CLAUDE_FILE = '.claude/settings.json';
const CLAUDE_MARKER = '.skilled/skills/system-spec-kit/runtime/dist/hooks/claude/user-prompt-submit.js';

function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'hook-wiring-check-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const run = (...args) => {
    const result = spawnSync(process.execPath, [SCRIPT, '--root', root, ...args], { encoding: 'utf8' });
    return { code: result.status, out: result.stdout, err: result.stderr };
  };
  return { root, run };
}

function writeClaudeSettings(root, hooks) {
  fs.mkdirSync(path.join(root, '.claude'), { recursive: true });
  fs.writeFileSync(path.join(root, CLAUDE_FILE), JSON.stringify({ hooks }, null, 2));
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. TESTS
// ─────────────────────────────────────────────────────────────────────────────

test('names a runtime whose prompt entry is absent', (t) => {
  const f = fixture(t);
  writeClaudeSettings(f.root, {
    UserPromptSubmit: [{ hooks: [{ type: 'command', command: 'node some-other-hook.js' }] }],
  });
  const before = fs.readFileSync(path.join(f.root, CLAUDE_FILE), 'utf8');
  const result = f.run();
  assert.equal(result.code, 1);
  assert.match(result.out, /^hook-missing claude \.claude\/settings\.json$/m);
  assert.equal(fs.readFileSync(path.join(f.root, CLAUDE_FILE), 'utf8'), before, 'check changed the hook file');
});

test('passes a runtime whose prompt entry is wired', (t) => {
  const f = fixture(t);
  writeClaudeSettings(f.root, {
    UserPromptSubmit: [{
      hooks: [{ type: 'command', command: `bash -c 'cd "$PWD" && node ${CLAUDE_MARKER}'` }],
    }],
  });
  const text = f.run();
  assert.equal(text.code, 0);
  assert.equal(text.out.trim(), 'ok claude');
  const json = f.run('--json');
  assert.equal(json.code, 0);
  assert.equal(JSON.parse(json.out).checks.find((check) => check.runtime === 'claude').status, 'ok');
});

test('passes a prompt entry that starts node on the script path', (t) => {
  const f = fixture(t);
  writeClaudeSettings(f.root, {
    UserPromptSubmit: [{
      hooks: [{ type: 'command', command: `node ${CLAUDE_MARKER}` }],
    }],
  });
  const text = f.run();
  assert.equal(text.code, 0);
  assert.equal(text.out.trim(), 'ok claude');
});

test('passes a prompt entry that starts node by its absolute path', (t) => {
  const f = fixture(t);
  writeClaudeSettings(f.root, {
    UserPromptSubmit: [{
      hooks: [{ type: 'command', command: `/opt/homebrew/bin/node ${CLAUDE_MARKER}` }],
    }],
  });
  const text = f.run();
  assert.equal(text.code, 0);
  assert.equal(text.out.trim(), 'ok claude');
});

test('names a runtime whose entry only names node as an argument', (t) => {
  const f = fixture(t);
  writeClaudeSettings(f.root, {
    UserPromptSubmit: [{
      hooks: [{ type: 'command', command: `echo node ${CLAUDE_MARKER}` }],
    }],
  });
  const result = f.run();
  assert.equal(result.code, 1);
  assert.match(result.out, /^hook-missing claude \.claude\/settings\.json$/m);
});

test('names a runtime whose entry only echoes the script path', (t) => {
  const f = fixture(t);
  writeClaudeSettings(f.root, {
    UserPromptSubmit: [{
      hooks: [{ type: 'command', command: 'echo hooks/claude/user-prompt-submit.js' }],
    }],
  });
  const result = f.run();
  assert.equal(result.code, 1);
  assert.match(result.out, /^hook-missing claude \.claude\/settings\.json$/m);
});

test('names a runtime whose entry only describes the script', (t) => {
  const f = fixture(t);
  writeClaudeSettings(f.root, {
    UserPromptSubmit: [{
      hooks: [{
        type: 'command',
        command: 'node some-other-hook.js',
        description: 'hooks/claude/user-prompt-submit.js',
      }],
    }],
  });
  const result = f.run();
  assert.equal(result.code, 1);
  assert.match(result.out, /^hook-missing claude \.claude\/settings\.json$/m);
});

test('passes a launch that starts node through env', (t) => {
  const f = fixture(t);
  writeClaudeSettings(f.root, {
    UserPromptSubmit: [{ hooks: [{ type: 'command', command: `env node ${CLAUDE_MARKER}` }] }],
  });
  const text = f.run();
  assert.equal(text.code, 0);
  assert.equal(text.out.trim(), 'ok claude');
});

test('passes a launch that starts node through an absolute env', (t) => {
  const f = fixture(t);
  writeClaudeSettings(f.root, {
    UserPromptSubmit: [{ hooks: [{ type: 'command', command: `/usr/bin/env node ${CLAUDE_MARKER}` }] }],
  });
  const text = f.run();
  assert.equal(text.code, 0);
  assert.equal(text.out.trim(), 'ok claude');
});

test('passes a launch that runs node inside a bash login command', (t) => {
  const f = fixture(t);
  writeClaudeSettings(f.root, {
    UserPromptSubmit: [{ hooks: [{ type: 'command', command: `bash -lc "node ${CLAUDE_MARKER}"` }] }],
  });
  const text = f.run();
  assert.equal(text.code, 0);
  assert.equal(text.out.trim(), 'ok claude');
});

test('passes a launch that runs node inside a zsh command', (t) => {
  const f = fixture(t);
  writeClaudeSettings(f.root, {
    UserPromptSubmit: [{ hooks: [{ type: 'command', command: `zsh -c 'node ${CLAUDE_MARKER}'` }] }],
  });
  const text = f.run();
  assert.equal(text.code, 0);
  assert.equal(text.out.trim(), 'ok claude');
});

test('passes a launch that gives node a flag', (t) => {
  const f = fixture(t);
  writeClaudeSettings(f.root, {
    UserPromptSubmit: [{ hooks: [{ type: 'command', command: `node --no-warnings ${CLAUDE_MARKER}` }] }],
  });
  const text = f.run();
  assert.equal(text.code, 0);
  assert.equal(text.out.trim(), 'ok claude');
});

test('passes a launch whose separator sticks to the previous word', (t) => {
  const f = fixture(t);
  writeClaudeSettings(f.root, {
    UserPromptSubmit: [{ hooks: [{ type: 'command', command: `cd "\$PWD"&& node ${CLAUDE_MARKER}` }] }],
  });
  const text = f.run();
  assert.equal(text.code, 0);
  assert.equal(text.out.trim(), 'ok claude');
});

test('passes a launch whose semicolon sticks to the previous word', (t) => {
  const f = fixture(t);
  writeClaudeSettings(f.root, {
    UserPromptSubmit: [{ hooks: [{ type: 'command', command: `cd /tmp; node ${CLAUDE_MARKER}` }] }],
  });
  const text = f.run();
  assert.equal(text.code, 0);
  assert.equal(text.out.trim(), 'ok claude');
});

test('names a runtime whose entry echoes a quoted command', (t) => {
  const f = fixture(t);
  writeClaudeSettings(f.root, {
    UserPromptSubmit: [{ hooks: [{ type: 'command', command: `echo "x && node ${CLAUDE_MARKER}"` }] }],
  });
  const result = f.run();
  assert.equal(result.code, 1);
  assert.match(result.out, /^hook-missing claude \.claude\/settings\.json$/m);
});

test('skips a runtime whose folder is absent', (t) => {
  const f = fixture(t);
  const text = f.run();
  assert.equal(text.code, 0);
  assert.equal(text.out, '');
  const json = f.run('--json');
  assert.equal(json.code, 0);
  assert.deepEqual(JSON.parse(json.out).checks.map((check) => check.status), ['skipped', 'skipped', 'skipped', 'skipped']);
});

// Launch shapes a shell runs, each with node standing where a command starts.
for (const [label, build] of [
  ['env unsets a variable first', (m) => `env -u AI_SESSION_CHILD node ${m}`],
  ['node preloads a module', (m) => `node -r ./preload.cjs ${m}`],
  ['node preloads a module attached to the flag', (m) => `node -r./preload.cjs ${m}`],
  ['the command runs in a subshell', (m) => `(node ${m})`],
  ['the command runs in a brace group', (m) => `{ node ${m}; }`],
  ['exec replaces the shell', (m) => `exec node ${m}`],
  ['the command builtin starts node', (m) => `command node ${m}`],
  ['node runs in a conditional', (m) => `if true; then node ${m}; fi`],
  ['nohup starts node', (m) => `nohup node ${m}`],
  ['a background command comes first', (m) => `cd /tmp & node ${m}`],
  ['a backslash continues the line', (m) => `node \\\n${m}`],
]) {
  test(`passes a launch where ${label}`, (t) => {
    const f = fixture(t);
    writeClaudeSettings(f.root, {
      UserPromptSubmit: [{ hooks: [{ type: 'command', command: build(CLAUDE_MARKER) }] }],
    });
    const text = f.run();
    assert.equal(text.code, 0);
    assert.equal(text.out.trim(), 'ok claude');
  });
}

// Text that names node and the script without a shell ever running it.
for (const [label, build] of [
  ['a quote never closes', (m) => `echo "x; node ${m}`],
  ['node only checks the syntax', (m) => `node --check ${m}`],
  ['node evaluates inline code', (m) => `node -e "1" ${m}`],
  ['node evaluates code attached to the flag', (m) => `node -e1 ${m}`],
  ['node evaluates code given with an equals sign', (m) => `node --eval=1 ${m}`],
  ['node prints an expression given with an equals sign', (m) => `node --print=1 ${m}`],
  ['the launch sits in a comment', (m) => `true # ; node ${m}`],
  ['a shell script takes its own -c argument', (m) => `bash ./x.sh -c "node ${m}"`],
]) {
  test(`names a runtime when ${label}`, (t) => {
    const f = fixture(t);
    writeClaudeSettings(f.root, {
      UserPromptSubmit: [{ hooks: [{ type: 'command', command: build(CLAUDE_MARKER) }] }],
    });
    const text = f.run();
    assert.equal(text.code, 1);
    assert.match(text.out, /^hook-missing claude \.claude\/settings\.json$/m);
  });
}
