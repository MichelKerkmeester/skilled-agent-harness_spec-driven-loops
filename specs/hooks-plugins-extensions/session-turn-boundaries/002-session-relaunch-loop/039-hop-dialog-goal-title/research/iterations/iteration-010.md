# Iteration 10: Cross-check, final verdicts and ranking

## Focus

The close-out iteration. Reopen the citations behind the ten load-bearing findings of iterations 1 to 9 and say for each whether the cited line still says what the finding claims; correct anything that does not hold. Then give every open item of section 12 of the strategy file a verdict (CONFIRMED, REFUTED or UNCONFIRMED), rank the confirmed gaps by operator impact against cost with the smallest change and the test each needs, group them into candidate work packages, name which need an operator decision first, and name what is not worth building.

No runtime session was started. No `prepare`, `claim`, `keep`, `cancel` or `complete` command was run. No live hop was run. The only command beyond reads was the read-only packet report `node .skilled/hooks/goal/bin/goal.cjs packet specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop --workspace .`.

## Actions Taken

1. Read all nine earlier iteration files under `research/iterations/`, the strategy file (sections 6 to 11A and section 12), the config, and the tail of the state log.
2. Reopened the deciding code and document lines for the ten most load-bearing findings: the Claude name path, the wrapper name and Remote Control replay, the dialog guard, the parked-record escape, the goal fallback, the title strip, the Codex branch, the killer grace-period margin, the 002 parent budget and the binding parser.
3. Re-ran the read-only packet report and confirmed `packet_durable_chars=3993`, `packet_budget=ok`.
4. Also rechecked the two parent-level document items that the audit did not fold into the ten: the 033 status rows and the sk-git rebase sentence, plus the `prepare-commit-msg` branch that decides it.
5. Built the final verdict list, the impact-versus-cost ranking, the work-package grouping and the not-worth-building list below.

## Findings

### A. Citation audit: the ten load-bearing findings

