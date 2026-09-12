#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Repo rules corpus checker
// ───────────────────────────────────────────────────────────────────
// The corpus under repo-rules/ is hand-maintained and nothing else reads it:
// ordinary link checkers walk other roots, and no hook or workflow touches the
// router. One report keeps files, router rows, phrases and structure in
// agreement, so drift fails here instead of surfacing later as a rule that
// silently never loads.
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('node:fs');
const path = require('node:path');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const TAG = '[repo-rules-check]';
const ROUTER_FILE = 'REPO RULES.md';
const RULES_DIR = 'repo-rules';
const LINE_LIMIT = 250;
const NAME_WIDTH = 19;
const REQUIRED_KEYS = [
  'title',
  'description',
  'trigger_phrases',
  'importance_tier',
  'contextType',
  'version'
];

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

// Walk up from the script so the command works from anywhere in the tree.
function findRepoRoot(startDir) {
  let current = path.resolve(startDir);
  for (;;) {
    const hasRouter = fs.existsSync(path.join(current, ROUTER_FILE));
    const hasRules = fs.existsSync(path.join(current, RULES_DIR));
    if (hasRouter && hasRules) return current;
    const parent = path.dirname(current);
    if (parent === current) return null;
    current = parent;
  }
}

// Count displayed lines; a single trailing newline is a terminator, not a line.
function lineCount(content) {
  const lines = content.split(/\r\n|\r|\n/u);
  if (lines.length > 0 && lines[lines.length - 1] === '') lines.pop();
  return lines.length;
}

function frontmatterRange(lines) {
  if (lines[0] === undefined || lines[0].trim() !== '---') return null;
  for (let index = 1; index < lines.length; index += 1) {
    if (lines[index].trim() === '---') return { start: 1, end: index };
  }
  return null;
}

function parseTriggerPhrases(lines, range) {
  const phrases = [];
  if (range === null) return phrases;
  let inList = false;
  for (let index = range.start; index < range.end; index += 1) {
    const line = lines[index];
    if (/^trigger_phrases\s*:/u.test(line)) {
      inList = true;
      continue;
    }
    if (!inList) continue;
    const item = line.match(/^\s+-\s+(.*)$/u);
    if (item === null) break;
    const value = item[1].trim().replace(/^"(.*)"$/u, '$1').replace(/^'(.*)'$/u, '$1').trim();
    if (value !== '') phrases.push(value);
  }
  return phrases;
}

function parseTopLevelKeys(lines, range) {
  const keys = new Set();
  if (range === null) return keys;
  for (let index = range.start; index < range.end; index += 1) {
    const match = lines[index].match(/^([A-Za-z_][A-Za-z0-9_]*)\s*:/u);
    if (match !== null) keys.add(match[1]);
  }
  return keys;
}

function extractLinks(text) {
  const links = [];
  const pattern = /\]\(([^)]+)\)/gu;
  let match = pattern.exec(text);
  while (match !== null) {
    links.push(match[1].trim());
    match = pattern.exec(text);
  }
  return links;
}

function normalizeTarget(target) {
  const withoutAnchor = target.split('#')[0];
  try {
    return decodeURIComponent(withoutAnchor);
  } catch {
    return withoutAnchor;
  }
}

function isExternal(target) {
  return /^[a-z][a-z0-9+.-]*:/iu.test(target);
}

// Table rows only: the header row opens the table, separator rows are skipped,
// and a `---` closes the section the way the next heading does.
function splitRouterSections(lines) {
  const sections = new Map();
  let current = null;
  let headerSeen = false;
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const heading = line.match(/^##\s+(\d+)\./u);
    if (heading !== null) {
      current = heading[1];
      headerSeen = false;
      sections.set(current, []);
      continue;
    }
    if (line.trim() === '---') {
      current = null;
      continue;
    }
    if (current === null || !line.trim().startsWith('|')) continue;
    if (/^\|[\s:|-]+\|$/u.test(line.trim())) continue;
    if (!headerSeen) {
      headerSeen = true;
      continue;
    }
    sections.get(current).push({
      lineNumber: index + 1,
      text: line,
      links: extractLinks(line)
    });
  }
  return sections;
}

