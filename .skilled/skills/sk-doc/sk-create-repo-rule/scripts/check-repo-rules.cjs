#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Repo rules corpus checker
// ───────────────────────────────────────────────────────────────────
// The corpus is hand-maintained and nothing else reads it: ordinary link
// checkers walk other roots, and no hook or workflow touches the router or the
// bodies of the rule files themselves. One report keeps files, router rows,
// phrases, structure, body links and firing conditions in agreement, so drift
// fails here instead of surfacing later as a rule that silently never loads or
// points at a file that is gone. Generated rule cards are held to the same
// standard: each committed card must equal the one its rule renders today.
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('node:fs');
const path = require('node:path');
const { exitIfValidationOff } = require('../../shared/scripts/validation-switch.cjs');
const { renderCard, CARDS_DIR } = require('./build-rule-cards.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const TAG = '[repo-rules-check]';
const ROUTER_FILE = 'REPO RULES.md';
// A repository that keeps its toolchain under a source root keeps the corpus
// inside it, and one that does not keeps the corpus at the repository root. The
// probe order is the whole layout decision: the first candidate that exists as a
// directory is the one this run reads, so both layouts pass the same checks.
const RULES_DIR_CANDIDATES = ['.skilled/repo-rules', 'repo-rules'];
const LINE_LIMIT = 250;
const NAME_WIDTH = 19;
// Check 10 compares words, not meaning. A Fires-when bullet is covered when one
// router item carries at least this share of its content words. Measured across
// the corpus, a bullet's own row covers a median 0.75 of its words and the best
// other row 0.17. Every bullet under 0.30 named a condition its row never did.
const COVERAGE_THRESHOLD = 0.3;
const STOP_WORDS = new Set(('a an the to of or and in on at by for with from as is are be any all that this which ' +
  'you your it its one two about into than when what how there their not will was has have can do does did own off out')
  .split(' '));
const SUFFIXES = ['ations', 'ation', 'ions', 'ion', 'ings', 'ing', 'ers', 'er', 'ed', 'es', 's', 'e'];
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

// `--root <dir>` points the checker at another tree, such as a test fixture.
function parseRootArg(argv) {
  const index = argv.indexOf('--root');
  return index !== -1 && argv[index + 1] ? path.resolve(argv[index + 1]) : null;
}

// Walk up from the script so the command works from anywhere in the tree.
function findRepoRoot(startDir) {
  let current = path.resolve(startDir);
  for (;;) {
    const hasRouter = fs.existsSync(path.join(current, ROUTER_FILE));
    const rulesDir = resolveRulesDir(current);
    if (hasRouter && rulesDir !== null) return { root: current, rulesDir };
    const parent = path.dirname(current);
    if (parent === current) return null;
    current = parent;
  }
}

// The rules directory of one candidate root, or null when that root has none.
function resolveRulesDir(root) {
  for (const candidate of RULES_DIR_CANDIDATES) {
    const absolute = path.join(root, candidate);
    if (fs.existsSync(absolute) && fs.statSync(absolute).isDirectory()) return candidate;
  }
  return null;
}

// A router row belongs to the corpus when its link resolves into a rules
// directory, whichever layout this checkout uses and whichever spelling the row
// carries. Resolving instead of matching a prefix keeps rows recognized while a
// corpus is mid-move, when the rows may still name the public path and that
// path is a link into the canonical one.
function ruleLinkDir(context, target) {
  let resolved;
  try {
    resolved = fs.realpathSync(path.resolve(context.root, target));
  } catch {
    return null;
  }
  for (const candidate of RULES_DIR_CANDIDATES) {
    let dirAbsolute;
    try {
      dirAbsolute = fs.realpathSync(path.resolve(context.root, candidate));
    } catch {
      continue;
    }
    if (path.dirname(resolved) === dirAbsolute) return candidate;
  }
  return null;
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

function parseDescription(lines, range) {
  if (range === null) return null;
  for (let index = range.start; index < range.end; index += 1) {
    const match = lines[index].match(/^description\s*:\s*(.*)$/u);
    if (match === null) continue;
    return match[1].trim().replace(/^"(.*)"$/u, '$1').replace(/^'(.*)'$/u, '$1').trim();
  }
  return null;
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

// Content words, crudely stemmed, so "fails" and "failure" can meet.
function contentWords(text) {
  const words = new Set();
  const plain = text.replace(/\]\([^)]*\)/gu, ']').toLowerCase();
  for (const word of plain.match(/[a-z]+/gu) || []) {
    if (word.length < 3 || STOP_WORDS.has(word)) continue;
    const suffix = SUFFIXES.find((candidate) => word.endsWith(candidate) && word.length - candidate.length >= 4);
    words.add(suffix === undefined ? word : word.slice(0, -suffix.length));
  }
  return words;
}

// Two stems meet when equal, or when the shorter, at four letters or more,
// begins the longer: "auth" meets "authentication".
function wordsMeet(left, right) {
  if (left === right) return true;
  const [shorter, longer] = left.length <= right.length ? [left, right] : [right, left];
  return shorter.length >= 4 && longer.startsWith(shorter);
}

function coverage(bulletWords, itemWords) {
  if (bulletWords.size === 0) return 1;
  let met = 0;
  for (const word of bulletWords) {
    if ([...itemWords].some((other) => wordsMeet(word, other))) met += 1;
  }
  return met / bulletWords.size;
}

function summarize(problems) {
  const shown = problems.slice(0, 4).join('; ');
  const extra = problems.length > 4 ? ` (+${problems.length - 4} more)` : '';
  return `${shown}${extra}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

function loadContext(root, rulesDir) {
  const routerLines = fs.readFileSync(path.join(root, ROUTER_FILE), 'utf8').split(/\r\n|\r|\n/u);
  const sections = splitRouterSections(routerLines);

  const rules = fs
    .readdirSync(path.join(root, rulesDir))
    .filter((name) => name.endsWith('.md'))
    .sort()
    .map((name) => {
      const content = fs.readFileSync(path.join(root, rulesDir, name), 'utf8');
      const lines = content.split(/\r\n|\r|\n/u);
      const range = frontmatterRange(lines);
      const bodyStart = range === null ? 0 : range.end + 1;
      const body = lines.slice(bodyStart);
      return {
        name,
        content,
        lines: lineCount(content),
        phrases: parseTriggerPhrases(lines, range),
        keys: parseTopLevelKeys(lines, range),
        description: parseDescription(lines, range),
        dividers: body.filter((line) => line.trim() === '---').length,
        sections: body.filter((line) => /^##\s+\d+\./u.test(line)).length,
        body,
        bodyStartLine: bodyStart + 1
      };
    });

  return {
    root,
    rulesDir,
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
        if (!isExternal(target) && ruleLinkDir(context, target) !== null) linkedBy[kind].add(path.basename(target));
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

// 7. Every link inside a rule body resolves, relative to the rules directory.
function checkRuleLinks(context) {
  const problems = [];
  let links = 0;
  for (const rule of context.rules) {
    rule.body.forEach((line, index) => {
      for (const link of extractLinks(line)) {
        const target = normalizeTarget(link);
        if (isExternal(target)) continue;
        links += 1;
        if (!fs.existsSync(path.resolve(context.root, context.rulesDir, target))) {
          problems.push(`${rule.name}: line ${rule.bodyStartLine + index}: unresolved ${target}`);
        }
      }
    });
  }
  return {
    ok: problems.length === 0,
    detail: problems.length === 0
      ? `files=${context.rules.length} links=${links} all resolve`
      : summarize(problems)
  };
}

// 8. Every rule declares at least one firing condition, or it can never be reached.
function checkFiresWhenSections(context) {
  const problems = [];
  for (const rule of context.rules) {
    const start = rule.body.findIndex((line) => /^##\s+Fires when\s*$/u.test(line));
    if (start === -1) {
      problems.push(`${rule.name}: no "## Fires when" section`);
      continue;
    }
    let items = 0;
    for (let index = start + 1; index < rule.body.length; index += 1) {
      const line = rule.body[index];
      if (/^##\s/u.test(line)) break;
      if (/^\s*(?:[-*+]|\d+[.)])\s+\S/u.test(line)) items += 1;
    }
    if (items === 0) problems.push(`${rule.name}: empty "## Fires when" section`);
  }
  return {
    ok: problems.length === 0,
    detail: problems.length === 0
      ? `files=${context.rules.length} all declare firing conditions`
      : summarize(problems)
  };
}

// The index summary is a copy of the rule's own description, and a copy nobody compares
// drifts: seven of eleven had diverged before this check existed, invisibly to every other
// check and to CI. Whitespace is normalized because the router wraps cells and the
// frontmatter does not; the words must match exactly.
function checkIndexSummaries(context) {
  const problems = [];
  const normalize = (value) => value.replace(/\s+/gu, ' ').trim();
  const byName = new Map(context.rules.map((rule) => [rule.name, rule]));
  for (const row of context.indexRows) {
    const cells = row.text.split('|').map((cell) => cell.trim());
    const summary = cells[2] === undefined ? '' : cells[2];
    const target = row.links.map(normalizeTarget).find((link) => ruleLinkDir(context, link) !== null);
    if (target === undefined) continue;
    const rule = byName.get(path.basename(target));
    if (rule === undefined) continue;
    if (rule.description === null) {
      problems.push(`${rule.name}: no description in frontmatter`);
      continue;
    }
    if (normalize(summary) !== normalize(rule.description)) {
      problems.push(`line ${row.lineNumber}: ${rule.name} summary differs from its description`);
    }
  }
  return {
    ok: problems.length === 0,
    detail: problems.length === 0
      ? `indexRows=${context.indexRows.length} every summary matches its rule's description`
      : summarize(problems)
  };
}

