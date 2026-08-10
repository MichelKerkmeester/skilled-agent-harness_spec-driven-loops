---
title: "Feature Specification: Cross-Runtime Goal Isolation"
description: "Isolate passive goal state by runtime session so concurrent Pi, Cursor, and future goal-capable sessions never read, replace, verify, or clear another session's objective."
status: "complete"
trigger_phrases:
  - "goal isolation"
  - "multiple active goals"
  - "pi goal confusion"
  - "cross-runtime goal state"
  - "session-scoped goal"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/042-goal-isolation"
    last_updated_at: "2026-08-10T19:20:00Z"
    last_updated_by: "codex"
    recent_action: "All six phases completed, including OpenCode hardening and playbook alignment"
    next_safe_action: "Monitor session-isolated goals and compatibility migration during normal runtime use"
    blockers: []
    key_files:
      - ".opencode/hooks/goal/lib/goal-core.cjs"
      - ".opencode/hooks/goal/bin/goal.cjs"
      - ".opencode/hooks/goal/pi/goal-context.ts"
      - ".opencode/hooks/goal/cursor/goal-inject.mjs"
      - ".opencode/plugins/mk-goal.js"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-isolation-spec-20260810"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The original interference source was the runtime-neutral active-goal.json singleton; OpenCode was already session-scoped but needed bounded opaque filenames."
      - "Pi lifecycle and registered-command contexts expose getSessionId; Cursor hooks expose session_id."
      - "Cursor's current prompt command is not session-bound, and Devin goal support was deliberately decommissioned."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Cross-Runtime Goal Isolation

<!-- SPECKIT_LEVEL: 3 -->

---

## EXECUTIVE SUMMARY

OpenCode's native `mk-goal` plugin already stores one goal per OpenCode session. The sibling runtime-neutral goal core used by Pi and Cursor does not: it stores one repository-wide `.opencode/skills/.goal-state/active-goal.json`, so the last session to set a goal replaces the prior session's record and every Pi input hook injects that replacement.

This packet defines one active goal per runtime session, allowing many sessions to hold different active goals concurrently. The implementation must require an explicit native session identity for every cross-runtime read and mutation, and it must never fall back to the legacy singleton during prompt injection.

**Key Decisions**: key state by workspace, runtime, and native session id; quarantine legacy singleton state instead of guessing which live session owns it.

**Critical Dependency**: the management command path must acquire the same native session identity as the injection hook. Pi can do this through a registered extension command whose context exposes `ctx.sessionManager.getSessionId()`. Cursor hooks expose `session_id`, but the current shell-driven `/goal-cursor` command cannot prove the same binding and must remain unsupported until it can.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-08-10 |
| **Delivery shape** | Six-phase packet: research, three implementation phases, final verification, and OpenCode persistence hardening |
| **Implementation state** | All six phases complete; scoped core, native bindings, legacy cutover, OpenCode optimization, documentation, playbooks, and final verification are verified |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The cross-runtime core resolves every Pi and Cursor goal operation to one fixed file, `active-goal.json`. `setGoal()` archives the existing record and replaces it when the objective differs; `readGoalRecord()` has no session parameter; and the Pi adapter calls that unscoped read on `input`, `session_start`, and `turn_end` even though Pi provides a native session id.

An isolated negative control confirmed the user-visible failure. Setting `GOAL_A` returned `mutation=created`; setting `GOAL_B` returned `mutation=replaced`; `show` returned only `GOAL_B`; and history contained `GOAL_A` archived with `status=active`. A prior live Pi verification in packet 032 independently recorded a concurrent session silently replacing its active goal.

The result is not true support for two active goals. It is last-writer-wins global steering: unrelated sessions can receive another session's objective, increment its counters, verify it, pause it, complete it, or clear it.

### Purpose

Make goal ownership explicit and session-scoped so each AI session sees and mutates only its own active goal while preserving fail-open runtime behavior when identity or state is unavailable.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Define a canonical cross-runtime goal scope from normalized workspace root, runtime name, and native session id.
- Replace the singleton cross-runtime state path with collision-resistant per-session files and per-session archives.
- Require that Pi and Cursor injection adapters pass native session identity on every read, turn record, verification, and mutation path.
- Provide a management surface that binds `set`, `show`, `clear`, `complete`, `pause`, `resume`, `history`, `doctor`, and `health` to the current session.
- Remove stale Devin goal-support claims; current history shows the adapters were deliberately decommissioned.
- Quarantine or explicitly migrate legacy `active-goal.json` without injecting it into an arbitrary session.
- Add two-session and cross-runtime collision tests before changing production behavior.
- Keep OpenCode's existing per-session `mk-goal` behavior green.

