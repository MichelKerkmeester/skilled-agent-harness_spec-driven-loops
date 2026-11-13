# Verified findings for phase 003-goal-resolver-prepare

Source: `../scratch/verify-1.md` in the parent packet, written by the verifying reviewer on 2026-11-12. This file is the brief for this phase. The work package comes first, then each finding it covers.

## Work package

3. **WP3. The goal resolver and prepare output** (F4, F7, F6, F1 signal half, N6)
   - Files: `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs`, `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs`, `tests/relaunch-core.test.cjs`, `tests/session-relaunch-cli.test.cjs`.
   - Must fail first: devin and cursor with a uuid and the variable set give the packet; a free-text goal and a codex prepare each print one stderr reason; a unique headline outside the tree is found; the cursor and devin prepare text is the manual one.
   - Guard tests that must keep passing: claude, codex, pi and opencode give `''` with no record; stdout stays unchanged.

## Findings

### F4. Cursor and Devin drop the goal at the next handoff
- **Evidence.** `handoff.md:35` and `:72` (use `uuidgen`). The receiver hooks bind under the native id (`devin/goal-inject.mjs:65-71`, `cursor/goal-inject.mjs:73-83`). The record key hashes the session id (`goal-core.cjs:228-232`). X3: `devin` and `cursor` resolve the packet with the native id and give `""` with a uuid. Neither runtime has a relaunch hook (`.devin/hooks.v1.json` and `.cursor/hooks.json` register only `goal-inject.mjs`), so every hop is manual. A second manual claim gets no packet.
- **Refutation attempt.** The model can see the native id only inside the resend reminder (`devin/goal-inject.mjs:79-81`), and only while a resend is pending. Nothing tells it to use that id.
- **Verdict.** CONFIRMED. P2, since these are manual-only runtimes.
- **The fix.** Right idea. Put it in `resolveGoalPacket` (`relaunch-core.cjs:761`) rather than the CLI wrapper, so `keep` gets it too. Only for `devin` and `cursor`, only when no record matches, and only when `env.SESSION_RELAUNCH_GOAL_PACKET` passes `goalPacketProblem`. It must stay off for `claude`, which also inherits the variable (`skilled-loop:1202`), and for `codex`. The risk is low, because those runtimes have no command that can complete or clear the record anyway.
- **Tests.** `relaunch-core.test.cjs`: devin and cursor with an unknown id and the variable set give the packet (fails today). Claude, codex, pi and opencode with the variable set and no record give `''` (passes today, a guard).

### F7. Silent loss
- **Evidence.** `session-relaunch.cjs:389-403` returns nothing and prints nothing. `resolveGoalPacket` collapses every failure to `''`.
- **Verdict.** CONFIRMED, P3.
- **The fix.** Do not change `resolveGoalPacket`'s return type, since tests and three callers rely on it. Add a sibling that reports why, or return the reason through an out parameter, and print on stderr, because prepare stdout is pinned at `session-relaunch-cli.test.cjs:394`.
- **Tests.** `session-relaunch-cli.test.cjs`: a Claude free-text goal gives one `goal not carried:` stderr line, while stdout is unchanged (fails today).

### F6. Goal dropped outside the packet tree
- **Evidence.** `relaunch-core.cjs:617-632`. X2: a hop-two receiver with an empty spec folder gives `""`. Scope check over the real tree (`verify/hop2-headline.cjs` and an inline count): of the 104 non-scratch packets with `packet_budget=ok`, 43 slices contain their own `specs/...` path, so the `named` branch finds them wherever the session works. 61 do not, and those are dropped.
- **Verdict.** CONFIRMED with a narrower scope. The report's line "a template slice does not name its own path" is true for 59%, not all. P3: the common case, working a child of the goal's packet, is found through the lineage.
- **The fix.** A bounded search must take a match only when exactly one `goal.md` matches. There are 1,319 `goal.md` files under `specs/`, including review fixtures whose headline is `## DIRECTIVE`. Skip `scratch/`, `lineages/` and `z_archive/`, and if no single match exists, fall back to the F7 reason line.
- **Tests.** `relaunch-core.test.cjs`: spec folder `none` with a goal headline unique to one packet gives that packet, and two packets sharing the headline give `''` (the first fails today).

### F1. Codex loses its goal
- **Evidence.** `relaunch-core.cjs:761-774`: only `GOAL_RECORD_RUNTIMES` and `claude` resolve, so Codex falls through to `''`. Nothing in `session-relaunch.cjs:389-403` prints anything. The README states it as design at lines 171 and 184 ("The seed instruction waits for a Codex goal reader").
- **Refutation attempt.** I looked for a Codex reader anywhere. There is none, and `goals_1.sqlite` could not be opened read-only from this sandbox (`unable to open database file (14)`). Codex does hop automatically, so the loss happens on every Codex hop that has a goal.
- **Verdict.** OVERSTATED. P0 is wrong for a documented limitation that is not a regression. P2.
- **The fix.** The signal half is right. Print it on stderr rather than stdout, because `session-relaunch-cli.test.cjs:394` pins the prepare stdout. The seed half ("read the bound packet's goal.md") cannot work, because a Codex note never carries `goal_packet`. A version that can work: in `handoffText` (`nudge.cjs:118-201`), for `runtime === 'codex'`, ask the sender to name its goal, or its packet path, on an `Active goal:` line under In-flight state. In `seedText`, have the receiver bring it back the way Codex sets goals (`create_goal`, per README:184). This is prose only, and it changes neither the note format nor the record format.
- **Tests.** `session-relaunch-cli.test.cjs`: a codex `prepare` prints one `goal not carried` line on stderr (fails today). `nudge.test.cjs`: the codex `handoffText` contains the `Active goal:` request (fails today).

**N6. On Devin and Cursor, prepare says the loop will end the session, but nothing arms** (P3, confirmed)
- **Evidence.** `session-relaunch.cjs:567-571` prints the same text for every runtime. Neither runtime registers a relaunch hook. Only the wrapper's `not-armed` decline at exit prints the manual command.
- **Smallest fix.** For `cursor` and `devin`, print "nothing ends this session; exit it and run the claim command the wrapper prints". The text is pinned at `session-relaunch-cli.test.cjs:394`, so add a runtime case there.
