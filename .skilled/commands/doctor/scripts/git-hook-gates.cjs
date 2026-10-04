#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Git Hook Gate Settings
// ───────────────────────────────────────────────────────────────────
'use strict';

// Lists and changes the persistent on/off setting of each shipped git hook gate.
//
// WHY THIS EXISTS: every optional gate in the pre-commit, prepare-commit-msg and
// pre-push hooks has a SPECKIT_SKIP_* variable, but a variable lasts one command.
// An operator who never wants a gate had to export it in every shell. The hooks
// now read `speckit.hooks.<key>` from local or global git config through
// lib/gate-config.sh, and this script is the guided way to see and change those
// keys. gates.tsv beside that helper is the one list of gates; this script reads
// it rather than keeping its own, so a new gate appears here when it is registered.
//
// Two kinds of switch are deliberately not settable here. The per-push approvals
// (SPECKIT_ALLOW_REMOTE_PUSH, SPECKIT_ALLOW_MASS_DELETION) are marked
// non-persistable in the registry, because a saved approval would approve every
// later push. The commit-msg hook has no switch at all: its rules live in the sk-git
// templates, and changing them is git-standards.cjs's job.
//
// Dry-run by default: `set` prints the git config commands it would run and the
// resulting effective value, and changes nothing without --apply.
//
// Usage:
//   git-hook-gates.cjs list [--repo <dir>] [--json]
//   git-hook-gates.cjs set <key> on|off [--scope local|global] [--repo <dir>] [--apply] [--json]
//
// Exit 0 on success, 2 on a refused or invalid request (unknown key, a
// non-persistable gate, bad arguments, a missing registry), always with a STATUS= line.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync, spawnSync } = require('node:child_process');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const DEFAULT_REGISTRY = path.resolve(__dirname, '../../../scripts/git-hooks/lib/gates.tsv');
const KEY_PREFIX = 'speckit.hooks.';
const OFF_VALUES = new Set(['off', 'false', 'no', '0']);
const SCOPES = new Set(['local', 'global']);

class RefusedError extends Error {}

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function parseArgs(argv) {
  const opts = { positional: [], scope: 'local', apply: false, json: false, repo: null };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--apply') opts.apply = true;
    else if (arg === '--json') opts.json = true;
    else if (arg === '--scope' || arg === '--repo') {
      const value = argv[i + 1];
      if (value === undefined) throw new RefusedError(`${arg} needs a value`);
      opts[arg.slice(2)] = value;
      i += 1;
    } else if (arg.startsWith('--')) throw new RefusedError(`unknown flag: ${arg}`);
    else opts.positional.push(arg);
  }
  if (!SCOPES.has(opts.scope)) throw new RefusedError(`--scope must be local or global, not ${opts.scope}`);
  return opts;
}

function readRegistry(file) {
  if (!fs.existsSync(file)) throw new RefusedError(`gate registry not found: ${file}`);
  return fs.readFileSync(file, 'utf8').split('\n')
    .filter((line) => line.trim() && !line.startsWith('#'))
    .map((line) => {
      const [hook, key, env, persistable, description] = line.split('\t');
      return { hook, key, env, persistable: persistable === 'yes', description: description || '' };
    });
}

