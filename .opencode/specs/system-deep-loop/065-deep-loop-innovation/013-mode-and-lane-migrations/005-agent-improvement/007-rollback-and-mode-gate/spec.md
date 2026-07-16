---
title: "Feature Specification: Agent Improvement - Rollback & Mode Gate"
description: "Plan the fail-closed Agent Improvement rollback switch and independent migration gate for the agent-loop proposal-generation and scoring variant. Reuse the deep-improvement-common evaluator, canary, and promotion services; certify this mode only after shadow parity, sealed evidence, replay/resume integrity, and rollback readiness pass."
trigger_phrases:
  - "agent improvement rollback and mode gate"
  - "agent improvement authority rollback switch"
  - "agent loop migration gate"
  - "agent improvement phase 014 readiness"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/005-agent-improvement/007-rollback-and-mode-gate"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/005-agent-improvement/007-rollback-and-mode-gate"
    last_updated_at: "2026-07-15T21:20:00Z"
    last_updated_by: "opencode"
    recent_action: "Defined Agent Improvement rollback switch and independent gate boundary"
    next_safe_action: "Freeze agent gate predicates and rollback-window evidence against shared contracts"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Agent Improvement - Rollback & Mode Gate
> Child adjacency under `005-agent-improvement` (independent planning contracts, not a hard runtime dependency): predecessor `006-shadow-parity`; successor: none (last sibling).

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/005-agent-improvement/007-rollback-and-mode-gate |
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Planned |
| **Created** | 2026-07-15 |
| **Owner skill** | system-deep-loop (Agent Improvement mode) |
| **Origin** | Final child concern in the phase-013 Agent Improvement migration |
| **Depends on** | `[]` in the approved phase definition; sibling adjacency is navigation only |
| **Outcome** | Plan the Agent Improvement rollback switch and independent mode gate for the typed event-ledger migration |
| **Inputs** | Parent 065 spec, phase-tree manifest, 065/002 findings registries, Agent Improvement siblings `001` through `006`, and the shared transition/versioning/rollback policy |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Agent Improvement is the deep-improvement variant that generates proposals for an agent loop and scores candidate agent
definitions across behavior families. A candidate can change role, instructions, tools, routing, memory, verifier policy,
or inference configuration, so a terminal score cannot establish that the typed path is equivalent to the legacy path or
that a proposed change is safe to recover. The mode needs one explicit authority boundary that can select the legacy path
when evidence is absent, stale, contradictory, or outside the declared rollback window.

The preceding Agent Improvement children define the typed event vocabulary, deterministic reducers and projections, sealed
reference bindings, certificates and receipts, resume behavior, and `006-shadow-parity` evidence. This phase composes those
artifacts into two mode-specific controls: a fail-closed rollback switch and an independent migration gate. The switch is
an adapter over the shared authority record, not a second authority source. The gate certifies this variant only when
AgentIR lineage, failure-derived proposals, raw evaluator observations, canary and promotion outcomes, replay/resume
behavior, and rollback rehearsal are complete and digest-consistent.

The phase builds on `004-deep-improvement-common`. Its evaluator, canary, promotion, receipt, certificate, sealing, and
recovery services remain the single source of truth. Agent Improvement contributes only namespaced agent-loop evidence:
AgentIR and mutation lineage, behavior-family and authority-conflict coverage, causal failure localization, profile-scoped
transfer evidence, and the agent-specific gate predicates that consume those common results. This is planning only. A
green gate emits readiness for the phase-014 handoff; it does not move authority, close the rollback window, or retire a
legacy writer.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A mode-scoped Agent Improvement rollback-switch adapter over the shared authority record, with safe default `legacy_authoritative`, explicit state vocabulary, monotonic authority epochs, external transition authorization, fencing, stale-request rejection, and typed refusal evidence.
- A bounded rollback-window record carrying the legacy anchor, Agent Improvement typed frontier, gate and cutover evidence references, trigger policy, opening and expiry rules, fencing token, valid authoritative-execution count, unresolved obligations, and close or rollback receipt.
- Inheritance of the shared minimum rollback window: at least 14 calendar days and five successful authoritative executions, whichever completes later, with extension rules for low traffic, unresolved parity, stale certificates, receipt gaps, evaluator or canary drift, unknown effects, and reconciliation uncertainty.
- A non-destructive Agent Improvement rollback runbook: freeze typed-authoritative admission, fence stale writers, classify in-flight proposal/evaluation/canary/promotion work through the resume contract, recover effects by stable identity, restore the legacy path at a new epoch through the shared gateway, retain all evidence, and emit a rollback certificate.
- An independent Agent Improvement gate matrix over `006-shadow-parity`, typed AgentIR and candidate projections, sealed inputs and outputs, common evaluator/canary/promotion evidence, certificates and receipts, deterministic replay, resume fixtures, transfer coverage, and rollback rehearsal.
- Agent-specific predicates for clause and behavior-family coverage, act/refuse/clarify behavior, authority conflicts, side effects, perturbations, untouched-family sentinels, executor portability, profile-scoped promotion, candidate-blind evidence, and critical-invariant vetoes.
- An exact-SHA mode-migration certificate and phase-014 readiness handoff that identify the mode, BASE, candidate SHA, shared-contract and write-set digests, reducer and event versions, evaluator and canary epochs, evidence manifests, rollback anchor, window state, verifier, and every gate disposition.
- A reuse matrix proving that `005-agent-improvement`, `006-model-benchmark`, and `007-skill-benchmark` consume the common evaluator, canary, promotion, receipt, certificate, fingerprint, veto, and rollback semantics rather than copying them.

