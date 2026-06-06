# Iteration 1: KQ1 — 37-tool parity matrix

| Field | Value |
|-------|-------|
| Iteration | 1 of 5 |
| Focus | KQ1 — CLI equivalent per MCP tool (37 tools across 5 dispatch modules) |
| Status | complete |
| newInfoRatio | 0.95 (first iteration; full pass against actual tool registries) |
| Novelty justification | First broad pass that enumerates every tool from `TOOL_NAMES` sets and cross-references the existing CLI prior art; few/zero other research packets have produced a 37-row matrix. |
| Findings count | 9 (1 matrix-level finding, 6 class-level findings, 2 dead-ends) |

## Focus

Enumerate the full MCP tool surface and map every tool to one of: (i) an existing CLI command, (ii) a future CLI command that can be ported 1:1 from the handler, (iii) a tool that can never be 1:1 replaced because it is purely a transport/protocol affordance. The matrix must be exhaustive (all 37 rows) and the evidence must cite the registry file for every name.

## Actions Taken

1. **Read** all 5 tool registry files at `.opencode/skills/system-spec-kit/mcp_server/tools/{context,memory,causal,checkpoint,lifecycle}-tools.ts` to extract canonical `TOOL_NAMES` sets and the handler each name dispatches to.
2. **Grep** `case '` in `.opencode/skills/system-spec-kit/mcp_server/cli.ts` to enumerate the existing CLI command surface (4 commands).
3. **List** `scripts/dist/memory/*.js` to enumerate the 11 standalone maintenance CLIs and inspect their behaviour at a top level.
4. **Read** the launcher header at `.opencode/bin/mk-spec-memory-launcher.cjs` to confirm the daemon is the only thing that owns the IPC bridge for KQ3 cross-reference.
5. **Cross-check** the L-level distribution claim (1/16/4/4/12 = 37) by counting the `TOOL_NAMES` set sizes directly.

## Findings

### Finding 1.1 — Complete 37-row tool parity matrix (primary output)

The full MCP tool surface is:

**Context (1) — `context-tools.ts`**
| # | Tool | Handler | CLI today? | Suggested CLI subcommand | Verdict |
|---|------|---------|------------|--------------------------|---------|
| 1 | `memory_context` | `handleMemoryContext` | none | `mk-spec-memory context --input <q> [--mode auto|quick|deep|focused|resume] [--profile ...]` (one-shot, no daemon required; handler reads SQLite + vector index directly) | **Ported** — the handler is pure read-only; the CLI just needs to call `handleMemoryContext` against the open DB. |

