# Review Iteration 002

## Dispatcher

- Mode: review | Target agent: `@deep-review` | Execution: single review iteration, inline
- Resolved route: mode=review target_agent=deep-review
- Session: `fanout-vibe-1795297959308-ycf8yr` | generation 1 | lineageMode `new`
- Iteration 2 of 5 | stopPolicy `max-iterations` (convergence 0.10 is telemetry only)
- Dimension: **security**
- Operator review focus: the uncommitted worktree goal carry-over change, checked against packet 056's spec, tasks and implementation-summary claims, and checked for a goal set in a worktree-only packet being carried across a hop without being lost or misrouted. This iteration asks whether the new `goal_root` trust boundary lets a note or a session log point the receiver's `/goal` start prompt at a `goal.md` outside the repository.

## Files Reviewed

- `.skilled/hooks/session-handover/lib/relaunch-core.cjs:73-80` (`WORKTREE_LIST_TIMEOUT_MS`, `GIT_REPOSITORY_VARIABLES`), `:430-436` (`insideDirectory`), `:448-468` (`goalPacketProblem`), `:496-553` (`realPathOrNull`, `repositoryWorktrees`, `noteGoalRoot`), `:568-588` (`usableGoal`), `:906-960` (`logTailText`, `worktreeHeadlinePackets`), `:1354-1390` (`goalHeadlinePackets`), `:1501-1525` (`recordGoalPacket`), `:239-263` (`updateFrontmatter`), `:330-344` (`parseHandoff`)
- `.skilled/hooks/session-handover/bin/session-handover.cjs:383-425`, `:746-760`, `:844-900`
- `.skilled/bin/skilled-loop:447-515`, `:1234-1250`, `:1455-1465`
- `.skilled/hooks/session-handover/lib/goal-handover.cjs:60-140`
- Packet docs: `spec.md` section 6 (Risks & Dependencies), `implementation-summary.md` Key Decisions

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **The `goal_root` mitigation narrows the trust base but leaves it at "any directory git lists as a worktree", and the log-naming signal is model-influenced** -- `.skilled/hooks/session-handover/lib/relaunch-core.cjs:547-553` -- `noteGoalRoot` accepts any absolute path that `repositoryWorktrees` returns, and `worktreeHeadlinePackets:948-951` treats a worktree as named when the session log contains `${real}/`. Both signals are reachable without operator intent: `git worktree add` can place a worktree anywhere the user can write, and a model that echoes a path into a tool call writes it into its own session log. A note carrying that pair then reaches `renderGoalSlice`, which reads `goal.md` from the worktree and puts its `chat_slice` into the receiver's `/goal` start prompt. `spec.md:150` names this risk and prescribes exactly the mitigation that is implemented, so this is residual risk rather than a deviation; the containment check at `goalPacketProblem:453-462` still holds, so the slice can never come from outside the named worktree.
   Finding class: residual-risk
   Scope proof: the acceptance is at `:552`; the log-naming test is at `:948-951`; the render is at `goal-handover.cjs:104-118`; the containment check that still applies is at `:453-462`.
   Affected surface hints: `.skilled/hooks/session-handover/lib/relaunch-core.cjs` (`noteGoalRoot`, `worktreeHeadlinePackets`), `.skilled/hooks/session-handover/lib/goal-handover.cjs` (`renderGoalSlice`), `spec.md` section 6
   Case: a prompt-injected model runs `git worktree add /tmp/x` and `echo /tmp/x/`, then writes `goal_root: /tmp/x` and `goal_packet: specs/a/001-b` on the note with a `goal.md` it authored. The next Claude session starts on `/goal <that slice>`. The operator sees no warning, because the root is a listed worktree and the packet is contained inside it.

## Traceability Checks

| Protocol | Level | Status | Evidence |
|----------|-------|--------|----------|
| `spec_code` | core | pass | `spec.md:150` states the risk and the mitigation; `relaunch-core.cjs:547-553` implements the `git worktree list` gate and `:453-462` implements packet containment inside the root. The implementation matches the stated mitigation. |
| `checklist_evidence` | core | pass | `tasks.md` T003 and T004 are the tasks that carry this boundary; both are `[x]` and both are backed by the tampered-root test at `session-handover-cli.test.cjs:4060-4080`, which asserts that a `goal_root` outside the worktree list is dropped by `consume` and `claim`. |

## Integration Evidence

- `.skilled/hooks/session-handover/lib/goal-handover.cjs:104-118` runs `process.execPath` with a fixed `GOAL_CLI` path and `--workspace <root>` as separate argv elements, so the worktree path never reaches a shell.
- `.skilled/bin/skilled-loop:461` passes `roots: [goalRoot]`, which narrows the render to one checkout; `packetRoot:68` then refuses a packet that is not contained in it.
- `.skilled/bin/skilled-loop:1460` and `:1240` pass the root through quoted shell arguments (`"$(consumed_field goal_root)"`, `"$goal_root"`), so no word splitting or glob expansion applies.

