---
title: "Feature Specification: Deep AI Council - Certificates & Receipts (013 phase 003 child 004)"
description: "Plan the Deep AI Council per-run certificate and per-transition receipt profiles over the typed event-ledger substrate: attestation boundaries, replay-fingerprint inputs, lifecycle coverage, recovery dispositions, and independent offline verification for seats, critique rounds, convergence, council artifacts, and the council test gate."
trigger_phrases:
  - "deep ai council certificates and receipts"
  - "deep-ai-council run certificate"
  - "deep-ai-council transition receipts"
  - "offline council certificate verification"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/003-deep-ai-council/004-certificates-and-receipts"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/003-deep-ai-council/004-certificates-and-receipts"
    last_updated_at: "2026-07-15T23:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Defined Deep AI Council attestation profiles and offline verification boundary"
    next_safe_action: "Freeze council receipt rows and replay inputs against shared contracts"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Deep AI Council - Certificates & Receipts
> Phase adjacency under the 003-deep-ai-council parent (grouping order, not a hard runtime dependency): predecessor `003-sealed-artifacts`; successor `005-resume-adapter`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/003-deep-ai-council/004-certificates-and-receipts |
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Planned |
| **Created** | 2026-07-15 |
| **Owner skill** | system-deep-loop / deep-ai-council |
| **Origin** | Fourth child of the Deep AI Council mode migration fan-out |
| **Depends on** | `[]`; sibling planning contracts are independent and compose at the Deep AI Council mode gate |
| **Consumes** | Shared phase-003 receipt and certificate primitives, typed ledger and replay contracts, and predecessor `003-sealed-artifacts` references |
| **Inputs** | `065-deep-loop-innovation/spec.md`, `manifest/phase-tree.json`, `findings-registry.json`, `findings-registry-modes.json`, and the Deep AI Council typed-ledger and reducer contracts |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Deep AI Council runs move through independent seat deliberation, critique rounds, candidate adjudication, convergence,
artifact publication, and a council test gate. The current mode records useful state and artifacts, but a terminal council
output or successful process exit does not prove which proposals, critiques, blinded judgments, independence evidence,
policies, or gate inputs produced it. It also does not give each logical transition a durable proof of its input range,
result, ledger head, and recovery status. Retries and late results can therefore be mistaken for a clean deliberation.

The mode research makes those gaps load-bearing. Independent reasoning paths must precede social exposure; reasoning-method
and provider correlation must constrain effective seat count; minority and contradiction evidence must survive convergence;
candidate identity and order must be blinded during adjudication; swapped-order disagreement must abstain or escalate; and
protocol choice must be explicit rather than hard-coded as two-of-three. The findings also require first-class belief and
stance trajectories, bias and metamorphic checks, control-arm comparisons, and reproducible counterfactual forks. These
observations belong in the typed event and reducer contracts, while certificates and receipts attest that the recorded
observations and decisions were assembled under the declared contracts.

This phase plans one per-run Deep AI Council certificate and a receipt profile for every logical transition in the run:
`seats deliberate -> critique rounds -> converge -> ai-council artifacts -> council test gate`, plus initialization,
recovery, and completion. A receipt attests one authorized transition, its exact input and output references, resulting
ledger head, and effect or recovery disposition. The certificate attests the verified run bundle, declared result, sealed
reference set, receipt chain, replay fingerprint, projection and artifact outputs, and test-gate evidence. The phase
consumes the shared phase-003 primitives and predecessor sealed references; it does not create a mode-local signing scheme,
digest, verifier, artifact store, reducer, resume adapter, or authority decision.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A Deep AI Council run-certificate profile binding run identity, lineage, target and configuration digests, lifecycle coverage, final ledger heads, ordered sealed references, receipt-chain digest, replay fingerprint, projection and synthesis outputs, council artifact manifest, test-gate result, and unresolved obligations.
- A transition-receipt profile for initialization, seat selection and dispatch, seat return and proposal observation, critique rounds, candidate blinding, pairwise judgment and bias audit, deliberation synthesis, convergence evaluation, artifact commit, council test gate, rollback observation, resume or recovery reconciliation, and terminal completion.
- Attestation rules that separate logical transition identity from attempt identity and state what the receipt or certificate proves: authorized transition, canonical input/output digests, sealed-reference validity, result disposition, prior and resulting ledger heads, and shared certification metadata.
- A replay-fingerprint input contract covering shared envelope and payload versions, canonical codec, event chain, run lineage, seat and branch identities, proposal and critique digests, blinded order controls, independence and calibration evidence, reducer/projection versions, convergence and protocol policies, artifact and test-gate references, and effect outcomes.
- Fingerprint normalization and exclusions for wall-clock values, process IDs, completion order, random request identifiers, mutable paths, cache aliases, and attempt-only values that cannot change replay semantics.
- An independent offline verifier that validates the shared certificate and receipt bundle, resolves local sealed references, recomputes canonical digests and replay fingerprints, checks authorization and chain continuity, folds declared projections, and returns typed verification results without live council execution.
- Idempotent retry, duplicate detection, stale-head detection, unknown-effect handling, late-result supersession, counterfactual mismatch, and additive-dark failure behavior.

