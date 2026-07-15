# Iteration 42 (Round S): SA8-advisor-embedding-staleness

> **Reconstructed file.** Child 006 consolidated its per-iteration findings directly into `../research.md` during the original sprint (a documented deviation). This file was regenerated from `../deep-research-state.jsonl` + `../research.md` to restore structural parity with siblings 001–005. **Authoritative record: `../research.md`** plus this iteration’s row in `../deep-research-state.jsonl`. Prose is condensed (the original per-seat narrative was not separately retained); claims are the ledger one-liners.

## Focus
`SA8-advisor-embedding-staleness` — round S, read-only claude2 Opus seat. (newInfoRatio 0.6, findingsCount 1, status insight, ~360s)

## Findings
- **R028-advisor-embedding-staleness** — surfaced (`upsert_candidate`): Advisor embedding-staleness signal: the advisor projection stamps generatedAt=now at load, masking embedder-version drift. Stamp embedder id/version into the stored projection, compare on load (mirror memory_embedding_reconcile).

## Verdict / disposition
NET-NEW (RD4-confirmed real)

## Full detail
See `../research.md` → Cross-cutting NET-NEW. Key questions: PE. Answered: —.
