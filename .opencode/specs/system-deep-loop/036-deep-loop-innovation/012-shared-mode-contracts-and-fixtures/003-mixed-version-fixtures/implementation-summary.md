---
title: "Implementation Summary: Mixed-Version Fixtures"
description: "A sealed 32-case fixture corpus now proves old and current event and state versions coexist across every deep-loop mode workstream without moving legacy authority."
trigger_phrases:
  - "mixed-version fixtures implementation"
  - "sealed version drift corpus evidence"
  - "mixed-version oracle handoff"
importance_tier: "critical"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/012-shared-mode-contracts-and-fixtures/003-mixed-version-fixtures"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/012-shared-mode-contracts-and-fixtures/003-mixed-version-fixtures"
    last_updated_at: "2026-07-21T14:35:00Z"
    last_updated_by: "codex"
    recent_action: "Grounded resume classification in sealed restart evidence"
    next_safe_action: "Consume the sealed corpus in phase-013 mode migrations"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/mixed-version-fixtures/index.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/mixed-version-fixtures.vitest.ts"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Event and state versions are declared and validated independently."
      - "Interrupted migration supplies real restart evidence and classifies as a bounded legacy pin."
      - "Two deterministic runs from one verified capsule are required for trusted evidence."
---
# Implementation Summary: Mixed-Version Fixtures

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-mixed-version-fixtures |
| **Status** | Complete |
| **Completed** | 2026-07-21 |
| **Level** | 2 |
| **Corpus** | 32 authored cases: 8 workstreams × 4 scenario families |
| **Authority** | Legacy authoritative; dark execution has no authority mutation capability |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The leaf now exports one versioned `MixedVersionCase` envelope, a manifest-derived
32-case corpus, a phase-007 seal compiler, a phase-008 compatibility wrapper, a
frozen-classifier resume adapter, and an authored reducer/resume oracle. The four
scenarios produce the independent version pairs `1:1`, `3:3`, `1:3`, and `3:1`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `runtime/lib/mixed-version-fixtures/mixed-version-types.ts` | Created | Define the versioned envelope, authored outcome, sealed capsule, and fail-closed evidence types |
| `runtime/lib/mixed-version-fixtures/fixture-corpus.ts` | Created | Expand four authored scenarios over the exact ordered manifest workstreams |
| `runtime/lib/mixed-version-fixtures/compatibility-adapter.ts` | Created | Invoke the frozen event and state upcaster registries and retain exact hop evidence |
| `runtime/lib/mixed-version-fixtures/seal-compiler.ts` | Created | Seal and verify every replay input and the ordered capsule through the artifact store |
| `runtime/lib/mixed-version-fixtures/reducer-resume-oracle.ts` | Created | Compare isolated path output with authored evidence and invoke the frozen in-flight classifier |
| `runtime/lib/mixed-version-fixtures/index.ts` | Created | Export the public fixture API |
| `runtime/tests/unit/mixed-version-fixtures.vitest.ts` | Created | Verify controls, coexistence, interruption, sealing, registry failures, authority, and manifest closure |
| `spec.md`, `plan.md`, `tasks.md`, `checklist.md` | Modified | Record implementation state and verification closure |
| `decision-record.md` | Created | Record classifier evidence, digest guarantees, and the frozen-registry observation boundary |
| `implementation-summary.md` | Created | Preserve evidence and the phase-013 handoff |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Expected transitions are pinned in a private authored table and every case digest
is recorded at module initialization. The seal compiler rejects any fixture whose
bytes differ from that table, and reducer contexts omit the authored expectation,
so a reducer cannot read or rebaseline its own oracle. Each
run verifies the capsule and all ten ordered input references before compatibility,
classification, or reducer code executes.

Interrupted resume classification now derives a `ClassificationEvidence` row from
the verified capsule's restart metadata. The adapter binds the quiescent lease,
pending effect, receipt coverage, continuity boundary, and fencing epoch to the
real `fanout-checkpoints` census row and its `atomic-replace` mutability before the
frozen classifier runs. The independent authored literal is then compared with
the computed result; it is never copied into the classifier input.

