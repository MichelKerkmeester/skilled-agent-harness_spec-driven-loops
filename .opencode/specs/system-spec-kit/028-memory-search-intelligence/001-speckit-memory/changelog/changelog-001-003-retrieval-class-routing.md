---
title: "Changelog: Memory MCP — Retrieval-Class Routing & Recall-Shape Intelligence [001-speckit-memory/003-retrieval-class-routing]"
description: "Chronological changelog for the Memory MCP — Retrieval-Class Routing & Recall-Shape Intelligence phase."
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

> Spec folder: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/001-speckit-memory/003-retrieval-class-routing` (Level 3)
> Parent packet: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/001-speckit-memory`

### Summary

C2-A, C2-C, and the C2-B mechanism are built in the Memory MCP search path. The implemented slice adds a deterministic retrieval-class axis, consumes it in query routing, and wires default-off retrieval profiles into the pre-fusion ranking seam without changing flags-off behavior.

### Added

- Create the C2-A pure classifier module mcp_server/lib/search/retrieval-class-classifier.ts (no I/O, no embedding call)
- Plumb retrievalClass onto RouteResult as an additive third axis, leaving tier and classification byte-identical (mcp_server/lib/search/query-router.ts)
- CHK-013 Changes extend existing seams (no new gating mechanism for C2-C; existing RouteResult axes untouched)
- CHK-020 All P0 acceptance criteria met (REQ-001 axis-additivity, REQ-002 single-hop graph-off, REQ-003 per-class weight honoring weight:0)
- CHK-031 No new untrusted-content render path introduced (recall-body escaping unchanged; C8 out of scope)
- CHK-110 C2-A classification adds negligible per-query latency (pure sync classifier; no I/O, embedding, or DB call)

### Changed

- Define the 5-class taxonomy (SingleHop/MultiHop/Temporal/Entity/Quote), the deterministic single-class precedence order, and the neutral default class (retrieval-class-classifier.ts; precedence Quote → Temporal → MultiHop → Entity → SingleHop → Neutral)
- C2-C: extend the preserved/includeDegree primitive so a SingleHop class forces graph-off even when intent/density would preserve; MultiHop retains existing preserve (mcp_server/lib/search/query-router.ts)
- C2-C test: SingleHop → preserved=false/includeDegree=false; MultiHop → unchanged; minimum-channels invariant still holds (tests/query-router.vitest.ts)
- C2-B: define per-class RetrievalProfile and inject it into RankedList.weight at the pre-fusion seam, honoring weight:0 (shared/algorithms/rrf-fusion.ts; mcp_server/lib/search/retrieval-profile.ts; hybrid-search.ts)
- C2-B: wire fusion to run with the live bonusOverChannels option so zeroed channels don't distort the convergence bonus (hybrid-search.ts; retrieval-profile.vitest.ts)
- [P] C2-B test: neutral/identity profile → fused output byte-identical to baseline; a zero-weight channel does not skew survivors (unit-rrf-fusion.vitest.ts; retrieval-profile.vitest.ts)

### Fixed

- [P] Author per-class adversarial fixtures + a totality property test (every query → exactly one class) + a multi-shape precedence test (tests/query-router.vitest.ts)
- CHK-022 Per-class adversarial fixtures pass (SingleHop vs MultiHop routing diverges correctly)
- CHK-FIX-001 Each candidate is classed: C2-A = algorithmic (classifier); C2-C/C2-B = cross-consumer (router + fusion); recall-shape = algorithmic; C-G2 = instance-only (gated).
- CHK-FIX-002 Same-class producer inventory done: rg -n 'RouteResult|retrievalClass' and rg -n 'RankedList|fuseResultsMulti|bonusOverChannels' across mcp_server/shared.
- CHK-FIX-004 C2-A classifier has adversarial table tests (empty query, multi-shape, temporal+entity precedence, neutral default).

### Verification

- Baseline Memory MCP typecheck - PASS - npm run typecheck, 0 errors before edits
- Baseline broad related Vitest - PASS - 7 files / 265 tests before edits
- Final Memory MCP typecheck - PASS - npm run typecheck, 0 errors
- Final shared typecheck - PASS - npm run typecheck, 0 errors
- Final broad related Vitest - PASS - 8 files / 281 tests
- Spec-folder strict validation (validate.sh --strict) - PASS - 0 errors, 0 warnings
- Comment hygiene - PASS - no code-comment scope labels added
- Neutral-profile byte-identity regression - PASS - flags-off/profile-neutral tests preserve fused output

### Files Changed

_No file-level detail recorded._

### Follow-Ups

- CHK-004 C-G2 keep-or-cut overlap check vs contextType + C2-A completed before any C-G2 code (REQ-007)
- CHK-011 No console errors or warnings in the Memory MCP build
- CHK-023 CG-iterative-context-extension termination property test (always stops by convergence OR cap)
- CHK-FIX-003 Consumer inventory done for changed surfaces: RouteResult readers, fusion-weight consumers, enforceTokenBudget callers, memory_context strategy router.
- CHK-FIX-005 Matrix axes listed before completion: retrieval-class (5) × intent (existing) × complexity tier (3).
- CHK-FIX-006 Flag-state variants exercised (each intelligence-class item tested both default-off and enabled).
