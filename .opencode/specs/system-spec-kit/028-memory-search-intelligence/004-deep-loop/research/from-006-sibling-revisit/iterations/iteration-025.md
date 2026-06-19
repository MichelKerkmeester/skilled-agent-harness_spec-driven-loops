# Iteration 25 (Round R): RC2-datamodel-identifiers

> **Reconstructed file.** Child 006 consolidated its per-iteration findings directly into `../research.md` during the original sprint (a documented deviation). This file was regenerated from `../deep-research-state.jsonl` + `../research.md` to restore structural parity with siblings 001–005. **Authoritative record: `../research.md`** plus this iteration’s row in `../deep-research-state.jsonl`. Prose is condensed (the original per-seat narrative was not separately retained); claims are the ledger one-liners.

## Focus
`RC2-datamodel-identifiers` — round R, read-only claude2 Opus seat. (newInfoRatio 0.4, findingsCount 1, status insight, ~360s)

## Findings
- **RC2** — surfaced (`upsert_finding`): Data-model identifiers (aionforge recipe): derived_id must include anchors (legacy UNIQUE is anchor-inclusive), order the canonical fields + add a kind-tag, and a restore must preserve the id (rowid-alias PK, not AUTOINCREMENT).

## Verdict / disposition
recipe (grounds C4-B/C5-B)

## Full detail
See `../research.md` → Syntheses — identifier recipe. Key questions: PC. Answered: —.
