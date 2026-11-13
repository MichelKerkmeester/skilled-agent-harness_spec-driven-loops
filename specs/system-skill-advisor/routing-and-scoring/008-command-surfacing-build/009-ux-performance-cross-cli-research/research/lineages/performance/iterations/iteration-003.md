# Iteration 3: Token cost of the brief, the command read and the ask turn

## Focus
Token cost. The reducer's Next Focus still pointed at the p95 tail, which iteration 2 closed with a bounded answer, so this iteration follows the highest-value unchecked key question instead and records the tail follow-up as exhausted. It measures the brief per prompt and per session under phase 005's head form, the command document read that a `start` policy causes across the 44 tracked commands, and the turn cost of an `ask`.

## Actions Taken
1. Rendered the real brief from the shipped renderer with a live recommendation, to get exact characters rather than an estimate.
2. Measured all 44 tracked command documents by path and size with `git ls-files` plus a stat pass, excluding assets and fixtures.
3. Re-read phase 005's six golden heads and phase 006's measured policy mix.
4. Computed a 40-prompt session with the current directive-lifecycle dedup and with phase 005's command head.
5. Re-read the hook's dedup comment to confirm the directive block is dropped after the proven-repeat boundary.

## Findings
1. The shipped renderer produces a 257-character brief at the normal cap: a 41-character head plus a 216-character directive block. At the repository's own 4-characters-per-token estimate that is 64 tokens, and 54 of them are the constant comment-hygiene block. The constant block is 84% of the brief. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:100] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:162] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:557]

2. Phase 005's command head grows the line from about 41 to about 68 characters, so a full brief goes from 257 to 284 characters and from 64 to 71 tokens. A 40-prompt session with one full brief and 39 reduced heads costs about 466 tokens today and about 734 with the command, a 268-token delta or 0.37% of a 200,000-token context. The token cost of the surfaced command itself is not a performance problem. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/005-recommendation-contract-and-brief/plan.md:71] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:557]

3. One started command costs far more than the brief: the 44 tracked command documents have a median of 4,524 bytes (about 1,131 tokens), a p95 of 12,573 bytes (about 3,143 tokens) and a maximum of 13,682 bytes (about 3,421 tokens). The five heaviest are `/deep:research` 13,682 B, `/speckit:handoff` 13,476 B, `/doctor:overlay` 12,573 B, `/speckit:save` 12,453 B and `/deep:review` 11,113 B. Three starts in a session cost about 3,393 tokens, 4.6 times that session's whole brief cost. [SOURCE: .skilled/commands/deep/research.md:1] [SOURCE: .skilled/commands/speckit/handoff.md:1] [SOURCE: .skilled/commands/doctor/overlay.md:1] [SOURCE: .skilled/commands/speckit/save.md:1]

4. The largest token win in the brief is already built: the directive-lifecycle dedup delivers the full brief on the first message and after a lifecycle boundary or transcript shrink, then keeps the head and drops the constant block on proven repeats. That is the 84% saving, not a future optimization. A recommendation that trims the head would win at most 54 tokens per session. [SOURCE: .skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:373] [SOURCE: .skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:397]

5. The policy mix is 20 `start`, 17 `ask` and 7 `run`. An `ask` costs one extra model turn per offered command: the model asks, the user answers, then the document read happens. That turn is the only material per-start cost, and it is a wall-time and attention cost rather than a token one. Phase 007 counts `COMMAND:` states but not the turn count, so the cost is currently invisible. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/006-gate-2-binding-and-runtime-pointers/spec.md:94] [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/007-per-runtime-behaviour-proof/plan.md:68]

6. The honest token conclusion is a negative result: the brief is 64 to 71 tokens, the dedup already removes 84% of it, and a started command's document read is the real cost at about 1,131 tokens median. The only token guard worth building is visibility of that read cost, so a future command document cannot silently ship at three times the p95. [INFERENCE: findings 1 to 4 compared against finding 3]

## Ruled Out
- Trimming the brief head or the directive block as a token saving. The head is 41 characters and the block is already suppressed on repeats; the ceiling is 54 tokens per session.
- A per-prompt token budget mechanism. The 80-token cap already binds and the measured brief is 64 tokens.
- Caching rendered briefs to save tokens. Rendering costs well under a millisecond and tokens are charged for context, not render time.
- Following the reducer's p95-tail pointer again. Iteration 2 answered it with a bounded variance claim; re-investigating it would repeat exhausted work.

## Dead Ends
- No per-start token measurement exists in any phase packet. Phase 007 measures whether a command starts, never what the start costs. The doc-size measurement here stands in for it; a live token count from a started session would need a runtime run, which the steer forbids.

## Edge Cases
- Ambiguous input: "token cost of the brief" could mean the whole delivered context or the brief alone. Measured the brief alone; the command document read is reported separately because it dominates.
- Contradictory evidence: the UX angle may argue for a longer, richer brief while this angle finds the brief is negligible in tokens. Both can hold; the measurement does not decide UX.
- Missing dependencies: no tokenizer is available locally, so tokens are the repository's own 4-characters-per-token estimate, consistent with the renderer's cap. Recorded rather than guessed as exact.
- Partial success: findings 1 to 5 are measured or read from code; finding 6 is synthesis. Status is `complete`.

## Sources Consulted
- .skilled/skills/system-skill-advisor/runtime/lib/render.ts:100,162,557
- .skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:373-427
- specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/005-recommendation-contract-and-brief/plan.md:67-79
- specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/006-gate-2-binding-and-runtime-pointers/spec.md:94
- specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/007-per-runtime-behaviour-proof/plan.md:65-69
- Command output: rendered brief 257 chars, 41-char head, 216-char directive block
- Command output: 44 command docs, median 4,524 B, p95 12,573 B, max 13,682 B, total 254,463 B

## Assessment
- New information ratio: 0.90
- Questions addressed: token cost per prompt, per session and per started command; the ask turn
- Questions answered: the token-cost key question

## Reflection
- What worked and why: rendering the real brief instead of estimating it produced exact numbers and killed a plausible but false optimization axis. Measuring the command documents turned "a command read" into a distribution with a p95 and a top five.
- What did not work and why: no tokenizer exists, so the numbers carry the renderer's own estimate. That is acceptable for a 4x decision but not for a billing claim, and it is stated.
- What I would do differently: measure the doc sizes before reading the dedup code, because the dedup makes the brief's constant block irrelevant and would have shortened the analysis.

## SCOPE VIOLATIONS
None. No out-of-scope write was attempted.

## Recommended Next Focus
Cache and precompute across the six runtimes: what the exact prompt cache, the OpenCode plugin cache and the directive dedup actually save at a realistic hit rate, whether a persistent or semantic cache is worth it, and how the per-runtime architectures (Claude 3 processes, OpenCode/Pi/DSH 2, Codex/Devin/Cursor pointer-only) compare per prompt.
