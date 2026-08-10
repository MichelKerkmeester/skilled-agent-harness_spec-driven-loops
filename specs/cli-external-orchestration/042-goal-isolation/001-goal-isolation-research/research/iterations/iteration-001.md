# Iteration 1: Pass 1 — Current-state evidence inventory and collision reproduction

## Focus
Inventory every goal-state file, adapter, and registration across all registered runtimes; map ownership and storage per runtime; reproduce the Pi cross-session overwrite via the shared `active-goal.json` singleton.

## Actions Taken

1. **Read all state files** (config, JSONL, strategy, registry) to establish iteration context and verify no prior iterations exist.
2. **Glob-mapped the full goal hook tree** at `.opencode/hooks/goal/` — discovered the actual file layout differs from the bounded context snapshot's hypothesized paths (`src/shared/goals/`, `src/cli/plugins/goal-*.ts`, `src/runtimes/*/goal-adapter.*` do not exist).
3. **Read the goal-plugin contract** (`.opencode/hooks/goal/goal-plugin.md`) — the authoritative cross-runtime architecture document.
4. **Read the shared goal core** (`.opencode/hooks/goal/lib/goal-core.cjs`, 694 lines) — traced every read/write path to the singleton `active-goal.json`.
5. **Read Pi adapter** (`.opencode/hooks/goal/pi/goal-context.ts`) and its test suite — confirmed three lifecycle hooks (input, session_start, turn_end) all read from the shared file.
6. **Read Cursor adapter** (`.opencode/hooks/goal/cursor/goal-inject.mjs`) and its test suite — confirmed sessionStart-only injection from the shared file.
7. **Searched for Devin adapter** — directory `.opencode/hooks/goal/devin/` does not exist, `.devin/hooks.v1.json` does not exist; spec 032/003 confirms three adapters were built but they are absent from disk.
8. **Searched for Claude Code and Codex goal integration** — no adapters, hooks, or registrations found for either runtime.
9. **Read capability matrix** (032/002) for per-runtime parity tiers.
10. **Read goal-core test suite** — confirmed `setGoal()` with a different objective on an active goal produces mutation `replaced`, which is the overwrite mechanism.

## Findings

### Finding 1: Two-tier state storage architecture (single shared file + per-session files)

The goal state uses a split model:
- **OpenCode (mk-goal plugin)**: Per-session files at `.opencode/skills/.goal-state/<hex-session-id>.json`, one file per OpenCode session. Full inject/verify/auto-continue capability using OpenCode-native lifecycle events (`session.idle`, `message.updated`).
- **Cross-runtime port**: ONE shared `.opencode/skills/.goal-state/active-goal.json`, managed by `.opencode/hooks/goal/lib/goal-core.cjs`. All non-OpenCode runtimes (Pi, Cursor, and the `bin/goal.cjs` manage CLI) read/write this single file.

The two systems coexist by design — neither reads the other's state file.

[SOURCE: .opencode/hooks/goal/goal-plugin.md:120-121, lines "mk-goal keeps per-OpenCode-session state...The cross-runtime port keeps one shared .opencode/skills/.goal-state/active-goal.json"]
[SOURCE: .opencode/hooks/goal/README.md:86, line "The shared state file lives at .opencode/skills/.goal-state/active-goal.json, beside — never touching — mk-goal's own per-session files"]
[SOURCE: .opencode/hooks/goal/lib/goal-core.cjs:41-44, constants STATE_SUBDIR and STATE_FILENAME]
[SOURCE: .opencode/hooks/goal/lib/goal-core.cjs:428-437, readGoalRecord() reads from statePath(stateDir)]

### Finding 2: Runtime adapter inventory — presence on disk

| Runtime | Adapter File | Exists? | Hook Registration |
|---------|-------------|---------|-------------------|
| **Pi** | `.opencode/hooks/goal/pi/goal-context.ts` | YES | Pi extension system (factory exported, symlinked from `.pi/extensions/` per README; runtime extension dir absent on disk) |
| **Cursor** | `.opencode/hooks/goal/cursor/goal-inject.mjs` | YES | No `.cursor/hooks.json` found in repo |
| **Devin** | `.opencode/hooks/goal/devin/goal-inject.mjs` + `goal-session-start.mjs` + `goal-verify.mjs` | NO — directory absent | No `.devin/hooks.v1.json` found; no `.devin/` directory at all |
| **Claude Code** | None | N/A | No goal hook or registration |
| **Codex** | None | N/A | No goal hook or registration |
| **OpenCode** | `.opencode/plugins/mk-goal.js` | YES | OpenCode auto-loads from plugins directory |

