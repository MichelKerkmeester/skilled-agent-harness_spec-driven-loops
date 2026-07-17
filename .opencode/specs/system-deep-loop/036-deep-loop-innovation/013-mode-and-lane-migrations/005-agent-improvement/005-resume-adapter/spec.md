---
title: "Feature Specification: Agent Improvement - Resume Adapter"
description: "Plan the Agent Improvement resume adapter over the sealed typed event ledger: rebuild agent-loop proposal and scoring state through deterministic reducers, map it onto the continuity ladder, and re-enter idempotently without double-applying events, losing branch evidence, or replaying uncertain effects. Reuse the deep-improvement-common resume, evaluator, canary, certificate, and promotion services."
trigger_phrases:
  - "agent improvement resume adapter"
  - "agent improvement ledger resume"
  - "agent loop idempotent re-entry"
  - "AgentIR continuity ladder"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/005-agent-improvement/005-resume-adapter"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/005-agent-improvement/005-resume-adapter"
    last_updated_at: "2026-07-15T21:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Bound resume scope to ledger-only reducer reconstruction and common-service reuse"
    next_safe_action: "Define AgentIR continuity levels and idempotent re-entry fixtures"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Agent Improvement - Resume Adapter

> Child adjacency under `005-agent-improvement` (independent planning contracts, not runtime dependencies): predecessor `004-certificates-and-receipts`; successor `006-shadow-parity`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/005-agent-improvement/005-resume-adapter |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-15 |
| **Owner skill** | system-deep-loop (agent-improvement mode) |
| **Origin** | Phase 008 of the Agent Improvement migration under phase 013 |
| **Inputs** | 065 parent spec; phase-tree manifest; 065/002 findings registries; Agent Improvement siblings `001-typed-ledger-schema`, `002-reducers-and-projections`, `003-sealed-artifacts`; deep-improvement-common `004-certificates-and-receipts` and `005-resume-adapter` |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Agent Improvement runs a proposal-and-scoring loop over a typed AgentIR: failures are localized to components or clauses,
candidate changes are generated, behavior families are exercised, evaluator observations are reduced, and a candidate may
continue toward canary or guarded promotion. An interruption can occur after any of those steps. Process memory, a latest
checkpoint, or the current agent package is not sufficient to tell whether a proposal was already applied, which branch
trials completed, which evaluator epoch was used, or whether an external effect started without a durable receipt.

The parent program requires resume to reconstruct live state solely from the sealed append-only ledger through deterministic
reducers. The deep-improvement-common resume adapter already owns the shared ledger read boundary, replay fingerprint,
continuity ladder, receipt semantics, evaluator/canary/promotion recovery policy, and `reuse`/`reexecute`/`compensate`/`reject`
decision algebra. This phase specializes that contract for Agent Improvement: AgentIR component lineage, inherited clauses,
failure-gradient references, behavior-family coverage, profile-scoped candidate frontiers, causal experiments, and redacted
proposal views must survive interruption without copying common services or making a variant projection authoritative.

The result is an idempotent re-entry contract. Replaying the same sealed range and resume request must return the same
re-entry receipt and projection fingerprint; a duplicate request must not apply an event or external effect twice; a changed
manifest, evaluator epoch, reducer identity, or artifact closure must create an explicit fork, re-execution, quarantine, or
rejection decision rather than silently inheriting prior success.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The Agent Improvement adapter over the deep-improvement-common sealed-ledger read and resume interfaces, including event-range selection, upcaster compatibility, reducer identity, and replay-fingerprint inputs.
- Variant reducer composition that rebuilds AgentIR lineage, change-contract state, candidate proposals, first-divergent trace evidence, failure gradients, behavior-family coverage, profile frontiers, evaluator observations, score revisions, canary status, promotion status, and unresolved evidence.
- A continuity-ladder mapping for run identity, AgentIR/change contract, candidate generation, behavior experiment, evaluation, scoring, canary, guarded promotion, and terminal or blocked state.
- Stable resume-request identity, payload and fingerprint matching, duplicate-delivery handling, event application guards, logical candidate/effect identity, attempt identity, and branch-local success preservation.
- Agent Improvement re-entry decisions for compatible reuse, missing-work re-execution, effect recovery or compensation, explicit new lineage, quarantine, and rejection; unknown external effects remain `UNKNOWN` until the common recovery policy resolves them.
- Redacted candidate-facing state and observability of resume decisions without exposing hidden evaluator fixtures, exact terminal evidence, mutable current configuration, or common-service internals.
- Crash, duplicate, late-event, missing-receipt, changed-manifest, schema-drift, evaluator-epoch, partial-branch, mixed-version, and replay-parity fixtures.

