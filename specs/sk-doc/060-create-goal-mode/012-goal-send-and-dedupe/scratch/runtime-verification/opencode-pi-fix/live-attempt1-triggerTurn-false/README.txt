Attempt 1 ran goal-context.ts with { triggerTurn: false } on the turn_end nudge.
Pi exited 0 on its own after 97s and goal.md was unchanged, so the restart is gone.
But stdout was empty: the nudge was appended after the final answer (transcript line 8),
and Pi print mode (dist/modes/print-mode.js lines 110-125) prints only a trailing assistant message.
The fix moved to { deliverAs: "nextTurn" } and was re-run as attempt 2 (files b3fix-* one level up).
