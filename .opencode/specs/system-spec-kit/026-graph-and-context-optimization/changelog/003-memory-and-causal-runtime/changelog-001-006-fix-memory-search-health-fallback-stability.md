---
title: "Memory Search Clusters 4-7 Remediation: Causal Stats, Folder Discovery, CocoIndex Health, Quality Fallback"
description: "Closed 13 deferred P1/P2 defects from phase 005 across causal-stats output hygiene, state hygiene, folder discovery weak-signal gating, CocoIndex daemon health visibility, plus 3-tier FTS quality fallback routing. All 13 requirements closed with zero deferrals."
trigger_phrases:
  - "memory search clusters 4-7 remediation"
  - "cocoindex daemon health probe"
  - "folder discovery weak signal gate"
  - "quality fallback fts5 bm25 grep"
  - "causal stats output hygiene fix"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-08

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/001-continuity-memory-runtime/006-fix-memory-search-health-fallback-stability` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/001-continuity-memory-runtime`

### Summary

Phase 005 had audited memory search and deferred 13 P1/P2 defects across four clusters: causal-stats emitted only 3 of 6 required relation types with no health degradation on missed targets, memory-context leaked stale degraded hints on cold-start sessions, folder discovery auto-bound on weak token matches without a similarity gate. The query router had no fallback when retrieval quality was flagged as a gap.

All 13 requirements closed in a single cli-codex dispatch (21 minutes). The causal stats handler now zero-fills all six relation types and gates health on coverage targets with a remediation hint. Folder auto-binding requires each query token to clear a configurable 0.45 similarity threshold. CocoIndex daemon health is probed with a 30-second TTL cache and surfaced in `memory_health`. The query router engages a 3-tier FTS5 to BM25 to Grep fallback within 200ms when `quality:"gap"` and `avg_score < 0.20`. A formal 20-paraphrase intent-classifier stability corpus replaced the informal T060 check.

### Added

- `mcp_server/lib/causal/relation-coverage.ts` (NEW): per-relation coverage tracker for the causal-graph backfill job with targets for all six relation types
- `mcp_server/lib/cocoindex/daemon-probe.ts` (NEW, removed in later packet 014/010): CocoIndex daemon liveness probe with 30-second TTL and reachable/unreachable/degraded state classification
- `mcp_server/tests/intent-classifier-corpus.vitest.ts` (NEW): formal 20-paraphrase stability corpus with golden outputs and 80% accuracy floor
- `mcp_server/tests/causal-stats-output.vitest.ts` (NEW): output schema verification for `memory_causal_stats` covering all six relation types
- `mcp_server/tests/folder-discovery-threshold.vitest.ts` (NEW): per-token similarity threshold test for the 0.45 binding gate
- `mcp_server/tests/cocoindex-daemon-probe.vitest.ts` (NEW, removed in later packet 014/010): daemon-probe behavior test for reachable, unreachable, plus degraded states

### Changed

- `mcp_server/handlers/causal-graph.ts`: emits all six documented relation types with zero-count rows, gates `health` on `meetsTarget`. Emits a remediation hint when coverage misses target.
- `mcp_server/handlers/memory-context.ts`: suppresses degraded hint on cold-start ephemeral sessions. Threads a memory-specific runtime session id for dedup across trigger and constitutional channels.
- `mcp_server/handlers/memory-crud-health.ts`: surfaces `cocoIndex.status` field driven by the daemon probe
- `mcp_server/lib/search/folder-discovery.ts`: requires each meaningful query token to clear a configurable similarity threshold (default 0.45) before folder auto-binding fires
- `mcp_server/lib/search/query-router.ts`: engages 3-tier FTS5 to BM25 to Grep fallback with 200ms budget when quality gap is detected
- `mcp_server/lib/search/intent-classifier.ts`: integrates the formal 20-paraphrase corpus replacing the informal T060 stability check
- `mcp_server/lib/query/query-plan.ts`: fallback policy shape extended with tier and deadline metadata
- `commands/memory/search.md`: documents AskUserQuestion custom-answer routing and the "structural code graph" vs. "memory causal graph" naming disambiguation

### Fixed

- `memory_causal_stats` always returned `health: "healthy"` even when relation coverage was below target. Health now degrades to attention or degraded with an explanation when `meetsTarget` is false.
- `memory_causal_stats` silently omitted the `produced` and `cited_by` relation types. All six types are now zero-filled in every response.
- `memory_context` emitted a "Context quality is degraded" hint on cold-start ephemeral sessions that had no prior context. Hint is now suppressed when `sessionScope=="ephemeral"` and `eventCounterStart==0`.
- Folder discovery auto-bound "Semantic Search" to an unrelated spec folder with no semantic relationship. The per-token similarity gate eliminates weak-signal bindings.
- `memory_health` had no visibility into CocoIndex daemon state. The probe status is now surfaced as `cocoIndex.status`.
- The query router did not engage fallback tiers when retrieval quality was flagged as a gap. The 3-tier fallback now fires automatically on `quality:"gap"` with `avg_score < 0.20`.

