---
title: "Feature Specification: Model Benchmark - Rollback & Mode Gate"
description: "Plan the fail-closed rollback switch and independent migration gate for the Model Benchmark variant: multi-model runs, scoring matrices, sealed evidence, certificates, and phase-014 readiness over the shared Deep Improvement Common Services backbone."
trigger_phrases:
  - "model benchmark rollback and mode gate"
  - "model benchmark authority rollback switch"
  - "model benchmark migration gate"
  - "model benchmark phase 014 readiness certificate"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/002-mode-and-lane-migrations/006-model-benchmark/007-rollback-and-mode-gate"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/002-mode-and-lane-migrations/006-model-benchmark/007-rollback-and-mode-gate"
    last_updated_at: "2026-08-15T15:07:50Z"
    last_updated_by: "codex"
    recent_action: "Verified rollback-gate closeout with focused suite 58 of 58 at exit 0"
    next_safe_action: "Treat this leaf as complete while preserving additive-dark authority"
    blockers: []
    key_files: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Model Benchmark - Rollback & Mode Gate
> Child adjacency under `006-model-benchmark` (independent sibling planning contracts, not a hard runtime dependency): predecessor `006-shadow-parity`; successor: none (last sibling).

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/036-deep-loop-innovation/002-mode-and-lane-migrations/006-model-benchmark/007-rollback-and-mode-gate |
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-07-15 |
| **Owner skill** | system-deep-loop (Model Benchmark mode over the Deep Improvement Common Services backbone) |
| **Origin** | Final child concern in the phase-013 Model Benchmark migration |
| **Depends on** | `001-typed-ledger-schema`, `002-reducers-and-projections`, and `003-sealed-artifacts` are LANDED as additive-dark, non-authoritative substrate; sibling adjacency remains navigation rather than authority |
| **Consumes** | Complete certificate/receipt, resume-adapter, and required shadow-parity evidence from `004` through `006`, plus the real transition gateway and fencing coordinator |
| **Outcome** | Deliver the Model Benchmark rollback switch and independent mode gate for the typed event-ledger migration |
| **Inputs** | Parent 036 spec, phase-tree manifest, 036/002 findings registries, and the shared transition/versioning/rollback policy |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Model Benchmark owns a multi-model run and scoring matrix over the shared Deep Improvement Common Services backbone. The
variant must compare model identity and execution path without confounding them, retain common paired anchors beside an
adaptive diagnostic tail, cluster uncertainty by task or item family, and keep judge calibration, contamination lineage,
protocol robustness, workload, cost, latency, abstention, and switching evidence visible. The research inputs warn that a
single aggregate ranking, one reusable judge calibration, a recent timestamp, or a repeatable benchmark pass can all create
false confidence. They also identify a concrete current gap: `dispatch-model.cjs` exposes normalized usage fields while
`sweep-benchmark.cjs` leaves token and cost fields null and `sweep-reporter.cjs` ranks efficiency by output word count.

The earlier Model Benchmark siblings define the typed run and trial events, deterministic matrix reducers, sealed reference
artifacts, certificates and receipts, resume behavior, and the `006-shadow-parity` boundary. Those outputs are necessary
but not sufficient for a safe migration. Without a mode-scoped rollback switch, a stale writer or unresolved external model
effect can continue after restoration. Without an independent gate, a plausible matrix score or certificate can be mistaken
for proof that this mode migrated safely.

The schema, reducer/projection, sealed-artifact, certificate, resume, and parity leaves are LANDED but remain additive-dark
and non-authoritative. This completed leaf consumes their contracts and evidence without
allowing any predecessor output to become an authority decision.

