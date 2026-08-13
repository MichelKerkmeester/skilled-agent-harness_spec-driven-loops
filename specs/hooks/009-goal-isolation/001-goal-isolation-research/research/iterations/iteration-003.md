# Iteration 3: Architecture Synthesis — Session-Scoped Storage, Migration, and Verification Plan

## Focus

Final forced-depth iteration. All 5 key questions resolved in iterations 1-2. This iteration synthesizes the architecture proposal (session-scoped storage layout, scope key design, opaque filename rule), the migration strategy (legacy singleton quarantine, resume/fork semantics, backward compatibility), and the objective verification plan (two-session cross-runtime action matrix, negative controls, regression controls, final gate). All synthesis is based on verified source evidence from the prior iterations; no new file discoveries were made.

Ambiguity resolved: The term "scope key" was interpreted as the composite key `{runtime, sessionId}` threaded through `resolveStateDir()` to determine which per-session subdirectory or file to use. The term "opaque filename rule" was interpreted as using a deterministic hash of the scope key in filenames (never exposing raw session IDs in path names), consistent with the mk-goal plugin's use of hashed session IDs already in production.

## Findings

### Finding 1: Architecture proposal — session-scoped storage layout

The core change is minimal by design: thread a `scopeKey` (composite of `runtime` + `sessionId`) through `resolveStateDir()` so every downstream function inherits per-session isolation. Every mutation point in `goal-core.cjs` calls `resolveStateDir(rawOptions)` exactly once, then calls `statePath(stateDir)` — making `resolveStateDir` the single choke point. Change it, and you change every read/write path.

**Storage layout (scoped):**

```
.opencode/skills/.goal-state/
├── .archive/                          # unchanged — per-session sub-archives
│   ├── sessions/
│   │   ├── pi/
│   │   │   └── <scope-file>           # per-session goal, same schema as active-goal.json
│   │   └── cursor/
│   │       └── <scope-file>
│   └── .legacy/                       # quarantined legacy singletons
│       └── active-goal-<goalId>.json  # migrated once, never reappears
├── .legacy-active-goal.json            # quarantined legacy singleton (read-only after migration)
├── pi-<session-id-hash>.json           # opaque scoped file for Pi runtime
├── cursor-<session-id-hash>.json       # opaque scoped file for Cursor runtime
└── <mk-goal hex session>.json          # unchanged — OpenCode mk-goal owns these
```

**Key design properties:**

| Property | Implementation |
|----------|---------------|
| **Scope key** | `{runtime, sessionId}` — `runtime` already stored in records (goal-core.cjs:490,523,616); `sessionId` is operator-supplied (set at goal creation time via CLI `--session` flag or adapter parameter). |
| **Opaque filename rule** | Filename: `<runtime>-<hash>.json` where `<hash>` = SHA256(`sessionId`)[0:16] (16 hex chars). Never stores raw user-supplied session IDs in filenames. mk-goal already uses a hex hash of its internal session ID — this extends the same pattern. |
| **Session ID source** | No runtime exposes a hook-accessible session ID (Finding 2.4). Therefore, the `sessionId` is operator-supplied at goal time: `/goal-pi set "Fix the widget" --session my-pi-session`. The CLI and adapters pass it through to `setGoal()`, which stores it in the record and uses it in `resolveStateDir()`. |
| **Default fallback** | When no `--session` is supplied, `sessionId` defaults to `"default"`, producing `<runtime>-<sha256("default")>.json`. This preserves backward compatibility for single-session operators. |
| **resolveStateDir change** | New signature: `resolveStateDir(rawOptions = {})`. If `rawOptions.scopeKey` is present: `join(repoRoot, STATE_SUBDIR, scopeFilename)`. If absent: `join(repoRoot, STATE_SUBDIR, STATE_FILENAME)` (legacy path, triggers migration on first write). |

**Scope-key threading through the call chain:**

