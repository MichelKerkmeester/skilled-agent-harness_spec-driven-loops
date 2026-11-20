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
const VIBE_FILE = '.vibe/hooks.toml';
const VIBE_COMMAND = 'node \\"$(git rev-parse --show-toplevel)/.skilled/hooks/session-lifecycle/vibe/turn-start.mjs\\"';

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

// A case can replace the match line of the text it writes, and null drops it.
// The line is written as the case spells it, so a case chooses its quoting and
// any trailing comment.
function writeVibeHooks(root, text, matchLine) {
  fs.mkdirSync(path.join(root, '.vibe'), { recursive: true });
  let body = text;
  if (matchLine === null) body = body.replace(/^match = .*\n/m, '');
  else if (typeof matchLine === 'string') body = body.replace(/^match = .*$/m, matchLine);
  fs.writeFileSync(path.join(root, VIBE_FILE), body);
}

// The Vibe hook file is TOML, so one block is built as the lines the check reads.
// A block omits its match line when the case passes null for it, and otherwise
// writes the line as the case spells it.
function vibeBlock(type, commandLine, match = 'match = "main"') {
  const lines = ['[[hooks]]', 'name = "turn-start"', `type = "${type}"`];
  if (match !== null) lines.push(match);
  lines.push('timeout = 20.0', commandLine);
  return lines.join('\n');
}