### Out of Scope
- Defining or replacing the shared phase-003 receipt, certificate, ledger, transition-authorization, certification-provider, or generic replay-fingerprint primitives.
- Creating or sealing Deep AI Council artifacts, changing artifact canonicalization, or defining verified reads; predecessor `003-sealed-artifacts` owns those bindings.
- Defining event names, reducers, projections, seat producers, critique execution, judge calibration, protocol routing, budgets, fan-out/fan-in scheduling, or the council test-gate implementation owned by sibling or shared phases.
- Implementing the resume adapter owned by successor `005-resume-adapter`; this phase defines the receipt and certificate inputs that resume consumes and the recovery evidence it must emit.
- Moving authority, rewriting legacy JSONL, deleting old evidence, claiming exactly-once effects without reconciliation, or changing the staged cutover contract.
- Treating a valid certificate as proof that the selected plan is true, that agreement implies correctness, or that omitted evidence cannot exist.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The mode consumes one shared receipt and certificate contract | A contract matrix maps every council receipt and the run certificate to phase-003 primitives, with no mode-local digest, signature, key, verifier, or trust root |
| REQ-002 | One run certificate attests the complete Deep AI Council run | The certificate binds run/lineage/generation identity, lifecycle result, start and final ledger heads, ordered sealed-reference digest, receipt-chain digest, replay fingerprint, projections, artifact manifest, test-gate result, and unresolved obligations |
| REQ-003 | Each logical council transition emits a complete receipt | Initialization, seats, critique, blinding, judgment, synthesis, convergence, artifacts, test gate, recovery, and completion rows identify authorization, logical operation, attempts, inputs, outputs, result disposition, and resulting head |
| REQ-004 | Replay inputs are explicit and versioned | Recomputing the fingerprint uses registered semantic inputs and produces the same value for identical canonical inputs; contract, event, seat, proposal, judgment, policy, reducer, projection, artifact, gate, and effect versions are included |
| REQ-005 | Fingerprint exclusions cannot alter semantics | Process IDs, wall-clock timestamps, completion order, random request IDs, mutable paths, cache aliases, and attempt-only identifiers are excluded or normalized; any value affecting seat selection, judgment, convergence, artifact, or gate outcome remains included |
| REQ-006 | Receipt and certificate chains are append-only and conflict detecting | Exact-repeat retry returns the original receipt; reused identity with different facts, prior head, candidate set, order token, result, or authority epoch returns a typed conflict and appends no false success |
| REQ-007 | Uncertainty and council disagreement remain attestable without becoming success | `blocked`, `invalid`, `incomplete`, `quarantined`, `failed`, `in_doubt`, `abstained`, and `unresolved` remain explicit; the certificate cannot report trusted completion with unresolved required evidence or a failed gate |
| REQ-008 | Independence, minority, and bias evidence remain certificate-addressable | The bundle retains raw seat/error vectors, independence groups, stance and belief revisions, minority and contradiction references, order-swapped outcomes, bias findings, control-arm deltas, and vetoes without reducing them to nominal agreement |
| REQ-009 | The offline verifier is independent of live council execution | A verifier with trusted registries, the receipt/certificate bundle, and local sealed references validates canonical bytes, authorization, chain continuity, replay fingerprint, projections, artifacts, and gate evidence without network, model, search, or memory calls |
| REQ-010 | Recovery distinguishes logical retries from attempts and external effects | `not_applied`, `applied`, `in_doubt`, and `conflict` are recorded against the logical transition; only conclusive `not_applied` can retry with the original idempotency key |
| REQ-011 | The migration remains additive-dark | Receipt or certificate failure blocks dark evidence and mode-gate promotion only; legacy council state, artifacts, writers, output, and authority remain unchanged until staged cutover |

