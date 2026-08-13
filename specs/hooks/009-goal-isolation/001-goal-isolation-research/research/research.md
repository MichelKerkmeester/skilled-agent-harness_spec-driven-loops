# Cross-Runtime Goal-State Isolation Research

> Final synthesis after 3 of 3 forced-depth iterations, with post-loop source corrections recorded below.

## Architecture Summary

### State Storage (Two-Tier)

The goal-state system uses a split model:

1. **OpenCode (mk-goal plugin)**: `.opencode/plugins/mk-goal.js` — per-session state files at `.opencode/skills/.goal-state/<hex-session-id>.json`. Full capability: inject, heuristic/LLM verify, auto-continue via `session.idle`. Native token accounting from `message.updated` feed.

2. **Cross-runtime port**: Managed by `.opencode/hooks/goal/lib/goal-core.cjs` — ONE shared `.opencode/skills/.goal-state/active-goal.json`. All non-OpenCode runtimes read/write this singleton. Uses `turn-count-estimate` for usage accounting (no native token feed outside OpenCode).

The two systems coexist by design — neither reads the other's state file. [SOURCE: goal-plugin.md §8, goal-core.cjs:41-44]

### Runtime Adapter Status (updated iteration 2)

| Runtime | Adapter | File | Status |
|---------|---------|------|--------|
| **OpenCode** | mk-goal plugin | `.opencode/plugins/mk-goal.js` | PRESENT — per-session state |
| **Pi** | goal-context.ts | `.opencode/hooks/goal/pi/goal-context.ts` | PRESENT — input/session_start/turn_end hooks |
| **Cursor** | goal-inject.mjs | `.opencode/hooks/goal/cursor/goal-inject.mjs` | PRESENT — sessionStart-only injection |
| **Devin** | goal-inject/session-start/verify.mjs | `.opencode/hooks/goal/devin/` | **DECOMMISSIONED** — files deleted in commit `cac19bbfa5e`, registration reverted in `.devin/hooks.v1.json`. Do NOT restore. [SOURCE: git log, .devin/hooks.v1.json] |
| **Claude Code** | None (uses mk-goal symlink) | `.claude/commands` → `.opencode/commands` | No dedicated adapter; falls under OpenCode's mk-goal if plugin loads in Claude context. [SOURCE: goal-plugin.md:140] |
| **Codex** | None | — | No goal integration of any kind. [SOURCE: goal-plugin.md:140] |

### `resolveStateDir` — The Isolation Choke Point

`resolveStateDir` (goal-core.cjs:119-126) resolves to a single directory regardless of runtime or session:
```
stateDir option → MK_GOAL_STATE_DIR env → repoRoot/.opencode/skills/.goal-state
```
There is **zero** per-runtime or per-session path branching. The function accepts `rawOptions.cwd` only to walk up to the repo root — no session ID, runtime key, PID, or instance UUID is consulted. This is architectural, not accidental: the file header states "Persist a **single** cross-runtime session goal in a shared state file." [SOURCE: goal-core.cjs:1-14, 119-126]

### Session-Identity Analysis (iteration 2, corrected against current source)

The iteration-2 synthesis incorrectly concluded that Pi and Cursor lacked hook-accessible session ids. Current source proves the opposite. This correction is load-bearing for the implementation phases:

| Runtime | Session ID Surface | Scoping Feasibility |
|---------|-------------------|---------------------|
| OpenCode | Required plugin `sessionID`, encoded into the state filename | Already scoped inside `mk-goal`; unchanged regression control |
| Pi | `ctx.sessionManager.getSessionId()` on lifecycle and registered-command contexts | Fully feasible for injection and native `/goal-pi` management |
| Cursor | `session_id` in hook payloads, with `conversation_id` accepted by the maintained shared payload normalizer | Feasible for hook reads; current shell-style `/goal-cursor` management does not receive or pass the id |
| Devin | `session_id` existed in lifecycle payloads | Technically feasible, but the goal adapter was explicitly decommissioned and must not be restored by this packet |
| Claude Code | No dedicated current goal adapter | Unsupported by the runtime-neutral goal core |
| Codex | No goal adapter registered | Unsupported |

[SOURCE: `.pi/extensions/pi-cache-optimizer/types/pi-coding-agent.d.ts:40-60`; `.pi/extensions/deep-pi/extensions/deeppi.ts:164-178`; `.opencode/skills/system-spec-kit/mcp-server/hooks/pi/session-start-context.ts:19`; `.opencode/skills/system-spec-kit/mcp-server/hooks/cursor/shared.ts:127`; `.opencode/hooks/goal/cursor/goal-cursor.test.mjs:27`]

