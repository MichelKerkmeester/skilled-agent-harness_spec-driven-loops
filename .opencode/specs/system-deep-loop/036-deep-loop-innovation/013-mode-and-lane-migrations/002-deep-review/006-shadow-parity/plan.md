---
title: "Implementation Plan: Deep Review shadow parity"
description: "Implementation Plan for the Deep Review shadow-parity phase: pair the legacy emitter with the typed event-ledger path, compare event streams and projections, and produce a fail-closed parity certificate for the later mode gate."
trigger_phrases:
  - "Deep Review shadow parity implementation plan"
  - "deep-review ledger projection parity"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/002-deep-review/006-shadow-parity"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/002-deep-review/006-shadow-parity"
    last_updated_at: "2026-07-15T20:15:00Z"
    last_updated_by: "opencode"
    recent_action: "Specified paired execution, event comparison, and projection parity gates"
    next_safe_action: "Freeze comparator normalization and assemble Deep Review parity fixtures"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Deep Review Shadow Parity

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | system-deep-loop / deep-review mode |
| **Change class** | Shadow migration and parity verification |
| **Execution** | Paired legacy + typed-ledger runs under the phase-014 shadow framework; legacy remains authoritative |

### Overview
Deep Review must migrate its existing scope -> dimension passes -> P0/P1/P2 findings -> convergence -> review-report lifecycle without changing the shared review-loop backbone or publishing authority. The plan establishes a mode adapter, a lossless event mapping, an allowlisted normalizer, an event comparator, projection diffs, replay/resume checks, and a content-addressed parity certificate. The later mode gate may accept only a green certificate; this phase never flips authority.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The phase-012 shared review-loop contract, phase-014 shadow framework, typed event envelope, replay fingerprint, and projection contracts are frozen and addressable.
- [ ] The legacy Deep Review emitter and its scope, dimension, finding, convergence, and report boundaries are inventoried against the pinned baseline.
- [ ] The paired-run envelope can bind both paths to the same source revision, execution manifest, contract versions, and budget snapshot.
- [ ] The event normalization allowlist distinguishes non-semantic transport values from identity, ordering, evidence, and decision values.
- [ ] The parity fixture matrix includes normal, duplicate, update, resume, replay, invalid-transition, and fault-injection cases.

### Definition of Done
- [ ] Event-stream, projection, replay/resume, and safety parity are independently green for the required corpus.
- [ ] The parity certificate is reproducible from its fixture, contract, comparator, and candidate fingerprints.
- [ ] Any unexplained difference produces `PARITY_BLOCKED` and cannot publish a ledger-backed review report or authorize cutover.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Shared loop contract**: invoke the phase-012 review-loop state transitions used by Deep Review and deep-alignment; the mode adapter supplies only Deep Review payloads and finding semantics.
- **Paired-run envelope**: freeze source revision, diff or artifact identity, review scope, dimension manifest, prompt/model/tool hashes, budget snapshot, replay fingerprint, and comparator version before either path starts.
- **Legacy adapter**: observe and capture the legacy emitter's append boundaries and publication projection without modifying its authority or rewriting its records.
- **Ledger adapter**: translate the same lifecycle into typed events through the transition-authorization gateway, recording candidate, validation, impact, evidence, convergence, and report-projection lineage separately.
- **Normalization boundary**: apply one versioned allowlist for explicitly non-semantic fields; preserve raw event evidence and retain a mapping from every normalized value to its source event.
- **Event comparator**: compare event type, causal sequence, lineage, stable identity, payload, references, and multiplicity; classify missing, extra, reordered, duplicated, stale, and divergent events.
- **Projection comparator**: compare finding identity and lineage, impact, orthogonal confidence/evidence fields, dispositions, convergence, report ordering, receipts, checkpoints, and replay fingerprints.
- **Certificate and gate input**: emit a content-addressed result containing fixture coverage, exact diffs, contract fingerprints, comparator version, and safety verdict; any missing or failed dimension blocks the later mode gate.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Confirm the phase-012 and phase-014 contracts are frozen and record their fingerprints.
- Capture the pinned legacy Deep Review lifecycle, including all event and projection boundaries, without changing runtime files outside the implementation scope.
- Define the paired-run envelope, shadow storage boundary, authority assertion, and fixture identifiers.

