---
title: "Deep Research: mk-spec-memory embedding-backlog drain and daemon-config investigation"
description: "Convergence-gated deep-research synthesis (10 iterations, cli-codex gpt-5.5 xhigh) into why a bulk re-embed of the mk-spec-memory store cannot reach 0 failed / 0 pending. Root cause: the reindex/embedder_set path writes vectors but never commits memory_index.embedding_status; the backlog is vector-present but status-stale, so the fix is near-free metadata reconciliation."
trigger_phrases:
  - "embedding backlog drain research"
  - "mk-spec-memory re-embed non-convergence root cause"
  - "memory_embedding_reconcile vector-present status-stale"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/004-embedding-backlog-drain-investigation"
    last_updated_at: "2026-05-27T08:30:00Z"
    last_updated_by: "main_agent"
    recent_action: "deep-research-synthesis-complete-10-iterations"
    next_safe_action: "speckit-plan-implementation-packet-reindex-status-commit-and-reconcile-tool"
    blockers: []
    key_files:
      - "research/research.md"
      - "research/iterations/iteration-010.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000004"
      session_id: "rsr-2026-05-26T20-43-39Z"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Q1-Q6 answered with file:line evidence across 10 iterations"
---

# Deep Research: mk-spec-memory Embedding-Backlog Drain & Daemon-Config Investigation

**Session:** rsr-2026-05-26T20-43-39Z | **Iterations:** 10 (stop: maxIterationsReached) | **Executor:** cli-codex `gpt-5.5` · `xhigh` · `service_tier=standard` · `sandbox=workspace-write` | **Findings:** 81 | **newInfoRatio trajectory:** 0.74, 0.56, 0.34, 0.76, 0.68, 0.64, 0.51, 0.24, 0.18, 0.12

> All `file:line` citations are from iteration evidence (`research/iterations/iteration-001..010.md`); the source-of-truth narrative is those files plus this synthesis.

---

## 1. EXECUTIVE SUMMARY

A bulk re-embed of the mk-spec-memory store could not be driven to `0 failed / 0 pending`: a "completed" drain (background monitor exit 0) left the `success` count unchanged. The investigation establishes **why**, and finds that **the fix is almost free**.

**Root cause (compound, 3 defects):**
1. **Vector-only reindex never commits status.** `embedder_set` → `startReindex` writes embeddings to the active vector shard (`vec_768` + `vec_memories`) but its completion transaction only flips the active-embedder pointer and marks the `embedder_jobs` row `completed` — it **does not reconcile `memory_index.embedding_status` to `success`** (`reindex.js:316-318`). The only code paths that ever write `status='success'` are the normal save/index pipeline and the retry-manager's `pending → retry → success`.
2. **Retention parks clean rows before they embed.** `enforceRetryRetentionLimits()` runs **before** queue selection in both `getRetryQueue()` and `runBackgroundJob()`, marking old/overflow `pending`/`retry` rows `failed` (`retry-manager.ts:474-508,536,997`). On a large backlog under the default cap (1000) / age (24h), the queue is parked faster than it drains.
3. **Daemon env is frozen at module load.** Retry retention cap/age are file-scope constants read once at module load (`retry-manager.ts:343-344`); the launcher bridges to an existing daemon on reconnect with **no env-reload hook** (`mk-spec-memory-launcher.cjs:414-416`, `launcher-ipc-bridge.cjs:121-128`), and sidecars respawn from the stale daemon env. So `/mcp` reconnect and lone sidecar kills cannot apply tuned env.

**Empirically validated (iteration 7, read-only SQL):** all **17,326** non-success rows in the live DB **already have active vectors** in `context-vectors__ollama__nomic-embed-text-v1.5__768.sqlite` (`vec_768` + `vec_memories`). **0 rows are genuinely missing an embedding.** Therefore the backlog is *vector-present but status-stale*, and the immediate repair is a **metadata `UPDATE` to `success`** — not re-embedding work.

