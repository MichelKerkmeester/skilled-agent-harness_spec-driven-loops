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
 * Parse an authored expected_resources gold block from YAML frontmatter into
 * inert strings, loudly. Route gold is a contract, so a present-but-unparseable
 * block must surface as a parse failure the gate can count — never a silent
 * empty list (the historical silent-skip channel). Items are taken verbatim
 * (cleaned of bullets/quotes/backticks) and NEVER interpreted or executed, so a
 * command-shaped value is just a string that will fail to match any routed
 * resource. An explicit empty list (`[]`, inline or on the following line) is a
 * real assertion: "this route assembles nothing".
 *
 * @param {string} block - Full frontmatter block text.
 * @returns {{present:boolean,resources:string[],parseError:(string|null)}} Parsed gold.
 */
function parseExpectedResourcesGold(block) {
  const keyM = /(?:^|\n)[ \t]*expected_resources[ \t]*:(.*)/.exec(block);
  if (!keyM) return { present: false, resources: [], parseError: null };

  const inlineRest = keyM[1].trim();
  if (inlineRest) {
    const inlineList = /^\[(.*)\]$/.exec(inlineRest);
    if (inlineList) return { present: true, resources: parseListText(inlineList[1]), parseError: null };
    // Inline scalar (`expected_resources: references/x.md`) — a single inert item.
    return { present: true, resources: parseListText(inlineRest), parseError: null };
  }

  const after = block.slice(keyM.index + keyM[0].length).replace(/^\n/, '');
  if (/^[ \t]*\[\s*\]/.test(after)) return { present: true, resources: [], parseError: null };
  const dashList = /^((?:[ \t]*-[ \t]*.+\n?)+)/.exec(after);
  if (dashList) {
    const resources = [...new Set(parseListText(dashList[1]))];
    if (resources.length === 0) return { present: true, resources: [], parseError: 'expected_resources list items did not parse' };
    return { present: true, resources, parseError: null };
  }
  return { present: true, resources: [], parseError: 'expected_resources block is present but unparseable' };
}

/**
 * Parse an authored expected_intent gold value, loudly (same contract as
 * parseExpectedResourcesGold): a present-but-unparseable value is a counted
 * parse failure, not a silent null. Values are inert labels; corpora author
 * multi-intent gold as `A+B` or `A → B` sequences, parsed to a label list.
 * `none`/`defer`/`UNKNOWN` are the documented rejection labels meaning "no
 * intent selected" (the routers' own zero-score convention).
 *
 * @param {string} block - Full frontmatter block text.
 * @returns {{present:boolean,intent:(string|null),intents:string[],parseError:(string|null)}} Parsed gold.
 */
function parseExpectedIntentGold(block) {
  const keyM = /(?:^|\n)[ \t]*expected_intent[ \t]*:(.*)/.exec(block);
  if (!keyM) return { present: false, intent: null, intents: [], parseError: null };
  const value = cleanListItem(keyM[1]);
  const labels = value.split(/\s*(?:\+|→|->)\s*/).map((l) => l.trim()).filter(Boolean);
  if (labels.length === 0 || labels.some((l) => !/^[A-Za-z0-9_-]+$/.test(l))) {
    return { present: true, intent: null, intents: [], parseError: 'expected_intent value is present but unparseable' };
  }
  return { present: true, intent: labels[0], intents: labels, parseError: null };
}

/**
 * Parse a scenario's typed leaf-resource gold — a YAML list of
 * `{workflow_mode, leaf_resource_id}` objects — out of its frontmatter block.
 * Returns undefined (not an empty array) when the block is absent, so a scenario
 * that never declares typed gold stays completely ungated by the taxonomy scorer
 * rather than engaging it with zero pairs.
 *
 * @param {string} block - Frontmatter body.
 * @returns {Array<{workflow_mode:string,leaf_resource_id:string}>|undefined} Typed gold pairs, or undefined.
 */
