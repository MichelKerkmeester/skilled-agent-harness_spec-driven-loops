# Iteration 27 (Round R): RC4-vectorstore-ann-tiestability

> **Reconstructed file.** Child 006 consolidated its per-iteration findings directly into `../research.md` during the original sprint (a documented deviation). This file was regenerated from `../deep-research-state.jsonl` + `../research.md` to restore structural parity with siblings 001–005. **Authoritative record: `../research.md`** plus this iteration’s row in `../deep-research-state.jsonl`. Prose is condensed (the original per-seat narrative was not separately retained); claims are the ledger one-liners.

## Focus
`RC4-vectorstore-ann-tiestability` — round R, read-only claude2 Opus seat. (newInfoRatio 0.7, findingsCount 1, status insight, ~360s)

## Findings
- **R028-ann-tiestable-orderby** — surfaced (`upsert_candidate`): ANN tie-stable ORDER BY: ranked ANN queries sort on distance with no tie-stable secondary key, so which rows survive the LIMIT into RRF changes run-to-run. Append ", m.id ASC" (COALESCE) to the 4 ranked ORDER BYs — the strongest determinism win below fusion.

## Verdict / disposition
NET-NEW

## Full detail
See `../research.md` → Cross-cutting NET-NEW. Key questions: PE. Answered: —.
