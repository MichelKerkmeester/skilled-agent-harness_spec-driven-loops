---
title: Deep Research Strategy - mk-spec-memory embedding-backlog drain investigation
description: Session tracking for the convergence-gated deep-research loop into mk-spec-memory re-embed non-convergence.
---

# Deep Research Strategy - Session Tracking (Session rsr-2026-05-26T20-43-39Z)

Persistent brain for the deep-research session investigating why a bulk re-embed of the mk-spec-memory store cannot be driven to `0 failed / 0 pending`. Executor: cli-codex `gpt-5.5`, reasoning `xhigh`, service tier `standard` (normal speed), sandbox `workspace-write`. Reducer refreshes machine-owned sections after each iteration.

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose
Establish the definitive root cause(s) of mk-spec-memory re-embed non-convergence (retry-queue retention parking + reindex/embedder_set status-commit interaction + persistent-daemon env-config-reload / stale-worker respawn) and a reproducible drain procedure to reach 0 failed / 0 pending.

### Usage
- **Init:** Orchestrator populated Topic, Key Questions, Non-Goals, Stop Conditions, Known Context, and Research Boundaries from config and in-session knowledge of the 026 reorg embedding incident.
- **Per iteration:** cli-codex gpt-5.5 xhigh (standard tier) reads Next Focus, writes iteration evidence to `iterations/iteration-NNN.md`, appends a JSONL record + delta file, and the reducer refreshes machine-owned anchors afterward.
- **Mutability:** Sections 1, 2, 4, 5, 12, 13 are stable; sections 3, 6, 7, 8, 9, 10, 11 are rewritten by the reducer each iteration.
<!-- /ANCHOR:overview -->

<!-- ANCHOR:topic -->
## 2. TOPIC
mk-spec-memory embedding-backlog drain and daemon-config investigation: definitive root cause of re-embed non-convergence (retry-queue retention parking + reindex/embedder_set status-commit interaction + persistent-daemon env-config-reload / stale-worker respawn) and a reproducible drain procedure to reach 0 failed / 0 pending.
<!-- /ANCHOR:topic -->

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [ ] Q1: What is the exact mechanism by which pending embeddings become `failed`? Trace `enforceRetryRetentionLimits()` in `retry-manager.js` — which rows are parked (pending-cap vs max-age), in what order, and against which `embedding_status` set?
- [ ] Q2: Does the retry-manager ever embed clean `pending` rows (retry_count=0), or only drain its own retry queue? What component is responsible for the initial `pending -> success` transition vs `pending -> retry/failed`?
- [ ] Q3: How does `reindex --force` decide what to (re)embed, and why does it report `Indexed/Updated: 0` and skip rows already marked `failed`? Is status reset part of `--force`?
- [ ] Q4: What does `embedder_set(name)` actually do — does it write vectors to the shard, commit `embedding_status`, and flip the active pointer only on full success? Where can statuses fail to "stick"?
- [ ] Q5: What is the daemon lifecycle (`mk-spec-memory-launcher.cjs` + IPC bridge + worker processes)? Does it reload env config on `/mcp` reconnect or only on full process restart? Why do killed stale workers respawn with stale config?
- [ ] Q6: What is the minimal, reproducible operator procedure (correct restart + env + embed trigger) that drives a large backlog to 0 failed / 0 pending without re-parking — and should the cap(1000)/max-age(24h) defaults change?

<!-- /ANCHOR:key-questions -->

<!-- ANCHOR:non-goals -->
## 4. NON-GOALS
- Implementing the fix (this packet is research only; implementation is a follow-on `/speckit:plan`).
- Redesigning the embedding provider cascade (ADR-014) or switching the active embedder.
- Changing the vector-shard storage architecture (separate `context-vectors__*.sqlite` shards).
- Investigating unrelated memory features (search ranking, causal graph) except where they touch embedding-status reconciliation.
<!-- /ANCHOR:non-goals -->

