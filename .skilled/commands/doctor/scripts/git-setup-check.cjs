#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: sk-git Setup Battery
// ───────────────────────────────────────────────────────────────────
'use strict';

// Read-only /doctor battery for the sk-git setup. Each check answers one
// question a repository that adapted sk-git needs answered: the toolchain is
// installed, the hooks are bound to this checkout, and the contract folder,
// remote-branch allowlist, worktree base, Commit-Id policy, advisory rules and
// suppressors in force are the ones the operator thinks they are.
//
// These surfaces mostly fail open. A missing contract folder, an advisory rule
// naming a check that does not exist, an unregistered runtime hook and a muted
// gate all read as healthy to every other check in the repository, which is
// why this battery is the one place they surface. Nothing is written, and no
// code is loaded from the repository under inspection: every helper resolves
// under OWN_ROOT, this script's own install root, and the inspected repository
// is read through git and the filesystem only.
//
// Usage: node git-setup-check.cjs [--repo <dir>] [--tool <name>] [--json]
//   --repo  repository to inspect (default: the current directory)
//   --tool  the AI tool running the check: claude, codex, devin, cursor,
//           opencode or pi. Without it, claude is assumed when CLAUDECODE is
//           set; no other environment variable is consulted.
//   --json  print one JSON object instead of the human report
// Exit 0 when every check passed or skipped, 3 (DEGRADED) when none failed
// but one was UNKNOWN or DEGRADED, 1 when one failed, 2 on a usage error or crash.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS AND ROOT RESOLUTION
// ─────────────────────────────────────────────────────────────────────────────

// The battery's own install root, the folder holding commands/, skills/ and
// scripts/. Every helper is loaded from here and never from the inspected
// repository, so a clone that plants a helper of its own runs nothing.
const OWN_ROOT = path.resolve(__dirname, '..', '..', '..');
const OWN_PARENT = path.resolve(OWN_ROOT, '..');

const USAGE = 'Usage: node .skilled/commands/doctor/scripts/git-setup-check.cjs [--repo <dir>] [--tool <claude|codex|devin|cursor|opencode|pi>] [--json]';

const TOOLS = ['claude', 'codex', 'devin', 'cursor', 'opencode', 'pi'];

// Where each runtime reads its git-preflight advisory registration from.
const TOOL_FILES = {
  claude: '.claude/settings.json',
  codex: '.codex/hooks.json',
  devin: '.devin/hooks.v1.json',
  cursor: '.cursor/hooks.json',
  opencode: '.opencode/plugins/sk-git-preflight-advisory.js',
  pi: '.pi/extensions/git-preflight-advisory.ts',
};

// The guard and the gate registry both write PASS and FAIL lines to whichever
// stream suits them, so both are captured and the buffer is sized for the
// noisiest helper.
const MAX_BUFFER = 64 * 1024 * 1024;

// The human block prints at most ten detail lines; a longer list is cut and
// counted rather than silently shortened.
const DETAIL_LIMIT = 10;

const RULES_REPAIR = 'fix the check name in .skilled/skills/sk-git/hard-rules.json';
const WORKTREE_REPAIR = 'git config speckit.worktreeBase <dir>';
const WORKTREE_ENV_REPAIR = 'export SPECKIT_WORKTREE_BASE=<writable dir>, or unset SPECKIT_WORKTREE_BASE';
const CONTRACT_REPAIR = '/doctor:git standards';
const GATES_REPAIR = '/doctor:git hooks';
const COMMIT_ID_REPAIR = 'restore .skilled/skills/sk-git/scripts/commit-id-naming.sh, or git config --local skilled.commitId false';

// Each AI tool registers the advisory in its own config file, which no installer
// writes, so the repair names that file and the doc that shows the entry.
const advisoryRepair = (tool) => `register git-preflight-advisory in ${TOOL_FILES[tool]} (see .skilled/skills/sk-git/scripts/hooks/README.md section 3)`;

const CONTRACT_KINDS = ['commit', 'pr', 'branch'];

// The samples separate the built-in exception from the file: `main` is allowed
// by the matcher itself, the release shape is exempted earlier by the pre-push
// hook rather than by this matcher, and the feature branch is allowed only by a
// line of its own in the allowlist file.
const ALLOWLIST_SAMPLES = ['main', 'skilled/v4.0.0.0', 'feature/setup-check-probe'];

// The hook kill-switches resolve from the environment first, then the
// operator's hook-flags.env, with the environment winning whenever the name is
// set, even to an empty string; the advisory reads its two SKGIT_ variables
// from the environment only. Only the master switches fail the check, because
// they turn off every hook in the chain rather than one advisory surface, which
// the registration check above reports separately.
const SUPPRESSION_FILE_VARS = [
  'SYSTEM_HOOKS_DISABLED',
  'MK_HOOKS_DISABLED',
  'SYSTEM_GIT_COMMIT_HOOKS_DISABLED',
  'SK_GIT_PREFLIGHT_DISABLED',
  'MK_GIT_PREFLIGHT_DISABLED',
];
const SUPPRESSION_ENV_VARS = ['SKGIT_ADVISORY', 'SKGIT_ADVISORY_SKIP'];
const MASTER_SWITCHES = ['SYSTEM_HOOKS_DISABLED', 'MK_HOOKS_DISABLED', 'SYSTEM_GIT_COMMIT_HOOKS_DISABLED'];

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

// Labels under the battery's own tree carry the install-root name (.skilled or
// .opencode) rather than an absolute path, because that is how the docs and the
// repairs spell them.
function ownLabel(relative) {
  return path.relative(OWN_PARENT, path.join(OWN_ROOT, relative));
}

// The shortest stable way to name a path in the report: repository-relative
// when it is inside the inspected repository, absolute otherwise.
function repoLabel(repoRoot, absolute) {
  const relative = path.relative(repoRoot, absolute);
  return !relative || relative.startsWith('..') || path.isAbsolute(relative) ? absolute : relative;
}

// Config passed through the environment outranks every config file, so no git a
// helper starts can be steered by the inspected repository: fsmonitor starts a
// program on a plain query, and showSignature makes log run gpg.program. These
// variables select a repository and outrank -C, so they are dropped and every
// probe reads the repository the battery was pointed at.
const SAFE_GIT_CONFIG = [['core.fsmonitor', 'false'], ['log.showSignature', 'false']];
const REPO_SELECTING_VARS = ['GIT_DIR', 'GIT_WORK_TREE', 'GIT_INDEX_FILE', 'GIT_COMMON_DIR'];