### The `runtime` Field: Stored, Never Used

`setGoal()` and `recordTurn()` both store a `runtime` label in the `active-goal.json` record. No function in `goal-core.cjs` ever reads `runtime` for path selection, state scoping, or adapter routing. It is purely informational — surfaced in `bin/goal.cjs show` output but has zero architectural effect. [SOURCE: goal-core.cjs:490-491, 604-623]

## The Collision: Cross-Session Overwrite

### Root Cause

`goal-core.cjs:setGoal()` (lines 499-534) and `recordTurn()` (lines 604-623) converge on a single file path (`active-goal.json`) via `resolveStateDir`. The `runtime` field on the record is a cosmetic label, not a scoping key. Any runtime can overwrite the active goal for all runtimes, and any runtime's `recordTurn` call increments `turnsUsed` on whichever goal currently occupies the file.

### Full Collision Arc (iteration 2 — complete trace)

1. Pi session sets goal via `/goal-pi set "Fix the widget"` → `bin/goal.cjs` calls `setGoal({ objective: "Fix the widget", runtime: "pi" })` → writes `active-goal.json`
2. Cursor session in same repo (or operator using `/goal-cursor`) sets `setGoal({ objective: "Ship the feature", runtime: "cursor" })` → detects different objective → `mutation: "replaced"` → archives Pi's goal → **overwrites** `active-goal.json`
3. Pi's next `input` handler (goal-context.ts:59) calls `readGoalRecord({ cwd: ctx.cwd })` → `resolveStateDir` resolves to same `active-goal.json` → returns Cursor's goal with objective "Ship the feature"
4. Pi's `turn_end` handler (goal-context.ts:91) calls `verifyGoalHeuristic({ goal, transcriptText })` against Cursor's objective — **wrong objective for a Pi session**
5. Pi's `turn_end` handler (goal-context.ts:92) calls `recordTurn({ runtime: "pi" }, { cwd: ctx.cwd })` → reads current `active-goal.json` (Cursor's) → increments `turnsUsed` on Cursor's goal → writes back with `runtime: "pi"` — **wrong goal's counter incremented, wrong runtime label stored**

All adapters and the CLI converge on the same `active-goal.json` — any write from any runtime immediately affects every other runtime's next read and every other runtime's turn accounting. [SOURCE: goal-core.cjs:119-126, 428-437, 499-534, 604-623; goal-context.ts:55-66, 83-105; goal-inject.mjs:70-78]

### Impact Matrix

| Action | Runtime | Affects |
|--------|---------|---------|
| `setGoal` (new/different objective) | Pi, Cursor, CLI | Overwrites goal for ALL runtimes |
| `recordTurn` (every turn) | Pi, Cursor | Increments `turnsUsed` on **current** goal — may be wrong runtime's |
| `verifyGoalHeuristic` (turn_end) | Pi | Verifies against current goal — may be wrong runtime's objective |
| `completeGoal` / `clearGoal` | Pi, Cursor, CLI | Clears goal for ALL runtimes |
| `pauseGoal` / `resumeGoal` | Pi, Cursor, CLI | Affects goal for ALL runtimes |

### Existing Isolation Pattern

The OpenCode mk-goal plugin already demonstrates session-scoped state isolation — it keys state files by hex session ID (`<hex-session-id>.json`). This pattern could be extended to the cross-runtime core. [SOURCE: goal-plugin.md:30-31,120]

## Answered Questions (all 5 resolved)

1. **Which files own the current active-goal state for each registered runtime?** → OpenCode: per-session `<hex-session-id>.json` via mk-goal plugin. Pi and Cursor: shared `active-goal.json` via `goal-core.cjs`. Devin: adapter decommissioned (no files). Claude Code: reaches mk-goal plugin via symlink (no dedicated adapter). Codex: no adapter.

2. **What native session-identity surfaces does each runtime expose?** → OpenCode already requires a plugin session id. Pi exposes `ctx.sessionManager.getSessionId()` to lifecycle and registered-command handlers. Cursor hook payloads carry `session_id` and may carry `conversation_id`, but the current prompt command does not receive either. Devin exposed `session_id` before its goal adapter was decommissioned. Claude Code and Codex have no dedicated runtime-neutral goal adapter.

