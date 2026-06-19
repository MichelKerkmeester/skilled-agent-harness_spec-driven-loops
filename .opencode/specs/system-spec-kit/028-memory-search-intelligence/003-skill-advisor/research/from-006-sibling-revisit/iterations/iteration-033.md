# Iteration 33 (Round R): RD3-goreverify-transport-fingerprint-BOTH-REAL

> **Reconstructed file.** Child 006 consolidated its per-iteration findings directly into `../research.md` during the original sprint (a documented deviation). This file was regenerated from `../deep-research-state.jsonl` + `../research.md` to restore structural parity with siblings 001–005. **Authoritative record: `../research.md`** plus this iteration’s row in `../deep-research-state.jsonl`. Prose is condensed (the original per-seat narrative was not separately retained); claims are the ledger one-liners.

## Focus
`RD3-goreverify-transport-fingerprint-BOTH-REAL` — round R, read-only claude2 Opus seat. (newInfoRatio 0.6, findingsCount 1, status insight, ~360s)

## Findings
- **R028-transport-idempotency** — CONFIRMED (`confirm_finding`): Transport idempotency: the save-receipt is stored after+outside the txn, so a commit-then-die replay duplicates the secondary index. Thread the idempotency token through the daemon IPC into the save handler.
- **R028-fingerprint-absence-finding** — CONFIRMED (`confirm_finding`): Fingerprint-absence -> WARN: the freshness gate skip-PASSes on an absent/zero fingerprint. Promote to WARN. ~667 impl-summaries lack one; the whole check is default-OFF, so gate the flip behind a backfill.

## Verdict / disposition
NET-NEW (RD3-confirmed real)

## Full detail
See `../research.md` → Cross-cutting NET-NEW. Key questions: PE. Answered: —.
