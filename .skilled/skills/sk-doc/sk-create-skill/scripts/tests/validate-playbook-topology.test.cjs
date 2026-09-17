#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ validate-playbook-topology.test — quote-tolerance fixture coverage       ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

/**
 * Covers `parseFixture`'s frontmatter/typed-gold parsing across the two legal
 * scalar serializations a scenario file may use: unquoted (the canonical form
 * new fixtures should emit) and quoted (still valid input). Both forms must
 * parse to byte-identical structured output — quote characters must never
 * leak into a parsed value, since a leaked quote silently breaks the
 * manifest-resolution join in `validateManifestResolution`.
 */

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const topology = require('../validate-playbook-topology.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. FIXTURES
// ─────────────────────────────────────────────────────────────────────────────

// Same logical scenario, written twice: once with unquoted scalars (the
// canonical serialization), once with every scalar quoted. A correct parser
// must reduce both to the same structured fixture.
const UNQUOTED_FIXTURE = `---
id: T-PARITY-001
expected_workflow_mode: quality
expected_leaf_resources:
  - workflow_mode: quality
    leaf_resource_id: references/example.md
full_inventory_intent: false
---

# Quote-tolerance fixture (unquoted)
`;

const QUOTED_FIXTURE = `---
id: "T-PARITY-001"
expected_workflow_mode: "quality"
expected_leaf_resources:
  - workflow_mode: "quality"
    leaf_resource_id: "references/example.md"
full_inventory_intent: "false"
---

# Quote-tolerance fixture (quoted)
`;

// A multi-mode union plus a sequential turn separator, to prove quote-stripping
// does not interfere with the "+"/"→" splitting `splitDeclaredModes` does downstream.
const QUOTED_MULTI_MODE_FIXTURE = `---
id: "T-PARITY-002"
expected_workflow_mode: "quality+code-review"
expected_leaf_resources: []
full_inventory_intent: "true"
---

# Quote-tolerance fixture (quoted, multi-mode, empty pairs)
`;

function withTempPlaybookDir(fn) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'topology-quote-fixture-'));
  try {
    return fn(dir);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. TESTS
// ─────────────────────────────────────────────────────────────────────────────

function testQuotedAndUnquotedParseToIdenticalStructuredOutput() {
  withTempPlaybookDir((dir) => {
    const unquotedPath = path.join(dir, 'unquoted.md');
    const quotedPath = path.join(dir, 'quoted.md');
    fs.writeFileSync(unquotedPath, UNQUOTED_FIXTURE, 'utf8');
    fs.writeFileSync(quotedPath, QUOTED_FIXTURE, 'utf8');

    const unquoted = topology.parseFixture(unquotedPath, dir);
    const quoted = topology.parseFixture(quotedPath, dir);

    assert.equal(unquoted.ok, true);
    assert.equal(quoted.ok, true);

    // Compare every field parsing actually derives from frontmatter (relPath
    // differs by filename on purpose, so it is excluded from the comparison).
    assert.equal(quoted.id, unquoted.id);
    assert.equal(quoted.expectedWorkflowMode, unquoted.expectedWorkflowMode);
    assert.equal(quoted.fullInventoryIntent, unquoted.fullInventoryIntent);
    assert.equal(quoted.leafResourcesParsed, unquoted.leafResourcesParsed);
    assert.deepEqual(quoted.pairs, unquoted.pairs);
  });
}

function testQuotedValuesAreFullyStrippedOfQuoteCharacters() {
  withTempPlaybookDir((dir) => {
    const quotedPath = path.join(dir, 'quoted.md');
    fs.writeFileSync(quotedPath, QUOTED_FIXTURE, 'utf8');
    const quoted = topology.parseFixture(quotedPath, dir);

    // The regression this guards: a quote-intolerant parser captures `"quality"`
    // (literal quote characters included) instead of `quality`, which then
    // silently fails every downstream manifest/selected-map join.
    assert.equal(quoted.id, 'T-PARITY-001');
    assert.equal(quoted.expectedWorkflowMode, 'quality');
    assert.equal(quoted.fullInventoryIntent, false);
    assert.deepEqual(quoted.pairs, [{ workflowMode: 'quality', leafResourceId: 'references/example.md' }]);
  });
}

function testQuotedMultiModeUnionAndEmptyPairsList() {
  withTempPlaybookDir((dir) => {
    const p = path.join(dir, 'multi-mode.md');
    fs.writeFileSync(p, QUOTED_MULTI_MODE_FIXTURE, 'utf8');
    const fixture = topology.parseFixture(p, dir);

    assert.equal(fixture.ok, true);
    assert.equal(fixture.expectedWorkflowMode, 'quality+code-review');
    assert.equal(fixture.fullInventoryIntent, true);
    assert.equal(fixture.leafResourcesParsed, true);
    assert.deepEqual(fixture.pairs, []);
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. RUN
// ─────────────────────────────────────────────────────────────────────────────

testQuotedAndUnquotedParseToIdenticalStructuredOutput();
testQuotedValuesAreFullyStrippedOfQuoteCharacters();
testQuotedMultiModeUnionAndEmptyPairsList();
console.log('[sk-doc] validate-playbook-topology quote-tolerance coverage passed');
