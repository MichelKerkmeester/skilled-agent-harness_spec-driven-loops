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
//           opencode, pi or hermes. Without it, claude is assumed when CLAUDECODE is
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

// Mirrors is_git_hook_name in scripts/install-git-hooks.sh, so the battery expects
// exactly the hooks the installer links.
const GIT_HOOK_NAMES = new Set([
  'applypatch-msg', 'pre-applypatch', 'post-applypatch', 'pre-commit',
  'pre-merge-commit', 'prepare-commit-msg', 'commit-msg', 'post-commit',
  'pre-rebase', 'post-checkout', 'post-merge', 'pre-push', 'pre-receive',
  'update', 'proc-receive', 'post-receive', 'post-update', 'reference-transaction',
  'push-to-checkout', 'pre-auto-gc', 'post-rewrite', 'sendemail-validate',
  'fsmonitor-watchman', 'p4-changelist', 'p4-prepare-changelist',
  'p4-post-changelist', 'p4-pre-submit', 'post-index-change',
]);

const USAGE = 'Usage: node .skilled/commands/doctor/scripts/git-setup-check.cjs [--repo <dir>] [--tool <claude|codex|devin|cursor|opencode|pi|hermes>] [--json]';

const TOOLS = ['claude', 'codex', 'devin', 'cursor', 'opencode', 'pi', 'hermes'];

// Where each runtime reads its git-preflight advisory registration from.
const TOOL_FILES = {
  claude: '.claude/settings.json',
  codex: '.codex/hooks.json',
  devin: '.devin/hooks.v1.json',
  cursor: '.cursor/hooks.json',
  opencode: '.opencode/plugins/sk-git-preflight-advisory.js',
  pi: '.pi/extensions/git-preflight-advisory.ts',
  hermes: '.hermes/plugins/repo-guards/__init__.py',
};

// The guard and the gate registry both write PASS and FAIL lines to whichever
// stream suits them, so both are captured and the buffer is sized for the
// noisiest helper.
const MAX_BUFFER = 64 * 1024 * 1024;

// The human block prints at most ten detail lines; a longer list is cut and
// counted rather than silently shortened.
const DETAIL_LIMIT = 10;

const WORKTREE_REPAIR = 'git config speckit.worktreeBase <dir>';
const WORKTREE_ENV_REPAIR = 'export SPECKIT_WORKTREE_BASE=<writable dir>, or unset SPECKIT_WORKTREE_BASE';
const CONTRACT_REPAIR = '/doctor:git standards';
const GATES_REPAIR = '/doctor:git hooks';
const COMMIT_ID_REPAIR = `restore ${ownLabel('skills/sk-git/scripts/commit-id-naming.sh')}, or git config --local skilled.commitId false`;

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
// set, even to an empty string; the advisory reads SKGIT_ADVISORY and
// SKGIT_ADVISORY_SKIP from the environment only. Master switches fail this row.
// The advisory's own switches degrade it because they silence only the
// advisory, while SKGIT_ADVISORY_SKIP remains informational because it silences
// single rules.
const SUPPRESSION_FILE_VARS = [
  'SYSTEM_HOOKS_DISABLED',
  'MK_HOOKS_DISABLED',
  'SYSTEM_GIT_COMMIT_HOOKS_DISABLED',
  'SK_GIT_PREFLIGHT_DISABLED',
  'MK_GIT_PREFLIGHT_DISABLED',
];
const SUPPRESSION_ENV_VARS = ['SKGIT_ADVISORY', 'SKGIT_ADVISORY_SKIP'];
const MASTER_SWITCHES = ['SYSTEM_HOOKS_DISABLED', 'MK_HOOKS_DISABLED', 'SYSTEM_GIT_COMMIT_HOOKS_DISABLED'];
const PREFLIGHT_SWITCHES = ['SK_GIT_PREFLIGHT_DISABLED', 'MK_GIT_PREFLIGHT_DISABLED'];

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

// Repairs are pasted into a shell, so spaces or quotes in a path must stay one word.
function shellQuote(value) {
  if (/^[A-Za-z0-9_@%+=:,.\/-]+$/.test(value)) return value;
  return `'${value.replace(/'/g, "'\\''")}'`;
}

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

// Config passed through the environment outranks every config file, so no git
// helper starts can be steered by the inspected repository: fsmonitor starts a
// program on a plain query, and showSignature makes log run gpg.program. These
// variables select a repository and outrank -C, so they are dropped and every
// probe reads the repository the battery was pointed at. Applying this to
// process.env also protects in-process modules whose git commands inherit it.
const SAFE_GIT_CONFIG = [['core.fsmonitor', 'false'], ['log.showSignature', 'false']];
const REPO_SELECTING_VARS = ['GIT_DIR', 'GIT_WORK_TREE', 'GIT_INDEX_FILE', 'GIT_COMMON_DIR'];

