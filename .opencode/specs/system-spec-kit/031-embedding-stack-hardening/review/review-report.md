---
title: "Deep Review Report: Embedding-Stack Hardening Program (031 + 026/007 daemon)"
description: "Full 20-iteration spec-kit deep review of the committed embedding-stack hardening program — executor cli-codex gpt-5.5 high fast (9 sequential discovery + 1 adjudication + 11 parallel deepening/adversarial passes). Verdict CONDITIONAL: 0 P0, 16 P1 (2 fixed), 3 P2. Two WAL-durability P1s fixed in b588951fba; the rest carry a prioritized remediation plan."
trigger_phrases:
  - "embedding stack deep review report"
importance_tier: "important"
contextType: "review"
---
<!-- ANCHOR:deep-review-embedding-stack -->
# Deep Review Report: Embedding-Stack Hardening Program

## 1. Summary & Verdict

**Verdict: CONDITIONAL** · **0 P0 · 16 P1 (2 fixed) · 3 P2** (19 unique findings) · `hasAdvisories=true`.

A **full 20-iteration** deep-review loop (executor **cli-codex gpt-5.5, reasoning high, service tier fast**) over the committed embedding-stack hardening program — `031` phases 001–005 + the `026/007` daemon-durability children 009/010/012/013. Iterations 1–9 ran sequentially (one dimension/pass) + iter 7 was an adversarial adjudication pass; iterations 10–20 ran as **11 parallel gpt-5.5/high/fast agents** (pool of 5), each escalating to line-level granularity on a distinct surface plus a dedicated adversarial-refutation pass (iter 18) and a security sweep (iter 19). All 4 dimensions covered and saturated; ~13 sub-areas adversarially ruled clean across the run. No P0 (no data-corruption-on-the-happy-path or shipped no-op) — the per-phase gauntlets already caught those. The value here is **cross-phase / integration / line-level findings the single-phase reviews structurally could not see**, dominated by two themes:

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

### New P1 from parallel deepening (iters 10–20, line-level + cross-cutting)

| ID | Sev | Finding | File | Disposition |
|----|-----|---------|------|-------------|
| DEEP-1 | P1 | Clean-shutdown marker deleted before shard detach + DB close can fail → marker says "clean" while close errored | `vector-index-store.ts` close_db | PLAN — delete the marker only after a confirmed-successful close |
| DEEP-2 | P1 | Idle eviction clears ownership (pid/lease) without terminating the model-server **root** process → orphaned server | `model-server-supervision.cjs` (005 idle-evict) | PLAN — reap the process tree root, not just the lease, on idle evict |
| DEEP-3 | P1 | Factory-backed adapter cache is keyed by provider:model but **not dimensions** → a same-model different-dim profile collides on the cached adapter | `execution-router.ts` | PLAN — include `dimensions` in the adapter cache key |
| DEEP-4 | P1 | Retention sweep deletes stale candidates without re-validating `delete_after` inside the delete tx → TOCTOU window can delete a row whose retention was just extended | `memory-retention-sweep.ts` | PLAN — re-check `delete_after` inside the transaction |
| DEEP-5 | P1 | Step-11.5 daemon guard ignores a live `childPid` recorded in a stale launcher lease → can still open a second writer | `scripts/core/{daemon-detect,workflow}.ts` (013) | PLAN — honor a live recorded childPid even when the launcher lease looks stale |
| DEEP-6 | P1 | `embedder_status` drops live model-server load timestamps because it reads stale shared metadata instead of the live probe payload | `embedder-status.ts` / `hf-local.ts` (003) | PLAN — surface the live `/api/health` timestamps, not the cached metadata |
| DEEP-7 | P1 | A failed same-dimension reindex can partially overwrite the active vector shard before completion (no all-or-nothing swap) → a crashed re-embed leaves a half-written active shard | `reindex.ts` | PLAN — write to a staging shard and atomically swap on success |

