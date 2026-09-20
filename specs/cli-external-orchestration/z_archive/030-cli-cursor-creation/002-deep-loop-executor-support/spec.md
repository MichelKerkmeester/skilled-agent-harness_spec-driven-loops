---
title: "Feature Specification: Cursor deep-loop executor support"
description: "Add cli-cursor as a new typed deep-loop executor kind across executor-config.ts, executor-audit.ts, fanout-run.cjs, dispatch-model.cjs, and profile-validator.cjs, with a new fail-closed buildCursorLineageCommand adapter, grounded in phase 001's live-verified cursor-agent CLI contract."
trigger_phrases: ["cli-cursor deep-loop executor", "cli-cursor executor kind", "Cursor fan-out adapter"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/030-cli-cursor-creation/002-deep-loop-executor-support"
    last_updated_at: "2026-07-24T04:16:30Z"
    last_updated_by: "claude-code"
    recent_action: "Authored spec.md for phase 002 grounded in phase 001 contract"
    next_safe_action: "Author plan.md, tasks.md, checklist.md for this phase"
    blockers: []
    key_files: ["system-deep-loop/runtime/lib/deep-loop/executor-config.ts", "system-deep-loop/runtime/lib/deep-loop/executor-audit.ts", "system-deep-loop/runtime/scripts/fanout-run.cjs"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-cursor-creation-authoring", parent_session_id: null }
    completion_pct: 0
    open_questions: ["Cursor's session-id env var (analog to CODEX_SESSION_ID) is unconfirmed - verify via a live session env at implementation time; do not invent one.", "Exact mapping from the runtime SandboxMode enum to Cursor's approval/sandbox flags (--sandbox enabled|disabled, --force/--yolo, --auto-review) is not yet decided.", "Whether reasoningEffort maps into Cursor's parameterized model bracket (model[effort=high]) rather than a standalone flag needs an implementation-time decision."]
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Feature Specification: Cursor deep-loop executor support

<!-- ANCHOR:metadata -->
## 1. METADATA
| Field | Value |
|---|---|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-07-24 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `cli-external-orchestration/030-cli-cursor-creation` |
| **Predecessor** | `001-cursor-contract-pin` (Complete) |
| **Successor** | `003-cli-cursor-skill-packet` |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The deep-loop runtime's typed executor union currently has 4 members (`native`, `cli-codex`, `cli-claude-code`, `cli-opencode`) defined in `EXECUTOR_KINDS` (`executor-config.ts` line 11, confirmed live). To make `cli-cursor` dispatchable it must grow to include `'cli-cursor'`. This union and its dependent maps are consumed across several files that do **not** read any shared registry — unlike the executor-delegation advisor scorer, which is registry-driven and needs no code change. These files are described in the deep-loop runtime code itself as "kept in sync by hand" (`profile-validator.cjs`), meaning every one must be edited individually and will silently drift if any is missed.

Two of the union's dependent maps are compile-time hard blockers, not style preferences: `EXECUTOR_KIND_FLAG_SUPPORT` is typed `Record<ExecutorKind, ...>` and `EXECUTOR_WEB_SEARCH_CAPABILITY_MATRIX` is `satisfies Record<ExecutorKind, ...>` — TypeScript will refuse to compile without a matching `cli-cursor` entry once the union is widened.

Cursor's CLI contract differs materially from the sibling CLIs in ways this phase must model faithfully rather than by copying a sibling adapter: its canonical binary is `cursor-agent` (with an `agent` alias); it has no `--permission-mode <enum>` like Codex/Devin but instead a set of approval/sandbox flags (`--force`/`--yolo`, `--auto-review`, `--sandbox enabled|disabled`); and reasoning-effort is expressed inside a parameterized model bracket (`claude-opus-4-8[effort=high]`), not a standalone `--reasoning-effort` flag. Building the adapter on a Codex-shaped assumption would produce an invalid command.

### Purpose
Widen the deep-loop runtime's typed executor union to include `cli-cursor`, add its audit/dispatch metadata across every hand-synced consumer, and add a real fan-out command adapter (`buildCursorLineageCommand`) with an explicit fail-closed `command -v cursor-agent` preflight — all grounded in phase 001's live-verified contract. Leave the `cli-cursor` self-invocation guard's signal design and the skill packet itself to phase 003; this phase is the runtime-typing layer only.

> Ordering note: this phase and the parallel `029-cli-devin-revival/002` both widen `EXECUTOR_KINDS`. Whichever lands second makes its kind the additional member; there is no ordering dependency between them beyond a trivial merge of the union literal. The current live union is 4 members (no `cli-devin` yet).
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Widen `EXECUTOR_KINDS` in `executor-config.ts` to include `'cli-cursor'`; add matching `cli-cursor` rows to `EXECUTOR_KIND_FLAG_SUPPORT` and `EXECUTOR_WEB_SEARCH_CAPABILITY_MATRIX` so both compile cleanly.
- Add `CURSOR_SUPPORTED_MODELS`, a `CursorSupportedModel` type, a `CursorApprovalMode` type (`ask`/`auto-review`/`force`, modeling Cursor's real approval flags, not a fabricated permission-mode enum), and a `resolveCursorApprovalMode()` function in `executor-config.ts`, modeled on phase 001's confirmed contract and left explicitly extensible where the live model roster is auth-gated (TBD).
- Add `cli-cursor` rows to `EXECUTOR_BINARY_BY_KIND` (`'cursor-agent'`), `EXECUTOR_SESSION_ENV_BY_KIND` (once confirmed), `EXECUTOR_STATE_ENV_BY_KIND`, `EXECUTOR_DEFAULT_HOME_DIR_BY_KIND` (`'.cursor'`), and `EXECUTOR_ENV_PREFIXES_BY_KIND` (`CURSOR_`) in `executor-audit.ts`.
- Add a `cli-cursor` row to `SPECKIT_STATE_ENV_BY_KIND` and implement a new `buildCursorLineageCommand` function registered in `LINEAGE_COMMAND_ADAPTERS` in `fanout-run.cjs`, with a `command -v cursor-agent` fail-closed preflight mirroring `isCodexBinaryAvailable`/`buildCodexLineageCommand`.
- Add `cli-cursor` to `KNOWN_EXECUTORS` and a new `buildSpawnSpec` case in `dispatch-model.cjs` (honoring a `CURSOR_AGENT_BIN` env override matching the `OPENCODE_BIN`/`CLAUDE_BIN` pattern).
- Add `cli-cursor` to the separate, hand-synced `KNOWN_EXECUTORS` set in `profile-validator.cjs`, in the same change as the `dispatch-model.cjs` edit.
- Add or extend `cli-cursor` coverage in `executor-config.vitest.ts`, `executor-audit.vitest.ts`, `fanout-run.vitest.ts` (carrying the `isCodexBinaryAvailable` fail-closed test precedent this phase mirrors), and `remediation.vitest.ts`.

### Out of Scope
- The `cli-cursor` skill packet, hub registry wiring (`mode-registry.json`/`hub-router.json`/`leaf-manifest.json`), and `SKILL.md`/`README.md` authoring (phase 003).
- Self-invocation guard signal design for `cli-cursor` — packet-owned per `cli-external-orchestration/SKILL.md` ("the self-invocation guard is packet-owned and non-negotiable"), not a runtime-layer concern. This phase only makes `cli-cursor` dispatchable.
- Cursor hook adapters (phase 004), model registry / routing rows (phase 005), the manual-testing playbook (phase 006), and docs/agents/governance closeout (phase 007).
- Reconciling the pre-existing mutual asymmetry between `dispatch-model.cjs`'s and `profile-validator.cjs`'s `KNOWN_EXECUTORS` sets for kinds other than `cli-cursor` — this phase adds parity for the new kind only.
- Wiring Cursor's native `-w`/`--worktree` isolation into deep-loop fan-out — the runtime already manages its own lineage worktrees; a dispatched `cursor-agent` runs inside the lineage's cwd without `-w`. Documented in phase 003, not wired here.
- Any live, billed `cursor-agent` dispatch as an automated test gate — auth is operator-gated and account-scoped.

### Files to Change
| File Path | Change Type | Description |
|---|---|---|
| `system-deep-loop/runtime/lib/deep-loop/executor-config.ts` | Modify | Widen `EXECUTOR_KINDS`; add `cli-cursor` to the flag and web-search matrices; add `CursorApprovalMode`/`resolveCursorApprovalMode()`/`CURSOR_SUPPORTED_MODELS`. |
| `system-deep-loop/runtime/lib/deep-loop/executor-audit.ts` | Modify | Add `cli-cursor` rows to the binary/session/state/home-dir/env-prefix maps. |
| `system-deep-loop/runtime/scripts/fanout-run.cjs` | Modify | Add `cli-cursor` to `SPECKIT_STATE_ENV_BY_KIND`; implement and register `buildCursorLineageCommand` with a fail-closed preflight. |
| `system-deep-loop/deep-improvement/scripts/model-benchmark/dispatch-model.cjs` | Modify | Add `cli-cursor` to `KNOWN_EXECUTORS`; new `buildSpawnSpec` case. |
| `system-deep-loop/deep-improvement/scripts/model-benchmark/lib/profile-validator.cjs` | Modify | Add `cli-cursor` to its own hand-synced `KNOWN_EXECUTORS`, in the same change as `dispatch-model.cjs`. |
| `system-deep-loop/runtime/tests/unit/{executor-config,executor-audit,fanout-run}.vitest.ts`, `system-deep-loop/deep-improvement/scripts/model-benchmark/tests/remediation.vitest.ts` | Modify | Add `cli-cursor` coverage; regression-guard the existing kinds' assertions. |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Priority |
|---|---|---|
| REQ-001 | `EXECUTOR_KINDS` gains `'cli-cursor'`; `EXECUTOR_KIND_FLAG_SUPPORT` (`Record<ExecutorKind, ...>`) and `EXECUTOR_WEB_SEARCH_CAPABILITY_MATRIX` (`satisfies Record<ExecutorKind, ...>`) each gain a matching `cli-cursor` row so `executor-config.ts` compiles cleanly with no missing-property error. | P0 |
| REQ-002 | The `cli-cursor` row in `EXECUTOR_KIND_FLAG_SUPPORT` lists only fields Cursor's CLI actually supports per phase 001 (`model`, `sandboxMode` for the approval/sandbox mapping, `timeoutSeconds`, `liveTools`); `reasoningEffort` is included only if implemented via the parameterized model bracket (`model[effort=...]`), never as a fabricated standalone flag; `configDir` is omitted unless a Cursor config-dir CLI flag is confirmed. | P0 |
| REQ-003 | `CURSOR_SUPPORTED_MODELS`, a `CursorSupportedModel` type, a `CursorApprovalMode` type (`ask`/`auto-review`/`force`), and a `resolveCursorApprovalMode()` function are added to `executor-config.ts`, modeled on phase 001's confirmed approval/sandbox flags. The model list is left explicitly extensible with a TBD note because the live roster is auth-gated; no fabricated model id is committed. | P1 |
| REQ-004 | `executor-audit.ts` gains a `cli-cursor` row in `EXECUTOR_BINARY_BY_KIND` (`'cursor-agent'`), `EXECUTOR_STATE_ENV_BY_KIND`, `EXECUTOR_DEFAULT_HOME_DIR_BY_KIND` (`'.cursor'`), and `EXECUTOR_ENV_PREFIXES_BY_KIND` (`CURSOR_`, confirmed via `CURSOR_API_KEY`/`CURSOR_AUTH_TOKEN`/`CURSOR_API_ENDPOINT`). `EXECUTOR_SESSION_ENV_BY_KIND` gains a row only once Cursor's session-id env var is confirmed (REQ-011); it stays unset otherwise, which the existing `Partial<Record<...>>` typing already permits. | P0 |
| REQ-005 | `fanout-run.cjs` gains a `cli-cursor` row in `SPECKIT_STATE_ENV_BY_KIND` and a new `buildCursorLineageCommand` function registered in `LINEAGE_COMMAND_ADAPTERS`; `buildLineageCommand({kind:'cli-cursor', ...})` no longer throws `Unknown fan-out executor kind: cli-cursor`. | P0 |
| REQ-006 | `buildCursorLineageCommand` constructs a non-interactive command shaped `cursor-agent -p "<prompt>" --output-format text --model <id> [--force\|--auto-review] [--sandbox enabled\|disabled]`, using phase 001's confirmed flag set. The family-wide `</dev/null` stdin-redirect convention (used on siblings to prevent silent stdin theft) is documented as recommended-for-stability and verified against the live `cursor-agent` build at implementation time, not asserted blindly. | P0 |
| REQ-007 | `buildCursorLineageCommand` (or a paired `isCursorBinaryAvailable`-style guard) fails closed via a `command -v cursor-agent` preflight before constructing the command; when `cursor-agent` is absent from `PATH`, it throws a clean, typed unavailable error, never raw subprocess ENOENT noise — matching `isCodexBinaryAvailable`/`buildCodexLineageCommand` exactly. Because a `-p` dispatch without auth exits `0` (phase 001), the guard MUST NOT rely on exit code to detect unavailability. | P0 |
| REQ-008 | `dispatch-model.cjs`'s `KNOWN_EXECUTORS` set gains `'cli-cursor'`; its `buildSpawnSpec` switch gains a `case 'cli-cursor'` constructing a real non-interactive command, honoring a `CURSOR_AGENT_BIN` env override matching the existing `OPENCODE_BIN`/`CLAUDE_BIN` pattern. | P0 |
| REQ-009 | `profile-validator.cjs`'s separate, hand-synced `KNOWN_EXECUTORS` set gains `'cli-cursor'` in the same change as REQ-008, so the two sets do not drift out of parity **for the new kind**. Each set's own pre-existing divergent membership for other kinds is left untouched — reconciling that is out of scope. | P1 |
| REQ-010 | Every pre-existing assertion in `executor-config.vitest.ts`, `executor-audit.vitest.ts`, `fanout-run.vitest.ts`, and `remediation.vitest.ts` exercising `native`/`cli-codex`/`cli-claude-code`/`cli-opencode` continues to pass unchanged after `cli-cursor` is added (regression guard). | P0 |
| REQ-011 | Cursor's session-id environment variable (the `cli-cursor` analog to `CODEX_SESSION_ID`) is confirmed at implementation time — e.g. via a live session's environment or `--resume` chat-id semantics — before `EXECUTOR_SESSION_ENV_BY_KIND['cli-cursor']` is populated. A variable name is never invented. | P2 |
| REQ-012 | A new fail-closed test for `cli-cursor` is added to `fanout-run.vitest.ts`, mirroring the existing `codex is absent` case, proving `buildLineageCommand({kind:'cli-cursor', ...})` throws before any subprocess spawn when `cursor-agent` is absent from a scoped `PATH`. | P1 |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
- **SC-001**: `EXECUTOR_KINDS` contains `cli-cursor`, and strict typecheck on `executor-config.ts`/`executor-audit.ts` exits 0.
- **SC-002**: `buildLineageCommand({kind: 'cli-cursor', ...})` returns a command array matching the confirmed shape (`cursor-agent`, `-p`, prompt, `--output-format`, `text`, `--model`, id, plus the resolved approval/sandbox flags).
- **SC-003**: With `cursor-agent` absent from a scoped `PATH`, `buildLineageCommand`/`buildCursorLineageCommand` throws before any subprocess spawn (mirroring the existing `cli-codex` absent-binary test), and does not depend on the dispatch exit code.
- **SC-004**: `dispatch-model.cjs` and `profile-validator.cjs` `KNOWN_EXECUTORS` both contain `'cli-cursor'` after the change.
- **SC-005**: A focused Vitest run across the 4 named test files passes 100%, with zero regressions in existing `native`/`cli-codex`/`cli-claude-code`/`cli-opencode` assertions.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
- **Session-env var invented instead of confirmed**: writing a guessed env-var name into `EXECUTOR_SESSION_ENV_BY_KIND` would silently corrupt the recursion guard's env-detection layer for `cli-cursor`. Mitigation: REQ-011 defers the row until confirmed; the map's `Partial<Record<...>>` typing already tolerates an absent entry.
- **Approval/sandbox mapping guessed**: the runtime's generic `SandboxMode` enum does not map 1:1 onto Cursor's flags (Cursor has `--sandbox enabled|disabled` plus separate approval flags `--force`/`--auto-review`). Mitigation: `resolveCursorApprovalMode()` makes the mapping explicit and testable; the exact mapping is decided at implementation time, not guessed silently.
- **Model id fabricated**: the live model roster is auth-gated (phase 001). Mitigation: `CURSOR_SUPPORTED_MODELS` is seeded only from `--help`/product-page-confirmed shapes (`Auto`, Composer, plus parameterized frontier ids) and marked extensible; no invented id ships.
- **Self-invocation guard gap (by design, deferred)**: after this phase, `cli-cursor` is dispatchable at the runtime layer with no self-invocation guard of its own — phase 003 owns that design. Mitigation: explicitly out of scope here; flagged for 003.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. NON-FUNCTIONAL REQUIREMENTS
- Reliability: an absent `cursor-agent` binary fails before spawn, matching `cli-codex`'s `isCodexBinaryAvailable` preflight — no retries burn wall-clock time against an executor that can never succeed, and the guard never trusts the (always-0) dispatch exit code as an availability signal.
- Consistency: the `cli-cursor` addition is a widening-only change — it must not alter the runtime type shape (`ExecutorKind`) or default behavior observed by any of the existing kinds.

## 8. EDGE CASES
- `cursor-agent` absent from `PATH` entirely at dispatch time (handled by the fail-closed preflight, REQ-007).
- An approval value supplied that isn't one of the confirmed modes (`ask`/`auto-review`/`force`) — `resolveCursorApprovalMode()` must reject or map deterministically, not silently pass through an invalid string.
- `model` omitted from the lineage config — the adapter needs an explicit default; `Auto` (Cursor's documented router default) is a reasonable adapter default candidate, TBD confirm at implementation time.
- `sandboxMode` requesting `danger-full-access` — maps to `--force`/`--yolo` (Run Everything) rather than a Cursor sandbox value; the exact `SandboxMode → Cursor flags` mapping needs an explicit implementation-time decision, not an implicit one.

## 9. COMPLEXITY ASSESSMENT
| Dimension | Score | Notes |
|---|---|---|
| Scope | 16/25 | 5 production files + 4 test files touched; one net-new function (`buildCursorLineageCommand`) plus 3 new types/consts. |
| Risk | 14/25 | Compile-time enum widening is mechanical; the genuinely unconfirmed facts (session-env var, approval mapping, live model ids) are contained and flagged, not guessed silently. |
| Research | 8/20 | Phase 001 already pinned the live CLI contract; remaining unknowns are narrow and explicitly deferred to implementation time. |
| **Total** | **38/70** | **Level 2** |

## 10. RISK MATRIX
| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Session-env var invented instead of confirmed | Medium | Medium (silent state-isolation gap for `cli-cursor`) | REQ-011 defers the row until confirmed via a live session env. |
| Approval/sandbox mapping guessed instead of decided | Medium | Medium (invalid or over-permissive dispatch flags) | `resolveCursorApprovalMode()` makes the mapping explicit and unit-tested. |
| `KNOWN_EXECUTORS` parity slips between the two files for `cli-cursor` | Medium | Medium (silent validator/dispatcher drift) | REQ-009 plus a single-commit discipline note in `tasks.md`. |

## 11. USER STORIES
- As a deep-loop operator, I want to declare `kind: "cli-cursor"` in a fan-out lineage and have it dispatch a real, non-interactive `cursor-agent` invocation, the same way I already can for the sibling CLIs.
- As a deep-loop operator, I want a lineage requesting `cli-cursor` to fail immediately and clearly when `cursor-agent` isn't installed, not hang or crash with an opaque subprocess error.

## 12. OPEN QUESTIONS
- Cursor's session-id environment variable is unconfirmed (not surfaced during phase 001) — verify via a live session's environment or `--resume` semantics at implementation time; do not invent a name.
- The exact mapping from the runtime's `SandboxMode` enum to Cursor's approval/sandbox flags (`--sandbox enabled|disabled`, `--force`/`--yolo`, `--auto-review`) is not yet decided — a concrete decision is required before REQ-006 can be implemented byte-for-byte.
- Whether `reasoningEffort` should be expressed via Cursor's parameterized model bracket (`model[effort=high]`) instead of a standalone flag — leaning yes per phase 001's `--help`, confirm at implementation time.
- Self-invocation guard signal design for `cli-cursor` is explicitly **not** resolved here — flagged as an open requirement for phase 003, packet-owned per `cli-external-orchestration/SKILL.md`.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS
- `plan.md`, `tasks.md`, `checklist.md` (this phase)
- `../001-cursor-contract-pin/implementation-summary.md` (source of the confirmed flag surface, approval model, and binary name this adapter is built against)
- `../003-cli-cursor-skill-packet/spec.md` (consumes this phase's runtime acceptance; owns the self-invocation guard design)
- `../../027-cli-codex-revival/002-deep-loop-executor-support/` (structural and adapter precedent: `buildCodexLineageCommand`, `isCodexBinaryAvailable`)
- `../spec.md` (parent packet)