## Edge Cases

- **Contradictory evidence resolved: `GIT_CONFIG_*` looked like an unstripped redirect vector.** `GIT_REPOSITORY_VARIABLES:74-77` strips seven variables but not `GIT_CONFIG_COUNT`, `GIT_CONFIG_KEY_n`, `GIT_CONFIG_VALUE_n` or `GIT_CONFIG_PARAMETERS`. A probe in a throwaway repository showed `GIT_CONFIG_COUNT=1 GIT_CONFIG_KEY_0=core.worktree GIT_CONFIG_VALUE_0=/tmp/wt-probe/evil git -C <repo> worktree list --porcelain` still lists only the repository's own worktree, and `GIT_CONFIG_PARAMETERS="'core.worktree'='/tmp/wt-probe/evil'"` likewise. The same probe showed `GIT_DIR=<other>/.git` does redirect the listing to another repository's worktrees, which is the vector the strip list exists for and which it does close. Adjudicated: the strip list is adequate for `worktree list`.
- **Ambiguity: a worktree path containing a newline.** `repositoryWorktrees:533-541` splits git's porcelain output on `\n`, so a path with an embedded newline is truncated and then fails `realPathOrNull`, and the entry is dropped. The two-line seeded protocol at `skilled-loop:511` therefore cannot be split by a hostile root. Fail-closed, recorded rather than raised.
- **Missing dependency: no test exercises a worktree the log names but the note does not.** The CLI tests cover a log-named worktree (`:3985`), a claimed-note root (`:4082`), and a rejected root (`:4060`); none covers a log-named worktree whose `goal.md` is a symlink out of the worktree. `goalPacketProblem:456-459` rejects that by realpath, so the gap is in test coverage, not in behavior.

## Confirmed-Clean Surfaces

- `goalPacketProblem:448-468` realpaths both the packet directory and `goal.md` and requires both inside the root, so a symlinked packet or a symlinked `goal.md` cannot escape the worktree.
- `insideDirectory:430-436` rejects the root itself, `..`, a `..`-prefixed relative path and an absolute relative path, so no prefix-matching escape exists.
- `repositoryWorktrees:513-543` passes `repoRoot` as a separate argv element with `shell` left at its default of false, so no shell metacharacter in a path is interpreted.
- `noteGoalRoot:549-551` rejects a relative, empty or unresolvable root before any git call, so a hand-edited note cannot widen the search to a relative path.
- `parseHandoff:338-343` splits each frontmatter line on the first colon and trims, so a `goal_root` value containing `: ` round-trips intact rather than being reinterpreted as a nested key.
- `claudeSessionLogPath:779` validates the session id against `/^[A-Za-z0-9._-]+$/` before building the log path, so the new `logTailText` read cannot be pointed at an arbitrary file.

## Ruled Out

- **`GIT_CONFIG_*` redirecting the worktree list.** Probed in a throwaway repository: `core.worktree` injected through `GIT_CONFIG_COUNT`/`GIT_CONFIG_KEY_0`/`GIT_CONFIG_VALUE_0` and through `GIT_CONFIG_PARAMETERS` leaves the listing unchanged. `GIT_DIR` does redirect it and is stripped at `:74-77`.
- **A symlinked `goal.md` inside a worktree pointing outside it.** `goalPacketProblem:457-459` realpaths the file and requires it inside the real root.
- **Shell injection through `goal_root`.** Every hop from the note to the subprocess passes the value as a quoted argument or a separate argv element (`skilled-loop:1460`, `:1240`, `goal-handover.cjs:104-118`).
- **Secret exposure through the new field.** `goal_root` is a filesystem path already visible to the operator and the model; `claim` and `consume` disclose nothing the session did not already know.
- **A `goal_root` of `/` or a home directory.** `repositoryWorktrees` returns only git-listed checkouts, so neither matches.

## Next Focus

- Dimension: traceability
- Focus area: `spec.md` REQ-001..REQ-005 and SC-001/SC-002 against the code and tests, `tasks.md` T001..T010 verify lines, and `implementation-summary.md` verification table and Known Limitations
- Reason: iteration 1 found the bounded-tail gap narrows REQ-001 and iteration 2 confirmed the security mitigation matches the spec; the remaining question is whether every packet claim is backed by the artifact it names
- Rotation status: security complete, rotating to traceability
- Blocked/productive carry-forward: productive -- the empirical probe settled a suspected gap; carry that habit of testing a claim rather than reading it into the traceability pass
- Required evidence: `file:line` or `path:line` for every claim, and an explicit `notApplicable` where a protocol does not fit
- Recovery note: not applicable

Review verdict: CONDITIONAL
