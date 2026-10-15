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
// Exit 0 when no check failed, 1 when one did, 2 on a usage error.

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

const PROVISION_REPAIR = 'bash .skilled/skills/sk-git/scripts/worktree-naming.sh provision .';
const HOOKS_REPAIR = 'bash .skilled/scripts/install-git-hooks.sh';
const RULES_REPAIR = 'fix the check name in .skilled/skills/sk-git/hard-rules.json';
const WORKTREE_REPAIR = 'git config speckit.worktreeBase <dir>';
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

// Advisory suppression first, then the two master switches that turn off the
// whole hook chain. Only the master switches fail the check; the advisory tier
// silences one hook, which the registration check above reports separately.
const SUPPRESSION_VARS = [
  'SKGIT_ADVISORY',
  'SKGIT_ADVISORY_SKIP',
  'SK_GIT_PREFLIGHT_DISABLED',
  'SYSTEM_HOOKS_DISABLED',
  'SYSTEM_GIT_COMMIT_HOOKS_DISABLED',
];
const MASTER_SWITCHES = ['SYSTEM_HOOKS_DISABLED', 'SYSTEM_GIT_COMMIT_HOOKS_DISABLED'];

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

// Every child process runs from the inspected repository root and takes an argv
// array, never a shell string, so a repository cannot influence a helper
// through the working directory or through shell expansion.
function runCommand(cwd, command, args) {
  const result = spawnSync(command, args, {
    cwd,
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
  return runCommand(repoRoot, 'git', [...GIT_FLAGS, '-C', repoRoot, ...args]);
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

// ─────────────────────────────────────────────────────────────────────────────
// 4. CHECKS
// ─────────────────────────────────────────────────────────────────────────────

const pass = (source, details = []) => ({ result: 'PASS', source, details, repair: null });
const fail = (source, details, repair) => ({ result: 'FAIL', source, details, repair });
const skip = (source, details = []) => ({ result: 'SKIP', source, details, repair: null });
const unknown = (source, details = []) => ({ result: 'UNKNOWN', source, details, repair: null });

// The toolchain files this battery itself needs: without any one of them the
// rest of the report would name helpers that do not exist, so install is the
// first check and its repair provisions the whole skill.
function checkInstall() {
  const source = 'skills/sk-git/SKILL.md + hard-rules.json + scripts/';
  const required = ['skills/sk-git/SKILL.md', 'skills/sk-git/hard-rules.json', 'skills/sk-git/scripts'];
  const missing = required.filter((relative) => !fs.existsSync(path.join(OWN_ROOT, relative)));
  if (missing.length > 0) return fail(source, missing.map(ownLabel), PROVISION_REPAIR);
  return pass(source);
}

// install-git-hooks.sh is not called: it resolves its source tree from the
// repository it runs in and then executes that repository's own
// validate-message.mjs, so a clone the operator does not trust could pick the
// code this battery runs; the hook links are read and compared in process instead.
// PASS only when every Git hook this checkout ships is installed in the inspected
// repository's hooks folder and resolves to this checkout's own script. A missing
// target and a foreign or shadowed target both surface as one detail line.
function checkHooks(ctx) {
  const source = 'git rev-parse --git-path hooks + hook links';
  const ownDir = path.join(OWN_ROOT, 'scripts', 'git-hooks');
  if (!fs.existsSync(ownDir)) return unknown(source, [ownLabel('scripts/git-hooks')]);
  const resolved = git(ctx.repoRoot, ['rev-parse', '--git-path', 'hooks']);
  if (resolved.status !== 0 || resolved.stdout.trim() === '') {
    return fail(source, [firstLine(resolved.stderr) || `git rev-parse --git-path hooks exited ${resolved.status}`], HOOKS_REPAIR);
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
    const ownReal = fs.realpathSync(path.join(ownDir, name));
    if (installedReal !== ownReal) details.push(`${name}: resolves to ${installedReal}, not this checkout`);
  }
  if (details.length > 0) return fail(source, details, HOOKS_REPAIR);
  return pass(source);
}

// The inspected repository runs its own hook scripts only when it is this
// checkout (shared git common dir) or its local config grants trust.
function commonDirFor(repoRoot, dir) {
  const result = runCommand(repoRoot, 'git', [...GIT_FLAGS, '-C', dir, 'rev-parse', '--git-common-dir']);
  if (result.status !== 0) return null;
  const value = result.stdout.trim();
  if (!value) return null;
  return path.resolve(dir, value);
}

function checkTrust(ctx) {
  const source = 'git config --local --get skilled.trustRepoHooks + git rev-parse --git-common-dir';
  const ownCommon = commonDirFor(ctx.repoRoot, OWN_ROOT);
  const repoCommon = commonDirFor(ctx.repoRoot, ctx.repoRoot);
  const configured = git(ctx.repoRoot, ['config', '--local', '--get', 'skilled.trustRepoHooks']);
  const value = configured.status === 0 ? configured.stdout.trim() : '';
  if (ownCommon && repoCommon && ownCommon === repoCommon) {
    return pass(source, [`own checkout: ${repoCommon}`]);
  }
  if (value.toLowerCase() === 'true') return pass(source, [`skilled.trustRepoHooks=${value}`]);
  return skip(source, ['untrusted: this clone\'s own hook scripts do not run']);
}

// Every saved gate key is judged by the registry's own reader, so a gate that
// is saved off at either scope is reported instead of assumed to be live.
function checkGates(ctx) {
  const source = 'git-hook-gates.cjs list --repo <repo> --json';
  const script = path.join(OWN_ROOT, 'commands', 'doctor', 'scripts', 'git-hook-gates.cjs');
  if (!fs.existsSync(script)) return unknown(source, [ownLabel('commands/doctor/scripts/git-hook-gates.cjs')]);
  const result = runCommand(ctx.repoRoot, process.execPath, [script, 'list', '--repo', ctx.repoRoot, '--json']);
  if (result.status !== 0) {
    return fail(source, [firstLine(result.stderr) || `git-hook-gates.cjs list exited ${result.status}`], GATES_REPAIR);
  }
  const report = parseJsonReport(result.stdout);
  if (!report) return fail(source, ['the gate report did not parse as JSON'], GATES_REPAIR);
  const gates = Array.isArray(report.gates) ? report.gates : [];
  const details = gates
    .filter((gate) => gate && gate.effective && gate.effective.state === 'off')
    .map((gate) => `${gate.key}: off (${gate.effective.from})`);
  return pass(source, details);
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
    if (err && err.name === 'ContractError') return fail(source, [err.message], CONTRACT_REPAIR);
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
    const result = runCommand(ctx.repoRoot, 'bash', [script, 'validate-remote-allowlist', branch]);
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
    const patterns = allowlistPatternsIn(file);
    details.push(`patterns (${repoLabel(ctx.repoRoot, file)}): ${patterns.length > 0 ? patterns.join(', ') : 'none'}`);
  } else {
    details.push('patterns: no allowlist file, so only the built-in main exception applies');
  }
  return pass(source, details);
}

// The matcher resolves the file from the inspected repository's working tree,
// named .skilled first and .opencode second. When the repository ships none,
// the battery's own copy is reported so the pattern list still names what the
// toolchain carries; its absolute path shows it is not the repository's file.
function allowlistFileFor(repoRoot) {
  const candidates = [
    path.join(repoRoot, '.skilled', 'skills', 'sk-git', 'scripts', 'remote-branch-allowlist.txt'),
    path.join(repoRoot, '.opencode', 'skills', 'sk-git', 'scripts', 'remote-branch-allowlist.txt'),
    path.join(OWN_ROOT, 'skills', 'sk-git', 'scripts', 'remote-branch-allowlist.txt'),
  ];
  return candidates.find((candidate) => fs.existsSync(candidate)) || null;
}

function allowlistPatternsIn(file) {
  const patterns = [];
  for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
    const trimmed = line.split('#')[0].trim();
    if (trimmed) patterns.push(trimmed);
  }
  return patterns;
}

// The worktree base resolves the same way the naming helper resolves it: env
// first, then git config, then the in-checkout default. A relative value lands
// against the repository root, and a leading ~ expands like the helper does.
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
  const dir = path.isAbsolute(raw) ? path.normalize(raw) : path.resolve(repoRoot, raw);
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

// PASS requires the base's nearest existing parent to be writable. Each
// provision entry is listed with its install and build state, including the
// entries provision skips for want of a package, so a relocated base and a
// stale provision list are visible before a new worktree needs them. These
// lines stay informational and never decide the verdict.
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
  const parent = nearestExistingDir(path.dirname(base.dir));
  if (!parent) return fail(source, ['the base has no existing parent folder', ...details], WORKTREE_REPAIR);
  try {
    fs.accessSync(parent, fs.constants.W_OK);
  } catch {
    return fail(source, [`base parent not writable: ${repoLabel(ctx.repoRoot, parent)}`, ...details], WORKTREE_REPAIR);
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
  const probe = runCommand(ctx.repoRoot, 'bash', [
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

// The environment is reported, never changed. Any of the five variables that is
// set is listed, and only the two master switches fail the check, because they
// turn off every hook in the chain rather than one advisory surface.
function checkSuppression() {
  const source = 'env SKGIT_ADVISORY, SKGIT_ADVISORY_SKIP, SK_GIT_PREFLIGHT_DISABLED, SYSTEM_*_DISABLED';
  const details = SUPPRESSION_VARS
    .filter((name) => process.env[name] !== undefined && process.env[name] !== '')
    .map((name) => `${name}=${process.env[name]}`);
  const off = MASTER_SWITCHES.filter((name) => isTruthy(process.env[name]));
  if (off.length > 0) return fail(source, details, `unset ${off.join(' ')}`);
  return pass(source, details);
}

// Only the runtime that is actually running the check is probed. Every other
// adapter is named with its file path so the operator can see what was not
// checked rather than reading silence as coverage.
function checkAiToolHooks(ctx) {
  const explicit = typeof ctx.tool === 'string' && ctx.tool !== '';
  const active = explicit ? ctx.tool : process.env.CLAUDECODE ? 'claude' : null;
  const source = active === null ? '--tool | CLAUDECODE' : explicit ? `--tool ${active}` : 'CLAUDECODE -> claude';
  const details = TOOLS
    .filter((tool) => tool !== active)
    .map((tool) => `${tool}: not checked (${TOOL_FILES[tool]})`);
  if (active === null) return skip(source, details);
  const file = path.join(ctx.repoRoot, TOOL_FILES[active]);
  if (!fs.existsSync(file)) {
    return fail(source, [`${active}: missing (${TOOL_FILES[active]})`, ...details], advisoryRepair(active));
  }
  if (active === 'opencode') return pass(source, details);
  let body;
  try {
    body = fs.readFileSync(file, 'utf8');
  } catch (err) {
    return unknown(source, [err.message, ...details]);
  }
  if (!body.includes('git-preflight-advisory')) {
    return fail(source, [`${active}: ${TOOL_FILES[active]} does not register git-preflight-advisory`, ...details], advisoryRepair(active));
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

function renderHuman(rows) {
  const lines = [];
  for (const row of rows) {
    lines.push(`${row.result.padEnd(9)}${row.id}`);
    lines.push(`      source: ${row.source}`);
    for (const detail of row.details) lines.push(`      ${detail}`);
    if (row.result === 'FAIL' && row.repair) lines.push(`      repair: ${row.repair}`);
  }
  const failed = rows.filter((row) => row.result === 'FAIL').length;
  const skipped = rows.filter((row) => row.result === 'SKIP').length;
  const unknownCount = rows.filter((row) => row.result === 'UNKNOWN').length;
  lines.push(failed === 0
    ? `STATUS=OK checks=${rows.length}`
    : `STATUS=FAIL failed=${failed} skipped=${skipped} unknown=${unknownCount}`);
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
 * @returns {Promise<number>} 0 when no check failed, 1 when one did, 2 on a usage error
 */
async function main(argv) {
  const opts = parseArgs(argv);
  if (opts === null) {
    process.stderr.write(`${USAGE}\n`);
    return 2;
  }
  // The repository root must be resolved before any other child process, so the
  // probe runs from the requested directory rather than from the root it is
  // about to return.
  const requested = opts.repo === null ? process.cwd() : path.resolve(opts.repo);
  const probe = runCommand(requested, 'git', [...GIT_FLAGS, '-C', requested, 'rev-parse', '--show-toplevel']);
  const repoRoot = probe.status === 0 && probe.stdout.trim() !== '' ? path.resolve(probe.stdout.trim()) : '';
  if (repoRoot === '') {
    process.stderr.write(`${USAGE}\n`);
    return 2;
  }
  const ctx = { repoRoot, tool: opts.tool };
  const rows = [];
  for (const check of CHECKS) rows.push(await runCheck(check, ctx));
  const failed = rows.some((row) => row.result === 'FAIL');
  if (opts.json) {
    process.stdout.write(`${JSON.stringify({ repo: repoRoot, checks: rows, status: failed ? 'FAIL' : 'OK' }, null, 2)}\n`);
    return failed ? 1 : 0;
  }
  process.stdout.write(`${renderHuman(rows).join('\n')}\n`);
  return failed ? 1 : 0;
}

module.exports = { main, CHECKS };

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