This phase defines the fail-closed authority-cutover toggle, the bounded rollback window, and the Model Benchmark gate that
certifies this mode's migration. It builds on the Deep Improvement Common Services evaluator, canary, calibration, and
promotion contracts from mode 004 and adds only Model Benchmark run and scoring-matrix evidence. It does not execute an
authority cutover, re-implement shared services, retire a legacy writer, or turn a benchmark result into a global model
selection claim.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- A Model Benchmark rollback switch over the shared authority record, with `legacy_authoritative` as the safe default,
  explicit mode and policy identity, external transition authorization, monotonic authority epochs, writer fencing, stale
  request rejection, and typed refusal evidence.
- A bounded rollback window record containing the legacy anchor, typed frontier, matrix and gate evidence references, trigger
  policy, opening and expiry rules, fencing token, successful-authoritative-execution count, unresolved obligations, and
  close or rollback receipt.
- The inherited minimum rollback window of 14 calendar days and five successful authoritative executions, whichever
  completes later, with extensions for low traffic, unresolved parity, replay drift, receipt gaps, calibration or validity
  uncertainty, budget or health alarms, stale certificates, unknown effects, and reconciliation uncertainty.
- A non-destructive Model Benchmark restoration runbook: freeze typed-authoritative admission, fence stale writers, classify
  active model cells and scoring effects through the resume contract, resolve or quarantine uncertain effects by stable
  identity, restore the legacy path at a new epoch through the shared gateway, preserve all events and sealed artifacts, and
  emit a rollback certificate.
- An independent Model Benchmark mode-gate checklist over multi-model run declaration, matrix admission, common anchors,
  adaptive diagnostic allocation, trial completion and failure, raw observations, scoring reduction, calibration,
  contamination, workload, cost and latency, replay, resume, duplicate delivery, abort, restore, and incomplete evidence.
- Gate predicates over the `006-shadow-parity` report, sealed benchmark recipe and matrix artifacts, Model Benchmark
  certificate and receipt chain, reducer and projection fingerprints, deterministic replay, resume decisions, and rollback
  rehearsal, with zero unexplained semantic divergence.
- A mode-migration certificate bound to the exact candidate SHA, BASE, shared-contract and write-set digests, Model Benchmark
  event and reducer versions, evaluator and canary epochs, matrix and artifact manifests, rollback anchor, window state,
  verifier identity, gate dispositions, and the phase-014 readiness handoff.
- Adapter-only use of the Deep Improvement Common Services evaluator, canary, calibration, promotion, receipt, certificate,
  fingerprint, hard-veto, budget, lock, and effect-recovery contracts. Model Benchmark owns namespaced run and scoring logic
  only; it must not create a competing shared service or gate.
- The phase-014 handoff and the planning boundary for the 010 per-mode fan-out, which lands only after phase 012 freezes the
  shared contracts and emits the executable write-set conflict graph.
- An exception-safe caller boundary that authenticates the complete rollback request class, guards every caller-controlled
  digest and validator, snapshots validated primitives, and converts circular, non-finite, forbidden-prototype, non-plain,
  or wrong-shape input into a typed denial.
- Required phase-009 parity-receipt verification followed by independent readiness derivation through the real
  `TransitionAuthorizationGateway` and deterministic ledger replay.

### Out of Scope

- Re-implementing the shared typed event envelope, transition-authorization gateway, reducers, sealing primitive,
  certificates, receipts, replay fingerprints, resume adapter, evaluator, canary, calibration, promotion, budget, lock,
  adjudication, or effect-recovery services owned by shared phases or Deep Improvement Common Services.
- Implementing the Model Benchmark typed schema, reducers, sealed artifacts, certificates and receipts, resume adapter, or
  shadow-parity harness owned by siblings `001` through `006`; this phase consumes their immutable evidence boundaries.
- Flipping live authority, migrating arbitrary in-flight packets, closing the global rollback window, dispatching model
  trials, changing scoring policy, selecting a deployment model, or retiring legacy writers.
- Changing the parent 178-recommendation disposition, the phase 012 shared-contract freeze, the phase 013 per-mode fan-out,
  or the phase-014 authority-cutover contract.