### Deep AI Council receipt and certificate boundary matrix

| Lifecycle boundary | Receipt attests | Replay-bound inputs | Required result handling |
|--------------------|-----------------|---------------------|--------------------------|
| `init` | Authorized council run creation, frozen target, strategy, seat policy, protocol policy, and initial ledger head | Run/lineage/generation, target/config/strategy/prompt-pack/capability digests, shared contract versions, initial reference-set digest | Missing target or mutable-only configuration blocks trusted run certification |
| `seat-select-dispatch` | Authorized seat selection and dispatch for one logical branch, declared reasoning method, capability surface, lease, and dispatch result | Seat identity, independence group, model/provider/prompt/tool digests, selection utility, branch ID, budget lease, dispatch policy | Capability mismatch, duplicate logical seat, or unknown dispatch effect is blocked or `in_doubt` |
| `seat-return` | One seat proposal observation, raw result, evidence references, confidence/cost, and output schema | Proposal and seat IDs, target version, response/artifact digest, raw score vector, evidence digests, executor and output-schema versions | Missing or invalid proposal is failure evidence, never a successful independent seat |
| `critique-round` | Critique exposure, cited proposal claims, challenge disposition, and round result | Critique-round ID, visible-information policy, source proposal IDs, critique digest, critic capability, referenced claims, raw severity/confidence | Hidden identity or peer-score leakage is a typed violation; unresolved critique remains explicit |
| `candidate-blind-judge` | Candidate aliasing, deterministic shuffle, order-swapped pairwise judgments, bias audit, abstention, or adjudication result | Candidate/proposal digests, alias and shuffle seed digests, order token, judge profile, rubric, raw/calibrated scores, bias inputs, pairwise result | Order disagreement or bias failure yields abstention, escalation, or `unresolved`, not an extra vote |
| `synthesis` | Deliberation synthesis over a declared event range and candidate set | Ordered proposal/critique/judgment range, minority and contradiction references, synthesis policy, reducer/projection versions, output digest | Changed or incomplete inputs yield mismatch or incomplete output; synthesis cannot rebaseline silently |
| `convergence` | One verified convergence evaluation and its decision | Effective seat evidence, raw agreement and stability, calibrated support, dissent, vetoes, coverage, budget state, protocol and convergence policy fingerprints | `CONTINUE`, `STOP_ELIGIBLE`, `INDETERMINATE`, `BLOCKED`, and non-converged outcomes remain distinct |
| `artifact-commit` | Artifact manifest entry and publication result over sealed references | Artifact kind/schema, source event range, byte/content digest, required sections, round/run identity, supersession lineage | Missing seal, wrong digest, or incomplete section blocks certificate completion |
| `council-test-gate` | Required fixture manifest, baseline/candidate fingerprints, bias/metamorphic checks, artifact completeness, and gate decision | Test-suite and fixture digests, control-arm result, candidate fingerprint, verifier and gate versions, critical failures | A failed, skipped, or unverifiable required check prevents a valid run certificate |
| `resume-recovery` | Reconciliation of prior attempts and the decision to reuse, re-execute, compensate, or block | Prior receipt, logical operation, idempotency key, prior head, target evidence, compatibility decision, current contract fingerprint | Only conclusive `not_applied` retries; `in_doubt` stops automatic replay |
| `complete` | Terminal council status, final heads, certificate inputs, and output handoff | Final receipt set, artifact manifest, test-gate receipt, final projection, terminal reason, unresolved obligations | Incomplete, blocked, or non-converged runs remain explicitly non-valid certificates |

