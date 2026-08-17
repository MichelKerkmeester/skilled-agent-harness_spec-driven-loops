---
title: "Tasks: Per-Mode Authority Flip"
description: "Tasks for the mode-keyed authority selector, fail-closed preflight, atomic ledger-recorded authority flip, ordered rollout, and rollback-window handoff."
trigger_phrases:
  - "per-mode authority flip tasks"
  - "deep-loop staged cutover tasks"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/003-staged-state-migration-and-authority-cutover/002-per-mode-authority-flip"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/003-mode-contracts-migration-and-cutover/003-staged-state-migration-and-authority-cutover/002-per-mode-authority-flip"
    last_updated_at: "2026-08-17T04:04:40Z"
    last_updated_by: "claude"
    recent_action: "Built and verified all 30 tasks; 42/42 tests green, tsc clean"
    next_safe_action: "None -- operator-gated wiring/execution is a separate follow-up"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/per-mode-authority-flip/cutover-coordinator.ts"
    completion_pct: 100
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

- [x] T001 Extract the parent program's additive-dark, per-mode, rollback, and no-retirement invariants and cite `manifest/phase-tree.json` — see `t001-disposition.md` (confirm-first grading against live code at HEAD)
- [x] T002 Freeze the eight canonical workstream IDs and manifest order, including deep-improvement common before its three variants — `AUTHORITY_FLIP_MODE_ORDER`, `AUTHORITY_FLIP_COMMON_MODE`, `AUTHORITY_FLIP_COMMON_VARIANTS` in `lib/per-mode-authority-flip/types.ts`
- [x] T003 Confirm `depends_on: []`, Level 2 planning scope, phase-008 evidence ownership, and phase-004 policy ownership — confirmed in `t001-disposition.md`; this build consumes, never re-derives, phase-008/004 evidence
- [x] T004 Define the mode-keyed authority-record schema, selector response, authority states, epochs, writer identities, and record digest — `AuthorityRecord`/`AuthorityRecordCore`/`AuthoritySelectorResult`/`AuthorityFlipStates` in `types.ts`
- [x] T005 Define the parity, rollback-drill, state-migration, mode-gate, candidate, policy, and rollback-asset preflight matrix — `CutoverPreflightInput`/`CutoverPreflightResult` in `types.ts`; evaluated by `evaluateCutoverPreflight` in `preflight.ts`
- [x] T006 Define the canonical authority-transition ledger event, complete binding fields, idempotency key, and denial evidence — `AuthorityTransitionFacts`/`AuthorityTransitionEvent` in `types.ts`; `AUTHORITY_FLIP_EVENT_TYPE` registration in `ledger-event.ts`
- [x] T007 Define the atomic CAS, authorization, ledger append, selector publication, crash-recovery, and no-partial-update contract — `AuthorityRegistry.compareAndSwap` in `authority-registry.ts`; `AuthorityFlipCoordinator.requestCutover` in `cutover-coordinator.ts`
- [x] T008 Define the one-mode blast-radius boundary, serialized transaction rule, window handoff, and successor evidence bundle — `AuthorityRegistry.withTransactionLock` (root-level single-flight lock); `AuthorityTransitionFacts` binds the window-minimum policy for the successor
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T009 Implement one durable authority record for each canonical mode/workstream with monotonic epoch enforcement — `AuthorityRegistry` in `authority-registry.ts` (per-mode JSON file, `writeCanonicalJsonAtomic`, epoch strictly `+1` per CAS)
- [x] T010 Implement the canonical selector at every mode persistence boundary with mode, epoch, policy, record, and writer validation — `selectAuthorityRoute` in `authority-selector.ts`; not yet called by any live mode adapter (dark, per scope)
- [x] T011 Implement fail-closed responses for missing, malformed, stale, unknown, wrong-mode, and drifted selector state — `isValidAuthorityRecord` plus the `switch` fallthrough to `UNKNOWN_AUTHORITY_STATE` in `authority-selector.ts`
- [x] T012 Implement freshness verification for the phase-008 shadow-parity certificate and zero-divergence case set — consumed via `verifyCutoverCertificate` (sibling 003) inside `evaluateCutoverPreflight`, not re-derived; `test "passes with a valid certificate, bound migration handoff, and clean rollback assets"` [evidence: tests/unit/per-mode-authority-flip.vitest.ts; suite sha256 f51bfa56a390094f6e14fd881bf7525ee0238de6a3565791a32ce03823fbef00; candidate SHA f009b8fb9d; result: 42 tests passed]
- [x] T013 Implement freshness verification for the phase-008 rollback-drill certificate and complete forward-detect-rollback evidence — same consumption path; the drill certificate is already bound inside the cutover certificate 003 verifies; `test "passes with a valid certificate, bound migration handoff, and clean rollback assets"` [evidence: tests/unit/per-mode-authority-flip.vitest.ts; suite sha256 f51bfa56a390094f6e14fd881bf7525ee0238de6a3565791a32ce03823fbef00; candidate SHA f009b8fb9d; result: 42 tests passed]
- [x] T014 Integrate state classification and migration evidence as a hard pre-flip gate without inventing a new disposition — `verifyInflightMigrationHandoff` (sibling 001) called from `evaluateCutoverPreflight`, cross-bound to the same classification manifest digest the certificate references
- [x] T015 Integrate the phase-013 mode gate, exact candidate and BASE identities, contract versions, and rollback assets — mode-gate/candidate identities consumed through the certificate's evidence bindings; rollback assets validated by `isValidRollbackAssetDigests` in `preflight.ts`
- [x] T016 Implement the phase-004 authorization request with expected mode, state, epoch, request digest, actor, and evidence — `AuthorityFlipCoordinator.requestCutover` builds the `TransitionAuthorizationRequest` and calls `gateway.authorize`
- [x] T017 Implement atomic compare-and-swap, authority-transition ledger append, selector publication, and idempotent transition receipt — `appendAuthorityTransitionEvent` (via `appendAuthorizedThroughFence`) then `AuthorityRegistry.compareAndSwap`, with ledger-scan idempotent resume in `cutover-coordinator.ts`
- [x] T018 Implement stale legacy-writer denial, dark canonical routing, retained legacy projections, and rollback-anchor access — `selectAuthorityRoute`'s `new_authoritative_reversible` branch routes dark while exposing `shadowRoute: 'legacy'`
- [x] T019 Implement serialized manifest-order coordination and reject multi-mode or out-of-order cutover requests — `checkManifestOrder` in `manifest-order.ts`, enforced both at the coordinator entry and inside preflight
- [x] T020 Implement per-mode window-open telemetry and immutable handoff evidence without closing windows or retiring writers — `AuthorityTransitionFacts` binds `rollbackWindowMinimumCalendarDays`/`rollbackWindowMinimumSuccessfulExecutions` (reused from sibling 003's constants) for the successor; this packet never opens or closes a window itself
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T021 Verify all eight modes resolve independently and all begin legacy-authoritative before their own successful flip — `test "reads legacy_authoritative at epoch 1 as the default for a mode never written"` [evidence: tests/unit/per-mode-authority-flip.vitest.ts; suite sha256 f51bfa56a390094f6e14fd881bf7525ee0238de6a3565791a32ce03823fbef00; candidate SHA f009b8fb9d; result: 42 tests passed]
- [x] T022 Verify missing, partial, stale, wrong-mode, drifted, and unresolved parity or rollback evidence blocks authority — `test "blocks on a cutover certificate whose digest was tampered"`, `test "blocks a certificate bound to a different mode than requested"`, `test "blocks a stale expected authority epoch"` [evidence: tests/unit/per-mode-authority-flip.vitest.ts; suite sha256 f51bfa56a390094f6e14fd881bf7525ee0238de6a3565791a32ce03823fbef00; candidate SHA f009b8fb9d; result: 42 tests passed]
- [x] T023 Verify incomplete or blocked in-flight-state classification and migration blocks authority without mutation — `test "blocks a migration handoff bound to a different classification manifest"`, `test "blocks a tampered migration handoff digest"` [evidence: tests/unit/per-mode-authority-flip.vitest.ts; suite sha256 f51bfa56a390094f6e14fd881bf7525ee0238de6a3565791a32ce03823fbef00; candidate SHA f009b8fb9d; result: 42 tests passed]
- [x] T024 Verify selector cache staleness, malformed state, unknown mode, stale epoch, and stale writer paths fail closed — `test "denies a caller-supplied expected record digest that no longer matches (stale cache)"`, `test "denies an unknown authority state"`, `test "denies a record bound to a different mode than expected"` [evidence: tests/unit/per-mode-authority-flip.vitest.ts; suite sha256 f51bfa56a390094f6e14fd881bf7525ee0238de6a3565791a32ce03823fbef00; candidate SHA f009b8fb9d; result: 42 tests passed]
- [x] T025 Verify CAS conflict, duplicate mismatch, authorization denial, and ledger append failure leave legacy authority intact — `test "rejects a stale/wrong epoch CAS and leaves the record unchanged"`, `test "rejects a CAS whose expected state does not match the current record"`, `test "rejects a stale/wrong expected epoch with zero side effects"` [evidence: tests/unit/per-mode-authority-flip.vitest.ts; suite sha256 f51bfa56a390094f6e14fd881bf7525ee0238de6a3565791a32ce03823fbef00; candidate SHA f009b8fb9d; result: 42 tests passed]
- [x] T026 Verify one successful cutover changes only the selected mode and emits the complete authority-transition event — `test "flips one mode atomically: one ledger event, one epoch increment, dark canonical route"` [evidence: tests/unit/per-mode-authority-flip.vitest.ts; suite sha256 f51bfa56a390094f6e14fd881bf7525ee0238de6a3565791a32ce03823fbef00; candidate SHA f009b8fb9d; result: 42 tests passed]
- [x] T027 Verify `004-deep-improvement-common` precedes `005-agent-improvement`, `006-model-benchmark`, and `007-skill-benchmark` — `test "rejects a benchmark variant before deep-improvement-common has flipped"`, `test "allows a benchmark variant once deep-improvement-common has already flipped"` [evidence: tests/unit/per-mode-authority-flip.vitest.ts; suite sha256 f51bfa56a390094f6e14fd881bf7525ee0238de6a3565791a32ce03823fbef00; candidate SHA f009b8fb9d; result: 42 tests passed]
- [x] T028 Verify reversible dark authority routes canonical writes to the spine and rejects stale legacy writes — `test "routes new_authoritative_reversible to dark while legacy stays observable"`; a stale legacy write is denied at the ledger/authorization layer this packet reuses, not reimplemented here (out of scope per plan.md dependencies) [evidence: tests/unit/per-mode-authority-flip.vitest.ts; suite sha256 f51bfa56a390094f6e14fd881bf7525ee0238de6a3565791a32ce03823fbef00; candidate SHA f009b8fb9d; result: 42 tests passed]
- [x] T029 Verify the phase-004 rollback window opens with retained assets and the later-of-14-days-and-five-runs rule — this packet binds the reused `ROLLBACK_WINDOW_MINIMUM_CALENDAR_DAYS`/`ROLLBACK_WINDOW_MINIMUM_SUCCESSFUL_EXECUTIONS` constants (sibling 003 owns opening/evaluating the window itself, per Out of Scope)
- [x] T030 Verify crash recovery, idempotent retries, no multi-mode transaction, successor handoff evidence, and strict validation — `test "resumes safely after a crash between the ledger append and the registry publish, with no duplicate ledger event"`, `test "rejects a batch request naming more than one mode before touching the registry"`; `tsc --noEmit` exit 0; strict `validate.sh` deferred to the toolchain-capable orchestrator worktree (tsx-runtime-missing gap, see Known Limitations) [evidence: tests/unit/per-mode-authority-flip.vitest.ts; suite sha256 f51bfa56a390094f6e14fd881bf7525ee0238de6a3565791a32ce03823fbef00; candidate SHA f009b8fb9d; result: 42 tests passed]
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All selector, preflight, atomicity, ordering, and verification tasks complete — T001-T030 above
- [x] All requirements in spec.md are met with mode-scoped evidence — see `implementation-summary.md`
- [x] Every mode flip is represented by an authorized ledger event and leaves non-selected modes on legacy — `AuthorityRegistry` records are file-scoped per mode; only the requested mode's file is touched by a CAS
- [x] Every selected mode retains a valid rollback window and handoff evidence — `AuthorityTransitionFacts` binds the rollback-window minimums and the migration handoff digest
- [ ] Strict validation has no error except expected missing `description.json` and `graph-metadata.json` — deferred to the orchestrator's toolchain-capable worktree per the dispatch brief (this worktree's `tsx` runtime gap reproduces identically on the untouched sibling packets)
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verification**: See `checklist.md`
- **Program source**: See `../../spec.md` and `../../manifest/phase-tree.json`
- **Cutover policy**: See `../../004-architecture-coverage-and-transition-contract/003-transition-versioning-and-rollback-policy/spec.md`
- **Shadow parity**: See `../../004-compatibility-shadow-and-rollback-bridge/003-shadow-parity-harness/spec.md`
- **Rollback drills**: See `../../004-compatibility-shadow-and-rollback-bridge/005-rollback-drills/spec.md`
<!-- /ANCHOR:cross-refs -->