- Treating a leaderboard, terminal score, mutable report, process exit, public ranking, or this phase's readiness certificate
  as proof that a model is globally best or that legacy authority may be retired.
- Re-running the phase-009 parity harness, adopting its computed `exitStatus` as the gate verdict, or claiming provenance
  beyond the substrate-handle boundaries accepted by the golden 007 decision record.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The Model Benchmark rollback switch is mode-scoped, never throws, and fails closed | Absent, malformed, unknown, stale, mixed-version, wrong-mode, gateway-failed, circular, non-finite, forbidden-prototype, non-plain, or wrong-shape caller input selects `legacy_authoritative`, emits typed refusal evidence, and performs no semantic append, external effect, or authority change; every caller-input digest and validator is guarded |
| REQ-002 | Rollback and restoration require external authorization | The mode cannot authorize its own rollback, unquarantine, verifier replacement, or legacy restoration; each request carries mode, policy, epoch, request digest, evidence digest, reason, actor capability, and decision identity |
| REQ-003 | The rollback window is bounded and auditable | Closure waits for both 14 calendar days and five successful authoritative executions, whichever completes later; low traffic or unresolved parity, validity, replay, receipt, budget, health, or effect obligations extend the window |
| REQ-004 | Restoration is non-destructive and certificate-backed | Admission freezes, stale writers are fenced, in-flight model and scoring work is classified, legacy authority resumes at a new epoch, no event or sealed artifact is deleted, and a rollback certificate records reconciliation and unknown states |
| REQ-005 | Phase-009 shadow parity is required evidence, not the gate verdict | The gate re-verifies receipt integrity, mode/frontier/manifest binding, and typed dispositions, ignores the receipt's computed `exitStatus` as authority, does not re-run the parity harness, and independently re-derives readiness through the real `TransitionAuthorizationGateway` plus deterministic ledger replay |
| REQ-006 | The gate requires complete sealed and referentially verified matrix evidence | Every named cross-artifact reference resolves through the real substrate to its expected KIND and, where present, matches EPOCH, LIFECYCLE, freshness, real STATE, VISIBILITY/role redaction, and AUTHORITY liveness; existence or shape alone cannot pass |
| REQ-007 | The gate requires certificate and receipt continuity | The Model Benchmark certificate, transition receipt chain, verifier receipt, effect outcomes, budget evidence, replay fingerprint, and explicit dispositions for every required transition are complete and independently verifiable |
| REQ-008 | Uncertainty never becomes migration readiness | Missing, stale, contradictory, malformed, unsupported, contaminated, `UNKNOWN`, `INCONCLUSIVE`, `INSUFFICIENT_EVIDENCE`, telemetry-gap, or underpowered inputs produce `blocked`, `incomplete`, `not_ready`, or `rollback_required`, never a green gate |
| REQ-009 | The certificate is exact-SHA and matrix bound | The certificate names this mode, BASE, candidate SHA, shared contract versions, event and reducer versions, evaluator and canary epochs, matrix and artifact digests, fixture IDs, rollback anchor, window state, verifier, gate predicates, and dispositions |
| REQ-010 | Shared services have one source of truth | Model Benchmark consumes Deep Improvement Common Services evaluator, canary, calibration, promotion, receipt, certificate, veto, budget, and recovery semantics through adapters and cannot weaken or copy them |
| REQ-011 | The gate is independent of authority | An offline verifier evaluates immutable evidence and uses the shared authorization boundary; a pass emits phase-014 readiness only and cannot mutate authority, dispatch a model, alter a baseline, promote a candidate, or retire a writer |
| REQ-012 | The handoff is deterministic and sequencing-safe | Re-evaluating the same sealed matrix frontier and contract fingerprints yields the same gate result and certificate body digest; the handoff remains blocked until phase 012 freezes shared contracts and emits the write-set conflict graph |
| REQ-013 | Rollback-request authentication is structurally complete | A closed request schema classifies every field as gateway-authenticated, independently re-derived, cross-checked against verified evidence, a validated closed value, or a deterministic constant; unknown or inert fields fail closed, and only snapshotted validated values reach authorization and certificate emission |
| REQ-014 | Fencing and rollback anchoring use re-verified substrate state | A stale token is accepted only when it is a positive safe integer strictly below the canonical writer resource's durable coordinator high-water mark and newly issued rollback token; the requested rollback anchor must equal the anchor in the independently re-verified migration certificate |

