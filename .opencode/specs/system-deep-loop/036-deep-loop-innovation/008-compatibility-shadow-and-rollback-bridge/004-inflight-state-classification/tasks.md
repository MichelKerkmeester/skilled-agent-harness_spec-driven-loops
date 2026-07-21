---
title: "Tasks: In-Flight State Classification"
description: "Tasks for classifying every frozen phase-003 in-flight state row and producing the fail-closed phase-014 handoff."
trigger_phrases:
  - "in-flight state classification tasks"
  - "deep-loop state disposition tasks"
importance_tier: "critical"
contextType: "implementation"
status: "complete"
parent: "system-deep-loop/036-deep-loop-innovation/008-compatibility-shadow-and-rollback-bridge/004-inflight-state-classification"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/008-compatibility-shadow-and-rollback-bridge/004-inflight-state-classification"
    last_updated_at: "2026-07-21T03:35:32Z"
    last_updated_by: "codex"
    recent_action: "Completed setup, classification, handoff, and focused verification"
    next_safe_action: "Preserve the dark manifest for later governed cutover consumption"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/inflight-state-classification/index.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/inflight-state-classification.vitest.ts"
      - "implementation-summary.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: In-Flight State Classification

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Freeze the executed phase-003 in-flight-state census, BASE, row IDs, evidence digests, and rollback anchors; stop if the census is still planned, incomplete, or unstable. [evidence: The exact 46-row census SHA-256 and BASE fixture passes in focused Vitest 45/45.]
- [x] T002 Pin the phase-004 transition/versioning/rollback policy and phase-tree migration model revisions consumed by classification. [evidence: `frozen-census-policy.ts` commits both SHA-256 values and the 14-day/5-run minima; Vitest 45/45 passed.]
- [x] T003 Define the classification-manifest schema, five-value enum, reason-code registry, canonical hash, freshness fields, and evidence-retention rules. [evidence: `inflight-state-types.ts` and `inflight-state-classifier.ts` typecheck with exit `0`.]
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Implement read-only census ingestion with missing-row, duplicate-row, unknown-family, and unstable-ID rejection. [evidence: Census tamper, missing, duplicate, and unrecognized-row fixtures pass in Vitest 45/45.]
- [x] T005 Normalize each row's digest, shape/version, lifecycle, authority epoch, mutability, leases/locks, pending effects, identities, ordering, idempotency, checkpoint, and rollback evidence. [evidence: The exact-key `ClassificationEvidence` validator and sanitized snapshot fixtures pass in Vitest 45/45.]
- [x] T006 Implement the fail-closed precedence engine with `BLOCK` veto first and no multi-class or fallback-list output. [evidence: Negative evidence fixtures return only `BLOCK`; the 46-row exclusivity assertion passes.]
- [x] T007 Apply the phase-003 family baseline map and assign every concrete row exactly one evidence-backed disposition. [evidence: The policy table has 46 entries and produces counts `11/18/4/6/7` in the focused suite.]
- [x] T008 [P] Implement `UPCAST` fixtures proving pure adjacent-version conversion, source preservation, and deterministic effective-state replay. [evidence: The upcast proof matrix and replay-fingerprint receipt assertions pass in Vitest 45/45.]
- [x] T009 [P] Implement `PIN` fixtures proving bounded legacy completion, terminal receipts, and no dual authority. [evidence: Pin timeout and missing-terminal-receipt fixtures block; Vitest 45/45 passed.]
- [x] T010 [P] Implement `FORK` fixtures proving isolated identities, shadow-only sinks, no live effects, and unchanged source state. [evidence: Live-publication and missing-parity fixtures block while source evidence remains byte-identical.]
- [x] T011 [P] Implement `MIGRATE` fixtures proving transactional checkpoint import, semantic preservation, and executable restoration. [evidence: Partial preservation and restoration-receipt failures block in focused Vitest 45/45.]
- [x] T012 [P] Implement `BLOCK` fixtures for missing evidence, corruption, locks, pending-effect uncertainty, lossy transforms, stale epochs, and absent rollback anchors. [evidence: The negative matrix covers every named veto and passes in focused Vitest 45/45.]
- [x] T013 Bind fork rows to shadow-parity cases and bind every non-blocked row to an applicable rollback-drill scenario. [evidence: Every valid evidence row requires `rollbackScenarioDigest`; fork rows additionally require `parityCaseDigest`.]
- [x] T014 Emit the canonical classification manifest and the read-only phase-014 adapter that revalidates freshness before returning a handling instruction. [evidence: `createClassificationManifest()` and `createPhase014HandlingPlan()` pass deterministic and drift tests.]
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T015 Verify: census closure is total — every frozen row appears once, receives one allowed class, and contributes to the manifest digest. [evidence: Closure is `46/46` with zero missing, duplicate, unrecognized, or unknown-class rows.]
- [x] T016 Verify: family coverage is explicit — every phase-003 state family resolves to its baseline or a reviewed evidence-backed override. [evidence: `FROZEN_CENSUS_ROW_POLICIES` has exactly 46 census-addressed entries; focused Vitest 45/45 passed.]
- [x] T017 Verify: positive classes satisfy their contracts — upcasts replay, pins terminate, forks isolate, and migrations restore. [evidence: The four positive proof unions and readiness receipt matrix pass in Vitest 45/45.]
- [x] T018 Verify: unsafe and unknown rows fail closed — every negative fixture yields `BLOCK` and no state or authority mutation. [evidence: Corrupt, unknown/future/malformed, unsafe proof, lease, effect, and rollback fixtures all block.]
- [x] T019 Verify: classification is deterministic — repeated runs over identical evidence produce byte-identical canonical manifests. [evidence: Forward and reversed evidence inputs produce equal bytes and final digest in focused Vitest 45/45.]
- [x] T020 Verify: freshness is enforced — state, epoch, schema, lease, effect-set, or rollback-anchor drift invalidates the row before phase-014 compare-and-swap. [evidence: Eight freshness mutations become live `BLOCK` instructions; Vitest 45/45 passed.]
- [x] T021 Verify: cutover handoff is complete — each mode binds the manifest digest, terminal pin receipts, migration receipts, fork parity evidence, rollback anchors, and zero live block rows. [evidence: Readiness succeeds only with complete receipts and rejects rehashed omitted-row plans in Vitest 45/45.]
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks complete. [evidence: T001-T021 are checked above with source or focused Vitest receipts.]
- [x] All requirements in spec.md met with evidence. [evidence: `implementation-summary.md` maps totality, all five classes, freshness, handoff, and dark authority to executable proofs.]
- [x] Phase gate green (validate/build/test as applicable). [evidence: Focused Vitest 45/45 and full runtime `tsc --noEmit` exit `0`; strict validation is recorded in `implementation-summary.md`.]
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
