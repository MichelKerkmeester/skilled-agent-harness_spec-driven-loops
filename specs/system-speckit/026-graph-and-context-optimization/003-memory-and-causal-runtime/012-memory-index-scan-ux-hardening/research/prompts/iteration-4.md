DEEP-RESEARCH

# Deep-Research Iteration Prompt Pack

## STATE

STATE SUMMARY (auto-generated):
Segment: 1 | Iteration: 4 of 5
Questions: 3/5 answered (A1, A2, A3) | Last focus: A3 concurrency/multi-writer
Last 2 ratios: 0.86 -> 0.83 | Stuck count: 0
Resource map: resource-map.md not present; skipping coverage gate.
Next focus: A4 EMBEDDER RESILIENCE & DEGRADED-MODE — degraded policy for slow/absent embedder; lexical always commits; vector backlog bounded + surfaced.

Research Topic: Make the spec-kit memory indexing subsystem (memory_index_scan + embedding-index pipeline) future-proof, best-UX, hardened in all situations. DESIGN research only — recommend, do not implement.
Iteration: 4 of 5
Focus Area: A4 EMBEDDER RESILIENCE & DEGRADED-MODE INDEXING (primary)
Remaining Key Questions: A4 embedder-resilience/degraded-mode; A5 self-healing/observability
Last 3 Iterations Summary: run 1: A1 caller-contract coalescing (0.92); run 2: A2 3-phase scan job + provider-outage-safe drain (0.86); run 3: A3 single-writer + scope-keyed coalescing + lease-epoch recovery (0.83)

## CARRY-FORWARD (answered — build on, do not re-derive)
- **A1:** idempotent async scan-job; scanKey coalescing; 30s cooldown internal-only; reuse embedder_status jobId surface.
- **A2:** 3-phase job — walk → commit-lexical (`embedding_status='pending'`, BM25/FTS searchable immediately via `vector-index-mutations.ts:337` indexMemoryDeferred) → async vector drain. `index_scan_jobs` + `index_scan_work_items` schema; per-tick caps; lexical-complete = success. KEY: vector drain must check provider/circuit state BEFORE the atomic pending→retry claim (retry-manager.ts:303) so a provider outage can't convert clean `pending` backlog into `retry`/`failed` (retention only prunes retry/non-zero-retry-count rows: retry-manager.ts:493-519).
- **A3:** global single-writer serialization; IPC bridge clients are enqueuers/readers not parallel writers; per-worktree DBs = independent lease domains; lease-epoch + heartbeat for stale/dead-worker recovery.

## THIS ITERATION — ANGLE 4 (embedder resilience & graceful degradation)
The embedder is the slow/fragile dependency. Specify the degraded-mode policy so a scan NEVER fails wholesale on embedder trouble, vectors catch up when the provider returns, and the caller always gets a truthful signal. Investigate against real code (cite file:line):
1. **Failure taxonomy → response:** enumerate the embedder failure modes and the EXACT degraded behavior for each: (a) cold-load 15-120s (ollama/hf-local first embed), (b) shared-embedding circuit open (`shared/embeddings.ts` `SPECKIT_EMBEDDING_CB_COOLDOWN_MS`=60000, returns null while open), (c) retry-manager provider circuit open (retry-manager.ts:386, ~120s), (d) ENOSPC / disk-full on cache or DB write, (e) hf-local crash-loop cooldown (503), (f) model-load wedge, (g) per-row POST slowness. For each: does lexical commit still proceed? does the scan job stay `complete_with_pending_vectors`? what does `degraded` + `nextVectorAttemptAfter` say?
2. **Lexical-always-commits invariant:** confirm the phase-1 lexical path has NO hard dependency on the embedder (trace indexMemoryDeferred / create-record async path) so phase 1 completes even with the provider fully down. Identify any remaining code path where an embedder error could still abort a lexical upsert.
3. **Bounded vector backlog + batch sizing under load:** how to size the drain (`EMBEDDER_REINDEX_BATCH_SIZE`=50, `SPECKIT_EMBED_CLIENT_MAX_BATCH`=256 + byte budget in execution-router.ts) so peak RSS stays bounded and a huge backlog drains steadily without spawn-storm; reconcile with the retry loop's default 5-items/5-min (retry-manager.ts:357-364) being too slow as the sole completion path for a big scan.
4. **Circuit-breaker / backoff UX:** how the two circuit breakers (shared embeddings + retry-manager) should compose so they don't double-penalize; what backoff the caller sees; how recovery is detected (half-open probe?) and the backlog auto-resumes without a manual trigger.
5. **Caller-facing degraded signal:** the exact fields/states a caller reads to know "indexed + searchable now, N vectors pending, provider degraded, will retry at T" — so "embeddings lagging but search works" is a first-class success, never an error.
Recommend with tradeoffs. If budget allows, begin A5 (self-healing/observability: orphan rows, rename reconciliation, freshness surface).