### Model Benchmark rollback and mode-gate acceptance contract

The switch is a Model Benchmark policy adapter over the shared authority record, not a second authority source. Its safe
default is `legacy_authoritative`. The admissible states are `shadowing`, `cutover_ready`, `new_authoritative_reversible`,
`rollback_pending`, `legacy_restored`, and `window_closed`; invalid or absent state resolves to legacy authority plus a typed
refusal. The mode can request recovery and publish readiness evidence, but only the external gateway and independent verifier
may authorize authority-sensitive transitions.

The rollback window opens only after the mode's gate and cutover evidence are accepted by the shared contract. It records the
legacy anchor, typed frontier, matrix frontier, evaluator and canary epochs, window ID, fencing token, successful execution
count, trigger policy, expiry conditions, unresolved obligations, and the close or rollback receipt. The minimum is 14
calendar days and five successful authoritative executions, whichever completes later. Closure is refused when traffic is
too low to exercise the mode or when parity, calibration, contamination, receipt, replay, budget, health, or effect evidence
remains unresolved.

The independent gate starts with a green `006-shadow-parity` report and then verifies the sealed artifact graph, certificate
and receipt continuity, matrix and reducer fingerprints, replay and resume decisions, workload and validity evidence, and
rollback rehearsal. It compares raw trial observations before normalized scores and preserves the distinction between model
quality, execution-path behavior, judge or rubric validity, contamination, operational cost, canary veto, incomplete
evidence, unknown effect, and selection disposition. A final score match is never sufficient.

Parity is mandatory evidence only. The gate authenticates the phase-009 receipt and its bindings, then independently
replays the deterministic ledger and asks the real transition gateway to evaluate locally re-derived evidence. The receipt's
computed `exitStatus` never becomes the verdict, and this leaf does not re-run the parity harness.

The complete rollback request is authenticated structurally before authorization. Every named reference must resolve
through the real substrate and satisfy its kind, epoch/lifecycle/freshness/state, visibility, and authority obligations.
Stale-writer denial compares the caller-attested predecessor token with the coordinator's durable high-water mark and newly
issued rollback token; rollback anchoring compares the request with the independently re-verified migration certificate.
The accepted limits on retained-store observation, lifecycle-label semantics, health/resume/window/risk authenticity, and
historical lease identity come from the golden leaf's
[decision record](../../001-deep-research/007-rollback-and-mode-gate/decision-record.md). Their provenance must be verified
before propagation, and phase 014 must correlate those bounded sources before relying on the readiness certificate.

