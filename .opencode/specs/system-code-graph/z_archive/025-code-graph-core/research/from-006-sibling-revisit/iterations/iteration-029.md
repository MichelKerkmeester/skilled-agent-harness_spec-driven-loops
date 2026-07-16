# Iteration 29 (Round R): RC6-reliability-unify-correction

> **Reconstructed file.** Child 006 consolidated its per-iteration findings directly into `../research.md` during the original sprint (a documented deviation). This file was regenerated from `../deep-research-state.jsonl` + `../research.md` to restore structural parity with siblings 001–005. **Authoritative record: `../research.md`** plus this iteration’s row in `../deep-research-state.jsonl`. Prose is condensed (the original per-seat narrative was not separately retained); claims are the ledger one-liners.

## Focus
`RC6-reliability-unify-correction` — round R, read-only claude2 Opus seat. (newInfoRatio 0.6, findingsCount 1, status insight, ~360s)

## Findings
- **RC6** — surfaced (`upsert_finding`): Shared reliability() correction: NOT "one module, three identical callers" — the live integer scorer throws on the fractional inputs D2 needs; C4 consumes the posterior as a weight-delta (not a multiplier); the 3rd consumer (procedural) is proxy-only. Build one f64 primitive + thin per-consumer adapters.

## Verdict / disposition
synthesis-correction

## Full detail
See `../research.md` → Syntheses — shared Beta. Key questions: PE. Answered: —.