### Out of Scope

- Multiple simultaneously active goals inside one session. This packet supports one active goal per session and many active sessions.
- A shared team goal, goal broadcasting, or automatic parent-child goal inheritance.
- Automatic assignment of the legacy singleton to the first session that starts. Ownership cannot be inferred safely.
- Changing the goal-prompt content, verifier heuristics, or autonomy policy except where scope identity must be threaded through them.
- Implementing runtime changes during this spec-authoring turn.

### Prospective Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/hooks/goal/lib/goal-core.cjs` | Modify | Require goal scope and resolve per-session state/archive paths. |
| `.opencode/hooks/goal/bin/goal.cjs` | Modify | Accept validated session scope and refuse ambiguous mutations. |
| `.opencode/hooks/goal/pi/goal-context.ts` | Modify | Pass `ctx.sessionManager.getSessionId()` to every goal-core call. |
| `.opencode/hooks/goal/pi/goal-context.ts` and `.pi/prompts/goal-pi.md` | Modify | Register native management against the same Pi session id used by lifecycle hooks. |
| `.opencode/hooks/goal/cursor/goal-inject.mjs` | Modify | Consume `session_id` or `conversation_id` from the hook payload. |
| `.cursor/commands/goal-cursor.md` or a Cursor-native management surface | Modify | Bind management actions to the current Cursor session. |
| `.opencode/hooks/goal/**/**.test.*` | Modify/Create | Prove isolation, missing-identity behavior, legacy cutover, and adapter parity. |
| `.opencode/hooks/goal/{README.md,goal-plugin.md}` | Modify | Replace the singleton contract with the session-scoped contract and current runtime matrix. |
| Goal docs and runtime matrices mentioning Devin | Modify | Remove stale goal-support claims; do not restore decommissioned adapters. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every cross-runtime goal operation resolves an explicit scope containing workspace, runtime, and native session id. | Missing or blank session identity produces no injection; mutating CLI/tool actions return `MISSING_SESSION_ID` and write nothing. |
| REQ-002 | Different sessions can each hold one active goal concurrently. | A two-session test sets different objectives and reads both back unchanged from separate state paths. |
| REQ-003 | Mutations are isolated to their owning session. | Pause, record-turn, complete, clear, and replace operations for session A leave session B byte-equivalent. |
| REQ-004 | Pi injects and verifies only the current Pi session's goal. | Two fake Pi contexts with different `getSessionId()` values receive only their own canary; turn-end in A does not alter B. |
| REQ-005 | Goal management is bound to the current runtime session. | `/goal-pi` and every supported sibling command can set/show the current session without a manually typed id and cannot fall back to a repository-global record. |
| REQ-006 | The legacy singleton cannot leak into a live session. | With only legacy `active-goal.json` present, all session-scoped injection tests return no goal until an explicit migration or new set action binds ownership. |
| REQ-007 | State filenames cannot collide across runtimes or expose raw session ids. | Equal session-id strings under Pi and Cursor resolve to different hashed paths; path traversal and control-character cases are rejected or normalized safely. |
| REQ-008 | OpenCode's native session isolation remains unchanged. | The full committed `mk-goal` plugin test suite passes after cross-runtime changes. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-009 | Cursor consumes its native identity fields. | Adapter tests cover `session_id`, `conversation_id` fallback, and missing identity; no test relies on shared `active-goal.json`. |
| REQ-010 | Devin documentation and tracked files agree. | Current docs/matrices state that Devin goal adapters were decommissioned; no registration or missing adapter path is claimed. |
| REQ-011 | Diagnostics describe scoped state accurately. | `show`, `history`, `doctor`, and `health` distinguish current-session data from aggregate counts without printing raw session ids by default. |
| REQ-012 | Fork/resume behavior is explicit. | Resume with the same native id restores the same goal; a new or forked id starts unbound unless an explicit clone action is specified. |
| REQ-013 | Runtime docs and command text stop claiming the global CLI already owns session resolution. | Repository search finds no stale statement that `bin/goal.cjs` resolves a session without receiving identity. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: An automated two-session matrix proves simultaneous active goals remain distinct through set, show, inject, record, pause, complete, and clear.
- **SC-002**: Pi adapter tests prove `ctx.sessionManager.getSessionId()` controls every goal read and write.
- **SC-003**: A same-session-id/different-runtime test proves runtime namespaces cannot collide.
- **SC-004**: A legacy-only state test proves `active-goal.json` is never passively injected.
- **SC-005**: The runtime truth matrix matches tracked files and registrations for OpenCode, Pi, Cursor, Devin, Claude, and Codex.
- **SC-006**: Focused goal tests, OpenCode plugin tests, runtime config validation, documentation checks, and the authoritative workspace gate pass from the final implementation state.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Pi management-context identity | Injection can isolate while `/goal-pi set` still writes ambiguously. | Probe Pi's native command/tool registration API first; ship no fallback that guesses an id. |
| Dependency | Cursor command-context identity | The hook has `session_id`, but a prompt command may not. | Prefer a hook/native tool handoff or explicit validated binding owned by the adapter. |
| Risk | Legacy goal loss | Users may expect the current singleton to resume. | Preserve it as quarantined legacy data and provide an explicit inspect/migrate path. |
| Risk | Partial rollout | A scoped writer plus unscoped reader can recreate leakage or hide goals. | Cut over core, manager, adapters, tests, and docs as one verified bundle. |
| Risk | Cross-process same-session races | Direct-run hooks and CLI actions may race on one session file. | Keep atomic writes and add revision/lock coverage if the negative concurrency test reproduces lost updates. |
| Risk | Stale Devin claims | Specs say adapters shipped, but current tracked files and registration do not contain them. | Treat the decommission commit and current source/config as authoritative; remove stale claims. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance

