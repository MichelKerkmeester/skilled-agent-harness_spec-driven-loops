#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ validate-compiled-routing-scenarios.test — content admission fixtures     ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

/**
 * Fixture sweep for the compiled-routing content validator: it must reject an
 * id-only scenario (the frozen loader's permitted minimum) and a scenario
 * missing any evidence-contract field, accept a fully-formed scenario, and flag a
 * holdout whose prompt leaks its own route.
 */

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const validator = require('../validate-compiled-routing-scenarios.cjs');

const COMPLETE = `---
id: T-CR-001
category: compiled_routing
stage: routing
route_shape: default
expected_intent: prompt-improve
expected_resources:
  - prompt-improve/references/depth-framework.md
expected_workflow_mode: prompt-improve
expected_leaf_resources:
  - workflow_mode: prompt-improve
    leaf_resource_id: references/depth-framework.md
evidence_compiled_route: sk-prompt/prompt-improve
evidence_serving_authority: compiled
evidence_flag_state: unset
evidence_fallback_cause: compiled-serving
evidence_manifest_digest: deadbeef
evidence_model: router-replay
evidence_reasoning_effort: n/a
---

# Complete fixture

**Exact prompt**:
\`\`\`text
Help me write a better prompt.
\`\`\`

## Pass/Fail Criteria
- PASS iff serving authority is compiled and the decision matches legacy.
`;

const ID_ONLY = `---
id: T-CR-002
---

# Id-only fixture
`;

const MISSING_EVIDENCE = COMPLETE.replace(/evidence_manifest_digest: deadbeef\n/, '');

const HOLDOUT_LEAK = `---
id: T-CR-003
stage: holdout
route_shape: default
expected_intent: md-generator
expected_resources:
  - design-md-generator/references/design-md-format.md
expected_workflow_mode: md-generator
expected_leaf_resources:
  - workflow_mode: md-generator
    leaf_resource_id: references/design-md-format.md
evidence_compiled_route: sk-design/md-generator
evidence_serving_authority: compiled
evidence_flag_state: unset
evidence_fallback_cause: compiled-serving
evidence_manifest_digest: deadbeef
evidence_model: gpt-5.6-luna
evidence_reasoning_effort: high
---

# Holdout that leaks

**Exact prompt**:
\`\`\`text
Route this through the md-generator mode please.
\`\`\`

## Pass/Fail Criteria
- PASS iff routed to the gold mode.
`;

function withTempDir(fn) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'cr-content-'));
  try { return fn(dir); } finally { fs.rmSync(dir, { recursive: true, force: true }); }
}

function verdictFor(text) {
  return withTempDir((dir) => {
    const p = path.join(dir, 'scenario.md');
    fs.writeFileSync(p, text, 'utf8');
    const parsed = validator.parseScenario(p);
    // hubLeaves intentionally null: these fixtures test the field contract, not
    // manifest resolution (covered live by the real 7-hub sweep).
    return validator.validateScenario(parsed, null);
  });
}

// 1. Complete scenario is accepted.
{
  const v = verdictFor(COMPLETE);
  assert.equal(v.verdict, validator.VERDICT.PASS, `complete scenario should PASS, got ${v.verdict}: ${v.problems.join('; ')}`);
}

// 2. Id-only scenario is rejected (the frozen-loader-permitted minimum).
{
  const v = verdictFor(ID_ONLY);
  assert.equal(v.verdict, validator.VERDICT.FAIL, 'id-only scenario must FAIL');
  assert.ok(v.problems.some((p) => /expected_intent/.test(p)), 'id-only must report the missing intent contract');
  assert.ok(v.problems.some((p) => /evidence_/.test(p)), 'id-only must report missing evidence fields');
}

// 3. A scenario missing one evidence-contract field is rejected.
{
  const v = verdictFor(MISSING_EVIDENCE);
  assert.equal(v.verdict, validator.VERDICT.FAIL, 'missing-evidence scenario must FAIL');
  assert.ok(v.problems.some((p) => /evidence_manifest_digest/.test(p)), 'must name the missing evidence field');
}

// 4. A holdout whose prompt leaks its own route is flagged.
{
  const v = verdictFor(HOLDOUT_LEAK);
  assert.equal(v.verdict, validator.VERDICT.FAIL, 'route-leaking holdout must FAIL');
  assert.ok(v.problems.some((p) => /leaks its own route/.test(p)), 'must name the leaked route token');
}

console.log('[sk-doc] validate-compiled-routing-scenarios content-admission fixtures passed');
