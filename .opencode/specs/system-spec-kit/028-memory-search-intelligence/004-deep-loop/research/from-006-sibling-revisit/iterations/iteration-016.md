# Iteration 16 (Round Q): PQ4-mcp-transport-idempotency

> **Reconstructed file.** Child 006 consolidated its per-iteration findings directly into `../research.md` during the original sprint (a documented deviation). This file was regenerated from `../deep-research-state.jsonl` + `../research.md` to restore structural parity with siblings 001–005. **Authoritative record: `../research.md`** plus this iteration’s row in `../deep-research-state.jsonl`. Prose is condensed (the original per-seat narrative was not separately retained); claims are the ledger one-liners.

## Focus
`PQ4-mcp-transport-idempotency` — round Q, read-only claude2 Opus seat. (newInfoRatio 0.7, findingsCount 1, status insight, ~360s)

## Findings
- **R028-transport-idempotency** — surfaced (`upsert_candidate`): Transport idempotency: the save-receipt is stored after+outside the txn, so a commit-then-die replay duplicates the secondary index. Thread the idempotency token through the daemon IPC into the save handler.

## Verdict / disposition
NET-NEW (RD3-confirmed real)

## Full detail
See `../research.md` → Cross-cutting NET-NEW. Key questions: PE. Answered: —.
