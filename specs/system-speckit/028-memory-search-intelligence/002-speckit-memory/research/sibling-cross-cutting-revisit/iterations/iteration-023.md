# Iteration 23 (Round R): RB5-codegraph-ppr-parserskip

> **Reconstructed file.** Child 006 consolidated its per-iteration findings directly into `../research.md` during the original sprint (a documented deviation). This file was regenerated from `../deep-research-state.jsonl` + `../research.md` to restore structural parity with siblings 001–005. **Authoritative record: `../research.md`** plus this iteration’s row in `../deep-research-state.jsonl`. Prose is condensed (the original per-seat narrative was not separately retained); claims are the ledger one-liners.

## Focus
`RB5-codegraph-ppr-parserskip` — round R, read-only claude2 Opus seat. (newInfoRatio 0.6, findingsCount 2, status insight, ~360s)

## Findings
- **R028-q3-ppr** — surfaced (`upsert_candidate`): Code-Graph Q3-C1 (seeded PPR): zero graph-walk in 027 (ranking is edge-count/1-hop degree; the PageRank helper was "never wired"). Net-new query-seeded multi-hop impact ranking; reuse 027’s causal-BFS traversal.
- **R028-q2c1-transient-retry** — surfaced (`upsert_candidate`): Code-Graph Q2-C1 (transient/fatal parser-skip + bounded retry): 027 has crash-cohort classify + an attempt_count but no max_retries ceiling and recordSuccess is a no-op, so the skip is permanent. The transient tier recovers falsely-skipped files.

## Verdict / disposition
NET-NEW · EXTENDS

## Full detail
See `../research.md` → Ledger B — Q3-C1; Ledger B — Q2-C1. Key questions: PB. Answered: PB.