Historical records pass through `readCompatibilityEvent` and
`StateUpcasterRegistry`; the fixture layer supplies no alternate upcast algorithm.
The parity manifest is compiled by `compileParityCaseManifest`, and both execution
paths receive separate deeply frozen clones from one verified capsule in distinct
roots. Returned evidence fixes authority to `legacy_authoritative` and exposes no
authority mutation or live-effect surface.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Pin expected outcomes independently of reducer callbacks | A tested implementation cannot manufacture the oracle that judges it |
| Validate event and state versions separately | Mixed pairs must remain observable and unsupported pairs must fail as typed errors |
| Seal the full case plus nine replay inputs | Any mutable alias, partial publication, reordered reference, or altered digest blocks before execution |
| Require exact `1 -> 2 -> 3` traces | Historical records cannot skip an adjacent transform and current records cannot downcast |
| Use the frozen classifier for interrupted state | The fixture cannot invent or guess migration policy |
| Build classification evidence from the verified restart input | Missing-evidence fallback behavior cannot masquerade as a semantic fixture result |
| Require two path runs and immutable isolated clones | Nondeterminism and cross-path mutation cannot contribute trusted parity evidence |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Targeted mixed-version Vitest | PASS: 1 file, 23 tests |
| Runtime TypeScript project | PASS: no emit, exit 0 |
| Scenario matrix | PASS: four scenarios over all eight ordered workstreams |
| Independent version pairs | PASS: `1:1`, `3:3`, `1:3`, and `3:1` |
| Adjacent/lossless upcast failures | PASS: gaps, lossy output, future pairs, and declaration mismatch reject |
| Sealed replay | PASS: tampered and partially published references block before path execution |
| Interrupted migration | PASS: receipt-backed restart evidence returns `pin-legacy`; missing receipt coverage returns `block`; authored mismatch throws `RESUME_DIVERGENCE` |
| Shadow parity posture | PASS: identical capsule, isolated roots, legacy authority, no authority mutation |
| Strict packet validation | PASS: Errors 0, Warnings 0 after metadata regeneration |

### Checklist Evidence Map

- CHK-001–010: `fixture-corpus.ts`, `mixed-version-types.ts`, and manifest drift/rebaseline tests.
- CHK-011–016: scenario parameterization, 32-case count, exact workstream order, and exact-hop tests.
- CHK-017–024: seal mismatch, partial publication, deterministic reads, classifier, divergence, and duplicate-effect tests.
- CHK-025–031: complete case closure, no rebaselining, bounded failures, isolated roots, and authority-fixed result types.
- CHK-032–037: canonical packet documents, this handoff, scoped status, metadata scripts, and frozen-contract hash comparison.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No production reducer or adapter changed.** The module is a fixture and verification consumer only.
2. **No runtime authority moved.** Legacy remains authoritative; cutover remains outside this leaf.
3. **Global worktree status was already dirty.** Unrelated changes predated this leaf and were preserved; scope is proven with path-filtered status plus frozen-source hashes.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:nfr-verify -->
## NFR Verification

| Constraint | Evidence | Status |
|------------|----------|--------|
| Deterministic replay | Two identical executions per path and repeated verified reads | Pass |
| Fail-closed input boundary | Tampered and partially published seal tests execute neither reducer path | Pass |
| Additive-dark authority | Result types fix legacy authority and expose no mutation capability | Pass |
| Bounded diagnostics | Failures contain codes, stages, and digests without replay payloads | Pass |
| Manifest closure | Exact eight-row order and 32-case count are enforced | Pass |
<!-- /ANCHOR:nfr-verify -->

---

<!-- ANCHOR:deviations -->
## Deviations from Plan

| Planned | Actual | Reason |
|---------|--------|--------|
| Resume could return any supported classification | The authored interrupted case expects `pin-legacy` | Real restart evidence satisfies the frozen `fanout-checkpoints` pin policy; the former `block` result came only from missing evidence |
| Shadow-parity handoff | Compiled shipped parity manifest plus isolated typed path contexts | Full replay-fingerprint execution remains owned by the frozen parity harness |
<!-- /ANCHOR:deviations -->

---

<!-- ANCHOR:next-steps -->
## Next Steps

Phase-013 mode migrations can consume the 32 sealed case identities and parity
manifest. Any fixture-schema, expectation, version-policy, adapter, or manifest
change requires a new authored case identity and a complete affected-case rerun.
<!-- /ANCHOR:next-steps -->