**Recommended resolution:** a guarded MCP maintenance tool `memory_embedding_reconcile({mode, activeOnly, resetMissing, ...})` (dry-run default) that reconciles vector-present rows to `success` and resets only genuinely-missing-vector retention failures to retry-eligible; plus three durable code fixes (reindex status-commit being the single highest-leverage one) and a defaults change for the retention caps.

---

## 2. RESEARCH QUESTION & SCOPE

**Question:** Why can a bulk re-embed of mk-spec-memory not be driven to `0 failed / 0 pending`, and what is the reproducible, safe procedure (plus minimal code fix) to fix it?

**In scope:** retry-manager retention semantics; reindex/`embedder_set` status-commit interaction; vec-shard vs `memory_index` status reconciliation; daemon lifecycle (launcher + IPC bridge + worker respawn + env reload); the cap(1000)/age(24h) defaults.
**Out of scope (non-goals):** implementing the fix (this is research only → follow-on `/speckit:plan`); redesigning the provider cascade (ADR-014) or vector-shard architecture; pruning/dedup of superseded rows.

---

## 3. METHODOLOGY

Ten convergence-gated iterations dispatched to `cli-codex gpt-5.5` at `xhigh` reasoning, `standard` service tier (normal speed), `workspace-write` sandbox, via the canonical audited deep-loop wrapper. Each iteration read externalized state, performed read-only code/DB investigation, and wrote an iteration narrative + JSONL record + delta. The orchestrator steered focus across the six key questions (the reducer cannot auto-advance focus with a CLI executor, so focus was steered: state-machine map → Q1 parking → Q4/Q5 reindex+daemon → reconcile → empirical DB validation → acceptance spec → durable fixes → close-out). Convergence used the inline 3-signal vote (rolling-avg / MAD / question-entropy); the coverage-graph channel stayed inert (codex `graphEvents` did not conform to the research-graph node-kind/relation schema — a minor tooling finding).

---

## 4. ROOT CAUSE — THE EMBEDDING-STATUS STATE MACHINE

`memory_index.embedding_status` ∈ {`pending`, `retry`, `success`, `failed`}. Who writes each:

| Transition | Writer | Evidence |
|---|---|---|
| → `success` (initial) | normal save/index pipeline, after embedding + vector insert succeed | `save/embedding-pipeline.ts:165,173`; `vector-index-mutations.ts:262,286` |
| → `pending` | deferred indexing (embedding absent/skipped/async); resets to `pending`, `retry_count=0` | `vector-index-mutations.ts:300-383` |
| `pending → retry → success` | retry-manager: `claimRetryCandidate()` sets `pending→retry`; `retryEmbedding()` writes `success` after vec insert (one txn) | `retry-manager.ts:293-329,645-750,727-744` |
| → `retry` then → `failed` (exhausted) | `incrementRetryCount()` then `markAsFailed()` after `MAX_RETRIES` | `retry-manager.ts:770-831` |
| → `failed` (parked) | `enforceRetryRetentionLimits()` — max-age pass then pending-cap overflow pass | `retry-manager.ts:474-508` |
| **vectors written, status NOT touched** | **`embedder_set`/reindex completion** — flips active pointer + `embedder_jobs=completed` only | **`reindex.ts:431-442`, `reindex.js:316-318`; `embedder-set.ts:63-71`** |

**The defect:** the only "bulk" re-embed surface operators reach (`embedder_set` / reindex) is exactly the one path that **writes vectors without committing status**. So a reindex "completes," the vectors exist, but every row it touched keeps its prior `pending`/`failed`/`retry` label. The `success` count cannot rise from a reindex — only from the per-row retry-manager/save paths, which retention parks before they run on a large backlog.

---

## 5. KEY FINDINGS BY QUESTION

