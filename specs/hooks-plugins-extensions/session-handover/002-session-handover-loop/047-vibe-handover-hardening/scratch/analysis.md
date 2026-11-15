# Analysis: Mistral Vibe session handover

Author: Fable 5.2 at high effort, read-only. Saved verbatim by the orchestrator because the harness refused the subagent's own write. Citation checks by the orchestrator are in `analysis-verification.md`.

Read-only analysis. Nothing was built and no live Vibe or model session was started.

**Bottom line.** No P0 was found: every recorded live hop completed. The Vibe path is unreliable in two places that Claude Code's path is not. `prepare` tells a Vibe session that nothing will end it, which contradicts the nudge and cost the deepseek-flash sender 76 s and a self-claim of its own note. And the killer's idle watch is inert on Vibe, so the only guard against ending a turn the operator just started is a withdraw that runs last in a hook chain measured at up to 3.26 s against a 3 s killer.

**Path shorthand.** `H` is `.skilled/hooks/session-handover`. `L` is `.skilled/hooks/session-lifecycle/vibe`. `V` is the installed Vibe 3.1.2 at `~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages`. `VH` is `V/mistralai_vibe_local_harness/vibe`. `ARCHIVE` is `~/046-live-runs-raw-backup-2026-11-15.tar.gz`, read from a scratch extract.

**Evidence labels.** OBSERVED means read in code or in a recorded journal or log. DERIVED means it follows from something observed, with the step shown. INFERRED means plausible and unverified, with what would confirm it.

**Baseline.** `node --test .skilled/hooks/session-handover/tests/*.test.cjs` ran before the analysis: 1009 pass, 0 fail, exit 0.

---

## 1. How the Vibe path works

1. `skilled-loop vibe` exports `SKILLED_LOOP_ID=$$` and `SKILLED_LOOP_RUNTIME` (`.skilled/bin/skilled-loop:1209-1210`) and runs the runtime as its child (`:1249`).
2. The `vibe` launcher execs the Rust binary in place (`V/vibe/cli/launcher.py:74`), which starts `vibe-app-server` as its child. Hooks and tool shells are children of the app-server (process tree observed on a live idle Vibe).
3. Hooks get the session id only on stdin: `session_id`, `transcript_path` (the session folder), `cwd`, `parent_session_id` (`VH/_foreign_hooks.py:275-285`). `pre_agent` adds `agent_name`, `turn_id`, `prompt` (`:936-946`).
4. Tools get no session id. The tool environment adds only `VIBE_SESSION=1` (`V/vibe/core/utils/shell.py:10,68-75`, `V/vibe/app_server/_runtime.py:2250-2256`). Hooks inherit the environment unchanged (`VH/_foreign_hooks.py:480`).
5. `.vibe/hooks.toml` registers `turn-start` on `pre_agent` for `main` (`:15-20`), `turn-end` on `post_agent` for `main` (`:25-30`) and `compaction-post-tool` on every `post_tool` (`:124-128`).
6. `turn-start.mjs` runs its parts one after another with the hand-over part last (`L/turn-start.mjs:92-101,125-139`). `compaction-post-tool.mjs` calls the same part after each tool (`L/compaction-post-tool.mjs:66-73`).
7. The part is `buildHandoverContextPart` (`H/vibe/handover-parts.mjs:186-272`). It returns nothing for a payload with a `parent_session_id` (`:197`, `:78-81`).
8. A relaunch seed prompt gets the claim instructions and nothing else (`:199-207`).
9. Any other `pre_agent` prompt withdraws an armed hand-over, with pending records excluded by `pending: 'none'` (`:209`, `:92-114`).
10. Fill is the last non-summarizer `input_tokens` in the newest journal segment that has one (`H/lib/context-usage.cjs:368-394`). The window is the `compaction_threshold` of the current generation (`:398-410`, `:431-434`).
11. `nudgeDecision` decides (`handover-parts.mjs:227-241`, `H/lib/nudge.cjs:693-742`). A nudge writes the level (`:251-255`) and returns the handoff text, which ends with "Stop once it exits 0; the loop ends this session" (`H/lib/nudge.cjs:247-252`).
12. The model writes the note and runs `prepare --handoff … --session <real id> --runtime vibe`.
13. `prepare` checks the flag and the note (`H/bin/session-handover.cjs:542-549`), runs the shell-child guard (`:557`), writes the pending record (`:587-602`) and prints its outcome line (`:611-616`).
14. At turn end `turn-end.mjs` runs the completion part, the ask-surface part, then the hand-over part. A deny from an earlier part returns before the hand-over part runs (`L/turn-end.mjs:62,86-99`).
15. `armHandoverTurnEnd` (`handover-parts.mjs:286-369`) requires a pending record for this exact session id (`:310`, `H/lib/relaunch-core.cjs:1466-1479`).
16. It picks the journal segment with the newest mtime (`:321`, `:116-148`), finds the loop's direct child pid (`:336-343`, `relaunch-core.cjs:2235-2252`), arms (`:345-352`) and spawns a detached killer (`:354-360`, `:155`).
17. Detachment is load-bearing: Vibe SIGKILLs the hook's process group once the hook exits (`VH/_foreign_hooks.py:455-459`, `VH/_sandbox_helper.py:2349-2364`).
18. The killer waits for the one watched path's mtime to sit unchanged for 3000 ms (`H/lib/killer.cjs:28`, `:163-202`), stamps the record and sends SIGTERM (`:779-796`).
19. The wrapper asks `should-relaunch` (`skilled-loop:1255`), tells the killer's signal from an operator interrupt (`:1321-1330`), consumes the record (`:1331`) and builds the seed (`:1380-1381`).
20. The relaunch passes the seed as the only prompt (`:813-818`) plus replayed launch flags (`:823-833`). `--model`, `--resume`, `-c`, `-p` and `--worktree` are never replayed (`:714-715`).
21. The receiver's `pre_agent` sees the seed (step 8) and runs `claim` with its own real id. `claim` prints the note body and a History Lookup section (`session-handover.cjs:692-735`).
22. The section comes from `handoverLookupSection` (`relaunch-core.cjs:1049`) and `mintHandoverLocator` (`:915`), which resolve the sender's session folder (`:827-839`) and working folder (`:1021-1032`). The store root is `H/history/lib/cli.ts:299-303`.

