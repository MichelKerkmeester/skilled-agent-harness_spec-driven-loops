---
title: "Feature Specification: Deep AI Council - Rollback & Mode Gate"
description: "Plan the Deep AI Council rollback switch and independent mode gate for migration to the typed event-ledger substrate. The contract keeps authority fail-closed, bounds the rollback window, proves shadow parity, verifies sealed council artifacts, and emits a mode-specific certificate before phase-014 authority cutover."
trigger_phrases:
  - "Deep AI Council rollback and mode gate"
  - "deep-ai-council fail-closed cutover"
  - "deep-ai-council rollback window"
  - "deep-ai-council shadow parity certificate"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/034-deep-loop-innovation/013-mode-and-lane-migrations/003-deep-ai-council"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/034-deep-loop-innovation/013-mode-and-lane-migrations/003-deep-ai-council/007-rollback-and-mode-gate"
    last_updated_at: "2026-07-15T23:30:00Z"
    last_updated_by: "opencode"
    recent_action: "Scoped the Deep AI Council rollback switch and independent mode gate"
    next_safe_action: "Freeze gate predicates and rollback evidence against shared cutover contracts"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions:
      - "Which shared transition token and certificate verifier authorize the mode gate?"
      - "What exact elapsed window and health evidence permit automatic rollback?"
      - "Which shadow fixtures are mandatory for the Deep AI Council gate?"
    answered_questions:
      - "This phase is planning only; phase-017 owns authority cutover"
      - "The gate certifies Deep AI Council evidence, not semantic truth or cross-mode readiness"
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Deep AI Council - Rollback & Mode Gate

> Phase adjacency under the 003-deep-ai-council parent (grouping order, not a hard runtime dependency): predecessor `006-shadow-parity`; successor: none (last sibling).

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/034-deep-loop-innovation/013-mode-and-lane-migrations/003-deep-ai-council/007-rollback-and-mode-gate |
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Planned |
| **Created** | 2026-07-15 |
| **Owner skill** | system-deep-loop / deep-ai-council |
| **Origin** | Final Deep AI Council child concern in the phase-013 per-mode migration fan-out |
| **Depends on** | `[]` in `phase-tree.json`; sibling references are navigation only |
| **Consumes** | Typed ledger, reducer, sealed-artifact, receipt, certificate, resume, shadow-parity, and shared mode contracts |
| **Output** | A fail-closed rollback-switch contract, bounded rollback-window policy, independent mode-gate checklist, and certificate handoff to phase-017 |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Deep AI Council runs hold state across the full planning lifecycle: seats deliberate independently, critique rounds expose
selected evidence, candidates are adjudicated, the council converges or remains unresolved, `ai-council/**` artifacts are
committed, and the council test gate evaluates the result. The typed event-ledger migration adds a second evidence path while
legacy `ai-council-state.jsonl`, legacy artifacts, and legacy writers remain live. Without a mode-owned rollback switch,
the first authority transition can leave the control plane split between an incomplete ledger frontier and a legacy path that
no longer receives coherent updates.

The migration also needs an independent proof that **this mode** is ready. A generic green runtime test cannot prove that
Deep AI Council preserved independent-seat evidence, critique provenance, blinded and order-swapped adjudication, minority
positions, unresolved outcomes, sealed artifacts, receipts, and council-gate results. Nominal agreement is insufficient: the
research requires effective independence, calibrated evidence, bias checks, and dissent survival. The mode gate therefore
must fail closed unless the mode-specific shadow comparison is green, required artifacts are sealed, the receipt and
certificate bundle verifies, and the rollback anchor is usable.

This phase plans the switch and gate only. The switch is a default-deny authority-cutover toggle with explicit legacy,
shadow, armed, active-window, rollback, and closed dispositions. The gate emits a Deep AI Council certificate over the
declared evidence bundle and hands the result to the later cutover path. It is the mode's exit gate for the phase-014
convergence and health obligations; phase-017 alone changes runtime authority.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A Deep AI Council rollback-switch state machine with a default-deny authority-cutover toggle, explicit transition
  authorization, stable mode and run identities, and no implicit fallback from an invalid state.
- A bounded rollback window contract containing the legacy anchor, typed-ledger frontier, cutover receipt, expiry policy,
  trigger classes, restoration action, and evidence required to close the window.
- A mode-specific gate checklist for the lifecycle `seats deliberate -> critique rounds -> converge -> ai-council
  artifacts -> council test gate`, including normal, failure, minority, bias, order-swap, non-convergence, and resume
  fixtures.
- Gate inputs and predicates for typed event/reducer parity, effective independence, preserved dissent and contradictions,
  sealed artifact integrity, receipt-chain validity, certificate validity, replay compatibility, and rollback readiness.
- A Deep AI Council mode certificate that binds the exact candidate and baseline fingerprints, event frontier, sealed
  manifest, shadow-parity report, test-gate result, rollback window, and unresolved-obligation disposition.
