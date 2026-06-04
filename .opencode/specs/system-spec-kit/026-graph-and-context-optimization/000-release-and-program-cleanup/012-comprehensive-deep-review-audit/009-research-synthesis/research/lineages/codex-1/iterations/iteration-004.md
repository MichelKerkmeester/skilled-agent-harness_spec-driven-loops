# Iteration 004: Analyze deep-loop fanout blast radius and artifact suspectness.

## Focus

Analyze deep-loop fanout blast radius and artifact suspectness.

## Findings

1. The fanout runner has a real orchestration bug: runCappedPool is fed workers that call spawnSync, so the event loop is blocked and practical concurrency collapses despite a concurrency cap. [SOURCE: .opencode/skills/deep-loop-runtime/bin/fanout-run.cjs:344]
2. Failure accounting is unsound: the worker returns an object containing exitCode, but pool success counts fulfilled worker promises, not successful subprocess exits. [SOURCE: .opencode/skills/deep-loop-runtime/bin/fanout-run.cjs:362] [SOURCE: .opencode/skills/deep-loop-runtime/src/fanout-pool.cjs:207]
3. The per-lineage iterations field is documented as a max-iteration override, but the runner only uses it to size timeout, so loop length can drift from requested lineage budgets. [SOURCE: .opencode/skills/deep-loop-runtime/src/executor-config.ts:292] [SOURCE: .opencode/skills/deep-loop-runtime/bin/fanout-run.cjs:154]
4. The current eight-slice audit artifacts are less suspect than a true multi-lineage fanout because each slice summary shows one CLI lineage, one total, one succeeded, zero failed. Multi-lineage research synthesis artifacts still need exit-code-level checking. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/009-research-synthesis/research/lineages/codex-1/evidence/orchestration-summary.tsv:2]

## Sources Consulted

- .opencode/skills/deep-loop-runtime/bin/fanout-run.cjs:154
- .opencode/skills/deep-loop-runtime/bin/fanout-run.cjs:344
- .opencode/skills/deep-loop-runtime/bin/fanout-run.cjs:362
- .opencode/skills/deep-loop-runtime/src/fanout-pool.cjs:207
- .opencode/skills/deep-loop-runtime/src/executor-config.ts:292
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/009-research-synthesis/research/lineages/codex-1/evidence/orchestration-summary.tsv:2

## Assessment

Question 5 answer: blast radius is high for any artifact relying on multi-lineage fanout counts, concurrency, or iteration budgeting. The eight source review slices are not automatically invalidated, but their orchestrator summaries alone cannot prove subprocess success.

## Reflection

The research synthesis itself is running inside the exact fanout surface, so lineage-local validation matters more than parent orchestration claims.

## Recommended Next Focus

Run a final negative-knowledge pass and synthesize recommendations.

## Iteration Metrics

- Status: complete
- Findings count: 4
- New information ratio: 0.38
- Novelty justification: Separated fanout runner defects from current eight-slice audit artifact reliability.