### Out of Scope
- Reimplementing the deep-improvement-common resume adapter, evaluator, canary, certificate, receipt, promotion, effect-recovery, sealing, or replay-fingerprint primitives.
- Defining Agent Improvement event names, the canonical envelope, append-only storage, transition authorization, or the pure reducers and projections owned by `001-typed-ledger-schema` and `002-reducers-and-projections`; this phase consumes and composes them.
- Materializing the Agent Improvement behavioral transfer certificate or promotion receipt owned by `004-certificates-and-receipts`.
- Implementing Agent Improvement shadow parity, rollback switch, mode gate, authority cutover, legacy-writer retirement, production code, or the other sibling concerns.
- Regenerating proposals from current files, current prompts, current evaluator assets, or current process memory when the sealed manifest is absent or changed; that is a new lineage or an explicit fail-closed outcome.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Resume rebuilds Agent Improvement state from the sealed ledger only | The same validated event range, upcaster registry, reducer set, sealed references, and replay fingerprint produce byte-equivalent variant state without mutable checkpoints, current AgentIR files, clocks, randomness, network, or evaluator reads |
| REQ-002 | The variant continuity ladder is complete and explicit | Every supported Agent Improvement in-flight state maps to sealed evidence, reducer projection, next action, and a reason code; unmapped or ambiguous state returns `REJECT` or `QUARANTINE` |
| REQ-003 | AgentIR and candidate lineage survive re-entry | Base and candidate AgentIR digests, component/locus IDs, inherited clauses, parent candidates, operator IDs, failure gradients, first-divergent trace references, profile scope, and branch identities remain addressable after resume |
| REQ-004 | Re-entry is idempotent by request and logical operation identity | An exact duplicate resume request returns its existing receipt and applies no new transition; key reuse with a changed payload, manifest, or fingerprint fails closed; attempt IDs may change without changing logical candidate or effect identity |
| REQ-005 | Branch-local evidence and uncertain effects are preserved | Completed candidate, behavior-family, and evaluator branches remain reusable; started-without-receipt effects remain `UNKNOWN` and route through the common recovery policy rather than automatic retry |
| REQ-006 | Manifest and contract drift are explicit | Changed AgentIR, change contract, evaluator capsule, fixture epoch, executor, tool schema, reducer, upcaster, or topology resolves to a compatible reuse, new score revision, re-execution, fork, quarantine, or rejection; it never inherits success by label alone |
| REQ-007 | Deep-improvement-common remains the single service owner | Evaluator, canary, certificate, receipt, promotion, redaction, and effect-recovery fields and transitions are referenced from common contracts; Agent Improvement adds only namespaced resume inputs and projections |
| REQ-008 | Resume cannot turn score into promotion authority | Critical behavior-family failures, insufficient evidence, stale artifacts, evaluator leakage, canary vetoes, rollback ambiguity, and unknown effects remain visible vetoes; resume changes only the dark path before phase 017 |
| REQ-009 | Replay and checkpoint optimization are equivalent to full fold | A validated checkpoint plus remaining ledger range produces the same AgentIR frontier, coverage, status, receipts, and projection fingerprint as a clean full replay; incompatible checkpoints refuse safely |
<!-- /ANCHOR:requirements -->

### Agent Improvement continuity-ladder contract

The adapter derives each row from immutable typed events and common-service receipts. The ladder is not a second source of
truth and never writes replayed domain events while rebuilding state.