function safeGitEnv() {
  const env = { ...process.env };
  for (const name of REPO_SELECTING_VARS) delete env[name];
  const base = Number.parseInt(env.GIT_CONFIG_COUNT || '0', 10) || 0;
  SAFE_GIT_CONFIG.forEach(([key, value], i) => {
    env[`GIT_CONFIG_KEY_${base + i}`] = key;
    env[`GIT_CONFIG_VALUE_${base + i}`] = value;
  });
  env.GIT_CONFIG_COUNT = String(base + SAFE_GIT_CONFIG.length);
  return env;
}

// A PATH entry that is relative or empty resolves against the child's working
// directory, which is the inspected repository, so a planted ./git or ./bash
// would run in place of the real tool. Only absolute entries are searched, and
// the resolution happens once here so every child process in the battery
// starts from the same executable.
function resolveBinary(name) {
  for (const entry of (process.env.PATH || '').split(path.delimiter)) {
    if (!entry || !path.isAbsolute(entry)) continue;
    const candidate = path.join(entry, name);
    try {
      fs.accessSync(candidate, fs.constants.X_OK);
      if (fs.statSync(candidate).isFile()) return candidate;
    } catch {
      // not executable or not readable from this entry; keep searching
    }
  }
  return null;
}

const GIT_BIN = resolveBinary('git');
const BASH_BIN = resolveBinary('bash');

// Anything the battery loads in-process reads process.env directly, and every
// child it spawns inherits it, so the PATH is narrowed once at the start of a
// run to absolute entries. A relative or empty entry resolves against the
// child's working directory, which is the inspected repository, and would let a
// planted ./git or ./bash run in place of the real tool.
function narrowPath() {
  process.env.PATH = (process.env.PATH || '').split(path.delimiter).filter((entry) => entry && path.isAbsolute(entry)).join(path.delimiter);
}

// Every child process runs from the inspected repository root and takes an argv
// array, never a shell string, so a repository cannot influence a helper
// through the working directory or through shell expansion.
function runCommand(cwd, command, args, env = safeGitEnv()) {
  // A binary that was not found on an absolute PATH entry is reported the way
  // spawnSync reports a spawn failure, so callers that read .error treat it as
  // a tool the battery could not run.
  if (command === null) {
    return {
      status: 1,
      stdout: '',
      stderr: '',
      output: '',
      error: new Error('not found on an absolute PATH entry'),
    };
  }
  const result = spawnSync(command, args, {
    cwd,
    env,
    encoding: 'utf8',
    maxBuffer: MAX_BUFFER,
  });
  return {
    status: typeof result.status === 'number' ? result.status : 1,
    stdout: result.stdout || '',
    stderr: result.stderr || '',
    output: `${result.stdout || ''}${result.stderr || ''}`,
    error: result.error || null,
  };
}

// Git runs the repository's configured fsmonitor program even for a plain query, so every
// invocation disables it before git is told which repository to read.
const GIT_FLAGS = ['-c', 'core.fsmonitor=false'];

function git(repoRoot, args) {
  return runCommand(repoRoot, GIT_BIN, [...GIT_FLAGS, '-C', repoRoot, ...args]);
}

// `git-hook-gates.cjs list --json` appends its status line after the JSON
// object, so the object is parsed from the text before that line rather than
// from the whole stdout.
function parseJsonReport(text) {
  const marker = text.indexOf('\nSTATUS=');
  const candidate = marker === -1 ? text : text.slice(0, marker);
  try {
    return JSON.parse(candidate);
  } catch {
    return null;
  }
}

function limitDetails(details) {
  if (details.length <= DETAIL_LIMIT) return details;
  const kept = details.slice(0, DETAIL_LIMIT - 1);
  kept.push(`... ${details.length - kept.length} more`);
  return kept;
}

// The truthy spelling every hook flag reader accepts.
function isTruthy(value) {
  return typeof value === 'string' && /^(1|true|yes|on)$/i.test(value.trim());
}

function firstLine(text) {
  return text.split('\n').find((line) => line.trim() !== '') || '';
}

// A repository file past this size is reported, never read, so one generated
// artifact cannot swamp the run.
const READ_CAP = 1024 * 1024;

