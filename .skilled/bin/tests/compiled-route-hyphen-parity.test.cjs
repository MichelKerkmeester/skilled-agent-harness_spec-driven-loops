#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Compiled-Route Hyphen/Space Parity Tests
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
const SKILLS_DIR = path.join(__dirname, '..', '..', 'skills');

// ─────────────────────────────────────────────────────────────────────────────
// 2. FIXTURES
// ─────────────────────────────────────────────────────────────────────────────

// A temporary activation root whose manifest selects the policy each hub
// compiles right now. The cases test matching, so they must not depend on
// whether the committed manifests have been re-minted yet.
const ACTIVATION_ROOT = fs.mkdtempSync(path.join(os.tmpdir(), 'hyphen-parity-activation-'));
process.env.SPECKIT_ACTIVATION_ROOT_OVERRIDE = ACTIVATION_ROOT;
// Compiled routing is default-on. Clear the flag so an operator's shell cannot
// turn every answer into the legacy sentinel.
delete process.env.SPECKIT_COMPILED_ROUTING;

const { DEFAULT_ON_HUBS, resolveRoute } = require(path.join(ENGINE_DIR, 'resolve.cjs'));
const { compiledRoute } = require(path.join(ENGINE_DIR, 'compiled-route.cjs'));

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
// 3. KEYWORD SELECTION
// ─────────────────────────────────────────────────────────────────────────────

function hubKeywords(hubId) {
  const routerPath = path.join(SKILLS_DIR, hubId, 'hub-router.json');
  assert.ok(fs.existsSync(routerPath), `${hubId} must ship a hub-router.json`);
  const router = JSON.parse(fs.readFileSync(routerPath, 'utf8'));
  const keywords = [];
  for (const vocabulary of Object.values(router.vocabularyClasses || {})) {
    for (const keyword of vocabulary.keywords || []) keywords.push(String(keyword));
  }
  return [...new Set(keywords)];
}

// A slash command keeps its hyphens: they are part of the command name, not a
// word separator, so only phrase keywords carry the hyphen/space equivalence.
function phraseKeywords(keywords, pattern) {
  return keywords.filter((keyword) => pattern.test(keyword) && !keyword.startsWith('/')).slice(0, 3);
}

const spaceAsHyphens = (keyword) => keyword.replace(/\s+/g, '-');
const hyphensAsSpaces = (keyword) => keyword.replace(/-+/g, ' ');

function targetModes(route) {
  return route.targets.map((target) => {
    const mode = target.workflowMode
      || (target.destinationId && target.destinationId.workflowMode);
    assert.equal(typeof mode, 'string', 'every route target must name a workflow mode');
    return mode;
  });
}

function assertParity(hubId, keyword, alternate) {
  const label = `${hubId}: "${keyword}"`;
  const plain = resolveRoute(hubId, `${keyword} please`);
  const spaced = resolveRoute(hubId, `${alternate} please`);
  assert.ok(plain, `${label} must resolve through the compiled route`);
  assert.ok(spaced, `${label} must resolve through the compiled route`);
  assert.equal(plain.action, spaced.action, label);
  assert.equal(plain.selectionKind, spaced.selectionKind, label);
  assert.deepEqual(targetModes(plain), targetModes(spaced), label);
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. PARITY
// ─────────────────────────────────────────────────────────────────────────────

test('a spaced keyword routes the same however the prompt spells its spaces', () => {
  for (const hubId of DEFAULT_ON_HUBS) {
    const keywords = hubKeywords(hubId);
    for (const keyword of phraseKeywords(keywords, /\s/)) {
      assertParity(hubId, keyword, spaceAsHyphens(keyword));
    }
  }
});

test('a hyphenated keyword routes the same however the prompt spells its hyphens', () => {
  for (const hubId of DEFAULT_ON_HUBS) {
    const keywords = hubKeywords(hubId);
    for (const keyword of phraseKeywords(keywords, /-/)) {
      assertParity(hubId, keyword, hyphensAsSpaces(keyword));
    }
  }
});
