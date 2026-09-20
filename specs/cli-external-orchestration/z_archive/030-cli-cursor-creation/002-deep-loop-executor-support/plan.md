---
title: "Implementation Plan: Cursor deep-loop executor support"
description: "Plan for adding cli-cursor to EXECUTOR_KINDS and a fail-closed buildCursorLineageCommand fan-out adapter, grounded in phase 001's live-verified cursor-agent CLI contract."
trigger_phrases: ["cli-cursor executor support plan"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/030-cli-cursor-creation/002-deep-loop-executor-support"
    last_updated_at: "2026-07-24T04:16:30Z"
    last_updated_by: "claude-code"
    recent_action: "Authored plan.md for phase 002"
    next_safe_action: "Confirm the two open unknowns before core implementation"
    blockers: []
    key_files: ["spec.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-cursor-creation-authoring", parent_session_id: null }
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Cursor deep-loop executor support

<!-- ANCHOR:summary -->
## 1. SUMMARY
Widen the deep-loop runtime's typed executor union to include `cli-cursor`, across the 5 hand-synced files the parent packet names, grounded in phase 001's live-verified CLI contract. Add a new `buildCursorLineageCommand` fan-out adapter with an explicit `command -v cursor-agent` fail-closed preflight, mirroring `buildCodexLineageCommand`/`isCodexBinaryAvailable`. Confirm the remaining unknowns (session-env var, approval-flag mapping, reasoning-effort bracket) before finalizing REQ-004/REQ-006, rather than guessing.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
- [x] Every new `cli-cursor` map/row in `executor-config.ts` and `executor-audit.ts` cross-checked against phase 001's `implementation-summary.md`.
- [x] Strict typecheck (changed-module scope at minimum) exits 0 with the widened `EXECUTOR_KINDS` union.
- [x] Focused Vitest run (`executor-config.vitest.ts`, `executor-audit.vitest.ts`, `fanout-run.vitest.ts`, `remediation.vitest.ts`) passes with zero changes to existing kinds' assertions.
- [x] `dispatch-model.cjs` and `profile-validator.cjs` `KNOWN_EXECUTORS` edited in the same commit so the hand-synced sets do not drift for the new kind.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
`executor-config.ts` stays the accepted-kind and flag-support schema authority (`EXECUTOR_KINDS`, `EXECUTOR_KIND_FLAG_SUPPORT`, `EXECUTOR_WEB_SEARCH_CAPABILITY_MATRIX`), widened to include `cli-cursor` plus the new `CursorApprovalMode`/`resolveCursorApprovalMode()` pair. `executor-audit.ts` owns provenance and recursion-guard metadata (binary/session/state/home-dir/env-prefix maps) and gains a `cli-cursor` row in each. `fanout-run.cjs` owns process construction: a new `buildCursorLineageCommand` joins `LINEAGE_COMMAND_ADAPTERS`, with its own fail-closed preflight. `dispatch-model.cjs` and its sibling `profile-validator.cjs` each gain a `cli-cursor` entry in their independently hand-maintained sets — parity for the new kind only.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:affected-surfaces -->
## AFFECTED SURFACES
| Surface | Current Role | Action | Verification |
|---|---|---|---|
| `executor-config.ts` | Typed-kind + flag-matrix authority | Add `cli-cursor`; add `CursorApprovalMode`/`resolveCursorApprovalMode()` | `executor-config.vitest.ts`; strict typecheck |
| `executor-audit.ts` | Binary/session/state/home/env-prefix maps, recursion guard | Add `cli-cursor` row to each map | `executor-audit.vitest.ts` |
| `fanout-run.cjs` | Fan-out process-command adapter | New `buildCursorLineageCommand` + `SPECKIT_STATE_ENV_BY_KIND` row + fail-closed preflight | `fanout-run.vitest.ts` (new absent-binary case) |
| `dispatch-model.cjs` | Model-benchmark scoped dispatcher | Add `cli-cursor` to `KNOWN_EXECUTORS`; new `buildSpawnSpec` case | `remediation.vitest.ts` |
| `profile-validator.cjs` | Hand-synced mirror of the dispatcher's `KNOWN_EXECUTORS` | Add `cli-cursor` in the same commit as `dispatch-model.cjs` | `remediation.vitest.ts` (or a direct import check) |
<!-- /ANCHOR:affected-surfaces -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Re-read phase 001's `implementation-summary.md` for the confirmed flag surface, approval flags, and model-roster shape.
- [x] Confirm (or explicitly mark TBD) Cursor's session-id env var, the `SandboxMode → approval-flag` mapping, and whether reasoning-effort uses the model bracket, before touching `executor-audit.ts`/`fanout-run.cjs`.

### Phase 2: Core Implementation
- [x] Widen `EXECUTOR_KINDS`; add `cli-cursor` rows to `EXECUTOR_KIND_FLAG_SUPPORT` and `EXECUTOR_WEB_SEARCH_CAPABILITY_MATRIX`.
- [x] Add `CURSOR_SUPPORTED_MODELS`, `CursorSupportedModel`, `CursorApprovalMode`, `resolveCursorApprovalMode()` in `executor-config.ts`.
- [x] Add `cli-cursor` rows to all maps in `executor-audit.ts`.
- [x] Add `cli-cursor` to `SPECKIT_STATE_ENV_BY_KIND` and implement `buildCursorLineageCommand` (plus fail-closed preflight) in `fanout-run.cjs`; register it in `LINEAGE_COMMAND_ADAPTERS`.
- [x] Add `cli-cursor` to `dispatch-model.cjs`'s `KNOWN_EXECUTORS` and a new `buildSpawnSpec` case.
- [x] Add `cli-cursor` to `profile-validator.cjs`'s `KNOWN_EXECUTORS` in the same change.

### Phase 3: Verification
- [x] Run the 4 focused Vitest files; confirm zero diffs in existing kinds' assertions.
- [x] Add and pass a new `cli-cursor` absent-binary fail-closed test in `fanout-run.vitest.ts`, mirroring the `cli-codex` case.
- [x] Run strict typecheck on the two changed `.ts` modules.
- [x] Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh 002-deep-loop-executor-support --strict`.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
Reuse the focused-Vitest-first strategy from the `027-cli-codex-revival` precedent: run the 4 named test files directly before any wider suite. Add regression coverage the same way `fanout-run.vitest.ts` covers `cli-codex`'s absent-binary path — mirror it 1:1 for `cli-cursor`, and additionally assert the guard does not treat the `-p`-without-auth exit code 0 as "available". Do not run a live billed `cursor-agent` dispatch as part of this phase's automated tests; a live smoke test (with the operator authenticated) is optional manual verification only.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
| Dependency | Type | Status | Impact if Blocked |
|---|---|---|---|
| Phase 001 (contract pin) | Internal | Complete | Adapter design would rest on IDE-era or Codex-shaped assumptions instead. |
| Cursor CLI session-id env var | External (unconfirmed) | Yellow — TBD, verify via a live session env | `EXECUTOR_SESSION_ENV_BY_KIND['cli-cursor']` stays unset until confirmed; the recursion guard's env-detection layer has no `cli-cursor` signal until then. |
| `cursor-agent` binary availability in CI/dev `PATH` | External | Installed locally per phase 001 (`2026.07.23-e383d2b`) | The fail-closed preflight (REQ-007) is exactly what protects callers when it's absent elsewhere. |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
Revert only the `cli-cursor` additions to the 5 named files and their 4 test files; the existing kinds are untouched by this phase and need no rollback of their own. No data migration or persisted state is introduced.
<!-- /ANCHOR:rollback -->

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES
001 (contract pin, Complete) precedes this phase. Phase 003 (skill packet) depends on this phase's runtime acceptance and separately owns the self-invocation guard design this phase explicitly defers.
<!-- /ANCHOR:phase-deps -->

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION
| Phase | Complexity | Estimated Effort |
|---|---|---|
| Setup (confirm unknowns) | Low | Under 30 minutes if a live session env resolves the TBDs quickly |
| Core implementation | Medium | One focused session across 5 production files |
| Verification | Medium | Focused Vitest run + 1 new test + strict typecheck + packet validation |
<!-- /ANCHOR:effort -->

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK
No destructive or hard-to-reverse action exists in this phase — it only widens a TypeScript union and adds new hand-synced-map rows plus one new function. If the live `cursor-agent` contract is later found materially incompatible with the adapter shape, remove the `cli-cursor` branches/rows/tests added here; the audit maps' `Partial<Record<ExecutorKind, ...>>` typing means removing a kind's row degrades gracefully rather than breaking other kinds.
<!-- /ANCHOR:enhanced-rollback -->

---

## RELATED DOCUMENTS
- `spec.md`, `tasks.md`, `checklist.md`
- `../001-cursor-contract-pin/implementation-summary.md`
- `../../027-cli-codex-revival/002-deep-loop-executor-support/plan.md` (structural precedent)
