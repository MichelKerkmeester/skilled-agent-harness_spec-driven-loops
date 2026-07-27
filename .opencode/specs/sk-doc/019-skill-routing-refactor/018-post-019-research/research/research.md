---
title: "Deep Research: Post-019 Skill-Routing Frontiers"
description: "Synthesized findings from eight deep-research iterations on fleet routing policy, advisor calibration, causal leaf-use telemetry, fixture validity, paired selection experiments, and privacy-preserving operational evaluation."
trigger_phrases:
  - "post-019 skill routing research"
  - "causal leaf use telemetry"
  - "sealed natural prompt evaluation"
  - "required supplemental routing ablation"
  - "routing evaluation unit"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/018-post-019-research"
    last_updated_at: "2026-07-25T07:47:34Z"
    last_updated_by: "opencode"
    recent_action: "Compiled the canonical synthesis from eight completed iterations"
    next_safe_action: "Use the measurement-first recommendations in a separate implementation packet"
    completion_pct: 100
---
# Deep Research: Post-019 Skill-Routing Frontiers

<!-- SPECKIT_TEMPLATE_SOURCE: deep-research-synthesis | v1 -->

## 1. Metadata

| Field | Value |
|-------|-------|
| Session | `rsr-2026-07-24T18-11-28Z` (generation 1) |
| Iterations | 8 completed of 10 configured; manual stop before iteration 9 execution |
| Executor | `cli-codex` / `gpt-5.6-sol` / reasoning `high` |
| Spec folder | `.opencode/specs/sk-doc/019-skill-routing-refactor/018-post-019-research` |
| Topic | Post-019 skill-routing research frontiers across all 12 skill hubs |
| Key questions | 5/5 answered at the contract or evidence-boundary level |

## 2. Investigation Report

The run tested five linked questions: whether Threshold-Recovery-Provenance (TRP) generalizes across the routing fleet; how advisor confidence should be interpreted and calibrated; what proves actual ordered leaf execution; whether required/supplemental selection beats flat unioning; and whether authored fixtures predict unseen natural prompts. Three additional iterations connected those results into a prompt-free staged estimator, checked whether existing evidence supports fleet-wide reproduction, and designed a privacy-preserving natural-prompt sampling frame.

The investigation used the 12-hub routing inventory, compiled contracts, router metadata, advisor scorer and telemetry schemas, route-gold fixtures, benchmark harnesses, causal-ledger primitives, prior sk-doc blind-routing evidence, and external privacy/governance references. It did not implement routing changes or run a new production-prompt experiment.

<!-- ANCHOR:executive-overview -->
## 3. Executive Overview

**The fleet has a coherent policy model, but not yet a trustworthy operational measurement system.** TRP works as a common selection-policy posture when combined with routing archetypes. Authority is essential, but it is a destination-local verification graph and execution invariant rather than a fourth scalar routing coordinate. [SOURCE: research/iterations/iteration-001.md:16] [SOURCE: research/iterations/iteration-001.md:20]

**Advisor confidence is policy strength, not probability.** The public `0.82` value is produced by categorical floors. On the current 78-row holdout, exact `0.82` covered 20 rows and was correct on 13; the tested `0.78-0.82` confidence and `0.30-0.40` uncertainty grid did not change outcomes. Global threshold tuning is therefore not the next useful intervention. [SOURCE: research/iterations/iteration-002.md:17] [SOURCE: research/iterations/iteration-002.md:19]

**Route proof is not execution proof.** The minimum causal evidence is an immutable route decision, a leaf-originated start acknowledgement, and a terminal finish receipt. These records must share decision, plan, ordinal, causation, idempotency, runtime, and digest identity; success must be recomputed by a verifier. [SOURCE: research/iterations/iteration-003.md:16] [SOURCE: research/iterations/iteration-003.md:20]

**Current fixtures establish coherence and adversarial transfer, not fleet operational accuracy.** The sk-doc blind result (`1/8` deterministic replay versus `8/8` LLM routing) is useful but narrow. Existing route-gold, typed fixtures, and authored holdouts lack a representative, temporally sealed operational sample and a shared causal outcome join. [SOURCE: research/iterations/iteration-005.md:16] [SOURCE: research/iterations/iteration-005.md:38]

