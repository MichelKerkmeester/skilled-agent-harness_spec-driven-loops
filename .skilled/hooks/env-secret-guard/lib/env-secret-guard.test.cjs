// ───────────────────────────────────────────────────────────────────
// MODULE: env-secret-guard Core and Adapter Tests (node --test)
// ───────────────────────────────────────────────────────────────────
//
// Covers dotenv path classification, patch and shell target reading, the
// value-free inspection functions and the command-hook, Pi and CLI adapters.
// Every inspection test checks that the secret value never appears in output.
'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');
const { spawnSync } = require('node:child_process');
const { pathToFileURL } = require('node:url');

const core = require('./env-secret-guard.cjs');

const HOOK_ROOT = path.resolve(__dirname, '..');
const SKILLED_ROOT = path.resolve(HOOK_ROOT, '..', '..');
const SECRET = 'sk-live-do-not-leak-4f9a';

/** The decision for one tool call; `cwd` defaults to the filesystem root. */
const decide = (tool, input, cwd = '/') => core.evaluateToolCall({ tool, input, cwd }).decision;

function project(t) {
  const dir = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'env-secret-guard-')));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  fs.writeFileSync(path.join(dir, '.env'), `# local\nAPI_KEY="${SECRET}"\nexport PORT=3000 # dev\nbroken line\n`);
  fs.writeFileSync(path.join(dir, '.env.example'), 'API_KEY=\nPORT=3000\n');
  return dir;
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. PATH CLASSIFICATION
// ─────────────────────────────────────────────────────────────────────────────

test('dotenv names are matched and the template and lookalikes are not', () => {
  for (const name of ['.env', '.env.local', '.env.production', 'apps/web/.env', '/abs/path/.env.test']) {
    assert.equal(core.isDotenvPath(name, '/'), true, name);
  }
  for (const name of ['.env.example', '.envrc', '.environment', 'env.example', 'src/env.ts', '']) {
    assert.equal(core.isDotenvPath(name, '/'), false, name);
  }
});

test('a symlink with an innocent name that points at a dotenv file is matched', (t) => {
  const dir = project(t);
  fs.symlinkSync('.env', path.join(dir, 'config.txt'));
  assert.equal(core.isDotenvPath('config.txt', dir), true);
});

test('a symlink inside a folder named a or b is still matched', (t) => {
  const dir = project(t);
  fs.mkdirSync(path.join(dir, 'b'));
  fs.symlinkSync('../.env', path.join(dir, 'b', 'config.txt'));
  assert.equal(core.isDotenvPath('b/config.txt', dir), true);
  assert.equal(decide('Read', { file_path: 'b/config.txt' }, dir), 'deny');
});

test('patch headers, rename targets and unified diff headers are all read', () => {
  const patch = '*** Begin Patch\n*** Update File: src/a.ts\n*** Move to: .env\n*** End Patch';
  assert.deepEqual(core.pathsFromToolInput({ patchText: patch }), ['src/a.ts', '.env']);
  const diff = '--- a/.env.local\n+++ b/.env.local\n';
  assert.deepEqual(core.pathsFromToolInput({ input: diff }), ['a/.env.local', 'b/.env.local']);
});

// ─────────────────────────────────────────────────────────────────────────────
// 2. TOOL CALL POLICY
// ─────────────────────────────────────────────────────────────────────────────

test('every runtime file tool is refused on a dotenv file and allowed elsewhere', () => {
  const calls = [
    ['Read', { file_path: '.env' }], ['Write', { file_path: '.env.local', content: 'X=1' }],
    ['Edit', { file_path: 'a/.env' }], ['MultiEdit', { file_path: '.env' }], ['Grep', { pattern: 'KEY', path: '.env' }],
    ['read', { path: '.env' }], ['edit', { filePath: '.env' }], ['apply_patch', { input: '*** Add File: .env\n' }],
    ['patch', { patchText: '*** Delete File: .env.prod\n' }], ['Delete', { target_file: '.env' }],
  ];
  for (const [tool, input] of calls) {
    const result = core.evaluateToolCall({ tool, input, cwd: '/' });
    assert.equal(result.decision, 'deny', tool);
    assert.match(result.reason, /dotenv file/);
  }
  assert.equal(decide('Read', { file_path: '.env.example' }), 'allow');
  assert.equal(decide('Read', { file_path: 'src/index.ts' }), 'allow');
  assert.equal(decide('WebFetch', { url: 'https://x/.env' }), 'allow');
});

