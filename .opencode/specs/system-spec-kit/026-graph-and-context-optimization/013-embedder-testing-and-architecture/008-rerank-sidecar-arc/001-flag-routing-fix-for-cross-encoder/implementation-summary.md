---
title: "Implementation Summary: Flag-routing fix for cross-encoder HTTP local provider [template:level_1/implementation-summary.md]"
description: "Implemented Stage 3 reranker flag precedence so SPECKIT_CROSS_ENCODER wins over RERANKER_LOCAL, with helper hardening, regression tests, docs updates, and verification evidence."
trigger_phrases:
  - "001 implementation summary"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/008-rerank-sidecar-arc/001-flag-routing-fix-for-cross-encoder"
    last_updated_at: "2026-05-20T14:46:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Implemented Phase 001 flag-routing precedence fix and focused regression coverage"
    next_safe_action: "Commit Phase 001 changes, then continue to phase 002-system-rerank-sidecar-skill"
    blockers: []
    completion_state: "implemented_verified"
---
# Implementation Summary: Flag-routing fix for cross-encoder HTTP local provider

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary-core | v2.2 -->

> **Status: IMPLEMENTED + VERIFIED.** Phase 001 fixed the reranker flag precedence that made the HTTP cross-encoder path unreachable when `RERANKER_LOCAL=true` was also set.

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Status** | Implemented + verified |
| **Created** | 2026-05-20 |
| **Branch** | `main` |
| **Parent Arc** | `008-rerank-sidecar-arc` |
| **Position in arc** | Phase 001 of 5 — the precedence-fix prerequisite |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

- `stage3-rerank.ts` now computes both reranker gates once and routes to the cross-encoder path before the legacy local shim (`stage3-rerank.ts:379-472`).
- `search-flags.ts::isLocalRerankerEnabled()` now returns `false` whenever `isCrossEncoderEnabled()` is true (`search-flags.ts:364-367`).
- `local-reranker.ts` header now documents that the compatibility shim activates only when `SPECKIT_CROSS_ENCODER` is not set (`local-reranker.ts:4-7`).
- `ENV_REFERENCE.md` now documents that `SPECKIT_CROSS_ENCODER` takes precedence over `RERANKER_LOCAL` (`ENV_REFERENCE.md:212`).
- `stage3-rerank-regression.vitest.ts` has two new dispatch cases: both flags true invokes cross-encoder, and `RERANKER_LOCAL=true` alone invokes the legacy shim (`stage3-rerank-regression.vitest.ts:93`, `stage3-rerank-regression.vitest.ts:124`).

Observable behavior change:
- Setting `SPECKIT_CROSS_ENCODER=true` is now sufficient to route Stage 3 through the HTTP cross-encoder pipeline (provided a provider is reachable; with no sidecar running yet, this means positional fallback — same as today).
- Setting `RERANKER_LOCAL=true` alone still activates the no-op shim (legacy behavior unchanged).
- Setting both: cross-encoder wins (the bug fix).
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

- Phase A audited `stage3-rerank.ts:390-430`, `local-reranker.ts:1-80`, and all `isLocalRerankerEnabled()` references. `rg` found 6 matches: 5 call sites plus the helper definition. Runtime call sites were `stage3-rerank.ts` and `hybrid-search.ts`; the shim has no side effects because `canUseLocalReranker()` returns `false` and `rerankLocal()` returns `candidates`.
- Phase B made the surgical precedence change in Stage 3 and added the defense-in-depth helper guard. The early Stage 3 guard also now allows either reranker gate through, which preserves the specified `RERANKER_LOCAL=true`-alone behavior.
- Phase C added the two required regression tests and adjusted two older local-shim tests so they explicitly set cross-encoder off; those older tests had been relying on the previous shadowing behavior.
- Documentation was updated in `local-reranker.ts`, `ENV_REFERENCE.md`, `tasks.md`, and this implementation summary.

The change is small in source LOC, but it is load-bearing for the rest of the 008 arc because the phase-002 sidecar would otherwise remain unreachable from Stage 3.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

### D-001: Defense-in-depth precedence guard in helper, not just at dispatch site
**Decision:** Add the `isCrossEncoderEnabled() → return false` short-circuit inside `isLocalRerankerEnabled()` itself, not just at the dispatch in `stage3-rerank.ts`.
**Rationale:** Stage 3 has 600+ lines and `isLocalRerankerEnabled()` is called from multiple sites (the hybrid-search pipeline and the local-reranker module itself). Centralizing the precedence in the helper means future callers can't accidentally re-introduce the shadowing bug.