function applySafeGitEnv() {
  for (const name of REPO_SELECTING_VARS) delete process.env[name];
  const base = Number.parseInt(process.env.GIT_CONFIG_COUNT || '0', 10) || 0;
  SAFE_GIT_CONFIG.forEach(([key, value], i) => {
    process.env[`GIT_CONFIG_KEY_${base + i}`] = key;
    process.env[`GIT_CONFIG_VALUE_${base + i}`] = value;
  });
  process.env.GIT_CONFIG_COUNT = String(base + SAFE_GIT_CONFIG.length);
}

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
function runCommand(cwd, command, args, env = process.env) {
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

function git(repoRoot, args) {
  return runCommand(repoRoot, GIT_BIN, ['-C', repoRoot, ...args]);
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
    // The restore affects only missing files, and is safe only when HEAD holds
    // every path. It runs against this battery's checkout, never the inspected repository.
    const top = git(OWN_ROOT, ['rev-parse', '--show-toplevel']);
    let repair;
    if (top.status === 0 && top.stdout.trim() !== '') {
      const topDir = top.stdout.trim();
      // git prints the real path, so compare like with like.
      const ownReal = fs.realpathSync(OWN_ROOT);
      const rels = missing.map((relative) => path.relative(topDir, path.join(ownReal, relative)));
      const notCommitted = rels.filter((rel) => git(topDir, ['cat-file', '-e', `HEAD:${rel}`]).status !== 0);
      if (notCommitted.length === 0) {
        repair = `git -C ${shellQuote(topDir)} restore --source=HEAD -- ${rels.map(shellQuote).join(' ')}`;
      } else {
        repair = `reinstall sk-git from its source: ${notCommitted.join(', ')} not committed in ${topDir}`;
      }
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
    ? `bash ${shellQuote(path.join(OWN_ROOT, 'scripts', 'install-git-hooks.sh'))}`
    : `git config core.hooksPath ${shellQuote(ownDir)}`;
  const resolved = git(ctx.repoRoot, ['rev-parse', '--git-path', 'hooks']);
  if (resolved.status !== 0 || resolved.stdout.trim() === '') {
    return fail(source, [firstLine(resolved.stderr) || `git rev-parse --git-path hooks exited ${resolved.status}`], repair);
  }
  const hooksDir = path.resolve(ctx.repoRoot, resolved.stdout.trim());
  const names = fs.readdirSync(ownDir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && GIT_HOOK_NAMES.has(entry.name))
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
    if (!accepted.includes(installedReal)) {
      details.push(`${name}: resolves to ${installedReal}, not a hook source`);
      continue;
    }
    // Git skips a hook it cannot execute, so a linked hook without the execute bit gates nothing.
    try {
      fs.accessSync(installedReal, fs.constants.X_OK);
    } catch {
      details.push(`${name}: not executable (chmod +x ${shellQuote(installedReal)})`);
    }
  }
  if (details.length > 0) return fail(source, details, repair);
  return pass(source);
}

// The inspected repository runs its own hook scripts only when it is this
// checkout (shared git common dir) or its local config grants trust.
function commonDirFor(repoRoot, dir) {
  const result = runCommand(repoRoot, GIT_BIN, ['-C', dir, 'rev-parse', '--git-common-dir']);
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

  // Hooks judge trust from where their own script lives, so a clone's
  // installed links can trust that repository even when this battery is elsewhere.
  const hooksPath = git(ctx.repoRoot, ['rev-parse', '--git-path', 'hooks']);
  if (repoCommon && hooksPath.status === 0 && hooksPath.stdout.trim() !== '') {
    const hooksDir = path.resolve(ctx.repoRoot, hooksPath.stdout.trim());
    let installedCommonDirs = [];
    try {
      installedCommonDirs = fs.readdirSync(hooksDir)
        .filter((name) => GIT_HOOK_NAMES.has(name))
        .map((name) => {
          let real;
          try {
            real = fs.realpathSync(path.join(hooksDir, name));
          } catch {
            return null;
          }
          return commonDirFor(ctx.repoRoot, path.dirname(real));
        });
    } catch {
      installedCommonDirs = [];
    }
    if (installedCommonDirs.length > 0 && installedCommonDirs.every((dir) => dir === repoCommon)) {
      return pass(source, ['own hooks: the installed hooks link into this repository\'s own tree']);
    }
  }

  return skip(source, ['untrusted: hooks from another checkout skip this clone\'s own scripts']);
}

// Every saved gate key is judged by the registry's own reader, so a gate that
// is saved off at either scope is reported instead of assumed to be live.
function checkGates(ctx) {
  const source = 'git-hook-gates.cjs list --repo <repo> --json';
  const script = path.join(OWN_ROOT, 'commands', 'doctor', 'scripts', 'git-hook-gates.cjs');
  if (!fs.existsSync(script)) return unknown(source, [ownLabel('commands/doctor/scripts/git-hook-gates.cjs')]);
  // git-hook-gates.cjs reads its registry path from GATE_REGISTRY, so an
  // inherited value would decide which gates this row judges.
  const env = { ...process.env };
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
  return `git config --${entry.scope} --unset skgit.contractDir, or mkdir -p ${shellQuote(path.resolve(ctx.repoRoot, entry.value))}`;
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
  let unchecked = false;
  const details = ALLOWLIST_SAMPLES.map((branch) => {
    if (branch.startsWith('skilled/v')) return `${branch}: exempt (pre-push skips release branches before the allowlist)`;
    const result = runCommand(ctx.repoRoot, BASH_BIN, [script, 'validate-remote-allowlist', branch]);
    if (result.error) {
      unchecked = true;
      return `${branch}: not checked (cannot run bash: ${result.error.message})`;
    }
    if (result.status !== 0 && result.status !== 1) {
      unchecked = true;
      return `${branch}: not checked (worktree-naming.sh exited ${result.status})`;
    }
    if (branch === 'main' && result.status === 1) {
      unchecked = true;
      return 'main: refused, but main is the built-in exception, so the helper is broken';
    }
    const verdict = result.status === 0 ? 'allowed' : 'refused';
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
  // An unchecked sample or a refused main exception means the helper did not establish the matcher verdict.
  if (unchecked) return unknown(source, details);
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

// A dangling link that existsSync skips makes mkdir -p fail.
function nearestExistingDir(start) {
  let dir = start;
  while (true) {
    let entry;
    try {
      entry = fs.lstatSync(dir);
    } catch (error) {
      if (error.code !== 'ENOENT' && error.code !== 'ENOTDIR') throw error;
      const parent = path.dirname(dir);
      if (parent === dir) return { dir: null, dangling: false };
      dir = parent;
      continue;
    }
    let dangling = false;
    if (entry.isSymbolicLink()) {
      try {
        fs.statSync(dir);
      } catch (error) {
        if (error.code !== 'ENOENT' && error.code !== 'ENOTDIR') throw error;
        dangling = true;
      }
    }
    return { dir, dangling };
  }
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
  if (!nearest.dir) return fail(source, ['the base has no existing parent folder', ...details], repair);
  const label = repoLabel(ctx.repoRoot, nearest.dir);
  if (nearest.dangling) {
    const message = nearest.dir === base.dir
      ? 'base is a dangling symlink'
      : 'base parent is a dangling symlink';
    return fail(source, [`${message}: ${label}`, ...details], repair);
  }
  let isDirectory;
  try {
    isDirectory = fs.statSync(nearest.dir).isDirectory();
  } catch {
    isDirectory = false;
  }
  if (!isDirectory) {
    const message = nearest.dir === base.dir ? 'base is not a directory' : 'base parent is not a directory';
    return fail(source, [`${message}: ${label}`, ...details], repair);
  }
  try {
    fs.accessSync(nearest.dir, fs.constants.W_OK);
  } catch {
    const message = nearest.dir === base.dir ? 'base not writable' : 'base parent not writable';
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

// This row reads the inspected repository's own rule file, the file the advisory
// reads, and judges it against the battery's own check table.
async function checkAdvisoryRules(ctx) {
  const source = '<repo>/.skilled/skills/sk-git/hard-rules.json + git-rule-checks.mjs GIT_CHECKS';
  const rulesFile = path.join(ctx.repoRoot, '.skilled', 'skills', 'sk-git', 'hard-rules.json');
  const label = repoLabel(ctx.repoRoot, rulesFile);
  const shippedRules = path.join(OWN_ROOT, 'skills', 'sk-git', 'hard-rules.json');
  const copyRepair = [
    `mkdir -p ${shellQuote(path.dirname(rulesFile))}`,
    `cp ${shellQuote(shippedRules)} ${shellQuote(rulesFile)}`,
  ].join(' && ');
  const ruleRepair = [
    `fix ${shellQuote(rulesFile)}`,
    `against the GIT_CHECKS names in ${ownLabel('skills/sk-git/scripts/lib/git-rule-checks.mjs')}`,
  ].join(' ');
  const read = readRepoFile(rulesFile);
  if (read.text === null && read.problem === null) {
    return degraded(
      source,
      [`no rule file at ${label}, so the advisory is silent for every command`],
      copyRepair,
    );
  }
  if (read.problem !== null) return fail(source, [`${label}: ${read.problem}`], copyRepair);

  const checksModule = path.join(OWN_ROOT, 'skills', 'sk-git', 'scripts', 'lib', 'git-rule-checks.mjs');
  if (!fs.existsSync(checksModule)) return unknown(source, [ownLabel('skills/sk-git/scripts/lib/git-rule-checks.mjs')]);
  let rules;
  try {
    rules = JSON.parse(read.text);
  } catch {
    return fail(source, ['not valid JSON'], ruleRepair);
  }
  if (!Array.isArray(rules)) return fail(source, ['not a JSON array'], ruleRepair);
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
  if (bad.length > 0) return fail(source, bad, ruleRepair);
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

// The environment and saved file stay read-only, and saved switches name their
// file and line so a repair can target one setting. Master switches fail the
// check, while the advisory's own switches degrade it because they silence only
// the advisory. SKGIT_ADVISORY_SKIP remains informational because it silences
// single rules.
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

  const advisoryEnvOff = [];
  const advisoryFileOff = [];
  for (const name of PREFLIGHT_SWITCHES) {
    const entry = resolved.get(name);
    if (!entry || !isTruthy(entry.value)) continue;
    if (entry.env) advisoryEnvOff.push(name);
    else advisoryFileOff.push({ name, line: entry.line, value: entry.value });
  }
  const advisoryFlag = resolved.get('SKGIT_ADVISORY');
  if (advisoryFlag && /^(0|false|off)$/i.test(advisoryFlag.value || '')) {
    advisoryEnvOff.push('SKGIT_ADVISORY');
  }
  if (advisoryEnvOff.length > 0 || advisoryFileOff.length > 0) {
    const parts = [];
    if (advisoryEnvOff.length > 0) parts.push(`unset ${advisoryEnvOff.join(' ')}`);
    for (const entry of advisoryFileOff) {
      parts.push(`delete line ${entry.line} of ${label} (${entry.name}=${entry.value})`);
    }
    return degraded(source, details, parts.join(', then '));
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
// reports there. Claude reads "*" and an empty matcher as match-all; the other
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
// A registration whose script is missing fails every shell call, so only one whose file exists counts.
function registersAdvisory(tool, body, repoRoot) {
  const runtime = TOOL_HOOK_EVENTS[tool];
  if (!runtime) return { status: 'not-registered' };
  const parsed = JSON.parse(body);
  const section = tool === 'devin' ? parsed : parsed && parsed.hooks;
  const entries = section && Array.isArray(section[runtime.event]) ? section[runtime.event] : [];
  let missingToken = null;
  for (const entry of entries) {
    if (!entry || typeof entry !== 'object') continue;
    const commands = [
      entry.command,
      ...(Array.isArray(entry.hooks) ? entry.hooks.map((hook) => hook && hook.command) : []),
    ].filter((command) => typeof command === 'string');
    const matcher = entry.matcher;
    let coversShellTool = false;
    if (matcher === undefined || matcher === null || matcher === '' || (matcher === '*' && runtime.allowEmptyMatcher)) {
      coversShellTool = runtime.allowEmptyMatcher;
    } else if (typeof matcher === 'string') {
      try {
        const pattern = new RegExp(`^(?:${matcher})$`);
        coversShellTool = runtime.names.every((name) => pattern.test(name));
      } catch {
        continue;
      }
    }
    if (!coversShellTool) continue;
    for (const command of commands) {
      const match = command.match(/[^\s'"`;|&()<>]*git-preflight-advisory\.mjs/);
      if (!match) continue;
      const token = match[0].replace(/^\$(?:[A-Za-z_]\w*|\{[A-Za-z_]\w*(?::-[^}]*)?\})\//, '');
      const scriptPath = path.isAbsolute(token) ? token : path.resolve(repoRoot, token);
      if (fs.existsSync(scriptPath)) return { status: 'registered' };
      if (missingToken === null) missingToken = token;
    }
  }
  return missingToken === null
    ? { status: 'not-registered' }
    : { status: 'missing', token: missingToken };
}

function scanAdapterSource(source) {
  const code = source.split('');
  const regexKeywords = new Set('await case delete do else in instanceof new of return throw typeof void yield'.split(' '));
  const controlKeywords = new Set('catch for if switch while with'.split(' '));
  const regexPunctuators = new Set('([{},;:=!&|?+-*/%^~<>'.split(''));
  regexPunctuators.add('=>');
  const parens = [];
  let skipTemplate;
  const isWordStart = (c) => /[A-Za-z_$]/.test(c || '');
  const isWordPart = (c) => /[A-Za-z0-9_$]/.test(c || '');
  const regexCanStart = (token) => token === null || token === 'control-close'
    || regexKeywords.has(token) || regexPunctuators.has(token);
  const hide = (start, end, marker = ' ') => {
    for (let i = start; i < end; i += 1) code[i] = i === start ? marker : /[\r\n]/.test(source[i]) ? source[i] : ' ';
  };
  const skipQuote = (start, quote) => {
    let i = start + 1;
    while (i < source.length && source[i] !== quote) i += source[i] === '\\' ? 2 : 1;
    return Math.min(i + 1, source.length);
  };
  const skipRegex = (start) => {
    let i = start + 1;
    let inClass = false;
    while (i < source.length && !/[\r\n]/.test(source[i])) {
      if (source[i] === '\\') i += 2;
      else if (source[i] === '[') { inClass = true; i += 1; }
      else if (source[i] === ']') { inClass = false; i += 1; }
      else if (source[i] === '/' && !inClass) {
        i += 1;
        while (isWordPart(source[i])) i += 1;
        return i;
      } else i += 1;
    }
    return i;
  };
  const skipComment = (start) => {
    if (source[start + 1] === '/') {
      let i = start + 2;
      while (i < source.length && !/[\r\n]/.test(source[i])) i += 1;
      return i;
    }
    const end = source.indexOf('*/', start + 2);
    return end < 0 ? source.length : end + 2;
  };
  const scanCode = (start, interpolation = false) => {
    let i = start;
    let braces = 0;
    let previous = null;
    while (i < source.length) {
      const c = source[i];
      if (/\s/.test(c)) { i += 1; continue; }
      if (interpolation && c === '}' && braces === 0) return i + 1;
      if (c === '/' && (source[i + 1] === '/' || source[i + 1] === '*')) {
        const end = skipComment(i);
        hide(i, end);
        i = end;
        continue;
      }
      if (c === "'" || c === '"') {
        const end = skipQuote(i, c);
        const value = source.slice(i + 1, source[end - 1] === c ? end - 1 : end);
        if (!['tool.execute.before', 'tool_call'].includes(value)) hide(i, end, '\u0001');
        previous = 'literal';
        i = end;
        continue;
      }
      if (c === '`') {
        const end = skipTemplate(i);
        hide(i, end, '\u0001');
        previous = 'literal';
        i = end;
        continue;
      }
      if (c === '/' && regexCanStart(previous)) {
        const end = skipRegex(i);
        hide(i, end, '\u0002');
        previous = 'literal';
        i = end;
        continue;
      }
      if (isWordStart(c)) {
        const tokenStart = i++;
        while (isWordPart(source[i])) i += 1;
        previous = source.slice(tokenStart, i);
        continue;
      }
      if (/[0-9]/.test(c)) {
        i += 1;
        while (/[A-Za-z0-9_$.]/.test(source[i] || '')) i += 1;
        previous = 'literal';
        continue;
      }
      const token = ['===', '!==', '=>', '==', '!=', '&&', '||', '??']
        .find((operator) => source.startsWith(operator, i)) || c;
      i += token.length;
      if (interpolation && token === '{') braces += 1;
      else if (interpolation && token === '}') braces -= 1;
      if (token === '(') parens.push(controlKeywords.has(previous));
      previous = token === ')' && parens.pop() ? 'control-close' : token;
    }
    return i;
  };
  skipTemplate = (start) => {
    let i = start + 1;
    while (i < source.length) {
      if (source[i] === '\\') i += 2;
      else if (source[i] === '`') return i + 1;
      else if (source[i] === '$' && source[i + 1] === '{') i = scanCode(i + 2, true);
      else i += 1;
    }
    return i;
  };
  scanCode(0);
  return code.join('');
}

function matchingBrace(code, open) {
  let depth = 0;
  for (let i = open; i < code.length; i += 1) {
    if (code[i] === '{') depth += 1;
    else if (code[i] === '}' && --depth === 0) return i;
  }
  return -1;
}

function handlerIsNonLiteral(value) {
  const handler = value.trimStart();
  return handler !== '' && !/^(?:true|false|null|undefined)\b/.test(handler)
    && !/^(?:\u0001|\d|\[|\{|\-|\)|\}|\]|,|;)/.test(handler);
}

function openCodeObjectHasHandler(code, open, close) {
  let depth = 0;
  for (let i = open + 1; i < close; i += 1) {
    if (depth === 0 && (code.startsWith("'tool.execute.before'", i)
      || code.startsWith('"tool.execute.before"', i))) {
      const keyEnd = i + '"tool.execute.before"'.length;
      const tail = code.slice(keyEnd, close);
      if (/^\s*\(/.test(tail)) return true;
      const colon = tail.match(/^\s*:/);
      if (colon && handlerIsNonLiteral(tail.slice(colon[0].length))) return true;
    }
    if ('([{'.includes(code[i])) depth += 1;
    else if (')]}'.includes(code[i]) && depth > 0) depth -= 1;
  }
  return false;
}

function isTopLevelDeclarationStart(code, start) {
  const prefix = code.slice(0, start);
  const previous = prefix.trimEnd();
  if (previous === '') return true;
  const last = previous.at(-1);
  if (last === ';' || last === '}') return true;
  if (/\bexport$/.test(previous)) return true;
  if (!/[\r\n]/.test(prefix.slice(previous.length))) return false;
  return !/[=,:.?+\-*\/%&|^!<>()[\]]$/.test(previous);
}

function bindingInitializer(code, start) {
  const expression = code.slice(start);
  const functionExpression = expression.match(
    /^(?:async\s+)?function(?:\s+[A-Za-z_$][\w$]*)?\s*\(([^)]*)\)(?:\s*:\s*[A-Za-z_$][\w$]*(?:<[^>{};]+>)?)?\s*\{/,
  );
  if (functionExpression) {
    return {
      params: functionExpression[1],
      bodyOpen: start + functionExpression[0].lastIndexOf('{'),
    };
  }

  const arrow = expression.match(
    /^(?:async\s+)?\(([^)]*)\)(?:\s*:\s*[A-Za-z_$][\w$]*(?:<[^>{};]+>)?)?\s*=>\s*(\(\s*\{\s*|\{\s*)/,
  );
  if (arrow) {
    return {
      params: arrow[1],
      bodyOpen: start + arrow[0].lastIndexOf('{'),
      conciseObject: arrow[2].startsWith('('),
    };
  }

  const object = expression.match(/^\{\s*/);
  if (object) return { bodyOpen: start };
  return null;
}

function findTopLevelBindingDeclaration(code, identifier) {
  const escaped = identifier.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const returnType = String.raw`(?:\s*:\s*[A-Za-z_$][\w$]*(?:<[^>{};]+>)?)?`;
  const functionDeclaration = new RegExp(
    String.raw`^(?:async\s+)?function\s+${escaped}\s*\(([^)]*)\)${returnType}\s*\{`,
  );
  const variableDeclaration = new RegExp(
    String.raw`^(?:const|let|var)\s+${escaped}(?:\s*:\s*[A-Za-z_$][\w$]*(?:<[^>{};]+>)?)?\s*=\s*`,
  );
  let braces = 0;
  let parens = 0;
  let brackets = 0;

  for (let i = 0; i < code.length; i += 1) {
    if (braces === 0 && parens === 0 && brackets === 0) {
      const startsAtWord = i === 0 || !/[A-Za-z0-9_$]/.test(code[i - 1]);
      const functionStart = startsAtWord && (code.startsWith('function', i)
        || (code.startsWith('async', i) && /^async\s+function\b/.test(code.slice(i))));
      if (functionStart && isTopLevelDeclarationStart(code, i)) {
        const match = code.slice(i).match(functionDeclaration);
        if (match) {
          return {
            params: match[1],
            bodyOpen: i + match[0].lastIndexOf('{'),
          };
        }
      }

      const variableStart = startsAtWord && ['const', 'let', 'var'].find((keyword) => code.startsWith(keyword, i)
        && !/[A-Za-z0-9_$]/.test(code[i + keyword.length] || ''));
      if (variableStart) {
        const match = code.slice(i).match(variableDeclaration);
        if (match) {
          const declaration = bindingInitializer(code, i + match[0].length);
          if (declaration) return declaration;
        }
      }
    }

    if (code[i] === '{') braces += 1;
    else if (code[i] === '}' && braces > 0) braces -= 1;
    else if (code[i] === '(') parens += 1;
    else if (code[i] === ')' && parens > 0) parens -= 1;
    else if (code[i] === '[') brackets += 1;
    else if (code[i] === ']' && brackets > 0) brackets -= 1;
  }
  return null;
}

function adapterBodyRegistersHandler(tool, code, declaration) {
  const { bodyOpen, params, conciseObject = false, objectLiteral = false } = declaration;
  const bodyClose = matchingBrace(code, bodyOpen);
  if (bodyClose < 0) return false;

  if (tool === 'opencode') {
    if (conciseObject || objectLiteral) return openCodeObjectHasHandler(code, bodyOpen, bodyClose);
    let depth = 0;
    for (let i = bodyOpen + 1; i < bodyClose; i += 1) {
      if (depth === 0 && code.startsWith('return', i)
        && !/[A-Za-z0-9_$]/.test(code[i - 1] || '') && !/[A-Za-z0-9_$]/.test(code[i + 6] || '')) {
        const returned = code.slice(i + 6, bodyClose).match(/^\s*\{/);
        if (returned && !/[\r\n]/.test(returned[0])) {
          const open = i + 6 + returned[0].lastIndexOf('{');
          const close = matchingBrace(code, open);
          if (close > open && openCodeObjectHasHandler(code, open, close)) return true;
        }
      }
      if ('([{'.includes(code[i])) depth += 1;
      else if (')]}'.includes(code[i]) && depth > 0) depth -= 1;
    }
    return false;
  }
  if (objectLiteral) return false;
  const parameter = params.match(/^\s*(?:\.\.\.)?([A-Za-z_$][\w$]*)/)?.[1];
  if (!parameter) return false;
  const escaped = parameter.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const body = code.slice(bodyOpen + 1, bodyClose);
  const callPattern = new RegExp(
    String.raw`(?:^|[^\w$.])${escaped}\s*\.\s*on\s*\(\s*['"]tool_call['"]\s*,`,
  );
  const call = body.match(callPattern);
  return call !== null && handlerIsNonLiteral(body.slice(call.index + call[0].length));
}

function adapterExportsBinding(tool, source) {
  const code = scanAdapterSource(source);
  const functionPattern = new RegExp(
    String.raw`\bexport\s+default\s+(?:async\s+)?function(?:\s+[A-Za-z_$][\w$]*)?\s*\(([^)]*)\)`
      + String.raw`(?:\s*:\s*[A-Za-z_$][\w$]*(?:<[^>{};]+>)?)?\s*\{`,
  );
  const functionExport = code.match(functionPattern);
  const arrowExport = functionExport ? null
    : code.match(/\bexport\s+default\s+(?:async\s+)?\(([^)]*)\)\s*=>\s*(\(\s*\{\s*|\{\s*)/);
  if (functionExport || arrowExport) {
    const exported = functionExport || arrowExport;
    return adapterBodyRegistersHandler(tool, code, {
      params: exported[1],
      bodyOpen: exported.index + exported[0].lastIndexOf('{'),
      conciseObject: Boolean(arrowExport && arrowExport[2].startsWith('(')),
    });
  }

  // The dual-version bridge wraps the v1 entry, so the wrapped function is the
  // one that registers the handler. The scanner blanks the id literal, leaving
  // its opening quote as the \u0001 marker.
  const wrappedExport = tool === 'opencode'
    ? code.match(/\bexport\s+default\s+dualPlugin\s*\(\s*(?:\u0001|['"])[^,]*,\s*([A-Za-z_$][\w$]*)\s*\)[ \t]*(?=;|\r?$)/m)
    : null;
  const bindingExport = wrappedExport
    || code.match(/\bexport\s+default\s+([A-Za-z_$][\w$]*)[ \t]*(?=;|\r?$)/m);
  if (!bindingExport) return false;
  const declaration = findTopLevelBindingDeclaration(code, bindingExport[1]);
  return declaration !== null && adapterBodyRegistersHandler(tool, code, {
    ...declaration,
    objectLiteral: declaration.params === undefined,
  });
}

function checkAiToolHooks(ctx) {
  const explicit = typeof ctx.tool === 'string' && ctx.tool !== '';
  const active = explicit ? ctx.tool : process.env.CLAUDECODE ? 'claude' : null;
  const source = active === null
    ? 'seven adapter files, no active tool detected'
    : `seven adapter files, active ${active} via ${explicit ? '--tool' : 'CLAUDECODE'}`;
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
    if (tool === 'hermes') {
      const read = readRepoFile(path.join(ctx.repoRoot, rel));
      if (read.text === null) {
        details.push(`${label}: cannot read ${rel}: ${read.problem || 'missing'}`);
        broken.push(tool);
        continue;
      }
      // Hermes loads project plugins only, so this plugin file is its registration.
      // Read the path expression without executing the plugin.
      const code = read.text.replace(/(^|\s)#.*$/gm, '$1');
      const assignment = code.match(/\bGIT_PREFLIGHT_ADVISORY\s*=\s*REPO_ROOT((?:\s*\/\s*(?:'[^'\r\n]+'|"[^"\r\n]+"))+)(?=\s*(?:\r?\n|$))/);
      const segments = assignment
        ? Array.from(assignment[1].matchAll(/\/\s*(?:'([^'\r\n]+)'|"([^"\r\n]+)")/g), (match) => match[1] || match[2])
        : [];
      const advisoryPath = segments.length > 0 ? path.join(ctx.repoRoot, ...segments) : null;
      if (advisoryPath !== null && !fs.existsSync(advisoryPath)) {
        details.push(`${label}: ${rel} runs ${segments.join('/')}, which does not exist`);
        broken.push(tool);
      } else if (
        advisoryPath !== null
        && /_run_core\(\s*GIT_PREFLIGHT_ADVISORY\b/.test(code)
        && /register_hook\(\s*["']transform_tool_result["']/.test(code)
      ) {
        details.push(`${label}: registered (${rel})`);
      } else {
        details.push(`${label}: ${rel} does not register transform_tool_result with the git-preflight advisory`);
        broken.push(tool);
      }
      continue;
    }
    if (tool === 'opencode' || tool === 'pi') {
      const read = readRepoFile(path.join(ctx.repoRoot, rel));
      if (read.text === null) {
        details.push(`${label}: cannot read ${rel}: ${read.problem || 'missing'}`);
        broken.push(tool);
        continue;
      }
      // The default export must carry the handler; an unused object elsewhere cannot
      // make an adapter look registered. Scan source without executing the adapter.
      const code = read.text.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:\\])\/\/.*$/gm, '$1');
      // A registration whose script is missing fails every shell call, so only one whose file exists counts.
      const importMatch = code.match(/(?:\bfrom\s*|\bimport\s*\(\s*|\brequire\s*\(\s*)['"]([^'"]*git-rule-checks\.mjs)['"]/);
      const registered = importMatch !== null && adapterExportsBinding(tool, read.text);
      if (registered) {
        const specifier = importMatch[1];
        const adapterPath = path.join(ctx.repoRoot, rel);
        const importPath = path.resolve(path.dirname(adapterPath), specifier);
        if (fs.existsSync(importPath)) {
          details.push(`${label}: registered (${rel})`);
        } else {
          details.push(`${label}: ${rel} imports ${specifier}, which does not exist`);
          broken.push(tool);
        }
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
    let missing = null;
    for (const candidate of present) {
      const read = readRepoFile(path.join(ctx.repoRoot, candidate));
      if (read.text === null) {
        error = `${candidate}: ${read.problem || 'missing'}`;
        continue;
      }
      try {
        const registration = registersAdvisory(tool, read.text, ctx.repoRoot);
        if (registration.status === 'registered') {
          registeredIn = candidate;
          break;
        }
        if (registration.status === 'missing' && missing === null) {
          missing = { candidate, token: registration.token };
        }
      } catch (err) {
        // The parser quotes a file's first bytes, and an adapter may symlink outside the repository.
        error = `${candidate}: ${err instanceof SyntaxError ? 'not valid JSON' : err.message}`;
      }
    }
    if (registeredIn) {
      details.push(`${label}: registered (${registeredIn})`);
    } else if (missing) {
      details.push(`${label}: ${missing.candidate} runs ${missing.token}, which does not exist`);
      broken.push(tool);
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
      'no active AI tool detected: pass --tool <claude|codex|devin|cursor|opencode|pi|hermes>',
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
    details: verdict.details,
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
    for (const detail of limitDetails(row.details)) lines.push(`      ${detail}`);
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
      if (value === undefined || value === '') return { error: `missing value for ${arg}` };
      opts[arg.slice(2)] = value;
      i += 1;
      continue;
    }
    if (arg.startsWith('--repo=')) {
      opts.repo = arg.slice('--repo='.length);
      if (opts.repo === '') return { error: 'missing value for --repo' };
      continue;
    }
    if (arg.startsWith('--tool=')) {
      opts.tool = arg.slice('--tool='.length);
      if (opts.tool === '') return { error: 'missing value for --tool' };
      continue;
    }
    return { error: `unknown argument: ${arg}` };
  }
  if (opts.tool !== null && !TOOLS.includes(opts.tool)) return { error: `unknown tool: ${opts.tool}` };
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
  applySafeGitEnv();
  const opts = parseArgs(argv);
  if (opts.error) {
    process.stderr.write(`git-setup-check: ${opts.error}\n${USAGE}\n`);
    return 2;
  }
  // The repository root must be resolved before any other child process, so the
  // probe runs from the requested directory rather than from the root it is
  // about to return.
  const requested = opts.repo === null ? process.cwd() : path.resolve(opts.repo);
  const probe = runCommand(requested, GIT_BIN, ['-C', requested, 'rev-parse', '--show-toplevel']);
  const repoRoot = probe.status === 0 && probe.stdout.trim() !== '' ? path.resolve(probe.stdout.trim()) : '';
  if (repoRoot === '') {
    process.stderr.write(`git-setup-check: not inside a git work tree: ${requested}\n${USAGE}\n`);
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
