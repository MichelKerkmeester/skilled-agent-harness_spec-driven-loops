---
title: "Feature Specification: Deep Improvement Common Services - Rollback & Mode Gate"
description: "Plan the fail-closed rollback switch and independent migration gate for the shared Deep Improvement Common Services backbone: evaluator-first candidate generation, scoring, canary analysis, and guarded promotion. The gate consumes shadow parity, sealed artifacts, certificates, receipts, replay, and resume evidence, then emits a mode-bound readiness certificate for the phase-011 handoff without moving authority."
trigger_phrases:
  - "deep improvement common rollback and mode gate"
  - "deep improvement authority rollback switch"
  - "shared evaluator canary promotion migration gate"
  - "deep improvement phase 011 readiness certificate"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/004-deep-improvement-common/007-rollback-and-mode-gate"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/004-deep-improvement-common/007-rollback-and-mode-gate"
    last_updated_at: "2026-07-15T21:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Defined rollback switch and common-service gate evidence boundary"
    next_safe_action: "Freeze gate predicates and rollback window evidence against shared contracts"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Deep Improvement Common Services - Rollback & Mode Gate
> Child adjacency under `004-deep-improvement-common` (independent planning contracts, not a hard runtime dependency): predecessor `006-shadow-parity`; successor: none (last sibling).

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/004-deep-improvement-common/007-rollback-and-mode-gate |
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Planned |
| **Created** | 2026-07-15 |
| **Owner skill** | system-deep-loop (Deep Improvement Common Services) |
| **Origin** | Final child concern in the phase-013 deep-improvement-common migration |
| **Depends on** | `[]` in the approved phase definition; sibling adjacency is navigation only |
| **Outcome** | Plan the shared-service rollback switch and independent mode gate for the typed event-ledger migration |
| **Inputs** | Parent 065 spec, phase-tree manifest, 065/002 findings registries, siblings `001` through `006`, and the shared transition/versioning/rollback policy |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Deep Improvement Common Services owns one evaluator-first backbone: candidate generation produces immutable lineages, shared
evaluators record raw observations, score policies derive versioned results, canaries test safety and drift, and a guarded
promotion service decides whether a candidate may progress. `005-agent-improvement`, `006-model-benchmark`, and
`007-skill-benchmark` consume this backbone and share its packet and scoring path. A typed schema, reducer, sealed-artifact
set, receipt chain, resume adapter, and shadow comparator are necessary but not sufficient: without one rollback boundary and
one independent mode gate, a plausible terminal score could be mistaken for migration safety or could leave the legacy and
typed paths split during an incident.

The parent program requires an additive, dark, non-authoritative substrate, shadow parity before authority changes, one mode
at a time, and non-destructive rollback. The shared transition policy requires deny-by-default authorization, one writer per
mode, monotonic authority epochs, a rollback window of at least 14 calendar days and five successful authoritative
executions, whichever completes later, and a certificate-backed restoration that preserves history. This phase specializes
those rules for the shared evaluator, canary, and promotion services. It defines the rollback switch and the independent
gate; it does not execute a cutover, retire a legacy writer, or create a second ledger or verifier.

The 065/002 findings make the evidence boundary load-bearing. Rich evaluator traces and per-case fitness vectors must remain
available after score-policy changes; mutation operators and quality-diverse lineages must not collapse into one winner;
reward and evaluator-integrity oversight must remain separate; canary epochs must rotate and detect semantic leakage; salted
candidate aliases and order-swapped judging reduce identity and position bias; and shadow/canary/ship/abort/restore stages
must remain reversible. The gate therefore certifies this common service migration only when the shared evidence chain is
complete, replayable, sealed, and reusable by all three variants.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- A mode-scoped rollback switch over the shared authority record, with explicit states, default-deny behavior, external
  transition authorization, monotonic epochs, fencing, stale-request rejection, and typed refusal evidence.
- A bounded rollback window record containing the legacy anchor, typed frontier, gate and cutover evidence references,
  trigger policy, opening and expiry rules, fencing token, restoration action, and close or rollback receipt.
- The inherited minimum window of 14 calendar days and five successful authoritative executions, whichever completes later,
  plus extension rules for low traffic, unresolved parity, replay drift, receipt gaps, budget or health alarms, stale
  certificates, unknown effects, and state-reconciliation uncertainty.