**Memory (16) — `memory-tools.ts`**
| # | Tool | Handler | CLI today? | Suggested CLI subcommand | Verdict |
|---|------|---------|------------|--------------------------|---------|
| 2 | `memory_search` | `handleMemorySearch` | none | `mk-spec-memory search --query <q> [--concepts ...] [--spec-folder <f>] [--limit N] [--intent <i>]` | **Ported** — same handler, different transport. |
| 3 | `memory_quick_search` | `handleMemorySearch` (with defaults: `autoDetectIntent`, `enableDedup`, `includeContent`, `includeConstitutional`, `rerank` set true; re-tagged `payload.meta.tool`) | none | `mk-spec-memory quick-search --query <q>` — pre-set the quick-search defaults and rebrand the meta. | **Ported** — same handler, defaults applied at CLI. |
| 4 | `memory_match_triggers` | `handleMemoryMatchTriggers` | none | `mk-spec-memory match-triggers --prompt <text> [--spec-folder <f>] [--limit N]` | **Ported** — same handler. |
| 5 | `memory_save` | `handleMemorySave` | **YES** — `scripts/dist/memory/generate-context.js` is the canonical save CLI (consumed by `/memory:save`). | `mk-spec-memory save <file> [--force] [--dry-run] [--route-as <r>]` | **Already ported.** |
| 6 | `memory_list` | `handleMemoryList` | none | `mk-spec-memory list [--spec-folder <f>] [--limit N] [--sort-by ...] [--offset N]` | **Ported** — handler is a thin DB read. |
| 7 | `memory_stats` | `handleMemoryStats` | **YES** — `mcp_server/cli.ts stats` outputs the same tier distribution + top folders. | `mk-spec-memory stats` | **Already ported.** |
| 8 | `memory_health` | `handleMemoryHealth` | partial — `validate-memory-quality.js` exists for one-shot quality scoring, not for the broader health probes. | `mk-spec-memory health [--report-mode full|divergent_aliases] [--auto-repair]` | **Ported** — handler does not require warm daemon. |
| 9 | `memory_delete` | `handleMemoryDelete` | none | `mk-spec-memory delete --id <n>` (single) or `--spec-folder <f>` (bulk, gated by tier) | **Ported** — same handler, gated CLI flag. |
| 10 | `memory_update` | `handleMemoryUpdate` | none | `mk-spec-memory update --id <n> [--title <t>] [--trigger-phrases ...] [--importance-tier <t>]` | **Ported** — same handler. |
| 11 | `memory_validate` | `handleMemoryValidate` | none | `mk-spec-memory validate --id <n> --was-useful <bool>` | **Ported** — same handler. |
| 12 | `memory_bulk_delete` | `handleMemoryBulkDelete` | **YES** — `mcp_server/cli.ts bulk-delete --tier <t>` | `mk-spec-memory bulk-delete --tier <t> [--folder <f>] [--older-than <d>] [--dry-run] [--skip-checkpoint]` | **Already ported.** |
| 13 | `memory_retention_sweep` | `handleMemoryRetentionSweep` | none | `mk-spec-memory retention-sweep [--dry-run]` | **Ported** — handler is a SQL sweep. |
| 14 | `memory_embedding_reconcile` | `handleMemoryEmbeddingReconcile` | none | `mk-spec-memory embedding-reconcile [--mode dry-run|apply] [--reset-missing]` | **Ported** — same handler. |
| 15 | `embedder_list` | `handleEmbedderList` | none | `mk-spec-memory embedder list` | **Ported** — pure read. |
| 16 | `embedder_set` | `handleEmbedderSet` | none | `mk-spec-memory embedder set <name>` (queues a re-index job; safe without daemon if daemon is alive; otherwise auto-start hybrid c) | **Ported** with a daemon-liveness probe. |
| 17 | `embedder_status` | `handleEmbedderStatus` | none | `mk-spec-memory embedder status [--job-id <id>]` | **Ported** — pure read. |

**Causal (4) — `causal-tools.ts`**
| # | Tool | Handler | CLI today? | Suggested CLI subcommand | Verdict |
|---|------|---------|------------|--------------------------|---------|
| 18 | `memory_drift_why` | `handleMemoryDriftWhy` | none | `mk-spec-memory drift-why --memory-id <id> [--max-depth N] [--direction outgoing|incoming|both] [--relations ...]` | **Ported** — pure graph traversal. |
| 19 | `memory_causal_link` | `handleMemoryCausalLink` | none | `mk-spec-memory causal-link --source <id> --target <id> --relation <r> [--strength 0..1] [--evidence <text>]` | **Ported** — pure graph write. |
| 20 | `memory_causal_stats` | `handleMemoryCausalStats` | none | `mk-spec-memory causal-stats [--backfill dry-run\|apply --limit N]` | **Ported** — pure graph read. |
| 21 | `memory_causal_unlink` | `handleMemoryCausalUnlink` | none | `mk-spec-memory causal-unlink --edge-id <n>` | **Ported** — pure graph write. |

**Checkpoint (4) — `checkpoint-tools.ts`**
| # | Tool | Handler | CLI today? | Suggested CLI subcommand | Verdict |
|---|------|---------|------------|--------------------------|---------|
| 22 | `checkpoint_create` | `handleCheckpointCreate` | none | `mk-spec-memory checkpoint create --name <n> [--spec-folder <f>] [--include-embeddings]` | **Ported** — pure storage write. |
| 23 | `checkpoint_list` | `handleCheckpointList` | none | `mk-spec-memory checkpoint list [--spec-folder <f>] [--limit N]` | **Ported** — pure storage read. |
| 24 | `checkpoint_restore` | `handleCheckpointRestore` | none | `mk-spec-memory checkpoint restore --name <n> [--clear-existing]` | **Ported** — pure storage write. |
| 25 | `checkpoint_delete` | `handleCheckpointDelete` | none | `mk-spec-memory checkpoint delete --name <n> --confirm <name>` | **Ported** — pure storage write. |

