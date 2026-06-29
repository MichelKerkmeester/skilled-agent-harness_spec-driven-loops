# Dimension

Maintainability: cross-file API/contract consistency across executor config, fallback routing, post-dispatch validation, runtime capabilities, lifecycle taxonomy, and observability events.

# Files Reviewed

- `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts:1` (full file)
- `.opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts:1` (full file)
- `.opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts:1` (full file, including the missing middle chunk)
- `.opencode/skills/deep-loop-runtime/lib/deep-loop/runtime-capabilities.cjs:1` (full file)
- `.opencode/skills/deep-loop-runtime/lib/deep-loop/lifecycle-taxonomy.cjs:1` (full file)
- `.opencode/skills/deep-loop-runtime/lib/deep-loop/observability-events.cjs:1` (full file)
- `.opencode/skills/deep-loop-workflows/deep-review/assets/prompt_pack_iteration.md.tmpl:69`
- `.opencode/skills/deep-loop-workflows/deep-review/references/state/state_jsonl.md:91`
- `.opencode/commands/deep/assets/deep_review_auto.yaml:942`
- `.opencode/commands/deep/assets/deep_review_confirm.yaml:875`
- `.opencode/skills/deep-loop-runtime/tests/unit/post-dispatch-validate.vitest.ts:548`
- `.opencode/skills/deep-loop-runtime/tests/unit/fallback-router.vitest.ts:1`
- `.opencode/skills/deep-loop-runtime/tests/unit/observability-events.vitest.ts:1`

# Findings by Severity

## P0

None.

## P1

### R9-P1-001 - Review prompt can produce JSONL that the validator rejects

- File: `.opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts:235`
- Why: The validator's review schema includes `findingDetails` in `REVIEW_ITERATION_FIELDS` (`post-dispatch-validate.ts:235`) and requires it as an array when present in the required set (`post-dispatch-validate.ts:1205`). The review YAML passes `findingDetails` in `assert_jsonl_fields` (`deep_review_auto.yaml:946`, `deep_review_confirm.yaml:879`), while the leaf prompt tells agents to append a canonical iteration record with `dimensions`, `filesReviewed`, `findingsSummary`, `findingsNew`, `traceabilityChecks`, and `newFindingsRatio` but omits `findingDetails` from the canonical JSON example (`prompt_pack_iteration.md.tmpl:69`, `prompt_pack_iteration.md.tmpl:81`). A leaf agent following that prompt can therefore fail post-dispatch validation with `jsonl_missing_fields`.
- Claim: A prompt-compliant deep-review iteration can be rejected by the runtime validator because the producer contract and validator contract disagree on `findingDetails`.
- Evidence refs: `.opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts:235`, `.opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts:1173`, `.opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts:1205`, `.opencode/skills/deep-loop-workflows/deep-review/assets/prompt_pack_iteration.md.tmpl:69`, `.opencode/skills/deep-loop-workflows/deep-review/assets/prompt_pack_iteration.md.tmpl:81`, `.opencode/commands/deep/assets/deep_review_auto.yaml:946`
- Counterevidence sought: Checked the review state documentation and YAML dispatch contract; the state doc also lists `findingDetails` as required, so the prompt template is the divergent producer surface.
- Alternative explanation: If another command layer always injects `findingDetails` into the leaf's state-log record before validation, the trigger would not occur; I found no such injection in the inspected dispatch path before `validateIterationOutputs`.
- Final severity: P1
- Confidence: high
- Downgrade trigger: Show that every review dispatch path rewrites the leaf JSONL record to include `findingDetails: []` before `validateIterationOutputs` runs, or that `assert_jsonl_fields` no longer includes `findingDetails`.
- Suggested fix direction: Pick one canonical schema. The safer direction is to update the prompt template and delta examples to include `findingDetails: []` for no findings, then add a regression test that validates the prompt example against `validateIterationOutputs`.

## P2

### R9-P2-001 - Judge hardening leaves the fast-timeout timer active on immediate rejection

- File: `.opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts:364`
- Why: `callJudgeWithDualTimeouts` creates a fast-timeout timer inside the first `Promise.race` (`post-dispatch-validate.ts:364`, `post-dispatch-validate.ts:370`) and clears it only after that race resolves normally (`post-dispatch-validate.ts:373`). If `invoke()` rejects before the fast timeout fires, the `await Promise.race(...)` throws and the clear path is skipped. `runJudgeWithHardening` catches the rejection as a model failure (`post-dispatch-validate.ts:907`), but the timer can keep the Node event loop alive until `fastTimeoutMs` expires. The existing transient-failure test exercises this rejection path but only asserts retry behavior, not timer cleanup (`post-dispatch-validate.vitest.ts:548`).
- Suggested fix direction: Wrap the first race in `try/finally` and clear `fastTimer` in the `finally`. Add a fake-timer regression that rejects immediately and asserts no pending fast timer remains after `runJudgeWithHardening` settles.

# Verdict

CONDITIONAL

# Notes

No P0 found. Fallback-router success-target behavior has a visible test gap, but I did not find a caller-proven misroute in this pass, so I did not file it as a finding.