### Out of Scope
- Reimplementing or redefining the transition-authorized ledger, authority record, sealing primitive, evaluator, canary, promotion, certificate, receipt, recovery, replay, resume, or shadow-parity services owned by the shared substrate and mode `004-deep-improvement-common`.
- Implementing Agent Improvement proposal operators, AgentIR mutation execution, scoring execution, canary execution, promotion effects, or the predecessor event/reducer/sealed-artifact contracts.
- Flipping live authority, migrating arbitrary in-flight packets, closing a global rollback window, retiring legacy writers, or issuing the phase-014 authority-cutover certificate.
- Changing common evaluator thresholds, canary contents, promotion policy, convergence policy, or the 178-recommendation disposition; this phase binds their versions and consumes their evidence.
- Implementing the 010 per-mode fan-out or adding cross-mode behavior before phase 012 freezes shared contracts and emits the write-set conflict graph.
- Treating a terminal score, mutable report, process exit, or this readiness certificate as proof of universal Agent Improvement quality or as permission to bypass the transition gateway.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The Agent Improvement switch fails closed and preserves legacy authority | Absent, malformed, unknown, stale, mixed-version, wrong-mode, or gateway-failed input selects `legacy_authoritative`, emits typed refusal evidence, and causes no semantic append, projection change, effect, or authority change |
| REQ-002 | Rollback and restoration are externally authorized | The mode cannot authorize its own rollback, unquarantine, verifier replacement, or legacy restoration; each authority-sensitive request carries mode, policy, epoch, request digest, evidence digest, actor capability, reason, and decision identity |
| REQ-003 | The rollback window is bounded and auditable | The window remains open until both 14 calendar days and five successful authoritative executions complete, whichever is later; low traffic, unresolved parity, evaluator/canary drift, receipt gaps, unknown effects, or reconciliation uncertainty extend it |
| REQ-004 | Rollback is non-destructive and certificate-backed | Admission freezes, stale writers are fenced, in-flight work is classified, the legacy path resumes at a new epoch, no typed event or sealed artifact is deleted, and a rollback certificate records reconciliation and unknown states |
| REQ-005 | The independent gate requires Agent Improvement shadow parity | `006-shadow-parity` proves event and projection parity for AgentIR compilation, mutation lineage, proposal generation, raw evaluation, score derivation, canary, promotion, abort, restore, resume, duplicate delivery, and failure paths with zero unexplained semantic differences |
| REQ-006 | The gate requires complete sealed Agent Improvement evidence | AgentIR, change contract, improver lane, failure and causal inputs, candidate package, raw trajectory, evaluator epoch, canary exposure, transfer, and promotion references are current, dependency-closed, digest-valid, and readable through common verifiers |
| REQ-007 | Common evaluator, canary, and promotion services remain single-source | Agent Improvement consumes mode-004 lifecycle, hard-veto, receipt, certificate, evaluator-integrity, and rollback semantics through a namespaced adapter; no variant copy can weaken them |
| REQ-008 | Agent-specific behavior evidence is stronger than aggregate score | Critical invariants use repeated zero-tolerance evidence; broad families use paired lower bounds and uncertainty; clause, authority-conflict, act/refuse/clarify, side-effect, perturbation, untouched-family, and executor coverage remain addressable |
| REQ-009 | Uncertainty never becomes migration readiness | Missing, stale, contradictory, malformed, unsupported, `UNKNOWN`, `INCONCLUSIVE`, `INSUFFICIENT_EVIDENCE`, telemetry-gap, evaluator-integrity, canary-leak, or unknown-effect inputs produce `blocked`, `incomplete`, `not_ready`, or `rollback_required` |
| REQ-010 | The certificate is exact-SHA and evidence bound | The certificate names this mode, BASE, candidate SHA, shared contracts, write-set graph, event/reducer versions, AgentIR frontier, evaluator/canary epochs, fixture IDs, artifact and receipt digests, rollback anchor, window state, verifier, and dispositions |
| REQ-011 | The gate is independent of authority and hands off deterministically | Re-evaluating the same sealed frontier yields the same gate result and certificate body digest; `gate_passed` emits phase-014 readiness only, and certificates for another mode, frontier, epoch, or contract are rejected |
<!-- /ANCHOR:requirements -->

