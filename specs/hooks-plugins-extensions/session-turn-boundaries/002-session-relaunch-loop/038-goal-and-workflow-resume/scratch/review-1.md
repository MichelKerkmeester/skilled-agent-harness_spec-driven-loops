# In-session handover review: goals and workflows across a hop

Reviewed `main` at `165e274413`, read-only. No runtime session was started. Live behaviour is taken from the repository's recorded runs and marked as such.

## 1. Verdict

1. Goals come back with no typing on Claude Code, Pi and OpenCode, as long as the goal is tied to a packet `goal.md` that the sender can prove.
2. Codex never gets its goal back after a hop, and nothing at runtime says so.
3. Cursor and Devin have no automatic hop. A manual claim through the wrapper hands them the goal once, and their next handoff drops it.
4. Workflows are not resumed as workflows on any runtime. The receiver gets a prose note plus `/speckit:resume`, and the running command, its mode and its step are stored nowhere.
5. Four fixes matter most: a cleared Claude goal comes back (F3), Codex loses its goal silently (F1), no workflow re-entry (F2), and the Cursor and Devin session id mismatch (F4).

## 2. Per-runtime matrix for goals

| Runtime | Goal re-set automatically | Mechanism | What enforces it afterwards | Evidence |
|---|---|---|---|---|
| Claude Code | Yes, when the goal matches a packet in the note's spec folder tree | `prepare` reads the newest `goal_status` entry in the session log and writes `goal_packet` into the note. The wrapper starts the receiver on `/goal <chat slice>`, read fresh from `goal.md`, and moves the claim seed to `SKILLED_LOOP_CLAIM_SEED`. The `SessionStart` hook delivers the claim steps. | Claude's native goal and its Stop evaluation | `relaunch-core.cjs:599-633`, `skilled-loop:1198-1220`, `compact-pointer.mjs:136-156`. Tests 763, 768 and 180 pass. Stub run E4 shows the start prompt and the variable. Live run recorded 2026-10-25, not rerun. |
| Codex | No | `resolveGoalPacket` always answers empty for Codex, so the note carries no packet and nothing is set. | Nothing | `relaunch-core.cjs:761-774`, README lines 171 and 184. Test 538 passes. E1 printed `codex => ""`. |
| OpenCode | Yes | `prepare` reads the session's goal record. The wrapper exports `SESSION_RELAUNCH_GOAL_PACKET`. The goal plugin binds it on the first top-level `session.created`. | System-prompt injection on every request, the plugin's verifier and its guarded continuation on `session.idle` | `opencode-goal.js:2240-2270`, `3581-3588`, `3629-3659`. Handover tests 1 to 10 pass. Live on OpenCode 2 with `--standalone` only, recorded, not rerun. |
| Pi | Yes | Same record and export. The extension binds at `session_start` or the first `input`. | Goal brief appended to every user input, plus a heuristic check at `turn_end` that only nudges on the next turn | `goal-context.ts:103-108`, `233-314`. E5 shows `bound:true` and the brief. Live run recorded, not rerun. |
| Cursor | Partly | No automatic hop. A manual claim through the wrapper exports the packet and the `sessionStart` hook binds it. | Nothing. One injection at session start, and the adapter's own header says model visibility is unproven. | `cursor/goal-inject.mjs:1-27`, `83-96`. E4 shows the export. Never run live (not logged in). |
| Devin | Partly | No automatic hop. A manual claim through the wrapper exports the packet. The `SessionStart` and `UserPromptSubmit` hook binds it. | Brief injected on every prompt. No stop check. | `devin/goal-inject.mjs:71-87`. E4 shows the export. Receiver half shown by hand in the recorded run. |
| DSH, Hermes | Not part of the feature | Neither is in the relaunch runtime list and the wrapper has no arm for them. DSH has goal hooks but no hand-over bind. | Not applicable | `relaunch-core.cjs:35`. A search of `goal/dsh/*.mjs` for the bind found nothing. |

What the hop carries, on every runtime: the note holds only a packet path in `goal_packet`, never goal text. `consume` reports it and the wrapper exports it for that hop only (`session-relaunch.cjs:759-779`, `skilled-loop:1199-1205`).

