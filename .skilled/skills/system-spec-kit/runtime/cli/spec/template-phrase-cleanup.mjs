#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Template Phrase Cleanup
// ───────────────────────────────────────────────────────────────────
// Keep the preview exact so operators can inspect every proposed phrase change.

// ───────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ───────────────────────────────────────────────────────────────────

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  classifyTriggerPhraseCarrier,
  findExactTemplateBlocks,
  findTriggerPhraseEntries,
  isArchivedDocument,
  loadTemplateDefaults,
  parseFrontmatter,
  relativeDocumentPath,
  walkDocuments,
} from './template-phrase-census.mjs';
import { normalizeTriggerText } from '../retrieval/lib/normalize.mjs';

// ───────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ───────────────────────────────────────────────────────────────────

const SCRIPT = 'template-phrase-cleanup';
const TARGET_KINDS = Object.freeze({
  'spec.md': 'spec',
  'acceptance-criteria.md': 'acceptanceCriteria',
  'plan.md': 'plan',
  'tasks.md': 'tasks',
  'implementation-summary.md': 'implementationSummary',
});

/**
 * Trailing function words that make a seeded phrase read as a fragment. The
 * shell seeder carries the same list, and a test pins the two together.
 */
export const DESCRIPTION_STOP_WORDS = Object.freeze([
  'a', 'an', 'the', 'and', 'or', 'but', 'nor', 'of', 'to', 'in', 'on', 'at',
  'by', 'for', 'from', 'with', 'into', 'onto', 'via', 'per', 'than', 'that',
  'this', 'these', 'those', 'which', 'who', 'whom', 'whose', 'what', 'when',
  'where', 'while', 'if', 'then', 'so', 'as', 'is', 'are', 'was', 'were',
  'be', 'been', 'being', 'it', 'its', 'not', 'no', 'also', 'both', 'each',
]);

const DESCRIPTION_STOP_WORD_SET = new Set(DESCRIPTION_STOP_WORDS);

// ───────────────────────────────────────────────────────────────────
// 3. PHRASE HELPERS
// ───────────────────────────────────────────────────────────────────

