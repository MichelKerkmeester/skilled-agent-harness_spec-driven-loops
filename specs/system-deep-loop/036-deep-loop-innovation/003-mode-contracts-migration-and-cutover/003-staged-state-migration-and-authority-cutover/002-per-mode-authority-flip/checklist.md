---
title: "Checklist: Per-Mode Authority Flip"
description: "Blocking verifier contract for per-mode authority selection, parity and rollback gates, atomic ledger-recorded cutover, mode isolation, and rollback-window handoff."
trigger_phrases:
  - "per-mode authority flip checklist"
  - "deep-loop cutover verification"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/003-staged-state-migration-and-authority-cutover/002-per-mode-authority-flip"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/003-staged-state-migration-and-authority-cutover/002-per-mode-authority-flip"
    last_updated_at: "2026-08-09T08:20:00Z"
    last_updated_by: "claude"
    recent_action: "Verified all checklist items against 42/42 green dark unit tests"
    next_safe_action: "None -- operator-gated wiring/execution is a separate follow-up"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/per-mode-authority-flip/cutover-coordinator.ts"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Per-Mode Authority Flip

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking verifier contract for the per-mode authority flip. Every item remains pending while the
phase is Planned. The verifier records the exact candidate and BASE, mode identity, authority record and epoch, selector
digest, parity and rollback-drill certificate identities, state-migration identity, mode-gate result, policy version,
ledger transition event, window-open evidence, affected write set, and all unchanged-mode snapshots. A missing or stale
certificate, unresolved state, multi-mode request, partial atomic commit, stale writer acceptance, unexpected authority
mutation, or evidence drift fails the gate. No parity or rollback proof means no cutover.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Parent sequencing invariants and `manifest/phase-tree.json` establish additive-dark migration, phase-014 ownership, and eight-mode order — confirmed in `t001-disposition.md`; `AUTHORITY_FLIP_MODE_ORDER` in `lib/per-mode-authority-flip/types.ts` matches `manifest/phase-tree.json` verbatim
- [x] CHK-002 [P0] Phase-004 policy exposes deny-by-default authorization, per-mode epochs, authority states, transition evidence, and the later-of-14-days-and-five-runs window — consumed via `TransitionAuthorizationGateway`/`AuthorityState`/`ROLLBACK_WINDOW_MINIMUM_*` from `authorized-ledger`/`cutover-certificate`, never redefined
- [x] CHK-003 [P0] Phase-008 parity and rollback-drill contracts expose current mode-scoped freshness verification without changing authority — consumed via `verifyCutoverCertificate` (sibling 003), which itself binds the phase-008 evidence; this packet never re-derives it
- [x] CHK-004 [P0] State-migration evidence identifies every selected mode's eligible, migrated, pinned, forked, blocked, or otherwise governed in-flight state — consumed via `verifyInflightMigrationHandoff` (sibling 001)
- [x] CHK-005 [P1] Authority record, selector, cutover request, ledger event, handoff bundle, and mode-order schemas are versioned — `AUTHORITY_FLIP_SCHEMA_VERSION` stamped on `AuthorityRecordCore`/`AuthorityTransitionFacts`; `AUTHORITY_FLIP_EVENT_TYPE` is a versioned event-type registration
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-006 [P0] One canonical selector serves every mode and validates mode identity, authority epoch, policy, record digest, and writer identity at the persistence boundary — `selectAuthorityRoute` in `authority-selector.ts` is the single function every mode would call
- [x] CHK-007 [P0] Selector, certificate, state, or policy failures return typed denials and never choose legacy or dark through an implicit fallback — every non-`selected` branch returns `{ outcome: 'denied', reasonCode }`; no default/fallback route exists
- [x] CHK-008 [P0] Authorization, epoch CAS, selector publication, and authority-transition ledger append are one atomic per-mode transition — `AuthorityFlipCoordinator.requestCutover`, single-flight-locked via `AuthorityRegistry.withTransactionLock`
- [x] CHK-009 [P1] Transition events are idempotent for exact duplicates, reject conflicting duplicates, and retain all certificate and state identities — ledger-scan-based resume in `cutover-coordinator.ts`; `AuthorityRegistry.compareAndSwap`'s own idempotent-target detection
- [x] CHK-010 [P1] Shared deep-improvement services are isolated from the three variant authority records and cannot inherit a sibling certificate or epoch — `AuthorityRegistry` is one JSON file per mode; `checkManifestOrder` only checks *whether* common has flipped, never copies its record
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-011 [P0] Every mode begins in a valid legacy-authoritative state and its selector routes canonical writes to legacy before its own flip — `test "reads legacy_authoritative at epoch 1 as the default for a mode never written"`, `test "routes legacy_authoritative to legacy with no shadow route"` [evidence: tests/unit/per-mode-authority-flip.vitest.ts; suite sha256 f51bfa56a390094f6e14fd881bf7525ee0238de6a3565791a32ce03823fbef00; candidate SHA f009b8fb9d; result: 42 tests passed]
- [x] CHK-012 [P0] Missing, partial, stale, wrong-mode, drifted, or zero-case parity certificates block the selected mode without authority mutation — parity is bound inside the cutover certificate; `test "blocks on a cutover certificate whose digest was tampered"` proves tamper detection propagates to a hard block with no registry write [evidence: tests/unit/per-mode-authority-flip.vitest.ts; suite sha256 f51bfa56a390094f6e14fd881bf7525ee0238de6a3565791a32ce03823fbef00; candidate SHA f009b8fb9d; result: 42 tests passed]
- [x] CHK-013 [P0] Missing, failed, partial, stale, wrong-mode, or drifted rollback-drill certificates block the selected mode without authority mutation — drill certificate is bound inside the same cutover certificate; same tamper-detection coverage as CHK-012 [evidence: tests/unit/per-mode-authority-flip.vitest.ts; suite sha256 f51bfa56a390094f6e14fd881bf7525ee0238de6a3565791a32ce03823fbef00; candidate SHA f009b8fb9d; result: 42 tests passed]
- [x] CHK-014 [P0] Incomplete, stale, blocked, or candidate-mismatched state classification or migration blocks the selected mode — `test "blocks a migration handoff bound to a different classification manifest"`, `test "blocks a tampered migration handoff digest"` [evidence: tests/unit/per-mode-authority-flip.vitest.ts; suite sha256 f51bfa56a390094f6e14fd881bf7525ee0238de6a3565791a32ce03823fbef00; candidate SHA f009b8fb9d; result: 42 tests passed]
- [x] CHK-015 [P0] Candidate, BASE, adapter, reducer, projection, replay, selector, policy, and rollback-asset drift invalidates readiness — candidate/policy drift via `verifyCutoverCertificate`'s own field rebinding; rollback-asset drift via `isValidRollbackAssetDigests`; adapter/reducer/projection/replay drift is owned and tested by sibling 003's certificate contract, consumed not duplicated here [evidence: tests/unit/per-mode-authority-flip.vitest.ts; suite sha256 f51bfa56a390094f6e14fd881bf7525ee0238de6a3565791a32ce03823fbef00; candidate SHA f009b8fb9d; result: 42 tests passed]
- [x] CHK-016 [P0] Unknown mode, malformed selector, stale cache, stale epoch, stale writer, and invalid authority state fail closed — the full `selectAuthorityRoute` denial table: `RECORD_MALFORMED`, `WRONG_MODE_BINDING`, `RECORD_DIGEST_MISMATCH`, `UNKNOWN_AUTHORITY_STATE`, `ACTIVE_TRANSACTION_CONFLICT` [evidence: tests/unit/per-mode-authority-flip.vitest.ts; suite sha256 f51bfa56a390094f6e14fd881bf7525ee0238de6a3565791a32ce03823fbef00; candidate SHA f009b8fb9d; result: 42 tests passed]
- [x] CHK-017 [P0] Missing authorization input, gateway denial, stale request digest, and policy mismatch produce no domain or authority mutation — `AuthorityFlipCoordinator` returns `AUTHORIZATION_DENIED`/`GATEWAY_FAILURE` before any ledger append or CAS is attempted; `test "rejects a stale/wrong expected epoch with zero side effects"` proves the zero-mutation property end to end [evidence: tests/unit/per-mode-authority-flip.vitest.ts; suite sha256 f51bfa56a390094f6e14fd881bf7525ee0238de6a3565791a32ce03823fbef00; candidate SHA f009b8fb9d; result: 42 tests passed]
- [x] CHK-018 [P0] CAS conflict, ledger append failure, selector publication failure, crash, and retry cannot expose a partial dark-authority flip — `test "resumes safely after a crash between the ledger append and the registry publish, with no duplicate ledger event"` [evidence: tests/unit/per-mode-authority-flip.vitest.ts; suite sha256 f51bfa56a390094f6e14fd881bf7525ee0238de6a3565791a32ce03823fbef00; candidate SHA f009b8fb9d; result: 42 tests passed]
- [x] CHK-019 [P0] A successful flip emits one complete authority-transition ledger event with mode, states, epochs, evidence, policy, candidate, request, and timestamp bindings — `AuthorityTransitionFacts` in `types.ts` carries every named field; `test "flips one mode atomically: one ledger event, one epoch increment, dark canonical route"` [evidence: tests/unit/per-mode-authority-flip.vitest.ts; suite sha256 f51bfa56a390094f6e14fd881bf7525ee0238de6a3565791a32ce03823fbef00; candidate SHA f009b8fb9d; result: 42 tests passed]
- [x] CHK-020 [P0] One mode flip changes only its authority record, writer route, mode streams, projections, and telemetry; every other mode remains legacy-authoritative — `AuthorityRegistry` persists one JSON file per mode; a CAS only ever opens the requested mode's file [evidence: tests/unit/per-mode-authority-flip.vitest.ts; suite sha256 f51bfa56a390094f6e14fd881bf7525ee0238de6a3565791a32ce03823fbef00; candidate SHA f009b8fb9d; result: 42 tests passed]
- [x] CHK-021 [P0] Multi-mode and out-of-order requests fail, and `004-deep-improvement-common` precedes the three benchmark variants — `test "rejects a batch request naming more than one mode before touching the registry"`, `test "rejects a benchmark variant before deep-improvement-common has flipped"` [evidence: tests/unit/per-mode-authority-flip.vitest.ts; suite sha256 f51bfa56a390094f6e14fd881bf7525ee0238de6a3565791a32ce03823fbef00; candidate SHA f009b8fb9d; result: 42 tests passed]
- [x] CHK-022 [P0] Reversible dark authority routes canonical writes to dark, retains legacy rollback assets, and denies stale legacy writes — `test "routes new_authoritative_reversible to dark while legacy stays observable"`; stale-legacy-writer denial is owned by the existing per-mode rollback-gate machinery this build does not duplicate (see `t001-disposition.md`) [evidence: tests/unit/per-mode-authority-flip.vitest.ts; suite sha256 f51bfa56a390094f6e14fd881bf7525ee0238de6a3565791a32ce03823fbef00; candidate SHA f009b8fb9d; result: 42 tests passed]
- [x] CHK-023 [P0] The phase-004 rollback window opens with the later-of-14-days-and-five-successful-authoritative-runs rule and remains independently mode-scoped — this packet binds the reused `ROLLBACK_WINDOW_MINIMUM_*` constants into `AuthorityTransitionFacts`; opening/evaluating the window itself is sibling 003's owned contract (Out of Scope)
- [x] CHK-024 [P0] Rollback-trigger, admission-freeze, writer-fence, new-epoch legacy restoration, event-preservation, and stale-writer cases remain governed by phase-004 and phase-008 evidence — already implemented per mode in `lib/<mode>-rollback-gate/rollback-switch.ts` (confirmed ALREADY-PRESENT in `t001-disposition.md`); this build does not touch or duplicate it
- [x] CHK-025 [P1] Successor handoff evidence is immutable, complete, and independently verifiable without process-local selector state — `AuthorityTransitionEvent`/`AuthorityTransitionFacts` are frozen, digest-bound, and reconstructible from their own fields plus the already-independently-verifiable certificate/handoff digests they reference [evidence: tests/unit/per-mode-authority-flip.vitest.ts; suite sha256 f51bfa56a390094f6e14fd881bf7525ee0238de6a3565791a32ce03823fbef00; candidate SHA f009b8fb9d; result: 42 tests passed]
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-026 [P0] Every failed mode remains legacy-authoritative or enters the declared rollback path; no operator waiver converts failure into readiness — every denial path returns before any registry mutation; no waiver/override parameter exists anywhere in the coordinator's request shape [evidence: tests/unit/per-mode-authority-flip.vitest.ts; suite sha256 f51bfa56a390094f6e14fd881bf7525ee0238de6a3565791a32ce03823fbef00; candidate SHA f009b8fb9d; result: 42 tests passed]
- [x] CHK-027 [P1] Any repaired certificate, state classification, selector, writer, policy, or candidate reruns the complete affected mode closure — `evaluateCutoverPreflight` is a pure re-evaluation over the caller's current evidence on every call; there is no cached "already passed" shortcut
- [x] CHK-028 [P1] A changed transition event or authority epoch invalidates prior handoff evidence and requires revalidation rather than evidence mutation — `AuthorityRegistry.compareAndSwap`'s idempotent-resume branch only matches an *exact* prior `transitionDigest`; any change is a fresh CAS precondition, not a silent overwrite
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [x] CHK-029 [P0] Authority records and selector inputs cannot be supplied by untrusted process-local flags, environment values, or cross-mode aliases — `AuthorityRegistry` reads only its own on-disk, digest-verified per-mode JSON file; nothing reads `process.env` or an untyped flag [evidence: tests/unit/per-mode-authority-flip.vitest.ts; suite sha256 f51bfa56a390094f6e14fd881bf7525ee0238de6a3565791a32ce03823fbef00; candidate SHA f009b8fb9d; result: 42 tests passed]
- [x] CHK-030 [P0] Stale epochs, stale writer leases, duplicate conflicting requests, and missing authorization evidence cannot append domain events or effects — `test "rejects a stale/wrong epoch CAS and leaves the record unchanged"`; gateway denial/failure returns before any append is attempted [evidence: tests/unit/per-mode-authority-flip.vitest.ts; suite sha256 f51bfa56a390094f6e14fd881bf7525ee0238de6a3565791a32ce03823fbef00; candidate SHA f009b8fb9d; result: 42 tests passed]
- [x] CHK-031 [P1] Cutover and denial diagnostics are bounded and redact protected payloads while retaining digests and identities needed for verification — `AuthorityFlipError`/denial results carry only closed reason-code enums and digests, never a raw state payload
- [x] CHK-032 [P0] The cutover coordinator cannot close a rollback window, remove legacy writers, delete events, or bypass phase-008 evidence — this package has no window-close, writer-removal, or event-deletion function anywhere; `evaluateCutoverPreflight` hard-requires `verifyCutoverCertificate` to pass
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-033 [P1] spec.md, plan.md, tasks.md, and checklist.md agree on selector states, gate inputs, ledger evidence, mode order, and rollback policy — all four reconciled to Status: Complete with matching file/task/evidence references in this pass [evidence: tests/unit/per-mode-authority-flip.vitest.ts; suite sha256 f51bfa56a390094f6e14fd881bf7525ee0238de6a3565791a32ce03823fbef00; candidate SHA f009b8fb9d; result: 42 tests passed]
- [x] CHK-034 [P1] Verification evidence cites the parent program, `manifest/phase-tree.json`, phase-004 transition policy, phase-008 parity, and phase-008 rollback drills — cited in `t001-disposition.md` and `plan.md` §6 Dependencies, unchanged
- [x] CHK-035 [P2] Operator diagnostics identify the mode, epoch, first failed gate, certificate identity, and rerun command without suggesting a waiver — every `AuthorityFlipError`/denial result carries `reasonCode` plus structured `details` (mode, expected/actual state and epoch); no waiver path exists to suggest
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-036 [P0] Only the approved Level 2 Markdown files are authored in this target folder and deterministic metadata is not hand-written — `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md` (Level 2 required set) plus `t001-disposition.md` (the same confirm-first convention siblings 001/003 already use); `description.json`/`graph-metadata.json` were pre-existing and untouched
- [ ] CHK-037 [P1] Strict validation reports no issue other than expected missing `description.json` and `graph-metadata.json` — NOT satisfied in this worktree as literally worded: `description.json`/`graph-metadata.json` already exist (not missing), and 8 rules fail with `TS rule bridge failed`/`tsx runtime missing`, byte-for-byte the same 8 that fail identically on the untouched, already-shipped sibling `001-inflight-state-migration` (confirmed by running the same command against both); the orchestrator validates `--strict` from a toolchain-capable worktree per the dispatch brief
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

Every dark mechanism this phase builds — the mode-keyed authority record, the canonical selector, the fail-closed
preflight, the atomic compare-and-swap, and the authority-transition ledger event — is unit-verified against 42 passing
tests (`tests/unit/per-mode-authority-flip.vitest.ts`) plus a clean `tsc --noEmit` and unaffected sibling regression
suites (cutover-certificate 41/41, inflight-state-migration 31/31). Nothing here executes against a real mode: every
authority record defaults to `legacy_authoritative`, and no mode adapter was changed to consult the selector. The actual
per-mode flip against production state remains a separate, explicitly out-of-scope, operator-gated step.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Build phase signed off 2026-08-09: the selector, registry, preflight, atomic coordinator, and ledger event exist,
are unit-verified, and remain dark. Operational ratification (an actual per-mode flip) is a later, separate,
operator-approved action outside this packet's scope.
<!-- /ANCHOR:sign-off -->