---

## 2. Recorded limits: verdicts

**Limit 1. A typed `/speckit-handoff` does not arm. CONFIRMED, and the stated cause is only half right.**
OBSERVED: tools receive no session id (step 4). The command doc tells Vibe to run `uuidgen` (`.skilled/commands/speckit/handoff.md:35,81`). The arm refuses a record whose session id differs from the hook payload's (`relaunch-core.cjs:1470`). The half that is wrong: hooks do receive the real id on every call (step 3), so the framework can hand it to the CLI. See F4.

**Limit 2. The killer might signal during a slow model call. PARTLY CONFIRMED, and the mechanism is different from the recorded one.**
OBSERVED: no Vibe code path was found that starts a model call after `post_agent` without a new turn, so the recorded scenario was not found. What was found is worse in one respect: the watch never sees a new turn at all. See F2. Whether the journal stays quiet for three seconds during a streaming model call is UNKNOWN.

**Limit 3. Parallel `post_tool` hooks might nudge twice. CONFIRMED in code, not observed live.**
OBSERVED: Vibe runs actions as concurrent tasks (`VH/_local_actions.py:535-537`, `VH/_runtime.py:2916`). The nudge level is read and written without a lock and without an atomic write (`H/lib/nudge.cjs:764-803,824-826`). The two nudges in the loc3 run were the two designed levels, not a duplicate. See F6.

**Limit 4. An exported `MISTRAL_API_KEY` overrides the keychain plan key. CONFIRMED.**
OBSERVED: a truthy environment value wins and the keyring is not even read (`V/vibe/utils/api_keys.py:75-89,117-122`). The dispatch skill documents it (`.skilled/skills/cli-external-orchestration/cli-mistral-vibe/SKILL.md:97`). `skilled-loop vibe` has no check. See F9.