| # | Finding (iteration) | Original anchor | What the line says now | Verdict |
|---|---|---|---|---|
| 1 | `prepare` resolves a Claude name from the transcript only (iter 1 F1) | `relaunch-core.cjs:619`, `:766`; `session-relaunch.cjs:592`; `context-usage.cjs:244`, `:250` | `claudeSessionLogPath` still scans `~/.claude/projects/*/<sessionId>.jsonl` [SOURCE: .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:619]; `resolveSessionSettings` still calls it [SOURCE: .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:766]; the ranking is still `settings.name \|\| SKILLED_LOOP_NAME \|\| settings.generatedName \|\| null` [SOURCE: .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:592]. The two title readers moved: `custom-title` is now at 247/249 and `ai-title` at 253/255, not 244/250 [SOURCE: .skilled/hooks/session-relaunch/lib/context-usage.cjs:247] [SOURCE: .skilled/hooks/session-relaunch/lib/context-usage.cjs:253]. | HOLDS, line anchors corrected |
| 2 | No Claude session-store reader exists (iter 1 F2; iter 9 F5) | `relaunch-core.cjs:619`, `:697` | The only `claudeSessionLogPath` is the transcript scan [SOURCE: .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:619]; the `sessions` path at 697 is the Codex rollout tree, and no `nameSource` reader appears in the name path. | HOLDS |
| 3 | The wrapper appends `--name "<stem> (n)"` and replays `--remote-control` with its optional value (iter 9 F1/F2) | `skilled-loop:417`, `:783`, `:590`, `:1080` | `append_name_arguments` still adds `--name "$SKILLED_LOOP_NAME ($((10#${SKILLED_LOOP_HOPS:-0} + 1)))"` [SOURCE: .skilled/bin/skilled-loop:417] [SOURCE: .skilled/bin/skilled-loop:421]; `claude:--remote-control` is still a replayed value option [SOURCE: .skilled/bin/skilled-loop:590] and an optional-value option [SOURCE: .skilled/bin/skilled-loop:1080]; the hop appends the replayed array at 776-777, not 783 [SOURCE: .skilled/bin/skilled-loop:776]. | HOLDS, replay anchor corrected |
| 4 | The Claude guard denies exactly when `armableRecord` reports `pending`, and matches `AskUserQuestion` only (iter 2 findings 1 and 5) | `subagent-guard.mjs:25`, `:65`, `:82`, `:117`; `relaunch-core.cjs:1133` | `QUESTION_TOOL = 'AskUserQuestion'` [SOURCE: .skilled/hooks/session-relaunch/claude/subagent-guard.mjs:25]; `pendingHandOver` still calls `armableRecord` [SOURCE: .skilled/hooks/session-relaunch/claude/subagent-guard.mjs:65] [SOURCE: .skilled/hooks/session-relaunch/claude/subagent-guard.mjs:78]; the pending test is now line 84, not 82 [SOURCE: .skilled/hooks/session-relaunch/claude/subagent-guard.mjs:84]; the guard still calls it at 117 [SOURCE: .skilled/hooks/session-relaunch/claude/subagent-guard.mjs:117]. `armableRecord` is still in `relaunch-core.cjs` [SOURCE: .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:1125]. | HOLDS, one anchor corrected |
| 5 | A record parked by a missing transcript, a missing target pid or an arm failure has no prompt escape; only the deferred state does (iter 2 finding 3) | `stop-arm.mjs:143`; `withdraw.cjs:26`; `context-nudge.mjs:63` | `markDeferred` is still called only inside the background-task branch [SOURCE: .skilled/hooks/session-relaunch/claude/stop-arm.mjs:143]; the withdraw policy keys on `record.deferredAt` at 27-28, not 26 [SOURCE: .skilled/hooks/session-relaunch/lib/withdraw.cjs:27]. The nudge still calls withdrawal without a policy, so the deferred default applies. | HOLDS, anchor corrected |
| 6 | A goal cleared by hand comes back through the no-goal-entry fallback (iter 3 finding 1) | `relaunch-core.cjs:560`, `:563`, `:653`, `:656`, `:601` | The fallback still returns the first settable ancestor [SOURCE: .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:656]; `packetGoalIsSettable` still reads only budget and an unticked box [SOURCE: .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:601]; `latestGoalLogEntry` still returns `{ latest, whole }` [SOURCE: .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:590]. The clear-entry branch itself was not reopened this iteration; the fallback half, which is the deciding half, is unchanged. | HOLDS (fallback half re-verified) |
| 7 | The title-ending strip is real for a name ending in the sender's own hop number (iter 3 finding 9) | `skilled-loop:286`, `:421` | `name_stem` still owns the strip [SOURCE: .skilled/bin/skilled-loop:286] and the hop still appends the receiver number [SOURCE: .skilled/bin/skilled-loop:421]. | HOLDS |
| 8 | The Codex branch returns no packet with a fixed reason (iter 4 F-004-003; iter 7 F2) | `relaunch-core.cjs:899`, `:902` | The reason is now line 902: `Codex keeps its goal where this hand-over cannot read a packet` [SOURCE: .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:902]. The branch still returns no packet. | HOLDS, anchor corrected |
| 9 | The grace-period flake is a 50 ms idle/timeout margin (iter 7 F1) | `killer.test.cjs:788`; `killer.cjs:180`, `:193` | `idleMs: 400` and `timeoutMs: 450` are still the test constants [SOURCE: .skilled/hooks/session-relaunch/tests/killer.test.cjs:787] [SOURCE: .skilled/hooks/session-relaunch/tests/killer.test.cjs:788]; the transcript branch still loops on `Date.now() < deadline` [SOURCE: .skilled/hooks/session-relaunch/lib/killer.cjs:180] and computes the remaining slice at 198, not 193 [SOURCE: .skilled/hooks/session-relaunch/lib/killer.cjs:198]. | HOLDS, anchor corrected |
| 10 | The 002 parent goal is 7 characters under its cap, the binding table ends at 036, and `extractBindingTarget` accepts exactly one path (iter 8 F1) | `goal.md:65`; `check-goal.cjs:165-174`, `:250-275` | The packet report still prints `packet_durable_chars=3993` and `packet_budget=ok`; the table row 036 is now line 81 [SOURCE: specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/goal.md:81]; the exception log is at 149 [SOURCE: specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/goal.md:149]; `extractBindingTarget` is still at 165 [SOURCE: .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs:165], used at 259 [SOURCE: .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs:259]. | HOLDS, table anchor corrected |

