# Iteration 43 (Round S): SB1-goreverify-advisor-cluster-DEFER

> **Reconstructed file.** Child 006 consolidated its per-iteration findings directly into `../research.md` during the original sprint (a documented deviation). This file was regenerated from `../deep-research-state.jsonl` + `../research.md` to restore structural parity with siblings 001–005. **Authoritative record: `../research.md`** plus this iteration’s row in `../deep-research-state.jsonl`. Prose is condensed (the original per-seat narrative was not separately retained); claims are the ledger one-liners.

## Focus
`SB1-goreverify-advisor-cluster-DEFER` — round S, read-only claude2 Opus seat. (newInfoRatio 0.6, findingsCount 1, status insight, ~300s)

## Findings
- **RA-PA4** — DOWNGRADED (`downgrade_finding`): Advisor C1 (split-conflict re-rank): 027 conflict mass is real but inside fusion + subtractive; C1 moves it outside. BUT every conflicts_with array is empty in production -> C1 re-ranks mass that does not exist.
- **RA-PA5** — DOWNGRADED (`downgrade_finding`): Advisor QCR (query-class per-lane weights): the seam exists, but the primaryIntentBonus table is benchmark-overfit and the known routing disagreements are approved baselines, not failures (no demonstrated mis-routing).

## Verdict / disposition
DEFER (non-problem) · DEFER (speculative)

## Full detail
See `../research.md` → Ledger A — C1; Ledger A — QCR. Key questions: PA. Answered: PA.
