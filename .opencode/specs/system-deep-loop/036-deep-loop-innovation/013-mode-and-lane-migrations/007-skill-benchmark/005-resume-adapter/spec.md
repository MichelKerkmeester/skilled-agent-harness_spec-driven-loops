---
title: "Feature Specification: Skill Benchmark - Resume Adapter"
description: "Plan the Skill Benchmark resume adapter over the sealed typed event ledger. The adapter rebuilds scenario-cell, skill-exposure, trajectory, and scoring state through reducers, maps the continuity ladder, and defines idempotent re-entry without double-apply, lost events, or unsafe replay. It consumes deep-improvement-common services and adds only Skill Benchmark scenario and scoring logic."
trigger_phrases:
  - "Skill Benchmark resume adapter"
  - "skill-benchmark sealed-ledger resume"
  - "idempotent skill benchmark re-entry"
  - "skill scenario scoring resume"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/007-skill-benchmark/005-resume-adapter"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/007-skill-benchmark/005-resume-adapter"
    last_updated_at: "2026-07-15T23:30:00Z"
    last_updated_by: "opencode"
    recent_action: "Bounded Skill Benchmark ledger-only resume and shared-service ownership"
    next_safe_action: "Define scenario-cell reducers and idempotent re-entry fixtures"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Skill Benchmark - Resume Adapter

> Phase adjacency under `007-skill-benchmark` (independent sibling planning contracts, not a runtime dependency): predecessor `004-certificates-and-receipts`; successor `006-shadow-parity`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/007-skill-benchmark/005-resume-adapter |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-15 |
| **Owner skill** | system-deep-loop (Skill Benchmark mode over the deep-improvement-common backbone) |
| **Origin** | Phase 013 mode-and-lane migration fan-out; Skill Benchmark resume-adapter planning contract |
| **Depends on** | `[]` as an independent sibling planning contract; implementation consumes frozen shared and preceding mode contracts |
| **Inputs** | Parent phase spec; manifest/phase-tree.json; findings-registry.json; findings-registry-modes.json; Skill Benchmark typed-ledger and reducer contracts |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Skill Benchmark runs paired skill treatments across scenario cells and records more than a terminal score. A run must preserve
the assignment arm, skill bundle and registry digests, executor and environment, discovery and loading stages, invocation,
trajectory milestones, outcome checks, gold integrity, raw scoring observations, and shared evaluator status. An interruption can
otherwise leave a partial projection that cannot distinguish unavailable content, failed retrieval, non-adoption, execution
failure, invalid gold, negative transfer, or a genuinely incomplete scenario.

The research requires skill availability to be measured separately from invocation and realized task lift
(`findings-registry-modes.json:2197-2285`), progressive disclosure stages to be evaluated independently
(`findings-registry-modes.json:2315-2327`), and immutable baseline snapshots and content-addressed effect evidence to survive
replay (`findings-registry-modes.json:2301-2348`). The shared runtime findings additionally require a resume planner that
folds a versioned replay fingerprint into per-operation reuse, re-execution, compensation, or rejection decisions
(`findings-registry.json:1389-1428`, `2640-2645`).

This phase plans a Skill Benchmark-specific Resume Adapter over the sealed typed event ledger. It rebuilds live scenario and
scoring state only through the reducers from `001-typed-ledger-schema` and `002-reducers-and-projections`, maps that state to
an explicit continuity ladder, and produces idempotent re-entry decisions. It builds on deep-improvement-common services from
mode 004 and adds only Skill Benchmark scenario-cell and scoring logic; it does not re-implement shared evaluator, canary,
promotion, receipt, budget, lock, continuity, or effect-recovery services.

The phase is planning only. The per-mode 010 migration lands after phase 012 freezes the shared contracts and emits the
write-set conflict graph. The six sibling concerns and the mode gate integrate the rest of Skill Benchmark.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- The sealed-ledger read boundary for Skill Benchmark resume, including finalized frontier selection, event-tail and seal
  validation, schema/upcaster compatibility, reducer identity, scoring-policy identity, and replay fingerprinting.