**Limit 5. The sender's journal held the receiver's claim output, cause unknown. REFUTED as an anomaly. The cause is known.**
OBSERVED in `ARCHIVE`, loc3 sender journal: at sequence 815 the sender itself ran `cp <its note> …/zz-verify-claim.md` and then `claim …/zz-verify-claim.md --session verify-probe`. Sequence 817 is the result of that command. Sequence 878 removes the copy. The handle matched the receiver's because a handle is a hash of the sender's identity alone (`H/history/lib/locator-digest.ts:29-40`), so anyone claiming a copy of that note prints the same handle. Vibe did not leak output between sessions. The sender ran the probe because of F1.

---

## 3. Findings

### F1. `prepare` tells a Vibe session that nothing ends it (P1)

- **Evidence, OBSERVED in code.** `session-handover.cjs:611-616` prints "handoff prepared; nothing ends this session. Exit it and run the claim command the wrapper prints." for `cursor`, `devin` and `vibe`. The comment at `:608-610` says Vibe has no relaunch hook. That stopped being true when the `post_agent` arm landed (`.vibe/hooks.toml:25-30`, `handover-parts.mjs:286`). The nudge that led the model here says the opposite (`nudge.cjs:249-252`).
- **Evidence, OBSERVED live.** `ARCHIVE` loc3 (deepseek-flash): `prepare` at sequence 222, its result at 224 carries the line above. The sender then made about 20 more tool calls: it grepped for "nothing ends this session" (521, 542), read the `prepare` code (563), hunted the relaunch record and finally claimed a copy of its own note (815). The turn completed at 16:19:05.604Z. `prepare` logged at 16:17:52.188Z and the killer signalled at 16:19:08.687Z, so 76.5 s passed after `prepare` and 3.08 s after the turn ended.
- **Contrast, OBSERVED live.** loc2 (GLM) obeyed the nudge over the message: `prepare` 16:15:43.281Z, signal 16:15:50.499Z, 7.2 s.
- **INFERRED.** The "twelve more tool calls" and 38.7 s recorded as limit 2 of phase 045 have the same cause. The 045 raw run was not re-read.
- **Side effects.** A confused sender burns context at the moment it has least. The self-claim also wrote a `claimed` row into hop history (`session-handover.cjs:705`). A sender that obeyed the message literally and tried to exit would break the hop. That last case is INFERRED, never seen.
- **Coverage gap.** The message test covers `cursor` and `devin` only (`H/tests/session-handover-cli.test.cjs:2563-2584`). `H/README.md:63` names only Cursor and Devin for this message.
- **Fix.** Print the stop-now line for Vibe when the session id names a real Vibe session folder, which is exactly the case the turn-end hook can arm. A `uuidgen` id keeps the manual line, which is true for it. Export `vibeSessionFolder` (`relaunch-core.cjs:827`, not exported today) and use it in the condition at `:611`. About 8 lines in 2 files, one test of about 25 lines, one README sentence.

### F2. The killer's idle watch is inert on Vibe and the withdraw runs last (P1)