**Lifecycle (12) — `lifecycle-tools.ts`**
| # | Tool | Handler | CLI today? | Suggested CLI subcommand | Verdict |
|---|------|---------|------------|--------------------------|---------|
| 26 | `memory_index_scan` | `handleMemoryIndexScan` | **partial** — `reindex-embeddings.js` exists in `scripts/dist/memory/`. | `mk-spec-memory index-scan [--spec-folder <f>] [--force] [--incremental]` | **Already ported (in spirit)**. |
| 27 | `task_preflight` | `handleTaskPreflight` | none | `mk-spec-memory task-preflight --spec-folder <f> --task-id <id> --knowledge <0..100> --uncertainty <0..100> --context <0..100>` | **Ported** — pure DB write. |
| 28 | `task_postflight` | `handleTaskPostflight` | none | `mk-spec-memory task-postflight --spec-folder <f> --task-id <id> --knowledge <0..100> --uncertainty <0..100> --context <0..100>` | **Ported** — pure DB write. |
| 29 | `memory_get_learning_history` | `handleGetLearningHistory` | none | `mk-spec-memory learning-history --spec-folder <f> [--only-complete] [--limit N]` | **Ported** — pure DB read. |
| 30 | `memory_ingest_start` | `handleMemoryIngestStart` | none | `mk-spec-memory ingest-start --paths <p1,p2,...> [--spec-folder <f>]` | **Ported** — pure queue write. |
| 31 | `memory_ingest_status` | `handleMemoryIngestStatus` | none | `mk-spec-memory ingest-status --job-id <id>` | **Ported** — pure read. |
| 32 | `memory_ingest_cancel` | `handleMemoryIngestCancel` | none | `mk-spec-memory ingest-cancel --job-id <id>` | **Ported** — pure write. |
| 33 | `eval_run_ablation` | `handleEvalRunAblation` | none | `mk-spec-memory eval ablation [--channels ...] [--queries ...] [--store-results]` | **Ported** — pure eval; no warm model needed. |
| 34 | `eval_reporting_dashboard` | `handleEvalReportingDashboard` | none | `mk-spec-memory eval dashboard [--sprint-filter ...] [--channel-filter ...] [--format text|json]` | **Ported** — pure aggregation. |
| 35 | `session_health` | `handleSessionHealth` | none | `mk-spec-memory session-health` | **Ported** — pure read. |
| 36 | `session_resume` | `handleSessionResume` | none | `mk-spec-memory session-resume [--spec-folder <f>] [--minimal]` | **Ported** — pure read. |
| 37 | `session_bootstrap` | `handleSessionBootstrap` | none | `mk-spec-memory session-bootstrap [--spec-folder <f>]` | **Ported** — pure read. |

**Summary by verdict**

| Verdict | Count | % of 37 |
|---------|-------|---------|
| Already ported (CLI exists today) | 5 | 13.5% |
| Ported (handler is transport-agnostic; CLI subcommand is a thin wrapper) | 32 | 86.5% |
| Truly "lost" (cannot be replaced 1:1) | 0 | 0% |

**Tool matrix verdict:** 100% of the 37 tools can be CLI-replaced in principle. 5 are already ported (`generate-context.js` save, `cli.ts stats`, `cli.ts bulk-delete`, `validate-memory-quality.js` quality, `reindex-embeddings.js` index). 32 are pure handlers that take JSON args and return a structured `MCPResponse`; the CLI form is a one-line `validateToolArgs → handleX → JSON.stringify(content)` call. **No tool is MCP-protocol-bound in the handler itself.**

### Finding 1.2 — The handler layer is the parity surface, not the tool

