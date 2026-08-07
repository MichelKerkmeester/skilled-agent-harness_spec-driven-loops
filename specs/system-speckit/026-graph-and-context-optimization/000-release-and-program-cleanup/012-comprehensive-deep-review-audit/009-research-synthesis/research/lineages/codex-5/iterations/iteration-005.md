# Iteration 5: Deep-Loop and Catalog/Playbook Blast Radius

## Focus
Quantify whether deep-loop runtime findings can make prior audit outputs suspect, and connect catalog/playbook drift to the broader source-of-truth pattern.

## Findings

1. The fan-out pool treats a worker as fulfilled when the async worker returns normally [SOURCE: file:.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs:85]. The pool summary counts fulfilled results as succeeded [SOURCE: file:.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs:207].

2. `fanout-run.cjs` uses `spawnSync` inside the worker [SOURCE: file:.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:344]. It computes `exitCode` from the subprocess status but returns `{ label, exitCode, timedOut, salvage }` instead of throwing on non-zero exit [SOURCE: file:.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:362]. Therefore a failed child CLI can still be counted as a fulfilled worker item.

3. The same worker is launched inside a capped pool [SOURCE: file:.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:307], but because each worker blocks synchronously in `spawnSync`, the event loop cannot pump more workers while a child process is running. The concurrency cap is structurally under-delivered.

4. Lineage `iterations` is documented as a per-lineage max-iteration override [SOURCE: file:.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts:290]. In the runner it only sizes the full-loop timeout [SOURCE: file:.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:154], so lineage iteration bounds are not passed into the prompt or loop config.

5. The eight review slice orchestration summaries in this packet each report `total_cli_lineages=1`, `succeeded=1`, and `failed=0`, even though each slice has five lineage report files. That means the summaries are not reliable as campaign-level lineage accounting; the individual lineage reports are the safer evidence surface [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/001-mcp-core/review/orchestration-summary.json].

6. Catalog/playbook drift reinforces the same source-of-truth problem seen in iteration 1. The playbook release gate expects 380 scenario files [SOURCE: file:.opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:166], while the current scenario-file count under category folders is 384 [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/009-research-synthesis/research/lineages/codex-5/logs/evidence-counts.md:26]. The local-LLM catalog category points operators at `40*.md` scenario specs [SOURCE: file:.opencode/skills/system-spec-kit/feature_catalog/local-llm-query-intelligence/category-overview.md:47], while the files are numbered 361-375 [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/009-research-synthesis/research/lineages/codex-5/logs/evidence-counts.md:35].

## Sources Consulted
- `.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs`
- `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs`
- `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts`
- `007-interconnected-mcps/review/deep-review-findings-registry.json`
- `001-008/review/orchestration-summary.json`
- `.opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md`
- `.opencode/skills/system-spec-kit/feature_catalog/local-llm-query-intelligence/category-overview.md`

## Assessment
newInfoRatio: 0.18

Novelty justification: most facts were known from review; this iteration added blast-radius linkage to the current audit's summaries and final convergence.

Confidence: high. The fan-out success-count bug follows directly from worker return semantics; the summary mismatch is visible in the packet artifacts.

## Reflection
Worked: pairing runtime code with current packet summaries identified which artifacts are suspect.

Failed: the exact number of prior masked child failures remains unknown without replaying historical stdout and status logs.

Ruled out: "orchestration summary success proves lineage success." The summary can succeed when the returned payload includes a failed child exit.

## Recommended Next Focus
Synthesis: consolidate root causes, blast radius, severity calibration, and remediation recommendations.
