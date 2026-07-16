---
title: "Implementation Plan: Deep AI Council - Rollback & Mode Gate"
description: "Implementation plan for the Deep AI Council rollback switch and independent mode gate. The plan defines fail-closed state transitions, a bounded rollback window, mode-specific shadow-parity evidence, sealed artifact and certificate checks, and a deterministic handoff without moving authority."
trigger_phrases:
  - "Deep AI Council rollback and mode gate implementation plan"
  - "deep-ai-council authority gate plan"
  - "bounded council rollback window"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/034-deep-loop-innovation/013-mode-and-lane-migrations/003-deep-ai-council"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/034-deep-loop-innovation/013-mode-and-lane-migrations/003-deep-ai-council/007-rollback-and-mode-gate"
    last_updated_at: "2026-07-15T23:30:00Z"
    last_updated_by: "opencode"
    recent_action: "Mapped rollback window states to the mode-gate evidence chain"
    next_safe_action: "Define gate fixtures and certificate fields against shared contracts"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Deep AI Council - Rollback & Mode Gate

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | system-deep-loop / deep-ai-council mode migration |
| **Change class** | Migration safety contract and independent mode gate |
| **Execution** | Additive-dark typed path; legacy authority retained until phase-017 |

### Overview
The implementation will define a mode-owned rollback switch and gate evaluator over the shared event, reducer, seal,
receipt, certificate, replay, and shadow-parity contracts. The switch will be default-deny and explicit about its authority
state. The gate will assemble evidence from the full council lifecycle, compare typed and legacy behavior at semantic
boundaries, verify required sealed artifacts and certificates, and emit a mode-bound handoff. No task in this plan changes
the legacy writer or flips production authority.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The shared event, reducer, seal, receipt, certificate, replay, resume, and shadow-parity contracts are version-pinned
- [ ] The legacy authority anchor and typed shadow frontier are identified for every gate fixture
- [ ] The switch state transitions and default-deny behavior are reviewed against the phase-017 cutover contract
- [ ] The Deep AI Council gate fixture matrix covers the full lifecycle and required failure dispositions
- [ ] Required artifact kinds, certificate fields, and rollback evidence are named without creating mode-local primitives

### Definition of Done
- [ ] The switch rejects malformed, stale, unauthorized, expired, mixed-version, and wrong-mode requests
- [ ] The rollback window is bounded, observable, and restorable to the pinned legacy anchor
- [ ] Shadow parity is green for all required Deep AI Council fixtures and records non-green dispositions explicitly
- [ ] Sealed artifacts, receipt chain, replay fingerprint, and mode certificate verify independently
- [ ] The handoff is deterministic and phase-017 receives no authority permission without its own cutover receipt
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Switch boundary**: `deep-ai-council` owns a policy adapter that reads shared authorization and certificate results. Its
  default is `legacy_authoritative`; an invalid state fails closed to legacy authority and records a typed refusal.
- **State progression**: `legacy_authoritative -> shadow_eligible -> cutover_armed -> ledger_authoritative_within_window`.
  Failure paths are `cutover_armed -> gate_blocked` and `ledger_authoritative_within_window -> rollback_active ->
  window_closed`. Phase-017 owns the authority transition; this phase defines the admissible evidence and state semantics.
- **Window record**: bind `windowId`, mode ID, legacy anchor, typed frontier, cutover certificate, opening and expiry policy,
  trigger classes, fencing token, restoration action, and close or rollback receipt. Expiry is terminal until explicitly
  re-armed under a new identity.
- **Gate evidence**: consume typed event and reducer outputs, legacy comparison witnesses, effective independence and dissent
  projections, sealed artifact manifest, receipt chain, replay fingerprint, council test-gate result, and rollback drill.
- **Mode isolation**: require the `deep-ai-council` event namespace, artifact kinds, fixture manifest, certificate subject,
  and verifier profile. A generic system gate or another mode's certificate is not sufficient.
- **Authority separation**: gate evidence can make the mode eligible for cutover or require rollback, but it cannot write
  authority state directly, delete typed evidence, rewrite legacy rows, or retire legacy writers.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Confirm the independent sibling contracts are present and record their exact contract fingerprints: `001-typed-ledger-schema`,
  `002-reducers-and-projections`, `003-sealed-artifacts`, `004-certificates-and-receipts`, `005-resume-adapter`, and
  `006-shadow-parity`.
- Define the legacy anchor and typed frontier model, including how a parity run identifies the same run, round, seat, artifact,
  and gate boundary on both paths.
- Freeze the mode-gate input manifest and the switch state vocabulary; reject any field whose ownership belongs to shared phases.

