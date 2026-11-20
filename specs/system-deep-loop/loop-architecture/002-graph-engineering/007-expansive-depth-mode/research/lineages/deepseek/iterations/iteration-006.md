# Iteration 6: Frontier node F-2-007 — what a partial fan-out tells the operator

## Focus

Frontier node F-2-007 (depth 2, child of F-1-002): does a partially complete fan-out summary name the failed lineage, its failure class and the exact command to rerun just that lineage?

## Findings

1. **A partial fan-out never reaches synthesis, so the successful lineages are never merged into a report.** `fanout-run.cjs:4969` exits `3` when every lineage failed and `2` when some failed; `deep-research.yaml`'s `step_fanout_spawn` has no `on_failure` branch and its next instruction is "After all lineages complete, jump directly to phase_synthesis" (`:432`). One failed lane therefore stops the parent before `step_fanout_merge`, and the operator gets complete per-lineage artifacts but no consolidated `research.md` or registry. One concrete change: exit `0` with `status: "partial"` (or add `--allow-partial`) when at least one lineage succeeded, and let `phase_synthesis` merge what exists with a banner naming the failed labels. Value: a 2-of-3 fan-out still produces the deliverable it already paid for. Effort M. Risk medium (a partial merge must never read as complete coverage; the banner and summary counters are the guard). [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:4969] [SOURCE: .skilled/commands/deep/assets/deep-research.yaml:432] [SOURCE: .skilled/commands/deep/assets/deep-research.yaml:2073]

2. **The per-lineage result already exists and is thrown away when the summary is written.** `buildPoolSummary` returns `{results, summary}` (`fanout-pool.cjs:977-1001`), and each result carries the lane output and its failure object; `writeOrchestrationSummary` serializes only the aggregate summary plus the fanout-specific fields, which is why the committed `orchestration-summary.json` has counts but no labels. One concrete change: write a reduced `lineages: [{label, status, reason, failure_class, exit_code}]` array from `results` into the summary. Value: the operator's first file answers "which one", with data the process already holds. Effort S. Risk low. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-pool.cjs:977] [SOURCE: specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/review/orchestration-summary.json:1]

3. **The failure-class rollup counts classes but cannot name a command, and the rerun command is not derivable from the summary alone.** The rollup (`buildFailureClassRollup`, `fanout-pool.cjs:998`) counts `quota`, `timeout` and the rest; the exact argv lives in `fanout-config.json`, which the summary does not copy. One concrete change: include `rerun_command` per failed lineage, built from the same `buildLineageDispatch` argv the run used (already available at `:4253`), with prompts replaced by their digest. Value: "what do I type" is answered without reconstructing flags. Effort S. Risk low. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-pool.cjs:998] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:4253]

## Ruled Out

- Requiring a new recovery command: the runner already holds every input a rerun needs, so the fix is serialization, not a new workflow.
- Treating exit 2 as a deliberate safety stop: it protects the merge from partial input but gives the operator no merge at all, which is the opposite of the failure's cost.

## Dead Ends

- Looking for an `on_failure` branch in `step_fanout_spawn`: there is none, so the parent has no partial path to take.

## Edge Cases

- Ambiguous input: "partially complete" could mean some lineages failed or a lineage stopped early. Both are served by the same partial-merge change; the run-level `status` stays `error`/`partial` either way.
- Contradictory evidence: none.
- Missing dependencies: the failed first attempt's summary was not committed; the exit-code and merge path are read from code.
- Partial success: the node's question is answered by findings 1-3.

## Sources Consulted

- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:4253,4969`
- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-pool.cjs:977,998,1001`
- `.skilled/commands/deep/assets/deep-research.yaml:432,2073`
- `specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/review/orchestration-summary.json:1`

## Assessment

- New information ratio: 1.0
- Questions addressed: partial-run summary (frontier node F-2-007)
- Questions answered: yes, the node question: the summary names neither the lineage nor the command, and a partial run cannot reach synthesis at all.

## Reflection

- What worked and why: following the exit code from the pool to the YAML found the missing merge path, which is a larger failure than the summary's missing labels.
- What did not work and why: searching the committed summary for per-lineage fields found none because the writer never serializes `results`.
- What I would do differently: read the writer and the pool return type together first; the discarded `results` array is the whole answer.

## Recommended Next Focus

Close F-2-007 as answered. Next: F-2-008 on dashboard per-node detail, then the restraint and design questions.
