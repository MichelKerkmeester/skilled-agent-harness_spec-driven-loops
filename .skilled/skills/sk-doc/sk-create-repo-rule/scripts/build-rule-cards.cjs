#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Repo rule card generator
// ───────────────────────────────────────────────────────────────────
// A card is the part of a rule a session needs at load time: when it fires,
// what it says, and the self-check. Copying those sections by hand would drift
// the first time a rule changed, so cards are only ever generated from the rule
// files, byte for byte, and the corpus checker regenerates each one to prove the
// committed copy still matches. The full rule stays the authority and every card
// links back to it.
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('node:fs');
const path = require('node:path');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const TAG = '[rule-cards]';
const ROUTER_FILE = 'REPO RULES.md';
// The same probe order the corpus checker uses, so both tools agree on which
// rules directory a checkout has.
const RULES_DIR_CANDIDATES = ['.skilled/repo-rules', 'repo-rules'];
// Cards live one level below the rules, so a card is never itself discovered as
// a rule: rule discovery reads only the `*.md` entries of the rules directory.
const CARDS_DIR = 'cards';
const FIRES_WHEN = /^##\s+Fires when\s*$/u;
const THE_RULE = /^##\s+The rule\s*$/u;
const SELF_CHECK = /^##\s+\d+\.\s+SELF-CHECK\s*$/u;

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

// `--root <dir>` points the generator at another tree, such as a test fixture.
function parseRootArg(argv) {
  const index = argv.indexOf('--root');
  return index !== -1 && argv[index + 1] ? path.resolve(argv[index + 1]) : null;
}

// The rules directory of one candidate root, or null when that root has none.
function resolveRulesDir(root) {
  for (const candidate of RULES_DIR_CANDIDATES) {
    const absolute = path.join(root, candidate);
    if (fs.existsSync(absolute) && fs.statSync(absolute).isDirectory()) return candidate;
  }
  return null;
}

// Walk up from the start directory to the first one holding both the router and
// a rules directory, so the command works from anywhere in the tree.
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

function frontmatterEnd(lines) {
  if (lines[0] === undefined || lines[0].trim() !== '---') return -1;
  for (let index = 1; index < lines.length; index += 1) {
    if (lines[index].trim() === '---') return index;
  }
  return -1;
}

// One section, from its heading to just before the next `## ` heading, with the
// trailing divider and blank lines dropped so cards join cleanly.
function extractSection(body, pattern, ruleName, label) {
  const start = body.findIndex((line) => pattern.test(line));
  if (start === -1) throw new Error(`${ruleName}: no "${label}" section`);
  let end = body.length;
  for (let index = start + 1; index < body.length; index += 1) {
    if (/^##\s/u.test(body[index])) {
      end = index;
      break;
    }
  }
  const section = body.slice(start, end);
  while (section.length > 1) {
    const last = section[section.length - 1].trim();
    if (last !== '' && last !== '---') break;
    section.pop();
  }
  return section;
}

