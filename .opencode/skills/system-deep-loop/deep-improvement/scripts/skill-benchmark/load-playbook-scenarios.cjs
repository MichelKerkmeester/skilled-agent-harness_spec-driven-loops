#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ load-playbook-scenarios — corpus loader for Lane C                       ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

/**
 * load-playbook-scenarios.cjs — corpus loader for Lane C.
 *
 * A skill's manual_testing_playbook is its authored, live-execution contract
 * ("Every scenario MUST be executed against the live skill — no mocks"). It is
 * a far better benchmark corpus than synthetic decontaminated fixtures: real
 * prompts with real expected-routing gold. This module parses that playbook
 * into one normalized scenario shape the orchestrator scores against.
 *
 * Two source shapes are supported:
 *   1. The sk-code shape: a root index table (§ "FEATURE CATALOG CROSS-REFERENCE
 *      INDEX") enumerating {id, per-feature file, critical}, plus per-feature
 *      files carrying the exact prompt + expected references/assets + pass rules.
 *   2. The sk-doc shape: per-scenario files whose YAML frontmatter carries
 *      expected_intent / expected_resources (no root index table).
 *
 * Gold is captured AS AUTHORED. We deliberately do NOT assert that an expected
 * path exists on disk — a stale expectation (e.g. a renamed reference) is a real
 * finding the scorer should surface as router↔gold drift, not silently drop.
 */

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('fs');
const path = require('path');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const ID_RE = /\b([A-Z]{2,4})-(\d{3})\b/;

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Select the executor class for a scenario: routing/advisor run via router-replay
 * or live cli-opencode; browser scenarios need a real browser (bdg) and are routed
 * out of the text executors.
 *
 * @param {string} scenarioId - Scenario id (e.g. SD-001), used for prefix hints.
 * @param {string} category - Category label from the playbook index.
 * @param {string} expectedSurface - Asserted in-skill surface, if any.
 * @param {string} passCriteria - Pass/fail criteria text.
 * @returns {'browser'|'advisor'|'routing'} The executor class.
 */
function classifyKind(scenarioId, category, expectedSurface, passCriteria) {
  const cat = (category || '').toLowerCase();
  const prefix = (ID_RE.exec(scenarioId || '') || [])[1] || '';
  if (/motion|animation|browser|performance|visual|compositing|cross-browser/.test(cat)
      || prefix === 'MR' || prefix === 'CB') {
    return 'browser';
  }
  // A scenario that asserts an in-skill SURFACE is a routing test (the advisor
  // check is just its precondition). Advisor-class is reserved for scenarios
  // whose WHOLE test is skill selection — no surface — run as a skill_advisor.py
  // probe (SA-*, and the sk-code-vs-sk-doc anti-pattern).
  if (expectedSurface) return 'routing';
  const pass = (passCriteria || '').toLowerCase();
  if (prefix === 'SA' || /top-1\s*(!=|==)|routes? .* to sk-doc|advisor (top-1|wins)/.test(pass)) {
    return 'advisor';
  }
  return 'routing';
}

