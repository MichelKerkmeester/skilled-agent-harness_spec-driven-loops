---
title: "Implementation Summary: Retrieval-Class Routing & Recall-Shape Intelligence (028/001 impl)"
description: "Partial implementation record: C2-A, C2-C and the default-off C2-B mechanism are implemented. Recall-shape and benchmark-gated ranking calibration remain pending."
trigger_phrases:
  - "retrieval class routing implementation summary"
  - "c2-a c2-b c2-c status"
  - "recall shape cluster status"
  - "memory mcp retrieval shape impl summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/004-memory-search-intelligence/002-speckit-memory/003-retrieval-class-routing"
    last_updated_at: "2026-07-06T19:16:28.438Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Summarized C2-A/C2-C/C2-B"
    next_safe_action: "Implement pending recall gates"
    blockers: []
    key_files:
      - "implementation-summary.md"
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:3c0e0998148e8397f22100775a58904048dd9b17123871071df532b9ea48da26"
      session_id: "2026-06-19-028-001-003-retrieval-class-routing-replan"
      parent_session_id: null
    completion_pct: 45
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-retrieval-class-routing |
| **Status** | in_progress |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

C2-A, C2-C and the C2-B mechanism are built in the Memory MCP search path. The implemented slice adds a deterministic retrieval-class axis, consumes it in query routing and wires default-off retrieval profiles into the pre-fusion ranking seam without changing flags-off behavior.

Built artifacts:

- `mcp_server/lib/search/retrieval-class-classifier.ts`: pure classifier for SingleHop, MultiHop, Temporal, Entity, Quote and Neutral, with deterministic precedence.
- `mcp_server/lib/search/query-router.ts`: additive `retrievalClass` on `RouteResult` and single-hop graph preservation suppression through the existing graph-preservation primitive.
- `shared/algorithms/rrf-fusion.ts`: shared retrieval profile model and flag parser.
- `mcp_server/lib/search/retrieval-profile.ts`: MCP-side profile resolver used by the live search path without depending on generated shared dist artifacts.
- `mcp_server/lib/search/hybrid-search.ts`: profile-adjusted channel weights before fusion, guarded by `SPECKIT_RETRIEVAL_PROFILE_WEIGHTS`.
- Tests in `query-router.vitest.ts`, `unit-rrf-fusion.vitest.ts` and `retrieval-profile.vitest.ts`.

### Status snapshot

Every candidate is PENDING. None was implemented in the flat Wave-0 (packet 030), confirmed absent from `030.../spec.md` §14 and from `git log 1ecc531431..HEAD`. The one related shipped item is the dependency C-X1 (`bonusOverChannels`), which landed in 030 (commit `65cfcea513`) and unblocks C2-B.

| Candidate | Status | Gate |
|-----------|--------|------|
| C2-A retrieval-class classifier | DONE | default-on pure routing axis |
| C2-C graph-expansion gating per class | DONE | default-on SingleHop graph-off, MultiHop unchanged |
| C2-B per-class weight injection | DONE | mechanism default-off behind `SPECKIT_RETRIEVAL_PROFILE_WEIGHTS`, benchmark calibration pending |
| CG-iterative-context-extension | PENDING | needs bounded recall-strategy design + benchmark gate |
| MEM-tiered-recall-budget | PENDING | needs budget-shape benchmark gate |
| LT-compaction-fallback-ladder | PENDING | needs deterministic summarizer contract |
| C-G2 topic facet | PENDING | keep-or-cut decision first (overlaps contextType + C2-A) |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

C2-A shipped first as the additive classifier. C2-C then consumed that axis through the existing graph preservation primitive, keeping the minimum-channel behavior in the router intact. C2-B shipped as a default-off mechanism because tuned per-class ranking values require benchmark evidence. Flags-off behavior is covered by byte-identity tests.

The recall-shape family and C-G2 were intentionally left pending because their acceptance requires benchmark deltas, deterministic summarization design or a keep-or-cut overlap gate that cannot be satisfied under the requested code-and-unit-test-only constraint.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Build C2-A first as a standalone additive axis | The research treats retrieval-shape as an orthogonal THIRD axis and makes C2-C/C2-B its consumers, so building it first keeps existing routing byte-identical until a consumer reads the new axis |
| Ship C2-B's weight MECHANISM with a neutral default, defer calibrated VALUES | 028 has zero measured benefit numbers and flags per-class weight values as needing re-calibration on the ~1000-memory corpus, and un-calibrated values could demote good results |
| Treat C-X1 as a satisfied prerequisite, not in-scope work | `bonusOverChannels` already shipped in 030 (`65cfcea513`) and is live in `rrf-fusion.ts`, and it unblocks C2-B's `weight:0` handling |
| Gate C-G2 behind a keep-or-cut check | The research rates it low-leverage and overlapping with `contextType` + the C2-A axis, so cut it if it does not earn keep |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Baseline Memory MCP typecheck | PASS - `npm run typecheck`, 0 errors before edits |
| Baseline broad related Vitest | PASS - 7 files / 265 tests before edits |
| Final Memory MCP typecheck | PASS - `npm run typecheck`, 0 errors |
| Final shared typecheck | PASS - `npm run typecheck`, 0 errors |
| Final broad related Vitest | PASS - 8 files / 281 tests |
| Spec-folder strict validation (`validate.sh --strict`) | PASS - 0 errors, 0 warnings |
| Comment hygiene | PASS - no code-comment scope labels added |
| Neutral-profile byte-identity regression | PASS - flags-off/profile-neutral tests preserve fused output |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No live benchmark/reindex/scan was run.** The user explicitly constrained this pass to code and unit tests, so benchmark acceptance remains open where required.
2. **C2-B values are not calibrated.** The profile mechanism is implemented behind `SPECKIT_RETRIEVAL_PROFILE_WEIGHTS`. Benchmark evidence is still required before changing default ranking behavior.
3. **Recall-shape candidates remain pending.** Iterative recall, tiered budgets and summarization-before-truncation need design or benchmark gates outside this pass.
4. **C-G2 may be cut.** Its build is contingent on the keep-or-cut overlap check passing.
<!-- /ANCHOR:limitations -->
