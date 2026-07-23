---
title: "Implementation Summary: Skill Benchmark Typed Ledger Schema"
description: "The additive-dark Skill Benchmark schema extends the closed Deep Improvement Common ledger with 21 namespaced treatment, scenario, exposure, trajectory, gold, risk, and certificate events."
trigger_phrases:
  - "Skill Benchmark typed ledger implementation"
  - "skill benchmark event union"
  - "skill benchmark legacy upcaster"
importance_tier: "high"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/007-skill-benchmark/001-typed-ledger-schema"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/007-skill-benchmark/001-typed-ledger-schema"
    last_updated_at: "2026-07-23T12:15:00Z"
    last_updated_by: "codex"
    recent_action: "Closed registry narrowing and compatibility test gaps"
    next_safe_action: "Fold the exported union in 002-reducers-and-projections"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/skill-benchmark-ledger-schema/skill-benchmark-ledger-types.ts"
      - ".opencode/skills/system-deep-loop/runtime/lib/skill-benchmark-ledger-schema/skill-benchmark-ledger-schema.ts"
      - ".opencode/skills/system-deep-loop/runtime/lib/skill-benchmark-ledger-schema/legacy-compatibility.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/skill-benchmark-ledger-schema.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "skill-benchmark-ledger-schema-implementation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The combined registry contains 56 stems: 35 common and 21 Skill Benchmark"
      - "Shared common definitions are registry-narrowed to the skill-benchmark variant"
      - "Normalized score writes remain pinned to backend:deep-improvement-score"
      - "The payload previous-hash claim is digest-bound but actual-head equality is an integration boundary"
      - "Reducers, rankings, projections, and authority cutover remain out of scope"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-typed-ledger-schema |
| **Implemented** | 2026-07-23 |
| **Level** | 3 |
| **Status** | Complete |
| **Posture** | Additive-dark; existing Skill Benchmark paths remain authoritative |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## What Was Built

`skill-benchmark-ledger-schema` exposes a 56-stem discriminated union. The first 35 stems, their wire names, payload
maps, scope maps, validators, deterministic digests, and compatibility boundaries come directly from
`deep-improvement-common-ledger-schema`. The module adds 21 closed `skill_benchmark.*` stems:

- Run and design: `run_planned`, `treatment_assigned`, and `run_closed`.
- Scenario lifecycle: `scenario_started`, `scenario_finished`, and `scenario_aborted`.
- Skill path: `skill_discovered`, `skill_loaded`, `skill_invoked`, and `resource_exposed`.
- Trajectory: `milestone_observed` and `trajectory_recorded`.
- Evaluation: `outcome_recorded`, `score_observed`, and `gold_integrity_recorded`.
- Risk and compatibility: `compatibility_observed`, `negative_transfer_observed`, and `security_probe_recorded`.
- Certificate lifecycle: `effect_certificate_issued`, `effect_certificate_withheld`, and
  `effect_certificate_expired`.

Every benchmark-specific payload and nested value object has an exact allowed-key set. Identifiers, references,
versions, codes, digests, timestamps, numeric observations, enums, raw score axes, and validity domains each use a
semantic validator. Payloads retain artifact references plus digests and reject mutable output, transcript, trace,
gold, source, evidence, or report bodies.

### Shared extension contract

The module imports and combines `DeepImprovementCommonEventStems`, `DeepImprovementCommonWireEventTypes`,
`DeepImprovementCommonPayloadMap`, and `DeepImprovementCommonScopeMap`. Common preparation and payload hashing route
through the real common factory; the specialization additionally requires `variant: skill-benchmark`. No common
payload, scope, wire type, envelope field, authorization rule, or compatibility validator was copied, reopened, or
widened.

The combined registry wraps every shared common definition with the same specialization guard. Direct
`prepareEventWrite`, the exported common preparation helper, and `AppendOnlyLedger.appendAuthorized` therefore reject
a foreign common variant before it can become a durable Skill Benchmark event. The unchanged common validator still
runs after lane narrowing.

`SKILL_BENCHMARK_SCORE_WRITE_BACKEND_REF` is the exact imported
`DEEP_IMPROVEMENT_COMMON_SCORE_WRITE_BACKEND_REF`. Both raw score observations and common normalized scores accept
only `backend:deep-improvement-score`.

### Raw evidence and verdict separation

Scenario outcomes contain final-state, deterministic-check, dynamic-reference, and constraint-coverage references
without scores or rankings. `score_observed` adds raw score axes, evaluator identity, cost, latency, tokens, workload,
and an explicit gold-integrity reference. Pending and structural-only gold must be numerator-ineligible.

