# Review Iteration 003

## Dispatcher

- Mode: review, target_agent `deep-review`, execution single_review_iteration
- Review target: `specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation` (spec-folder)
- Dimension: security
- Operator review focus: the hook trust boundaries the 2026-11-15 work touched, and the VIB-HK-005/006/007 live regression.
- Iteration: 3 of 5. Session `fanout-vibe-1-1794765851303-zrv85l`, generation 1, lineageMode new.
- Sources read this iteration: `steer.md` (absent), `.skilled/hooks/session-handover/vibe/handover-parts.mjs`, `.skilled/hooks/session-handover/lib/relaunch-core.cjs` (28-50, 291-314, 1387-1495, 1596-1630, 1856-1890, 2251-2300), `.skilled/hooks/session-handover/lib/killer.cjs` (1-235, 770-805), `.skilled/hooks/session-handover/lib/nudge.cjs` (120-124, 463-480), `.skilled/hooks/goal/lib/goal-slice.cjs` (443-478), `.skilled/hooks/goal/lib/goal-core.cjs` (1286-1303), `.skilled/bin/skilled-loop` (75-95, 627-700, 810-900), `.skilled/hooks/session-lifecycle/vibe/compaction-context.mjs` (63-150).

## Files Reviewed

- `.skilled/hooks/session-handover/vibe/handover-parts.mjs` (full, 375 lines)
- `.skilled/hooks/session-handover/lib/relaunch-core.cjs` (trust-boundary sections)
- `.skilled/hooks/session-handover/lib/killer.cjs` (signal path and ancestry guard)
- `.skilled/hooks/session-handover/lib/nudge.cjs` (`claimCommandFor`, `plannedNotePath`)
- `.skilled/hooks/goal/lib/goal-slice.cjs` (`readPacketGoal`)
- `.skilled/hooks/goal/lib/goal-core.cjs` (`describePacketGoal`)
- `.skilled/bin/skilled-loop` (flag replay and manual command template)
- `.skilled/hooks/session-lifecycle/vibe/compaction-context.mjs` (state directory resolution)

## Findings - New

### P0 Findings

None. No exploitable security issue, auth bypass or destructive data loss was found in this dimension.

### P1 Findings

None. Every destructive path in reach is guarded: see Confirmed-Clean Surfaces.

### P2 Findings

1. **The hand-over part uses `payload.cwd` and `payload.transcript_path` without a containment check, and `arm` persists the unvalidated `cwd` into the record the wrapper restarts from** -- `.skilled/hooks/session-handover/vibe/handover-parts.mjs:347` -- `arm({ loopId, cwd: payload.cwd || process.cwd(), env })` writes the payload's `cwd` straight into the relaunch record (`relaunch-core.cjs:1429`), and the wrapper restarts the runtime in that directory. The same payload's `transcript_path` is passed unvalidated to `readVibeUsage` (`:218`) and `newestJournalFile` (`:321`), so the reader can be pointed at any directory the user can read.
   Finding class: security
   Scope proof: `handover-parts.mjs:347` (arm with payload cwd), `:218` and `:321` (payload transcript path), `relaunch-core.cjs:1424-1431` (the record carries `cwd` with no containment check).
   Affected surface hints: `.skilled/hooks/session-handover/lib/relaunch-core.cjs:1424-1431`, `.skilled/hooks/session-handover/lib/context-usage.cjs`, `.skilled/hooks/session-lifecycle/vibe/compaction-context.mjs:67-70`
   Case: a hook payload whose `cwd` names a directory outside the checkout. The arm records that path, the wrapper restarts the runtime there, and the next session's hooks resolve `resolveRepoRoot` from the wrong tree, so the goal slice and the handoff note resolve against a tree that is not the packet's.

2. **The compaction watermark directory is created under `payload.cwd` with no check that the directory is inside the checkout** -- `.skilled/hooks/session-lifecycle/vibe/compaction-context.mjs:69` -- `stateDirFor` joins `payload.cwd` with `.skilled/skills/.state/vibe-compaction`, and `writeWatermark` at `:116` calls `mkdirSync(stateDir, { recursive: true, mode: 0o700 })`. `mkdirSync` does not tighten the mode of a directory that already exists, so a pre-existing directory at that path keeps its own permissions and the watermark that decides whether the compaction context is injected is written into it.
   Finding class: security
   Scope proof: `compaction-context.mjs:67-70` (state dir from payload cwd), `:116-124` (mkdir then write), `:89-104` (the watermark is read back and trusted).
   Affected surface hints: `.skilled/hooks/session-lifecycle/vibe/compaction-context.mjs:141-149` (`writeJournalSize` has the same shape)
   Case: a session whose `cwd` is a shared or world-writable directory. The hook creates or reuses `.skilled/skills/.state/vibe-compaction` there, and another local user who can write that directory can pre-seed a watermark whose `seen` list names the next compaction, which suppresses the goal re-injection for that session.

## Traceability Checks

| Check | Result | Evidence |
|-------|--------|----------|
| `spec_code` (core) | partial | Unchanged from iteration 2; the security dimension adds no new spec claim. |
| `checklist_evidence` (core) | fail | Unchanged from iteration 2. |
| `skill_agent` (overlay) | pass | The session-handover README documents the killer's ancestry guard and the state-directory ownership check, matching the code. |
| `agent_cross_runtime` (overlay) | notApplicable | No agent profile in this dimension. |
| `feature_catalog_code` (overlay) | pending | Deferred to iteration 5. |
| `playbook_capability` (overlay) | partial | Unchanged from iteration 2. |