**Also rechecked for the parent-level verdicts:**

- Phase 033 still says `| **Status** | Draft |` in the parent [SOURCE: specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/033-research-remediation/spec.md:49] while child 001 says `| **Status** | Complete |` [SOURCE: specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/033-research-remediation/001-model-effort-atomic-replay/spec.md:23]. The mismatch holds.
- The sk-git sentence is unchanged: "A rebase keeps the id..." [SOURCE: .skilled/skills/sk-git/SKILL.md:322]. The hook still mints only when the replayed message lacks an id: `HAS_COMMIT_ID` is computed at 271/279, not 285-288 [SOURCE: .skilled/scripts/git-hooks/prepare-commit-msg:271] [SOURCE: .skilled/scripts/git-hooks/prepare-commit-msg:279], with `CHERRY_PICK_HEAD` at 125 [SOURCE: .skilled/scripts/git-hooks/prepare-commit-msg:125] and `MERGE_HEAD` at 129/135 [SOURCE: .skilled/scripts/git-hooks/prepare-commit-msg:129]. The doc defect holds.

### B. Corrections

No finding is reversed. Eight line anchors drifted by 1 to 9 lines, which is a citation correction, not a change of claim: `context-usage.cjs` 244/250 to 247/253; `subagent-guard.mjs` 82 to 84; `relaunch-core.cjs` 899 to 902; `skilled-loop` 783 to 776-777; `prepare-commit-msg` 285-288 to 271/279; `withdraw.cjs` 26 to 27-28; `killer.cjs` 193 to 198; the 002 binding table 65 to 81. Every claim survives its corrected anchor. The finding that the title strip loses only the same-number case, the finding that the fallback has no relation proof, and the finding that the app precedence is unconfirmed all remain as iterations 3 and 9 stated.

One nuance is worth recording: earlier iterations cited the Codex reason at both 899 and 902. Line 902 is the reason string; the branch begins just above it. The smaller citation is 899-903, and the finding is unchanged.

### C. Final verdicts for every section 12 open item

**Item 1, the mobile rename (four parts).**

