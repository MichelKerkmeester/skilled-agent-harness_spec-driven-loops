DEEP-RESEARCH

# Deep-Research Iteration Prompt Pack

## STATE

STATE SUMMARY (auto-generated):
Segment: 1 | Iteration: 1 of 5
Questions: 0/5 answered | Last focus: none yet
Last 2 ratios: N/A -> N/A | Stuck count: 0
Resource map: resource-map.md not present; skipping coverage gate.
Next focus: A1 SCAN LIFECYCLE & CALLER CONTRACT — trace the current sync+lease+cooldown path and the existing async job surface; recommend the future-proof caller-facing scan contract that makes E429 internal-only.

Research Topic: Make the spec-kit memory indexing subsystem (memory_index_scan + embedding-index pipeline) future-proof, best-UX, and hardened in all situations: no caller foot-guns, never times out regardless of repo size, self-heals after spec-folder moves, degrades gracefully when the embedder is slow/absent. DESIGN research only — recommend, do not implement.
Iteration: 1 of 5
Focus Area: A1 SCAN LIFECYCLE & CALLER CONTRACT (also begin A2 if budget allows)
Remaining Key Questions: A1 scan-lifecycle/caller-contract; A2 unbounded-work/timeout-hardening; A3 concurrency/multi-writer; A4 embedder-resilience/degraded-mode; A5 self-healing/observability
Last 3 Iterations Summary: none yet

## REPO CONTEXT (verify everything against actual code — cite file:line)

You are running via `codex exec` at the repo root (a git checkout). The subsystem under study lives under `.opencode/skills/system-spec-kit/mcp_server/`. Key anchors already root-caused this session (CONFIRM each against code, do not trust blindly):
- `core/config.ts:126` — `INDEX_SCAN_COOLDOWN = 30000` (hardcoded, not env-overridable). `core/config.ts:116-117` — `BATCH_SIZE` from `SPEC_KIT_BATCH_SIZE` (default 5).
- `handlers/memory-index.ts` (~line 240-260) — `acquireIndexScanLease({now, cooldownMs: INDEX_SCAN_COOLDOWN})`; returns `code:'E429'` with `waitSeconds` when a 2nd scan lands inside the cooldown. Batch processing ~line 474-596.
- `core/db-state.ts` — `acquireIndexScanLease`, `DEFAULT_SCAN_LEASE_EXPIRY_MS = INDEX_SCAN_COOLDOWN * 2`.
- `lib/providers/retry-manager.ts` — `pending`/`retry` embeddingStatus model; rate-limit/backoff classification (~line 160-220).
- `lib/embedders/reindex.ts` — `EMBEDDER_REINDEX_BATCH_SIZE` (50); the async embedder_status job surface (jobId + progress + eta) is here / in `handlers/embedder_status` (mcp_server/handlers/).
- `lib/embedders/execution-router.ts` — `SPECKIT_EMBED_CLIENT_MAX_BATCH` (256).
- `lib/ipc/socket-server.ts` — `SPECKIT_MAX_SECONDARY_CLIENTS` (8).
- Embedding circuit-breaker: `shared/embeddings.ts` / `SPECKIT_EMBEDDING_CB_COOLDOWN_MS` (60000).
- Orphan rows: moved spec folders leave `memory_index` rows whose `file_path` no longer exists (search returns `contentError: "File not found"`). No rename/move reconciliation or orphan GC exists today.

## THIS ITERATION'S FOCUS

Primary: **ANGLE 1 — SCAN LIFECYCLE & CALLER CONTRACT.** Read the actual scan handler + lease code and the existing embedder_status async job surface. Then evaluate the four caller-contract designs: (i) current sync+lease+30s-cooldown, (ii) async job model (jobId + poll), (iii) auto-coalescing/idempotent scan returning the in-flight job instead of E429, (iv) streaming progress. Recommend ONE primary contract (with fallback) where: a scan is always safe + idempotent, the cooldown is an internal thrash-guard never surfaced as a raw E429, and the design reuses existing building blocks (embedder_status jobId model, pending/retry status) rather than inventing new infrastructure. Give concrete tradeoffs (latency, complexity, migration cost, MCP-deadline safety).

If tool budget allows, begin **ANGLE 2 — UNBOUNDED-WORK / TIMEOUT HARDENING** (why force:true on the big root hits -32001; how chunked/resumable batches + deferred-async vectors eliminate the timeout class). Leave A3/A4/A5 for later iterations.

## CONSTRAINTS

- You are a LEAF agent. Do NOT dispatch sub-agents.
- Target 3-5 research actions. Max 12 tool calls total.
- DESIGN research only — read + analyze + recommend. Do NOT modify any production code, config, or schema. The ONLY files you write are the three iteration artifacts below (all under the research packet).
- Write ALL findings to files. Every claim about current behavior must cite file:line you actually read.
- The workflow reducer owns strategy machine-owned sections, registry, and dashboard — do NOT edit those.

## STATE FILES (relative to repo root)

- Config: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/012-memory-index-scan-ux-hardening/research/deep-research-config.json
- State Log: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/012-memory-index-scan-ux-hardening/research/deep-research-state.jsonl
- Strategy: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/012-memory-index-scan-ux-hardening/research/deep-research-strategy.md
- Registry: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/012-memory-index-scan-ux-hardening/research/deep-research-findings-registry.json
- Write iteration narrative to: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/012-memory-index-scan-ux-hardening/research/iterations/iteration-001.md
- Write per-iteration delta file to: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/012-memory-index-scan-ux-hardening/research/deltas/iter-001.jsonl

## OUTPUT CONTRACT — produce ALL THREE artifacts

1. **Iteration narrative markdown** at `research/.../iterations/iteration-001.md`. Headings: Focus, Actions Taken, Findings (with file:line evidence), Questions Answered, Questions Remaining, Next Focus.

2. **Canonical JSONL iteration record** APPENDED (single line + newline) to the State Log. Use `"type":"iteration"` EXACTLY. Required fields: type, iteration, newInfoRatio (0..1), status, focus. Optional graphEvents array. Example:
   `echo '{"type":"iteration","iteration":1,"newInfoRatio":0.9,"status":"insight","focus":"A1 scan lifecycle + caller contract","graphEvents":[]}' >> <state-log-path>`
   Do NOT pretty-print. It MUST land in the file, not just stdout.

3. **Per-iteration delta file** at `research/.../deltas/iter-001.jsonl`: one `{"type":"iteration",...}` record (same as the state-log append) PLUS one structured record per finding / ruled_out / observation. One JSON object per line.

All three are REQUIRED or the iteration fails validation.
