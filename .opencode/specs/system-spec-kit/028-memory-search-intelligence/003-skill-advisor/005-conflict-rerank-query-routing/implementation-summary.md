---
title: "Implementation Summary: Skill Advisor — Conflict Re-rank, Query-Class Routing & Semantic Exact-Rerank (C1/QCR/C6)"
description: "Default-off Skill Advisor scorer seams implemented for C1 conflict demotion, QCR query-class lane weighting, and C6 top-K exact semantic rerank. Live/default promotion remains gated by conflict-edge and benchmark evidence."
trigger_phrases:
  - "advisor conflict rerank routing summary"
  - "C1 QCR C6 deferred implementation summary"
  - "skill advisor deferred routing state"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/003-skill-advisor/005-conflict-rerank-query-routing"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Implemented default-off C1/QCR/C6 scorer seams with deterministic unit coverage"
    next_safe_action: "Run live conflict and benchmark gates"
    blockers: []
    key_files:
      - "implementation-summary.md"
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-003-005-conflict-rerank-query-routing"
      parent_session_id: null
    completion_pct: 80
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 028-memory-search-intelligence/003-skill-advisor/005-conflict-rerank-query-routing |
| **Completed** | 2026-06-19 — default-off code seams implemented; live promotion gates pending |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Default-off scorer code shipped for the three routing refinements. The live scorer remains byte-identical with the new flags disabled, and packet 030 was not touched. The implementation keeps the original gate discipline: C1 needs real conflict-edge data before it has live effect, QCR needs held-out routing-quality evidence before any default/live weight change, and C6 needs RRF plus benchmark/recall acceptance before any default flip.

### C1 — Conflict-suppression re-rank (DONE DEFAULT-OFF, live dormant-data gate)

C1 now preserves conflict mass outside the opt-in RRF lane sum and applies it as a deterministic comparator demotion beside `primaryIntentBonus`. It also adds `spec_kit.scorer.graph_conflict_demote_applied_total` as the applied-counter. Its live effect is still dormant until a reciprocal `conflicts_with` edge exists; this task did not run a live database check by user instruction.

### QCR — Query-class lane-weight router (DONE DEFAULT-OFF, needs-benchmark gate)

QCR now classifies prompts into a small intent class set and feeds per-class multipliers through `effectiveScorerWeights` only when `SPECKIT_ADVISOR_QUERY_CLASS_ROUTING=true`. `explicit_author` remains the strongest lane after multiplier application. The flag is off by default; a held-out routing-quality benchmark is still required before any default/live weight change.

### C6 — Cross-lane semantic exact-rerank (DONE DEFAULT-OFF, benchmark gate pending)

C6 now adds `scoreSemanticShadowExactSubset`, which reuses full-precision vectors for requested top-K skill ids and bypasses the normal 0.2 cutoff only for that subset. The comparator applies exact cosine only when both RRF and `SPECKIT_ADVISOR_EXACT_SEMANTIC_RERANK=true` are enabled, and only inside a bounded score window with RRF rank and skill id fallback.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `spec.md` | Updated | Default-off implementation state, live promotion gates, and affected surfaces |
| `plan.md` | Updated | Gate-first promotion plan with implemented code seams |
| `tasks.md` | Updated | Implemented tasks marked done; live evidence gates left pending |
| `checklist.md` | Updated | Verification evidence and remaining no-commit/live-gate deferrals |
| `implementation-summary.md` | Updated | This implementation summary |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts` | Modified | QCR flag/classification/multipliers, C6 top-K exact-rerank comparator path, C1 conflict demotion counter |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/semantic-shadow.ts` | Modified | Exact subset cosine scoring for C6 |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/metrics.ts` | Modified | Conflict demotion counter definition |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/scorer/conflict-query-rerank.vitest.ts` | Created | Deterministic unit coverage for C1/QCR/C6 seams |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementation reused the already-landed default-off RRF spine instead of changing the default weighted-sum path. QCR and C6 are new opt-in flags; C1's conflict demotion remains tied to the opt-in RRF path and real conflict mass. Tests use deterministic fixture projections and no live database, reindex, scan, benchmark, or schema migration.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Ship default-off code seams, not live behavior | User requested code + unit tests only. Default-off flags allow deterministic coverage while preserving current scorer output by default. |
| Track each with a distinct named gate, not a single blanket "deferred" | The unblock conditions differ: C1 needs a declared reciprocal `conflicts_with` edge (dormant-data); QCR needs a held-out routing-quality benchmark + calibrated taxonomy (needs-benchmark); C6 needs the 001 RRF spine / C3 rank-based survivor set (shared-infra-dep). Naming each makes promotion auditable. |
| Frame C1 as a post-fusion comparator demotion, not a fused rank term | The signed `conflicts_with: -0.35` mass has no rank-fusion meaning; a naive RRF port would silently drop conflict suppression. Lifting it into the deterministic comparator (the surface `primaryIntentBonus` already uses) preserves auditability and keeps it inert under empty edges. |
| Do NOT fabricate skill `conflicts_with` edges to "unblock" C1 | Declaring reciprocal conflict relationships between skills is a separate authoring decision with its own routing consequences; this sub-phase documents the gate, it does not manufacture the data that opens it. |
| Make QCR additive and `explicit_author`-dominant, default-off on first ship | The dominant explicit-author lane is the safety floor; QCR reweights lanes per class without replacing it, and the benchmark must run before any live/default change. |
| Make C6 a bounded rerank window, not an unbounded boost | Exact cosine can resolve close top-K survivors, but it should not overrule unrelated score gaps before recall/ranking evidence exists. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Baseline `npm run typecheck` | PASS — 0 errors |
| Baseline broad vitest | PASS — 17 files, 123 passed, 2 skipped |
| Patched `npm run typecheck` | PASS — 0 errors |
| Patched broad vitest | PASS — 18 files, 127 passed, 2 skipped |
| Comment hygiene | PASS — modified code/test files clean |
| Alignment drift | PASS — 291 files scanned, 0 findings |
| Live MCP benchmark/reindex/scan/schema migration | NOT RUN — explicitly out of scope |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Live promotion is not complete.** C1/QCR/C6 are implemented default-off; no default/live routing flip was made.
2. **C1 still needs live data evidence.** This task did not query the live SQLite graph or metadata arrays because live checks were out of scope.
3. **QCR's taxonomy and multipliers need benchmark validation.** The current values are an opt-in seam, not a calibrated default.
4. **C6 needs benchmark/recall evidence before any default flip.** The code proves deterministic bounded rerank behavior, not a live routing-quality improvement.
5. **No git commit.** Evidence is pinned to command output and local diff because the user requested no commit.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