function parseLeafResourceGold(block) {
  const m = /(?:^|\n)[ \t]*expected_leaf_resources:[ \t]*\n((?:[ \t]*-[ \t]*workflow_mode:.*\n[ \t]*leaf_resource_id:.*\n?)+)/.exec(block);
  if (!m) return undefined;
  const out = [];
  const re = /-[ \t]*workflow_mode:[ \t]*["']?([^"'\n]+?)["']?[ \t]*\n[ \t]*leaf_resource_id:[ \t]*["']?([^"'\n]+?)["']?[ \t]*(?:\n|$)/g;
  let mm;
  while ((mm = re.exec(m[1])) !== null) {
    out.push({ workflow_mode: mm[1].trim(), leaf_resource_id: mm[2].trim() });
  }
  return out.length ? out : undefined;
}

/**
 * Read a boolean frontmatter scalar (e.g. full_inventory_intent). Undefined when
 * absent, so the caller can distinguish "declared false" from "not declared".
 *
 * @param {string} block - Frontmatter body.
 * @param {string} key - Scalar key.
 * @returns {boolean|undefined} Parsed boolean, or undefined when absent.
 */
function parseFrontmatterBool(block, key) {
  const m = new RegExp(`(?:^|\\n)[ \\t]*${escapeRegExp(key)}:[ \\t]*["']?(true|false)["']?`, 'i').exec(block);
  return m ? m[1].toLowerCase() === 'true' : undefined;
}

/**
 * Read a single-line frontmatter scalar (e.g. expected_workflow_mode, whose
 * value may be a `+`-joined mode union). Undefined when absent.
 *
 * @param {string} block - Frontmatter body.
 * @param {string} key - Scalar key.
 * @returns {string|undefined} Trimmed value, or undefined when absent.
 */
