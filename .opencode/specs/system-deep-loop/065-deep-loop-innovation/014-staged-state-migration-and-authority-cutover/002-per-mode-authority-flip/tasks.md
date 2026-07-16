---
title: "Tasks: Per-Mode Authority Flip"
description: "Tasks for the mode-keyed authority selector, fail-closed preflight, atomic ledger-recorded authority flip, ordered rollout, and rollback-window handoff."
trigger_phrases:
  - "per-mode authority flip tasks"
  - "deep-loop staged cutover tasks"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/014-staged-state-migration-and-authority-cutover/002-per-mode-authority-flip"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/014-staged-state-migration-and-authority-cutover/002-per-mode-authority-flip"
    last_updated_at: "2026-07-15T00:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Decomposed the per-mode cutover and isolation work"
    next_safe_action: "Execute selector and preflight tasks against the frozen mode order"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Per-Mode Authority Flip

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

- [ ] T001 Extract the parent program's additive-dark, per-mode, rollback, and no-retirement invariants and cite `manifest/phase-tree.json`
- [ ] T002 Freeze the eight canonical workstream IDs and manifest order, including deep-improvement common before its three variants
- [ ] T003 Confirm `depends_on: []`, Level 2 planning scope, phase-008 evidence ownership, and phase-004 policy ownership
- [ ] T004 Define the mode-keyed authority-record schema, selector response, authority states, epochs, writer identities, and record digest
- [ ] T005 Define the parity, rollback-drill, state-migration, mode-gate, candidate, policy, and rollback-asset preflight matrix
- [ ] T006 Define the canonical authority-transition ledger event, complete binding fields, idempotency key, and denial evidence
- [ ] T007 Define the atomic CAS, authorization, ledger append, selector publication, crash-recovery, and no-partial-update contract
- [ ] T008 Define the one-mode blast-radius boundary, serialized transaction rule, window handoff, and successor evidence bundle
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T009 Implement one durable authority record for each canonical mode/workstream with monotonic epoch enforcement
- [ ] T010 Implement the canonical selector at every mode persistence boundary with mode, epoch, policy, record, and writer validation
- [ ] T011 Implement fail-closed responses for missing, malformed, stale, unknown, wrong-mode, and drifted selector state
- [ ] T012 Implement freshness verification for the phase-008 shadow-parity certificate and zero-divergence case set
- [ ] T013 Implement freshness verification for the phase-008 rollback-drill certificate and complete forward-detect-rollback evidence
- [ ] T014 Integrate state classification and migration evidence as a hard pre-flip gate without inventing a new disposition
- [ ] T015 Integrate the phase-013 mode gate, exact candidate and BASE identities, contract versions, and rollback assets
- [ ] T016 Implement the phase-004 authorization request with expected mode, state, epoch, request digest, actor, and evidence
- [ ] T017 Implement atomic compare-and-swap, authority-transition ledger append, selector publication, and idempotent transition receipt
- [ ] T018 Implement stale legacy-writer denial, dark canonical routing, retained legacy projections, and rollback-anchor access
- [ ] T019 Implement serialized manifest-order coordination and reject multi-mode or out-of-order cutover requests
- [ ] T020 Implement per-mode window-open telemetry and immutable handoff evidence without closing windows or retiring writers
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T021 Verify all eight modes resolve independently and all begin legacy-authoritative before their own successful flip
- [ ] T022 Verify missing, partial, stale, wrong-mode, drifted, and unresolved parity or rollback evidence blocks authority
- [ ] T023 Verify incomplete or blocked in-flight-state classification and migration blocks authority without mutation
- [ ] T024 Verify selector cache staleness, malformed state, unknown mode, stale epoch, and stale writer paths fail closed
- [ ] T025 Verify CAS conflict, duplicate mismatch, authorization denial, and ledger append failure leave legacy authority intact
- [ ] T026 Verify one successful cutover changes only the selected mode and emits the complete authority-transition event
- [ ] T027 Verify `004-deep-improvement-common` precedes `005-agent-improvement`, `006-model-benchmark`, and `007-skill-benchmark`
- [ ] T028 Verify reversible dark authority routes canonical writes to the spine and rejects stale legacy writes
- [ ] T029 Verify the phase-004 rollback window opens with retained assets and the later-of-14-days-and-five-runs rule
- [ ] T030 Verify crash recovery, idempotent retries, no multi-mode transaction, successor handoff evidence, and strict validation
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All selector, preflight, atomicity, ordering, and verification tasks complete
- [ ] All requirements in spec.md are met with mode-scoped evidence
- [ ] Every mode flip is represented by an authorized ledger event and leaves non-selected modes on legacy
- [ ] Every selected mode retains a valid rollback window and handoff evidence
- [ ] Strict validation has no error except expected missing `description.json` and `graph-metadata.json`
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verification**: See `checklist.md`
- **Program source**: See `../../spec.md` and `../../manifest/phase-tree.json`
- **Cutover policy**: See `../../004-architecture-coverage-and-transition-contract/003-transition-versioning-and-rollback-policy/spec.md`
- **Shadow parity**: See `../../008-compatibility-shadow-and-rollback-bridge/003-shadow-parity-harness/spec.md`
- **Rollback drills**: See `../../008-compatibility-shadow-and-rollback-bridge/005-rollback-drills/spec.md`
<!-- /ANCHOR:cross-refs -->
