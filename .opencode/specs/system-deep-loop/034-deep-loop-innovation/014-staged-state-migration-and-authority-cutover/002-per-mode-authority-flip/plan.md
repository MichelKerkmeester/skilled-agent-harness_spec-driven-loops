---
title: "Implementation Plan: Per-Mode Authority Flip"
description: "Planning workflow for the mode-keyed authority selector, fail-closed preflight, atomic ledger-recorded flip, ordered eight-mode rollout, and reversible rollback handoff."
trigger_phrases:
  - "per-mode authority flip implementation plan"
  - "deep-loop staged cutover plan"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/034-deep-loop-innovation/014-staged-state-migration-and-authority-cutover/002-per-mode-authority-flip"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/034-deep-loop-innovation/014-staged-state-migration-and-authority-cutover/002-per-mode-authority-flip"
    last_updated_at: "2026-07-15T00:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Planned the selector, preflight, and ordered cutover sequence"
    next_safe_action: "Review the per-mode gate and atomic ledger transition tasks"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Per-Mode Authority Flip

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | system-deep-loop phase-014 staged state migration and authority cutover |
| **Change class** | Per-mode authority selection, cutover coordination, and rollback-window handoff |
| **Authority** | Legacy remains authoritative until one mode passes every gate and commits its atomic flip |
| **Primary inputs** | Parent program invariants, phase-tree manifest, phase-004 cutover policy, phase-008 parity and rollback drills, phase-013 mode gates |

### Overview
Build one mode-keyed authority record and selector that every mode adapter uses at its canonical persistence boundary.
The coordinator validates the selected mode's parity certificate, rollback-drill certificate, state-migration evidence,
mode gate, policy and candidate identities, and rollback assets. It then obtains deny-by-default authorization, performs a
compare-and-swap against the current epoch, appends the authority-transition ledger event, and publishes dark authority
as one auditable per-mode transaction. The rollout is serialized in the manifest's eight-mode order, while every
non-selected mode remains legacy-authoritative and every selected mode remains reversible until the governed window is
closed by a later phase.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The parent program invariants and phase-tree `migration_model` are cited without moving phase-008 ownership into this phase
- [ ] Phase-004 defines the authority state machine, deny-by-default authorization, epoch rules, cutover evidence, and later-of-14-days-and-five-runs window
- [ ] Phase-008 exposes current mode-scoped parity and rollback-drill certificate verification with fail-closed freshness checks
- [ ] Phase-013 mode gates expose the canonical eight workstream identities and their mode-specific write sets
- [ ] The state-migration sibling exposes a current classification and migration result for every cutover candidate
- [ ] The selector record, ledger event, certificate inputs, and mode order are versioned before implementation begins

### Definition of Done
- [ ] Every canonical mode write passes the mode-keyed selector and stale-epoch guard
- [ ] A selected mode cannot flip without current parity, rollback-drill, state, mode-gate, and candidate evidence
- [ ] Selector update, epoch change, authorization, and ledger event are atomic and idempotent
- [ ] Negative cases prove that all other modes remain legacy-authoritative during one mode's flip
- [ ] All eight modes have ordered positive and negative cutover evidence, with deep-improvement common before its variants
- [ ] The output handoff binds the flip and open rollback window for the successor certificate phase
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

The deliverable has five coupled components and one fixed rollout order:

1. **Authority registry.** Store one durable record per canonical mode/workstream. The record contains the mode ID,
   authority state, monotonic epoch, selected canonical writer, shadow writer or projection identity, candidate/build
   identity, policy version, parity and rollback-drill certificate IDs, state-migration identity, rollback anchor,
   window state, and the last transition digest. Records are independent even when modes share a backend.
2. **Authority selector.** At the canonical mode write boundary, resolve the durable record and verify mode, epoch,
   policy, record digest, and writer identity. Legacy states select the legacy writer. Reversible and final dark states
   select the dark writer. Invalid or stale records return a typed denial rather than falling back silently.
