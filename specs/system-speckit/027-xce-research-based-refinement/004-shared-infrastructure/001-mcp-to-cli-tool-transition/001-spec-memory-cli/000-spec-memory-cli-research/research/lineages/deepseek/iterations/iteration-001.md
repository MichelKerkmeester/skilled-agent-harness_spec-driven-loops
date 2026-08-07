# Iteration 001: KQ1 — 37-Tool Parity Matrix

## Focus
Classify every MCP tool by CLI portability and identify the CLI equivalent for each.

## Assessment: newInfoRatio=1.0

First iteration — all findings are novel. This is the foundational anchor for the entire feasibility study.

## Findings

### Classification Legend
- **STATELESS**: Tool has no daemon dependency; pure DB read/write. CLI performs one operation and exits.
- **STATE-EMBED**: Tool needs embedding generation but can cold-start per invocation (higher latency, no correctness loss).
- **STATE-WATCHER**: Tool needs daemon-resident state (file-watcher, async retry queue, warm model server, session context).
- **MCP-ONLY**: Feature exists solely because of the MCP protocol transport — no meaningful CLI equivalent possible.

### Complete Parity Matrix

#### Group A: Memory Tools (16 tools)
> Registry: `mcp_server/tools/memory-tools.ts:45-62` [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/tools/memory-tools.ts:45]

| # | Tool | Classification | CLI Equivalent | Notes |
|---|------|---------------|----------------|-------|
| 1 | `memory_search` | STATELESS | `spec-memory search --query "..." --limit 10` | Pure vector+BM25+FTS5 query. DB reads only. The handler reads from better-sqlite3 DB, computes similarity, reranks. Fully portable. |
| 2 | `memory_quick_search` | STATELESS | `spec-memory quick-search "..."` | Thin wrapper over memory_search with preset flags (autoDetectIntent, enableDedup, includeContent, rerank). Same handler. |
| 3 | `memory_match_triggers` | STATELESS | `spec-memory match-triggers "..."` | Trigger phrase matching against indexed spec docs. Pure DB read + pattern matching. |
| 4 | `memory_save` | STATE-EMBED | `spec-memory save --file path/to/file.md` | Needs embedding generation (ollama → hf-local → OpenAI → Voyage cascade). Per-invocation cold embedding is correct but ~100-500ms slower than warm daemon. Prior art: `generate-context.js` does this already. |
| 5 | `memory_list` | STATELESS | `spec-memory list --spec-folder "028-..."` | Paginated DB browse. Pure read. |
| 6 | `memory_stats` | STATELESS | `spec-memory stats` | Aggregate DB stats. Pure read. |
| 7 | `memory_health` | STATELESS | `spec-memory health` | DB integrity checks, FTS5 shadow validation. Pure read + optional auto-repair. |
| 8 | `memory_delete` | STATELESS | `spec-memory delete --id 42 --confirm` | Single-row DB mutation. Simple write. |
| 9 | `memory_update` | STATE-EMBED | `spec-memory update --id 42 --title "..."` | May need re-embedding if content changes. Same cold-embed caveat as save. |
| 10 | `memory_validate` | STATELESS | `spec-memory validate --id 42 --was-useful` | Updates confidence scores. Simple DB write. |
| 11 | `memory_bulk_delete` | STATELESS | `spec-memory bulk-delete --tier deprecated --confirm` | Bulk DB mutation with auto-checkpoint. Simple write. |
| 12 | `memory_retention_sweep` | STATELESS | `spec-memory retention-sweep --dry-run` | Sweeps expired governed records. Simple DB scan + delete. |
| 13 | `memory_embedding_reconcile` | STATE-EMBED | `spec-memory embedding-reconcile` | Checks vector status and resets failures to retry. Needs embedding provider availability. |
| 14 | `embedder_list` | STATE-EMBED | `spec-memory embedder-list` | Lists registered embedding backends. Config read, no DB. |
| 15 | `embedder_set` | STATE-EMBED | `spec-memory embedder-set --name <name>` | Selects embedding backend, queues re-index. Needs embedding provider. |
| 16 | `embedder_status` | STATE-EMBED | `spec-memory embedder-status` | Reports embedder re-index job progress. Needs embedding provider. |

#### Group B: Context Tools (1 tool)
> Registry: `mcp_server/tools/context-tools.ts:11` [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/tools/context-tools.ts:11]

| # | Tool | Classification | CLI Equivalent | Notes |
|---|------|---------------|----------------|-------|
| 17 | `memory_context` | STATELESS | `spec-memory context --input "..." --mode deep` | Unified entry point routing to memory_search with intent detection. Pure read, stateless. |

#### Group C: Causal Tools (4 tools)
> Registry: `mcp_server/tools/causal-tools.ts:24-29` [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/tools/causal-tools.ts:24]

| # | Tool | Classification | CLI Equivalent | Notes |
|---|------|---------------|----------------|-------|
| 18 | `memory_drift_why` | STATELESS | `spec-memory drift-why --id 42` | Causal graph traversal. Pure DB read. |
| 19 | `memory_causal_link` | STATELESS | `spec-memory causal-link --source 1 --target 2 --relation caused` | Creates a causal edge. Simple DB write. |
| 20 | `memory_causal_stats` | STATELESS | `spec-memory causal-stats` | Causal graph statistics. Pure DB read. |
| 21 | `memory_causal_unlink` | STATELESS | `spec-memory causal-unlink --edge-id 5` | Deletes a causal edge. Simple DB write. |

