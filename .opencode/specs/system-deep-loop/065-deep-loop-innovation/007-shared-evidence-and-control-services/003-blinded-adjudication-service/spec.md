---
title: "Feature Specification: Blinded Adjudication Service"
description: "Plan a shared blinded and counterfactual adjudication service that controls identity and position bias while preserving replayable raw scoring evidence."
trigger_phrases:
  - "blinded adjudication service"
  - "counterfactual adjudication"
  - "bias-controlled multi-candidate judgement"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/007-shared-evidence-and-control-services"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/007-shared-evidence-and-control-services/003-blinded-adjudication-service"
    last_updated_at: "2026-07-15T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored the planned blinded adjudication contract and verifier gates"
    next_safe_action: "Implement the blinding envelope and mirrored-order adjudication fixtures"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Blinded Adjudication Service

> Phase adjacency under the shared-services parent (navigation order, not a runtime dependency): predecessor `002-sealed-reference-artifacts`; successor `004-hierarchical-typed-budgets`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/065-deep-loop-innovation/007-shared-evidence-and-control-services/003-blinded-adjudication-service |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-15 |
| **Owner skill** | system-deep-loop |
| **Origin** | Third child of the phase-007 shared evidence and control services parent |
| **Depends on** | None (`[]`) |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Multi-candidate decisions currently risk letting candidate position, provider identity, author identity, declared
confidence, response length, or prior seat reputation influence the judge. A candidate or mode that helps produce the
decision may also score its own output. Those paths can manufacture apparent convergence: a verdict can remain stable
only while the same labels and ordering are visible, or a correlated panel can be counted as independent votes.

This phase plans one shared service that separates candidate registration from judging, presents opaque randomized
candidates, performs mirrored pairwise and targeted counterfactual checks, and records both raw judgments and the
reduced verdict as typed ledger events. A verdict is stable only when the configured merit-irrelevant interventions do
not change the decision beyond policy tolerance; otherwise the service emits an unstable or inconclusive outcome rather
than hiding disagreement in an aggregate. The contract follows the phase-004 ADR requirement to separate scoring
authority and retain raw pre-reduction evidence, the manifest's shared blinded/counterfactual primitive, and run-2's
anonymous A/B plus B/A gate, effective-independence requirement, and warning that judge competence estimates do not
correct correlated failure by themselves.

Sources: `.opencode/specs/system-deep-loop/065-deep-loop-innovation/004-architecture-coverage-and-transition-contract/001-spine-architecture-adr/spec.md`;
`.opencode/specs/system-deep-loop/065-deep-loop-innovation/manifest/phase-tree.json`;
`.opencode/specs/system-deep-loop/065-deep-loop-innovation/002-deep-loop-effectiveness-and-fanout/research/research-modes.md`.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A typed `AdjudicationRequest` contract covering decision kind, candidate digests, rubric/reference digest, judge policy version, required counterfactuals, quorum, tie behavior, and replay fingerprint.
- A blinding registrar that replaces candidate identity and initial position with per-assignment opaque labels, masks provider/author/confidence metadata, and retains a separately controlled identity map for audit and deblinding.
- Content-preserving presentation controls that randomize order and may normalize declared length/style features only under an explicit versioned policy; candidate meaning may not be rewritten by the blinding layer.
- Pairwise judging in both A/B and B/A order, with explicit tie, abstention, invalid, and insufficient-evidence results rather than forced preference.
- Counterfactual probes for identity label, order, claimed expertise, confidence, majority signal, and other policy-declared merit-irrelevant attributes, each linked to the original comparison.
- A reduction contract that reports stable, unstable, or inconclusive verdicts and preserves minority evidence, vetoes, cycles, and per-judge uncertainty.
- Typed ledger events for request acceptance, blinded presentation, raw score, counterfactual result, reduction, verdict, invalidation, and deblinding audit; every event links candidate digests, policy version, judge assignment, and replay fingerprint.
- Effective-independence evidence derived from model-family, reasoning-method, evidence-provenance, and residual-error metadata after judging; configured seat count is never treated as effective vote count.
- Mode adapters for deep-review severity decisions, deep-ai-council pairwise ranking/convergence, and deep-improvement/model-benchmark/skill-benchmark candidate scoring.

