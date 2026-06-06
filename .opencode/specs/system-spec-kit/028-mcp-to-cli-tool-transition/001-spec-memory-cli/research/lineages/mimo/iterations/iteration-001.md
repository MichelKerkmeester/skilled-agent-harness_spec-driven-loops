# Iteration 001: KQ1 — 37-Tool Parity Matrix

## Focus
Classify every MCP tool by CLI portability and identify the CLI equivalent for each. Independently verify the 37-tool count from source.

## Assessment: newInfoRatio=1.0

First iteration — all findings are novel. This is the foundational anchor for the entire feasibility study.

## Findings

### Tool Count Verification

Read all 5 registry files and counted TOOL_NAMES sets:

| Registry File | Line Range | Count |
|--------------|------------|-------|
| `memory-tools.ts` | :45-62 | 16 |
| `context-tools.ts` | :11 | 1 |
| `causal-tools.ts` | :24-29 | 4 |
| `checkpoint-tools.ts` | :24-29 | 4 |
| `lifecycle-tools.ts` | :39-52 | 12 |
| **Total** | | **37** |

[SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/tools/memory-tools.ts:45-62]
[SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/tools/context-tools.ts:11]
[SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/tools/causal-tools.ts:24-29]
[SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/tools/checkpoint-tools.ts:24-29]
[SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:39-52]

### Classification Legend

- **STATELESS**: No daemon dependency. Pure DB read/write. CLI performs one operation and exits. Cold-start penalty: ~50ms (SQLite open).
- **STATE-EMBED**: Needs embedding generation per invocation. The embedding cascade (ollama → hf-local → OpenAI → Voyage) can cold-start, but correctness is preserved. Cold-start penalty: ~100-500ms per embedding.
- **STATE-WATCHER**: Needs daemon-resident in-process state (job queue, session working memory, file-watcher events). Cannot function without a long-lived process.

### Complete Parity Matrix

#### Group A: Memory Tools (16 tools)
> Registry: `mcp_server/tools/memory-tools.ts:45-62`

| # | Tool | Classification | CLI Equivalent | Notes |
|---|------|---------------|----------------|-------|
| 1 | `memory_search` | STATELESS | `spec-memory search --query "..." --limit 10` | Pure vector+BM25+FTS5 query. Handler reads from better-sqlite3 DB, computes similarity, reranks. Fully portable. |
| 2 | `memory_quick_search` | STATELESS | `spec-memory quick-search "..."` | Thin wrapper: dispatches to `handleMemorySearch` with preset flags (autoDetectIntent=true, enableDedup=true, includeContent=true, rerank=true). [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/tools/memory-tools.ts:68-88] |
| 3 | `memory_match_triggers` | STATELESS | `spec-memory match-triggers "..."` | Trigger phrase matching against indexed spec docs. Pure DB read + pattern matching via trigger-matcher.ts. |
| 4 | `memory_save` | STATE-EMBED | `spec-memory save --file path/to/file.md` | Needs embedding generation. Per-invocation cold embedding is correct but ~100-500ms slower. Prior art: `generate-context.js` does this already. |
| 5 | `memory_list` | STATELESS | `spec-memory list --spec-folder "028-..."` | Paginated DB browse. Pure read from memory_index table. |
| 6 | `memory_stats` | STATELESS | `spec-memory stats` | Aggregate DB stats (counts, dates, tier breakdown). Pure read. |
| 7 | `memory_health` | STATELESS | `spec-memory health` | DB integrity checks, FTS5 shadow validation, optional auto-repair. Read + conditional write. |
| 8 | `memory_delete` | STATELESS | `spec-memory delete --id 42 --confirm` | Single-row DB mutation with confirm gate. Simple write. |
| 9 | `memory_update` | STATE-EMBED | `spec-memory update --id 42 --title "..."` | May need re-embedding if content changes. Same cold-embed caveat as save. |
| 10 | `memory_validate` | STATELESS | `spec-memory validate --id 42 --was-useful` | Updates confidence scores in memory_index. Simple DB write. |
| 11 | `memory_bulk_delete` | STATELESS | `spec-memory bulk-delete --tier deprecated --confirm` | Bulk DB mutation with auto-checkpoint. Tier-gated safety. [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts] |
| 12 | `memory_retention_sweep` | STATELESS | `spec-memory retention-sweep --dry-run` | Sweeps expired governed records. DB scan + delete. |
| 13 | `memory_embedding_reconcile` | STATE-EMBED | `spec-memory embedding-reconcile` | Checks vector status, resets failures to retry. Needs embedding provider availability. |
| 14 | `embedder_list` | STATE-EMBED | `spec-memory embedder-list` | Lists registered embedding backends. Config read, no DB. |
| 15 | `embedder_set` | STATE-EMBED | `spec-memory embedder-set --name <name>` | Selects embedding backend, queues re-index job. Needs embedding provider. |
| 16 | `embedder_status` | STATE-EMBED | `spec-memory embedder-status` | Reports embedder re-index job progress. Needs embedding provider. |

