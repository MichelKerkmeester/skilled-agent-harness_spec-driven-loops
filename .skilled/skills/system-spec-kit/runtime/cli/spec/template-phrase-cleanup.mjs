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
  findExactTemplateBlocks,
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
});

// ───────────────────────────────────────────────────────────────────
// 3. PHRASE HELPERS
// ───────────────────────────────────────────────────────────────────

function normalizedDescriptionPhrase(description) {
  if (typeof description !== 'string') return '';
  return description
    .toLowerCase()
    .replace(/[^a-z0-9]/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 8)
    .join(' ');
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

function seededPhrases(file, kind, description) {
  const slug = path.basename(path.dirname(file))
    .replace(/^\d{3}-/, '')
    .replace(/-/g, ' ');

  if (kind === 'acceptanceCriteria') return [`${slug} acceptance criteria`];

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
    const ranges = findExactTemplateBlocks(content, frontmatter, template.rows);
    if (ranges.length === 0) continue;

    const description = packetDescription(file, kind, frontmatter);
    const surviving = survivingPhraseKeys(content, ranges);
    const phrases = [];
    for (const seed of seededPhrases(file, kind, description)) {
      const key = normalizeTriggerText(seed);
      // A surviving phrase outranks a seed: reseeding it would repeat an entry
      // the list already carries once both sides are normalized.
      if (!key || surviving.has(key)) continue;
      phrases.push(seed);
      surviving.add(key);
    }
    const replacementRows = formatPhraseRows(phrases, template.rows);
    const updated = replaceRanges(content, ranges, replacementRows);
    if (updated === content) continue;

    changesFound += 1;
    const oldBlocks = ranges.map((range) => content.slice(range.startOffset, range.endOffset));
    const newBlocks = ranges.map(() => replacementRows.join(ranges[0].lineEnding));
    const change = {
      path: relativeDocumentPath(file, root),
      kind,
      oldBlocks,
      newBlocks,
    };

    if (!options.apply) {
      changes.push(change);
      continue;
    }

    try {
      const beforeHash = sha256(content);
      fs.writeFileSync(file, updated, 'utf8');
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
