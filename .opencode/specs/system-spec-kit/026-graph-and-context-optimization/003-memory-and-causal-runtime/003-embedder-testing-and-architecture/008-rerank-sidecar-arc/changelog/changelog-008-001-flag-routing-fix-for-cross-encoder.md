---
title: "Flag-routing fix for cross-encoder HTTP local provider"
description: "Stage 3 reranker dispatch had RERANKER_LOCAL evaluated before SPECKIT_CROSS_ENCODER, making the HTTP cross-encoder path unreachable when both flags were set. Flag precedence was corrected, the helper was hardened, regression tests were added and docs were updated."
trigger_phrases:
  - "cross-encoder flag routing fix"
  - "SPECKIT_CROSS_ENCODER precedence"
  - "stage3-rerank flag gate"
  - "reranker local shim shadow"
  - "008 001 flag routing"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-20

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/008-rerank-sidecar-arc/001-flag-routing-fix-for-cross-encoder` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/008-rerank-sidecar-arc`

### Summary

Stage 3 reranker dispatch in `stage3-rerank.ts` evaluated `isLocalRerankerEnabled()` before the cross-encoder gate. When `RERANKER_LOCAL=true` was set alongside `SPECKIT_CROSS_ENCODER=true`, the no-op local-reranker shim won and the HTTP cross-encoder path was never reached. All searches fell back to positional scoring with `requestQuality: 'weak'`.

The fix swapped the gate order so `isCrossEncoderEnabled()` is checked first. A defense-in-depth guard was added directly inside `isLocalRerankerEnabled()` so future callers cannot reintroduce the shadowing bug. Two focused regression tests cover the corrected precedence path and the preserved legacy-shim path. Documentation in `ENV_REFERENCE.md` and the `local-reranker.ts` header were updated to reflect the new contract. This phase is the prerequisite fix for the 008 rerank-sidecar arc.

### Added

- Two regression test cases in `stage3-rerank-regression.vitest.ts`: one asserting cross-encoder wins when both flags are set, one asserting the legacy shim is used when only `RERANKER_LOCAL=true` is set.

### Changed

- `stage3-rerank.ts` dispatch order: `isCrossEncoderEnabled()` now evaluated before `isLocalRerankerEnabled()`.
- `isLocalRerankerEnabled()` in `search-flags.ts` now returns `false` when `isCrossEncoderEnabled()` is true (defense-in-depth guard at the helper level).
- `ENV_REFERENCE.md` row for `SPECKIT_CROSS_ENCODER` updated to document that it takes precedence over `RERANKER_LOCAL`.
- `local-reranker.ts` header comment updated to state the shim activates only when `SPECKIT_CROSS_ENCODER` is not set.

### Fixed

- `SPECKIT_CROSS_ENCODER=true` was insufficient to reach the HTTP cross-encoder path when `RERANKER_LOCAL=true` was also set. The shim no longer shadows the cross-encoder dispatch.
- Two older regression tests that relied on the previous shadowing behavior were updated to explicitly set `flagState.crossEncoder = false` when asserting legacy-shim behavior.

### Verification

| Check | Result |
|-------|--------|
| `npm run build` in `mcp_server/` | PASS (exit 0) |
| `npx vitest run tests/stage3-rerank-regression.vitest.ts` | PASS (10 of 10) |
| Focused run: both-flags-true precedence test | PASS (1 of 1) |
| `validate.sh --strict` on this packet | PASS (0 errors. 0 warnings) |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts` | Modified | Gate order swapped. `isCrossEncoderEnabled()` now precedes `isLocalRerankerEnabled()` in the dispatch chain. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts` | Modified | `isLocalRerankerEnabled()` returns `false` when cross-encoder is active. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/stage3-rerank-regression.vitest.ts` | Modified | Two new dispatch cases added. Two existing shim tests patched to set `crossEncoder = false`. |
| `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` | Modified | `SPECKIT_CROSS_ENCODER` row documents precedence over `RERANKER_LOCAL`. |

### Follow-Ups

- Remove `local-reranker.ts` in a follow-on cleanup packet once the sidecar is the sole active path and the import can be dropped from all test files.
- Phase 002 (`002-system-rerank-sidecar-skill`) must ship to make `SPECKIT_CROSS_ENCODER=true` observable beyond positional fallback. Nothing answers at `localhost:8765` until the sidecar is running.
- Verify that no downstream consumer of `WEIGHT_RERANKER` or `hasRerankerSignal` in `confidence-scoring.ts` assumed the no-op shim's behavior after this precedence change.