[SOURCE: Glob of .opencode/hooks/goal/**/* — returned 10 files, no devin/ subdirectory]
[SOURCE: Glob of .devin/**/* — returned "No files found"]
[SOURCE: Glob of .cursor/**/* — returned "No files found"]
[SOURCE: Glob of .pi/**/* — returned "No files found"]
[SOURCE: specs/cli-external-orchestration/032-goal-hooks-cross-runtime/003-devin-goal-hooks/implementation-summary.md:54-59, documents three Devin adapters were built]

### Finding 3: Devin adapter — built per spec, absent from disk

The Devin goal-hook phase (032/003) documents three adapters were implemented at `.opencode/hooks/goal/devin/`:
- `goal-inject.mjs` (UserPromptSubmit) — injects goal brief as `additionalContext`
- `goal-session-start.mjs` (SessionStart) — session-start restore
- `goal-verify.mjs` (Stop) — heuristic verify with `decision:"block"` continuation mechanism

However, the `.opencode/hooks/goal/devin/` directory does not exist on disk. No `.devin/` directory or `.devin/hooks.v1.json` registration exists either. This means the Devin goal adapter is **not currently deployed** — it was either written and never committed, written and later removed, or the deployment (symlinks + hook registration) was never completed.

The implementation summary (032/003) also documents a critical limitation: Devin's real `Stop` payload carries no evidence field (`last_assistant_message` and `transcript_path` are both absent under `devin 3000.2.17`), so the verify-and-continue mechanism cannot trigger from a real `Stop` event — only the mechanism itself is proven.

[SOURCE: specs/cli-external-orchestration/032-goal-hooks-cross-runtime/003-devin-goal-hooks/implementation-summary.md:54-59, lists three adapter files]
[SOURCE: specs/cli-external-orchestration/032-goal-hooks-cross-runtime/003-devin-goal-hooks/implementation-summary.md:116-118, documents evidence-field limitation]
[SOURCE: Glob of .opencode/hooks/goal/devin/**/* — returned "No files found"]
[SOURCE: Glob of .devin/**/* — returned "No files found"]

### Finding 4: Cross-session collision scenario — reproduction trace

The collision vector is structural, not hypothetical. Here is the exact reproduction trace:

1. Pi session is active. Operator or autonomous workflow sets a goal: `/goal-pi set "Fix the widget"`
2. `bin/goal.cjs` calls `goal-core.setGoal({ objective: "Fix the widget", runtime: "pi" })`
3. `setGoal()` writes `active-goal.json` with `mutation: "created"` [SOURCE: goal-core.cjs:529]
4. Cursor session starts in the same repo. Operator or workflow sets a different goal: `/goal-cursor set "Ship the feature"`
5. `bin/goal.cjs` calls `goal-core.setGoal({ objective: "Ship the feature", runtime: "cursor" })`
6. `setGoal()` detects `current` exists and `current.objective !== sanitizedObjective`, sets `mutation = "replaced"`, archives the Pi goal, and **overwrites** `active-goal.json` with the Cursor goal [SOURCE: goal-core.cjs:526-530]
7. Pi session's next `input` event handler calls `core.readGoalRecord({ cwd: ctx.cwd })` [SOURCE: goal-context.ts:59]
8. `readGoalRecord()` reads the overwritten `active-goal.json` — returns the Cursor goal, not Pi's [SOURCE: goal-core.cjs:428-437]
9. Pi injects Cursor's goal brief into the Pi turn context — wrong goal, wrong runtime label
10. Pi's `turn_end` handler calls `core.verifyGoalHeuristic({ goal, transcriptText })` against Cursor's objective [SOURCE: goal-context.ts:91]
11. Pi's `recordTurn()` increments `turnsUsed` on the Cursor session's goal [SOURCE: goal-context.ts:92, goal-core.cjs:604-623]

The core issue is in `goal-core.cjs:495-534 (setGoal)` — there is zero session-scoping. The function writes to a single file path resolved from `statePath(stateDir)`, which always returns `active-goal.json`. The `runtime` field on the record is a cosmetic label, not a scoping key.