### Verification

| Check | Result |
|-------|--------|
| `node ../node_modules/typescript/lib/tsc.js --noEmit --composite false -p tsconfig.json` | PASS |
| `pnpm tsc --noEmit` | FAIL: wrapper cannot find `tsc` in `mcp_server/node_modules/.bin`. Direct compiler path used instead. |
| Focused packet battery (11 files, 114 tests): `intent-classifier-corpus`, `causal-stats-output`, `folder-discovery-threshold`, `cocoindex-daemon-probe`, `query-router`, `handler-causal-graph`, `integration-causal-graph`, `memory-search-ux-hooks`, Gate D search pipeline, Gate D embedding search, `memory-search-eval-channels` | PASS |
| `pnpm vitest run` full suite | FAIL: 6 suites and 208 tests failed repo-wide across advisor, hook, scaffold, alignment plus code-graph fixtures. Pre-existing baseline failures addressed by sibling packet 026/000/003-vitest-baseline-recovery. |
| `validate.sh .../006-fix-memory-search-health-fallback-stability --strict` | PASS: exit 0, zero errors, zero warnings |
| Requirements closed | 13 of 13 closed, 0 deferred |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `mcp_server/handlers/causal-graph.ts` | Modified | All six relation types with zero-count rows. Health gated on `meetsTarget`. Remediation hint on sub-target coverage. |
| `mcp_server/lib/causal/relation-coverage.ts` | Created (NEW) | Per-relation coverage targets and current-state tracker for the backfill job. |
| `mcp_server/handlers/memory-context.ts` | Modified | Memory-specific runtime session id for dedup. Cold-start degraded hint suppressed. |
| `mcp_server/handlers/memory-search.ts` | Modified | CocoIndex status warning and quality-gap fallback telemetry. |
| `mcp_server/lib/search/folder-discovery.ts` | Modified | Per-token similarity gate at threshold 0.45 replaces unconditional auto-bind. |
| `mcp_server/lib/cocoindex/daemon-probe.ts` | Created (NEW) | CocoIndex probe with 30-second TTL. Removed in packet 014/010. |
| `mcp_server/handlers/memory-crud-health.ts` | Modified | `cocoIndex.status` field added to `memory_health` response. |
| `mcp_server/lib/search/query-router.ts` | Modified | 3-tier fallback plan on `quality:"gap"` with FTS5, BM25 plus Grep tiers at 200ms budget. |
| `mcp_server/lib/query/query-plan.ts` | Modified | Fallback policy shape with tier and deadline metadata. |
| `mcp_server/lib/search/intent-classifier.ts` | Modified | Formal 20-paraphrase corpus integration replaces informal T060 test. |
| `commands/memory/search.md` | Modified | Custom-answer routing and structural/causal graph naming disambiguation documented. |
| `mcp_server/tests/intent-classifier-corpus.vitest.ts` | Created (NEW) | 20-paraphrase stability corpus with 80% accuracy floor. |
| `mcp_server/tests/causal-stats-output.vitest.ts` | Created (NEW) | Output schema test for all six relation types in `memory_causal_stats`. |
| `mcp_server/tests/folder-discovery-threshold.vitest.ts` | Created (NEW) | Per-token similarity threshold test for the folder binding gate. |
| `mcp_server/tests/cocoindex-daemon-probe.vitest.ts` | Created (NEW) | Daemon probe behavior test. Removed in packet 014/010. |
| `mcp_server/tests/query-router.vitest.ts` | Modified | Router fallback assertions added. |
| `mcp_server/tests/integration-causal-graph.vitest.ts` | Modified | Causal graph integration assertions updated. |

### Follow-Ups

- Resolve repo-wide Vitest baseline failures before claiming full-suite green. Pre-existing failures in advisor, hook, scaffold, alignment plus code-graph fixtures are tracked in sibling packet 026/000/003-vitest-baseline-recovery.
- The `pnpm tsc --noEmit` wrapper is unavailable in `mcp_server/node_modules/.bin`. Add a package.json script or symlink so the standard invocation works without the absolute compiler path.
- CocoIndex daemon probe uses filesystem liveness checks (PID, log, lock, socket) with a 30-second TTL. It cannot verify process arguments or environment values. A future packet could strengthen the probe if live HTTP healthcheck becomes available.