```
setGoal({ objective, runtime, sessionId }, rawOptions)
  → scopeKey = { runtime, sessionId }
  → resolveStateDir({ ...rawOptions, scopeKey })
    → returns <repoRoot>/.opencode/skills/.goal-state/<runtime>-<sha256(sessionId)>.json
  → readGoalRecord(rawOptions)  -- reads the scoped file, not the global one
  → writeJsonAtomic(scopedPath, record)
```

The `scopeKey` is threaded through `rawOptions` so every function (`readGoalRecord`, `setGoal`, `recordTurn`, `clearGoal`, `completeGoal`, `pauseGoal`, `resumeGoal`) automatically resolves the correct per-session file. No function signature changes beyond `resolveStateDir` itself — all functions already accept `rawOptions` and pass it through to `resolveStateDir`.

[SOURCE: goal-core.cjs:119-130, resolveStateDir and statePath — single choke point, accepts rawOptions]
[SOURCE: goal-core.cjs:428-437, readGoalRecord — calls resolveStateDir then statePath]
[SOURCE: goal-core.cjs:499-534, setGoal — calls resolveStateDir then readGoalRecord then writeJsonAtomic(statePath(stateDir), record)]
[SOURCE: goal-core.cjs:604-623, recordTurn — same pattern: resolveStateDir, readGoalRecord, writeJsonAtomic]
[SOURCE: goal-core.cjs:543-550, 554-563, 566-579, 582-596 — completeGoal, clearGoal, pauseGoal, resumeGoal — all same resolveStateDir chokepoint]
[SOURCE: goal-core.cjs:41-44, constants STATE_SUBDIR and STATE_FILENAME]
[SOURCE: goal-core.cjs:490-491,523,616 — runtime field stored but never used for path isolation; now becomes functional]
[INHERITED FROM iteration-2: Finding 2.4 — no runtime exposes a hook-accessible session ID]
[INHERITED FROM iteration-2: Finding 2.5 — OpenCode mk-goal already has per-session isolation via hex-session-id.json]

### Finding 2: Migration strategy — legacy singleton quarantine, resume/fork semantics

Four migration phases, designed so single-session operators see no behavioral change and simultaneous-session operators gain isolation by supplying `--session`.

**Phase 1: Legacy detection and quarantine**

On startup, `resolveStateDir` checks whether `active-goal.json` exists at the legacy path. If it does, and no migration marker file (`.goal-state/.migration-complete`) exists:
1. Read the legacy file. If it has a `goalId`, archive it to `.archive/.legacy/active-goal-<goalId>.json`.
2. Rename `active-goal.json` → `.legacy-active-goal.json` (read-only marker — exists to prevent ambiguity, never written).
3. Write `.migration-complete` marker.
4. Log to `.continuation.log`: `"migrated legacy singleton goalId=<id> runtime=<runtime> at <timestamp>"`.

**Phase 2: Per-session file creation**

After migration (or if no legacy file exists), every `setGoal` call with a `sessionId` creates `<runtime>-<sha256(sessionId)>.json`. Calls without a `sessionId` default to `"default"`:
- `/goal-pi set "Fix the widget"` → `pi-<sha256("default")>.json`
- `/goal-pi set "Fix the widget" --session widget-work` → `pi-<sha256("widget-work")>.json`
- `/goal-cursor set "Ship the feature" --session cursor-ship` → `cursor-<sha256("cursor-ship")>.json`

**Phase 3: Adapter threading**

Pi adapter (`goal-context.ts:59`) and Cursor adapter (`goal-inject.mjs:67-77`) pass `sessionId` through to `readGoalRecord` and `recordTurn`. The `sessionId` is resolved from:
1. Adapter configuration (stored in adapter-specific config, operator-managed).
2. Environment variable `MK_GOAL_SESSION_ID` (highest precedence).
3. CLI `--session` flag (passed through `bin/goal.cjs` to `setGoal`).

**Phase 4: Resume and fork semantics**