test('shell commands that read or redirect into a dotenv file are refused', () => {
  const refused = [
    'cat .env', 'sudo cat ./.env.local', 'grep API_KEY .env', 'head -n 5 apps/api/.env | wc -l',
    'echo X=1 >> .env', 'sort < .env', 'cp .env.example .env', 'cat .env*', 'awk -F= "{print $1}" ".env"',
  ];
  for (const command of refused) {
    assert.equal(core.evaluateToolCall({ tool: 'Bash', input: { command }, cwd: '/' }).decision, 'deny', command);
  }
  const allowed = [
    'node --env-file=.env app.js', 'docker compose --env-file .env up', 'cat .env.example', 'cat README.md',
    'node .skilled/hooks/env-secret-guard/cli/env-secret.cjs keys .env', 'ls -la',
  ];
  for (const command of allowed) {
    assert.equal(core.evaluateToolCall({ tool: 'Bash', input: { command }, cwd: '/' }).decision, 'allow', command);
  }
});

test('pi powershell is judged as a shell, with its own readers in any case', () => {
  for (const command of ['cat .env', 'Get-Content .env', 'gc .env.local', 'TYPE .env']) {
    assert.equal(core.evaluateToolCall({ tool: 'powershell', input: { command }, cwd: '/' }).decision, 'deny', command);
  }
  assert.equal(decide('powershell', { command: 'Get-ChildItem' }), 'allow');
});

test('quoting, escapes and dd operands cannot hide a dotenv read', () => {
  const judge = (command) => core.evaluateToolCall({ tool: 'Bash', input: { command }, cwd: '/' }).decision;
  for (const command of [
    'grep "API_KEY|PORT" .env', "awk -F'|' '{print $1}' .env", 'sed -n "s/a|b/c/p" .env',
    'cat .e"nv"', 'cat .en\\v', 'cat ".""env"', 'dd if=.env of=/dev/stdout',
  ]) {
    assert.equal(judge(command), 'deny', command);
  }
  assert.equal(judge('echo "a|b; c" > out.txt'), 'allow');
});

test('inspection refuses a FIFO and never reports a value length', (t) => {
  const dir = project(t);
  const print = core.fingerprint('.env', 'API_KEY', dir, { ENV_SECRET_GUARD_PEPPER: 'p' });
  assert.equal(Object.hasOwn(print, 'length'), false);
  fs.rmSync(path.join(dir, '.env.local'), { force: true });
  spawnSync('mkfifo', [path.join(dir, '.env.local')]);
  if (fs.existsSync(path.join(dir, '.env.local'))) {
    assert.deepEqual(core.listKeys('.env.local', dir), { ok: false, error: 'Refused: not a regular file.' });
  }
});

test('grep reads its pattern as a pattern, not a file', () => {
  const judge = (command) => core.evaluateToolCall({ tool: 'Bash', input: { command }, cwd: '/' }).decision;
  assert.equal(judge('grep -n .env README.md'), 'allow');
  assert.equal(judge('rg ".env" docs'), 'allow');
  assert.equal(judge('grep KEY .env'), 'deny');
  assert.equal(judge('grep -e KEY .env.local'), 'deny');
  assert.equal(judge('Select-String -Path .env -Pattern KEY'), 'deny');
});

test('grep -f reads its pattern file, so a dotenv pattern file is refused', () => {
  const judge = (command) => core.evaluateToolCall({ tool: 'Bash', input: { command }, cwd: '/' }).decision;
  for (const command of ['grep -f .env README.md', 'rg -f .env docs', 'grep --file=.env src', 'grep -f.env src']) {
    assert.equal(judge(command), 'deny', command);
  }
  assert.equal(judge('grep -f patterns.txt README.md'), 'allow');
});

test('command substitution and variables cannot carry a dotenv read', () => {
  const judge = (command) => core.evaluateToolCall({ tool: 'Bash', input: { command }, cwd: '/' }).decision;
  for (const command of [
    'echo $(cat .env)', 'echo `cat .env`', 'echo "$(cat .env)"', 'diff <(cat .env) other.txt',
    'f=.env; cat "$f"', 'export F=.env && cat ${F}', 'cat ${ENV_FILE:-.env}', 'cat $HOME/.env',
  ]) {
    assert.equal(judge(command), 'deny', command);
  }
  assert.equal(judge('echo $(date) > out.txt'), 'allow');
  assert.equal(judge('f=README.md; cat "$f"'), 'allow');
});

