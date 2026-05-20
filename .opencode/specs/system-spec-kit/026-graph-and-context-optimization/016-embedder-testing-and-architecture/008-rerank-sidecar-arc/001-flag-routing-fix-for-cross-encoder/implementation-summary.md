---
title: "Implementation Summary: Flag-routing fix for cross-encoder HTTP local provider [template:level_1/implementation-summary.md]"
description: "PRE-IMPLEMENTATION stub — narrative will be filled in after the patch lands. Captures the planned shape so /spec_kit:resume can pick this up cleanly."
trigger_phrases:
  - "001 implementation summary"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/001-flag-routing-fix-for-cross-encoder"
    last_updated_at: "2026-05-20T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Stub authored ahead of implementation"
    next_safe_action: "Implement patch, then fill in this file with evidence"
    blockers: []
    completion_state: "pre-implementation"
---
# Implementation Summary: Flag-routing fix for cross-encoder HTTP local provider

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary-core | v2.2 -->

> **Status: PRE-IMPLEMENTATION.** This file is the planned shape of the post-ship summary. Sections marked `(to fill)` will be populated once the patch is applied. The packet's spec/plan/tasks are complete; this file becomes the final record once verification passes.

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Status** | Planned (pre-implementation) |
| **Created** | 2026-05-20 |
| **Branch** | `main` |
| **Parent Arc** | `008-rerank-sidecar-arc` |
| **Position in arc** | Phase 001 of 5 — the precedence-fix prerequisite |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

(to fill after implementation)

Planned shape:

- `stage3-rerank.ts` dispatch precedence swap: `isCrossEncoderEnabled()` now checked before `isLocalRerankerEnabled()`.
- `search-flags.ts::isLocalRerankerEnabled()` hardened with a precedence guard: returns `false` whenever `isCrossEncoderEnabled()` is true.
- `local-reranker.ts` header doc-comment updated to document the precedence.
- `ENV_REFERENCE.md` `SPECKIT_CROSS_ENCODER` row updated to mention "Takes precedence over `RERANKER_LOCAL`".
- New Vitest cases in `tests/stage3-rerank-regression.vitest.ts` asserting the new precedence + the preserved legacy path.

Observable behavior change:
- Setting `SPECKIT_CROSS_ENCODER=true` is now sufficient to route Stage 3 through the HTTP cross-encoder pipeline (provided a provider is reachable; with no sidecar running yet, this means positional fallback — same as today).
- Setting `RERANKER_LOCAL=true` alone still activates the no-op shim (legacy behavior unchanged).
- Setting both: cross-encoder wins (the bug fix).
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

(to fill after implementation)

Planned shape:

- Phase A (audit): read the three relevant source files, enumerate `isLocalRerankerEnabled()` callers, confirm shim has no side-effects.
- Phase B (patch): two surgical edits to dispatch + helper, one doc-comment update, one ENV_REFERENCE row update.
- Phase C (verify): add 2 Vitest cases, run the suite, build, strict-validate this packet, manual smoke if time permits.

The change is small in source LOC (~20 lines net) but the architectural impact is load-bearing for the rest of the 008 arc.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

### D-001 (planned): Defense-in-depth precedence guard in helper, not just at dispatch site
**Decision:** Add the `isCrossEncoderEnabled() → return false` short-circuit inside `isLocalRerankerEnabled()` itself, not just at the dispatch in `stage3-rerank.ts`.
**Rationale:** Stage 3 has 600+ lines and `isLocalRerankerEnabled()` is called from multiple sites (the hybrid-search pipeline and the local-reranker module itself). Centralizing the precedence in the helper means future callers can't accidentally re-introduce the shadowing bug.

### D-002 (planned): Keep `local-reranker.ts` as a no-op shim, don't delete it
**Decision:** The shim stays; legacy behavior for `RERANKER_LOCAL=true` alone is preserved.
**Rationale:** A few tests still import from it; deleting it is a follow-on cleanup with its own scope. This phase is laser-focused on the precedence fix.

### D-003 (planned): Don't change `cross-encoder.ts:55` default model in this phase
**Decision:** The model name stays `cross-encoder/ms-marco-MiniLM-L-6-v2` for now.
**Rationale:** Phase 005 of the arc handles the default flip to Qwen — gated on phase 004's benchmark results. Phase 001's scope is precedence only; mixing the model change in would conflate two independently-verifiable changes.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

(to fill after implementation with actual command outputs)

Planned verification:
```bash
# Strict validate
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh \
  .opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/001-flag-routing-fix-for-cross-encoder \
  --strict
# Expect: Exit 0

# Build
cd .opencode/skills/system-spec-kit/mcp_server && npm run build
# Expect: Exit 0

# Vitest suite
cd .opencode/skills/system-spec-kit/mcp_server && npx vitest run tests/stage3-rerank-regression.vitest.ts
# Expect: All tests pass, including 2 new precedence cases
```
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

(to refine after implementation)

Planned limitations:

1. **No sidecar runs yet.** This phase only fixes the routing; setting `SPECKIT_CROSS_ENCODER=true` still results in positional fallback because nothing answers at `localhost:8765`. Phase 002 closes that.
2. **`RERANKER_LOCAL=true` legacy alone path stays a no-op.** The shim doesn't do real reranking; it's preserved for backward compatibility with existing operator setups, not because it adds value. A future cleanup packet may delete it entirely once the sidecar is the only real path.
3. **`local-reranker.ts` is still imported.** Even though it's a no-op, removing the import would touch 3-4 test files. Out of scope for this phase.
<!-- /ANCHOR:limitations -->
