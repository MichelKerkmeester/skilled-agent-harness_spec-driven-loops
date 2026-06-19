---
title: "Verification Checklist: Skill Advisor — Conflict Re-rank, Query-Class Routing & Semantic Exact-Rerank (C1/QCR/C6)"
description: "Verification Date: 2026-06-19"
trigger_phrases:
  - "advisor conflict rerank routing checklist"
  - "C1 QCR C6 deferred checklist"
  - "skill advisor deferred routing gate checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/003-skill-advisor/005-conflict-rerank-query-routing"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Author verification checklist for the C1/QCR/C6 deferred-routing sub-phase (all PENDING)"
    next_safe_action: "Verify each gate before promoting any candidate; mark items with evidence as built"
    blockers: []
    key_files:
      - "checklist.md"
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-003-005-conflict-rerank-query-routing"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Skill Advisor — Conflict Re-rank, Query-Class Routing & Semantic Exact-Rerank (C1/QCR/C6)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
<!--
SELF-CHECK:
- Confirm every required item has concrete evidence before marking it complete.
- Keep optional deferrals explicit, owned, and separate from blockers.
FAILURE MODES:
- Rubber-stamping the checklist, vague tested-claims, and hidden blocker deferrals.
-->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

**Sub-phase state:** all three candidates (C1, QCR, C6) are PENDING — none shipped in 030 Wave-0. The implementation items below stay unchecked by design until each candidate's gate materializes. The "planning complete" items (CHK-001..003, CHK-040) are checkable now; the build/test items gate on promotion.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md (REQ-001..007 with per-candidate gates) — evidence: spec.md §4
- [x] CHK-002 [P0] Technical approach defined in plan.md (gate-first sequencing; Phases 1-3; affected-surface inventory) — evidence: plan.md §3-4, FIX ADDENDUM
- [x] CHK-003 [P1] Dependencies identified (001 RRF spine for all three; declared `conflicts_with` edge for C1; held-out benchmark + class taxonomy for QCR) — evidence: plan.md §6, spec.md §6
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Code passes lint/format/`tsc` checks (per promoted candidate)
- [ ] CHK-011 [P0] No console errors or warnings; existing advisor scorer suite green
- [ ] CHK-012 [P1] Error handling implemented (QCR class misclassification degrades gracefully; `explicit_author` dominance bounds the damage)
- [ ] CHK-013 [P1] Code follows advisor scorer patterns (C1 mirrors `primaryIntentBonus` comparator surface `fusion.ts:428-430`; QCR uses the existing `effectiveScorerWeights` merge `fusion.ts:69-82`; C6 reuses `cosineSimilarity` `semantic-shadow.ts:47-69`)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] All acceptance criteria met when promoted (SC-001 each stays PENDING until its gate; SC-002 each honors its invariant; SC-003 spine dependency explicit)
- [ ] CHK-021 [P0] Default-inert assertion green: with each gate unmet, scorer output matches the C3-only (or pre-spine weighted-sum) baseline exactly — no default-on behavior (REQ-001, NFR-R02)
- [ ] CHK-022 [P1] Edge cases tested (empty `conflicts_with` edges → C1 byte-identical; single skill matched → QCR cannot reorder, C6 no-op below K; all-cosine-below-0.2 subset → C6 cutoff bypass)
- [ ] CHK-023 [P1] Error scenarios validated (skill-graph rebuild in flight → C1 inert; QCR misclassification graceful; C6 on pre-C3 non-deterministic set → MUST NOT ship)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each candidate has a finding class: C1 = `algorithmic` (lift signed conflict mass out of the lane sum into a post-fusion demotion); QCR = `algorithmic` (class→lane-weight router generalizing the per-`(phrase,skill)` bonus table); C6 = `algorithmic` (top-K exact-rerank tiebreak on the rank-based survivor set).
- [ ] CHK-FIX-002 [P0] Same-class producer inventory: `rg -n 'conflicts_with|EDGE_MULTIPLIER' graph-causal.ts` (confirm `:18` is the only conflict multiplier and `:77` `if (signed > 0)` is the enqueue guard); `rg -n 'primaryIntentBonus' fusion.ts` (the comparator surface C1 mirrors and QCR generalizes).
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for `effectiveScorerWeights` / `laneWeightsOverride` (QCR), the ranking comparator `fusion.ts:425-433` (C1/C6), and `cosineSimilarity` + cached vectors `semantic-shadow.ts:47-69,194-199` (C6) across `system-skill-advisor`.
- [ ] CHK-FIX-004 [P0] Adversarial table tests: C1 inert-under-empty-edges + applied-counter fires only on a real conflict edge; QCR shadow-only guardrail (no live weight write reachable) + `explicit_author` dominance preserved; C6 byte-stable re-order via skill-id tiebreak + 0.2-cutoff bypass scoped to top-K only + no recall regression.
- [ ] CHK-FIX-005 [P1] Matrix axes listed before completion: {empty conflict edges, single-skill, all-below-0.2, graph-rebuild-in-flight, pre-C3} × {C1, QCR, C6} × {gate met / gate unmet}.
- [ ] CHK-FIX-006 [P1] Hostile env/global-state variant executed — QCR shadow weights resolve from `process.env` once at module load (`lane-registry.ts:67-74`); test env-override + reload; C1 reads live graph edges (verify a rebuild window leaves it inert).
- [ ] CHK-FIX-007 [P1] Evidence pinned to a fix SHA or explicit diff range (per-candidate scoped commits), not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets
- [ ] CHK-031 [P0] Input validation: QCR classifies the query text for weighting only (no execution, no storage — NFR-S01); no new untrusted-input path introduced
- [ ] CHK-032 [P1] QCR ships behind shadow weights first; no live weight change reachable before the held-out benchmark gate (REQ-003/REQ-006)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized (all carry the all-PENDING status + per-candidate gates + 030 §14 evidence)
- [ ] CHK-041 [P1] Code comments adequate (durable WHY; no spec-path/packet ids in comments — comment-hygiene) — checked per promoted candidate
- [ ] CHK-042 [P2] README updated (N/A — internal scorer-seam changes)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files (live `conflicts_with` query output, benchmark captures) in scratch/ only
- [ ] CHK-051 [P1] scratch/ cleaned before completion (keep only a recorded baseline if needed for evidence)
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 9 | 2/9 |
| P1 Items | 10 | 1/10 |
| P2 Items | 2 | 0/2 |

**Verification Date**: 2026-06-19

**Note:** the 3 checked items are the planning-complete gates (requirements, approach, dependency identification, doc sync). All build/test items stay unchecked by design — this sub-phase holds C1/QCR/C6 as documented deferred refinements; they are not implemented while their gates are unmet (REQ-001, SC-001).
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
