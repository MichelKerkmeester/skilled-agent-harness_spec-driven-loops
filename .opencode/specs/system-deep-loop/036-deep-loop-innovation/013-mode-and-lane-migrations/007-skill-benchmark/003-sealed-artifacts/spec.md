---
title: "Feature Specification: Skill Benchmark - Sealed Reference Artifacts"
description: "Plan the sealed reference artifacts for the Skill Benchmark migration: immutable treatment designs, skill bundles, task and gold manifests, scenario assignments, exposure evidence, scoring observations, and contribution-certificate inputs over the deep-improvement-common backbone. The phase consumes the shared phase-007 sealing primitives and common evaluator, canary, replay, budget, and read-verification services without introducing a second sealing scheme."
trigger_phrases:
  - "Skill Benchmark sealed reference artifacts"
  - "skill benchmark artifact sealing"
  - "skill contribution evidence artifacts"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/007-skill-benchmark/003-sealed-artifacts"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/007-skill-benchmark/003-sealed-artifacts"
    last_updated_at: "2026-07-15T21:30:00Z"
    last_updated_by: "opencode"
    recent_action: "Scoped skill-specific seals to shared primitives and common evaluator services"
    next_safe_action: "Freeze scenario bundle gold and exposure artifact digests"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Skill Benchmark - Sealed Reference Artifacts

> Phase adjacency under the 007-skill-benchmark parent (grouping order, not a runtime dependency): predecessor `002-reducers-and-projections`; successor `004-certificates-and-receipts`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/007-skill-benchmark/003-sealed-artifacts |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-15 |
| **Owner skill** | system-deep-loop / deep-improvement-common / skill-benchmark |
| **Origin** | Phase 013 skill-benchmark migration; sealed-artifact concern after reducers and before certificates |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Skill Benchmark compares a packaged skill intervention with no-skill, automatic-routing, forced-activation, placebo or
distractor, and component-ablation controls. A terminal score cannot prove what was actually evaluated: the skill bundle,
task and gold recipe, executor, registry, tools, permissions, dependencies, exposure path, and evaluator may all change while
the benchmark name remains constant. The research therefore requires paired within-task and within-executor contrasts,
separate discovery/loading/invocation/trajectory/outcome evidence, resource-specific canaries, constraint coverage, and a
versioned effect certificate with a validity domain.

This phase plans the Skill Benchmark specialization of the sealed reference-artifact contract. It consumes the phase-007
sealing primitives and the deep-improvement-common services from mode 004: evaluator capsules, canary epochs, replay
fingerprints, budgets, common read verification, and promotion-input boundaries are shared services, not mode-local
reimplementations. Skill Benchmark adds only the scenario-design, treatment-assignment, skill-resource, exposure, gold,
causal-scoring, compatibility, and validity references needed to reproduce skill contribution evidence.

### Purpose

Define immutable, content-addressed, seal-on-write inputs and outputs for Skill Benchmark scenario runs and scoring. A valid
read must prove the artifact digest, schema, ordered dependency closure, common evaluator epoch, skill and environment
compatibility, gold-integrity policy, and canary freshness before a reducer or certificate service can use it. The phase is
planning only: it does not implement reducers, attribution estimators, contribution-certificate materialization, authority
cutover, or a private sealing protocol.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- One Skill Benchmark adapter over the existing phase-007 sealing primitives. It reuses shared canonicalization, digest,
  dependency-closure, seal-on-write, publication, and tamper-evident read behavior rather than defining another hash,
  signature, manifest, chain, or storage path.
- A sealed benchmark-design reference for the randomized treatment lattice: no-skill, full-skill, auto-route,
  forced-activation, placebo or distractor, `SKILL.md`-only, references-ablated, scripts-ablated, and
  compatibility-boundary cells, including seed, replicate, blocking factors, and assignment policy.