- **Evidence, OBSERVED in code.** The adapter hands the killer one segment file, the newest at hook time (`handover-parts.mjs:321`). The killer stats that one path (`killer.cjs:142-148`). Vibe folds the journal at every idle point and opens a new numbered segment per generation (`VH/_runtime.py:5250-5288`, quiescent check at `:5274`, `VH/_storage.py:2495`).
- **Evidence, OBSERVED live.** loc3 sender: `post_agent` hook intent at sequence 893, accept at 896, turn completed at 898, fold to a new generation at 899. The signal came 3.08 s after the turn completed.
- **DERIVED.** After the fold, every later write goes to a new segment the killer does not watch. The watched file can only go quiet. On Vibe the killer is a fixed timer of about three seconds, not an activity watch.
- **Evidence, OBSERVED live.** The only other guard is the `pre_agent` withdraw, and it runs last in a sequential chain (`L/turn-start.mjs:92-101`). `pre_agent` chain durations from journal timestamps: 0.41 s, 0.46 s, 0.60 s and 3.26 s. A separate `spec-gate-classify` hook is registered ahead of it (`.vibe/hooks.toml:7-10`).
- **INFERRED.** A prompt that starts a turn inside the three seconds, such as a queued message, can lose the race. The killer then ends a turn the operator just started and the prompt is lost. Not seen live. Whether a cron, peer or background trigger starts a turn without firing `pre_agent` is UNKNOWN. If one does, nothing withdraws.
- **Second hazard, INFERRED, P2.** Vibe keeps two generations (`VH/_storage.py:159`). Local sessions showed a second fold 9 s and 34 s after the turn-end fold. A watched segment that is deleted reads as missing, and after a 1000 ms grace the killer gives up with a timeout record (`killer.cjs:23,185-187`, `:698-705`). This needs a killer still waiting after two folds, which the three-second timer makes unlikely today and a longer idle window would make likelier.
- **Fix, two parts.**
  1. Run the withdraw first. Export a withdraw step from `handover-parts.mjs` and put it at the head of `PARTS` in `L/turn-start.mjs`, with the hand-over part reading the result to print the withdrawn notice. About 25 lines in 2 files plus one ordering test.
  2. Watch the journal folder. Let `transcriptMtime` accept a directory and return the newest mtime among numbered segments, and pass `<transcript_path>/journal`. About 12 lines in `killer.cjs`, 2 in the adapter, one test. This also removes the deleted-segment hazard.
- **Limit of the fix.** Part 2 only helps if a running turn writes to the journal at least every three seconds, which is UNKNOWN for a streaming model call. Part 1 is the part that closes the race. If the chain time sits in `spec-gate-classify` and not in `turn-start`, part 1 needs its own first `pre_agent` hook entry instead, which is about 20 lines in 2 files.

### F3. The Vibe compaction part does not match Claude's or Codex's (P2)

- **Evidence, OBSERVED in code.** Claude and Codex reset the nudge level after a compaction (`H/claude/compact-pointer.mjs:198-202`, `H/codex/compact-pointer.mjs:79-83`). The Vibe compaction part never calls `writeState` (`L/compaction-context.mjs:199-256`).
- **DERIVED.** A Vibe session that spent both nudge levels and then compacted is never nudged again when the context refills, because the level stays spent (`nudge.cjs:737-741`).
- **Evidence, OBSERVED in code.** Claude prints no claim pointer while a hand-over is pending and prints a stale-note text after a withdraw (`compact-pointer.mjs:204-218`). Vibe's `handoffSection` always prints "Claim it with" (`L/compaction-context.mjs:155-167`).
- **INFERRED.** A Vibe sender that compacts between `prepare` and its turn end is told to claim its own note, which leaves the receiver nothing to claim. Not seen live.
- **Fix.** Reset the level and add the two guards in `compaction-context.mjs`. About 12 lines in 1 file plus two tests.

### F4. A typed `/speckit-handoff` cannot arm or carry a History Lookup section (P2)

- **Evidence.** Limit 1 above. The History Lookup section also needs the real id, because the locator resolves `logs/session/unified/<id>` (`relaunch-core.cjs:827-839`).
- **Fix.** The `pre_agent` hook already holds the real id. Persist it under the state directory keyed by loop id, let `sessionIdFor` (`session-handover.cjs:358-368`) read it for `vibe` when `--session` is absent, and change the two `uuidgen` lines in `handoff.md:35,81` to say Vibe under the loop omits the flag. About 40 lines in 3 files plus tests.
- **Risk.** A rewind or fork changes the session id mid-loop, so the write must happen at `pre_agent`, not only at session start.

### F5. A forked or rewound main session is treated as a subagent (P2)

