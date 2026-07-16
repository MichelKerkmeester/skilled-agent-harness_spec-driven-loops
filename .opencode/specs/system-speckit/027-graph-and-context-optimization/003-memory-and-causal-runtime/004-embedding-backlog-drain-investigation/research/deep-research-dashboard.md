---
title: Deep Research Dashboard
description: Auto-generated reducer view over the research packet.
---

# Deep Research Dashboard - Session Overview

Auto-generated from JSONL state log, iteration files, findings registry, and strategy state. Never manually edited.

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Reducer-generated observability surface for the active research packet.

<!-- /ANCHOR:overview -->
<!-- ANCHOR:status -->
## 2. STATUS
- Topic: mk-spec-memory embedding-backlog drain and daemon-config investigation: why a bulk re-embed cannot drive all rows to embedding_status=success (retry-queue retention parking, reindex/embedder_set status-commit interaction, daemon env-config-reload + worker respawn)
- Started: 2026-05-26T20:43:39Z
- Status: INITIALIZED
- Iteration: 10 of 10
- Session ID: rsr-2026-05-26T20-43-39Z
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| undefined | Trace the embedding-status state machine end-to-end. Map every code path that writes embedding_status across retry-manager, reindex, and embedder_set/embedder-status handlers. | - | 0.74 | 0 | insight |
| undefined | Q1: What is the exact mechanism by which pending embeddings become failed? Trace enforceRetryRetentionLimits() in retry-manager.js: which rows are parked (pending-cap vs max-age), in what order, and against which embedding_status set? | - | 0.56 | 0 | complete |
| undefined | Q1: What is the exact mechanism by which pending embeddings become failed? Trace enforceRetryRetentionLimits() in retry-manager.js: which rows are parked by pending-cap vs max-age, in what order, and against which embedding_status set? | - | 0.34 | 0 | complete |
| undefined | Q4 + Q5: embedder_set/startReindex status-commit interaction and daemon env-config reload lifecycle | - | 0.76 | 0 | insight |
| undefined | RECONCILE observed non-convergence with the code model + start the operator runbook | - | 0.68 | 0 | insight |
| undefined | Close Q3 + finalize the runbook + defaults recommendation | - | 0.64 | 0 | insight |
| undefined | Empirically validate F4 with read-only SQL: identify active nomic 768d shard, quantify vector-present vs missing backlog rows, verify failed latest-row masking, and refine reconcile predicates. | - | 0.51 | 0 | insight |
| undefined | CONSOLIDATION: convert validated active-vector and masking evidence into an implementation-ready acceptance spec for memory_embedding_reconcile(). | - | 0.24 | 0 | complete |
| undefined | CONSOLIDATION: separate one-time DB repair from durable prevention, define reindex/retention/daemon fixes, and cover memory_embedding_reconcile risks. | - | 0.18 | 0 | complete |
| undefined | Iteration 10 final consolidation: close Q1-Q6, operator runbook, durable prevention fixes, and residual risks for synthesis. | - | 0.12 | 0 | complete |

- iterationsCompleted: 10
- keyFindings: 81
- openQuestions: 6
- resolvedQuestions: 0

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 0/6
- [ ] Q1: What is the exact mechanism by which pending embeddings become `failed`? Trace `enforceRetryRetentionLimits()` in `retry-manager.js` — which rows are parked (pending-cap vs max-age), in what order, and against which `embedding_status` set?
- [ ] Q2: Does the retry-manager ever embed clean `pending` rows (retry_count=0), or only drain its own retry queue? What component is responsible for the initial `pending -> success` transition vs `pending -> retry/failed`?
- [ ] Q3: How does `reindex --force` decide what to (re)embed, and why does it report `Indexed/Updated: 0` and skip rows already marked `failed`? Is status reset part of `--force`?
- [ ] Q4: What does `embedder_set(name)` actually do — does it write vectors to the shard, commit `embedding_status`, and flip the active pointer only on full success? Where can statuses fail to "stick"?
- [ ] Q5: What is the daemon lifecycle (`mk-spec-memory-launcher.cjs` + IPC bridge + worker processes)? Does it reload env config on `/mcp` reconnect or only on full process restart? Why do killed stale workers respawn with stale config?
- [ ] Q6: What is the minimal, reproducible operator procedure (correct restart + env + embed trigger) that drives a large backlog to 0 failed / 0 pending without re-parking — and should the cap(1000)/max-age(24h) defaults change?

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 6
- [ ] Q1: What is the exact mechanism by which pending embeddings become `failed`? Trace `enforceRetryRetentionLimits()` in `retry-manager.js` — which rows are parked (pending-cap vs max-age), in what order, and against which `embedding_status` set?
- [ ] Q2: Does the retry-manager ever embed clean `pending` rows (retry_count=0), or only drain its own retry queue? What component is responsible for the initial `pending -> success` transition vs `pending -> retry/failed`?
- [ ] Q3: How does `reindex --force` decide what to (re)embed, and why does it report `Indexed/Updated: 0` and skip rows already marked `failed`? Is status reset part of `--force`?
- [ ] Q4: What does `embedder_set(name)` actually do — does it write vectors to the shard, commit `embedding_status`, and flip the active pointer only on full success? Where can statuses fail to "stick"?
- [ ] Q5: What is the daemon lifecycle (`mk-spec-memory-launcher.cjs` + IPC bridge + worker processes)? Does it reload env config on `/mcp` reconnect or only on full process restart? Why do killed stale workers respawn with stale config?
- [ ] Q6: What is the minimal, reproducible operator procedure (correct restart + env + embed trigger) that drives a large backlog to 0 failed / 0 pending without re-parking — and should the cap(1000)/max-age(24h) defaults change?

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- Last 3 ratios: 0.24 -> 0.18 -> 0.12
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.12
- coverageBySources: {"other":16}

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- None yet

<!-- /ANCHOR:dead-ends -->
<!-- ANCHOR:next-focus -->
## 7. NEXT FOCUS
Q1: What is the exact mechanism by which pending embeddings become `failed`? Trace `enforceRetryRetentionLimits()` in `retry-manager.js` — which rows are parked (pending-cap vs max-age), in what order, and against which `embedding_status` set?

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 8. ACTIVE RISKS
- None active beyond normal research uncertainty.

<!-- /ANCHOR:active-risks -->
<!-- ANCHOR:blocked-stops -->
## 9. BLOCKED STOPS
No blocked-stop events recorded.

<!-- /ANCHOR:blocked-stops -->
<!-- ANCHOR:graph-convergence -->
## 10. GRAPH CONVERGENCE
- graphConvergenceScore: 0.00
- graphDecision: CONTINUE
- graphBlockers: none recorded

<!-- /ANCHOR:graph-convergence -->
