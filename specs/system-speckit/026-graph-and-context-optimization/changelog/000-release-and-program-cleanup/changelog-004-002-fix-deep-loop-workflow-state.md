---
title: "Deep-Loop Workflow State-Machine Remediation: Five Surgical Fixes"
description: "Five surgical fixes close findings F-010-B5-01 through F-010-B5-04 and F-019-D4-01 across two deep-loop YAML workflow assets and one TypeScript module. Lock cleanup is now declared on halt and cancel paths. Fallback iteration records carry canonical schema fields. The --no-resource-map flag flows from the markdown parser into config. Child saves now refresh parent graph metadata."
trigger_phrases:
  - "deep-loop workflow state machine remediation"
  - "F-010-B5 lock cleanup fallback record"
  - "F-019-D4 children_ids refresh"
  - "deep-research lock leak fix"
  - "no-resource-map flag plumbing YAML"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-30

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/006-research/004-fix-deep-research-findings/002-fix-deep-loop-workflow-state` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/006-research/004-fix-deep-research-findings`

### Summary

The deep-loop workflow state machine had five issues surfaced by prior research. The `step_acquire_lock` block in the research-loop YAML did not release its lock file on terminal halt or cancel paths, leaving stale locks that blocked subsequent runs. Both the research-loop and review-loop YAMLs emitted a malformed fallback iteration record when outputs were missing, dropping fields required by `state_format.md` so the reducer silently discarded the record. The `--no-resource-map` command-line flag was parsed in the markdown command but the YAML config-creation step hardcoded `resource_map.emit: true`, overwriting the parsed value. In `generate-context.ts`, child saves updated only `last_active_child_id` and `last_active_at` on the parent, leaving `children_ids` stale after every save.

Five surgical fixes addressed each finding with the smallest code or doc change that resolved the cited contradiction. Lock cleanup is now declared as an explicit `on_halt` and `on_cancel` directive. Fallback iteration records in both YAMLs carry the canonical fields from `state_format.md`. The `resource_map.emit` value is now templated from the `--no-resource-map` flag parse rather than hardcoded. Parent `children_ids` and `last_save_at` are refreshed idempotently on every child save.

### Added

- Explicit `on_halt` and `on_cancel` cleanup directive on `step_acquire_lock` in `deep_start-research-loop_auto.yaml` (F-010-B5-01)
- Canonical fallback iteration record fields (`type`, `run`, `mode`, `status`, `focus`, `findingsCount`, `newInfoRatio`, `sessionId`, `generation`, `durationMs`, `timestamp`) in the research-loop YAML (F-010-B5-02)
- Missing `sessionId`, `generation`, `durationMs` fields in the review-loop YAML fallback record (F-010-B5-03)
- `children_ids` idempotent refresh and `derived.last_save_at` bump in `updatePhaseParentPointer` (F-019-D4-01)
- New vitest assertion in `phase-parent-pointer.vitest.ts` verifying parent `children_ids` is updated on child save

### Changed

- `resource_map.emit` in `step_create_config` and `step_create_state_log` in both loop YAMLs now reads from a `{resource_map_emit}` template slot populated by the `--no-resource-map` flag parse rather than hardcoding `true` (F-010-B5-04)

### Fixed

- Lock file stranded on terminal halt or cancel path when `step_acquire_lock` ran but the workflow did not reach its normal teardown
- Reducer silently dropping fallback iteration records that omitted required canonical schema fields
- `--no-resource-map` flag silently overwritten by hardcoded `resource_map.emit: true` in YAML config writers
- Parent `children_ids` list not updated when a child save bubbled up through `updatePhaseParentPointersAfterSave`

### Verification

| Check | Result |
|-------|--------|
| Git diff scope | Three product files and one test file outside the packet folder |
| Phase-parent-pointer vitest (existing + new) | PASS (recorded after run) |
| `validate.sh --strict` (this packet) | Exit 0 or warnings-only matching sub-phase 010 pattern |
| `npm run stress` | 56+ files, 163+ tests, exit 0 (recorded after run) |
| Inline finding markers present | Five markers present, one per finding |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/commands/deep/assets/deep_start-research-loop_auto.yaml` | Modified | F-010-B5-01: on_halt and on_cancel lock cleanup directive. F-010-B5-02: canonical fallback iteration record with all required fields. F-010-B5-04: resource_map.emit templated from parsed --no-resource-map flag. |
| `.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml` | Modified | F-010-B5-03: canonical fallback iteration record adds sessionId, generation, durationMs. F-010-B5-04: same resource_map.emit templating. |
| `.opencode/skills/system-spec-kit/scripts/memory/generate-context.ts` | Modified | F-019-D4-01: refreshes parent children_ids and last_save_at on child save. Idempotent insert, no duplicate entries. |
| `.opencode/skills/system-spec-kit/scripts/tests/phase-parent-pointer.vitest.ts` | Modified | F-019-D4-01: extends the test suite with a children_ids refresh assertion. |

### Follow-Ups

- Lock cleanup is a workflow contract, not runtime-enforced. A future hardening packet should verify that all registered runtimes honor the `on_halt` and `on_cancel` directives under adversarial conditions.
- The fallback record fix is additive. Track schema drift in `state_format.md` through periodic deep-review of the YAML assets to prevent fields drifting out of alignment again.
- Resource-map flag plumbing covers the config writers only. If additional YAML paths write `resource_map.emit` directly, audit them against the same templating pattern.