**The recommended next program is measurement-first.** Mint a prompt-free evaluation-unit ID before routing, preserve every sampled request including false defer/reject cases, lock blinded gold before outcome joins, and evaluate route validity, causal execution, and task success separately. Only then calibrate risk-stratified auto-routing or compare required/supplemental selection with monolithic unioning.

<!-- /ANCHOR:executive-overview -->

## 4. Core Architecture

- **Fleet shape:** seven multi-mode routers and five singular hubs. Route-selection metrics are meaningful for the former; singular hubs contribute execution and outcome evidence rather than a non-vacuous top-intent selection score.
- **Selection policy:** TRP describes commitment threshold, recovery behavior, and selection/serving provenance. Archetype-specific structure remains necessary for named defaults, ordered bundles, surface bundles, transports, same-packet modes, and singular routes.
- **Authority boundary:** route proof keeps authority withheld until destination-local verification and commit. Selection evidence must never grant execution capability.
- **Causal execution chain:** `route_decision -> leaf_start -> leaf_finish`, with required target order represented by plan ordinals and causation edges rather than wall-clock proximity.
- **Evaluation chain:** `sample/gold -> route decision -> causal leaf execution -> independent task outcome`. Every sampled request remains in the denominator.
- **Privacy boundary:** semantic labeling occurs only inside a trusted research environment. Analysts receive opaque evaluation-unit IDs, locked gold, bounded strata, and joined telemetry, not raw prompts.

## 5. Technical Specifications

| Finding | Settled result |
|---------|----------------|
| TRP decomposition | Valid as a common policy posture; not sufficient without archetype structure and a separate authority graph |
| Advisor `0.82` | Compatibility policy floor, not 82% correctness |
| Current holdout | 57/78 top-1 correct; 61/78 covered; 85.25% selective precision |
| Exact `0.82` slice | 13/20 correct; threshold changes through `0.82` did not alter the selected set |
| Minimum execution proof | Immutable decision plus leaf-originated start plus terminal finish receipt |
| Order proof | Plan ordinals and causation edges; timestamps are diagnostic only |
| Two-tier policy result | UNKNOWN from current evidence; no paired treatment arms, leaf-role gold, or common budget exist |
| Primary ablation metric | Macro required-set recall under equal pair-count and normalized context-cost budgets |
| Fixture validity | Strong for contract coherence and authored transfer; insufficient for prevalence-weighted operational accuracy |
| sk-doc blind evidence | Eight requests evaluated; thirteen scenarios were proposed, not scored |
| Current telemetry join | Not identifiable: recommendation, execution, receipt, and task-outcome stores lack one shared evaluation identity |
| Natural-prompt frame | Consented stratified reservoir in a trusted research environment with split roles and pre-join gold lock |

## 6. Constraints & Limitations

- No comparable joined fleet run exists, so no fleet-wide routing, execution, or end-to-end success rate can be reported.
- The proposed thirteen-scenario instrument has no surviving manifest; only the eight-request result is measured evidence.
- The primary hypothesis path named by the strategy is missing, preventing direct validation against the two claimed surveys.
- Graph convergence remained unavailable because `better-sqlite3` was missing; iteration evidence and file citations remained usable.
- The resource-map reducer emitted a valid document but normalized zero references from the current delta schema. Source evidence therefore remains in the iteration files and Section 13.
- Iterations 9 and 10 were not executed. A dangling iteration-9 start/intent record is retained as audit evidence and followed by a `manualStop` event.
- Numeric risk budgets and sample sizes remain unspecified because no sealed operational cohort exists from which to estimate them.

## 7. Integration Patterns