3. **How does the current Pi goal plugin store, inject, verify, pause, complete, and clear goal state?** → ANSWERED in iteration 1.

4. **Does the current Devin adapter still work against the latest runtime?** → The Devin adapter was **decommissioned** in commit `cac19bbfa5e` (`feat(goal)!: decommission Devin commands + goal hook`). Adapter files removed, registration reverted from `.devin/hooks.v1.json`. Should NOT be restored — it was explicitly decommissioned.

5. **What cross-session collision scenario reproduces the leak in Pi, and what is the minimal structural fix?** → ANSWERED in iteration 1 (collision trace) and iteration 2 (full arc through `resolveStateDir`). Minimal structural fix: thread a session-scoping key through `resolveStateDir` so it returns a per-runtime or per-session subdirectory/file rather than a single shared path. `resolveStateDir` is the single choke point — change it and every function downstream inherits the isolation.

## Architecture Proposal — Session-Scoped Storage (Iteration 3)

### The Choke Point: `resolveStateDir`

Every lifecycle function in `goal-core.cjs` — `readGoalRecord`, `setGoal`, `recordTurn`, `clearGoal`, `completeGoal`, `pauseGoal`, `resumeGoal` — calls `resolveStateDir(rawOptions)` exactly once. `resolveStateDir` is the **single choke point** — change it, and every downstream read/write path inherits isolation.

**Current:** `resolveStateDir` returns a single shared directory — always resolves to `.opencode/skills/.goal-state/`.

**Proposed:** Thread a required `scopeKey` ({`runtime`, `sessionId`}) through the state-path resolver. A valid scope returns `<repoRoot>/.opencode/skills/.goal-state/<runtime>-<sha256(sessionId)>.json`. An absent or invalid scope returns no active record for reads and a stable `MISSING_SESSION_ID` error for mutations. The legacy `active-goal.json` is diagnostic/quarantine input only and is never an active fallback.

### Scope Key Design

| Component | Source | Description |
|-----------|--------|-------------|
| `runtime` | Already stored in records (goal-core.cjs:490,523,616) but never used for path resolution | `"pi"`, `"cursor"`, `"opencode"`, or `"unknown"` |
| `sessionId` | Native runtime identity: Pi `ctx.sessionManager.getSessionId()`, Cursor hook `session_id`, or an explicit synthetic id in core/CLI tests | Stable opaque ownership input; never guessed and never defaulted |

**Why native and required:** Pi and Cursor hooks already expose stable identities. A `"default"` fallback would recreate the same collision for every session whose management path failed to bind an id, hiding a partial rollout instead of isolating it.

### Opaque Filename Rule

Filenames use the full `SHA256(sessionId)` digest — raw session ids never appear in path names. OpenCode's existing plugin hex-encodes its required id rather than hashing it, so it is a behavioral isolation precedent, not the privacy/path-encoding authority for the new store.

```
.opencode/skills/.goal-state/
├── pi-<sha256(native-pi-session-id)>.json
├── cursor-<sha256(cursor-session-id)>.json
├── <hex>.json                         # mk-goal per-session files (unchanged)
└── .legacy-active-goal.json           # Quarantined legacy singleton (read-only)
```

### Scoped Directory Layout

```
.opencode/skills/.goal-state/
├── .archive/
│   ├── sessions/
│   │   ├── pi/
│   │   │   └── <scope-file>.json      # Per-session goal archives
│   │   └── cursor/
│   │       └── <scope-file>.json
│   └── .legacy/
│       └── active-goal-<goalId>.json  # Migrated legacy goals
├── .migration-complete                 # Marker file — prevents re-migration
├── pi-<hash>.json                      # Active scoped goal files
├── cursor-<hash>.json
├── <hex>.json                          # mk-goal files (unchanged)
└── .legacy-active-goal.json            # Quarantined legacy singleton
```

[SOURCE: goal-core.cjs:119-130, 428-437, 499-534, 543-596, 604-623 — all lifecycle functions use the same resolveStateDir choke point]
[SOURCE: goal-core.cjs:41-45 — STATE_SUBDIR and STATE_FILENAME constants]
[SOURCE: current Pi and Cursor identity sources cited in the corrected Session-Identity Analysis]

---

## Migration Strategy (Iteration 3)

### Phase 1: Legacy Detection and Quarantine

