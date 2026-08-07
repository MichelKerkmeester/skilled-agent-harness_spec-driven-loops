---
title: "Semantic Trigger Fallback 003: Hybrid Handler with Gated Stage 2 Union Fallback"
description: "Integrates a feature-flagged semantic Stage 2 into memory_match_triggers. Shadow mode is the default when the master flag is on; UNION mode requires an explicit mode flag and only supplements lexical results when the lexical stage is weak. Lexical precedence is preserved throughout."
trigger_phrases:
  - "027 phase 002/003 003 hybrid handler"
  - "hybrid trigger handler"
  - "semantic union fallback"
  - "SPECKIT_SEMANTIC_TRIGGERS_MODE union"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-10

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/003-semantic-trigger-fallback/003-hybrid-handler` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/003-semantic-trigger-fallback`

### Summary

This leaf implements the full two-stage hybrid handler behavior inside `memory_match_triggers`. The semantic stage from leaf 002 is now controlled by a mode gate. Master flag off leaves the handler entirely inert with unchanged lexical output. Master flag on with the default mode produces shadow metadata only and does not affect results. Setting `SPECKIT_SEMANTIC_TRIGGERS_MODE=union` allows the semantic stage to supplement results when the lexical stage is weak: empty or below the caller limit, except when an exact strong lexical match is present.

Lexical results are always ordered first. Semantic-only hits carry `matchSource: "semantic"`, `semanticScore`, and the matched phrase in `matchedPhrases`. Cognitive activation uses `1.0` for lexical matches and `min(0.85, semanticScore)` for semantic matches. Cold-start, missing cache, and matcher failures degrade to lexical-only with a union status annotation in the response metadata. Schema version remains 34.

### Added

- `mcp_server/tests/hybrid-trigger-handler.vitest.ts` — short-circuit, union supplement, and activation guard tests (2 files / 11 tests in this suite)
- `mcp_server/tests/lexical-parity.vitest.ts` — flag-off and shadow-default lexical parity tests

### Changed

- `mcp_server/handlers/memory-triggers.ts` — Stage 2 mode gate added; UNION path deduplicates semantic hits by memory id; lexical results ordered first; source-tagging and activation cap applied to semantic-only hits; cold-start and matcher failure degrades to lexical-only with status annotation
- `mcp_server/tests/handler-memory-triggers.vitest.ts` — shadow canary adjusted to a non-strong lexical prompt to maintain correct shadow-only assertion

### Fixed

- None. This leaf is additive handler behavior behind explicit flags.

### Verification

| Check | Result |
|-------|--------|
| New suites (hybrid-trigger-handler + lexical-parity) | PASS (2 files / 11 tests) |
| Canary suites (handler-memory-triggers + 3 others) | PASS (4 files / 25 tests) |
| `npm run build` | PASS (exit 0) |
| `SCHEMA_VERSION` check | PASS (remains 34) |
| `validate.sh --strict` on spec folder | PASS (exit 0) |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `mcp_server/handlers/memory-triggers.ts` | Modified | Stage 2 mode gate; UNION path with dedup, source-tagging, activation caps; degradation to lexical-only on cold-start or failure |
| `mcp_server/tests/hybrid-trigger-handler.vitest.ts` | Created | Short-circuit, union supplement, and activation guard tests |
| `mcp_server/tests/lexical-parity.vitest.ts` | Created | Flag-off and shadow-default parity tests |
| `mcp_server/tests/handler-memory-triggers.vitest.ts` | Modified | Shadow canary adjusted to non-strong lexical prompt |

### Follow-Ups

- Env flag documentation for `SPECKIT_SEMANTIC_TRIGGERS_MODE` was intentionally deferred to the final leaf (004) per the parent phase assignment.
- The scaffold referenced `mcp_server/__tests__/triggers/` as the test path. Implementation followed the repository's actual `mcp_server/tests/*.vitest.ts` convention. This is a documentation drift note only.
