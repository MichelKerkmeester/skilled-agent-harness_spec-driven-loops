# Iteration 14 (Round Q): PQ2-ops-recovery-retry-budget

> **Reconstructed file.** Child 006 consolidated its per-iteration findings directly into `../research.md` during the original sprint (a documented deviation). This file was regenerated from `../deep-research-state.jsonl` + `../research.md` to restore structural parity with siblings 001–005. **Authoritative record: `../research.md`** plus this iteration’s row in `../deep-research-state.jsonl`. Prose is condensed (the original per-seat narrative was not separately retained); claims are the ledger one-liners.

## Focus
`PQ2-ops-recovery-retry-budget` — round Q, read-only claude2 Opus seat. (newInfoRatio 0.35, findingsCount 1, status insight, ~360s)

## Findings
- **R028-enrichment-retry-budget** — surfaced (`upsert_candidate`): Enrichment retry-budget + dead-letter: the boot-time enrichment backfill replays stuck work every boot with no cap or terminal state (a poison-pill re-enriches forever). Add a durable retry budget + terminal failed state.

## Verdict / disposition
NET-NEW

## Full detail
See `../research.md` → Cross-cutting NET-NEW. Key questions: PE. Answered: —.
