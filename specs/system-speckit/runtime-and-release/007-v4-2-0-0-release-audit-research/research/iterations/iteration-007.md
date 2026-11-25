# Iteration 7: Q5 operator UX, diff-first

## Focus
Q5: the messages the new v4.2.0.0 commands and hooks show operators. Each was judged for silent failure, misleading text, unsafe defaults and dead ends. Surfaces covered: the Claude Stop nudge and auto-record (`d57563b175a`), the `create.sh` sub-track errors (`b0b3c8d9bf1`), the linked-worktree goal hop warning (`12fe3abc66b`), and the doctor reserved-source refusal (`8f90ec94c0d`). The `--extend` warning was already reported in iteration 3, and fan-out stop logic in iteration 4, so neither was re-reported. The sk-git `worktree-naming.sh` provisioning messages were deferred because the tool budget ran out.

## Actions Taken
1. Read the Stop hook's `main`, `autoRecordDecisions` and `decisionCaptureNudge`, the `hookLog` sink, and `takeNudge` in the decision-capture core. Ran a blame check to sort in-window lines from older ones.
2. Ran `create.sh` from a scratch git repository (`/private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Skilled/d46cd0dc-b63f-443e-8e44-4ae03af818a5/scratchpad/iter7-create`) with four `--track` values, then checked that the real repository's status was unchanged outside this packet.
3. Read the `12fe3abc66b` hunks in `skilled-loop` and `goal-carry-over.md`.
4. Read the `8f90ec94c0d` overlay-engine hunk and the fan-out refusal text.

## Findings
1. **P3, silent outcome (`d57563b175a`): the operator never sees what the Stop auto-record did.**
   - `main` awaits `autoRecordDecisions` and throws away its result [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/claude/session-stop.ts:769].
   - A success writes `Recorded automatically:` rows into the packet's `decision-record.md`. Each row still needs a person to add a reason, yet the only trace is an INFO line on stderr [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/claude/session-stop.ts:217] [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/claude/shared.ts:108].
   - A failure is a WARN on stderr only [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/claude/session-stop.ts:221].
   - The skip reasons `no_transcript`, `not_one_packet` and `no_spec` log nothing [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/claude/session-stop.ts:198] [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/claude/session-stop.ts:203].
   - The one chat-visible line is the nudge `systemMessage` [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/claude/session-stop.ts:772]. `takeNudge` returns a count only when the pending count rises above the last count it reported [SOURCE: .skilled/hooks/decision-capture/lib/capture-core.mjs:462].
   - So a failed or skipped auto-record of answers that were already nudged says nothing in chat. After a success, the nudge stays silent too, so nobody is told a packet file was written.
   - The nudge text is older than v4.1.0.0 (`7aeb4db9be6`). It still reads "Run /speckit:save with --full-auto to record them" and never says that Stop tried and why it did not record [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/claude/session-stop.ts:107].
   - Confirmed by reading the code, not run end to end. [INFERENCE: whether Claude Code shows a Stop hook's exit-0 stderr outside verbose mode was not checked. If it is hidden, every outcome above is invisible.]
2. **P3, dead-end refusal (`b0b3c8d9bf1` routes level 2 into an older branch): a refused level-2 sub-track gets no remedy, and a missing folder is called "undeclared".**
   - Reproduced in scratch:
     - `--track demo/sub/missing`, where the folder does not exist, prints only `Error: --track 'demo/sub/missing' refused: demo/sub/missing: undeclared folder ignored`.
     - `--track demo/sub2/deep`, under an undeclared level-1 folder, prints `... refused: demo/sub2: undeclared folder ignored`.
   - `inspect_subtrack` (level-2 depth added in window) prints a diagnostic on every rejection, including a missing directory [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1051] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1060].
   - Because a diagnostic is always printed, the caller takes the remedy-less branch [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1458]. The `Declare its description.json with level 'sub-track' ...` remedy can never print after a rejection [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1461].
   - "ignored" also reads wrong on an exit-1 refusal.
   - The branch itself predates the window (`8c3cfccc22f`, `f46c48fa2ad`). The in-window change sends every level-2 refusal into it.
