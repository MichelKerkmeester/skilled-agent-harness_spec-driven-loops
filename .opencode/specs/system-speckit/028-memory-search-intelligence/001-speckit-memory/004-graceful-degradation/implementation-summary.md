---
title: "Implementation Summary: Memory MCP C9: Graceful Embedder-Degrade to Lexical"
description: "Memory recall now degrades to lexical (BM25/FTS) and reports embedder_available:false when the embedder is unavailable, instead of throwing. The happy path is byte-identical. Shipped in 030 commit 484b77b589. This record tracks done-state in the 028 impl tree."
trigger_phrases:
  - "C9 implementation summary embedder degrade"
  - "memory recall lexical fallback shipped"
  - "embedder_available false done record"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/001-speckit-memory/004-graceful-degradation"
    last_updated_at: "2026-07-04T17:50:57.895Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Record C9 done-state (030 commit 484b77b589) in the 028 impl tree"
    next_safe_action: "None. C9 shipped and verified"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-001-004-graceful-degradation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 028-memory-search-intelligence/001-speckit-memory/004-graceful-degradation |
| **Completed** | 2026-06-18 |
| **Level** | 1 |
| **Candidates** | C9 (Done) |
| **Shipped In** | 030 commit `484b77b589` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

An embedder outage no longer takes Memory recall down with it. When the embedder returns a null or empty embedding, the search pipeline now degrades to lexical (BM25/FTS) candidate generation and reports `embedder_available:false` / `vector_search_skipped:true`, instead of throwing inside Stage-1 and being swallowed to empty candidates. You still get results, just the lexical tier, and the response tells you the dense channel was skipped.

### Graceful embedder-degrade on recall

C9 wired the null-embedding case into the channel-gating substrate that already existed. Before, both Stage-1 entry branches threw when `generateQueryEmbedding` came back null, the hybrid path and the vector path each raised an error before any channel logic ran. The keep-lexical machinery (`useVector=false` in `getAllowedChannels`) was sitting right there but unconnected to embedder availability. The fix routes the null-embedding case into that substrate: the hybrid path drops the vector channel via the live `useVector=false` route, and the vector/multi-concept branches got an explicit lexical route since they had no in-branch fallback. The embedder-success (happy) path is behaviorally byte-identical, only a genuinely null/empty embedding takes the degrade branch.

A documented scope addition came with it (benign, zero live blast radius, every caller pre-validates via Zod or `validateQuery`, or catches): pre-existing input-validation throws (`>5 concepts`, empty query/concept, unknown searchType) now propagate as a typed `Stage1InputError` to the caller rather than being swallowed to empty, plus a defensive handler-level concept guard. This keeps genuine input errors honest and consistent with the orchestrator's existing "Stage-1 failure is mandatory" contract, while only embedder-unavailability degrades.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `mcp_server/lib/search/pipeline/stage1-candidate-gen.ts` | Modified | Route null embedding → lexical instead of throwing. Typed `Stage1InputError` for genuine input errors |
| `mcp_server/lib/search/pipeline/types.ts` | Modified | Added `embedder_available` / `vector_search_skipped` to Stage-1 output metadata |
| `mcp_server/handlers/memory-search.ts` | Modified | Plumbed the degrade flags through the response + handler-level concept guard |
| `mcp_server/tests/stage1-embedder-degrade.vitest.ts` | Created | Degrade-to-lexical regression test (5 cases) |
| `mcp_server/tests/...regression-embedding-semantic-search.vitest.ts` | Created | Gate-D envelope assertion (happy path unchanged) |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Shipped as a single self-contained, reversible commit (`484b77b589`) on the work branch, one candidate at a time per the Wave-0 discipline: read the seam, implement, unit-test, build, run the suite, then an independent adversarial review. `tsc` and the build pass. 440 search/pipeline tests pass (2 pre-existing unrelated failures confirmed identical on baseline via stash). An independent opus adversarial review returned SHIP, the degrade was traced to BM25, the happy path proven byte-identical via `git diff -w` and the new metadata confirmed plumbed through the cache.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Promote the existing `useVector=false` substrate instead of building a new degrade path | The keep-lexical channel-gating already existed at `hybrid-search.ts:931-947`. The gap was only that embedder-unavailability was not detected and routed into it. S-effort wire-up, not a build [CONFIRMED: iter-003 C9-A]. |
| Give the vector/multi-concept branches an explicit lexical route | The `useVector=false` substrate only covered the hybrid entry path. Those branches had no in-branch fallback, so they needed an explicit route to keyword search [CONFIRMED: iter-034 C9-sketch]. |
| Make genuine input-validation failures throw a typed `Stage1InputError` (scope addition) | Degrading should cover embedder outages, not mask real input errors. Propagating them honestly keeps the orchestrator's "Stage-1 failure is mandatory" contract intact. Documented as benign/zero-live-blast and reviewed. |
| Keep the happy path byte-identical | An embedder-degrade fix must not perturb normal recall ranking. Verified arithmetically and via `git diff -w`. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `tsc` + build | PASS |
| Full search/pipeline suite | PASS, 440 tests (2 pre-existing unrelated failures confirmed identical on baseline) |
| `stage1-embedder-degrade.vitest.ts` (5 cases) | PASS |
| Gate-D envelope assertion (happy path unchanged) | PASS |
| Happy path byte-identical | PASS, traced via `git diff -w`. Degrade traced to BM25 |
| Independent opus adversarial review | SHIP |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Old-contract callers.** Any caller that previously caught the embedder-unavailable exception to detect an outage must now read `embedder_available:false` instead. The behavior is reversible (revert `484b77b589`).
2. **Degrade quality is lexical-only.** During an embedder outage, recall runs on BM25/FTS/graph without the dense channel, so semantic recall quality is reduced until the embedder returns. This is the intended downgrade, not a defect.
<!-- /ANCHOR:limitations -->