On first access after upgrade, `resolveStateDir` checks for `active-goal.json` at the legacy path. If present and no `.migration-complete` marker:
1. Read legacy file; if `goalId` exists, archive to `.archive/.legacy/active-goal-<goalId>.json`.
2. Rename `active-goal.json` → `.legacy-active-goal.json` (read-only marker).
3. Write `.migration-complete`.
4. Log event to `.continuation.log`.

### Phase 2: Per-Session File Creation

Every `setGoal` call creates a scoped file from the runtime-provided identity:
- Native Pi `/goal-pi set "Fix the widget"` → `pi-<sha256(ctx.sessionManager.getSessionId())>.json`
- Cursor hook read → `cursor-<sha256(payload.session_id)>.json`; Cursor management remains unsupported until it can supply the same id

### Phase 3: Adapter Threading

Session ID resolution is adapter-owned and has no ambient or default fallback:
1. Pi lifecycle and registered-command handlers read `ctx.sessionManager.getSessionId()`.
2. Cursor injection reads `payload.session_id`, with a verified `conversation_id` compatibility field only where the current payload normalizer supports it.
3. The low-level CLI accepts an explicit session id only for tests, diagnostics, or an already identity-aware native bridge; user-facing commands must not ask the model or operator to guess it.
4. Missing or blank identity produces no injection and no mutation.

### Phase 4: Resume and Fork Semantics

| Operation | Pre-migration (v1) | Post-migration (v2) |
|-----------|-------------------|---------------------|
| Resume (same runtime, same session) | Reads `active-goal.json` | Reads `<runtime>-<sha256(sessionId)>.json` — same file, correct isolation |
| New session, same runtime | May see another runtime's goal | New native id starts unbound |
| Fork (branch a goal) | Not possible — singleton overwrites | New native id starts unbound unless a separate explicit clone action is implemented |
| Cross-runtime read | Collision — shared `active-goal.json` | Each adapter reads own runtime's scoped file |

### Backward Compatibility

There is no compatibility fallback to an implicit default session. Native Pi management remains convenient because the extension supplies the id automatically. Any runtime whose user-facing management surface cannot supply the current native id is reported as unsupported rather than silently routed to a global/default record.

[SOURCE: goal-core.cjs:440-450 — archiveGoalRecord reused for legacy quarantine]
[SOURCE: goal-core.cjs:526-527 — setGoal already archives on replace, same mechanism reused for migration]

---

## Objective Verification Plan (Iteration 3)

### Stage 1: Two-Session Cross-Runtime Action Matrix (Positive Controls)

| Session A | Session B | A: set goal | B: set goal | A: read goal | Expected |
|-----------|-----------|-------------|-------------|--------------|----------|
| Pi, α | Pi, β | "Fix widget" | "Ship feature" | read(pi, α) | "Fix widget" ✓ |
| Pi, α | Cursor, β | "Fix widget" | "Ship feature" | read(pi, α) | "Fix widget" ✓ |
| Cursor, α | Pi, β | "Fix widget" | "Ship feature" | read(cursor, α) | "Fix widget" ✓ |
| Cursor, α | Cursor, β | "Fix widget" | "Ship feature" | read(cursor, α) | "Fix widget" ✓ |
| Pi, same native id | Pi, same native id | "Fix widget" | "Ship feature" | read(pi, same id) | "Ship feature" (legitimate same-scope overwrite) |
| Missing id | Pi, β | rejected/no write | "Ship feature" | read(pi, missing) | No goal; B remains unchanged |

### Stage 2: Lifecycle Negative Controls

| Test | Expected |
|------|----------|
| Cursor `recordTurn` does not touch Pi α `turnsUsed` | Pi α's `turnsUsed` unchanged |
| Cursor `completeGoal` does not affect Pi α | Pi α goal still active |
| Cursor `clearGoal` does not affect Pi α | Pi α goal still present |
| Cursor `pauseGoal`/`resumeGoal` does not affect Pi α | Pi α goal still active |
| Pi `verifyGoalHeuristic` reads Pi α goal (not Cursor β) | Returns "Fix widget", NOT "Ship feature" |

### Stage 3: Regression Controls

| Test | Expected |
|------|----------|
| Single-session Pi native command | All lifecycle operations use the command context's Pi session id |
| Cursor hook with `session_id` | Reads only that Cursor scope; missing id injects nothing |
| `bin/goal.cjs show` with no bound id | Returns `MISSING_SESSION_ID` and writes nothing |
| `bin/goal.cjs list` | Lists archived goals correctly |
| mk-goal per-session files untouched | mk-goal writes to `<hex>.json` files unchanged |
| Migration from v1 idempotent | Second migration run produces no errors, no data loss |
| `MK_GOAL_STATE_DIR` env override | All tests use temp dirs, no real `.goal-state/` touched |

