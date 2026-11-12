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
const { withoutRelaunchSwitches } = require('./fixtures/relaunch-env.cjs');

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
  devin: [[], ['--model', 'opus'], ['--', 'fix the bug']],
  cursor: [[], ['agent', 'hello'], ['--model', 'gpt-5', 'hello'], ['resume']],
};

const PASSTHROUGH = {
  claude: [['-p', 'hi'], ['--print'], ['--version'], ['-h'], ['doctor'], ['mcp', 'list'], ['--bg']],
  pi: [['-p', 'hi'], ['--version'], ['install', 'npm:x'], ['config'], ['--mode', 'rpc'], ['--list-models']],
  opencode: [
    ['run', 'hi'], ['serve'], ['--version'], ['-h'], ['models'],
    ['api'], ['service'], ['reload'], ['pair'], ['mini'],
  ],
  codex: [['exec', 'hi'], ['e', 'hi'], ['review'], ['login'], ['--version'], ['-V'], ['--help']],
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

function gitSandbox(t) {
  const root = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'skilled-loop-git-')));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const checkout = path.join(root, 'checkout');
  fs.mkdirSync(path.join(checkout, '.skilled', 'bin'), { recursive: true });
  fs.copyFileSync(SHIM, path.join(checkout, '.skilled', 'bin', 'skilled-loop-shell.sh'));
  fs.copyFileSync(path.join(SKILLED_DIR, 'bin', 'skilled-loop'), path.join(checkout, '.skilled', 'bin', 'skilled-loop'));
  fs.mkdirSync(path.join(checkout, 'a', 'b'), { recursive: true });
  const init = spawnSync('git', ['init', '-q', checkout], { encoding: 'utf8' });
  assert.equal(init.status, 0, init.stderr);
  const configName = spawnSync('git', ['-C', checkout, 'config', 'user.name', 'Test'], { encoding: 'utf8' });
  const configEmail = spawnSync('git', ['-C', checkout, 'config', 'user.email', 'test@example.invalid'], { encoding: 'utf8' });
  assert.equal(configName.status, 0, configName.stderr);
  assert.equal(configEmail.status, 0, configEmail.stderr);
  spawnSync('git', ['-C', checkout, 'add', '.'], { encoding: 'utf8' });
  const commit = spawnSync('git', ['-C', checkout, 'commit', '-qm', 'fixture'], { encoding: 'utf8' });
  assert.equal(commit.status, 0, commit.stderr);
  const linked = path.join(root, 'linked');
  const worktree = spawnSync('git', ['-C', checkout, 'worktree', 'add', '-qb', 'linked-fixture', linked], { encoding: 'utf8' });
  assert.equal(worktree.status, 0, worktree.stderr);
  return { root, checkout, linked, shim: path.join(checkout, '.skilled', 'bin', 'skilled-loop-shell.sh') };
}

