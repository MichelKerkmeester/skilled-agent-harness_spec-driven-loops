#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Compiled-Route Fold Dedupe Tests
// ───────────────────────────────────────────────────────────────────
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { after, test } = require('node:test');

const ENGINE_DIR = path.join(__dirname, '..', 'lib', 'compiled-routing', '014-runtime-engine', 'lib');
const ROUTING_DIR = path.join(__dirname, '..', 'lib', 'compiled-routing');

// ─────────────────────────────────────────────────────────────────────────────
// 2. FIXTURES
// ─────────────────────────────────────────────────────────────────────────────

// A temporary activation root whose manifest selects the policy each hub
// compiles right now, so the cases do not depend on whether the committed
// manifests have been re-minted yet.
const ACTIVATION_ROOT = fs.mkdtempSync(path.join(os.tmpdir(), 'fold-dedupe-activation-'));
process.env.SPECKIT_ACTIVATION_ROOT_OVERRIDE = ACTIVATION_ROOT;
// Compiled routing is default-on. Clear the flag so an operator's shell cannot
// turn every answer into the legacy sentinel.
delete process.env.SPECKIT_COMPILED_ROUTING;

const { DEFAULT_ON_HUBS } = require(path.join(ENGINE_DIR, 'resolve.cjs'));
const {
  compiledRoute,
  loadHubEngine,
  HUB_CHILD,
} = require(path.join(ENGINE_DIR, 'compiled-route.cjs'));

for (const hubId of DEFAULT_ON_HUBS) {
  const policy = compiledRoute(hubId, 'quality review of the code');
  fs.mkdirSync(path.join(ACTIVATION_ROOT, hubId), { recursive: true });
  fs.writeFileSync(path.join(ACTIVATION_ROOT, hubId, 'manifest.json'), JSON.stringify({
    servingAuthority: 'compiled',
    selectedPolicy: { effectivePolicyHash: policy.effectivePolicyHash, generation: policy.generation },
  }));
}

after(() => fs.rmSync(ACTIVATION_ROOT, { recursive: true, force: true }));

// ─────────────────────────────────────────────────────────────────────────────
// 3. VOCABULARY
// ─────────────────────────────────────────────────────────────────────────────

// The compiled matcher folds a hyphen run to one space on both sides of the
// comparison, and matches four bare words only on a word boundary. This mirror
// keeps the expected count independent of the scorer under test.
const WORD_BOUNDARY_KEYWORDS = new Set(['review', 'lcp', 'inp', 'cls']);

function folded(value) {
  return String(value).trim().toLowerCase().replace(/-+/g, ' ').replace(/\s+/g, ' ').trim();
}

