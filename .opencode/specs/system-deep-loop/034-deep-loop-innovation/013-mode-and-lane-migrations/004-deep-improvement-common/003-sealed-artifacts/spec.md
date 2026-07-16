---
title: "Feature Specification: Deep Improvement Common Services - Sealed Reference Artifacts"
description: "Plan the sealed reference artifacts for the shared deep-improvement backbone: evaluator-first iteration, candidate generation, scoring, canary analysis, and guarded promotion. The phase composes the existing phase-006 sealing primitives into content-addressed, seal-on-write, tamper-evident inputs and outputs that the shared evaluator, canary, and promotion services can reproduce and that agent-improvement, model-benchmark, and skill-benchmark consume unchanged."
trigger_phrases:
  - "deep improvement sealed reference artifacts"
  - "deep improvement common services sealing"
  - "content addressed evaluator capsule"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/034-deep-loop-innovation/013-mode-and-lane-migrations/004-deep-improvement-common/003-sealed-artifacts"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/034-deep-loop-innovation/013-mode-and-lane-migrations/004-deep-improvement-common/003-sealed-artifacts"
    last_updated_at: "2026-07-15T20:45:00Z"
    last_updated_by: "opencode"
    recent_action: "Bounded sealed artifacts to shared evaluator, canary, and promotion inputs"
    next_safe_action: "Freeze artifact fields and dependency digests against the reducer contract"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Deep Improvement Common Services - Sealed Reference Artifacts

> Phase adjacency under `004-deep-improvement-common` (grouping order, not a runtime dependency): predecessor `002-reducers-and-projections`; successor `004-certificates-and-receipts`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/034-deep-loop-innovation/013-mode-and-lane-migrations/004-deep-improvement-common/003-sealed-artifacts |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-15 |
| **Owner skill** | system-deep-loop (deep-improvement common services) |
| **Origin** | Phase 006 of the deep-improvement common-services migration under phase 013 |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The shared deep-improvement backbone runs one evaluator-first loop: establish an evaluator epoch, generate candidates, score them, exercise canaries, and authorize guarded promotion. The three benchmark variants reuse this backbone, so the inputs and outputs of those services must have one reproducible identity rather than variant-local snapshots or mutable filesystem paths. The parent program requires sealed/frozen reference artifacts, versioned replay fingerprints, receipts, and staged shadow/canary/ship behavior before any mode authority changes.

The research inputs show why a terminal score is not enough. Rich per-case evaluator traces and fitness vectors must survive later reduction changes; evaluator profile, fixtures, calibration, normalization, and environment must form one dependency-locked epoch; candidate-blind judging must preserve order-swapped evidence; canaries must rotate and detect semantic leakage; and promotion must prove target repair, baseline preservation, integrity, and cross-domain safety. A mutable evaluator file, an unbound hidden suite, or a read that returns altered bytes would make a promotion claim impossible to replay and would allow proxy improvement to outrun independent evidence.

### Purpose

Define the sealed reference-artifact contract for Deep Improvement Common Services. The phase consumes the phase-006 sealing primitives and does not introduce a second sealing scheme. It plans content-addressed, seal-on-write, tamper-evident references for the evaluator capsule, candidate and baseline inputs, raw trial outputs, canary epochs, and promotion evidence inputs. The shared evaluator, canary, and promotion services own these artifacts as one common source for `005-agent-improvement`, `006-model-benchmark`, and `007-skill-benchmark`; the variants consume the contract without redefining sealing, evaluator identity, canary lifecycle, or promotion admissibility. This is planning only. The per-mode 010 migrations land after the shared contracts and write-set conflict graph are frozen.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- A single adapter over the existing phase-006 sealing primitives, including canonical serialization, content-addressed digest calculation, dependency-digest closure, seal-on-write, immutable storage references, and tamper-evident reads.
- A sealed evaluator capsule containing evaluator implementation and schema fingerprints, rubric or policy configuration, fixture manifests and hidden-anchor commitments, calibration inputs, normalization rules, environment/capability descriptors, query visibility policy, and typed budget policy.
- Sealed candidate and baseline input bundles containing lineage, parent/incumbent references, mutation-operator identity, profile scope, model/prompt/tool configuration, selected fixtures, seeds, and source artifact digests needed to reproduce a trial.
- Sealed raw trial outputs and evaluator observations retaining per-case output digests, raw score vectors, rationale or trace references, usage/cost/latency observations, execution environment, normalization version, and integrity observations before any reducer or score policy is applied.
- Versioned canary epochs containing deterministic, hidden, adversarial, metamorphic, and cross-domain suites; their lifecycle states `sealed`, `active`, `burned`, and `retired`; leakage checks; and explicit freshness or supersession references.
- Sealed promotion input bundles consumed by the common promotion service, including baseline/candidate comparability, lower-bound or uncertainty-aware score evidence, critical-dimension results, evaluator-integrity results, canary outcomes, rollback target, and unresolved or vetoed evidence.
- A tamper-evident read path that verifies artifact digest, schema, dependency closure, seal state, evaluator epoch, canary freshness, and access visibility before an evaluator, reducer, canary, promotion, or downstream variant consumes an artifact.
- Shared artifact ownership and consumer contracts for the deep-improvement common service plus `005-agent-improvement`, `006-model-benchmark`, and `007-skill-benchmark`, including redacted candidate-facing views and common failure states.
- Replay, mutation, truncation, missing-dependency, stale-epoch, canary-leak, and mixed-version fixtures that prove the sealed references are reproducible and fail closed.

