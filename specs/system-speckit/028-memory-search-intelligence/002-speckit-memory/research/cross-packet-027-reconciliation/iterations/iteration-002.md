# Iteration 2 (Round K): Q2 Provenance/Write-Safety × content-addressed idempotency + ingest-bypass

## Focus
Reconcile 027's source_kind / write-ingress provenance guard against 028's idempotency receipts (C4-A), content-addressed derived id (C4-B), and the recall-trust ingest-bypass gap. Read-only.

## Findings (newInfoRatio 0.6)
**VERDICT: EXTENDS** — 028 is additive and reveals a real *orthogonal* hole.
- 027's write-ingress guard (`pe-gating.ts:59-66`, protects null/human rows) + `human`-defaulting deriver (`write-provenance.ts:101-106`) protect **field-level overwrite integrity** of memory_index rows; provenance carries to successor rows on reindex (`pe-gating.ts:391-397`).
- 028's ingest-bypass (C8; `extraction-adapter.ts:255-262`) is a **render-trust-boundary** gap — untrusted tool-extracted content enters working_memory for an existing memory_id WITHOUT crossing the untrusted-recall wrapper (`envelope.ts:284-295`). Orthogonal threat → **027's guard does NOT cover the bypass; a real hole on a different axis.**
- C4-A (idempotency receipts, flag-OFF) + C4-B (`derived_id=sha256(triple+source+rule_version)`) complement source_kind without conflict. LEVERAGE M, EFFORT M.

## Most-likely-wrong
Traced only `extraction-adapter.ts:235-262` + the pe-gating grep, not the full working_memory insert chain — a downstream tagging step could exist. Verify in Round L.

## Next Focus
Carry the ingest-bypass orthogonal-hole + C4-B derived-id into Round L (Q2 ↔ Q10 share the content-addressed-identity thread).
