---
title: "Verification Checklist: Skill Advisor — Runtime Lane-Health & Graceful Lane-Degrade (C5/C5a/AMB)"
description: "Verification gates for the advisor graceful-degradation unit. Re-plan stage — all items PENDING until implementation. The P0 baseline + lane-health prerequisite gate the C5 elision."
trigger_phrases:
  - "advisor lane health degrade checklist"
  - "C5 C5a AMB verification"
  - "advisor confidence baseline checklist"
  - "degrade to remaining verification"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/003-skill-advisor/002-runtime-lane-health-degrade"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Author C5/C5a/AMB lane-health-degrade verification checklist (re-plan; PENDING)"
    next_safe_action: "Capture the confidence baseline (CHK-005), then build the runtime lane-health signal"
    blockers: []
    key_files:
      - "checklist.md"
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-003-002-runtime-lane-health-degrade"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Verification Checklist: Skill Advisor — Runtime Lane-Health & Graceful Lane-Degrade (C5/C5a/AMB)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

> Re-plan stage: this unit is NOT yet implemented. Every item is unchecked. The candidate set (C5/C5a/AMB) is PENDING — absent from `030.../spec.md` §14 and from `git log 1ecc531431..ab5459fb6d`; 030 spec line 106 lists C5 as NO-GO until baseline + lane-health signal.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented in spec.md (REQ-001..006)
- [ ] CHK-002 [P0] Technical approach + P0-first sequencing defined in plan.md (baseline → lane-health → C5 → C5a/AMB)
- [ ] CHK-003 [P0] P0 prerequisite confirmed: a runtime per-lane health signal the scorer currently lacks (REQ-002)
- [ ] CHK-004 [P1] aionforge degrade-to-remaining / `embedder_available:false` reference confirmed readable (`retrieval.md:300`)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:baseline -->
## Baseline (regression-baseline rule)

- [ ] CHK-005 [P0] Confidence baseline captured BEFORE any quoted skew number: before/after `liveNormalized` with `graph_causal` runtime-empty, for a representative prompt (REQ-001)
- [ ] CHK-006 [P0] The unsourced "~13%" is removed from all docs and replaced with the measured value (or marked UNKNOWN until measured) [evidence: roadmap.md:218,262]
<!-- /ANCHOR:baseline -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Code passes lint/format + `tsc` typecheck (advisor MCP build)
- [ ] CHK-011 [P0] No console errors or warnings in the advisor build
- [ ] CHK-012 [P1] The lane-health signal is call-scoped (does NOT collapse to a workspace-wide aggregate when `laneAttributionBySkill` is empty) [evidence: iter-016 J16-01]
- [ ] CHK-013 [P1] Default lane weights are unchanged (no re-weighting); `liveTotal` change is filter-only at `fusion.ts:343-345`
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] REQ-003 met: a `runtime_degraded` lane is elided from `liveTotal`; a `matched_nothing` lane is RETAINED (no over-credit of non-matching skills)
- [ ] CHK-021 [P0] All-lanes-healthy regression: `liveTotal` and every recommendation confidence byte-identical to the captured baseline (REQ-004)
- [ ] CHK-022 [P1] Degrade-to-remaining proven: survivor confidence rises to the baseline-corrected value when a lane is runtime-degraded (SC-001)
- [ ] CHK-023 [P1] Over-credit inversion explicitly refuted: zero-match lane fixture shows non-matching skills are NOT credited (SC-002)
- [ ] CHK-024 [P1] C5a/AMB legibility: degraded-lane list + runtime live-lane count present; abstention surface reports degradation (SC-003)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each candidate is classed: lane-health signal = algorithmic (new helper); C5 = normalization-denominator (cross-cutting confidence); C5a = explanation/metrics; AMB = explanation surface.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory done: `rg -n 'liveTotal|liveNormalized|isLiveScorerLane|liveLaneCount'` across `system-skill-advisor/mcp_server`.
- [ ] CHK-FIX-003 [P0] Consumer inventory done for changed surfaces: readers of `metrics.liveLaneCount`, confidence consumers (abstention/ambiguity/ranking ties), explanation consumers.
- [ ] CHK-FIX-004 [P1] Evidence pinned to per-candidate commit SHAs once shipped, not a moving branch range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets
- [ ] CHK-031 [P1] No new untrusted-content render path (the degraded-lane list is lane ids only, not prompt content)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] spec/plan/tasks/checklist synchronized
- [ ] CHK-041 [P1] Per-candidate WHY comments adequate (no ephemeral artifact ids in code per comment-hygiene)
- [ ] CHK-042 [P2] C5/C5a/AMB done-state recorded against their eventual commit SHAs in this folder + 030 cross-ref note
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only
- [ ] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 0/11 |
| P1 Items | 10 | 0/10 |
| P2 Items | 1 | 0/1 |

**Verification Date**: PENDING (re-plan stage — not yet implemented)
<!-- /ANCHOR:summary -->
