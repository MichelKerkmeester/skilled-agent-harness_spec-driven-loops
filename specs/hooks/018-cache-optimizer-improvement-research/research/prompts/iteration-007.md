# Deep research — iteration 007 (Sonnet 5, second opinion)

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

## This iteration's angle — attack the backlog

Take the standing backlog as a claim set and try to break it. For each of the seven: is the cited code actually what the finding says it is, is the proposed direction sound, and is the ranking defensible? Name any item you would drop entirely, and any risk the earlier analysis understated — especially where a fix could make measurement worse rather than better.

## Rules

- Cite `file:line` for every claim about current behavior. Uncited = hypothesis, label it.
- Disagreeing with the standing backlog is the point. Say which item and why, with the line.
- Do not edit any file. Research only; your reply is the artifact.
- Do not propose a rewrite.
- Budget: at most 12 tool calls.
