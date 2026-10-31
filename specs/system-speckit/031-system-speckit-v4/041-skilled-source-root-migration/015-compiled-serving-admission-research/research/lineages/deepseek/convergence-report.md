# Convergence Report — deepseek lineage

## Stop Reason

**`maxIterationsReached`** — the fan-out stop policy was `max-iterations`; convergence before the cap
was treated as telemetry only and the loop ran all 5 iterations as instructed.

## Totals

- Iterations completed: **5 of 5**
- Questions answered: **5 of 5** (KQ-1..KQ-5 all confirmed; Q7-rated confidence on contract,
  machinery and cost claims; medium on the unbuilt checker's exact size)
- Findings recorded: **32** across 5 deltas (8 + 7 + 7 + 6 + 4)
- Key findings registered: **17**
- Ruled-out directions: **7**

## NewInfoRatio Trend

| Iteration | Focus | newInfoRatio | Novelty justification |
|---|---|---|---|
| 1 | Lane C parity contract + restore inventory | 1.00 | First pass; all new |
| 2 | compiledRoute vs gold feasibility + scoring semantics | 0.85 | Corpus measurement, bridge liveness, action mismatch |
| 3 | Admission machinery beyond the check | 0.80 | Frozen-table inventory, manifest mechanics, topology history |
| 4 | Costs and risks per path | 0.55 | Pricing synthesis + CI/coverage environment facts |
| 5 | Recommendation + build steps | 0.35 | Selection and plan only; no new sources |

Average: **0.71**. The decline is the expected forced-depth shape, not a stall: each iteration
closed its question and the final pass produced the decision rather than new sources.

## Quality Gates

- **Source diversity:** live runtime files, deleted-module history at `b45ea54cea3^`, commit objects,
  deterministic `grep -r` corpus counts, CI workflow definitions, test sources, and archived
  benchmark reports. No single surface carries a load-bearing claim alone.
- **Focus alignment:** each iteration answered exactly one question (Q1→Q5) and wrote its evidence to
  its own iteration file and delta.
- **No weak single source:** every load-bearing claim cites either a live `file:line`, a git object,
  or a reproducible command; UNCERTAIN items are marked in `research.md` §Confidence and Unknowns.
- **Negative knowledge:** 7 ruled-out directions recorded with reasons and evidence, including two
  self-corrections (five → eight cohort surfaces; gold-only bar semantics).

## Contradictions / Logic-Sync Notes

- The spec's Problem Statement and the architecture reference say "seven hubs already admitted"; the
  live cohort is five (7→6→5). This synthesis treats five as current reality and flags the documents
  as stale. No code change was made.
- The architecture reference's layout paths (`006`/`011`/`010`) are the retained legacy layout, not
  the live current layout (`009`/`014`/`013`); both resolve today by design.