function cleanEnv(extra = {}) {
  const env = { ...withoutRelaunchSwitches(process.env), ...extra };
  if (!('SKILLED_LOOP_ID' in extra)) delete env.SKILLED_LOOP_ID;
  if (!('SKILLED_LOOP_TRUSTED_CHECKOUTS' in extra)) delete env.SKILLED_LOOP_TRUSTED_CHECKOUTS;
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

function resolveWithShim(shell, shim, directory, runtime = 'claude', env = cleanEnv()) {
  const script = 'source "$1" || exit 90; cd "$2" || exit 91; skilled_loop_resolve "$3"';
  const result = spawnSync(shell.command, [...shell.flags, script, 'skilled-loop-shell-test', shim, directory, runtime], {
    encoding: 'utf8', env,
  });
  assert.equal(result.stderr, '', `${shell.name} stderr`);
  assert.equal(result.status, 0, `${shell.name} exit`);
  return result.stdout;
}

function label(shell, runtime, args) {
  return `${shell.name} ${runtime} ${JSON.stringify(args)}`;
}

for (const shell of SHELLS) {
  test(`${shell.name}: a wrapper outside the sourced checkout is not resolved`, (t) => {
    const box = gitSandbox(t);
    const outside = path.join(box.root, 'checkout-child');
    fs.mkdirSync(path.join(outside, '.skilled', 'bin'), { recursive: true });
    fs.writeFileSync(path.join(outside, '.skilled', 'bin', 'skilled-loop'), 'exit 0\n');
    const init = spawnSync('git', ['init', '-q', outside], { encoding: 'utf8' });
    assert.equal(init.status, 0, init.stderr);
    const configName = spawnSync('git', ['-C', outside, 'config', 'user.name', 'Test'], { encoding: 'utf8' });
    const configEmail = spawnSync('git', ['-C', outside, 'config', 'user.email', 'test@example.invalid'], { encoding: 'utf8' });
    assert.equal(configName.status, 0, configName.stderr);
    assert.equal(configEmail.status, 0, configEmail.stderr);
    const add = spawnSync('git', ['-C', outside, 'add', '.'], { encoding: 'utf8' });
    assert.equal(add.status, 0, add.stderr);
    const commit = spawnSync('git', ['-C', outside, 'commit', '-qm', 'fixture'], { encoding: 'utf8' });
    assert.equal(commit.status, 0, commit.stderr);
    assert.equal(resolveWithShim(shell, box.shim, outside), '');
  });

  test(`${shell.name}: an inherited GIT_DIR cannot vouch for a planted repository`, (t) => {
    const box = gitSandbox(t);
    const planted = path.join(box.root, 'planted');
    const wrapper = path.join(planted, '.skilled', 'bin', 'skilled-loop');
    fs.mkdirSync(path.dirname(wrapper), { recursive: true });
    fs.writeFileSync(wrapper, 'exit 0\n');
    const init = spawnSync('git', ['init', '-q', planted], { encoding: 'utf8' });
    assert.equal(init.status, 0, init.stderr);
    const configName = spawnSync('git', ['-C', planted, 'config', 'user.name', 'Test'], { encoding: 'utf8' });
    const configEmail = spawnSync('git', ['-C', planted, 'config', 'user.email', 'test@example.invalid'], { encoding: 'utf8' });
    assert.equal(configName.status, 0, configName.stderr);
    assert.equal(configEmail.status, 0, configEmail.stderr);
    const add = spawnSync('git', ['-C', planted, 'add', '.'], { encoding: 'utf8' });
    assert.equal(add.status, 0, add.stderr);
    const commit = spawnSync('git', ['-C', planted, 'commit', '-qm', 'fixture'], { encoding: 'utf8' });
    assert.equal(commit.status, 0, commit.stderr);
    const env = cleanEnv({ GIT_DIR: path.join(planted, '.git') });
    assert.equal(resolveWithShim(shell, box.shim, planted, 'claude', env), '');
  });

  test(`${shell.name}: the shim sourced through a symlinked file trusts its real checkout`, (t) => {
    const box = gitSandbox(t);
    const symlink = path.join(box.root, 'shim-link.sh');
    fs.symlinkSync(box.shim, symlink);
    const wrapper = path.join(box.checkout, '.skilled', 'bin', 'skilled-loop');
    assert.equal(resolveWithShim(shell, symlink, box.checkout), `${wrapper}\n`);
  });

  test(`${shell.name}: a shell copy without the stored checkout trusts nothing`, (t) => {
    const box = gitSandbox(t);
    const script = 'source "$1" || exit 90; unset skilled_loop_sourced_checkout; cd "$2" || exit 91; skilled_loop_resolve claude';
    const result = spawnSync(shell.command, [...shell.flags, script, 'skilled-loop-shell-test', box.shim, box.checkout], {
      encoding: 'utf8',
      env: cleanEnv(),
    });
    assert.equal(result.stdout, '');
    assert.equal(result.stderr, '');
    assert.equal(result.status, 0);
  });

  test(`${shell.name}: a wrapper in a registered linked worktree is resolved`, (t) => {
    const box = gitSandbox(t);
    const wrapper = path.join(box.linked, '.skilled', 'bin', 'skilled-loop');
    fs.mkdirSync(path.dirname(wrapper), { recursive: true });
    fs.writeFileSync(wrapper, 'exit 0\n');
    assert.equal(resolveWithShim(shell, box.shim, box.linked), `${wrapper}\n`);
  });

  test(`${shell.name}: a .git file alone does not register a trusted worktree`, (t) => {
    const box = gitSandbox(t);
    const fake = path.join(box.root, 'fake-worktree');
    const wrapper = path.join(fake, '.skilled', 'bin', 'skilled-loop');
    fs.mkdirSync(path.dirname(wrapper), { recursive: true });
    fs.writeFileSync(path.join(fake, '.git'), `gitdir: ${path.join(box.checkout, '.git')}\n`);
    fs.writeFileSync(wrapper, 'exit 0\n');
    assert.equal(resolveWithShim(shell, box.shim, fake), '');
  });

  test(`${shell.name}: explicitly trusted checkouts resolve and unset or empty trusts nothing extra`, (t) => {
    const box = gitSandbox(t);
    const trusted = path.join(box.root, 'trusted');
    const wrapper = path.join(trusted, '.skilled', 'bin', 'skilled-loop');
    fs.mkdirSync(path.dirname(wrapper), { recursive: true });
    fs.writeFileSync(wrapper, 'exit 0\n');
    assert.equal(resolveWithShim(shell, box.shim, trusted), '');
    assert.equal(resolveWithShim(shell, box.shim, trusted, 'claude', cleanEnv({ SKILLED_LOOP_TRUSTED_CHECKOUTS: '' })), '');
    assert.equal(
      resolveWithShim(shell, box.shim, trusted, 'claude', cleanEnv({ SKILLED_LOOP_TRUSTED_CHECKOUTS: trusted })),
      `${wrapper}\n`,
    );
  });

  test(`${shell.name}: every interactive form finds the wrapper through a symlinked .skilled`, (t) => {
    const box = sandbox(t);
    for (const [runtime, forms] of Object.entries(INTERACTIVE)) {
      for (const args of forms) {
        for (const directory of [box.repo, box.nested]) {
          assert.equal(
            resolve(shell, directory, runtime, args),
            `${fs.realpathSync(box.wrapper)}\n`,
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
    pi: 'printf "DIRECT pi %s\\n" "$*"',
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

// A snapshot of an interactive shell copies the function definitions but drops every
// name that is a single underscore followed by anything else, so a tool shell rebuilt
// from the copy still has the runtime functions and none of their private helpers.
const SNAPSHOT = {
  bash: { names: '$(compgen -A function)', print: 'declare -f "$name"' },
  zsh: { names: '${(k)functions}', print: 'functions "$name"' },
};

function snapshot(shell, root) {
  const { names, print } = SNAPSHOT[shell.name];
  const file = path.join(root, 'snapshot.sh');
  const script = [
    'source "$1" || exit 90',
    'for name in ' + names + '; do',
    '  case "$name" in _[!_]*) continue ;; esac',
    '  ' + print + ' || exit 92',
    'done',
  ].join('\n');
  const result = spawnSync(shell.command, [...shell.flags, script, 'skilled-loop-shell-test', SHIM], {
    encoding: 'utf8',
    env: cleanEnv(),
  });
  assert.equal(result.status, 0, `${shell.name} snapshot: ${result.stderr}`);
  fs.writeFileSync(file, result.stdout);
  return file;
}

// Nothing else reaches the fresh shell, so a runtime function still naming a dropped
// helper fails here the same way it fails in an agent's tool shell.
function replay(shell, bin, file) {
  const script = [
    'source "$1" || exit 90',
    'claude -p hello </dev/null; printf "CLAUDE %s\\n" "$?"',
    'pi -p hello </dev/null; printf "PI %s\\n" "$?"',
  ].join('\n');
  return spawnSync(shell.command, [...shell.flags, script, 'skilled-loop-shell-test', file], {
    encoding: 'utf8',
    env: cleanEnv({ PATH: `${bin}:${process.env.PATH}` }),
  });
}

for (const shell of SHELLS) {
  test(`${shell.name}: without a terminal the runtime function runs the binary directly`, (t) => {
    const box = sandbox(t);
    const bin = stubBin(box.root);
    const output = launch(shell, box, bin, 'claude --model opus', { tty: false });
    assert.equal(output, 'DIRECT claude --model opus\n');
  });

  test(`${shell.name}: on a terminal the runtime function hands the launch to the wrapper`, {
    skip: !HAS_SCRIPT && 'script(1) is unavailable',
  }, (t) => {
    const box = sandbox(t);
    const bin = stubBin(box.root);
    const output = launch(
      shell,
      box,
      bin,
      'claude --model opus; claude -p hi; cursor-agent --model gpt-5; cursor-agent login',
      { tty: true },
    );
    assert.match(output, new RegExp(`^WRAPPED ${fs.realpathSync(box.wrapper)} claude --model opus$`, 'm'));
    assert.match(output, /^DIRECT claude -p hi$/m);
    assert.match(output, new RegExp(`^WRAPPED ${fs.realpathSync(box.wrapper)} cursor --model gpt-5$`, 'm'));
    assert.match(output, /^DIRECT cursor-agent login$/m);
  });

  test(`${shell.name}: runtime functions still work after a snapshot drops single-underscore functions`, (t) => {
    const box = sandbox(t);
    const bin = stubBin(box.root);
    const dump = snapshot(shell, box.root);
    const definitions = fs.readFileSync(dump, 'utf8');
    // The stub binaries answer to the same names, so a dump that lost a runtime
    // function would still exit 0; only the definition proves the function ran.
    assert.match(definitions, /^claude \(\)/m, `${shell.name} dump keeps claude`);
    assert.match(definitions, /^pi \(\)/m, `${shell.name} dump keeps pi`);
    const result = replay(shell, bin, dump);
    assert.equal(
      result.stdout,
      'DIRECT claude -p hello\nCLAUDE 0\nDIRECT pi -p hello\nPI 0\n',
      `${shell.name} replay`,
    );
    assert.doesNotMatch(result.stderr, /command not found/, `${shell.name} replay stderr`);
  });
}