Scenarios, core cases:

- **Goal changed during the session.** Claude takes the newest log entry, and E1 resolved a goal switched from parent to child to the child packet. Plugin runtimes read the record at `prepare`, and E5 showed a rebind followed. An edited `goal.md` reaches the receiver as edited, because the slice is rendered at launch.
- **Goal already complete.** Not carried. E1 gave an empty answer for a met Claude goal, and E5 for a completed record.
- **Goal cleared.** Plugin runtimes carry nothing. Claude carries the cleared goal anyway (F3).
- **No goal set.** Nothing is carried and nothing is printed. Tests 657 and 760 pass.
- **Goal paused or set as free text.** Not carried and no signal (F7).

Scenarios, switches and limits:

- **Slice over budget.** Claude gets no native goal. The wrapper prints one warning and the receiver starts on the claim seed. E4 printed `over the 4000-character limit (4437 characters)`. Plugin runtimes bind it anyway, because they inject a different, shorter projection.
- **Carry-over switched off** with `SESSION_RELAUNCH_GOAL=0`. Nothing is written or exported. E4 and E5 confirm it, and tests 659, 699 and 759 pass.
- **Goal plugin switched off** with `OPENCODE_GOAL_DISABLED=1`. Plugin runtimes bind nothing. Claude also loses its native goal, with a warning (F9).
- **Hop declined, operator uses the printed command.** Through the wrapper the goal arrives as on a hop. E4 showed `/goal` on Claude and the exported packet on Codex, Cursor and Devin. The printed command does not resolve as printed (F12).

## 3. Parent and child goal behaviour across a hop

**Parent goal set, session working a child phase.** This is the designed case and it works. The note's `spec_folder` is the child and `goal_packet` is the parent. On Claude the resolver walks from the child up and accepts the first packet whose `goal.md` contains the goal's first line. E1 resolved `010-parent` from spec folder `010-parent/001-child`, and a real `prepare` run wrote `goal_packet: specs/track/010-parent` beside the child spec folder.

**What the receiver holds.**

- Claude gets the parent's chat slice: title, objective, decisions, the binding table with its Read, Precedence and Stop rules, and the criteria.
- Plugin runtimes get the objective projection: a pointer to the parent `goal.md`, one fixed binding sentence and the criteria (`goal-slice.cjs:129-141`).
- The child phase reaches the receiver only through the seed's spec folder and the `/speckit:resume <child>` step.
- Nothing mechanical makes the receiver open the child's `goal.md`. The binding rule is text the model is asked to follow.

**Child goal set as the session goal.** On Claude the child packet is recorded, then refused at launch because a phase child has no budget to check. E4 printed `the goal slice has no budget to check against`. The receiver gets no native goal and only the `Goal packet:` line from `claim`. Plugin runtimes bind the child without complaint (E5). The two families disagree here.

**The 4,000 character budget.** It is applied only on the Claude path, by `goal.cjs packet` reporting `packet_budget=ok` and a second length check (`goal-handover.cjs:124-137`). Tests 237 to 244 pass, including exactly 4,000 accepted and 4,001 refused.

**Goal tooling.** `goal.cjs` has `packet`, `packet-log`, `log`, `bind`, `unbind`, `resent`, `show`, `set`, `clear`, `complete`, `pause`, `resume`, `history`, `doctor` and three legacy actions. It has no `check` action. The checker is `check-goal.cjs` under `sk-create-goal/scripts`. The hop uses only `packet`.

**Spec folder outside the goal's packet tree.** On Claude the goal is dropped silently (F6).

## 4. Workflow and loop resume

One mechanism serves every command. The sender writes a note with four prose sections. The receiver is told to claim it, run `/speckit:resume <spec folder>` and "Continue the work under Remaining work" (`nudge.cjs:204-255`). No field in the note, the relaunch record or the seed names the running command, its mode or its step (`relaunch-core.cjs:29`, `handoff.md:100-132`).

**`/speckit:implement`**
- Survives: packet docs on disk (`tasks.md` ticks, `plan.md`, the continuity block the sender saves before `prepare`), the Gate 3 answer, model and effort.
- Receiver is told: resume the packet, then continue Remaining work.
- Result: it continues the tasks, not the command. `/speckit:resume` ends with "Run /speckit:implement if tasks remain" as a suggestion (`speckit-resume-auto.yaml:200-203`). The workflow asset has no step state and no resume branch, so the step order and its gates apply only if the model re-invokes the command.