### Out of Scope
- Candidate generation, council seat selection, debate protocols, finding production, benchmark case generation, or promotion policy.
- The phase-006 event envelope, ledger storage engine, transition-authorization gateway, or replay-fingerprint implementation.
- Sealed reference-artifact mechanics owned by `002-sealed-reference-artifacts` or budget enforcement owned by `004-hierarchical-typed-budgets`.
- A claim that Dawid-Skene or any competence-weighted reducer removes correlation; competence estimates remain advisory and raw scores plus residual-correlation evidence remain authoritative audit inputs.
- Automatic authority cutover, convergence termination, or legacy-writer retirement; consuming modes decide how a service result affects their own state machine.
- Cryptographic algorithm selection, key custody, user-interface presentation, or cross-organization identity governance.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Register each decision through a versioned typed request | The request binds decision kind, candidate and reference digests, rubric, counterfactual policy, judge policy, quorum/tie rules, and replay fingerprint before scoring starts |
| REQ-002 | Keep identity-bearing registration separate from blinded judging | Judges receive opaque per-assignment labels and no provider, author, original position, confidence, or identity-map fields; access tests reject identity leakage |
| REQ-003 | Preserve candidate meaning while controlling presentation bias | The presentation policy is versioned, its transformations are recorded, and digest-linked fixtures prove it changes only allowed merit-irrelevant presentation fields |
| REQ-004 | Run mirrored pairwise adjudication | Every required comparison records A/B and B/A judgments or an explicit policy-authorized exemption; order disagreement cannot reduce to a stable preference |
| REQ-005 | Probe configured merit-irrelevant counterfactuals | Identity, order, confidence, expertise, majority, and other declared probes record flip/no-flip/indeterminate results linked to the baseline judgment |
| REQ-006 | Fail closed on bias sensitivity or insufficient evidence | Required probe flips, missing mirrored judgments, invalid assignments, unresolved cycles, or insufficient independence produce unstable/inconclusive outcomes rather than a winning candidate |
| REQ-007 | Retain raw evidence before reduction | Immutable raw scores, rationales/evidence locators, abstentions, uncertainty, and probe results are ledger events addressable from the final verdict |
| REQ-008 | Make reduction replayable and non-destructive | A versioned reducer reproduces the verdict from the same ordered events and fingerprint while retaining ties, minority evidence, vetoes, cycles, and all component scores |
| REQ-009 | Measure effective independence without overstating aggregation | Independence metadata and residual-correlation gauges are reported separately; Dawid-Skene-style competence weights cannot be presented as correlation correction or independent-vote count |
| REQ-010 | Prevent self-scoring and identity-derived authority | Candidate producers cannot adjudicate their own candidate, and no hidden identity field may affect weight, eligibility, tie-break, or convergence status |
| REQ-011 | Provide typed mode-consumption contracts | Deep-review, deep-ai-council, and improvement/benchmark adapters map their domain inputs and outcomes without bypassing blinding, counterfactual, raw-score, or fail-closed rules |
| REQ-012 | Keep the service dark and non-authoritative during migration | Adjudication events may be shadow-compared, but no legacy decision authority changes until later compatibility, parity, and cutover phases authorize it |
| REQ-013 | Preserve audit-controlled deblinding | Deblinding is a separately authorized ledgered action after verdict finalization; routine scorers and reducers cannot access the identity map |
| REQ-014 | Maintain source traceability | The service contract cites run-2 synthesis, the phase-004 ADR, and the phase manifest for every load-bearing architecture invariant |
<!-- /ANCHOR:requirements -->

### Mode consumption contract

