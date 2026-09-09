# Deep research — iteration 008 (Sonnet 5, second opinion)

Continuing a research loop on improving the Pi extension `pi-cache-optimizer`
(`.pi/extensions/pi-cache-optimizer/index.ts`, ~9,400 lines, plus `tests/`).
Iterations 1-5 were run by a different model. You are the second opinion.

## The standing backlog from iterations 1-5

  1. F1 / P0 — Separate reported miss from unavailable cache signal
  2. F3 / P0 — Accept explicit zero cached-read pricing
  3. F4 / P1 — Add explicit provider capability gates
  4. F2 / P0 — Require cross-turn stability before prefix lifting
  5. F5 / P1 — Make third-party `prompt_cache_key` support explicit
  6. F6 / P1 — Make router cache hints request-scoped
  7. F7 / P2 — Verify the retry guard’s event contract before tuning

## This iteration's angle — make the top item buildable

Take whichever item survives as rank 1 after your own analysis and specify it to the point a competent engineer could implement it without further research: exact functions and call sites, the new behavior, the persisted-record migration, the test that fails before and passes after, and the negative control. State plainly what you are NOT certain about.

## Rules

- Cite `file:line` for every claim about current behavior. Uncited = hypothesis, label it.
- Disagreeing with the standing backlog is the point. Say which item and why, with the line.
- Do not edit any file. Research only; your reply is the artifact.
- Do not propose a rewrite.
- Budget: at most 12 tool calls.
