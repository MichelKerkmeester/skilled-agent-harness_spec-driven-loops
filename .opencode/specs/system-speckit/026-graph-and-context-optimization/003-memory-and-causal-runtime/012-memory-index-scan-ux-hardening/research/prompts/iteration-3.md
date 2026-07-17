DEEP-RESEARCH

# Deep-Research Iteration Prompt Pack

## STATE

STATE SUMMARY (auto-generated):
Segment: 1 | Iteration: 3 of 5
Questions: 2/5 answered (A1, A2) | Last focus: A2 timeout hardening
Last 2 ratios: 0.92 -> 0.86 | Stuck count: 0
Resource map: resource-map.md not present; skipping coverage gate.
Next focus: A3 CONCURRENCY & MULTI-WRITER — lease semantics under N sessions/daemons + worktree-per-session; what the 2nd caller experiences under the coalescing model.

Research Topic: Make the spec-kit memory indexing subsystem (memory_index_scan + embedding-index pipeline) future-proof, best-UX, hardened in all situations. DESIGN research only — recommend, do not implement.
Iteration: 3 of 5
Focus Area: A3 CONCURRENCY & MULTI-WRITER (primary)
Remaining Key Questions: A3 concurrency/multi-writer; A4 embedder-resilience/degraded-mode; A5 self-healing/observability
Last 3 Iterations Summary: run 1: A1 scan-lifecycle+caller-contract (0.92, insight); run 2: A2 timeout-hardening 3-phase scan job (0.86, insight)

## CARRY-FORWARD (answered — build on, do not re-derive)
- **A1:** `memory_index_scan` → idempotent async scan-job with scan-key coalescing; 2nd call joins in-flight job (`coalesced:true`), no raw E429; 30s `INDEX_SCAN_COOLDOWN` (core/config.ts:126) becomes internal worker-start guard; reuse `embedder_status` jobId/progress surface. Lease layer has two internal reasons — `lease_active` (db-state.ts:443) and `cooldown` (db-state.ts:456) — both wrongly collapse to one raw E429 today (handlers/memory-index.ts:245).
- **A2:** Timeout is structural (discovery+per-file embed inside the request, sync embed default, BATCH_SIZE=5 → ~135 serial batches for 674-file force scan). Recommended **3-phase scan job**: Phase 1 walk (bounded, manifest by mtime+hash), Phase 2 commit-lexical (FTS rows + `embedding_status='pending'`, searchable immediately, per-invocation cap), Phase 3 drain-vectors async via existing retry-manager/embedder job runner; request returns a jobId after Phase 1-2.

## THIS ITERATION — ANGLE 3 (concurrency & multi-writer correctness)
Under the A1 coalescing + A2 async-job model, define correct multi-writer behavior so concurrency NEVER produces a raw E429, a corrupt index, or duplicated embedding work. Investigate against real code (cite file:line):
1. **Lease/coalescing semantics under contention:** what happens when 2+ callers hit `memory_index_scan` concurrently for the same scanKey vs different scanKeys? Trace `acquireIndexScanLease`/`completeIndexScanLease` (core/db-state.ts) — is the lease per-DB/global or scope-keyed? Is the check-then-set atomic (race window between read and reserve)? Recommend the exact coalescing key + atomic claim so concurrent same-scope callers join one job and different-scope callers don't block each other.
2. **Single-writer guarantee on the DB:** with N MCP clients through the IPC bridge (`lib/ipc/socket-server.ts`, `SPECKIT_MAX_SECONDARY_CLIENTS`=8) + the retry-manager background drainer + a scan job runner all writing `memory_index`/vectors — what serializes writes? SQLite WAL + busy_timeout? A single daemon write path? Identify any place two writers can race on the same row's `embedding_status` (note retry-manager already atomically claims pending rows: retry-manager.ts:303 — does the scan path honor the same claim?).
3. **Worktree-per-session interaction:** each session may get isolated DBs (`SPEC_KIT_DB_DIR`/`SPECKIT_CODE_GRAPH_DB_DIR`) + a short IPC socket dir. Does per-session isolation make cross-session scan contention a non-issue (separate DBs ⇒ separate leases), or can two sessions still target one shared DB? Recommend the coordination model for both shared-DB and isolated-DB topologies.
4. **2nd-caller experience matrix:** for {same scanKey active, same scanKey cooling-down, different scanKey, lease held by dead/stale worker} → recommend exactly what the 2nd caller receives (coalesced job / current job / new job / lease-steal-after-expiry). Reconcile with `DEFAULT_SCAN_LEASE_EXPIRY_MS = INDEX_SCAN_COOLDOWN*2` (db-state.ts) for stale-lease recovery.
Recommend with tradeoffs (correctness, latency, complexity). If budget allows, begin A4 (embedder resilience/degraded-mode). Leave A5 for later.

## REPO ANCHORS (verify — cite file:line)
`.opencode/skills/system-spec-kit/mcp_server/`: `core/db-state.ts` (acquireIndexScanLease ~443, completeIndexScanLease ~501, cooldown ~456, DEFAULT_SCAN_LEASE_EXPIRY_MS), `handlers/memory-index.ts` (lease ~238-245, batch loop ~474-555), `lib/providers/retry-manager.ts` (atomic pending claim ~303, prioritization ~557, backoff ~579, circuit breaker ~386), `lib/ipc/socket-server.ts` (SPECKIT_MAX_SECONDARY_CLIENTS), `shared/config.ts` (getDbDir / SPEC_KIT_DB_DIR), `.opencode/bin/mk-spec-memory-launcher.cjs` (daemon single-writer / lease). Worktree isolation: `.opencode/bin/worktree-session.sh`, `.opencode/bin/README.md`.

## CONSTRAINTS
- LEAF agent. No sub-agents. 3-5 research actions, max 12 tool calls.
- DESIGN research only — read + analyze + recommend. Do NOT modify production code/config/schema. Only write the three iteration artifacts below.
- Every current-behavior claim cites file:line you actually read.
- Do NOT edit strategy machine-owned sections, registry, or dashboard — reducer owns those.

## STATE FILES (relative to repo root)
- State Log: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/012-memory-index-scan-ux-hardening/research/deep-research-state.jsonl
- Strategy: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/012-memory-index-scan-ux-hardening/research/deep-research-strategy.md
- Prior iterations: .../research/iterations/iteration-001.md, iteration-002.md
- Write iteration narrative to: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/012-memory-index-scan-ux-hardening/research/iterations/iteration-003.md
- Write per-iteration delta file to: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/012-memory-index-scan-ux-hardening/research/deltas/iter-003.jsonl

## OUTPUT CONTRACT — produce ALL THREE artifacts (write with real tool calls, do not merely announce intent)
1. **Iteration narrative** at iterations/iteration-003.md. Headings: Focus, Actions Taken, Findings (file:line evidence), Questions Answered, Questions Remaining, Next Focus.
2. **Canonical JSONL iteration record** APPENDED (single line + newline) to the State Log, `"type":"iteration"` EXACTLY, fields: type, iteration(=3), newInfoRatio(0..1), status, focus.
   `echo '{"type":"iteration","iteration":3,"newInfoRatio":0.7,"status":"insight","focus":"A3 concurrency multi-writer"}' >> <state-log-path>`
   Must land in the file. Do NOT pretty-print.
3. **Per-iteration delta file** at deltas/iter-003.jsonl: one `{"type":"iteration",...}` record + one record per finding / ruled_out / observation, one JSON object per line.
All three REQUIRED or the iteration fails validation.