test('a path printed by a substitution is judged by the text it prints', () => {
  const judge = (command) => core.evaluateToolCall({ tool: 'Bash', input: { command }, cwd: '/' }).decision;
  for (const command of [
    'f="$(printf .env)"; cat "$f"', 'F=`echo .env`; cat $F', 'cat "$(echo .env.local)"',
    'cat $(printf %s .env)', 'f=.env; g=$(echo $f); cat "$g"',
  ]) {
    assert.equal(judge(command), 'deny', command);
  }
  for (const command of ['cat "$(echo README.md)"', 'cat $(git ls-files)', 'echo $(echo .env)']) {
    assert.equal(judge(command), 'allow', command);
  }
});

test('inline code or a -c script handed a dotenv file as an argument is refused', () => {
  const judge = (command) => core.evaluateToolCall({ tool: 'Bash', input: { command }, cwd: '/' }).decision;
  for (const command of [
    `node -e 'require("fs").appendFileSync(process.argv[1], "X=1")' .env`,
    `python3 -c 'import sys; print(open(sys.argv[1]).read())' .env.local`,
    `bash -c 'cat "$1"' _ .env`, 'node --env-file=.env -e "console.log(process.env.API_KEY)"',
  ]) {
    assert.equal(judge(command), 'deny', command);
  }
  assert.equal(judge(`node -e 'console.log(process.argv[1])' README.md`), 'allow');
  assert.equal(judge('node --env-file=.env app.js'), 'allow');
});

test('a grep file filter that names dotenv files is not a read', () => {
  const judge = (command) => core.evaluateToolCall({ tool: 'Bash', input: { command }, cwd: '/' }).decision;
  assert.equal(judge('grep -rn TOKEN --exclude=.env* src'), 'allow');
  assert.equal(judge(`rg TOKEN -g '!.env*' src`), 'allow');
  assert.equal(judge('grep -rn TOKEN --exclude=.env* .env'), 'deny');
});

test('a script file handed a dotenv file, and env -S, are refused; the guard CLI is not', () => {
  const judge = (command) => core.evaluateToolCall({ tool: 'Bash', input: { command }, cwd: '/' }).decision;
  for (const command of [
    'node append.js .env', 'python3 tools/load.py .env.local', 'bash append.sh .env',
    'env -S "cat .env"', 'env --split-string="head .env"',
  ]) {
    assert.equal(judge(command), 'deny', command);
  }
  for (const command of [
    'node .skilled/hooks/env-secret-guard/cli/env-secret.cjs fingerprint .env API_KEY',
    'node --env-file .env app.js', 'python3 manage.py runserver', 'env -S "ls -la"',
  ]) {
    assert.equal(judge(command), 'allow', command);
  }
});

test('a hard link to a dotenv file is refused under any name', (t) => {
  const dir = project(t);
  fs.linkSync(path.join(dir, '.env'), path.join(dir, 'notes.txt'));
  fs.writeFileSync(path.join(dir, 'plain.txt'), 'x');
  assert.equal(decide('Read', { file_path: 'notes.txt' }, dir), 'deny');
  assert.equal(decide('Bash', { command: 'cat notes.txt' }, dir), 'deny');
  assert.equal(decide('Read', { file_path: 'plain.txt' }, dir), 'allow');
});

test('an agent may read the guard but not change it', () => {
  const file = '.skilled/hooks/env-secret-guard/lib/env-secret-guard.cjs';
  assert.equal(decide('Read', { file_path: file }), 'allow');
  assert.equal(decide('Bash', { command: `cat ${file}` }), 'allow');
  assert.equal(decide('Edit', { file_path: file, old_string: 'a', new_string: 'b' }), 'deny');
  assert.equal(decide('Bash', { command: `echo x >> ${file}` }), 'deny');
  assert.match(core.evaluateToolCall({ tool: 'Write', input: { file_path: file }, cwd: '/' }).reason, /part of the guard/);
});