1. **Routing decision:** mint `evaluation_unit_id` before any route action and commit `decision_id`, `plan_hash`, ordered targets, required/supplemental roles, risk stratum, runtime, and authority state.
2. **Leaf acknowledgement:** the leaf or trusted runtime boundary emits start evidence with actual leaf identity, definition digest, executor, ordinal, attempt, causation, and idempotency identity.
3. **Terminal receipt:** emit bounded status, output/effect digest, and error class. Do not trust an orchestrator-authored success boolean.
4. **Gold lock:** independent labelers and an adjudicator freeze expected routeability, required leaves, supplemental leaves, and authority snapshot before observed route outcomes are joined.
5. **Outcome join:** report route validity over all sampled units, causal execution conditional on correct executable routes, and independent task success conditional on verified execution.
6. **Policy gate:** automatic routing is allowed only when a preregistered risk stratum has enough observations and its conservative correctness lower bound clears the allowed error budget; otherwise clarify or defer.

## 8. Implementation Guide

**P0. Establish the evaluation identity and causal receipt contract.** Extend the existing ledger primitives rather than creating a parallel observability system. Persist one prompt-free evaluation unit through route decisions, required/supplemental plan targets, leaf starts, leaf finishes, and task outcomes.

**P0. Build the sealed operational sampling protocol.** Select an approved prompt source and retention policy; preregister strata, exclusions, sampling seed, gold rubric, budgets, and analysis; seal an opaque cohort manifest before labels or route outcomes are visible.

**P1. Add runtime conformance traces.** Require OpenCode, Claude, CLI, MCP, and remote adapters to project their transport-specific receipts into the same semantic decision/start/finish envelope. Verify leaf-originated acknowledgement and retry/idempotency behavior.

**P1. Run the paired selection ablation.** Independently label required and supplemental leaves, freeze both policies, and compare them under identical pair-count and normalized context-cost budgets. Do not tune budgets after unsealing the evaluation cohort.

**P1. Fit risk-stratified calibration.** Keep public compatibility thresholds stable until joined outcomes exist. Estimate selective error by explicit/inferred route, ambiguity, runtime/freshness, hub/archetype, and effect risk; use conservative lower bounds and count floors.

**P2. Reproduce across the fleet.** Report route-selection performance only for multi-mode hubs, while reporting causal execution and task outcomes for all 12 hubs. Keep singular and multi-mode denominators separate.

## 9. Verification Plan

| Gate | Required evidence |
|------|-------------------|
| Identity propagation | Every sampled unit has one immutable evaluation ID from collection through outcome |
| Causal execution | Every required ordinal has one accepted start and one successful terminal receipt with valid hashes |
| Ordering | Required edges satisfy plan ordinals and causation; retries preserve identity and increment attempt |
| Denominator integrity | False route, false defer, reject, failed dispatch, and failed task rows remain represented |
| Gold blindness | Gold labels and authority snapshot are locked before telemetry join |
| Privacy | Raw prompts remain inside the trusted environment; releases pass disclosure review |
| Paired ablation | Both policies run on the same sealed rows under equal frozen budgets |
| Calibration | Reliability and selective-risk reports include counts, intervals, and per-stratum lower bounds |
| Fleet reporting | Multi-mode route selection is separated from singular-hub execution/outcome metrics |

## 10. Acceptance Matrix

| Workstream | Acceptance criterion |
|------------|---------------------|
| Evaluation contract | Route, execution, and task records join deterministically without timestamp matching or raw prompts |
| Runtime parity | Each supported runtime emits one conforming success trace and bounded failure/retry traces |
| Sampling frame | Consent/authority, retention, exclusions, strata, manifest seal, role separation, and release controls are approved |
| Required/supplemental experiment | Paired macro required-set recall and exact-required coverage reported with intervals and equal budgets |
| Advisor calibration | No probability claim is derived directly from post-floor confidence; per-stratum estimates use sealed outcomes |
| External validity | Natural-prompt results include sampling-frame limitations and selection-bias diagnostics |
| Auditability | All claims link to immutable cohort, policy, authority-snapshot, gold, and receipt hashes |

## 11. Recommendations