- A sealed skill-bundle and resource-closure reference covering skill files, resource classes, permissions, dependency and
  compatibility metadata, registry snapshot, package manifest, and the bundle digest used by every assigned cell.
- A sealed scenario and gold manifest covering task recipe, expected constraints, deterministic final-state checks, dynamic
  reference functions, milestone diagnostics, negative controls, `goldPolicy`, gold provenance, and mutation-sensitivity
  expectations. Empty, pending, and structural-only gold remain explicit non-positive states.
- Sealed run-assignment and workload references binding treatment arm, paired replicate, task, executor descriptor,
  environment, model/runtime, tool and permission surface, dependency versions, registry size, composition depth, seed,
  and common evaluator epoch.
- Sealed exposure and causal-path observations for discovery, progressive loading, invocation, resource canaries, key-point
  coverage and order, intermediate milestones, final artifacts, cost, latency, tokens, and controlled security probes.
- Sealed raw scoring inputs and effect-certificate inputs consumed by the reducer and successor certificate phase, including
  paired deltas, confidence-interval references, component ablations, compatibility slices, negative transfer, cost/security
  deltas, validity domain, and expiry triggers.
- A tamper-evident read path that verifies content bytes, digest, schema, dependency closure, common evaluator and canary
  epoch, assignment identity, gold integrity, visibility boundary, and lifecycle before returning a usable reference.
- Replay, mutation, truncation, missing-dependency, stale-epoch, changed-gold, leaked-canary, incompatible-environment,
  composition-risk, and mixed-version fixtures that demonstrate reproducible reads and typed fail-closed refusal.

### Out of Scope

- A new digest, signature, hash chain, canonicalization, seal publication, storage, or verification algorithm outside the
  phase-007 sealing primitives.
- Reimplementation of deep-improvement-common evaluator capsules, canary lifecycle, replay fingerprints, budgets, locks,
  receipts, effect recovery, promotion inputs, or shared read-verification services.
- The typed event envelope, transition authorization, reducers, projections, attribution estimator implementation, ranking,
  or gauge materialization owned by the preceding and next sibling contracts.
- Final `Skill Contribution Certificate` materialization, issued/withheld/expired decision authority, or the successor's
  certificate and receipt binding.
- New task content, executor providers, skill-loader behavior, live authority cutover, legacy-writer retirement, or changes
  to the packet-033 behavior harness beyond the references needed to reproduce its scenario inputs.
- Treating a signed or intact skill bundle as evidence of causal efficacy; integrity and skill contribution remain separate
  evidence planes.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every Skill Benchmark artifact uses the shared phase-007 sealing adapter | The artifact registry names one adapter and rejects a mode-local digest, seal, manifest, chain, storage, or verification path |
| REQ-002 | Artifact identity is content-addressed and dependency-closed | Canonical bytes, artifact kind, schema version, and ordered dependency digests define identity; changing any bundle, task, gold, evaluator, executor, environment, tool, permission, registry, or workload dependency creates a new reference |
| REQ-003 | Seal-on-write is atomic and immutable | A writer validates, canonicalizes, seals, publishes, and read-verifies before making a reference visible; interrupted writes are unusable and existing sealed bytes cannot be overwritten |
| REQ-004 | Reads are tamper-evident and fail closed | Digest, schema, dependency, lifecycle, common epoch, gold policy, visibility, and compatibility mismatches return typed refusal rather than stale, partial, or guessed content |
| REQ-005 | Treatment designs and paired assignments are reproducible | The design, seed, replicate, propensity or assignment rule, blocking factors, treatment arm, and paired task/executor identity are sealed before scenario execution |
| REQ-006 | Skill and scenario inputs are immutable evaluation interventions | Bundle resources, registry snapshot, task recipe, workload profile, dependency compatibility, deterministic checks, dynamic references, and negative controls resolve through sealed references |
| REQ-007 | Exposure evidence separates causal stages | Discovery, progressive loading, invocation, resource-canary exposure, trajectory milestones, final outcome, cost, and security observations are independently addressable raw facts |
| REQ-008 | Gold integrity gates positive scoring | `scored`, `negative`, `structural-only`, and `pending` gold states are typed; empty or pending required gold blocks positive scoring, excludes non-scored rows from numerators, and records provenance plus mutation sensitivity |
| REQ-009 | Raw scoring evidence survives later reduction | Deterministic checks, dynamic reference outputs, raw score axes, constraint coverage, evaluator identity, usage, latency, cost, and environment remain immutable while new reductions create new derived references |
| REQ-010 | Validity is conditional and certificate-ready | Evidence binds bundle, gold, evaluator, executor, registry, tool, permission, dependency, workload, and environment digests and carries compatibility slices, negative transfer, confidence-interval references, cost/security deltas, and expiry triggers |
| REQ-011 | Shared services remain the single source for the mode | Skill Benchmark consumes common evaluator, canary, replay, budget, receipt, and read-failure contracts and adds only scenario and scoring observation semantics |
| REQ-012 | Candidate and evaluator visibility boundaries are enforced | Hidden gold, exact canary content, evaluator internals, terminal evidence, and mutable service state remain withheld; leakage or unauthorized access creates a non-overridable veto reference |