## REPO ANCHORS (verify — cite file:line)
`.opencode/skills/system-spec-kit/`: `shared/embeddings.ts` (circuit breaker ~49/59/676, SPECKIT_EMBEDDING_CB_COOLDOWN_MS), `mcp_server/lib/providers/retry-manager.ts` (provider circuit ~386, claim ~303, MAX_RETRIES=3 ~342/712, retention ~493-519, retry loop 357-364), `mcp_server/lib/embedders/execution-router.ts` (embedBatch chunking ~39/65/194-212, SPECKIT_EMBED_CLIENT_MAX_BATCH), `mcp_server/lib/embedders/reindex.ts` (EMBEDDER_REINDEX_BATCH_SIZE ~74), `mcp_server/handlers/save/embedding-pipeline.ts` (async pending path ~140-151), `mcp_server/lib/search/vector-index-mutations.ts` (indexMemoryDeferred ~337-378), `mcp_server/handlers/save/create-record.ts` (deferred routing ~281-327). hf-local supervision/ENOSPC/crash-loop: `.opencode/bin/lib/model-server-supervision.cjs`, `shared/embeddings/providers/hf-local.ts`, ENV_REFERENCE.md.

## CONSTRAINTS
- LEAF agent. No sub-agents. 3-5 research actions, max 12 tool calls.
- DESIGN research only — read + analyze + recommend. Do NOT modify production code/config/schema. Only write the three iteration artifacts below.
- Every current-behavior claim cites file:line you actually read.
- Do NOT edit strategy machine-owned sections, registry, or dashboard — reducer owns those.

## STATE FILES (relative to repo root)
- State Log: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/012-memory-index-scan-ux-hardening/research/deep-research-state.jsonl
- Strategy: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/012-memory-index-scan-ux-hardening/research/deep-research-strategy.md
- Prior iterations: .../research/iterations/iteration-001.md, -002.md, -003.md
- Write iteration narrative to: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/012-memory-index-scan-ux-hardening/research/iterations/iteration-004.md
- Write per-iteration delta file to: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/012-memory-index-scan-ux-hardening/research/deltas/iter-004.jsonl

## OUTPUT CONTRACT — produce ALL THREE artifacts (write with real tool calls, do not merely announce intent)
1. **Iteration narrative** at iterations/iteration-004.md. Headings: Focus, Actions Taken, Findings (file:line evidence), Questions Answered, Questions Remaining, Next Focus.
2. **Canonical JSONL iteration record** APPENDED (single line + newline) to the State Log, `"type":"iteration"` EXACTLY, fields: type, iteration(=4), newInfoRatio(0..1), status, focus.
   `echo '{"type":"iteration","iteration":4,"newInfoRatio":0.7,"status":"insight","focus":"A4 embedder resilience degraded-mode"}' >> <state-log-path>`
   Must land in the file. Do NOT pretty-print.
3. **Per-iteration delta file** at deltas/iter-004.jsonl: one `{"type":"iteration",...}` record + one record per finding / ruled_out / observation, one JSON object per line.
All three REQUIRED or the iteration fails validation.
