# Changelog — 006-search-clusters-4-7-remediation

## 2026-05-08

> Spec folder: `026-graph-and-context-optimization/003-continuity-memory-runtime/006-search-clusters-4-7-remediation` (Level 2)
> Parent packet: `026-graph-and-context-optimization/003-continuity-memory-runtime`
> Predecessor: `005-memory-search-runtime-bugs/`

### Summary

Closes the 13 P1/P2 defects deferred from phase 005's audit (REQ-005 through REQ-017) plus REQ-012 (CocoIndex daemon health probe) and REQ-016 (intent-classifier stability corpus). Implementation by cli-codex gpt-5.5 high fast in a single 21-minute dispatch. 13/13 reqs closed, 0 deferred.

### Added

- `mcp_server/lib/cocoindex/daemon-probe.ts` — CocoIndex daemon liveness probe with 30s TTL cache; surfaces reachable/unreachable/degraded states.
- `mcp_server/lib/causal/relation-coverage.ts` — per-relation coverage tracker for the autonomous causal-graph backfill job.
- `mcp_server/tests/intent-classifier-corpus.vitest.ts` — 20-paraphrase formal stability corpus with golden outputs.
- `mcp_server/tests/causal-stats-output.vitest.ts` — output-schema test for `memory_causal_stats` (Cluster 4 verification).
- `mcp_server/tests/folder-discovery-threshold.vitest.ts` — per-token similarity threshold test (REQ-008).
- `mcp_server/tests/cocoindex-daemon-probe.vitest.ts` — daemon-probe behavior under reachable/unreachable/degraded.

### Changed

- `mcp_server/handlers/memory-causal-stats.ts` (Cluster 4) — emits all 6 documented relation types with zero-count rows; gates `health` on `meetsTarget`; emits remediation hint when target missed.
- `mcp_server/handlers/memory-context.ts` (Cluster 5) — conditional "degraded" hint suppressed on cold-start ephemeral sessions; memory-specific session-id threaded through the harness for dedup; trigger and constitutional channels participate in dedup.
- `mcp_server/handlers/memory-crud-health.ts` (Cluster 6) — `cocoIndex.status` field surfaced in `memory_health` response.
- `mcp_server/lib/search/folder-discovery.ts` (Cluster 6) — per-token similarity threshold (default 0.45) gates folder binding; weak-signal auto-bind removed.
- `mcp_server/lib/search/intent-classifier.ts` (Cluster 7) — formal 20-paraphrase corpus integration replaces informal `intent-classifier.vitest.ts:T060` test.
- `mcp_server/lib/search/query-router.ts` (Cluster 7) — 3-tier FTS5 → BM25 → Grep fallback engages on `quality:"gap"` with `avg_score<0.20`; time-bounded at 200ms.
- `commands/memory/search.md` — documents AskUserQuestion custom-answer routing (REQ-014) and the "structural code graph" / "memory causal graph" naming disambiguation (REQ-017).

### Decisions

- **REQ-011** resolved: memory-specific session-id threaded through the command harness (preferred narrow path; not a global session-id refactor).
- **REQ-017** resolved: renamed to "structural code graph" + "memory causal graph" everywhere (startup hook, `causal_stats` output, `commands/memory/search.md`).
- **REQ-014** resolved: documented existing custom-answer-becomes-QUERY behavior (minimal scope; no new menu options).

### Verification

- TypeScript compile: clean (via `node ../node_modules/typescript/lib/tsc.js --noEmit -p tsconfig.json`; pnpm tsc had a binary-link issue in mcp_server, codex worked around).
- Packet-focused vitest suite: **121/121 PASS** across 6 files (4 new + intent-classifier + query-router).
- Strict packet validation: PASS (0 errors, 0 warnings).
- Sibling Cluster 1-3 regression suite: PASS (no regression on the prior P0 fixes).

### Known caveats

Full-repo `pnpm vitest run` reports 198 failures across 166 files at this packet's ship time. Sampled failures sit entirely in skill_advisor scorer / hooks / scaffold / alignment / code-graph subsystems — outside this packet's surface. Codex fixed 10 packet-adjacent failures during its run. The remaining 198 are pre-existing baseline drift addressed by sibling packet `026/000/003-vitest-baseline-recovery` (Unit F).