## Integration Evidence

- `.skilled/hooks/session-handover/lib/killer.cjs:205-212` -- `isLoopAncestor` reads the process table with `throwOnFailure: true` and refuses to signal when the read fails, so a hung `ps` cannot become a wrong-pid signal.
- `.skilled/hooks/session-handover/lib/killer.cjs:780-796` -- `markSignalled` re-checks the record under the state lock immediately before `process.kill`, so a cancel or re-arm cannot land between the check and the signal.
- `.skilled/hooks/session-handover/lib/relaunch-core.cjs:307-314` -- `relaunchFilePath` rejects any `loopId` outside `[A-Za-z0-9._-]`, so `SKILLED_LOOP_ID` cannot traverse out of the state directory.
- `.skilled/hooks/session-handover/lib/relaunch-core.cjs:1596-1606` -- `readRelaunchFile` refuses a state directory that is not a real directory owned by the current user.
- `.skilled/hooks/session-handover/lib/nudge.cjs:120-124` -- `claimCommandFor` shell-quotes both the note path and the session id.
- `.skilled/hooks/session-handover/lib/relaunch-core.cjs:99-103` -- `specFolderSuffix` validates through `validSpecFolder`, whose pattern at `:30-31` admits only `[A-Za-z0-9._-]` and `/`, so the unescaped suffix cannot break out of the quoted seed.
- `.skilled/bin/skilled-loop:836-857` -- `build_manual_command_template` shell-quotes every replayed argument, so a carried `--trust` or `--model` value cannot inject into the printed command.
- `.skilled/hooks/goal/lib/goal-slice.cjs:443-462` -- `readPacketGoal` re-checks the goal file's real path against the real workspace root, so a symlinked `goal.md` cannot inject an arbitrary file as the session goal.

## Edge Cases

- **Ambiguity: whether the hook payload is a trust boundary.** Vibe writes it and runs as the same user, so a malicious payload gains nothing the user does not already have. Both findings are therefore P2 under the reach calibration rather than P1; the impact is a misdirected restart and a suppressible injection, not privilege gain.
- **Contradictory evidence on the killer's pid-reuse window.** `killer.cjs:774-780` documents the window between the ancestry snapshot and the signal and bounds it to one locked write. Recorded as a documented tradeoff, not a finding.
- **`withdrawOnOperatorPrompt` fires on any non-seed `pre_agent`.** `handover-parts.mjs:209` calls it without checking that the payload carries a prompt, while the comment at `:87-91` reasons about "any other prompt". A `pre_agent` with no prompt would withdraw an armed hand-over. This is a correctness gap, not a security one; carried to iteration 4.
- **Partial success.** The security dimension is otherwise clean: every destructive path (signal, state write, packet read, printed command) has a named guard.

## Confirmed-Clean Surfaces

- Signal path: ancestry checked (`killer.cjs:205-212`), record re-checked under lock (`:780-796`), `ESRCH` handled (`:797-801`).
- State path: `loopId` charset-validated (`relaunch-core.cjs:307-314`), state directory ownership-checked (`:1596-1606`), writes atomic (`:1431`).
- Packet path: containment checked on the directory and re-checked on the real file path (`goal-slice.cjs:443-462`), and the sender validates through `goalPacketProblem` (`relaunch-core.cjs:1201-1211`).
- Printed command: every interpolated value shell-quoted (`nudge.cjs:120-124`, `skilled-loop:836-857`), and the one unescaped suffix is charset-restricted (`relaunch-core.cjs:30-31`).
- Hook failure containment: `turn-start.mjs:130-137`, `compaction-post-tool.mjs:59-73` and `turn-end.mjs` each catch per part, so no hook can end a turn or blank a tool result.

## Ruled Out

- **Command injection through the printed manual claim command.** Every argument is shell-quoted and the spec-folder suffix is charset-restricted.
- **Path traversal through `SKILLED_LOOP_ID`.** `relaunchFilePath` rejects anything outside `[A-Za-z0-9._-]`.
- **Symlink escape through the goal packet.** `readPacketGoal` re-checks the real path against the real workspace root.
- **Wrong-pid signal after a process-table read failure.** `isLoopAncestor` throws and the killer refuses rather than guessing.
- **Secret exposure through the killer's environment.** The child is `process.execPath` running the repository's own `killer.cjs`, so the inherited environment is not handed to an untrusted program.

## Next Focus

- Dimension: maintainability
- Focus area: the 2026-11-15 fix set as code -- `relaunch-core.cjs` `vibeGoalPacket`, the runner `--remove-home` path, and the `withdrawOnOperatorPrompt` prompt check carried from this iteration
- Reason: security is clean; the remaining unreviewed dimension is maintainability, and the carried correctness gap belongs there
- Rotation status: correctness, traceability and security reviewed; maintainability remains
- Blocked/productive carry-forward: productive -- reading the guards before the gaps kept the security pass from inflating findings
- Required evidence: `file:line` on each fix plus the test that pins it

## Verdict

CONDITIONAL -- no active P0; three active P1 findings remain (R1-P1-001, R1-P1-002, R2-P1-001). The security dimension itself is PASS with two advisories.

Review verdict: CONDITIONAL
