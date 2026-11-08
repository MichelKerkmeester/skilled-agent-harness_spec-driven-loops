# Deep research — iteration 002 of 5

Continuing a research loop on improving the Pi extension `pi-cache-optimizer`
(`.pi/extensions/pi-cache-optimizer/index.ts`, ~9,400 lines, plus `tests/`).

## Findings already on the table (from earlier iterations)

  - 1. P0 — Separate “cache miss” from “cache signal unavailable”
  - 2. P0 — Gate stable-prefix lifting on cross-turn stability
  - 3. P0 — Make economics useful with explicit local pricing
  - 4. P1 — Add provider capability gates instead of treating adapters as cache guarantees
  - 5. P1 — Treat third-party `prompt_cache_key` support as an explicit capability
  - 6. P1 — Make router cache hints request-scoped
  - 7. P2 — Verify the retry guard’s event contract before tuning it further

Do not re-derive these. Build on them.

## This iteration's angle — adversarial verification

Try to falsify the three P0 findings above. For each: trace the actual code path and decide CONFIRMED (you traced it) or REFUTED (with the line that disproves it) or UNPROVEN (what evidence is missing). A finding that survives this is worth building on; one that does not should be struck now, before design effort is spent on it. Pay particular attention to whether the claimed defect is reachable in the shipped configuration, not just present in the source.

## Rules

- Cite `file:line` for every claim about current behavior. Uncited = hypothesis, label it.
- Prefer being wrong loudly over vague. If an earlier finding is mistaken, say which and why.
- Do not edit any file. Research only; your reply is the artifact.
- Do not propose a rewrite. Changes must fit the existing structure.
- Budget: at most 12 tool calls. One angle done well beats a survey.