// The one reader for every file the battery takes out of the inspected
// repository. O_NONBLOCK makes opening a FIFO return at once instead of waiting
// for a writer, and the type and size are checked with fstat on the opened
// descriptor, so a FIFO, a device or a directory is reported rather than blocking
// the run, and the file cannot be swapped between the check and the read. A
// missing file is not a problem: each caller decides what absence means there.
function readRepoFile(file, options = {}) {
  const flags = fs.constants.O_RDONLY
    | fs.constants.O_NONBLOCK
    | (options.refuseSymlink ? fs.constants.O_NOFOLLOW : 0);
  let fd;
  try {
    fd = fs.openSync(file, flags);
  } catch (err) {
    if (err.code === 'ENOENT') return { text: null, problem: null };
    if (err.code === 'ELOOP') return { text: null, problem: 'is a symlink' };
    return { text: null, problem: err.message };
  }
  try {
    const stats = fs.fstatSync(fd);
    if (!stats.isFile()) return { text: null, problem: 'not a regular file' };
    if (stats.size > READ_CAP) return { text: null, problem: `larger than ${READ_CAP} bytes` };
    return { text: fs.readFileSync(fd, 'utf8'), problem: null };
  } finally {
    fs.closeSync(fd);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. CHECKS
// ─────────────────────────────────────────────────────────────────────────────

const pass = (source, details = []) => ({ result: 'PASS', source, details, repair: null });
const fail = (source, details, repair) => ({ result: 'FAIL', source, details, repair });
const skip = (source, details = []) => ({ result: 'SKIP', source, details, repair: null });
const unknown = (source, details = []) => ({ result: 'UNKNOWN', source, details, repair: null });
const degraded = (source, details, repair) => ({ result: 'DEGRADED', source, details, repair });

// The toolchain files this battery itself needs: without any one of them the
// rest of the report would name helpers that do not exist, so install is the
// first check and its repair restores the skill's files.
function checkInstall() {
  const source = 'skills/sk-git/SKILL.md + hard-rules.json + scripts/';
  const required = ['skills/sk-git/SKILL.md', 'skills/sk-git/hard-rules.json', 'skills/sk-git/scripts'];
  const missing = required.filter((relative) => !fs.existsSync(path.join(OWN_ROOT, relative)));
  if (missing.length > 0) {
    // Each missing path is named so the restore brings back only what is gone
    // and keeps every other local edit, and the command runs against this
    // battery's own checkout, never the inspected repository.
    const top = git(OWN_ROOT, ['rev-parse', '--show-toplevel']);
    let repair;
    if (top.status === 0 && top.stdout.trim() !== '') {
      const topDir = top.stdout.trim();
      // git prints the real path, so compare like with like.
      const ownReal = fs.realpathSync(OWN_ROOT);
      const rels = missing.map((relative) => path.relative(topDir, path.join(ownReal, relative)));
      repair = `git -C ${topDir} restore --source=HEAD -- ${rels.join(' ')}`;
    } else {
      repair = 'reinstall sk-git from its source: this install root is not in a git work tree';
    }
    return fail(source, missing.map(ownLabel), repair);
  }
  return pass(source);
}

// install-git-hooks.sh is not called: it links the hook sources of the
// repository it runs in, resolving its source tree from the working directory's
// git toplevel and then executing that repository's own validate-message.mjs,
// so a clone the operator does not trust could pick the code this battery runs;
// the hook links are read and compared in process instead. That installer is
// named, by absolute path, only when the inspected repository is this checkout;
// any other repository is pointed at this checkout's hook folder through
// core.hooksPath, and its own installer is never named.
// PASS when every Git hook this checkout ships is installed in the inspected
// repository's hooks folder and resolves to a hook source: the repository's own
// tree, where the installer links them, or this checkout's, which a core.hooksPath
// shares. A missing target and a foreign target both surface as one detail line.
function checkHooks(ctx) {
  const source = 'git rev-parse --git-path hooks + hook links';
  const ownDir = path.join(OWN_ROOT, 'scripts', 'git-hooks');
  if (!fs.existsSync(ownDir)) return unknown(source, [ownLabel('scripts/git-hooks')]);
  const repoTree = ['.skilled', '.opencode']
    .find((root) => fs.existsSync(path.join(ctx.repoRoot, root, 'skills', 'system-spec-kit', 'SKILL.md')));
  const repoDir = repoTree ? path.join(ctx.repoRoot, repoTree, 'scripts', 'git-hooks') : null;
  const ownCommon = commonDirFor(ctx.repoRoot, OWN_ROOT);
  const repoCommon = commonDirFor(ctx.repoRoot, ctx.repoRoot);
  const ownCheckout = Boolean(ownCommon && repoCommon && ownCommon === repoCommon);
  const repair = ownCheckout
    ? `bash ${path.join(OWN_ROOT, 'scripts', 'install-git-hooks.sh')}`
    : `git config core.hooksPath ${ownDir}`;
  const resolved = git(ctx.repoRoot, ['rev-parse', '--git-path', 'hooks']);
  if (resolved.status !== 0 || resolved.stdout.trim() === '') {
    return fail(source, [firstLine(resolved.stderr) || `git rev-parse --git-path hooks exited ${resolved.status}`], repair);
  }
  const hooksDir = path.resolve(ctx.repoRoot, resolved.stdout.trim());
  const names = fs.readdirSync(ownDir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name !== 'README.md')
    .map((entry) => entry.name)
    .sort();
  const details = [];
  for (const name of names) {
    const installed = path.join(hooksDir, name);
    if (!fs.existsSync(installed)) {
      details.push(`${name}: not installed`);
      continue;
    }
    const installedReal = fs.realpathSync(installed);
    const accepted = [ownDir, repoDir]
      .filter((dir) => dir !== null && fs.existsSync(path.join(dir, name)))
      .map((dir) => fs.realpathSync(path.join(dir, name)));
    if (!accepted.includes(installedReal)) details.push(`${name}: resolves to ${installedReal}, not a hook source`);
  }
  if (details.length > 0) return fail(source, details, repair);
  return pass(source);
}

// The inspected repository runs its own hook scripts only when it is this
// checkout (shared git common dir) or its local config grants trust.
function commonDirFor(repoRoot, dir) {
  const result = runCommand(repoRoot, GIT_BIN, [...GIT_FLAGS, '-C', dir, 'rev-parse', '--git-common-dir']);
  if (result.status !== 0) return null;
  const value = result.stdout.trim();
  if (!value) return null;
  return path.resolve(dir, value);
}

// The naming helper resolves its files and the worktree base against the main
// worktree, the parent of the common git dir, so a linked worktree is judged
// by the same folder the helper reads.
function mainTopFor(repoRoot) {
  const common = commonDirFor(repoRoot, repoRoot);
  if (!common) return repoRoot;
  try {
    return fs.realpathSync(path.dirname(common));
  } catch {
    return repoRoot;
  }
}

function checkTrust(ctx) {
  const source = 'git config --local --bool skilled.trustRepoHooks + git rev-parse --git-common-dir';
  const ownCommon = commonDirFor(ctx.repoRoot, OWN_ROOT);
  const repoCommon = commonDirFor(ctx.repoRoot, ctx.repoRoot);
  const configured = git(ctx.repoRoot, ['config', '--local', '--bool', '--get', 'skilled.trustRepoHooks']);
  const value = configured.status === 0 ? configured.stdout.trim() : '';
  if (ownCommon && repoCommon && ownCommon === repoCommon) {
    return pass(source, [`own checkout: ${repoCommon}`]);
  }
  if (value === 'true') return pass(source, [`skilled.trustRepoHooks=${value}`]);
  return skip(source, ['untrusted: this clone\'s own hook scripts do not run']);
}

// Every saved gate key is judged by the registry's own reader, so a gate that
// is saved off at either scope is reported instead of assumed to be live.
function checkGates(ctx) {
  const source = 'git-hook-gates.cjs list --repo <repo> --json';
  const script = path.join(OWN_ROOT, 'commands', 'doctor', 'scripts', 'git-hook-gates.cjs');
  if (!fs.existsSync(script)) return unknown(source, [ownLabel('commands/doctor/scripts/git-hook-gates.cjs')]);
  // git-hook-gates.cjs reads its registry path from GATE_REGISTRY, so an
  // inherited value would decide which gates this row judges.
  const env = safeGitEnv();
  delete env.GATE_REGISTRY;
  const result = runCommand(ctx.repoRoot, process.execPath, [script, 'list', '--repo', ctx.repoRoot, '--json'], env);
  if (result.error || result.status !== 0) {
    // /doctor:git hooks starts with this same list call, so a repair cannot fix
    // a helper that fails; the row reports what it could not verify.
    const stderrLine = firstLine(result.stderr);
    const stdoutLine = result.stdout.split('\n').filter((line) => line.trim() !== '').pop();
    const message = stderrLine || stdoutLine || `git-hook-gates.cjs list exited ${result.status}`;
    return unknown(source, [message]);
  }
  const report = parseJsonReport(result.stdout);
  if (!report) return unknown(source, ['the gate report did not parse as JSON']);
  if (!Array.isArray(report.gates)) return unknown(source, ['the gate report carries no gates list']);
  const details = report.gates
    .filter((gate) => gate && gate.effective && gate.effective.state === 'off')
    .map((gate) => `${gate.key}: off (${gate.effective.from})`);
  if (details.length > 0) return degraded(source, details, GATES_REPAIR);
  return pass(source);
}

// A configured skgit.contractDir that points nowhere cannot be repaired by the
// command the other ContractError path names, because /doctor:git standards
// resolves that same setting first and refuses while it is broken. The repair
// therefore names the setting at the scope git reported it from, or creating
// the directory the setting names. Only a file scope counts, matching
// resolveContractDir, so a command-scope value never decides the repair, and a
// setting that cannot be read keeps the command repair.
function contractDirRepair(ctx) {
  const scoped = git(ctx.repoRoot, ['config', '--show-scope', '--get-all', 'skgit.contractDir']);
  if (scoped.status !== 0) return CONTRACT_REPAIR;
  const entry = scoped.stdout
    .split('\n')
    .filter((line) => line !== '' && !line.startsWith('command\t'))
    .map((line) => {
      const separator = line.indexOf('\t');
      return { scope: line.slice(0, separator).trim(), value: line.slice(separator + 1).trim() };
    })
    .filter((candidate) => candidate.value !== '')
    .pop();
  if (!entry) return CONTRACT_REPAIR;
  return `git config --${entry.scope} --unset skgit.contractDir, or mkdir -p ${path.resolve(ctx.repoRoot, entry.value)}`;
}

// The contract loader decides what is enforced, and it throws when a declared
// block is malformed, so its own verdict is reported rather than re-derived.
// An absent folder or an absent kind is a quiet opt-out, which is reported as
// "not enforced" and not as a failure.
async function checkStandards(ctx) {
  const source = 'message-contract.mjs resolveContractDir + loadContract';
  const modulePath = path.join(OWN_ROOT, 'skills', 'sk-git', 'scripts', 'lib', 'message-contract.mjs');
  if (!fs.existsSync(modulePath)) {
    return unknown(source, [ownLabel('skills/sk-git/scripts/lib/message-contract.mjs')]);
  }
  let mod;
  try {
    mod = await import(pathToFileURL(modulePath).href);
  } catch (err) {
    return unknown(source, [err.message]);
  }
  let resolved;
  try {
    resolved = mod.resolveContractDir(ctx.repoRoot);
  } catch (err) {
    // /doctor:git standards reads this same setting first and refuses while it
    // points nowhere, so the repair names the setting at the scope it came from,
    // or creating the directory it names.
    if (err && err.name === 'ContractError') return fail(source, [err.message], contractDirRepair(ctx));
    return unknown(source, [err.message]);
  }
  const details = [resolved ? `contract dir: ${resolved.source}` : 'contract dir: none'];
  for (const kind of CONTRACT_KINDS) {
    let loaded;
    try {
      loaded = mod.loadContract(ctx.repoRoot, kind);
    } catch (err) {
      if (err && err.name === 'ContractError') return fail(source, [err.message], CONTRACT_REPAIR);
      return unknown(source, [err.message]);
    }
    details.push(loaded ? `${kind} enforced (${repoLabel(ctx.repoRoot, loaded.file)})` : `${kind} not enforced`);
  }
  return pass(source, details);
}

// The sample verdicts come from the same matcher the pre-push hook uses; the
// allowlist file beside it is reported so a refusal is traceable to a file with
// no line for the branch, or to no file at all.
function checkAllowlist(ctx) {
  const source = 'worktree-naming.sh validate-remote-allowlist + remote-branch-allowlist.txt';
  const script = path.join(OWN_ROOT, 'skills', 'sk-git', 'scripts', 'worktree-naming.sh');
  if (!fs.existsSync(script)) {
    return unknown(source, [ownLabel('skills/sk-git/scripts/worktree-naming.sh')]);
  }
  const details = ALLOWLIST_SAMPLES.map((branch) => {
    if (branch.startsWith('skilled/v')) return `${branch}: exempt (pre-push skips release branches before the allowlist)`;
    const result = runCommand(ctx.repoRoot, BASH_BIN, [script, 'validate-remote-allowlist', branch]);
    if (result.error) return `${branch}: not checked (cannot run bash: ${result.error.message})`;
    const verdict = result.status === 0
      ? 'allowed'
      : result.status === 1
        ? 'refused'
        : `refused (script exited ${result.status})`;
    return `${branch}: ${verdict}`;
  });
  const file = allowlistFileFor(ctx.repoRoot);
  if (file) {
    const label = repoLabel(ctx.repoRoot, file);
    const { patterns, problem } = allowlistPatternsIn(file);
    details.push(problem
      ? `patterns (${label}): not shown, ${problem}`
      : `patterns (${label}): ${patterns.length > 0 ? patterns.join(', ') : 'none'}`);
  } else {
    details.push('patterns: no allowlist file, so only the built-in main exception applies');
  }
  return pass(source, details);
}

// The matcher reads the file from the main worktree, named .skilled first and
// .opencode second, and from nowhere else, so a repository without one has
// only the built-in exceptions.
function allowlistFileFor(repoRoot) {
  const top = mainTopFor(repoRoot);
  const candidates = [
    path.join(top, '.skilled', 'skills', 'sk-git', 'scripts', 'remote-branch-allowlist.txt'),
    path.join(top, '.opencode', 'skills', 'sk-git', 'scripts', 'remote-branch-allowlist.txt'),
  ];
  return candidates.find((candidate) => fs.existsSync(candidate)) || null;
}

// The matcher follows the link (worktree-naming.sh line 148), but the report must
// not print a file outside the repository, so a linked allowlist is named and not
// shown: the read refuses the symlink and checkAllowlist reports the problem.
function allowlistPatternsIn(file) {
  const read = readRepoFile(file, { refuseSymlink: true });
  if (read.text === null) return { patterns: [], problem: read.problem };
  const patterns = [];
  for (const line of read.text.split('\n')) {
    const trimmed = line.split('#')[0].trim();
    if (trimmed) patterns.push(trimmed);
  }
  return { patterns, problem: null };
}

// The worktree base resolves the same way the naming helper resolves it: env
// first, then git config, then the in-checkout default. A relative value lands
// against the main worktree, and a leading ~ expands like the helper does.
function resolveWorktreeBase(repoRoot) {
  const envValue = process.env.SPECKIT_WORKTREE_BASE || '';
  const configured = git(repoRoot, ['config', '--get', 'speckit.worktreeBase']);
  const gitValue = configured.status === 0 ? configured.stdout.trim() : '';
  let raw = envValue.trim() || gitValue || '.worktrees';
  const sourceLabel = envValue.trim()
    ? 'SPECKIT_WORKTREE_BASE'
    : gitValue
      ? 'git config speckit.worktreeBase'
      : 'default';
  if (raw === '~') raw = os.homedir();
  else if (raw.startsWith('~/')) raw = path.join(os.homedir(), raw.slice(2));
  const dir = path.isAbsolute(raw) ? path.normalize(raw) : path.resolve(mainTopFor(repoRoot), raw);
  return { dir, source: sourceLabel };
}

function nearestExistingDir(start) {
  let dir = start;
  while (!fs.existsSync(dir)) {
    const parent = path.dirname(dir);
    if (parent === dir) return null;
    dir = parent;
  }
  return dir;
}

function readProvisionEntries(file) {
  const entries = [];
  for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const [dir, output = ''] = trimmed.split(/\s+/);
    entries.push({ dir, output });
  }
  return entries;
}

// PASS requires the base itself to be a writable directory, or, when it does
// not exist yet, its nearest existing ancestor to be a writable directory,
// because the helper creates the base with mkdir -p. Each provision entry is
// listed with its install and build state, including the entries provision
// skips for want of a package, so a relocated base and a stale provision list
// are visible before a new worktree needs them. These lines stay informational
// and never decide the verdict. The repair names the environment variable when
// that is what set the base, since the environment outranks git config.
function checkWorktrees(ctx) {
  const source = 'SPECKIT_WORKTREE_BASE | speckit.worktreeBase | .worktrees + worktree-provision-paths.txt';
  const base = resolveWorktreeBase(ctx.repoRoot);
  const details = [`base: ${repoLabel(ctx.repoRoot, base.dir)} (from ${base.source})`];
  const provisionFile = path.join(OWN_ROOT, 'skills', 'sk-git', 'scripts', 'worktree-provision-paths.txt');
  if (fs.existsSync(provisionFile)) {
    for (const { dir, output } of readProvisionEntries(provisionFile)) {
      const packageDir = path.join(ctx.repoRoot, dir);
      if (!fs.existsSync(path.join(packageDir, 'package.json'))) {
        details.push(`${dir}: no package, provision skips it`);
        continue;
      }
      const installed = fs.existsSync(path.join(packageDir, 'node_modules'));
      const buildSuffix = output
        ? (fs.existsSync(path.join(packageDir, output)) ? ', built' : ', not built')
        : '';
      details.push(`${dir}: ${installed ? 'installed' : 'not installed'}${buildSuffix}`);
    }
  } else {
    details.push(`provision list missing: ${ownLabel('skills/sk-git/scripts/worktree-provision-paths.txt')}`);
  }
  const repair = base.source === 'SPECKIT_WORKTREE_BASE' ? WORKTREE_ENV_REPAIR : WORKTREE_REPAIR;
  const nearest = nearestExistingDir(base.dir);
  if (!nearest) return fail(source, ['the base has no existing parent folder', ...details], repair);
  const label = repoLabel(ctx.repoRoot, nearest);
  let isDirectory;
  try {
    isDirectory = fs.statSync(nearest).isDirectory();
  } catch {
    isDirectory = false;
  }
  if (!isDirectory) {
    const message = nearest === base.dir ? 'base is not a directory' : 'base parent is not a directory';
    return fail(source, [`${message}: ${label}`, ...details], repair);
  }
  try {
    fs.accessSync(nearest, fs.constants.W_OK);
  } catch {
    const message = nearest === base.dir ? 'base not writable' : 'base parent not writable';
    return fail(source, [`${message}: ${label}`, ...details], repair);
  }
  return pass(source, details);
}

// The policy helper decides whether the repository is covered, and this check
// then only proves the allocator the decision implies actually ships. The
// decision never calls the allocator, which would write its high-water mark.
function commitIdMarkers(repoRoot) {
  return [
    ['skills/sk-git/scripts/commit-id-naming.sh'],
    ['skills/system-spec-kit/SKILL.md'],
  ].flatMap(([relative]) => [
    path.join(repoRoot, '.skilled', relative),
    path.join(repoRoot, '.opencode', relative),
  ]);
}

function checkCommitId(ctx) {
  const source = 'commit-id-policy.sh cip_repo_wants_ids + git config --local --bool skilled.commitId';
  const policy = path.join(OWN_ROOT, 'scripts', 'git-hooks', 'lib', 'commit-id-policy.sh');
  if (!fs.existsSync(policy)) return unknown(source, [ownLabel('scripts/git-hooks/lib/commit-id-policy.sh')]);
  const probe = runCommand(ctx.repoRoot, BASH_BIN, [
    '-c',
    'source "$1"; cip_repo_wants_ids "$2"',
    '_',
    policy,
    ctx.repoRoot,
  ]);
  if (probe.error) return unknown(source, [`cannot run bash: ${probe.error.message}`]);
  if (probe.status !== 0 && probe.status !== 1) {
    return unknown(source, [`cip_repo_wants_ids exited ${probe.status}`]);
  }
  const on = probe.status === 0;
  const configured = git(ctx.repoRoot, ['config', '--local', '--bool', 'skilled.commitId']);
  const value = configured.status === 0 ? configured.stdout.trim() : '';
  const reason = value === 'true' || value === 'false'
    ? 'config'
    : commitIdMarkers(ctx.repoRoot).some((marker) => fs.existsSync(marker))
      ? 'markers'
      : 'history';
  const details = [`ids ${on ? 'on' : 'off'} (${reason})`];
  if (on && !fs.existsSync(path.join(OWN_ROOT, 'skills', 'sk-git', 'scripts', 'commit-id-naming.sh'))) {
    details.push(`the allocator is missing: ${ownLabel('skills/sk-git/scripts/commit-id-naming.sh')}`);
    return fail(source, details, COMMIT_ID_REPAIR);
  }
  return pass(source, details);
}

// A rule whose `check` name is unknown is skipped at run time with no error, so
// the rule set is validated against the same table the advisory dispatches on.
// A malformed rule file is a failure, because the advisory would otherwise read
// it as an empty rule set.
async function checkAdvisoryRules() {
  const source = 'hard-rules.json + git-rule-checks.mjs GIT_CHECKS';
  const rulesFile = path.join(OWN_ROOT, 'skills', 'sk-git', 'hard-rules.json');
  const checksModule = path.join(OWN_ROOT, 'skills', 'sk-git', 'scripts', 'lib', 'git-rule-checks.mjs');
  if (!fs.existsSync(rulesFile)) return unknown(source, [ownLabel('skills/sk-git/hard-rules.json')]);
  if (!fs.existsSync(checksModule)) return unknown(source, [ownLabel('skills/sk-git/scripts/lib/git-rule-checks.mjs')]);
  let rules;
  try {
    rules = JSON.parse(fs.readFileSync(rulesFile, 'utf8'));
  } catch {
    return fail(source, ['not a JSON array'], RULES_REPAIR);
  }
  if (!Array.isArray(rules)) return fail(source, ['not a JSON array'], RULES_REPAIR);
  let mod;
  try {
    mod = await import(pathToFileURL(checksModule).href);
  } catch (err) {
    return unknown(source, [err.message]);
  }
  const known = mod && mod.GIT_CHECKS && typeof mod.GIT_CHECKS === 'object' ? mod.GIT_CHECKS : null;
  if (!known) return unknown(source, [`${ownLabel('skills/sk-git/scripts/lib/git-rule-checks.mjs')} exports no GIT_CHECKS`]);
  const bad = [];
  rules.forEach((rule, index) => {
    const name = rule && typeof rule.check === 'string' ? rule.check : null;
    if (name && Object.prototype.hasOwnProperty.call(known, name)) return;
    const id = rule && rule.id ? rule.id : `rule ${index + 1}`;
    bad.push(`${id}: unknown check ${name === null ? '(missing)' : name}`);
  });
  if (bad.length > 0) return fail(source, bad, RULES_REPAIR);
  return pass(source);
}

// The kill-switch file the hooks read: an explicit HOOK_FLAGS_CONFIG wins,
// then the source root that carries the spec-kit skill, .skilled before
// .opencode, exactly as the hooks resolve it. No file found yields null.
function hookFlagsFileFor(repoRoot) {
  const configured = process.env.HOOK_FLAGS_CONFIG;
  if (configured !== undefined && configured !== '') return configured;
  for (const root of ['.skilled', '.opencode']) {
    if (fs.existsSync(path.join(repoRoot, root, 'skills', 'system-spec-kit', 'SKILL.md'))) {
      return path.join(repoRoot, root, 'hooks', 'hook-flags.env');
    }
  }
  return null;
}

// Parse the kill-switch file in process, never executing it. Blank and comment
// lines are ignored, a '#' after a space or tab ends the value, one pair of
// surrounding quotes is stripped, and the last line for a key wins; the line
// number is kept so a repair can point at it. Any read failure yields no values
// and the reason, so a file the check cannot read never silences it by accident
// and the row can say why it was not read.
function parseHookFlagsFile(file) {
  const read = readRepoFile(file);
  if (read.text === null) return { values: new Map(), problem: read.problem };
  const values = new Map();
  const text = read.text.startsWith('\uFEFF') ? read.text.slice(1) : read.text;
  text.split(/\r?\n/).forEach((line, index) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const eq = trimmed.indexOf('=');
    if (eq <= 0) return;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).replace(/[ \t]#.*$/, '').trim();
    if (value.length >= 2 && ((value[0] === '"' && value[value.length - 1] === '"') || (value[0] === "'" && value[value.length - 1] === "'"))) {
      value = value.slice(1, -1);
    }
    values.set(key, { value, line: index + 1 });
  });
  return { values, problem: null };
}

