# Iteration 7: Fleet-wide staged-join reproduction and corpus provenance

## Focus

This iteration tested whether the prompt-free staged join from iteration 6 can reproduce the sk-doc blind-routing result across the other eleven hubs, and whether joining route, causal leaf-use, and task-outcome evidence resolves the reported eight-versus-thirteen corpus discrepancy.

## Actions Taken

1. Reconstructed the twelve-hub fleet as seven multi-mode routers and five singular hubs, preserving the routing-archetype distinction.
2. Traced the sk-doc 8/8 claim to its measured prompt set and compared it with the later 13-scenario instrument statement.
3. Inventoried live hub contracts, blind/holdout playbooks, compiled-routing reports, and staged-join identity/outcome fields.
4. Compared the generalization note with the packet's still-open sealed-corpus requirements and acceptance tasks.

## Findings

1. **The staged join does not reproduce the sk-doc result across the fleet because no comparable joined fleet run exists.** The sk-doc evidence scores three routers on the same requests and reports correct top-intent recall for eight blind natural phrasings; it does not record a shared evaluation-unit identity, a leaf-originated completion receipt, or a downstream task outcome. The other eleven hubs therefore cannot be compared on the iteration-6 end-to-end estimand from current artifacts. [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/013-benchmark-harness-typed-wiring/design/generalization-findings.md:8] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/013-benchmark-harness-typed-wiring/design/generalization-findings.md:15] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/018-post-019-research/research/iterations/iteration-006.md:18]

2. **The fleet denominator must separate route-selection and execution estimands.** Seven hubs have multi-mode selection, while five are singular. A singular hub cannot reproduce a top-intent routing score in the same sense because its internal selection cardinality is one; it can still be evaluated for causally attributable leaf completion and task outcome. Pooling all twelve into one route-accuracy denominator would make the singular strata vacuous and inflate apparent fleet performance. [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/018-post-019-research/research/iterations/iteration-001.md:16] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/003-contract-schemas/spec.md:55]

3. **Existing blind playbooks are useful coverage evidence, not a fleet reproduction.** Multi-mode hubs such as mcp-tooling now carry blind holdouts and report routing success, but the playbook also records remediation-era vocabulary bindings as blind exceptions. These cases are authored regression instruments, and their result surfaces stop at expected route/resource assembly rather than the three-stage causal leaf envelope plus task outcome. [SOURCE: .opencode/skills/mcp-tooling/manual-testing-playbook/manual-testing-playbook.md:21] [SOURCE: .opencode/skills/mcp-tooling/manual-testing-playbook/manual-testing-playbook.md:68] [SOURCE: .opencode/skills/mcp-tooling/mcp-click-up/manual-testing-playbook/intra-routing-recall/holdout-daily.md:18]

4. **The eight-versus-thirteen discrepancy is a provenance/status mismatch, not two competing measurements.** The table reports a completed eight-request comparison: deterministic replay 1/8 and live LLM interpretation 8/8. The later sentence calls thirteen scenarios an instrument to run in the future; the current packet contains no corresponding thirteen-scenario corpus or per-scenario results. Its authoritative plan instead leaves a 60–80-scenario sealed corpus unchecked. The only supported interpretation is “eight evaluated, thirteen proposed”; the membership and origin of the proposed thirteen remain untraceable. [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/013-benchmark-harness-typed-wiring/design/generalization-findings.md:11] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/013-benchmark-harness-typed-wiring/design/generalization-findings.md:40] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/013-benchmark-harness-typed-wiring/tasks.md:81] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/013-benchmark-harness-typed-wiring/spec.md:160]

5. **A retroactive staged join is not identifiable.** Without a common evaluation-unit key and independent route-decision, leaf-start, leaf-finish, and task-outcome records, timestamps or hub labels cannot recover causal attribution. Reproduction requires a new preregistered run: preserve false-route and false-defer rows, stratify by hub/archetype/risk/runtime, and use the same prompt-free evaluation-unit id across all stages. [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/018-post-019-research/research/iterations/iteration-006.md:20] [SOURCE: .opencode/specs/sk-doc/019-skill-routing-refactor/018-post-019-research/research/iterations/iteration-006.md:30]

## Questions Answered

- **Does the staged join reproduce the sk-doc blind result across the other eleven hubs?** No. Current fleet evidence is not joined at the evaluation-unit level and is not comparable across route-selection and singular-hub strata.
- **Does it resolve the eight-versus-thirteen corpus discrepancy?** Yes at the claim-status level: eight requests were evaluated; thirteen were only named as a future instrument. It does not recover the missing thirteen-scenario membership or provenance.

## Questions Remaining

- Can every supported runtime emit the evaluation-unit id plus route decision, leaf start, leaf finish, and task outcome without retaining raw prompts?
- What per-hub, archetype, risk, and runtime sample sizes bound false-route, false-defer, causal-execution, and end-to-end task-failure rates?
- Which privacy-preserving sampling frame can provide temporally sealed natural prompts and blinded gold labels?
- Where did the unsupported thirteen-scenario instrument count originate, and were five additional prompts ever authored outside the surviving packet?

## Ruled Out

- Treating the reported 13 as the denominator of the 8/8 result. The source grammar, absent corpus, and unchecked 60–80-scenario requirement show that 13 was prospective, not scored.
- Pooling singular and multi-mode hubs into one top-intent recall estimate. Singular hubs contribute execution/outcome evidence, not a non-vacuous internal route-selection test.
- Retroactively joining existing artifacts by timestamp, hub, or skill label.

## Sources Consulted

- .opencode/specs/sk-doc/019-skill-routing-refactor/013-benchmark-harness-typed-wiring/design/generalization-findings.md
- .opencode/specs/sk-doc/019-skill-routing-refactor/013-benchmark-harness-typed-wiring/spec.md
- .opencode/specs/sk-doc/019-skill-routing-refactor/013-benchmark-harness-typed-wiring/plan.md
- .opencode/specs/sk-doc/019-skill-routing-refactor/013-benchmark-harness-typed-wiring/tasks.md
- .opencode/skills/*/hub-router.json
- .opencode/skills/*/mode-registry.json
- .opencode/skills/*/leaf-manifest.json
- .opencode/skills/*/manual-testing-playbook/**
- .opencode/skills/*/benchmark/**

## Assessment

- New information ratio: 0.67
- Novelty justification: this iteration converted a suspected denominator discrepancy into a measured-versus-proposed provenance mismatch, established why the fleet reproduction is currently non-identifiable, and separated route-selection from singular-hub execution strata.
- Confidence: high that no comparable joined fleet result exists in the inspected tree; high that 13 is not the denominator of 8/8; medium on the historical origin of 13 because no scenario manifest survives beside the claim.

## Reflection

- What worked: joining packet acceptance state, live hub inventories, and the exact wording of the generalization note separated completed evidence from planned instrumentation.
- What failed: repository evidence cannot reconstruct the proposed thirteen-scenario membership or retroactively mint causal join keys.

## SCOPE VIOLATIONS

- The normal workflow would refresh reducer-owned strategy, registry, dashboard, and progressive synthesis files. Those mutations are outside this leaf's allowed write set and were not executed.

## Next Focus

Test whether every supported runtime can emit the prompt-free evaluation unit and ordered decision/start/finish/outcome envelope, then derive the smallest fleet matrix that keeps route-selection and singular-hub execution strata statistically separate.