**`/speckit:complete`, including `:autopilot` and unattended**
- Survives: the same packet docs, and the autopilot branch as the current git branch.
- Lost: the mode itself, the recorded base branch, the rule to suppress approval prompts, and the duty to end with a `SPECKIT_AUTOPILOT_RESULT` line and merge only when clean (`speckit-complete.yaml:77-112`, `613-640`). These live only in the sender's context.
- Result: a note it may or may not follow. An unattended run can come back as an ordinary session that asks questions or never prints the terminal result. Inferred from reading. A stub-receiver run with an autopilot note would confirm it.

**`/speckit:plan`**
- Survives: whatever spec docs were written.
- Result: same as implement. Which of the eight steps was running is not recorded, and neither is `:confirm` mode, so checkpoints can be skipped after a hop.

**`/deep:research` and `/deep:review`**
- Survives: the strongest state of any command. Config, the JSONL state log, strategy and iteration files are on disk, and re-invoking the command on the same folder classifies the run as `resume` and continues the same lineage (`deep-research-auto.yaml:310-321`).
- Receiver is told: nothing about re-invoking. Neither the deep-loop skill nor the deep commands mention the relaunch.
- Result: it continues at the right iteration only if the model re-runs the command. A lock the sender did not release then blocks that re-entry (F10).

**`/deep:ai-council`**
- Survives: `session-state.jsonl` and the topic artefacts.
- Result: not determined. The auto asset has no resume classification, so re-entry behaviour on existing state is unknown. The lock problem applies as above.

**`/loop` and scheduled wakeups**
- Survives: nothing. The relaunch code has no reference to loops, wakeups or cron.
- Result: the loop ends with the sender. The receiver restarts it only if the note says so and the model acts on it. Inferred from reading. A live hop with a pending wakeup would confirm it.

## 5. Findings

### P0 and P1

**F1. Codex loses its goal on every hop, with no signal** (P0 by the stated scale. Documented as by design.)
- Runtime: Codex, which hops automatically.
- Evidence: `relaunch-core.cjs:761-774`, README line 184 ("Codex gets neither").
- Scenario: a Codex session with a native goal hands over. The note has no `goal_packet`, the receiver has no goal, and the wrapper prints nothing.
- Status: confirmed. E1 returned an empty packet for Codex and test 538 passes.
- Smallest fix: give the loss a signal first. Print one line from `prepare` for Codex in `session-relaunch.cjs`, and add a step to the Codex seed text in `nudge.cjs` asking the receiver to read the bound packet's `goal.md` and tell the operator to set it. The real fix is the Codex goal reader the README says is pending.

**F2. No command workflow is re-entered after a hop** (P1)
- Runtimes: all.
- Evidence: `handoff.md:100-132`, `nudge.cjs:143-161` and `247-253`. The implement, complete and plan assets contain no relaunch handling and no step state (searched).
- Scenario: `/speckit:complete :autopilot` at step 9 hops. The receiver resumes the packet and works the task list by hand, with no autopilot envelope and no terminal result line.
- Status: confirmed that nothing structured is carried, by search and by running the start hook (E3 printed exactly the four generic steps). What the model then does is inferred.
- Smallest fix: require an "Active command" line under In-flight state, holding the exact command with mode and arguments and the step reached. Add one seed step: when that line is present, re-invoke the command instead of continuing by hand. Files: `nudge.cjs` and `handoff.md`.

**F3. A cleared Claude goal is handed on and set again** (P1)
- Runtime: Claude Code.
- Evidence: `relaunch-core.cjs:553-557` expects `<command-args>clear</command-args>`. A real session log on this machine records `/goal clear` with empty args, followed by `<local-command-stdout>Goal cleared: ...`. The fixture at `relaunch-core.test.cjs:2621` uses the form real logs do not have. Phase 025's summary already says this entry was never observed.
- Scenario: the operator runs `/goal clear`, the session later hops, and the receiver starts on `/goal <slice>` for the goal that was removed.
- Status: confirmed. E1 with the real log shape returned the packet. The fixture shape returned empty.
- Smallest fix: in `goalLogEntry`, also end the goal on a `local_command` entry whose content starts with `<local-command-stdout>Goal cleared`. Add that shape to the test.