// The environment and the saved file are both reported, never changed, and a
// saved switch names the file and line that carries it so a silenced hook is
// traceable. Only the master switches fail the check, because they turn off
// every hook in the chain rather than one advisory surface.
function checkSuppression(ctx) {
  const source = 'env + hook-flags.env: SYSTEM_HOOKS_DISABLED, MK_HOOKS_DISABLED, SYSTEM_GIT_COMMIT_HOOKS_DISABLED, SK_GIT_PREFLIGHT_DISABLED, MK_GIT_PREFLIGHT_DISABLED; env only: SKGIT_ADVISORY, SKGIT_ADVISORY_SKIP';
  const file = hookFlagsFileFor(ctx.repoRoot);
  const parsed = file === null ? { values: new Map(), problem: null } : parseHookFlagsFile(file);
  const saved = parsed.values;
  const label = file === null ? '' : repoLabel(ctx.repoRoot, file);
  const resolved = new Map();
  for (const name of SUPPRESSION_FILE_VARS) {
    if (process.env[name] !== undefined) {
      resolved.set(name, { value: process.env[name], env: true });
    } else if (saved.has(name)) {
      resolved.set(name, { value: saved.get(name).value, env: false, line: saved.get(name).line });
    }
  }
  for (const name of SUPPRESSION_ENV_VARS) {
    if (process.env[name] !== undefined) resolved.set(name, { value: process.env[name], env: true });
  }
  const details = [];
  if (parsed.problem) details.push(`hook-flags.env not read (${label}): ${parsed.problem}`);
  for (const name of [...SUPPRESSION_FILE_VARS, ...SUPPRESSION_ENV_VARS]) {
    const entry = resolved.get(name);
    if (!entry || entry.value === '') continue;
    details.push(entry.env ? `${name}=${entry.value} (env)` : `${name}=${entry.value} (${label}:${entry.line})`);
  }
  const envOff = [];
  const fileOff = [];
  for (const name of MASTER_SWITCHES) {
    const entry = resolved.get(name);
    if (!entry || !isTruthy(entry.value)) continue;
    if (entry.env) envOff.push(name);
    else fileOff.push({ name, line: entry.line, value: entry.value });
  }
  if (envOff.length > 0 || fileOff.length > 0) {
    const parts = [];
    if (envOff.length > 0) parts.push(`unset ${envOff.join(' ')}`);
    for (const entry of fileOff) parts.push(`delete line ${entry.line} of ${label} (${entry.name}=${entry.value})`);
    return fail(source, details, parts.join(', then '));
  }
  return pass(source, details);
}