### Skill Benchmark sealed reference artifact contract

| Artifact | Sealed inputs and dependencies | Immutable evidence carried | Primary consumers |
|----------|-------------------------------|----------------------------|-------------------|
| `benchmark_design` | Treatment lattice, randomization, seed, replicate plan, blocking factors, registry and workload digests | Design-cell identity and assignment policy | Assignment reducer and replay verifier |
| `skill_bundle_snapshot` | Skill tree, resource manifest, permissions, dependency compatibility, registry snapshot | Bundle digest, per-resource digests, resource classes, visibility commitments | Scenario runner, exposure verifier, certificate input |
| `scenario_gold_manifest` | Task recipe, constraints, final checks, dynamic references, negative controls, gold provenance | Gold policy, expected coverage, oracle commitments, mutation-sensitivity fixture | Gold-integrity gate and scoring reducer |
| `run_assignment` | Design cell, paired task, executor, environment, tools, permissions, dependency versions, evaluator epoch | Stable scenario assignment and workload envelope | Runner, replay adapter, raw observation writer |
| `exposure_observation` | Assignment, bundle, resource canaries, loader and trace references | Discovery, loading, invocation, canary, milestone, and access evidence | Causal-path reducer and leak verifier |
| `causal_score_observation` | Assignment, gold, evaluator capsule, raw outputs, dynamic references, security probes | Final checks, raw axes, constraint coverage, usage, cost, latency, compatibility, and risk observations | Reducers and effect-certificate input builder |
| `effect_certificate_input` | Paired evidence set, ablations, common promotion inputs, validity and expiry policy | Digest-bound confidence intervals, negative-transfer cases, compatibility envelope, and withheld evidence | `004-certificates-and-receipts` |

Every artifact has a closed required-field set and a registered extension map. The artifact reference is the only portable
handle passed across service boundaries; consumers must re-read through the shared verifier before dereferencing bytes.
Operational timestamps and access traces remain audit evidence unless the phase-007 primitive declares them part of content
identity. A changed evaluator, gold recipe, bundle, dependency, workload, or environment creates a new artifact or expires a
derived certificate input; it never mutates an earlier sealed reference.
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: One phase-007-backed adapter produces deterministic, dependency-closed references for benchmark design, skill
  bundle, scenario/gold, assignment, exposure, scoring, and certificate-input artifacts without a parallel sealing scheme.
- **SC-002**: A valid paired treatment cell reproduces the same task, skill, executor, environment, evaluator, gold, tool,
  permission, dependency, workload, seed, and registry inputs from sealed references.
- **SC-003**: Tampered bytes, missing dependencies, truncation, unsupported schemas, stale evaluator or canary epochs,
  changed gold, incompatible dependencies, leaked hidden material, and unsafe composition fail closed through typed reads.
