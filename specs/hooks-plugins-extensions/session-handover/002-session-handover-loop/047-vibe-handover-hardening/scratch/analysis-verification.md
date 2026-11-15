# Orchestrator checks of `analysis.md`

Citations opened by the orchestrator in worktree 418 on 2026-11-15, before the findings were shown to the operator.

- **F1, confirmed.** `.skilled/hooks/session-handover/bin/session-handover.cjs:609-617` prints "nothing ends this session" for `cursor`, `devin` and `vibe`, with a comment saying Vibe has no relaunch hook. `.skilled/hooks/session-handover/lib/nudge.cjs:248-252` tells the in-loop session "the loop ends this session". `vibeSessionFolder` is defined at `relaunch-core.cjs:827` and is not in `module.exports`.
- **F2, confirmed in code.** `vibe/handover-parts.mjs:321` passes one file from `newestJournalFile` to the killer. `lib/killer.cjs:142-148` stats that one path, and `DEFAULT_IDLE_MS` is 3000 at `:28`. `.skilled/hooks/session-lifecycle/vibe/turn-start.mjs:92-101` runs the hand-over part last. Vibe's fold at `_runtime.py:5274` requires a quiescent state. The live timings come from the run archive and were not re-measured.
- **F5, confirmed.** `vibe/handover-parts.mjs:78-81` treats any `parent_session_id` as a subagent, used at `:197` and `:298`. Vibe sets `parent_session_id=source_session_id` on fork and rewind at `_host.py:1293` and `:1453`.
- **F7, confirmed.** The failure branches at `vibe/handover-parts.mjs:314-343` return null with no deferred mark, and the withdraw at `:92-114` passes `pending: 'none'`.
- **Limit 5 refutation, confirmed.** The loc3 sender journal (`718d496c...`) holds the sender's own command `session-handover.cjs claim .skilled/skills/.state/session-handover/handoffs/zz-verify-claim.md --session verify-probe`.

Not checked by the orchestrator: F3, F4, F6, F8, F9 citations, and the Vibe source citations for steps 2 to 4 of the path.