test('a refusal is written to the event log when the project has a state folder', (t) => {
  const dir = project(t);
  decide('Read', { file_path: '.env' }, dir);
  const log = path.join(dir, '.skilled', 'skills', '.state', 'env-secret-guard.log');
  assert.equal(fs.existsSync(log), false);
  fs.mkdirSync(path.dirname(log), { recursive: true });
  decide('Bash', { command: 'cat .env' }, dir);
  assert.match(fs.readFileSync(log, 'utf8'), /bash: env-secret-guard: \.env is a dotenv file/);
  assert.doesNotMatch(fs.readFileSync(log, 'utf8'), new RegExp(SECRET));
});

test('a read inside an if, a loop, a group or a negation is refused', () => {
  const judge = (command) => core.evaluateToolCall({ tool: 'Bash', input: { command }, cwd: '/' }).decision;
  for (const command of [
    `if [ -f .env ]; then awk '{ print }' .env; fi`, 'if true; then :; else cat .env; fi',
    'while true; do head .env; break; done', '{ cat .env; }', '( cat .env )', '(cat .env)', '! grep KEY .env',
    'for f in .env; do cat "$f"; done', 'for f in .env*; do cat $f; done',
  ]) {
    assert.equal(judge(command), 'deny', command);
  }
  assert.equal(judge('if [ -f .env ]; then echo present; fi'), 'allow');
  assert.equal(judge('for f in *.md; do cat "$f"; done'), 'allow');
});

test('a program fed to an interpreter by here-document is judged as code', () => {
  const judge = (command) => core.evaluateToolCall({ tool: 'Bash', input: { command }, cwd: '/' }).decision;
  assert.equal(judge("python3 - <<'PY'\nfrom pathlib import Path\nprint(Path('.env').read_text())\nPY"), 'deny');
  assert.equal(judge('node <<EOF\nconsole.log(require("fs").readFileSync(".env.local", "utf8"))\nEOF'), 'deny');
  assert.equal(judge('bash <<EOF\ncat .env\nEOF'), 'deny');
  assert.equal(judge("python3 - <<'PY'\nprint(open('README.md').read())\nPY"), 'allow');
  assert.equal(judge("python3 - <<'PY'\nprint(open('.env.example').read())\nPY"), 'allow');
});

test('codex code-mode: the command inside tools.exec_command is judged', () => {
  const wrap = (cmd) => `const r = await tools.exec_command({cmd:${JSON.stringify(cmd)},"max_output_tokens":4000});\ntext(r.output);`;
  const heredoc = "python3 - <<'PY'\nfrom pathlib import Path\nprint(Path('.env').read_text())\nPY";
  for (const cmd of [heredoc, 'cat .env', "if [ -f .env ]; then awk '{ print }' .env; fi"]) {
    assert.equal(decide('exec', { command: wrap(cmd) }), 'deny', cmd);
    assert.equal(decide('exec', { input: wrap(cmd) }), 'deny', cmd);
    assert.equal(decide('exec', wrap(cmd)), 'deny', cmd);
  }
  assert.equal(decide('exec', { command: wrap("rg -n --glob '!.env' API_TOKEN .") }), 'allow');
  assert.equal(decide('exec', { command: wrap('ls -la') }), 'allow');
});

test('a dollar sign the shell keeps literal is not expanded', () => {
  const judge = (command) => core.evaluateToolCall({ tool: 'Bash', input: { command }, cwd: '/' }).decision;
  for (const command of [`f=.env; cat '$f'`, 'f=.env; cat \\$f', 'f=.env; cat "\\$f"']) {
    assert.equal(judge(command), 'allow', command);
  }
  assert.equal(judge(`bash -c 'f=.env; cat $f'`), 'deny');
});

test('a wrapper with options, a shell -c script, an interpreter one-liner and ln cannot carry a dotenv read', () => {
  const judge = (command) => core.evaluateToolCall({ tool: 'Bash', input: { command }, cwd: '/' }).decision;
  for (const command of [
    'sudo -u root cat .env', 'env -i cat .env', 'env -u HOME FOO=1 cat .env', 'time -f %e cat .env',
    'xargs -a .env echo', 'xargs --arg-file=.env echo', 'bash -c "cat .env"', 'sh -lc "head .env.local"',
    `node -e "console.log(require('fs').readFileSync('.env', 'utf8'))"`, `python3 -c "print(open('.env').read())"`,
    'ln .env copy', 'ln -s .env link',
  ]) {
    assert.equal(judge(command), 'deny', command);
  }
  for (const command of [
    'sudo -u root ls', 'node --env-file=.env app.js', 'node -e "console.log(1)"',
    `python3 -c "open('.env.example')"`, 'bash -c "ls"', 'ln -s README.md link',
  ]) {
    assert.equal(judge(command), 'allow', command);
  }
});