function repoRoot(dir) {
  try {
    return execFileSync('git', ['-C', dir, 'rev-parse', '--show-toplevel'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    throw new RefusedError(`not inside a git repository: ${dir}`);
  }
}

// Every stored value of one key, by scope. Command-line config is dropped because the
// hooks drop it: a `git -c` value never decides a gate, so showing it would mislead.
function storedValues(root, key) {
  const result = spawnSync('git', ['-C', root, 'config', '--show-scope', '--get-all', `${KEY_PREFIX}${key}`], { encoding: 'utf8' });
  const values = [];
  for (const line of (result.stdout || '').split('\n')) {
    if (!line) continue;
    const tab = line.indexOf('\t');
    const scope = line.slice(0, tab);
    if (scope === 'command') continue;
    values.push({ scope, value: line.slice(tab + 1) });
  }
  return values;
}

function effective(values) {
  const last = values[values.length - 1];
  if (!last) return { state: 'on', from: 'default' };
  return { state: OFF_VALUES.has(last.value.toLowerCase()) ? 'off' : 'on', from: `${last.scope} config` };
}

function valueAt(values, scope) {
  const hits = values.filter((v) => v.scope === scope);
  return hits.length ? hits[hits.length - 1].value : null;
}

function describe(root, gate) {
  const values = storedValues(root, gate.key);
  return {
    key: gate.key,
    hook: gate.hook,
    env: gate.env,
    persistable: gate.persistable,
    description: gate.description,
    local: valueAt(values, 'local'),
    global: valueAt(values, 'global'),
    effective: gate.persistable ? effective(values) : { state: 'on', from: 'not persistable' },
    envSet: process.env[gate.env] === '1',
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. MODES
// ─────────────────────────────────────────────────────────────────────────────

function list(registry, root, opts) {
  const rows = registry.map((gate) => describe(root, gate));
  if (opts.json) {
    process.stdout.write(`${JSON.stringify({ repo: root, gates: rows }, null, 2)}\n`);
  } else {
    process.stdout.write(`Gate settings for ${root}\n\n`);
    process.stdout.write('| Key | Hook | Local | Global | Effective | Bypass variable | What it does |\n|-----|------|-------|--------|-----------|-----------------|--------------|\n');
    for (const r of rows) {
      const eff = r.persistable ? `${r.effective.state} (${r.effective.from})` : 'per push only';
      const env = r.envSet ? `${r.env} (set in this shell)` : r.env;
      process.stdout.write(`| ${r.key} | ${r.hook} | ${r.local ?? '-'} | ${r.global ?? '-'} | ${eff} | ${env} | ${r.description} |\n`);
    }
  }
  const off = rows.filter((r) => r.persistable && r.effective.state === 'off').length;
  process.stdout.write(`STATUS=OK GATES=${rows.length} OFF=${off}\n`);
  return 0;
}

function set(registry, root, opts) {
  const [, key, state] = opts.positional;
  if (!key || !state) throw new RefusedError('usage: set <key> on|off [--scope local|global] [--apply]');
  const gate = registry.find((g) => g.key === key);
  if (!gate) throw new RefusedError(`unknown gate key: ${key}. Run list to see the keys.`);
  if (!gate.persistable) {
    throw new RefusedError(`${key} cannot be saved: ${gate.env} approves one push at a time, so set it on that one command only.`);
  }
  if (state !== 'on' && state !== 'off') throw new RefusedError(`state must be on or off, not ${state}`);

  const values = storedValues(root, key);
  const scopeFlag = `--${opts.scope}`;
  const name = `${KEY_PREFIX}${key}`;
  const commands = [];
  if (state === 'off') {
    commands.push(['config', scopeFlag, '--replace-all', name, 'off']);
  } else if (opts.scope === 'local' && valueAt(values, 'global') !== null && effective(values.filter((v) => v.scope !== 'local')).state === 'off') {
    // A local unset would let the global off decide, so a local on is written explicitly.
    commands.push(['config', '--local', '--replace-all', name, 'on']);
  } else if (valueAt(values, opts.scope) !== null) {
    commands.push(['config', scopeFlag, '--unset-all', name]);
  }

  const before = effective(values);
  if (opts.apply) {
    for (const args of commands) execFileSync('git', ['-C', root, ...args], { stdio: ['ignore', 'pipe', 'pipe'] });
  }
  const after = opts.apply ? effective(storedValues(root, key)) : null;
  const shown = commands.map((args) => `git ${args.join(' ')}`);
  const note = state === 'on' && opts.scope === 'global' && valueAt(values, 'local') !== null
    && OFF_VALUES.has(String(valueAt(values, 'local')).toLowerCase())
    ? 'local config still switches this gate off in this repository'
    : null;

  if (opts.json) {
    process.stdout.write(`${JSON.stringify({ repo: root, key, hook: gate.hook, env: gate.env, scope: opts.scope, requested: state, applied: opts.apply, commands: shown, before, after, note }, null, 2)}\n`);
  } else {
    process.stdout.write(`Gate ${key} (${gate.hook}): ${before.state} (${before.from}) -> requested ${state} in ${opts.scope} config\n`);
    if (shown.length === 0) process.stdout.write('Nothing to change: no stored value to remove at that scope.\n');
    for (const cmd of shown) process.stdout.write(`${opts.apply ? 'Ran' : 'Would run'}: ${cmd}\n`);
    if (after) process.stdout.write(`Now: ${after.state} (${after.from})\n`);
    if (note) process.stdout.write(`Note: ${note}\n`);
    if (!opts.apply && shown.length) process.stdout.write('Dry run: nothing changed. Add --apply to write.\n');
  }
  process.stdout.write(`STATUS=OK MODE=${opts.apply ? 'APPLIED' : 'DRY_RUN'} KEY=${key}\n`);
  return 0;
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. MAIN
// ─────────────────────────────────────────────────────────────────────────────

function main(argv) {
  try {
    const opts = parseArgs(argv);
    const registry = readRegistry(process.env.GATE_REGISTRY || DEFAULT_REGISTRY);
    const root = repoRoot(opts.repo || process.cwd());
    const mode = opts.positional[0];
    if (mode === 'list') return list(registry, root, opts);
    if (mode === 'set') return set(registry, root, opts);
    throw new RefusedError('usage: git-hook-gates.cjs list|set ... (see the header)');
  } catch (err) {
    const message = err instanceof RefusedError ? err.message : `unexpected: ${err.message}`;
    process.stderr.write(`git-hook-gates: ${message}\n`);
    process.stdout.write(`STATUS=FAIL ERROR="${message.replace(/"/g, "'")}"\n`);
    return 2;
  }
}

if (require.main === module) process.exitCode = main(process.argv.slice(2));

module.exports = { main, readRegistry, effective };
