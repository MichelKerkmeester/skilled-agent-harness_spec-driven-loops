#!/usr/bin/env node

// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Deep-Alignment Scoping — adapter discriminator regression                ║
// ╚══════════════════════════════════════════════════════════════════════════╝
//
// Proves a lane can carry an optional `adapter` discriminator, defaults an
// omitted adapter to the authority's own module, and fails closed when an
// adapter is not registered for that authority.

'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {
  resolveLanesFromConfig,
  resolveLanesFromSelections,
  registeredAdapters,
} = require('../scoping.cjs');

const SKILL_PATH = path.resolve(__dirname, '..', '..', 'SKILL.md');

function readAdapterResourceMap() {
  const skillText = fs.readFileSync(SKILL_PATH, 'utf8');
  const block = skillText.match(/ADAPTER_RESOURCE_MAP = \{\n([\s\S]*?)\n\}/);
  assert.ok(block, 'the selected-adapter prompt-pack map must remain present');
  const entries = {};
  for (const match of block[1].matchAll(/^\s*"([^"]+)":\s*(\[[^\n]+\]),?$/gm)) {
    entries[match[1]] = JSON.parse(match[2]);
  }
  return { skillText, entries };
}

// 1. Omitted adapter defaults to the authority's own module.
function testAdapterDefaultsToAuthority() {
  const [lane] = resolveLanesFromConfig([
    { authority: 'sk-code', artifactClass: 'code', scope: { type: 'paths', values: ['src/'] } },
  ]);
  assert.equal(lane.adapter, 'sk-code', 'omitted adapter defaults to the authority');
}

// 2. An unknown adapter for a single-adapter authority is not selectable.
function testUnknownSingleAdapterRejected() {
  assert.throws(
    () => resolveLanesFromConfig([
      { authority: 'sk-git', artifactClass: 'git-history', adapter: 'unknown-git-adapter', scope: { type: 'branchRange', from: 'main', to: 'HEAD' } },
    ]),
    /is not a registered adapter for authority "sk-git"/,
  );
}

// 3. A docs lane can select the command-surface peer adapter.
function testCommandAdapterSelectable() {
  const [lane] = resolveLanesFromConfig([
    { authority: 'sk-doc', artifactClass: 'docs', adapter: 'sk-doc-command', scope: { type: 'paths', values: ['.opencode/commands'] } },
  ]);
  assert.equal(lane.adapter, 'sk-doc-command', 'the command adapter must be selectable via the adapter discriminator');
}

// 4. The prompt pack follows the selected adapter and preserves the default.
function testPromptPackUsesSelectedAdapter() {
  const { skillText, entries } = readAdapterResourceMap();
  const [defaultLane] = resolveLanesFromConfig([
    { authority: 'sk-doc', artifactClass: 'docs', scope: { type: 'paths', values: ['docs/'] } },
  ]);
  const [peerLane] = resolveLanesFromConfig([
    { authority: 'sk-doc', artifactClass: 'docs', adapter: 'sk-doc-command', scope: { type: 'paths', values: ['.opencode/commands'] } },
  ]);

  assert.deepEqual(entries[defaultLane.adapter], [
    'references/adapters/sk-doc-adapter.md',
    'references/adapters/sk-doc-known-deviations.md',
  ]);
  assert.deepEqual(entries[peerLane.adapter], [
    'references/adapters/sk-doc-command-adapter.md',
    'references/adapters/sk-doc-command-known-deviations.md',
  ]);
  assert.match(skillText, /if adapter:\n\s+return adapter if adapter in ADAPTER_RESOURCE_MAP else ""/);
  assert.match(skillText, /return authority if authority in ADAPTER_RESOURCE_MAP else ""/);
}

// 5. An unknown adapter for the authority fails closed.
function testUnknownAdapterRejected() {
  assert.throws(
    () => resolveLanesFromConfig([
      { authority: 'sk-doc', artifactClass: 'docs', adapter: 'unknown-doc-adapter', scope: { type: 'paths', values: ['docs/'] } },
    ]),
    /is not a registered adapter for authority "sk-doc"/,
  );
  assert.deepEqual(registeredAdapters('sk-doc'), ['sk-doc', 'sk-doc-command']);
  // sk-design was removed as a registered authority: it resolves to no adapters.
  assert.deepEqual(registeredAdapters('sk-design'), []);
}

testAdapterDefaultsToAuthority();
testUnknownSingleAdapterRejected();
testCommandAdapterSelectable();
testPromptPackUsesSelectedAdapter();
testUnknownAdapterRejected();
console.log('[deep-alignment] scoping adapter-discriminator regression passed');
