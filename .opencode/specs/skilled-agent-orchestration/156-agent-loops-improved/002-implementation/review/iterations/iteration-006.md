# Dimension

correctness: logic correctness, default/null handling, env precedence

# Files Reviewed

- `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts:1` - full file read.
- `.opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts:1` - full file read.
- `.opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts:1` - full file read.
- `.opencode/skills/deep-loop-runtime/lib/deep-loop/runtime-capabilities.cjs:1` - full file read.
- `.opencode/skills/deep-loop-runtime/lib/deep-loop/lifecycle-taxonomy.cjs:1` - full file read.
- `.opencode/skills/deep-loop-runtime/lib/deep-loop/observability-events.cjs:1` - full file read.
- `.opencode/skills/deep-loop-runtime/lib/deep-loop/jsonl-repair.ts:1` - coupled JSONL repair contract.
- `.opencode/skills/deep-loop-workflows/deep-review/references/protocol/loop_state_and_gates.md:90` - malformed JSONL recovery contract.
- `.opencode/skills/deep-loop-workflows/deep-review/manual_testing_playbook/05--pause-resume-and-fault-tolerance/malformed-jsonl-lines-are-skipped-with-defaults.md:15` - realistic corruption scenario contract.
- `.opencode/skills/deep-loop-runtime/tests/unit/post-dispatch-validate.vitest.ts:270` - existing tail-repair coverage.
- `.opencode/skills/deep-loop-runtime/tests/integration/review-depth-validator.vitest.ts:202` - delta mismatch coverage.
- `.opencode/skills/deep-loop-runtime/tests/unit/fallback-router.vitest.ts:109` - typed fallback route coverage.
- `.opencode/skills/deep-loop-runtime/tests/unit/executor-config.vitest.ts:16` - executor config coverage.
- `.opencode/skills/deep-loop-runtime/tests/unit/runtime-capabilities.vitest.ts:44` - runtime capability coverage.
- `.opencode/skills/deep-loop-runtime/tests/unit/lifecycle-taxonomy-guards.vitest.ts:25` - lifecycle taxonomy coverage.
- `.opencode/skills/deep-loop-runtime/tests/unit/observability-events.vitest.ts:29` - observability envelope coverage.

# Findings by Severity

## P0

None.

## P1

### R6-P1-001 - Post-dispatch validation can fail a valid new iteration when an older JSONL line is malformed

- Evidence: `.opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts:596`, `.opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts:610`, `.opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts:672`, `.opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts:1331`, `.opencode/skills/deep-loop-runtime/lib/deep-loop/jsonl-repair.ts:160`, `.opencode/skills/deep-loop-workflows/deep-review/references/protocol/loop_state_and_gates.md:94`
- Why: `validateIterationOutputs()` repairs only a corrupt tail, validates the latest appended record, then calls `stampIterationLogRegion()`. That helper reparses every non-empty line in the whole state log without catching `JSON.parse()` failures. A non-tail corrupted historical line therefore turns an otherwise valid current dispatch into `jsonl_parse_error`, despite the review loop contract saying malformed JSONL should be skipped and reconstructed from valid entries.
- Concrete trigger: `deep-review-state.jsonl` contains a valid old record, then one malformed historical line, then a valid newly appended `type:"iteration"` record. `repairJsonlTail()` keeps the file because the tail is valid; `findLastJsonlObjectRegion()` throws on the older malformed line before it reaches the valid latest iteration.
- Suggested fix direction: make `findLastJsonlObjectRegion()` skip malformed non-empty lines while preserving byte offsets for valid records, and surface a corruption advisory if needed. A focused regression should build a state log with a malformed middle line plus a valid current iteration and assert validation remains `ok:true` with seek metadata stamped.

## P2

None.

# Verdict

FAIL

# Notes

No P0 found. Executor config, fallback routing, runtime capability loading, lifecycle taxonomy, and observability normalization did not show a separately citable P0/P1 correctness defect in this pass. Evidence enforcement is intentionally advisory in `evidence-contract.ts`, so I did not count the confusing strict-mode comment in `post-dispatch-validate.ts` as a runtime bug.
