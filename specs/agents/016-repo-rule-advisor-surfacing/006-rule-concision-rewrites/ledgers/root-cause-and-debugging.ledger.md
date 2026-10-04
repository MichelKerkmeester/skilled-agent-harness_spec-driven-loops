# Ledger: root-cause-and-debugging.md

Before 6591 B, after 6478 B, delta -113 B (-1.7%). Version 1.0.1.0 to 1.0.1.1. Stopped well short of the 20-28% aim because the file is dense: the loop, the smells table, the weakening bans, the flake test, ownership and the escalation format are all imperatives, tests or bans, and each section's one failure statement is kept.

| Part | Before B | After B | Action |
|------|----------|---------|--------|
| Frontmatter + title + header | 915 | 915 | Version bump only |
| Fires when | 317 | 317 | Kept verbatim |
| The rule | 252 | 252 | Kept |
| 1. THE LOOP | 780 | 780 | Kept |
| 2. SYMPTOM-FIX SMELLS | 818 | 818 | Kept |
| 3. WHEN AN ATTEMPT REPEATS | 1150 | 1037 | Rephrased one restatement out, cut one rationale tail |
| 4. NEVER MAKE A CHECK PASS BY WEAKENING IT | 438 | 438 | Kept |
| 5. "FLAKE" IS A CONCLUSION, NOT A STARTING HYPOTHESIS | 329 | 329 | Kept |
| 6. OWNERSHIP | 282 | 282 | Kept |
| 7. WHEN YOU ARE STUCK, ESCALATION FORMAT | 502 | 502 | Kept |
| 8. SELF-CHECK | 808 | 808 | Kept verbatim |

## Dropped sentences

- §3 "How many local retries you get is set outside this file; what triggers the stop here is repetition without new evidence, not a fixed count." rewritten as "The local retry count is set outside this file. This stop fires on repetition without new evidence, not on a count." (restatement trimmed, the trigger lives in the bold sentence "If an attempt repeats without producing new evidence, stop patching at the failure site." The semicolon is rephrased out and the not-a-count distinction is kept)
- §3 "Most repeated failures are a wrong assumption about an API, not a wrong line of code." (rationale)
