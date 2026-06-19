---
title: "Implementation Summary: Retrieval-Class Routing & Recall-Shape Intelligence (028/001 impl)"
description: "Re-plan stage record for the retrieval-shape cluster. NOT YET IMPLEMENTED — this summary documents the planned-but-unbuilt state so the spec folder validates at Level 3; it carries no completion claim."
trigger_phrases:
  - "retrieval class routing implementation summary"
  - "c2-a c2-b c2-c status"
  - "recall shape cluster status"
  - "memory mcp retrieval shape impl summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/001-speckit-memory/003-003-retrieval-class-routing"
    last_updated_at: "2026-06-19T07:40:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Recorded re-plan state (cluster planned, not yet built)"
    next_safe_action: "Build C2-A classifier as the additive third router axis"
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
    completion_pct: 0
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
| **Spec Folder** | 028-memory-search-intelligence/001-speckit-memory/003-003-retrieval-class-routing |
| **Completed** | NOT YET — re-plan stage (planning only) |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing is built yet. This document exists to record the re-plan state: the retrieval-shape cluster has been scoped, sequenced, and grounded in the 028 research, but no code has changed. It is the standing summary you read when you resume this sub-phase, and it will be rewritten once the first candidate ships.

The cluster you are about to build gives Memory MCP recall a third routing axis. Today the query router reads two orthogonal classifiers (complexity tier and task intent) and expands the causal graph the same way for a single-hop "find this exact fact" query as for a multi-hop "trace impact" query, which the research names as a precision-killing failure mode. The planned work adds the C2-A retrieval-class classifier, then routes by it: C2-C turns graph expansion off for single-hop, C2-B injects per-class channel weights at the pre-fusion seam, and the recall-shape family (iterative context extension, tiered recall budget, summarize-before-truncate ladder) plus the C-G2 topic facet size and shape recall by that same retrieval shape.

### Status snapshot

Every candidate is PENDING. None was implemented in the flat Wave-0 (packet 030) — confirmed absent from `030.../spec.md` §14 and from `git log 1ecc531431..HEAD`. The one related shipped item is the dependency C-X1 (`bonusOverChannels`), which landed in 030 (commit `65cfcea513`) and unblocks C2-B.

| Candidate | Status | Gate |
|-----------|--------|------|
| C2-A retrieval-class classifier | PENDING | needs-build (gates C2-B + C2-C) |
| C2-C graph-expansion gating per class | PENDING | gated by C2-A (shared-infra dep) |
| C2-B per-class weight injection | PENDING | gated by C2-A; C-X1 dep SATISFIED (030 `65cfcea513`) |
| CG-iterative-context-extension | PENDING | needs-benchmark + net-new convergence primitive; default-off flag |
| MEM-tiered-recall-budget | PENDING | needs-benchmark; extends partial pressure-monitor |
| LT-compaction-fallback-ladder | PENDING | extends ~70%-shipped ladder; only summarize rung net-new |
| C-G2 topic facet | PENDING | keep-or-cut decision first (overlaps contextType + C2-A) |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not delivered yet. The intended delivery is one candidate at a time, each a scoped, separately reversible commit with its own test, following the plan.md sequence: C2-A first (the gate), then C2-C and C2-B as consumers, with the recall-shape family in parallel and C-G2 behind its keep-or-cut gate. Intelligence-class items ship behind default-off flags with shadow telemetry; correctness-class plumbing may default-on. The verification gate per candidate is typecheck/build green, the existing Memory MCP suite green, a neutral-profile byte-identity regression, an independent adversarial review, and `validate.sh --strict` on this packet.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Build C2-A first as a standalone additive axis | The research treats retrieval-shape as an orthogonal THIRD axis and makes C2-C/C2-B its consumers; building it first keeps existing routing byte-identical until a consumer reads the new axis |
| Ship C2-B's weight MECHANISM with a neutral default, defer calibrated VALUES | 028 has zero measured benefit numbers and flags per-class weight values as needing re-calibration on the ~1000-memory corpus; un-calibrated values could demote good results |
| Treat C-X1 as a satisfied prerequisite, not in-scope work | `bonusOverChannels` already shipped in 030 (`65cfcea513`) and is live in `rrf-fusion.ts`; it unblocks C2-B's `weight:0` handling |
| Gate C-G2 behind a keep-or-cut check | The research rates it low-leverage and overlapping with `contextType` + the C2-A axis; cut it if it does not earn keep |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Spec-folder strict validation (`validate.sh --strict`) | PASS (re-plan docs; see report) |
| Code implemented | NOT STARTED — re-plan stage, no code changed |
| Per-candidate tests | NOT STARTED |
| Neutral-profile byte-identity regression | NOT STARTED (baseline capture is task T016) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Re-plan only.** No candidate is implemented. This summary is a placeholder-of-record so the Level-3 folder validates; it makes no completion claim.
2. **No measured benefit numbers.** Every leverage/effort rating in scope is structural inference (028 §6). The per-class weight calibration is a separate benchmark follow-up; reindex is gate-zero per 027/002 §13.
3. **C-G2 may be cut.** Its build is contingent on the REQ-007 keep-or-cut overlap check passing.
<!-- /ANCHOR:limitations -->
