# Iteration 4 (Round P): PB1-codegraph-q1c1-bitemporal

> **Reconstructed file.** Child 006 consolidated its per-iteration findings directly into `../research.md` during the original sprint (a documented deviation). This file was regenerated from `../deep-research-state.jsonl` + `../research.md` to restore structural parity with siblings 001–005. **Authoritative record: `../research.md`** plus this iteration’s row in `../deep-research-state.jsonl`. Prose is condensed (the original per-seat narrative was not separately retained); claims are the ledger one-liners.

## Focus
`PB1-codegraph-q1c1-bitemporal` — round P, read-only claude2 Opus seat. (newInfoRatio 0.7, findingsCount 1, status insight, ~300s)

## Findings
- **PB1** — surfaced (`upsert_finding`): Code-Graph Q1-C1/Q6-C1 (bi-temporal + generation watermark): code_edges has no temporal columns and reindex hard-DELETEs, but the as-of capability has no named consumer and Q6-C1 safety is redundant with the shipped readiness gate.

## Verdict / disposition
EXTENDS -> DEFER-speculative

## Full detail
See `../research.md` → Ledger B — Q1-C1/Q6-C1. Key questions: PB. Answered: —.