function escapePattern(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function matchesSignal(prompt, keyword, matcher = 'keyword') {
  const signal = folded(keyword);
  const haystack = folded(prompt);
  if (matcher === 'detector') {
    const words = signal.split(/\s+/).filter(Boolean);
    if (words.length < 2) return haystack.includes(signal);
    const gap = '(?:\\s+\\S+){0,2}\\s+';
    const pattern = words.map(escapePattern).join(gap);
    return new RegExp(`\\b${pattern}`, 'i').test(haystack);
  }
  if (signal.startsWith('/')) {
    return new RegExp(`${escapePattern(signal)}(?![a-z0-9-])`, 'i').test(haystack);
  }
  if (WORD_BOUNDARY_KEYWORDS.has(signal)) {
    return new RegExp(`\\b${escapePattern(signal)}\\b`, 'i').test(haystack);
  }
  return haystack.includes(signal);
}

function distinctMatchedFolds(keywords, prompt, matcher) {
  const matched = new Set();
  for (const keyword of keywords) {
    if (matchesSignal(prompt, keyword, matcher)) matched.add(folded(keyword));
  }
  return matched.size;
}

// Every mode's authored vocabulary, read from the compiled projection of
// hub-router.json. A keyword router carries it as routingModel.modes[].keywords;
// a detector router carries the same values as alias detectors.
function modeKeywords(snapshot) {
  if (snapshot.routingModel && Array.isArray(snapshot.routingModel.modes)) {
    return snapshot.routingModel.modes.map((mode) => ({
      keywords: mode.keywords,
      matcher: 'keyword',
      mode: mode.workflowMode,
      weight: mode.weight,
    }));
  }
  const detectorById = new Map(snapshot.policy.detectors.map((detector) => [detector.id, detector]));
  const byMode = new Map();
  for (const selector of snapshot.policy.selectors) {
    const mode = selector.destinationId.workflowMode;
    if (!byMode.has(mode)) byMode.set(mode, []);
    for (const id of selector.detectorIds) {
      const detector = detectorById.get(id);
      if (detector && detector.kind === 'alias') byMode.get(mode).push(String(detector.value));
    }
  }
  return [...byMode].map(([mode, keywords]) => ({
    keywords,
    matcher: 'detector',
    mode,
    weight: 1,
  }));
}

// One prompt per phrase the vocabulary lists more than once after folding.
// Slash commands route through their own command path, not keyword counting.
function duplicateFolds(keywords) {
  const byFold = new Map();
  for (const keyword of keywords) {
    if (String(keyword).startsWith('/')) continue;
    const fold = folded(keyword);
    if (!byFold.has(fold)) byFold.set(fold, []);
    byFold.get(fold).push(String(keyword));
  }
  return [...byFold].filter(([, spellings]) => spellings.length > 1);
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. SCORING
// ─────────────────────────────────────────────────────────────────────────────

const engines = new Map();
const routers = new Map();

function engineFor(hubId) {
  if (!engines.has(hubId)) engines.set(hubId, loadHubEngine(hubId));
  return engines.get(hubId);
}

// The served scorer module this hub's compiled route loads: the surfaceBundle
// canary router or the plain detector router.
function routerFor(hubId) {
  if (!routers.has(hubId)) {
    const childDir = path.join(ROUTING_DIR, HUB_CHILD[hubId]);
    const canary = path.join(childDir, 'lib', 'canary-router.cjs');
    const target = fs.existsSync(canary) ? canary : path.join(childDir, 'lib', 'router.cjs');
    routers.set(hubId, require(target));
  }
  return routers.get(hubId);
}

function traceScores(engine, prompt) {
  const evaluated = engine.evaluate(engine.snapshot, { prompt });
  if (Array.isArray(evaluated.trace.matchedScores)) return evaluated.trace.matchedScores;
  return (evaluated.trace.scores || []).map((row) => ({
    mode: row.workflowMode,
    score: row.score,
  }));
}

function scoreOf(hubId, prompt) {
  const engine = engineFor(hubId);
  const router = routerFor(hubId);
  const rows = typeof router.scoreModes === 'function'
    ? router.scoreModes(engine.snapshot.routingModel, prompt)
    : traceScores(engine, prompt);
  return new Map(rows.map((row) => [row.mode, row.score]));
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. DEDUPE
// ─────────────────────────────────────────────────────────────────────────────

test('one folded mention scores one weight, not two', () => {
  let pairs = 0;
  for (const hubId of DEFAULT_ON_HUBS) {
    const snapshot = engineFor(hubId).snapshot;
    for (const entry of modeKeywords(snapshot)) {
      for (const [fold, spellings] of duplicateFolds(entry.keywords)) {
        pairs += 1;
        const expected = distinctMatchedFolds(entry.keywords, fold, entry.matcher) * entry.weight;
        const actual = scoreOf(hubId, fold).get(entry.mode);
        assert.equal(
          actual,
          expected,
          `${hubId}/${entry.mode}: naming ${JSON.stringify(spellings)} once must score `
            + `${expected} (${expected / entry.weight} once-folded hit x weight ${entry.weight})`,
        );
      }
    }
  }
  assert.ok(pairs > 0, 'at least one vocabulary must list both spellings of one phrase');
});
