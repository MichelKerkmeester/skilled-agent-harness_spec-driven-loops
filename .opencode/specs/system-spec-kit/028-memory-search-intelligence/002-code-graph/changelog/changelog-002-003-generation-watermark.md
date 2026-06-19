---
title: "Changelog: Code Graph — Generation Watermark (Q6-C2 → Q6-C1) [002-code-graph/003-generation-watermark]"
description: "Chronological changelog for the Code Graph — Generation Watermark (Q6-C2 → Q6-C1) phase."
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

> Spec folder: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/002-code-graph/003-generation-watermark` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/002-code-graph`

### Summary

Q6-C2 is built. The code-graph subsystem now stores a monotonic generation counter in the existing code_graph_metadata KV table, advances it from the scan promotion finalize path, and surfaces it as an additive field on metadata.freshness from code_graph_context.

### Added

- Re-confirm the live seams at implementation time: scanPromotable block in handlers/scan.ts, freshness envelope type in code-graph-context.ts, computeFreshness() (rg/direct read evidence)
- Add getCodeGraphGeneration(): number — read graph_generation via getMetadata, parseInt(value, 10) || 0 (malformed/unset → 0) (code-graph-db.ts; covered by code-graph-db.vitest.ts)
- Add bumpCodeGraphGeneration(): number — read current, setMetadata('graph_generation', String(n+1)), return n+1; export beside existing metadata helpers (code-graph-db.ts; covered by code-graph-db.vitest.ts)
- Add generation: number to the freshness envelope type (code-graph-context.ts; covered by typecheck)
- remains [B] by design (Q6-C1 DEFER-speculative) — recorded, not implemented
- CHK-012 Error handling implemented (parseInt || 0 for malformed/unset generation; covered by code-graph-db.vitest.ts)

### Changed

- Confirm the REFUTED bump site: ensure-ready.ts:497 is setLastGitHead(currentHead) inside the headChanged && headScope==='out-of-scope' return-fresh branch — does NOT fire on full_scan/selective_reindex (verified during planning; research iter-23/24, roadmap BROADENING L220)
- Confirm storage substrate: code_graph_metadata KV table present (code-graph-db.ts:193/:456), stores strings only; Number.parseInt-with-fallback precedent at :241; helper export block ~:556-627 (verified during planning)
- Confirm PENDING baseline: zero bumpCodeGraphGeneration/getCodeGraphGeneration/graph_generation tokens in system-code-graph/mcp_server (grep returned empty during planning)
- Call graphDb.bumpCodeGraphGeneration() once inside the if (scanPromotable) finalize block (handlers/scan.ts) — NOT at ensure-ready.ts:497 (covered by code-graph-scan.vitest.ts)
- Stamp generation: getCodeGraphGeneration() (default 0) in computeFreshness() so it flows to both main and empty-fallback envelopes (code-graph-context.ts; covered by code-graph-context-handler.vitest.ts)
- Unit: getCodeGraphGeneration() returns 0 when unset and on a malformed KV value; bumpCodeGraphGeneration() increments 0→1→2 (code-graph-db.vitest.ts)

### Fixed

- Confirm the correct bump site: handlers/scan.ts if (scanPromotable) finalize block (~:666-679), beside setLastGitHead (:672) and setCodeGraphScope (:679) — fires after both full and selective promotion (verified during planning)
- CHK-002 Technical approach defined in plan.md (staged Q6-C2 → Q6-C1, correct bump site)
- CHK-FIX-001 Finding class recorded: cross-consumer (corrects the refuted bump-site claim; the freshness envelope is a public field)
- CHK-FIX-002 Same-class producer inventory confirmed: the finalize block in handlers/scan.ts is the bump site
- CHK-FIX-003 Consumer inventory for the changed freshness envelope reviewed; no consumer branches on generation
- CHK-FIX-004 N/A — no security/path/parser/redaction surface; additive internal int only

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

- [B] (Q6-C1, DEFER-speculative — do NOT implement) as-of-generation hard error gate replacing the binary freshness !== 'fresh' block at handlers/query.ts:903-915; blocked on Q1-C1 cluster + named consumer. Design captured in spec §3/§6; no code this phase.
- Q6-C1 deferred. The hard as-of-generation error gate remains DEFER-speculative; it ships only on a named-consumer decision plus the Q1-C1 bi-temporal cluster (SCHEMA_VERSION 5→6).
- Generated dist/ not refreshed. Verification used TypeScript source checks and Vitest; no build artifact update was requested.
- No commit SHA. The user explicitly requested no git commit, so evidence is pinned to file changes and command results rather than a commit hash.