- **SC-004**: Raw exposure, trajectory, final-state, scoring, cost, and security observations remain addressable after reducer,
  attribution, normalization, or evaluator-policy changes without mutation or silent reinterpretation.
- **SC-005**: The gold-integrity gate prevents empty, pending, or structural-only gold from producing positive scored evidence and
  proves that a meaningful gold mutation changes the score or blocks it.
- **SC-006**: The sealed evidence set supports off/auto/forced/placebo and component-ablation contrasts, registry and
  composition diagnostics, and a validity-bounded Skill Contribution Certificate input without executor-confounded claims.
- **SC-007**: The common deep-improvement services and successor certificate phase consume the same seal, read-failure,
  evaluator, canary, replay, budget, and evidence-reference contracts; strict phase validation passes.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Second sealing scheme** - A skill-local digest or manifest would make an intact bundle incomparable with common
  evaluator and certificate evidence. Mitigation: route every artifact through the phase-007 adapter and add a contract test
  that rejects alternate seal metadata.
- **Incomplete dependency closure** - Omitting gold, evaluator, registry, environment, tool, permission, or workload inputs
  permits a changed experiment to inherit old evidence. Mitigation: require an explicit ordered dependency manifest and
  verify every referenced digest before read acceptance.
- **Treatment confounding** - Forced or oracle-injected use can look like deployable skill value. Mitigation: seal paired
  off/auto/forced/placebo and ablation cells, preserve assignment metadata, and keep router-contract results separate from
  skill-lift verdict inputs.
- **Inert or contaminated gold** - Empty expected sets, stale dynamic references, or exposed canaries can manufacture a green
  score. Mitigation: enforce typed gold policy, provenance, mutation sensitivity, hidden commitments, and leak vetoes before
  positive scoring.
- **Common-backbone duplication** - A mode-specific evaluator, canary, receipt, or replay implementation could drift from mode
  004. Mitigation: use common artifact kinds and adapters, compare shared fixtures, and keep variant logic limited to scenario
  and scoring observations.
- **Portability overclaim** - A single executor or environment can make an artifact look generally effective. Mitigation:
  bind validity to task, executor, runtime, dependency, workload, and compatibility slices; require the successor certificate
  phase to withhold portable claims when contrasts are confounded.
- **Composition and security blind spots** - Isolated skill success can hide capability-flow or authorization-confusion risks.
  Mitigation: seal composition-depth, hard-negative, permission, and controlled-security treatment cells with independent
  observations.
- **Dependencies**: `002-reducers-and-projections` for artifact references and projections; shared phase-007 sealing
  primitives; deep-improvement-common mode 004 for evaluator, canary, replay, budget, receipt, and read services;
  `004-certificates-and-receipts` for certificate binding; phase 012 shared mode contracts and write-set conflict graph; the
  existing benchmark harness and skill scenario fixtures; and the spec-kit validator.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

Deferred to execution against the frozen reducer, common-service, and phase-007 sealing contracts:

- Which phase-007 seal metadata is inside each artifact digest, and which access or storage fields remain external audit
  evidence while still being tamper-evident?
- Which canonical treatment-arm labels and design-cell identifiers are shared with the typed event vocabulary, and which are
  only artifact metadata consumed by reducers?
- Which trajectory milestones are diagnostic evidence versus required process constraints for each scenario family, and how is
  a valid alternative trajectory represented without weakening final-state authority?
- Which dynamic reference functions, resource canaries, and security probes are hidden commitments versus candidate-visible
  redacted references during an active run?
- Which compatibility or workload change expires a contribution-certificate input immediately, and which can produce a new
  conditional validity slice without invalidating historical raw evidence?
- Which shared read-verification failures are retryable, quarantining, or transition-blocking, and how does the successor bind
  those states into issued, withheld, and expired certificate events?
<!-- /ANCHOR:questions -->