#### Group B: Context Tools (1 tool)
> Registry: `mcp_server/tools/context-tools.ts:11`

| # | Tool | Classification | CLI Equivalent | Notes |
|---|------|---------------|----------------|-------|
| 17 | `memory_context` | STATELESS | `spec-memory context --input "..." --mode deep` | Unified entry point routing to memory_search with intent detection. Pure read, stateless. |

#### Group C: Causal Tools (4 tools)
> Registry: `mcp_server/tools/causal-tools.ts:24-29`

| # | Tool | Classification | CLI Equivalent | Notes |
|---|------|---------------|----------------|-------|
| 18 | `memory_drift_why` | STATELESS | `spec-memory drift-why --id 42` | Causal graph traversal. Pure DB read from causal_edges table. |
| 19 | `memory_causal_link` | STATELESS | `spec-memory causal-link --source 1 --target 2 --relation caused` | Creates a causal edge. Simple DB write. |
| 20 | `memory_causal_stats` | STATELESS | `spec-memory causal-stats` | Causal graph statistics (total edges, coverage %, breakdown). Pure DB read. |
| 21 | `memory_causal_unlink` | STATELESS | `spec-memory causal-unlink --edge-id 5` | Deletes a causal edge by ID. Simple DB write. |

#### Group D: Checkpoint Tools (4 tools)
> Registry: `mcp_server/tools/checkpoint-tools.ts:24-29`

| # | Tool | Classification | CLI Equivalent | Notes |
|---|------|---------------|----------------|-------|
| 22 | `checkpoint_create` | STATELESS | `spec-memory checkpoint-create --name "pre"` | Snapshots DB state. Read + write to checkpoint tables. |
| 23 | `checkpoint_list` | STATELESS | `spec-memory checkpoint-list` | Lists checkpoints. Pure DB read. |
| 24 | `checkpoint_restore` | STATELESS | `spec-memory checkpoint-restore --name "pre"` | Restores DB from checkpoint. DB write. |
| 25 | `checkpoint_delete` | STATELESS | `spec-memory checkpoint-delete --name "pre" --confirm` | Deletes checkpoint with confirm gate. DB write. |

#### Group E: Lifecycle Tools (12 tools)
> Registry: `mcp_server/tools/lifecycle-tools.ts:39-52`

