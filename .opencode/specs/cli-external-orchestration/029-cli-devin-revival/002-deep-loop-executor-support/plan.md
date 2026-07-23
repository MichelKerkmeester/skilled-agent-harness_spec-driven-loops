---
title: "Implementation Plan: Devin deep-loop executor support"
description: "Plan for widening EXECUTOR_KINDS to 5 members and adding a fail-closed buildDevinLineageCommand fan-out adapter for cli-devin, grounded in phase 001's live-verified Devin CLI contract."
trigger_phrases: ["cli-devin executor support plan"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/029-cli-devin-revival/002-deep-loop-executor-support"
    last_updated_at: "2026-07-23T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored plan.md for phase 002 mapping REQs onto affected surfaces and 3 phases"
    next_safe_action: "Execute Phase 1 (confirm the two open unknowns) before starting Phase 2 core implementation."
    blockers: []
    key_files: ["spec.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-devin-revival-authoring", parent_session_id: null }
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Devin deep-loop executor support

<!-- ANCHOR:summary -->
## 1. SUMMARY
Widen the deep-loop runtime's typed executor union from 4 to 5 members by re-adding `cli-devin`, across the 5 hand-synced files the parent packet's Files-to-Change table names, grounded in phase 001's live-verified CLI contract rather than the archived 2026-05/06 assumptions. Add a new `buildDevinLineageCommand` fan-out adapter with an explicit `command -v devin` fail-closed preflight, mirroring `buildCodexLineageCommand`/`isCodexBinaryAvailable` exactly. Confirm the two remaining unknowns (session-env var name, `--sandbox` boolean mapping) before finalizing REQ-004/REQ-006, rather than guessing.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
- [ ] Every new `cli-devin` map/row in `executor-config.ts` and `executor-audit.ts` cross-checked against phase 001's `implementation-summary.md`, not the archived packets.
- [ ] Strict typecheck (changed-module scope at minimum) exits 0 with the widened `EXECUTOR_KINDS` union.
- [ ] Focused Vitest run (`executor-config.vitest.ts`, `executor-audit.vitest.ts`, `fanout-run.vitest.ts`, `remediation.vitest.ts`) passes with zero changes to existing `native`/`cli-codex`/`cli-claude-code`/`cli-opencode` assertions.
- [ ] `dispatch-model.cjs` and `profile-validator.cjs` `KNOWN_EXECUTORS` edited in the same commit so the hand-synced sets do not drift for the new kind.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
`executor-config.ts` stays the accepted-kind and flag-support schema authority (`EXECUTOR_KINDS`, `EXECUTOR_KIND_FLAG_SUPPORT`, `EXECUTOR_WEB_SEARCH_CAPABILITY_MATRIX`), now widened to 5 members plus the re-created `DevinPermissionMode`/`resolveDevinPermissionMode()` pair. `executor-audit.ts` owns provenance and recursion-guard metadata (binary/session/state/home-dir/env-prefix maps) and gains a `cli-devin` row in each. `fanout-run.cjs` owns process construction: a new `buildDevinLineageCommand` joins `LINEAGE_COMMAND_ADAPTERS` alongside the existing native/codex/claude/opencode adapters, with its own fail-closed preflight. `dispatch-model.cjs` (the model-benchmark scoped dispatcher, which already omits `native`/`cli-codex` from its own `KNOWN_EXECUTORS`) and its sibling `profile-validator.cjs` each gain a `cli-devin` entry in their independently hand-maintained sets — this phase adds parity for the new kind only; it does not reconcile their pre-existing mutual asymmetry for other kinds.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:affected-surfaces -->
## AFFECTED SURFACES
| Surface | Current Role | Action | Verification |
|---|---|---|---|
| `executor-config.ts` | Typed-kind + flag-matrix authority | Add `cli-devin`; re-create `DevinPermissionMode`/`resolveDevinPermissionMode()` | `executor-config.vitest.ts`; strict typecheck |
| `executor-audit.ts` | Binary/session/state/home/env-prefix maps, recursion guard | Add `cli-devin` row to each map | `executor-audit.vitest.ts` |
| `fanout-run.cjs` | Fan-out process-command adapter | New `buildDevinLineageCommand` + `SPECKIT_STATE_ENV_BY_KIND` row + fail-closed preflight | `fanout-run.vitest.ts` (new absent-binary case) |
| `dispatch-model.cjs` | Model-benchmark scoped dispatcher | Add `cli-devin` to `KNOWN_EXECUTORS`; new `buildSpawnSpec` case | `remediation.vitest.ts` |
| `profile-validator.cjs` | Hand-synced mirror of the dispatcher's `KNOWN_EXECUTORS` | Add `cli-devin` in the same commit as `dispatch-model.cjs` | `remediation.vitest.ts` (or a direct import check) |
<!-- /ANCHOR:affected-surfaces -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Re-read phase 001's `implementation-summary.md` for the confirmed flag surface, permission modes, and model roster.
- [ ] Confirm (or explicitly mark TBD) Devin's session-id env var and `--sandbox` boolean semantics before touching `executor-audit.ts`/`fanout-run.cjs`.

### Phase 2: Core Implementation
- [ ] Widen `EXECUTOR_KINDS`; add `cli-devin` rows to `EXECUTOR_KIND_FLAG_SUPPORT` and `EXECUTOR_WEB_SEARCH_CAPABILITY_MATRIX`.
- [ ] Re-create `DEVIN_SUPPORTED_MODELS`, `DevinSupportedModel`, `DevinPermissionMode`, `resolveDevinPermissionMode()` in `executor-config.ts`, modeled on the current 4-mode contract.
- [ ] Add `cli-devin` rows to all 4 maps in `executor-audit.ts`.
- [ ] Add `cli-devin` to `SPECKIT_STATE_ENV_BY_KIND` and implement `buildDevinLineageCommand` (plus its fail-closed preflight) in `fanout-run.cjs`; register it in `LINEAGE_COMMAND_ADAPTERS`.
- [ ] Add `cli-devin` to `dispatch-model.cjs`'s `KNOWN_EXECUTORS` and a new `buildSpawnSpec` case.
- [ ] Add `cli-devin` to `profile-validator.cjs`'s `KNOWN_EXECUTORS` in the same change.

### Phase 3: Verification
- [ ] Run the 4 focused Vitest files; confirm zero diffs in existing `native`/`cli-codex`/`cli-claude-code`/`cli-opencode` assertions.
- [ ] Add and pass a new `cli-devin` absent-binary fail-closed test in `fanout-run.vitest.ts`, mirroring the existing `cli-codex` case.
- [ ] Run strict typecheck on the two changed `.ts` modules.
- [ ] Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh 002-deep-loop-executor-support --strict`.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
Reuse the focused-Vitest-first strategy from the `027-cli-codex-revival` precedent: run the 4 named test files directly before any wider suite. Add regression coverage the same way `fanout-run.vitest.ts` already covers `cli-codex`'s absent-binary path (`isCodexBinaryAvailable`/`command -v codex failed`) — mirror it 1:1 for `cli-devin`. Do not run a live billed `devin` dispatch as part of this phase's automated tests; a live smoke test (with `devin` actually on `PATH` from phase 001's install) is optional manual verification only, not a required gate.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
| Dependency | Type | Status | Impact if Blocked |
|---|---|---|---|
| Phase 001 (contract pin) | Internal | Complete | Adapter design would rest on the stale 2-mode/no-subagent assumptions instead. |
| Devin CLI session-id env var | External (unconfirmed) | Yellow — TBD, verify via `devin --help`/live env | `EXECUTOR_SESSION_ENV_BY_KIND['cli-devin']` stays unset until confirmed; the recursion guard's env-detection layer has no `cli-devin` signal until then. |
| `devin` binary availability in CI/dev `PATH` | External | Installed locally per phase 001 (v3000.2.17) | The fail-closed preflight (REQ-007) is exactly what protects callers when it's absent elsewhere. |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
Revert only the `cli-devin` additions to the 5 named files and their 4 test files; `native`/`cli-codex`/`cli-claude-code`/`cli-opencode` are untouched by this phase and need no rollback of their own. No data migration or persisted state is introduced.
<!-- /ANCHOR:rollback -->

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES
001 (contract pin, Complete) precedes this phase. Phase 003 (skill packet) depends on this phase's runtime acceptance and separately owns the self-invocation guard design this phase explicitly defers.
<!-- /ANCHOR:phase-deps -->

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION
| Phase | Complexity | Estimated Effort |
|---|---|---|
| Setup (confirm unknowns) | Low | Under 30 minutes if `devin --help`/env inspection resolves both TBDs quickly |
| Core implementation | Medium | One focused session across 5 production files |
| Verification | Medium | Focused Vitest run + 1 new test + strict typecheck + packet validation |
<!-- /ANCHOR:effort -->

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK
No destructive or hard-to-reverse action exists in this phase — it only widens a TypeScript union and adds new hand-synced-map rows plus one new function. If the live `devin` CLI contract is later found materially incompatible with the adapter shape, remove the `cli-devin` branches/rows/tests added here; the audit maps' `Partial<Record<ExecutorKind, ...>>` typing means removing a kind's row degrades gracefully rather than breaking other kinds.
<!-- /ANCHOR:enhanced-rollback -->

---

## RELATED DOCUMENTS
- `spec.md`, `tasks.md`, `checklist.md`
- `../001-devin-contract-pin/implementation-summary.md`
- `../../027-cli-codex-revival/002-deep-loop-executor-support/plan.md` (structural precedent)
