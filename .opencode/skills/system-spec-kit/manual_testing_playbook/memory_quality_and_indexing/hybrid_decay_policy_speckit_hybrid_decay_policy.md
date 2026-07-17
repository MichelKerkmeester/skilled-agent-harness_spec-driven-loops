---
title: "177 -- Hybrid decay policy (SPECKIT_HYBRID_DECAY_POLICY)"
description: "This scenario validates hybrid decay policy (SPECKIT_HYBRID_DECAY_POLICY) for `177` with executable source checks and targeted Vitest coverage for the default-on no-decay policy."
audited_post_018: true
phase_018_change: "Remove rollout framing; keep the no-decay policy validation and source checks"
version: 3.6.0.17
id: memory-quality-and-indexing-hybrid-decay-policy-speckit-hybrid-decay-policy
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# 177 -- Hybrid decay policy (SPECKIT_HYBRID_DECAY_POLICY)

## 1. OVERVIEW

This scenario validates hybrid decay policy (SPECKIT_HYBRID_DECAY_POLICY) for `177`. It focuses on the default-on no-decay policy and verifies the type-aware behavior for `decision`, `constitutional`, and `critical` context types with executable source checks and regression tests.

---

## 2. SCENARIO CONTRACT


- Objective: Verify type-aware no-decay FSRS policy for decision/constitutional/critical types.
- Real user request: `` Please validate Hybrid decay policy (SPECKIT_HYBRID_DECAY_POLICY) against the documented validation surface and tell me whether the expected signals are present: `rg` finds `SPECKIT_HYBRID_DECAY_POLICY`, `HYBRID_NO_DECAY_CONTEXT_TYPES`, `classifyHybridDecay`, `getHybridDecayMultiplier`, `applyHybridDecayPolicy`, `calculateRetrievability`, and the central `isHybridDecayPolicyEnabled()` accessor; the Vitest run exits 0; the current baseline summary is `Test Files 2 passed (2)` and `Tests 30 passed (30)`. ``
- Prompt: `Validate hybrid decay policy for no-decay memory types.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: `rg` finds `SPECKIT_HYBRID_DECAY_POLICY`, `HYBRID_NO_DECAY_CONTEXT_TYPES`, `classifyHybridDecay`, `getHybridDecayMultiplier`, `applyHybridDecayPolicy`, `calculateRetrievability`, and the central `isHybridDecayPolicyEnabled()` accessor; the Vitest run exits 0; the current baseline summary is `Test Files 2 passed (2)` and `Tests 30 passed (30)`
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if the expected symbols are present and the targeted Vitest run exits 0 with no failed tests. FAIL if any symbol is missing, protected types do not map to Infinity/no-decay, or the test run fails.

---

## 3. TEST EXECUTION

### Prompt

```
Validate hybrid decay policy for no-decay memory types.
```

### Commands

1. `rg -n "SPECKIT_HYBRID_DECAY_POLICY|SPECKIT_CLASSIFICATION_DECAY|HYBRID_NO_DECAY_CONTEXT_TYPES|classifyHybridDecay|getHybridDecayMultiplier|applyHybridDecayPolicy|calculateRetrievability|isHybridDecayPolicyEnabled" .opencode/skills/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts .opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts`
2. `cd .opencode/skills/system-spec-kit/mcp_server && node ./node_modules/vitest/vitest.mjs run tests/hybrid-decay-policy.vitest.ts tests/fsrs-hybrid-decay.vitest.ts`

### Expected

Source grep returns matches for the flag gate, no-decay set, classifier, multiplier, policy application, and FSRS retrievability helpers; Vitest reports both files passing and no `FAIL` lines; current baseline summary is `Test Files 2 passed (2)` and `Tests 30 passed (30)`

### Evidence

Command 1: `rg -n "SPECKIT_HYBRID_DECAY_POLICY|SPECKIT_CLASSIFICATION_DECAY|HYBRID_NO_DECAY_CONTEXT_TYPES|classifyHybridDecay|getHybridDecayMultiplier|applyHybridDecayPolicy|calculateRetrievability|isHybridDecayPolicyEnabled" .opencode/skills/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts .opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts`

```text
.opencode/skills/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:20:// Through calculateRetrievability(). Formula: R(t) = (1 + 19/81 * t/S)^(-0.5)
.opencode/skills/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:80:function calculateRetrievability(stability: number, elapsedDays: number): number {
.opencode/skills/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:202:  const retrievability = calculateRetrievability(params.stability, elapsedDays);
.opencode/skills/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:248: *     (stability adjustment, activated via SPECKIT_CLASSIFICATION_DECAY env var)
.opencode/skills/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:260:   Gated by SPECKIT_CLASSIFICATION_DECAY env var.
.opencode/skills/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:290: * SPECKIT_CLASSIFICATION_DECAY is enabled. Do NOT combine with TIER_MULTIPLIER.
.opencode/skills/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:336: * Gated by SPECKIT_CLASSIFICATION_DECAY env var (must be "true" or "1").
.opencode/skills/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:351:  if (isHybridDecayPolicyEnabled() && HYBRID_NO_DECAY_CONTEXT_TYPES.has(contextType)) {
.opencode/skills/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:355:  // Graduated: default-ON. Set SPECKIT_CLASSIFICATION_DECAY=false to disable.
.opencode/skills/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:356:  const flag = process.env.SPECKIT_CLASSIFICATION_DECAY?.toLowerCase();
.opencode/skills/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:370:   Gated by SPECKIT_HYBRID_DECAY_POLICY env var (default ON).
.opencode/skills/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:383:   SPECKIT_HYBRID_DECAY_POLICY can be disabled explicitly with false or 0.
.opencode/skills/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:390:const HYBRID_NO_DECAY_CONTEXT_TYPES: ReadonlySet<string> = new Set([
.opencode/skills/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:409: * Default: TRUE (graduated). Set SPECKIT_HYBRID_DECAY_POLICY=false to disable.
.opencode/skills/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:411:function isHybridDecayPolicyEnabled(): boolean {
.opencode/skills/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:412:  const val = process.env.SPECKIT_HYBRID_DECAY_POLICY?.toLowerCase().trim();
.opencode/skills/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:425:function classifyHybridDecay(contextType: string): HybridDecayClass {
.opencode/skills/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:426:  if (HYBRID_NO_DECAY_CONTEXT_TYPES.has(contextType)) {
.opencode/skills/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:432:function getHybridDecayMultiplier(contextType: string, _importanceTier?: string): number {
.opencode/skills/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:433:  if (!isHybridDecayPolicyEnabled()) {
.opencode/skills/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:436:  return HYBRID_NO_DECAY_CONTEXT_TYPES.has(contextType) ? NO_DECAY : 1;
.opencode/skills/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:442: * When SPECKIT_HYBRID_DECAY_POLICY is ON (default):
.opencode/skills/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:451:function applyHybridDecayPolicy(stability: number, contextType: string, importanceTier?: string): number {
.opencode/skills/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:452:  const multiplier = getHybridDecayMultiplier(contextType, importanceTier);
.opencode/skills/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:482:  HYBRID_NO_DECAY_CONTEXT_TYPES,
.opencode/skills/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:483:  isHybridDecayPolicyEnabled,
.opencode/skills/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:484:  classifyHybridDecay,
.opencode/skills/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:485:  getHybridDecayMultiplier,
.opencode/skills/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:486:  applyHybridDecayPolicy,
.opencode/skills/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:489:  calculateRetrievability,
.opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts:478: * Default: TRUE (graduated). Set SPECKIT_HYBRID_DECAY_POLICY=false to disable.
.opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts:482:export function isHybridDecayPolicyEnabled(): boolean {
.opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts:483:  return isFeatureEnabled('SPECKIT_HYBRID_DECAY_POLICY');
```

Command 2: `cd .opencode/skills/system-spec-kit/mcp_server && node ./node_modules/vitest/vitest.mjs run tests/hybrid-decay-policy.vitest.ts tests/fsrs-hybrid-decay.vitest.ts`

```text

 RUN  v4.1.9 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit


 Test Files  2 passed (2)
      Tests  30 passed (30)
   Start at  13:05:00
   Duration  194ms (transform 34ms, setup 21ms, import 30ms, tests 6ms, environment 0ms)
```

### Pass / Fail

- **PASS**: the `rg` command returned all expected symbols and the Vitest command exited 0 with `Test Files  2 passed (2)` and `Tests  30 passed (30)`.

### Failure Triage

If the source grep misses a symbol, inspect `mcp_server/lib/cognitive/fsrs-scheduler.ts` or `mcp_server/lib/search/search-flags.ts`. If Vitest fails, use `hybrid-decay-policy.vitest.ts` for default-on flag behavior, type classification, Infinity stability, and TM-03 separation, and `fsrs-hybrid-decay.vitest.ts` for the lower-level no-decay multiplier and routing checks.

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [memory_quality_and_indexing/hybrid_decay_policy.md](../../feature_catalog/memory_quality_and_indexing/hybrid_decay_policy.md)
- Feature flag reference: [feature_flag_reference/1_search_pipeline_features_speckit.md](../../feature_catalog/feature_flag_reference/1_search_pipeline_features_speckit.md)
- Source files: `mcp_server/lib/cognitive/fsrs-scheduler.ts`, `mcp_server/lib/search/search-flags.ts`
- Regression tests: `mcp_server/tests/hybrid-decay-policy.vitest.ts`, `mcp_server/tests/fsrs-hybrid-decay.vitest.ts`

---

## 5. SOURCE METADATA

- Group: Memory quality and indexing
- Playbook ID: 177
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `memory_quality_and_indexing/hybrid_decay_policy_speckit_hybrid_decay_policy.md`