- A continuity-ladder mapping from run and treatment design through scenario setup, skill discovery/loading/invocation,
  trajectory and outcome evidence, gold integrity, scoring, shared status, and the next resumable frontier.
- Reducer-only reconstruction of scenario-cell lifecycle, paired treatment assignment, progressive exposure stages, trajectory
  milestones, outcome checks, raw observations, scoring state, and explicit incomplete or blocked states.
- Stable identity and idempotent re-entry rules for run, design cell, scenario cell, logical operation, event, receipt, and
  attempt identities, with changing attempts and stable logical effects.
- Skill Benchmark-specific action planning for reusable complete cells, missing work, unknown effects, changed treatment or
  bundle manifests, invalid evidence, contaminated or negative-transfer cells, and blocked compatibility states.
- Skill-specific scoring restoration for paired lift, availability versus invocation versus outcome mediation, constraint
  coverage, dynamic or executable gold, raw score axes, usage, latency, validity, calibration, and uncertainty.
- Consumption of deep-improvement-common evaluator, canary, promotion, receipt, budget, lock, continuity, compatibility, and
  effect-recovery contracts through versioned references; no duplicate shared implementation.
- Crash, duplicate, late-event, partial-ledger, changed-manifest, stage-permutation, score-policy-drift, gold-integrity, and
  unknown-effect fixtures that prove deterministic re-entry and preserve raw evidence.

### Out of Scope

- Defining or changing the typed event envelope and event vocabulary owned by `001-typed-ledger-schema`, or the generic reducer
  and projection boundary owned by `002-reducers-and-projections`.
- Re-implementing deep-improvement-common scenario execution, evaluator, canary, promotion, receipt, budget, lock, continuity,
  compatibility, or effect-recovery services; this phase consumes their contracts.
- Creating or sealing artifacts, issuing or expiring the Skill Contribution Certificate, shadow-parity instrumentation, or the
  independent rollback and mode gate; those belong to the adjacent Skill Benchmark concerns, including predecessor
  `004-certificates-and-receipts` and successor `006-shadow-parity`.
- Authority cutover, legacy-writer retirement, in-flight state migration, or phase-013 write-set execution.
- Calling executors, reading mutable skill directories or benchmark files, regenerating treatment assignments, rerunning scoring,
  or using current configuration as evidence during ledger reconstruction.
- Adding benchmark treatments or scenario content beyond the approved Skill Benchmark contract, or widening this child into the
  six sibling concerns and the mode gate.
- Authoring `description.json` or `graph-metadata.json`; deterministic tooling generates those files after this document set.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The sealed ledger is the sole source of resumable Skill Benchmark state | A resume fixture rebuilds run, treatment, scenario, exposure, trajectory, evidence, scoring, and status state from a sealed ledger and reducer versions without filesystem discovery, live executor inspection, mutable checkpoints, or process memory |
| REQ-002 | The continuity ladder covers every Skill Benchmark state layer | A mapping covers run identity, design and treatment assignment, scenario setup, skill path stages, trajectory/outcome evidence, gold integrity, scoring, shared status, and the next resumable frontier |
| REQ-003 | Resume compatibility is explicit and fingerprint-bound | Run, manifest, treatment, skill bundle, registry, executor, tool, permission, environment, gold, evaluator, schema, reducer, and scoring-policy drift selects exact, compatible, migrate, pin, or blocked behavior rather than silent reuse |
| REQ-004 | Reducer reconstruction is deterministic and non-emitting | The same sealed frontier and reducer identity produce byte-equivalent projections and fingerprints without external reads, effects, clocks, randomness, event mutation, or new evidence |
| REQ-005 | Logical identities remain stable across retries and restarts | Run, design cell, scenario cell, logical operation, event, and receipt identities remain stable; only authorized attempts change and retain their forensic history |
| REQ-006 | Re-entry is idempotent and conflict-safe | The same event or resume request key with the same content is a no-op returning the existing result; conflicting payload, frontier, manifest, or fingerprint fails closed or quarantines |
| REQ-007 | No event, branch success, or external effect is lost or silently replayed | Completed scenario-cell evidence remains reusable, late evidence stays append-only, and an effect without a durable receipt remains `UNKNOWN` under shared recovery policy |
| REQ-008 | Skill-specific scoring state is restored without score laundering | Paired treatment identity, availability/invocation/outcome mediation, trajectory and constraint coverage, raw scores, dynamic gold, validity, contamination, negative transfer, usage, latency, and uncertainty remain visible after resume |
| REQ-009 | Shared-service authority remains single-source | The adapter references mode-004 evaluator, canary, promotion, receipt, budget, lock, continuity, compatibility, and effect-recovery decisions and cannot clear a shared veto or emit shared authority |
| REQ-010 | The handoff supports later shadow parity and mode integration | The resume plan exposes deterministic source and output fingerprints, cell decisions, excluded reasons, and shared receipt references required by `006-shadow-parity` and the later mode gate |
| REQ-011 | Dark-mode boundaries remain intact | Resume and scoring projections affect only the typed shadow path before phase 017; legacy state, live control flow, and user-visible authority remain unchanged |
<!-- /ANCHOR:requirements -->