// Rule file names in a stable order, so output never depends on directory order.
function listRules(rulesDirAbs) {
  return fs
    .readdirSync(rulesDirAbs, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
    .map((entry) => entry.name)
    .sort();
}

function listCards(cardsDirAbs) {
  if (!fs.existsSync(cardsDirAbs)) return [];
  return fs
    .readdirSync(cardsDirAbs, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
    .map((entry) => entry.name)
    .sort();
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Render the card for one rule. Pure: the same name and content always give the
 * same string, which is what lets the checker compare by regeneration.
 *
 * @param {string} ruleFile - The rule's file name, such as `blast-radius.md`.
 * @param {string} content - The rule file's full text.
 * @returns {string} The card text, ending in exactly one newline.
 */
function renderCard(ruleFile, content) {
  const lines = content.split(/\r\n|\r|\n/u);
  const body = lines.slice(frontmatterEnd(lines) + 1);
  const heading = body.find((line) => /^#\s+\S/u.test(line));
  if (heading === undefined) throw new Error(`${ruleFile}: no H1 title line`);
  const title = heading.replace(/^#\s+/u, '').replace(/^Rule:\s*/u, '').trim();

  const firesWhen = extractSection(body, FIRES_WHEN, ruleFile, '## Fires when');
  const theRule = extractSection(body, THE_RULE, ruleFile, '## The rule');
  const selfCheck = extractSection(body, SELF_CHECK, ruleFile, '## N. SELF-CHECK');
  selfCheck[0] = '## SELF-CHECK';

  const card = [
    `# Card: ${title}`,
    '',
    `> Full rule: [\`${ruleFile}\`](../${ruleFile}). Open it when this card does not settle the question.`,
    '',
    ...firesWhen,
    '',
    ...theRule,
    '',
    ...selfCheck
  ];
  return `${card.join('\n')}\n`;
}

/**
 * Every card the rules directory should hold, keyed by card file name, in
 * sorted order.
 *
 * @param {string} rulesDirAbs - Absolute path of the rules directory.
 * @returns {Map<string, string>} Card file name to expected card text.
 */
function expectedCards(rulesDirAbs) {
  const cards = new Map();
  for (const ruleFile of listRules(rulesDirAbs)) {
    const content = fs.readFileSync(path.join(rulesDirAbs, ruleFile), 'utf8');
    cards.set(ruleFile, renderCard(ruleFile, content));
  }
  return cards;
}

/**
 * Compare the committed cards with freshly rendered ones.
 *
 * @param {string} rulesDirAbs - Absolute path of the rules directory.
 * @returns {string[]} One line per missing, stale or orphaned card, sorted.
 */
function cardDrift(rulesDirAbs) {
  const cardsDirAbs = path.join(rulesDirAbs, CARDS_DIR);
  const expected = expectedCards(rulesDirAbs);
  const present = new Set(listCards(cardsDirAbs));
  const problems = [];
  for (const [name, text] of expected) {
    if (!present.has(name)) {
      problems.push(`${CARDS_DIR}/${name}: missing`);
    } else if (fs.readFileSync(path.join(cardsDirAbs, name), 'utf8') !== text) {
      problems.push(`${CARDS_DIR}/${name}: stale`);
    }
  }
  for (const name of present) {
    if (!expected.has(name)) problems.push(`${CARDS_DIR}/${name}: orphaned`);
  }
  return problems.sort();
}

// Write every card whose text changed and delete cards no rule backs. Unchanged
// cards are left untouched so a rerun does not rewrite modification times.
function writeCards(rulesDirAbs) {
  const cardsDirAbs = path.join(rulesDirAbs, CARDS_DIR);
  const expected = expectedCards(rulesDirAbs);
  fs.mkdirSync(cardsDirAbs, { recursive: true });
  const summary = { written: 0, unchanged: 0, deleted: 0 };
  for (const [name, text] of expected) {
    const target = path.join(cardsDirAbs, name);
    if (fs.existsSync(target) && fs.readFileSync(target, 'utf8') === text) {
      summary.unchanged += 1;
      continue;
    }
    fs.writeFileSync(target, text, 'utf8');
    summary.written += 1;
  }
  for (const name of listCards(cardsDirAbs)) {
    if (expected.has(name)) continue;
    fs.unlinkSync(path.join(cardsDirAbs, name));
    summary.deleted += 1;
  }
  return { cards: expected.size, ...summary };
}

function main() {
  const argv = process.argv.slice(2);
  const rootArg = parseRootArg(argv);
  const located = findRepoRoot(rootArg || __dirname);
  if (located === null || (rootArg !== null && located.root !== rootArg)) {
    console.error(`${TAG} ERROR: no ${ROUTER_FILE} with a ${RULES_DIR_CANDIDATES.join(' or ')} directory found at ${rootArg || `or above ${__dirname}`}`);
    return 2;
  }
  const rulesDirAbs = path.join(located.root, located.rulesDir);

  if (argv.includes('--check')) {
    const problems = cardDrift(rulesDirAbs);
    for (const problem of problems) console.log(`${TAG} ${problem}`);
    console.log(`${TAG} RESULT: ${problems.length === 0 ? 'PASSED' : 'FAILED'} (${problems.length} card problems)`);
    return problems.length === 0 ? 0 : 1;
  }

  const result = writeCards(rulesDirAbs);
  console.log(`${TAG} cards=${result.cards} written=${result.written} unchanged=${result.unchanged} deleted=${result.deleted} dir=${path.join(located.rulesDir, CARDS_DIR)}`);
  return 0;
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = { renderCard, expectedCards, cardDrift, CARDS_DIR };

if (require.main === module) {
  try {
    process.exitCode = main();
  } catch (error) {
    console.error(`${TAG} ERROR: ${error.message}`);
    process.exitCode = 2;
  }
}