| Ladder level | Sealed evidence | Variant reducer projection | Re-entry rule |
|--------------|-----------------|----------------------------|---------------|
| Run and lineage identity | Run-start, lineage, manifest, base AgentIR, evaluator epoch, and replay-fingerprint references | Run identity, lineage identity, base closure, and compatibility status | Reuse only on exact compatible manifest and fingerprint; otherwise fork or reject explicitly |
| AgentIR and change contract | Definition snapshot, inheritance graph, component loci, typed patch operations, intended/preserved obligations, and parent candidate | Base/candidate AgentIR lineage, changed loci, inherited obligations, and behavioral change class | Reuse sealed definitions; never rebuild from current files; a missing closure blocks proposal re-entry |
| Candidate generation | Proposal request, failure cluster, first-divergent trace, operator identity, candidate artifact, and generation receipt | Candidate frontier, parentage, mutation lineage, profile scope, and artifact status | Reuse verified candidates; reexecute only missing compatible generation work under the same logical identity |
| Behavior experiment | Experiment manifest, defect injection, intervention, scenario family, seed, executor, trace, and receipt predicates | Family coverage, causal evidence, first divergence, attribution uncertainty, and branch completion | Reuse complete trials; reexecute missing compatible cells; preserve failed and insufficient evidence states |
| Evaluation and scoring | Evaluator capsule, fixture epoch, raw observations, normalization, calibration, aggregation, and score receipts | Raw trial index, score revisions, uncertainty, evidence sufficiency, and policy compatibility | Reuse only matching evaluator inputs; create a new score revision after policy drift without deleting prior observations |
| Canary and promotion | Canary epoch, candidate alias, leak/veto receipts, evidence lattice, promotion request, and effect receipt | Canary health, vetoes, guarded decision, rollback target, and applied/uncertain state | Reuse recorded decisions; unresolved effects remain `UNKNOWN` and require common effect recovery |
| Terminal or blocked | Promote, reject, quarantine, abort, compensate, fork, or explicit blocked event | Stable terminal status and reason code | Same request is a no-op; a new outcome requires a new lineage or an authorized transition |

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Rebuilding a captured Agent Improvement ledger range twice produces identical AgentIR lineage, candidate frontier, behavior coverage, service status, receipt references, and resume fingerprint.
- **SC-002**: A crash and duplicate corpus proves no event, candidate transition, score application, or external effect is double-applied, lost, or replayed; completed sibling branches remain reusable.
- **SC-003**: The adapter distinguishes compatible reuse, missing-work re-execution, new lineage, compensation, quarantine, and rejection while preserving `UNKNOWN` for incomplete effects.
- **SC-004**: AgentIR component lineage, inherited clauses, failure gradients, behavior-family evidence, evaluator epoch, and profile scope remain available without reading mutable agent or evaluator state.
- **SC-005**: Changed manifests, reducer or upcaster drift, stale sealed artifacts, evaluator/canary mismatch, hidden-evidence leakage, and incompatible checkpoints fail closed without mutating prior evidence.
- **SC-006**: Agent Improvement consumes the common evaluator, canary, certificate, receipt, redaction, promotion, and effect-recovery contracts without semantic forks.
- **SC-007**: Resume remains additive, dark, and non-authoritative; no re-entry decision changes legacy state or authorizes production promotion before phase 017.

**Given** an interrupted Agent Improvement run, **When** the adapter folds its sealed event range, **Then** it reconstructs the
same AgentIR and behavior-evidence frontier without consulting process memory or regenerating a candidate.

**Given** an exact duplicate resume request, **When** its request key and replay fingerprint match the prior request, **Then**
the adapter returns the existing re-entry receipt and performs no second logical apply or side effect.

**Given** a candidate effect started without a durable receipt, **When** resume reaches that operation, **Then** the projection
remains `UNKNOWN` and delegates to the common effect policy rather than treating process exit as success.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **AgentIR closure drift** - A missing inherited clause, tool policy, executor, or parent digest can make a resumed candidate behaviorally different. Mitigation: require dependency-closed sealed references before re-entry.
- **Candidate lineage collapse** - Rebuilding only the incumbent or latest score can discard complementary candidates and the first divergent trace. Mitigation: fold immutable branch and component identities before deriving frontiers.
- **Duplicate proposal or effect** - A retry can create a second candidate or external evaluation invocation. Mitigation: stable logical operation and idempotency keys, separate attempt IDs, and common receipt guards.
- **Unknown effect mistaken for success** - A crash after dispatch but before receipt can corrupt promotion state. Mitigation: preserve `UNKNOWN` and apply the common query, retry-with-key, compensation, or quarantine policy.
- **Evaluator leakage during resume** - A candidate-facing read can expose hidden fixture or terminal evidence. Mitigation: use the common redacted projection and record visibility violations as blocking evidence.
- **Score-only recovery** - A resumed aggregate can hide family regression or insufficient evidence. Mitigation: restore raw observations, family coverage, vetoes, evaluator epoch, and score-policy identity separately.
- **Authority creep** - A successful shadow re-entry could mutate the live legacy path. Mitigation: assert zero authority writes and leave cutover to phase 017.
- **Dependencies**: Agent Improvement siblings `001-typed-ledger-schema`, `002-reducers-and-projections`, and `003-sealed-artifacts`; deep-improvement-common `004-certificates-and-receipts` and `005-resume-adapter`; phase 012 shared mode contracts and write-set conflict graph; phase 012 ledger contracts; and the spec-kit validator. The child keeps `depends_on: []` as an independent planning contract.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

Deferred to execution against the frozen Agent Improvement and common-service contracts:

- Which AgentIR component, inheritance, and behavior-family fields must be materialized in the resume projection versus retained as content-addressed references?
- Which event frontier and checkpoint boundaries preserve partial candidate and behavior-experiment work without allowing a stale checkpoint to become authoritative?
- Which evaluator, canary, and promotion operations are queryable by idempotency key, and which must always remain `UNKNOWN` until an external recovery decision exists?
- Which changed-manifest cases are safe compatible reuse, which require a new score revision, and which require a new candidate lineage or quarantine?
- Which redacted resume fields are safe for proposal generation while keeping hidden fixture contents, exact promotion evidence, and terminal-only rationale unavailable?
<!-- /ANCHOR:questions -->
