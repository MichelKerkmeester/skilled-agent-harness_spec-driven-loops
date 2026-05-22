# Scenario 1 — Validator Warn Rollout

## Purpose
Exercise Phase 004 validator rollout behavior for `DEEP_REVIEW_V2_ENFORCEMENT=warn`.

## Prerequisites
- `review-depth-validator.vitest.ts` exists under `.opencode/skills/system-spec-kit/mcp_server/tests/deep-loop/`.
- The local environment can set `DEEP_REVIEW_V2_ENFORCEMENT=warn`.
- A legacy record is available that omits `reviewDepthSchemaVersion`.

## Steps
1. Set `DEEP_REVIEW_V2_ENFORCEMENT=warn`.
2. Run the validator fixture path that covers legacy unversioned review records.
3. Inspect the validator output for the advisory code `legacy_unversioned_record`.
4. Confirm the same run does not convert the legacy advisory into a hard v2 failure.
5. Record whether advisory codes also mention `applicability_strict_unenforced` or `ledger_present_but_unverified` when the fixture input qualifies.

## Expected Outcome
The validator surfaces `legacy_unversioned_record` while `DEEP_REVIEW_V2_ENFORCEMENT=warn` is active, and the record remains readable instead of failing as explicit v2.

## Failure Modes
- `legacy_unversioned_record` is absent: inspect whether the input record accidentally includes `reviewDepthSchemaVersion`.
- The run hard-fails: verify the environment is `DEEP_REVIEW_V2_ENFORCEMENT=warn`, not `strict`.
- Advisory output is present but uncited in notes: capture the exact validator output beside the scenario verdict.