### Agent Improvement rollback and mode-gate acceptance contract

The switch is a policy adapter over shared authority primitives. Its safe default is `legacy_authoritative`. The admissible
states are `legacy_authoritative`, `shadowing`, `cutover_ready`, `new_authoritative_reversible`, `rollback_pending`,
`legacy_restored`, and `window_closed`. Invalid or absent state resolves to legacy authority plus a blocking refusal. The
mode may provide evidence and request recovery, but only the external transition gateway and independent verifier may
authorize an authority-sensitive transition.

The gate starts with the `006-shadow-parity` report and verifies agent-specific lineage and projection parity, the shared
sealed-artifact graph, certificate and receipt continuity, evaluator and canary epochs, replay fingerprints, resume
decisions, and rollback rehearsal. It compares raw per-case evaluator observations before normalized scores. It must keep
target-task reward, evaluator-integrity failure, critical behavior regression, canary veto, insufficient evidence, unknown
effect, transfer failure, and promotion decision as distinct facts. A score-only match is never sufficient.

| Gate input | Required evidence | Blocking disposition |
|------------|-------------------|----------------------|
| Shadow parity | `006-shadow-parity` report covering AgentIR, proposal lineage, raw trials, reducers, projections, canary, promotion, abort, restore, resume, duplicate, crash, and unknown-effect boundaries | `blocked` on missing, reordered, unauthorized, stale, nondeterministic, or unexplained semantic differences |
| Agent evidence | Dependency-closed AgentIR/change-contract/improver/failure/candidate/trajectory references with clause, authority, side-effect, perturbation, untouched-family, and executor coverage | `not_ready` on missing, tampered, leaked, stale, mixed-epoch, or incomplete evidence |
| Common services | Shared evaluator capsule and raw observations, normalization version, canary epoch, promotion decision, hard vetoes, receipts, and certificates consumed through the mode-004 adapter | `blocked` on private service semantics, weakened vetoes, score-only promotion, or evaluator/canary mismatch |
| Lifecycle and resume | Proposal, evaluation, scoring, canary, promotion, abort, restore, replay, checkpoint, changed-manifest, crash-before-receipt, duplicate, and unknown-effect fixtures | `incomplete` or `rollback_required` on unsafe reuse, lost identity, double effect, or unmapped state |
| Rollback readiness | External authorization, admission freeze, writer fencing, legacy-anchor restoration at a new epoch, retained evidence, and rehearsal report | `rollback_required` when any recovery step is unavailable or unproven |
| Handoff identity | Exact SHA, BASE, shared-contract digest, write-set graph digest, event/reducer versions, evaluator/canary epochs, mode identity, and verifier receipt | `blocked` on cross-mode, cross-frontier, stale, or mutable certificate inputs |

The emitted result is `gate_passed`, `gate_blocked`, `gate_incomplete`, or `rollback_required`. `gate_passed` means this
Agent Improvement migration has evidence ready for the phase-014 handoff. It does not mean live authority moved, that the
rollback window closed, that a candidate is universally correct, or that a legacy writer may be retired.

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The Agent Improvement switch is specified with deny-by-default behavior, external authorization, monotonic epochs, explicit trigger classes, fencing, and a non-destructive restoration path.
- **SC-002**: The rollback window inherits the 14-calendar-day and five-successful-authoritative-execution minimum, extends on low traffic or unresolved obligations, and has auditable opening, closure, and rollback evidence.
- **SC-003**: The independent gate is green only with Agent Improvement shadow parity, sealed AgentIR and trial evidence, complete certificates and receipts, deterministic replay, resume coverage, common-service reuse, and rollback rehearsal.
- **SC-004**: Missing, stale, contradictory, malformed, unsupported, unknown, evaluator-integrity, canary-leak, transfer-failure, or nondeterministic inputs fail closed and leave legacy authority selected.
- **SC-005**: Agent Improvement adds only its agent-loop evidence and gate predicates while consuming the deep-improvement-common evaluator, canary, promotion, certificate, receipt, fingerprint, veto, and recovery semantics unchanged.
- **SC-006**: The exact-SHA mode certificate is independently verifiable and hands phase-014 readiness without claiming authority cutover, rollback-window closure, or legacy-writer retirement.

