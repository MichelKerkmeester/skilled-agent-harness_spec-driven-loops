#!/usr/bin/env node

// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Deep-Alignment Scoping — adapter discriminator regression                ║
// ╚══════════════════════════════════════════════════════════════════════════╝
//
// Proves a lane can carry an optional `adapter` discriminator so a designs lane
// selects the live-render adapter (sk-design-live-render) instead of the default
// static one, while an omitted adapter defaults to the authority's own module.
// An unknown adapter for the authority fails closed. Before this, lane identity
// carried no adapter discriminator, so every sk-design lane resolved to
// sk-design.cjs and the live-render adapter was unreachable.

'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { resolveLanesFromConfig, registeredAdapters } = require('../scoping.cjs');

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
    { authority: 'sk-design', artifactClass: 'designs', scope: { type: 'paths', values: ['DESIGN.md'] } },
  ]);
  assert.equal(lane.adapter, 'sk-design', 'omitted adapter defaults to the authority');
}

// 2. A designs lane can select the live-render adapter.
function testLiveRenderSelectable() {
  const [lane] = resolveLanesFromConfig([
    { authority: 'sk-design', artifactClass: 'designs', adapter: 'sk-design-live-render', scope: { type: 'paths', values: ['DESIGN.md'] } },
  ]);
  assert.equal(lane.adapter, 'sk-design-live-render', 'the live-render adapter must be selectable via the adapter discriminator');
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
    'references/adapters/sk_doc_adapter.md',
    'references/adapters/sk_doc_known_deviations.md',
  ]);
  assert.deepEqual(entries[peerLane.adapter], [
    'references/adapters/sk_doc_command_adapter.md',
    'references/adapters/sk_doc_command_known_deviations.md',
  ]);
  assert.match(skillText, /if adapter:\n\s+return adapter if adapter in ADAPTER_RESOURCE_MAP else ""/);
  assert.match(skillText, /return authority if authority in ADAPTER_RESOURCE_MAP else ""/);
}

// 5. An unknown adapter for the authority fails closed.
function testUnknownAdapterRejected() {
  assert.throws(
    () => resolveLanesFromConfig([
      { authority: 'sk-doc', artifactClass: 'docs', adapter: 'sk-design-live-render', scope: { type: 'paths', values: ['docs/'] } },
    ]),
    /is not a registered adapter for authority "sk-doc"/,
  );
  assert.deepEqual(registeredAdapters('sk-doc'), ['sk-doc', 'sk-doc-command']);
  assert.deepEqual(registeredAdapters('sk-design'), ['sk-design', 'sk-design-live-render']);
}

testAdapterDefaultsToAuthority();
testLiveRenderSelectable();
testCommandAdapterSelectable();
testPromptPackUsesSelectedAdapter();
testUnknownAdapterRejected();
console.log('[deep-alignment] scoping adapter-discriminator regression passed');
