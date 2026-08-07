# Iteration 6: Joining generalization gaps to causal leaf use

## Focus

Determine whether fixture-to-natural routing-score gaps can be joined to the three-stage causal leaf-use envelope from iteration 3, so evaluation measures successful use and task outcome rather than stopping at route selection.

## Actions Taken

1. Re-read the iteration-3 causal envelope and iteration-5 fixture-validity boundary as the two sides of the proposed join.
2. Inspected advisor recommendation-outcome and execution-outcome schemas for a shared request, decision, plan, or leaf identity.
3. Traced the advisor calibration reducer, the D4-R task-outcome instrument, the model-benchmark digest envelope, and the destination receipt contract.
4. Derived a prompt-free staged evaluation unit and tested it against false-route, false-defer, failed-dispatch, retry, supplemental-leaf, and task-failure cases.

## Findings

### 1. The join is feasible in principle, but the current stores are not joinable

Iteration 3 already defines the causal side: an immutable decision, a leaf-originated start, and a terminal finish receipt joined by decision, plan, ordinal, causation, and idempotency identity. It also establishes that raw prompts are unnecessary for leaf attribution. [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/018-post-019-research/research/iterations/iteration-003.md:20] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/018-post-019-research/research/iterations/iteration-003.md:26]

The advisor acceptance record contains timestamp, runtime, accepted/corrected/ignored, and skill label, but deliberately omits prompt, scenario, expected skill, and any event or decision key. The separate execution record adds skill id, success, event id, failure mode, and bounded context tags. It still lacks decision id, plan hash, leaf identity, ordinal, causation id, prompt-provenance stratum, and gold route. Repository search found its constructor and validator, but no persistence or evaluation consumer. Therefore timestamp/runtime/skill joins would be ambiguous under concurrency, retry, correction, and repeated prompts. [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/schemas/advisor-tool-schemas.ts:325] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/metrics.ts:81] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/metrics.ts:107] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/metrics.ts:523]

### 2. Use one prompt-free evaluation unit across three sequential stages

Each sampled request needs a random evaluation unit id minted before routing and propagated without semantic meaning. A separate provenance block records fixture versus natural, fixture tier or natural sampling frame, capture epoch, hub/archetype/risk/runtime strata, and a keyed, rotating prompt digest when deduplication is required. A plain prompt hash is insufficient privacy for short or guessable prompts; the join key should be random, while any content-derived key is access-controlled and epoch-scoped. The existing model-benchmark envelope shows that prompt digests can coexist with correlation, causation, idempotency, and stream sequence without storing prompt text. [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/model-benchmark-ledger-schema/model-benchmark-ledger-schema.ts:74] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/model-benchmark-ledger-schema/model-benchmark-ledger-schema.ts:324] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/model-benchmark-ledger-schema/model-benchmark-ledger-schema.ts:1185]

The evaluation unit must survive every route action, including defer, clarify, reject, and misroute. Correctly selected routes then attach the iteration-3 decision/plan chain; completed chains attach an independently graded task outcome or bounded outcome receipt. This produces three estimands:

- route validity: expected route or correct defer versus observed decision;
- causal execution: verified required-leaf success conditional on a correct executable route;
- end-to-end task success: task success over every sampled evaluation unit, not only dispatched units.

The staged identity is more useful than one success boolean because it localizes the fixture-to-natural gap. For each stratum, report selection probability, verified-execution probability conditional on correct selection, and task-success probability conditional on verified execution; their product is the unconditional end-to-end success rate.

### 3. Preserve the all-request denominator or the natural gap will be biased downward

Joining only successful or dispatched routes creates survivor bias: natural prompts that false-defer, false-reject, or misroute never reach leaf telemetry and disappear from the denominator. The route-decision record must therefore be terminal even when no leaf runs, and absent causal receipts must be classified as not-applicable after a correct non-executable decision or as execution failure after a committed executable decision. Supplemental-leaf failures remain separate from required-leaf success, matching iteration 3's verifier rule. [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/018-post-019-research/research/iterations/iteration-003.md:22] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/018-post-019-research/research/iterations/iteration-003.md:24]

The same unit also separates four operational failure classes: wrong route, correct route but incomplete causal envelope, causally complete leaf use but failed task, and end-to-end success. That is the missing bridge between iteration 5's external-validity question and iteration 3's execution proof.

### 4. Existing feedback and D4-R instruments are components, not the joined estimator

Advisor feedback calibration aggregates accepted/corrected/ignored by skill or scorer lane and proposes shadow weight deltas. It has no natural-versus-fixture provenance or causal execution join, so it measures recommendation pressure rather than operational correctness. [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/scorer/feedback-calibration.ts:113] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/scorer/feedback-calibration.ts:171]

D4-R provides the needed independent task-outcome stage by grading skill-on/off scenario pairs, but it is scenario-keyed, authored, and explicitly stamped with approximate attribution. It can validate the terminal outcome instrument; it cannot by itself prove that the intended leaf actually ran or estimate natural-prompt prevalence. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/d4-ablation.cjs:177] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/d4-ablation.cjs:182] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/d4-ablation.cjs:202]

## Questions Answered

- **Can fixture-to-natural score gaps be joined to causal leaf-use telemetry rather than stopping at route selection?** Yes at the contract level. Mint one prompt-free evaluation unit before routing, carry it through the immutable route decision and verified leaf receipts, and attach an independent task outcome. No current fleet result can be computed yet because acceptance telemetry, execution outcomes, D4-R scenarios, and causal receipts do not share that identity.

## Questions Remaining

- Can every supported runtime emit the evaluation unit plus the three-stage leaf envelope without raw prompts?
- Which privacy-preserving natural-prompt sampling frame can mint provenance strata and retain blinded gold labels?
- What per-hub, archetype, risk, and runtime sample sizes bound false-route, false-defer, causal-execution, and end-to-end task-failure rates?
- Does the staged join reproduce the sk-doc blind result across the other 11 hubs, and does it resolve the reported eight-versus-thirteen corpus discrepancy?
- Can the dormant execution-outcome record be persisted and linked without weakening the existing prompt-safety invariant?
- The missing primary hypothesis file still prevents direct comparison with the two claimed post-019 surveys.

## Assessment

- newInfoRatio: 0.74
- Novelty justification: Prior iterations separately established a fixture-validity gap and a causal leaf-use envelope. This pass found the dormant execution-outcome record, proved the stores lack a safe common key, and derived an all-request staged join that preserves route failures instead of conditioning them away.
- Confidence: High on the schema gap and staged estimator; medium on fleet feasibility until each runtime adapter emits a conforming trace.

## Reflection

What worked: joining schema inspection with failure-denominator analysis exposed why recommendation acceptance, causal execution, and task outcome must remain distinct but share one evaluation identity.

What failed: no existing end-to-end trace or persistent execution-outcome consumer was found, so the proposed join cannot be evaluated from current telemetry.

Ruled out: timestamp/runtime/skill joins, success-only denominators, producer-supplied success booleans, and treating D4-R or recommendation acceptance as execution proof.

## Next Focus

Test runtime feasibility: map the evaluation-unit and decision/plan fields onto OpenCode/Copilot, Claude, CLI, MCP, and remote adapter boundaries, then identify the smallest conformance trace each can emit without raw prompts.