1. Do not tune global confidence thresholds from the current fixture corpus; the tested range is behaviorally saturated.
2. Treat `0.82` as a policy-strength label in operator-facing surfaces until a separately fitted empirical probability is available.
3. Implement the prompt-free evaluation unit and causal leaf receipts before running another fleet routing benchmark.
4. Run the required/supplemental ablation only after independent role labeling and equal budget definitions are frozen.
5. Preserve every sampled request in the denominator so abstentions and failed dispatches cannot disappear from operational estimates.
6. Use a trusted research environment with split sampling, labeling, and analysis roles for natural-prompt gold.

## Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|----------|-------------------|----------|--------------|
| Authority as a fourth scalar routing coordinate | Authority is destination-relative and withheld until verification; it is better represented as a graph and execution invariant | `iteration-001.md:20` | 1 |
| One non-degenerate TRP tuple for every hub | Singular and bundle/transport archetypes require different structural cardinality | `iteration-001.md:16-20` | 1 |
| Treat exact `0.82` as 82% correctness | Multiple branches collapse to the same floor and the observed slice was 13/20 | `iteration-002.md:17-19` | 2 |
| Tune only global confidence/uncertainty thresholds | The tested grid produced identical decisions through the compatibility boundary | `iteration-002.md:19` | 2 |
| Recommendation acceptance as success | Acceptance does not prove leaf execution or task completion | `iteration-002.md:23` | 2, 6 |
| Route proof, exit zero, or artifact presence as execution proof | None provides a leaf-originated start and terminal causal receipt | `iteration-003.md:16-24` | 3 |
| Timestamps as ordering or join keys | Clock skew, concurrency, retries, and repeated prompts make proximity ambiguous | `iteration-003.md:22`; `iteration-006.md:20` | 3, 6 |
| Infer a two-tier win from current schemas | Current data has one flat policy, no leaf roles, and no common budget | `iteration-004.md:17-25` | 4 |
| Leaf count as the only route budget | Resource context costs vary materially | `iteration-004.md:23` | 4 |
| Authored T2/T3 fixtures as operational prevalence estimates | Independent authoring reduces leakage but does not create representative sampling | `iteration-005.md:22-32` | 5 |
| Pool all 12 hubs into one top-intent accuracy | Selection is vacuous for singular hubs and would inflate the fleet denominator | `iteration-007.md:18` | 7 |
| Treat 13 as the denominator of the 8/8 result | Eight was measured; thirteen was only a proposed future instrument | `iteration-007.md:22` | 7 |
| Raw prompt hashes as de-identification | Short semantic prompts remain guessable and hashes do not support blind labeling | `iteration-008.md:45-49` | 8 |
| Synthetic or differentially private prompts as natural-prompt gold | They alter the target distribution; use them only for release/stress-test controls | `iteration-008.md:45-49` | 8 |

## Divergence Map

No divergent pivots were recorded. Saturated directions: none. Completed pivots: 0; failed pivots: 0; audited overrides: 0. The loop broadened sequentially from policy structure to calibration, causal execution, comparative selection, external validity, joined outcomes, fleet reproduction, and privacy-preserving sampling. The remaining frontier is the unexecuted measurement program in Section 12.

## 12. Open Questions

- Which operational prompt source has sufficient consent or organizational authority, and what retention window is acceptable?
- What per-hub, archetype, risk, and runtime sample sizes bound false-route, false-defer, causal-execution, and task-failure rates?
- Can every supported runtime emit evaluation-unit, decision, start, finish, and outcome records without prompt text?
- What numeric pair-count and normalized context-cost budgets are feasible for each routing archetype?
- How much selection bias is introduced by opt-in, safety exclusions, and redaction?
- Where did the unsupported thirteen-scenario instrument count originate?
- Can the missing primary hypothesis/survey source be recovered or reconstructed with provenance?

## 13. Sources & References