test('powershell keeps backslashes as path separators and a Windows path is matched', () => {
  const judge = (command) => core.evaluateToolCall({ tool: 'powershell', input: { command }, cwd: '/' }).decision;
  assert.equal(judge('Get-Content C:\\repo\\.env'), 'deny');
  assert.equal(judge('Get-Content -Path C:\\repo\\.env.local'), 'deny');
  assert.equal(judge('gc .e`nv'), 'deny');
  assert.equal(judge('Get-Content C:\\repo\\README.md'), 'allow');
  assert.equal(decide('Read', { file_path: 'C:\\repo\\.env' }), 'deny');
});

test('a glob that expands to a dotenv file is refused', (t) => {
  const dir = project(t);
  const judge = (command) => core.evaluateToolCall({ tool: 'Bash', input: { command }, cwd: dir }).decision;
  for (const command of ['cat .e*', 'cat .*env', 'cat .[e]nv', 'cat .e?v', 'cat .*', 'cat .env*']) {
    assert.equal(judge(command), 'deny', command);
  }
  assert.equal(judge('cat *.md'), 'allow');
  assert.equal(judge('cat .env.exam*'), 'allow');
});

test('written content that quotes a patch header is not read as a target', () => {
  const input = { file_path: 'docs/example.md', content: 'Example:\n--- .env\n+++ .env.example\n*** Add File: .env\n' };
  assert.equal(core.evaluateToolCall({ tool: 'Write', input, cwd: '/' }).decision, 'allow');
});

test('devin run_command is judged as a shell', () => {
  assert.equal(decide('run_command', { command: 'cat .env' }), 'deny');
});

test('codex sends its shell command as an argv array', () => {
  const result = core.evaluateToolCall({ tool: 'exec', input: { command: ['bash', '-lc', 'cat .env'] }, cwd: '/' });
  assert.equal(result.decision, 'deny');
});

