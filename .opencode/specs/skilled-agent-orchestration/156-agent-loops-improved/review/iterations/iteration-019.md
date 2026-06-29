# Dimension

Maintainability: standards & comment-hygiene & sk-code:opencode alignment.

# Files Reviewed

- `.opencode/skills/deep-loop-runtime/lib/deep-loop/atomic-state.ts:1-469`
- `.opencode/skills/deep-loop-runtime/lib/deep-loop/loop-lock.ts:1-585`
- `.opencode/skills/deep-loop-runtime/lib/deep-loop/sleep.ts:1-95`
- `.opencode/skills/deep-loop-runtime/lib/deep-loop/jsonl-repair.ts:1-217`
- `.opencode/plugins/mk-goal.js:1-1490`
- `.opencode/commands/goal.md:1-62`
- `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts:1-380`
- `.opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts:1-431`
- `.opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts:1-1358`
- `.opencode/skills/deep-loop-runtime/lib/deep-loop/runtime-capabilities.cjs:1-177`
- `.opencode/skills/deep-loop-runtime/lib/deep-loop/lifecycle-taxonomy.cjs:1-145`
- `.opencode/skills/deep-loop-runtime/lib/deep-loop/observability-events.cjs:1-141`
- `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-db.ts:1-975`
- `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-query.ts:1-764`
- `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-signals.ts:1-1029`
- `.opencode/skills/deep-loop-runtime/lib/council/convergence.cjs:1-246`
- `.opencode/skills/deep-loop-runtime/lib/council/round-state-jsonl.cjs:1-311`
- `.opencode/skills/deep-loop-runtime/scripts/convergence.cjs:1-797`
- `.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs:1-767`
- `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1-1172`
- `.opencode/skills/deep-loop-runtime/scripts/fanout-salvage.cjs:1-150`
- `.opencode/skills/deep-loop-runtime/scripts/status.cjs:1-211`
- `.opencode/skills/deep-loop-runtime/scripts/upsert.cjs:1-317`
- `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/model-benchmark/run-benchmark.cjs:1-855`
- `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/shared/promote-candidate.cjs:1-703`
- `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/shared/reduce-state.cjs:1-1445`
- `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/shared/rollback-candidate.cjs:1-172`
- `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/d5-connectivity.cjs:1-374`
- `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/live-executor.cjs:1-398`
- `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/parent-hub-vocab-sync.cjs:1-427`
- Directly coupled: `.opencode/skills/deep-loop-workflows/deep-review/assets/prompt_pack_iteration.md.tmpl:70-116`
- Directly coupled: `.opencode/commands/deep/assets/deep_review_auto.yaml:942-949`
- Directly coupled: `.opencode/skills/deep-loop-workflows/deep-review/references/state/state_jsonl.md:91-105`

# Findings by Severity

## P0

None.

## P1

### R19-P1-001 - Review iteration template omits a field the validator requires

- Location: `.opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts:1173`
- Why: the validator expands review records to the full `REVIEW_ITERATION_FIELDS` set whenever `filesReviewed` or `findingsSummary` is required, and that expanded set includes `findingDetails`. It then rejects a record where `findingDetails` is not an array. The coupled leaf prompt's canonical record and delta example omit `findingDetails`, so an agent following that template can produce a state-log row that the post-dispatch validator rejects as `jsonl_missing_fields`.
- Evidence: `.opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts:235`, `.opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts:1173`, `.opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts:1205`, `.opencode/skills/deep-loop-workflows/deep-review/assets/prompt_pack_iteration.md.tmpl:81`, `.opencode/skills/deep-loop-workflows/deep-review/assets/prompt_pack_iteration.md.tmpl:110`.
- Counterevidence sought: `.opencode/commands/deep/assets/deep_review_auto.yaml:946` and `.opencode/skills/deep-loop-workflows/deep-review/references/state/state_jsonl.md:91` agree with the validator that `findingDetails` is required, which means the drift is in the leaf prompt/example contract rather than the validator.
- Alternative explanation: the command YAML may inject an additional instruction at runtime that overrides the prompt-pack example before dispatch; I did not find that in the inspected contract lines.
- Suggested fix direction: update the prompt pack's canonical JSON and delta examples to include `findingDetails: []` when there are no findings, or deliberately relax `REVIEW_ITERATION_FIELDS` and the state JSONL reference together.

## P2

### R19-P2-001 - `appendJsonlIfChangedAtomic` looks like a general append helper but is single-writer only

- Location: `.opencode/skills/deep-loop-runtime/lib/deep-loop/atomic-state.ts:300`
- Why: the exported helper is documented as appending a JSONL row, but it reads the whole current file and then atomically renames a replacement containing old content plus the new row. Without a writer lock or `O_APPEND`, two processes can both read the same prior content and the later rename can drop the earlier append. Current inspected call sites are single-loop telemetry paths, so this is a robustness/maintenance hazard rather than an observed production loss in this slice.
- Evidence: `.opencode/skills/deep-loop-runtime/lib/deep-loop/atomic-state.ts:287`, `.opencode/skills/deep-loop-runtime/lib/deep-loop/atomic-state.ts:324`, `.opencode/skills/deep-loop-runtime/lib/deep-loop/atomic-state.ts:328`, `.opencode/commands/deep/assets/deep_research_auto.yaml:444`, `.opencode/commands/deep/assets/deep_research_auto.yaml:1199`, `.opencode/commands/deep/assets/deep_research_auto.yaml:1420`.
- Suggested fix direction: either rename/document it as a single-writer replace-append helper and keep call sites constrained, or add a lock-held append path before any multi-process ledger reuse.

# Verdict

CONDITIONAL

# Notes

The scoped comment-hygiene checker reported no violations across the reviewed code files. Scoped `verify_alignment_drift.py` runs also passed for the reviewed `.opencode` code directories.
