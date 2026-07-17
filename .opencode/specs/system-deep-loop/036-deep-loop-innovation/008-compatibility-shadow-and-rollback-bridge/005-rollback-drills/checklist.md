---
title: "Checklist: Rollback Drills"
description: "Blocking verification contract for mode-scoped rollback rehearsals, integrity recovery, receipt closure, isolation, and phase-014 evidence freshness."
trigger_phrases:
  - "rollback drills checklist"
  - "deep-loop rollback verifier contract"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/008-compatibility-shadow-and-rollback-bridge/005-rollback-drills"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/008-compatibility-shadow-and-rollback-bridge/005-rollback-drills"
    last_updated_at: "2026-07-15T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Defined the blocking rollback-drill verifier contract"
    next_safe_action: "Execute all P0 checks for each cutover-eligible mode"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: Rollback Drills

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for rollback drills. Every item remains unchecked while the phase
is Planned. During execution, the verifier evaluates each cutover-eligible mode against one pinned drill manifest and
records candidate/BASE identities, policy and contract versions, parity and classification digests, commands, exit
codes, authority epochs, event ranges, receipt IDs, timestamps, integrity results, and real-authority before/after
snapshots. Zero discovered modes, skipped required fixtures, missing observations, or unexpected tracked/runtime
mutation fails the gate.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] The phase-004 rollback policy and `../../manifest/phase-tree.json` are pinned; the drill uses the later-of-14-days-and-five-runs window and never weakens it
- [ ] CHK-002 [P0] The mode has a current, complete sibling-003 parity certificate with zero unresolved divergences
- [ ] CHK-003 [P0] Every in-flight state in the capsule has exactly one predecessor-004 disposition and a usable rollback anchor
- [ ] CHK-004 [P0] Legacy and spine writer identities, starting authority epoch, adapters, projections, fingerprint verifier, receipts, and effect recovery are present and version-bound
- [ ] CHK-005 [P0] Lane roots, authority storage, clock, effect sinks, and evidence outputs are hermetic; real authority and live effects are snapshotted for an unchanged post-check
- [ ] CHK-006 [P1] The mode manifest declares the injected regression, expected detector, declared observations, rollback deadline, cleanup procedure, and certificate destination
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-007 [P0] The runner implements the complete preflight-forward-detect-freeze-fence-reconcile-restore-resume-verify sequence with fail-closed state transitions
- [ ] CHK-008 [P0] Authority changes use the production state-machine and compare-and-swap semantics against test-only storage; no bypass flag can address real authority
- [ ] CHK-009 [P1] Manifest, evidence, receipt, and certificate schemas are versioned, canonicalized, bounded, and reject unknown replay- or authority-affecting input
- [ ] CHK-010 [P1] State reconciliation dispatches only registered predecessor-004 dispositions and cannot invent, coerce, or silently skip a state class
- [ ] CHK-011 [P1] Diagnostic output excludes credentials and unrestricted payloads while retaining digests, safe identifiers, reason codes, and verifier evidence
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-012 [P0] Each cutover-eligible mode performs a legal simulated forward flip in its isolated lane and records the new test authority epoch
- [ ] CHK-013 [P0] Each registered fault fixture is injected at its declared durable cut point and the exact production-shaped detector emits the expected typed rollback trigger
- [ ] CHK-014 [P0] Rollback freezes admission, fences the spine writer, reconciles all in-flight work, restores legacy authority at a new epoch, and denies stale-epoch writes
- [ ] CHK-015 [P0] Rollback completes before policy-window closure and before any stricter declared mode deadline under normal and synthetic near-closure clocks
- [ ] CHK-016 [P0] Control and resumed-legacy transcripts verify and match on every declared effective-event and canonical-projection fingerprint component
- [ ] CHK-017 [P0] Resumed legacy projections are byte-identical to control under declared ordering, formatting, newline, suppression, watermark, integrity, and unchanged-reader checks
- [ ] CHK-018 [P0] State, artifact, and event counts reconcile with no lost or duplicated durable fact; cutover-lane events remain preserved and auditable
- [ ] CHK-019 [P0] Every effect has one earlier intent and one confirmed/reconciled terminal outcome; duplicate mutation, conflict, or unresolved `in_doubt` fails the drill
- [ ] CHK-020 [P0] Legacy resumes from the rollback anchor and completes the declared next loop step with the same protected result as the isolated control lane
- [ ] CHK-021 [P0] Real authority, live packet state, external targets, writer leases, and live effect counts are unchanged after passing and failing drills
- [ ] CHK-022 [P0] Missing, wrong-class, late, manually asserted, or nondeterministic regression detection fails without issuing a passing certificate
- [ ] CHK-023 [P0] Drift in code, BASE, policy, parity, classification, adapter, projection, fingerprint, receipt, rollback asset, mode, or manifest identity makes phase-014 preflight refuse cutover
- [ ] CHK-024 [P1] Crash injection before/after authority and effect cut points recovers deterministically with one terminal receipt outcome and no unsafe replay
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-025 [P0] Every phase-013 mode proposed for authority cutover has one complete current drill certificate; zero modes or uncovered modes fail the gate
- [ ] CHK-026 [P0] Every certificate binds identity, forward path, injected regression, rollback actions, integrity results, timing, cleanup, pass/fail reason codes, and verifier identity
- [ ] CHK-027 [P1] A failed drill routes the first deterministic mismatch to its owning contract and the complete affected closure reruns after repair; no waiver or rebaseline converts failure to pass
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-028 [P0] Drills cannot address production authority or irreversible live effects, and hermetic adapters cannot escape their declared roots or cassettes
- [ ] CHK-029 [P1] Receipt/certificate verification uses registered durable trust metadata; same-process advisory evidence is not accepted as cross-resume proof
- [ ] CHK-030 [P1] Secrets, raw tokens, and unrestricted effect payloads are absent from manifests, ledgers, receipts, diagnostics, and certificates
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-031 [P1] The mode drill manifest, runner command, injected fixture, expected detector, rollback steps, integrity observations, and certificate verification procedure are documented
- [ ] CHK-032 [P1] Evidence cites the phase-004 rollback policy, sibling shadow-parity certificate, predecessor state classification, phase-007 receipts, and phase tree by exact bound identity
- [ ] CHK-033 [P2] Operator-facing failure guidance maps each reason code to the owning contract without suggesting unsafe manual replay or evidence suppression
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-034 [P1] Manifests, fixtures, control/cutover outputs, receipts, and certificates use mode-scoped isolated locations with no collision or shared mutable cache
- [ ] CHK-035 [P1] Verification cleanup removes disposable lane state while preserving immutable evidence and proves no unexpected tracked or runtime mutation remains
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase passes only when every P0 item is green for every cutover-eligible mode, every injected regression is detected,
rollback restores legacy authority within the governed window, fingerprint and projection integrity match the control,
state and effects reconcile without loss or duplication, real authority remains untouched, and phase 014 verifies each
current certificate against all bound inputs. P1 items are required before production readiness; P2 guidance may defer
with an explicit owner and reason.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the blocking SOL verifier binds the exact candidate and evidence set, confirms all P0 checks for every
cutover-eligible mode, verifies `validate.sh --strict`, and records that phase 008 moved no real authority. The sign-off
authorizes phase 014 to evaluate cutover readiness; it does not itself authorize an authority flip.
<!-- /ANCHOR:sign-off -->