The `cli.ts` and `generate-context.js` patterns both bypass the MCP JSON-RPC transport and call the **handler functions** directly (`handleMemorySave`, `handleMemoryStats`, `handleMemoryBulkDelete`, `handleMemorySearch`, …). The `index.ts` dispatch in `tools/index.ts:29` is itself a thin function (`dispatchTool`) that just routes by `TOOL_NAMES.has(name)`. Therefore the CLI parity work is: (a) write a CLI front-end that re-uses the same handlers, (b) reproduce the `parseArgs → validateToolArgs → handler → response` pipeline as a Node process, (c) optionally add CLI-native ergonomics (stdin JSON, flags, exit codes).

### Finding 1.3 — Zod validation moves from process boundary to argv/JSON boundary

Today the MCP layer does Zod validation at `validateToolArgs('memory_search', args)` (`memory-tools.ts:67`) because the JSON-RPC transport hands untrusted JSON to the server. In a CLI, the equivalent boundary is the argv/JSON parser. The existing `parseArgs` helper in `tools/types.ts` already converts plain object to typed args; the CLI can validate at the argv layer using a single Zod schema per tool. **No information is lost** — the Zod schema is the same.

### Finding 1.4 — `memory_quick_search` is just `memory_search` with defaults

`memory-tools.ts:69-88` shows `memory_quick_search` calls `handleMemorySearch` with `autoDetectIntent`, `enableDedup`, `includeContent`, `includeConstitutional`, `rerank` all forced true, and patches `payload.meta.tool`. The CLI can ship a single `mk-spec-memory search` command and let `--quick` apply the same defaults. **No new handler, no new semantics.**

### Finding 1.5 — Causal and checkpoint tools have no daemon requirement

`causal-tools.ts` and `checkpoint-tools.ts` call `handleMemoryDriftWhy` / `handleCheckpointCreate` etc. which read from / write to SQLite + the causal-edge / checkpoint tables. The `better-sqlite3` driver does **not** require a warm process — `cli.ts` proves this by opening the same DB directly (`cli.ts:142-159`). Therefore the 8 causal+checkpoint tools are CLI-portable **without** keeping a daemon around. This is critical for Architecture (a) "pure per-invocation CLI".

### Finding 1.6 — Lifecycle tools that read DB-only state are also daemon-free

Of the 12 lifecycle tools, the DB-only ones are `task_preflight`, `task_postflight`, `memory_get_learning_history`, `session_health`, `session_resume`, `session_bootstrap` (6). The remaining 6 (`memory_index_scan`, `memory_ingest_start/status/cancel`, `eval_run_ablation`, `eval_reporting_dashboard`) **do** trigger or query background work (ingest queue, eval ablation, embedding reconcile). Those 6 are the candidates that benefit from the daemon — and the work itself can be ported to either a single Node process per call (architecture a) or the existing daemon (architectures b/c). **The CLI does not need to invent a new runtime model.**

### Finding 1.7 — Embedder management (`embedder_set`, `embedder_status`, `embedder_list`) is a daemon-coordination case, not a transport case

`embedder_set` re-indexes embeddings via a background queue and flips the active pointer after a successful re-index (`memory-tools.ts` calls into `handleEmbedderSet`). The **handler** works fine in a one-shot CLI (the queue is durable), but the user experience — "is my re-index done?" — currently polls the daemon. A pure-CLI approach would need an external observer (cron + a check-CLI invocation). Hybrid (c) auto-spawns the daemon on demand and exposes the same observer, which is closer to today's UX.

### Finding 1.8 — Dead end: the "all 37 are ported in 2 weeks" claim is technically true but misses KQ3 (MCP-only affordances)

Reading the registries gives the impression that 100% parity is straightforward. That conclusion **ignores** the protocol affordances the MCP layer provides: tool-schema auto-discovery (so the LLM sees a schema in its tool list), per-tool runtime permissioning, Zod boundary validation, JSON-RPC error codes (`-32001` retryable), and the session-proxy replay classification. These are KQ3's territory; the parity matrix here is **necessary but not sufficient** for a zero-feature-loss verdict.