3. **Pre-flip gate.** Validate the phase-013 mode gate; phase-008 parity certificate; phase-008 rollback-drill
   certificate; state classification and migration; exact BASE, candidate, adapter, reducer, projection, replay,
   selector, and policy identities; the rollback anchor; and the absence of another active cutover or rollback.
4. **Atomic cutover coordinator.** Submit the exact request to the phase-004 authorization gateway. Within one atomic
   boundary, compare-and-swap `cutover_ready` and its expected epoch to `new_authoritative_reversible`, append the
   registered authority-transition event, and publish the selector record. A conflict, duplicate with a different
   digest, or partial commit leaves legacy authority unchanged.
5. **Window and handoff evidence.** Record the window-open instant, minimum policy, retained legacy assets, writer-fence
   identity, health observations, and mode-scoped transition evidence. The successor phase consumes this immutable
   bundle to issue the cutover certificate and govern window closure.

The route decision is evaluated for every canonical write, not only at startup. A selector cache is an optimization
with epoch and record-digest validation, never an authority source. The cutover event is the durable fact that connects
the authorization decision, authority epoch, selector state, evidence certificates, and rollback window.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Freeze the canonical eight-mode list from `manifest/phase-tree.json` and the exact order: deep-research,
  deep-review, deep-ai-council, deep-improvement-common, agent-improvement, model-benchmark, skill-benchmark,
  deep-alignment.
- Extract phase-004 authority states, epoch and authorization rules, event requirements, and rollback-window policy;
  prohibit local reinterpretation in this coordinator.
- Define the authority-record schema, selector response, cutover request, denial response, authority-transition event,
  window-open evidence, and successor handoff bundle.
- Define certificate freshness inputs and the preflight result for parity, rollback drill, state migration, mode gate,
  policy, candidate, and rollback assets.
- Freeze the single-transaction rule, the no-batch rule, the mode write-set boundary, and the deep-improvement-common
  ordering constraint.

### Phase 2: Implementation
- Implement one durable authority record per mode with monotonic epochs and explicit legacy, shadow, ready, reversible,
  final, and rollback-pending states from phase 004.
- Implement the canonical selector at the mode persistence boundary, including record-digest, epoch, mode, writer, and
  policy validation and typed fail-closed errors.
- Implement certificate and state preflight that rejects absent, partial, stale, wrong-mode, drifted, or unresolved
  evidence before requesting authority.
- Implement the cutover request and phase-004 authorization call with the exact request digest, actor capability,
  invariant evidence, expected epoch, policy version, and selected mode.
- Implement the atomic epoch CAS, authority-transition ledger append, selector publication, and idempotent receipt. A
  failed event append or CAS must not expose dark canonical authority.
- Implement post-flip epoch checks that deny stale legacy writers while retaining the legacy projection and rollback
  adapter for the selected mode.
- Implement the serialized order coordinator, reject multi-mode requests, and isolate shared backend write sets for the
  deep-improvement common workstream and its three variants.
- Implement window-open telemetry and the immutable handoff bundle without closing the window or retiring legacy writers.
- Integrate the phase-008 rollback-drill verifier as a precondition and the successor cutover-certificate verifier as a
  consumer, without duplicating either contract.

### Phase 3: Verification
- Run positive cutovers in manifest order for all eight modes using exact candidate, BASE, certificate, state, and
  rollback identities.
- Run negative preflight fixtures for missing, stale, partial, wrong-mode, drifted, and unresolved certificates and
  state; verify legacy authority and epoch remain unchanged.
- Inject selector cache staleness, malformed authority state, unknown mode, stale writer epoch, CAS conflict, duplicate
  request, and ledger-append failure; verify fail-closed behavior with no partial transition.
- Verify one mode's flip changes only its authority record and writer route while every other mode still selects legacy.
- Verify the ledger event binds the exact mode, states, epochs, evidence IDs, candidate, policy, request digest, and
  timestamp and cannot be replaced by a flag or environment mutation.
- Verify the three benchmark variants cannot flip before `004-deep-improvement-common` and cannot share its certificate
  or authority epoch.
