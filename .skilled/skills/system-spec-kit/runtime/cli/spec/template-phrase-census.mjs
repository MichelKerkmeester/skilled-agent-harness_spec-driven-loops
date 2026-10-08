#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Template Phrase Census
// ───────────────────────────────────────────────────────────────────
// Read phrase blocks from their source templates so reports follow template edits.

// ───────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ───────────────────────────────────────────────────────────────────

import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

import { normalizeTriggerText } from '../retrieval/lib/normalize.mjs';

const require = createRequire(import.meta.url);
const yaml = require('js-yaml');

// ───────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ───────────────────────────────────────────────────────────────────

const SCRIPT = 'template-phrase-census';
const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const TEMPLATE_ROOT = path.resolve(SCRIPT_DIR, '../../../templates');
const TEMPLATE_FILES = Object.freeze({
  spec: 'core/spec.md.tmpl',
  plan: 'core/plan.md.tmpl',
  tasks: 'core/tasks.md.tmpl',
  implementationSummary: 'core/implementation-summary.md.tmpl',
  decisionRecord: 'addons/decision-record.md.tmpl',
  phaseParentSpec: 'packet-types/phase-parent.spec.md.tmpl',
  reviewSpec: 'packet-types/review.spec.md.tmpl',
  researchSpec: 'packet-types/research.spec.md.tmpl',
  resourceMap: 'addons/resource-map.md.tmpl',
  handover: 'addons/handover.md.tmpl',
  debugDelegation: 'addons/debug-delegation.md.tmpl',
  research: 'addons/research.md.tmpl',
  beforeAfter: 'addons/before-after.md.tmpl',
  timeline: 'addons/timeline.md.tmpl',
  roadmap: 'addons/roadmap.md.tmpl',
  reviewReport: 'packet-types/review-report.md.tmpl',
  acceptanceCriteria: 'addons/acceptance-criteria.md.tmpl',
  goal: 'addons/goal.md.tmpl',
});
const DOCUMENT_KINDS = Object.freeze({
  'spec.md': 'spec',
  'acceptance-criteria.md': 'acceptanceCriteria',
  'plan.md': 'plan',
  'tasks.md': 'tasks',
  'implementation-summary.md': 'implementationSummary',
  'decision-record.md': 'decisionRecord',
  'resource-map.md': 'resourceMap',
  'handover.md': 'handover',
  'debug-delegation.md': 'debugDelegation',
  'research/research.md': 'research',
  'before-after.md': 'beforeAfter',
  'timeline.md': 'timeline',
  'roadmap.md': 'roadmap',
  'review/review-report.md': 'reviewReport',
  'goal.md': 'goal',
});
const PACKET_SPEC_LEVEL_KINDS = Object.freeze({
  review: 'reviewSpec',
  research: 'researchSpec',
});
const PACKET_SPEC_KINDS = Object.freeze(['phaseParentSpec', ...Object.values(PACKET_SPEC_LEVEL_KINDS)]);
const COUNT_KINDS = Object.freeze([
  ...Object.values(DOCUMENT_KINDS).slice(0, 6),
  ...PACKET_SPEC_KINDS,
  ...Object.values(DOCUMENT_KINDS).slice(6),
]);
const LEGACY_COUNT_KINDS = Object.freeze(COUNT_KINDS.slice(0, 5));
const EXACT_BLOCK_KINDS = COUNT_KINDS;
const SUPPORTED_DOCUMENT_NAMES = new Set(
  Object.keys(DOCUMENT_KINDS).map((documentPath) => path.posix.basename(documentPath)),
);
// Demo snapshots and review quarantine copies are not real packets; both tools leave them alone.
const SKIPPED_DIRECTORY_NAMES = new Set(['scratch', 'containment']);

// ───────────────────────────────────────────────────────────────────
// 3. FRONTMATTER AND TEMPLATE HELPERS
// ───────────────────────────────────────────────────────────────────

/**
 * Splits text into line records without normalizing its line endings.
 * @param {string} content File content.
 * @returns {Array<{ line: string, start: number, contentEnd: number, eol: string }>} Line records.
 */
