DEEP-RESEARCH

# Deep-Research Iteration Prompt Pack

## STATE

STATE SUMMARY (auto-generated):
Segment: 1 | Iteration: 2 of 5
Questions: 1/5 answered (A1 done) | Last focus: A1 scan lifecycle + caller contract
Last 2 ratios: N/A -> 0.92 | Stuck count: 0
Resource map: resource-map.md not present; skipping coverage gate.
Next focus: A2 UNBOUNDED-WORK / TIMEOUT HARDENING — design the scan-job work queue + resumable checkpoint contract; how lexical rows commit before vector embedding drains async.

Research Topic: Make the spec-kit memory indexing subsystem (memory_index_scan + embedding-index pipeline) future-proof, best-UX, hardened in all situations. DESIGN research only — recommend, do not implement.
Iteration: 2 of 5
Focus Area: A2 UNBOUNDED-WORK / TIMEOUT HARDENING (primary); begin A3 CONCURRENCY if budget allows
Remaining Key Questions: A2 unbounded-work/timeout; A3 concurrency/multi-writer; A4 embedder-resilience/degraded-mode; A5 self-healing/observability
Last 3 Iterations Summary: run 1: A1 scan-lifecycle+caller-contract (0.92, insight)

## CARRY-FORWARD FROM ITERATION 1 (A1 — ANSWERED, build on it; do not re-derive)
A1 recommendation: `memory_index_scan` should return a job handle immediately by adopting the EXISTING async job surface (`lib/embedders/reindex.ts` startReindexJob + `handlers/embedder-status.ts` jobId/progress/eta). A 2nd call within the 30s window COALESCES onto the in-flight job (no raw E429); the `INDEX_SCAN_COOLDOWN=30000` lease (`core/config.ts:126`) becomes an internal coalescing key, not a rejection gate. A bounded synchronous fast-path stays for small scoped scans. `pending`/`retry` embeddingStatus (`lib/providers/retry-manager.ts`) already separates lexical-commit from vector-commit. `-32001` is an MCP CLIENT request-deadline timeout from synchronous embedding inside the request (not a server crash). Read iteration-001.md for full evidence.

## THIS ITERATION'S FOCUS — ANGLE 2 (build the timeout-proof execution model)
Design the concrete unbounded-work execution contract so a full scan/re-embed ALWAYS completes regardless of corpus size, eliminating the `-32001` class:
1. **Phased commit**: scan walk + text/FTS upsert commits synchronously and fast (rows become FTS-searchable immediately as `pending` vectors); vector embedding drains AFTER, off the request path, via the async job. Define the exact phase boundary and what the caller sees at each phase.
2. **Resumable work-queue + checkpoint**: define the queue (what's a work item — a file? a batch?), progress counters (done/total/pending-vectors), a per-invocation work cap so any single drain step is bounded, and checkpoint semantics so an interrupted drain resumes without redoing committed work. Reuse `EMBEDDER_REINDEX_BATCH_SIZE` (50) / `SPECKIT_EMBED_CLIENT_MAX_BATCH` (256) where they fit.
3. **Continuation cursors**: if synchronous mode is ever used on a large scope, define a continuation-cursor contract so the caller can pull the next bounded chunk instead of one unbounded call.
4. **Failure/retry semantics**: how a failed batch parks rows as `retry` (not failing the whole scan) and how the drain backs off — reconcile with `retry-manager.ts` retention limits so a big backlog doesn't get parked/dropped.
Recommend ONE execution model with tradeoffs (latency-to-first-searchable, completeness guarantee, memory/peak-RSS, complexity, migration cost). Verify every current-behavior claim against actual code (file:line).

If budget allows, BEGIN ANGLE 3 (concurrency/multi-writer): what a 2nd concurrent caller experiences under the coalescing model; lease semantics under N sessions + worktree-per-session; IPC bridge `SPECKIT_MAX_SECONDARY_CLIENTS` (8) in `lib/ipc/socket-server.ts`. Leave A4/A5 for later iterations.

## REPO ANCHORS (verify against actual code — cite file:line)
`.opencode/skills/system-spec-kit/mcp_server/`: `handlers/memory-index.ts` (scan handler, batch loop), `core/config.ts:116-117` (BATCH_SIZE / SPEC_KIT_BATCH_SIZE=5), `core/config.ts:126` (INDEX_SCAN_COOLDOWN=30000), `core/db-state.ts` (lease), `lib/embedders/reindex.ts` (startReindexJob, EMBEDDER_REINDEX_BATCH_SIZE=50), `handlers/embedder-status.ts` (job surface), `lib/embedders/execution-router.ts` (SPECKIT_EMBED_CLIENT_MAX_BATCH=256), `lib/providers/retry-manager.ts` (pending/retry, retention limits).

## CONSTRAINTS
- LEAF agent. Do NOT dispatch sub-agents. Target 3-5 research actions, max 12 tool calls.
- DESIGN research only — read + analyze + recommend. Do NOT modify any production code/config/schema. The ONLY files you write are the three iteration artifacts below.
- Every current-behavior claim must cite file:line you actually read.
- Do NOT edit strategy machine-owned sections, registry, or dashboard — the reducer owns those.

## STATE FILES (relative to repo root)
- State Log: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/012-memory-index-scan-ux-hardening/research/deep-research-state.jsonl
- Strategy: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/012-memory-index-scan-ux-hardening/research/deep-research-strategy.md
- Prior iteration: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/012-memory-index-scan-ux-hardening/research/iterations/iteration-001.md
- Write iteration narrative to: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/012-memory-index-scan-ux-hardening/research/iterations/iteration-002.md
- Write per-iteration delta file to: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/012-memory-index-scan-ux-hardening/research/deltas/iter-002.jsonl

## OUTPUT CONTRACT — produce ALL THREE artifacts
1. **Iteration narrative markdown** at iterations/iteration-002.md. Headings: Focus, Actions Taken, Findings (file:line evidence), Questions Answered, Questions Remaining, Next Focus.
2. **Canonical JSONL iteration record** APPENDED (single line + newline) to the State Log, `"type":"iteration"` EXACTLY, fields: type, iteration(=2), newInfoRatio(0..1), status, focus. Example:
   `echo '{"type":"iteration","iteration":2,"newInfoRatio":0.7,"status":"insight","focus":"A2 timeout hardening"}' >> <state-log-path>`
   Must land in the file, not just stdout. Do NOT pretty-print.
3. **Per-iteration delta file** at deltas/iter-002.jsonl: one `{"type":"iteration",...}` record + one record per finding / ruled_out / observation, one JSON object per line.

All three REQUIRED or the iteration fails validation. Write them with real tool calls — do not merely announce intent.
