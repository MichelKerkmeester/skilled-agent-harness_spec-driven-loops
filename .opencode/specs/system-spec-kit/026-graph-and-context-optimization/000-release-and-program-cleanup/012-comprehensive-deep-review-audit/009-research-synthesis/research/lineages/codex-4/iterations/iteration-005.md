# Iteration 5: Deep-Loop Fan-Out Blast Radius

## Focus

Determine whether fan-out reliability defects make prior review or research artifacts suspect.

## Actions Taken

- Inspected `fanout-run.cjs`, `fanout-pool.cjs`, `executor-config.ts`, and `fanout-merge.cjs`.
- Read orchestration summaries, status ledgers, attribution tables, merged registries, and lineage completion logs across slices 001-008.
- Counted lineage reports/registries/completion sentinels and summarized attribution provenance gaps.

## Findings

1. The P0 fan-out accounting defect is real. The worker returns `{ label, exitCode, timedOut, salvage }` as a normal value even when `exitCode` is non-zero, and `settleItem()` marks any returned worker value as `status: "fulfilled"`. `buildPoolSummary()` counts fulfilled settlements as succeeded without inspecting `output.exitCode`, so the runner can produce exit 0 when child CLI processes failed. [SOURCE: file:.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:362] [SOURCE: file:.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs:85] [SOURCE: file:.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs:207] [SOURCE: file:.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:376]

2. `iterations` is documented as a per-lineage max-iterations override, but it is not included in the child prompt or config. `buildLoopPrompt()` tells the child to run to convergence, while `computeLineageTimeoutMs()` is the only path that consumes `lineage.iterations`. That makes per-lineage depth control advisory for timeout only. [SOURCE: file:.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts:292] [SOURCE: file:.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:122] [SOURCE: file:.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:142] [SOURCE: file:.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:154]

3. The current orchestration summaries are not reliable audit records for the eight prior review slices. Each summary reports `total_cli_lineages: 1`, `total: 1`, `succeeded: 1`, `failed: 0`, while the corresponding status ledgers show five `codex-*` labels and the lineage directories contain five reports/registries. The status ledger entries also use `index: 0` for every label, consistent with multiple one-lineage invocations appending to a shared ledger and overwriting the aggregate summary. [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/007-interconnected-mcps/review/orchestration-summary.json:1] [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/007-interconnected-mcps/review/orchestration-status.log:1] [SOURCE: command:find/review-lineage count over 001-008]

4. The prior lineage content is present and mostly usable as evidence. Across slices 001-008, each slice has five `fanout-lineage.out` files, five completion sentinels, five `review-report.md` files, and five lineage registries. That argues against treating prior findings as silently empty or entirely failed. [SOURCE: command:count fanout-lineage.out completion sentinels over 001-008] [SOURCE: command:count review reports and registries over 001-008]

5. Provenance remains suspect. Every attribution row across the eight review slices shows `Kind=unknown` and `Model=unknown`. The merge code only reads an `executor_start` event or per-label orchestration summary entries, but the summaries are aggregate-only and many state logs put executor metadata in config or iteration records instead. [SOURCE: file:.opencode/skills/deep-loop-runtime/scripts/fanout-merge.cjs:328] [SOURCE: file:.opencode/skills/deep-loop-runtime/scripts/fanout-merge.cjs:335] [SOURCE: command:fanout-attribution scan over 001-008]

6. The merged findings are substantive, not merely orchestration ghosts. Current merged registries across slices 001-008 contain 74 open findings total, including release-fail slices 002 and 007. However, any release gate that depends on exact executor provenance, child exit status, concurrency, or per-lineage max-iteration compliance should be re-run after fan-out orchestration is fixed. [SOURCE: command:jq merged registry counts over 001-008] [SOURCE: file:.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/007-interconnected-mcps/review/deep-review-findings-registry.json:82]

## Questions Answered

- Q5 is answered. Prior artifacts are suspect at the orchestration/provenance layer, not wholly invalid as review content. Use merged findings as evidence with a caveat; do not use the orchestration summaries or attribution tables as authoritative proof of executor success, model provenance, concurrency, or iteration-bound compliance.

## Questions Remaining

- None.

## Reflection

What worked: counting concrete files and sentinel lines prevented overcorrecting from "fan-out has bugs" to "all prior review content is unusable."

What failed: orchestration-summary JSON is too thin to recover what really ran; status logs and lineage directories had to be cross-checked manually.

Ruled out: "prior artifacts should be discarded." The lineages produced reports and registries; the weak part is whether the orchestrator truthfully summarized and governed those runs.

## Recommended Next Focus

Synthesis: consolidate Q1-Q5 into root causes, severity calibration, remediation order, and caveats.

## Assessment

- newInfoRatio: 0.55
- Novelty justification: Converts fan-out reliability concerns into a concrete artifact-trust policy: content evidence usable, orchestration claims suspect.
- Confidence: High on code defects and artifact counts; medium on exact runtime invocation shape because summaries were overwritten/collapsed.