### Stage 4: Final Gate (All 7 Must Pass)

1. All 6 positive-control cells pass (Stage 1)
2. All 5 negative-control tests pass (Stage 2)
3. All 7 regression-control tests pass (Stage 3)
4. No test touches real `.opencode/skills/.goal-state/` (env-isolated)
5. `goal-core.test.cjs`, `goal-pi.test.mjs`, `goal-cursor.test.mjs` all pass unchanged
6. Two new test files exist: `goal-core-isolation.test.cjs` + `goal-isolation-matrix.test.cjs`
7. Legacy migration is idempotent (running twice produces no errors or data loss)

### Implementation Scope (Bounded)

| File | Change | Risk |
|------|--------|------|
| `goal-core.cjs:resolveStateDir` (119-126) | MODIFY — add scopeKey resolution | **Highest** (choke point) |
| `goal-core.cjs:setGoal` (499-534) | MODIFY — accept sessionId | **Medium** |
| `goal-core.cjs:archiveGoalRecord` (440-450) | MODIFY — per-session sub-archive | **Medium** |
| `goal-core.cjs:listArchivedGoals` (625-646) | MODIFY — per-session archive listing | **Medium** |
| `bin/goal.cjs` | MODIFY — add `--session` flag | Low |
| `goal-context.ts` (Pi adapter) | MODIFY — thread `ctx.sessionManager.getSessionId()` and register native management command | Medium |
| `goal-inject.mjs` (Cursor adapter) | MODIFY — thread sessionId | Low |

**Total:** ~200-300 lines of changed code. All other lifecycle functions (`readGoalRecord`, `recordTurn`, `clearGoal`, `completeGoal`, `pauseGoal`, `resumeGoal`) inherit isolation through `resolveStateDir` pass-through — **no signature changes needed**.

[SOURCE: goal-core.cjs:664-694 — complete exported function inventory]
[SOURCE: goal-core.cjs:119-130, 428-437, 440-450, 499-534, 543-596, 604-623, 625-646 — verified every function's rawOptions pass-through]

---

## Requirements Alignment (Iteration 3)

| REQ | Status | Evidence |
|-----|--------|----------|
| REQ-001 (3 iterations) | ✅ | Iterations 001, 002, 003 complete; config records maxIterations=3 |
| REQ-002 (verified evidence) | ✅ | Every finding cites current source file lines, git history, or test evidence |
| REQ-003 (session identity) | ✅ | Pi native lifecycle/command context and Cursor hook payload are confirmed; management stays unsupported where the same id cannot be supplied |
| REQ-004 (migration contract) | ✅ | 4-phase migration with scope key, opaque filenames, quarantine, resume/fork semantics |
| REQ-005 (Devin truth) | ✅ | Iteration 2: Devin decommissioned in commit `cac19bbfa5e`; do NOT restore |
| REQ-006 (proof plan) | ✅ | 4-stage, 13-assertion verification matrix with 7-point final gate |

## Dead Ends

- `src/shared/goals/`, `src/cli/plugins/goal-*.ts`, `src/runtimes/*/goal-adapter.*` — hypothesized paths from strategy's bounded context snapshot. These do not exist on disk.
- Searching for per-runtime path resolution in `resolveStateDir` — confirmed absent by design.
- Searching for session UUIDs in Cursor/Pi hook payloads — none exposed at the adapter level.

---

## Convergence Report
- Stop reason: maxIterationsReached (--stop-policy=max-iterations)
- Total iterations: 3
- Questions answered: 5 / 5
- Remaining questions: 0
- Last 3 iteration summaries:
  - run 1: Pass 1 — Current-state evidence, inventory, Pi overwrite reproduction (newInfoRatio: 1.00)
  - run 2: Session identity, isolation gap, recordTurn collision arc, Devin adapter decommission (newInfoRatio: 0.85)
  - run 3: Architecture synthesis, migration strategy, verification plan (newInfoRatio: 0.90)
- Convergence threshold: 0.05
- Divergence summary: no divergent pivots recorded (not expected in 3-iteration forced-depth run)
- minIterations: 3 (set equal to maxIterations per --stop-policy=max-iterations to force full depth)
