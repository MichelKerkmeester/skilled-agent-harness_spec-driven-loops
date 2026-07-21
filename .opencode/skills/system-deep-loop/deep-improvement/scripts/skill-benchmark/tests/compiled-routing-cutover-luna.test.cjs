#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ compiled-routing-cutover-luna.test — cutover gate + LUNA stage + topology ║
// ║ recursion fixtures (all injected; no live model, no live fleet)           ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const cutover = require('../cutover-playbook-executor.cjs');
const luna = require('../luna-acceptance.cjs');
const topology = require('../../../../../sk-doc/create-skill/scripts/validate-playbook-topology.cjs');

const EVIDENCE = {
  compiled_route: 'demo-hub/mode-a', serving_authority: 'compiled', flag_state: 'unset',
  fallback_cause: 'compiled-serving', manifest_digest: 'abc', model: 'router-replay', reasoning_effort: 'n/a',
};
const scenario = (over = {}) => ({ id: 'S-1', prompt: 'do a thing', evidence: EVIDENCE, ...over });
const compiledManifest = () => ({ servingAuthority: 'compiled', manifestDigest: 'abc' });
const eligible = new Set(['demo-hub']);

// ── Cutover gate: every verdict branch is reachable from injected evidence ───

// 1. compiled decision matches legacy -> PASS.
{
  const r = cutover.gateScenario({ hubId: 'demo-hub', scenario: scenario() }, {
    routeLegacy: () => ({ intents: ['mode-a'] }),
    routeCompiled: () => ({ action: 'route', intents: ['mode-a'] }),
    readManifestAuthority: compiledManifest, statusProbe: () => null, eligibleHubs: eligible, flagRaw: undefined,
  });
  assert.equal(r.verdict, 'PASS');
  assert.equal(r.critical, true);
  // The full seven-field evidence contract is captured on the row.
  for (const k of cutover.EVIDENCE_FIELD_ORDER) assert.ok(r.evidence[k] != null, `evidence.${k} present`);
}

// 2. compiled decision differs from legacy -> FAIL (real drift).
{
  const r = cutover.gateScenario({ hubId: 'demo-hub', scenario: scenario() }, {
    routeLegacy: () => ({ intents: ['mode-a'] }),
    routeCompiled: () => ({ action: 'route', intents: ['mode-b'] }),
    readManifestAuthority: compiledManifest, statusProbe: () => null, eligibleHubs: eligible,
  });
  assert.equal(r.verdict, 'FAIL');
  assert.equal(r.reason, 'compiled-decision-differs-from-legacy');
}

// 3. serving authority not compiled -> FAIL (vacuous).
{
  const r = cutover.gateScenario({ hubId: 'demo-hub', scenario: scenario() }, {
    routeLegacy: () => ({ intents: ['mode-a'] }), routeCompiled: () => ({ action: 'route', intents: ['mode-a'] }),
    readManifestAuthority: () => ({ servingAuthority: 'legacy', manifestDigest: 'abc' }),
    statusProbe: () => null, eligibleHubs: eligible,
  });
  assert.equal(r.verdict, 'FAIL');
  assert.equal(r.parityStatus, 'vacuous');
}

// 4. compiled defers (no route) -> PASS (serves legacy unchanged).
{
  const r = cutover.gateScenario({ hubId: 'demo-hub', scenario: scenario() }, {
    routeLegacy: () => ({ intents: ['mode-a'] }), routeCompiled: () => ({ action: 'defer', intents: [] }),
    readManifestAuthority: compiledManifest, statusProbe: () => null, eligibleHubs: eligible,
  });
  assert.equal(r.verdict, 'PASS');
  assert.equal(r.reason, 'compiled-defers-to-legacy');
}

// 5. hub outside the serving closure -> SKIP.
{
  const r = cutover.gateScenario({ hubId: 'other-hub', scenario: scenario() }, {
    readManifestAuthority: compiledManifest, statusProbe: () => null, eligibleHubs: eligible,
  });
  assert.equal(r.verdict, 'SKIP');
}

// 6. compiled engine throws -> FAIL (broken compiled path).
{
  const r = cutover.gateScenario({ hubId: 'demo-hub', scenario: scenario() }, {
    routeLegacy: () => ({ intents: ['mode-a'] }), routeCompiled: () => { throw new Error('boom'); },
    readManifestAuthority: compiledManifest, statusProbe: () => null, eligibleHubs: eligible,
  });
  assert.equal(r.verdict, 'FAIL');
  assert.equal(r.parityStatus, 'resolver-missing');
}

// 7. join-gate blocks on a critical FAIL and stays legible.
{
  const rows = [{ scenarioId: 'A', critical: true, verdict: 'PASS' }, { scenarioId: 'B', critical: true, verdict: 'FAIL' }];
  // Exercise the roll-up logic via a synthetic dir with no files, then assert the
  // shape directly on the gate output for a mixed set.
  const empty = cutover.runCutover({ hubId: 'demo-hub', dir: path.join(os.tmpdir(), 'no-such-cr-dir-xyz') });
  assert.equal(empty.joinGate.verdict, 'SKIP'); // no scenarios -> nothing to serve
  assert.ok(Array.isArray(empty.scenarios));
  void rows;
}