**Given** a candidate AgentIR, its raw trajectories, evaluator observations, canary results, and promotion evidence, **When**
the mode gate verifies the run, **Then** it checks the complete sealed and receipt graph and refuses an aggregate-score or
mutable-report pass.

**Given** an authority-conflict regression, evaluator-integrity failure, canary leak, transfer mismatch, or unknown effect,
**When** the gate evaluates the evidence, **Then** it preserves the typed non-green disposition and cannot convert it into
readiness through a soft aggregate score.

**Given** the same sealed frontier and contract fingerprints are evaluated twice, **When** no semantic input changes,
**Then** the gate result and certificate body digest are identical.

**Given** a rollback trigger fires inside the reversible window, **When** the external gateway authorizes restoration,
**Then** admission freezes, stale writers are fenced, in-flight work is classified, legacy resumes at a new epoch, and all
typed evidence remains readable.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Aggregate-score false green** - Agent Improvement can increase visible task reward while regressing authority handling,
  side-effect discipline, refusal behavior, inheritance, or rare behavior families. Mitigation: retain raw trials, critical
  invariant vetoes, family-level lower bounds, semantic-equivalence variants, and untouched-family sentinels.
- **Self-referential evaluator drift** - The improver may exploit evaluator feedback or change the evaluated check set.
  Mitigation: freeze the evaluator capsule before proposal generation, bound proposer-visible feedback, rotate canary epochs,
  preserve evaluator-integrity oversight, and require common-service receipts.
- **Split-brain restoration** - A stale typed proposal, evaluation, or promotion writer may continue after rollback.
  Mitigation: freeze admission, fence writers, use stable effect identities and monotonic epochs, and route unknown effects
  through the shared recovery policy.
- **Causal overclaim** - A first-divergent trace or judge rationale can be mistaken for proof of mutation causality.
  Mitigation: require declared-locus interventions, repeated forward replay, ablation evidence, and an explicit uncertain
  disposition when attribution is unsupported.
- **Profile overgeneralization** - A candidate may improve one operational envelope but regress another executor or profile.
  Mitigation: keep profile-scoped frontiers, require cross-profile or routed-specialist evidence, and retain the legacy
  fallback when transfer is incomplete.
- **Variant service fork** - Agent Improvement could duplicate evaluator, canary, or promotion semantics and pass a weaker gate.
  Mitigation: use the mode-004 ownership matrix, shared fixtures, namespaced adapters, and one common certificate subject.
- **Dependencies**: Agent Improvement siblings `001-typed-ledger-schema` through `006-shadow-parity`; the
  `004-deep-improvement-common` evaluator/canary/promotion and rollback contract; phase 012 shared mode interfaces and
  write-set conflict graph; phase 014 readiness consumer; phase 014 authority-cutover contract; the 065/002 findings
  registries; existing Agent Improvement scripts and fixtures; and the spec-kit validator. Phase manifest `depends_on: []`
  remains the planning authority; implementation readiness is established by the parent handoff.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Which shared authority-record fields and transition token does the phase-014 consumer expose for the Agent Improvement
  switch without creating a mode-local authority source?
- What counts as a successful authoritative Agent Improvement execution for the five-run minimum when a candidate is
  profile-scoped, routed to a specialist, or returns typed abstention or incomplete evidence?
- Which agent-specific triggers require immediate rollback versus quarantine, evidence gathering, rollback-window extension,
  or a new evaluator/canary epoch?
- Which AgentIR, behavior-family, executor, and transfer references are mandatory in the mode certificate when a run is
  valid but not promotable?
- Which failure-derived evidence may be returned to the proposal generator as bounded redacted classes, and which remains
  hidden until terminal verification to prevent evaluator-surface extraction?
- What exact phase-014 acceptance endpoint consumes the Agent Improvement readiness certificate while preserving the later
  phase-014 authority-cutover boundary?

These questions are resolved against the frozen predecessor and common-service contracts before implementation. They do not
authorize a local authority toggle, shortened rollback window, second evaluator/canary/promotion primitive, mutable evidence
repair, variant-local gate semantics, or a claim that a Planned gate proves candidate quality.
<!-- /ANCHOR:questions -->
