# Iteration 7 (Round P): PB4-codegraph-edge-staleness

> **Reconstructed file.** Child 006 consolidated its per-iteration findings directly into `../research.md` during the original sprint (a documented deviation). This file was regenerated from `../deep-research-state.jsonl` + `../research.md` to restore structural parity with siblings 001–005. **Authoritative record: `../research.md`** plus this iteration’s row in `../deep-research-state.jsonl`. Prose is condensed (the original per-seat narrative was not separately retained); claims are the ledger one-liners.

## Focus
`PB4-codegraph-edge-staleness` — round P, read-only claude2 Opus seat. (newInfoRatio 0.6, findingsCount 1, status insight, ~300s)

## Findings
- **PB4** — surfaced (`upsert_finding`): Code-Graph edge-staleness: the skip is content-hash-gated, NOT mtime; the real gap is dependency-transitivity — queryFileImportDependents is wired only to the read path, so a file whose dependency changed (own content stable) is skipped and edges go stale.

## Verdict / disposition
EXTENDS + corrects the 005 gap

## Full detail
See `../research.md` → Ledger B — CG-edge-staleness. Key questions: PB. Answered: PB.