(iter-15's "startup resolver ignores persisted non-Ollama active embedder" folds into **EMB-1**; both are the local-first bias overriding an explicit/persisted provider choice.) iters 10, 18 (adversarial refutation), and 19 (security sweep) returned **no new findings** — the 7 prior P1 survived refutation, and the security sweep confirmed no secret leakage, production tcp is loopback-obtained, socket-dir ownership is asserted, and the advisor child-env allowlist holds.

### P2 (advisory)

| ID | Sev | Finding | File | Disposition |
|----|-----|---------|------|-------------|
| P2-1 | P2 | Direct `hf-model-server` startup can unlink a live Unix socket, bypassing the launcher's perimeter guard | `hf-model-server.cjs` | PLAN — apply the 005 perimeter assert on the direct-startup path too |
| P2-2 | P2 | 005 spec file-change matrix assigns idle-eviction to `hf-model-server.cjs`; implementation lives in `model-server-supervision.cjs` | `031/005` spec.md | QUICK doc fix |
| P2-3 | P2 | Several embedding env knobs are code/test-visible but absent from `ENV_REFERENCE.md` | `ENV_REFERENCE.md` | QUICK doc fix |

## 4. Dimension Coverage

All 4 covered + saturated. correctness: ×5 passes (iters 1,5,6,8,9) — the densest, yielding the WAL + lease + provider/reindex findings. security: ×1 (iter 2) — tcp-exposure + workflow-lock. traceability: ×1 (iter 3) — daemon-child-ledger + the 005 file-matrix; confirmed the honestly-gated items (flag-flip, dtype, cache-into-reindex) are correctly documented, not defects. maintainability: ×1 (iter 4) — the ENV_REFERENCE gap. Ruled clean across iters 8–9: cache lib eviction/migration, `fatalShutdown` ordering, retention sweep, embed batching, HF row-count/dim adoption, auto-select local-first, index/update embed guards.

## 5. Convergence Report

Ran the **full 20 iterations** (hard stop at `max_iterations`). Iterations 1–9 (sequential) reached a file-level saturation plateau (ratio 1.0 → … → 0.10) with the adjudication pass (iter 7) confirming all 7 then-open P1 (confidence 0.83–0.91, none downgraded). Rather than stop early at the file-level plateau, iterations 10–20 escalated to **line-level granularity** via 11 parallel gpt-5.5/high/fast agents on distinct surfaces — this was productive, surfacing **8 more P1** (per-pass ratios 0–0.25) that file-level passes had missed, while iters 10/18/19 returned clean (the adversarial-refutation pass refuted nothing; the security sweep found no leakage/exposure). The coverage graph was empty throughout this hand-driven run (`nodeCount=0` — CLI passes write deltas, not graph nodes), so graph convergence was vacuous and not used as a stop/continue signal; the inline composite signals + the explicit 20-iteration request governed. Net: line-level + cross-cutting depth nearly doubled the finding count vs the file-level plateau — vindicating running to the full 20.

## 6. Remediation Plan

1. **DONE — WAL-durability (WAL-1, WAL-2):** committed `b588951fba`.
2. **QUICK doc reconciliation (P2-2, P2-3, TRC-1):** fix the 005 file-matrix, add the missing `ENV_REFERENCE` rows, reconcile the daemon-child verification ledgers vs impl-summaries. Low-risk; can land now.
3. **Coordinated single-writer / lease / lifecycle hardening (LEASE-1, LEASE-2, DEEP-2, DEEP-5 + OR-R-01 + P2-1):** the model-server-supervision lease lifecycle + idle-evict root reap (DEEP-2), the code-graph owner-lease election race, the Step-11.5 stale-lease childPid gap (DEEP-5), and the direct-startup perimeter gap are the SAME single-writer class across both launchers + the standalone-save path. Land them together, after the active parallel launcher WIP settles, with a deterministic two-launcher concurrency test — not piecemeal. Dedicated follow-up packet.
4. **Shutdown/durability ordering (DEEP-1, DEEP-7):** the clean-shutdown marker must be deleted only after a confirmed close (DEEP-1), and reindex should write a staging shard + atomic swap so a crashed same-dim re-embed cannot leave a half-written active shard (DEEP-7). Both are durability-correctness; fold into the WAL-durability follow-up.
5. **Targeted P1 fixes (EMB-1, EMB-2, SEC-1, SEC-2, DEEP-3, DEEP-4, DEEP-6):** each needs a small design decision — provider-override/persisted-embedder precedence (EMB-1), cooperative reindex cancel (EMB-2), tcp auth/loopback (SEC-1), workflow-lock fail-closed (SEC-2), adapter-cache dimension key (DEEP-3), retention `delete_after` TOCTOU re-check (DEEP-4), `embedder_status` live-timestamp surfacing (DEEP-6). Route via `/speckit:plan` as a focused remediation packet; re-validate each against HEAD first (as WAL-1 was) since several touch operator-sensitive code.

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