### D-002: Keep `local-reranker.ts` as a no-op shim, don't delete it
**Decision:** The shim stays; legacy behavior for `RERANKER_LOCAL=true` alone is preserved.
**Rationale:** A few tests still import from it; deleting it is a follow-on cleanup with its own scope. This phase is laser-focused on the precedence fix.

### D-003: Don't change `cross-encoder.ts:55` default model in this phase
**Decision:** The model name stays `cross-encoder/ms-marco-MiniLM-L-6-v2` for now.
**Rationale:** Phase 005 of the arc handles the default flip to Qwen — gated on phase 004's benchmark results. Phase 001's scope is precedence only; mixing the model change in would conflate two independently-verifiable changes.

### D-004: Treat the spec's legacy-preservation test as authoritative
**Decision:** Stage 3 now allows either `SPECKIT_CROSS_ENCODER` or `RERANKER_LOCAL` through the early rerank guard before applying the precedence chain.
**Rationale:** The pre-patch early guard required cross-encoder even for the local shim. That contradicted T009, which requires `RERANKER_LOCAL=true` alone to invoke the shim, so the implementation follows the phase contract.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

Executed verification:
```bash
cd .opencode/skills/system-spec-kit/mcp_server && npm run build
> @spec-kit/mcp-server@1.8.0 build
> tsc --build && node scripts/finalize-dist.mjs
# Exit 0

cd .opencode/skills/system-spec-kit/mcp_server && npx vitest run tests/stage3-rerank-regression.vitest.ts
Test Files  1 passed (1)
Tests  10 passed (10)
# Exit 0

SPECKIT_CROSS_ENCODER=true RERANKER_LOCAL=true npx vitest run tests/stage3-rerank-regression.vitest.ts -t "SPECKIT_CROSS_ENCODER=true takes precedence over RERANKER_LOCAL=true"
Test Files  1 passed (1)
Tests  1 passed | 9 skipped (10)
# Exit 0

bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/008-rerank-sidecar-arc/001-flag-routing-fix-for-cross-encoder --strict
Summary: Errors: 0  Warnings: 0
RESULT: PASSED
# Exit 0
```

One verification loop caught a real regression-test mismatch: the first focused Vitest run failed 2 older local-shim tests because they relied on the old cross-encoder/local co-set behavior. The tests were updated to set `flagState.crossEncoder = false` when asserting the legacy local path.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No sidecar runs yet.** This phase only fixes the routing; setting `SPECKIT_CROSS_ENCODER=true` still results in positional fallback because nothing answers at `localhost:8765`. Phase 002 closes that.
2. **`RERANKER_LOCAL=true` legacy alone path stays a no-op.** The shim doesn't do real reranking; it's preserved for backward compatibility with existing operator setups, not because it adds value. A future cleanup packet may delete it entirely once the sidecar is the only real path.
3. **`local-reranker.ts` is still imported.** Even though it's a no-op, removing the import would touch 3-4 test files. Out of scope for this phase.
<!-- /ANCHOR:limitations -->

## Commit Handoff

### Files to stage
.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts
.opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts
.opencode/skills/system-spec-kit/mcp_server/lib/search/local-reranker.ts
.opencode/skills/system-spec-kit/mcp_server/tests/stage3-rerank-regression.vitest.ts
.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md
.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/008-rerank-sidecar-arc/001-flag-routing-fix-for-cross-encoder/tasks.md
.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/008-rerank-sidecar-arc/001-flag-routing-fix-for-cross-encoder/implementation-summary.md

### Suggested commit message subject
feat(016/008/001): cross-encoder flag-routing precedence fix

### Suggested commit message body
- Route Stage 3 to `SPECKIT_CROSS_ENCODER` before the legacy `RERANKER_LOCAL` shim.
- Harden `isLocalRerankerEnabled()` so future callers cannot shadow the cross-encoder path.
- Preserve `RERANKER_LOCAL=true` alone as the legacy no-op shim path.
- Add focused Stage 3 regression tests for both precedence and legacy preservation.
- Verify with `npm run build`, focused Vitest, and strict spec validation.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
