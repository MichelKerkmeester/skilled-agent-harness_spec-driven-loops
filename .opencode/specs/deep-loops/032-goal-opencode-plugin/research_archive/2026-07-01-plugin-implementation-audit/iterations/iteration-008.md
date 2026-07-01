# Iteration 008 — Test-Suite Coverage of the Code Tail & Command Namespace

## Focus

(Carried since iter 1) Examine the `mk-goal-*.test.cjs` suite (6 files in `.opencode/plugins/__tests__/`) — does it exercise the command *namespace* (`/goal` / `/opencode_goal`), and does it cover the unverified code tail (`mk-goal.js` L1510–1676: plugin factory hooks, event dispatch, `experimental.chat.system.transform`, tool registration, `__test` seam)?

## Actions Taken

1. Located the suite: 6 files under `.opencode/plugins/__tests__/` (`mk-goal-state`, `-export-contract`, `-lifecycle`, `-supervisor`, `-tool-path`, `-continuation`). No suite exists inside the packet spec folder.
2. Read 4 of 6 test files in full (`tool-path`, `continuation`, `supervisor`, `export-contract`) — the four that touch the tail region. (`state`/`lifecycle` test the helper bodies, not the factory hooks.)
3. Re-read the code tail `mk-goal.js` L1490–1676 (plugin factory `MkGoalPlugin`, `handleEvent`, transform hook, tool registration, `__test` seam) to build a line-by-line coverage map.

## Findings

### F-018 (P1) — The `experimental.chat.system.transform` hook is entirely untested
The core passive-injection feature — `experimental.chat.system.transform` (L1620-1623) → `appendGoalBrief` → `renderGoalInjection` — has **zero** test coverage. No test invokes the transform hook, and `renderGoalInjection`/`appendGoalBrief` are exported on `__test` but never called by any test. Combined with F-015 (iter 7: injection embeds the full `goal_prompt`), this is the single largest blind spot: the headline feature (goal brief injected into every chat turn) is unverified.

### F-019 (P1) — The plugin `event` handler swallows all errors silently
`event: async (input) => { try { await handleEvent(...) } catch { return; } }` (L1612-1617). Every exception inside `handleEvent` — `restoreActiveGoal`, `recordMessageUpdated`, `maybeVerifyGoal`, `maybeContinueGoal`, `setBlockedByPrompt` — is silently dropped with no log, no continuation-log entry, no metric. A failing verifier or atomic write inside `session.idle` would be invisible, masking F-016 (fsync error swallowing) and any runtime regression. No test exercises the error path.

### F-020 (P2) — The `__test` export contract is not key-pinned
`mk-goal-export-contract.test.cjs` asserts only that `default` is a function and `default.__test` is truthy (L16-18). It does **not** pin the 14 exported seam names (L1658-1674). A renamed/removed helper would pass. A `deepEqual(Object.keys(__test).sort(), [...14 names])` would close it.

### F-021 (P1) — The event-driven state machine is untested end-to-end
`handleEvent` (L1536-1609) wires 9 opencode events to durable/volatile state. Of these, only `session.idle` is exercised (supervisor test) — and only the verify sub-path (autonomy off). Untested branches:
- `session.created` → `restoreActiveGoal`
- `message.updated` → `recordMessageUpdated`
- `session.status` → `sessionStatuses` (tests inject `runtimeState` directly instead)
- `permission.asked`/`question.asked` → `setBlockedByPrompt(true)` (continuation test sets `blockedByPrompt` via `writeGoalAtomic` instead)
- `permission.replied`/`question.replied`/`question.rejected` → clear
- `session.deleted` → `flushVolatileLocks(sessionID)`
- `*.disposed` → `flushVolatileLocks()` (global)

Tests bypass the state machine by writing goal/runtime state directly, so the actual opencode integration surface — what determines whether the plugin works in a real session — has no coverage. This is why F-013 (session.idle→maybeContinueGoal w/ autonomy on) is also uncatchable here.