- **Evidence, OBSERVED in code.** Vibe's fork and rewind set `parent_session_id` on a main session (`VH/_host.py:1293,1453`). A fork still answers to the `main` hook alias (`VH/_hook_matcher.py:18-19,48-50,142-149`), so the hooks fire. The adapter then drops every payload with a parent (`handover-parts.mjs:197,298`).
- **DERIVED.** After a fork or rewind inside a looped session, the nudge, the withdraw and the arm are all silent for the rest of that session.
- **INFERRED.** That the hook payload's `parent_session_id` is populated from that metadata after a rewind. A payload capture after one rewind would confirm it.
- **Fix.** Skip the parent check for `pre_agent` and `post_agent`, where `match = "main"` already excludes subagents, and keep it for `post_tool`, which is unscoped. About 6 lines in 1 file plus two tests.

### F6. Concurrent `post_tool` hooks can nudge twice, with two note paths (P2)

- **Evidence.** Limit 3 above. Also OBSERVED: the planned note name carries a one-second stamp (`nudge.cjs:475-479`).
- **DERIVED.** Two hooks that straddle a second boundary name two different notes, so the cost can be two notes and not only one repeated message.
- **Fix.** Claim the level with an exclusive create or a lock before the text is returned. About 15 lines in `nudge.cjs` plus one test that runs two decisions against one state file.

### F7. A failed arm leaves a pending record that the next prompt cannot withdraw (P2)

- **Evidence, OBSERVED in code.** Every failure branch in `armHandoverTurnEnd` returns with the record still pending and unmarked (`handover-parts.mjs:314-343`). A refused `armableRecord` is not logged (`:310-312`). The Vibe withdraw excludes pending records (`:101`). Claude marks a parked record deferred so the next prompt withdraws it (`H/claude/stop-arm.mjs:53-59,138-242`).
- **DERIVED.** After a failed arm the operator's next prompt carries on, no nudge fires because the record still counts as pending (`nudge.cjs:558-575`), and the next turn end arms the old record. The relaunch then starts from a note that predates the latest work.
- **INFERRED.** The same path opens if `post_agent` does not fire for an interrupted turn. Whether it fires is UNKNOWN.
- **Fix.** Call `markDeferred` on each failure branch, change the withdraw policy to `deferred`, and log the refusal reason. About 15 lines in 1 file plus tests.

### F8. The shell-child guard cannot see Vibe's tool shells (P2)

- **Evidence, OBSERVED in code.** The guard looks for a live shell whose parent is the loop's runtime pid (`session-handover.cjs:270-283,285-310`).
- **DERIVED.** On Vibe that pid is the Rust front end and tool shells are children of the app-server (step 2), so the guard never matches. A long-running tool shell is not protected from the hop.
- **Fix.** Not sized. The fix needs a process-table capture from a live Vibe turn first, because a persistent tool shell would make a naive descendant check refuse every `prepare`.

### F9. The wrapper does not warn about an exported `MISTRAL_API_KEY` (P2)

- **Evidence.** Limit 4 above. The receiver inherits the wrapper's environment, so a hop under a non-plan key lands in a session whose first model call can fail with HTTP 402.
- **Fix.** One warning line to stderr in `skilled-loop` when the runtime is `vibe` and the variable is set. About 5 lines in 1 file plus one shell test. A warning, not a refusal, because an operator may want the API budget.

### Smaller parity gaps against Claude Code (P2, listed, not sized)

- No nested-loop drop. Claude calls `dropNestedLoop` (`stop-arm.mjs:106`). Vibe does not, and Codex does not either.
- No question-dialog hold. `questionHoldReason` exists (`nudge.cjs:589-610`) and no Vibe hook calls it. Under `--agent auto-approve` the question tool answers itself, which phase 043 recorded.
- No model, effort or name carry. `resolveSessionSettings` has no Vibe branch (`relaunch-core.cjs:1097-1122`) and the wrapper never replays `--model` (`skilled-loop:813-818`).
- The arm shares one 20 s `post_agent` timeout with two earlier parts (`.vibe/hooks.toml:29`, `L/turn-end.mjs:62`).

---

## 4. Ranked fixes