- Iteration narratives: `research/iterations/iteration-001.md` through `iteration-008.md`
- Fleet contracts: `.opencode/skills/*/{hub-router.json,mode-registry.json,leaf-manifest.json,graph-metadata.json}`
- Compiled contract schema: `.opencode/specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/003-contract-schemas/`
- Advisor scoring and telemetry: `.opencode/skills/system-skill-advisor/mcp-server/lib/scorer/` and `lib/metrics.ts`
- Causal receipt primitives: `.opencode/skills/system-deep-loop/runtime/lib/receipts-and-effect-recovery/`
- Typed route-gold and benchmark evidence: `.opencode/specs/sk-doc/019-skill-routing-refactor/013-benchmark-harness-typed-wiring/`
- Skill-benchmark authoring and evaluation: `.opencode/skills/system-deep-loop/deep-improvement/references/skill-benchmark/` and `scripts/skill-benchmark/`
- ONS Secure Research Service: `https://www.ons.gov.uk/aboutus/whatwedo/statistics/requestingstatistics/secureresearchservice/aboutthesecureresearchservice`
- OSF registrations: `https://help.osf.io/article/330-welcome-to-registrations`
- NIST de-identification guidance: `https://csrc.nist.gov/pubs/sp/800/188/final`
- NIST PETs testbed: `https://www.nist.gov/itl/applied-cybersecurity/privacy-engineering/pets-testbed`

## 14. Iteration Trail

| Iter | Focus | Ratio | Status | Key outcome |
|-----:|-------|------:|--------|-------------|
| 1 | TRP and authority across routing archetypes | 0.85 | complete | TRP retained; authority separated as graph/invariant |
| 2 | Advisor confidence calibration | 0.72 | complete | `0.82` classified as policy floor; risk-stratified joined calibration proposed |
| 3 | Minimum causal leaf telemetry | 0.78 | complete | Decision/start/finish proof chain and verifier predicate defined |
| 4 | Two-tier versus monolithic selection | 0.68 | complete | Current effect unidentifiable; paired budget-matched ablation specified |
| 5 | Authored fixtures versus natural prompts | 0.76 | complete | Coherence/transfer evidence separated from operational validity |
| 6 | Joined route, execution, and task outcomes | 0.74 | complete | Prompt-free staged evaluation unit defined; existing stores found unjoinable |
| 7 | Fleet reproduction and 8-versus-13 provenance | 0.67 | complete | No joined fleet run; eight measured, thirteen proposed |
| 8 | Privacy-preserving sealed sampling | 0.71 | complete | Trusted-environment reservoir, split roles, and pre-join gold lock specified |

## 15. Convergence Report

- Stop reason: `manualStop`
- Total completed iterations: 8 of 10 configured
- Questions answered: 5 / 5 original strategy questions
- Remaining questions: 7 follow-up measurement and governance questions in Section 12
- Last 3 iteration summaries: run 6 joined outcomes (`0.74`) | run 7 fleet reproduction (`0.67`) | run 8 sealed sampling (`0.71`)
- Convergence threshold: `0.05`; observed ratios remained `0.67-0.85`, so the run did not converge by novelty threshold
- Graph convergence: unavailable/blocked because runtime dependency `better-sqlite3` was missing
- Divergence summary: no pivots recorded
- State integrity: eight iteration files and eight delta files are present; iteration 9 has start/intent evidence only and is not counted as completed

## 16. Next Steps

1. Create a separate implementation packet for the prompt-free evaluation-unit and causal receipt contract.
2. Obtain privacy/legal approval for an operational prompt source, retention policy, and trusted-environment workflow.
3. Preregister the natural-prompt cohort, gold-label protocol, risk strata, budgets, and analysis before collecting route outcomes.
4. Add cross-runtime conformance traces and persist the currently dormant execution-outcome record under the shared identity.
5. Run the paired required/supplemental ablation and the fleet operational study only after the measurement gates pass.

## 17. References

Canonical synthesis: this file. Reducer outputs: `research/findings-registry.json`, `research/deep-research-dashboard.md`, and `research/deep-research-strategy.md`. Resource-map output: `research/resource-map.md` (zero normalized references; source citations remain above). State: `research/deep-research-state.jsonl`. Immutable evidence: `research/iterations/iteration-001.md` through `iteration-008.md` and `research/deltas/iter-001.jsonl` through `iter-008.jsonl`.
