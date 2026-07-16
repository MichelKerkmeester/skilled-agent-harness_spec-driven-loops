---
title: "Feature Specification: Skill Benchmark certificates and receipts"
description: "Plan the Skill Benchmark certificates and receipts over the deep-improvement-common backbone: attest paired skill scenarios, scoring evidence, replay inputs, validity domains, and transition outcomes while leaving shared services single-sourced and independently verifiable offline."
trigger_phrases:
  - "Skill Benchmark certificates and receipts"
  - "skill effect certificate"
  - "skill benchmark receipt verification"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/034-deep-loop-innovation/013-mode-and-lane-migrations/007-skill-benchmark"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/034-deep-loop-innovation/013-mode-and-lane-migrations/007-skill-benchmark/004-certificates-and-receipts"
    last_updated_at: "2026-07-15T21:30:00Z"
    last_updated_by: "opencode"
    recent_action: "Scoped Skill Benchmark attestations to scenario and scoring evidence"
    next_safe_action: "Freeze mode fields against shared certificate, receipt, and verifier contracts"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Skill Benchmark Certificates and Receipts

> Phase adjacency under the 007-skill-benchmark parent (grouping order, not a runtime dependency): predecessor `003-sealed-artifacts`; successor `005-resume-adapter`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/034-deep-loop-innovation/013-mode-and-lane-migrations/007-skill-benchmark/004-certificates-and-receipts |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-15 |
| **Owner skill** | system-deep-loop / deep-improvement-common / skill-benchmark |
| **Origin** | Phase 013 Skill Benchmark migration: certificates and receipts after typed ledger, reducers, and sealed artifacts |
| **Inputs** | Parent program spec, phase-tree manifest, findings registries, Skill Benchmark siblings 001-002, and common mode-004 service contracts |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Skill Benchmark cannot make a portable skill claim from a leaderboard row or a terminal task score. Research requires a
within-task, within-executor paired contrast, separate evidence for availability, discovery, loading, invocation, trajectory
compliance, constraint coverage, and verified outcome, plus compatibility and negative-transfer observations. A run must also
show whether its gold was valid and whether the observed lift survived the declared task, executor, registry, tool, permission,
dependency, and environment slice. The intended product is a versioned effect certificate with a validity domain, not a
global score.

This phase plans the Skill Benchmark specialization of the shared certificate and receipt contract. A per-run `CERTIFICATE`
attests what skill scenarios and scoring policy were evaluated, which sealed artifacts and raw observations support the
result, which paired treatment cells and component ablations were covered, what hard vetoes or insufficiencies were found,
and which bounded verdict is valid for the declared slice. A per-transition `RECEIPT` attests each authorized operation from
scenario assignment through discovery, exposure, scoring, certificate issuance, withholding, or expiry, including its
predecessor evidence, effect identity, replay fingerprint, and outcome.

The implementation builds on deep-improvement-common services from mode 004 for run identity, executor descriptors, sealed
references, evaluator/canary/promotion behavior, budgets, effect recovery, receipt persistence, and offline verification.
Only Skill Benchmark scenario and scoring logic is added here. This is planning only: the 010 migrations are the per-mode
fan-out after phase 012 freezes shared contracts and emits the executable dependency and write-set conflict graph.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A Skill Benchmark adapter over the shared run-level `CERTIFICATE` and transition-level `RECEIPT` schemas, including the mode-specific evidence manifest and `skill-effect-certificate.v1` specialization without forking common semantics.
- Per-run attestations for the randomized treatment lattice: no-skill/control, auto-route, forced activation, placebo or distractor, component ablation, and compatibility-boundary cells with paired task/executor blocking, seed, propensity, and replicate references.
- Per-transition receipts for design and assignment, scenario start/finish/abort, skill availability and discovery, progressive loading, invocation, resource-canary exposure, trajectory milestones, final checks, raw scoring, gold blocking, certificate issue/withhold, expiry, and supersession.
- Skill-specific replay-fingerprint inputs: bundle, registry, task, gold, evaluator/canary, scoring recipe, normalizer/reducer, executor/runtime/model/tool/permission, dependency/environment/workload, treatment design, raw-observation ordering, cost, and the sealed references used by the run.
- An offline Skill Benchmark verifier adapter that resolves sealed inputs, recomputes canonical fingerprints and score derivations, checks paired-cell coverage, gold integrity, constraint coverage, compatibility and security gates, receipt-chain continuity, and certificate validity without live agent calls.
- Explicit validity-domain and expiry evidence for evaluator, skill bundle, gold, registry, dependency, executor, tool, permission, environment, workload, scoring policy, canary epoch, and shared-contract changes.
- Shared-service parity fixtures and a handoff contract for the later resume adapter and independent Skill Benchmark mode gate.