### Run certificate attestation

The run certificate is a shared-certified statement over a canonical certificate body. It attests that the verifier found a
coherent council bundle with the declared run identity, authorized receipt chain, verified sealed references, recomputed
replay fingerprint, declared reducer/projection and synthesis outputs, artifact manifest, test-gate evidence, and explicit
terminal disposition. It does not attest external truth, semantic correctness beyond recorded evidence, independence beyond
the supplied measurements, or authority to replace the legacy path. A certificate with an unresolved required receipt,
unverifiable artifact, unknown effect, failed bias gate, mixed ledger head, or incomplete test coverage is `incomplete` or
`unverifiable`, never valid completion.

### Replay-fingerprint input contract

The canonical fingerprint input is an ordered object containing shared envelope and payload schema versions; canonical codec
and ordering policy; run, lineage, generation, target, and finalized ledger range; authorized event IDs, payload digests,
predecessor tail hashes, and event-chain identity; ordered sealed artifact references and descriptor versions; seat roster,
independence groups, model/provider/prompt/tool/capability commitments; proposal, critique, candidate, pairwise judgment,
bias, stance, minority, contradiction, and convergence evidence digests; deterministic alias and order controls; protocol,
rubric, calibration, reducer, projection, synthesis, convergence, artifact, test-gate, and certificate policy fingerprints;
logical transition IDs; and verified effect outcome or recovery digests. Certificate issuance time, process IDs, completion
order, random request IDs, local paths, cache aliases, and attempt IDs are excluded unless a registered contract proves they
change a replay decision. The verifier rejects an unregistered field instead of silently including or omitting it.

### Independent offline verification

The verifier loads trusted shared contract, certification, event, and policy registries; validates strict schemas and the
certificate body; checks run scope and unique logical transition identities; walks prior-head, event, authorization, and
receipt links; resolves every sealed reference from the supplied local bundle; recomputes canonical body digests and the
registered replay fingerprint; folds the certificate-pinned event range with the declared reducer and projection versions;
checks synthesis, artifact, bias, independence, minority, and test-gate evidence; and confirms result dispositions match the
certificate. It never fetches a URL, reruns a model, calls a search or memory provider, repairs a missing receipt, invents a
seat result, or creates a new baseline. The output is a typed `valid`, `invalid`, `incomplete`, `unverifiable`, or `blocked`
verdict with the first failed invariant and evidence digest; verification does not mutate history.
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every Deep AI Council logical lifecycle transition has a reviewed receipt profile, and one run certificate binds the complete verified receipt chain without a mode-local trust scheme.
- **SC-002**: Identical run identity, event chain, sealed references, seat commitments, policies, reducer/projection versions, gate inputs, and effect outcomes produce identical receipt and certificate body digests and replay fingerprints.
- **SC-003**: The verifier detects mutation, omission, truncation, stale heads, wrong artifact kinds, unsupported versions, duplicate identities, order mismatch, failed bias checks, mixed reference sets, and same-key/different-facts reuse without repairing or rebaselining.
- **SC-004**: Independent offline verification reproduces the declared council projections, synthesis, artifact manifest, independence evidence, minority lineage, and test-gate result from local sealed inputs without network or live execution.
- **SC-005**: Resume and recovery preserve historical receipts and certificates, append affected revisions, distinguish `not_applied`, `applied`, `in_doubt`, and `conflict`, and never double-apply an uncertain transition.
- **SC-006**: The Deep AI Council mode gate proves receipt and certificate parity across normal, unresolved, biased, minority, and control-arm fixtures while legacy authority remains unchanged and successor `005-resume-adapter` can consume the frozen contract.

**Given** a completed council run, **when** the certificate is verified from its pinned event range, **then** the verifier can reconstruct the declared seat coverage, critique rounds, adjudication evidence, convergence result, artifact manifest, test-gate result, and unresolved IDs without rerunning the mode.