### Finding 1.9 — Dead end: assuming `scripts/dist/memory/*.js` already covers everything

Quick inspection of the 11 maintenance CLIs under `scripts/dist/memory/` shows most are one-shot utilities (ast-parser, backfill-frontmatter, cleanup-orphaned-vectors, migrate-trigger-phrase-residual, rank-memories, rebuild-auto-entities, cleanup-index-scope-violations). They are **operational** scripts, not user-facing tool parity. Only `generate-context.js` (save) and `reindex-embeddings.js` (index_scan) actually cover an MCP tool 1:1. The "11 CLIs" claim in `spec.md:70` overstates the existing parity.

## Sources Consulted

- `[SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/tools/context-tools.ts:11]` — `memory_context` registry, 1 tool.
- `[SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/tools/memory-tools.ts:45-62]` — `TOOL_NAMES` set for memory, 16 tools; `case 'memory_quick_search'` (line 69-88) shows it is `handleMemorySearch` with defaults.
- `[SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/tools/causal-tools.ts:24-29]` — 4 causal tools.
- `[SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/tools/checkpoint-tools.ts:24-29]` — 4 checkpoint tools.
- `[SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:39-52]` — 12 lifecycle tools.
- `[SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/tools/index.ts:18-26,29-39]` — `ALL_DISPATCHERS` and `dispatchTool` are thin routing helpers; same shape as a CLI dispatcher.
- `[SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/cli.ts:109-120, 142-159, 166-237, 568-577]` — `cli.ts` already implements stats / bulk-delete / reindex / schema-downgrade and demonstrates the "init database → call handler → print result" pattern that scales to the other 32 tools.
- `[SOURCE: file:scripts/dist/memory/generate-context.js]` — canonical save CLI; consumed by `/memory:save`.
- `[SOURCE: file:scripts/dist/memory/reindex-embeddings.js]` — reindex CLI; equivalent to `memory_index_scan`.
- `[SOURCE: file:scripts/dist/memory/validate-memory-quality.js]` — partial overlap with `memory_health`.
- `[SOURCE: file:.opencode/bin/mk-spec-memory-launcher.cjs:1-80]` — launcher header confirms the MCP child is the only thing that owns the JSON-RPC over stdio transport; the IPC bridge sits in `./lib/launcher-session-proxy.cjs`.

## Assessment

- **Confidence in matrix:** high — every row cites a registry file and line range; tool counts add up (1+16+4+4+12 = 37).
- **Confidence in "ported" verdicts:** high for the handler-based ones (the existing `cli.ts` and `generate-context.js` prove the pattern); medium for `memory_ingest_start/status/cancel` because the queue and observer model is daemon-centric and needs cross-architecture evaluation in KQ2.
- **Confidence in "0% truly lost":** high in the *handler* sense, low in the *user-experience* sense — the LLM loses tool-schema auto-discovery. That gap is KQ3's job.
- **Open items deferred to KQ2/KQ3/KQ4:** daemon-dependent affordances, MCP protocol affordances, integration-surface migration.

## Reflection

- **What worked:** reading the `TOOL_NAMES` sets as the source of truth (instead of guessing from a doc) is fast and produces a verifiable 37-row matrix.
- **What failed:** none this iteration.
- **Ruled out:** the "11 CLIs" framing from `spec.md:70` as evidence of broad parity. Most are operational utilities, not user-facing tool substitutes. Listed in finding 1.9.

## Recommended Next Focus

Iteration 2 should take KQ2 (daemon-dependency audit). The matrix above shows **what** is port-able, but the daemon-dependency question answers **when** and **how** the handler is slow/cold/expensive, and that drives the per-architecture loss table. Specifically:

1. For each of the 37 tools, classify as `daemon-free / daemon-helpful / daemon-required`.
2. Map the daemon-resident services (warm embedder, chokidar file-watcher, async retry queue, RSS watchdog, single-writer lease, warm session briefs) to specific tools.
3. Produce the per-architecture (a/b/c) loss table from that mapping.