test('a runtime hint is named before the CLI in the refusal', () => {
  const hint = 'call env_secret_list_keys';
  const result = core.evaluateToolCall({ tool: 'read', input: { filePath: '.env' }, cwd: '/', hint });
  assert.match(result.reason, /call env_secret_list_keys, or run node .*env-secret\.cjs/);
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. VALUE-FREE INSPECTION
// ─────────────────────────────────────────────────────────────────────────────

test('listKeys and validate report keys and bad lines without any value', (t) => {
  const dir = project(t);
  const keys = core.listKeys('.env', dir);
  assert.deepEqual(keys, { ok: true, keys: ['API_KEY', 'PORT'], valid: false });
  assert.deepEqual(core.validate('.env', dir), { ok: true, valid: false, invalidLines: [4] });
  assert.doesNotMatch(JSON.stringify(keys), new RegExp(SECRET));
});

test('fingerprint is a keyed HMAC, stable across files with equal values, and never the value', (t) => {
  const dir = project(t);
  fs.writeFileSync(path.join(dir, '.env.local'), `API_KEY='${SECRET}'\n`);
  const env = { ENV_SECRET_GUARD_PEPPER: 'pepper-for-tests' };
  const a = core.fingerprint('.env', 'API_KEY', dir, env);
  const b = core.fingerprint('.env.local', 'API_KEY', dir, env);
  assert.equal(a.ok, true);
  assert.match(a.fingerprint, /^[0-9a-f]{64}$/);
  assert.equal(a.fingerprint, b.fingerprint);
  const otherPepper = core.fingerprint('.env', 'API_KEY', dir, { ENV_SECRET_GUARD_PEPPER: 'other' });
  assert.notEqual(a.fingerprint, otherPepper.fingerprint);
  assert.doesNotMatch(JSON.stringify(a), new RegExp(SECRET));
});

test('a quoted value may carry a trailing comment, and a repeated key keeps its last value', (t) => {
  const dir = project(t);
  const text = `API_KEY="${SECRET}" # local\nTOKEN="a\\"b" #c\nAPI_KEY=second\nBAD="open\n`;
  fs.writeFileSync(path.join(dir, '.env.local'), text);
  assert.deepEqual(core.validate('.env.local', dir), { ok: true, valid: false, invalidLines: [4] });
  assert.deepEqual(core.listKeys('.env.local', dir).keys, ['API_KEY', 'TOKEN', 'API_KEY']);
  fs.writeFileSync(path.join(dir, '.env.test'), 'API_KEY=second\n');
  const env = { ENV_SECRET_GUARD_PEPPER: 'p' };
  const repeated = core.fingerprint('.env.local', 'API_KEY', dir, env);
  assert.equal(repeated.fingerprint, core.fingerprint('.env.test', 'API_KEY', dir, env).fingerprint);
});

test('a multi-line quoted value is one entry, and an escaped newline fingerprints like a real one', (t) => {
  const dir = project(t);
  const text = `PEM="-----BEGIN\n${SECRET}\n-----END"\nNEXT=1\nBT=\`x\`\nBAD="open\nAFTER=2\n`;
  fs.writeFileSync(path.join(dir, '.env.local'), text);
  assert.deepEqual(core.listKeys('.env.local', dir).keys, ['PEM', 'NEXT', 'BT', 'AFTER']);
  assert.deepEqual(core.validate('.env.local', dir).invalidLines, [6]);
  fs.writeFileSync(path.join(dir, '.env.test'), `PEM="-----BEGIN\\n${SECRET}\\n-----END"\n`);
  const env = { ENV_SECRET_GUARD_PEPPER: 'p' };
  const multi = core.fingerprint('.env.local', 'PEM', dir, env);
  assert.equal(multi.fingerprint, core.fingerprint('.env.test', 'PEM', dir, env).fingerprint);
  assert.doesNotMatch(JSON.stringify(multi), new RegExp(SECRET));
});

test('fingerprint refuses without a pepper, with a bad key name or for a missing key', (t) => {
  const dir = project(t);
  assert.match(core.fingerprint('.env', 'API_KEY', dir, {}).error, /ENV_SECRET_GUARD_PEPPER/);
  assert.match(core.fingerprint('.env', 'API-KEY', dir, { ENV_SECRET_GUARD_PEPPER: 'p' }).error, /invalid key/);
  assert.equal(core.fingerprint('.env', 'NOPE', dir, { ENV_SECRET_GUARD_PEPPER: 'p' }).error, 'Key not found.');
});

test('inspection refuses a non-dotenv file and a dotenv file outside the project', (t) => {
  const dir = project(t);
  const outside = project(t);
  fs.writeFileSync(path.join(dir, 'notes.txt'), 'X=1\n');
  assert.equal(core.listKeys('notes.txt', dir).ok, false);
  assert.equal(core.listKeys(path.join(outside, '.env'), dir).ok, false);
  assert.equal(core.listKeys('../' + path.basename(outside) + '/.env', dir).ok, false);
});

// ─────────────────────────────────────────────────────────────────────────────
// 4. ADAPTERS
// ─────────────────────────────────────────────────────────────────────────────

function runHook(payload, env = {}) {
  return spawnSync(process.execPath, [path.join(HOOK_ROOT, 'command-hook', 'env-secret-guard.cjs')], {
    input: JSON.stringify(payload),
    encoding: 'utf8',
    env: { ...process.env, SYSTEM_HOOKS_DISABLED: '', SYSTEM_ENV_SECRET_GUARD_DISABLED: '', ...env },
  });
}

test('command hook: claude, codex and devin get the PreToolUse deny envelope', () => {
  for (const payload of [
    { tool_name: 'Read', tool_input: { file_path: '.env' }, cwd: '/' },
    { tool_name: 'exec', tool_input: { command: ['bash', '-lc', 'cat .env'] }, cwd: '/' },
    { tool_name: 'read', tool_input: { file_path: '.env' }, cwd: '/' },
  ]) {
    const proc = runHook(payload);
    assert.equal(proc.status, 0);
    const out = JSON.parse(proc.stdout);
    assert.equal(out.hookSpecificOutput.permissionDecision, 'deny');
    assert.match(out.hookSpecificOutput.permissionDecisionReason, /dotenv file/);
  }
});

test('command hook: cursor gets its own permission envelope, on deny and on allow', () => {
  const denied = runHook({ tool_name: 'Read', tool_input: { target_file: '.env' }, workspace_roots: ['/'] });
  assert.equal(denied.status, 2);
  assert.equal(JSON.parse(denied.stdout).permission, 'deny');
  const allowed = runHook({ tool_name: 'Read', tool_input: { target_file: 'a.ts' }, workspace_roots: ['/'] });
  assert.equal(allowed.status, 0);
  assert.equal(JSON.parse(allowed.stdout).permission, 'allow');
});

test('command hook: a cursor payload without workspace_roots still gets the cursor envelope', () => {
  for (const marker of [{ hook_event_name: 'preToolUse' }, { conversation_id: 'conv-1' }]) {
    const proc = runHook({ tool_name: 'Read', tool_input: { path: '.env' }, cwd: '/', ...marker });
    assert.equal(proc.status, 2);
    assert.equal(JSON.parse(proc.stdout).permission, 'deny');
  }
  const claude = runHook({
    hook_event_name: 'PreToolUse',
    tool_name: 'Read',
    tool_input: { file_path: '.env' },
    cwd: '/',
    workspace_roots: ['/'],
  });
  assert.equal(claude.status, 0);
  assert.equal(JSON.parse(claude.stdout).hookSpecificOutput.permissionDecision, 'deny');
});

test('command hook: an allowed call and an unreadable payload pass silently', () => {
  const allowed = runHook({ tool_name: 'Read', tool_input: { file_path: 'a.ts' }, cwd: '/' });
  assert.equal(allowed.status, 0);
  assert.equal(allowed.stdout, '');
  const hookPath = path.join(HOOK_ROOT, 'command-hook', 'env-secret-guard.cjs');
  const broken = spawnSync(process.execPath, [hookPath], { input: 'not json', encoding: 'utf8' });
  assert.equal(broken.status, 0);
  assert.equal(broken.stdout, '');
});

test('command hook: the kill switch allows a call it would refuse', () => {
  const payload = { tool_name: 'Read', tool_input: { file_path: '.env' }, cwd: '/' };
  const proc = runHook(payload, { SYSTEM_ENV_SECRET_GUARD_DISABLED: '1' });
  assert.equal(proc.status, 0);
  assert.equal(proc.stdout, '');
});

test('pi: read and bash on a dotenv file return a block', async (t) => {
  // Pi resolves an extension's imports against its .pi/extensions path, so the
  // test copies the extension into a root whose .skilled is the real tree.
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'env-secret-guard-pi-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  fs.symlinkSync(SKILLED_ROOT, path.join(root, '.skilled'));
  fs.mkdirSync(path.join(root, '.pi', 'extensions'), { recursive: true });
  const target = path.join(root, '.pi', 'extensions', 'env-secret-guard.ts');
  fs.copyFileSync(path.join(HOOK_ROOT, 'pi', 'env-secret-guard.ts'), target);
  const extension = await import(pathToFileURL(target).href);
  let handler;
  extension.default({ on: (event, fn) => { if (event === 'tool_call') handler = fn; } });
  const ctx = { cwd: root };
  assert.equal((await handler({ toolName: 'read', input: { path: '.env' } }, ctx)).block, true);
  assert.equal((await handler({ toolName: 'bash', input: { command: 'tail .env.local' } }, ctx)).block, true);
  assert.equal(await handler({ toolName: 'read', input: { path: 'a.ts' } }, ctx), undefined);
});

test('cli: keys, validate and fingerprint print JSON without the value', (t) => {
  const dir = project(t);
  const cli = path.join(HOOK_ROOT, 'cli', 'env-secret.cjs');
  const run = (args, env = {}) => spawnSync(process.execPath, [cli, ...args], {
    cwd: dir, encoding: 'utf8', env: { ...process.env, ...env },
  });
  const keys = run(['keys', '.env']);
  assert.equal(keys.status, 0);
  assert.deepEqual(JSON.parse(keys.stdout).keys, ['API_KEY', 'PORT']);
  const print = run(['fingerprint', '.env', 'API_KEY'], { ENV_SECRET_GUARD_PEPPER: 'p' });
  assert.equal(print.status, 0);
  assert.doesNotMatch(print.stdout + print.stderr, new RegExp(SECRET));
  assert.equal(run(['validate', 'notes.txt']).status, 1);
  assert.equal(run(['bogus']).status, 2);
});
