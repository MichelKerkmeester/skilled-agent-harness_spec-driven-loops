#!/usr/bin/env node
'use strict';
// ───────────────────────────────────────────────────────────────────
// MODULE: Hook registration synchronizer
// ───────────────────────────────────────────────────────────────────
// Four runtimes register their lifecycle hooks through JSON, each in its own
// nesting, matcher dialect and wrapper convention, and each file used to be
// kept by hand. hook-registry.json names every hook once with its concern, its
// script and its per-runtime bindings; this script renders the four files from
// it. Pi registers by symlink under .pi/extensions, so for Pi the registry is
// verified against the directory instead of rendered.
//
// Usage:
//   node sync-hook-registrations.cjs [--check] [--root <repo-root>]
// Exit: 0 in sync (or written), 1 drift or a missing Pi symlink under --check,
//       2 usage or a registry the renderer cannot honour.

const fs = require('node:fs');
const path = require('node:path');
const { findRepoRoot } = require('@spec-kit/shared/workspace/repo-root.mjs');

const TAG = '[hook-registration-sync]';
const REGISTRY_PATH = path.join(__dirname, 'hook-registry.json');
const JSON_RUNTIMES = ['claude', 'codex', 'cursor', 'devin'];

function parseArgs(argv) {
  const options = { check: false, root: null };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--check') options.check = true;
    else if (arg === '--root') { options.root = argv[index + 1]; index += 1; }
    else throw new Error(`Usage: node sync-hook-registrations.cjs [--check] [--root <repo-root>] (unknown argument: ${arg})`);
  }
  if (options.root === undefined) throw new Error('--root requires a path');
  return options;
}

function loadRegistry(registryPath = REGISTRY_PATH) {
  return JSON.parse(fs.readFileSync(registryPath, 'utf8'));
}

// ── wrapper grammar ─────────────────────────────────────────────────