**Given** nominal agreement is high but effective independence, minority survival, order consistency, or required gate evidence is insufficient, **when** the receipt chain is verified, **then** the run remains blocked, non-converged, or incomplete and cannot become valid through two-of-three agreement.

**Given** a candidate is judged in both orders, **when** the pairwise results disagree or a bias detector flags the comparison, **then** the receipt records abstention or escalation evidence and the certificate cannot manufacture a selected plan.

**Given** a receipt, artifact reference, event, or certificate field is tampered with, **when** the offline verifier checks the bundle, **then** it returns invalid or blocked at the first failed invariant and emits no valid certificate result.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Certificate overclaim** - a process certificate may be mistaken for semantic truth or independent correctness. Mitigation: attest recorded inputs, transitions, raw evidence, and declared outcomes; preserve separate adjudication, bias, and gate receipts.
- **Receipt incompleteness** - a missing receipt at a late seat return, critique retry, blocked convergence, artifact, or test-gate boundary can make a run look cleaner than its history. Mitigation: derive the transition matrix from the typed event union and fail verification on required gaps.
- **Nominal-independence inflation** - different seat labels can hide shared provider, prompt, evidence, or reasoning-method errors. Mitigation: bind model-family, reasoning-method, information-surface, raw error, calibration, effective-seat, and marginal-gain evidence.
- **Bandwagon and judge bias** - exposed identity, order, verbosity, or peer scores can turn social agreement into a false verdict. Mitigation: receipt candidate blinding, deterministic order swaps, bias/metamorphic checks, abstention, minority evidence, and explicit protocol routing.
- **Fingerprint drift** - omitting an evaluator, tool, policy, codec, artifact, or ordered input permits unsafe reuse, while including process-local values rejects equivalent replay. Mitigation: version the input registry, normalize exclusions, and report the first mismatch.
- **Mutable-reference leakage** - a digest may point to a mutable artifact path or expose unrestricted seat material. Mitigation: require sealed or content-addressed references, safe locators, declared disclosure boundaries, and secret exclusion.
- **Unknown external effect** - a lost dispatch or artifact publication response can be interpreted as failure or success. Mitigation: retain `in_doubt` and delegate reuse, reconcile, compensate, or block decisions to the later resume adapter.
- **Cross-phase scope creep** - certificate work may absorb reducers, artifact sealing, resume, rollback, or authority concerns. Mitigation: keep the ownership table and adjacency line as implementation blockers.
- **Dependencies**: phase-003 receipt/certificate, event, ledger, authorization, and replay contracts; predecessor `003-sealed-artifacts`; the Deep AI Council `001-typed-ledger-schema` and `002-reducers-and-projections` contracts; phase-012 shared mode interfaces and write-set conflict graph; later `005-resume-adapter`, shadow-parity, rollback, cutover, and mode-gate concerns; and the two findings registries under `002-deep-loop-effectiveness-and-fanout`.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Which exact phase-003 primitive represents the run certificate seal, and does the verifier receive a signature, Merkle root, transparency reference, or another typed proof?
- Which phase-012 event-tail, authorization, effect, and projection fields are inherited directly by council receipts, and which require digest-only mode extensions?
- Is the certificate pinned to a finalized ledger frontier, a contiguous event range, or both when late seat results or gate receipts arrive after synthesis?
- Which artifact kinds and council test-gate checks are mandatory for a valid certificate, and which remain diagnostic evidence during the additive-dark window?
- How are effective-seat, calibration, pairwise order, minority, and counterfactual snapshots versioned without making the certificate own reducer policy?
- Which missing sealed reference cases are `blocked` versus `unverifiable`, and what provider evidence is sufficient for offline verification of an effect receipt?

These questions are contract-ratification inputs for implementation. They do not authorize a second verifier, a mode-local
trust root, a new event vocabulary, a reducer or artifact implementation, a resume policy, or an authority decision in this
Planned phase.
<!-- /ANCHOR:questions -->