- What a mobile rename writes: **UNCONFIRMED**. The vendor says a rename from claude.ai or the app "also updates the local title shown in `claude --resume`" (v2.1.221+) and the local store observed on this machine is `~/.claude/sessions/<pid>.json` with `name`, `nameSource`, `nameSince`, `bridgeSessionId` [SOURCE: https://code.claude.com/docs/en/sessions]. No local entry type or field records the client, so the mobile attribution needs Run B.
- Whether a `custom-title` entry reaches the log `prepare` reads: **CONFIRMED it can** for user-named bridged sessions on this machine, but the mobile path is UNCONFIRMED (iteration 1 F4).
- Why the name is lost on a hop: **CONFIRMED as a code gap**. `prepare` reads only the transcript [SOURCE: .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:619] [SOURCE: .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:592], so a store-only rename is invisible; a cloud-session rename writes no local file at all. The wrapper's replay of `--remote-control <old value>` may then outrank the carried `--name` in the app, which is **UNCONFIRMED** until Run B [SOURCE: .skilled/bin/skilled-loop:590] [SOURCE: .skilled/bin/skilled-loop:776].
- Test needed: a store-only-name unit fixture plus a precedence case, and the live Run B. **Verdict: CONFIRMED code gap, UNCONFIRMED mobile write path.**

**Item 2, 039 child 001 (four parts).**

- A pending record Stop cannot arm: **CONFIRMED**. The guard denies on any readable pending record, and the parked states (missing transcript, missing target pid, arm failure) lack `deferredAt`, so only `cancel` or a later successful Stop clears them [SOURCE: .skilled/hooks/session-relaunch/lib/withdraw.cjs:27] [SOURCE: .skilled/hooks/session-relaunch/claude/stop-arm.mjs:143].
- Other dialogs: **CONFIRMED for the inference**, with the code path proven. The guard matches `AskUserQuestion` only [SOURCE: .skilled/hooks/session-relaunch/claude/subagent-guard.mjs:25]. `ExitPlanMode` is PreToolUse-visible and holds the turn by the same mechanism; a permission prompt needs `PermissionRequest`, which the Claude `eventOrder` cannot render without a new event entry. Live observation is UNCONFIRMED.
- Unreadable record: **CONFIRMED**. A JSON error is logged and returns null, so the guard fails open and Stop does not arm; a parseable but shape-invalid record is treated as pending and can arm with no note. No guard or Stop test covers the paired behavior.
- Pi, OpenCode and Codex: **CONFIRMED**. All three have question tools and none is guarded today; Codex has a PreToolUse event to extend, OpenCode needs `tool.execute.before`, Pi needs a `tool_call` handler. No live behavior was observed.
- **Verdict: CONFIRMED.**

**Item 3, 039 children 002 and 003 (four parts).**

- A goal cleared by hand comes back two hops later: **CONFIRMED**. The clearing hop suppresses the goal; the next hop has no goal entry and the fallback picks the first settable ancestor [SOURCE: .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:656] [SOURCE: .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:601].
- A stale parent goal is picked: **CONFIRMED**. The fallback proves only budget plus an unticked box, not that the packet relates to the note's work; the walk can reach any ancestor [SOURCE: .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:656].
- A title ending in the hop number loses it: **CONFIRMED for the same-number case** [SOURCE: .skilled/bin/skilled-loop:286]; the frequency is UNCONFIRMED.
- The cost of one more log search: **CONFIRMED structurally**, numeric cost an estimate, not a measurement (iteration 3 findings 11 and 12).
- **Verdict: CONFIRMED.**

**Items 4 to 6, packet 038 limits by child.**

- Children 001 to 008: every limit has a verdict. **CONFIRMED**: 001 L1, 001 L2, 001 L3, 002 L1, 002 L2, 003 L1 (structural), 003 L2, 003 L3, 003 L4, 004 L2 (by design), 005 L1, 005 L2, 006 L1, 007 L2, 008 L1, 008 L2 (intentional), 008 L3. **REFUTED**: 004 L1 (basic claim path, by later live runs). **PARTIALLY CLOSED**: 007 L1 (later live evidence in the README).
- Children 009 to 013: **CONFIRMED**: 009 L1, 009 L2 (UNCONFIRMED live half), 009 L3, 010 L1, 010 L2, 010 L3, 011 L2 (history only), 012 L1 (Pi half open, OpenCode half closed), 012 L2, 013 L2, 013 L3. **REFUTED**: 009 L4 (closed by 017), 011 L1 (stale summary), 011 L3 (default mode is mapped). 013 L1 is a record, not a limit.
- Children 014 to 017: **CONFIRMED**: 014 L1 (process note), 014 L2 (intended rate), 014 L3, 015 L1, 015 L2 (structural), 015 L3 (declined), 015 L4, 016 L1 (evidence strength), 016 L2, 016 L3 (closed in code by 039/001, live residual), 016 L4 (fixture-specific), 017 L1, 017 L2, 017 L3. **REFUTED as a coverage gap**: 017 L4 (naming gap only).
- **Verdict overall: CONFIRMED, with the refuted and partially closed rows named above.**

**Item 7, packet level.**

- The killer test failure: **CONFIRMED in code** as a 50 ms idle/timeout margin; the exact one-off log is **UNCONFIRMED** because the sandbox and CI log are gone. The 013 spawn race is REFUTED as the current cause.
- Codex has no goal reader: **CONFIRMED**. `~/.codex/goals_1.sqlite` keeps `thread_goals` with no packet column, and the repo branch returns no packet by design [SOURCE: .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:902]. The smallest change is a documented limit, not a reader.

**Item 8, parent level.**

- The 002 parent binding budget: **CONFIRMED**. 3,993 characters with 7 to spare; 037 has no `goal.md`; two standard rows plus the section 3 cuts land exactly at 4,000, two compact rows plus the D1/D7 cuts land at 3,981 [SOURCE: specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/goal.md:81].
- Phase 033 status: **CONFIRMED mismatch**; the parent and its phase map say Draft while all nine children and the handoff criterion say Complete. The right status is Complete. A fresh `validate.sh` run is **UNCONFIRMED** because the research boundary forbids it.
- The sk-git `Commit-Id` rebase claim: **CONFIRMED as a doc defect**. The hook keeps an id only when the replayed message still carries it; the SKILL.md sentence is unconditional and wrong [SOURCE: .skilled/skills/sk-git/SKILL.md:322] [SOURCE: .skilled/scripts/git-hooks/prepare-commit-msg:271].

**Item 9, live proof and ranking.** **CONFIRMED.** The no-live-proof inventory and the five-run set stand: A (Claude, the three 039 fixes plus 016/L3, 008 and 012), B (Claude Remote Control, both mobile readings and the app title), C (Pi 002 and 015), D (OpenCode 005, 013 and 008), E (HS-8 and the late write if it occurs). The app title, the mobile write side and the `--name` versus `--remote-control <value>` precedence stay UNCONFIRMED until Run B. The ranking below is the final one.

**Item 10, this cross-check.** **Complete.** Ten citations reopened, all ten hold, eight anchors corrected, no finding reversed.

### D. Ranking of the confirmed gaps: operator impact against cost

Cost is the smallest honest closure, not a full feature. "Claude" means Claude-only; "wrapper" means the shared launch path; "all" means the relaunch core.

| Rank | Gap | Impact | Cost | Smallest change (file and function) | Test it needs | Runtime |
|---|---|---|---|---|---|---|
| 1 | App name after a hop: store-only rename invisible, and a replayed `--remote-control <old>` may outrank `--name` | High: the operator's reported symptom, and the app is the only surface they see | Medium: one live run plus a store reader and a replay-value rule | Add a `~/.claude/sessions/*.json` reader to `resolveSessionSettings` in `relaunch-core.cjs` (by `sessionId`, `nameSource === 'user'`, newest `nameSince`, below the transcript `custom-title`); rewrite or drop the value after a replayed `--remote-control` in the `skilled-loop` replay classifier when `SKILLED_LOOP_NAME` is non-empty | Fixture with a store-only name and a transcript with no `custom-title`; precedence case with both; wrapper test for the replay value; live Run B | Claude-only plus wrapper |
| 2 | 039/001 parked records, `ExitPlanMode`, permission prompts and the three other runtimes | High: one dialog can silently lose the hop at the context limit | Low for the Claude parked states; medium for `PermissionRequest`; high for three new host guards | Call `markDeferred` on the post-read parked paths in `armPendingRecord` (`claude/stop-arm.mjs`); accept `ExitPlanMode` in `pendingHandOver` (`claude/subagent-guard.mjs`) and the matcher; a `PermissionRequest` binding needs a new `eventOrder` entry | Guard test with a parked record plus a prompt that clears it; `ExitPlanMode` denial case; live Run A | Claude; Codex/OpenCode/Pi need separate guards |
| 3 | Cleared-goal resurrection | Medium-high: a finished goal is carried again two hops later | Low-medium: one note field, no new module or record key | Add a `goal_ended` note field written by `recordGoalPacket`, consumed by `session-relaunch.cjs`, and used by `claudeGoalPacketResult` to suppress the `whole` fallback; clear it when the sender has an active goal | Resolver test that calls twice (clear entry, then an empty log) and asserts the second carries nothing | Claude-only |
| 4 | Codex carries no goal packet | High for Codex users | High: the store has no packet column, so a reader cannot return a `goal_packet` | Document the limit; a convenience reader is a new Codex adapter helper, not a gap fix | None; schema is the evidence | Codex-only |
| 5 | Stale-parent fallback | Medium: a session can inherit an unrelated ancestor goal | Low: one call-site bound | Pass `lineage.slice(0, 2)` to `firstUsablePacket` in `claudeGoalPacketResult` (`relaunch-core.cjs:656`), or require the note headline to appear in the packet goal | Fallback test with an open grandparent and no immediate parent | Claude-only |
| 6 | 039/002 packet goal fallback has no live hop | Medium-high: the receiver should start on the right goal | Very low: Run A already built | No code change; run the sender-run hop with a `specs/demo/001-demo` goal that has one unticked criterion | Live Run A | Claude-only |
| 7 | 039/003 generated title and the title-number strip | Medium: the receiver should carry the generated name | Very low for the live proof; low for the strip guard | Require an exact `"$SKILLED_LOOP_NAME ($sender_number)"` match in `name_stem` before stripping (`skilled-loop:286`) | Wrapper test with an empty stem and a name ending in the sender's number; live Runs A and B | Wrapper (all runtimes) |
| 8 | Pi live name, bind-once and mode carry (012/L1, 002 L2, 015 L1/L4) | Medium: Pi can lose the live name or the Plan mode | Low-medium: one adapter read plus one live hop | Read the live name in the Pi arm and stamp the record; fall back to the carried-mode environment key in `liveSettings` (`pi/session-relaunch.ts`); run one `--plan` hop | Pi suite cases plus live Run C | Pi-only |
| 9 | `prepare` has no worker liveness check (009/L1) | Medium: duplicate work after a hop | Medium: a pid probe in a hot path | Probe the listed worker pids in `runningWorkersReason` (`bin/session-relaunch.cjs:421`) and refuse a stale `pid <n>` | `prepare` test with a dead pid and a live pid | All runtimes |
| 10 | Title older than the 16 MiB cap (012/L2) | Low-medium: an old `/rename` is lost on a very long session | Low-medium: a reverse chunk scan | Reverse-scan the two title entry types in `readClaudeSettings` (`lib/context-usage.cjs`) bounded by file size instead of `MAX_TAIL_BYTES` | Fixture with an early `custom-title` past 16 MiB | Claude-only |
| 11 | OpenCode child never reports an end (013/L2) | Low: a stuck child keeps the parent unarmed | Low: a timestamp and an expiry | Add a timestamp per tracked child and expire it in `hasBusyChild` (`opencode/session-relaunch.js`) | Fake child with no `session.idle`; assert the deferred arm runs | OpenCode-only |
| 12 | Pi mode flag used as another option's value (015/L2) | Low: no current Pi option takes a mode value | Low: keep value tokens separate | Separate value tokens from standalone flags in the `skilled-loop` replay filter and filter only standalone `--plan`/`--build` | Wrapper test with an option whose value is `--plan` | Wrapper (all runtimes) |
| 13 | Cron prompts absent from the record (014/L3) | Low: crons cannot be recreated if the note omits them | Low: one log line per cron | Log each entry's `schedule` and `prompt` (or a redacted label) at the `session-crons` line (`claude/stop-arm.mjs`) | Adapter test with two crons | Claude-only |
| 14 | Fan-out liveness races (010/L1, L2, L3) | Low-medium: false refusal, or two writers in one lineage | Medium: a start-time field or a child-written row | Record the kernel start time in the `spawned` row and compare it in `isLineageAlive` (`fanout-pool.cjs`); or have the lane write its own row; declare Windows unsupported | Pool tests with a recycled pid and a killed parent | Deep-loop runtime only |
| 15 | Two switch parsers (008/L3) | Low: future drift between nudge and `prepare` | Low: one shared helper | Move `switchNumber` into `relaunch-core.cjs` and have `numericSwitch` delegate (`bin/session-relaunch.cjs:135`) | Existing parser tests plus one shared-helper case | All runtimes |
| 16 | 002 parent binding table | Medium: the parent goal does not bind 038 or 039 | Very low: docs plus a 7-character budget | Add standard rows for 038 and 039, shorten D1/D7 (107) and criteria 1/4 (28); extend the 037 exception log | `goal.cjs packet` reports `packet_budget=ok`; `check-goal` passes | Docs |
| 17 | Phase 033 status | Low: closure reporting is wrong | Very low: metadata only | Parent `spec.md` status and nine phase-map cells to Complete; continuity and goal boxes to match | `validate.sh --strict` (UNCONFIRMED today) | Docs |
| 18 | sk-git rebase sentence | Low: a wrong doc can mislead a future rewrite | Very low: one sentence | Rewrite `SKILL.md:322` to the conditional rule: the id survives when the replayed message still carries it | None; hook tests cover the behavior | Docs |
| 19 | Killer grace-period flake | Low: one flaky test under load | Very low: one constant | `timeoutMs: 450` to `1000` at `killer.test.cjs:788` | Run `killer.test.cjs` under the hook suite's parallel load | Test-only |
| 20 | HS-8 helper link and 017/L4 naming (017/L3, L4) | Low: a playbook run can fail before the hop | Very low: a path and five names | Replace `ln -s` with `cp` in the HS-8 block, or run it once; name the five 013/015 cases in the Pi and OpenCode evidence lines | Live Run E; playbook run | Docs |
| 21 | `OPENCODE_DB` test coupling and the stale 011 summary (009/L3, 013/L3, 011 L1/L3) | Low: a red suite outside relaunch, and a wrong packet row | Very low: one environment line and two prose rows | Delete `OPENCODE_DB` from the fixture child environment; rewrite 011's two stale limit rows and continuity | OpenCode plugin suite; packet validation | Test and docs |

### E. Candidate work packages

- **WP-A, app-name continuity (ranks 1, 7, 10).** Store reader, replay-value rule, strip guard, tail-cap scan. Claude plus the shared wrapper. **Needs an operator decision first:** which source wins when the transcript `custom-title` and the store disagree, and whether a replayed `--remote-control <old value>` should be rewritten or dropped. Both are behavior choices, not mechanical fixes.
- **WP-B, hop-dialog safety (rank 2).** Parked-state `markDeferred`, `ExitPlanMode` matcher, shape validation, then per-runtime guards. Claude first. **Needs an operator decision first:** Claude-only or all four runtimes. The three new host guards are a materially larger phase than the two-line Claude fix.
- **WP-C, goal continuity (ranks 3, 5, 6).** Ending latch, fallback bound, and the Run A proof. Claude-only and D3-neutral. **Needs an operator decision first:** 039/002 recorded that the operator chose to skip finished goal documents rather than carry an ending, so the latch is a scope amendment; the fallback bound also changes which goal a session inherits.
- **WP-D, runtime coverage (ranks 4, 8, 11, 12).** Codex documentation, Pi name/mode, OpenCode child expiry, wrapper value-token split. Pi and OpenCode have live runs in the existing set. **Needs an operator decision first:** whether Codex gets a reader at all. The evidence says document it; a reader is a new feature with no packet to return.
- **WP-E, reliability residue (ranks 9, 13, 14, 15, 19, 21).** Liveness probe, cron logging, fan-out start time, shared parser, killer timeout, test environment. Mostly independent and small. **Needs an operator decision first:** only 010/L1's start-time field, because the operator already chose "refusal only, no override"; the rest are mechanical.
- **WP-F, docs and metadata (ranks 16, 17, 18, 20, 21).** 002 binding rows, 033 status, sk-git sentence, playbook naming/link, 011 summary. **No new operator decision**, but 033's completion claim needs a normal `validate.sh --strict` run outside the research boundary before the status is flipped.

### F. Not worth building, and why

- **A Codex goal reader as a gap fix.** `thread_goals` has no packet column [SOURCE: .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:902]; a reader can only copy the objective text the sender is already asked to put in the note. It is a convenience feature, and it should not enter `prepare` because there is no packet to return.
- **The descendant walk for 009/L1 or 015/L3.** ADR-002 declines it with the operator's answer and explains why a reparented worker is out of reach.
- **A live run to prove the late-write removal.** The race may not occur; the deterministic `test-finish-run.sh` is the negative control. A live run can fail to disprove it, not prove it.
- **Suppressing the repeating Stop notice.** The code confirms the intended rate, and silence would hide a long deferral.
- **New tests for 017/L4.** The Pi and OpenCode suite commands already run the files that hold the 013 and 015 cases; the gap is the names in the evidence lines.
- **A product fix for 009/L3 and 013/L3.** Both are one test's inherited `OPENCODE_DB`, not a relaunch defect.
- **A grouped binding row for 037, 038 and 039.** `extractBindingTarget` accepts exactly one target; a grouped cell returns null [SOURCE: .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs:165].
- **A 037 binding row pointing at a missing file.** It silences `check-goal` without binding a goal; 037 has no `goal.md` [SOURCE: specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/goal.md:149].
- **Reading the store name regardless of `nameSource`.** It would carry the derived title above the launch name.
- **Widening prompt withdrawal to `pending: 'any'`.** It would withdraw a hand-over the same turn just prepared.
- **A code change for 016/L4.** The suppressing goal is a test fixture, not a packet goal; the real fix, if ever needed, is the named claim-line ordering change.
- **More 016 live runs as proof.** They add samples, not a proof of the skip rate.

## Questions Answered

No strategy key question remained. This iteration answered the close-out: the ten load-bearing citations were reopened (all hold, eight anchors corrected), every section 12 item has a final verdict, and the confirmed gaps now have a ranking, a smallest change, a test and a runtime scope, grouped into six work packages with the operator decisions named.

## Questions Remaining

- The live evidence remains uncollected: the mobile write side, the app title, the `--name` versus `--remote-control <value>` precedence, the Pi Plan receiver, the OpenCode deferred arm, and the late write. That is the operator's Run A to Run E.
- Two completion claims still need a normal-boundary command: `validate.sh --strict` for phase 033 and the packet, and the killer test under the suite's parallel load.

## Next Focus

None. This was iteration 10 of 10. The next step belongs to the operator: choose the work packages, decide the four behavior questions (name precedence, dialog scope, goal-ending amendment, Codex reader), and run the five live checks.

## Assessment

- New information ratio: 0.6. The ten reopened citations all held, so the substance is consolidation; the eight corrected anchors, the final verdict matrix, the ranking, the six packages and the no-build list are new synthesis.
- Questions addressed: the section 12 cross-check, all items.
- Questions answered: the cross-check. The live-evidence gap is unchanged and named.

## Reflection

- **What worked and why:** reopening the exact lines instead of trusting the iteration prose caught eight drifted anchors without reversing any finding. Running the budget report again made the 7-character claim command evidence rather than a remembered number.
- **What did not work and why:** the audit could not recover the failed killer run's log or prove the mobile write from local logs; both were already known dead ends, and the audit confirms they stay live-run questions.
- **What I would do differently:** cite a function name beside every line number in future iterations, so a later audit can find the code even when the line count moves.

## Scope Violations

None. All writes landed in the iteration and delta paths; the research targets were read-only. No runtime session, relaunch command or live hop was run.
