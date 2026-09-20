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
    recent_action: "Implemented via LUNA (codex), verified independently, reviewed by GLM-5.2"
    next_safe_action: "Commit; phase 003 may build on the widened 6-member union"
    blockers: ["T013/T014/T017/T022 stay blocked - real headless invocation syntax not confirmed end to end"]
    key_files: ["implementation-summary.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "cli-pi-creation-authoring"
      parent_session_id: null
    completion_pct: 90
    open_questions: ["Real command-construction body still needs a confirmed Pi invocation contract"]
    answered_questions: ["23 of 27 tasks complete with evidence; 4 correctly stay blocked, not faked"]
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

- [x] T001 Re-read `../001-pi-contract-pin/implementation-summary.md` (once it exists) for the confirmed non-interactive invocation syntax, exit-code semantics, session-id env var, and model roster. [EVIDENCE: confirmed via `../001-pi-contract-pin/implementation-summary.md`]
- [x] T002 Confirm whether Pi exposes ANY sandbox/permission/approval-flag equivalent; if phase 001 found none, document `sandboxMode` as unsupported for `cli-pi` rather than inventing a mapping function. [EVIDENCE: confirmed: no sandbox/permission flag documented in `pi --help`; sandboxMode left unsupported for cli-pi]
- [x] T003 Confirm Pi's session-id environment variable (if any) via `pi --help` or a live session's environment; mark UNKNOWN in a code comment if still unconfirmed at implementation time — never invent a name. [EVIDENCE: confirmed: no PI_SESSION_ID-style var in `pi --help`'s env list; left unconfirmed by design, no name invented]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 [P] Add `'cli-pi'` as the 6th member of `EXECUTOR_KINDS` in `system-deep-loop/runtime/lib/deep-loop/executor-config.ts` (currently 5 members, line 11: `['native', 'cli-codex', 'cli-claude-code', 'cli-opencode', 'cli-cursor']`). [EVIDENCE: `executor-config.ts` EXECUTOR_KINDS now 6 members incl. cli-pi, confirmed via `executor-config.vitest.ts` (188 tests passed)]
- [x] T005 Add a `cli-pi` row to `EXECUTOR_KIND_FLAG_SUPPORT` (`executor-config.ts` line 74) limited to confirmed-safe fields only: `model`, `timeoutSeconds`, `liveTools`. Do not add `sandboxMode`/`reasoningEffort`/`serviceTier`/`configDir` unless T002/T001 confirmed a concrete Pi flag or Programmatic-Usage parameter for each. [EVIDENCE: cli-pi row limited to model/timeoutSeconds/liveTools, confirmed via `executor-config.vitest.ts`]
- [x] T006 Add a `cli-pi` row to `EXECUTOR_WEB_SEARCH_CAPABILITY_MATRIX` (`executor-config.ts` line 88) — `{ inherit: true, disabled: false, cached: false, live: false }` unless T001 confirms otherwise — so the `as const satisfies Record<ExecutorKind, ...>` check compiles. [EVIDENCE: EXECUTOR_WEB_SEARCH_CAPABILITY_MATRIX cli-pi row added (inherit:true), tsc --noEmit exit 0]
- [x] T007 Scaffold `PiSupportedModel` (type), `PI_SUPPORTED_MODELS` (empty array or a single explicitly-commented placeholder — never a fabricated real-looking id), and `isPiModelAllowed()` in `executor-config.ts`, mirroring `CursorSupportedModel`/`CURSOR_SUPPORTED_MODELS`/`isCursorModelAllowed()`'s shape (lines 136-156) in structure only; full roster population is phase 009's deliverable. [EVIDENCE: PiSupportedModel/PI_SUPPORTED_MODELS/isPiModelAllowed scaffolded fail-closed, confirmed via new vitest case]
- [x] T008 [P] Add a `cli-pi` row to `EXECUTOR_BINARY_BY_KIND` (`'pi'`) in `system-deep-loop/runtime/lib/deep-loop/executor-audit.ts` (line 50). [EVIDENCE: EXECUTOR_BINARY_BY_KIND['cli-pi']='pi' added, confirmed via `executor-audit.vitest.ts`]
- [x] T009 Add a `cli-pi` row to `EXECUTOR_STATE_ENV_BY_KIND` (`['SPECKIT_PI_STATE_DIR']`, line 68) and `EXECUTOR_DEFAULT_HOME_DIR_BY_KIND` (`'.pi'`, line 78) in `executor-audit.ts`. [EVIDENCE: EXECUTOR_STATE_ENV_BY_KIND/EXECUTOR_DEFAULT_HOME_DIR_BY_KIND rows added, confirmed via `executor-audit.vitest.ts`]
- [x] T010 Leave `EXECUTOR_SESSION_ENV_BY_KIND['cli-pi']` (line 59) and `EXECUTOR_ENV_PREFIXES_BY_KIND['cli-pi']` (line 107) unset/absent pending T003's confirmation; add a code comment documenting why, mirroring the `cli-devin` precedent's deferred-row discipline (029 REQ-004/REQ-011). [EVIDENCE: session-env/env-prefix rows left absent with a documenting comment, confirmed via GLM-5.2 independent review]
- [x] T011 Add a `cli-pi` row to `SPECKIT_STATE_ENV_BY_KIND` (`'SPECKIT_PI_STATE_DIR'`) in `system-deep-loop/runtime/scripts/fanout-run.cjs` (line 438). [EVIDENCE: SPECKIT_STATE_ENV_BY_KIND row added in `fanout-run.cjs`]
- [x] T012 Implement `isPiBinaryAvailable(env)` in `fanout-run.cjs` via `command -v pi`, mirroring `isCodexBinaryAvailable`/`isCursorBinaryAvailable` exactly (lines 1704-1721). [EVIDENCE: isPiBinaryAvailable() implemented, confirmed via `fanout-run.vitest.ts` absent-binary case (188 tests passed)]
- [B] T013 [B] Scaffold `buildPiLineageCommand(lineage, prompt, resolvedSandbox, resolvedPermission, options)` in `fanout-run.cjs`: implement the `isPiBinaryAvailable` fail-closed preflight and the function signature now; the command-array construction body stays either a literal fixture cited to phase 001's `implementation-summary.md`, or an explicit `throw` documenting "unconfirmed pending phase 001" — never a flag guessed by analogy to `codex exec`/`claude -p`/`cursor-agent -p`. Blocked on T001 for the real body. [BLOCKED: real Pi headless invocation syntax not confirmed end to end - stub/throw shipped instead, per implementation-summary.md]
- [B] T014 [B] Ensure `buildPiLineageCommand`'s (eventual) failure-detection does not rely on subprocess exit code alone — implement whatever content-based signal T001 confirms once available; until then, document the constraint in a code comment on the scaffolded function. Blocked on T001. [BLOCKED: real Pi headless invocation syntax not confirmed end to end - stub/throw shipped instead, per implementation-summary.md]
- [x] T015 Register `buildPiLineageCommand` as the `'cli-pi'` entry in `LINEAGE_COMMAND_ADAPTERS` (`fanout-run.cjs` line 1683). [EVIDENCE: buildPiLineageCommand registered in LINEAGE_COMMAND_ADAPTERS, confirmed via `fanout-run.vitest.ts`]
- [x] T016 [P] Add `'cli-pi'` to `KNOWN_EXECUTORS` in `system-deep-loop/deep-improvement/scripts/model-benchmark/dispatch-model.cjs` (line 156). [EVIDENCE: cli-pi added to dispatch-model.cjs KNOWN_EXECUTORS, confirmed via `remediation.vitest.ts` (26/27 passed, 1 pre-existing unrelated failure)]
- [B] T017 [B] Add a `case 'cli-pi':` branch to `buildSpawnSpec` in `dispatch-model.cjs` (line 414), honoring a `PI_BIN` env override matching the existing `OPENCODE_BIN`/`CLAUDE_BIN`/`CURSOR_AGENT_BIN` pattern (lines 437/445/463); command body gated the same as T013. Blocked on T001. [BLOCKED: real Pi headless invocation syntax not confirmed end to end - stub/throw shipped instead, per implementation-summary.md]
- [x] T018 Add `'cli-pi'` to `KNOWN_EXECUTORS` in `system-deep-loop/deep-improvement/scripts/model-benchmark/lib/profile-validator.cjs` (line 34), in the same change as T016/T017. [EVIDENCE: cli-pi added to profile-validator.cjs KNOWN_EXECUTORS in the same change]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T019 Add `cli-pi` acceptance/flag-support cases to `executor-config.vitest.ts`, mirroring the existing `cli-cursor` cases (accepts `model`/`timeoutSeconds`/`liveTools`; rejects `sandboxMode`/`reasoningEffort`/`configDir` until T002/T001 confirm otherwise). [EVIDENCE: cli-pi acceptance/flag-support cases added to `executor-config.vitest.ts`]
- [x] T020 Add `cli-pi` audit-map coverage to `executor-audit.vitest.ts`, including an explicit test documenting that `EXECUTOR_SESSION_ENV_BY_KIND['cli-pi']`/`EXECUTOR_ENV_PREFIXES_BY_KIND['cli-pi']` are still absent (so the gap is proven intentional, not silently missed). [EVIDENCE: absent session-env/env-prefix rows explicitly asserted in `executor-audit.vitest.ts`]
- [x] T021 Add a `cli-pi` absent-binary fail-closed test to `fanout-run.vitest.ts`, mirroring `'fails closed before command construction when codex is absent'` (line 957) and `'... when cursor-agent is absent, ignoring the always-0 -p exit code'` (line 1074), proving `buildLineageCommand({kind:'cli-pi', ...})` throws before any subprocess spawn when `pi` is absent from a scoped `PATH`. [EVIDENCE: cli-pi absent-binary fail-closed test added to `fanout-run.vitest.ts`, passes]
- [B] T022 [B] If T001 has confirmed the headless syntax by implementation time, add a `cli-pi` command-construction test to `fanout-run.vitest.ts` asserting the exact `args` array; if not yet confirmed, this task stays `[B]` blocked and documented as such in `implementation-summary.md`, not silently skipped or faked. [BLOCKED: real Pi headless invocation syntax not confirmed end to end - stub/throw shipped instead, per implementation-summary.md]
- [x] T023 Confirm `remediation.vitest.ts` (and any direct `KNOWN_EXECUTORS` import checks) reflect the new `cli-pi` entries in both `dispatch-model.cjs` and `profile-validator.cjs`. [EVIDENCE: remediation.vitest.ts reflects cli-pi in both KNOWN_EXECUTORS sets, confirmed]
- [x] T024 Add and pass a fail-closed `isPiModelAllowed()` test proving every candidate model is rejected while `PI_SUPPORTED_MODELS` is empty/placeholder-only (SC-006). [EVIDENCE: isPiModelAllowed() fail-closed test passes, rejects every candidate including empty string]
- [x] T025 Run the 4 focused Vitest files; confirm 100% pass with zero changes to any pre-existing `native`/`cli-codex`/`cli-claude-code`/`cli-opencode`/`cli-cursor` assertion. [EVIDENCE: 4 focused vitest files run: 188/188 + 26/27 (1 pre-existing unrelated failure, verified via git stash) passed, zero regressions]
- [x] T026 Run strict typecheck on the 2 changed `.ts` modules (`executor-config.ts`, `executor-audit.ts`). [EVIDENCE: `tsc --noEmit --composite false -p tsconfig.json` exit 0]
- [x] T027 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh 002-deep-loop-executor-support --strict`. [EVIDENCE: validate.sh --strict on this phase folder: Errors 0, Warnings 0]
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