An issued effect certificate requires a typed
`event:deep_improvement_common.evaluation_normalized:*` reference and payload digest. A raw
`skill_benchmark.score_observed` reference cannot satisfy that field, and neither raw outcome nor raw score payloads
accept rank or promotion keys. Shared promotion events continue to require the common normalized-score and canary
references plus the real external authorization boundary.

### Successor Contract

The next sibling consumes `SkillBenchmarkLedgerEvent`, `SkillBenchmarkPayloadMap`, `SkillBenchmarkScopeMap`,
`SkillBenchmarkEventStems`, `SkillBenchmarkWireEventTypes`, `createSkillBenchmarkEventRegistry`,
`prepareSkillBenchmarkEvent`, and `skillBenchmarkPayloadDigest`. Reducers may fold these facts but must not widen
common or benchmark payloads back to open objects, reinterpret raw observations as normalized verdicts, or replace
the pinned score backend.
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

### Real Substrate

`substrateImportsReal` is `true`. Tests use the actual `EventTypeRegistry`, `prepareEventWrite`,
`TransitionAuthorizationGateway`, `AppendOnlyLedger.appendAuthorized`, and verified ledger reader. Unauthorized
writes reject before append and leave the ledger head unchanged. Replay metadata is mandatory on every payload, while
durable transition authorization remains owned by the shared gateway and ledger frame.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `runtime/lib/skill-benchmark-ledger-schema/skill-benchmark-ledger-types.ts` | Created | Combined event union, wire maps, closed scopes, and payload types |
| `runtime/lib/skill-benchmark-ledger-schema/skill-benchmark-ledger-schema.ts` | Created | Combined registry, closed validation, preparation, deterministic digests, and score binding |
| `runtime/lib/skill-benchmark-ledger-schema/legacy-compatibility.ts` | Created | Fail-closed compatibility decisions and pure planning-record upcaster |
| `runtime/lib/skill-benchmark-ledger-schema/index.ts` | Created | Public module exports |
| `runtime/tests/unit/skill-benchmark-ledger-schema.vitest.ts` | Created | All-stem, authorization, smuggling, gold, score, version, and upcast coverage |
| Leaf packet docs | Updated | Completion state, evidence, and successor handoff |
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Route common events through the common factory | The common validator, digest, version, and preparation boundary must remain singular. |
| Add only namespaced benchmark facts | Treatment, scenario, exposure, trajectory, gold, risk, and certificate data does not belong in shared closed shapes. |
| Keep raw outcomes and scores verdict-free | Rankings and promotions require the typed common normalization event instead of caller annotations. |
| Pin score writes to the imported backend constant | A benchmark caller cannot select or fork the authenticated score path. |
| Require explicit gold eligibility | Pending and structural-only gold remain observable without entering a positive numerator. |
| Fail closed on legacy derived verdicts | Lossy rankings and promotions stay pinned to the old runtime rather than acquiring fabricated evidence. |
| Keep actual-head equality outside the schema leaf | The schema binds `prevEventHash` into the payload digest, while the authorized ledger owns physical frame linkage and integration or reducers compare the semantic claim. |
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Targeted Vitest | PASS: 1 file, 16 tests |
| All-stem matrix | PASS: 56/56 stems authorize, append, and read back |
| Raw/derived boundary | PASS: raw outcomes and scores reject rank, promotion, mutable-body, and alternate-backend fields |
| Gold integrity | PASS: pending and structural-only gold cannot become numerator-eligible |
| Transition authorization | PASS: unauthorized and foreign-variant writes commit zero events; the correct lane variant appends |
| Legacy compatibility | PASS: exact/compatible/migrate/two pin paths/block outcomes; source and upcaster digests retained |
| Comment hygiene | PASS: no ephemeral decision, requirement, checklist, task, or spec-path labels in code comments |
| Runtime TypeScript project | PASS: whole-runtime TypeScript check exits 0; scoped module errors 0 |
| Strict spec validation | PASS: exit 0, Errors 0, Warnings 0 |
<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## Known Limitations

1. No reducer, projection, ranking, attribution estimator, or materialized view is implemented.
2. No authoritative writer, cutover, rollback switch, or legacy retirement is implemented.
3. Certificates are lifecycle facts with evidence references; issuance policy and confidence computation remain
   reducer concerns.
4. Legacy upcasting is intentionally narrow. Unknown, lossy, derived-ranking, or identity-deficient records block or
   pin to the old runtime.
5. The schema validates and digest-binds `payload.prevEventHash`, but it does not compare that claim with the real prior
   ledger head. `AppendOnlyLedger` links each physical frame to its verified head; ledger integration or reducer replay
   must compare the payload claim before treating it as proof of semantic head equality.
<!-- /ANCHOR:limitations -->
