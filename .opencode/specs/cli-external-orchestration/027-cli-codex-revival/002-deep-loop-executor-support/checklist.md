---
title: "Verification Checklist: Deep-loop Codex executor support"
description: "Evidence-backed verification for accepted, audited, fail-closed Codex execution."
trigger_phrases: ["Codex executor checklist"]
importance_tier: important
contextType: implementation
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/027-cli-codex-revival/002-deep-loop-executor-support"
    last_updated_at: "2026-07-13T06:25:00Z"
    last_updated_by: "claude-code"
    recent_action: "Restored accepted fail-closed cli-codex runtime support"
    next_safe_action: "Wait for phase 003 hub-rename dependency to land"
    blockers: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Deep-loop Codex executor support
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
<!-- ANCHOR:protocol -->
## Verification Protocol
| Priority | Handling | Completion Impact |
|---|---|---|
| **[P0]** | Hard blocker | Must have scoped evidence |
| **[P1]** | Required | Complete or explicitly defer |
| **[P2]** | Optional | May remain follow-up |
<!-- /ANCHOR:protocol -->
<!-- ANCHOR:pre-impl -->
## Pre-Implementation
- [x] CHK-001 [P0] Contract pinned before code changes.
  - **Evidence**: `../001-codex-contract-pin/implementation-summary.md` records live 0.144.1 output.
- [x] CHK-002 [P0] Historical adapter inspected.
  - **Evidence**: `implementation-summary.md` records the restored `codex exec` command shape and flag mapping.
<!-- /ANCHOR:pre-impl -->
<!-- ANCHOR:code-quality -->
## Code Quality
- [x] CHK-010 [P0] Canonical schema owns accepted kinds and flags.
  - **Evidence**: `executor-config.vitest.ts` passes in the 132/132 focused run.
- [x] CHK-011 [P1] Existing executor branches remain unchanged.
  - **Evidence**: `git diff -- runtime/scripts/fanout-run.cjs` adds a Codex branch without rewriting existing branches.
<!-- /ANCHOR:code-quality -->
<!-- ANCHOR:testing -->
## Testing
- [x] CHK-020 [P0] Focused executor tests pass.
  - **Evidence**: 4 test files, 157/157 tests passed, including direct Codex audit assertions.
- [x] CHK-021 [P0] Missing-binary path is tested.
  - **Evidence**: temporary PATH without Codex throws `command -v codex failed`.
- [ ] CHK-022 [P1] Full runtime suite is green.
  - **Evidence**: 606/694 pass; 88 blocked by missing runtime-local dependencies and stale contract digests.
<!-- /ANCHOR:testing -->
<!-- ANCHOR:fix-completeness -->
## Fix Completeness
- [x] CHK-025 [P0] Config, fan-out, audit, and hardcoded council allowlist are covered.
  - **Evidence**: final scoped diff contains `executor-config.ts`, `executor-audit.ts`, `fanout-run.cjs`, and `orchestrate-session.cjs`.
- [x] CHK-026 [P1] Runtime support does not advertise the route globally.
  - **Evidence**: `git status --short` shows no `cli-codex` skill or current `cli-external` hub changes.
<!-- /ANCHOR:fix-completeness -->
<!-- ANCHOR:security -->
## Security
- [x] CHK-030 [P0] Codex execution keeps explicit no-approval and sandbox settings.
  - **Evidence**: adapter emits `approval_policy=never` and `--sandbox`.
- [x] CHK-031 [P0] Missing binary fails before spawn.
  - **Evidence**: `isCodexBinaryAvailable` preflight and absent-PATH test.
<!-- /ANCHOR:security -->
<!-- ANCHOR:docs -->
## Documentation
- [x] CHK-040 [P1] Spec, plan, tasks, and summary describe the same boundary.
  - **Evidence**: `spec.md`, `plan.md`, and `implementation-summary.md` all assign global route availability to phase 003.
- [x] CHK-041 [P1] Phases 003-006 remain planned only.
  - **Evidence**: packet file inventory shows only `spec.md`, `plan.md`, `tasks.md`, `description.json`, and `graph-metadata.json` in each planned phase.
<!-- /ANCHOR:docs -->
<!-- ANCHOR:file-org -->
## File Organization
- [x] CHK-050 [P0] Every changed path is in the user allowlist.
  - **Evidence**: final `git status --short` review.
- [x] CHK-051 [P0] Banned hook cores and external hub paths are untouched.
  - **Evidence**: final `git status --short` contains no hook-core or external-hub source paths.
<!-- /ANCHOR:file-org -->
<!-- ANCHOR:summary -->
## Verification Summary
| Category | Total | Verified |
|---|---|---|
| P0 | 9 | 9/9 |
| P1 | 6 | 5/6; full suite executed but blocked by repository dependency baseline |
| P2 | 0 | 0/0 |

**Verification Date**: 2026-07-13
**Verified By**: OpenCode
<!-- /ANCHOR:summary -->
