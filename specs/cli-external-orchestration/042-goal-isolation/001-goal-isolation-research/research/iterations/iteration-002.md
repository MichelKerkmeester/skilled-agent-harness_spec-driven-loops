# Iteration 2: Session Identity, Isolation Gap, and Remaining Runtime Coverage

## Focus

Followed up on Pi's `recordTurn()` incrementing `turnsUsed` on the Cursor session's goal, extended to full collision arc with `resolveStateDir`, mapped session-identity surfaces for all six runtimes, and determined the Devin adapter's current status. This iteration targeted the three remaining key questions: (1) file ownership for Devin/Claude Code/Codex, (2) native session-identity surfaces per runtime, (3) whether the Devin adapter still works.

Ambiguity resolved: "session-identity surfaces" was interpreted as the runtime-provided identifiers or lifecycle events a goal adapter can use to scope state to a specific session instance without user input — not user-defined session names or workspace labels.

## Findings

1. **`recordTurn` reads/writes the shared `active-goal.json` — no per-runtime path scoping exists.**
   `recordTurn()` (goal-core.cjs:604-623) calls `readGoalRecord(rawOptions)` → `resolveStateDir(rawOptions)` → `statePath(stateDir)` → `active-goal.json`. It then increments `turnsUsed` on whatever record that file contains (including another runtime's overwritten goal), writes the mutated record back via `writeJsonAtomic`, and stores the `runtime` parameter in the record. At no point does the `runtime` parameter affect which file is read or written. The full collision arc: Pi's `turn_end` handler (goal-context.ts:87-92) calls `core.readGoalRecord({ cwd: ctx.cwd })` + `core.recordTurn({ runtime: "pi" }, { cwd: ctx.cwd })`. If Cursor's `goal-inject.mjs:71,77` previously called `readGoalRecord` + `recordTurn({ runtime: "cursor" })` and `setGoal` had overwritten `active-goal.json`, Pi's `recordTurn` increments and persists against the Cursor objective — wrong goal, wrong runtime.
   [SOURCE: goal-core.cjs:428-437, 604-623; goal-context.ts:87-92; goal-inject.mjs:71-77]

2. **`resolveStateDir` has zero per-runtime or per-session isolation — this is by design, not a bug.**
   `resolveStateDir` (goal-core.cjs:119-126) resolves: `stateDir` option override → `MK_GOAL_STATE_DIR` env var → `repoRoot + .opencode/skills/.goal-state`. The function accepts `rawOptions.cwd` only to walk up to the repo root — there is no session ID, runtime key, PID, instance UUID, or any other scoping parameter consulted. The file header (goal-core.cjs:1-14) states the design intent explicitly: "Persist a **single** cross-runtime session goal in a shared state file." Every adapter (Cursor `goal-inject.mjs:71`, Pi `goal-context.ts:59`, `bin/goal.cjs`) calls `resolveStateDir` with the same `cwd`-based path, landing on the same `active-goal.json`.
   [SOURCE: goal-core.cjs:99-126, 1-14]

3. **The Devin goal adapter was decommissioned — files removed, registration reverted.**
   The Devin adapter (3 files: `goal-inject.mjs`, `goal-session-start.mjs`, `goal-verify.mjs`, plus test suite) was committed in `e97fb01786a` and live-verified per the 032-003 `implementation-summary.md`. However, a subsequent breaking-change commit `cac19bbfa5e` (`feat(goal)!: decommission Devin commands + goal hook`) removed the `.opencode/hooks/goal/devin/` directory and reverted the registration from `.devin/hooks.v1.json`. The current filesystem confirms: no `devin/` subdirectory exists under `.opencode/hooks/goal/`; `.devin/hooks.v1.json` contains zero goal-hook references; `goal-plugin.md` §8 states "Codex and Devin have no goal hook and therefore no goal command." The adapter should **not** be restored — it was explicitly decommissioned, and the current system's documentation and capability matrix are consistent with its absence.
   [SOURCE: .opencode/hooks/goal/ directory listing (ls); .devin/hooks.v1.json:1-178; git log --diff-filter=D -- .opencode/hooks/goal/devin/; goal-plugin.md:140]

4. **Session-identity surfaces: no runtime provides a hook-accessible session ID usable for automated per-session goal file scoping without user input.**
   Per-runtime analysis:
   - **OpenCode (mk-goal)**: Already has per-session isolation via `<hex-session-id>.json` files under `.goal-state/`. Session ID is internal to the plugin and derived from OpenCode's runtime.
   - **Cursor**: `cursor-agent` CLI receives `workspace_roots` in stdin; `goal-inject.mjs:68` reads only `workspace_roots[0]` for `cwd`. No session UUID, instance token, or distinguishable runtime label beyond the static `"cursor"` in code. A second Cursor session against the same repo is indistinguishable from the first.
   - **Pi**: Extension API provides `ctx.cwd` and lifecycle events (`session_start`, `input`, `turn_end`). No session UUID or runtime-instance discriminator in the extension context. `goal-context.ts:59` passes only `ctx.cwd`.
   - **Devin**: `Stop` payload carries `session_id` (per `implementation-summary.md:116`), but adapter files are decommissioned.
   - **Claude Code**: Reaches `mk-goal` plugin via `.claude/commands` → `.opencode/commands` symlink (goal-plugin.md:140). Falls under OpenCode's per-session `mk-goal` state if the plugin loads in Claude Code context. No dedicated adapter.
   - **Codex**: No goal hook, no goal command, no adapter.
   [SOURCE: goal-context.ts:54-67; goal-inject.mjs:57-69; goal-plugin.md:122-140; goal-core.cjs:119-126; devin-goal-hooks/implementation-summary.md:116; capability-matrix.md:14-30]

5. **The `runtime` field in `active-goal.json` is stored but never used for isolation, routing, or file-path resolution.**
   `setGoal()` stores `runtime` (goal-core.cjs:490, 523); `recordTurn()` stores `runtime` (goal-core.cjs:616-617). No function in `goal-core.cjs` ever reads `runtime` for path selection, state scoping, or adapter routing. The field is purely informational — surfaced in the manage CLI's `show` output but has zero architectural effect.
   [SOURCE: goal-core.cjs:490-491, 604-623; Grep for `runtime` usage in goal-core.cjs confirms no path-resolution use]

6. **Claude Code and Codex have zero dedicated goal adapters — consistent with documented architecture.**
   No directory exists at `.opencode/hooks/goal/claude*/` or `.opencode/hooks/goal/codex*/`. No `.claude/hooks*.json` or `.codex/hooks*.json`. Claude Code reaches OpenCode's `mk-goal` plugin through a symlink (goal-plugin.md:140) but has no cross-runtime-port adapter of its own. Codex has no goal infrastructure at all. The `README.md` directory tree (§3) lists only `cursor/` and `pi/` as adapter directories, and the capability matrix (goal-plugin.md:122-130) lists only OpenCode, Cursor, and Pi in its tier table.
   [SOURCE: goal-plugin.md:122-140; README.md:65-75; Glob searches for claude* and codex* under .opencode/hooks/goal/]

## Ruled Out

- Searching for a `runtime`-based path in `resolveStateDir` — confirmed absent. The function has no runtime parameter and no per-runtime path branching.
- Looking for per-session UUIDs in Cursor/Pi hook payloads — none exposed at the level the adapters can read.

## Dead Ends

None for this iteration. The focus was productive and all questions yielded concrete answers.

## Edge Cases

- Ambiguous input: The phrase "session-identity surfaces [...] usable for automated goal scoping without a user-supplied id" was interpreted as runtime-provided identifiers accessible to hook code at execution time, not user-supplied workspace labels or manual naming. Deferred: whether a process-level PID or parent-process inspection could serve as a weak proxy (out of scope for current adapter design).
- Contradictory evidence: The 032-003 `implementation-summary.md` claims Devin adapters shipped and live-verified; the current filesystem shows they are absent. This apparent contradiction is resolved by git history: the adapter was deliberately decommissioned in commit `cac19bbfa5e` after being built.
- Missing dependencies: None.
- Partial success: None — all research actions completed successfully with target evidence found.

## Sources Consulted

- `.opencode/hooks/goal/lib/goal-core.cjs` — full read (694 lines), core collision arc and `resolveStateDir`
- `.opencode/hooks/goal/pi/goal-context.ts` — full read (106 lines), Pi adapter lifecycle
- `.opencode/hooks/goal/cursor/goal-inject.mjs` — full read (88 lines), Cursor adapter
- `.opencode/hooks/goal/goal-plugin.md` — full read (148 lines), runtime capability matrix and architecture
- `.opencode/hooks/goal/README.md` — full read (127 lines), directory tree and boundaries
- `.devin/hooks.v1.json` — full read (178 lines), current registration state
- `specs/cli-external-orchestration/032-goal-hooks-cross-runtime/003-devin-goal-hooks/spec.md` — full read (204 lines), Devin adapter spec
- `specs/cli-external-orchestration/032-goal-hooks-cross-runtime/003-devin-goal-hooks/implementation-summary.md` — full read (120 lines), Devin adapter build record
- `specs/cli-external-orchestration/032-goal-hooks-cross-runtime/002-capability-probes/capability-matrix.md` — full read (30 lines), live-verified capability tiers
- `ls .opencode/hooks/goal/` — directory listing confirming absence of devin/claude/codex subdirectories
- `git log --diff-filter=D -- .opencode/hooks/goal/devin/` — decommission commit trace

## Assessment

- New information ratio: 0.85
- Questions addressed: 3 (file ownership for remaining runtimes, session-identity surfaces, Devin adapter status)
- Questions answered: 3 — all remaining key questions now resolved
  - Q1 (file ownership for Devin/Claude/Codex): Devin adapter decommissioned (no files), Claude Code uses mk-goal plugin symlink (no dedicated adapter), Codex has no adapter
  - Q2 (session-identity surfaces): No runtime exposes a hook-accessible session ID usable for automated per-instance goal file scoping; per-runtime breakdown in Finding 4
  - Q3 (Devin adapter status): Decommissioned in commit `cac19bbfa5e`; should NOT be restored

## Reflection

- What worked and why: Direct filesystem inspection (`ls`, `glob`) plus git history confirmed the Devin adapter's decommission status definitively — the negative result (no files) combined with the positive result (git shows a deletion commit) forms a strong evidence pair. Reading `resolveStateDir` in full context revealed it is architecturally designed for a single shared file, not a bug awaiting a fix.
- What did not work and why: Nothing failed this iteration. All targeted files were present and readable.
- What I would do differently: The session-identity question could benefit from a runtime-by-runtime probe (e.g., actually running `cursor-agent` with a debug hook to inspect the full stdin payload for undocumented session-ID fields). That level of testing is beyond this research iteration's scope but would harden Finding 4.

## Recommended Next Focus

All 5 key questions are now answered (2 in iteration 1, 3 in iteration 2). With `antiConvergence.minIterations=3`, iteration 3 should pivot to synthesis: verify the structural fix feasibility, validate the collision impact across all adapter pairs, and produce the progressive synthesis in `research/research.md`. Specific candidates:
- Audit all `readGoalRecord`/`recordTurn` call sites across Pi and Cursor adapters for completeness of the collision surface map
- Validate that `bin/goal.cjs` manage CLI's `set` action reproduces the same overwrite pattern as the adapter code paths
- Check whether `MK_GOAL_STATE_DIR` env-based isolation is a viable short-term mitigation for simultaneous-session operators
