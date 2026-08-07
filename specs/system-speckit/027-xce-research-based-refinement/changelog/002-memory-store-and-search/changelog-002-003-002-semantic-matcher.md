---
title: "Semantic Trigger Fallback 002: Semantic Matcher with Default-Off Shadow Wiring"
description: "Implements a pure semantic trigger matcher that reads only from cache, computes cosine scores with threshold/margin/max gates, and surfaces shadow stats through memory_match_triggers metadata. Lexical results are unchanged. The matcher is opt-in behind SPECKIT_SEMANTIC_TRIGGERS."
trigger_phrases:
  - "027 phase 002/003 002 semantic matcher"
  - "semantic trigger shadow matcher"
  - "cosine trigger matching"
  - "SPECKIT_SEMANTIC_TRIGGERS flag"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-10

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/003-semantic-trigger-fallback/002-semantic-matcher` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/003-semantic-trigger-fallback`

### Summary

The schema substrate from leaf 001 is consumed here. This leaf adds a pure semantic trigger matcher that reads cached prompt and trigger embeddings, computes cosine similarity with threshold, margin, and max gates, and deduplicates results. The matcher is integrated into `memory_match_triggers` as a shadow stage: when `SPECKIT_SEMANTIC_TRIGGERS` is unset the handler does not initialize the matcher at all. When the flag is set, semantic scores are logged and returned as metadata fields only. Returned lexical results and activation behavior are bit-for-bit identical in both states.

No schema version bump was needed: the implementation reads from the v34 tables added in leaf 001 and adds no columns or indexes.

### Added

- `mcp_server/lib/triggers/semantic-trigger-matcher.ts` — pure matcher; cache loader; cached-query lookup; cosine computation with threshold/margin/max gates; shadow stats output
- `mcp_server/tests/semantic-trigger-matcher.vitest.ts` — cosine accuracy, gate behavior, cache miss handling, default-off enforcement, and shadow stats tests

### Changed

- `mcp_server/handlers/memory-triggers.ts` — default-off semantic shadow wiring; matcher initialized only when flag is set; shadow metadata appended to response; lexical output path unchanged
- `mcp_server/handlers/mutation-hooks.ts` — semantic trigger cache cleared alongside the existing mutation cache hook on write
- `mcp_server/tests/handler-memory-triggers.vitest.ts` — default-off and shadow-only regression tests added
- `mcp_server/ENV_REFERENCE.md` — semantic trigger matcher flags documented

### Fixed

- None. This leaf is additive; it does not change any existing behavior when the flag is off.

### Verification

| Check | Result |
|-------|--------|
| `npm run build` (mcp_server workspace) | PASS |
| `npx vitest run tests/semantic-trigger-matcher.vitest.ts tests/handler-memory-triggers.vitest.ts tests/trigger-embedding-backfill.vitest.ts tests/vector-index-schema*.vitest.ts tests/causal-edges-write-safety.vitest.ts tests/secret-scrubber.vitest.ts` | PASS (9 files / 84 tests) |
| Comment hygiene check on changed TypeScript files | PASS |
| Alignment verifier on changed-scope directories | PASS |
| `validate.sh --strict` on spec folder | PASS (exit 0) |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `mcp_server/lib/triggers/semantic-trigger-matcher.ts` | Created | Pure matcher, cache loader, cached-query lookup, cosine scoring gates, shadow stats |
| `mcp_server/handlers/memory-triggers.ts` | Modified | Default-off shadow wiring; lexical output path unchanged |
| `mcp_server/handlers/mutation-hooks.ts` | Modified | Semantic trigger cache cleared with existing mutation cache hook |
| `mcp_server/tests/semantic-trigger-matcher.vitest.ts` | Created | Cosine, gates, cache, default-off, and shadow tests |
| `mcp_server/tests/handler-memory-triggers.vitest.ts` | Modified | Handler default-off and shadow-only regression tests |
| `mcp_server/ENV_REFERENCE.md` | Modified | Semantic trigger matcher flags documented |

### Follow-Ups

- Union mode is explicitly out of scope for this leaf. Semantic matches are shadow-only and cannot affect returned trigger results until a later evidence phase promotes them.
- Prompt cache miss produces a `no_query_embedding` shadow stat. The matcher does not generate query embeddings in the trigger hot path. This is by design and is carried forward to leaf 004.