### Phase 2: Implementation
- Build the Deep Review mode adapter over the shared review-loop contract; map scope, per-dimension work, candidate findings, validation, P0/P1/P2 impact, convergence, and report projection.
- Define stable finding identity from versioned semantic anchors, normalized source context, program slices, rename mapping, and introduced/fixed/pre-existing lineage.
- Implement the versioned normalization allowlist and preserve raw legacy and ledger events for mismatch diagnosis.
- Implement event-for-event comparison and projection comparison with explicit discrepancy classes and deterministic ordering.
- Add paired replay and checkpoint-resume execution, including invalid-transition and fault-injection cases from the phase-014 framework.
- Produce a fail-closed parity certificate only after all required verdicts are green; make the certificate consumable by `007-rollback-and-mode-gate`.

### Phase 3: Verification
- Run both paths from identical envelopes and verify scope, dimension coverage, finding lineage, impact, evidence, convergence, report ordering, receipts, and checkpoints.
- Verify that duplicate candidates, moved findings, fixed findings, stale receipts, incomplete validation, and resumed runs produce the same normalized event and projection result.
- Inject each declared shadow fault and verify a typed discrepancy plus `PARITY_BLOCKED`; verify the shadow path cannot publish or authorize.
- Re-run the complete corpus with the same fingerprints and verify deterministic certificate bytes and zero unexplained differences.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Paired-run envelope assertions compare source, scope, dimensions, execution, budget, and contract fingerprints before dispatch |
| REQ-002 | Contract conformance fixture proves Deep Review and deep-alignment consume the same phase-012 lifecycle and phase-014 shadow runner |
| REQ-003 | Lifecycle fixture covers scope, dimension pass, candidate, validation, impact, convergence, and report projection events |
| REQ-004 | Rename, line-move, update, fix, and pre-existing fixtures compare stable finding fingerprints and lineage |
| REQ-005 | Severity/confidence/evidence fixture proves P0/P1/P2 remains impact and does not absorb independent epistemic attributes |
| REQ-006 | Event comparator fails on missing, extra, reordered, duplicate, stale, or payload-divergent events after the allowlisted normalization |
| REQ-007 | Projection differential test compares findings, dispositions, convergence, report order, receipts, checkpoint state, and replay fingerprint |
| REQ-008 | Replay and checkpoint-resume fixtures reproduce the same normalized stream, projection, and certificate inputs |
| REQ-009 | Fault fixtures emit discrepancy evidence and assert legacy-only publication authority |
| REQ-010 | Certificate fixture refuses incomplete coverage, open P0/P1 discrepancies, non-deterministic output, or fingerprint mismatch |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The plan inherits the 036 program's typed ledger, transition authorization, receipts, replay fingerprint, projection, and
strict-validation contracts. It consumes the phase-012 shared review-loop contract and phase-014 generic shadow framework.
The `005-resume-adapter` and `007-rollback-and-mode-gate` siblings provide navigation and handoff context; this planning
contract does not turn that adjacency into an unrecorded runtime dependency.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

The runtime rollback is deliberately conservative: disable the Deep Review shadow flag, stop writing new shadow
artifacts, and leave the legacy emitter and report publication path authoritative. Retain mismatch evidence and the last
known-good certificate for diagnosis, but do not feed an unverified ledger projection into resume or report publication.
Any implementation changes are reverted through path-scoped commits; no legacy event or completed report is rewritten by
the parity harness. The later `007-rollback-and-mode-gate` phase owns the authority rollback window and cutover switch.
<!-- /ANCHOR:rollback -->
