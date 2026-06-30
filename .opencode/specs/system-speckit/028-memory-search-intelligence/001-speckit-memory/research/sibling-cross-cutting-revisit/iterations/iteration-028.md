# Iteration 28 (Round R): RC5-fanout-recovery

> **Reconstructed file.** Child 006 consolidated its per-iteration findings directly into `../research.md` during the original sprint (a documented deviation). This file was regenerated from `../deep-research-state.jsonl` + `../research.md` to restore structural parity with siblings 001–005. **Authoritative record: `../research.md`** plus this iteration’s row in `../deep-research-state.jsonl`. Prose is condensed (the original per-seat narrative was not separately retained); claims are the ledger one-liners.

## Focus
`RC5-fanout-recovery` — round R, read-only claude2 Opus seat. (newInfoRatio 0.6, findingsCount 1, status insight, ~360s)

## Findings
- **R028-fanout-transient-retry** — surfaced (`upsert_candidate`): Fan-out transient/fatal retry: the live fan-out dispatches once, never re-dispatches, no transient/fatal split (recovery is post-hoc salvage only). The pool’s durable failed ledger is a ready substrate — classify + bounded retry + re-dispatch the failed branch alone.

## Verdict / disposition
NET-NEW

## Full detail
See `../research.md` → Cross-cutting NET-NEW. Key questions: PE. Answered: —.