// Every adapter whose config file exists must register the advisory, because a
// present but unregistered file reads as coverage while no warning is ever shown.
// An absent file is only "not set up", except for the tool running the check,
// which must register. opencode and pi load the adapter file itself, so the check
// reads it for its event handler and its import of the shared git-rule-checks.mjs.
// A run with no active tool cannot say whether the tool running it is covered, so
// it is UNKNOWN and names --tool.
// Claude also loads hooks from its local settings file, so either file counts.
const TOOL_EXTRA_FILES = { claude: ['.claude/settings.local.json'] };

// Where each runtime fires its pre-tool hooks and which shell tool names it
// reports there. Claude accepts a registration without a matcher; the other
// three dispatch only through a matcher that names the shell tool, so a missing
// or empty matcher there is not coverage.
const TOOL_HOOK_EVENTS = {
  claude: { event: 'PreToolUse', names: ['Bash'], allowEmptyMatcher: true },
  codex: { event: 'PreToolUse', names: ['exec', 'Bash'], allowEmptyMatcher: false },
  devin: { event: 'PreToolUse', names: ['exec'], allowEmptyMatcher: false },
  cursor: { event: 'preToolUse', names: ['Shell'], allowEmptyMatcher: false },
};

// Only the hooks section counts, so a mention elsewhere, such as a permissions
// deny rule, is not read as a registration. Devin keeps its events at the top
// level, so its whole file is the hooks section.
//
// The event and the matcher both decide whether the advisory ever runs: each
// runtime fires it only from its own pre-tool event and only for its shell tool
// (git-preflight-advisory.mjs accepts bash, exec and shell), and Codex sends
// exec or Bash depending on its version, so an entry under another event or
// behind a matcher that misses a shell tool is not a registration.
function registersAdvisory(tool, body) {
  const runtime = TOOL_HOOK_EVENTS[tool];
  if (!runtime) return false;
  const parsed = JSON.parse(body);
  const section = tool === 'devin' ? parsed : parsed && parsed.hooks;
  const entries = section && Array.isArray(section[runtime.event]) ? section[runtime.event] : [];
  return entries.some((entry) => {
    if (!entry || typeof entry !== 'object') return false;
    const commands = [
      entry.command,
      ...(Array.isArray(entry.hooks) ? entry.hooks.map((hook) => hook && hook.command) : []),
    ].filter((command) => typeof command === 'string');
    if (!commands.some((command) => command.includes('git-preflight-advisory'))) return false;
    const matcher = entry.matcher;
    if (matcher === undefined || matcher === null || matcher === '') return runtime.allowEmptyMatcher;
    if (typeof matcher !== 'string') return false;
    let pattern;
    try {
      pattern = new RegExp(`^(?:${matcher})$`);
    } catch {
      return false;
    }
    return runtime.names.every((name) => pattern.test(name));
  });
}

