---
title: "Feature Specification: Devin deep-loop executor support"
description: "Restore cli-devin as the 5th typed deep-loop executor kind across executor-config.ts, executor-audit.ts, fanout-run.cjs, dispatch-model.cjs, and profile-validator.cjs, with a new fail-closed buildDevinLineageCommand adapter, grounded in phase 001's live-verified 4-mode Devin CLI contract rather than the archived pre-deprecation assumptions."
trigger_phrases: ["cli-devin deep-loop executor", "cli-devin executor kind", "Devin fan-out adapter"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/029-cli-devin-revival/002-deep-loop-executor-support"
    last_updated_at: "2026-07-23T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored spec.md for phase 002 with REQ-001 through REQ-012 grounded in code research"
    next_safe_action: "Begin tasks.md T001: confirm Devin session-env var and sandbox flag mapping"
    blockers: []
    key_files: ["system-deep-loop/runtime/lib/deep-loop/executor-config.ts", "system-deep-loop/runtime/lib/deep-loop/executor-audit.ts", "system-deep-loop/runtime/scripts/fanout-run.cjs", "system-deep-loop/deep-improvement/scripts/model-benchmark/dispatch-model.cjs", "system-deep-loop/deep-improvement/scripts/model-benchmark/lib/profile-validator.cjs"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-devin-revival-authoring", parent_session_id: null }
    completion_pct: 0
    open_questions: ["Devin's session-id environment variable (the cli-devin analog to CODEX_SESSION_ID/CLAUDE_CODE_SESSION_ID/OPENCODE_SESSION_ID) was not found in the fetched docs.devin.ai pages during phase 001 - verify via `devin --help` or a live session's environment at implementation time; do not invent a name.", "Exact mapping from the runtime's 3-value SandboxMode enum (read-only/workspace-write/danger-full-access) to Devin's --sandbox flag (a presence/absence toggle per phase 001, not a valued enum like Codex's --sandbox <mode>) is not yet decided.", "Whether EXECUTOR_ENV_PREFIXES_BY_KIND['cli-devin'] should allowlist both COGNITION_ and DEVIN_ prefixes, or just COGNITION_ (the only one confirmed via COGNITION_API_KEY so far)."]
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Feature Specification: Devin deep-loop executor support

<!-- ANCHOR:metadata -->
## 1. METADATA
| Field | Value |
|---|---|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Planned |
| **Created** | 2026-07-23 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `cli-external-orchestration/029-cli-devin-revival` |
| **Predecessor** | `001-devin-contract-pin` (Complete) |
| **Successor** | `003-cli-devin-skill-packet` |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`cli-devin` was fully removed as a deep-loop executor kind on 2026-06-08. The runtime's typed executor union currently has 4 members (`native`, `cli-codex`, `cli-claude-code`, `cli-opencode`) defined in `EXECUTOR_KINDS` (`executor-config.ts` line 11) and must grow to 5 by re-adding `'cli-devin'`. This union and its dependent maps are consumed across several files that do **not** read any shared registry — unlike the executor-delegation advisor scorer, which is registry-driven and needs no code change for this revival. These files are described in the deep-loop runtime code itself as "kept in sync by hand" (`profile-validator.cjs` line 32), meaning every one of them must be edited individually and will silently drift if any is missed.

Two of the union's dependent maps are compile-time hard blockers, not style preferences: `EXECUTOR_KIND_FLAG_SUPPORT` is typed `Record<ExecutorKind, ...>` and `EXECUTOR_WEB_SEARCH_CAPABILITY_MATRIX` is typed `satisfies Record<ExecutorKind, ...>` (`executor-config.ts` line 99) — TypeScript will refuse to compile either file without a matching `cli-devin` entry once the union is widened.

The archived removal also deleted a `DEVIN_SUPPORTED_MODELS` const, a `DevinSupportedModel` type, a `DevinPermissionMode` type, and a `resolveDevinPermissionMode()` function, all modeled on a stale 2-permission-mode assumption (`auto`/`dangerous`). Phase 001 confirmed the real, currently-shipping Devin CLI (v3000.2.17) has a materially different 4-mode permission system (`normal`, `accept-edits`, `bypass`, `autonomous`), selected via `--permission-mode` or `/mode`. Recreating the deleted types against the old 2-mode shape would restore an inaccurate contract.

### Purpose
Widen the deep-loop runtime's typed executor union to 5 members, restore `cli-devin`'s audit/dispatch metadata across every hand-synced consumer, and add a real fan-out command adapter (`buildDevinLineageCommand`) with an explicit fail-closed preflight — all grounded in phase 001's live-verified contract, not a mechanical replay of the archived removal diff. Leave the `cli-devin` self-invocation guard's signal design and the skill packet itself to phase 003; this phase is the runtime-typing layer only.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Widen `EXECUTOR_KINDS` in `executor-config.ts` to 5 members; add matching `cli-devin` rows to `EXECUTOR_KIND_FLAG_SUPPORT` and `EXECUTOR_WEB_SEARCH_CAPABILITY_MATRIX` so both compile cleanly.
- Re-create `DEVIN_SUPPORTED_MODELS`, `DevinSupportedModel`, `DevinPermissionMode` (4 members), and `resolveDevinPermissionMode()` in `executor-config.ts`, modeled on phase 001's confirmed contract.
- Add `cli-devin` rows to `EXECUTOR_BINARY_BY_KIND`, `EXECUTOR_SESSION_ENV_BY_KIND` (once confirmed), `EXECUTOR_STATE_ENV_BY_KIND`, `EXECUTOR_DEFAULT_HOME_DIR_BY_KIND`, and `EXECUTOR_ENV_PREFIXES_BY_KIND` in `executor-audit.ts`.
- Add a `cli-devin` row to `SPECKIT_STATE_ENV_BY_KIND` and implement a new `buildDevinLineageCommand` function registered in `LINEAGE_COMMAND_ADAPTERS` in `fanout-run.cjs`, with a `command -v devin` fail-closed preflight mirroring `isCodexBinaryAvailable`/`buildCodexLineageCommand` exactly.
- Add `cli-devin` to `KNOWN_EXECUTORS` and a new `buildSpawnSpec` case in `dispatch-model.cjs`.
- Add `cli-devin` to the separate, hand-synced `KNOWN_EXECUTORS` set in `profile-validator.cjs`, in the same change as the `dispatch-model.cjs` edit.
- Add or extend `cli-devin` coverage in `executor-config.vitest.ts`, `executor-audit.vitest.ts`, `fanout-run.vitest.ts` (which carries the actual `isCodexBinaryAvailable` fail-closed test precedent this phase must mirror), and `remediation.vitest.ts`.

### Out of Scope
- The `cli-devin` skill packet, hub registry wiring (`mode-registry.json`/`hub-router.json`/`leaf-manifest.json`), and `SKILL.md`/`README.md` authoring (phase 003).
- Self-invocation guard signal design for `cli-devin` — packet-owned per `cli-external-orchestration/SKILL.md` ("the self-invocation guard is packet-owned and non-negotiable"), not a hub- or runtime-layer concern. This phase only makes `cli-devin` dispatchable; it does not decide how a Devin lineage would detect or refuse self-dispatch.
- Devin hook adapters (phase 004), model registry / quota rows (phase 005), the manual-testing playbook (phase 006), and docs/agents/governance closeout (phase 007).
- Reconciling the pre-existing mutual asymmetry between `dispatch-model.cjs`'s `KNOWN_EXECUTORS` (currently missing `native`/`cli-codex`) and `profile-validator.cjs`'s `KNOWN_EXECUTORS` (currently missing `cli-codex`) for kinds other than `cli-devin` — this phase adds parity for the new kind only.
- Any live, billed `devin` dispatch as part of an automated test gate — the local install from phase 001 makes a manual smoke test possible but not required.

### Files to Change
| File Path | Change Type | Description |
|---|---|---|
| `system-deep-loop/runtime/lib/deep-loop/executor-config.ts` | Modify | Widen `EXECUTOR_KINDS` to 5; add `cli-devin` to the flag and web-search matrices; re-create `DevinPermissionMode`/`resolveDevinPermissionMode()`/`DEVIN_SUPPORTED_MODELS`. |
| `system-deep-loop/runtime/lib/deep-loop/executor-audit.ts` | Modify | Add `cli-devin` rows to the binary/session/state/home-dir/env-prefix maps. |
| `system-deep-loop/runtime/scripts/fanout-run.cjs` | Modify | Add `cli-devin` to `SPECKIT_STATE_ENV_BY_KIND`; implement and register `buildDevinLineageCommand` with a fail-closed preflight. |
| `system-deep-loop/deep-improvement/scripts/model-benchmark/dispatch-model.cjs` | Modify | Add `cli-devin` to `KNOWN_EXECUTORS`; new `buildSpawnSpec` case. |
| `system-deep-loop/deep-improvement/scripts/model-benchmark/lib/profile-validator.cjs` | Modify | Add `cli-devin` to its own hand-synced `KNOWN_EXECUTORS`, in the same change as `dispatch-model.cjs`. |
| `system-deep-loop/runtime/tests/unit/{executor-config,executor-audit,fanout-run}.vitest.ts`, `system-deep-loop/deep-improvement/scripts/model-benchmark/tests/remediation.vitest.ts` | Modify | Add `cli-devin` coverage; regression-guard the existing 4 kinds' assertions. |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Priority |
|---|---|---|
| REQ-001 | `EXECUTOR_KINDS` gains `'cli-devin'` as its 5th member; `EXECUTOR_KIND_FLAG_SUPPORT` (`Record<ExecutorKind, ...>`) and `EXECUTOR_WEB_SEARCH_CAPABILITY_MATRIX` (`satisfies Record<ExecutorKind, ...>`) each gain a matching `cli-devin` row so `executor-config.ts` compiles cleanly with no missing-property error. | P0 |
| REQ-002 | The `cli-devin` row in `EXECUTOR_KIND_FLAG_SUPPORT` lists only fields Devin's CLI actually supports per phase 001's live contract (`model`, `sandboxMode` for permission-mode mapping, `timeoutSeconds`, `liveTools`); `configDir` is included only if a Devin config-dir CLI flag is confirmed at implementation time, never assumed. | P0 |
| REQ-003 | `DEVIN_SUPPORTED_MODELS`, a `DevinSupportedModel` type, a `DevinPermissionMode` type (exactly 4 members: `normal`, `accept-edits`, `bypass`, `autonomous`), and a `resolveDevinPermissionMode()` function are re-created in `executor-config.ts`, modeled on phase 001's confirmed 4-mode contract. The archived 2-mode (`auto`/`dangerous`) shape is not resurrected anywhere in the diff. | P1 |
| REQ-004 | `executor-audit.ts` gains a `cli-devin` row in `EXECUTOR_BINARY_BY_KIND` (`'devin'`), `EXECUTOR_STATE_ENV_BY_KIND`, `EXECUTOR_DEFAULT_HOME_DIR_BY_KIND` (`'.devin'`), and `EXECUTOR_ENV_PREFIXES_BY_KIND` (`COGNITION_` and, if confirmed, `DEVIN_`). `EXECUTOR_SESSION_ENV_BY_KIND` gains a row only once Devin's session-id env var is confirmed (REQ-011); it stays unset otherwise, which the existing `Partial<Record<...>>` typing already permits. | P0 |
| REQ-005 | `fanout-run.cjs` gains a `cli-devin` row in `SPECKIT_STATE_ENV_BY_KIND` and a new `buildDevinLineageCommand` function registered in `LINEAGE_COMMAND_ADAPTERS`; `buildLineageCommand({kind:'cli-devin', ...})` no longer throws `Unknown fan-out executor kind: cli-devin`. | P0 |
| REQ-006 | `buildDevinLineageCommand` constructs a non-interactive command shaped `devin -p "<prompt>" --model <id> --permission-mode <mode> [--sandbox]`, using phase 001's confirmed flag set (`--model`, `--permission-mode`, `--print`/`-p`, `--sandbox`). The family-wide `</dev/null` stdin-redirect convention (used on `cli-codex`/`cli-opencode` to prevent silent stdin theft) is documented as recommended-for-stability on the real `devin` binary, not asserted as load-bearing — phase 001-era testing (on an older `devin 2026.5.6-8` build, not the current 3000.2.17) found it did not reproduce as a hard requirement; this must be re-verified against the current build at implementation time, not assumed either way. | P0 |
| REQ-007 | `buildDevinLineageCommand` (or a paired `isDevinBinaryAvailable`-style guard) fails closed via a `command -v devin` preflight before constructing the command; when `devin` is absent from `PATH`, it throws a clean, typed unavailable error, never raw subprocess ENOENT noise — matching `isCodexBinaryAvailable`/`buildCodexLineageCommand`'s existing pattern exactly. | P0 |
| REQ-008 | `dispatch-model.cjs`'s `KNOWN_EXECUTORS` set (currently `{cli-opencode, cli-claude-code}`, lines 137-140) gains `'cli-devin'`; its `buildSpawnSpec` switch (currently only handling `cli-opencode`/`cli-claude-code`) gains a `case 'cli-devin'` constructing a real non-interactive command, honoring a `DEVIN_BIN` env override matching the existing `OPENCODE_BIN`/`CLAUDE_BIN` pattern. | P0 |
| REQ-009 | `profile-validator.cjs`'s separate, hand-synced `KNOWN_EXECUTORS` set (currently `{native, cli-opencode, cli-claude-code}`, lines 34-38) gains `'cli-devin'` in the same change as REQ-008, so the two sets do not drift out of parity **for the new kind**. Each set's own pre-existing, already-divergent membership for other kinds (the dispatcher lacks `native`/`cli-codex`; the validator lacks `cli-codex`) is left untouched — reconciling that is out of scope for this phase. | P1 |
| REQ-010 | Every pre-existing assertion in `executor-config.vitest.ts`, `executor-audit.vitest.ts`, `fanout-run.vitest.ts`, and `remediation.vitest.ts` that exercises `native`, `cli-codex`, `cli-claude-code`, or `cli-opencode` continues to pass unchanged after `cli-devin` is added — no existing assertion's expected value changes (regression guard). | P0 |
| REQ-011 | Devin's session-id environment variable (the `cli-devin` analog to `CODEX_SESSION_ID`/`CLAUDE_CODE_SESSION_ID`/`OPENCODE_SESSION_ID`) is confirmed at implementation time — e.g. via `devin --help` output or inspecting a live session's environment — before `EXECUTOR_SESSION_ENV_BY_KIND['cli-devin']` is populated. A variable name is never invented. | P2 |
| REQ-012 | A new fail-closed test for `cli-devin` is added to `fanout-run.vitest.ts`, mirroring the existing `'fails closed before command construction when codex is absent'` case in the same file (the actual `isCodexBinaryAvailable` precedent, not the 3 files named in the initial scope note), proving `buildLineageCommand({kind:'cli-devin', ...})` throws before any subprocess spawn attempt when `devin` is absent from a scoped `PATH`. | P1 |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
- **SC-001**: `EXECUTOR_KINDS` contains `cli-devin`, and strict typecheck on `executor-config.ts`/`executor-audit.ts` exits 0.
- **SC-002**: `buildLineageCommand({kind: 'cli-devin', ...})` returns a command array matching the confirmed shape (`devin`, `-p`, prompt, `--model`, id, `--permission-mode`, mode, optional `--sandbox`).
- **SC-003**: With `devin` absent from a scoped `PATH`, `buildLineageCommand`/`buildDevinLineageCommand` throws before any subprocess spawn attempt (mirroring the existing `cli-codex` absent-binary test in `fanout-run.vitest.ts`).
- **SC-004**: `dispatch-model.cjs` and `profile-validator.cjs` `KNOWN_EXECUTORS` both contain `'cli-devin'` after the change.
- **SC-005**: A focused Vitest run across `executor-config.vitest.ts`, `executor-audit.vitest.ts`, `fanout-run.vitest.ts`, and `remediation.vitest.ts` passes 100%, with zero regressions in existing `native`/`cli-codex`/`cli-claude-code`/`cli-opencode` assertions.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
- **Session-env var invented instead of confirmed**: writing a guessed env-var name into `EXECUTOR_SESSION_ENV_BY_KIND` would silently corrupt the recursion guard's env-detection layer for `cli-devin`. Mitigation: REQ-011 defers the row until confirmed; the map's `Partial<Record<...>>` typing already tolerates an absent entry.
- **`</dev/null` finding is version-stale**: the "not load-bearing" finding was tested on an older `devin 2026.5.6-8` build; the currently-verified live version (phase 001) is `3000.2.17`. Mitigation: re-verify at implementation time; keep the spec's wording as recommended-for-stability, not a hard requirement, until re-confirmed either way.
- **Over-broad env-prefix allowlist**: guessing a bare `DEVIN_` prefix without confirming it could leak unrelated environment variables into a dispatched Devin subprocess. Mitigation: verify exact prefixes at implementation time (`devin --help`, live session env) rather than assuming both `COGNITION_` and `DEVIN_` are correct.
- **Self-invocation guard gap (by design, deferred)**: after this phase, `cli-devin` is dispatchable at the runtime-typing layer with no self-invocation guard of its own — phase 003 owns that design. Mitigation: explicitly out of scope here (see §3); not silently left unaddressed, flagged for 003.
- **`KNOWN_EXECUTORS` parity is only partial by design**: `dispatch-model.cjs` and `profile-validator.cjs` are already mutually inconsistent for kinds other than `cli-devin` before this phase. Mitigation: REQ-009 adds parity for the new kind only and documents the pre-existing gap rather than silently "fixing" it as an unplanned scope expansion.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. NON-FUNCTIONAL REQUIREMENTS
- Reliability: an absent Devin binary fails before spawn, matching `cli-codex`'s `isCodexBinaryAvailable` preflight precedent exactly — no retries burn wall-clock time against an executor that can never succeed.
- Consistency: the `cli-devin` addition is a widening-only change — it must not alter the runtime type shape (`ExecutorKind`) or default behavior observed by any of the other 4 existing kinds.

## 8. EDGE CASES
- `devin` absent from `PATH` entirely at dispatch time (handled by the fail-closed preflight, REQ-007).
- A `--permission-mode` value supplied that isn't one of the 4 confirmed modes (`normal`/`accept-edits`/`bypass`/`autonomous`) — `resolveDevinPermissionMode()` must reject or map deterministically, not silently pass through an invalid string.
- `model` omitted from the lineage config — the adapter needs an explicit default; `docs.devin.ai/cli/models.md` documents `adaptive` (the intelligent auto-router) as Devin's own recommended default per phase 001, a reasonable adapter-default candidate, TBD confirm at implementation time.
- `sandboxMode` requesting `danger-full-access` when Devin's own `--sandbox` flag is a presence/absence toggle, not a 3-value enum like Codex's `--sandbox <mode>` — the mapping from the runtime's generic `SandboxMode` to Devin's boolean `--sandbox` flag needs an explicit implementation-time decision, not an implicit one.

## 9. COMPLEXITY ASSESSMENT
| Dimension | Score | Notes |
|---|---|---|
| Scope | 16/25 | 5 production files + 4 test files touched; one net-new function (`buildDevinLineageCommand`) plus 4 re-created types/consts. |
| Risk | 14/25 | Compile-time enum widening is mechanical; the two genuinely unconfirmed facts (session-env var, exact `--sandbox` mapping) are contained and flagged, not guessed silently. |
| Research | 8/20 | Phase 001 already pinned the live CLI contract; remaining unknowns are narrow and explicitly deferred to implementation time. |
| **Total** | **38/70** | **Level 2** |

## 10. RISK MATRIX
| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Session-env var invented instead of confirmed | Medium | Medium (silent state-isolation gap for `cli-devin`) | REQ-011 defers the row until confirmed via `devin --help`/live env. |
| `</dev/null` finding is version-stale (tested on `2026.5.6-8`, current live is `3000.2.17`) | Low | Low (already documented as non-load-bearing, not a new claim) | Re-verify at implementation time; keep as recommended-for-stability wording. |
| `KNOWN_EXECUTORS` parity slips between `dispatch-model.cjs` and `profile-validator.cjs` for `cli-devin` specifically | Medium | Medium (silent validator/dispatcher drift for the new kind) | REQ-009 plus a single-commit discipline note in `tasks.md`. |

## 11. USER STORIES
- As a deep-loop operator, I want to declare `kind: "cli-devin"` in a fan-out lineage and have it dispatch a real, non-interactive Devin invocation, the same way I already can for `cli-codex`/`cli-claude-code`/`cli-opencode`.
- As a deep-loop operator, I want a lineage requesting `cli-devin` to fail immediately and clearly when `devin` isn't installed, not hang or crash with an opaque subprocess error.

## 12. OPEN QUESTIONS
- Devin's session-id environment variable is unconfirmed (not found in the fetched `docs.devin.ai` pages during phase 001) — verify via `devin --help` or a live session's environment at implementation time; do not invent a name.
- The exact mapping from the runtime's 3-value `SandboxMode` enum to Devin's boolean `--sandbox` flag is not yet decided — a concrete decision is required before REQ-006 can be implemented byte-for-byte.
- Whether `EXECUTOR_ENV_PREFIXES_BY_KIND['cli-devin']` should include both `COGNITION_` and `DEVIN_`, or just `COGNITION_` (the only prefix confirmed so far via `COGNITION_API_KEY`), pending implementation-time confirmation.
- Self-invocation guard signal design for `cli-devin` is explicitly **not** resolved in this phase — flagged as an open requirement for phase 003, packet-owned per `cli-external-orchestration/SKILL.md`'s own rule ("the self-invocation guard is packet-owned and non-negotiable").
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS
- `plan.md`, `tasks.md`, `checklist.md` (this phase)
- `../001-devin-contract-pin/implementation-summary.md` (source of the confirmed 4-mode permission contract and CLI flag surface this phase's adapter is built against)
- `../003-cli-devin-skill-packet/spec.md` (consumes this phase's runtime acceptance; owns the self-invocation guard design)
- `../../027-cli-codex-revival/002-deep-loop-executor-support/` (structural and adapter precedent: `buildCodexLineageCommand`, `isCodexBinaryAvailable`)
- `../spec.md` (parent packet)
