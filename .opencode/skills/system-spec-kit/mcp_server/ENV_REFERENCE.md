---
title: SPECKIT Environment Variable Reference
description: All SPECKIT_* environment variables used by the Spec Kit Memory MCP server (plus the MK_*/runtime variables of the dual-stack CLI front door), organized by subsystem with defaults, types and source file references.
---

# SPECKIT Environment Variable Reference

> All `SPECKIT_*` environment variables for the Spec Kit Memory MCP server, plus the `MK_*` and runtime prompt-time variables used by the daemon-backed CLI front door.

---

## 1. OVERVIEW

All variables are optional. The server runs with sensible defaults when none are set. Variables use **graduated semantics** unless noted: they default to ON and you disable them by setting `=false`.

**Graph as a first-class feature family.** The `SPECKIT_GRAPH_*` variables form a dedicated feature family (see [Section 6](#6-graph) and [Section 7](#7-graph-calibration)) controlling structural code graph indexing, graph-first routing in the search pipeline, causal graph traversal, and calibration profiles. Since graph-first routing is now the default query dispatch order (Code Graph -> Code Graph -> Memory), the graph env vars are among the most impactful configuration levers.

**Flag convention:**

| Pattern | Meaning |
|---------|---------|
| `!== 'false'` | **Graduated ON**: enabled by default, set `false` to disable |
| `=== 'true'` | **Opt-in OFF**: disabled by default, set `true` to enable |
| `parseFloat(... \|\| 'N')` | Numeric with fallback default N |
| `?.trim()` | String, empty = use default |

### Feature Flags Reference Table

Generated from `lib/search/search-flags.ts`. "Default state" is the shipped behavior when the governing env var is unset; opt-in rows are OFF even when similarly named graduated features exist elsewhere.

| flag name | default state (ON/OFF) | governing env var | which automation it gates | added in version |
| --- | --- | --- | --- | --- |
| Session attention boost | ON | `SPECKIT_SESSION_BOOST` | Search result re-ranking from session attention signals | graduated |
| Causal graph boost | ON | `SPECKIT_CAUSAL_BOOST` | Causal graph traversal boost for search ranking | graduated |
| Dynamic init | ON | `SPECKIT_DYNAMIC_INIT` | Startup instruction injection for the MCP server | graduated |
| Pressure policy | ON | `SPECKIT_PRESSURE_POLICY` | Token-pressure policy for `memory_context` | graduated |
| Auto resume | ON | `SPECKIT_AUTO_RESUME` | Automatic resume context injection for `memory_context` | graduated |
| MMR reranking | ON | `SPECKIT_MMR` | Graph-guided MMR diversity reranking | current |
| TRM evidence gap detection | ON | `SPECKIT_TRM` | Transparent Reasoning Module evidence-gap detection | current |
| Multi-query expansion | ON | `SPECKIT_MULTI_QUERY` | Deep-mode multi-query expansion | current |
| Search fallback | ON | `SPECKIT_SEARCH_FALLBACK` | Quality-aware 3-tier search fallback chain | PI-A2 |
| Folder discovery | ON | `SPECKIT_FOLDER_DISCOVERY` | Automatic spec folder discovery via description cache | PI-B3 |
| Save planner mode | OFF | `SPECKIT_SAVE_PLANNER_MODE` | Mutation-first canonical save behavior; default is `plan-only` | planner-first save |
| Save reconsolidation | OFF | `SPECKIT_RECONSOLIDATION_ENABLED` | Save-time reconsolidation — opt-in; gates a destructive merge/deprecate path (further checkpoint-gated) | planner-first save |
| Post-insert enrichment | ON | `SPECKIT_POST_INSERT_ENRICHMENT_ENABLED` | Save-time enrichment bundle: causal links + entities + summaries + graph lifecycle (populates graph; async by default) | spec 017 |
| Quality auto-fix retries | ON | `SPECKIT_QUALITY_AUTO_FIX` | Save-time quality auto-fix retry loop (trigger phrases, char-budget trim, anchor normalize) | spec 017 |
| Docscore aggregation | ON | `SPECKIT_DOCSCORE_AGGREGATION` | Document-level chunk-to-memory score aggregation | R1 MPAB |
| Save quality gate | ON | `SPECKIT_SAVE_QUALITY_GATE` | Pre-storage quality gate for memory saves | graduated |
| Dynamic token budget | ON | `SPECKIT_DYNAMIC_TOKEN_BUDGET` | Query-complexity token budget allocation | graduated |
| Confidence truncation | ON | `SPECKIT_CONFIDENCE_TRUNCATION` | Low-confidence tail truncation | graduated |
| Channel minimum representation | ON | `SPECKIT_CHANNEL_MIN_REP` | Minimum channel representation after fusion | graduated |
| Reconsolidation on save | ON | `SPECKIT_RECONSOLIDATION` | Memory deduplication reconsolidation path | TM-06 |
| Negative feedback | ON | `SPECKIT_NEGATIVE_FEEDBACK` | Negative-feedback confidence demotion | T002b/A4 |
| Embedding expansion | ON | `SPECKIT_EMBEDDING_EXPANSION` | Embedding-based query expansion | R12 |
| Consolidation engine | ON | `SPECKIT_CONSOLIDATION` | Contradiction scan, strengthening, staleness, edge bounds | N3-lite |
| Encoding intent | ON | `SPECKIT_ENCODING_INTENT` | Index-time intent metadata capture | R16 |
| Graph walk rollout | ON | `SPECKIT_GRAPH_WALK_ROLLOUT`, `SPECKIT_GRAPH_SIGNALS` | Graph walk mode; defaults to `bounded_runtime` when graph signals are ON | N2a/N2b |
| Graph signals | ON | `SPECKIT_GRAPH_SIGNALS` | Graph momentum and causal depth signals | N2a/N2b |
| Community detection | ON | `SPECKIT_COMMUNITY_DETECTION` | BFS components with Louvain escalation | N2c |
| Community summaries | ON | `SPECKIT_COMMUNITY_SUMMARIES` | Community summary generation and search channel | graph summaries |
| Memory summaries | ON | `SPECKIT_MEMORY_SUMMARIES` | TF-IDF memory summary channel | R8 |
| Temporal contiguity | ON | `SPECKIT_TEMPORAL_CONTIGUITY` | Temporal contiguity boost on Stage 1 vector results | graduated |
| Auto entities | ON | `SPECKIT_AUTO_ENTITIES` | Rule-based entity extraction at save time | R10 |
| Entity linking | ON | `SPECKIT_ENTITY_LINKING` | Cross-document entity edges | S5 |
| Degree boost | ON | `SPECKIT_DEGREE_BOOST` | Causal-edge degree-based reranking | current |
| Context headers | ON | `SPECKIT_CONTEXT_HEADERS` | Stage 4 contextual tree headers | graduated |
| Markdown file watcher | OFF | `SPECKIT_FILE_WATCHER` | Real-time markdown reindexing watcher | opt-in |
| Quality loop | ON | `SPECKIT_QUALITY_LOOP` | Verify-fix-verify memory quality loop | T008 |
| Query decomposition | ON | `SPECKIT_QUERY_DECOMPOSITION` | Deep-mode facet splitting | D2 REQ-D2-001 |
| Graph concept routing | ON | `SPECKIT_GRAPH_CONCEPT_ROUTING` | Query-time alias matching into graph channel | D2 REQ-D2-002 |
| Query surrogates | ON | `SPECKIT_QUERY_SURROGATES` | Index-time aliases, headings, summaries, questions | D2 REQ-D2-005 |
| Implicit feedback log | ON | `SPECKIT_IMPLICIT_FEEDBACK_LOG` | Shadow-only feedback event ledger | D4 REQ-D4-001 |
| Hybrid decay policy | ON | `SPECKIT_HYBRID_DECAY_POLICY` | Type-aware no-decay for permanent artifacts | D4 REQ-D4-002 |
| Save quality gate exceptions | ON | `SPECKIT_SAVE_QUALITY_GATE_EXCEPTIONS` | Short critical decision quality-gate bypass | D4 REQ-D4-003 |
| LLM reformulation | ON | `SPECKIT_LLM_REFORMULATION` | Corpus-grounded LLM query reformulation | D2 REQ-D2-003 |
| HyDE | ON | `SPECKIT_HYDE` | Hypothetical document embeddings for low-confidence deep queries | D2 REQ-D2-004 |
| Graph refresh mode | ON | `SPECKIT_GRAPH_REFRESH_MODE` | Dirty-node recomputation after writes; default `write_local` | D3 REQ-D3-003 |
| LLM graph backfill | ON | `SPECKIT_LLM_GRAPH_BACKFILL` | Async probabilistic graph edge backfill | D3 REQ-D3-004 |
| Graph calibration profile | ON | `SPECKIT_GRAPH_CALIBRATION_PROFILE` | Community thresholds and graph score caps | D3 REQ-D3-005/006 |
| Learned Stage 2 combiner | ON | `SPECKIT_LEARNED_STAGE2_COMBINER` | Shadow-only learned linear ranker | D1 REQ-D1-006 |
| Shadow feedback | ON | `SPECKIT_SHADOW_FEEDBACK` | Holdout comparison of would-have-changed rankings | D4 REQ-D4-006 |
| Progressive disclosure | ON | `SPECKIT_PROGRESSIVE_DISCLOSURE_V1` | Summary layer and cursor pagination for results | D5 REQ-D5-005 |
| Session retrieval state | ON | `SPECKIT_SESSION_RETRIEVAL_STATE_V1` | Cross-turn dedup and goal-aware refinement | D5 REQ-D5-006 |
| Calibrated overlap bonus | ON | `SPECKIT_CALIBRATED_OVERLAP_BONUS` | Multi-channel overlap bonus | D1 REQ-D1-001 |
| RRF K experimental | ON | `SPECKIT_RRF_K_EXPERIMENTAL` | Per-intent RRF K selection | D1 REQ-D1-003 |
| Typed traversal | ON | `SPECKIT_TYPED_TRAVERSAL` | Sparse-first intent-aware graph traversal | D3 Phase A |
| Empty result recovery | ON | `SPECKIT_EMPTY_RESULT_RECOVERY_V1` | Empty and weak result recovery payloads | D5 REQ-D5-001 |
| Result confidence | ON | `SPECKIT_RESULT_CONFIDENCE_V1` | Per-result calibrated confidence scoring | D5 REQ-D5-004 |
| Batch learned feedback | ON | `SPECKIT_BATCH_LEARNED_FEEDBACK` | Weekly batch feedback learning pipeline | D4 REQ-D4-004 |
| Feedback retention learning | OFF | `SPECKIT_FEEDBACK_RETENTION_LEARNING` | Default-off feedback-aware retention reducer; shadow-first and audit-only unless active mode is gated | current |
| Feedback retention mode | shadow | `SPECKIT_FEEDBACK_RETENTION_MODE` | Selects `shadow` or `active`; default `shadow`; active still requires the master flag and shadow-evaluation gate | current |
| Session-trace causal inference | OFF | `SPECKIT_SESSION_TRACE_CAUSAL_INFERENCE` | Deferred session-trace causal edge inference from feedback events | current |
| Soft-delete tombstones | OFF | `SPECKIT_SOFT_DELETE_TOMBSTONES` | Default-off tombstone delete path for memory deletes and purgeable retention partition; keep OFF until recall surfaces filter `deleted_at IS NULL` | current |
| Assistive reconsolidation | ON | `SPECKIT_ASSISTIVE_RECONSOLIDATION` | Near-duplicate detection and review routing | D4 REQ-D4-005 |
| Memory idempotency receipts | OFF | `SPECKIT_MEMORY_IDEMPOTENCY` | Default-off server-derived replay receipts for memory_save/memory_update plus advisory near_duplicate_of hints | memory hardening |
| Result explainability | ON | `SPECKIT_RESULT_EXPLAIN_V1` | Two-tier result explainability | D5 REQ-D5-002 |
| Response profile formatting | ON | `SPECKIT_RESPONSE_PROFILE_V1` | Mode-aware response profiles | D5 REQ-D5-003 |
| Query concept expansion | ON | `SPECKIT_QUERY_CONCEPT_EXPANSION` | Alias-based query expansion for hybrid search | Phase B T016 |
| Graph fallback | ON | `SPECKIT_GRAPH_FALLBACK` | Graph-expanded fallback on zero or weak results | Phase B T017 |
| Graph context injection | ON | `SPECKIT_GRAPH_CONTEXT_INJECTION` | Graph neighbor lookup even without seed results | Phase B T020 |
| Result provenance | ON | `SPECKIT_RESULT_PROVENANCE` | Graph evidence metadata in search results | Phase C T027 |
| Temporal edges | ON | `SPECKIT_TEMPORAL_EDGES` | Temporal validity tracking for causal edges | Phase D T036 |
| Usage ranking | ON | `SPECKIT_USAGE_RANKING` | Usage-weighted ranking signal | Phase D T036 |
| Ontology hooks | ON | `SPECKIT_ONTOLOGY_HOOKS` | Ontology-guided extraction validation hooks | Phase D T036 |
| Community search fallback | ON | `SPECKIT_COMMUNITY_SEARCH_FALLBACK` | Community-level fallback channel | Phase B T018 |
| Dual retrieval | ON | `SPECKIT_DUAL_RETRIEVAL` | Local/global/auto retrieval level control | Phase B T019 |
| Intent auto profile | ON | `SPECKIT_INTENT_AUTO_PROFILE` | Intent-to-response-profile auto-routing | Phase C |
| Acceptance traceability template | OFF | `SPECKIT_AC_TRACEABILITY_TEMPLATE` | Enables future acceptance-criteria traceability table rendering in scaffold templates | acceptance coverage gate |
| Acceptance coverage gate | OFF | `SPECKIT_AC_COVERAGE` | Opt-in advisory scan for acceptance-criteria traceability coverage during spec validation | acceptance coverage gate |
| Acceptance coverage enforcement | OFF | `SPECKIT_AC_COVERAGE_ENFORCE` | Reserved promotion switch for a later strict coverage gate; current shipped rule remains advisory | acceptance coverage gate |
| Semantic trigger shadow matcher | OFF | `SPECKIT_SEMANTIC_TRIGGERS` | Opt-in shadow-only semantic trigger scoring; lexical trigger results remain primary and unchanged | semantic trigger fallback |
| Semantic trigger mode | OFF | `SPECKIT_SEMANTIC_TRIGGERS_MODE` | Selects `shadow` or `union`; default `shadow`; `union` can affect results but remains blocked unless the master flag is enabled | semantic trigger fallback |
| Semantic trigger threshold | OFF | `SPECKIT_SEMANTIC_TRIGGER_THRESHOLD` | Cosine threshold for shadow semantic trigger matches; only used when semantic trigger shadow is enabled | semantic trigger fallback |
| Semantic trigger margin | OFF | `SPECKIT_SEMANTIC_TRIGGER_MARGIN` | Minimum top-vs-second score gap for accepting shadow semantic trigger matches | semantic trigger fallback |
| Semantic trigger max | OFF | `SPECKIT_SEMANTIC_TRIGGER_MAX` | Maximum shadow semantic trigger matches computed for comparison telemetry | semantic trigger fallback |
| Semantic trigger cache TTL | OFF | `SPECKIT_SEMANTIC_TRIGGER_CACHE_TTL_MS` | In-memory ready trigger-embedding cache TTL for shadow semantic trigger scoring | semantic trigger fallback |
| Authored continuity snapshot | OFF | `SPECKIT_AUTHORED_CONTINUITY_SNAPSHOT` | Opt-in compact-hook authored continuity snapshot path; default transcript-derived fallback remains unchanged | continuity resilience |
| Completion freshness | OFF | `SPECKIT_COMPLETION_FRESHNESS` | Opt-in strict-validation freshness scan that compares stored continuity fingerprints with packet content | completion freshness |
| Completion freshness enforcement | OFF | `SPECKIT_COMPLETION_FRESHNESS_ENFORCE` | Promotes enabled completion-freshness stale findings from warning to error | completion freshness |
<!-- PHASE-007-ENV-SLOT: SPECKIT_CODE_GRAPH_INTENT_* flags inserted here (027/007) -->
<!-- PHASE-008-ENV-SLOT: SPECKIT_SEMANTIC_TRIGGERS_* flags inserted here (027/008) -->
<!-- PHASE-009-ENV-SLOT: SPECKIT_FEEDBACK_* / SPECKIT_CODE_GRAPH_FEEDBACK_RERANK_* / SPECKIT_SESSION_TRACE_CAUSAL_* / SPECKIT_FEEDBACK_RETENTION_* flags inserted here (027/009) -->
<!-- PHASE-010-ENV-SLOT: SPECKIT_RERANK_USE_SHARED_RERANK / SPECKIT_EMBEDDING_CACHE_* flags inserted here (027/010) -->
<!-- PHASE-011-ENV-SLOT: SPECKIT_CODE_GRAPH_EXEMPLARS_* / SPECKIT_CONTEXT_CURATOR_* flags inserted here (027/011) -->

Total unique variables documented: 179 (legacy HYDRA aliases removed in commit 6f2c2c939; 20 dual-stack CLI front-door variables added — see the "CLI front door" section).

### Provisional Measurement Contract

Publication-facing metric rows now use the shared measurement contract from `lib/context/shared-payload.ts`.

- Every publishable metric field must declare one certainty label: `exact`, `estimated`, `defaulted`, or `unknown`.
- Headline multipliers stay blocked unless prompt, completion, cache-read, and cache-write token fields all have `provider_counted` authority. Later packets should reuse `canPublishMultiplier()` instead of inventing packet-local gates.
- Publication-grade rows must carry methodology metadata with `schemaVersion`, `methodologyStatus`, and at least one provenance entry before they can be emitted.
- There is no environment variable that disables or downgrades this contract. Telemetry and reporting toggles may increase supporting evidence, but they do not upgrade certainty labels or bypass the multiplier gate.

### Adjacent Toggles

These flags can add evidence around future reporting surfaces, but they must still honor the contract above:

| Variable | Effect on measurement contract |
|----------|--------------------------------|
| `SPECKIT_EXTENDED_TELEMETRY` | Adds more detailed telemetry for later analysis, but does not change certainty or authority requirements. |
| `SPECKIT_EVAL_LOGGING` | Persists evaluation events for later review, but does not authorize publication-grade multiplier claims. |
| `SPECKIT_ABLATION` | Enables ablation studies, but any exported savings story still needs provider-counted authority plus methodology metadata. |

### Auditable Savings Publication Contract

The reporting pipeline adds a row-eligibility gate beside the measurement
contract implemented in `mcp_server/lib/telemetry/retrieval-telemetry.ts` and
the publication guard helpers used by the evaluation dashboard.

- Publishable reporting rows must include a supported `methodologyStatus`, a non-empty `schemaVersion`, and at least one provenance entry.
- Rows that fail the publication contract must surface one exclusion reason: `missing_methodology`, `missing_schema_version`, `missing_provenance`, or `unsupported_certainty`.
- There is no environment variable that bypasses the row gate. Reporting toggles can add supporting evidence, but they cannot upgrade unsupported certainty values or fill in missing provenance.
- The current dashboard reader remains aggregate-only. Future export or publication surfaces should import the shared gate helper instead of re-encoding eligibility logic in handler-local code.

---

## 2. INFRASTRUCTURE

| Variable | Default | Type | Description | Source |
|----------|---------|------|-------------|--------|
| `SPECKIT_DB_DIR` | (auto-detected) | string | Override database directory path. Also accepts `SPEC_KIT_DB_DIR`. | `core/config.ts`, `shared/config.ts` |
| `SPECKIT_HEAP_SNAPSHOT_DIR` | (unset) | string | Opt-in directory for V8 heap snapshots written by byte-aware health telemetry. The server creates the directory with mode `0700` and snapshot files with mode `0600`; snapshots can contain sensitive memory contents. | `mcp_server/lib/telemetry/heap-profiler.ts` |
| `SPECKIT_CONTEXT_SERVER_MAX_OLD_SPACE_MB` | (unset) | number | Optional child-process V8 old-space cap for `context-server.js`. The launcher passes `--max-old-space-size=<value>` only when set; no cap is applied by default. | `.opencode/bin/mk-spec-memory-launcher.cjs` |
| `SPECKIT_LAUNCHER_BRIDGE_DISABLED` | `false` | boolean | Rollback flag for MCP launcher bridge mode. Set `1` to force legacy strict-single-writer behavior where secondary launchers print `LEASE_HELD_BY` and exit instead of attaching to the daemon IPC socket. | `.opencode/bin/lib/launcher-ipc-bridge.cjs`, `.opencode/bin/mk-*-launcher.cjs` |
| `SPECKIT_BACKEND_ONLY` | `false` | boolean | Backend-only stdio gate read at server boot. Set `1` so the process runs purely as the recyclable backend behind the MCP front-proxy and skips front-facing stdio wiring; the launcher's `bridgeStdioThroughSessionProxy` owns the client-facing transport and recycles this backend in place (RSS restart, rebuild). Default off (direct stdio). | `context-server.ts`, `.opencode/bin/mk-spec-memory-launcher.cjs`, `.opencode/bin/lib/launcher-session-proxy.cjs` |
| `SPECKIT_MAX_SECONDARY_CLIENTS` | `64` | number | Maximum concurrent secondary stdio clients accepted by the daemon IPC socket before new bridge connections are refused. Each live session's launcher holds one persistent slot, and a refused connection (accept-then-close) is indistinguishable from a dead daemon to probes, so keep this above the realistic concurrent-session fleet. Pinned to `64` in all three runtime configs. | `mcp_server/lib/ipc/socket-server.ts` |
| `SPECKIT_LAUNCHER_IDLE_TIMEOUT_MIN` | `30` | number | Idle self-exit timeout, in minutes, for the spec-memory, skill-advisor, and code-graph MCP server processes. Fractional values are allowed for tests; `0` disables the idle monitor. Primary stdio input and secondary IPC socket connect/data/write events refresh activity, and active secondary IPC clients keep the server alive. | `mcp_server/lib/ipc/launcher-idle-timeout.ts`, `.opencode/skills/system-*/mcp_server/*server.ts` |
| `SPECKIT_LAUNCHER_LOG` | `true` | boolean | Persistent launcher log toggle. The mk-spec-memory launcher's `log()` appends a timestamped, pid-stamped line to a durable file in addition to stderr, so daemon flaps and owner-disposal races are attributable from disk even when the host drops stderr. Best-effort (a logging failure never affects the launcher). Set `0` to disable. | `.opencode/bin/mk-spec-memory-launcher.cjs` |
| `SPECKIT_LAUNCHER_LOG_PATH` | `<dbDir>/.mk-spec-memory-launcher.log` | string | Override the persistent launcher log path. The default lives next to the lease in the runtime DB dir and is gitignored via `*.log`. | `.opencode/bin/mk-spec-memory-launcher.cjs` |
| `SPECKIT_LAUNCHER_LOG_MAX_BYTES` | `1048576` | number | Size cap for the persistent launcher log. Once exceeded, the file rotates to a single previous generation (`.prev.log` for a `.log` path, else `<path>.prev`) before the next append, so it cannot grow without bound. | `.opencode/bin/mk-spec-memory-launcher.cjs` |
| `SPECKIT_LEASE_PROBE_RETRIES` | `1` | number | Consecutive deep liveness-probe RETRIES before a sibling launcher reaps the lease owner and respawns. `0` restores single-probe behavior. Requiring N consecutive failures stops a busy-but-alive owner (e.g. mid-FTS-merge) being false-reaped into a duplicate daemon; any 'alive' probe short-circuits to a bridge. | `.opencode/bin/lib/launcher-ipc-bridge.cjs` |
| `SPECKIT_LEASE_PROBE_RETRY_TIMEOUT_MS` | `1500` | number | Per-attempt timeout (clamped to the 6999ms probe ceiling) for each lease retry probe after the first. Kept short so the default budget (first full probe + one retry + backoff) stays under the launcher grace window. | `.opencode/bin/lib/launcher-ipc-bridge.cjs` |
| `SPECKIT_LEASE_PROBE_RETRY_BACKOFF_MS` | `250` | number | Backoff between consecutive lease liveness-probe attempts. | `.opencode/bin/lib/launcher-ipc-bridge.cjs` |
| `SPECKIT_STOP_HOOK_ORPHAN_SWEEP` | `off` | enum | Stop-hook fallback when no `CLAUDE_SESSION_PID` is available. `off` (default) keeps the historical no-op; `dry-run` logs candidate reaps without mutating; `1`/`on`/`live` reaps. Delegates ONLY to the orphan-only `orphan-mcp-sweeper.sh` (ownerless/reparented MCP processes), never a PPID guess, so it cannot kill a live session. | `.opencode/scripts/session-cleanup.sh` |
| `SPECKIT_DAEMON_REELECTION` | `1` (set by the committed runtime configs) | boolean | The mk-spec-memory owner spawns the daemon detached and, on shutdown, RELEASES it (keeps the daemon lease, drops only the owner lease) for a live secondary to adopt instead of killing it, so the shared backend outlives its owning session and concurrent sessions keep MCP transport. Enabled by default in `.mcp.json`, `opencode.json`, and `.codex/config.toml`; set `0` to restore the kill-on-disposal behavior. The release-vs-kill decision is covered by an integration test, and the full two-session behavior is covered by a live durability test that runs two real launchers in isolation; a fresh session after disposal reaps the released daemon before it spawns a replacement, so the database keeps a single writer and the worst case matches the prior behavior. The launcher's code default stays off, so the runtime configs are the on-switch. | `.opencode/bin/mk-spec-memory-launcher.cjs` |
| `SPECKIT_IPC_SOCKET_DIR` | database directory | string | Overrides the daemon IPC socket directory. **Required on macOS** for production runtimes: the default `<service-db>/daemon-ipc.sock` path exceeds the 104-char `sun_path` limit and `listen()` fails with `EINVAL`. Runtime configs (`.mcp.json`, `opencode.json`, `.codex/config.toml`) pin each service to a short `/tmp/<service>` directory. Also accepts `tcp://host:port`. Uses `daemon-ipc.sock` as the socket file name. The hf-model-server demand path additionally **fail-fasts** (031/005) with `ESUNPATHTOOLONG` if the resolved socket path exceeds 104 bytes, and refuses a symlinked or foreign-uid-owned socket directory (`ESOCKETDIRSYMLINK`/`ESOCKETDIRFOREIGN`/`ESOCKETSYMLINK`) before binding or reclaiming — perimeter hardening so a hostile/misconfigured dir cannot redirect the socket. | `.opencode/bin/lib/launcher-ipc-bridge.cjs`, `.opencode/bin/lib/model-server-supervision.cjs`, `mcp_server/lib/ipc/socket-server.ts` |
| `SPECKIT_EVAL_DB_PATH` | (null) | string | Custom file path for the eval reporting SQLite database. | `handlers/eval-reporting.ts` |
| `SPECKIT_STRICT_SCHEMAS` | `true` | boolean | Enforce strict JSON schema validation on MCP tool inputs. Set `false` to relax. | `schemas/tool-input-schemas.ts` |
| `SPECKIT_SKIP_API_VALIDATION` | `false` | boolean | Skip API-level input validation. Opt-in: set `true` to enable. | `context-server.ts` |
| `SPECKIT_DYNAMIC_INIT` | `true` | boolean | Dynamic startup instruction injection for the MCP server. Graduated ON. | `lib/search/search-flags.ts` |
| `SPECKIT_ROLLOUT_PERCENT` | `100` | number | Global rollout percentage (0-100) for feature flag gating. Controls what fraction of feature checks pass. | `lib/cognitive/rollout-policy.ts` |
| `SPECKIT_PARSER` | `treesitter` | string | Structural parser backend: `treesitter` (AST-accurate via WASM) or `regex` (lightweight fallback). Detector provenance is surfaced separately on code-graph metadata; when a parser-provenance carrier is required, the shared trust mapper translates persisted detector provenance (for example, `structured -> regex`) instead of assuming AST. | `lib/code-graph/structural-indexer.ts`, `lib/context/shared-payload.ts`, `code-graph/lib/readiness-contract.ts` |
| `SPECKIT_PARSER_SKIP_LIST_ENABLED` | `true` | boolean | Kill-switch for the per-file tree-sitter skip-list. When true by default, files matching skip-list entries return early-sentinel `ParseResult` and parser quarantine engages on B2 errors. Set `false` to disable both behaviors. | `.opencode/skills/system-code-graph/mcp_server/lib/tree-sitter-parser.ts`, `.opencode/skills/system-code-graph/mcp_server/lib/parser-skip-list.ts` |
| `SPECKIT_VRULE_OPTIONAL` | `false` | boolean | When `true`, V-rule validation bypasses if the module fails to load. Opt-in. | `handlers/v-rule-bridge.ts` |
| `SPECKIT_SAVE_PLANNER_MODE` | `plan-only` | string | Canonical save planner mode: `plan-only` (default), `full-auto`, or `hybrid`. All modes refresh packet metadata on `/memory:save`; `plan-only` no longer leaves `description.json.lastUpdated` or `graph-metadata.json` untouched. `full-auto` keeps the legacy atomic apply path; `hybrid` is reserved for future mixed flows and currently behaves the same as `plan-only`. | `lib/search/search-flags.ts` |
| `MCP_SESSION_RESUME_AUTH_MODE` | `strict` | string | Session-resume auth binding mode. `strict` (default) rejects `args.sessionId` mismatches against the transport caller context from `getCallerContext()`. `permissive` logs the mismatch and continues for canary rollout. | `handlers/session-resume.ts` |
| `SPECKIT_RECONSOLIDATION_ENABLED` | `false` | boolean | Opt-in save-time reconsolidation. Enables the destructive `reconsolidate()` path (merge near-duplicates / deprecate older rows), itself further gated on a per-spec-folder `pre-reconsolidation` checkpoint. Default OFF; set `true` to enable. | `lib/search/search-flags.ts` |
| `SPECKIT_POST_INSERT_ENRICHMENT_ENABLED` | `true` | boolean | Save-time post-insert enrichment bundle (causal links, entity extraction, summaries, entity linking, graph lifecycle; populates the causal/entity graph). Enabled by default; set `false` to disable. | `lib/search/search-flags.ts` |
| `SPECKIT_POST_INSERT_ENRICHMENT_SYNC` | `false` | boolean | When `true`, the post-insert enrichment bundle runs synchronously inside the save (immediate graph freshness). Default `false` runs it asynchronously in the background so the save returns immediately. | `lib/search/search-flags.ts` |
| `SPECKIT_QUALITY_AUTO_FIX` | `true` | boolean | Save-time quality auto-fix retries (re-extract trigger phrases, trim to char budget, normalize anchors). Enabled by default; set `false` to disable. | `lib/search/search-flags.ts` |
| `SPECKIT_CODEX_HOOK_TIMEOUT_MS` | `3000` | number | Timeout (ms) for the Codex `UserPromptSubmit` hook and the skill-advisor subprocess execution when invoked from Codex. On timeout, the Codex hook returns a stale advisory brief instead of empty output, so operators who raise this value trade responsiveness for fresher advisor data. Set via environment variable before launching Codex. [026/009/012, flagged by 03] | `hooks/codex/user-prompt-submit.ts`, `skill-advisor/lib/subprocess.ts` |

---

## 3. SEARCH PIPELINE: CORE

| Variable | Default | Type | Description | Source |
|----------|---------|------|-------------|--------|
| `SPECKIT_RRF` | `true` | boolean | Master switch for Reciprocal Rank Fusion. Graduated ON. | `shared/algorithms/rrf-fusion.ts` |
| `SPECKIT_RRF_K` | `40` | number | RRF smoothing constant `k`. Lower = more top-heavy ranking, higher = flatter. Must be > 0. | `shared/algorithms/rrf-fusion.ts` |
| `SPECKIT_RRF_K_EXPERIMENTAL` | `true` | boolean | Per-intent RRF K selection from the D1 K-sweep grid. Graduated ON. | `lib/search/search-flags.ts` |
| `SPECKIT_SEARCH_FALLBACK` | `true` | boolean | Quality-aware 3-tier search fallback chain (PI-A2). Graduated ON. | `lib/search/search-flags.ts` |
| `SPECKIT_BM25_ENGINE` | `auto` | enum: `auto`, `sqlite`, `packed-inmemory`, `legacy-inmemory` | Selects the lexical BM25 rank provider. `auto` uses SQLite FTS5 when `memory_fts` exists and skips JS BM25 warmup, otherwise falls back to legacy in-memory BM25. `sqlite` forces FTS5 and throws if `memory_fts` is unavailable. `legacy-inmemory` restores the old warm JS singleton. `packed-inmemory` is reserved and currently warns before using legacy behavior. | `lib/search/bm25-index.ts`, `lib/search/hybrid-search.ts`, `context-server.ts` |
| `SPECKIT_COMPLEXITY_ROUTER` | `true` | boolean | Query complexity classification for routing (simple/moderate/deep). Graduated ON. | `lib/search/query-classifier.ts` |
| `SPECKIT_MMR` | `true` | boolean | Graph-guided Maximal Marginal Relevance diversity reranking. Graduated ON. | `lib/search/search-flags.ts` |
| `SPECKIT_MULTI_QUERY` | `true` | boolean | Multi-query expansion for deep-mode retrieval. Graduated ON. | `lib/search/search-flags.ts` |
| `SPECKIT_EMBEDDING_EXPANSION` | `true` | boolean | Query expansion for embedding-based retrieval (R12). Suppressed when classification = "simple". Graduated ON. | `lib/search/search-flags.ts` |
| `SPECKIT_CONFIDENCE_TRUNCATION` | `true` | boolean | Confidence-gap truncation for low-confidence result tails. Graduated ON. | `lib/search/search-flags.ts` |
| `SPECKIT_CHANNEL_MIN_REP` | `true` | boolean | Channel minimum-representation promotion after fusion. Graduated ON. | `lib/search/search-flags.ts` |
| `SPECKIT_DYNAMIC_TOKEN_BUDGET` | `true` | boolean | Dynamic token budget allocation by query complexity. Graduated ON. | `lib/search/search-flags.ts` |
| `SPECKIT_TRM` | `true` | boolean | Transparent Reasoning Module: evidence-gap detection. Graduated ON. | `lib/search/search-flags.ts` |
| `SPECKIT_ADAPTIVE_FUSION` | `true` | boolean | Intent-aware adaptive fusion with document-type weight shifting. Graduated ON. | `shared/algorithms/adaptive-fusion.ts` |

---

## 4. SEARCH PIPELINE: FUSION AND SCORING

| Variable | Default | Type | Description | Source |
|----------|---------|------|-------------|--------|
| `SPECKIT_SCORE_NORMALIZATION` | `true` | boolean | Composite score normalization. Graduated ON. | `lib/scoring/composite-scoring.ts` |
| `SPECKIT_DOCSCORE_AGGREGATION` | `true` | boolean | R1 MPAB: Document-level chunk-to-memory score aggregation. Graduated ON. | `lib/scoring/mpab-aggregation.ts` |
| `SPECKIT_INTERFERENCE_SCORE` | `true` | boolean | Interference penalty in composite scoring. Graduated ON. Set `false` to disable. | `lib/scoring/interference-scoring.ts` |
| `SPECKIT_CLASSIFICATION_DECAY` | `true` | boolean | Classification-aware decay in FSRS scheduling and composite scoring. Graduated ON. | `lib/cognitive/fsrs-scheduler.ts`, `lib/scoring/composite-scoring.ts` |
| `SPECKIT_SESSION_BOOST` | `true` | boolean | Session attention boost for search result re-ranking. Graduated ON. | `lib/search/search-flags.ts` |
| `SPECKIT_CAUSAL_BOOST` | `true` | boolean | Causal graph traversal boost for search result amplification. Graduated ON. | `lib/search/search-flags.ts` |
| `SPECKIT_CALIBRATED_OVERLAP_BONUS` | `true` | boolean | Calibrated overlap bonus for multi-channel convergence (REQ-D1-001). Graduated ON. | `lib/search/search-flags.ts` |
| `SPECKIT_NEGATIVE_FEEDBACK` | `true` | boolean | Negative-feedback confidence demotion in ranking (T002b/A4). Graduated ON. | `lib/search/search-flags.ts` |
| `SPECKIT_TEMPORAL_CONTIGUITY` | `true` | boolean | Temporal contiguity boost on raw Stage 1 vector results. Graduated ON. | `lib/search/search-flags.ts` |
| `SPECKIT_RECENCY_FUSION_WEIGHT` | `0.07` | number | Weight of recency signal in Stage 2 fusion scoring. | `lib/search/pipeline/stage2-fusion.ts` |
| `SPECKIT_RECENCY_FUSION_CAP` | `0.10` | number | Maximum recency contribution cap in Stage 2 fusion. | `lib/search/pipeline/stage2-fusion.ts` |
| `SPECKIT_DOC_TYPE_WEIGHT_FACTOR` | `1.2` | number | Proportional weight shift factor per document type in adaptive fusion (20% shift at 1.2). | `shared/algorithms/adaptive-fusion.ts` |
| `SPECKIT_FOLDER_SCORING` | `true` | boolean | Folder-level relevance scoring. Graduated ON. | `lib/search/folder-relevance.ts` |
| `SPECKIT_FOLDER_BOOST_FACTOR` | `1.3` | number | Multiplier applied to results matching the discovered spec folder. | `handlers/memory-context.ts` |
| `SPECKIT_FOLDER_TOP_K` | `5` | number | Number of top folder-scored results to inject. | `lib/search/hybrid-search.ts` |
| `SPECKIT_FOLDER_DISCOVERY` | `true` | boolean | Automatic spec folder discovery via description cache (PI-B3). Graduated ON. | `lib/search/search-flags.ts` |

---

## 5. SEARCH PIPELINE: QUERY INTELLIGENCE

| Variable | Default | Type | Description | Source |
|----------|---------|------|-------------|--------|
| `SPECKIT_QUERY_DECOMPOSITION` | `true` | boolean | Bounded facet detection for deep-mode queries: splits into up to 3 sub-queries (REQ-D2-001). Graduated ON. | `lib/search/search-flags.ts` |
| `SPECKIT_QUERY_SURROGATES` | `true` | boolean | Index-time surrogate metadata for recall improvement (REQ-D2-005). Graduated ON. | `lib/search/search-flags.ts` |
| `SPECKIT_QUERY_CONCEPT_EXPANSION` | `true` | boolean | Query concept expansion via alias matching for hybrid search (Phase B T016). Graduated ON. | `lib/search/search-flags.ts` |
| `SPECKIT_LLM_REFORMULATION` | `true` | boolean | Corpus-grounded LLM query reformulation, deep-mode only (REQ-D2-003). Requires LLM endpoint. Graduated ON. | `lib/search/search-flags.ts` |
| `SPECKIT_HYDE` | `true` | boolean | Hypothetical Document Embeddings for low-confidence deep queries (REQ-D2-004). Graduated ON. | `lib/search/search-flags.ts` |
| `SPECKIT_HYDE_ACTIVE` | (derived) | boolean | Runtime HyDE activation gate. Lowercase `true` enables. | `lib/search/hyde.ts` |
| `SPECKIT_HYDE_LOG` | `false` | boolean | Enable verbose HyDE generation logging. Opt-in. | `lib/search/hyde.ts` |
| `SPECKIT_INTENT_CONFIDENCE_FLOOR` | `0.25` | number | Minimum confidence for auto-detected intent. Below this, overrides to "understand". | `handlers/memory-search.ts` |
| `SPECKIT_INTENT_AUTO_PROFILE` | `true` | boolean | Intent-to-profile auto-routing: auto-selects response profile from classifyIntent() results. Graduated ON. | `lib/search/search-flags.ts` |

---

## 6. GRAPH

| Variable | Default | Type | Description | Source |
|----------|---------|------|-------------|--------|
| `SPECKIT_GRAPH_UNIFIED` | `true` | boolean | Unified graph search integration. Graduated ON. Set `false` to disable all graph features. | `core/db-state.ts` |
| `SPECKIT_CODE_GRAPH_INDEX_SKILLS` | `false` (committed configs); see `SPECKIT_CODE_GRAPH_MAINTAINER_MODE` for one-shot maintainer override | boolean or csv | Maintainer opt-in for structural code graph scans to include `.opencode/skills/**`. Set `true` for all skills, or a comma-separated list such as `sk-code-review,sk-doc` for selected skills. Overridden by per-call `includeSkills` when provided. | `.opencode/skills/system-code-graph/mcp_server/lib/index-scope-policy.ts`, `.opencode/skills/system-code-graph/mcp_server/handlers/scan.ts` |
| `SPECKIT_CODE_GRAPH_INDEX_AGENTS` | `false` (committed configs); see `SPECKIT_CODE_GRAPH_MAINTAINER_MODE` for one-shot maintainer override | boolean | Maintainer opt-in for structural code graph scans to include `.opencode/agents/**`. Overridden by per-call `includeAgents` when provided. | `.opencode/skills/system-code-graph/mcp_server/lib/index-scope-policy.ts`, `.opencode/skills/system-code-graph/mcp_server/handlers/scan.ts` |
| `SPECKIT_CODE_GRAPH_INDEX_COMMANDS` | `false` (committed configs); see `SPECKIT_CODE_GRAPH_MAINTAINER_MODE` for one-shot maintainer override | boolean | Maintainer opt-in for structural code graph scans to include `.opencode/commands/**`. Overridden by per-call `includeCommands` when provided. | `.opencode/skills/system-code-graph/mcp_server/lib/index-scope-policy.ts`, `.opencode/skills/system-code-graph/mcp_server/handlers/scan.ts` |
| `SPECKIT_CODE_GRAPH_INDEX_SPECS` | `false` (committed configs); see `SPECKIT_CODE_GRAPH_MAINTAINER_MODE` for one-shot maintainer override | boolean | Maintainer opt-in for structural code graph scans to include `<active-spec-folder>/**`. Overridden by per-call `includeSpecs` when provided. | `.opencode/skills/system-code-graph/mcp_server/lib/index-scope-policy.ts`, `.opencode/skills/system-code-graph/mcp_server/handlers/scan.ts` |
| `SPECKIT_CODE_GRAPH_INDEX_PLUGINS` | `false` (committed configs); see `SPECKIT_CODE_GRAPH_MAINTAINER_MODE` for one-shot maintainer override | boolean | Maintainer opt-in for structural code graph scans to include `.opencode/plugins/**`. Overridden by per-call `includePlugins` when provided. | `.opencode/skills/system-code-graph/mcp_server/lib/index-scope-policy.ts`, `.opencode/skills/system-code-graph/mcp_server/handlers/scan.ts` |
| `SPECKIT_CODE_GRAPH_MAINTAINER_MODE` | unset (treated as false) | boolean | Maintainer-mode one-shot override. When set to `"true"` in `.env.local` (gitignored), the `mk-code-index-launcher.cjs` forces all 5 `SPECKIT_CODE_GRAPH_INDEX_*` to `"true"` at startup, overriding whatever the runtime's MCP config injected. Use this on a dev machine to index `.opencode/{skills,agents,commands,specs,plugins}` without leaking maintainer state into committed configs. Per-call `code_graph_scan` args still override env. | `.opencode/bin/mk-code-index-launcher.cjs` |
| `SPECKIT_GRAPH_SIGNALS` | `true` | boolean | Graph momentum scoring and causal depth signals (N2a+N2b). Graduated ON. | `lib/search/search-flags.ts` |
| `SPECKIT_GRAPH_WALK_ROLLOUT` | (derived) | string | Graph walk rollout state: `off`, `trace_only`, or `bounded_runtime`. Defaults to `bounded_runtime` when GRAPH_SIGNALS is ON. | `lib/search/search-flags.ts` |
| `SPECKIT_GRAPH_WEIGHT_CAP` | `0.15` | number | Maximum graph contribution in Stage 2 scoring. | `lib/search/graph-calibration.ts` |
| `SPECKIT_GRAPH_REFRESH_MODE` | `write_local` | string | Graph refresh mode: `off`, `write_local`, or `scheduled` (REQ-D3-003). | `lib/search/search-flags.ts` |
| `SPECKIT_GRAPH_LOCAL_THRESHOLD` | (internal) | number | Local graph density threshold for graph operations. | `lib/search/graph-lifecycle.ts` |
| `SPECKIT_GRAPH_CONCEPT_ROUTING` | `true` | boolean | Query-time alias matching for concept routing (REQ-D2-002). Graduated ON. | `lib/search/search-flags.ts` |
| `SPECKIT_GRAPH_CONTEXT_INJECTION` | `true` | boolean | Always-on graph context injection: runs concept routing even without seed results (Phase B T020). Graduated ON. | `lib/search/search-flags.ts` |
| `SPECKIT_GRAPH_FALLBACK` | `true` | boolean | Graph-expanded fallback on zero/weak results (Phase B T017). Graduated ON. | `lib/search/search-flags.ts` |
| `SPECKIT_GRAPH_CALIBRATION_PROFILE` | `true` | boolean | Graph calibration profile enforcement and community thresholds (REQ-D3-005/006). Graduated ON. | `lib/search/search-flags.ts` |
| `SPECKIT_LLM_GRAPH_BACKFILL` | `true` | boolean | Async LLM graph backfill for high-value documents (REQ-D3-004). Graduated ON. | `lib/search/search-flags.ts` |
| `SPECKIT_COMMUNITY_DETECTION` | `true` | boolean | Community detection via BFS connected components + Louvain escalation (N2c). Graduated ON. | `lib/search/search-flags.ts` |
| `SPECKIT_COMMUNITY_SUMMARIES` | `true` | boolean | Community summary generation and search channel. Graduated ON. | `lib/search/search-flags.ts` |
| `SPECKIT_COMMUNITY_SEARCH_FALLBACK` | `true` | boolean | Community-level search as fallback channel (Phase B T018). Graduated ON. | `lib/search/search-flags.ts` |
| `SPECKIT_DUAL_RETRIEVAL` | `true` | boolean | Dual-level retrieval mode: `local` (entity), `global` (community), `auto` (local + fallback) (Phase B T019). Graduated ON. | `lib/search/search-flags.ts` |
| `SPECKIT_DEGREE_BOOST` | `true` | boolean | Causal-edge degree-based re-ranking. Graduated ON. | `lib/search/search-flags.ts` |
| `SPECKIT_TEMPORAL_EDGES` | `true` | boolean | Temporal validity tracking for causal edges (Phase D T036). Graduated ON. | `lib/search/search-flags.ts` |
| `SPECKIT_TYPED_TRAVERSAL` | `true` | boolean | Sparse-first + intent-aware typed traversal (D3 Phase A). Graduated ON. | `lib/search/search-flags.ts` |
| `SPECKIT_ENTITY_LINKING` | `true` | boolean | Cross-document entity linking (S5). Requires AUTO_ENTITIES. Graduated ON. | `lib/search/search-flags.ts`, `lib/search/graph-lifecycle.ts` |
| `SPECKIT_ENTITY_LINKING_MAX_DENSITY` | `1.0` | number | Density guard threshold: skip entity linking when projected graph density exceeds this value. | `lib/search/entity-linker.ts` |
| `SPECKIT_AUTO_ENTITIES` | `true` | boolean | Auto entity extraction: rule-based noun-phrase extraction at save time (R10). Graduated ON. | `lib/search/search-flags.ts` |
| `SPECKIT_RESULT_PROVENANCE` | `true` | boolean | Include graph evidence metadata (edges, communities, boost factors) in search results (Phase C T027). Graduated ON. | `lib/search/search-flags.ts` |

---

## CODE GRAPH

Code-graph P1 config defaults with env-var overrides.  Numeric values are parsed as positive integers; object values accept JSON partial-override strings.  Malformed JSON logs a warning and falls back to the hardcoded defaults below.

| Variable | Default | Type | Description | Source |
|----------|---------|------|-------------|--------|
| `SPECKIT_CODE_GRAPH_TTL_MS` | `60000` | number (positive int) | Owner-lease TTL in milliseconds. | `.opencode/skills/system-code-graph/mcp_server/lib/config-defaults.ts` |
| `SPECKIT_CODE_GRAPH_FIND_FILES_MAX_DEPTH` | `20` | number (positive int) | Maximum directory descent depth during file discovery. | `.opencode/skills/system-code-graph/mcp_server/lib/config-defaults.ts` |
| `SPECKIT_CODE_GRAPH_QUARANTINE_AGE_DAYS` | `14` | number (positive int) | Minimum age (days) for parser-skip-list entries to become eligible for repair-node re-parsing. | `.opencode/skills/system-code-graph/mcp_server/lib/config-defaults.ts` |
| `SPECKIT_CODE_GRAPH_FLOORS_JSON` | `{"constitutional":700,"codeGraph":1200,"codeGraph":900,"triggered":400,"overflow":800}` | JSON string (partial merge) | Budget-allocator floor overrides.  Provide a JSON object with any subset of keys; missing keys retain their default values. | `.opencode/skills/system-code-graph/mcp_server/lib/config-defaults.ts` |
| `SPECKIT_CODE_GRAPH_EDGE_WEIGHTS_JSON` | `{"CONTAINS":1.0,"IMPORTS":1.0,"EXPORTS":1.0,"EXTENDS":0.95,"IMPLEMENTS":0.95,"DECORATES":0.9,"OVERRIDES":0.9,"TYPE_OF":0.85,"CALLS":0.8,"TESTED_BY":0.6}` | JSON string (partial merge) | Edge-weight overrides for the structural indexer.  Provide a JSON object with any subset of edge-type keys. | `.opencode/skills/system-code-graph/mcp_server/lib/config-defaults.ts` |
| `SPECKIT_CODE_GRAPH_SELECTIVE_REINDEX_THRESHOLD` | `50` | number (positive int) | Maximum stale files before the launcher switches from selective rescan (fast, incremental) to full scan (slow, complete). Raise to reduce session-boot latency at the cost of letting more drift accumulate before each full pass. Lower to keep the graph tighter at the cost of more frequent full-scans. | `.opencode/skills/system-code-graph/mcp_server/lib/ensure-ready.ts` |
| `SPECKIT_CODE_GRAPH_POST_COMMIT_REBUILD_THRESHOLD` | `100` | number (positive int) | File-count threshold above which the advisory `post-commit` git hook (`.opencode/scripts/git-hooks/post-commit`) invalidates the code-graph SQLite + lease files. Forces the next Claude Code session to run an inline full scan at launcher boot, preventing accumulated drift. Only effective when the hook is installed via `bash .opencode/scripts/install-git-hooks.sh`. | `.opencode/scripts/git-hooks/post-commit` |
| `SPECKIT_SKIP_CODE_GRAPH_POST_COMMIT` | unset (treated as `0`) | boolean (string `"1"`) | One-shot bypass: when set to `"1"`, the `post-commit` git hook exits silently without inspecting the commit. Useful for fast-iteration cycles where the operator does not want to invalidate the graph after every batch. | `.opencode/scripts/git-hooks/post-commit` |
| `SPECKIT_CODE_GRAPH_POST_COMMIT_DRY_RUN` | unset (treated as `0`) | boolean (string `"1"`) | Dry-run mode for the `post-commit` hook: prints the would-invalidate advisory but does NOT delete the SQLite. Useful for verifying the threshold + advisory text before relying on the hook in real commits. | `.opencode/scripts/git-hooks/post-commit` |

---

`code_graph_status` and the startup brief now surface a packet-independent `graphQualitySummary` derived from persisted detector provenance plus the latest edge-enrichment summary. Operators can use that reader to confirm whether the current graph was built with `structured`/`regex` provenance and whether the latest edge-quality signal is coming from `direct_call`, `import`, `type_reference`, `test_coverage`, or `inferred_heuristic` evidence.

---

## 7. GRAPH: CALIBRATION

| Variable | Default | Type | Description | Source |
|----------|---------|------|-------------|--------|
| `SPECKIT_CALIBRATION_PROFILE_NAME` | `default` | string | Named calibration profile: `default` or `aggressive`. | `lib/search/graph-calibration.ts` |
| `SPECKIT_N2A_CAP` | (profile) | number | N2a cap for RRF fusion overflow prevention. Overrides the active calibration profile value. | `lib/search/graph-calibration.ts` |
| `SPECKIT_N2B_CAP` | (profile) | number | N2b cap for RRF fusion overflow prevention. Overrides the active calibration profile value. | `lib/search/graph-calibration.ts` |
| `SPECKIT_LOUVAIN_MIN_DENSITY` | (profile) | number | Minimum graph density required to activate Louvain community detection. | `lib/search/graph-calibration.ts` |
| `SPECKIT_LOUVAIN_MIN_SIZE` | (profile) | number | Minimum component node count required to activate Louvain. | `lib/search/graph-calibration.ts` |

---

## 8. COGNITIVE

| Variable | Default | Type | Description | Source |
|----------|---------|------|-------------|--------|
| `SPECKIT_COACTIVATION` | `true` | boolean | Co-activation pattern matching for related memory surfacing. Graduated ON. | `lib/cognitive/co-activation.ts` |
| `SPECKIT_COACTIVATION_STRENGTH` | `0.25` | number | Co-activation boost factor. Clamped to [0, 1.0]. | `lib/cognitive/co-activation.ts` |
| `SPECKIT_COGNITIVE_COACTIVATION_PATTERN` | (built-in) | string | Custom regex pattern for co-activation matching. Validated for safety. | `configs/cognitive.ts` |
| `SPECKIT_COGNITIVE_COACTIVATION_FLAGS` | (built-in) | string | Regex flags for the co-activation pattern (e.g., `gi`). Validated. | `configs/cognitive.ts` |
| `SPECKIT_WORKING_MEMORY` | `true` | boolean | Working memory system (Miller's Law: 7 +/- 2 capacity, 30-min timeout). Graduated ON. | `lib/cognitive/working-memory.ts` |
| `SPECKIT_HYBRID_DECAY_POLICY` | `true` | boolean | Type-aware no-decay for permanent artifacts (decision/constitutional types get Infinity stability). Graduated ON. | `lib/cognitive/fsrs-scheduler.ts` |
| `SPECKIT_RECONSOLIDATION` | `true` | boolean | Reconsolidation-on-save for memory deduplication (TM-06). Graduated ON. | `lib/search/search-flags.ts` |
| `SPECKIT_ASSISTIVE_RECONSOLIDATION` | `true` | boolean | Assistive reconsolidation for near-duplicate detection (REQ-D4-005). Graduated ON. | `lib/search/search-flags.ts` |
| `SPECKIT_CONSOLIDATION` | `true` | boolean | Consolidation engine: contradiction scan, Hebbian strengthening, staleness detection (N3-lite). Graduated ON. | `lib/search/search-flags.ts` |
| `SPECKIT_MEMORY_SUMMARIES` | `true` | boolean | TF-IDF extractive summary generation as search channel (R8). Graduated ON. | `lib/search/search-flags.ts` |
| `SPECKIT_PRESSURE_POLICY` | `true` | boolean | Token-pressure policy for memory_context responses. Graduated ON. | `lib/search/search-flags.ts` |
| `SPECKIT_AUTO_RESUME` | `true` | boolean | Automatic session resume context injection for memory_context. Graduated ON. | `lib/search/search-flags.ts` |
| `SPECKIT_MEMORY_ADAPTIVE_MODE` | `shadow` | string | Adaptive ranking mode: `shadow` (evaluation-only, do not apply) or `promoted` (apply to ranking). | `lib/cognitive/adaptive-ranking.ts` |
| `SPECKIT_RECENCY_DECAY_DAYS` | (internal) | number | Number of days for recency decay calculation in access tracking. | `lib/storage/access-tracker.ts` |
| `SPECKIT_EVENT_DECAY` | `true` | boolean | Event decay processing in working memory. Graduated ON. | `lib/cognitive/working-memory.ts` (via tests) |

---

## 9. FEEDBACK AND LEARNING

| Variable | Default | Type | Description | Source |
|----------|---------|------|-------------|--------|
| `SPECKIT_IMPLICIT_FEEDBACK_LOG` | `true` | boolean | Implicit feedback event ledger for `search_shown`, `result_cited`, `query_reformulated`, `same_topic_requery`, and `follow_on_tool_use`. Event logging only, with no ranking side effects (REQ-D4-001). Graduated ON. | `lib/feedback/feedback-ledger.ts` |
| `SPECKIT_SHADOW_FEEDBACK` | `true` | boolean | Shadow scoring with holdout evaluation: compares would-have-changed vs live rankings (REQ-D4-006). Graduated ON. | `lib/feedback/shadow-scoring.ts` |
| `SPECKIT_SHADOW_LEARNING` | `false` | boolean | Shadow learned model loading for Stage 2 weight combiner. Opt-in: set `true` to enable. | `lib/search/pipeline/stage2-fusion.ts` |
| `SPECKIT_LEARNED_STAGE2_COMBINER` | `true` | boolean | Learned Stage 2 weight combiner in shadow mode (REQ-D1-006). Graduated ON. | `lib/search/search-flags.ts` |
| `SPECKIT_LEARNED_STAGE2_MODEL` | (auto) | string | Custom file path for the learned Stage 2 model. Absolute or relative to cwd. | `lib/search/pipeline/stage2-fusion.ts` |
| `SPECKIT_BATCH_LEARNED_FEEDBACK` | `true` | boolean | Weekly batch feedback learning pipeline (REQ-D4-004). Graduated ON. | `lib/search/search-flags.ts` |
| `SPECKIT_FEEDBACK_RETENTION_LEARNING` | `false` | boolean | Master gate for feedback-aware retention learning. Default OFF; set `true` to compute retention reducer decisions during the retention sweep. | `lib/feedback/feedback-retention-reducer.ts`, `lib/governance/memory-retention-sweep.ts` |
| `SPECKIT_FEEDBACK_RETENTION_MODE` | `shadow` | enum: `shadow`, `active` | Retention learning safety mode. `shadow` writes audit decisions only; `active` applies extend/protect/delete only when the master flag is enabled and the caller supplies shadow-evaluation evidence. | `lib/feedback/feedback-retention-reducer.ts`, `lib/governance/memory-retention-sweep.ts` |
| `SPECKIT_RELATIONS` | `true` | boolean | Relational learning from correction events. Graduated ON. | `lib/learning/corrections.ts` |
| `SPECKIT_CONSUMPTION_LOG` | `true` | boolean | Agent consumption event logging for analysis (G-NEW-2). Graduated ON. | `lib/telemetry/consumption-logger.ts` |
| `SPECKIT_USAGE_RANKING` | `true` | boolean | Usage-weighted ranking signal (Phase D T036). Graduated ON. | `lib/search/search-flags.ts` |
| `SPECKIT_SIGNAL_VOCAB` | `true` | boolean | Signal vocabulary detection for trigger matching. Graduated ON. | `lib/parsing/trigger-matcher.ts` |
| `SPECKIT_SAVE_QUALITY_GATE` | `true` | boolean | Pre-storage quality gate for memory saves. Graduated ON. | `lib/search/search-flags.ts` |
| `SPECKIT_SAVE_QUALITY_GATE_EXCEPTIONS` | `true` | boolean | Short-critical quality gate exception for decision context types (REQ-D4-003). Graduated ON. | `lib/search/search-flags.ts`, `lib/validation/save-quality-gate.ts` |
| `SPECKIT_QUALITY_LOOP` | `true` | boolean | Verify-fix-verify memory quality loop (T008). Graduated ON. | `lib/search/search-flags.ts` |

---

## 10. GOVERNANCE AND SCOPE

| Variable | Default | Type | Description | Source |
|----------|---------|------|-------------|--------|
| `SPECKIT_MEMORY_ROADMAP_PHASE` | `scope-governance` | string | Active memory roadmap phase: `baseline`, `lineage`, `graph`, `adaptive`, `scope-governance`. | `lib/config/capability-flags.ts` |
| `SPECKIT_MEMORY_LINEAGE_STATE` | `true` | boolean | Lineage state tracking capability. Graduated ON. | `lib/config/capability-flags.ts` |
| `SPECKIT_MEMORY_GRAPH_UNIFIED` | `true` | boolean | Graph unified capability for roadmap tracking. Graduated ON. | `lib/config/capability-flags.ts` |
| `SPECKIT_MEMORY_ADAPTIVE_RANKING` | `false` | boolean | Adaptive ranking capability. **Default OFF**: opt-in. | `lib/config/capability-flags.ts` |
| `SPECKIT_RETENTION_SWEEP` | `true` | boolean | Governed memory retention sweep. Graduated ON; set `false` to disable the background interval. Manual `memory_retention_sweep` remains available. | `lib/session/session-manager.ts` |
| `SPECKIT_RETENTION_SWEEP_INTERVAL_MS` | `3600000` | number | Background retention sweep interval in milliseconds. Values must be positive integers; invalid values fall back to one hour. | `lib/session/session-manager.ts` |
| `SPECKIT_AC_TRACEABILITY_TEMPLATE` | `false` | boolean | Opt-in placeholder for rendering acceptance-criteria traceability tables in future scaffold templates. Current delivery documents the flag; template mutation is intentionally outside this rollout. | `scripts/rules/check-ac-coverage.sh` |
| `SPECKIT_AC_COVERAGE` | `false` | boolean | Opt-in acceptance-criteria coverage scan during spec validation. When unset, the registered rule exits pass with no warnings, preserving strict-validation results for existing folders. | `scripts/rules/check-ac-coverage.sh` |
| `SPECKIT_AC_COVERAGE_ENFORCE` | `false` | boolean | Reserved enforcement switch for a later promotion. The current shipped rule is INFO/advisory even when coverage is below the configured floor. | `scripts/rules/check-ac-coverage.sh` |
| `SPECKIT_AC_COVERAGE_FLOOR` | `0.9` | number | Minimum covered acceptance-criteria ratio for the advisory scan. Values outside `[0,1]` are clamped before the floor is calculated. | `scripts/rules/check-ac-coverage.sh` |
| `SPECKIT_AUTHORED_CONTINUITY_SNAPSHOT` | `false` | flag (`"1"`) | Opt-in compact-hook authored continuity snapshot mode. When set, the hook can emit the authored snapshot path instead of relying only on transcript-derived fallback context. | `mcp_server/hooks/claude/compact-inject.ts` |
| `SPECKIT_COMPLETION_FRESHNESS` | `false` | boolean | Enables the strict-only completion freshness validation rule. The rule recomputes the packet content fingerprint and compares it with stored continuity metadata; unset preserves existing validation output. | `scripts/validation/continuity-freshness.ts`, `mcp_server/tests/continuity-freshness.vitest.ts` |
| `SPECKIT_COMPLETION_FRESHNESS_ENFORCE` | `false` | boolean | When completion freshness is enabled, promotes stale freshness findings from warning to error. | `scripts/validation/continuity-freshness.ts`, `mcp_server/tests/continuity-freshness.vitest.ts` |

---

## 11. UX AND RESPONSE FORMATTING

| Variable | Default | Type | Description | Source |
|----------|---------|------|-------------|--------|
| `SPECKIT_CONTEXT_HEADERS` | `true` | boolean | Contextual tree headers for Stage 4 result enrichment. Graduated ON. | `lib/search/search-flags.ts` |
| `SPECKIT_PROGRESSIVE_DISCLOSURE_V1` | `true` | boolean | Progressive disclosure: summary layer + snippet + cursor pagination (REQ-D5-005). Graduated ON. | `lib/search/search-flags.ts` |
| `SPECKIT_SESSION_RETRIEVAL_STATE_V1` | `true` | boolean | Cross-turn retrieval session state for dedup and goal-aware refinement (REQ-D5-006). Graduated ON. | `lib/search/search-flags.ts` |
| `SPECKIT_EMPTY_RESULT_RECOVERY_V1` | `true` | boolean | Empty/weak result recovery UX with diagnostic payload (REQ-D5-001). Graduated ON. | `lib/search/search-flags.ts` |
| `SPECKIT_RESULT_CONFIDENCE_V1` | `true` | boolean | Per-result calibrated confidence scoring (REQ-D5-004). Graduated ON. | `lib/search/search-flags.ts` |
| `SPECKIT_RESULT_EXPLAIN_V1` | `true` | boolean | Two-tier result explainability (REQ-D5-002). Graduated ON. | `lib/search/search-flags.ts` |
| `SPECKIT_RESULT_EXPLAIN_DEBUG` | `false` | boolean | Detailed debug-level result explainability. Opt-in: set `true` to enable. | `formatters/search-results.ts` |
| `SPECKIT_RESPONSE_PROFILE_V1` | `true` | boolean | Mode-aware response profile formatting (REQ-D5-003). Graduated ON. | `lib/search/search-flags.ts` |
| `SPECKIT_RESPONSE_TRACE` | `false` | boolean | Include full retrieval trace in search responses. Opt-in: set `true` to enable. | `handlers/memory-search.ts` |

---

## 12. EVALUATION AND TELEMETRY

| Variable | Default | Type | Description | Source |
|----------|---------|------|-------------|--------|
| `SPECKIT_ABLATION` | `false` | boolean | Enable ablation study framework. Opt-in: set `true` to enable. | `lib/eval/ablation-framework.ts` |
| `SPECKIT_EVAL_LOGGING` | `false` | boolean | Enable evaluation event logging. Opt-in: set `true` to enable. | `lib/eval/eval-logger.ts`, `handlers/quality-loop.ts` |
| `SPECKIT_DASHBOARD_LIMIT` | `10000` | number | Maximum row limit for reporting dashboard queries. | `lib/eval/reporting-dashboard.ts` |
| `SPECKIT_EXTENDED_TELEMETRY` | `false` | boolean | Detailed retrieval metrics collection (latency breakdown, quality scores). Opt-in: set `true` to enable. | `lib/telemetry/retrieval-telemetry.ts` |
| `SPECKIT_DEBUG_INDEX_SCAN` | `false` | boolean | Include debug file counts in index scan results. Opt-in: set `true` to enable. | `handlers/memory-index.ts` |

### Conditional warm-start bundle (013)

- Toggle: `SPECKIT_WARM_START_BUNDLE`
- Default: `false`
- Rollout gate: only enable after the frozen corpus benchmark shows combined configuration dominates baseline and component-only variants on lower cost with equal-or-better pass rate.
- Design context: local configuration contract

---

## 13. INDEXING

| Variable | Default | Type | Description | Source |
|----------|---------|------|-------------|--------|
| `SPECKIT_INDEX_SPEC_DOCS` | `true` | boolean | Enable spec document indexing. Set `false` to disable. | `handlers/memory-index-discovery.ts` |
| `SPECKIT_INDEX_SCAN_LEASE_EXPIRY_MS` | (internal) | number | Lease expiry timeout in milliseconds for index scan operations. | `core/db-state.ts` |
| `SPECKIT_ENCODING_INTENT` | `true` | boolean | Encoding-intent capture at index time (R16). Graduated ON. | `lib/search/search-flags.ts` |
| `SPECKIT_ONTOLOGY_HOOKS` | `true` | boolean | Ontology-guided extraction validation hooks (Phase D T036). Graduated ON. | `lib/search/search-flags.ts` |
| `SPECKIT_ONTOLOGY_SCHEMA` | (built-in) | string | Custom JSON ontology schema for extraction validation. | `lib/extraction/ontology-hooks.ts` |
| `SPECKIT_EXTRACTION` | `true` | boolean | Entity/relation extraction pipeline. Graduated ON. | `lib/search/search-flags.ts` (via tests) |
| `SPECKIT_FILE_WATCHER` | `false` | boolean | Real-time file watcher for markdown reindexing. **Default OFF**: opt-in. Honors ROLLOUT_PERCENT. | `lib/search/search-flags.ts` |

---

## 15. EMBEDDING

Embedding provider selection stays auto-cascaded unless you force it. In `EMBEDDINGS_PROVIDER=auto`, the runtime probes this **local-first** sequence (ADR-014, 2026-05-19): (1) Ollama — local default `nomic-embed-text-v1.5` (768d); (2) hf-local — default `nomic-ai/nomic-embed-text-v1.5` (768d, same family as the Ollama default); (3) OpenAI — `OPENAI_API_KEY` set, `text-embedding-3-small` (1536d); (4) Voyage — `VOYAGE_API_KEY` set, `voyage-code-3` (1024d). Unlisted local overrides set through `OLLAMA_EMBEDDINGS_MODEL` or `HF_EMBEDDINGS_MODEL` are accepted at runtime and derive their dimension from the first embedding vector. If you override only `SPEC_KIT_DB_DIR` / `SPECKIT_DB_DIR`, the sqlite filename is derived automatically from that active profile.

For the simplest local-first new-user setup, install [Ollama](https://ollama.com) and `ollama pull nomic-embed-text:v1.5` — the cascade auto-selects it with no API keys.

| Variable | Default | Type | Description | Source |
|----------|---------|------|-------------|--------|
| `SPECKIT_EMBEDDING_CIRCUIT_BREAKER` | `true` | boolean | Circuit breaker for embedding model failures. Graduated ON. | `shared/embeddings.ts` |
| `SPECKIT_EMBEDDING_CB_THRESHOLD` | `3` | number | Consecutive failure count before circuit breaker opens. | `shared/embeddings.ts` |
| `SPECKIT_EMBEDDING_CB_COOLDOWN_MS` | `60000` | number | Cooldown period in ms before circuit breaker resets (min 1000). | `shared/embeddings.ts` |
| `HF_EMBED_SERVER_URL` | (unset → `<dbDir>/hf-embed.sock`) | string | Overrides the local HF model-server endpoint. Accepts a Unix socket path, `unix://<path>`, or `tcp://<host>:<port>`. Both launchers and the `hf-local` client resolve this first, then `SPECKIT_IPC_SOCKET_DIR`, then `<dbDir>/hf-embed.sock`. Leave unset so mk-spec-memory and skill-advisor share one resident server. | `bin/hf-model-server.cjs`, `shared/embeddings/providers/hf-local.ts` |
| `HF_EMBED_SERVER_READY_TIMEOUT_MS` | `45000` | number | Initial readiness budget while the `hf-local` client waits for a reachable model server. Once `/api/health` reports `state: "loading"`, the client keeps retrying under `SPECKIT_HF_MODEL_SERVER_LOADING_MAX_MS` instead of failing at 45 s. | `shared/embeddings/providers/hf-local.ts` |
| `SPECKIT_HF_MODEL_SERVER_MAX_RSS_MB` | (unset → disabled) | number | RSS ceiling (MB) for the launcher-supervised model-server process tree. Unset disables the watchdog. | `bin/lib/model-server-supervision.cjs` |
| `SPECKIT_HF_MODEL_SERVER_RSS_SELF_EXIT` | (unset → off) | string | Set `1` (with `SPECKIT_HF_MODEL_SERVER_MAX_RSS_MB`) to recycle the model server via graceful self-exit on an RSS breach. | `bin/lib/model-server-supervision.cjs` |
| `SPECKIT_HF_MODEL_SERVER_LOADING_MAX_MS` | `150000` | number | Maximum age, in milliseconds, for one model-server load attempt before launcher probes classify `loading` as wedged/dead. The `hf-local` client also uses this as its post-health `loading` retry cap, so first-embed downloads can outlive the 45 s initial readiness budget while still being bounded. Device fallback re-stamps the per-attempt marker. Missing or invalid loading markers remain backward-compatible and are treated as alive while loading. | `bin/lib/launcher-ipc-bridge.cjs`, `bin/hf-model-server.cjs`, `shared/embeddings/providers/hf-local.ts` |
| `SPECKIT_HF_MODEL_SERVER_GIVEUP_COOLDOWN_MS` | `60000` | number | Cooldown written after launcher-supervised hf-model-server crash-loop give-up. During the cooldown, demand requests return `503` with `reason: "crash-loop-cooldown"` instead of spawning again. | `bin/lib/model-server-supervision.cjs` |
| `SPECKIT_HF_MODEL_SERVER_IDLE_TIMEOUT_MIN` | `0` (off) | number | When `>0`, the launcher evicts an idle resident hf-model-server after this many minutes of no successful embed (gated on `lastSuccessfulEmbedAt`; fractional values allowed). Eviction is fail-safe — it never reaps a server with in-flight inference or one that has never embedded — and lazy re-arm is preserved, so the next embed demand re-spawns it. Default `0` keeps the resident warm. | `bin/lib/model-server-supervision.cjs` |
| `SPECKIT_EMBED_CLIENT_MAX_BATCH` | `256` | number | Maximum texts per batched `/api/embed` POST when the provider supports batching. The client also caps each request by bytes (~768 KiB) to stay under the server's 1 MiB `MAX_REQUEST_BYTES`, so this count is an upper bound, not a guarantee. Larger values raise reindex throughput but risk hitting the byte cap on long documents. | `mcp_server/lib/embedders/execution-router.ts` |
| `EMBEDDER_REINDEX_BATCH_SIZE` | `50` | number | Texts per write batch during an embedder reindex job (bounded 1–1000). Larger batches raise reindex throughput at higher peak memory. | `mcp_server/lib/embedders/reindex.ts` |
| `EMBEDDING_DIM` | _(derived)_ | number | Explicit embedding-dimension override. When unset or invalid, the dimension is derived from the active embedder profile (and, for unlisted local models, from the first embedding vector). | `shared/embeddings/profile.ts`, `shared/embeddings/factory.ts` |
| `HF_EMBEDDINGS_PREFIX_QUERY` | _(registry)_ | string | Overrides the query prefix for the local HF embedder, for any model. Default derives from the model prefix registry (e.g. nomic uses `search_query:`). | `shared/embeddings/providers/hf-local.ts` |
| `HF_EMBEDDINGS_PREFIX_DOC` | _(registry)_ | string | Overrides the document prefix for the local HF embedder, for any model. Default derives from the model prefix registry (e.g. nomic uses `search_document:`). | `shared/embeddings/providers/hf-local.ts` |
| `SPECKIT_HF_READY_LATCH_TTL_MS` | `30000` (max `120000`) | number | How long a successful `waitForReady()` is trusted before the next embed re-probes `/api/health`. Within the TTL the client skips the readiness GET and POSTs directly; the latch is invalidated immediately on a mid-request reap (`ECONNRESET`/`EPIPE`). A stale latch costs at most one failed POST recovered by the bounded embed retry. | `shared/embeddings/providers/hf-local.ts` |
| `SPECKIT_SKILL_ADVISOR_MODEL_SERVER_ENABLED` | (unset → off) | string | Set `1` to let the **skill-advisor** launcher win the shared model-server spawn when mk-spec-memory is absent (single-winner via the socket-keyed lock). Default off — the memory daemon owns the spawn in the steady state. **The default-ON flip (031/005) is GATED on the live two-launcher model-path test (`SPECKIT_LIVE_MODEL_TEST=1`) passing green; currently blocked because `onnxruntime-common` is unresolvable in this checkout's `@huggingface/transformers` tree, so no live embed can run. Flip the one-line default in `isModelServerEnabled` once that dep is repaired and the live test is green.** | `bin/mk-skill-advisor-launcher.cjs` |
| `SPECKIT_LIVE_MODEL_TEST` | (unset → off) | string | Set `1` to opt into the live model-path cases of `launcher-model-server-live-two-launcher.vitest.ts` (real embed-200 + model-mismatch-404) and the `bench-dtype-q8-fp16.cjs` run. Default off — the transport/socket/route subset runs against the real binary either way; the model-path cases auto-skip so default CI is green where no loadable model is available. | `mcp_server/tests/embedders/launcher-model-server-live-two-launcher.vitest.ts` |
| `SPECKIT_EMBED_CACHE_MAX_BYTES` | `104857600` | number | Global hard cap for persistent embedding cache rows across all profiles and document/query kinds. Defaults to 100 MB. | `lib/cache/embedding-cache.ts` |
| `SPECKIT_EMBED_CACHE_PROFILE_MAX_BYTES` | `52428800` | number | Per-profile cap for persistent embedding cache rows. Defaults to 50 MB per active embedder profile. | `lib/cache/embedding-cache.ts` |
| `SPECKIT_QUERY_EMBED_CACHE_MAX_BYTES` | `26214400` | number | Separate cap for cached query embeddings (`input_kind='query'`). Defaults to 25 MB. | `lib/cache/embedding-cache.ts` |
| `SPECKIT_EMBED_CACHE_MAX_ENTRIES_PER_PROFILE` | `50000` | number | Secondary safety cap on embedding cache row count per profile after byte limits are applied. | `lib/cache/embedding-cache.ts` |

### Local HF model server (single resident model)

When the cascade selects `hf-local`, embeddings are served by a **launcher-supervised local HTTP model server** (`bin/hf-model-server.cjs`) over a Unix socket at `<dbDir>/hf-embed.sock` — no in-process model load, no sidecar. The mk-spec-memory launcher lazily spawns and supervises it on first embed demand; `SPECKIT_SKILL_ADVISOR_MODEL_SERVER_ENABLED=1` lets skill-advisor win that spawn when the memory daemon is absent. Both services resolve the **same** socket, so one resident model serves all consumers.

**Single-resident-model contract.** The server loads exactly **one** model (`HF_EMBEDDINGS_MODEL`, default `nomic-ai/nomic-embed-text-v1.5`). A request for any other model returns **HTTP 404** (`{error, model, loadedModel}`); the `hf-local` provider treats that as "model not loaded" and reports the requested model beside the server's loaded model. To run a different local HF model, change `HF_EMBEDDINGS_MODEL` for **all** consumers — do not expect per-request model switching.

**First-embed download.** On a cold machine, the first hf-local embed downloads the model artifacts to `~/.cache/huggingface/hub`. Expect roughly hundreds of MB of cache growth (about 250-600 MB depending on dtype/artifacts) and a 15-120 s first request on a typical connection. The client keeps retrying while health reports `loading` until `SPECKIT_HF_MODEL_SERVER_LOADING_MAX_MS` (default 150 s).

**Troubleshooting — model-server health states:**

| State | Symptom | Operator action |
|-------|---------|-----------------|
| Not started | `hf-local` health probe connect-refused; no `hf-embed.sock` | Normal before first demand. If it persists under load, check the launcher log for `demand listener` errors; ensure the daemon (or `SPECKIT_SKILL_ADVISOR_MODEL_SERVER_ENABLED=1`) is up. |
| Loading | Health returns `503 loading`; first embed slow | Expected cold model load or first-embed download. Cache path: `~/.cache/huggingface/hub`; size: roughly hundreds of MB; expected wait: 15-120 s. The client retries past `HF_EMBED_SERVER_READY_TIMEOUT_MS` while this state is progressing and fails only at `SPECKIT_HF_MODEL_SERVER_LOADING_MAX_MS` (default 150 s). |
| Crash-looped | Repeated `hf-model-server child exited … relaunching`; eventually `crash loop detected … daemon remains running` | Inspect the model-server stderr (bad `HF_EMBEDDINGS_DTYPE`/`HF_EMBEDDINGS_MODEL`, OOM). After give-up, the launcher re-arms a demand listener; fix the cause and trigger a new embed. |
| RSS recycle | `process tree RSS … exceeds …` then graceful self-exit | Only with `SPECKIT_HF_MODEL_SERVER_MAX_RSS_MB` + `_RSS_SELF_EXIT=1`. Raise the ceiling or disable if the model legitimately needs more RAM. |
| Model mismatch | Embeds fail with `HF local model is not loaded: requested …; server loaded …` (404) | A consumer requested a model the resident server isn't running. Align `HF_EMBEDDINGS_MODEL` across services, or let the cascade fall back. |

---

## 16. ROADMAP PHASE CONTROL

These variables control the live memory roadmap snapshot.

| Variable | Default | Type | Description |
|----------|---------|------|-------------|
| `SPECKIT_MEMORY_ROADMAP_PHASE` | `scope-governance` | string | Active roadmap phase. |
| `SPECKIT_MEMORY_LINEAGE_STATE` | `true` | boolean | Lineage tracking. |
| `SPECKIT_MEMORY_GRAPH_UNIFIED` | `true` | boolean | Graph unified mode. |
| `SPECKIT_MEMORY_ADAPTIVE_RANKING` | `false` | boolean | Adaptive ranking (opt-in). |

---

## 17. DEPRECATED

These variables are no longer active but may still appear in compatibility code.

| Variable | Status | Replacement | Notes |
|----------|--------|-------------|-------|
| `SPECKIT_EAGER_WARMUP` | **Deprecated** | (removed) | Embedding model now uses lazy loading only. Compatibility flag. |
| `SPECKIT_EMBEDDER_EXECUTION` | **Deprecated (no-op)** | (none) | The embedder sidecar was retired; `hf-local` is now a launcher-supervised HTTP model server. Accepted-but-ignored for one release (logged once), then removed. |
| `SPECKIT_LAZY_LOADING` | **Deprecated** | (removed) | Lazy loading is always enabled. Compatibility flag. |
| `SPECKIT_SHADOW_SCORING` | **Deprecated** | `SPECKIT_SHADOW_FEEDBACK` | Shadow scoring flag removed. Shadow evaluation uses SHADOW_FEEDBACK. |
| `SPECKIT_RSF_FUSION` | **Deprecated** | `SPECKIT_RRF` | Referenced in tests only. Legacy alias. |

---

## SKILL ADVISOR

Skill-advisor threshold and calibration overrides for tuning the 5-lane scorer and prompt-policy engine at runtime without code changes.

| Variable | Default | Type | Description | Source |
|----------|---------|------|-------------|--------|
| `SPECKIT_ADVISOR_CONFIDENCE_THRESHOLD` | `0.8` | number (0..1) | Override the confidence threshold used by the 5-lane fusion scorer. Below this value, a recommendation is filtered out unless `confidenceOnly` mode is active. Parsed as a float; values outside [0,1] fall back to the default. | `mcp_server/lib/compat/contract.ts` |
| `SPECKIT_ADVISOR_UNCERTAINTY_THRESHOLD` | `0.35` | number (0..1) | Override the uncertainty ceiling used by the 5-lane fusion scorer. Above this value, a recommendation is filtered out. Parsed as a float; values outside [0,1] fall back to the default. | `mcp_server/lib/compat/contract.ts` |
| `SPECKIT_ADVISOR_CALIBRATION_OVERRIDE_JSON` | (none) | JSON string | Partial override for routing calibration bonuses. Accepts a JSON object with optional keys `memorySaveBonus`, `createAgentBonus`, `testingPlaybookBonus` (all number). Merged with SCORING_CALIBRATION defaults; parse failures log a warning and fall back. | `mcp_server/lib/scorer/scoring-constants.ts` |
| `SPECKIT_ADVISOR_PROMPT_POLICY_PATH` | (bundled default) | string | Override path to the JSON file containing prompt-policy linguistic sets (EXACT_SKIP_COMMANDS, CASUAL_ACKNOWLEDGEMENTS, WORK_INTENT_VERBS, STOP_WORDS, GOVERNANCE_MARKERS) and fire-threshold constants. When unset, the bundled `data/prompt-policy.default.json` is used. | `mcp_server/lib/prompt-policy.ts` |
| `SPECKIT_ADVISOR_PROMPT_POLICY_MIN_VISIBLE_CHARS` | `15` | number | Minimum visible character count for the short-casual-acknowledgement skip path in prompt-policy. | `mcp_server/lib/prompt-policy.ts` |
| `SPECKIT_ADVISOR_PROMPT_POLICY_MEANINGFUL_TOKEN_FLOOR` | `3` | number | Minimum meaningful token count required by the work-intent-with-meaningful-tokens fire rule. | `mcp_server/lib/prompt-policy.ts` |
| `SPECKIT_ADVISOR_PROMPT_POLICY_LENGTH_AND_TOKEN_VISIBLE_CHARS` | `20` | number | The visible-character threshold for the length-and-token-threshold fire rule. | `mcp_server/lib/prompt-policy.ts` |
| `SPECKIT_ADVISOR_PROMPT_POLICY_LENGTH_AND_TOKEN_MEANINGFUL_FLOOR` | `4` | number | The meaningful-token threshold for the length-and-token-threshold fire rule. | `mcp_server/lib/prompt-policy.ts` |
| `SPECKIT_ADVISOR_PROMPT_POLICY_LONG_NON_CASUAL_CHARS` | `50` | number | The visible-character threshold for the long-non-casual-prompt fire rule. | `mcp_server/lib/prompt-policy.ts` |
| `SPECKIT_ADVISOR_LANE_WEIGHTS_JSON` | `{"explicit_author":0.42,"lexical":0.28,"graph_causal":0.13,"derived_generated":0.12,"semantic_shadow":0.05}` | JSON string (partial merge) | Override live-lane weights for the 5-lane fusion scorer. JSON object with any subset of `explicit_author`, `lexical`, `graph_causal`, `derived_generated`, `semantic_shadow` (all numbers in `[0, 1]`). Missing keys retain defaults; invalid JSON, non-object values, out-of-range numbers, and unknown lane ids fall back to defaults. | `mcp_server/lib/scorer/lane-registry.ts` |
| `SPECKIT_ADVISOR_LANE_SHADOW_WEIGHTS_JSON` | `{"explicit_author":0.40,"lexical":0.25,"graph_causal":0.20,"derived_generated":0.10,"semantic_shadow":0.05}` | JSON string (partial merge) | Override shadow-mode lane weights for the 5-lane fusion scorer's `weightedScore` calculation in `advisor-recommend.ts`. Same shape, merge semantics, and validation rules as `SPECKIT_ADVISOR_LANE_WEIGHTS_JSON`. | `mcp_server/lib/scorer/lane-registry.ts` |
| `SPECKIT_ADVISOR_DOC_TRIGGERS` | unset (off) | boolean (string `"true"`) | Opt-in doc-frontmatter trigger harvest: `skill_graph_scan` indexes reference/asset doc frontmatter into the `skill_docs` table, the watcher tracks harvestable docs, the derived lane scores doc phrases (top-3/skill, tier-weighted, 0.45 cap) and recommendations carry sanitized `matchedDocs` paths. Flag-off behavior is byte-identical to pre-feature. Must be present in the launcher's `CHILD_ENV_ALLOWLIST` to reach the daemon child (it is); daemon adoption of a flip requires a fresh session after all advisor-attached sessions end. The Python shim honors the same flag. | `skill-advisor/mcp_server/lib/skill-graph/doc-frontmatter.ts`, `.opencode/bin/mk-skill-advisor-launcher.cjs` |

---

## CLI FRONT DOOR (DUAL-STACK)

Environment variables for the daemon-backed CLIs shipped by the MCP-to-CLI transition: `node .opencode/bin/spec-memory.cjs` (37 tools), `node .opencode/bin/code-index.cjs` (8 tools) and `node .opencode/bin/skill-advisor.cjs` (9 tools). The CLIs run over the unchanged daemons; MCP registrations stay as they were (the CLI is additive). All three share the exit taxonomy `0` success / `1` runtime / `64` usage-schema / `69` protocol-or-dist mismatch / `75` retryable daemon error.

Warm-only and prompt-time flags accept `1`, `true`, `yes` or `on`. When any of them is set, the CLI defaults to `--warm-only`: it probes the daemon socket and exits `75` instead of cold-spawning the launcher, which is the contract prompt-time hooks rely on. `--no-warm-only` on the command line overrides the env default. Without warm-only, a cold daemon is auto-spawned through the matching `mk-*-launcher.cjs`.

| Variable | Default | Type | Description | Source |
|----------|---------|------|-------------|--------|
| `SPECKIT_SPEC_MEMORY_CLI_WARM_ONLY` | unset (off) | flag | Default the spec-memory CLI to warm-only (probe, never cold-spawn; exit `75` when the daemon is down). | `mcp_server/spec-memory-cli.ts` |
| `SPECKIT_SPEC_MEMORY_CLI_PROMPT_TIME` | unset (off) | flag | Marks the spec-memory CLI invocation as prompt-time; implies warm-only. | `mcp_server/spec-memory-cli.ts` |
| `SPECKIT_CODE_INDEX_CLI_WARM_ONLY` | unset (off) | flag | Default the code-index CLI to warm-only. | `.opencode/skills/system-code-graph/mcp_server/code-index-cli.ts` |
| `SPECKIT_CODE_INDEX_CLI_PROMPT_TIME` | unset (off) | flag | Marks the code-index CLI invocation as prompt-time; implies warm-only. The OpenCode plugin bridge sets this on every call. | `.opencode/skills/system-code-graph/mcp_server/code-index-cli.ts`, `.opencode/skills/system-code-graph/mcp_server/plugin_bridges/mk-code-graph-bridge.mjs` |
| `MK_SKILL_ADVISOR_CLI_WARM_ONLY` | unset (off) | flag | Default the skill-advisor CLI to warm-only. Alias: `SPECKIT_SKILL_ADVISOR_CLI_WARM_ONLY`. | `.opencode/skills/system-skill-advisor/mcp_server/skill-advisor-cli.ts` |
| `MK_SKILL_ADVISOR_CLI_PROMPT_TIME` | unset (off) | flag | Marks the skill-advisor CLI invocation as prompt-time; implies warm-only. Alias: `SPECKIT_SKILL_ADVISOR_CLI_PROMPT_TIME`. | `.opencode/skills/system-skill-advisor/mcp_server/skill-advisor-cli.ts` |
| `SPECKIT_CLI_PROMPT_TIME` | unset (off) | flag | Cross-CLI prompt-time marker honored by all three CLIs; implies warm-only. | all three `*-cli.ts` entrypoints |
| `OPENCODE_PROMPT_TIME` / `CODEX_PROMPT_TIME` / `CLAUDE_CODE_PROMPT_TIME` | unset (off) | flag | Runtime-set prompt-time markers; any of them implies warm-only across all three CLIs, so a hook environment can flag prompt time once for the whole stack. | all three `*-cli.ts` entrypoints |
| `SPECKIT_SPEC_MEMORY_CLI_DEV_ALLOW_STALE` | unset (off) | boolean (`"1"`) | Dev override for the spec-memory shim's dist-freshness guard (skips the exit-`69` stale check). | `.opencode/bin/spec-memory.cjs` |
| `SPECKIT_CODE_INDEX_CLI_DEV_ALLOW_STALE` | unset (off) | boolean (`"1"`) | Dev override for the code-index shim's dist-freshness guard. | `.opencode/bin/code-index.cjs` |
| `MK_SKILL_ADVISOR_CLI_DEV_ALLOW_STALE` | unset (off) | boolean (`"1"`) | Dev override for the skill-advisor shim's dist-freshness guard. Alias: `SPECKIT_SKILL_ADVISOR_CLI_DEV_ALLOW_STALE`. | `.opencode/bin/skill-advisor.cjs` |
| `MK_SKILL_ADVISOR_CLI_TRUSTED` | unset (untrusted) | boolean (`"1"`) | Send skill-advisor CLI calls as trusted (equivalent to `--trusted`), required for the mutation tools `advisor_rebuild`, `skill_graph_scan` and apply-mode `skill_graph_propagate_enhances`. Alias: `SPECKIT_SKILL_ADVISOR_CLI_TRUSTED`. | `.opencode/skills/system-skill-advisor/mcp_server/skill-advisor-cli.ts` |
| `MK_SKILL_ADVISOR_TRUST_DEFAULT` | unset (fail-closed untrusted) | string (`"trusted"`) | **Daemon-side** trust default. The advisor daemon fails closed (untrusted) when a caller's transport `_meta` is absent; setting `trusted` in the daemon's own environment restores default-trusted behavior for native MCP surfaces whose clients send no `_meta`. Set in the committed MCP registrations (`.mcp.json`, `opencode.json`, `.codex/config.toml`); callers cannot forge it. | `.opencode/skills/system-skill-advisor/mcp_server/advisor-server.ts` |
| `SPECKIT_RUN_TRI_DAEMON_DRILL` | unset (skip) | boolean (`"1"`) | Opt-in gate for the tri-daemon CLI drill test that exercises all three daemon-backed CLIs together; the suite `describe.skip`s without it. | `.opencode/skills/system-skill-advisor/mcp_server/tests/tri-daemon-drill.vitest.ts` |

---

## EMBEDDER CASCADE PROBE

Cascade-probe timing overrides for the embedder auto-selection cascade. Defaults are the empirically tuned values from the 015 cascade-reorder packet; operators can tune timeout / lock-staleness / sleep without code changes via env vars (022/009).

| Variable | Default | Type | Description | Source |
|----------|---------|------|-------------|--------|
| `SPECKIT_CASCADE_PROBE_TIMEOUT_MS` | `2500` | number (ms) | Per-provider HTTP probe timeout for the auto-select cascade (Voyage, OpenAI, Ollama tags endpoint). Falls back to default when env unset / non-numeric / non-positive. | `shared/embeddings/auto-select.ts` |
| `SPECKIT_CASCADE_LOCK_STALE_MS` | `30000` | number (ms) | Lock staleness threshold for the cross-process auto-select advisory lock. Locks older than this are reclaimed. Falls back to default when env unset / non-numeric / non-positive. | `shared/embeddings/auto-select.ts` |
| `SPECKIT_CASCADE_SLEEP_MS` | `25` | number (ms) | Polling sleep interval while waiting for the auto-select lock to release. Falls back to default when env unset / non-numeric / non-positive. | `shared/embeddings/auto-select.ts` |

---

## 18. QUICK START EXAMPLES

### Disable a Graduated Feature

```bash
# Disable graph signals
export SPECKIT_GRAPH_SIGNALS=false

# Disable the quality gate
export SPECKIT_SAVE_QUALITY_GATE=false
```

### Enable an Opt-in Feature

```bash
# Enable ablation studies
export SPECKIT_ABLATION=true

# Enable extended telemetry
export SPECKIT_EXTENDED_TELEMETRY=true

# Enable adaptive roadmap capability metadata
export SPECKIT_MEMORY_ADAPTIVE_RANKING=true
```

### Tune Numeric Parameters

```bash
# Set aggressive graph calibration
export SPECKIT_CALIBRATION_PROFILE_NAME=aggressive

# Custom graph weight cap
export SPECKIT_GRAPH_WEIGHT_CAP=0.20

# Increase RRF smoothing
export SPECKIT_RRF_K=80

# Lower recency fusion impact
export SPECKIT_RECENCY_FUSION_WEIGHT=0.03
export SPECKIT_RECENCY_FUSION_CAP=0.05
```

### Reduce Feature Surface for Debugging

```bash
# Minimal config: disable most graduated features
export SPECKIT_GRAPH_UNIFIED=false
export SPECKIT_COMMUNITY_DETECTION=false
export SPECKIT_ENTITY_LINKING=false
export SPECKIT_HYDE=false
export SPECKIT_LLM_REFORMULATION=false
```

---

*Generated from source code analysis. Last updated: 2026-06-10.*
