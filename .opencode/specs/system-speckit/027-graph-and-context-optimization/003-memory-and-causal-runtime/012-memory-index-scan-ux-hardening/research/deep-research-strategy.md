---
title: Deep Research Strategy - memory_index_scan UX hardening
description: Session tracking for the convergence-gated deep-research loop into making the spec-kit memory indexing subsystem future-proof, best-UX, and hardened in all situations.
---

# Deep Research Strategy - Session Tracking

Persistent brain for the deep-research session designing a future-proof, foot-gun-proof, always-completing, self-healing memory indexing subsystem (`memory_index_scan` + the embedding-index pipeline). Executor: cli-codex `gpt-5.5`, reasoning `xhigh`, service tier `fast`. Reducer refreshes machine-owned sections after each iteration. DESIGN research only — no production code changes.

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose
Produce evidence-backed design recommendations (with tradeoffs) for a memory indexing subsystem where: no caller can foot-gun it (the 30s scan lease never surfaces a raw E429), a full scan/re-embed always completes regardless of repo size (no `force:true`-on-big-root `-32001` timeout), concurrent writers coordinate cleanly, the embedder being slow/absent degrades gracefully instead of failing the scan, and the index self-heals after spec-folder moves (no orphan File-not-found rows).

### Usage
- **Init:** Topic, Key Questions, Non-Goals, Stop Conditions, Known Context, and Research Boundaries populated from config + in-session evidence (today's E429/timeout/orphan root-causing).
- **Per iteration:** cli-codex gpt-5.5 xhigh (fast tier) reads Next Focus, writes iteration evidence to `iterations/iteration-NNN.md`, appends a JSONL record + delta file, and the reducer refreshes machine-owned anchors afterward.
- **Mutability:** Sections 1, 2, 4, 5, 12, 13 are stable; sections 3, 6, 7, 8, 9, 10, 11 are rewritten by the reducer each iteration.
<!-- /ANCHOR:overview -->

<!-- ANCHOR:topic -->
## 2. TOPIC
Make the spec-kit memory indexing subsystem (`memory_index_scan` + embedding-index pipeline) future-proof, best-UX, and hardened in all situations: no caller foot-guns, never times out regardless of repo size, self-heals after spec-folder moves, degrades gracefully when the embedder is slow/absent. Output design recommendations + tradeoffs per angle that a later implementation packet can execute.
<!-- /ANCHOR:topic -->

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [ ] A1 SCAN LIFECYCLE & CALLER CONTRACT: Is the synchronous request/response shape right for a scan that holds a global lease AND does unbounded embedding work under a fixed MCP deadline? Compare (i) current sync+lease+30s-cooldown, (ii) async job model (jobId + poll, mirroring embedder_status), (iii) auto-coalescing/idempotent scan returning the in-flight job instead of E429, (iv) streaming progress. Recommend a caller-facing contract where a scan is ALWAYS safe + idempotent and the cooldown is an internal thrash-guard, never a user-visible error.
- [ ] A2 UNBOUNDED-WORK / TIMEOUT HARDENING: Make "scan or re-embed everything" always complete regardless of tree size — chunked/resumable batches, checkpointed work-queue, deferred async vector embedding (commit FTS/text rows immediately, vectors via pending/retry status), per-call work caps with continuation cursors. Eliminate the `force:true`-on-big-root `-32001` timeout class entirely.
- [ ] A3 CONCURRENCY & MULTI-WRITER: With N agents/sessions/daemons (+ worktree-per-session), define correct lease semantics under contention, single-writer guarantees, and what a 2nd concurrent caller should EXPERIENCE (queue / coalesce / fast-return with retry-after auto-honored) instead of a raw E429. Cover IPC bridge (`SPECKIT_MAX_SECONDARY_CLIENTS`) + cross-session coordination.
- [ ] A4 EMBEDDER RESILIENCE & DEGRADED-MODE INDEXING: Graceful degradation so a scan NEVER fails wholesale on embedder trouble (cold-load, circuit-breaker cooldown, ENOSPC, model-load wedge, per-row POSTs) — commit lexical/FTS rows first + defer vectors to bounded async retry, optimal batch sizing, circuit-breaker/backoff UX, and surfacing "embeddings lagging but search still works" rather than erroring.
- [ ] A5 SELF-HEALING & OBSERVABILITY: Close the orphan-row + freshness gap — rename/move reconciliation (path move vs delete+add so renests don't orphan rows), orphan GC/sweep for File-not-found rows, an index-freshness/health surface (extend memory_health or a /doctor index view: indexed-vs-on-disk counts, stale rows, pending-embedding backlog), and auto-reindex triggers (post-commit hook / mtime watch). Directly closes this session's orphaned old-path rows.

<!-- /ANCHOR:key-questions -->

<!-- ANCHOR:non-goals -->
## 4. NON-GOALS
- Implementing the fix (this packet is DESIGN research only; implementation is a follow-on `/speckit:plan`).
- Switching the active embedder or redesigning the provider cascade.
- Changing the vector-shard storage architecture.
- Re-litigating the already-shipped embedding-stack hardening (011) or daemon-lifecycle healing (014) except where their mechanisms inform this design.
<!-- /ANCHOR:non-goals -->

<!-- ANCHOR:stop-conditions -->
## 5. STOP CONDITIONS
- All five angles reach an evidence-backed design recommendation (file:line citations for current behavior + concrete proposed contract/mechanism + tradeoffs).
- Convergence (newInfoRatio < 0.05 sustained) OR 5 iterations reached.
<!-- /ANCHOR:stop-conditions -->

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
[None yet]

<!-- /ANCHOR:answered-questions -->

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
[None yet]

<!-- /ANCHOR:what-worked -->

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
[None yet]

<!-- /ANCHOR:what-failed -->

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
[No exhausted approach categories yet]

<!-- /ANCHOR:exhausted-approaches -->

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
[None yet]

<!-- /ANCHOR:ruled-out-directions -->

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
A1 SCAN LIFECYCLE & CALLER CONTRACT: Is the synchronous request/response shape right for a scan that holds a global lease AND does unbounded embedding work under a fixed MCP deadline? Compare (i) current sync+lease+30s-cooldown, (ii) async job model (jobId + poll, mirroring embedder_status), (iii) auto-coalescing/idempotent scan returning the in-flight job instead of E429, (iv) streaming progress. Recommend a caller-facing contract where a scan is ALWAYS safe + idempotent and the cooldown is an internal thrash-guard, never a user-visible error.

<!-- /ANCHOR:next-focus -->
<!-- MACHINE-OWNED: END -->

## 12. KNOWN CONTEXT

Starting evidence (from this session; verify against code during iterations):

- **E429 root cause:** `INDEX_SCAN_COOLDOWN = 30000` (hardcoded, `mcp_server/core/config.ts:126`, NOT env-overridable). `handlers/memory-index.ts` ~line 242 calls `acquireIndexScanLease({now, cooldownMs: INDEX_SCAN_COOLDOWN})` (`core/db-state.ts`); a 2nd scan within 30s returns `code: 'E429'` with `waitSeconds`. Back-to-back per-folder scan loops self-collide.
- **Timeout class:** a `force:true, incremental:false` scan on the large 026 root (~674 docs) recomputes all embeddings synchronously under one MCP request deadline → `-32001` Request timed out. Incremental (default) cache-hits unchanged files and is fast.
- **Orphan rows:** after this session's folder renest, moved spec folders left index rows whose file path no longer exists (`contentError: "File not found"` on read; e.g. stale `system-spec-kit/031-embedding-stack-hardening/spec.md`). No rename/move reconciliation or orphan GC.
- **Existing building blocks the design can reuse:** DB models `pending`/`retry` `embedding_status` (`lib/providers/retry-manager.ts`); async job surface already exists for `embedder_status` (jobId + progress + eta); batch tunables `SPECKIT_EMBED_CLIENT_MAX_BATCH` (256), `EMBEDDER_REINDEX_BATCH_SIZE` (50), `SPECKIT_EMBEDDING_CB_COOLDOWN_MS` (60000); IPC bridge cap `SPECKIT_MAX_SECONDARY_CLIENTS` (8); scan batch `SPEC_KIT_BATCH_SIZE` (5).
- **Provider:** ollama/nomic-embed-text-v1.5 (768d) active; cold-load 15-120s; hf-local has crash-loop cooldown + ENOSPC-resilient writes (per ENV_REFERENCE).
- **memory_context NOT queried at init** — the indexing subsystem under study is the component in question; iterations read code/DB directly.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 5
- Convergence threshold: 0.05
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: true
- research/research.md ownership: workflow-owned canonical synthesis output
- Executor: cli-codex gpt-5.5 / xhigh / service_tier=fast / timeout 900s
- Lifecycle branches: `resume`, `restart` (live)
- Machine-owned sections: reducer controls Sections 3, 6, 7-11
- Canonical pause sentinel: `research/.deep-research-pause`
- Current generation: 1