**F4. Cursor and Devin drop a handed-over goal at their next handoff** (P1 for these two runtimes)
- Evidence: `handoff.md:35` and `:72` tell these runtimes to use a `uuidgen` id. The goal record is keyed by the native session id (`goal-core.cjs:228-232`). Neither runtime can bind its own goal.
- Scenario: a Devin receiver is bound to the parent goal. Its own `/speckit:handoff` runs `prepare --session <uuid>`, no record matches, and the next note has no `goal_packet`.
- Status: confirmed. E5 resolved the packet for the native id and nothing for another id.
- Smallest fix: in `recordGoalPacket` in `session-relaunch.cjs`, for Cursor and Devin, fall back to the `SESSION_RELAUNCH_GOAL_PACKET` the session inherited when no record matches.

### P2, Claude goal edge cases

**F5. With the Claude relaunch hooks off, a manual claim starts on the goal and never claims the note**
- Evidence: the wrapper swaps the seed for `/goal` without reading the concern switch (`skilled-loop:1019-1036`, `1215-1220`). `compact-pointer.mjs:161-170` exits before the claim branch when the concern is off.
- Scenario: flags hold `SYSTEM_SESSION_RELAUNCH_CLAUDE_ENABLED=0`, as this checkout's local file does. A note written on Pi is claimed with `skilled-loop claude "<seed>"`. Claude works the goal and the note stays open and unread.
- Status: confirmed in two halves. E4 showed the swap with Claude off, and E3 showed the start hook printing nothing.
- Smallest fix: in `compact-pointer.mjs`, run the `startup` claim branch before the enabled check.

**F6. An active Claude goal is dropped when the note's spec folder is empty, `none` or outside the goal packet's tree**
- Evidence: `relaunch-core.cjs:617-632`. Candidates are the spec folder's parents and paths named in the goal text, and a template slice does not name its own path.
- Status: confirmed. E1 returned empty for `020-other` and for an empty spec folder.
- Smallest fix: when no candidate matches, run a bounded search of `specs/**/goal.md` for the headline in `claudeGoalPacket`, or at least print the reason (see F7).

**F7. A goal that cannot be proven disappears without a word**
- Runtimes: Claude for free-text goals and a changed title line. Pi, OpenCode, Cursor and Devin for text-only or paused goals.
- Evidence: `relaunch-core.cjs:616-632`, `736-739`.
- Status: confirmed. E1 and E5 returned empty for each case, and `prepare` printed nothing.
- Smallest fix: have `resolveGoalPacket` return a reason, and have `prepare` print one `goal not carried: <reason>` line in `session-relaunch.cjs`.

**F8. A refused Claude slice is reported only on the wrapper's stderr**
- Evidence: `skilled-loop:332-354`. The reason is not logged and not given to the receiver.
- Scenario: a child goal or an over-budget parent. The operator sees one line just before the runtime takes the terminal, and the receiver is never told a goal existed beyond the `Goal packet:` line from `claim`.
- Status: confirmed in E4.
- Smallest fix: append a `goal-not-set` log entry with the reason in `render_goal_slice`.

**F9. `OPENCODE_GOAL_DISABLED=1` also blocks Claude's native goal on a hop**
- Evidence: the renderer shells through `goal.cjs packet`, which the switch disables (`goal-handover.cjs:107-122`).
- Status: confirmed by running the renderer with the switch set.
- Smallest fix: read the slice with `goal-slice.readPacketGoal` directly in `goal-handover.cjs`.

### P2, loops and operator path

**F10. A deep-loop lock left by the sender blocks re-entry for up to an hour**
- Evidence: `loop-lock.ts:637-644`. A CLI-acquired lock is `transient`, so it goes stale only after twice its 30 minute lifetime. Neither the nudge nor the handoff command mentions it.
- Status: the lock half is confirmed. E6's second acquire returned `acquired:false` with a dead owner. The handover half is inferred and a hop in mid-loop would confirm it.
- Smallest fix: one line in the handoff steps in `nudge.cjs` and `handoff.md`: release a held deep-loop lock and record the re-entry command.

