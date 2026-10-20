// ───────────────────────────────────────────────────────────────────
// MODULE: Skilled Loop Shell Shim Tests
// ───────────────────────────────────────────────────────────────────
'use strict';

// The shim is sourced into an operator's zsh or bash, so every case runs under both.
// A repository that links `.skilled` from another checkout must find the wrapper the
// same way as the checkout that owns it, so the sandbox repo uses a symlink.

const { test } = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const SKILLED_DIR = path.resolve(__dirname, '..', '..', '..');
const SHIM = path.join(SKILLED_DIR, 'bin', 'skilled-loop-shell.sh');
const SHELLS = [
  { name: 'bash', command: '/bin/bash', flags: ['-c'] },
  { name: 'zsh', command: '/bin/zsh', flags: ['-f', '-c'] },
].filter((shell) => fs.existsSync(shell.command));

// Each runtime's forms come from its own --help: the interactive ones open a session in
// this terminal, the rest print, exit, run headless or manage settings.
const INTERACTIVE = {
  claude: [[], ['fix the failing test'], ['--model', 'opus', '-c'], ['--', '-p']],
  pi: [[], ['--model', 'sonnet:high', 'Read package.json'], ['--continue']],
  opencode: [[], ['-m', 'provider/model'], ['--prompt', 'hello']],
  codex: [[], ['-m', 'o3', 'explain this repo'], ['resume', '--last'], ['-p', 'work-profile']],
  hermes: [[], ['chat'], ['chat', '-q', 'hello'], ['--tui', '-c']],
  devin: [[], ['--model', 'opus'], ['--', 'fix the bug']],
  cursor: [[], ['agent', 'hello'], ['--model', 'gpt-5', 'hello'], ['resume']],
};

const PASSTHROUGH = {
  claude: [['-p', 'hi'], ['--print'], ['--version'], ['-h'], ['doctor'], ['mcp', 'list'], ['--bg']],
  pi: [['-p', 'hi'], ['--version'], ['install', 'npm:x'], ['config'], ['--mode', 'rpc'], ['--list-models']],
  opencode: [['run', 'hi'], ['serve'], ['--version'], ['-h'], ['models']],
  codex: [['exec', 'hi'], ['e', 'hi'], ['review'], ['login'], ['--version'], ['-V'], ['--help']],
  hermes: [
    ['-z', 'hi'], ['--oneshot', 'hi'], ['setup'], ['gateway'], ['--version'],
    ['chat', '-q', 'hi', '--oneshot'], ['chat', '-Q', '-q', 'hi'], ['chat', '-h'],
  ],
  devin: [['-p', 'hi'], ['--print'], ['doctor'], ['some/path'], ['-V'], ['--cloud']],
  cursor: [['-p', 'hi'], ['--print'], ['login'], ['status'], ['--list-models'], ['-v']],
};

function sandbox(t) {
  const root = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'skilled-loop-shell-')));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const repo = path.join(root, 'repo');
  const nested = path.join(repo, 'a', 'b');
  const plain = path.join(root, 'plain');
  fs.mkdirSync(nested, { recursive: true });
  fs.mkdirSync(plain);
  fs.symlinkSync(SKILLED_DIR, path.join(repo, '.skilled'));
  return { root, repo, nested, plain, wrapper: path.join(repo, '.skilled', 'bin', 'skilled-loop') };
}

function cleanEnv(extra = {}) {
  const env = { ...process.env, ...extra };
  if (!('SKILLED_LOOP_ID' in extra)) delete env.SKILLED_LOOP_ID;
  return env;
}

// Arguments travel as positional parameters, so no case text is ever parsed as shell code.
function resolve(shell, directory, runtime, args, env = cleanEnv()) {
  const script = 'source "$1" || exit 90; cd "$2" || exit 91; shift 2; skilled_loop_resolve "$@"';
  const result = spawnSync(
    shell.command,
    [...shell.flags, script, 'skilled-loop-shell-test', SHIM, directory, runtime, ...args],
    { encoding: 'utf8', env },
  );
  assert.equal(result.stderr, '', `${shell.name} stderr`);
  assert.equal(result.status, 0, `${shell.name} exit`);
  return result.stdout;
}

function label(shell, runtime, args) {
  return `${shell.name} ${runtime} ${JSON.stringify(args)}`;
}

