---
title: "Deep Review Report: Embedding-Stack Hardening Program (031 + 026/007 daemon)"
description: "20-iteration (converged at 9 + 1 adjudication) spec-kit deep review of the committed embedding-stack hardening program — executor cli-codex gpt-5.5 high fast. Verdict CONDITIONAL: 0 P0, 9 P1, 3 P2. Two WAL-durability P1s fixed in b588951fba; the rest carry a prioritized remediation plan."
trigger_phrases:
  - "embedding stack deep review report"
importance_tier: "important"
contextType: "review"
---
<!-- ANCHOR:deep-review-embedding-stack -->
# Deep Review Report: Embedding-Stack Hardening Program

## 1. Summary & Verdict

**Verdict: CONDITIONAL** (converged) · **0 P0 · 9 P1 · 3 P2** (12 unique findings) · `hasAdvisories=true`.

A 20-iteration deep-review loop (executor **cli-codex gpt-5.5, reasoning high, service tier fast**) over the committed embedding-stack hardening program — `031` phases 001–005 + the `026/007` daemon-durability children 009/010/012/013. The loop converged after **9 discovery passes + 1 adversarial adjudication pass** (iter 7): the new-findings ratio fell 1.0 → 1.0 → 0.4 → 0.14 → 0.11 → 0.10 → 0.10 and 7 sub-areas were explicitly ruled clean. All 4 dimensions (correctness, security, traceability, maintainability) were covered and saturated. No P0 (no data-corruption-on-the-happy-path or shipped no-op) was found — the per-phase gauntlets already caught those. The value here is **cross-phase / integration findings the single-phase reviews structurally could not see**, dominated by two themes:

- **WAL-durability-on-close completeness** (2 P1) — **FIXED** in `b588951fba`.
- **single-writer / lease lifecycle** under-hardening across both launchers (multiple P1) — deferred to a coordinated follow-up (overlaps active parallel WIP + the `026/004/013` OR-R-01 election race).

This review independently corroborated two parallel efforts: the code-graph audit's OR-R-01 (owner-lease election race) and a daemon-shutdown review's WS-1 (the non-active-connection WAL gap). Three independent reviews converging on the same single-writer/WAL classes is strong signal these are the real residual risks.

## 2. Scope

Target type: files (curated committed code). Reviewed: `shared/embeddings/{auto-select,providers/hf-local,factory,registry}.ts`, `shared/types.ts`, `bin/hf-model-server.cjs`, `bin/lib/{model-server-supervision,launcher-ipc-bridge}.cjs`, `bin/mk-skill-advisor-launcher.cjs`, `mcp_server/handlers/embedder-status.ts`, `mcp_server/lib/embedders/{execution-router,reindex}.ts`, `mcp_server/lib/search/vector-index-store.ts`, `mcp_server/lib/cache/embedding-cache.ts`, `mcp_server/lib/governance/memory-retention-sweep.ts`, `mcp_server/context-server.ts`, `scripts/core/{daemon-detect,workflow}.ts`. READ-ONLY; this report produces findings + a remediation plan, not fixes (except the two WAL P1s remediated inline as data-safety).

## 3. Findings

### Fixed in this session (b588951fba)

