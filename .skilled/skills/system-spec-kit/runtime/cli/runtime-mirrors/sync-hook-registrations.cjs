#!/usr/bin/env node
'use strict';
// ───────────────────────────────────────────────────────────────────
// MODULE: Hook registration synchronizer
// ───────────────────────────────────────────────────────────────────
// Four runtimes register their lifecycle hooks through JSON, each in its own
// nesting, matcher dialect and wrapper convention, and each file used to be
// kept by hand. hook-registry.json names every hook once with its concern, its
// script and its per-runtime bindings; this script renders the four files from
// it. Pi registers through an entry file per extension under .pi/extensions;
// every entry is rendered from one template here, with only its own name and
// adapter path filled in, and write mode also turns an older one-line
// re-export entry into the template.
//
// Usage:
//   node sync-hook-registrations.cjs [--check] [--root <repo-root>]
// Exit: 0 in sync (or written), 1 drift or a Pi extension entry that differs
//       from the rendered template or names a missing adapter under --check,
//       2 usage or a registry the renderer cannot honour.

// ───────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ───────────────────────────────────────────────────────────────────
const fs = require('node:fs');
const path = require('node:path');
const { findRepoRoot } = require('@spec-kit/shared/workspace/repo-root.mjs');

// ───────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ───────────────────────────────────────────────────────────────────
const TAG = '[hook-registration-sync]';
const REGISTRY_PATH = path.join(__dirname, 'hook-registry.json');
const JSON_RUNTIMES = ['claude', 'codex', 'cursor', 'devin'];
// Codex rejects any `hookSpecificOutput` key it does not define and discards
// the whole response, which would swallow the very message the envelope exists
// to deliver. These runtimes carry the drift marker on stderr alone.
const ENVELOPE_REJECTS_UNKNOWN_KEYS = new Set(['codex']);
// Codex accepts `hookSpecificOutput` only on the events that take additional
// context; Stop and PreCompact reject it and discard the whole response, so
// their fallback carries the message as a plain `systemMessage` instead.
const SYSTEM_MESSAGE_EVENTS = new Set(['codex:Stop', 'codex:PreCompact']);
// A Pi extension entry has to be a plain file, because Pi 1.5.1 and later
// resolve a symlinked entry to the real adapter first while older Pi resolves
// the entry's imports from the entry's own folder. The entry imports its adapter
// inside an async factory, which Pi has awaited since 0.38.0, so a missing or
// stale adapter costs one session notice instead of a failed extension. The
// adapter path is the one value an entry carries; it is read back from either
// shape so write mode can move an older re-export entry onto the template.
const PI_REEXPORT_PATTERN = /^export \{ default \} from (['"])([^'"]+)\1;\r?\n?$/u;
const PI_LAZY_IMPORT_PATTERN = /\badapter = await import\((['"])([^'"\n]+)\1\);/u;

// ───────────────────────────────────────────────────────────────────
// 3. HELPERS
// ───────────────────────────────────────────────────────────────────
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

// ───────────────────────────────────────────────────────────────────
// 4. WRAPPER GRAMMAR
// ───────────────────────────────────────────────────────────────────

function fallbackEnvelope(runtime, event, message) {
  if (SYSTEM_MESSAGE_EVENTS.has(`${runtime}:${event}`)) return JSON.stringify({ systemMessage: message }).replace(/"/g, '\\"');
  const hookSpecificOutput = { hookEventName: event, additionalContext: message };
  if (!ENVELOPE_REJECTS_UNKNOWN_KEYS.has(runtime)) hookSpecificOutput.mkHookDrift = true;
  return JSON.stringify({ hookSpecificOutput }).replace(/"/g, '\\"');
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
      inner = `${base}${silence} || { printf "%s\\n" "mk-hook-drift host=${runtime} event=${binding.event} adapter=${adapter}" >&2; printf %s "${fallbackEnvelope(runtime, binding.event, message)}"; }`;
      break;
    default: throw new Error(`unknown fallback "${binding.fallback}" on ${runtime} ${binding.script}`);
  }
  // A runtime whose hooks may also be copied into its user-level settings names
  // the tree they need. The copy then exits quietly in a project without that
  // tree, and because the project file carries the same guard, the two strings
  // stay identical and the host still runs each hook once. The tree has to be
  // one only a Skilled checkout holds: a home folder can keep an unrelated
  // .skilled data directory, and a guard on that name alone lets every copied
  // hook run there and fail.
  const guard = runtimeConfig.requireTree ? `{ [ -e ${runtimeConfig.requireTree} ] || exit 0; } && ` : '';
  return `bash -c 'cd "\${${runtimeConfig.projectDirEnv}:-$PWD}" && ${guard}${inner}'`;
}

/** Cursor runs the command without a project-dir wrapper and answers with its own permission envelope. */
function renderCursorCommand(runtimeConfig, binding) {
  const base = invocation(binding);
  if (binding.fallback === 'none') return base;
  // Detached like the project-dir runtimes' background form, so a slow reconcile never holds up session start.
  if (binding.fallback === 'background') return `${base} >/dev/null 2>&1 &`;
  if (binding.fallback !== 'envelope') throw new Error(`cursor supports none, background or envelope fallbacks, got "${binding.fallback}" on ${binding.script}`);
  const adapter = path.posix.basename(binding.script);
  const message = binding.message ?? runtimeConfig.defaultMessage;
  const envelope = JSON.stringify({ permission: 'allow', agent_message: message, mkHookDrift: true });
  return `${base} || { printf "%s\\n" "mk-hook-drift host=cursor event=${binding.event} adapter=${adapter}" >&2; printf %s '${envelope}'; }`;
}

// ───────────────────────────────────────────────────────────────────
// 5. PER-RUNTIME SHAPES
// ───────────────────────────────────────────────────────────────────

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

// ───────────────────────────────────────────────────────────────────
// 6. PI VERIFICATION
// ───────────────────────────────────────────────────────────────────

/** The one Pi entry template, filled with the entry's file name and its adapter's relative path. */
function renderPiEntry(entry, adapterSpecifier) {
  return [
    '// ───────────────────────────────────────────────────────────────────',
    '// MODULE: Pi Hook Entry',
    '// ───────────────────────────────────────────────────────────────────',
    '// Rendered by sync-hook-registrations.cjs from its Pi entry template, which',
    '// --check holds every entry to byte for byte: change the template, then rerun it.',
    '// Pi loads every .ts file in this folder. The adapter is imported inside the',
    '// factory, so a Skilled tree that is missing or out of date turns this hook off',
    '// with one notice for the session instead of failing the extension at startup.',
    '',
    "import type { ExtensionAPI, ExtensionContext } from '@earendil-works/pi-coding-agent';",
    '',
    `const ENTRY = '${entry}';`,
    "const FAILURES = Symbol.for('skilled.pi.adapterImportFailures');",
    '',
    'type FailureRegistry = { [FAILURES]?: Map<string, string> };',
    '',
    '// Pi evaluates each entry in its own module scope, so the entries that fail in',
    '// one load pass collect into a map on globalThis. Each failing entry registers a',
    '// session_start handler, and the first one to run reports them all and clears',
    '// the map, so a load pass Pi discards cannot swallow the notice.',
    'function reportImportFailure(pi: ExtensionAPI, error: unknown): void {',
    '  const registry = globalThis as FailureRegistry;',
    '  const failures = registry[FAILURES] ?? new Map<string, string>();',
    '  registry[FAILURES] = failures;',
    "  failures.set(ENTRY, error instanceof Error ? error.message.split('\\n')[0] : String(error));",
    "  pi.on('session_start', (_event, ctx: ExtensionContext) => {",
    '    const pending = registry[FAILURES];',
    '    if (pending === undefined || pending.size === 0) return;',
    '    delete registry[FAILURES];',
    '    const [firstError] = pending.values();',
    '    const message = [',
    "      `Skilled: ${pending.size} Pi hook entr${pending.size === 1 ? 'y is' : 'ies are'} off for this session because the adapter did not load: ${[...pending.keys()].join(', ')}.`,",
    "      'The Skilled checkout this project uses may be out of date: run git pull in it, then /doctor:setup.',",
    '      `First error: ${firstError}`,',
    "    ].join('\\n');",
    "    if (ctx.hasUI) ctx.ui.notify(message, 'warning');",
    '    else process.stderr.write(`${message}\\n`);',
    '  });',
    '}',
    '',
    'export default async function piEntry(pi: ExtensionAPI): Promise<void> {',
    '  let adapter: { default: (api: ExtensionAPI) => unknown };',
    '  try {',
    `    adapter = await import('${adapterSpecifier}');`,
    '  } catch (error) {',
    '    reportImportFailure(pi, error);',
    '    return;',
    '  }',
    '  // Outside the try: an adapter that throws while it registers is a real bug,',
    "  // and Pi's own load error is the right report for it.",
    '  await adapter.default(pi);',
    '}',
    '',
  ].join('\n');
}

/** The adapter path an entry names, from the template or from an older one-line re-export. */
function piAdapterSpecifier(source) {
  const match = PI_LAZY_IMPORT_PATTERN.exec(source) ?? PI_REEXPORT_PATTERN.exec(source);
  return match === null ? null : match[2];
}

/**
 * Every Pi extension the registry names must be a plain file whose adapter
 * exists and whose content is the rendered template. Write mode rewrites an
 * entry that names a live adapter but has drifted from the template.
 */
function verifyPiExtensions(registry, repoRoot, options = { check: true }) {
  const directory = registry.runtimes.pi.extensionsDir;
  const dir = path.join(repoRoot, directory);
  const problems = [];
  let written = 0;
  const expected = new Set(registry.hooks.map((hook) => hook.pi?.extension).filter(Boolean));
  for (const extension of [...expected].sort()) {
    const entry = path.join(dir, extension);
    let stat;
    try { stat = fs.lstatSync(entry); } catch { problems.push(`${directory}/${extension}: missing`); continue; }
    if (stat.isSymbolicLink()) { problems.push(`${directory}/${extension}: a symlink, which Pi before 1.5.1 cannot load; make it a plain entry file`); continue; }
    const source = stat.isFile() ? fs.readFileSync(entry, 'utf8') : null;
    const specifier = source === null ? null : piAdapterSpecifier(source);
    if (specifier === null) { problems.push(`${directory}/${extension}: names no adapter import`); continue; }
    const target = path.resolve(dir, specifier);
    if (!fs.existsSync(target) || !fs.statSync(target).isFile()) { problems.push(`${directory}/${extension}: dangling -> ${path.relative(repoRoot, target)}`); continue; }
    const rendered = renderPiEntry(extension, specifier);
    if (source === rendered) continue;
    if (options.check) { problems.push(`${directory}/${extension}: differs from the Pi entry template`); continue; }
    fs.writeFileSync(entry, rendered, 'utf8');
    written += 1;
  }
  return { checked: expected.size, written, problems };
}

// ───────────────────────────────────────────────────────────────────
// 7. ENTRY
// ───────────────────────────────────────────────────────────────────

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

  const pi = verifyPiExtensions(registry, repoRoot, { check: options.check });
  drift.push(...pi.problems);

  if (drift.length > 0) {
    console.error(`${TAG} Drift detected:`);
    for (const item of drift) console.error(`${TAG} ${item}`);
    return 1;
  }
  const hookCount = registry.hooks.length;
  if (options.check) console.log(`${TAG} PASS: ${JSON_RUNTIMES.length} registration files match the ${hookCount}-hook registry; ${pi.checked} Pi extensions resolve.`);
  else console.log(`${TAG} Wrote ${written} of ${JSON_RUNTIMES.length} registration files from the ${hookCount}-hook registry and ${pi.written} of ${pi.checked} Pi extension entries; ${pi.checked} Pi extensions resolve.`);
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

// ───────────────────────────────────────────────────────────────────
// 8. EXPORTS
// ───────────────────────────────────────────────────────────────────
module.exports = { JSON_RUNTIMES, loadRegistry, renderRuntimeFile, renderProjectDirCommand, renderCursorCommand, renderPiEntry, piAdapterSpecifier, verifyPiExtensions, main };