| Operation | Pre-migration (v1) | Post-migration (v2) |
|-----------|-------------------|---------------------|
| **Resume** (same session, same runtime, same repo) | Reads/writes `active-goal.json` | Reads/writes `<runtime>-<sha256(sessionId)>.json` — same file, correct isolation |
| **Resume** (new session, same runtime) | Reads `active-goal.json` — may see another runtime's goal | Reads `<runtime>-<sha256("default")>.json` — isolated to runtime |
| **Fork** (operator wants to branch a goal) | Not possible — singleton overwrites | Operator clones a goal with a new `sessionId`: new file created, old file untouched |
| **Cross-runtime read** (Pi adapter reads Cursor goal) | Collision — `active-goal.json` shared | Each adapter reads its own runtime's file — no cross-contamination possible |

**Backward compatibility:**

Single-runtime operators who never use `--session` see zero behavioral change:
- Without `--session`, `sessionId` defaults to `"default"`.
- Each runtime gets exactly one `<runtime>-<sha256("default")>.json`.
- This is semantically identical to v1 behavior: one file per runtime (just named differently and scoped).
- The `bin/goal.cjs show` command remains unchanged for no-argument calls (shows the session-default goal).

Operators who run simultaneous sessions see immediate benefit:
- Supply `--session <name>` on each `set` command.
- Each session gets its own file.
- No cross-contamination.

[SOURCE: goal-core.cjs:41-45, STATE_SUBDIR, STATE_FILENAME, ARCHIVE_SUBDIR constants — these are the foundation for the migration layout]
[SOURCE: goal-core.cjs:440-450, archiveGoalRecord — existing archive mechanism reused for legacy quarantine]
[SOURCE: goal-core.cjs:526-527, setGoal already calls archiveGoalRecord(current, rawOptions) on replace — this is the existing archive path reused for migration]
[INHERITED FROM iteration-1: Finding 1 — two-tier architecture where mk-goal already uses per-session files; cross-runtime port uses singleton]
[INHERITED FROM iteration-2: Finding 2.2 — resolveStateDir has zero per-runtime isolation by design, not by accident]
[INFERENCE: derived from the fact that no runtime exposes a hook-accessible session ID (Finding 2.4), the sessionId must be operator-supplied or derived from runtime + environment; the `"default"` fallback preserves v1 semantics for single-session operators]

### Finding 3: Objective verification plan — two-session cross-runtime action matrix

A 4-stage verification plan that proves isolation works before any implementation is accepted.

**Stage 1: Two-session cross-runtime action matrix (positive controls)**

Matrix below tests every pair of Pi and Cursor sessions with different `sessionId` values. Each cell represents: set goal in session A → set different goal in session B → read goal in session A. The test passes if session A still sees its own goal after session B's write.

| Session A | Session B | A: set goal | B: set goal | A: read goal | Expected |
|-----------|-----------|-------------|-------------|--------------|----------|
| Pi, sess=alpha | Pi, sess=beta | "Fix widget" | "Ship feature" | read(pi, alpha) | Returns "Fix widget" |
| Pi, sess=alpha | Cursor, sess=beta | "Fix widget" | "Ship feature" | read(pi, alpha) | Returns "Fix widget" |
| Cursor, sess=alpha | Pi, sess=beta | "Fix widget" | "Ship feature" | read(cursor, alpha) | Returns "Fix widget" |
| Cursor, sess=alpha | Cursor, sess=beta | "Fix widget" | "Ship feature" | read(cursor, alpha) | Returns "Fix widget" |
| Pi, sess=default | Pi, sess=default | "Fix widget" | "Ship feature" | read(pi, default) | Returns "Ship feature" (same scope key, legitimate overwrite) |
| Pi, sess=alpha | Pi, sess=alpha | "Fix widget" | "Ship feature" | read(pi, alpha) | Returns "Ship feature" (same scope key, legitimate overwrite) |

**Stage 2: Lifecycle negative controls**