for (const shell of SHELLS) {
  test(`${shell.name}: every interactive form finds the wrapper through a symlinked .skilled`, (t) => {
    const box = sandbox(t);
    for (const [runtime, forms] of Object.entries(INTERACTIVE)) {
      for (const args of forms) {
        for (const directory of [box.repo, box.nested]) {
          assert.equal(
            resolve(shell, directory, runtime, args),
            `${box.wrapper}\n`,
            `${label(shell, runtime, args)} from ${directory}`,
          );
        }
      }
    }
  });

  test(`${shell.name}: subcommands, print modes, version and help pass through`, (t) => {
    const box = sandbox(t);
    for (const [runtime, forms] of Object.entries(PASSTHROUGH)) {
      for (const args of forms) {
        assert.equal(resolve(shell, box.repo, runtime, args), '', label(shell, runtime, args));
      }
    }
  });

  test(`${shell.name}: a directory with no .skilled above it resolves nothing`, (t) => {
    const box = sandbox(t);
    for (const runtime of Object.keys(INTERACTIVE)) {
      assert.equal(resolve(shell, box.plain, runtime, []), '', label(shell, runtime, []));
    }
  });

  test(`${shell.name}: a session already under the loop resolves nothing`, (t) => {
    const box = sandbox(t);
    const env = cleanEnv({ SKILLED_LOOP_ID: '4242' });
    for (const runtime of Object.keys(INTERACTIVE)) {
      assert.equal(resolve(shell, box.repo, runtime, [], env), '', label(shell, runtime, []));
    }
  });

  test(`${shell.name}: an unknown runtime resolves nothing`, (t) => {
    const box = sandbox(t);
    assert.equal(resolve(shell, box.repo, 'cursor-agent', []), '');
    assert.equal(resolve(shell, box.repo, 'gemini', []), '');
  });
}

// The per-runtime functions call `bash` and the runtime by name, so stubs first on PATH
// record which way a launch went without starting a real session.
function stubBin(root) {
  const bin = path.join(root, 'bin');
  fs.mkdirSync(bin);
  const stubs = {
    bash: 'printf "WRAPPED %s\\n" "$*"',
    claude: 'printf "DIRECT claude %s\\n" "$*"',
    'cursor-agent': 'printf "DIRECT cursor-agent %s\\n" "$*"',
  };
  for (const [name, body] of Object.entries(stubs)) {
    fs.writeFileSync(path.join(bin, name), `#!/bin/sh\n${body}\n`, { mode: 0o755 });
  }
  return bin;
}

function launch(shell, box, bin, line, { tty }) {
  const script = `source "$1" || exit 90; cd "$2" || exit 91; ${line}`;
  const args = [...shell.flags, script, 'skilled-loop-shell-test', SHIM, box.repo];
  const env = cleanEnv({ PATH: `${bin}:${process.env.PATH}` });
  // script(1) gives the shell a pseudo-terminal on stdin and stdout; it needs a
  // stdin it can read as a device, so it gets /dev/null rather than a pipe.
  const result = tty
    ? spawnSync('script', ['-q', '/dev/null', shell.command, ...args], {
      encoding: 'utf8', env, stdio: ['ignore', 'pipe', 'pipe'],
    })
    : spawnSync(shell.command, args, { encoding: 'utf8', env });
  assert.equal(result.status, 0, `${shell.name}: ${result.stderr}`);
  // The pseudo-terminal echoes the end of its /dev/null input as `^D` and backspaces.
  return result.stdout.replace(/\r/g, '').replace(/\^D\x08+/g, '');
}

const HAS_SCRIPT = spawnSync('script', ['-q', '/dev/null', 'true'], { stdio: 'ignore' }).status === 0;

for (const shell of SHELLS) {
  test(`${shell.name}: without a terminal the runtime function runs the binary directly`, (t) => {
    const box = sandbox(t);
    const bin = stubBin(box.root);
    const output = launch(shell, box, bin, 'claude --model opus', { tty: false });
    assert.equal(output, 'DIRECT claude --model opus\n');
  });

  test(`${shell.name}: on a terminal the runtime function hands the launch to the wrapper`, { skip: !HAS_SCRIPT && 'script(1) is unavailable' }, (t) => {
    const box = sandbox(t);
    const bin = stubBin(box.root);
    const output = launch(
      shell,
      box,
      bin,
      'claude --model opus; claude -p hi; cursor-agent --model gpt-5; cursor-agent login',
      { tty: true },
    );
    assert.match(output, new RegExp(`^WRAPPED ${box.wrapper} claude --model opus$`, 'm'));
    assert.match(output, /^DIRECT claude -p hi$/m);
    assert.match(output, new RegExp(`^WRAPPED ${box.wrapper} cursor --model gpt-5$`, 'm'));
    assert.match(output, /^DIRECT cursor-agent login$/m);
  });
}