- A handoff contract to phase-017 that distinguishes `gate_passed`, `gate_blocked`, `gate_incomplete`, and
  `rollback_required` without changing authority in this phase.

### Out of Scope
- Implementing the shared ledger, transition-authorization gateway, replay fingerprint, effect-recovery service, sealing
  primitive, receipt primitive, certificate verifier, or generic health service.
- Rewriting or deleting legacy `ai-council-state.jsonl`, legacy writers, current packet artifacts, or historical evidence.
- Implementing seat selection, critique, adjudication, reducers, projections, convergence policy, artifact generation, or
  the council test suite; this phase defines their gate evidence and ownership boundaries.
- Moving production authority, migrating arbitrary in-flight packets, closing the global migration window, or retiring
  legacy writers; phase-017 and phase-015 own those decisions.
- A cross-mode gate, a global cutover certificate, or any claim that a valid process certificate proves semantic truth.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Authority cutover is fail-closed for Deep AI Council | The toggle defaults to deny; missing, stale, malformed, unauthorized, mixed-version, or mode-mismatched gate evidence leaves legacy authority selected and records a typed refusal |
| REQ-002 | Rollback has a bounded and auditable window | Each armed cutover has a stable window ID, legacy anchor, typed frontier, expiry, trigger policy, restoration action, and close receipt; expiry cannot silently extend the window |
| REQ-003 | The mode gate proves Deep AI Council shadow parity | A mode fixture matrix compares legacy and typed lifecycle results, error dispositions, evidence references, artifacts, and gate outcomes without comparing only final text or seat counts |
| REQ-004 | The gate preserves council independence and dissent evidence | Effective-seat evidence, provider and reasoning-method correlation, private pre-discussion state, minority claims, contradictions, stance changes, and order-swap outcomes are present or explicitly blocked |
| REQ-005 | Required artifacts are sealed and addressable | The gate verifies the mode artifact manifest, content digests, source event ranges, replay fingerprint, required sections, supersession lineage, and tamper-evident reads |
| REQ-006 | The certificate is mode-specific and independently verifiable | The emitted certificate names `deep-ai-council`, exact baseline and candidate fingerprints, gate predicates, receipt chain, sealed references, rollback anchor, and terminal disposition; another mode cannot satisfy it |
| REQ-007 | Failure and uncertainty never become a green gate | Failed bias or metamorphic checks, unresolved required evidence, unknown effects, incomplete receipts, incompatible replay, non-convergence, or stale artifacts produce `blocked`, `incomplete`, or `rollback_required` |
| REQ-008 | The phase does not move authority | Gate and rollback outputs are additive evidence; the implementation plan leaves the legacy path authoritative until phase-017 consumes a valid certificate and opens its own cutover window |
| REQ-009 | The handoff is deterministic and replay-bound | Re-evaluating the same sealed frontier, policy versions, fixture manifest, and receipt chain produces the same gate result and certificate body digest |
| REQ-010 | Rollback restoration is independently testable | A drill can restore the pinned legacy path, reconcile typed and legacy tails, preserve all evidence, and emit a receipt proving restoration without rewriting history |

The switch is a mode-owned policy boundary over shared primitives. Its proposed states are `legacy_authoritative`,
`shadow_eligible`, `cutover_armed`, `ledger_authoritative_within_window`, `rollback_active`, and `window_closed`. The
default state is `legacy_authoritative`; an invalid or absent state is treated as that safe state plus a blocking refusal.
The `cutover_armed` state is evidence-bearing but not authoritative. Only the later cutover phase may transition to
`ledger_authoritative_within_window`, and only after it verifies this mode's certificate and emits its own authorized
cutover receipt. A rollback request within the window selects the pinned legacy anchor, stops new typed-authoritative
writes, reconciles any known effects, and appends a rollback record; it never deletes typed evidence or edits prior rows.

The independent gate must evaluate the mode's real lifecycle rather than a generic process exit. Its minimum evidence set
contains shadow-parity results for independent proposals, critique exposure, blinded candidate handling, order-swapped
judgments, convergence and non-convergence, sealed artifacts, council test-gate pass and fail paths, resume boundaries,
unknown effects, and rollback restoration. Research findings also require an explicit control-arm comparison, effective
seat count, minority survival, calibrated judge evidence, and counterfactual or metamorphic stability where those inputs
are declared mandatory by the shared mode contract.

**Given** the toggle is absent, malformed, expired, or bound to another mode, **When** phase-017 evaluates a cutover request,
**Then** the request is refused, legacy authority remains selected, and a typed refusal receipt identifies the failed predicate.

**Given** shadow parity is green for nominal runs but a required minority, order-swap, or bias fixture is missing, **When** the
mode gate is evaluated, **Then** the result is `incomplete` or `blocked` and no mode certificate authorizes cutover.

**Given** a cutover window is active and a declared rollback trigger fires before expiry, **When** the switch evaluates the
trigger, **Then** it restores the pinned legacy anchor, preserves typed evidence, and emits a rollback receipt.