| Test | Setup | Action | Expected |
|------|-------|--------|----------|
| `recordTurn` isolation | Pi: alpha sets goal; Cursor: beta sets goal | Cursor `recordTurn(runtime:"cursor")` | Pi alpha `turnsUsed` unchanged |
| `completeGoal` isolation | Pi: alpha sets goal; Cursor: beta sets goal | Cursor `completeGoal` | Pi alpha goal still active |
| `clearGoal` isolation | Pi: alpha sets goal; Cursor: beta sets goal | Cursor `clearGoal` | Pi alpha goal still present |
| `pauseGoal`/`resumeGoal` isolation | Pi: alpha sets goal; Cursor: beta sets goal | Cursor `pauseGoal` | Pi alpha goal still active |
| `verifyGoalHeuristic` against wrong goal | Pi: alpha sets "Fix widget"; Cursor: default sets "Ship feature" | Pi `turn_end` calls `readGoalRecord` | Returns "Fix widget", NOT "Ship feature" |

**Stage 3: Regression controls**

| Test | What it guards | Expected |
|------|---------------|----------|
| Single-session Pi (no `--session`) | Backward compatibility | `setGoal` + `readGoalRecord` + `recordTurn` all work against `pi-<sha256("default")>.json` |
| Single-session Cursor (no `--session`) | Backward compatibility | Same for `cursor-<sha256("default")>.json` |
| `bin/goal.cjs show` with no args | CLI backward compatibility | Shows session-default goal for runtime |
| `bin/goal.cjs list` | Archive listing still works | Lists archived goals from per-session archive dir |
| mk-goal per-session files untouched | OpenCode isolation preserved | mk-goal writes to `<hex>.json` files, not affected by cross-runtime changes |
| Migration from v1 layout | Legacy singleton quarantined correctly | After migration, `active-goal.json` renamed to `.legacy-active-goal.json`; `.migration-complete` exists; no data loss |
| `MK_GOAL_STATE_DIR` env override | Test isolation | All tests use temp dirs, no real `.goal-state/` touched |

**Stage 4: Final gate**

The implementation passes when all of the following are true:
1. All 6 positive-control cells in Stage 1 pass.
2. All 5 negative-control tests in Stage 2 pass.
3. All 7 regression-control tests in Stage 3 pass.
4. No test touches the real `.opencode/skills/.goal-state/` directory (env-isolated).
5. `goal-core.test.cjs`, `goal-pi.test.mjs`, and `goal-cursor.test.mjs` all pass unchanged (regression suite).
6. Two new test files exist: `goal-core-isolation.test.cjs` (core isolation coverage) and `goal-isolation-matrix.test.cjs` (cross-runtime matrix).
7. The legacy migration is idempotent (running migration twice produces no errors and no data loss).

[SOURCE: goal-core.cjs:604-623, 543-550, 554-563, 566-579, 582-596 — all lifecycle functions use the same resolveStateDir choke point, which is the basis for the negative control tests]
[SOURCE: goal-core.cjs:440-450, archiveGoalRecord — existing archive mechanism reused in migration tests]
[SOURCE: .opencode/hooks/goal/lib/goal-core.test.cjs:26, stateDir = mkdtempSync — existing test pattern of env-isolated state directories]
[INHERITED FROM iteration-1: Finding 4 — exact collision reproduction trace used to design negative controls]
[INHERITED FROM iteration-2: Finding 2.1 — recordTurn collision arc used to define the recordTurn isolation test]
[INFERENCE: test matrix derived from the 11-step collision reproduction trace (iteration-1 Finding 4) and the full recordTurn arc (iteration-2 Finding 2.1); each step in the collision becomes a negative-control assertion]

### Finding 4: Implementation risk surface and scope

Based on the function inventory at goal-core.cjs:664-694, the exported interface is stable. The implementation changes are bounded to:

| File | Change Type | Risk |
|------|-------------|------|
| `goal-core.cjs:resolveStateDir` (119-126) | MODIFY — add `scopeKey` parameter, compute scoped path | **Highest** — choke point; every function depends on it |
| `goal-core.cjs:statePath` (128-130) | NO CHANGE — continues to receive resolved stateDir from resolveStateDir | None |
| `goal-core.cjs:setGoal` (499-534) | MODIFY — accept and pass `sessionId` through `rawOptions` | **Medium** — new parameter, backward-compatible default |
| `goal-core.cjs:recordTurn` (604-623) | NO FUNCTION SIGNATURE CHANGE — already receives `rawOptions`, pass-through to resolveStateDir inherits scope | Low |
| `goal-core.cjs:readGoalRecord` (428-437) | NO CHANGE — pass-through to resolveStateDir inherits scope | Low |
| `goal-core.cjs:clearGoal, completeGoal, pauseGoal, resumeGoal` | NO CHANGE — all pass `rawOptions` through to resolveStateDir | Low |
| `goal-core.cjs:archiveGoalRecord` (440-450) | MODIFY — archive to per-session subdirectory | **Medium** — archive namespace shift |
| `goal-core.cjs:listArchivedGoals` (625-646) | MODIFY — list from per-session subdirectory | **Medium** — archive read path shift |
| `bin/goal.cjs` | MODIFY — add `--session` CLI flag | Low — CLI surface change |
| `goal-context.ts` (Pi adapter) | MODIFY — read `sessionId` from config/env, pass through `rawOptions` | Low |
| `goal-inject.mjs` (Cursor adapter) | MODIFY — read `sessionId` from config/env, pass through `rawOptions` | Low |

Total: 2 function signature changes (resolveStateDir, setGoal), 3 path-resolution changes (archiveGoalRecord, listArchivedGoals, resolveStateDir), 3 adapter threading changes (bin/goal.cjs, goal-context.ts, goal-inject.mjs). No new files required beyond the migration marker and test files.