function readFileSafe(p) {
  try { return fs.readFileSync(p, 'utf8'); } catch { return null; }
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function cleanListItem(value) {
  return String(value || '')
    .trim()
    .replace(/^[-\s]+/, '')
    .replace(/^["'`]+|["'`,]+$/g, '')
    .trim();
}

function parseListText(value) {
  if (!value) return [];
  return value
    .split(/[\n,]+/)
    .map(cleanListItem)
    .filter(Boolean);
}

function parseFrontmatterList(block, keys) {
  for (const key of keys) {
    const escaped = escapeRegExp(key);
    const inline = new RegExp(`(?:^|\\n)\\s*${escaped}:\\s*\\[(.*?)\\]`).exec(block);
    if (inline) return parseListText(inline[1]);
    const multiline = new RegExp(`(?:^|\\n)\\s*${escaped}:\\s*\\n((?:\\s*-\\s*.+\\n?)+)`).exec(block);
    if (multiline) return parseListText(multiline[1]);
  }
  return [];
}

function parseExpectedRankBelowSkillIds(text) {
  const fm = /^---\n([\s\S]*?)\n---/.exec(text || '');
  if (!fm) return [];
  return parseFrontmatterList(fm[1], [
    'rankBelowSkillIds',
    'rank_below_skill_ids',
    'expected_rank_below_skill_ids',
  ]);
}

/**
 * Pull every `references/...` / `assets/...` / `../shared/...` markdown-ish path
 * token out of a text block, deduped, order-preserving. Tolerates backticks,
 * bullets, and trailing parentheticals like "(when intent is X)". The sibling
 * `../shared/` form is included so a gold list can credit the family-shared
 * docs (the operating register, the handoff card) a nested mode loads on
 * routes, matching what the router actually returns.
 *
 * @param {string} block - Text block to scan.
 * @returns {string[]} Deduped, order-preserving list of path tokens.
 */
function extractPaths(block) {
  if (!block) return [];
  const out = [];
  const seen = new Set();
  // code-<surface>/ packet paths (post two-axis split) sit alongside the
  // universal references/ + assets/ + sibling ../shared/ tiers the gold names.
  const re = /(?:code-[a-z]+|references|assets|\.\.\/shared)\/[A-Za-z0-9_./-]+\.[a-z]{1,4}/g;
  let m;
  while ((m = re.exec(block)) !== null) {
    const p = m[0];
    if (!seen.has(p)) { seen.add(p); out.push(p); }
  }
  return out;
}

// Forbidden ("Expected NOT loaded") paths are usually glob prefixes
// (`code-webflow/references/*`), not extension-terminated files, so extractPaths
// misses them. Capture the backtick-quoted path prefixes and drop any trailing
// glob so a routed resource can be prefix-matched against them.
function extractForbiddenPrefixes(block) {
  if (!block) return [];
  const out = [];
  const seen = new Set();
  const re = /`((?:code-[a-z]+|references|assets|\.\.\/shared)\/[A-Za-z0-9_./*-]+)`/g;
  let m;
  while ((m = re.exec(block)) !== null) {
    const prefix = m[1].replace(/\*+$/, '');
    if (prefix && !seen.has(prefix)) { seen.add(prefix); out.push(prefix); }
  }
  return out;
}

// Grab the text between a `**Label**` marker and the next bold marker / heading.
function sectionAfter(text, labelRe) {
  const start = text.search(labelRe);
  if (start === -1) return '';
  const rest = text.slice(start);
  const endRel = rest.slice(1).search(/\n\s*(?:\*\*[A-Z]|#{1,3}\s|\d+\.\s+[A-Z])/);
  return endRel === -1 ? rest : rest.slice(0, endRel + 1);
}

function parsePromptBlock(text) {
  // ```[lang]\n<prompt>\n``` after the prompt marker. Per-feature files vary:
  // SD/LS/RD use "**Exact prompt**", CS use "**Realistic user prompt**".
  const m = /\*\*(?:Exact prompt|Realistic user prompt)\*\*:?\s*\n+```[a-z]*\n([\s\S]*?)\n```/i.exec(text);
  if (m) return m[1].trim();
  // sk-doc / inline shape: "Prompt: ..." line, optionally bulleted and/or
  // framework-prefixed (e.g. sk-git's "- RCAF Prompt: `...`"), optionally
  // wrapped in a single backtick span.
  const inline = /(?:^|\n)\s*(?:[-*]\s+)?(?:\*\*)?(?:RCAF\s+)?Prompt(?:\*\*)?:\s*(.+)/i.exec(text);
  if (!inline) return null;
  let value = inline[1].trim();
  const wrapped = /^`([^`]*)`$/.exec(value);
  if (wrapped) value = wrapped[1].trim();
  return value || null;
}

// The root §7-13 tables carry the "Exact Prompt" column for every scenario in a
// uniform 9-column shape — the authoritative prompt source when a per-feature
// file uses a non-standard marker or omits the fenced block.
function parseRootScenarioTables(rootText) {
  const map = {};
  for (const line of rootText.split('\n')) {
    if (!/^\|/.test(line)) continue;
    const cells = line.split('|').map((c) => c.trim());
    // Leading/trailing empties from the bounding pipes -> cells[1] is Feature ID.
    const idCell = (cells[1] || '').replace(/`/g, '');
    if (!/^[A-Z]{2,4}-\d{3}$/.test(idCell)) continue;
    if (cells.length < 9) continue; // not a §7-13 scenario row
    const prompt = (cells[4] || '').replace(/^`|`$/g, '').trim();
    map[idCell] = {
      prompt: /multi-prompt battery|see per-feature/i.test(prompt) ? null : (prompt || null),
      expectedSignals: cells[6] || null,
      passCriteria: cells[8] || null,
    };
  }
  return map;
}

function parseFeatureFile(absPath, scenarioId, category, critical, rootEntry) {
  const text = readFileSafe(absPath);
  if (!text) return null;

  const fmId = (/title:\s*["']?([A-Z]{2,4}-\d{3})/.exec(text) || [])[1];
  const id = scenarioId || fmId;
  if (!id) return null;

  const prompt = parsePromptBlock(text) || (rootEntry && rootEntry.prompt) || null;
  // Per-feature files vary: "- Surface: `WEBFLOW`" (SD/LS) vs "**Expected surface**: `WEBFLOW`" (CS).
  const surfaceM = /(?:Expected\s+)?Surface\*{0,2}:\s*`?([A-Za-z_]+)`?/i.exec(text);
  const subLangM = /Sub-language:\s*`?([A-Za-z]+)`?/i.exec(text);
  const refBlock = sectionAfter(text, /\*\*Expected references loaded\*\*/i);
  const assetBlock = sectionAfter(text, /\*\*Expected assets loaded\*\*/i);
  const passM = /###?\s*Pass\/Fail Criteria\s*([\s\S]*?)(?:\n###?\s|\n##\s|$)/i.exec(text);
  const passCriteria = (passM ? passM[1].trim() : null) || (rootEntry && rootEntry.passCriteria) || null;

  const KNOWN_SURFACES = new Set(['WEBFLOW', 'OPENCODE', 'UNKNOWN', 'MOTION_DEV', 'NONE']);
  const surfaceRaw = surfaceM ? surfaceM[1].toUpperCase() : null;
  const expectedSurface = KNOWN_SURFACES.has(surfaceRaw) ? surfaceRaw : null;
  const expectedResources = extractPaths(refBlock);
  const expectedAssets = extractPaths(assetBlock);
  const notLoadedBlock = sectionAfter(text, /\*\*Expected NOT loaded\*\*/i);
  const forbiddenResources = extractForbiddenPrefixes(notLoadedBlock);
  const expectedRankBelowSkillIds = parseExpectedRankBelowSkillIds(text);

  // Negative activation: the skill should NOT route here (UNKNOWN surface,
  // disambiguation expected, or advisor must pick another skill).
  const lowerPass = (passCriteria || '').toLowerCase();
  const negativeActivation = expectedSurface === 'UNKNOWN'
    || /disambiguation|must not|asks? for clarification|top-1\s*!=\s*sk-code|routes? .* to sk-doc/.test(lowerPass)
    || /\bUNKNOWN\b/.test(text.split('\n').slice(0, 30).join('\n'));

  const classKind = classifyKind(id, category, expectedSurface, passCriteria);

  return {
    scenarioId: id,
    category: category || null,
    prompt: prompt || null,
    classKind,
    expectedSurface,
    expectedSubLanguage: subLangM ? subLangM[1].toUpperCase() : null,
    expectedIntent: null,
    expectedResources,
    expectedAssets,
    forbiddenResources,
    expectedRankBelowSkillIds,
    expected: expectedRankBelowSkillIds.length ? { rankBelowSkillIds: expectedRankBelowSkillIds } : undefined,
    passCriteria,
    critical: !!critical,
    negativeActivation,
    source: { featureFile: path.relative(path.dirname(path.dirname(absPath)), absPath), shape: 'sk-code' },
    parseWarnings: prompt ? [] : ['missing-exact-prompt'],
  };
}

/**
 * Parse the root index table mapping id -> {category, featureFile, critical}.
 *
 * @param {string} rootText - The root playbook markdown text.
 * @returns {Array<{categoryLabel:string,scenarioId:string,featureFile:string,critical:boolean}>} Index rows.
 */
function parseRootIndex(rootText) {
  const idx = [];
  const secStart = rootText.search(/##\s+\d+\.\s+FEATURE CATALOG CROSS-REFERENCE INDEX/i);
  const scope = secStart === -1 ? rootText : rootText.slice(secStart);
  for (const line of scope.split('\n')) {
    // Row shape parsed below: | <category> | <AA-000> | `<feature-file>.md` | <Yes|No> |
    const m = /^\|\s*([^|]+?)\s*\|\s*([A-Z]{2,4}-\d{3})\s*\|\s*`?([^|`]+?\.md)`?\s*\|\s*(Yes|No)\s*\|/.exec(line);
    if (m) {
      idx.push({
        categoryLabel: m[1].trim(),
        scenarioId: m[2],
        featureFile: m[3].trim(),
        critical: /yes/i.test(m[4]),
      });
    }
  }
  return idx;
}

// sk-doc shape: walk per-scenario files, read YAML frontmatter gold.
function loadYamlFrontmatterScenarios(playbookDir) {
  const out = [];
  const stack = [playbookDir];
  while (stack.length) {
    const cur = stack.pop();
    let entries;
    try { entries = fs.readdirSync(cur, { withFileTypes: true }); } catch { continue; }
    for (const e of entries) {
      const full = path.join(cur, e.name);
      if (e.isDirectory()) { stack.push(full); continue; }
      if (!e.isFile() || !e.name.endsWith('.md')
          || e.name === 'manual_testing_playbook.md' || e.name === 'feature_catalog.md') continue;
      const text = readFileSafe(full);
      if (!text) continue;
      const fm = /^---\n([\s\S]*?)\n---/.exec(text);
      if (!fm) continue;
      const block = fm[1];
      if (!/(?:^|\n)[ \t]*(?:id|expected_intent|expected_resources)[ \t]*:/.test(block)) continue;
      const idM = /(?:^|\n)[ \t]*id:\s*["']?([A-Za-z0-9-]+)/.exec(block);
      const intentM = /(?:^|\n)[ \t]*expected_intent:\s*["']?([A-Za-z0-9_-]+)/.exec(block);
      const resM = /(?:^|\n)[ \t]*expected_resources:\s*\n((?:\s*-\s*.+\n?)+)/.exec(block);
      const stageM = /(?:^|\n)[ \t]*stage:\s*["']?([A-Za-z0-9_-]+)/.exec(block);
      const stage = stageM && ['routing', 'holdout', 'negative'].includes(stageM[1])
        ? stageM[1]
        : 'routing';
      const resources = resM ? extractPaths(resM[1]) : [];
      const expectedRankBelowSkillIds = parseFrontmatterList(block, [
        'rankBelowSkillIds',
        'rank_below_skill_ids',
        'expected_rank_below_skill_ids',
      ]);
      const category = path.basename(cur);
      const prompt = parsePromptBlock(text);
      const id = idM ? idM[1] : e.name.replace(/\.md$/, '');
      out.push({
        scenarioId: id,
        category,
        prompt: prompt || null,
        stage,
        classKind: classifyKind(id, category, null, intentM ? intentM[1] : ''),
        expectedSurface: null,
        expectedSubLanguage: null,
        expectedIntent: intentM ? intentM[1] : null,
        expectedResources: resources,
        expectedAssets: [],
        expectedRankBelowSkillIds,
        expected: expectedRankBelowSkillIds.length ? { rankBelowSkillIds: expectedRankBelowSkillIds } : undefined,
        passCriteria: null,
        critical: false,
        negativeActivation: false,
        source: { featureFile: path.relative(playbookDir, full), shape: 'sk-doc' },
        parseWarnings: prompt ? [] : ['missing-exact-prompt'],
      });
    }
  }
  return out;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Parse a skill's manual_testing_playbook into normalized benchmark scenarios.
 *
 * @param {Object} [options] - Loader options.
 * @param {string} [options.skillRoot] - Skill root dir (playbook resolved under it).
 * @param {string} [options.playbookDir] - Explicit playbook dir override.
 * @returns {{ scenarios: Array, shape: 'sk-code'|'sk-doc'|'none', warnings: string[] }}
 */
function loadPlaybookScenarios({ skillRoot, playbookDir } = {}) {
  const dir = playbookDir || path.join(skillRoot, 'manual_testing_playbook');
  const warnings = [];
  if (!fs.existsSync(dir)) {
    return { scenarios: [], shape: 'none', warnings: [`no playbook at ${dir}`] };
  }
  const rootPath = path.join(dir, 'manual_testing_playbook.md');
  const rootText = readFileSafe(rootPath);
  const index = rootText ? parseRootIndex(rootText) : [];
  const rootMap = rootText ? parseRootScenarioTables(rootText) : {};

  if (index.length > 0) {
    const scenarios = [];
    for (const row of index) {
      const abs = path.join(dir, row.featureFile);
      const parsed = parseFeatureFile(abs, row.scenarioId, row.categoryLabel, row.critical, rootMap[row.scenarioId]);
      if (parsed) {
        if (parsed.parseWarnings.length) warnings.push(`${row.scenarioId}: ${parsed.parseWarnings.join(',')}`);
        scenarios.push(parsed);
      } else {
        warnings.push(`${row.scenarioId}: feature file unreadable (${row.featureFile})`);
      }
    }
    return { scenarios, shape: 'sk-code', warnings };
  }

  // No root index table -> sk-doc YAML-frontmatter shape.
  const scenarios = loadYamlFrontmatterScenarios(dir);
  return { scenarios, shape: scenarios.length ? 'sk-doc' : 'none', warnings };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = { loadPlaybookScenarios, classifyKind, extractPaths, extractForbiddenPrefixes, parseRootIndex };

if (require.main === module) {
  const args = require('./_args.cjs').parse(process.argv.slice(2));
  const skillRoot = args.skill && (args.skill.includes('/') || args.skill.startsWith('.'))
    ? path.resolve(args.skill)
    : path.join(path.resolve(__dirname, '..', '..', '..', '..'), args.skill || '');
  const res = loadPlaybookScenarios({ skillRoot, playbookDir: args['playbook-dir'] });
  process.stdout.write(JSON.stringify(res, null, 2) + '\n');
}