| ID | Sev | Finding | File:loc | Status |
|----|-----|---------|----------|--------|
| WAL-1 | P1 | `close_db` checkpoints only the active connection; non-active tracked connections detach+close without `wal_checkpoint(TRUNCATE)` → un-checkpointed frames an abrupt kill could corrupt (= parallel review's WS-1) | `vector-index-store.ts:1328` | **FIXED** — TRUNCATE shard+main before detach/close in the loop |
| WAL-2 | P1 | `writeVectorsToShard`'s per-batch shard connection (WAL mode) closes without TRUNCATE — same corruption window | `reindex.ts:377` | **FIXED** — TRUNCATE before `shard.close()` |

### Open P1 — remediation plan (§6)

| ID | Sev | Finding | File | Disposition |
|----|-----|---------|------|-------------|
| EMB-1 | P1 | Fresh daemon bootstrap can ignore an explicit `EMBEDDINGS_PROVIDER` override (cascade resolves before the override is honored) | `auto-select.ts` / `factory.ts` | PLAN — verify precedence; honor explicit override before the probe cascade |
| EMB-2 | P1 | Cancelling a running embedder reindex does not stop the worker before completion (cancel flips status but the loop runs on) | `reindex.ts` | PLAN — cooperative cancellation check in the batch loop |
| SEC-1 | P1 | `tcp://` model-server targets expose unauthenticated embed traffic off-loopback (no auth, no loopback bind enforcement) | `hf-model-server.cjs` / `hf-local.ts` | PLAN — enforce loopback bind for tcp targets or require an auth token; document |
| SEC-2 | P1 | Workflow locks fail open after timeout, re-admitting concurrent standalone writers (weakens the 013 second-writer guard) | `scripts/core/workflow.ts` | PLAN — fail-closed on lock timeout, or bounded retry with explicit give-up |
| TRC-1 | P1 | Daemon child packets (009/010/012/013) leave required verification-ledger gates open while impl-summaries claim completion | `026/007/{009,010,012,013}` docs | PLAN — reconcile checklist evidence vs impl-summary completion claims |
| LEASE-1 | P1 | Lazy model-server respawn lock expires while the live listener still owns it (TTL < listener lifetime) | `model-server-supervision.cjs` | DEFER (coordinated) — see §6 |
| LEASE-2 | P1 | Demand-triggered model-server spawn failure strands the lazy listener (no re-arm on spawn error) | `model-server-supervision.cjs` | DEFER (coordinated) — see §6 |

### P2 (advisory)

| ID | Sev | Finding | File | Disposition |
|----|-----|---------|------|-------------|
| P2-1 | P2 | Direct `hf-model-server` startup can unlink a live Unix socket, bypassing the launcher's perimeter guard | `hf-model-server.cjs` | PLAN — apply the 005 perimeter assert on the direct-startup path too |
| P2-2 | P2 | 005 spec file-change matrix assigns idle-eviction to `hf-model-server.cjs`; implementation lives in `model-server-supervision.cjs` | `031/005` spec.md | QUICK doc fix |
| P2-3 | P2 | Several embedding env knobs are code/test-visible but absent from `ENV_REFERENCE.md` | `ENV_REFERENCE.md` | QUICK doc fix |

## 4. Dimension Coverage

All 4 covered + saturated. correctness: ×5 passes (iters 1,5,6,8,9) — the densest, yielding the WAL + lease + provider/reindex findings. security: ×1 (iter 2) — tcp-exposure + workflow-lock. traceability: ×1 (iter 3) — daemon-child-ledger + the 005 file-matrix; confirmed the honestly-gated items (flag-flip, dtype, cache-into-reindex) are correctly documented, not defects. maintainability: ×1 (iter 4) — the ENV_REFERENCE gap. Ruled clean across iters 8–9: cache lib eviction/migration, `fatalShutdown` ordering, retention sweep, embed batching, HF row-count/dim adoption, auto-select local-first, index/update embed guards.

## 5. Convergence Report

Converged at iteration 9 (of a 20 cap) + 1 adjudication pass. Composite stop-score reached ~0.70 (MAD noise-floor + dimension-coverage signals); the rolling-average signal hit 0.05 after the adjudication pass. The coverage graph was empty in this hand-driven run (`nodeCount=0` — the CLI passes write deltas, not graph nodes), so the graph signal was vacuous and not used to force continuation. Discovery plateaued at ~0.10 (each pass surfacing one finding in the saturated single-writer/lease + WAL themes); the under-explored-area sweeps (iters 8–9) mapped the remaining surface and ruled 7 areas clean, confirming saturation. **Adjudication (iter 7):** all 7 then-open P1 survived (confidence 0.83–0.91, none downgraded); the 2 later WAL P1s were validated by direct code fix.

## 6. Remediation Plan

1. **DONE — WAL-durability (WAL-1, WAL-2):** committed `b588951fba`.
2. **QUICK doc reconciliation (P2-2, P2-3, TRC-1):** fix the 005 file-matrix, add the missing `ENV_REFERENCE` rows, reconcile the daemon-child verification ledgers vs impl-summaries. Low-risk; can land now.
3. **Coordinated single-writer/lease hardening (LEASE-1, LEASE-2 + OR-R-01 + P2-1):** the model-server-supervision lease lifecycle, the code-graph owner-lease election race, and the direct-startup perimeter gap are the SAME class across both launchers. Land them together, after the active parallel launcher WIP settles, with a deterministic two-launcher concurrency test — not piecemeal. Track in a dedicated follow-up packet.
4. **Targeted P1 fixes (EMB-1, EMB-2, SEC-1, SEC-2):** each needs a small design decision (override precedence, cooperative cancel, tcp auth/loopback, lock fail-closed). Route via `/speckit:plan` as a focused remediation packet.

## 7. Cross-References

- Parallel code-graph audit: `026/004/011` (OR-1-01..08 fixed), `026/004/013` OR-R-01 (deferred). Their lease/race hardening landed in `6bd1d7045e`/`8943837b2f`/`6f6c6595da` — re-validate the code-graph WS-2/WS-3 findings against those (likely resolved).
- Daemon-shutdown review WS-1 == WAL-1 (fixed). WS-3 (owner-lease) resolved by the landed code-graph work.
- Program commits reviewed: `910e87c429` `73ae557901` `6781109b97` `47a01c7170` `40806392cb` `a6ab05a4f2`; daemon `904204c272` `34604b521b` `8a30db8820` `b88390a6cd`.

## 8. Methodology

Faithful deep-review loop: fresh-context CLI executor per iteration (cli-codex gpt-5.5/high/fast), externalized JSONL + delta + strategy state (no context degradation), risk-ordered dimensions, severity-weighted convergence with an adversarial adjudication pass, claim-adjudication packets on P0/P1. Main loop was the single state-writer. Each iteration was READ-ONLY on the target code.

## 9. Next Steps

- `/speckit:plan` for the EMB-*/SEC-* P1 cluster (targeted remediation).
- A coordinated single-writer/lease-hardening packet (LEASE-* + OR-R-01 + P2-1) once parallel launcher WIP settles, with a two-launcher concurrency test.
- Quick doc reconciliation (P2-2/P2-3/TRC-1) can land immediately.