function makeLineRecords(content) {
  const records = [];
  let start = 0;

  while (start < content.length) {
    const newlineIndex = content.indexOf('\n', start);
    const rawEnd = newlineIndex === -1 ? content.length : newlineIndex;
    const hasCarriageReturn = rawEnd > start && content[rawEnd - 1] === '\r';
    const contentEnd = hasCarriageReturn ? rawEnd - 1 : rawEnd;

    records.push({
      line: content.slice(start, contentEnd),
      start,
      contentEnd,
      eol: newlineIndex === -1 ? '' : (hasCarriageReturn ? '\r\n' : '\n'),
    });

    if (newlineIndex === -1) break;
    start = newlineIndex + 1;
  }

  return records;
}

/**
 * Reads and validates the YAML frontmatter mapping.
 * @param {string} content Markdown content.
 * @returns {{ ok: boolean, data: Record<string, unknown> | null, reason: string, records: ReturnType<typeof makeLineRecords>, openingIndex: number, closingIndex: number }} Parsed frontmatter.
 */
export function parseFrontmatter(content) {
  const records = makeLineRecords(content);
  const openingLine = records[0]?.line.replace(/^\uFEFF/, '');
  if (openingLine !== '---') {
    return { ok: false, data: null, reason: 'missing opening frontmatter delimiter', records, openingIndex: -1, closingIndex: -1 };
  }

  const closingIndex = records.findIndex((record, index) => index > 0 && record.line === '---');
  if (closingIndex === -1) {
    return { ok: false, data: null, reason: 'missing closing frontmatter delimiter', records, openingIndex: 0, closingIndex: -1 };
  }

  const yamlText = records.slice(1, closingIndex).map((record) => record.line).join('\n');
  let data;
  try {
    data = yaml.load(yamlText);
  } catch (error) {
    const reason = error instanceof Error ? error.message.split('\n')[0] : String(error);
    return { ok: false, data: null, reason: `invalid YAML: ${reason}`, records, openingIndex: 0, closingIndex };
  }

  if (data === null || typeof data !== 'object' || Array.isArray(data)) {
    return { ok: false, data: null, reason: 'frontmatter must be a YAML mapping', records, openingIndex: 0, closingIndex };
  }

  return { ok: true, data, reason: '', records, openingIndex: 0, closingIndex };
}

/**
 * Loads each default phrase list from its checked-in template.
 * @returns {Record<string, { file: string, rows: string[], phrases: string[] }>} Template defaults.
 */
export function loadTemplateDefaults() {
  const defaults = {};

  for (const [kind, relativePath] of Object.entries(TEMPLATE_FILES)) {
    const file = path.join(TEMPLATE_ROOT, relativePath);
    const records = makeLineRecords(fs.readFileSync(file, 'utf8'));
    const openingIndex = records.findIndex((record) => record.line.replace(/^\uFEFF/, '').trim() === '---');
    const closingIndex = records.findIndex((record, index) => index > openingIndex && record.line.trim() === '---');
    if (openingIndex === -1 || closingIndex === -1) {
      throw new Error(`${relativePath}: template frontmatter is missing a delimiter`);
    }

    const keyIndex = records.findIndex((record, index) => (
      index > openingIndex
      && index < closingIndex
      && /^trigger_phrases\s*:\s*$/.test(record.line)
    ));
    if (keyIndex === -1) throw new Error(`${relativePath}: trigger_phrases is missing`);

    const rows = [];
    for (let index = keyIndex + 1; index < closingIndex; index += 1) {
      const line = records[index].line;
      if (!/^\s+-\s+/.test(line)) break;
      rows.push(line);
    }
    if (rows.length === 0) throw new Error(`${relativePath}: trigger_phrases has no list items`);

    const parsed = yaml.load(`trigger_phrases:\n${rows.join('\n')}`);
    if (!Array.isArray(parsed?.trigger_phrases) || !parsed.trigger_phrases.every((phrase) => typeof phrase === 'string')) {
      throw new Error(`${relativePath}: trigger_phrases must contain only strings`);
    }

    defaults[kind] = { file: relativePath, rows, phrases: parsed.trigger_phrases };
  }

  return defaults;
}

/**
 * Finds each exact template block inside the trigger_phrases frontmatter list.
 * @param {string} content Markdown content.
 * @param {ReturnType<typeof parseFrontmatter>} parsed Parsed frontmatter.
 * @param {string[]} templateRows Exact list rows from the template.
 * @returns {Array<{ startLine: number, endLine: number, startOffset: number, endOffset: number, lineEnding: string }>} Matching ranges.
 */