### F-022 (P2) — `mk_goal` tool is exercised only indirectly
`plugin.tool.mk_goal_status.execute` is called directly (supervisor), but `plugin.tool.mk_goal.execute` is never invoked; tests call the internal `__test.executeGoalAction` instead (tool-path). So the `mk_goal` tool's schema binding (`tool.schema.enum(GOAL_ACTIONS)`, `tokenBudget` nullable) is never validated through the real tool registration path — an asymmetry vs `mk_goal_status`.

### Definitive answers to carried questions
- **Command namespace**: **NOT exercised.** All 6 files test `mk_goal`/`mk_goal_status` tool execute paths + `__test` helper seams. None invoke `/goal` or `/opencode_goal`. The `opencode_goal.md` command spec (a markdown file) would only be exercised by an opencode runtime integration test, which does not exist. **The filename drift (F-008: opencode_goal.md → /opencode_goal vs intended /goal) is therefore invisible to the entire suite.** (Closes the iter-2/3/4/5/7 carried question.)
- **Code-tail coverage (L1510-1676)**: Partial. The *helper bodies* (`executeGoalAction`, `executeGoalStatus`, `maybeContinueGoal`, `maybeVerifyGoal`) are well-tested. The *factory hooks that bind them* (transform, event dispatch, tool registration, error swallowing, `flushVolatileLocks`) are NOT (see F-018/F-019/F-021/F-022). (Closes the iter-1/3/4/5/7 carried question.)

## Questions Answered

- [x] Do the `mk-goal-*.test.cjs` files exercise the command namespace? **No.** Tool/helper paths only.
- [x] Does the suite cover the unverified code tail (L1510-1676)? **Partially** — helper bodies yes; factory hooks (transform/event/tool-binding/error-swallow/flush) no.

## Questions Remaining

- (Carried) **F-018 deep-dive:** read `appendGoalBrief`/`renderGoalInjection` body to characterize the injection behavior and confirm F-015 (full goal_prompt embedded) + whether `options.enabled` gating + `maxInjectionChars` cap are honored.
- (Carried) **9 design forks formal pass** (iter 7 did 7/9; forks #2 keying, #3 store atomicity, #4 budget, #7 surfacing, #9 reuse deserve a formal close).
- (Carried) **F-003:** is `usage_limited` ever set in production paths (dead code)? Continuation test sets `budget_limited`, never `usage_limited`.
- (Carried) **F-014:** collapse `usage_limited` enum vs wire provider-cap detector — design decision.
- (Carried) Confirm opencode command-resolution rule for `.opencode/commands/*.md` → invocation string (refines F-008).
- (Carried) **F-013:** session.idle→maybeContinueGoal autonomy-enabled seam has zero coverage.

## Next Focus

Read the injection body (`appendGoalBrief` + `renderGoalInjection`) directly. F-018 makes this the highest-value untested surface, and it confirms F-015 (full goal_prompt in injection) plus whether the `enabled`/`maxInjectionChars` guards hold — feeding the design-fork #7 (surfacing substitute) formal close.

## Coverage Map (code tail L1498-1676 → tests)

| Code region | Lines | Covered? | By |
|---|---|---|---|
| `executeGoalStatus` wrapper | 1488-1496 | Yes | tool-path (`__test`), supervisor (`plugin.tool`) |
| `MkGoalPlugin` factory | 1513-1647 | Partial | — |
| `handleEvent` session.created | 1542-1545 | No | — |
| `handleEvent` message.updated | 1547-1550 | No | — |
| `handleEvent` session.status | 1552-1556 | No (direct inject) | — |
| `handleEvent` permission/question asked | 1558-1564 | No (direct write) | — |
| `handleEvent` permission/question replied | 1566-1572 | No | — |
| `handleEvent` session.idle (verify) | 1574-1591 | Yes (autonomy off) | supervisor |
| `handleEvent` session.idle (continue) | 1592-1597 | No (autonomy on) | F-013 |
| `handleEvent` session.deleted / .disposed | 1601-1608 | No | — |
| `event` `catch { return; }` | 1612-1617 | No | F-019 |
| `experimental.chat.system.transform` | 1620-1623 | No | F-018 |
| `tool.mk_goal.execute` | 1634-1636 | Indirect (`__test`) | F-022 |
| `tool.mk_goal_status.execute` | 1641-1643 | Yes | supervisor |
| `__test` seam keys | 1658-1674 | Truthy-only | F-020 |
