DEEP-RESEARCH

# Deep-Research Iteration Prompt Pack

## STATE

STATE SUMMARY (auto-generated):
Segment: 1 | Iteration: 5 of 5 (FINAL)
Questions: 4/5 answered (A1, A2, A3, A4) | Last focus: A4 embedder resilience/degraded-mode
Last 2 ratios: 0.78 -> 0.74 | Stuck count: 0
Resource map: resource-map.md not present; skipping coverage gate.
Next focus: A5 SELF-HEALING & OBSERVABILITY — orphan-row GC, rename/move reconciliation, index-freshness/health surface, auto-reindex triggers.

Research Topic: Make the spec-kit memory indexing subsystem (memory_index_scan + embedding-index pipeline) future-proof, best-UX, hardened in all situations. DESIGN research only — recommend, do not implement.
Iteration: 5 of 5 (FINAL — this is the last angle; close it fully)
Focus Area: A5 SELF-HEALING & OBSERVABILITY (primary, and the last open question)
Remaining Key Questions: A5 self-healing/observability
Last 3 Iterations Summary: run 2: A2 3-phase job + outage-safe drain (0.86); run 3: A3 scope-keyed coalescing + heartbeat recovery (0.78); run 4: A4 degraded-mode lexical-always-commits + bounded vector drain (0.74)

## CARRY-FORWARD (all four prior angles answered — build on, do not re-derive)
- **A1:** idempotent async scan-job; scanKey coalescing; 30s cooldown internal-only; reuse `embedder_status` jobId/progress surface.
- **A2:** 3-phase job (walk → commit-lexical `embedding_status='pending'` BM25/FTS-searchable via `vector-index-mutations.ts:337` → async vector drain); `index_scan_jobs`+`index_scan_work_items`; per-tick caps; check provider/circuit BEFORE the atomic pending→retry claim (retry-manager.ts:303).
- **A3:** global single-writer serialization; IPC clients are enqueuers/readers; per-worktree DBs = independent lease domains; lease-epoch + heartbeat lease-steal after 60s expiry.
- **A4:** lexical-always-commits invariant (no embedder dependency in phase 1); failure taxonomy → degraded states; bounded vector drain (EMBEDDER_REINDEX_BATCH_SIZE=50 / SPECKIT_EMBED_CLIENT_MAX_BATCH=256); compose the two circuit breakers; caller reads `complete_with_pending_vectors` + `degraded` + `nextVectorAttemptAfter`.

## THIS ITERATION — ANGLE 5 (self-healing + observability; close the loop)
Close the orphan-row + freshness gap that this very session hit (the renest left stale `system-spec-kit/031-embedding-stack-hardening/spec.md` index rows returning `contentError: "File not found"`). Investigate against real code (cite file:line):
1. **Orphan detection + GC:** how does the scan today delete rows for vanished files (the "stale cleanup" step in handlers/memory-index.ts ~595-612)? Is it scoped to the scan's discovery set (so a folder OUTSIDE the scanned scope never gets its orphans cleaned)? Design an orphan sweep that reliably removes index rows whose `file_path` no longer exists on disk — bounded, safe, and not dependent on someone scanning the exact moved scope. Where do orphaned VECTOR-shard rows get cleaned vs the main `memory_index`?
2. **Rename/move reconciliation:** when a spec folder is `git mv`'d, today it's seen as delete-old + add-new (orphan + re-embed). Design detection of a path MOVE (same content hash / same packet identity, new path) so the index updates the path in place — preserving the embedding (no re-embed) and avoiding the orphan entirely. What identity key makes this safe (content hash? packet_id from description.json/graph-metadata.json?) and how to avoid false-positive merges.
3. **Index-freshness / health surface:** design an operator-readable health view (extend `memory_health` or a `/doctor` index view) reporting: indexed-rows vs on-disk-files delta, orphan/File-not-found count, pending-vector backlog, retry/failed counts, last-scan time + staleness, active scan job. Reuse existing signals (memory_stats counts, embedder_status job, retry-manager status). What's the single "is my index healthy/fresh?" summary.
4. **Auto-reindex triggers:** so the index stays correct WITHOUT manual scans — evaluate (a) post-commit git hook (the repo already has `.opencode/scripts/git-hooks/`), (b) mtime/fs watch, (c) lazy reconcile-on-search (detect File-not-found at read time → enqueue a targeted fix). Recommend the trigger(s) with tradeoffs (latency, churn, daemon load, correctness) and how they feed the A1 coalescing scan-job so triggers can't thrash.
5. **Tie-together:** one paragraph — how A1-A5 compose into a single coherent "self-maintaining index" design, and the minimal first implementation slice (what to build first for the most UX/hardening win per unit effort).
This is the FINAL iteration — fully answer A5 AND give the cross-angle synthesis seed (the tie-together) so the synthesis phase has a strong spine. Recommend with tradeoffs; cite file:line for all current-behavior claims.

## REPO ANCHORS (verify — cite file:line)
`.opencode/skills/system-spec-kit/mcp_server/`: `handlers/memory-index.ts` (stale cleanup ~595-612, discovery ~270-306), `lib/search/vector-index-mutations.ts` (deferred/delete mutations), `handlers/memory-crud-health.js` or `handlers/*health*` (memory_health surface), `handlers/embedder-status.ts` (job/health), `lib/providers/retry-manager.ts` (status counts). Identity: `description.json` / `graph-metadata.json` `packet_id`/`spec_folder`. Triggers: `.opencode/scripts/git-hooks/` (post-commit), `shared/config.ts`. memory_stats counts: `handlers/*stats*`.

## CONSTRAINTS
- LEAF agent. No sub-agents. 3-5 research actions, max 12 tool calls.
- DESIGN research only — read + analyze + recommend. Do NOT modify production code/config/schema. Only write the three iteration artifacts below.
- Every current-behavior claim cites file:line you actually read.
- Do NOT edit strategy machine-owned sections, registry, or dashboard — reducer owns those.

## STATE FILES (relative to repo root)
- State Log: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/012-memory-index-scan-ux-hardening/research/deep-research-state.jsonl
- Strategy: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/012-memory-index-scan-ux-hardening/research/deep-research-strategy.md
- Prior iterations: .../research/iterations/iteration-001.md .. -004.md
- Write iteration narrative to: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/012-memory-index-scan-ux-hardening/research/iterations/iteration-005.md
- Write per-iteration delta file to: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/012-memory-index-scan-ux-hardening/research/deltas/iter-005.jsonl

## OUTPUT CONTRACT — produce ALL THREE artifacts (write with real tool calls, do not merely announce intent)
1. **Iteration narrative** at iterations/iteration-005.md. Headings: Focus, Actions Taken, Findings (file:line evidence), Questions Answered, Questions Remaining, Next Focus (write "All five angles answered; ready for synthesis").
2. **Canonical JSONL iteration record** APPENDED (single line + newline) to the State Log, `"type":"iteration"` EXACTLY, fields: type, iteration(=5), newInfoRatio(0..1), status, focus.
   `echo '{"type":"iteration","iteration":5,"newInfoRatio":0.6,"status":"insight","focus":"A5 self-healing observability + cross-angle synthesis"}' >> <state-log-path>`
   Must land in the file. Do NOT pretty-print.
3. **Per-iteration delta file** at deltas/iter-005.jsonl: one `{"type":"iteration",...}` record + one record per finding / ruled_out / observation, one JSON object per line.
All three REQUIRED or the iteration fails validation.