function checkAiToolHooks(ctx) {
  const explicit = typeof ctx.tool === 'string' && ctx.tool !== '';
  const active = explicit ? ctx.tool : process.env.CLAUDECODE ? 'claude' : null;
  const source = active === null
    ? 'six adapter files, no active tool detected'
    : `six adapter files, active ${active} via ${explicit ? '--tool' : 'CLAUDECODE'}`;
  const details = [];
  const broken = [];
  for (const tool of TOOLS) {
    const rel = TOOL_FILES[tool];
    const label = tool === active ? `${tool} (active)` : tool;
    const present = [rel, ...(TOOL_EXTRA_FILES[tool] || [])]
      .filter((candidate) => fs.existsSync(path.join(ctx.repoRoot, candidate)));
    if (present.length === 0) {
      details.push(`${label}: not set up (${rel})`);
      if (tool === active) broken.push(tool);
      continue;
    }
    if (tool === 'opencode' || tool === 'pi') {
      const read = readRepoFile(path.join(ctx.repoRoot, rel));
      if (read.text === null) {
        details.push(`${label}: cannot read ${rel}: ${read.problem || 'missing'}`);
        broken.push(tool);
        continue;
      }
      const body = read.text;
      const registered = tool === 'opencode'
        ? /['"]tool\.execute\.before['"]/.test(body) && /git-rule-checks\.mjs/.test(body)
        : /\.on\(\s*['"]tool_call['"]/.test(body) && /git-rule-checks\.mjs/.test(body);
      if (registered) {
        details.push(`${label}: registered (${rel})`);
      } else {
        details.push(tool === 'opencode'
          ? `${label}: ${rel} does not register tool.execute.before with git-rule-checks.mjs`
          : `${label}: ${rel} does not register a tool_call handler with git-rule-checks.mjs`);
        broken.push(tool);
      }
      continue;
    }
    let registeredIn = null;
    let error = null;
    for (const candidate of present) {
      const read = readRepoFile(path.join(ctx.repoRoot, candidate));
      if (read.text === null) {
        error = `${candidate}: ${read.problem || 'missing'}`;
        continue;
      }
      try {
        if (registersAdvisory(tool, read.text)) {
          registeredIn = candidate;
          break;
        }
      } catch (err) {
        error = `${candidate}: ${err.message}`;
      }
    }
    if (registeredIn) {
      details.push(`${label}: registered (${registeredIn})`);
    } else if (error) {
      details.push(`${label}: cannot read ${error}`);
      broken.push(tool);
    } else {
      const runtime = TOOL_HOOK_EVENTS[tool];
      details.push(`${label}: ${present.join(' and ')} does not register git-preflight-advisory under ${runtime.event} for ${runtime.names.join(' and ')}`);
      broken.push(tool);
    }
  }
  if (broken.length > 0) return fail(source, details, broken.map(advisoryRepair).join(', then '));
  if (active === null) {
    return unknown(source, [
      'no active AI tool detected: pass --tool <claude|codex|devin|cursor|opencode|pi>',
      ...details,
    ]);
  }
  return pass(source, details);
}

// The checks run in this order: the toolchain first, so a missing install is
// reported before the helpers it would have supplied, then every surface the
// setup can customize.
const CHECKS = [
  { id: 'install', run: checkInstall },
  { id: 'hooks', run: checkHooks },
  { id: 'trust', run: checkTrust },
  { id: 'gates', run: checkGates },
  { id: 'standards', run: checkStandards },
  { id: 'allowlist', run: checkAllowlist },
  { id: 'worktrees', run: checkWorktrees },
  { id: 'commit-id', run: checkCommitId },
  { id: 'advisory-rules', run: checkAdvisoryRules },
  { id: 'suppression', run: checkSuppression },
  { id: 'ai-tool-hooks', run: checkAiToolHooks },
];

// A check that throws is reported as UNKNOWN with its message, never as a
// crash, so one broken helper cannot take the battery down with it.
async function runCheck(check, ctx) {
  let verdict;
  try {
    verdict = await check.run(ctx);
  } catch (err) {
    verdict = unknown('the check threw', [err && err.message ? err.message : String(err)]);
  }
  return {
    id: check.id,
    result: verdict.result,
    source: verdict.source,
    details: limitDetails(verdict.details),
    repair: verdict.repair || null,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. REPORT
// ─────────────────────────────────────────────────────────────────────────────

// One verdict for the whole battery, taken from its strongest row: a failure
// outranks a degraded or unknown row, which outranks a clean pass, so the
// human STATUS line, the JSON status field and the exit code agree.
function statusOf(rows) {
  if (rows.some((row) => row.result === 'FAIL')) return { status: 'FAIL', exitCode: 1 };
  if (rows.some((row) => row.result === 'UNKNOWN' || row.result === 'DEGRADED')) {
    return { status: 'DEGRADED', exitCode: 3 };
  }
  return { status: 'OK', exitCode: 0 };
}

function renderHuman(rows) {
  const lines = [];
  for (const row of rows) {
    lines.push(`${row.result.padEnd(9)}${row.id}`);
    lines.push(`      source: ${row.source}`);
    for (const detail of row.details) lines.push(`      ${detail}`);
    const repairable = row.result === 'FAIL' || row.result === 'DEGRADED';
    if (repairable && row.repair) lines.push(`      repair: ${row.repair}`);
  }
  const failed = rows.filter((row) => row.result === 'FAIL').length;
  const degradedCount = rows.filter((row) => row.result === 'DEGRADED').length;
  const skipped = rows.filter((row) => row.result === 'SKIP').length;
  const unknownCount = rows.filter((row) => row.result === 'UNKNOWN').length;
  const status = statusOf(rows).status;
  if (status === 'OK') {
    lines.push(`STATUS=OK checks=${rows.length}`);
  } else if (status === 'DEGRADED') {
    lines.push(`STATUS=DEGRADED degraded=${degradedCount} skipped=${skipped} unknown=${unknownCount}`);
  } else {
    lines.push(`STATUS=FAIL failed=${failed} degraded=${degradedCount} skipped=${skipped} unknown=${unknownCount}`);
  }
  return lines;
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. MAIN
// ─────────────────────────────────────────────────────────────────────────────

// An argument that is not one of the three options is a caller mistake, and an
// unknown tool would name a registration file that does not exist, so both
// print usage instead of running.
function parseArgs(argv) {
  const opts = { repo: null, tool: null, json: false };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--json') {
      opts.json = true;
      continue;
    }
    if (arg === '--repo' || arg === '--tool') {
      const value = argv[i + 1];
      if (value === undefined || value === '') return null;
      opts[arg.slice(2)] = value;
      i += 1;
      continue;
    }
    if (arg.startsWith('--repo=')) {
      opts.repo = arg.slice('--repo='.length);
      if (opts.repo === '') return null;
      continue;
    }
    if (arg.startsWith('--tool=')) {
      opts.tool = arg.slice('--tool='.length);
      if (opts.tool === '') return null;
      continue;
    }
    return null;
  }
  if (opts.tool !== null && !TOOLS.includes(opts.tool)) return null;
  return opts;
}

/**
 * Run every check against one repository and print the report.
 *
 * @param {string[]} argv - CLI arguments after the script path
 * @returns {Promise<number>} 0 when OK, 3 when DEGRADED, 1 when FAIL, 2 on a usage error
 */
async function main(argv) {
  narrowPath();
  const opts = parseArgs(argv);
  if (opts === null) {
    process.stderr.write(`${USAGE}\n`);
    return 2;
  }
  // The repository root must be resolved before any other child process, so the
  // probe runs from the requested directory rather than from the root it is
  // about to return.
  const requested = opts.repo === null ? process.cwd() : path.resolve(opts.repo);
  const probe = runCommand(requested, GIT_BIN, [...GIT_FLAGS, '-C', requested, 'rev-parse', '--show-toplevel']);
  const repoRoot = probe.status === 0 && probe.stdout.trim() !== '' ? path.resolve(probe.stdout.trim()) : '';
  if (repoRoot === '') {
    process.stderr.write(`${USAGE}\n`);
    return 2;
  }
  const ctx = { repoRoot, tool: opts.tool };
  const rows = [];
  for (const check of CHECKS) rows.push(await runCheck(check, ctx));
  const fold = statusOf(rows);
  if (opts.json) {
    process.stdout.write(`${JSON.stringify({ repo: repoRoot, checks: rows, status: fold.status }, null, 2)}\n`);
    return fold.exitCode;
  }
  process.stdout.write(`${renderHuman(rows).join('\n')}\n`);
  return fold.exitCode;
}

module.exports = { main, CHECKS, readRepoFile, READ_CAP };

if (require.main === module) {
  main(process.argv.slice(2)).then(
    (code) => {
      process.exitCode = code;
    },
    (err) => {
      process.stderr.write(`git-setup-check: ${err && err.message ? err.message : err}\n`);
      process.exitCode = 2;
    },
  );
}
