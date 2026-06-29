## Dimension
Maintainability - integration contracts across convergence/upsert/reduce-state and fanout-run/pool/salvage/merge.

## Files Reviewed
- .opencode/skills/deep-loop-runtime/scripts/convergence.cjs:1
- .opencode/skills/deep-loop-runtime/scripts/convergence.cjs:221
- .opencode/skills/deep-loop-runtime/scripts/convergence.cjs:441
- .opencode/skills/deep-loop-runtime/scripts/convergence.cjs:661
- .opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs:1
- .opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs:221
- .opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs:441
- .opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs:661
- .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1
- .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:241
- .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:481
- .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:721
- .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:961
- .opencode/skills/deep-loop-runtime/scripts/fanout-salvage.cjs:1
- .opencode/skills/deep-loop-runtime/scripts/status.cjs:1
- .opencode/skills/deep-loop-runtime/scripts/upsert.cjs:1
- .opencode/skills/deep-loop-runtime/scripts/fanout-merge.cjs:1
- .opencode/skills/deep-loop-runtime/scripts/fanout-merge.cjs:221
- .opencode/skills/deep-loop-runtime/scripts/fanout-merge.cjs:441
- .opencode/skills/deep-loop-runtime/scripts/fanout-merge.cjs:661
- .opencode/skills/deep-loop-workflows/deep-review/scripts/reduce-state.cjs:1
- .opencode/skills/deep-loop-workflows/deep-review/scripts/reduce-state.cjs:420
- .opencode/skills/deep-loop-workflows/deep-review/scripts/reduce-state.cjs:781
- .opencode/skills/deep-loop-workflows/deep-review/scripts/reduce-state.cjs:1121
- .opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts:1188
- .opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts:250
- .opencode/skills/deep-loop-runtime/scripts/lib/cli-guards.cjs:148
- .opencode/commands/deep/assets/deep_review_auto.yaml:1044

## Findings by Severity
### P0
None.

### P1
- R20-P1-001 - .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1116
  Why: `fanout-run` runs `runSalvageSweep()` and receives `{salvaged, failed}` at line 1104, but it only rejects a lineage when the subprocess timed out or exited non-zero at lines 1116-1124. A child that exits 0 after writing a state log but not the required iteration markdown, with unrecoverable stdout, makes `fanout-salvage` write a failed marker and increment `failed` at .opencode/skills/deep-loop-runtime/scripts/fanout-salvage.cjs:137, then `fanout-run` still returns a fulfilled result at .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1127. The failure classifier already treats `salvage.failed > 0 && salvaged === 0` as `salvage_miss` at .opencode/skills/deep-loop-runtime/scripts/lib/cli-guards.cjs:176, but that path is only reached if `fanout-run` first throws.
  Suggested fix direction: Treat `salvage.failed > 0` as a lineage failure even when exit code is 0, attach the salvage summary to the thrown error, and add an exit-zero/unrecoverable-salvage regression test.

- R20-P1-002 - .opencode/skills/deep-loop-workflows/deep-review/scripts/reduce-state.cjs:654
  Why: `reduce-state` builds the registry from separate `{type:"finding"}` delta records at lines 654-662 and legacy markdown parsing at lines 711-750, but it does not materialize `findingDetails[]` from the canonical iteration record. The post-dispatch validator only checks that `findingDetails` is an array at .opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts:1205 and that the delta file contains an iteration record at .opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts:1236. The prompt and state docs make the delta file's per-finding rows and `findingDetails[]` load-bearing, but this split means a nonzero-finding iteration can validate and then reduce to an empty registry if the per-finding delta rows are missing.
  Suggested fix direction: Either make `validateIterationOutputs` fail when `findingsCount` or `findingDetails[]` is nonzero but matching `type:"finding"` rows are absent, or teach `reduce-state` to use `findingDetails[]` as a structured fallback.

### P2
- R20-P2-001 - .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:996
  Why: `fanout-pool` implements an `abort-requeue` lag-ceiling action at .opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs:391 and aborts stalled attempts at .opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs:598, but the real runner passes only `lagCeilingMs` into `runCappedPool` at .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:996 and the parsed fanout config schema exposes no `lagCeilingAction` field at .opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts:278. The abort/requeue path is therefore module-testable but unreachable through the production fanout-run contract.
  Suggested fix direction: Add `lagCeilingAction` to `fanoutConfigSchema` and pass it through, or remove the abort/requeue branch and tests until the runner exposes it.

## Verdict
FAIL

## Notes
The convergence/upsert/status graph script contracts looked mostly aligned for the reviewed slice: empty-graph convergence returns CONTINUE, snapshot writes take the graph writer lock, and review graphEvents are pre-filtered by the workflow before upsert. The release-blocking issues are in the fan-out artifact contract and the reducer/validator split around structured finding rows.