- **NFR-P01**: A scoped goal read performs at most one small-file stat/read on a cache miss and introduces no repository-wide scan on prompt injection.

### Security

- **NFR-S01**: Raw session ids never become path segments; a bounded cryptographic hash or equivalent collision-resistant encoding derives filenames.
- **NFR-S02**: Goal files remain mode `0600`, directories remain mode `0700`, and objective hardening remains unchanged.

### Reliability

- **NFR-R01**: Injection adapters fail open to the user turn but fail closed to goal selection: missing, malformed, or mismatched identity means no goal block.
- **NFR-R02**: Management mutations fail closed with a stable error code when identity is unavailable.
- **NFR-R03**: No silent legacy fallback exists after cutover.

## 8. EDGE CASES

### Identity Boundaries

- Empty or whitespace session id: no injection; mutation fails without writing.
- Same native id in two runtimes: distinct files and archives.
- Same runtime/id under different repositories or explicit state roots: distinct workspace scopes.
- Resume with the same id: restore the same record.
- Fork or new id: no inherited goal by default.

### State Boundaries

- Malformed scoped JSON: fail open to no injection and surface a diagnostic through supported health output.
- Legacy singleton only: report it as quarantined; never inject it automatically.
- Session A completes while session B is active: only A archives or changes status.
- Concurrent record-turn and clear for one session: no cross-session effect; same-session result follows the chosen serialization contract.

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 18/25 | Shared core, manager, Pi and Cursor adapters, Devin claim removal, tests, commands, docs. |
| Risk | 18/25 | Prompt steering and persisted state can affect unrelated AI sessions. |
| Research | 16/20 | Three forced-depth passes completed; Cursor management remains an explicit unsupported boundary. |
| Multi-Agent | 10/15 | Phase 1 uses the user-requested three-iteration `system-deep-loop` research workflow. |
| Coordination | 10/15 | One atomic cross-runtime cutover with legacy compatibility. |
| **Total** | **72/100** | **Level 3 phased packet; independent research, core, runtime, cutover, and validation workstreams justify child phases.** |

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Another session's goal reaches the model | High | High today | Require session scope and add canary isolation tests. |
| R-002 | Command and hook derive different scope keys | High | Medium | One shared scope resolver plus end-to-end set/inject tests. |
| R-003 | Legacy singleton is assigned to the wrong session | High | Medium | No automatic binding; explicit migration only. |
| R-004 | Partial runtime support is documented as parity | Medium | High today | Generate the runtime matrix from tracked source and registrations during verification. |