- A non-destructive rollback runbook for the common services: freeze new typed-authoritative admission, fence stale writers,
  classify in-flight evaluator, canary, and promotion work through the resume contract, recover effects by stable identity,
  restore the legacy path at a new epoch through the shared gateway, preserve every event and sealed artifact, and emit a
  rollback certificate.
- An independent Deep Improvement Common Services mode-gate checklist covering evaluator epoch creation, candidate lineage,
  raw evaluation, score normalization, canary execution, guarded promotion, abort and restore, replay, resume, duplicate
  delivery, unknown effects, and incomplete evidence.
- Gate predicates over the `006-shadow-parity` report, sealed evaluator/candidate/canary/promotion artifacts, certificates,
  receipt chains, reducer and projection fingerprints, deterministic replay, rollback rehearsal, and zero unexplained
  semantic divergence.
- A mode-migration certificate bound to the exact candidate SHA, BASE, shared-contract and write-set digests, common event
  and reducer versions, evaluator and canary epochs, evidence manifests, rollback anchor, window state, verifier identity,
  and every gate disposition.
- The common evaluator, canary, and promotion service reuse contract consumed unchanged by `005-agent-improvement`,
  `006-model-benchmark`, and `007-skill-benchmark`. Variants provide namespaced candidate and domain adapters only; this
  mode owns the shared service semantics and their common gate evidence.
- A phase-011 handoff that distinguishes a green common-service migration certificate from an authority-cutover certificate,
  records unresolved obligations, and gives the next phase an exact evidence boundary to verify.

### Out of Scope

- Implementing or redefining the typed event envelope, transition gateway, reducers, projections, sealing primitive,
  certificate primitive, receipt primitive, resume adapter, or shadow-parity comparator owned by siblings `001` through `006`.
- Implementing `005-agent-improvement`, `006-model-benchmark`, or `007-skill-benchmark`, their candidate operators, task
  schemas, variant metrics, or variant-specific mode gates.
- Flipping live authority, migrating arbitrary in-flight packets, closing the global rollback window, or retiring legacy
  writers. This phase defines the switch and evidence contract; the later staged cutover contract performs authority change.
- Changing evaluator thresholds, canary contents, promotion policy, convergence policy, or the parent 178-recommendation
  disposition. The gate consumes versioned policies and reports their identity.
- Treating a terminal score, mutable report, process exit, or this phase's certificate as proof of semantic correctness or
  as permission to bypass the shared transition gateway.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The switch is scoped to Deep Improvement Common Services and fails closed | Absent, malformed, unknown, stale, mixed-version, wrong-mode, or gateway-failed input selects legacy authority and emits a typed refusal without a semantic append or side effect |
| REQ-002 | Rollback and restoration are externally authorized | The shared services cannot authorize their own rollback, unquarantine, verifier replacement, or legacy restoration; every transition carries mode, policy, epoch, request digest, evidence digest, reason, and decision identity |
| REQ-003 | The rollback window is bounded and auditable | A window remains open until both 14 calendar days and five successful authoritative executions complete, whichever is later; low traffic or unresolved obligations extend it, and closure or re-arming requires a new authorized identity |
| REQ-004 | Rollback is non-destructive and certificate-backed | Admission freezes, stale writers are fenced, in-flight work is classified, legacy authority resumes at a new epoch, no event or sealed artifact is deleted, and a rollback certificate records reconciliation and unknown states |
| REQ-005 | The independent gate requires shared-service shadow parity | The `006-shadow-parity` evidence proves event and projection parity for candidate lineage, raw evaluation, scoring, canary, promotion, abort, restore, resume, and failure paths with zero unexplained semantic differences |
| REQ-006 | The gate requires complete sealed evidence | Evaluator capsule, candidate and baseline inputs, raw observations, score derivations, canary epoch, promotion evidence, receipts, certificates, and replay references are current, digest-valid, dependency-closed, and readable through shared verifiers |
| REQ-007 | Uncertainty never becomes a green gate | Missing, stale, contradictory, malformed, unsupported, `UNKNOWN`, `INCONCLUSIVE`, `INSUFFICIENT_EVIDENCE`, or telemetry-gap inputs produce `blocked`, `incomplete`, `not_ready`, or `rollback_required`, never migration readiness |
| REQ-008 | The certificate is exact-SHA and evidence bound | The certificate names this mode, BASE, candidate SHA, shared contract versions, evaluator/canary epochs, fixture IDs, stream and artifact digests, gate predicates, rollback anchor, window state, verifier, and dispositions |
| REQ-009 | Shared services have one source for all three variants | The three downstream variants consume common evaluator, canary, promotion, receipt, certificate, fingerprint, veto, and rollback semantics through adapters and cannot satisfy the gate with private copies |
| REQ-010 | The gate is independent of authority | An offline verifier evaluates immutable evidence and uses the shared authorization boundary; a passing result emits readiness for phase 011 but cannot mutate authority, dispatch a candidate, alter a baseline, or retire a writer |
| REQ-011 | The handoff is deterministic and mode-specific | Re-evaluating the same sealed frontier and contract fingerprints yields the same gate result and certificate body digest; a certificate for another mode, frontier, or service epoch is rejected |
<!-- /ANCHOR:requirements -->