<!-- ANCHOR:stop-conditions -->
## 5. STOP CONDITIONS
- Root cause of non-convergence identified with code-level evidence (file:line) across retry-manager, reindex, embedder_set, and daemon lifecycle.
- A reproducible drain procedure documented and reconciled against the observed DB state.
- Convergence (newInfoRatio < 0.05 sustained) OR 10 iterations reached.
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
Q1: What is the exact mechanism by which pending embeddings become `failed`? Trace `enforceRetryRetentionLimits()` in `retry-manager.js` — which rows are parked (pending-cap vs max-age), in what order, and against which `embedding_status` set?

<!-- /ANCHOR:next-focus -->
<!-- MACHINE-OWNED: END -->

## 12. KNOWN CONTEXT

Observed state and prior findings (from the 026 reorg session that surfaced this issue; treat as starting evidence, verify against code):

- **DB**: `memory_index.embedding_status` in `.../mcp_server/database/context-index.sqlite`; embedding vectors live in SEPARATE shards `database/vectors/context-vectors__*.sqlite` (`vec_memories`), not the main index. Active embedder: `nomic-embed-text-v1.5` (ollama, 768d). 4 vector DBs present (bge-base, nomic-local, ollama-768, ollama-1024).
- **Retry-manager** (`mcp_server/lib/providers/retry-manager.js`, dist mirror under `mcp_server/dist/...`): `MAX_RETRY_QUEUE_PENDING = parsePositiveIntEnv('SPECKIT_RETRY_QUEUE_MAX_PENDING', 1000)`; `MAX_RETRY_QUEUE_AGE_MS = parsePositiveIntEnv('SPECKIT_RETRY_QUEUE_MAX_AGE_MS', 24*60*60*1000)`. `enforceRetryRetentionLimits()` parks rows as "Retry retention pending cap exceeded" / "Retry retention max age exceeded". Drain processes `embedding_status IN ('pending','retry')`; batch `SPECKIT_RETRY_BATCH_SIZE=5`, interval `SPECKIT_RETRY_INTERVAL_MS=5min` (defaults).
- **Config now tuned** in all MCP configs: pending cap raised to 300000, max-age to ~100y, batch 100, interval 5s.
- **reindex**: `spec-kit-cli reindex --force` is content-driven; observed `Indexed/Updated: 0` (skips unchanged/failed-status rows).
- **embedder_set(name)** MCP tool queues a background reindex; flips the active pointer after full success.
- **Daemon**: persistent multi-client bridge (`mk-spec-memory-launcher.cjs`, IPC under `SPECKIT_IPC_SOCKET_DIR=/tmp/mk-spec-memory`). macOS sun_path 104-char limit forces the short `/tmp` socket dir. `/mcp` reconnect re-links the client but does NOT restart the daemon; stale-config daemon processes persisted and respawned, re-parking rows even after config + reconnect.
- **Observed counts (fresh, 2026-05-26T20:43Z, after BOTH background drain monitors exited 0)**: `pending 10,199 | success 9,623 | failed 7,105 | retry 40` (total 26,967) in `context-index.sqlite`. KEY EVIDENCE: success is UNCHANGED from before the monitors ran — the drain "completed" (exit 0) yet drove **zero** rows to `success`. The non-convergence is real and reproducible: a completed drain pass does not increase `success`.
- **Memory note**: `memory_context()` was NOT queried at init because the embedding subsystem under study is the degraded component; iterations read the code/DB directly.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 10
- Convergence threshold: 0.05
- Per-iteration budget: 14 tool calls, 30 minutes
- Progressive synthesis: true
- research/research.md ownership: workflow-owned canonical synthesis output
- Executor: cli-codex gpt-5.5 / xhigh / service_tier=standard / sandbox=workspace-write / timeout 1800s
- Lifecycle branches: `resume`, `restart` (live)
- Machine-owned sections: reducer controls Sections 3, 6, 7-11
- Canonical pause sentinel: `research/.deep-research-pause`
- Current generation: 1
- Started: 2026-05-26T20:43:39Z