1. **F1, the `prepare` message.** Proof: extend the manual-route test in `session-handover-cli.test.cjs` with a Vibe row that has a session folder under a temp `VIBE_HOME` (stop-now line) and one without (manual line). Live hop: not needed to prove the code. One live deepseek-flash hop is needed to prove the effect, measured as seconds and tool calls between `prepare` and the signal.
2. **F2 part 1, withdraw first.** Proof: a `turn-start.test.mjs` case with a slow earlier part that asserts the record is already disarmed before that part resolves. Live hop: yes, one hop with a prompt queued during the final turn.
3. **F7, deferred mark and reason log.** Proof: `vibe-adapters.test.cjs` cases for each failure branch that assert `deferredAt` is set and that the next `pre_agent` withdraws. Live hop: no.
4. **F5, fork and rewind.** Proof: `vibe-adapters.test.cjs` cases with `parent_session_id` set on `pre_agent` and `post_agent` (acts) and on `post_tool` (silent). Live hop: no. One payload capture after a rewind confirms the premise.
5. **F2 part 2, watch the journal folder.** Proof: a `killer.test.cjs` case that appends to a second segment and asserts the idle clock restarts, plus one that deletes the first segment and asserts no timeout. Live hop: yes, to confirm a normal hop still signals in about three seconds.
6. **F3, compaction parity.** Proof: `compaction-context.test.mjs` cases for the level reset, the pending guard and the withdrawn text. Live hop: no.
7. **F6, atomic nudge level.** Proof: a `nudge.test.cjs` case with two interleaved decisions on one state file. Live hop: no.
8. **F4, real id for a typed hand-over.** Proof: a CLI test that `prepare` without `--session` resolves the persisted id, and an adapter test that `pre_agent` writes it. Live hop: yes, one typed `/speckit-handoff` under the loop, because how the typed command reaches the model is UNKNOWN.
9. **F9, key warning.** Proof: a `skilled-loop-shell.test.cjs` case that asserts the stderr line. Live hop: no.
10. **F8, shell-child guard.** Not recommended yet. Capture first.

Items 1 to 4 are one small change set of about 55 lines of code in 4 files. Items 1 and 2 are the two that address a measured problem.

---

## 5. What could not be determined

- **How the Rust front end handles SIGTERM**: its exit code and whether it reaps the app-server. It is a compiled binary. A live hop with a process-table capture before and after the signal would settle it. The recorded hops relaunched, so it works in the cases seen.
- **What triggers the second post-turn fold** seen 9 s and 34 s after turn end in local sessions. Reading the fold callers in `VH/_runtime.py` against a timed idle session would settle it.
- **Where the `pre_agent` chain time goes** between `spec-gate-classify` and the five `turn-start` parts. The journal's `hook_call` intents carry per-hook timestamps. Reading them per hook for the 3.26 s case would settle it and decides the shape of F2 part 1.
- **Whether the journal is written during a streaming model call.** A timed tail of a live session's newest segment would settle it and decides how much F2 part 2 is worth.
- **Whether a cron, peer or background trigger starts a turn without `pre_agent`.** A logging `pre_agent` hook on a session with one scheduled trigger would settle it.
- **Whether `post_agent` fires for an interrupted turn**, and whether a `post_agent` deny re-fires `pre_agent`. Both decide the withdraw policy in F7. A logging hook and one interrupt would settle it.
- **How a typed `/speckit-handoff` reaches the hook's `prompt` field.** One payload capture would settle it.
- **The process shape of Vibe's tool shells during a turn**, persistent or one per call. One process-table capture during a tool call would settle it and unblocks F8.
- **Whether the session lease file exists during a turn.** It was absent for a live idle Vibe although the code writes a process id into it (`VH/_storage.py:2123-2128`). Listing `logs/session/active/` during a turn would settle it.
- **The phase 045 raw runs** were not re-read, so the link between F1 and the 045 "twelve more tool calls" is inferred.
- **The `session_start` payload fields** (`V/vibe/app_server/_unified_harness_backend_adapter.py:7822-7885`) and the high-water fold limits (`VH/_runtime.py:232,236,5212-5242`) were read once and not re-verified on the final pass. No finding rests on them.