export function findExactTemplateBlocks(content, parsed, templateRows) {
  if (!parsed.ok || templateRows.length === 0 || !Array.isArray(parsed.data?.trigger_phrases)) return [];

  const { records, openingIndex, closingIndex } = parsed;
  const keyIndex = records.findIndex((record, index) => (
    index > openingIndex
    && index < closingIndex
    && /^trigger_phrases\s*:\s*(?:#.*)?$/.test(record.line)
  ));
  if (keyIndex === -1) return [];

  let listEnd = closingIndex;
  for (let index = keyIndex + 1; index < closingIndex; index += 1) {
    if (/^[A-Za-z_][A-Za-z0-9_-]*\s*:/.test(records[index].line)) {
      listEnd = index;
      break;
    }
  }

  const matches = [];
  for (let index = keyIndex + 1; index + templateRows.length <= listEnd; index += 1) {
    const isExact = templateRows.every((row, offset) => records[index + offset].line === row);
    if (!isExact) continue;
    const endLine = index + templateRows.length - 1;
    matches.push({
      startLine: index,
      endLine,
      startOffset: records[index].start,
      endOffset: records[endLine].contentEnd,
      lineEnding: records[index].eol || '\n',
    });
  }

  return matches;
}

/**
 * Maps each trigger_phrases list row to its parsed phrase so the caller can
 * rewrite or drop individual entries. A list that cannot be mapped one row per
 * phrase returns null, which leaves non-block formats untouched.
 * @param {ReturnType<typeof parseFrontmatter>} parsed Parsed frontmatter.
 * @returns {Array<{ phrase: unknown, line: string, startOffset: number, contentEnd: number, deleteEnd: number, lineEnding: string }> | null} List entries.
 */
export function findTriggerPhraseEntries(parsed) {
  if (!parsed.ok || !Array.isArray(parsed.data?.trigger_phrases)) return null;

  const { records, openingIndex, closingIndex } = parsed;
  const keyIndex = records.findIndex((record, index) => (
    index > openingIndex
    && index < closingIndex
    && /^trigger_phrases\s*:\s*(?:#.*)?$/.test(record.line)
  ));
  if (keyIndex === -1) return null;

  let listEnd = closingIndex;
  for (let index = keyIndex + 1; index < closingIndex; index += 1) {
    if (/^[A-Za-z_][A-Za-z0-9_-]*\s*:/.test(records[index].line)) {
      listEnd = index;
      break;
    }
  }

  const rows = [];
  for (let index = keyIndex + 1; index < listEnd; index += 1) {
    if (/^\s+-\s+/.test(records[index].line)) rows.push(records[index]);
  }

  const phrases = parsed.data.trigger_phrases;
  if (rows.length !== phrases.length) return null;

  return rows.map((record, index) => ({
    phrase: phrases[index],
    line: record.line,
    startOffset: record.start,
    contentEnd: record.contentEnd,
    deleteEnd: record.contentEnd + record.eol.length,
    lineEnding: record.eol || '\n',
  }));
}

/**
 * Classifies a trigger_phrases list against one document kind's defaults.
 * A carrier is partial when the list holds at least one default phrase and
 * either carries a non-default entry or a proper subset of the default set.
 * @param {ReturnType<typeof parseFrontmatter>} parsed Parsed frontmatter.
 * @param {string[]} defaultPhrases Template phrases for the document kind.
 * @returns {{ entries: Array<Record<string, unknown>>, defaultEntries: Array<Record<string, unknown>>, nonDefaultEntries: Array<Record<string, unknown>>, partial: boolean } | null} List classification, or null when no row list can be mapped.
 */
export function classifyTriggerPhraseCarrier(parsed, defaultPhrases) {
  const entries = findTriggerPhraseEntries(parsed);
  if (entries === null) return null;

  const defaultKeys = new Set(defaultPhrases.map((phrase) => normalizeTriggerText(phrase)).filter(Boolean));
  const classified = entries.map((entry) => {
    const key = normalizeTriggerText(entry.phrase);
    return { ...entry, key, isDefault: defaultKeys.has(key) };
  });
  const defaultEntries = classified.filter((entry) => entry.isDefault);
  const nonDefaultEntries = classified.filter((entry) => !entry.isDefault);
  const presentDefaultKeys = new Set(defaultEntries.map((entry) => entry.key));

  return {
    entries: classified,
    defaultEntries,
    nonDefaultEntries,
    partial: defaultEntries.length > 0
      && (nonDefaultEntries.length > 0 || presentDefaultKeys.size < defaultKeys.size),
  };
}

/**
 * Lists the supported packet documents under a root without following symlinks.
 * @param {string} root Spec tree root.
 * @returns {string[]} Absolute document paths in stable order.
 */
export function walkDocuments(root) {
  const pending = [root];
  const files = [];

  while (pending.length > 0) {
    const directory = pending.pop();
    const entries = fs.readdirSync(directory, { withFileTypes: true })
      .sort((left, right) => left.name.localeCompare(right.name));

    for (const entry of entries) {
      const candidate = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        if (SKIPPED_DIRECTORY_NAMES.has(entry.name)) continue;
        pending.push(candidate);
      } else if (entry.isFile() && SUPPORTED_DOCUMENT_NAMES.has(entry.name)) {
        files.push(candidate);
      }
    }
  }

  return files.sort((left, right) => left.localeCompare(right));
}

/**
 * Returns whether a document belongs to an archived path.
 * @param {string} file Absolute document path.
 * @param {string} root Spec tree root.
 * @returns {boolean} True when any path segment is z_archive.
 */
export function isArchivedDocument(file, root) {
  return path.relative(root, file).split(path.sep).includes('z_archive');
}

/**
 * Returns a stable root-relative document path.
 * @param {string} file Absolute document path.
 * @param {string} root Spec tree root.
 * @returns {string} Slash-separated relative path.
 */
export function relativeDocumentPath(file, root) {
  return path.relative(root, file).split(path.sep).join('/');
}

/**
 * Resolves a document kind from its relative path and packet marker.
 * @param {string} file Absolute document path.
 * @param {string} root Spec tree root.
 * @returns {string | null} Document kind, or null when unsupported.
 */
export function documentKindForPath(file, root) {
  const relative = relativeDocumentPath(file, root);
  if (relative === 'spec.md' || relative.endsWith('/spec.md')) {
    const content = fs.readFileSync(file, 'utf8');
    // Phase-parent specs share level 2, so their template source identifies the packet type.
    if (/<!--\s*SPECKIT_TEMPLATE_SOURCE:\s*phase-parent-spec\b/.test(content)) {
      return 'phaseParentSpec';
    }
    const level = content.match(/<!--\s*SPECKIT_LEVEL:\s*(review|research)\s*-->/)?.[1];
    if (level) return PACKET_SPEC_LEVEL_KINDS[level];
  }
  const match = Object.entries(DOCUMENT_KINDS)
    .filter(([documentPath]) => relative === documentPath || relative.endsWith(`/${documentPath}`))
    .sort(([left], [right]) => right.length - left.length)[0];
  return match ? match[1] : null;
}

// ───────────────────────────────────────────────────────────────────
// 4. CENSUS
// ───────────────────────────────────────────────────────────────────

function emptyCounts() {
  return {
    documents: Object.fromEntries(LEGACY_COUNT_KINDS.map((kind) => [kind, 0])),
    templateBlocks: Object.fromEntries(LEGACY_COUNT_KINDS.map((kind) => [kind, 0])),
    partialCarriers: Object.fromEntries(LEGACY_COUNT_KINDS.map((kind) => [kind, 0])),
    malformedFrontmatter: 0,
  };
}

function ensureKindCounts(target, kind) {
  target.documents[kind] ??= 0;
  target.templateBlocks[kind] ??= 0;
  target.partialCarriers[kind] ??= 0;
}

function addCounts(target, source) {
  for (const [kind, count] of Object.entries(source.documents)) {
    target.documents[kind] = (target.documents[kind] ?? 0) + count;
  }
  for (const [kind, count] of Object.entries(source.templateBlocks)) {
    target.templateBlocks[kind] = (target.templateBlocks[kind] ?? 0) + count;
  }
  for (const [kind, count] of Object.entries(source.partialCarriers)) {
    target.partialCarriers[kind] = (target.partialCarriers[kind] ?? 0) + count;
  }
  target.malformedFrontmatter += source.malformedFrontmatter;
}

/**
 * Counts exact template blocks and partial phrase carriers across packet documents.
 * @param {string} root Spec tree root.
 * @param {ReturnType<typeof loadTemplateDefaults>} defaults Loaded template phrases.
 * @returns {object} Census report grouped by track and archive state.
 */
export function runCensus(root, defaults = loadTemplateDefaults()) {
  const tracks = new Map();
  const issues = [];
  const totals = emptyCounts();
  const files = walkDocuments(root);

  for (const file of files) {
    const relativePath = relativeDocumentPath(file, root);
    const segments = relativePath.split('/');
    const track = segments.length > 1 ? segments[0] : '(root)';
    const archiveState = isArchivedDocument(file, root) ? 'archived' : 'live';
    if (!tracks.has(track)) tracks.set(track, { live: emptyCounts(), archived: emptyCounts() });
    const bucket = tracks.get(track)[archiveState];
    const kind = documentKindForPath(file, root);
    if (!kind) continue;
    ensureKindCounts(bucket, kind);
    ensureKindCounts(totals, kind);
    bucket.documents[kind] += 1;

    let content;
    try {
      content = fs.readFileSync(file, 'utf8');
    } catch (error) {
      bucket.malformedFrontmatter += 1;
      issues.push({ path: relativePath, reason: `read failed: ${error instanceof Error ? error.message : String(error)}` });
      continue;
    }

    const frontmatter = parseFrontmatter(content);
    if (!frontmatter.ok) {
      bucket.malformedFrontmatter += 1;
      issues.push({ path: relativePath, reason: frontmatter.reason });
      continue;
    }

    if (EXACT_BLOCK_KINDS.includes(kind)) {
      if (findExactTemplateBlocks(content, frontmatter, defaults[kind].rows).length > 0) {
        bucket.templateBlocks[kind] += 1;
      } else {
        const carrier = classifyTriggerPhraseCarrier(frontmatter, defaults[kind].phrases);
        if (carrier?.partial) bucket.partialCarriers[kind] += 1;
      }
    }
  }

  for (const state of tracks.values()) {
    addCounts(totals, state.live);
    addCounts(totals, state.archived);
  }

  return {
    root: path.resolve(root),
    totals,
    tracks: Object.fromEntries([...tracks.entries()].sort(([left], [right]) => left.localeCompare(right))),
    issues,
  };
}

function formatSummary(report) {
  const scanned = Object.entries(report.totals.documents)
    .map(([kind, count]) => `${kind}=${count}`)
    .join(' ');
  const lines = [`${SCRIPT}: scanned ${scanned}`];

  for (const [track, states] of Object.entries(report.tracks)) {
    const live = states.live.templateBlocks;
    const archived = states.archived.templateBlocks;
    lines.push(
      `${track}: live template blocks ${JSON.stringify(live)}; `
      + `live partial carriers ${JSON.stringify(states.live.partialCarriers)}; `
      + `archived template blocks ${JSON.stringify(archived)}; `
      + `archived partial carriers ${JSON.stringify(states.archived.partialCarriers)}`,
    );
  }

  lines.push(
    `${SCRIPT}: exact blocks ${JSON.stringify(report.totals.templateBlocks)}; `
    + `partial carriers ${JSON.stringify(report.totals.partialCarriers)}; `
    + `malformed frontmatter=${report.totals.malformedFrontmatter}`,
  );
  return `${lines.join('\n')}\n`;
}

function parseArgs(argv) {
  const parsed = { json: false, root: 'specs' };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--json') {
      parsed.json = true;
      continue;
    }
    if (arg === '--root') {
      const value = argv[index + 1];
      if (value === undefined || value.startsWith('--')) throw new Error('--root requires a directory');
      parsed.root = value;
      index += 1;
      continue;
    }
    throw new Error(`unknown argument: ${arg}`);
  }
  return parsed;
}

function isDirectRun() {
  return process.argv[1] !== undefined && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
}

function main(argv) {
  let options;
  try {
    options = parseArgs(argv);
  } catch (error) {
    const message = `${SCRIPT}: ${error instanceof Error ? error.message : String(error)}`;
    process.stderr.write(`${message}\n`);
    return 2;
  }

  const root = path.resolve(process.cwd(), options.root);
  if (!fs.existsSync(root) || !fs.statSync(root).isDirectory()) {
    const message = `${SCRIPT}: root directory is missing: ${root}`;
    process.stderr.write(`${message}\n`);
    return 2;
  }

  try {
    const report = runCensus(root);
    process.stdout.write(options.json ? `${JSON.stringify(report, null, 2)}\n` : formatSummary(report));
    return 0;
  } catch (error) {
    process.stderr.write(`${SCRIPT}: ${error instanceof Error ? error.message : String(error)}\n`);
    return 2;
  }
}

if (isDirectRun()) process.exitCode = main(process.argv.slice(2));
