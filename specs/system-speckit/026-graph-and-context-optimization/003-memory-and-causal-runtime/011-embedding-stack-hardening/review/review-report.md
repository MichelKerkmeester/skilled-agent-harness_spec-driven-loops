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
<!-- /ANCHOR: deep-review-embedding-stack -->