| Gate input | Required evidence | Blocking disposition |
|------------|-------------------|----------------------|
| Shadow parity | `006-shadow-parity` report for the complete Model Benchmark lifecycle and shared-service boundaries | `blocked` on missing, unexplained, reordered, unauthorized, stale, or nondeterministic evidence |
| Sealed matrix | Dependency-closed recipe, common anchors, adaptive policy, model/executor cells, raw observations, score matrix, workload, validity, and contamination artifacts | `not_ready` on missing, tampered, expired, leaked, contaminated, mixed-version, or stale artifacts |
| Certificates and receipts | Model Benchmark run certificate, transition chain, verifier receipt, effect outcomes, budget evidence, and safe disposition for each required transition | `blocked` on missing, duplicate, unverifiable, uncertain, or mismatched evidence |
| Replay and resume | Complete and checkpoint replay, matrix-order permutation, duplicate delivery, crash-before-receipt, changed manifest, unknown effect, and resume fixtures | `incomplete` or `rollback_required` on unsafe reuse, lost identity, double effect, or unmapped state |
| Statistical and operational validity | Paired anchor coverage, task-family clustering, candidate-specific calibration, contamination lineage, quality floors, cost, latency, abstention, and switching evidence | `blocked` or `incomplete` when the claimed comparison is underpowered, invalid, or operationally incomplete |
| Rollback readiness | External authorization, writer fencing, legacy-anchor restoration at a new epoch, retained evidence, and successful rehearsal | `rollback_required` when any recovery step is unavailable or unproven |
| Shared-service reuse | Common evaluator, canary, promotion, receipt, certificate, veto, and recovery fixtures pass through the Model Benchmark adapter | `blocked` on copied service policy, weakened veto, divergent receipt, or private gate semantics |

The emitted result is `gate_passed`, `gate_blocked`, `gate_incomplete`, or `rollback_required`. `gate_passed` means this
Model Benchmark migration is ready for the phase-014 handoff; it does not state that live authority moved, that the rollback
window closed, that a model won deployment, or that a legacy writer may be removed.
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A Model Benchmark rollback switch is specified with deny-by-default behavior, external authorization, epoch
  fencing, explicit triggers, and a non-destructive restoration path.
- **SC-002**: The rollback window remains open for at least 14 calendar days and five successful authoritative executions,
  extends on low traffic or unresolved obligations, and has auditable closure evidence.
- **SC-003**: The independent Model Benchmark gate is green only with shadow parity, sealed matrix evidence, complete
  certificates and receipts, deterministic replay, safe resume, validity evidence, and rollback rehearsal.
- **SC-004**: Every missing, stale, contradictory, malformed, contaminated, unsupported, unknown, or nondeterministic input
  fails closed and leaves legacy authority selected.
- **SC-005**: Multi-model runs preserve model and execution-path crossings, common anchors, adaptive coverage, raw trials,
  task-family uncertainty, candidate-specific calibration, contamination lineage, and workload-shaped operational evidence.
- **SC-006**: The phase consumes Deep Improvement Common Services through adapters without copying evaluator, canary,
  calibration, promotion, receipt, certificate, veto, or recovery semantics.
- **SC-007**: The exact-SHA mode certificate hands phase-014 readiness while explicitly excluding authority cutover and
  legacy-writer retirement, and remains sequenced behind the phase 012 contract freeze and write-set graph.
- **SC-008**: Malformed request objects never throw; class-wide authentication, referential-integrity checks, independent
  gateway/replay derivation, strict coordinator supersession, and rollback-anchor equality all fail closed with typed evidence.

**Given** a sealed multi-model matrix with raw trials, score observations, calibration, contamination, workload, and receipt
evidence, **When** the independent gate verifies it, **Then** the gate checks the complete evidence graph and refuses a
score-only, mutable-report, or public-ranking pass.

**Given** a canary leak, invalid judge calibration, contaminated case, unknown model effect, hard common-service veto, or
missing required anchor, **When** the gate evaluates the matrix, **Then** it preserves the typed non-green disposition and
cannot convert it into readiness through an aggregate score.

**Given** the same sealed matrix frontier and contract fingerprints are evaluated twice, **When** no semantic input changes,
**Then** the gate result and certificate body digest are identical.

**Given** a rollback trigger fires inside the reversible window, **When** the external gateway authorizes restoration, **Then**
admission freezes, stale writers are fenced, legacy resumes at a new epoch, and all typed evidence remains readable.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Score-only false green** - A high aggregate can hide task-family regressions, judge capture, contamination, missing
  anchors, tail latency, or hard quality-floor failures. Mitigation: require raw matrix evidence, validity cards, clustered
  uncertainty, operational metrics, and common-service vetoes before readiness.