function driftEnvelope(event, message) {
  const json = JSON.stringify({ hookSpecificOutput: { hookEventName: event, additionalContext: message, mkHookDrift: true } });
  return json.replace(/"/g, '\\"');
}

/** The base invocation every wrapper shares: runner, script and arguments. */
function invocation(binding) {
  return `${binding.runner} ${binding.script}${binding.args ? ` ${binding.args}` : ''}`;
}

/**
 * The command a project-dir runtime (Claude, Codex, Devin) registers: cd into
 * the project, run the script, and on failure print a drift line to stderr and
 * a hook-shaped envelope to stdout so the host keeps going.
 */
function renderProjectDirCommand(runtime, runtimeConfig, binding) {
  const base = invocation(binding);
  const adapter = path.posix.basename(binding.script);
  const message = binding.message ?? runtimeConfig.defaultMessage;
  const silence = binding.silence ? ' >/dev/null 2>&1' : '';
  let inner;
  switch (binding.fallback) {
    case 'none': inner = `${base}${silence}`; break;
    case 'background': inner = `${base} >/dev/null 2>&1 &`; break;
    case 'echo': inner = `${base} >/dev/null 2>&1 || echo "${message}"`; break;
    case 'envelope':
      inner = `${base}${silence} || { printf "%s\\n" "mk-hook-drift host=${runtime} event=${binding.event} adapter=${adapter}" >&2; printf %s "${driftEnvelope(binding.event, message)}"; }`;
      break;
    default: throw new Error(`unknown fallback "${binding.fallback}" on ${runtime} ${binding.script}`);
  }
  return `bash -c 'cd "\${${runtimeConfig.projectDirEnv}:-$PWD}" && ${inner}'`;
}

/** Cursor runs the command without a project-dir wrapper and answers with its own permission envelope. */
function renderCursorCommand(runtimeConfig, binding) {
  const base = invocation(binding);
  if (binding.fallback === 'none') return base;
  if (binding.fallback !== 'envelope') throw new Error(`cursor supports none or envelope fallbacks, got "${binding.fallback}" on ${binding.script}`);
  const adapter = path.posix.basename(binding.script);
  const message = binding.message ?? runtimeConfig.defaultMessage;
  const envelope = JSON.stringify({ permission: 'allow', agent_message: message, mkHookDrift: true });
  return `${base} || { printf "%s\\n" "mk-hook-drift host=cursor event=${binding.event} adapter=${adapter}" >&2; printf %s '${envelope}'; }`;
}

// ── per-runtime shapes ──────────────────────────────────────────────

/** Bindings of one runtime, ordered by the runtime's event order, then group, then slot. */
function bindingsFor(registry, runtime) {
  const order = registry.runtimes[runtime].eventOrder;
  const rows = [];
  for (const hook of registry.hooks) {
    for (const binding of hook.bindings[runtime] ?? []) rows.push({ hook, binding });
  }
  rows.sort((a, b) => {
    const byEvent = order.indexOf(a.binding.event) - order.indexOf(b.binding.event);
    if (byEvent !== 0) return byEvent;
    if (a.binding.group !== b.binding.group) return a.binding.group - b.binding.group;
    return a.binding.slot - b.binding.slot;
  });
  return rows;
}

/** Rows grouped as the runtime's file groups them: by event, then by group index. */
function groupedBindings(registry, runtime) {
  const events = new Map();
  for (const row of bindingsFor(registry, runtime)) {
    const groups = events.get(row.binding.event) ?? new Map();
    const group = groups.get(row.binding.group) ?? [];
    group.push(row);
    groups.set(row.binding.group, group);
    events.set(row.binding.event, groups);
  }
  return events;
}

function groupMatcher(rows, runtime) {
  const matchers = new Set(rows.map((row) => row.binding.matcher ?? null));
  if (matchers.size !== 1) throw new Error(`${runtime} ${rows[0].binding.event} group ${rows[0].binding.group} mixes matchers: ${[...matchers].join(', ')}`);
  return rows[0].binding.matcher ?? null;
}

function renderNestedEvents(registry, runtime, renderHook) {
  const config = registry.runtimes[runtime];
  const out = {};
  for (const [event, groups] of groupedBindings(registry, runtime)) {
    out[event] = [...groups.values()].map((rows) => {
      const matcher = groupMatcher(rows, runtime);
      const entry = {};
      if (matcher !== null) entry.matcher = matcher;
      entry.hooks = rows.map(({ binding }) => {
        const hook = { type: 'command', command: renderHook(config, binding), timeout: binding.timeout };
        if (binding.async) hook.async = true;
        return hook;
      });
      return entry;
    });
  }
  return out;
}

/** `.claude/settings.json` keeps every other key; only `hooks` is rendered. */
function renderClaude(registry, current) {
  const settings = current ? JSON.parse(current) : {};
  settings.hooks = renderNestedEvents(registry, 'claude', (config, binding) => renderProjectDirCommand('claude', config, binding));
  return settings;
}

function renderCodex(registry) {
  return { hooks: renderNestedEvents(registry, 'codex', (config, binding) => renderProjectDirCommand('codex', config, binding)) };
}

function renderDevin(registry) {
  return renderNestedEvents(registry, 'devin', (config, binding) => renderProjectDirCommand('devin', config, binding));
}

/** Cursor's file is a flat array per event, each entry carrying its own optional matcher. */
function renderCursor(registry) {
  const config = registry.runtimes.cursor;
  const hooks = {};
  for (const [event, groups] of groupedBindings(registry, 'cursor')) {
    hooks[event] = [...groups.values()].flat().map(({ binding }) => {
      const entry = { command: renderCursorCommand(config, binding), type: 'command' };
      if (binding.matcher !== null && binding.matcher !== undefined) entry.matcher = binding.matcher;
      entry.timeout = binding.timeout;
      return entry;
    });
  }
  return { version: 1, hooks };
}

function serialize(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

/** The expected content of one runtime's registration file. */
function renderRuntimeFile(registry, runtime, current) {
  switch (runtime) {
    case 'claude': return serialize(renderClaude(registry, current));
    case 'codex': return serialize(renderCodex(registry));
    case 'cursor': return serialize(renderCursor(registry));
    case 'devin': return serialize(renderDevin(registry));
    default: throw new Error(`no renderer for runtime ${runtime}`);
  }
}

// ── Pi verification ─────────────────────────────────────────────────

/** Every Pi extension the registry names must be a symlink that resolves to a file. */
function verifyPiExtensions(registry, repoRoot) {
  const dir = path.join(repoRoot, registry.runtimes.pi.extensionsDir);
  const problems = [];
  const expected = new Set(registry.hooks.map((hook) => hook.pi?.extension).filter(Boolean));
  for (const extension of [...expected].sort()) {
    const link = path.join(dir, extension);
    let stat;
    try { stat = fs.lstatSync(link); } catch { problems.push(`${registry.runtimes.pi.extensionsDir}/${extension}: missing`); continue; }
    if (!stat.isSymbolicLink()) { problems.push(`${registry.runtimes.pi.extensionsDir}/${extension}: not a symlink`); continue; }
    const target = path.resolve(dir, fs.readlinkSync(link));
    if (!fs.existsSync(target) || !fs.statSync(target).isFile()) problems.push(`${registry.runtimes.pi.extensionsDir}/${extension}: dangling -> ${path.relative(repoRoot, target)}`);
  }
  return { checked: expected.size, problems };
}

// ── entry ───────────────────────────────────────────────────────────

function main(argv) {
  const options = parseArgs(argv);
  const repoRoot = options.root ? path.resolve(options.root) : findRepoRoot(__dirname);
  const registry = loadRegistry();

  const drift = [];
  let written = 0;
  for (const runtime of JSON_RUNTIMES) {
    const relative = registry.runtimes[runtime].file;
    const target = path.join(repoRoot, relative);
    const current = fs.existsSync(target) ? fs.readFileSync(target, 'utf8') : null;
    if (runtime === 'claude' && current === null) { drift.push(`${relative}: missing (the settings file is never created from the registry)`); continue; }
    const expected = renderRuntimeFile(registry, runtime, current);
    if (current === expected) continue;
    if (options.check) { drift.push(`${relative}: ${current === null ? 'missing' : 'differs from the registry'}`); continue; }
    fs.writeFileSync(target, expected, 'utf8');
    written += 1;
  }

  const pi = verifyPiExtensions(registry, repoRoot);
  drift.push(...pi.problems);

  if (drift.length > 0) {
    console.error(`${TAG} Drift detected:`);
    for (const item of drift) console.error(`${TAG} ${item}`);
    return 1;
  }
  const hookCount = registry.hooks.length;
  if (options.check) console.log(`${TAG} PASS: ${JSON_RUNTIMES.length} registration files match the ${hookCount}-hook registry; ${pi.checked} Pi extensions resolve.`);
  else console.log(`${TAG} Wrote ${written} of ${JSON_RUNTIMES.length} registration files from the ${hookCount}-hook registry; ${pi.checked} Pi extensions resolve.`);
  return 0;
}

if (require.main === module) {
  try {
    process.exitCode = main(process.argv.slice(2));
  } catch (error) {
    console.error(`${TAG} ERROR: ${error.message}`);
    process.exitCode = 2;
  }
}

module.exports = { JSON_RUNTIMES, loadRegistry, renderRuntimeFile, renderProjectDirCommand, renderCursorCommand, verifyPiExtensions, main };