- **Q1 — How do pending rows become `failed`?** `enforceRetryRetentionLimits()` parks in two passes: (1) mark `pending`/`retry` rows older than `MAX_AGE_MS` as `failed` (`failure_reason='Retry retention max age exceeded'`); (2) order remaining by `COALESCE(last_retry_at,created_at,updated_at),id`, keep the first `MAX_PENDING`, mark the overflow `failed` (`'Retry retention pending cap exceeded'`). Retention runs **before** embedding work. `retry-manager.ts:343-344,474-508,536,997`.
- **Q2 — Does retry-manager embed clean `pending` rows?** Yes — the queue selects `embedding_status IN ('pending','retry')` and treats `pending` as immediately eligible — *but only after retention lets them through*. Initial `success` is also owned by the save/index pipeline, not solely the retry-manager. `retry-manager.ts:539-563,870-889`.
- **Q3 — Why does `reindex --force` report `Indexed/Updated:0`?** `--force` is file-scan/save-driven (disables incremental categorization, re-sends every file through `indexSingleFile`), **not** a DB status reset. The save pipeline reports `indexed/updated/unchanged/...`; same-path dedup still treats `pending` as unchanged-eligible, and **15,152 failed rows are masked by a newer latest-row** for the same canonical path+anchor, so they're never revisited. `cli.ts:442,470`; `memory-index.ts:213-218,444-528`; `dedup.ts`.
- **Q4 — What does `embedder_set` do?** Validates manifest → ensures vector table → queues `startReindex` → returns. No `memory_index` write. The reindex worker selects rows with no status predicate, writes both vector surfaces, then completes with active-pointer + job-status only (`reindex.js:316-318`). **This is the crux.**
- **Q5 — Does the daemon reload env on reconnect?** No. Retry env frozen at module load; launcher bridges to the existing daemon with no reload hook; context-server also hardcodes the retry loop to 5-min/5-item, bypassing env; sidecars inherit the stale daemon env on respawn. A full lease-owner restart is required. `mk-spec-memory-launcher.cjs:49,346-348,414-416`; `launcher-ipc-bridge.cjs:121-128`; `context-server.ts:1828-1830`; `sidecar-client.ts:467,575-579`.
- **Q6 — Minimal reproducible drain procedure?** Reconcile vector-present stale rows → `success` first; restart the lease owner with raised retention env; reset only genuinely-missing-vector retention failures to retry-eligible; verify `success ≈ total`, `failed/pending/retry = 0`. See §7–§8.

---

## 6. EMPIRICAL VALIDATION (iteration 7)

Read-only SQL against `context-index.sqlite` + the active shard proved the pivotal claim:

- Active shard: `database/vectors/context-vectors__ollama__nomic-embed-text-v1.5__768.sqlite`; mapping `memory_index.id → vec_768.id` and `→ vec_memories.rowid`.
- **All 17,326 non-success rows already have active vectors** (`vec_768` + `vec_memories`). `missing_active_vector = 0`.
- 15,152 failed rows are older than the latest row for the same canonical path+anchor (masked duplicates).
- **Conclusion:** the backlog is 100% vector-present, status-stale. The fix is metadata reconciliation; **no embedding work is required** for this DB.

(Snapshot counts drift across runs — prompt baseline `pending 10199 / success 9623 / failed 7105 / retry 40`; iteration-7/10 `failed 16344 / pending 957 / retry 25 / success 9652`. The runbook must use **live** preflight + dry-run counts, never hard-coded numbers as mutation predicates.)

---

## 7. RESOLUTION — ONE-TIME REPAIR (`memory_embedding_reconcile`)

A guarded MCP maintenance tool (dry-run default), resolving the active embedder/shard from runtime metadata (never an arbitrary caller path):

```json
{ "mode": "dry-run", "activeOnly": true, "resetMissing": true,
  "missingFailureScope": "retry-retention", "maskedFailedPolicy": "reconcile",
  "providerFailurePolicy": "report-only", "requireActiveShard": true }
```