### Rollback and mode-gate acceptance contract

The switch is a policy adapter over shared authority primitives, not a second authority record. Its safe default is
`legacy_authoritative`. The admissible evidence states are `shadowing`, `cutover_ready`, `new_authoritative_reversible`,
`rollback_pending`, `legacy_restored`, and `window_closed`; invalid or absent state resolves to legacy authority plus a
blocking refusal. The mode can establish readiness and request recovery, but an external gateway and independent verifier
must authorize every authority-sensitive transition.

The independent gate starts with a green event and projection parity report from `006-shadow-parity`, then verifies the
sealed artifact graph, certificate and receipt continuity, replay fingerprint, resume decisions, common-service lifecycle
fixtures, and rollback rehearsal. The gate must compare raw evaluator observations before normalized scores and must retain
the distinction between target-task improvement, evaluator-integrity failure, canary veto, insufficient evidence, unknown
effect, and promotion decision. A final score match is never sufficient.

| Gate input | Required evidence | Blocking disposition |
|------------|-------------------|----------------------|
| Shadow parity | `006-shadow-parity` report with event and boundary projection parity for the complete shared-service lifecycle and all three variant extensions | `blocked` on missing, unexplained, reordered, unauthorized, stale, or nondeterministic evidence |
| Sealed artifacts | Dependency-closed evaluator capsule, candidate and baseline bundles, raw observations, canary epoch, and promotion evidence with valid seals and current digests | `not_ready` on missing, tampered, expired, leaked, mixed-version, or stale artifacts |
| Certificates and receipts | Complete run certificate, transition receipt chain, verifier receipt, effect outcomes, budget evidence, and explicit safe disposition for every required transition | `blocked` on missing, duplicate, unverifiable, uncertain, or mismatched receipt evidence |
| Lifecycle and resume | Candidate generation, evaluation, scoring, canary, promotion, abort, restore, replay, duplicate, crash, changed-manifest, and unknown-effect fixtures | `incomplete` or `rollback_required` on unsafe reuse, lost identity, double effect, or unmapped state |
| Rollback readiness | External authorization, writer fencing, legacy anchor restoration at a new epoch, retained evidence, and rehearsal report | `rollback_required` when any recovery step is unavailable or unproven |
| Variant reuse | Common fixtures pass through `005-agent-improvement`, `006-model-benchmark`, and `007-skill-benchmark` adapters without semantic fork | `blocked` on copied service policy, weakened veto, divergent receipt, or private gate semantics |

The emitted result is `gate_passed`, `gate_blocked`, `gate_incomplete`, or `rollback_required`. `gate_passed` means this
common service migration is ready for the phase-011 handoff; it does not state that live authority moved, that the rollback
window closed, or that a candidate is globally correct.

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A Deep Improvement Common Services rollback switch is specified with deny-by-default behavior, external
  authorization, epoch fencing, explicit triggers, and a non-destructive restoration path.
- **SC-002**: The rollback window remains open for at least 14 calendar days and five successful authoritative executions,
  extends on low traffic or unresolved obligations, and has auditable closure evidence.
- **SC-003**: The independent gate requires green shadow parity, sealed artifacts, complete certificates and receipts,
  deterministic replay, resume coverage, shared-service lifecycle coverage, and a rehearsed rollback path.