- Verify reversible mode writes select dark and stale legacy writes are denied while legacy projections and rollback
  assets remain readable.
- Verify the phase-004 rollback window opens with the later-of-14-days-and-five-runs rule and that this phase does not
  close the window or retire writers.
- Verify crash recovery at each atomic boundary and repeat the cutover request to prove idempotent event handling.
- Run strict spec-kit validation and record the exact candidate and expected deterministic metadata omissions.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Selector matrix resolves each canonical mode independently and rejects cross-mode fallback or unknown mode IDs |
| REQ-002 | Missing, malformed, stale-epoch, wrong-mode, and policy-drift selector fixtures deny without choosing a route |
| REQ-003 | Legacy, shadowing, and cutover-ready state fixtures keep legacy canonical and prevent dark publication |
| REQ-004 | Reversible and final state fixtures select dark while legacy projections remain available |
| REQ-005 | Certificate matrix mutates BASE, candidate, case set, seal, comparator, projection, and contract identities and requires denial |
| REQ-006 | Rollback-drill matrix injects each declared regression and requires current passing drill evidence before flip |
| REQ-007 | State matrix covers upcast, pin, fork, migrate, and block results; unresolved or stale state denies authority |
| REQ-008 | Atomicity tests fail the CAS, authorization, event append, and selector publication independently and prove no partial flip |
| REQ-009 | Ledger-event schema tests verify complete identity, epoch, certificate, policy, request, and timestamp bindings |
| REQ-010 | One-mode mutation tests snapshot all eight authority records and prove seven remain unchanged and legacy-authoritative |
| REQ-011 | Ordered rollout tests reject multi-mode requests and any variant flip before deep-improvement common |
| REQ-012 | Window tests verify retained rollback assets, window-open evidence, five-run counting, and the 14-day minimum |
| REQ-013 | Drift tests invalidate readiness and prove legacy remains authoritative or the declared rollback path starts |
| REQ-014 | Handoff tests verify the successor can validate the immutable transition bundle without process-local state |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The normative program sources are `.opencode/specs/system-deep-loop/034-deep-loop-innovation/spec.md`
and `../../manifest/phase-tree.json`. The phase-004 [transition policy](../../004-architecture-coverage-and-transition-contract/003-transition-versioning-and-rollback-policy/spec.md)
owns the authority state machine, deny-by-default gateway, epochs, event evidence, and rollback window. The phase-008
[shadow-parity harness](../../008-compatibility-shadow-and-rollback-bridge/003-shadow-parity-harness/spec.md) owns parity
certification, and the phase-008 [rollback drills](../../008-compatibility-shadow-and-rollback-bridge/005-rollback-drills/spec.md)
own rehearsal evidence. The phase-013 mode gates and the adjacent state-migration sibling supply mode and state inputs.

This child declares `depends_on: []` as an independent planning contract. Execution cannot pass without current outputs
from those contracts, but it must not copy their implementation or change their ownership. Downstream consumers are
`003-cutover-certificate-and-rollback-window`, the remaining phase-014 parent gate, and phase 015's retirement gate.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

This phase is planned for runtime authority coordination, so rollback of a failed implementation candidate is a
path-scoped revert before any production selector is enabled, followed by strict validation and re-ratification of the
phase-014 gate. Once a selector and cutover coordinator are live, recovery must use the phase-004 non-destructive
rollback contract and the phase-008 drilled procedure: freeze admission, fence the dark writer, reconcile declared
in-flight state and effects, restore legacy at a new epoch, preserve ledger events and evidence, and emit the rollback
certificate. Reverting documents or deleting the authority event is not a runtime rollback.

No rollback may close the window early, delete parity or drill evidence, reuse an old epoch, or leave a stale writer able
to append. A changed selector, coordinator, policy, adapter, projection, state classification, or certificate identity
invalidates prior cutover evidence and requires the affected mode to remain legacy-authoritative until the full gate
reruns.
<!-- /ANCHOR:rollback -->
