---
title: "Feature Specification: system-code-graph Non-Hub Router Rollout"
description: "Compile the standalone system-code-graph inline router into CompiledPolicyV1, emit read-only projections and typed fixtures, prove frozen-scorer compatibility and zero-authority legacy shadow parity, and exercise fenced byte-exact rollback without changing live routing surfaces."
trigger_phrases:
  - "system code graph compiled policy"
  - "system code graph non hub rollout"
  - "system code graph shadow parity rollback"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/020-router-unification-program/007-unified-refactor-implementation/009-non-hub-rollout/002-system-code-graph"
    last_updated_at: "2026-07-19T12:10:00.000Z"
    last_updated_by: "codex"
    recent_action: "Closed target, scorer, parity, rollback, syntax, and strict gates"
    next_safe_action: "Keep live activation deferred until the program promotion gate"
    blockers: []
    key_files:
      - "harness/validate.cjs"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# system-code-graph Non-Hub Router Rollout

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Implemented and target-locally verified |
| **Created** | 2026-07-19 |
| **Blast radius** | Low: additive child artifacts only; live authority remains zero |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

`system-code-graph` is a standalone skill with one inline `INTENT_SIGNALS`/`RESOURCE_MAP` router, one workflow mode, and no hub registry or sub-mode packets. It needs the same compiled-policy rollout proof as the original singleton compiler input, but phase 001's checked mcp-code-mode artifacts have unrelated migration drift and cannot serve as this target's gate.

### Purpose

Compile only `system-code-graph` through the generic phase-001 compiler modules and prove its own artifacts, scorer projection, legacy comparison, closed algebra, and rollback without invoking or repairing phase 001's target gate.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Read `system-code-graph/SKILL.md` and `leaf-manifest.json` as immutable authored sources.
- Preserve 37 authored intent classes, 53 authorized leaf identities, two fallback-only support defaults, and three authored negative-admission phrases.
- Compile one local standalone destination with no bundles, handoff, cross-target edges, learning overlay, or ranking calls.
- Emit policy, advisor projection, typed route gold, generated policy card, and five typed fixture families.
- Run compatibility rows through the real protected scorer in a read-only subprocess and prove falsifiers fail.
- Compare compiled decisions with the real legacy router while the checked manifest keeps legacy authoritative.
- Exercise one-generation fenced activation and byte-exact rollback in memory.

### Out of Scope

- Any edit to the live skill, routing configuration, shared scorer, contract schemas, or phase-001 compiler/harness.
- Live activation, destination execution, effects, receipts, calibration, learning, or cleanup of legacy routing.
- Repair of phase 001's stale checked `mcp-code-mode` policy.

### Files to Change

All writes are confined to this child. The lean phase parent already existed and required no change.

| Artifact | Change Type | Purpose |
|----------|-------------|---------|
| `harness/*.cjs` | Create | Target-local source adapter, build, isolated fingerprint, and real-green validation |
| `parity/run-shadow.cjs` | Create | Reuse the generic shadow-parity module for target observations |
| `activation/` | Create | Checked manifests, fence state, and an in-memory activation/rollback drill |
| `compiled/system-code-graph/` | Create | Canonical policy and three read-only projection families plus fixtures |
| Packet documents and generated metadata | Create | Level-2 scope, plan, tasks, evidence, and continuity metadata |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Reuse the generic compiler and frozen contracts | Target code imports phase-001 compiler/projection/evaluator modules and phase-000 canonical/schema modules; neither shared phase is edited |
| REQ-002 | Compile authored singleton routing faithfully | Policy has one destination, 37 selectors, 53 leaf detectors, fallback-only defaults that do not auto-route, and static provenance |
| REQ-003 | Preserve the closed decision algebra | Positive signal routes; zero signal defers `no-match`; equal evidence clarifies once; authored exclusion rejects; non-routes carry no target or usable authority |
| REQ-004 | Emit deterministic projections and fixtures | Two in-memory builds, two isolated processes, and checked artifacts are byte-identical |
| REQ-005 | Use the real frozen scorer | Five compatibility-projected typed rows pass in the protected scorer subprocess and two deliberate falsifiers fail |
| REQ-006 | Preserve zero live authority | Legacy remains serving-authoritative, compiled effects total zero, and parity mismatches are classified without gold mutation |
| REQ-007 | Prove fenced rollback | Activation pins generation 1, rollback restores generation-0 manifest bytes exactly, and stale epochs remain rejected |
| REQ-008 | Protect scorer bytes | All three scorer files match their before/after SHA-256 baselines |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-009 | Keep compiler degeneracy skill-agnostic | Shared compiler contains no `system-code-graph` literal and no branch on `skillId` |
| REQ-010 | Preserve document-only honesty | Generated card routes/clarifies/defers/rejects but terminates `DOCUMENT_ONLY_UNATTESTED` and claims no live effects |
| REQ-011 | Keep target code and packet valid | Every `.cjs` passes `node --check`, comment hygiene passes, JSON parses, and strict packet validation exits 0 |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `node harness/build.cjs --write` emits 13 canonical artifacts; an unchanged second build produces the same bytes.
- **SC-002**: `node harness/validate.cjs` exits 0 with a final `GREEN result=PASS` line.
- **SC-003**: Five projected rows pass the real scorer and both extra-resource and fabricated-oracle falsifiers fail.
- **SC-004**: Shadow parity records legacy authority, zero effects, one exact match, and three expected classified semantic differences.
- **SC-005**: Fenced rollback restores SHA-256 `5485c5a4a6faddca886425dedc59bd0d5340f7946f9bf7f6a8fec36e802a8c23` byte-for-byte.
- **SC-006**: The three protected scorer digests remain unchanged before and after verification.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

- Determinism uses canonical serialization and UTF-16 ordering from the frozen shared modules.
- Validation performs no target writes and proves the child tree is byte-identical before and after the run.
- No network, dependency install, live route mutation, or effect-bearing call is permitted.
- The target-local adapter derives exclusions from authored prose and removes its advisory-only sentinel from policy provenance.
<!-- /ANCHOR:nfr -->

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- A request with no selector evidence defers even though candidate cardinality is one.
- Two equal-weight intent signals produce exactly one clarification and no assembled resources.
- Fallback-only `DEFAULT_RESOURCES` remain support suggestions and never become selected typed leaves.
- A phrase from “When NOT to use” rejects before positive scoring.
- A stale fencing epoch and an authority-bearing replacement manifest both fail closed.
<!-- /ANCHOR:edge-cases -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Frozen shared compiler and canonical schemas | Drift would invalidate target bytes | Import directly, hash protected scorer files, and compare generated bytes |
| Risk | Legacy replay represents non-routes as empty observations | Typed defer/clarify/reject cannot be zero-mismatch rows | Classify all three differences and require zero effects plus scorer-green projections |
| Risk | Standalone skill has no live advisory guard source | A fabricated guard hash would pollute provenance | Use an adapter-only sentinel to satisfy source normalization, then exclude it from provenance |
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None for this shadow-only rollout. Live activation remains a later program decision.
<!-- /ANCHOR:questions -->
