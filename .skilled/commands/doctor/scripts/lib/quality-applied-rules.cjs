// ───────────────────────────────────────────────────────────────────
// MODULE: sk-code Quality Applied Rules
// ───────────────────────────────────────────────────────────────────
'use strict';

// Which checklists and hygiene rules the quality gate would apply to a repository, and
// which override rows inside them it would honour. The answer comes from the runner
// itself through --explain, which starts no check and writes no file, so the doctor
// never keeps a second copy of checklist discovery or of the override grammar.
//
// WHY THE RUNNER IS ASKED: a repository's own checklists decide what applies, and the
// precedence between them is the runner's. Any copy of that resolution here would be a
// second source of truth that the first disagreement turns into a wrong verdict.
//
// The batch loop is handed the explain call rather than reaching for the runner, so the
// entry point stays the one place in this script that starts a process.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('node:fs');
const path = require('node:path');

const {
  OVERRIDE_LINTER_PATH,
  RULE_REGISTRY_PATH,
  SKILLS_DIR,
  runGit,
} = require('./quality-skill-paths.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

// A checklist selects files by path glob, extension, content marker or surface, so one
// file per group of the first three folders and extension stands in for the tree. Over
// this framework's own repository that sample resolved the same checklists as every
// tracked file, in about a sixtieth of the time. A paths selector deeper than three
// folders, a contentMarkers selector, or a surface file or content marker can still
// miss every sampled file. The status names the sample it read, and it checks every
// checklist the repository config declares whether or not the sample reached it.
const SAMPLE_DEPTH = 3;
const SAMPLE_LIMIT = 4000;
// Each explain call names its files on the command line, so a batch stays far below the
// system's argument limit.
const EXPLAIN_BATCH = 500;

const OVERRIDE_REPAIR = 'fix or remove each override row the message names, then check the file with '
  + 'node .skilled/skills/sk-code/shared/scripts/check-rule-overrides.cjs <checklist.md>';

// ─────────────────────────────────────────────────────────────────────────────
// 3. SAMPLING
// ─────────────────────────────────────────────────────────────────────────────

// The files the gate would see in a worktree run, tracked and untracked but not
// ignored, reduced to one per sample key. A link or a deleted path is passed over,
// because the runner names only regular files.
function sampleFiles(ctx) {
  const listed = runGit(['ls-files', '-z', '--cached', '--others', '--exclude-standard'], { cwd: ctx.root, env: ctx.env });
  if (!listed.ok) return { error: `git ls-files failed: ${(listed.stderr || listed.error || '').trim() || 'no output'}` };
  const names = [...new Set(listed.stdout.split('\0').filter(Boolean))];
  const keys = new Set();
  const files = [];
  let capped = false;
  for (const rel of names) {
    const parts = rel.split('/');
    const base = parts[parts.length - 1];
    const dot = base.lastIndexOf('.');
    const key = `${parts.slice(0, Math.min(SAMPLE_DEPTH, parts.length - 1)).join('/')}|${dot > 0 ? base.slice(dot) : ''}`;
    if (keys.has(key)) continue;
    const stat = fs.lstatSync(path.join(ctx.root, rel), { throwIfNoEntry: false });
    if (!stat || !stat.isFile()) continue;
    if (files.length >= SAMPLE_LIMIT) {
      capped = true;
      break;
    }
    keys.add(key);
    files.push(rel);
  }
  return { listed: names.length, files, capped, error: null };
}

// failed marks a resolution that broke, as opposed to one with nothing to resolve.
function unresolved(reason, { sample = null, failed = false } = {}) {
  return { resolved: false, failed, reason, sample, checklists: [], conflicts: [], errors: [], warnings: [] };
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. ANSWER COLLECTION
// ─────────────────────────────────────────────────────────────────────────────

// One checklist row a batch reported, gathered under its file: each seat that listed
// it, and how many sampled files reached it.
function collectChecklistRow(checklists, row) {
  if (!checklists.has(row.file)) checklists.set(row.file, { file: row.file, why: row.why, seats: [], files: 0, overrides: row.overrides });
  const item = checklists.get(row.file);
  for (const seat of row.sources) if (!item.seats.includes(seat)) item.seats.push(seat);
  item.files += 1;
}

// A rule conflict the runner found for one sampled file, gathered per rule and pair of
// checklists with the files that reached it.
function collectConflictRow(conflicts, row, file) {
  const key = `${row.id}\0${row.files.join('\0')}`;
  if (!conflicts.has(key)) conflicts.set(key, { id: row.id, files: row.files, sampled: [] });
  conflicts.get(key).sampled.push(file);
}

// One explained file: the checklists it reached and the conflicts the runner found for
// it.
function collectExplainedFile(collected, entry) {
  for (const row of entry.checklists) collectChecklistRow(collected.checklists, row);
  for (const row of entry.rule_conflicts || []) collectConflictRow(collected.conflicts, row, entry.file);
}

// One --explain answer. A fault is keyed by code and message, so a batch that reports
// the same fault as an error replaces the warning another batch raised for it.
function collectBatch(collected, doc) {
  for (const entry of doc.files) collectExplainedFile(collected, entry);
  for (const row of doc.errors) collected.errors.set(`${row.code}\0${row.message}`, row);
  for (const row of doc.config.warnings) collected.warnings.set(`${row.code}\0${row.message}`, row);
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. OVERRIDE SECTIONS
// ─────────────────────────────────────────────────────────────────────────────

// The rows of a section whose id no declaring document carries, read through the same
// registry the runner reads, as {line, message} rows. A registry that cannot be read
// refuses every row, as the runner does.
function unknownRuleRows() {
  let registry = null;
  let fault = null;
  try {
    registry = require(RULE_REGISTRY_PATH).loadRegistry();
  } catch (error) {
    fault = `the rule id registry could not be read: ${error.message}`;
  }
  return (rows) => {
    if (rows.length === 0) return [];
    if (fault) return [{ line: null, message: fault }];
    return rows.filter((row) => !registry.has(row.id))
      .map((row) => ({ line: row.line, message: `\`${row.id}\` names no rule the runner, the universal standards or the review lens declares` }));
  };
}

function refusedOverrides(file, reasonRows) {
  const reasons = reasonRows.map((row) => `${row.line === null ? '' : `line ${row.line}: `}${row.message}`).join('; ');
  return { code: 'CONFIG_INVALID', message: `${file} has a refused ## Rule overrides section, so none of its rows apply: ${reasons}`, repair: OVERRIDE_REPAIR };
}

// The override section of a declared checklist, read through the shared linter the
// runner uses, in the shape an explanation prints. A missing file reads null, as it
// does there.
function lintChecklist(abs) {
  let stat = null;
  try {
    stat = fs.statSync(abs);
  } catch {
    stat = null;
  }
  if (!stat || !stat.isFile()) return null;
  try {
    const linter = require(OVERRIDE_LINTER_PATH);
    const result = linter.lintOverrides(fs.readFileSync(abs, 'utf8'), linter.loadContract());
    return { found: result.found, refused: result.errors.length > 0, rows: result.rows, errors: result.errors };
  } catch (error) {
    return { found: false, refused: true, rows: [], errors: [{ line: null, message: `the override section could not be read: ${error.message}` }] };
  }
}

// A repository row the sample did not reach still loads for the file it selects, so it
// is listed as declared and checked the way a reached row is: its file must exist and
// its override section must lint. Only the config's own rows are checked here, because
// those are the ones a sample is most likely to miss and the ones the repository can
// fix.
function unreachedRepositoryRows(ctx, loaded, reached) {
  const rows = loaded.merged ? loaded.merged.checklists.filter((row) => row.layer === 'repo') : [];
  const seen = new Set(reached.keys());
  const declared = [];
  for (const row of rows) {
    if (seen.has(row.file)) continue;
    seen.add(row.file);
    const abs = row.file.startsWith('hub:') ? path.join(SKILLS_DIR, row.file.slice('hub:'.length)) : path.join(ctx.root, row.file);
    const selectors = ['paths', 'extensions', 'contentMarkers']
      .filter((key) => Array.isArray(row[key]))
      .map((key) => `${key} ${row[key].join(' ')}`)
      .join(', ');
    const overrides = lintChecklist(abs);
    const missing = overrides === null
      ? {
        code: 'CHECKLIST_MISSING',
        message: `${row.file} is declared but ${abs} is not a regular file`,
        repair: 'restore the checklist file or fix the declaration that names it',
      }
      : null;
    declared.push({
      file: row.file,
      why: row.why || `${loaded.display}, ${selectors}`,
      seats: ['repo-config'],
      files: 0,
      reached: false,
      overrides,
      missing,
    });
  }
  return declared;
}

// A gate run refuses a loaded checklist whose override section the linter refuses, or
// one with a row that names no known rule, so the status reports the same fault for
// every checklist it lists, reached or only declared. The registry's verdict is kept
// on the row, because the explanation prints the rows it refused.
function overridesFault(item, known) {
  item.unknown = item.overrides && !item.overrides.refused ? known(item.overrides.rows) : [];
  if (item.overrides && item.overrides.refused) return refusedOverrides(item.file, item.overrides.errors);
  if (item.unknown.length > 0) return refusedOverrides(item.file, item.unknown);
  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. RESOLUTION
// ─────────────────────────────────────────────────────────────────────────────

// Every checklist the gate would load for some sampled file, with each seat that listed
// it and its override section exactly as the shared linter read it. A fault is an error
// when any sampled file reaches it, as one run over every file would report it, so a
// warning one batch raised is dropped once another batch reports it as an error. A rule
// conflict is the one the runner's own precedence found for a sampled file, gathered per
// rule and pair of checklists.
function appliedRules(ctx, loaded, explain) {
  if (loaded.errors.length > 0) return unresolved('the config did not validate, so the gate stops before it applies any rule');
  const sample = sampleFiles(ctx);
  if (sample.error) return unresolved(sample.error, { failed: true });
  const described = { files: sample.files.length, listed: sample.listed, capped: sample.capped,
    rule: `one file per first ${SAMPLE_DEPTH} folders and extension` };
  if (sample.files.length === 0) return unresolved('the repository holds no regular file to resolve', { sample: described });
  const collected = { checklists: new Map(), errors: new Map(), warnings: new Map(), conflicts: new Map() };
  for (let start = 0; start < sample.files.length; start += EXPLAIN_BATCH) {
    const batch = explain(sample.files.slice(start, start + EXPLAIN_BATCH));
    if (batch.error) return unresolved(batch.error, { sample: described, failed: true });
    collectBatch(collected, batch.doc);
  }
  for (const key of collected.errors.keys()) collected.warnings.delete(key);
  const reached = [...collected.checklists.values()].map((item) => ({ ...item, reached: true }));
  const declared = unreachedRepositoryRows(ctx, loaded, collected.checklists);
  const faults = [...collected.errors.values()];
  const known = unknownRuleRows();
  for (const item of [...reached, ...declared]) {
    const fault = overridesFault(item, known);
    if (fault) faults.push(fault);
  }
  for (const item of declared) if (item.missing) faults.push(item.missing);
  return { resolved: true, failed: false, reason: null, sample: described,
    checklists: [...reached, ...declared.map(({ missing, ...item }) => item)], conflicts: [...collected.conflicts.values()],
    errors: faults, warnings: [...collected.warnings.values()] };
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = { SAMPLE_LIMIT, appliedRules };