### Continuity-ladder mapping

| Ladder layer | Sealed-ledger inputs | Resume output |
|---------------|---------------------|---------------|
| Run identity | `runId`, manifest revision, design digest, lineage identity, authority epoch | Stable resume scope and immutable run key |
| Treatment design | Assignment seed, propensity, replicate, arm, skill bundle and distractor digests | Sealed scenario-cell membership; no regenerated assignment from current configuration |
| Scenario setup | Scenario identity, task/environment snapshot, executor descriptor, tool and permission fingerprints | Compatible scenario scope or explicit migrate/pin/block result |
| Skill path | Discovery, loading, invocation, resource exposure, canary and progressive-disclosure events | Per-stage availability, adoption, exposure, and missing-work state |
| Trajectory and outcome | Milestones, intermediate state digests, constraint observations, final outcome and artifact references | Rebuilt coverage, terminal status, unresolved evidence, and reusable raw evidence |
| Gold and scoring | Gold-policy and provenance events, deterministic checks, dynamic reference results, raw axes, normalization and score revisions | Skill-specific score state, paired contrast inputs, uncertainty, validity, and evidence sufficiency |
| Shared status | Common evaluator/canary/promotion stage, veto, receipt, budget, lock, and recovery status | Namespaced Skill Benchmark status without changing common authority |
| Terminal or blocked | Closed, withheld, expired, quarantined, compensated, rejected, or forked events | Stable terminal state or explicit new-lineage requirement |

### Idempotent re-entry contract

1. Validate the sealed ledger, finalized frontier, event-tail hash, schema/upcaster registry, reducer version, shared-service
   versions, treatment manifest, gold/evaluator fingerprints, and scoring-policy fingerprint before producing a plan.
2. Fold the validated event set using the shared canonical ordering and duplicate rules. An event with the same identity and
   content hash is an idempotent no-op; a conflicting identity or sequence is rejected or quarantined.
3. Derive a `SkillResumePlanKey` from run identity, treatment/design digest, sealed-ledger hash, finalized frontier, replay
   fingerprint, reducer version, and scoring-policy fingerprint. An exact duplicate returns its prior receipt and creates no attempt.
4. Plan each scenario cell independently. A complete compatible cell is reusable; missing compatible stages may re-enter under
   shared recovery policy; a changed bundle, treatment, gold recipe, or scoring epoch migrates, forks, or blocks explicitly.
5. Preserve discovery, loading, invocation, trajectory, and outcome distinctions. Forced activation cannot be treated as proof of
   autonomous retrieval or invocation, and an empty or pending gold set cannot enter a positive score numerator.
6. An effect that started without a committed receipt remains `UNKNOWN` until mode-004 recovery reconciles, compensates, retries
   with the stable key, or quarantines it. The adapter never treats a missing receipt as proof of non-execution.
7. The resulting receipt binds the plan key, source seal, projection hash, selected and excluded scenario cells, action reasons,
   score evidence references, and shared-service receipt references without making the shadow result authoritative.

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A sealed-ledger fixture reconstructs Skill Benchmark run, treatment, scenario, skill-path, trajectory, evidence,
  scoring, and status projections without mutable-file or live-executor reads.