#### Group D: Checkpoint Tools (4 tools)
> Registry: `mcp_server/tools/checkpoint-tools.ts:24-29` [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/tools/checkpoint-tools.ts:24]

| # | Tool | Classification | CLI Equivalent | Notes |
|---|------|---------------|----------------|-------|
| 22 | `checkpoint_create` | STATELESS | `spec-memory checkpoint-create --name "pre"` | Snapshots DB state. Simple read+write. |
| 23 | `checkpoint_list` | STATELESS | `spec-memory checkpoint-list` | Lists checkpoints. Pure DB read. |
| 24 | `checkpoint_restore` | STATELESS | `spec-memory checkpoint-restore --name "pre"` | Restores DB from checkpoint. DB write. |
| 25 | `checkpoint_delete` | STATELESS | `spec-memory checkpoint-delete --name "pre" --confirm` | Deletes checkpoint. DB write. |

#### Group E: Lifecycle Tools (12 tools)
> Registry: `mcp_server/tools/lifecycle-tools.ts:39-52` [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:39]

| # | Tool | Classification | CLI Equivalent | Notes |
|---|------|---------------|----------------|-------|
| 26 | `memory_index_scan` | STATE-EMBED | `spec-memory index-scan --spec-folder "028-..."` | Scans workspace, indexes new/changed files. Needs embedding generation per file. Per-invocation is correct but slower. **NOTE:** The daemon also provides incremental chokidar file-watcher re-indexing — a pure CLI would miss realtime updates. |
| 27 | `task_preflight` | STATELESS | `spec-memory task-preflight --spec-folder "..." --task-id "T1" --knowledge 70 --uncertainty 30 --context 80` | Captures epistemic baseline. Simple DB insert. |
| 28 | `task_postflight` | STATELESS | `spec-memory task-postflight --spec-folder "..." --task-id "T1" --knowledge 90 --uncertainty 10 --context 95` | Captures epistemic after-state. Simple DB insert. |
| 29 | `memory_get_learning_history` | STATELESS | `spec-memory learning-history --spec-folder "028-..."` | Reads preflight/postflight records. Pure DB read. |
| 30 | `memory_ingest_start` | STATE-EMBED | `spec-memory ingest-start --paths file1.md file2.md` | Async multi-file ingestion. Needs job queue state (daemon-managed) AND embedding per file. Without daemon, would block until complete (synchronous CLI). |
| 31 | `memory_ingest_status` | STATE-WATCHER | `spec-memory ingest-status --job-id <id>` | Reads job queue progress. **DAEMON-DEPENDENT** — job queue lives in the daemon process. Architecture (a) loses this; (b)/(c) retain via IPC. |
| 32 | `memory_ingest_cancel` | STATE-WATCHER | `spec-memory ingest-cancel --job-id <id>` | Cancels running async job. **DAEMON-DEPENDENT** — same as above. |
| 33 | `eval_run_ablation` | STATE-EMBED | `spec-memory eval-ablation --channels vector bm25` | Runs controlled channel ablation studies. Computationally intensive but stateless in principle. |
| 34 | `eval_reporting_dashboard` | STATELESS | `spec-memory eval-dashboard --sprint-filter ...` | Aggregates eval metrics. Pure DB read. |
| 35 | `session_health` | STATE-WATCHER | `spec-memory session-health` | Reports session priming status, code graph freshness. **DAEMON-DEPENDENT** — session context (working memory, attention decay, session-bootstrap state) lives in the daemon. |
| 36 | `session_resume` | STATE-WATCHER | `spec-memory session-resume --spec-folder "..."` | Returns merged memory + code graph status. **DAEMON-DEPENDENT** — same session-state dependency. |
| 37 | `session_bootstrap` | STATE-WATCHER | `spec-memory session-bootstrap --spec-folder "..."` | Complete session bootstrap with memory context + code graph + structural hints. **DAEMON-DEPENDENT** — combines memory search + session priming + code graph readiness in one call. |

### Summary Counts

| Classification | Count | Tools |
|---------------|-------|-------|
| STATELESS | 22 | memory_search, memory_quick_search, memory_match_triggers, memory_list, memory_stats, memory_health, memory_delete, memory_validate, memory_bulk_delete, memory_retention_sweep, memory_context, memory_drift_why, memory_causal_link, memory_causal_stats, memory_causal_unlink, checkpoint_create, checkpoint_list, checkpoint_restore, checkpoint_delete, task_preflight, task_postflight, memory_get_learning_history, eval_reporting_dashboard |
| STATE-EMBED | 10 | memory_save, memory_update, memory_embedding_reconcile, embedder_list, embedder_set, embedder_status, memory_index_scan, memory_ingest_start, eval_run_ablation |
| STATE-WATCHER | 5 | memory_ingest_status, memory_ingest_cancel, session_health, session_resume, session_bootstrap |

### Key Insight
**Zero MCP-ONLY tools.** Every tool has a potential CLI equivalent. The 5 STATE-WATCHER tools need the daemon running, but they access it through the existing JSON-RPC IPC socket, not through MCP specifically. The MCP layer is a thin stdio transport wrapper around logic that already speaks JSON-RPC over `daemon-ipc.sock`.

## Ruled Out
- (none)

## Next Focus Shifts To
KQ2 — precisely what dies when the daemon is absent (architecture a) vs present (architectures b/c). The 5 STATE-WATCHER tools + daemon services need mapping.