// 10. Every Fires-when bullet has a counterpart in its rule's router row, because
// Gate 5 loads by the row: a condition the row never names is one no session is
// sent to the rule for. A bullet whose head ends in a colon is also scored on the
// head alone, so a long list of examples does not hide a covered condition.
function checkFiresWhenCoverage(context) {
  const problems = [];
  let bullets = 0;
  const rows = new Map();
  for (const row of context.triggerRows) {
    const target = row.links.map(normalizeTarget).find((link) => ruleLinkDir(context, link) !== null);
    if (target === undefined) continue;
    const cells = row.text.split('|');
    const items = (cells[1] || '').split('·').map(contentWords);
    rows.set(path.basename(target), { lineNumber: row.lineNumber, items });
  }
  for (const rule of context.rules) {
    const row = rows.get(rule.name);
    const start = rule.body.findIndex((line) => /^##\s+Fires when\s*$/u.test(line));
    if (row === undefined || start === -1) continue;
    for (let index = start + 1; index < rule.body.length; index += 1) {
      const line = rule.body[index];
      if (/^##\s/u.test(line)) break;
      const bullet = line.match(/^\s*(?:[-*+]|\d+[.)])\s+(.*)$/u);
      if (bullet === null) continue;
      bullets += 1;
      const text = bullet[1].trim();
      const head = text.includes(': ') ? text.slice(0, text.indexOf(': ')) : null;
      const score = (words) => Math.max(...row.items.map((item) => coverage(words, item)));
      const best = Math.max(score(contentWords(text)), head === null ? 0 : score(contentWords(head)));
      if (best < COVERAGE_THRESHOLD) {
        problems.push(`${rule.name}: "${text}" has no counterpart in router line ${row.lineNumber}`);
      }
    }
  }
  return {
    ok: problems.length === 0,
    detail: problems.length === 0
      ? `bullets=${bullets} every bullet has a router counterpart (threshold ${COVERAGE_THRESHOLD})`
      : problems.join('; ')
  };
}

// 11. Every committed card equals the card its rule renders now. A card is a
// verbatim copy, so any difference is a rule edit nobody regenerated, a card
// left behind by a removed rule, or a rule whose card was never built. A corpus
// without a cards directory has opted out of cards and passes.
function checkCardSync(context) {
  const cardsDirAbs = path.join(context.root, context.rulesDir, CARDS_DIR);
  if (!fs.existsSync(cardsDirAbs) || !fs.statSync(cardsDirAbs).isDirectory()) {
    return { ok: true, detail: 'no cards directory' };
  }
  const present = new Set(fs
    .readdirSync(cardsDirAbs, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
    .map((entry) => entry.name));
  const problems = [];
  const ruleNames = new Set();
  for (const rule of context.rules) {
    ruleNames.add(rule.name);
    let expected;
    try {
      expected = renderCard(rule.name, rule.content);
    } catch (error) {
      problems.push(`${CARDS_DIR}/${rule.name}: cannot render (${error.message})`);
      continue;
    }
    if (!present.has(rule.name)) {
      problems.push(`${CARDS_DIR}/${rule.name}: missing`);
    } else if (fs.readFileSync(path.join(cardsDirAbs, rule.name), 'utf8') !== expected) {
      problems.push(`${CARDS_DIR}/${rule.name}: drifted from its rule`);
    }
  }
  for (const name of [...present].sort()) {
    if (!ruleNames.has(name)) problems.push(`${CARDS_DIR}/${name}: orphaned, no rule backs it`);
  }
  return {
    ok: problems.length === 0,
    detail: problems.length === 0
      ? `cards=${present.size} every card matches its rule`
      : problems.join('; ')
  };
}

const CHECKS = [
  ['count parity', checkCounts],
  ['row coverage', checkWiring],
  ['phrase uniqueness', checkTriggerPhraseUniqueness],
  ['line ceiling', checkLineCeiling],
  ['frontmatter keys', checkFrontmatterKeys],
  ['divider parity', checkDividerParity],
  ['rule links', checkRuleLinks],
  ['fires-when sections', checkFiresWhenSections],
  ['index summaries', checkIndexSummaries],
  ['fires-when coverage', checkFiresWhenCoverage],
  ['card sync', checkCardSync]
];

function main() {
  exitIfValidationOff('check-repo-rules.cjs');
  const rootArg = parseRootArg(process.argv.slice(2));
  const located = findRepoRoot(rootArg || __dirname);
  if (located === null || (rootArg !== null && located.root !== rootArg)) {
    console.error(`${TAG} ERROR: no ${ROUTER_FILE} with a ${RULES_DIR_CANDIDATES.join(' or ')} directory found at ${rootArg || `or above ${__dirname}`}`);
    return 2;
  }

  const context = loadContext(located.root, located.rulesDir);
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
