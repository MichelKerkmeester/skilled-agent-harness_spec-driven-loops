---
title: "Changelog: Machine-Checkable Evidence Contract Schema [144-operate-like-fable-5/009-evidence-contract]"
description: "Chronological changelog for the evidence contract and agent IO documentation phase."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-18

> Spec folder: `.opencode/specs/skilled-agent-orchestration/z_archive/114-operate-like-fable-5/009-evidence-contract` (Level 3)
> Parent packet: `.opencode/specs/skilled-agent-orchestration/z_archive/114-operate-like-fable-5`

### Summary

A load-bearing claim at the dispatch boundary now has a fixed shape for carrying proof. The new `evidence-contract.ts` module defines five fields: `claim_class`, `would_confirm`, `gate_delta`, `scope_state` and `child_result_verified`. `validateEvidenceContract(input)` classifies input as absent, present or malformed, reports per-field issues, never throws and treats field values as inert data.

### Added

- Implemented and exported `validateEvidenceContract`, returning present, absent or malformed plus field detail in `.opencode/skills/deep-loop-runtime/lib/deep-loop/evidence-contract.ts`. Verification: TypeScript type-check passes.
- Mapped a malformed result to advisory warnings in `.opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts` without adding a new `PostDispatchFailureReason`. Verification: grep confirms no new failure reason.
- Added a warn-not-fail case for malformed evidence in `.opencode/skills/deep-loop-runtime/tests/unit/post-dispatch-validate.vitest.ts`. Verification: `result.ok === true` with populated warnings.
- Added an absent-stays-green regression case in `.opencode/skills/deep-loop-runtime/tests/unit/post-dispatch-validate.vitest.ts`. Verification: `result.ok === true` with no evidence warning.
- Added the optional `AGENT_IO_EVIDENCE` v1 group with the five fields and the absence-never-blocks rule in `.opencode/skills/system-spec-kit/references/workflows/agent-io-contract.md`. Verification: doc grep shows the new group.
- Confirmed CHK-023: no new entry was added to `PostDispatchFailureReason`.

### Changed

- Defined the five fields and allowed values in `.opencode/skills/deep-loop-runtime/lib/deep-loop/evidence-contract.ts`. Verification: `grep -n "claim_class\|would_confirm\|gate_delta\|scope_state\|child_result_verified"` returns all five.
- Wrote present, absent and malformed unit cases in `.opencode/skills/deep-loop-runtime/tests/unit/evidence-contract.vitest.ts`. Verification: vitest green.
- Imported and called `validateEvidenceContract` in the iteration and agent validation path in `.opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts`. Verification: malformed metadata produces a `PostDispatchAdvisory`.
- Ran the full vitest suite for evidence-contract and post-dispatch-validate. Verification: all suites green.
- Ran `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <spec-folder> --strict`. Verification: exit 0.
- Marked all tasks complete.

### Fixed

- CHK-FIX-001 Each actionable finding has a finding class: instance-only, class-of-bug, cross-consumer, algorithmic, matrix or evidence, or test-isolation.
- CHK-FIX-002 Same-class producer inventory completed, or instance-only status proven by grep.
- CHK-FIX-003 Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs and tests.
- CHK-FIX-004 Security, path, parser and redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op and fallback cases.
- CHK-FIX-005 Matrix axes and row count are listed before completion is claimed.
- CHK-FIX-006 Hostile env or global-state variant executed when tests or code read process-wide state.

### Verification

| Check | Result |
|-------|--------|
| Spec-folder strict validation | PASS: `validate.sh --strict` exited 0. |
| Unit suite `evidence-contract.vitest.ts` | PASS: 8 of 8 cases passed for present, absent, partial-malformed, wrong-type, two unknown-enum cases and inert-data. |
| Integration cases in `post-dispatch-validate.vitest.ts` | PASS: 3 of 3 cases passed for valid present, malformed warns with `ok:true` and absent passes. |
| Full deep-loop-runtime suite | PASS: 376 passing with no regression in existing post-dispatch behavior. |
| Grep proof of the five fields | PASS: field names now resolve in `evidence-contract.ts` and `agent-io-contract.md`, after previously zero hits in deep-loop-runtime. |
| Tasks complete | PASS: 13 completed task items recorded. |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| _No file-level detail recorded._ | N/A | The extracted baseline names the implementation files in Added and Changed but records no file-level table detail. |

### Follow-Ups

- CHK-103 Producer-retrofit path is named as a follow-on phase in the migration note.
- CHK-111 No throughput target applies because validation is synchronous and per-record.
- CHK-112 No load test needed because the check is bounded by the five fields.
- CHK-113 No performance benchmark needed for an in-memory schema check.
- CHK-121 No feature flag needed because the change is advisory-only by design.
- CHK-122 No monitoring or alerting needed for an internal advisory check.