function normalizedWords(value) {
  if (typeof value !== 'string') return [];
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

function trimTrailingStopWords(words) {
  const trimmed = [...words];
  while (trimmed.length > 0 && DESCRIPTION_STOP_WORD_SET.has(trimmed[trimmed.length - 1])) {
    trimmed.pop();
  }
  return trimmed;
}

/**
 * Keeps the first eight description words, then drops trailing function words
 * so the seeded phrase reads as a topic rather than a sentence fragment.
 * @param {unknown} description Raw packet description.
 * @returns {string} Seeded description phrase, or the empty string when nothing remains.
 */
function normalizedDescriptionPhrase(description) {
  return trimTrailingStopWords(normalizedWords(description).slice(0, 8)).join(' ');
}

function usableDescription(value) {
  if (typeof value !== 'string') return '';
  const description = value.trim();
  return !description || description.startsWith('[') ? '' : description;
}

function readDescriptionJson(packetDirectory) {
  const descriptionPath = path.join(packetDirectory, 'description.json');
  if (!fs.existsSync(descriptionPath)) return '';

  try {
    const parsed = JSON.parse(fs.readFileSync(descriptionPath, 'utf8'));
    return usableDescription(parsed?.description);
  } catch {
    return '';
  }
}

function packetDescription(file, kind, frontmatter) {
  const packetDirectory = path.dirname(file);
  let description = kind === 'spec'
    ? usableDescription(frontmatter.data.description)
    : '';

  if (kind === 'acceptanceCriteria') {
    const specPath = path.join(packetDirectory, 'spec.md');
    if (fs.existsSync(specPath)) {
      try {
        const specFrontmatter = parseFrontmatter(fs.readFileSync(specPath, 'utf8'));
        if (specFrontmatter.ok) description = usableDescription(specFrontmatter.data.description);
      } catch {
        description = '';
      }
    }
  }

  return description || readDescriptionJson(packetDirectory);
}

export function seededPhrases(file, kind, description) {
  const slug = path.basename(path.dirname(file))
    .replace(/^\d{3}-/, '')
    .replace(/-/g, ' ');

  if (kind === 'acceptanceCriteria') return [`${slug} acceptance criteria`];
  if (kind === 'plan') return [`${slug} plan`];
  if (kind === 'tasks') return [`${slug} tasks`];
  if (kind === 'implementationSummary') return [`${slug} implementation summary`];

  const descriptionPhrase = normalizedDescriptionPhrase(description);
  const phrases = [slug];

  if (descriptionPhrase && descriptionPhrase !== slug) {
    phrases.push(descriptionPhrase);
  }

  return [...new Set(phrases)];
}

function formatPhraseRows(phrases, templateRows) {
  const indent = templateRows[0].match(/^\s*/)?.[0] ?? '  ';
  return phrases.map((phrase) => `${indent}- ${JSON.stringify(phrase)}`);
}

function replaceRanges(content, ranges, replacementRows) {
  let updated = content;
  const orderedRanges = [...ranges].sort((left, right) => right.startOffset - left.startOffset);

  for (const range of orderedRanges) {
    const replacement = replacementRows.join(range.lineEnding);
    updated = `${updated.slice(0, range.startOffset)}${replacement}${updated.slice(range.endOffset)}`;
  }

  return updated;
}

/**
 * Normalized keys of the phrases the list keeps once the matched template
 * blocks are removed. Re-parsing the trimmed document makes each surviving
 * entry authoritative, so a seed that repeats one of them can be dropped.
 * @param {string} content Markdown content.
 * @param {Array<{ startOffset: number, endOffset: number, lineEnding: string }>} ranges Matched block ranges.
 * @returns {Set<string>} Normalized surviving phrase keys.
 */
function survivingPhraseKeys(content, ranges) {
  const remaining = replaceRanges(content, ranges, []);
  const parsed = parseFrontmatter(remaining);
  if (!parsed.ok || !Array.isArray(parsed.data?.trigger_phrases)) return new Set();

  const keys = new Set();
  for (const phrase of parsed.data.trigger_phrases) {
    const key = normalizeTriggerText(phrase);
    if (key) keys.add(key);
  }
  return keys;
}

function seededRowsFor(file, kind, description, template, surviving) {
  const phrases = [];
  for (const seed of seededPhrases(file, kind, description)) {
    const key = normalizeTriggerText(seed);
    // A surviving phrase outranks a seed: reseeding it would repeat an entry
    // the list already carries once both sides are normalized.
    if (!key || surviving.has(key)) continue;
    phrases.push(seed);
    surviving.add(key);
  }
  return formatPhraseRows(phrases, template.rows);
}

function sha256(content) {
  return crypto.createHash('sha256').update(content, 'utf8').digest('hex');
}

function reportIssue(issues, file, root, reason) {
  issues.push({ path: relativeDocumentPath(file, root), reason });
}

// ───────────────────────────────────────────────────────────────────
// 4. CLEANUP
// ───────────────────────────────────────────────────────────────────

/**
 * Rewrites each trigger phrase that exists only because an earlier seed kept
 * eight description words verbatim. A phrase that still ends on a stop word
 * gets the same trim a fresh seed gets, and is dropped when the trim empties it
 * or lands on a phrase the list already carries.
 * @param {Array<{ phrase: unknown, line: string, startOffset: number, contentEnd: number, deleteEnd: number }>} entries Mapped trigger phrase rows.
 * @returns {Array<{ startOffset: number, endOffset: number, replacement: string, oldLine: string, newLine: string }>} Entry edits in document order.
 */
function descriptionStopWordEdits(entries) {
  const keys = new Set(entries.map((entry) => normalizeTriggerText(entry.phrase)).filter(Boolean));
  const edits = [];

  for (const entry of entries) {
    const words = normalizedWords(entry.phrase);
    if (words.length !== 8 || !DESCRIPTION_STOP_WORD_SET.has(words[words.length - 1])) continue;

    const trimmed = trimTrailingStopWords(words).join(' ');
    const key = normalizeTriggerText(trimmed);
    if (trimmed === '' || keys.has(key)) {
      edits.push({
        startOffset: entry.startOffset,
        endOffset: entry.deleteEnd,
        replacement: '',
        oldLine: entry.line,
        newLine: '',
      });
      continue;
    }

    const replacement = formatPhraseRows([trimmed], [entry.line])[0];
    keys.add(key);
    edits.push({
      startOffset: entry.startOffset,
      endOffset: entry.contentEnd,
      replacement,
      oldLine: entry.line,
      newLine: replacement,
    });
  }

  return edits;
}

/**
 * Plans the description stop-word trim for one spec list. Only spec.md carries
 * a description-derived phrase, so other kinds keep their plan untouched.
 * @param {string} content Markdown content.
 * @returns {{ updated: string, oldBlocks: string[], newBlocks: string[] } | null} Planned change, or null when no entry needs the trim.
 */
function planDescriptionStopWordTrim(content) {
  const frontmatter = parseFrontmatter(content);
  if (!frontmatter.ok) return null;
  const entries = findTriggerPhraseEntries(frontmatter);
  if (entries === null) return null;

  const edits = descriptionStopWordEdits(entries);
  if (edits.length === 0) return null;

  let updated = content;
  for (const edit of [...edits].sort((left, right) => right.startOffset - left.startOffset)) {
    updated = `${updated.slice(0, edit.startOffset)}${edit.replacement}${updated.slice(edit.endOffset)}`;
  }

  return {
    updated,
    oldBlocks: edits.map((edit) => edit.oldLine),
    newBlocks: edits.map((edit) => edit.newLine),
  };
}

/**
 * Plans the phrase change for one document. The exact-block path keeps its
 * existing behavior; otherwise a partially default list is cleaned in place.
 * A spec list then gets the description stop-word trim over the phrase rows
 * that remain.
 * @param {string} file Absolute document path.
 * @param {string} kind Document kind.
 * @param {string} content Markdown content.
 * @param {ReturnType<typeof parseFrontmatter>} frontmatter Parsed frontmatter.
 * @param {{ rows: string[], phrases: string[] }} template Template defaults for the kind.
 * @returns {{ updated: string, oldBlocks: string[], newBlocks: string[] } | null} Planned change, or null when the list needs none.
 */
function planDocumentChange(file, kind, content, frontmatter, template) {
  const basePlan = planTemplatePhraseChange(file, kind, content, frontmatter, template);
  if (kind !== 'spec') return basePlan;

  const reseededContent = basePlan === null ? content : basePlan.updated;
  const trimPlan = planDescriptionStopWordTrim(reseededContent);
  if (trimPlan === null) return basePlan;
  if (basePlan === null) return trimPlan;

  return {
    updated: trimPlan.updated,
    oldBlocks: [...basePlan.oldBlocks, ...trimPlan.oldBlocks],
    newBlocks: [...basePlan.newBlocks, ...trimPlan.newBlocks],
  };
}

function planTemplatePhraseChange(file, kind, content, frontmatter, template) {
  const ranges = findExactTemplateBlocks(content, frontmatter, template.rows);
  if (ranges.length > 0) {
    const description = packetDescription(file, kind, frontmatter);
    const replacementRows = seededRowsFor(
      file,
      kind,
      description,
      template,
      survivingPhraseKeys(content, ranges),
    );
    const updated = replaceRanges(content, ranges, replacementRows);
    if (updated === content) return null;
    return {
      updated,
      oldBlocks: ranges.map((range) => content.slice(range.startOffset, range.endOffset)),
      newBlocks: ranges.map(() => replacementRows.join(ranges[0].lineEnding)),
    };
  }

  const carrier = classifyTriggerPhraseCarrier(frontmatter, template.phrases);
  if (!carrier || !carrier.partial) return null;

  if (carrier.nonDefaultEntries.length > 0) {
    // Defaults go; every other phrase keeps its place and no seed is appended.
    const removalRanges = carrier.defaultEntries.map((entry) => ({
      startOffset: entry.startOffset,
      endOffset: entry.deleteEnd,
      lineEnding: entry.lineEnding,
    }));
    const updated = replaceRanges(content, removalRanges, []);
    if (updated === content) return null;
    return {
      updated,
      oldBlocks: [carrier.defaultEntries.map((entry) => entry.line).join('\n')],
      newBlocks: [''],
    };
  }

  // Every phrase is a default but the full set is absent, so the list is
  // reseeded the way a full block replacement would be.
  const first = carrier.entries[0];
  const last = carrier.entries[carrier.entries.length - 1];
  const description = packetDescription(file, kind, frontmatter);
  const replacementRows = seededRowsFor(file, kind, description, template, new Set());
  const listRange = {
    startOffset: first.startOffset,
    endOffset: last.contentEnd,
    lineEnding: first.lineEnding,
  };
  const updated = replaceRanges(content, [listRange], replacementRows);
  if (updated === content) return null;
  return {
    updated,
    oldBlocks: [content.slice(first.startOffset, last.contentEnd)],
    newBlocks: [replacementRows.join(first.lineEnding)],
  };
}

/**
 * Plans or applies exact default-block replacements under a spec tree.
 * @param {string} root Spec tree root.
 * @param {{ apply: boolean, includeArchive: boolean }} options Cleanup options.
 * @param {ReturnType<typeof loadTemplateDefaults>} defaults Loaded template phrases.
 * @returns {object} Per-file changes and skipped-file diagnostics.
 */
export function runCleanup(root, options, defaults = loadTemplateDefaults()) {
  const changes = [];
  const issues = [];
  let changesFound = 0;
  let changed = 0;

  for (const file of walkDocuments(root)) {
    const kind = TARGET_KINDS[path.basename(file)];
    if (!kind) continue;
    if (!options.includeArchive && isArchivedDocument(file, root)) continue;

    let content;
    try {
      content = fs.readFileSync(file, 'utf8');
    } catch (error) {
      reportIssue(issues, file, root, `read failed: ${error instanceof Error ? error.message : String(error)}`);
      continue;
    }

    const frontmatter = parseFrontmatter(content);
    if (!frontmatter.ok) {
      reportIssue(issues, file, root, frontmatter.reason);
      continue;
    }
    if (frontmatter.data.trigger_phrases !== undefined && !Array.isArray(frontmatter.data.trigger_phrases)) {
      reportIssue(issues, file, root, 'trigger_phrases is not a YAML sequence');
      continue;
    }

    const template = defaults[kind];
    const plan = planDocumentChange(file, kind, content, frontmatter, template);
    if (plan === null) continue;

    changesFound += 1;
    const change = {
      path: relativeDocumentPath(file, root),
      kind,
      oldBlocks: plan.oldBlocks,
      newBlocks: plan.newBlocks,
    };

    if (!options.apply) {
      changes.push(change);
      continue;
    }

    try {
      const beforeHash = sha256(content);
      fs.writeFileSync(file, plan.updated, 'utf8');
      const afterHash = sha256(fs.readFileSync(file, 'utf8'));
      changes.push({ ...change, beforeHash, afterHash });
      changed += 1;
    } catch (error) {
      reportIssue(issues, file, root, `write failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  const pending = options.apply ? changed : changesFound;
  const exitCode = issues.length > 0 ? 2 : (pending > 0 ? 1 : 0);
  return {
    apply: options.apply,
    changesFound,
    changed,
    skipped: issues.length,
    issues,
    changes,
    exitCode,
  };
}

function parseArgs(argv) {
  const parsed = { apply: false, includeArchive: false, json: false, root: 'specs' };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--apply') {
      parsed.apply = true;
      continue;
    }
    if (arg === '--include-archive') {
      parsed.includeArchive = true;
      continue;
    }
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

function renderBlock(label, block) {
  const indented = block.split('\n').map((line) => `    ${line}`).join('\n');
  return `  ${label}:\n${indented}`;
}

function formatSummary(report) {
  const lines = [];
  for (const change of report.changes) {
    lines.push(`${change.path}: ${report.apply ? 'written' : 'would change'}`);
    if (report.apply) {
      lines.push(`  sha256 before: ${change.beforeHash}`);
      lines.push(`  sha256 after:  ${change.afterHash}`);
    } else {
      for (let index = 0; index < change.oldBlocks.length; index += 1) {
        lines.push(renderBlock('old block', change.oldBlocks[index]));
        lines.push(renderBlock('new block', change.newBlocks[index]));
      }
    }
  }
  for (const issue of report.issues) lines.push(`${issue.path}: skipped: ${issue.reason}`);

  const count = report.apply
    ? (report.changed === 0 ? 'nothing to change' : `applied ${report.changed} file(s)`)
    : `${report.changesFound} file(s) would change`;
  lines.push(`${SCRIPT}: ${count}; ${report.skipped} skipped; ${report.issues.length} error(s)`);
  return `${lines.join('\n')}\n`;
}

function emitError(message, json) {
  if (json) process.stdout.write(`${JSON.stringify({ error: message })}\n`);
  else process.stderr.write(`${SCRIPT}: ${message}\n`);
}

function isDirectRun() {
  return process.argv[1] !== undefined && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
}

function main(argv) {
  let options;
  try {
    options = parseArgs(argv);
  } catch (error) {
    emitError(error instanceof Error ? error.message : String(error), argv.includes('--json'));
    return 2;
  }

  const root = path.resolve(process.cwd(), options.root);
  if (!fs.existsSync(root) || !fs.statSync(root).isDirectory()) {
    emitError(`root directory is missing: ${root}`, options.json);
    return 2;
  }

  try {
    const report = runCleanup(root, options);
    process.stdout.write(options.json ? `${JSON.stringify(report, null, 2)}\n` : formatSummary(report));
    return report.exitCode;
  } catch (error) {
    emitError(error instanceof Error ? error.message : String(error), options.json);
    return 2;
  }
}

if (isDirectRun()) process.exitCode = main(process.argv.slice(2));
