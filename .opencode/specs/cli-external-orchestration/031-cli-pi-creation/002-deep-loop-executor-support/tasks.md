---
title: "Tasks: Pi deep-loop executor support"
description: "Task breakdown for widening EXECUTOR_KINDS to 6 members and scaffolding cli-pi's fail-closed fan-out adapter across the 5 hand-synced runtime files and their tests."
trigger_phrases:
  - "cli-pi executor support tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/031-cli-pi-creation/002-deep-loop-executor-support"
    last_updated_at: "2026-07-27T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored tasks.md, gating command-construction tasks on phase 001"
    next_safe_action: "Author checklist.md for this phase"
    blockers: ["T013, T014, T017, and T022 cannot fully complete until ../001-pi-contract-pin lands a confirmed non-interactive invocation contract."]
    key_files: ["spec.md", "plan.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "cli-pi-creation-authoring"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Pi deep-loop executor support

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Re-read `../001-pi-contract-pin/implementation-summary.md` (once it exists) for the confirmed non-interactive invocation syntax, exit-code semantics, session-id env var, and model roster.
- [ ] T002 Confirm whether Pi exposes ANY sandbox/permission/approval-flag equivalent; if phase 001 found none, document `sandboxMode` as unsupported for `cli-pi` rather than inventing a mapping function.
- [ ] T003 Confirm Pi's session-id environment variable (if any) via `pi --help` or a live session's environment; mark UNKNOWN in a code comment if still unconfirmed at implementation time — never invent a name.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 [P] Add `'cli-pi'` as the 6th member of `EXECUTOR_KINDS` in `system-deep-loop/runtime/lib/deep-loop/executor-config.ts` (currently 5 members, line 11: `['native', 'cli-codex', 'cli-claude-code', 'cli-opencode', 'cli-cursor']`).
- [ ] T005 Add a `cli-pi` row to `EXECUTOR_KIND_FLAG_SUPPORT` (`executor-config.ts` line 74) limited to confirmed-safe fields only: `model`, `timeoutSeconds`, `liveTools`. Do not add `sandboxMode`/`reasoningEffort`/`serviceTier`/`configDir` unless T002/T001 confirmed a concrete Pi flag or Programmatic-Usage parameter for each.
- [ ] T006 Add a `cli-pi` row to `EXECUTOR_WEB_SEARCH_CAPABILITY_MATRIX` (`executor-config.ts` line 88) — `{ inherit: true, disabled: false, cached: false, live: false }` unless T001 confirms otherwise — so the `as const satisfies Record<ExecutorKind, ...>` check compiles.
- [ ] T007 Scaffold `PiSupportedModel` (type), `PI_SUPPORTED_MODELS` (empty array or a single explicitly-commented placeholder — never a fabricated real-looking id), and `isPiModelAllowed()` in `executor-config.ts`, mirroring `CursorSupportedModel`/`CURSOR_SUPPORTED_MODELS`/`isCursorModelAllowed()`'s shape (lines 136-156) in structure only; full roster population is phase 009's deliverable.
- [ ] T008 [P] Add a `cli-pi` row to `EXECUTOR_BINARY_BY_KIND` (`'pi'`) in `system-deep-loop/runtime/lib/deep-loop/executor-audit.ts` (line 50).
- [ ] T009 Add a `cli-pi` row to `EXECUTOR_STATE_ENV_BY_KIND` (`['SPECKIT_PI_STATE_DIR']`, line 68) and `EXECUTOR_DEFAULT_HOME_DIR_BY_KIND` (`'.pi'`, line 78) in `executor-audit.ts`.
- [ ] T010 Leave `EXECUTOR_SESSION_ENV_BY_KIND['cli-pi']` (line 59) and `EXECUTOR_ENV_PREFIXES_BY_KIND['cli-pi']` (line 107) unset/absent pending T003's confirmation; add a code comment documenting why, mirroring the `cli-devin` precedent's deferred-row discipline (029 REQ-004/REQ-011).
- [ ] T011 Add a `cli-pi` row to `SPECKIT_STATE_ENV_BY_KIND` (`'SPECKIT_PI_STATE_DIR'`) in `system-deep-loop/runtime/scripts/fanout-run.cjs` (line 438).
- [ ] T012 Implement `isPiBinaryAvailable(env)` in `fanout-run.cjs` via `command -v pi`, mirroring `isCodexBinaryAvailable`/`isCursorBinaryAvailable` exactly (lines 1704-1721).
- [ ] T013 [B] Scaffold `buildPiLineageCommand(lineage, prompt, resolvedSandbox, resolvedPermission, options)` in `fanout-run.cjs`: implement the `isPiBinaryAvailable` fail-closed preflight and the function signature now; the command-array construction body stays either a literal fixture cited to phase 001's `implementation-summary.md`, or an explicit `throw` documenting "unconfirmed pending phase 001" — never a flag guessed by analogy to `codex exec`/`claude -p`/`cursor-agent -p`. Blocked on T001 for the real body.
- [ ] T014 [B] Ensure `buildPiLineageCommand`'s (eventual) failure-detection does not rely on subprocess exit code alone — implement whatever content-based signal T001 confirms once available; until then, document the constraint in a code comment on the scaffolded function. Blocked on T001.
- [ ] T015 Register `buildPiLineageCommand` as the `'cli-pi'` entry in `LINEAGE_COMMAND_ADAPTERS` (`fanout-run.cjs` line 1683).
- [ ] T016 [P] Add `'cli-pi'` to `KNOWN_EXECUTORS` in `system-deep-loop/deep-improvement/scripts/model-benchmark/dispatch-model.cjs` (line 156).
- [ ] T017 [B] Add a `case 'cli-pi':` branch to `buildSpawnSpec` in `dispatch-model.cjs` (line 414), honoring a `PI_BIN` env override matching the existing `OPENCODE_BIN`/`CLAUDE_BIN`/`CURSOR_AGENT_BIN` pattern (lines 437/445/463); command body gated the same as T013. Blocked on T001.
- [ ] T018 Add `'cli-pi'` to `KNOWN_EXECUTORS` in `system-deep-loop/deep-improvement/scripts/model-benchmark/lib/profile-validator.cjs` (line 34), in the same change as T016/T017.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T019 Add `cli-pi` acceptance/flag-support cases to `executor-config.vitest.ts`, mirroring the existing `cli-cursor` cases (accepts `model`/`timeoutSeconds`/`liveTools`; rejects `sandboxMode`/`reasoningEffort`/`configDir` until T002/T001 confirm otherwise).
- [ ] T020 Add `cli-pi` audit-map coverage to `executor-audit.vitest.ts`, including an explicit test documenting that `EXECUTOR_SESSION_ENV_BY_KIND['cli-pi']`/`EXECUTOR_ENV_PREFIXES_BY_KIND['cli-pi']` are still absent (so the gap is proven intentional, not silently missed).
- [ ] T021 Add a `cli-pi` absent-binary fail-closed test to `fanout-run.vitest.ts`, mirroring `'fails closed before command construction when codex is absent'` (line 957) and `'... when cursor-agent is absent, ignoring the always-0 -p exit code'` (line 1074), proving `buildLineageCommand({kind:'cli-pi', ...})` throws before any subprocess spawn when `pi` is absent from a scoped `PATH`.
- [ ] T022 [B] If T001 has confirmed the headless syntax by implementation time, add a `cli-pi` command-construction test to `fanout-run.vitest.ts` asserting the exact `args` array; if not yet confirmed, this task stays `[B]` blocked and documented as such in `implementation-summary.md`, not silently skipped or faked.
- [ ] T023 Confirm `remediation.vitest.ts` (and any direct `KNOWN_EXECUTORS` import checks) reflect the new `cli-pi` entries in both `dispatch-model.cjs` and `profile-validator.cjs`.
- [ ] T024 Add and pass a fail-closed `isPiModelAllowed()` test proving every candidate model is rejected while `PI_SUPPORTED_MODELS` is empty/placeholder-only (SC-006).
- [ ] T025 Run the 4 focused Vitest files; confirm 100% pass with zero changes to any pre-existing `native`/`cli-codex`/`cli-claude-code`/`cli-opencode`/`cli-cursor` assertion.
- [ ] T026 Run strict typecheck on the 2 changed `.ts` modules (`executor-config.ts`, `executor-audit.ts`).
- [ ] T027 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh 002-deep-loop-executor-support --strict`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All buildable-now REQ items in `spec.md` implemented, each with passing test coverage.
- [ ] Every phase-001-gated task (T013, T014, T017, T022) is either completed with a cited confirming source, or explicitly left `[B]` and documented in `implementation-summary.md` with what would confirm it — never silently marked `[x]` without evidence.
- [ ] Zero regressions in existing `native`/`cli-codex`/`cli-claude-code`/`cli-opencode`/`cli-cursor` test assertions.
- [ ] `checklist.md` fully verified with evidence.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- `spec.md`
- `plan.md`
- `checklist.md`
- `../001-pi-contract-pin/` (source contract; not yet executed)
- `../003-cli-pi-skill-packet/` (consumes this phase's runtime acceptance)
<!-- /ANCHOR:cross-refs -->

---

## RELATED DOCUMENTS
- `spec.md`, `plan.md`, `checklist.md`