3. **P3, misleading text and dead end (`12fe3abc66b`): the non-Claude goal hop warning can state something false and gives no next step.**
   - Any non-Claude receiver given a `goal_root` gets `warning: the goal was not set in the relaunched session: its packet is only in the linked worktree $goal_root, which a $runtime receiver does not read` [SOURCE: .skilled/bin/skilled-loop:486].
   - The function's own comment says the packet is left out because the receiver's checkout "can hold an older copy of the same packet" [SOURCE: .skilled/bin/skilled-loop:479].
   - The docs keep `goal_root` when the claimed note's worktree matched first, even when this checkout holds a copy [SOURCE: .skilled/hooks/session-handover/goal-carry-over.md:104] [SOURCE: .skilled/hooks/session-handover/goal-carry-over.md:108].
   - In that case "only in the linked worktree" is false. The line also names no remedy, such as starting the receiver inside the worktree or setting the goal by hand.
   - Inferred from code and docs, not run.

## Checked clean
- `create.sh` four-segment track error is actionable and exact. Reproduced: `Error: --track 'demo/sub/inner/x' has more than three path segments; a track holds at most two sub-track levels, such as 'demo/sub' or 'demo/sub/inner'.` [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1446]. A successful level-2 create lists each written index line.
- `8f90ec94c0d` only folds the reserved-name check to lower case. The refusal text did not change, so the fix adds no new operator message [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:4164].
- The fan-out "lineage still running from an earlier run" refusal names the running lineages [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:5198]. Only the text was read.

## Ruled Out
- `[speckit] This packet fits no existing sub-track of demo. Consider proposing a new sub-track.` printed on a level-2 create in scratch. The scratch sub-track descriptions held no keywords, so the advice is a fixture artifact and is not counted. The "fits no" branch is also unchanged in the window.

## Dead Ends
- None to promote.

## Edge Cases
- Ambiguous input: "sk-git worktree-naming messages". `worktree-naming.sh` gained 43 lines in the window (`957f47570f3`, `16f83331276`, provisioning) and was not read. It is deferred, not skipped.
- Contradictory evidence: none.
- Missing dependencies: the Stop auto-record was not run end to end, because it writes consumed keys into real state.
- Partial success: three of the six named surfaces got findings and two were checked clean. `worktree-naming.sh` is left for the next iteration, so Q5 stays open.

## Sources Consulted
- `git show d57563b175a`, `b0b3c8d9bf1`, `12fe3abc66b`, `8f90ec94c0d`, `a20a1d96a05` (hunks)
- `.skilled/skills/system-spec-kit/runtime/hooks/claude/session-stop.ts`:90-112, 156-225, 740-773
- `.skilled/skills/system-spec-kit/runtime/hooks/claude/shared.ts`:108-118
- `.skilled/hooks/decision-capture/lib/capture-core.mjs`:452-485
- `.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh`:1036-1066, 1442-1466
- `.skilled/bin/skilled-loop`:449-490
- `.skilled/hooks/session-handover/goal-carry-over.md`:104-128, `troubleshooting.md`:54
- Scratch `create.sh` runs (four `--track` values)

## Assessment
- New information ratio: 0.83 (two findings fully new, one partly new because iteration 6 flagged the hook-log-only failure as a lead)
- Questions addressed: Where do the new v4.2.0.0 commands and hooks give operators bad UX: silent failures, misleading messages, unsafe defaults or dead ends?
- Questions answered: none yet. Q5 needs the `worktree-naming.sh` read before a verdict.

## Questions Answered
- None closed. Q5 has three P3 UX findings so far.

## Questions Remaining
- Q5: `worktree-naming.sh` provisioning messages (`957f47570f3`, `16f83331276`), then a Q5 verdict.

## Reflection
- What worked and why: running `create.sh` from a scratch git repository was cheap and safe, because the script takes its root from `git rev-parse --show-toplevel`. That made the exact refusal text quotable.
- What did not work and why: the budget went to the Stop hook and `create.sh` first, so `worktree-naming.sh` was never reached.
- What I would do differently: read the in-window diff of every named surface first, then spend the run budget only where the text looks risky.

## Recommended Next Focus
Q5 completion: read the `worktree-naming.sh` hunks from `957f47570f3` and `16f83331276` and run its provisioning and refusal messages in a scratch worktree. Then give a Q5 verdict. Optional: check whether Claude Code shows a Stop hook's exit-0 stderr, which settles how invisible finding 1 is.