### Out of Scope
- Reimplementing deep-improvement-common run identity, dispatch, evaluator, canary, promotion, budget, lock, effect-recovery, receipt storage, sealed-artifact, fingerprint serialization, or offline-verifier services.
- Defining the typed event envelope, reducers, projections, treatment event vocabulary, or canonical score reducers owned by Skill Benchmark siblings `001-typed-ledger-schema` and `002-reducers-and-projections`.
- Creating or changing the phase-006 sealing primitive; this phase consumes `003-sealed-artifacts` references and its certificate/receipt primitive bindings.
- New benchmark tasks, executor providers, authority cutover, legacy-writer retirement, in-flight state migration, or live promotion.
- The 010 per-mode implementation fan-out before phase 012 freezes shared contracts and publishes the write-set conflict graph.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Each complete Skill Benchmark run emits one mode-specialized `CERTIFICATE` through the shared service | The certificate binds run/lineage, skill bundle, treatment matrix, task corpus, executor slice, evaluator/canary epoch, gold policy, raw evidence manifest, derived scoring policy, budget, replay fingerprint, validity domain, and explicit issued/withheld/expired verdict |
| REQ-002 | Every scenario or scoring transition emits a shared-contract `RECEIPT` | Receipts name the transition, predecessor receipt references, stable scenario/cell/effect identity, authorization result, input/output evidence digests, attempt, replay fingerprint, and completed/vetoed/uncertain/recovered outcome; duplicate delivery is idempotent |
| REQ-003 | Causal treatment evidence supports deployable and diagnostic contrasts | No-skill, auto-route, forced, placebo/distractor, component-ablation, and compatibility-boundary cells retain seed, propensity, replicate, task, executor, environment, and bundle references; absolute score is not accepted as causal lift |
| REQ-004 | Skill exposure and trajectory evidence remain distinct from outcome scoring | Availability, discovery, loading, invocation, resource-canary exposure, milestone/constraint coverage, final-state checks, and outcome events are separately addressable and referenced by the certificate |
| REQ-005 | Gold integrity gates positive evidence | `scored`, `negative`, `structural-only`, and `pending` gold states are explicit; empty or pending required gold yields a typed block or insufficiency and cannot enter a positive numerator |
| REQ-006 | Raw scoring observations remain independently auditable | Per-item checks, dynamic reference results, raw score axes, evaluator identity, normalization/reducer versions, constraint coverage, cost, latency, tokens, and workload observations remain immutable inputs rather than only a summary score |
| REQ-007 | Compatibility, risk, and validity are certificate claims with bounded scope | Bundle, registry, executor, tool, permission, environment, dependency, workload, composition, security, negative-transfer, evaluator, and canary digests are bound; incompatible or stale slices withhold or expire the certificate |
| REQ-008 | Mode replay uses the shared fingerprint contract plus explicit Skill Benchmark inputs | The same canonical semantic inputs reproduce the same fingerprint; changes to treatment, evidence ordering, gold, scoring, bundle, capability, dependency, environment, budget, policy, or predecessor evidence produce a mismatch; storage-local values are excluded |
| REQ-009 | An independent verifier re-checks the mode result offline | The verifier resolves content-addressed references, recomputes hashes and score derivations, checks receipt-chain continuity and hard vetoes, validates paired coverage and gold mutation sensitivity, and returns typed pass/fail/incomplete/unsupported outcomes without live execution |
| REQ-010 | Common services remain single-sourced and dark | Skill Benchmark supplies only scenario/scoring adapters; shared certificate fields, receipt vocabulary, fingerprint rules, verifier stages, hard-veto ordering, and effect recovery have one owner and do not change authority before the later cutover |
| REQ-011 | The 010 fan-out consumes a frozen, conflict-safe contract | The phase records the 009 contract-freeze and write-set-graph gate; no per-mode implementation is accepted while shared field ownership or conflicting writes remain unresolved |
<!-- /ANCHOR:requirements -->

### Certificate and receipt evidence boundary

The Skill Benchmark `CERTIFICATE` is the run-level statement that a declared treatment design was executed against a declared
skill bundle and task/executor/environment slice, that required gold and raw observations were present, and that the stated
effect verdict follows the shared policy. Its mode-specific evidence includes paired lift, invocation rate, selection tax,
content effect, component ablations, constraint coverage, compatibility slices, negative-transfer cases, security/cost deltas,
and evidence-based expiry triggers. Integrity of the signed or sealed bundle is not causal efficacy; both remain separate
certificate fields.

The Skill Benchmark `RECEIPT` is the transition-level statement for one causal or control-plane step. It references the
shared receipt chain rather than copying a complete run. An effect that may have executed before durable receipt commit stays
`uncertain` until the common effect-recovery policy resolves it. A certificate cannot treat a process exit, missing receipt,
empty gold set, or unavailable offline input as success.

### Replay-fingerprint input contract

The mode adapter contributes an ordered, length-delimited tuple containing the shared contract and schema versions; stable run,
lineage, scenario-cell, treatment, bundle, task, and executor identities; bundle, registry, gold, task, environment, workload,
tool, permission, dependency, evaluator, canary, rubric, normalizer, reducer, and policy digests; treatment seed, propensity,
replicate, and arm order; raw-observation and receipt ordering; score and constraint-coverage inputs; budget, deadline, admission,
and retry decisions; sealed-artifact references; and the exact verifier ruleset. It inherits common canonicalization and exclusion
rules. Wall-clock timestamps, local paths, process IDs, storage offsets, network addresses, and non-semantic signature bytes are
not fingerprint inputs.

