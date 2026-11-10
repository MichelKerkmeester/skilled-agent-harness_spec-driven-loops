&nbsp;

## In-Session Handover

A long session no longer ends at its context limit. Near the limit it writes a hand-over note, ends itself and a fresh session in the same terminal carries on.

#### Your Session Restarts at 80 Percent

A hook reads how full the context window is. At 80% it asks the session to finish if a few steps remain. Otherwise it asks for a hand-over note with the goal, what is done, the remaining work and anything in flight. The session saves its progress and marks the note ready. A second reminder comes 5% later if the first was missed. If you told the session not to hand over, it keeps working and the automatic summary takes over.

#### A Fresh Session Picks Up the Work

When the session goes idle, a small watcher ends it. `skilled-loop` then restarts the same runtime in the same terminal with the model you started it on. The new session picks up the note, resumes the spec folder and works only on what remains. It keeps your spec-folder answer, so it does not ask the documentation question again. A limit of ten hand-overs and a ten-minute freshness window stop a chain that runs away.

#### Five Runtimes Hand Over on Their Own

Claude, Pi, OpenCode, Codex and Hermes each read how much of their context window they have used and hand over without you. Cursor and Devin run under the loop too. They hand over only after `/speckit:handoff`, which Cursor names `/speckit-handoff`, because neither can safely tell when a session ends.

#### Nothing Outside the Loop Is Lost

A session started before you added the shell line runs outside the loop and cannot hand over. At 80% the hook asks it to write the same note and run `session-relaunch.cjs keep`, then it carries on. On Claude Code, Pi and OpenCode, a hook after each automatic summary points it back at its note, so it picks the note up and continues. Codex and Hermes print the command to pick up the note when you keep it, and you run that command after the summary.

A sub-agent never hands over the session that started it. Claude Code refuses any hand-over command from a fork or an agent, and OpenCode `task` sub-agents get no reminder. A `claude -p` or `pi -p` started inside a looped session runs outside the loop and cannot restart the session that started it.

#### A Stuck Restart Leaves a Trail

When a session will not go idle within 30 seconds, the watcher stops and sends a macOS notification titled "Session relaunch needs attention (killer timed out)" with the exact command to continue by hand. The watcher only ever stops a process the loop started. The note stays open, and the command to pick it up prints when the session exits. On Pi and OpenCode, a turn you start just after the session was readied cancels the hand-over at once, so your new message is never cut off.

Every hand-over writes a line to `.skilled/skills/.state/session-relaunch/hop-history.log`. `node .skilled/hooks/session-relaunch/bin/session-relaunch.cjs history` prints the latest lines, and `/doctor:setup` shows the last one. Set `SESSION_RELAUNCH_NOTIFY_HOPS=1` in `.skilled/hooks/hook-flags.env` for a macOS notice titled "Session handed over" on each hand-over. It is off unless you set it.

#### Proven Live in Thirteen Situations

Thirteen situations ran live on each of Claude, Pi and OpenCode, among them two sessions at once, an interrupted hand-over and a busy hand-over. The runs found four faults, now fixed. Two OpenCode sessions started in the same second could write over each other's note. A message sent at hand-over could be cut off on Pi and OpenCode. The shell line's commands failed inside Claude Code's tool shell. A hand-over interrupted before the new session picks up its note now prints a warning with the command to continue.
