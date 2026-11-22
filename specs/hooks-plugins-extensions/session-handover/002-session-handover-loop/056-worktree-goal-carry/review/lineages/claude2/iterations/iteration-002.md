# Iteration 002 - Security

## Dispatcher
- Lineage: claude2 (fan-out), session fanout-claude2-1795297959308-ycf8yr, generation 1
- Dimension: security
- Sources: deep-review-strategy.md (Next Focus from iteration 1), relaunch-core.cjs trust code, frontmatter reader/writer, skilled-loop render path, `git worktree list --porcelain` output of this repository (read-only). steer.md: not present.

## Review Focus Coverage
The focus asks that a worktree-only goal is never misrouted. On the security side that means the `goal_root` field, which anyone who can edit a note can set, must only ever point the slice render at a real checkout of this repository. I checked how far that trust reaches: the git listing, the stripped git variables, packet containment inside the root, and argument passing into `goal.cjs`.

## Files Reviewed
- .skilled/hooks/session-handover/lib/relaunch-core.cjs:74-80, 505-556, 568-602, 239-262, 330-345, 448-468
- .skilled/bin/skilled-loop:452-475, 1440-1466
- .skilled/hooks/session-handover/lib/goal-handover.cjs:66-115

## Findings by Severity

### P0 Findings
None.

### P1 Findings
None.

### P2 Findings
1. **Stale (prunable) worktree entries count as trusted roots** -- .skilled/hooks/session-handover/lib/relaunch-core.cjs:533 -- `repositoryWorktrees` keeps every `worktree <path>` line and skips the attribute lines that follow it, including `prunable gitdir file points to non-existent location`. git keeps listing a worktree whose directory was deleted without `git worktree remove` until it is pruned. When anything later sits at that path, `realPathOrNull` resolves it and `noteGoalRoot` (line 547-554) accepts it as "a worktree of this repository". The listing is the only trust check on a hand-editable `goal_root`, so a directory that is no longer a checkout of this repository can then supply the packet's `goal.md` to the receiver.
   Finding class: security / trust boundary over-acceptance
   Scope proof: repositoryWorktrees and noteGoalRoot are new in this diff; the porcelain attribute lines are git's documented output.
   Affected surface hints: relaunch-core.cjs repositoryWorktrees porcelain parsing; goal-carry-over.md trust paragraph ("only while git worktree list still names it")
   Case: worktree /w/505 is removed with rm -rf, a plain directory or another repository is unpacked at /w/505 before git worktree prune runs, and a note carries goal_root /w/505, so consume reports goal_root /w/505 and the wrapper renders /w/505/specs/<packet>/goal.md as the receiver's goal.

## Traceability Checks
- spec_code (partial): spec Risks row "A hand-edited goal_root points the slice render at an arbitrary directory -> the root counts only while git worktree list names it, and packet containment is checked inside it". Code matches that literal wording (relaunch-core.cjs:553, goalPacketProblem with `[goalRoot]` at :580). The gap is that git can name a stale entry, see P2-001.

## Integration Evidence
- `.skilled/bin/skilled-loop:470-474` passes packet and root as argv to `node -e`; no shell interpolation of the value.
- `goal-handover.cjs:103-110` spawns `goal.cjs packet <packet> --workspace <root>` with an argv array. The root is an absolute realpath and so cannot be read as an option, and the packet passed `validSpecFolder` first.

## Edge Cases
- `GIT_CONFIG_PARAMETERS` / `GIT_CONFIG_COUNT` are not stripped. `worktree list` reads `$GIT_COMMON_DIR/worktrees/*`, which those cannot redirect once `GIT_DIR`/`GIT_COMMON_DIR` are removed. Ruled out as a redirect vector.
- Removing `GIT_CEILING_DIRECTORIES` widens discovery only when repoRoot is not itself a repository. repoRoot is the CLI's own checkout or the operator-pinned `SESSION_HANDOVER_REPO_ROOT`. Recorded, not a finding.
- Porcelain is read without `-z`, so a worktree path holding a newline would split into two lines. Creating such a worktree needs the same local access as editing a note. Theoretical; recorded only.
- Packet containment: `goalPacketProblem(packet, [goalRoot])` follows links and requires the packet and goal.md inside the worktree's realpath, so a symlinked packet cannot escape the root.

## Confirmed-Clean Surfaces
- `GIT_DIR` / `GIT_WORK_TREE` / `GIT_COMMON_DIR` / `GIT_INDEX_FILE` / `GIT_NAMESPACE` are stripped before the git call (relaunch-core.cjs:519), and a CLI test covers a hostile `GIT_DIR`.
- A failed, timed-out or missing git lists no worktree (fail closed, :526-527).
- The `goal_root` is never re-checked against another checkout when its worktree is gone (usableGoal :576-581).

## Ruled Out
- Shell or option injection through `goal_root` into the slice render.
- Config-variable redirection of `git worktree list`.

## Next Focus
- Dimension: traceability
- Focus area: spec REQ-001..005, SC-001/002, Handoff Criteria, tasks T001-T010, implementation-summary decisions and limitations, goal-carry-over.md and troubleshooting.md against code.
- Reason: rotation to D3. Two candidate drifts are already known: the Handoff Criteria claim that the tampered-root test passes on the old code, and the troubleshooting wording that only the log names a worktree.
- Rotation status: D1, D2 done; D3, D4 remaining.

Review verdict: PASS