function summarize(problems) {
  const shown = problems.slice(0, 4).join('; ');
  const extra = problems.length > 4 ? ` (+${problems.length - 4} more)` : '';
  return `${shown}${extra}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

function loadContext(root) {
  const routerLines = fs.readFileSync(path.join(root, ROUTER_FILE), 'utf8').split(/\r\n|\r|\n/u);
  const sections = splitRouterSections(routerLines);

  const rules = fs
    .readdirSync(path.join(root, RULES_DIR))
    .filter((name) => name.endsWith('.md'))
    .sort()
    .map((name) => {
      const content = fs.readFileSync(path.join(root, RULES_DIR, name), 'utf8');
      const lines = content.split(/\r\n|\r|\n/u);
      const range = frontmatterRange(lines);
      const body = range === null ? lines : lines.slice(range.end + 1);
      return {
        name,
        lines: lineCount(content),
        phrases: parseTriggerPhrases(lines, range),
        keys: parseTopLevelKeys(lines, range),
        dividers: body.filter((line) => line.trim() === '---').length,
        sections: body.filter((line) => /^##\s+\d+\./u.test(line)).length
      };
    });

  return {
    root,
    rules,
    triggerRows: sections.get('2') || [],
    indexRows: sections.get('3') || []
  };
}

// 1. Files, trigger rows and index rows stay the same count.
function checkCounts(context) {
  const files = context.rules.length;
  const triggerRows = context.triggerRows.length;
  const indexRows = context.indexRows.length;
  const ok = files === triggerRows && triggerRows === indexRows;
  return { ok, detail: `files=${files} triggerRows=${triggerRows} indexRows=${indexRows}` };
}

// 2. Every rule has both rows, and every linked target exists.
function checkWiring(context) {
  const problems = [];
  const linkedBy = { trigger: new Set(), index: new Set() };
  const visit = (rows, kind) => {
    for (const row of rows) {
      if (row.links.length === 0) problems.push(`line ${row.lineNumber}: ${kind} row has no link`);
      for (const link of row.links) {
        const target = normalizeTarget(link);
        if (!isExternal(target) && !fs.existsSync(path.resolve(context.root, target))) {
          problems.push(`line ${row.lineNumber}: missing ${target}`);
        }
        if (target.startsWith(`${RULES_DIR}/`)) linkedBy[kind].add(path.basename(target));
      }
    }
  };
  visit(context.triggerRows, 'trigger');
  visit(context.indexRows, 'index');

  for (const rule of context.rules) {
    if (!linkedBy.trigger.has(rule.name)) problems.push(`${rule.name}: no trigger row`);
    if (!linkedBy.index.has(rule.name)) problems.push(`${rule.name}: no index row`);
  }

  return {
    ok: problems.length === 0,
    detail: problems.length === 0
      ? `files=${context.rules.length} triggerRows=${context.triggerRows.length} indexRows=${context.indexRows.length} all links resolve`
      : summarize(problems)
  };
}

// 3. No trigger phrase is claimed by two different rule files.
function checkTriggerPhraseUniqueness(context) {
  const owners = new Map();
  for (const rule of context.rules) {
    for (const phrase of rule.phrases) {
      const key = phrase.toLowerCase();
      if (!owners.has(key)) owners.set(key, new Set());
      owners.get(key).add(rule.name);
    }
  }
  const collisions = [];
  for (const [phrase, files] of owners) {
    if (files.size > 1) collisions.push(`"${phrase}" in ${[...files].join(', ')}`);
  }
  return {
    ok: collisions.length === 0,
    detail: collisions.length === 0
      ? `phrases=${owners.size} collisions=0`
      : summarize(collisions)
  };
}

// 4. No rule file exceeds the hard line ceiling.
function checkLineCeiling(context) {
  const offenders = context.rules
    .filter((rule) => rule.lines > LINE_LIMIT)
    .map((rule) => `${rule.name}: ${rule.lines} lines`);
  const longest = context.rules.reduce((max, rule) => Math.max(max, rule.lines), 0);
  return {
    ok: offenders.length === 0,
    detail: offenders.length === 0
      ? `max=${longest} limit=${LINE_LIMIT}`
      : summarize(offenders)
  };
}

// 5. Every rule carries the six-key frontmatter contract.
function checkFrontmatterKeys(context) {
  const missing = [];
  for (const rule of context.rules) {
    const absent = REQUIRED_KEYS.filter((key) => !rule.keys.has(key));
    if (absent.length > 0) missing.push(`${rule.name}: missing ${absent.join(', ')}`);
  }
  return {
    ok: missing.length === 0,
    detail: missing.length === 0
      ? `files=${context.rules.length} keys=${REQUIRED_KEYS.length}`
      : summarize(missing)
  };
}

// 6. Dividers equal numbered sections in each body after the frontmatter.
function checkDividerParity(context) {
  const offenders = context.rules
    .filter((rule) => rule.dividers !== rule.sections)
    .map((rule) => `${rule.name}: ${rule.dividers} dividers vs ${rule.sections} sections`);
  return {
    ok: offenders.length === 0,
    detail: offenders.length === 0
      ? `files=${context.rules.length}`
      : summarize(offenders)
  };
}

const CHECKS = [
  ['count parity', checkCounts],
  ['row coverage', checkWiring],
  ['phrase uniqueness', checkTriggerPhraseUniqueness],
  ['line ceiling', checkLineCeiling],
  ['frontmatter keys', checkFrontmatterKeys],
  ['divider parity', checkDividerParity]
];

function main() {
  const root = findRepoRoot(__dirname);
  if (root === null) {
    console.error(`${TAG} ERROR: no ${ROUTER_FILE} with a ${RULES_DIR}/ directory found above ${__dirname}`);
    return 2;
  }

  const context = loadContext(root);
  let failed = 0;
  CHECKS.forEach(([name, run], index) => {
    const result = run(context);
    if (!result.ok) failed += 1;
    const verdict = result.ok ? 'PASS' : 'FAIL';
    console.log(`${TAG} ${index + 1}/${CHECKS.length} ${verdict} ${name.padEnd(NAME_WIDTH)} - ${result.detail}`);
  });

  const passed = CHECKS.length - failed;
  console.log(`${TAG} RESULT: ${failed === 0 ? 'PASSED' : 'FAILED'} (${passed}/${CHECKS.length} checks)`);
  return failed === 0 ? 0 : 1;
}

if (require.main === module) {
  try {
    process.exitCode = main();
  } catch (error) {
    console.error(`${TAG} ERROR: ${error.message}`);
    process.exitCode = 2;
  }
}