[SOURCE: .opencode/hooks/goal/lib/goal-core.cjs:499-534, setGoal() function — single file path, no session key]
[SOURCE: .opencode/hooks/goal/lib/goal-core.cjs:428-437, readGoalRecord() — reads from single file path]
[SOURCE: .opencode/hooks/goal/pi/goal-context.ts:59, input handler reads goal record]
[SOURCE: .opencode/hooks/goal/pi/goal-context.ts:91-93, turn_end handler reads goal record + records turn]
[SOURCE: .opencode/hooks/goal/cursor/goal-inject.mjs:70-78, Cursor adapter reads same shared file]

### Finding 5: Native session-identity surfaces per runtime

| Runtime | Session ID Available? | Usable for Automated Goal Scoping? |
|---------|----------------------|-----------------------------------|
| **OpenCode** | Yes — hex session ID exposed to plugin context | Already used by mk-goal for per-session file naming |
| **Cursor** | Yes — `session_id` in hook payload (`goal-inject.mjs:27` stdin JSON) | Available but not used for scoping; shared file is session-agnostic |
| **Pi** | UNKNOWN — `ExtensionAPI` and handler contexts (`ctx`) do not expose a session ID in the goal-context handlers | Not exposed in the adapter's current handler signatures |
| **Devin** | Yes — `session_id` in hook payload (per implementation-summary) | Available but adapters are absent from disk |
| **Claude Code** | N/A — no goal integration | N/A |
| **Codex** | N/A — no goal integration | N/A |

The cross-runtime core (`goal-core.cjs`) has no session-scoping mechanism at all — it resolves a single file path and has no `sessionId` parameter on any function. To add session-scoping, a `sessionId` (or equivalent runtime+session composite key) would need to be threaded from each adapter through `resolveStateDir()`, `statePath()`, `readGoalRecord()`, `setGoal()`, `recordTurn()`, and every other state-mutating function.

[SOURCE: .opencode/hooks/goal/lib/goal-core.cjs:99-136, resolveRepoRoot and resolveStateDir — no sessionId parameter]
[SOURCE: .opencode/hooks/goal/lib/goal-core.cjs:428-437, readGoalRecord() — no sessionId parameter]
[SOURCE: .opencode/hooks/goal/lib/goal-core.cjs:604-623, recordTurn() — runtime label only, no sessionId]
[SOURCE: .opencode/hooks/goal/cursor/goal-inject.mjs:67, session_id present in payload but not used for file scoping]
[SOURCE: specs/cli-external-orchestration/032-goal-hooks-cross-runtime/002-capability-probes/capability-matrix.md:14-18, per-runtime capability matrix]

### Finding 6: The OpenCode mk-goal plugin already has per-session isolation

The OpenCode mk-goal plugin (`.opencode/plugins/mk-goal.js`) already implements per-session state isolation — it writes one state file per hex session ID under `.opencode/skills/.goal-state/`. This is the existing pattern that the cross-runtime port could follow: key state files by session ID rather than using a singleton.

[SOURCE: .opencode/hooks/goal/goal-plugin.md:30-31, line "State: .opencode/skills/.goal-state/ — Runtime JSON state, keyed by session id"]
[SOURCE: .opencode/hooks/goal/goal-plugin.md:120, line "mk-goal keeps per-OpenCode-session state, one file per hex session id under .opencode/skills/.goal-state/"]

## Ruled Out
- None this iteration — first pass was comprehensive mapping, not elimination.

## Dead Ends
- The bounded context snapshot's hypothesized paths (`src/shared/goals/`, `src/cli/plugins/goal-*.ts`, `src/runtimes/*/goal-adapter.*`) do not exist — these are stale hypotheses from packets 032 and 034 that should not be reinvestigated.

## Edge Cases
- **Ambiguous input**: The bounded context snapshot in strategy §12 listed source paths that don't exist on disk. Resolved by searching the actual file tree and finding the real goal hook structure under `.opencode/hooks/goal/`.
- **Contradictory evidence**: The Devin spec (032/003) claims adapters were built and tested, but the files are absent from disk. Both facts are recorded; the contradiction is unresolved and needs investigation about whether they were removed intentionally or never committed.
- **Missing dependencies**: The `.pi/extensions/` directory (expected Pi extension symlink target) does not exist; `.cursor/hooks.json` and `.devin/hooks.v1.json` do not exist. The adapter source files exist but their runtime registrations appear absent.
- **Partial success**: N/A — all research actions succeeded.