// A Pi adapter lives under .skilled/hooks/<name>/pi/ beside the shared flag file
// it imports, so the import is right or wrong only by the directory it resolves from.
function writePiAdapter(root, name, flagImport) {
  const adapterDir = path.join(root, '.skilled', 'hooks', name, 'pi');
  fs.mkdirSync(adapterDir, { recursive: true });
  fs.mkdirSync(path.join(root, '.skilled', 'hooks', 'shared'), { recursive: true });
  fs.writeFileSync(path.join(root, '.skilled', 'hooks', 'shared', 'hook-flags.mjs'), 'export const isHookEnabled = () => true;\n');
  fs.writeFileSync(path.join(adapterDir, `${name}.ts`), `import { isHookEnabled } from "${flagImport}";\nexport default function register() { return isHookEnabled; }\n`);
  fs.mkdirSync(path.join(root, '.pi', 'extensions'), { recursive: true });
  return `../../.skilled/hooks/${name}/pi/${name}.ts`;
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

// Vibe keeps its hooks in TOML and only a `pre_agent` entry for the main agent
// that starts node on the turn-start script runs before the prompt, so each
// shape below must not count.
test('passes the Vibe turn-start entry under pre_agent', (t) => {
  const f = fixture(t);
  writeVibeHooks(f.root, vibeBlock('pre_agent', 'command = "' + VIBE_COMMAND + '"'));
  const text = f.run();
  assert.equal(text.code, 0);
  assert.equal(text.out.trim(), 'ok vibe');
});

test('passes a Vibe entry whose match selector names the main agent', (t) => {
  const f = fixture(t);
  writeVibeHooks(f.root, vibeBlock('pre_agent', 'command = "' + VIBE_COMMAND + '"', 'match = "main"'));
  const text = f.run();
  assert.equal(text.code, 0);
  assert.equal(text.out.trim(), 'ok vibe');
});

test('passes a Vibe entry with no match line', (t) => {
  const f = fixture(t);
  writeVibeHooks(f.root, vibeBlock('pre_agent', 'command = "' + VIBE_COMMAND + '"', null));
  const text = f.run();
  assert.equal(text.code, 0);
  assert.equal(text.out.trim(), 'ok vibe');
});

test('names Vibe when its turn-start entry matches another agent', (t) => {
  const f = fixture(t);
  writeVibeHooks(f.root, vibeBlock('pre_agent', 'command = "' + VIBE_COMMAND + '"'), 'match = "agents_spawn"');
  const result = f.run();
  assert.equal(result.code, 1, result.out.trim());
  assert.match(result.out, /^hook-missing vibe \.vibe\/hooks\.toml$/m);
});

test('names Vibe when its match selector is a regular expression', (t) => {
  const f = fixture(t);
  writeVibeHooks(f.root, vibeBlock('pre_agent', 'command = "' + VIBE_COMMAND + '"', 'match = "re:main|other"'));
  const result = f.run();
  assert.equal(result.code, 1, result.out.trim());
  assert.match(result.out, /^hook-missing vibe \.vibe\/hooks\.toml$/m);
});

test('names Vibe when its match selector is a literal string', (t) => {
  const f = fixture(t);
  writeVibeHooks(f.root, vibeBlock(
    'pre_agent',
    'command = "' + VIBE_COMMAND + '"',
    "match = 'agents_spawn'",
  ));
  const result = f.run();
  assert.equal(result.code, 1, result.out.trim());
  assert.match(result.out, /^hook-missing vibe \.vibe\/hooks\.toml$/m);
});

test('names Vibe when its match line carries a trailing comment', (t) => {
  const f = fixture(t);
  writeVibeHooks(f.root, vibeBlock(
    'pre_agent',
    'command = "' + VIBE_COMMAND + '"',
    'match = "agents_spawn"  # subagents',
  ));
  const result = f.run();
  assert.equal(result.code, 1, result.out.trim());
  assert.match(result.out, /^hook-missing vibe \.vibe\/hooks\.toml$/m);
});

test('passes a Vibe match selector written as a literal string', (t) => {
  const f = fixture(t);
  writeVibeHooks(f.root, vibeBlock(
    'pre_agent',
    'command = "' + VIBE_COMMAND + '"',
    "match = 'main'",
  ));
  const text = f.run();
  assert.equal(text.code, 0);
  assert.equal(text.out.trim(), 'ok vibe');
});

test('names Vibe when its turn-start entry runs under post_agent', (t) => {
  const f = fixture(t);
  writeVibeHooks(f.root, vibeBlock('post_agent', 'command = "' + VIBE_COMMAND + '"'));
  const result = f.run();
  assert.equal(result.code, 1);
  assert.match(result.out, /^hook-missing vibe \.vibe\/hooks\.toml$/m);
});

test('names Vibe when its turn-start command is commented out', (t) => {
  const f = fixture(t);
  writeVibeHooks(f.root, vibeBlock(
    'pre_agent',
    '# command = "' + VIBE_COMMAND + '"\ncommand = "node other-hook.mjs"',
  ));
  const result = f.run();
  assert.equal(result.code, 1);
  assert.match(result.out, /^hook-missing vibe /m);
});

test('names Vibe when only a name mentions the script', (t) => {
  const f = fixture(t);
  const block = vibeBlock('pre_agent', 'command = "node other-hook.mjs"')
    .replace('name = "turn-start"', 'name = "hooks/session-lifecycle/vibe/turn-start.mjs"');
  writeVibeHooks(f.root, block);
  const result = f.run();
  assert.equal(result.code, 1);
  assert.match(result.out, /^hook-missing vibe /m);
});

test('names Vibe when its folder holds no hooks file', (t) => {
  const f = fixture(t);
  fs.mkdirSync(path.join(f.root, '.vibe'), { recursive: true });
  const result = f.run();
  assert.equal(result.code, 1);
  assert.match(result.out, /^hook-missing vibe /m);
});

test('reads a commented hooks header as the start of the next block', (t) => {
  const f = fixture(t);
  writeVibeHooks(f.root, [
    vibeBlock('pre_agent', 'command = "' + VIBE_COMMAND + '"'),
    '[[hooks]]  # turn end',
    'name = "turn-end"',
    'type = "post_agent"',
    'command = "node other-hook.mjs"',
  ].join('\n'));
  const text = f.run();
  assert.equal(text.code, 0);
  assert.equal(text.out.trim(), 'ok vibe');
});

test("does not credit a later table's command to the hooks block before it", (t) => {
  const f = fixture(t);
  writeVibeHooks(f.root, [
    vibeBlock('pre_agent', 'command = "node other-hook.mjs"'),
    '[[notes]]',
    'command = "' + VIBE_COMMAND + '"',
  ].join('\n'));
  const result = f.run();
  assert.equal(result.code, 1);
  assert.match(result.out, /^hook-missing vibe \.vibe\/hooks\.toml$/m);
});

test('reads a spaced hooks header', (t) => {
  const f = fixture(t);
  writeVibeHooks(f.root, vibeBlock('pre_agent', 'command = "' + VIBE_COMMAND + '"')
    .replace('[[hooks]]', '[[ hooks ]]'));
  const text = f.run();
  assert.equal(text.code, 0);
  assert.equal(text.out.trim(), 'ok vibe');
});

test('skips a runtime whose folder is absent', (t) => {
  const f = fixture(t);
  const text = f.run();
  assert.equal(text.code, 0);
  assert.equal(text.out, '');
  const json = f.run('--json');
  assert.equal(json.code, 0);
  assert.deepEqual(JSON.parse(json.out).checks.map((check) => check.status), ['skipped', 'skipped', 'skipped', 'skipped', 'skipped']);
});

test('passes a Pi entry that re-exports an adapter whose imports resolve', (t) => {
  const f = fixture(t);
  const target = writePiAdapter(f.root, 'mcp-route-guard', '../../shared/hook-flags.mjs');
  fs.writeFileSync(path.join(f.root, '.pi', 'extensions', 'mcp-route-guard.ts'), `export { default } from '${target}';\n`);
  const result = f.run();
  assert.equal(result.code, 0, result.out);
  assert.equal(result.out, '');
});

// A lazy entry names its adapter inside the factory, so the check has to follow
// that import into the adapter to find the dependency an out-of-date tree lacks.
test('follows a lazy-import Pi entry into its adapter imports', (t) => {
  const f = fixture(t);
  const lazyEntry = (target) => [
    "import type { ExtensionAPI } from '@earendil-works/pi-coding-agent';",
    'export default async function piEntry(pi: ExtensionAPI): Promise<void> {',
    '  let adapter: { default: (api: ExtensionAPI) => unknown };',
    '  try {',
    `    adapter = await import('${target}');`,
    '  } catch {',
    '    return;',
    '  }',
    '  await adapter.default(pi);',
    '}',
    '',
  ].join('\n');
  const good = writePiAdapter(f.root, 'mcp-route-guard', '../../shared/hook-flags.mjs');
  fs.writeFileSync(path.join(f.root, '.pi', 'extensions', 'mcp-route-guard.ts'), lazyEntry(good));
  const passing = f.run();
  assert.equal(passing.code, 0, passing.out);
  assert.equal(passing.out, '');

  const stale = writePiAdapter(f.root, 'overlay-guard', '../../shared/missing-flags.mjs');
  fs.writeFileSync(path.join(f.root, '.pi', 'extensions', 'overlay-guard.ts'), lazyEntry(stale));
  const failing = f.run();
  assert.equal(failing.code, 1);
  assert.match(failing.out, /^pi-extension-broken overlay-guard\.ts: \.\.\/\.\.\/shared\/missing-flags\.mjs not found from \.skilled\/hooks\/overlay-guard\/pi\/overlay-guard\.ts$/m);
  assert.doesNotMatch(failing.out, /mcp-route-guard/);
});

// The old layout symlinked each entry to its adapter, whose imports were written
// from the entry's folder. Pi follows the link first, so they resolve nowhere.
test('names a symlinked Pi entry whose adapter imports resolve from the wrong folder', (t) => {
  const f = fixture(t);
  const target = writePiAdapter(f.root, 'mcp-route-guard', '../../.skilled/hooks/shared/hook-flags.mjs');
  fs.symlinkSync(target, path.join(f.root, '.pi', 'extensions', 'mcp-route-guard.ts'));
  const result = f.run();
  assert.equal(result.code, 1);
  assert.match(result.out, /^pi-extension-broken mcp-route-guard\.ts: \.\.\/\.\.\/\.skilled\/hooks\/shared\/hook-flags\.mjs not found from \.skilled\/hooks\/mcp-route-guard\/pi\/mcp-route-guard\.ts$/m);
  assert.match(result.out, /^repair: .*git pull.*\/doctor:symlink check$/m);
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