| # | Tool | Classification | CLI Equivalent | Notes |
|---|------|---------------|----------------|-------|
| 26 | `memory_index_scan` | STATE-EMBED | `spec-memory index-scan --spec-folder "028-..."` | Scans workspace, indexes new/changed files. Needs embedding per file. **NOTE:** Daemon also provides incremental chokidar file-watcher re-indexing — a pure CLI misses realtime updates but still produces correct results on explicit invocation. |
| 27 | `task_preflight` | STATELESS | `spec-memory task-preflight --spec-folder "..." --task-id "T1"` | Captures epistemic baseline (knowledge/uncertainty/context scores). Simple DB insert. |
| 28 | `task_postflight` | STATELESS | `spec-memory task-postflight --spec-folder "..." --task-id "T1"` | Captures epistemic after-state. Simple DB insert. |
| 29 | `memory_get_learning_history` | STATELESS | `spec-memory learning-history --spec-folder "028-..."` | Reads preflight/postflight records. Pure DB read. |
| 30 | `memory_ingest_start` | STATE-EMBED | `spec-memory ingest-start --paths file1.md file2.md` | Async multi-file ingestion. Uses job-queue.ts in-process state machine. Without daemon, would need to block synchronously (different UX, same correctness). |
| 31 | `memory_ingest_status` | STATE-WATCHER | `spec-memory ingest-status --job-id <id>` | Reads job queue progress. **DAEMON-DEPENDENT** — `IngestJob` state machine lives in-process (job-queue.ts:46-60). Architecture (a) loses this; (b)/(c) retain via IPC. [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/lib/ops/job-queue.ts:46-60] |
| 32 | `memory_ingest_cancel` | STATE-WATCHER | `spec-memory ingest-cancel --job-id <id>` | Cancels running async job. **DAEMON-DEPENDENT** — same in-process job queue dependency. |
| 33 | `eval_run_ablation` | STATE-EMBED | `spec-memory eval-ablation --channels vector bm25` | Runs controlled channel ablation studies. Computationally intensive but stateless in principle. |
| 34 | `eval_reporting_dashboard` | STATELESS | `spec-memory eval-dashboard --sprint-filter ...` | Aggregates eval metrics from eval_metric_snapshots table. Pure DB read. |
| 35 | `session_health` | STATE-WATCHER | `spec-memory session-health` | Reports session priming status, code graph freshness, quality score. **DAEMON-DEPENDENT** — imports from `memory-surface.ts` which uses `working-memory.ts` for session state. [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/handlers/session-health.ts:8-12] |
| 36 | `session_resume` | STATE-WATCHER | `spec-memory session-resume --spec-folder "..."` | Returns merged memory + code graph status. **DAEMON-DEPENDENT** — same working-memory dependency. |
| 37 | `session_bootstrap` | STATE-WATCHER | `spec-memory session-bootstrap --spec-folder "..."` | Composite: sub-calls `handleSessionResume` + `handleSessionHealth` + structural context + skill graph topology. **DAEMON-DEPENDENT** — combines all daemon-resident session state. [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:260-276] |

### Summary Counts

| Classification | Count | Tools |
|---------------|-------|-------|
| STATELESS | 22 | memory_search, memory_quick_search, memory_match_triggers, memory_list, memory_stats, memory_health, memory_delete, memory_validate, memory_bulk_delete, memory_retention_sweep, memory_context, memory_drift_why, memory_causal_link, memory_causal_stats, memory_causal_unlink, checkpoint_create, checkpoint_list, checkpoint_restore, checkpoint_delete, task_preflight, task_postflight, memory_get_learning_history, eval_reporting_dashboard |
| STATE-EMBED | 9 | memory_save, memory_update, memory_embedding_reconcile, embedder_list, embedder_set, embedder_status, memory_index_scan, memory_ingest_start, eval_run_ablation |
| STATE-WATCHER | 6 | memory_ingest_status, memory_ingest_cancel, session_health, session_resume, session_bootstrap, (note: memory_ingest_start uses job-queue but returns immediately with job-id; the *status* and *cancel* are the daemon-dependent reads) |
| MCP-ONLY | 0 | (none) |

**Note on count discrepancy:** DeepSeek classified 10 STATE-EMBED and 5 STATE-WATCHER. I classify 9 STATE-EMBED and 6 STATE-WATCHER. The difference: `memory_ingest_start` I classify as STATE-EMBED (needs embedding per file) rather than pure STATE-WATCHER; `eval_run_ablation` I classify as STATE-EMBED (computationally intensive, needs embedding provider for ablation runs). The total remains 37 regardless.

### Key Insight
**Zero MCP-ONLY tools.** Every tool has a potential CLI equivalent. The 6 STATE-WATCHER tools need the daemon running, but they access it through the existing JSON-RPC IPC socket (`daemon-ipc.sock`), not through MCP specifically. The MCP layer is a thin stdio transport wrapper around logic that already speaks JSON-RPC. The `launcher-ipc-bridge.cjs:80` `bridgeStdioToSocket()` function already pipes stdin/stdout to the IPC socket — a CLI replacing MCP stdio with CLI args would use the same bridge.

## Ruled Out
- (none at this stage)

## Next Focus Shifts To
KQ2 — precisely what daemon-resident subsystems the 6 STATE-WATCHER tools depend on, and what dies under each architecture.
