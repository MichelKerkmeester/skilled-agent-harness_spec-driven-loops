#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Git Standards Override
// ───────────────────────────────────────────────────────────────────
'use strict';

// Shows and changes the commit-message, PR-description and branch-name rules a
// repository enforces, without touching the sk-git skill that ships them.
//
// WHY THIS EXISTS: the rules are the "Enforced rules" JSON block in each sk-git
// template, and message-contract.mjs reads them from git config skgit.contractDir,
// then from .sk-git/ at the repository root, then from the shipped sk-git assets.
// That lookup already lets a repository own its rules, but nothing helped anyone
// use it: editing the shipped assets is lost on the next update, and a hand-edited
// block that breaks its shape blocks every commit. This script copies the shipped
// templates into .sk-git/ once, then edits only those copies, refusing any change
// the contract validator would reject.
//
// The shipped assets are never written. While they are the active rules, every
// change is refused with a pointer to `init`.
//
// Dry-run by default: `init`, `set` and `disable` print what they would write and
// change nothing without --apply.
//
// Usage:
//   git-standards.cjs status  [--repo <dir>] [--json]
//   git-standards.cjs init    [--repo <dir>] [--apply] [--json]
//   git-standards.cjs set     <commit|pr|branch> <dotted.path> <json-value> [--repo <dir>] [--apply] [--json]
//   git-standards.cjs disable <commit|pr|branch> [--repo <dir>] [--apply] [--json]
//   git-standards.cjs check   [--repo <dir>] [--json]
//
// `set` takes the new value as JSON (`100`, `false`, `'["feat","fix"]'`); the value
// `null` removes the key, which switches off the rule that key enables.
//
// Exit 0 on success or a clean check, 1 when `check` finds drift between a
// template's prose and its rules block, 2 on a refused or invalid request or a
// broken contract, always with a STATUS= line.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const CONTRACT_MODULE = path.resolve(__dirname, '../../../skills/sk-git/scripts/lib/message-contract.mjs');
const SHIPPED_DIR = path.resolve(__dirname, '../../../skills/sk-git/assets');
const OVERRIDE_DIR = '.sk-git';
const RULES_HEADING = /^(#{1,6})\s+.*\bEnforced rules\b/i;
const HEADING = /^(#{1,6})\s/;
const KINDS = ['commit', 'pr', 'branch'];

// The shipped blocks keep short objects and word lists on one line. Their style is
// reproduced only when it reproduces the original block exactly; otherwise the block
// is written in plain two-space JSON, so an unusual layout is never half-matched.
const INLINE_WIDTH = 115;
const INLINE_ITEM_MAX = 40;

class RefusedError extends Error {}

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function parseArgs(argv) {
  const opts = { positional: [], apply: false, json: false, repo: null };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--apply') opts.apply = true;
    else if (arg === '--json') opts.json = true;
    else if (arg === '--repo') {
      if (argv[i + 1] === undefined) throw new RefusedError('--repo needs a value');
      opts.repo = argv[i + 1];
      i += 1;
    } else if (arg.startsWith('--')) throw new RefusedError(`unknown flag: ${arg}`);
    else opts.positional.push(arg);
  }
  return opts;
}

function repoRoot(dir) {
  try {
    return execFileSync('git', ['-C', dir, 'rev-parse', '--show-toplevel'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    throw new RefusedError(`not inside a git repository: ${dir}`);
  }
}

function kindArg(value) {
  if (!KINDS.includes(value)) throw new RefusedError(`kind must be one of ${KINDS.join(', ')}, not ${value ?? 'nothing'}`);
  return value;
}

// Locates the rules block: the heading line, the ```json fence and its closing fence.
function blockSpan(lines) {
  const heading = lines.findIndex((line) => RULES_HEADING.test(line));
  if (heading === -1) return null;
  const open = lines.findIndex((line, i) => i > heading && /^```json\s*$/.test(line.trim()));
  const close = open === -1 ? -1 : lines.findIndex((line, i) => i > open && /^```\s*$/.test(line.trim()));
  return { heading, open, close };
}

const isScalar = (v) => v === null || typeof v !== 'object';

function styled(value, depth, keyPrefix) {
  if (isScalar(value)) return JSON.stringify(value);
  const pad = '  '.repeat(depth + 1);
  const close = '  '.repeat(depth);
  if (Array.isArray(value)) {
    if (value.length === 0) return '[]';
    if (value.every(isScalar)) {
      const inline = `[${value.map((v) => JSON.stringify(v)).join(', ')}]`;
      const fits = close.length + keyPrefix.length + inline.length + 1 <= INLINE_WIDTH;
      if (fits || value.every((v) => JSON.stringify(v).length <= INLINE_ITEM_MAX)) return inline;
    }
    return `[\n${value.map((v) => pad + styled(v, depth + 1, '')).join(',\n')}\n${close}]`;
  }
  const entries = Object.entries(value);
  if (entries.length === 0) return '{}';
  if (entries.every(([, v]) => isScalar(v))) {
    const inline = `{ ${entries.map(([k, v]) => `${JSON.stringify(k)}: ${JSON.stringify(v)}`).join(', ')} }`;
    if (close.length + keyPrefix.length + inline.length + 1 <= INLINE_WIDTH) return inline;
  }
  return `{\n${entries.map(([k, v]) => {
    const prefix = `${JSON.stringify(k)}: `;
    return pad + prefix + styled(v, depth + 1, prefix);
  }).join(',\n')}\n${close}}`;
}

function serialize(contract, originalText) {
  const original = JSON.parse(originalText);
  if (styled(original, 0, '') === originalText) return { text: styled(contract, 0, ''), reformatted: false };
  return { text: JSON.stringify(contract, null, 2), reformatted: true };
}

function setPath(object, dotted, value) {
  const parts = dotted.split('.');
  if (parts.some((p) => !p)) throw new RefusedError(`not a dotted path: ${dotted}`);
  let node = object;
  for (const part of parts.slice(0, -1)) {
    if (node[part] === undefined && value !== null) node[part] = {};
    if (node[part] === undefined) return undefined;
    if (isScalar(node[part]) || Array.isArray(node[part])) throw new RefusedError(`${dotted}: ${part} is not an object`);
    node = node[part];
  }
  const last = parts[parts.length - 1];
  const before = node[last];
  if (value === null) delete node[last];
  else node[last] = value;
  return before;
}

function writeFile(file, text) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, text);
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. CONTEXT
// ─────────────────────────────────────────────────────────────────────────────

async function context(opts) {
  const mc = await import(CONTRACT_MODULE);
  const root = repoRoot(opts.repo || process.cwd());
  let resolved;
  try {
    resolved = mc.resolveContractDir(root);
  } catch (err) {
    throw new RefusedError(err.message);
  }
  const overrideDir = path.join(root, OVERRIDE_DIR);
  const shipped = Boolean(resolved) && !resolved.source.startsWith('git config') && resolved.dir !== overrideDir;
  return { mc, root, resolved, overrideDir, shipped };
}

// The directory a change may write: the configured contract dir or .sk-git/, never the
// shipped assets.
function editableDir(ctx) {
  if (!ctx.resolved) throw new RefusedError('this repository has no contract directory. Run init first to create .sk-git/.');
  if (ctx.shipped) {
    throw new RefusedError(`the active rules are the shipped sk-git templates (${ctx.resolved.source}), which this command never edits. Run init to copy them into ${OVERRIDE_DIR}/ first.`);
  }
  return ctx.resolved.dir;
}

function kindReport(ctx, dir, kind) {
  const file = path.join(dir, ctx.mc.TEMPLATE_FILES[kind]);
  if (!fs.existsSync(file)) return { kind, file, state: 'not enforced', reason: 'no template file', ruleIds: [], drift: [] };
  const markdown = fs.readFileSync(file, 'utf8');
  let contract;
  try {
    contract = ctx.mc.extractContract(markdown, file);
  } catch (err) {
    return { kind, file, state: 'broken', reason: err.message, ruleIds: [], drift: [] };
  }
  if (!contract) return { kind, file, state: 'not enforced', reason: 'no "Enforced rules" block', ruleIds: [], drift: [] };
  const shape = ctx.mc.contractShapeErrors(contract, kind);
  if (shape.length) return { kind, file, state: 'broken', reason: shape.join('; '), ruleIds: [], drift: [] };
  return { kind, file, state: 'enforced', reason: null, ruleIds: ctx.mc.ruleIdsFor(kind, contract), drift: ctx.mc.templateDriftErrors(markdown, kind, file) };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. MODES
// ─────────────────────────────────────────────────────────────────────────────

function emit(opts, payload, lines, status) {
  if (opts.json) process.stdout.write(`${JSON.stringify(payload, null, 2)}\n`);
  else process.stdout.write(lines.map((l) => `${l}\n`).join(''));
  process.stdout.write(`${status}\n`);
}

function status(ctx, opts) {
  const kinds = ctx.resolved ? KINDS.map((kind) => kindReport(ctx, ctx.resolved.dir, kind)) : [];
  const source = ctx.resolved ? ctx.resolved.source : null;
  const lines = [`Repository: ${ctx.root}`];
  if (!ctx.resolved) lines.push('Rules: none. This repository enforces no commit, PR or branch rules.');
  else {
    lines.push(`Rules: ${ctx.resolved.dir} (${source})`);
    lines.push(ctx.shipped ? `Editable: no, these are the shipped sk-git templates. Run init to copy them into ${OVERRIDE_DIR}/.` : 'Editable: yes, through set and disable.');
    for (const k of kinds) {
      lines.push(`  ${k.kind.padEnd(7)} ${k.state}${k.reason ? ` (${k.reason})` : ''}${k.ruleIds.length ? `: ${k.ruleIds.join(', ')}` : ''}`);
      for (const d of k.drift) lines.push(`          drift: ${d}`);
    }
  }
  emit(opts, { repo: ctx.root, contractDir: ctx.resolved?.dir ?? null, source, editable: Boolean(ctx.resolved) && !ctx.shipped, kinds }, lines,
    `STATUS=OK SOURCE="${source ?? 'none'}"`);
  return 0;
}

function init(ctx, opts) {
  const configured = ctx.resolved && ctx.resolved.source.startsWith('git config');
  const plan = KINDS.map((kind) => {
    const name = ctx.mc.TEMPLATE_FILES[kind];
    const target = path.join(ctx.overrideDir, name);
    return { kind, from: path.join(SHIPPED_DIR, name), to: target, action: fs.existsSync(target) ? 'keep (already present)' : 'copy' };
  });
  for (const step of plan) {
    if (!fs.existsSync(step.from)) throw new RefusedError(`shipped template missing: ${step.from}`);
  }
  if (opts.apply) {
    for (const step of plan) if (step.action === 'copy') writeFile(step.to, fs.readFileSync(step.from, 'utf8'));
  }
  const lines = plan.map((s) => `${opts.apply && s.action === 'copy' ? 'Copied' : s.action === 'copy' ? 'Would copy' : 'Keep'}: ${path.relative(ctx.root, s.to)}${s.action === 'copy' ? ` <- ${s.from}` : ' (already present, never overwritten)'}`);
  if (configured) lines.push(`Note: git config skgit.contractDir points at ${ctx.resolved.dir}, which outranks ${OVERRIDE_DIR}/. Unset it for ${OVERRIDE_DIR}/ to take effect.`);
  if (!opts.apply) lines.push('Dry run: nothing written. Add --apply to copy.');
  emit(opts, { repo: ctx.root, applied: opts.apply, plan, outranked: configured }, lines, `STATUS=OK MODE=${opts.apply ? 'APPLIED' : 'DRY_RUN'}`);
  return 0;
}

function set(ctx, opts) {
  const [, kindValue, dotted, rawValue] = opts.positional;
  const kind = kindArg(kindValue);
  if (!dotted || rawValue === undefined) throw new RefusedError('usage: set <kind> <dotted.path> <json-value>');
  let value;
  try {
    value = JSON.parse(rawValue);
  } catch {
    throw new RefusedError(`the value must be JSON (quote strings: '"text"'), got ${rawValue}`);
  }
  if (['kind', 'version'].includes(dotted)) throw new RefusedError(`${dotted} identifies the block and is not a rule setting`);

  const dir = editableDir(ctx);
  const file = path.join(dir, ctx.mc.TEMPLATE_FILES[kind]);
  if (!fs.existsSync(file)) throw new RefusedError(`${path.relative(ctx.root, file)} does not exist. Run init to restore it.`);
  const markdown = fs.readFileSync(file, 'utf8');
  const lines = markdown.split('\n');
  const span = blockSpan(lines);
  if (!span || span.open === -1 || span.close === -1) throw new RefusedError(`${kind} has no complete "Enforced rules" block to edit`);

  const originalText = lines.slice(span.open + 1, span.close).join('\n');
  const contract = ctx.mc.extractContract(markdown, file);
  const idsBefore = ctx.mc.ruleIdsFor(kind, contract);
  const next = JSON.parse(JSON.stringify(contract));
  const before = setPath(next, dotted, value);
  const shape = ctx.mc.contractShapeErrors(next, kind);
  if (shape.length) throw new RefusedError(`the change would break the ${kind} rules block, so nothing was written: ${shape.join('; ')}`);

  const { text, reformatted } = serialize(next, originalText);
  const updated = [...lines.slice(0, span.open + 1), text, ...lines.slice(span.close)].join('\n');
  const idsAfter = ctx.mc.ruleIdsFor(kind, next);
  const drift = ctx.mc.templateDriftErrors(updated, kind, file);
  if (opts.apply) writeFile(file, updated);

  const added = idsAfter.filter((id) => !idsBefore.includes(id));
  const removed = idsBefore.filter((id) => !idsAfter.includes(id));
  const out = [
    `${kind} ${dotted}: ${JSON.stringify(before ?? null)} -> ${JSON.stringify(value)}`,
    `${opts.apply ? 'Wrote' : 'Would write'}: ${path.relative(ctx.root, file)}`,
  ];
  if (added.length) out.push(`Rules switched on: ${added.join(', ')}`);
  if (removed.length) out.push(`Rules switched off: ${removed.join(', ')}`);
  if (reformatted) out.push('Note: the block layout did not match the shipped style, so it is rewritten as plain two-space JSON.');
  for (const d of drift) out.push(`Prose to update: ${d}`);
  if (!opts.apply) out.push('Dry run: nothing written. Add --apply to write.');
  emit(opts, { repo: ctx.root, kind, path: dotted, before: before ?? null, after: value, file, applied: opts.apply, rulesOn: added, rulesOff: removed, reformatted, drift }, out,
    `STATUS=OK MODE=${opts.apply ? 'APPLIED' : 'DRY_RUN'} DRIFT=${drift.length}`);
  return 0;
}

// Removes the whole "Enforced rules" section, from its heading to the next heading of
// the same or a higher level, so the template keeps its guidance and enforces nothing.
function disable(ctx, opts) {
  const kind = kindArg(opts.positional[1]);
  const dir = editableDir(ctx);
  const file = path.join(dir, ctx.mc.TEMPLATE_FILES[kind]);
  if (!fs.existsSync(file)) throw new RefusedError(`${path.relative(ctx.root, file)} does not exist, so ${kind} is already not enforced.`);
  const lines = fs.readFileSync(file, 'utf8').split('\n');
  const span = blockSpan(lines);
  if (!span) throw new RefusedError(`${kind} has no "Enforced rules" section, so it is already not enforced.`);
  const level = lines[span.heading].match(RULES_HEADING)[1].length;
  let end = lines.findIndex((line, i) => i > span.heading && HEADING.test(line) && line.match(HEADING)[1].length <= level);
  if (end === -1) end = lines.length;
  // The separator above the heading now separates the previous section from the next
  // one. At the end of the file nothing follows, so a trailing separator goes too.
  const head = lines.slice(0, span.heading);
  if (end === lines.length) {
    while (head.length && /^(\s*|---)$/.test(head[head.length - 1])) head.pop();
    head.push('');
  }
  const updated = [...head, ...lines.slice(end)];
  const removedCount = end - span.heading;
  if (opts.apply) writeFile(file, updated.join('\n'));
  const out = [
    `${opts.apply ? 'Removed' : 'Would remove'}: lines ${span.heading + 1}-${end} of ${path.relative(ctx.root, file)} (the "${lines[span.heading].replace(/^#+\s*/, '')}" section)`,
    `After this, ${kind} rules are not enforced in this repository. To restore them, delete the file and run init.`,
  ];
  if (!opts.apply) out.push('Dry run: nothing written. Add --apply to write.');
  emit(opts, { repo: ctx.root, kind, file, applied: opts.apply, removedLines: removedCount }, out, `STATUS=OK MODE=${opts.apply ? 'APPLIED' : 'DRY_RUN'}`);
  return 0;
}

function check(ctx, opts) {
  if (!ctx.resolved) {
    emit(opts, { repo: ctx.root, kinds: [] }, ['No contract directory: nothing to check.'], 'STATUS=OK DRIFT=0');
    return 0;
  }
  const kinds = KINDS.map((kind) => kindReport(ctx, ctx.resolved.dir, kind));
  const broken = kinds.filter((k) => k.state === 'broken');
  const drift = kinds.reduce((n, k) => n + k.drift.length, 0);
  const lines = kinds.map((k) => `${k.kind.padEnd(7)} ${k.state}${k.reason ? ` (${k.reason})` : ''}${k.drift.length ? `, ${k.drift.length} drift` : ''}`);
  for (const k of kinds) for (const d of k.drift) lines.push(`  ${k.kind}: ${d}`);
  const code = broken.length ? 2 : drift ? 1 : 0;
  emit(opts, { repo: ctx.root, contractDir: ctx.resolved.dir, kinds }, lines,
    `STATUS=${code === 0 ? 'OK' : code === 1 ? 'DRIFT' : 'FAIL'} DRIFT=${drift} BROKEN=${broken.length}`);
  return code;
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. MAIN
// ─────────────────────────────────────────────────────────────────────────────

async function main(argv) {
  try {
    const opts = parseArgs(argv);
    const mode = opts.positional[0];
    const modes = { status, init, set, disable, check };
    if (!modes[mode]) throw new RefusedError('usage: git-standards.cjs status|init|set|disable|check ... (see the header)');
    return modes[mode](await context(opts), opts);
  } catch (err) {
    const message = err instanceof RefusedError ? err.message : `unexpected: ${err.message}`;
    process.stderr.write(`git-standards: ${message}\n`);
    process.stdout.write(`STATUS=FAIL ERROR="${message.replace(/"/g, "'")}"\n`);
    return 2;
  }
}

if (require.main === module) main(process.argv.slice(2)).then((code) => { process.exitCode = code; });

module.exports = { main, styled, serialize };
