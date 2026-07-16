---
title: "Changelog: Code Graph Degraded Stress Cell"
description: "Integration sweep that closed the v1.0.2 NEUTRAL verdict on packet 005 fast-fail by exercising code_graph_query fallbackDecision routing end-to-end across three engineered graph states with a live-DB byte-equality guard."
trigger_phrases:
  - "code graph degraded stress cell"
  - "fallbackDecision integration sweep"
  - "packet 005 PROVEN verdict"
  - "code-graph-degraded-sweep vitest"
  - "live DB byte-equality guard"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-27

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/013-code-graph-degraded-stress-cell` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings`

### Summary

The v1.0.2 stress run left packet 005 (code-graph fast-fail) with a NEUTRAL verdict because pre-flight recovery restored the live graph to a healthy state before each Q1 cell ran. The `fallbackDecision` routing in `code_graph_query` had passing mocked unit tests but no integration coverage against a real degraded graph. This packet adds one deterministic vitest that forces the graph into three engineered states using the existing `initDb(tmpdir)` isolation seam. It calls `handleCodeGraphQuery` end-to-end and asserts the expected `fallbackDecision` branch for each state. A sha256 live-DB byte-equality guard asserted in `afterAll` proves the production graph is untouched. Zero production code was modified.

### Added

- `code-graph-degraded-sweep.vitest.ts` integration sweep with four active tests covering Bucket A (empty graph routes to `code_graph_scan`), Bucket A' (broad-stale above `SELECTIVE_REINDEX_THRESHOLD` routes to `code_graph_scan`), Bucket B (readiness exception routes to `rg`) and Bucket C (fresh state emits no `fallbackDecision`)
- `pinCwd(tempDir)` helper using `vi.spyOn(process, 'cwd')` to produce unique readiness-debounce cache keys per test bucket
- Live-DB protection sanity test verifying the sha256 guard cannot silently no-op when the live DB is absent
- Live-DB sha256 hash capture in `beforeAll` with byte-equality assertion in `afterAll`

### Changed

- `mcp_server/code_graph/lib/ensure-ready.ts`: exported `SELECTIVE_REINDEX_THRESHOLD` constant (visibility-only change, no behavior change) so Bucket A' can import the boundary value directly and track future threshold adjustments without a test rewrite

### Fixed

- Packet 005 fast-fail verdict upgraded from NEUTRAL to PROVEN. The integration sweep exercises every `fallbackDecision` branch the handler emits, closing the coverage gap the v1.0.2 stress run identified.

### Verification

| Check | Result |
|-------|--------|
| `npx vitest run --config vitest.stress.config.ts mcp_server/stress_test/code-graph/code-graph-degraded-sweep.vitest.ts` | PASS. 5 tests pass, zero skips, exit code 0. |
| `npx vitest run mcp_server/tests/code-graph-*.vitest.ts` | PASS. 34 tests pass across 5 files, zero regressions, exit code 0. |
| Live-DB sha256 hash before/after sweep | PASS. Byte-equal, asserted in `afterAll`. |
| `npx tsc --noEmit -p tsconfig.json` (new file only) | PASS. Zero TypeScript errors. |
| `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh` on packet | PASS. Structural errors = 0, warnings = 0. |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `mcp_server/stress_test/code-graph/code-graph-degraded-sweep.vitest.ts` | Created (NEW) | Integration sweep. Three coverage buckets plus live-DB protection. |
| `mcp_server/code_graph/lib/ensure-ready.ts` | Modified | Exported `SELECTIVE_REINDEX_THRESHOLD` constant for test import. No behavior change. |

### Follow-Ups

- Bucket B uses a synthetic `vi.spyOn(getDb)` throw rather than a real DB-locked condition. Real-world DB-locked situations such as multi-process contention or OOM during `prepare()` may surface different error shapes. If new readiness-failure modes emerge in production, add them as additional buckets.
- A future v1.0.3 packet should re-run the full stress harness with this new cell baked in to confirm the PROVEN verdict is stable across multiple trials.