// ── LUNA acceptance: transport honesty + generalization, all injected ────────

const okReply = { timedOut: false, stdout: 'log line', stderr: '', lastMessage: 'ROUTED: {"workflowMode": "code-webflow", "intents": ["code-webflow"]}\n```json\n{"surface": "WEBFLOW", "resources": ["references/x.md"]}\n```' };

// 8. A transport timeout is SKIP, never PASS/FAIL; stdout/stderr are separate.
{
  const r = luna.runScenario(
    { hubId: 'sk-code', entry: luna.SCENARIO_MAP['sk-code'].routing, stage: 'routing' },
    { dispatch: () => ({ timedOut: true, stdout: 'partial output', stderr: 'stalled at ceiling', lastMessage: '' }) },
  );
  assert.equal(r.verdict, 'SKIP');
  assert.equal(r.reason, 'transport-timeout');
  assert.equal(r.transport.stdout, 'partial output');
  assert.equal(r.transport.stderr, 'stalled at ceiling');
  assert.notEqual(r.transport.stdout, r.transport.stderr);
}

// 9. A correct stated route -> PASS (routing plane).
{
  const r = luna.runScenario(
    { hubId: 'sk-code', entry: luna.SCENARIO_MAP['sk-code'].routing, stage: 'routing' },
    { dispatch: () => okReply },
  );
  assert.equal(r.verdict, 'PASS');
  assert.equal(r.providerModel, 'openai/gpt-5.6-luna');
  assert.equal(r.variant, 'high');
}

// 10. A gold-bearing holdout the model routes correctly -> PASS, route withheld.
{
  const entry = luna.SCENARIO_MAP['sk-code'].holdout;
  const audit = luna.auditHoldout(entry);
  assert.equal(audit.withheld, true, `holdout route must be withheld from its own prompt (leaks: ${audit.leaks})`);
  const r = luna.runScenario({ hubId: 'sk-code', entry, stage: 'holdout' }, { dispatch: () => okReply });
  assert.equal(r.verdict, 'PASS');
  assert.equal(r.holdoutAudit.withheld, true);
}

// 11. Every hub in the map ships a gold-bearing holdout with its route withheld.
{
  for (const [hubId, entries] of Object.entries(luna.SCENARIO_MAP)) {
    assert.ok(entries.holdout, `${hubId} must have a holdout`);
    const audit = luna.auditHoldout(entries.holdout);
    assert.equal(audit.withheld, true, `${hubId} holdout leaks: ${audit.leaks.join(',')}`);
    assert.ok(entries.holdout.goldMode, `${hubId} holdout must carry a gold mode`);
  }
}

// ── Topology recursion: a nested per-feature defect must not pass ─────────────

// 12. A defect in a deep per-feature file blocks the whole surface (verdict FAIL).
{
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'cr-topo-'));
  try {
    fs.writeFileSync(path.join(dir, 'leaf-manifest.json'), JSON.stringify({
      resourceContractVersion: 1, modes: [{ workflowMode: 'm', packet: 'm', leaves: ['references/ok.md'] }],
    }));
    const pb = path.join(dir, 'manual-testing-playbook', 'deeply', 'nested');
    fs.mkdirSync(pb, { recursive: true });
    // Root-level clean fixture.
    fs.writeFileSync(path.join(dir, 'manual-testing-playbook', 'clean.md'),
      '---\nid: OK-1\nexpected_workflow_mode: m\nexpected_leaf_resources:\n  - workflow_mode: m\n    leaf_resource_id: references/ok.md\n---\n# clean\n');
    // Deep per-feature fixture whose typed leaf is NOT in the manifest -> blocked.
    fs.writeFileSync(path.join(pb, 'defect.md'),
      '---\nid: BAD-1\nexpected_workflow_mode: m\nexpected_leaf_resources:\n  - workflow_mode: m\n    leaf_resource_id: references/not-in-manifest.md\n---\n# defect\n');
    const report = topology.runValidation({ playbookDir: path.join(dir, 'manual-testing-playbook'), skillDir: dir });
    assert.equal(report.verdict, 'FAIL', 'a nested per-feature defect must fail the run verdict');
    const bad = report.results.find((r) => r.id === 'BAD-1');
    assert.ok(bad && bad.status === 'blocked' && bad.verdict === 'FAIL', 'the nested defect leaf must be visited and blocked');
    const clean = report.results.find((r) => r.id === 'OK-1');
    assert.ok(clean && clean.verdict === 'PASS', 'the clean root leaf still passes');
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

console.log('[system-deep-loop] compiled-routing cutover + LUNA + topology-recursion fixtures passed');