## 11. USER STORIES

### US-001: Concurrent Pi Goals (Priority: P0)

**As a** user running two Pi sessions, **I want** each session to retain its own active goal, **so that** neither AI follows the other's objective.

**Acceptance Criteria**:
1. Given Pi sessions A and B in one repository, when each sets a different goal, then every input and turn-end event resolves only that session's record.

### US-002: Safe Cross-Runtime Coexistence (Priority: P0)

**As a** user running different CLI runtimes, **I want** identical native session-id strings to remain namespaced, **so that** Pi, Cursor, and OpenCode cannot collide.

**Acceptance Criteria**:
1. Given the same session-id string under two runtime labels, when both set goals, then both records remain independently readable and mutable.

### US-003: Honest Legacy Cutover (Priority: P1)

**As an** operator with an existing `active-goal.json`, **I want** the system to preserve but not guess its ownership, **so that** migration cannot silently steer the wrong session.

**Acceptance Criteria**:
1. Given a legacy singleton and no scoped record, when a session starts, then no active-goal block is injected and diagnostics identify the legacy record as requiring explicit action.

## 12. RESOLVED RESEARCH DECISIONS

- Pi management moves to `ExtensionAPI.registerCommand`; its handler receives a command context with `sessionManager.getSessionId()`.
- Cursor hook reads bind to `session_id`; the current shell-style management prompt is unsupported until a native bridge can supply that same id.
- Devin goal hooks remain decommissioned. Phase 4 removes stale support claims rather than restoring deleted adapters.
- Missing identity never falls back to a shared `"default"` scope or the legacy singleton.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Record**: See `decision-record.md`
- **Predecessor Architecture**: `../032-goal-hooks-cross-runtime/`
- **Prior Live Validation**: `../034-goal-hook-playbooks-and-validation/`

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | `001-goal-isolation-research/` | Three forced-depth deep-research iterations covering current state ownership, native session identity across runtimes, and the recommended isolation/migration/test architecture | Complete |
| 2 | `002-session-scoped-core/` | Implement the required composite scope, opaque per-session storage, isolated lifecycle mutations, and identity-aware CLI contract | Complete |
| 3 | `003-pi-and-runtime-bindings/` | Bind Pi and supported sibling adapters and management surfaces to native session identity; reconcile Devin support truth | Complete |
| 4 | `004-legacy-cutover-and-docs/` | Quarantine the singleton, complete explicit migration/diagnostics, update registrations, commands, docs, and runtime matrices | Complete |
| 5 | `005-verification-and-validation/` | Run the two-session/cross-runtime matrix, live canaries, regression suites, configuration checks, recursive packet validation, and acceptance sign-off | Complete |
| 6 | `006-opencode-goal-optimization-and-devin-removal/` | Replace OpenCode's reversible session filenames with fixed opaque keys, migrate existing state safely, remove active Devin goal-version remnants, and align manual playbooks | Complete |
### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-goal-isolation-research | 002-session-scoped-core | Three iterations and final synthesis resolve the scope key, management identity strategy, runtime support matrix, legacy policy, and test invariants | `research/iterations/iteration-001.md` through `iteration-003.md`, valid JSONL deltas, and `research/research.md` exist |
| 002-session-scoped-core | 003-pi-and-runtime-bindings | Core operations require explicit scope and the two-session lifecycle matrix passes without singleton fallback | Focused core tests pass and session B remains byte-equivalent during session A mutations |
| 003-pi-and-runtime-bindings | 004-legacy-cutover-and-docs | Pi and every retained runtime use native identity for injection and management; unsupported claims are removed | Adapter tests and runtime registration probes match tracked files; Pi canaries remain isolated |
| 004-legacy-cutover-and-docs | 005-verification-and-validation | Legacy state cannot inject automatically and all commands, diagnostics, docs, and matrices describe the scoped contract | Legacy-only negative control passes; stale singleton and unsupported-runtime claim scans are clean |
| 005-verification-and-validation | 006-opencode-goal-optimization-and-devin-removal | Prior isolation and OpenCode regression controls pass, and the OpenCode storage-key limitation is reproduced without reopening Pi/Cursor behavior | 119/119 focused OpenCode tests pass; 140-character session-id negative control fails at the legacy 285-character filename |
<!-- /ANCHOR:phase-map -->