| Consumer | Blinded unit | Required counterfactuals | Returned evidence |
|----------|--------------|--------------------------|-------------------|
| `deep-review` | Competing finding validity/severity dispositions or remediation candidates, stripped of reviewer identity | Order, reviewer identity, declared confidence, and presentation length | Raw validity/severity scores, hard-veto evidence, flip matrix, stable/unstable/inconclusive disposition |
| `deep-ai-council` | Anonymous candidate briefs or proposals from a sealed independence batch | A/B and B/A, provider/seat label, claimed expertise, confidence, majority cue, and leave-one-seat-out when configured | Pairwise graph, ties/cycles, minority evidence, effective-independence evidence, counterfactual convergence receipt |
| `deep-improvement` | Candidate implementations or agent variants, separated from the mutator identity | Order, generator identity, incumbent/challenger label, confidence, and style controls | Per-dimension raw scores, hard-gate outcomes, regression-slice evidence, bias-stability status |
| `model-benchmark` | Task-conditioned outputs with model/provider identity masked | Mirrored order, model/provider label, price cue, confidence, and style controls | Per-task pairwise scores, calibration evidence, cost joined only after blind quality scoring, selection input |
| `skill-benchmark` | Paired with-skill/without-skill outputs with treatment label masked | Mirrored order, treatment label, executor identity, confidence, and style controls | Paired raw lift evidence, integrity-gate outcome, instability flags, certificate input |

The shared service decides whether the adjudication evidence is bias-stable under its policy. It does not decide whether
a review closes, a council converges, a candidate promotes, or a benchmark changes routing; each mode owns that typed
transition and must reference the service verdict rather than copy or re-reduce its raw scores.

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A single typed service contract supports every named multi-candidate mode without exposing candidate identity to judges.
- **SC-002**: Required A/B and B/A comparisons plus configured counterfactual probes deterministically classify verdicts as stable, unstable, or inconclusive.
- **SC-003**: Every verdict is replayable from retained raw-score and probe events under a versioned reducer and replay fingerprint.
- **SC-004**: Identity leakage, self-scoring, missing probes, order flips, unsupported policies, and insufficient evidence fail closed.
- **SC-005**: Effective-independence evidence remains distinct from seat count and competence weighting; correlated panels cannot claim synthetic certainty.
- **SC-006**: Deep-review, deep-ai-council, deep-improvement, model-benchmark, and skill-benchmark have explicit adapter and evidence contracts.
- **SC-007**: The dark service changes no legacy authority and is ready for phase-008 shadow parity and later per-mode migration.
- **SC-008**: Strict validation reports no errors other than the intentionally deferred generated metadata files.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

The service has `depends_on: []` as an independently authored sibling planning contract. Integration still consumes the
phase-004 ADR and manifest invariants, the phase-006 authorized event envelope and replay fingerprint, and the sibling
sealed-reference interface when available. Those are contract inputs, not justification for weakening this phase's
blinding or raw-evidence requirements. Adjacency to `002-sealed-reference-artifacts` and
`004-hierarchical-typed-budgets` is navigational only.

The highest risk is covert identity leakage through prose, metadata, stable labels, formatting, timing, or cached judge
context. A second risk is false certainty from correlated judges: run-2 requires measured effective independence, and
the Dawid-Skene caution means per-judge competence does not model shared failure causes. Further risks are semantic
damage from over-normalization, reducer suppression of ties or minority evidence, deblinding before finalization, and
consumers bypassing the service to re-aggregate raw scores. Verification therefore uses canary identity fields, content
equivalence fixtures, cloned-seat correlation cases, cycle/tie cases, event replay, and adapter conformance tests.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking for the planning contract. Implementation may choose the opaque-label format, identity-map custody
mechanism, pair-selection optimizer, and reducer family after the phase-006 envelope and phase-005 sealed-artifact
interfaces are fixed. Those choices may not expose provenance during scoring, force a winner from unstable evidence,
discard raw scores, equate competence weighting with independence, or let a consuming mode bypass typed verdict events.
<!-- /ANCHOR:questions -->