Dry-run buckets (current expected): `vector_present_status_stale = 17326` (failed 16344 / pending 957 / retry 25); `missing_active_vector_retry_eligible = 0`; `missing_active_vector_provider_failure = 0`; diagnostic `failed_masked_by_newer_latest_path_anchor_row = 15152` (overlaps the stale bucket; policy `reconcile`, **not** prune).

Apply mode runs ONE transaction in order: (1) rows with both active vector surfaces + matching active-shard metadata → `success`, `failure_reason=NULL`; (2) only rows still missing active vectors AND (`pending`/`retry` OR `failed` with `failure_reason LIKE 'Retry retention%'`) → `retry`, `retry_count=0`. Non-retention provider failures are reported, not reset (preserves real error evidence). Full guarded SQL: `research/iterations/iteration-008.md` §F2 (and emergency-SQL fallback in `iteration-010.md` §F6).

---

## 8. OPERATOR RUNBOOK

1. **Preflight:** record live `SELECT embedding_status, COUNT(*) ... GROUP BY embedding_status`.
2. **Dry-run** `memory_embedding_reconcile` (or the guarded emergency SQL if the tool isn't implemented yet); confirm buckets match expectation.
3. **Apply** reconcile → vector-present stale rows become `success`.
4. **Only if `missing_active_vector_retry_eligible > 0`:** raise daemon env (`SPECKIT_RETRY_QUEUE_MAX_PENDING=300000`, `SPECKIT_RETRY_QUEUE_MAX_AGE_MS=3153600000000`, `BATCH=100`, `INTERVAL_MS=5000`, socket `/tmp/mk-spec-memory`), then **fully restart the lease owner** (kill `mk-spec-memory-launcher`; remove a stale lease file only if no process remains; restart through the normal launcher so `.env.local` loads at spawn) — *not* `/mcp` reconnect, *not* a lone sidecar kill — then trigger the retry drain.
5. **Verify:** `failed=pending=retry=0`, `success ≈ total`, and `success` rows retain active `vec_memories` rowid coverage.

---

## 9. DURABLE PREVENTION FIXES (prioritized)

1. **[Highest leverage] Commit reindex metadata success.** In the reindex completion transaction (`reindex.ts:440` / `reindex.js:316-318`), after `setActiveEmbedder(...)` and before `setJobStatus(...,'completed')`, mark target-profile vector-present rows `success`, clear `failure_reason`, set `embedding_generated_at`. **This one fix alone prevents the observed "drain completed but success unchanged" incident.**
2. **Make retention non-destructive for never-attempted clean `pending` rows.** Scope retention to `embedding_status='retry' OR COALESCE(retry_count,0)>0`, and process the retry queue **before** cap enforcement (`retry-manager.ts:474-508,536,997`). Prevents re-parking a clean backlog.
3. **Re-read retry config per drain; stop hardcoding daemon retry options.** Replace module-scope constants with `readRetryRuntimeConfig()`; remove context-server's hardcoded `{intervalMs:5*60*1000,batchSize:5}` (`context-server.ts:1828-1830`); document that `.env.local` edits require a lease-owner restart absent an explicit reload. Prevents stale-config respawn after env tuning.

---

## 10. DEFAULTS RECOMMENDATION

The retention defaults are unsafe for bulk backlog repair. Measured: 9,239 rows parked by pending-cap + 7,105 by max-age. **Resetting ~17,326 rows under the default cap (1000) would re-park 16,326 (94.2%) before any embedding attempt.** Recommendation: either (a) make retention non-destructive for never-attempted clean `pending` rows (fix #2 above — preferred, structural), and/or (b) raise the shipped defaults / document the bulk-repair env (`MAX_PENDING=300000`, `MAX_AGE_MS≈100y`). The env alone is insufficient without a lease-owner restart (fix #3).

---

## 11. ELIMINATED ALTERNATIVES (negative knowledge)

| Hypothesis investigated | Why eliminated | Evidence |
|---|---|---|
| The backlog is missing embeddings and needs re-embedding | All 17,326 non-success rows already have active vectors; `missing_active_vector=0` | iter 7 read-only SQL |
| `reindex --force` resets/repairs `embedding_status` | `--force` only disables incremental categorization; it is scan/save-driven and never sets failed→success | `memory-index.ts:213-218,444-528` |
| `embedder_set` or `embedder_status` commits `memory_index.embedding_status` | `embedder_set` only queues reindex; `embedder_status` is read-only over `embedder_jobs` | `embedder-set.ts:63-71`; `embedder-status.ts:68-86` |
| `/mcp` reconnect (or killing a sidecar) applies tuned env | Launcher bridges to the existing daemon with no reload hook; env frozen at module load; sidecars inherit stale env | `mk-spec-memory-launcher.cjs:414-416`; `retry-manager.ts:343-344` |
| A blind `failed → pending` reset is the safe fix | Would re-park 94.2% under default cap and erase real provider-error evidence; must scope to retention failures + reconcile vector-present first | iter 6/8 |
| Masked duplicate failed rows should be pruned by the repair tool | Out of scope/unsafe (lineage, chunk parent/child, vector coordination); reconcile to `success`, leave prune to a separate tool | iter 8 §F3 |
| The coverage-graph convergence channel would gate this loop | codex `graphEvents` didn't match the research-graph node-kind/relation schema → graph stayed empty; inline 3-signal vote drove convergence | upsert validation, iter 1 |

---

## 12. OPEN QUESTIONS & RESIDUAL RISKS

- `memory_embedding_reconcile()` is **not implemented**; iterations 8–9 define its acceptance contract — implementation + MCP registration + tests are a follow-on packet.
- The emergency SQL assumes the 768d ollama/nomic shard + `vec_768`; the tool must resolve/verify shard + dim + provider dynamically and **fail closed** on mismatch, partial/zero-dim vectors, or concurrent drain.
- Not benchmarked: drain throughput after raising batch/interval; behavior on a DB with genuinely missing vectors; restart behavior across every host MCP client.
- Snapshot counts drift; predicates must use live preflight + dry-run, not hard-coded counts.

---

## 13. NEXT STEPS

`/speckit:plan` an implementation packet covering: (1) the reindex status-commit fix (#1); (2) `memory_embedding_reconcile()` MCP tool + tests (dry-run/apply, active-shard guard, idempotency, masked-row negative test); (3) non-destructive retention (#2); (4) per-drain env re-read (#3); (5) the operator runbook as a `sk-git`/memory ops doc. Then run the runbook on the live DB to drive `failed/pending/retry → 0`.

---

<!-- ANCHOR:references -->
## 14. REFERENCES

- Iteration narratives: `research/iterations/iteration-001..010.md`; state log `research/deep-research-state.jsonl`; findings registry `research/findings-registry.json`; dashboard `research/deep-research-dashboard.md`.
- Primary code: `mcp_server/lib/providers/retry-manager.ts`; `mcp_server/lib/embedders/reindex.ts` (`dist/lib/embedders/reindex.js:316-318`); `mcp_server/handlers/embedder-set.ts`, `embedder-status.ts`; `mcp_server/handlers/memory-index.ts`; `mcp_server/handlers/save/embedding-pipeline.ts`; `mcp_server/lib/search/vector-index-mutations.ts`, `vector-index-store.ts`; `mcp_server/context-server.ts`; `.opencode/bin/mk-spec-memory-launcher.cjs`, `.opencode/bin/lib/launcher-ipc-bridge.cjs`; `mcp_server/lib/embedders/sidecar-client.ts`.
- DBs: `mcp_server/database/context-index.sqlite`; `mcp_server/database/vectors/context-vectors__ollama__nomic-embed-text-v1.5__768.sqlite`.
<!-- /ANCHOR:references -->