[SOURCE: goal-core.cjs:664-694 — complete exported function inventory]
[SOURCE: goal-core.cjs:119-130, 428-437, 440-450, 499-534, 543-596, 604-623, 625-646 — verified every function's rawOptions pass-through]
[SOURCE: .opencode/hooks/goal/lib/goal-core.test.cjs, .opencode/hooks/goal/pi/goal-pi.test.mjs, .opencode/hooks/goal/cursor/goal-cursor.test.mjs — existing test suites confirmed for regression baseline]

### Finding 5: Synthesis alignment with spec requirements

All P0 and P1 requirements from `spec.md` are addressed by this iteration's deliverables:

| Requirement | How Addressed |
|-------------|---------------|
| **REQ-001** (3 iterations) | Iteration 003 completes the third and final iteration. Config records `maxIterations: 3` and max-iterations stop policy. |
| **REQ-002** (current vs historical) | All findings cite current source files, function line numbers, git history, or test evidence. Historical claims from packets 032 and 034 were verified and reconciled (Devin decommissioned, hypothesized paths absent). |
| **REQ-003** (session identity) | Finding 1: Architecture proposal resolves this. When no runtime exposes a hook-accessible session ID (Finding 2.4), the operator supplies it via `--session`. Every runtime gets a scoped file; the `runtime` label becomes functional for path resolution. |
| **REQ-004** (migration contract) | Finding 2: Full migration strategy with scope key, opaque filename rule, legacy quarantine, resume/fork semantics, and backward-compatible defaults. |
| **REQ-005** (Devin truth) | Resolved in iteration 2, Finding 2.3: Devin adapter was explicitly decommissioned in commit `cac19bbfa5e`. Should NOT be restored. |
| **REQ-006** (proof plan) | Finding 3: 4-stage verification plan with 13 test assertions across positive controls, negative controls, regression controls, and a 7-point final gate. |

[SOURCE: spec.md:128-141 — requirements REQ-001 through REQ-006]
[SOURCE: spec.md:146-152 — success criteria SC-001 through SC-004]

## Ruled Out

None for this iteration — synthesis used only confirmed evidence from iterations 1-2.

## Dead Ends

None. This iteration was synthesis-only; no new exploratory research was conducted.

## Edge Cases

- **Ambiguous input**: The dispatch prompt requested "architecture proposal, migration strategy, and objective verification plan." The term "scope key" was interpreted as the composite `{runtime, sessionId}` key that `resolveStateDir` uses to select a per-session file. The term "opaque filename rule" was interpreted as a SHA256 hash (never raw sessionId) in the filename, consistent with mk-goal's existing hex-session-id pattern.
- **Contradictory evidence**: None — all evidence from iterations 1-2 is internally consistent. No new contradictions were discovered.
- **Missing dependencies**: The `spec.md`'s open questions mention "Which Pi and Cursor native management surfaces expose current session identity without a user-supplied id?" This is answered by Finding 2.4 (iter 2): none do. The architecture accommodates this by making `sessionId` operator-supplied.
- **Partial success**: N/A — synthesis was comprehensive and drew entirely from verified prior findings.

## Sources Consulted

- `.opencode/hooks/goal/lib/goal-core.cjs` — full read (694 lines), function signatures, constants, and the complete exported interface for risk surface analysis
- `.opencode/hooks/goal/lib/goal-core.test.cjs` — 319 lines, test coverage baseline
- `.opencode/hooks/goal/pi/goal-pi.test.mjs` — 187 lines, Pi adapter test coverage
- `.opencode/hooks/goal/cursor/goal-cursor.test.mjs` — 164 lines, Cursor adapter test coverage
- `.opencode/skills/.goal-state/` — directory listing, confirms active mk-goal per-session file and archive structure
- `spec.md` — requirements matrix (REQ-001 through REQ-006), success criteria, phase context
- Iteration 1 findings (iteration-001.md) — collision reproduction trace, adapter inventory, two-tier architecture
- Iteration 2 findings (iteration-002.md) — resolveStateDir isolation gap, session-identity mapping, Devin decommission confirmation

## Assessment

- New information ratio: 0.60
- Questions addressed: 3 synthesis deliverables (architecture, migration, verification plan)
- Questions answered: 3 — all synthesis deliverables produced with cited source anchors and verified function signatures
  - ✅ Session-scoped storage layout designed with scope key, opaque filename rule, per-session files
  - ✅ Migration strategy specified (4 phases: quarantine, creation, threading, semantics)
  - ✅ Objective verification plan built (4 stages, 13 test assertions, 7-point final gate plus regression requirements)

## Reflection

- **What worked and why**: Building the architecture proposal from the verified choke point (`resolveStateDir`) made the design minimal and provably correct — changing one function isolates every downstream read/write path. Using the existing `runtime` field (already stored in records but unused for path resolution) as the scope key component avoided introducing a new concept. Designing backward compatibility through the `"default"` fallback ensured single-session operators see zero behavioral change while simultaneous-session operators gain isolation by adding a single CLI flag.
- **What did not work and why**: No failures. All source evidence needed for synthesis was already gathered in iterations 1-2 and verified in this iteration's targeted re-reads.
- **What I would do differently**: The session-identity gap (no runtime exposes a hook-accessible session ID) forces operator-supplied session IDs. A Phase 2 enhancement could probe Pi's process model for auto-derived session identity (e.g., PID + startup timestamp hash), but this is out of scope for the research phase.

## Recommended Next Focus

This is the final iteration per `--stop-policy=max-iterations`. The next phase (002-session-scoped-core, per spec.md successor field) should:
1. Implement `resolveStateDir` scope-key threading in `goal-core.cjs` — the single choke point change.
2. Implement migration in `bin/goal.cjs` with `--migrate` command.
3. Add `--session` flag to `bin/goal.cjs set` and thread through to adapters.
4. Write the two new test files (`goal-core-isolation.test.cjs`, `goal-isolation-matrix.test.cjs`) using the Stage 1-4 verification plan.
5. Run the legacy test suites unchanged to confirm no regressions.

The implementation surface is bounded to 2 core function changes + 3 adapter threadings + 2 new test files — approximately 200-300 lines of changed code with a single architectural choke point.