### Offline verification contract

The verifier first checks shared schema support and sealed-reference retrieval, then recomputes the mode fingerprint, receipt-chain
links, raw-observation manifest, gold-integrity and mutation-sensitivity checks, deterministic final-state and milestone relations,
paired treatment coverage, score reductions, compatibility/security gates, and validity/expiry rules. It distinguishes `PASS`,
`FAIL`, `VETOED`, `INCOMPLETE`, and `UNSUPPORTED_VERSION`, preserves `UNKNOWN` for unresolved effect or evidence states, and
emits a verifier receipt bound to the certificate fingerprint, verifier version, ruleset digest, and all evidence digests.

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Skill Benchmark emits a versioned run certificate and transition receipts that bind paired scenario design, raw scoring evidence, compatibility, validity, and explicit outcomes to shared content-addressed inputs.
- **SC-002**: The certificate distinguishes skill integrity from causal efficacy and reports invocation, constraint coverage, component, compatibility, cost, security, and negative-transfer evidence within a declared validity domain.
- **SC-003**: Identical semantic inputs reproduce the same mode replay fingerprint and an independent verifier accepts only when gold integrity, raw evidence, receipt continuity, reducers, hard vetoes, and validity checks match.
- **SC-004**: Skill Benchmark consumes deep-improvement-common services through adapters, shares their certificate/receipt/fingerprint/verifier semantics, and adds no duplicate dispatch, evaluator, budget, sealing, or recovery implementation.
- **SC-005**: The contract remains additive and dark, consumes `003-sealed-artifacts` primitives, hands explicit uncertain-effect and verification cases to `005-resume-adapter`, and is ready for the post-009 010 migration fan-out.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Certificate becomes a leaderboard score** - An aggregate can hide discovery failure, ignored guidance, missing constraints, executor confounding, or localized negative transfer. Mitigation: retain paired-cell receipts, staged exposure evidence, raw item observations, gold status, and validity slices in the certificate manifest.
- **Forced activation overclaims deployable value** - Oracle injection can make a skill look effective while routing fails. Mitigation: require no-skill, auto-route, forced, placebo/distractor, and component-ablation arms and report realized lift, selection tax, and content effect separately.
- **Inert or empty gold creates false positives** - A successful run with no executable expected behavior can inflate the numerator. Mitigation: pre-score gold-integrity gating, explicit pending/structural-only states, and mutation-sensitivity fixtures.
- **Compatibility and composition drift** - Skill guidance can regress under dependency versions, registry scale, composed activation paths, tool permissions, or executor changes. Mitigation: bind those digests to the certificate and withhold or expire outside the validity domain.
- **Shared-service duplication** - A variant-local verifier or receipt schema can diverge from agent-improvement and model-benchmark. Mitigation: adapter-only ownership tests and semantic parity fixtures through the mode-004 common services.
- **Offline replay is falsely deterministic** - Stable sorting does not capture treatment assignment, evidence admission, retries, budgets, or evaluator drift. Mitigation: include every declared semantic decision in the fingerprint and retain its receipt.
- **Unknown effect outcome is mistaken for success** - A crash before a receipt commit can leave an invocation or scoring effect ambiguous. Mitigation: preserve `uncertain` and require the common effect-recovery policy before retry, issue, expire, or restore.
- **Dependencies**: Skill Benchmark siblings `001-typed-ledger-schema` and `002-reducers-and-projections`; `003-sealed-artifacts` primitives; deep-improvement-common mode-004 certificate, receipt, fingerprint, evaluator, canary, promotion, budget, and verifier services; phase 012 shared mode contracts; phase 012 freeze and write-set graph; successor `005-resume-adapter`; and the existing benchmark harness for behavior baselines. The manifest `depends_on` is empty by design; implementation must fail closed if consumed contracts are unavailable.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

Deferred to execution against the frozen shared contracts:
- Which shared certificate and receipt fields are mandatory for every mode, and which Skill Benchmark fields are registered extensions rather than new semantics?
- Which exact certificate verdict labels and practical-effect margins are canonical for portable skill, executor-confounded, beneficial, neutral, harmful, inconclusive, withheld, and expired outcomes?
- Which trajectory and resource-canary observations are diagnostic-only versus required process constraints for a given task slice?
- Which sealed-artifact visibility rules expose evidence to the scorer while keeping hidden canary content, exact evaluator internals, and proposer-sensitive observations unavailable?
- Which compatibility changes invalidate exchangeability immediately, and which can be represented as an explicit validity-domain partition or upcast?
- Which receipt recovery states must `005-resume-adapter` reuse, re-execute, reconcile, compensate, quarantine, or block?
<!-- /ANCHOR:questions -->
