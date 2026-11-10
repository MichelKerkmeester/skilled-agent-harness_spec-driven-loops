# Iteration 7: Stop-contract reconciliation and measurement order

## Focus
Synthesize the five answered speed questions into an evidence-backed next-measurement queue, and compare the executable workflow's stop decision with the convergence reference. Iteration 6 recommended synthesis; the current lineage still has no small-runner measurement, per-case or per-file timing breakdowns, or import-phase profile.

## Actions Taken
1. Compared the live deep-research workflow's all-questions-answered branch with the convergence reference and quality-guard catalog.
2. Re-read the current strategy, the prior iteration's synthesis recommendation, and the packet's implementation and task records.
3. Checked the test-cycle totals cited by the user against the packet's task and implementation records before consolidating priorities.

## Findings
1. The live workflow nominates STOP when no key questions remain, before its composite-vote branch, and then calls checkQualityGuards; the convergence reference separately says every non-terminal STOP must pass a low-novelty gate. The quality-guard catalog names source diversity, focus alignment, and weak-source checks but does not explain how low novelty is enforced on the all-questions-answered branch. The sources therefore leave the legal-stop contract ambiguous. This run will preserve the mismatch and use the workflow YAML's stated decision order; it cannot claim that a distinct low-novelty gate passed based on the available text. [SOURCE: .skilled/commands/deep/assets/deep-research-auto.yaml:774-825] [SOURCE: .skilled/skills/system-deep-loop/deep-research/references/convergence/convergence.md:114-146] [SOURCE: .skilled/skills/system-deep-loop/deep-research/feature-catalog/convergence/quality-guards.md:17-27]
2. The packet gives two different lower bounds for the completed spec-kit test cycle: tasks.md records 841 and 911 seconds, while implementation-summary.md reports 834 to 911 seconds. The dispatch topic uses 841 to 911 seconds. Until the original run records are compared, use the range provenance explicitly and do not claim that the minimum is reconciled. [SOURCE: specs/system-speckit/runtime-and-release/006-test-cycle-speed/001-five-cuts/tasks.md:60-61] [SOURCE: specs/system-speckit/runtime-and-release/006-test-cycle-speed/001-five-cuts/implementation-summary.md:58-61] [SOURCE: specs/system-speckit/runtime-and-release/006-test-cycle-speed/001-five-cuts/research/lineages/luna-max/deep-research-config.json:2]
3. The next optimization work should start with measurements at each expensive boundary: per-case setup/reset/subprocess/validation timing for the roughly 400-second upgrade-legacy file, per-file timing for the 12-file serial group that contributes about 265 seconds, and an import-phase profile for the roughly 302-second spec-kit core import cost. Then compare worker caps on the actual CI runner. These measurements rank the investigation; they do not establish a safe code change or expected saving. [SOURCE: specs/system-speckit/runtime-and-release/006-test-cycle-speed/001-five-cuts/implementation-summary.md:71-83] [SOURCE: specs/system-speckit/runtime-and-release/006-test-cycle-speed/001-five-cuts/research/lineages/luna-max/iterations/iteration-006.md:12-15] [SOURCE: specs/system-speckit/runtime-and-release/006-test-cycle-speed/001-five-cuts/research/lineages/luna-max/deep-research-strategy.md:258-267]
4. The existing evidence does not support enabling CLI ledger caching or changing gateway rescans: elapsed scan cost is unmeasured, and the cross-process freshness and fencing behavior remains part of the runtime contract. Keep this candidate behind a workload profile and explicit stale-read, append-visibility, and projection-parity checks; preserve every collected file and assertion for test-only work. [SOURCE: specs/system-speckit/runtime-and-release/006-test-cycle-speed/001-five-cuts/research/lineages/luna-max/iterations/iteration-005.md:11-18] [SOURCE: specs/system-speckit/runtime-and-release/006-test-cycle-speed/001-five-cuts/implementation-summary.md:81-83]

## Questions Answered
- None in this iteration. The reducer already marks all five tracked key questions answered.

## Questions Remaining
- No original key questions remain. The per-case, per-file, import-phase, gateway-cost, and small-runner measurements remain unavailable; these are evidence gaps, not reopened key questions.

## Next Focus
Continue the workflow stop decision without treating the documentation mismatch as a user question. If the executable decision order allows STOP, synthesize the unresolved contract and timing-provenance limits. If it cannot establish a legal stop, continue through the configured maximum of 10 iterations.

## Ruled Out
- Assuming the all-questions-answered STOP branch proves that the separate low-novelty rule passed.
- Treating the packet's 834-second and 841-second lower bounds as interchangeable without checking run records.

## Dead Ends
- Source-text timing totals alone cannot choose an implementation change or establish savings; the next useful evidence is a controlled profile of the corresponding workload.

## Edge Cases
- Ambiguous input: none; the focus follows iteration 6's recommendation to consolidate evidence.
- Contradictory evidence: the workflow YAML's all-questions-answered STOP decision and the reference's separate low-novelty gate are not reconciled; the packet also reports different minimum test-cycle timings.
- Missing dependencies: original raw run records and runtime gate output are not available in this lineage.
- Partial success: the measured priorities and source-backed stop ordering are consolidated, but the separate low-novelty enforcement and exact minimum runtime remain unresolved.

## Sources Consulted
- .skilled/commands/deep/assets/deep-research-auto.yaml:774-825
- .skilled/skills/system-deep-loop/deep-research/references/convergence/convergence.md:114-146
- .skilled/skills/system-deep-loop/deep-research/feature-catalog/convergence/quality-guards.md:17-27
- specs/system-speckit/runtime-and-release/006-test-cycle-speed/001-five-cuts/tasks.md:60-61
- specs/system-speckit/runtime-and-release/006-test-cycle-speed/001-five-cuts/implementation-summary.md:58-83
- specs/system-speckit/runtime-and-release/006-test-cycle-speed/001-five-cuts/research/lineages/luna-max/iterations/iteration-005.md:11-18
- specs/system-speckit/runtime-and-release/006-test-cycle-speed/001-five-cuts/research/lineages/luna-max/iterations/iteration-006.md:12-15
- specs/system-speckit/runtime-and-release/006-test-cycle-speed/001-five-cuts/research/lineages/luna-max/deep-research-strategy.md:258-267
- specs/system-speckit/runtime-and-release/006-test-cycle-speed/001-five-cuts/research/lineages/luna-max/steer.md (checked; absent)

## Assessment
- New information ratio: 0.625 (two findings are new contract/baseline discrepancies, one is a partial synthesis, and one repeats prior evidence).
- Questions addressed: none.
- Questions answered: none; all five tracked key questions were already answered.

## Reflection
- What worked and why: comparing the YAML branch with the convergence reference surfaced an enforcement ambiguity that would be hidden by reporting only the reducer's 5/5 question coverage.
- What did not work and why: repository text does not show whether a separate runtime implementation adds the low-novelty check, and the raw run artifacts needed to reconcile 834 versus 841 seconds are absent.
- What I would do differently: inspect emitted gate results and original timing artifacts before claiming that either discrepancy is resolved.

## Recommended Next Focus
Proceed to the next workflow stop evaluation. Keep both discrepancies visible in synthesis; if the legal-stop rule remains unproven, continue to the max-iteration boundary rather than inventing a passing gate.
