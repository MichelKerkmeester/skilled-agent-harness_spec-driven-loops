---
title: "Changelog: Code Graph - Generation Watermark (Q6-C2 → Q6-C1) [002-code-graph/003-generation-watermark]"
description: "Chronological changelog for the Code Graph - Generation Watermark (Q6-C2 → Q6-C1) phase."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-19

> Spec folder: `.opencode/specs/system-code-graph/001-code-graph-core/003-generation-watermark` (Level 2)
> Parent packet: `.opencode/specs/system-code-graph/001-code-graph-core`

### Summary

The code-graph subsystem now stores a monotonic generation counter in the existing `code_graph_metadata` key-value table. Promoted full scans and selective reindexes bump the counter from the scan finalize path and `code_graph_context` exposes the value as an additive `metadata.freshness.generation` field. The hard stale-read error gate remains deferred until a named consumer needs it.

### Added

- `getCodeGraphGeneration()` and `bumpCodeGraphGeneration()` over the existing metadata table.
- `generation` on the freshness envelope returned by `code_graph_context`.
- Fallback handling that treats unset or malformed metadata as generation `0`.

### Changed

- The bump happens in `handlers/scan.ts` after an actual promotable scan, not in readiness handling.
- `computeFreshness()` stamps the current generation on both normal and empty fallback envelopes.
- Generation state uses the existing string-valued metadata substrate.

### Fixed

- Full and selective scan promotions now advance a shared read-visible counter.
- Failed promotions and no-op scans leave the generation unchanged.
- The stale bump-site assumption is corrected in the phase docs.

### Verification

- Baseline tsc --noEmit -p tsconfig.json - PASS
- Baseline targeted Vitest - PASS: 3 files / 54 tests
- Post-change tsc --noEmit -p tsconfig.json - PASS
- Post-change targeted Vitest - PASS: 4 files / 64 tests
- Real-scan smoke Vitest - PASS: 1 file / 5 tests
- Mutation falsifier - PASS: removing the bump call made the focused scan test fail (0 calls vs expected 2)
- Alignment drift - PASS: scanned 155 files, 0 findings
- Comment hygiene - PASS on touched source/test files

### Files Changed

| File | Action | What changed |
|---|---|---|
| `system-code-graph/mcp_server/lib/code-graph-db.ts` | Modified | Added getCodeGraphGeneration() / bumpCodeGraphGeneration() over code_graph_metadata |
| `system-code-graph/mcp_server/handlers/scan.ts` | Modified | Bumps generation in the scanPromotable finalize block for actual promotions |
| `system-code-graph/mcp_server/lib/code-graph-context.ts` | Modified | Adds generation to the freshness envelope and stamps it in computeFreshness() |
| `system-code-graph/mcp_server/tests/code-graph-db.vitest.ts` | Modified | Covers unset/malformed generation and 0→1→2 increments |
| `system-code-graph/mcp_server/tests/code-graph-scan.vitest.ts` | Modified | Covers full/selective promotion bumps and failed/no-op no-bump paths |
| `system-code-graph/mcp_server/tests/code-graph-context-handler.vitest.ts` | Modified | Verifies the envelope carries generation while node/edge output stays byte-identical |
| `system-code-graph/mcp_server/tests/code-graph-siblings-readiness.vitest.ts` | Modified | Keeps mocked DB surface in parity with the new helper export |

### Follow-Ups

- The hard as-of-generation error gate remains deferred until a named consumer appears.
- Generated `dist/` output was not refreshed. Verification used TypeScript source checks and Vitest.
- No commit was created by request, so evidence is pinned to local file changes and command results.
