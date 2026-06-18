---
title: "Changelog: Fail-Loud Executor Provenance and Model Mismatch Detection [144-operate-like-fable-5/008-fail-loud-provenance]"
description: "Chronological changelog for the fail-loud executor provenance phase."
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

> Spec folder: `.opencode/specs/skilled-agent-orchestration/144-operate-like-fable-5/008-fail-loud-provenance` (Level 2)
> Parent packet: `.opencode/specs/skilled-agent-orchestration/144-operate-like-fable-5`

### Summary

The deep-loop executor now refuses to ship a lying provenance record when it has a reliable actual-model signal. The original plan assumed the audit already recorded the actual model, but `buildExecutorAuditRecord` only recorded `executor.model`, which is the requested model from config. The shipped fix captures the actual model from CLI output where reliable, compares it with the caller-approved model and fails loud on mismatch.

### Added

- Confirmed the recording seam and types in `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-audit.ts`: `buildExecutorAuditRecord` around 485, `DispatchFailureReason` and `emitDispatchFailure`. Verification used `rg -n 'buildExecutorAuditRecord|DispatchFailureReason|emitDispatchFailure'`.
- Added `model_mismatch` to the `DispatchFailureReason` union in `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-audit.ts`. Verification: type-checks and `rg -n 'model_mismatch'` shows it in the union for REQ-005.
- Added requested-versus-actual comparison at the provenance-recording point. The comparison normalizes the recorded actual model and caller-approved model, then skips native kind in `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-audit.ts`. Verification: new vitest match case writes the record and native case skips for REQ-002.
- On mismatch, called `emitDispatchFailure(..., 'model_mismatch', ...)` instead of writing a success record in `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-audit.ts`. Verification: new vitest mismatch case emits `dispatch_failure` with reason `model_mismatch` and writes no success record for REQ-001.
- Added the guard in `resolveFallback` so it never routes to an unapproved model while preserving the configured `fallback_target` route in `.opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts`. Verification: new vitest unapproved case returns fail-fast and `fallback-router.vitest.ts` stays green for REQ-003.
- Created `.opencode/skills/deep-loop-runtime/tests/unit/executor-provenance-mismatch.vitest.ts` covering mismatch-loud, match-pass, native-skip, approved-fallback-pass, unapproved-substitution-fail-fast and missing-actual-model. Verification: `npx vitest run tests/unit/executor-provenance-mismatch.vitest.ts` passes for REQ-001, REQ-002 and REQ-003.

### Changed

- Ran the baseline suite green before any edit: `executor-audit.vitest.ts`, `fallback-router.vitest.ts` and `dispatch-failure.vitest.ts`.
- Confirmed `resolveFallback` in `.opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts` branches only on quota-pool, not model approval. Verification: read plus `rg -n 'fail-fast|fallback_target'`.
- Confirmed the crash path stays loud: a lost-provenance crash routes through `emitDispatchFailure` with `crash`, never a silent return, in `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-audit.ts`. Verification: `rg -n "'crash'"` plus vitest or read of close and error handlers for REQ-004.
- Ran the full skill vitest suite and `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/skilled-agent-orchestration/144-operate-like-fable-5/008-fail-loud-provenance --strict`, then synced spec, plan, tasks and checklist.
- Marked all tasks complete.
- Left no blocked tasks.

### Fixed

- Mutation check: temporarily reverted the comparison, confirmed the mismatch test went RED, then restored. The test bites as true-RED, not vacuous green.
- CHK-FIX-001 The provenance gap is classed as class-of-bug: silent substitution plus lost-provenance crash. The fix guards the class at the recording seam.
- CHK-FIX-002 Same-class producer inventory completed: `rg -n 'emitDispatchFailure|DispatchFailureReason|buildExecutorAuditRecord' lib/deep-loop/` confirms the only provenance and dispatch-failure producers touched.
- CHK-FIX-003 Consumer inventory completed for the new `model_mismatch` reason: `rg -n 'dispatch_failure|model_mismatch|resolveFallback' --glob '*.ts'` confirms readers tolerate the additive reason value.
- CHK-FIX-004 Provenance-policy fix includes adversarial table tests: mismatch, match, native-skip, approved-fallback-pass, unapproved-substitution-fail-fast and missing-actual-model.
- CHK-FIX-005 Matrix axes and rows listed in `plan.md` before completion is claimed: match or mismatch, native or non-native, approved or unapproved fallback and crash or clean.

### Verification

| Check | Result |
|-------|--------|
| Full deep-loop-runtime suite, `npx vitest run --no-coverage` | PASS: 376 passing, with 351 baseline plus 21 new packet tests across 008 and 009 plus pre-existing untracked test deltas. |
| `executor-provenance-mismatch.vitest.ts` | PASS: 10 of 10 mismatch-loud, match-pass and edge cases passed. |
| Mutation check | PASS: inverted comparison made mismatch and match-pass cases go RED, then restored to green. |
| Regression vitest for `executor-audit.vitest.ts`, `fallback-router.vitest.ts` and `dispatch-failure.vitest.ts` | PASS: unchanged suites passed. |
| Tasks complete | PASS: 14 completed task items recorded. |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-audit.ts` | Updated | Added `model_mismatch` to `DispatchFailureReason`, added `extractActualModel` for opencode-only output, added `normalizeModelId` and failed loud on detectable requested-versus-actual mismatch after a clean spawn. |
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts` | Updated | Added an optional caller-approved model set so `resolveFallback` never routes to an unapproved model and preserves the configured separate-pool fallback. |
| `.opencode/skills/deep-loop-runtime/tests/unit/executor-provenance-mismatch.vitest.ts` | Created | Added 10 cases for detectable mismatch, match, casing and whitespace tolerance, native skip, actual-unknown skip for codex and claude, no-model-requested skip, approved fallback, unapproved substitution fail-fast and backward-compatible no-approval-set route. |

### Follow-Ups

- CHK-042 deep-loop-runtime README or changelog should be updated if the new reason value is operator-facing.
- Detectable mismatches only. The guard catches a substitution only when the CLI reports the actual model on stdout and that model differs from the requested one. A CLI that silently substitutes a model and still reports the requested model cannot be caught because there is no signal to diff against.
- Actual-model extraction is opencode-only. `extractActualModel` parses the model from `cli-opencode` JSON event stream. For `cli-codex`, `cli-claude-code` and native, it returns null because actual model is not reliably reported on stdout. Those kinds are skipped rather than guessed.
- OpenCode's success stream may omit the model. On the verified live build, a clean `opencode run --format json` stream carried no model id on step or text events. The id was observed only in error events. When no model field is surfaced, `extractActualModel` returns null and the check is skipped. The requested-versus-actual check is disabled by default behind `SPECKIT_PROVENANCE_CHECK=1`, while `model_mismatch` type and fallback-router approval guard remain active.
- Efficiency-only scope. This phase makes provenance honest. It does not add the governor capsule, subagent injection or behavioral measurement.