## Sources Consulted
- `.opencode/hooks/goal/goal-plugin.md` — Cross-runtime architecture contract
- `.opencode/hooks/goal/README.md` — Concern README with directory tree and boundaries
- `.opencode/hooks/goal/lib/goal-core.cjs` — Shared goal core (694 lines, full read)
- `.opencode/hooks/goal/lib/goal-core.test.cjs` — Core test suite (319 lines, full read)
- `.opencode/hooks/goal/pi/goal-context.ts` — Pi adapter (106 lines, full read)
- `.opencode/hooks/goal/pi/goal-pi.test.mjs` — Pi adapter tests (187 lines, full read)
- `.opencode/hooks/goal/cursor/goal-inject.mjs` — Cursor adapter (88 lines, full read)
- `.opencode/hooks/goal/cursor/goal-cursor.test.mjs` — Cursor adapter tests (164 lines, full read)
- `.opencode/hooks/goal/bin/goal.cjs` — Manage CLI (222 lines, full read)
- `specs/cli-external-orchestration/032-goal-hooks-cross-runtime/002-capability-probes/capability-matrix.md` — Live capability probe results
- `specs/cli-external-orchestration/032-goal-hooks-cross-runtime/003-devin-goal-hooks/implementation-summary.md` — Devin adapter build record and known limitations
- `specs/cli-external-orchestration/032-goal-hooks-cross-runtime/003-devin-goal-hooks/spec.md` — Devin adapter spec with file paths
- Glob searches: `.opencode/hooks/goal/**/*`, `.devin/**/*`, `.cursor/**/*`, `.pi/**/*`, `**/active-goal.json`, `**/hooks.json`

## Assessment
- **New information ratio**: 1.00 (6 of 6 findings are fully new; no prior iterations exist)
- **Questions addressed**: All 5 key questions touched to varying depths
- **Questions answered**:
  - ✅ Which files own the current active-goal state for each runtime? — Answered comprehensively
  - ✅ How does the current Pi goal plugin store, inject, verify, pause, complete, and clear goal state? — Answered via goal-core.cjs tracing
  - ✅ What cross-session collision scenario reproduces the leak in Pi? — Answered with exact reproduction trace
  - ⬜ Does the current Devin adapter still work against the latest runtime? — Partially: confirmed adapters are absent from disk; whether they were removed intentionally is unknown
  - ⬜ What native session-identity surfaces does each runtime expose? — Catalogued; Pi's session ID surface in ExtensionAPI remains UNKNOWN

## Reflection
- **What worked and why**: Glob-driven discovery of the real file tree (`.opencode/hooks/goal/`) was more reliable than trusting the bounded context snapshot's hypothesized paths. Reading the full goal-core.cjs provided a definitive trace of every read/write path and the exact overwrite mechanism. The contract document (goal-plugin.md §8) explicitly stated the two-tier model, confirming the collision vector was a known design characteristic, not an accidental bug.
- **What did not work and why**: The bounded context snapshot paths were stale — they pointed to a hypothesized `src/` tree that doesn't exist. This is consistent with the strategy's own warning that "Historical packets 032 and 034 may overstate current runtime support; treat as hypotheses." Following those paths would have been dead-end research.
- **What I would do differently**: The Devin adapter absence needs a definitive answer — were the files removed intentionally, or were they never committed? This requires checking git history for `.opencode/hooks/goal/devin/` to determine when/why they disappeared. That's a focused action for iteration 2.

## Recommended Next Focus
1. **Git archaeology for Devin adapter**: Check git log for `.opencode/hooks/goal/devin/` to determine when and why the adapters were removed (or confirm they were never committed). This resolves the contradiction between spec and disk.
2. **Pi session-identity surface**: Probe Pi's `ExtensionAPI` / `ctx` for a session ID — if none is exposed, determine what the minimal injection point would be.
3. **Minimal structural fix analysis**: Given the collision trace, evaluate whether session-keyed state files (mirroring mk-goal's per-hex-session-id pattern) or a composite-keyed single file would be the minimal fix.
