---
title: "Implementation Plan: In-Flight State Classification"
description: "Implementation plan for producing and verifying the five-way in-flight state disposition manifest consumed by phase 014."
trigger_phrases:
  - "in-flight state classification implementation plan"
  - "deep-loop state disposition manifest plan"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/008-compatibility-shadow-and-rollback-bridge/004-inflight-state-classification"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/008-compatibility-shadow-and-rollback-bridge/004-inflight-state-classification"
    last_updated_at: "2026-07-15T14:32:45Z"
    last_updated_by: "codex"
    recent_action: "Planned the row-level classification manifest and cutover handoff"
    next_safe_action: "Freeze the phase-003 census before assigning row dispositions"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: In-Flight State Classification

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | system-deep-loop compatibility and phase-014 cutover handoff |
| **Change class** | Planning contract and future classification manifest |
| **Execution** | Legacy-authoritative, additive, dark, and fail closed |

### Overview
Build a deterministic classifier over the frozen phase-003 in-flight-state census, assign every row exactly one of
`UPCAST`, `PIN`, `FORK`, `MIGRATE`, or `BLOCK`, verify its class-specific prerequisites, and emit an immutable manifest
digest phase 014 can consume. The plan does not move state or authority. It converts the phase-003 family inventory,
phase-004 transition/rollback constraints, and program migration model into a total cutover decision surface whose
default is `BLOCK`.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The executed phase-003 census is frozen with stable row IDs, state-family ownership, paths, lifecycle data, and evidence digests
- [ ] The phase-004 upcaster, authority, rollback, and cutover-certificate policy is ratified
- [ ] The five classes, precedence order, reason codes, required fields, and freshness invalidators are schema-defined
- [ ] The classification runner reads snapshots or fixtures and cannot mutate live authoritative state
- [ ] Every mode/workstream has an owner for census gaps and blocking dispositions

### Definition of Done
- [ ] Every frozen census row has exactly one evidence-backed class and zero rows are missing or duplicated
- [ ] Every `UPCAST`, `PIN`, `FORK`, and `MIGRATE` row passes its class-specific verifier
- [ ] Every unresolved or unsafe row is `BLOCK`, and each mode gate refuses cutover while any live block remains
- [ ] The manifest digest, row evidence, rollback anchors, and freshness contract are consumable by phase 014
- [ ] Legacy authority remains unchanged and no live state is mutated by classification
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Census adapter**: reads the frozen phase-003 state manifest and rejects unstable IDs, duplicate rows, unsupported
  families, missing paths, or unverified evidence without altering the census.
- **Evidence normalizer**: materializes the row's state digest, schema/version, lifecycle point, authority epoch,
  mutability, locks/leases, pending effects, identity/order/idempotency coverage, checkpoint, and rollback anchor.
- **Decision engine**: applies `BLOCK` vetoes first, then the bounded `PIN`, isolated `FORK`, checkpointed `MIGRATE`,
  and pure `UPCAST` criteria. It emits one enum and one reason code; no fallback list is stored.
- **Class verifiers**: prove deterministic replay for `UPCAST`, bounded legacy completion for `PIN`, effect and namespace
  isolation for `FORK`, transactional completeness and reversibility for `MIGRATE`, and explicit refusal for `BLOCK`.
- **Classification manifest**: binds the census digest, BASE, code/contract versions, row dispositions, evidence digests,
  verifier receipts, mode ownership, expiry/freshness fields, and a canonical whole-manifest digest.
- **Phase-014 gate adapter**: re-reads current state and requires digest/epoch/lease/effect parity before returning the
  handling instruction. Any drift or missing evidence returns `BLOCK` before authority compare-and-swap.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Freeze and verify the executed phase-003 census, BASE identity, row IDs, state-family coverage, and rollback anchors.
- Pin the phase-004 policy revision and phase-tree migration model consumed by the classifier.
- Define the manifest schema, allowed enum, reason-code registry, canonicalization, and evidence-retention boundary.

### Phase 2: Implementation
- Implement census ingestion and totality checks without live-state mutation.
- Implement normalized evidence extraction and the fail-closed five-way precedence engine.
- Apply the spec's family baseline map, then require an explicit evidence-backed decision for every concrete row.
- Implement class-specific fixtures and verifiers for pure upcast, legacy pin, dark fork, reversible migration, and block.
- Bind shadow forks to phase-006 parity cases and bind all non-blocked dispositions to sibling rollback-drill scenarios.
- Emit the canonical classification manifest and a read-only phase-014 gate adapter with freshness revalidation.

### Phase 3: Verification
- Prove census totality, enum exclusivity, deterministic repeatability, and stable canonical manifest hashing.
- Exercise every family baseline plus missing, duplicate, corrupt, unknown, stale, locked, effect-uncertain, and
  rollback-unanchored negative fixtures.
- Verify `PIN` reaches terminal legacy receipts without dual authority and `FORK` publishes no live effects.
- Verify `MIGRATE` preserves identity/order/idempotency/pending-work semantics and restores from the retained anchor.
- Simulate post-classification state/epoch drift and prove phase 014 receives `BLOCK` before compare-and-swap.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 / REQ-002 | Property and fixture tests prove one manifest row and one allowed enum per frozen census row, with zero gaps or duplicates |
| REQ-003 / REQ-008 | Missing-field, unknown-family, corrupt-state, active-lock, effect-uncertain, lossy, and absent-anchor fixtures deterministically return `BLOCK` |
| REQ-004 | Every supported historical shape replays through the registered pure adjacent chain with preserved source bytes and identical effective-state digest |
| REQ-005 | Pinned active-run fixtures remain legacy-authoritative, reach a bounded terminal receipt, and block on timeout or unavailable legacy completion |
| REQ-006 | Fork fixtures use isolated identities and sinks, reproduce parity inputs, publish no effects, and leave source state unchanged |
| REQ-007 | Migration fixtures import a transactional checkpoint, preserve identity/order/idempotency/budgets/receipts/pending work, and restore the legacy anchor |
| REQ-009 | A census-family coverage test maps every executed row to the declared baseline or a reviewed evidence-backed override |
| REQ-010 / REQ-011 | Digest, authority-epoch, lease, effect-set, schema, and rollback-anchor drift all invalidate the manifest row and prevent phase-014 compare-and-swap |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The phase definition declares `depends_on: []`; the predecessor and successor are sibling navigation contracts rather
than hard runtime dependencies. Execution still requires the frozen phase-003 census as its data source, the
phase-004 transition/versioning/rollback policy as its normative decision boundary, phase-006 shadow parity for dark
fork evidence, sibling rollback drills for reversal evidence, and phase 014 as the sole state-migration and authority
cutover consumer. If the census remains planned or contains unclassified rows, execution stops with `BLOCK` rather
than inferring state from the working tree.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

This planning phase changes no runtime authority or live state. Its authored contract can be reverted as a scoped
documentation change. During later implementation, classification outputs are additive evidence: supersede a bad
manifest with a new version bound to the same census lineage, never edit a manifest already referenced by a drill or
certificate. A failed verifier, stale row, or rollback rehearsal invalidates the affected disposition and restores
`BLOCK`; legacy authority and the phase-003 rollback anchor remain intact until phase 014 completes a governed flip.
<!-- /ANCHOR:rollback -->
