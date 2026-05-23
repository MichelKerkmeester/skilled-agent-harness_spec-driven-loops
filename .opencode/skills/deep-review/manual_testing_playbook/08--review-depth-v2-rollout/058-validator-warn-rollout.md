---
title: "DRV-058 -- Validator warn rollout for legacy unversioned records"
description: "Verify DEEP_REVIEW_V2_ENFORCEMENT=warn surfaces legacy_unversioned_record advisory without hard-failing legacy records."
---

# DRV-058 -- Validator warn rollout for legacy unversioned records

This document captures the realistic user-testing contract, execution flow, and metadata for `DRV-058`.

## 1. OVERVIEW

Exercise the validator's three-phase rollout in its initial `warn` state. Legacy review records that omit `reviewDepthSchemaVersion` must emit `legacy_unversioned_record` as a typed advisory while remaining readable — they must NOT convert into a hard v2 failure under `DEEP_REVIEW_V2_ENFORCEMENT=warn`. The intent is to prove that operators can roll out the v2 contract without breaking historical packets that lack v2 fields.

### Why This Matters

Without the warn surface, an operator cannot stage rollout: they would have to either enforce v2 hard (breaking every legacy review packet) or skip enforcement entirely (no migration pressure). The `warn` tier is the bridge.

## 2. SCENARIO CONTRACT

- Objective: Confirm validator emits `legacy_unversioned_record` advisory for a legacy review record under `DEEP_REVIEW_V2_ENFORCEMENT=warn` without hard-failing.
- Layer partition: validator (`post-dispatch-validate.ts`).
- Real user request: `Run a deep-review iteration against a legacy unversioned record with DEEP_REVIEW_V2_ENFORCEMENT=warn and confirm the legacy advisory fires without failing the record.`
- Expected signals: validator result `ok: true` with `warnings[]` containing one entry whose `code` is `legacy_unversioned_record`; no v2 failure reasons; record continues to parse downstream.
- Pass/fail: PASS if `ok: true` AND `warnings[].code` contains `legacy_unversioned_record`; FAIL if validator hard-fails OR advisory is absent OR `DEEP_REVIEW_V2_ENFORCEMENT` was not honored.

## 3. TEST EXECUTION

### Prerequisites

- `review-depth-validator.vitest.ts` exists under `.opencode/skills/system-spec-kit/mcp_server/tests/deep-loop/`.
- Shell can set `DEEP_REVIEW_V2_ENFORCEMENT=warn`.
- A legacy iteration record fixture is available that omits `reviewDepthSchemaVersion`.

### Steps

1. Set `DEEP_REVIEW_V2_ENFORCEMENT=warn`.
2. Run the validator fixture path that covers legacy unversioned review records.
3. Inspect the validator output for the advisory code `legacy_unversioned_record`.
4. Confirm the same run does not convert the legacy advisory into a hard v2 failure (`ok` stays `true`).
5. Record whether advisory output also surfaces `applicability_strict_unenforced` or `ledger_present_but_unverified` when the fixture qualifies.

### Expected Outcome

The validator surfaces `legacy_unversioned_record` while `DEEP_REVIEW_V2_ENFORCEMENT=warn` is active, and the record remains readable instead of failing as explicit v2.

### Failure Modes

- `legacy_unversioned_record` is absent: inspect whether the input record accidentally includes `reviewDepthSchemaVersion`.
- The run hard-fails: verify the environment is `DEEP_REVIEW_V2_ENFORCEMENT=warn`, not `strict`.
- Advisory output is present but uncited in notes: capture the exact validator output beside the scenario verdict.

## 4. SOURCE REFERENCES

- Validator: `.opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts` (`PostDispatchAdvisory`, `legacy_unversioned_record`).
- Fixture: `.opencode/skills/deep-loop-runtime/tests/integration/review-depth-validator.vitest.ts`.
- Rollout policy: `.opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/002-deep-review/004-complexity-validator-v2-enforcement/decision-record.md` (ADR-001).

## 5. SOURCE_METADATA

- Group: Review-depth v2 rollout
- Playbook ID: DRV-058
- Layer partition: validator
- Expected verdict mode: GREEN under DEEP_REVIEW_V2_ENFORCEMENT=warn
- Sourcing methodology: 131-deep-skill-evolution arc completion (8 phase children shipped 2026-05-22)
- Preflight: documented in 116 parent spec.md phase-map
- Wall-time estimate: ~5 min