### Out of Scope

- Defining a new hash, signature, chain, storage, or verification algorithm outside the phase-006 sealing primitives.
- Defining the typed event envelope, transition authorization, append-only ledger, reducer fold, projection schema, or replay fingerprint policy owned by `001-typed-ledger-schema` and `002-reducers-and-projections`.
- Implementing certificate and receipt materialization, effect recovery, or the final promotion receipt owned by `004-certificates-and-receipts`; this phase supplies the sealed inputs and references they bind.
- Implementing variant-specific candidate operators, lane prompts, model-selection policy, benchmark-specific metrics, or independent mode gates in the three downstream migrations.
- Changing authority, retiring legacy writers, or enabling live promotion. The shared services remain additive and shadow-only until the parent migration gates authorize a later cutover.
- Re-running the 065 research or changing the parent program's 178-row disposition ledger.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All common sealed artifacts use the phase-006 sealing primitives | The implementation has one named sealing adapter and no parallel digest, signature, manifest, or verification scheme is introduced |
| REQ-002 | Artifact identity is content-addressed and dependency-closed | The digest covers canonical artifact bytes, schema version, artifact kind, and ordered dependency digests; changing any dependency produces a new artifact identity |
| REQ-003 | Seal-on-write is atomic and immutable | A writer canonicalizes, validates, seals, persists, and publishes the artifact reference before use; interrupted writes expose no valid-looking artifact and existing sealed bytes are never overwritten |
| REQ-004 | Reads are tamper-evident and fail closed | Every consumer verifies bytes, digest, schema, dependency closure, seal state, and required epoch before returning a usable artifact; mismatch, absence, truncation, or unsupported version yields a typed refusal |
| REQ-005 | The evaluator capsule is a reproducible epoch | Profile, fixtures, hidden commitments, rubric, calibration, normalization, environment, capability, visibility, and budget inputs resolve to one sealed evaluator capsule referenced by every trial and promotion comparison |
| REQ-006 | Candidate and baseline trials are reproducible without mutable inputs | Each trial binds candidate/baseline digests, lineage, operator, profile, model/prompt/tool configuration, seed, fixture selection, raw output references, and execution fingerprints to sealed inputs and outputs |
| REQ-007 | Canary evidence is fresh, isolated, and leak-aware | Canary epochs are sealed before use, have explicit lifecycle and expiry/supersession state, detect semantic as well as literal leakage, and cannot be replaced by candidate-visible content during evaluation |
| REQ-008 | Promotion consumes one sealed evidence bundle | The common promotion service receives a digest-verified bundle covering target repair, baseline preservation, critical dimensions, evaluator integrity, canary results, uncertainty, cost, and rollback target; missing or stale evidence is not promotion-eligible |
| REQ-009 | The common services are the single source for all three variants | `005-agent-improvement`, `006-model-benchmark`, and `007-skill-benchmark` consume identical seal, evaluator, canary, read-failure, and promotion-input contracts without private replacements |
| REQ-010 | Artifact visibility prevents evaluator gaming | Candidate generators receive only explicitly permitted redacted commitments or verdict bands; hidden fixtures, exact canary content, evaluator internals, and terminal evidence are withheld and access violations produce a sealed veto reference |
| REQ-011 | Sealed references survive reducer and evaluator-policy changes | Raw observations remain addressable while later normalization, reduction, or evaluator epochs create new derived references; no policy change mutates or silently reinterprets an earlier sealed artifact |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: One phase-006-backed sealing adapter produces deterministic content-addressed identities for every common artifact class and rejects an attempted second sealing scheme.
- **SC-002**: A sealed evaluator capsule and its dependency closure reproduce the same evaluator inputs, visibility policy, and budget policy for every trial in an epoch.
- **SC-003**: Candidate, baseline, raw trial, canary, and promotion input artifacts remain readable by digest after reducer, normalization, or score-policy changes without mutation.
- **SC-004**: Tampered bytes, missing dependencies, stale epochs, unsupported schemas, expired canaries, and leaked hidden content fail closed through the common read path.
- **SC-005**: The three downstream variants consume the common sealed-artifact and service contracts without redefining evaluator identity, canary lifecycle, promotion evidence, or veto semantics.
- **SC-006**: Replay, mutation, crash, access-boundary, and mixed-version fixtures demonstrate that an accepted promotion input can be reproduced from sealed references and an unaccepted or incomplete input cannot reach ship eligibility.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Second sealing scheme** - Local hashing or a variant-owned manifest could diverge from the shared phase-006 primitive and make equivalent artifacts incomparable. Mitigation: require one adapter, one canonicalization path, and a contract test that rejects alternate seal metadata.
- **Incomplete dependency closure** - A digest that omits calibration, hidden fixtures, normalization, environment, or tool policy can preserve bytes while changing the evaluator. Mitigation: maintain an explicit dependency manifest and verify every referenced digest before read acceptance.
- **Mutable or partial writes** - A crash between file creation and seal publication could look like a valid artifact or overwrite a prior artifact. Mitigation: use the phase-006 seal-on-write protocol, atomic publication, fsync or its approved equivalent, and incomplete-write fixtures.
- **Evaluator gaming and leakage** - Candidate-visible exact scores, canary content, or evaluator internals can turn optimization into query-driven proxy exploitation. Mitigation: enforce redacted views, hidden commitments, query budgets, semantic leak detection, and a sealed integrity veto.
- **Cross-epoch comparison** - Candidate and baseline may be scored under different fixture, judge, calibration, or normalization material. Mitigation: require one evaluator capsule digest and reject mixed-epoch promotion inputs.
- **Promotion overclaim** - A target-task gain can hide baseline regressions, weak segments, integrity failures, or cross-domain drift. Mitigation: seal independent evidence planes and make critical vetoes non-overridable by aggregate score.
- **Shared-consumer drift** - The three variants may fork common service behavior while retaining the same type names. Mitigation: run shared fixtures through every consumer adapter and compare seal/read/promotion semantics before the downstream 010 migrations.
- **Dependencies**: `001-typed-ledger-schema` for event and identity inputs; `002-reducers-and-projections` for artifact references and service status; the phase-006 sealing primitives; `004-certificates-and-receipts` for receipt binding; phase 012 shared mode contracts and write-set conflict graph; existing deep-improvement evaluator, canary, scoring, and promotion fixtures; and the spec-kit validator.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

Deferred to execution against the frozen predecessor and sealing contracts:
- What exact canonical serialization and dependency ordering does the phase-006 primitive require for nested manifests and binary outputs?
- Which seal metadata is inside the content digest, and which operational fields remain outside the immutable content identity while still being tamper-evident?
- Does the shared primitive provide signatures, a hash chain, or both, and which verifier result is required before each service boundary accepts a read?
- Which evaluator inputs may be exposed as salted commitments or thresholded verdict bands during an active optimization session, and which are terminal-only?
- What retention and garbage-collection policy preserves replayable raw trials, burned canary epochs, and superseded evaluator capsules for the parent whole-system gate?
- Which seal-verification failures are retryable, which require quarantine, and which must block the transition-authorization gateway immediately?
<!-- /ANCHOR:questions -->