### Phase 2: Implementation
- Define the default-deny switch configuration, authorized transition table, fail-closed error taxonomy, and mode-bound policy
  fingerprint. Keep `ledger_authoritative_within_window` inaccessible without a later phase-017 cutover receipt.
- Define the rollback window record and expiry behavior, including trigger priority for parity regression, certificate invalidity,
  stale seal, unknown effect, replay mismatch, gate failure, and health degeneration.
- Build the gate evidence matrix for independent proposal, critique exposure, blinded and order-swapped judgment, convergence,
  non-convergence, artifact commit, council test gate, resume, and rollback fixtures.
- Define the mode certificate body and verifier inputs: exact baseline and candidate fingerprints, event range, sealed manifest,
  receipt chain, gate result, rollback anchor, unresolved obligations, and terminal disposition.
- Define deterministic handoff results `gate_passed`, `gate_blocked`, `gate_incomplete`, and `rollback_required`, with no
  implicit conversion from an error, unknown effect, or unresolved council result to pass.

### Phase 3: Verification
- Exercise nominal and adversarial parity fixtures against the same pinned inputs and compare typed lifecycle semantics, not only
  final report text, configured seat counts, or process exit status.
- Verify sealed references, receipt chain, replay fingerprint, certificate scope, mode identity, expiry, and restoration evidence
  offline; repeat the gate on the same frontier to test deterministic output.
- Run rollback drills at each declared crash and failure boundary, preserving both histories and proving legacy restoration without
  a second semantic application.
- Confirm that no gate test mutates authority, rewrites legacy state, deletes typed evidence, or creates an unscoped artifact.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Feed absent, malformed, stale, unauthorized, mixed-version, and wrong-mode switch inputs; assert legacy authority and a typed refusal |
| REQ-002 | Open, expire, close, and rollback windows with stable IDs; assert expiry cannot extend and all transitions emit receipts |
| REQ-003 | Run legacy and typed paths over normal, partial, timeout, late-result, and terminal fixtures; compare lifecycle dispositions and evidence references |
| REQ-004 | Inject correlated seats, collapsed minorities, stance flips, order inconsistency, and judge bias; assert effective-independence and dissent predicates remain visible |
| REQ-005 | Tamper with artifact bytes, manifests, source ranges, replay fingerprints, and supersession links; assert non-verified reads block the gate |
| REQ-006 | Substitute another mode ID, event namespace, artifact kind, or certificate subject; assert the Deep AI Council gate refuses the bundle |
| REQ-007 | Remove required receipts, introduce unknown effects, fail metamorphic checks, and force non-convergence; assert non-green dispositions |
| REQ-008 | Inspect every gate and rollback fixture for authority writes; assert legacy remains authoritative until phase-017's own receipt |
| REQ-009 | Re-run the gate and offline verifier over the same sealed frontier and contract versions; assert stable result and certificate digest |
| REQ-010 | Trigger restoration at each window boundary; assert the pinned legacy anchor is selected, typed evidence remains readable, and rollback is receipted |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

This plan depends on the shared transition-authorized ledger, typed event and reducer contracts, sealed artifact reader,
receipt and certificate verifier, replay fingerprint registry, effect-recovery policy, resume adapter, and shadow-parity
harness. It consumes the Deep AI Council sibling contracts in the order represented by the navigation adjacency, while the
manifest keeps `depends_on: []` for independent sibling planning.

The mode packet's existing planning-only boundary and packet-local `ai-council/**` artifact contract remain in force. The
research inputs are `findings-registry.json` and `findings-registry-modes.json`; their council findings specifically inform
effective seat count, independent reasoning paths, blinded adjudication, minority preservation, counterfactual tests, and
task-conditional protocol selection. Phase-011 convergence and health evidence is consumed as an exit predicate; phase-017
owns the actual authority cutover and global window.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

This phase is planning-only and does not change runtime authority. Any implementation commits remain git-reversible and must
be path-scoped to the mode migration surfaces. If a gate evaluator or switch contract is found unsafe before cutover, disable
the mode policy and leave `legacy_authoritative` selected; do not repair by bypassing a failed predicate.

For a post-cutover incident, phase-017 invokes the mode-defined window: fence new ledger-authoritative writes, append a
rollback request and restoration receipt, reconcile known effects through the shared recovery policy, select the pinned legacy
anchor, and retain typed events and sealed artifacts for forensic replay. If the window is expired, the automatic switch must
refuse and escalate rather than inventing an extension. A later attempt requires a new gate evaluation, window identity,
certificate, and cutover receipt.
<!-- /ANCHOR:rollback -->