- **Model and execution-path confounding** - A model comparison can actually compare two complete stacks. Mitigation: bind
  model build, provider, route, framework, prompt, tool, permission, and workload identities to every matrix cell and gate
  fingerprint.
- **Adaptive sampling bias** - Information-guided diagnostics can omit weak models or rare failure families. Mitigation:
  preserve common sealed anchors, family quotas, exposure caps, selection propensities, and confirmatory separation.
- **Judge or rubric drift** - One calibration or collapsed rubric can reverse a model ranking with false confidence.
  Mitigation: retain candidate-specific calibration, axis perturbations, oracle uncertainty, model-build provenance, and
  explicit abstention or validity states.
- **Contamination and hidden-case leakage** - Recent cases may still be exposed, and hidden material may be disclosed through
  an adapter. Mitigation: seal source and visibility lineage, rotate and retire cases, preserve replacement links, and hard
  block on leakage or uncertain contamination.
- **Operational evidence loss** - Null usage fields or word-count efficiency can masquerade as measured cost. Mitigation:
  retain realized usage, latency, error, abstention, switching, and missing-evidence states without fabricated values.
- **Split-brain rollback** - A stale model writer or duplicate external effect can continue after legacy restoration. Mitigation:
  freeze admission, fence writers, use monotonic epochs and stable effect identities, and route unknown effects through shared
  recovery.
- **Shared-service fork** - Model Benchmark could copy evaluator, canary, promotion, or rollback behavior. Mitigation: one
  adapter boundary, shared fixtures, common hard-veto ordering, and a negative test for variant-local semantics.
- **Provenance overclaim** - Caller-supplied health, historical lease, retention, resume, window, or risk evidence could look
  internally consistent without a real source handle. Mitigation: preserve the golden 007 decision-record boundaries and
  require phase-014 correlation against authoritative stores and coordinator history.
- **Sequencing drift** - The mode gate could be treated as authority or run before shared contracts are frozen. Mitigation:
  keep the phase-014 handoff separate from cutover, require the phase 012 contract and write-set digests, and preserve the
  010 fan-out ordering stated by the parent program.
- **Dependencies**: the parent 036 additive-dark migration model; shared transition/versioning/rollback policy; Model
  Benchmark siblings `001` through `006`; Deep Improvement Common Services mode 004; phase 012 shared contract freeze and
  write-set conflict graph; phase-014 handoff; 036/002 findings registries; the model-benchmark runtime paths; and the
  spec-kit validator.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- What exact shared authority-record fields and transition token does the phase-014 consumer expose for the Model Benchmark
  switch without creating a mode-local authority source?
- Which Model Benchmark artifacts are mandatory in the mode-migration certificate when a matrix is valid but incomplete, and
  which are referenced from the sibling certificate contract rather than reissued?
- What qualifies as a successful authoritative execution for the five-run minimum when a matrix returns an explicit
  abstention, incomplete result, underpowered comparison, or variant adapter failure?
- Which matrix, calibration, contamination, workload, budget, health, or receipt conditions require immediate rollback versus
  quarantine, evidence gathering, or rollback-window extension?
- Which model-cell and scoring effects support query-by-idempotency-key recovery before restoration, and which unresolved
  outcomes must remain `UNKNOWN` until an operator decision?
- Which common anchors, adaptive diagnostic cases, task-family quotas, and multiplicity rules are frozen by the shared mode
  contract before the gate can assess statistical sufficiency?
- What exact certificate schema and acceptance endpoint does phase-014 consume for this mode gate while preserving the later
  authority-cutover boundary?

These questions are resolved against the frozen shared contracts before implementation. They do not authorize a local
authority toggle, shortened rollback window, second evaluator or verifier, mutable evidence repair, variant-local gate,
semantic claim about a globally best model, or legacy-writer retirement in this Planned phase.
<!-- /ANCHOR:questions -->