- **SC-004**: Every missing, stale, contradictory, malformed, unsupported, unknown, or nondeterministic input fails closed
  and leaves legacy authority selected.
- **SC-005**: The evaluator, canary, and promotion contracts are owned once here and are consumed by all three downstream
  variants without private replacement semantics.
- **SC-006**: The mode-migration certificate is exact-SHA bound, independently verifiable, and hands phase 011 readiness
  without claiming authority cutover or legacy-writer retirement.

**Given** a shared-service run has raw observations, normalized scores, canary results, and promotion evidence, **When** the
mode gate verifies it, **Then** it checks the complete receipt and seal graph and refuses a score-only or mutable-report pass.

**Given** a canary leak, evaluator-integrity failure, unknown effect, or hard promotion veto occurs, **When** the gate
evaluates the evidence, **Then** it preserves the typed non-green disposition and cannot convert it into readiness through a
soft aggregate score.

**Given** the same sealed frontier and contract fingerprints are evaluated twice, **When** no semantic input changes,
**Then** the gate result and certificate body digest are identical.

**Given** a rollback trigger fires inside the reversible window, **When** the external gateway authorizes restoration,
**Then** admission freezes, stale writers are fenced, legacy resumes at a new epoch, and all typed evidence remains readable.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Reward or evaluator gaming** - A candidate can optimize visible scores while regressing behavior or tampering with the
  evaluation boundary. Mitigation: preserve raw item and transition evidence, separate task reward from integrity
  oversight, use hidden and rotated canary epochs, and make integrity vetoes hard.
- **False-green parity** - Equal terminal scores can hide lineage, evaluator-epoch, canary, receipt, resume, or promotion
  divergence. Mitigation: consume event and projection parity at every boundary and fail on incomplete or normalized-away
  differences.
- **Split-brain rollback** - A stale typed writer or duplicate promotion effect can continue after legacy restoration.
  Mitigation: freeze admission, fence writers, use monotonic epochs and stable effect identities, and route unknown effects
  through the shared recovery policy.
- **Variant contract fork** - Agent, model, or skill benchmark code could copy shared evaluator or promotion logic and weaken
  the common gate. Mitigation: one ownership matrix, namespaced adapters, shared fixtures, and a common certificate subject.
- **Window closes without useful evidence** - Elapsed time can pass with insufficient authoritative executions or unresolved
  anomalies. Mitigation: require both minimum conditions and extend on low traffic, unresolved evidence, health alarms, or
  reconciliation uncertainty.
- **Certificate freshness drift** - A changed reducer, evaluator capsule, canary epoch, policy, write-set graph, or shared
  contract could invalidate a previously green gate. Mitigation: bind every result to exact digests and reopen on relevant
  drift.
- **Dependencies**: the parent 065 migration invariants; shared transition/versioning/rollback policy; common-service
  siblings `001-typed-ledger-schema` through `006-shadow-parity`; phase 012 shared mode contracts and write-set conflict
  graph; phase 011 handoff; and the 065/002 findings registries. Sibling `depends_on: []` remains the planning manifest
  authority; implementation readiness is established by the parent handoff.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- What exact shared authority-record fields and transition token does the phase-011 consumer expose for the common-service
  switch without creating a mode-local authority source?
- Which common-service artifacts are mandatory in the migration certificate when a valid run is blocked or inconclusive,
  and which are referenced from sibling certificates rather than reissued?
- Which evaluator-integrity, canary, health, budget, or receipt conditions require immediate rollback versus quarantine,
  evidence gathering, or rollback-window extension?
- What qualifies as a successful authoritative execution for the five-run minimum when the shared service returns a typed
  abstention, incomplete result, or variant adapter failure?
- Which effect-recovery actions are available for evaluator, canary, and promotion effects, and which providers support
  query-by-idempotency-key before restoration?
- What exact certificate schema and acceptance endpoint does phase 011 consume for this common-service exit gate while
  preserving the later authority-cutover boundary?

These questions are resolved against the frozen shared contracts before implementation. They do not authorize a local
authority toggle, shortened rollback window, second service primitive, mutable evidence repair, variant-local gate, or
semantic claim about candidate quality in this Planned phase.
<!-- /ANCHOR:questions -->
