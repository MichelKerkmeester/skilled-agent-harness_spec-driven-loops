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
const { resolveLanesFromConfig, registeredAdapters } = require('../scoping.cjs');

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

// 3. An unknown adapter for the authority fails closed.
function testUnknownAdapterRejected() {
  assert.throws(
    () => resolveLanesFromConfig([
      { authority: 'sk-doc', artifactClass: 'docs', adapter: 'sk-design-live-render', scope: { type: 'paths', values: ['docs/'] } },
    ]),
    /is not a registered adapter for authority "sk-doc"/,
  );
  assert.deepEqual(registeredAdapters('sk-doc'), ['sk-doc']);
  assert.deepEqual(registeredAdapters('sk-design'), ['sk-design', 'sk-design-live-render']);
}

testAdapterDefaultsToAuthority();
testLiveRenderSelectable();
testUnknownAdapterRejected();
console.log('[deep-alignment] scoping adapter-discriminator regression passed');