**Given** every required Deep AI Council artifact is sealed and the receipt chain and replay fingerprint verify, **When** the
independent mode gate runs on the same frontier twice, **Then** it emits the same mode-bound certificate body digest and gate disposition.
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The rollback switch defaults to fail-closed legacy authority, has explicit authorized states, and rejects
  invalid, stale, mixed-version, or wrong-mode requests without guessing.
- **SC-002**: Every cutover candidate has a bounded rollback window tied to a legacy anchor, typed frontier, expiry, trigger
  policy, restoration proof, and append-only close or rollback receipt.
- **SC-003**: The independent gate covers the full Deep AI Council lifecycle and proves typed-versus-legacy parity for normal,
  failure, minority, bias, order-swap, non-convergence, resume, and council-gate fixtures.
- **SC-004**: The gate retains effective independence, calibrated adjudication, minority and contradiction evidence, and
  counterfactual or metamorphic results instead of treating nominal two-of-three agreement as sufficient.
- **SC-005**: Required artifacts are sealed, tamper-evidently readable, receipt-complete, replay-compatible, and bound to the
  exact mode and event frontier.
- **SC-006**: A Deep AI Council certificate is emitted only for this mode and is independently verifiable from its declared
  evidence bundle; blocked or incomplete obligations cannot be hidden in a green summary.
- **SC-007**: The phase hands a deterministic gate result to phase-017 without moving authority or retiring legacy writers.

**Given** a valid gate bundle, **When** an offline verifier checks the mode certificate, **Then** it reproduces the declared
shadow-parity, sealed-artifact, receipt, replay, and rollback predicates without running a council.

**Given** a required artifact, receipt, or parity witness is missing or tampered, **When** the gate evaluates the bundle,
**Then** it returns a typed non-green disposition and leaves authority unchanged.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **False-green parity** - matching final prose or configured seat counts can hide changes in evidence exposure, judge bias,
  minority survival, or replay behavior. Mitigation: compare typed lifecycle outcomes, raw evidence references, error
  dispositions, sealed manifests, effective independence, and control-arm results.
- **Rollback switch bypass** - a caller could treat an environment flag or stale certificate as authority. Mitigation: make
  the shared transition gateway and mode-bound certificate mandatory; invalid state resolves to legacy authority plus refusal.
- **Unbounded rollback** - a window that never expires can leave two authorities live. Mitigation: require a signed or shared
  policy expiry, immutable window identity, close receipt, and explicit re-arming for any later attempt.
- **Rollback split-brain** - typed events may continue after legacy restoration or an unknown effect may be replayed twice.
  Mitigation: fence typed-authoritative writes, reconcile effects through shared receipts, preserve both tails, and block
  when the provider cannot prove safe reuse.
- **Certificate overclaim** - a valid process certificate may be read as proof of council correctness. Mitigation: state that
  the certificate attests evidence and contract conformance, not semantic truth or authority beyond the named window.
- **Shared-contract drift** - later changes to event, seal, receipt, replay, or cutover fields can invalidate the gate. Mitigation:
  pin contract fingerprints and reject unregistered versions before evaluation.
- **Mode boundary leakage** - a generic runtime or another mode's certificate could satisfy this gate accidentally. Mitigation:
  bind mode ID, event namespace, artifact kinds, fixtures, and certificate verifier inputs to `deep-ai-council`.
- **Dependency ordering** - this child needs outputs from `001-typed-ledger-schema`, `002-reducers-and-projections`,
  `003-sealed-artifacts`, `004-certificates-and-receipts`, `005-resume-adapter`, and `006-shadow-parity`, while phase-017
  consumes its result. The manifest's `depends_on: []` remains authoritative for sibling planning order.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- What exact shared transition token and certificate-verifier result authorize `cutover_armed` and later
  `ledger_authoritative_within_window`?
- Is the rollback window measured in elapsed time, completed council runs, event-frontier advancement, or a declared
  combination, and which clock is replay-safe?
- Which parity fixture failures require immediate rollback, which create `incomplete`, and which are diagnostic only?
- Does the switch fence only new ledger-authoritative writes, or must it also pause in-flight seat, critique, artifact, and
  test-gate effects before legacy restoration?
- Which sealed artifact kinds are mandatory for a valid Deep AI Council mode certificate, and which may be absent on a
  non-converged but validly blocked run?
- What minimum effective-independence, calibration, minority-survival, and counterfactual evidence thresholds are frozen by
  the shared mode contract rather than invented here?
- How does the gate distinguish a true legacy regression from a typed-versus-legacy representation difference that remains
  semantically equivalent?
- Which phase-011 convergence and health witnesses are required for this mode's exit gate, and how are they represented in
  the phase-017 handoff without moving their generic ownership?

These questions are contract-ratification inputs for implementation. They do not authorize a local authority toggle,
unbounded rollback, second certificate scheme, runtime cutover, legacy-writer retirement, or semantic claim about council
correctness in this Planned phase.
<!-- /ANCHOR:questions -->