function parseFrontmatterScalar(block, key) {
  const m = new RegExp(`(?:^|\\n)[ \\t]*${escapeRegExp(key)}:[ \\t]*["']?([^"'\\n]+?)["']?[ \\t]*(?:\\n|$)`).exec(block);
  return m ? m[1].trim() : undefined;
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
    // Emit stage uniformly so the scorer's fitted/holdout split has a single
    // source of truth across both loader shapes. sk-code playbooks have no
    // holdout designation; a suppression scenario is stage:negative.
    stage: negativeActivation ? 'negative' : 'routing',
    expectedSurface,
    expectedSubLanguage: subLangM ? subLangM[1].toUpperCase() : null,
    expectedIntent: null,
    expectedResources,
    // sk-code gold is a must-include list (with a separate forbidden set), not
    // an exact assembly assertion, so presence means a non-empty authored list.
    hasIntentGold: false,
    hasResourceGold: expectedResources.length > 0,
    goldParseError: null,
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

// sk-doc shape: walk per-scenario files, read YAML frontmatter gold. Gold
// parsing is LOUD: an authored expected_intent/expected_resources block that
// fails to parse marks the scenario (goldParseError) and emits a warning the
// route-gold gate counts, instead of the historical silent empty-gold skip.
function loadYamlFrontmatterScenarios(playbookDir, warnings = []) {
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
          || e.name === 'manual_testing_playbook.md' || e.name === 'feature_catalog.md'
          || e.name === 'manual-testing-playbook.md' || e.name === 'feature-catalog.md') continue;
      const text = readFileSafe(full);
      if (!text) continue;
      const fm = /^---\n([\s\S]*?)\n---/.exec(text);
      if (!fm) continue;
      const block = fm[1];
      if (!/(?:^|\n)[ \t]*(?:id|expected_intent|expected_resources)[ \t]*:/.test(block)) continue;
      const idM = /(?:^|\n)[ \t]*id:\s*["']?([A-Za-z0-9-]+)/.exec(block);
      const intentGold = parseExpectedIntentGold(block);
      const resourceGold = parseExpectedResourcesGold(block);
      const stageM = /(?:^|\n)[ \t]*stage:\s*["']?([A-Za-z0-9_-]+)/.exec(block);
      const stage = stageM && ['routing', 'holdout', 'negative'].includes(stageM[1])
        ? stageM[1]
        : 'routing';
      const expectedRankBelowSkillIds = parseFrontmatterList(block, [
        'rankBelowSkillIds',
        'rank_below_skill_ids',
        'expected_rank_below_skill_ids',
      ]);
      const expectedLeafResources = parseLeafResourceGold(block);
      const fullInventoryIntent = parseFrontmatterBool(block, 'full_inventory_intent');
      // The declared workflow mode is only needed to satisfy the typed-gold
      // oracle gate, so parse it only when typed gold is present — a scenario
      // with no typed gold stays byte-identical to before this field existed.
      const expectedWorkflowMode = expectedLeafResources
        ? parseFrontmatterScalar(block, 'expected_workflow_mode')
        : undefined;
      const category = path.basename(cur);
      const prompt = parsePromptBlock(text);
      const id = idM ? idM[1] : e.name.replace(/\.md$/, '');
      const goldParseErrors = [intentGold.parseError, resourceGold.parseError].filter(Boolean);
      for (const err of goldParseErrors) warnings.push(`${id}: gold-parse-failure — ${err}`);
      const parseWarnings = [
        ...(prompt ? [] : ['missing-exact-prompt']),
        ...goldParseErrors.map((err) => `gold-parse-failure: ${err}`),
      ];
      out.push({
        scenarioId: id,
        category,
        prompt: prompt || null,
        stage,
        classKind: classifyKind(id, category, null, intentGold.intent || ''),
        expectedSurface: null,
        expectedSubLanguage: null,
        expectedIntent: intentGold.intent,
        expectedIntents: intentGold.intents,
        expectedResources: resourceGold.resources,
        // Route-gold presence flags: `expected_resources: []` is a real
        // "assembles nothing" assertion, distinguishable from an absent key.
        hasIntentGold: intentGold.present,
        hasResourceGold: resourceGold.present,
        goldParseError: goldParseErrors.length ? goldParseErrors.join('; ') : null,
        expectedAssets: [],
        expectedRankBelowSkillIds,
        // Typed leaf-resource gold rides on its own field so the taxonomy scorer
        // engages only for a scenario that actually declares it; the flat-string
        // `expectedResources` lane above is unaffected either way.
        ...(expectedLeafResources ? { expected_leaf_resources: expectedLeafResources } : {}),
        ...(fullInventoryIntent !== undefined ? { full_inventory_intent: fullInventoryIntent } : {}),
        expected: (expectedRankBelowSkillIds.length || expectedWorkflowMode)
          ? {
            ...(expectedRankBelowSkillIds.length ? { rankBelowSkillIds: expectedRankBelowSkillIds } : {}),
            ...(expectedWorkflowMode ? { workflowMode: expectedWorkflowMode } : {}),
          }
          : undefined,
        passCriteria: null,
        critical: false,
        // A stage:negative fixture is a suppression test — route it through the
        // negative-activation/inversion lane instead of scoring it as a positive
        // routing hit. holdout/routing fixtures stay positive-scored.
        negativeActivation: stage === 'negative',
        source: { featureFile: path.relative(playbookDir, full), shape: 'sk-doc' },
        parseWarnings,
      });
    }
  }
  return out;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

// Derive typed (workflowMode, leafResourceId) gold for an index-table skill
// whose hub carries a generated leaf-manifest.json. The body-gold "Expected
// references loaded" block already lists packet-qualified surface resources, so
// splitting the leading packet segment recovers the canonical typed pair; this
// types the same independent gold the flat lane already scores, rather than
// re-deriving it from router output. Pairs are filtered to the scenario's
// dominant surface mode and to leaves the manifest actually registers, keeping
// the typed-gold oracle inside its single-selected-map cap. A skill without a
// manifest returns null and its scenarios stay byte-identical to the untyped
// shape, so this is dormant for every hub that has not generated one.
function loadManifestModeLeaves(skillRoot) {
  if (!skillRoot) return null;
  try {
    const manifestPath = path.join(skillRoot, 'leaf-manifest.json');
    if (!fs.existsSync(manifestPath)) return null;
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    const byMode = new Map();
    for (const mode of manifest.modes || []) {
      if (mode && mode.workflowMode) byMode.set(mode.workflowMode, new Set(mode.leaves || []));
    }
    return byMode.size ? byMode : null;
  } catch {
    return null;
  }
}

function deriveTypedGoldFromBodyGold(expectedResources, byMode) {
  const resolved = [];
  for (const raw of expectedResources || []) {
    const slash = raw.indexOf('/');
    if (slash === -1) continue;
    const workflowMode = raw.slice(0, slash);
    const leafResourceId = raw.slice(slash + 1);
    const leaves = byMode.get(workflowMode);
    if (leaves && leaves.has(leafResourceId)) resolved.push({ workflowMode, leafResourceId });
  }
  if (!resolved.length) return null;
  // Dominant surface mode = the mode contributing the most resolvable leaves.
  // Restricting the gold to that one mode keeps the pair set within the oracle's
  // simultaneous-mode cap while still measuring surface-routing recall.
  const counts = new Map();
  for (const pair of resolved) counts.set(pair.workflowMode, (counts.get(pair.workflowMode) || 0) + 1);
  let dominant = null;
  let best = -1;
  for (const [mode, count] of counts) {
    if (count > best) { best = count; dominant = mode; }
  }
  const pairs = resolved.filter((pair) => pair.workflowMode === dominant);
  return { pairs, workflowMode: dominant };
}

/**
 * Parse a skill's manual_testing_playbook into normalized benchmark scenarios.
 *
 * @param {Object} [options] - Loader options.
 * @param {string} [options.skillRoot] - Skill root dir (playbook resolved under it).
 * @param {string} [options.playbookDir] - Explicit playbook dir override.
 * @returns {{ scenarios: Array, shape: 'sk-code'|'sk-doc'|'none', warnings: string[] }}
 */
function loadPlaybookScenarios({ skillRoot, playbookDir } = {}) {
  // Accept either the snake_case (repo standard) or kebab-case playbook dir name.
  // Prefer whichever exists so kebab-migrated packets and snake incumbents both resolve.
  const dir = playbookDir
    || ['manual_testing_playbook', 'manual-testing-playbook']
        .map((n) => path.join(skillRoot, n))
        .find((p) => fs.existsSync(p))
    || path.join(skillRoot, 'manual_testing_playbook');
  const warnings = [];
  if (!fs.existsSync(dir)) {
    return { scenarios: [], shape: 'none', warnings: [`no playbook at ${dir}`] };
  }
  const rootPath = ['manual_testing_playbook.md', 'manual-testing-playbook.md']
    .map((n) => path.join(dir, n))
    .find((p) => fs.existsSync(p))
    || path.join(dir, 'manual_testing_playbook.md');
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
    const byMode = loadManifestModeLeaves(skillRoot);
    if (byMode) {
      for (const sc of scenarios) {
        const gold = deriveTypedGoldFromBodyGold(sc.expectedResources, byMode);
        if (gold) {
          sc.expected_leaf_resources = gold.pairs;
          sc.expected = { ...(sc.expected || {}), workflowMode: gold.workflowMode };
        }
      }
    }
    return { scenarios, shape: 'sk-code', warnings };
  }

  // No root index table -> sk-doc YAML-frontmatter shape.
  const scenarios = loadYamlFrontmatterScenarios(dir, warnings);
  return { scenarios, shape: scenarios.length ? 'sk-doc' : 'none', warnings };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  loadPlaybookScenarios,
  classifyKind,
  extractPaths,
  extractForbiddenPrefixes,
  parseRootIndex,
  parseExpectedResourcesGold,
  parseExpectedIntentGold,
  loadManifestModeLeaves,
  deriveTypedGoldFromBodyGold,
};

if (require.main === module) {
  const args = require('./_args.cjs').parse(process.argv.slice(2));
  const skillRoot = args.skill && (args.skill.includes('/') || args.skill.startsWith('.'))
    ? path.resolve(args.skill)
    : path.join(path.resolve(__dirname, '..', '..', '..', '..'), args.skill || '');
  const res = loadPlaybookScenarios({ skillRoot, playbookDir: args['playbook-dir'] });
  process.stdout.write(JSON.stringify(res, null, 2) + '\n');
}
