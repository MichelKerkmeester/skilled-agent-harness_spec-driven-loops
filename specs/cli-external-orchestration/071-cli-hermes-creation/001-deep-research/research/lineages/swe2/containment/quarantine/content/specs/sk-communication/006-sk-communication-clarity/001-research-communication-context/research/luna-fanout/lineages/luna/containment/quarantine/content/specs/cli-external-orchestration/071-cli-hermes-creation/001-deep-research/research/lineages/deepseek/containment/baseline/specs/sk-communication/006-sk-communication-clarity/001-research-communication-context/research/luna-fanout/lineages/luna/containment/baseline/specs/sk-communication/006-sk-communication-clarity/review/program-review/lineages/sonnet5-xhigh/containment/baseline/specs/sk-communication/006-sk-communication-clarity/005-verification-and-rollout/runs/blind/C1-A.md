Case: C1

Where does the retry policy live?

Reply A:

The retry policy is split deliberately across two files, and each one says so.

The number lives in `AGENTS.md` line 192, §3 Debugging and Iteration: stop local retries after three failed fixes for the same symptom, then escalate in Section 7's format. The trigger lives in `repo-rules/root-cause-and-debugging.md` §3, "When an attempt repeats": stop when an attempt repeats without producing new evidence, because repetition without evidence, not a fixed count, is what fires it. That rule names the split itself at line 87, "How many local retries you get is set outside this file", and its §7 at line 139 holds the escalation format the three-count routes to.

One secondary reading, in case you meant code rather than the rules: the bulk re-embed retry tuning knobs (`SPECKIT_RETRY_*`) live in `barter/ai-speckit/coder/opencode.json` lines 91-94, with the rationale comment at line 97.

Nothing is blocked on you.