**F11. `/loop` and scheduled wakeups end with the sender**
- Status: inferred. The F2 fix covers it if the Active command line includes the loop prompt and interval.

**F12. The printed manual command does not run as printed**
- Evidence: both printers emit a bare `skilled-loop <runtime> ...` (`skilled-loop:684`, `relaunch-core.cjs:1344`). The shim defines no such name, and `command -v skilled-loop` failed in a profile-initialised shell.
- Scenario: the hop is declined and the operator pastes the line. Falling back to the bare runtime without the shim skips the wrapper, so no goal is set.
- Smallest fix: define a `skilled-loop` function in `skilled-loop-shell.sh`, or print the wrapper's path.

**F13. Doc drift**
- `handoff.md:127` says a Cursor or Devin manual start "exports no goal packet". E4 and test 767 show it does.
- `SESSION_RELAUNCH_GOAL` is absent from `hook-flags.env.example` (searched), though the core reads it from the flags file.

**F14. Every plugin-runtime receiver is told the goal "changed"**
- Evidence: a fresh hand-over bind has no resent hash, so the resend reminder fires on each turn until recorded (`goal-core.cjs:1159`, `1319-1323`).
- Status: confirmed. E5 printed the reminder for each bound receiver.
- Smallest fix: set `lastResentSliceHash` to the packet hash in `bindGoalIfUnbound`.

## 6. What works

Test runs, with the loop variables unset:

- Relaunch suites plus the two OpenCode plugin suites: 944 passed, 0 failed, exit 0. Command: `node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/session-relaunch.test.cjs .opencode/plugins/tests/opencode-goal-handover.test.cjs`.
- Seven goal hook suites under `.skilled/hooks/goal/`: 199 passed, 0 failed, exit 0.

Behaviour confirmed by experiment:

- **Sender side.** `prepare` wrote the parent packet for a session working a child. Met, completed and absent goals wrote nothing (E1, E5, a real `prepare` run).
- **Wrapper.** A Claude manual claim started on `/goal <slice>` with the seed in the environment. Other runtimes kept the seed and got the packet variable. The switch at `0` removed both (E4).
- **Claude receiver.** With the concern on, the start hook delivered the claim command, the resume step for the child folder and the "before any work on the goal" lead (E3).
- **Plugin receivers.** The bind happened once. A second call answered `has-goal`, a dispatched child answered `child-session`, and a missing packet answered `packet-invalid` (E5).
- **Freshness.** The slice is read from `goal.md` at launch, so the receiver never gets a stale copy (`goal-handover.cjs:107-117`).

Also sound, by passing tests: the packet does not leak from an outer session or a previous hop (761, and the claim-variable test), and a switch-off at `prepare` holds even if the switch is back on at consume (700).

The repository tree was unchanged after the runs. `git status --short` printed nothing.

## 7. What I could not determine

- **Live behaviour on any runtime.** Whether Claude accepts `/goal <slice>` as a start prompt and reads the start context first, and whether the plugins fire on the real hosts, rests on the recorded runs of 2026-10-25.
- **Claude goal against the hop itself.** A sender under an unmet native goal is told to stop after `prepare`, while the goal's Stop evaluation tells it to continue. The killer needs three idle seconds. The recorded live hop succeeded once, and I cannot say how reliably that race is won.
- **Very long Claude logs.** The goal reader widens its tail to 16 MiB. In one real 13 MiB log the newest goal entry sat 1.2 MiB from the end, so it was in reach. A goal whose last entry is further back than 16 MiB would read as no goal, and I found no log that large to test.
- **Codex native goal state.** I did not read `goals_1.sqlite`, so I cannot say what a Codex goal reader would find.
- **Cursor.** Whether the model sees the session-start goal at all is unproven in the repository's own notes, and it was never run live.
- **`/deep:ai-council` re-entry**, as section 4 states, and what a model does with a prose note for each workflow. Both need a live or stubbed receiver run.
- **OpenCode 1.** The recorded hop proof is for OpenCode 2 with `--standalone`.
