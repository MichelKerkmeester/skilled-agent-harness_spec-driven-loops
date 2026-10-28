// ───────────────────────────────────────────────────────────────────
// MODULE: sk-code Quality Config Init
// ───────────────────────────────────────────────────────────────────
'use strict';

// The one mode that can write: it shows the config it would create from the shipped
// template and writes it only with --apply. Everything the plan reports comes from the
// config module the gate reads, so the file the plan shows is the file the gate
// validates.
//
// The write is a hard link from a temporary file, so it never replaces a config that
// already exists, not even one a second run created a moment earlier. An existing
// config is refused rather than merged, because a reviewed file must not be silently
// replaced by a template.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const { qualityConfig } = require('./quality-skill-paths.cjs');
const { RequestError, emit } = require('./quality-script-io.cjs');
const { hygieneSuggestion } = require('./quality-config-source.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. FOLDER GUARDS
// ─────────────────────────────────────────────────────────────────────────────

function realOrSelf(file) {
  try {
    return fs.realpathSync(file);
  } catch {
    return file;
  }
}

function isInside(child, parent) {
  const rel = path.relative(parent, child);
  return rel !== '' && !rel.startsWith('..') && !path.isAbsolute(rel);
}

// The folder can be a link a checkout carries in, so it must resolve inside the
// repository both before the plan is shown and again just before the write. A link
// that resolves nowhere is refused the same way.
function assertFolderInside(ctx, folder) {
  if (!fs.lstatSync(folder, { throwIfNoEntry: false })) return;
  const name = path.basename(folder);
  let real;
  try {
    real = fs.realpathSync(folder);
  } catch {
    throw new RequestError(`${name} is a link that resolves nowhere`, { code: 'OUTSIDE_REPOSITORY', exit: 1, mode: 'REFUSED' });
  }
  if (!isInside(real, realOrSelf(ctx.root))) {
    throw new RequestError(`${name} resolves to ${real}, outside the repository`, { code: 'OUTSIDE_REPOSITORY', exit: 1, mode: 'REFUSED' });
  }
  if (!fs.statSync(real).isDirectory()) {
    throw new RequestError(`${name} exists and is not a folder`, { code: 'CONFIG_EXISTS', exit: 1, mode: 'REFUSED' });
  }
}

// A temporary file holds the whole text first, and a hard link puts it in place. A link
// never replaces an existing name, so a file that appears between the check and the
// write is kept, and an interrupted run leaves no half-written config.
function createOnce(target, text) {
  const temp = path.join(path.dirname(target), `.quality.json.${process.pid}.${crypto.randomBytes(6).toString('hex')}.tmp`);
  fs.writeFileSync(temp, text, { flag: 'wx' });
  try {
    fs.linkSync(temp, target);
    return true;
  } catch (error) {
    if (error.code === 'EEXIST') return false;
    throw error;
  } finally {
    fs.rmSync(temp, { force: true });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. INIT MODE
// ─────────────────────────────────────────────────────────────────────────────

function init(ctx, opts) {
  const target = qualityConfig.repoConfigTarget(ctx.root);
  const file = path.join(ctx.root, target);
  const folder = path.dirname(file);
  assertFolderInside(ctx, folder);
  const { config, suggestions } = qualityConfig.initialConfig(ctx.root);
  const text = `${JSON.stringify(config, null, 2)}\n`;
  let outranked = null;
  try {
    const found = qualityConfig.discoverConfig({ cwd: ctx.cwd, root: ctx.root, git: true, env: ctx.env });
    if (found.source === 'git-config') outranked = found.path;
  } catch (error) {
    if (!(error instanceof qualityConfig.ConfigError)) throw error;
    if (error.source === 'git-config') outranked = error.path;
  }
  const exists = Boolean(fs.lstatSync(file, { throwIfNoEntry: false }));
  const plan = {
    repo: ctx.root,
    target,
    applied: false,
    exists,
    checks: suggestions.map((item) => ({ id: item.id, source: item.source, argv: item.entry.argv, required: false })),
    outranked,
    suggested_hygiene: hygieneSuggestion(ctx.root),
    config,
  };
  const lines = [`Target: ${target}`];
  if (plan.checks.length === 0) lines.push('Checks: none, no manifest at the root implies one');
  for (const item of plan.checks) lines.push(`  enable ${item.id} from ${item.source}, not required: ${item.argv.join(' ')}`);
  if (plan.suggested_hygiene) {
    lines.push(`Suggested, not written: ${plan.suggested_hygiene.field} ${JSON.stringify(plan.suggested_hygiene.rules)}`,
      `  why: ${plan.suggested_hygiene.reason}. Add the list to the file to switch those rules off.`);
  }
  if (outranked) lines.push(`Note: git config skcode.qualityConfig names ${outranked}, which outranks ${target}. Unset it for the new file to take effect.`);

  if (exists) {
    lines.push(`Refused: ${target} already exists and is never overwritten.`);
    emit(opts, plan, lines, `STATUS=FAIL MODE=${opts.apply ? 'REFUSED' : 'DRY_RUN'} ERROR=CONFIG_EXISTS`);
    return 1;
  }
  if (!opts.apply) {
    lines.push('Would write:', ...text.trimEnd().split('\n').map((line) => `  ${line}`), 'Dry run: nothing written. Add --apply to write.');
    emit(opts, plan, lines, 'STATUS=OK MODE=DRY_RUN');
    return 0;
  }
  fs.mkdirSync(folder, { recursive: true });
  assertFolderInside(ctx, folder);
  if (!createOnce(file, text)) {
    lines.push(`Refused: ${target} appeared before the write and is never overwritten.`);
    emit(opts, { ...plan, exists: true }, lines, 'STATUS=FAIL MODE=REFUSED ERROR=CONFIG_EXISTS');
    return 1;
  }
  lines.push(`Wrote: ${target}. Review it and commit it like any other repository setting.`);
  emit(opts, { ...plan, applied: true }, lines, 'STATUS=OK MODE=APPLIED');
  return 0;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = { init };
