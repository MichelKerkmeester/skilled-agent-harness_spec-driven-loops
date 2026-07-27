---
title: "Feature Specification: Pi deep-loop executor support"
description: "Add cli-pi as a 6th typed deep-loop executor kind across executor-config.ts, executor-audit.ts, fanout-run.cjs, and the model-benchmark dispatchers (dispatch-model.cjs/profile-validator.cjs), with a new buildPiLineageCommand fan-out adapter and a fail-closed dispatch guard keyed on phase 001's live-probed non-interactive invocation contract, never a flag guessed by analogy to a sibling CLI."
trigger_phrases:
  - "cli-pi deep-loop executor"
  - "cli-pi executor kind"
  - "Pi fan-out adapter"
  - "buildPiLineageCommand"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/031-cli-pi-creation/002-deep-loop-executor-support"
    last_updated_at: "2026-07-27T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored spec.md grounded in the real 5-member EXECUTOR_KINDS union"
    next_safe_action: "Author plan.md, tasks.md, checklist.md for this phase"
    blockers: ["Phase 001 has not executed; command-construction body needs its live findings"]
    key_files: ["system-deep-loop/runtime/lib/deep-loop/executor-config.ts", "system-deep-loop/runtime/scripts/fanout-run.cjs"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "cli-pi-creation-authoring"
      parent_session_id: null
    completion_pct: 0
    open_questions: ["Pi's headless invocation syntax is unconfirmed pending phase 001", "Exit-code semantics on dispatch failure are unconfirmed", "Whether Pi has a sandbox/approval flag equivalent is unconfirmed", "Pi's model roster (pi.dev/models) was never fetched", "Pi's session-id env var equivalent is unconfirmed"]
    answered_questions: []
---
# Feature Specification: Pi deep-loop executor support

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Planned |
| **Created** | 2026-07-27 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `cli-external-orchestration/031-cli-pi-creation` |
| **Predecessor** | `001-pi-contract-pin` (Planned) |
| **Successor** | `003-cli-pi-skill-packet` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The deep-loop runtime's typed executor union currently has **5** members — confirmed live at `executor-config.ts` line 11: `['native', 'cli-codex', 'cli-claude-code', 'cli-opencode', 'cli-cursor']`. `cli-devin` is **not** present in the real union (the `029-cli-devin-revival/002` phase that would have added it is still `Status: Planned`, never implemented — its own checklist.md records "Phase not yet started"). To make `cli-pi` dispatchable, the union must grow to **6** members by appending `'cli-pi'`. This union and its five dependent maps/functions are consumed across files that do **not** read any shared registry — the runtime code itself documents this as "kept in sync by hand" (`profile-validator.cjs` line 33) — so every one of `executor-config.ts`, `executor-audit.ts`, `fanout-run.cjs`, `dispatch-model.cjs`, and `profile-validator.cjs` must be edited individually and will silently drift if any is missed.

Two of the union's dependent maps are compile-time hard blockers, not style preferences: `EXECUTOR_KIND_FLAG_SUPPORT` is typed `Record<ExecutorKind, readonly (keyof ExecutorConfig)[]>` (line 74) and `EXECUTOR_WEB_SEARCH_CAPABILITY_MATRIX` is `as const satisfies Record<ExecutorKind, Record<WebSearchPolicy, boolean>>` (line 121) — TypeScript will refuse to compile either file without a matching `cli-pi` row once the union is widened.

Unlike the two most recent sibling additions in this same file family — `cli-devin` (029, which had a fully live-verified 4-mode permission contract and 7-model roster from its own phase 001 before this executor phase was drafted) and `cli-cursor` (030, live-verified and now the real 5th member, complete with `resolveCursorApprovalMode()` and a 10-model enforced allowlist) — `cli-pi`'s phase 001 (`001-pi-contract-pin`) has **not executed yet**. Everything known about Pi's CLI comes from a single WebFetch pass over pi.dev's documentation, not a live install. Concretely: Pi's binary name (`pi`) and repo-root config dir (`.pi/`) are confirmed by direct doc quotes ("Project settings (`.pi/settings.json`) override global settings", "Start with `pi` in a terminal"), but the docs nav names a "Programmatic Usage" section (SDK, RPC Mode, JSON Event Stream Mode) as the likely non-interactive dispatch surface **without confirming its exact invocation syntax, exit-code semantics on failure, or env-var surface** — and both `https://pi.dev/docs/latest/install` and `https://pi.dev/docs/latest/mcp` 404, meaning even the docs site itself is incomplete for some surfaces. Building `buildPiLineageCommand` on a Codex-`exec`-shaped, Claude-`-p`-shaped, or Cursor-`-p`-shaped assumption — by analogy rather than confirmation — would risk repeating this exact runtime's own documented mistake class: `cursor-agent -p` was found to exit `0` even on auth failure (030), and an initial Devin hooks config produced zero firings across 9 tests before the real cause (an unsupported config schema, not "no headless attachment point") was found (029 retrospective). Both were misdiagnosed initially because an assumption was tested against reality too late.

### Purpose
Widen the deep-loop runtime's typed executor union to 6 members, add `cli-pi`'s audit/dispatch metadata across every hand-synced consumer, and scaffold a fail-closed `buildPiLineageCommand` fan-out adapter whose command-construction body is explicitly gated on phase 001's live-confirmed non-interactive invocation contract — never a flag guessed by analogy to `codex exec`, `claude -p`, or `cursor-agent -p`. The parts of this phase that do **not** depend on that unconfirmed contract (union widening, matrix scaffolding, binary-availability fail-closed preflight, dispatcher/validator parity, regression tests) are fully specified below as concrete, buildable work; the parts that do depend on it (the adapter's actual `args` array, the model allowlist's real roster, the sandbox/permission mapping) are scoped as explicitly deferred, falsifiable follow-on work, not guessed here. The `cli-pi` self-invocation guard's signal design and the skill packet itself remain phase 003's job, per `cli-external-orchestration/SKILL.md` line 148 ("the self-invocation guard is packet-owned and non-negotiable").
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Widen `EXECUTOR_KINDS` in `executor-config.ts` to 6 members; add matching `cli-pi` rows to `EXECUTOR_KIND_FLAG_SUPPORT` and `EXECUTOR_WEB_SEARCH_CAPABILITY_MATRIX` so both compile cleanly, limited to fields confirmed safe without a live Pi install (`model`, `timeoutSeconds` — the latter is a spawn-wrapper kill timer applied regardless of the target CLI's own flags, per `executor-audit.ts` lines 121/1040-1041 — and `liveTools`).
- Scaffold a `PiSupportedModel` type, a `PI_SUPPORTED_MODELS` allowlist constant (empty or a single documented placeholder — no fabricated id), and an `isPiModelAllowed()` guard function in `executor-config.ts`, mirroring `CURSOR_SUPPORTED_MODELS`/`isCursorModelAllowed()`'s shape (lines 136-156) but explicitly deferring roster population to phase 001 (a first live pass) and phase 009 (`009-pi-model-registry-and-routing`, the packet's dedicated model-registry phase per the 11-phase plan).
- Add `cli-pi` rows to `EXECUTOR_BINARY_BY_KIND` (`'pi'`), `EXECUTOR_STATE_ENV_BY_KIND` (`['SPECKIT_PI_STATE_DIR']`, a repo-owned var only — no fabricated CLI-native `PI_HOME`-style override), and `EXECUTOR_DEFAULT_HOME_DIR_BY_KIND` (`'.pi'`, confirmed by the `.pi/settings.json` doc quote) in `executor-audit.ts`. Leave `EXECUTOR_SESSION_ENV_BY_KIND['cli-pi']` and `EXECUTOR_ENV_PREFIXES_BY_KIND['cli-pi']` unset/absent — the `Partial<Record<...>>` typing on both maps already tolerates this — until a real session-id var or auth-env prefix is confirmed.
- Add a `cli-pi` row to `SPECKIT_STATE_ENV_BY_KIND` and an `isPiBinaryAvailable()` fail-closed preflight (mirroring `isCodexBinaryAvailable`/`isCursorBinaryAvailable` exactly, lines 1704-1721) in `fanout-run.cjs`; scaffold `buildPiLineageCommand`, register it in `LINEAGE_COMMAND_ADAPTERS`, and gate its command-construction body on phase 001's confirmed syntax (see REQ-005).
- Add `cli-pi` to `KNOWN_EXECUTORS` (currently `{cli-opencode, cli-claude-code, cli-cursor}`, lines 156-160) and a new `buildSpawnSpec` `case 'cli-pi'` in `dispatch-model.cjs`, honoring a `PI_BIN` env override matching the existing `OPENCODE_BIN`/`CLAUDE_BIN`/`CURSOR_AGENT_BIN` pattern.
- Add `cli-pi` to the separate, hand-synced `KNOWN_EXECUTORS` set in `profile-validator.cjs` (currently `{native, cli-opencode, cli-claude-code, cli-cursor}`, lines 34-39), in the same change as the `dispatch-model.cjs` edit.
- Add or extend `cli-pi` coverage in `executor-config.vitest.ts`, `executor-audit.vitest.ts`, `fanout-run.vitest.ts` (carrying the `isCodexBinaryAvailable`/`isCursorBinaryAvailable` fail-closed test precedent, lines 957 and 1074), and `remediation.vitest.ts`.

### Out of Scope
- The `cli-pi` skill packet, hub registry wiring (`mode-registry.json`/`hub-router.json`/`leaf-manifest.json`), and `SKILL.md` authoring, including the self-invocation guard signal design (phase 003) — packet-owned per `cli-external-orchestration/SKILL.md` ("the self-invocation guard is packet-owned and non-negotiable"), not a runtime-layer concern.
- Live-confirming Pi's actual non-interactive invocation syntax, exit-code semantics, session-id env var, model roster, or sandbox/permission flags — that is phase 001's job. This phase treats every one of those facts as an open question with a named blocking dependency, never a guess.
- Populating `PI_SUPPORTED_MODELS` with a real, live-confirmed model roster — owned by phase 009 (`009-pi-model-registry-and-routing`) per the packet's 11-phase plan, which explicitly sources it from `https://pi.dev/models`. This phase only scaffolds the enforcement mechanism (the type, the empty/placeholder constant, and the fail-closed guard function).
- The Pi skill-discovery bridge (phase 004), command-layer flattening (phase 005), agent bridge via `pi-subagents` (phase 006), MCP host integration via `pi-mcp-extension` (phase 007), the extension/hook layer (phase 008), the manual-testing playbook (phase 010), and docs/agents/governance closeout (phase 011).
- Reconciling the pre-existing mutual asymmetry between `dispatch-model.cjs`'s `KNOWN_EXECUTORS` (currently missing `native`/`cli-codex`) and `profile-validator.cjs`'s `KNOWN_EXECUTORS` (currently missing `cli-codex`) for kinds other than `cli-pi` — this phase adds parity for the new kind only, matching the discipline both the 029 and 030 precedent phases already documented for the same pre-existing gap.
- Any live, billed `pi` dispatch as part of an automated test gate — `pi` is not yet installed in this environment (phase 001 owns install) and this phase is planning-only per the packet's hard constraints.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `system-deep-loop/runtime/lib/deep-loop/executor-config.ts` | Modify | Widen `EXECUTOR_KINDS` to 6; add `cli-pi` to the flag and web-search matrices; scaffold `PiSupportedModel`/`PI_SUPPORTED_MODELS`/`isPiModelAllowed()`. |
| `system-deep-loop/runtime/lib/deep-loop/executor-audit.ts` | Modify | Add `cli-pi` rows to the binary/state-env/home-dir maps; leave session-env/env-prefix rows unset pending confirmation. |
| `system-deep-loop/runtime/scripts/fanout-run.cjs` | Modify | Add `cli-pi` to `SPECKIT_STATE_ENV_BY_KIND`; add `isPiBinaryAvailable()`; scaffold and register `buildPiLineageCommand` (command body gated on phase 001). |
| `system-deep-loop/deep-improvement/scripts/model-benchmark/dispatch-model.cjs` | Modify | Add `cli-pi` to `KNOWN_EXECUTORS`; new `buildSpawnSpec` case (body gated on phase 001, same as the fan-out adapter). |
| `system-deep-loop/deep-improvement/scripts/model-benchmark/lib/profile-validator.cjs` | Modify | Add `cli-pi` to its own hand-synced `KNOWN_EXECUTORS`, in the same change as `dispatch-model.cjs`. |
| `system-deep-loop/runtime/tests/unit/{executor-config,executor-audit,fanout-run}.vitest.ts`, `system-deep-loop/deep-improvement/scripts/model-benchmark/tests/remediation.vitest.ts` | Modify | Add `cli-pi` coverage; regression-guard the existing 5 kinds' assertions. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `EXECUTOR_KINDS` gains `'cli-pi'` as its 6th member; `EXECUTOR_KIND_FLAG_SUPPORT` (`Record<ExecutorKind, ...>`) and `EXECUTOR_WEB_SEARCH_CAPABILITY_MATRIX` (`satisfies Record<ExecutorKind, ...>`) each gain a matching `cli-pi` row so `executor-config.ts` compiles cleanly with no missing-property error. | `tsc --noEmit` (or the repo's strict-typecheck entrypoint) exits 0 on the changed module. |
| REQ-002 | The `cli-pi` row in `EXECUTOR_KIND_FLAG_SUPPORT` lists ONLY fields confirmed safe without a live Pi install: `model`, `timeoutSeconds`, `liveTools`. `sandboxMode`, `reasoningEffort`, `serviceTier`, and `configDir` are added ONLY once phase 001 confirms a concrete Pi flag or Programmatic-Usage parameter for each — never included by default or by analogy to a sibling CLI. | `parseExecutorConfig({kind:'cli-pi', sandboxMode:'read-only', ...})` throws an unsupported-field error until such a flag is confirmed and the row is deliberately widened in a later change. |
| REQ-003 | `executor-audit.ts` gains a `cli-pi` row in `EXECUTOR_BINARY_BY_KIND` (`'pi'`), `EXECUTOR_STATE_ENV_BY_KIND` (`['SPECKIT_PI_STATE_DIR']`), and `EXECUTOR_DEFAULT_HOME_DIR_BY_KIND` (`'.pi'`). `EXECUTOR_SESSION_ENV_BY_KIND['cli-pi']` and `EXECUTOR_ENV_PREFIXES_BY_KIND['cli-pi']` stay absent — the existing `Partial<Record<...>>` typing on both maps already tolerates an absent entry — until a real session-id var or auth-env prefix is confirmed. | Grep of `executor-audit.ts` shows the 3 populated maps carry a `cli-pi` entry; the 2 deferred maps show none, with a code comment explaining why. |
| REQ-004 | `fanout-run.cjs` gains a `cli-pi` row in `SPECKIT_STATE_ENV_BY_KIND` (`'SPECKIT_PI_STATE_DIR'`) and `buildPiLineageCommand` is registered in `LINEAGE_COMMAND_ADAPTERS`; `buildLineageCommand({kind:'cli-pi', ...})` no longer throws `Unknown fan-out executor kind: cli-pi` (the error `fanout-run.cjs` line 1699 throws for any kind absent from the adapter map). | Calling `buildLineageCommand` with `kind: 'cli-pi'` reaches `buildPiLineageCommand`'s own logic instead of the generic "Unknown fan-out executor kind" error. |
| REQ-005 | `buildPiLineageCommand` constructs its command array using EXACTLY the non-interactive invocation syntax phase 001's `implementation-summary.md` confirms as Pi's Programmatic Usage entrypoint (one of: an SDK-style embedding, an `pi rpc`-style subcommand, or a `--json-event-stream`-style flag). This phase's implementation MUST cite phase 001 as the source; it MUST NOT invent a `-p`/`--print`-style flag by analogy to `codex exec`/`claude -p`/`cursor-agent -p` — three CLIs that already disagree with each other on this exact point in this same file (compare lines 1465-1502, 1504-1534, and 1634-1681). | The adapter's command-construction body either (a) matches a literal fixture captured from a real phase 001 dispatch, with the fixture's provenance cited in a code comment, or (b) is left as an explicit `throw` documenting "unconfirmed pending phase 001" rather than a guessed flag array. |
| REQ-006 | `buildPiLineageCommand` (paired with a new `isPiBinaryAvailable(env)` guard) fails closed via a `command -v pi` preflight before constructing any command, mirroring `isCodexBinaryAvailable`/`isCursorBinaryAvailable` exactly (lines 1704-1721); when `pi` is absent from `PATH`, it throws a clean, typed unavailable error (`cli-pi executor unavailable: command -v pi failed`), never raw subprocess ENOENT noise. | With `pi` absent from a scoped `PATH`, `buildLineageCommand({kind:'cli-pi', ...})` throws `/command -v pi failed/` before any subprocess spawn attempt (mirrors the existing `fanout-run.vitest.ts` line 957/1074 cases). |
| REQ-007 | The fail-closed guard MUST NOT treat a successful process exit (code 0) alone as proof of a working dispatch. This runtime has already proven exit-0-on-failure is a real bug class here (`cursor-agent -p` exits 0 on auth failure, `isCursorBinaryAvailable`'s own code comment, line 1712-1714) — the exact non-exit-code-based signal for `cli-pi` (stdout/stderr content pattern, an RPC/event-stream envelope field, etc.) is deferred to phase 001's confirmed contract, but the requirement that the guard never relies on exit code alone is fixed now, independent of what phase 001 finds. | A code comment on `buildPiLineageCommand`/`isPiBinaryAvailable` states this constraint explicitly; no code path in this phase's diff branches on a dispatch subprocess's exit code as its sole success signal. |
| REQ-008 | `dispatch-model.cjs`'s `KNOWN_EXECUTORS` set (currently `{cli-opencode, cli-claude-code, cli-cursor}`, lines 156-160) gains `'cli-pi'`; its `buildSpawnSpec` switch (lines 414-468) gains a `case 'cli-pi'`, honoring a `PI_BIN` env override matching the existing `OPENCODE_BIN`/`CLAUDE_BIN`/`CURSOR_AGENT_BIN` pattern (lines 437/445/463), with the same phase-001-gated command body as REQ-005. | `KNOWN_EXECUTORS.has('cli-pi')` is `true`; `buildSpawnSpec('cli-pi', ...)` reaches the new case instead of falling into the `default: throw new Error('Unknown executor: ...')` branch (line 465-466). |
| REQ-009 | `profile-validator.cjs`'s separate, hand-synced `KNOWN_EXECUTORS` set (currently `{native, cli-opencode, cli-claude-code, cli-cursor}`, lines 34-39) gains `'cli-pi'` in the same change as REQ-008, so the two sets do not drift out of parity **for the new kind**. Each set's own pre-existing, already-divergent membership for other kinds (the dispatcher lacks `native`/`cli-codex`; the validator lacks `cli-codex`) is left untouched — reconciling that is out of scope for this phase, matching the discipline both the 029 and 030 precedent phases already documented. | `KNOWN_EXECUTORS.has('cli-pi')` is `true` in both files after the change; a diff shows no other membership line altered. |
| REQ-010 | Every pre-existing assertion in `executor-config.vitest.ts`, `executor-audit.vitest.ts`, `fanout-run.vitest.ts`, and `remediation.vitest.ts` that exercises `native`, `cli-codex`, `cli-claude-code`, `cli-opencode`, or `cli-cursor` continues to pass unchanged after `cli-pi` is added (regression guard). | A focused Vitest run across the 4 files shows zero diffs to any pre-existing test's expected value. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-011 | A `PiSupportedModel` type, a `PI_SUPPORTED_MODELS` allowlist constant (empty array, or a single explicitly-commented placeholder id — never a fabricated real-looking id), and an `isPiModelAllowed()` guard function are scaffolded in `executor-config.ts`, mirroring `CursorSupportedModel`/`CURSOR_SUPPORTED_MODELS`/`isCursorModelAllowed()` (lines 136-156) in shape only. Full roster population (sourced live from `https://pi.dev/models`) is phase 009's deliverable per the 11-phase plan, not this phase's. | `isPiModelAllowed('any-string')` returns `false` for every input while `PI_SUPPORTED_MODELS` is empty/placeholder-only — a deliberately fail-closed default, not an accidentally-permissive one. |
| REQ-012 | Pi's session-id environment variable (the `cli-pi` analog to `CODEX_SESSION_ID`/`CURSOR_CONVERSATION_ID`) is confirmed at implementation time — e.g. via phase 001's live session inspection or `pi --help` — before `EXECUTOR_SESSION_ENV_BY_KIND['cli-pi']` is populated. A variable name is never invented. | Either the row is present and cites its confirming source, or it is absent with an open question recorded in `implementation-summary.md`. |
| REQ-013 | A new fail-closed test for `cli-pi` is added to `fanout-run.vitest.ts`, mirroring the existing `'fails closed before command construction when codex is absent'` (line 957) and `'... when cursor-agent is absent, ignoring the always-0 -p exit code'` (line 1074) cases, proving `buildLineageCommand({kind:'cli-pi', ...})` throws before any subprocess spawn attempt when `pi` is absent from a scoped `PATH`. | The new test passes and asserts `isPiBinaryAvailable(env)` is `false` before asserting the `buildLineageCommand` throw, matching the existing tests' two-assertion shape. |
| REQ-014 | Whether `resolveSandboxMode`/a `SandboxMode`-to-Pi mapping function is even warranted is decided at implementation time from phase 001's confirmed contract — this phase does not invent a `resolvePiSandboxMode()`-style function ahead of knowing whether Pi exposes any sandbox/permission/approval flag at all (unlike Devin's confirmed boolean `--sandbox` toggle or Cursor's confirmed 3-flag family, neither of which was assumed before its own phase 001 confirmed it). | `executor-config.ts`'s diff contains no `resolvePiSandboxMode`/`PiPermissionMode`-style export unless phase 001 has confirmed a concrete flag family to map onto. |

### P2 - Optional (defer with documented reason)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-015 | `EXECUTOR_ENV_PREFIXES_BY_KIND['cli-pi']` is populated only once a real Pi-native auth/env-var prefix (e.g. an API-key var) is confirmed live — the fetched docs show no `PI_`-prefixed env var anywhere, so none is assumed. | The row is either absent (current state) or cites a confirming source (`pi --help` output, a live session's env) — never a guessed `PI_` prefix. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `EXECUTOR_KINDS` contains `cli-pi` as its 6th member, and strict typecheck on `executor-config.ts`/`executor-audit.ts` exits 0.
- **SC-002**: `buildLineageCommand({kind: 'cli-pi', ...})` reaches `buildPiLineageCommand`'s own logic (no longer the generic "Unknown fan-out executor kind" error); its command-construction body either matches a phase-001-confirmed fixture or explicitly throws "unconfirmed pending phase 001" — never a silently-guessed flag array.
- **SC-003**: With `pi` absent from a scoped `PATH`, `buildLineageCommand`/`buildPiLineageCommand` throws before any subprocess spawn attempt, and the guard's design does not depend on the dispatch exit code (mirroring the `cursor-agent` precedent risk this same runtime has already proven real).
- **SC-004**: `dispatch-model.cjs` and `profile-validator.cjs` `KNOWN_EXECUTORS` both contain `'cli-pi'` after the change.
- **SC-005**: A focused Vitest run across `executor-config.vitest.ts`, `executor-audit.vitest.ts`, `fanout-run.vitest.ts`, and `remediation.vitest.ts` passes 100%, with zero regressions in existing `native`/`cli-codex`/`cli-claude-code`/`cli-opencode`/`cli-cursor` assertions.
- **SC-006**: `isPiModelAllowed()` rejects every model id while `PI_SUPPORTED_MODELS` remains empty/placeholder-only, proven with a dedicated unit test using a synthetic test-only id — the fail-closed mechanism is proven even though the real roster ships in phase 009.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 001 (`001-pi-contract-pin`) has not executed | `buildPiLineageCommand`'s command-construction body cannot be finished honestly without guessing | REQ-005 hard-blocks the command body on phase 001's confirmed syntax; the structural/scaffolding work (union widening, matrix rows, dispatcher/validator parity, regression tests) ships independently. |
| Risk | Guessing the headless flag syntax by analogy to `codex exec`/`claude -p`/`cursor-agent -p` | Would ship an adapter that never dispatches correctly, or worse, silently "succeeds" on a malformed invocation | REQ-005's explicit citation requirement; a HALT-and-report path (not a guess) if phase 001 output is still absent at implementation time, per this repo's Four Laws (`READ FIRST`, `HALT`). |
| Risk | Exit-code-only guard is a proven-recurring bug class in this exact file family (`cursor-agent -p` exits 0 on auth failure, line 1712-1714) | A false "available" or false "success" signal for `cli-pi` | REQ-007 fixes the non-exit-code-only constraint now, independent of what phase 001 finds about Pi's specific signal. |
| Risk | Fabricated model ids in `PI_SUPPORTED_MODELS` | Would silently permit dispatch to a model that was never actually confirmed to exist on Pi's roster | REQ-011 scaffolds the mechanism empty/placeholder-only; phase 009 owns real population, sourced live from `https://pi.dev/models`. |
| Risk | Session-env var or auth-env prefix invented instead of confirmed | Would silently corrupt the recursion guard's env-detection layer, or leak unrelated env vars into a dispatched Pi subprocess | REQ-012/REQ-015 defer both rows until confirmed; the maps' `Partial<Record<...>>` typing already tolerates an absent entry. |
| Risk | `KNOWN_EXECUTORS` parity slips between `dispatch-model.cjs` and `profile-validator.cjs` for `cli-pi` specifically | Silent validator/dispatcher drift for the new kind | REQ-009 plus a single-commit discipline note in `tasks.md`. |
| Risk | Self-invocation guard gap (by design, deferred) | After this phase, `cli-pi` is dispatchable at the runtime-typing layer with no self-invocation guard of its own | Phase 003 owns that design; explicitly out of scope here (see §3), not silently left unaddressed. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: No performance target beyond the existing `timeoutSeconds` ceiling (max 3600s, `executor-config.ts` line 64) — `cli-pi` dispatches are bounded the same way as every other executor kind.

### Security
- **NFR-S01**: No credential value (API key, OAuth token, or any Pi auth artifact) is hardcoded or logged anywhere in the new `cli-pi` code paths.
- **NFR-S02**: `EXECUTOR_ENV_PREFIXES_BY_KIND['cli-pi']` stays absent (REQ-015) rather than allowlisting an unconfirmed `PI_` prefix that could leak unrelated environment variables into a dispatched `pi` subprocess.

### Reliability
- **NFR-R01**: An absent `pi` binary fails before spawn, matching `isCodexBinaryAvailable`/`isCursorBinaryAvailable`'s existing preflight precedent exactly — no retries burn wall-clock time against an executor that can never succeed.
- **NFR-R02**: The `cli-pi` addition is a widening-only change — it must not alter the runtime type shape (`ExecutorKind`) or default behavior observed by any of the 5 existing kinds.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- `pi` absent from `PATH` entirely at dispatch time — handled by the fail-closed `isPiBinaryAvailable` preflight (REQ-006).
- `model` omitted from the lineage config — no confirmed default id exists yet (unlike Cursor's `composer-2.5` default); the adapter must fail closed (reject/throw) rather than silently pick an unconfirmed default, until phase 001/009 supply one.
- `sandboxMode` requesting `danger-full-access` with no confirmed Pi permission/sandbox flag at all — needs an explicit implementation-time decision (map to something, or document as genuinely unsupported for `cli-pi`) rather than an implicit silent pass-through.

### Error Scenarios
- Pi turns out to have **no** true non-interactive dispatch mode at all — a real possibility given Pi is fundamentally described as a "terminal-based" agent, and "Programmatic Usage" (SDK/RPC/JSON event stream) could describe a different embedding model (e.g. library usage from Node/Python) that a shell-out adapter like `buildPiLineageCommand` cannot use the same way `codex exec`/`claude -p`/`cursor-agent -p` are used. If phase 001 finds no viable shell-invocable headless path, `cli-pi` may need to ship as a "listed-but-currently-unactionable" kind, documented explicitly in this phase's `implementation-summary.md` rather than silently left broken.
- `pi rpc`/JSON-event-stream mode (if that turns out to be the real non-interactive surface) may have a materially different failure-detection shape than a flat exit-code-plus-stdout CLI — the guard implementation in REQ-007 must be written against whichever shape phase 001 actually confirms, not against a flat-CLI assumption.

### State Transitions
- Partial confirmation: phase 001 confirms SOME facts (e.g. binary name, config dir) but not others (e.g. exit-code semantics) by the time this phase is implemented — each fact is gated independently (REQ-002 through REQ-015 each cite their own confirming dependency), so partial confirmation does not block the facts that ARE confirmed.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 16/25 | 5 production files + 4 test files touched; one net-new scaffolded function (`buildPiLineageCommand`) plus a new `isPiBinaryAvailable` guard and 3 new types/consts. |
| Risk | 18/25 | Higher than the `cli-devin`/`cli-cursor` precedents (14/25 each) because more is genuinely unconfirmed here — those two phases each had a completed live-verification phase 001 behind them before this executor phase was drafted; `cli-pi`'s phase 001 has not run. |
| Research | 12/20 | Higher than the precedents (8/20 each) — the invocation syntax itself, not just secondary details like a session-env var, remains open. |
| **Total** | **46/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Pi's exact non-interactive/headless invocation syntax (SDK embedding vs `pi rpc`-style subcommand vs a `--json-event-stream`-style flag) is UNKNOWN — the docs nav names the "Programmatic Usage" section (SDK, RPC Mode, JSON Event Stream Mode) as the likely surface but the fetched pages did not confirm exact syntax. Phase 001 must live-probe it; this phase must not guess.
- Exit-code semantics on auth/dispatch failure are UNKNOWN. Given `cursor-agent -p`'s proven exit-0-on-auth-failure precedent in this exact runtime, the guard must not assume either "0 on failure" or "nonzero on failure" without live evidence from phase 001.
- Whether Pi exposes ANY sandbox/permission/approval-flag equivalent is UNKNOWN — the docs nav lists "Security" and "Containerization" sections, a positive signal, but no flag was confirmed in the fetched pages.
- Whether Pi's `.pi/` config dir can be overridden per-invocation via a CLI flag (needed for `configDir` flag-support) is UNKNOWN. The extensions doc's `CONFIG_DIR_NAME` quote ("Use `CONFIG_DIR_NAME` instead of hardcoding `.pi` ... allows rebranded distributions to use alternative directory names") is a rebrand mechanism for distributors, not confirmed proof of a per-invocation CLI override flag — the two are not the same claim and must not be conflated.
- Pi's live model roster (`https://pi.dev/models`) was never fetched during this phase's research pass — no model id may be hard-coded from it; phase 001 (a first pass) or phase 009 (the dedicated model-registry phase) must fetch it live.
- Pi's session-id environment variable (the `cli-pi` analog to `CODEX_SESSION_ID`/`CURSOR_CONVERSATION_ID`) is UNKNOWN — verify via `pi --help` or a live session's environment at implementation time; do not invent a name.
- Self-invocation guard signal design for `cli-pi` is explicitly **not** resolved in this phase — flagged as an open requirement for phase 003, packet-owned per `cli-external-orchestration/SKILL.md` line 148.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS
- `plan.md`, `tasks.md`, `checklist.md` (this phase)
- `../001-pi-contract-pin/` (source of the confirmed CLI flag surface, invocation syntax, and model roster this phase's adapter must be built against — not yet executed)
- `../003-cli-pi-skill-packet/` (consumes this phase's runtime acceptance; owns the self-invocation guard design)
- `../../029-cli-devin-revival/002-deep-loop-executor-support/` and `../../030-cli-cursor-creation/002-deep-loop-executor-support/` (structural precedent: widening discipline, `KNOWN_EXECUTORS` parity note, fail-closed preflight pattern)
- `../spec.md` (parent packet)

