#!/usr/bin/env node
// ====================================================================
// check-skill-doc-frontmatter.mjs — canonical frontmatter contract
//                                    checker for skill reference/asset docs
// ====================================================================
// Dependency-free on purpose: CI and per-phase authoring runs invoke it
// at the repo root without an npm install. Parsing mirrors the harvest
// semantics in lib/skill-graph/doc-frontmatter.ts (leading fence only,
// block + inline list forms, trim before quote-strip).
//
// Contract (references/assets, README.md exempt):
//   title            non-empty
//   description      non-empty
//   trigger_phrases  3-8 non-empty items
//   importance_tier  constitutional|critical|important|normal|temporary|deprecated
//   contextType      planning|research|implementation|general
//
// Modes:
//   --shape    (default) a doc carrying ANY detailed field must be fully valid;
//              docs with title+description only, or no frontmatter, pass.
//   --coverage every reference/asset doc must carry the full valid block.
//
// Output: one "FAIL <path>: <reason>" line per violation, then a summary.
// Exit: 0 when no violations, 1 otherwise.

import { readdirSync, readFileSync } from 'node:fs';
import { join, relative, basename } from 'node:path';

const IMPORTANCE_TIERS = new Set([
  'constitutional', 'critical', 'important', 'normal', 'temporary', 'deprecated',
]);
const CONTEXT_TYPES = new Set(['planning', 'research', 'implementation', 'general']);
const DETAILED_FIELDS = ['trigger_phrases', 'importance_tier', 'contextType'];
const DOC_SUBDIRS = ['references', 'assets'];

function parseArgs(argv) {
  const opts = { root: '.', mode: 'shape', skill: null };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--shape') opts.mode = 'shape';
    else if (arg === '--coverage') opts.mode = 'coverage';
    else if (arg === '--skill') { opts.skill = argv[i + 1] ?? null; i += 1; }
    else if (!arg.startsWith('-')) opts.root = arg;
    else {
      process.stderr.write(`unknown option: ${arg}\n`);
      process.exit(2);
    }
  }
  return opts;
}

function cleanScalar(raw) {
  let value = raw.trim();
  if (
    value.length >= 2 &&
    ((value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'")))
  ) {
    value = value.slice(1, -1).trim();
  }
  return value;
}

function parseFrontmatter(content) {
  if (!content.startsWith('---')) return null;
  const lines = content.split('\n');
  if (lines[0].trim() !== '---') return null;
  let end = -1;
  for (let i = 1; i < lines.length; i += 1) {
    if (lines[i].trim() === '---') { end = i; break; }
  }
  if (end === -1) return null;

  const fields = {};
  for (let i = 1; i < end; i += 1) {
    const line = lines[i];
    const keyMatch = /^([A-Za-z_][A-Za-z0-9_]*):(.*)$/.exec(line);
    if (!keyMatch) continue; // indented continuation or list item — handled below
    const key = keyMatch[1];
    const rest = keyMatch[2];

    if (key === 'trigger_phrases') {
      const inline = rest.trim();
      if (inline.startsWith('[')) {
        const body = inline.replace(/^\[/, '').replace(/\]\s*$/, '');
        fields.trigger_phrases = body
          .split(',')
          .map((item) => cleanScalar(item))
          .filter((item) => item.length > 0);
      } else {
        const items = [];
        for (let j = i + 1; j < end; j += 1) {
          const itemMatch = /^\s+-\s*(.*)$/.exec(lines[j]);
          if (!itemMatch) break;
          const item = cleanScalar(itemMatch[1]);
          if (item.length > 0) items.push(item);
        }
        fields.trigger_phrases = items;
      }
    } else {
      fields[key] = cleanScalar(rest);
    }
  }
  return fields;
}

function validateBlock(fields) {
  const problems = [];
  if (!fields.title) problems.push('title missing or empty');
  if (!fields.description) problems.push('description missing or empty');
  const phrases = fields.trigger_phrases;
  if (!Array.isArray(phrases) || phrases.length === 0) {
    problems.push('trigger_phrases missing or empty');
  } else if (phrases.length < 3 || phrases.length > 8) {
    problems.push(`trigger_phrases must have 3-8 items (found ${phrases.length})`);
  }
  if (!fields.importance_tier) {
    problems.push('importance_tier missing');
  } else if (!IMPORTANCE_TIERS.has(fields.importance_tier)) {
    problems.push(`importance_tier "${fields.importance_tier}" not in {${[...IMPORTANCE_TIERS].join('|')}}`);
  }
  if (!fields.contextType) {
    problems.push('contextType missing');
  } else if (!CONTEXT_TYPES.has(fields.contextType)) {
    problems.push(`contextType "${fields.contextType}" not in {${[...CONTEXT_TYPES].join('|')}}`);
  }
  return problems;
}

function listMarkdownFiles(dir) {
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return [];
  }
  const files = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...listMarkdownFiles(full));
    else if (entry.isFile() && entry.name.toLowerCase().endsWith('.md')) files.push(full);
  }
  return files;
}

const { root, mode, skill } = parseArgs(process.argv.slice(2));
const skillsRoot = join(root, '.opencode', 'skills');

let skillDirs;
try {
  skillDirs = readdirSync(skillsRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
} catch {
  process.stderr.write(`skills root not found: ${skillsRoot}\n`);
  process.exit(2);
}
if (skill) {
  if (!skillDirs.includes(skill)) {
    process.stderr.write(`unknown skill: ${skill}\n`);
    process.exit(2);
  }
  skillDirs = [skill];
}

let checked = 0;
let authored = 0;
let failures = 0;

for (const skillName of skillDirs) {
  for (const subdir of DOC_SUBDIRS) {
    for (const file of listMarkdownFiles(join(skillsRoot, skillName, subdir))) {
      if (basename(file).toLowerCase() === 'readme.md') continue;
      checked += 1;
      const relPath = relative(root, file);
      const fields = parseFrontmatter(readFileSync(file, 'utf8'));
      const carriesDetailed =
        fields !== null && DETAILED_FIELDS.some((key) => key in fields);
      if (carriesDetailed) authored += 1;

      if (mode === 'shape' && !carriesDetailed) continue;
      if (mode === 'coverage' && fields === null) {
        failures += 1;
        process.stdout.write(`FAIL ${relPath}: no leading frontmatter block\n`);
        continue;
      }

      const problems = validateBlock(fields ?? {});
      if (problems.length > 0) {
        failures += 1;
        process.stdout.write(`FAIL ${relPath}: ${problems.join('; ')}\n`);
      }
    }
  }
}

process.stdout.write(
  `${failures === 0 ? 'PASS' : 'FAIL'} mode=${mode} scope=${skill ?? 'all-skills'} ` +
  `docs=${checked} carrying-detailed-block=${authored} violations=${failures}\n`,
);
process.exit(failures === 0 ? 0 : 1);