- **SC-002**: The continuity ladder maps design, assignment, scenario, exposure, trajectory, outcome, gold, scoring, shared
  status, and resumable-frontier state with no missing or ambiguous layer.
- **SC-003**: Fresh replay and valid prefix reconstruction yield byte-identical projections, scenario-cell decisions, score
  evidence references, status, and fingerprints for the same sealed frontier.
- **SC-004**: Duplicate events and resume-plan keys are idempotent; conflicting payloads, changed manifests, and stale
  fingerprints fail closed without mutating prior evidence.
- **SC-005**: Completed branch-local scenario cells remain reusable while incomplete and unknown effects follow explicit recovery;
  no operation is double-applied or silently replayed.
- **SC-006**: Skill-specific scoring retains paired treatment, discovery/invocation mediation, trajectory and constraint
  coverage, dynamic gold, raw observations, validity, negative transfer, usage, latency, and uncertainty.
- **SC-007**: Skill Benchmark adds only scenario and scoring resume logic over deep-improvement-common and supplies deterministic
  inputs required by `006-shadow-parity` and the later mode gate.
- **SC-008**: Resume remains dark and non-authoritative until staged cutover, with no legacy behavior or user-visible authority change.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Treatment reconstruction drift** - Recreating assignment from current skill registries can move a scenario into another arm.
  Mitigation: seal assignment seed, propensity, replicate, bundle, registry, and design-cell digests and reject changed manifests.
- **Stage conflation** - Forced activation or successful loading can be mistaken for retrieval, invocation, or task efficacy.
  Mitigation: reduce discovery, loading, invocation, trajectory, and outcome events separately and preserve stage-specific decisions.
- **Unknown external effect** - An executor may run after dispatch and before its result receipt is committed. Mitigation: retain
  `UNKNOWN` and route through mode-004 effect recovery instead of automatic duplicate execution.
- **Lost branch-local evidence** - Replaying only an interrupted scenario can discard completed paired cells or control arms.
  Mitigation: fold all sealed scenario-cell receipts before selecting eligible re-entry work.
- **Score laundering** - Recomputing paired lift from incomplete, contaminated, invalid, or pending-gold cells can erase uncertainty.
  Mitigation: retain raw observations and explicit gold, validity, abstention, contamination, and underpowered states.
- **Shared-service fork** - A Skill Benchmark adapter could copy evaluator, canary, promotion, or receipt semantics. Mitigation:
  keep mode-004 ownership explicit and test that local projections cannot clear common vetoes or write shared state.
- **Authority leakage** - A successful shadow resume or score may alter legacy execution before cutover. Mitigation: keep all
  decisions non-authoritative and route any authority transition to phase 017.
- **Dependencies**: the phase-006 transition-authorized ledger; phase-012 shared event contracts; Skill Benchmark
  `001-typed-ledger-schema` and `002-reducers-and-projections`; deep-improvement-common mode-004 services; phase-015 shared
  mode contracts and write-set conflict graph; predecessor `004-certificates-and-receipts`; successor `006-shadow-parity`; and
  the spec-kit validator. These are contract inputs for planning, not a hard runtime dependency implied by sibling adjacency.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

Deferred to the owning shared contract or implementation phase:

- Which sealed-ledger fields are the canonical finalized frontier, per-stream high-watermarks, and event-tail hash for a Skill
  Benchmark scenario run?
- Which changes to a skill bundle, registry, resource digest, executor, environment, gold recipe, or scoring policy require a
  new design epoch, explicit migration, pinning, or rejection?
- Which scenario execution paths support receipt lookup or idempotency keys, and which remain blocked when an effect is `UNKNOWN`?
- Which trajectory milestones are required for a scenario to be resumable, and which are diagnostic-only evidence?
- Does the shared receipt service own `SkillResumePlanKey`, or does Skill Benchmark add only a namespaced scenario-cell payload and
  a reference to the common receipt?
- Which score and attribution fields are restored by this adapter for shadow parity, and which are owned by the later certificate
  and mode-gate children?
<!-- /ANCHOR:questions -->
