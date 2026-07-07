---
title: "Verification Checklist: Skill Advisor - Provenance Self-Boost Guard, Attested Baseline Drift & Skip-Never-Fabricate"
description: "Verification Date: 2026-06-19"
trigger_phrases:
  - "advisor provenance drift checklist"
  - "SA self boost guard checklist"
  - "SA attested baseline drift checklist"
  - "SA skip never fabricate checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/012-skill-advisor-tuning/002-skill-advisor-runtime/006-provenance-drift-observability"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Verified default-off self-boost guard"
    next_safe_action: "Promote drift/skip only after the durable calibration substrate exists"
    blockers: []
    key_files:
      - "checklist.md"
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-003-006-provenance-drift-observability"
      parent_session_id: null
    completion_pct: 34
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Skill Advisor - Provenance Self-Boost Guard, Attested Baseline Drift & Skip-Never-Fabricate

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

**Sub-phase state:** SA-author-self-boost-guard is DONE behind `SPECKIT_ADVISOR_SELF_RECOMMENDATION_GUARD` and verified default-off. SA-attested-baseline-drift-sweep and SA-skip-never-fabricate remain PENDING behind the durable calibration substrate from 028/004.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md (REQ-001..007 with per-candidate gates), evidence: spec.md §4
- [x] CHK-002 [P0] Technical approach defined in plan.md (substrate-first sequencing, Phases 1-3, affected-surface inventory), evidence: plan.md §3-4, FIX ADDENDUM
- [x] CHK-003 [P1] Dependencies identified (durable calibration substrate shared with 028/004 for drift + skip, scope-correction for the self-boost guard, REFUTED items recorded out-of-scope), evidence: plan.md §6, spec.md §3/§6
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format/`tsc` checks (per promoted candidate), evidence: `npm --prefix .opencode/skills/system-skill-advisor/mcp_server run typecheck` passed with 0 errors
- [ ] CHK-011 [P0] No console errors or warnings, existing advisor calibration + scorer suite green
- [ ] CHK-012 [P1] Error handling implemented (calibration store unreadable → `baselines_needed` named-skip, embedder change → `stale_model`, never a fabricated alarm)
- [ ] CHK-013 [P1] Code follows advisor patterns (self-boost guard generalizes the existing penalties at `fusion.ts:134,313`, drift sweep sits beside the live `thresholdSignals` recompute `feedback-calibration.ts:193-203` behind the `:230-237` guardrails, skip enum extends `signalReason()` `:125-130`)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] All acceptance criteria met when promoted (SC-001 status explicit, SC-002 each honors its invariant, SC-003 the shared-substrate dependency on 028/004 explicit), partial: self-boost met, drift/skip deferred
- [x] CHK-021 [P0] Default-inert / shadow-only assertion green: with each gate unmet, calibration + scorer output matches today's baseline exactly, the drift sweep is absent, the skip enum unused, the self-boost guard is default-off (REQ-001, NFR-R02), evidence: focused fixture plus broad related suite had 0 new failures relative to baseline
- [ ] CHK-022 [P1] Edge cases tested (no attested baseline → `baselines_needed`, no drift score, self-rec vector absent → self-boost guard a no-op, embedder change → `stale_model`, stable drift → gauge no-ops/anti-flap)
- [ ] CHK-023 [P1] Error scenarios validated (calibration store mid-rotation → named-skip not alarm, non-self producer scored for its own content → self-boost guard does NOT fire, baseline never auto-rebaselines)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each candidate has a finding class: SA-author-self-boost-guard = `algorithmic/integrity` (generalize 2 self-rec penalties into one producer-vs-scored guard), SA-attested-baseline-drift-sweep = `observability/integrity` (attested baseline + shadow drift sweep, anti-rebaseline), SA-skip-never-fabricate = `observability` (named-skip taxonomy enrich).
- [ ] CHK-FIX-002 [P0] Same-class producer inventory: `rg -n 'readOnlyExplainerFloor|auditRecsAdvisorPenalty' fusion.ts` (confirm `:134` + `:313` are the only two self-rec penalties to generalize), `rg -n 'author:' explicit.ts` (confirm `:320` is the self-authored evidence push and `:327` the by-design symmetric lane score).
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for `signalReason()` (`feedback-calibration.ts:125-130`) callers, the `thresholdSignals` recompute (`:193-203`), the guardrails block (`:230-237`) and the record root (`:25-26,248-251`) across `system-skill-advisor`.
- [ ] CHK-FIX-004 [P0] Adversarial table tests: self-boost guard fires ONLY on the self-recommendation vector + byte-identical for non-self skills, drift sweep NEVER auto-rebaselines + gauge anti-flaps on a stable drift, skip-never-fabricate names every reason + never forces a max/alarm, SA-anti-flap NOT built standalone (only the dedup discipline rides the new gauge). Partial: self-boost fixture is complete, drift/skip fixtures remain gated.
- [ ] CHK-FIX-005 [P1] Matrix axes listed before completion: {no baseline, baseline present, embedder changed, store mid-rotation, stable drift, self-rec vector present/absent} × {self-boost, drift, skip} × {gate met / gate unmet}.
- [ ] CHK-FIX-006 [P1] Hostile env/global-state variant executed, drift sweep resolves the record path from `SPECKIT_ADVISOR_FEEDBACK_CALIBRATION_PATH` / `RECORD_ROOT` (`feedback-calibration.ts:25,149-152`), test the durable-substrate path override + a session restart, the calibration shadow flag (`SPECKIT_ADVISOR_FEEDBACK_CALIBRATION_SHADOW`) stays default-off.
- [ ] CHK-FIX-007 [P1] Evidence pinned to a fix SHA or explicit diff range (per-candidate scoped commits), not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets
- [ ] CHK-031 [P0] Input validation: the skip taxonomy only labels internal calibration state, the drift sweep reads an attested internal baseline, the self-boost guard reads producer identity already in the projection, no new untrusted-input path (NFR-S01)
- [ ] CHK-032 [P1] Drift sweep ships behind the existing shadow guardrails (`defaultOff/shadowOnly/liveWeightsFrozen/autoPromotion:false`), no live weight change reachable (REQ-003)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized (self-boost DONE default-off, drift/skip PENDING with substrate gate, REFUTED out-of-scope items retained)
- [x] CHK-041 [P1] Code comments adequate (durable WHY, no spec-path/packet ids in comments, comment-hygiene), evidence: changed-code `rg` spot check returned no matches
- [ ] CHK-042 [P2] README updated (N/A, internal calibration/scorer-seam changes)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files (durable-substrate probes, drift baseline captures) in scratch/ only
- [ ] CHK-051 [P1] scratch/ cleaned before completion (keep only a recorded baseline if needed for evidence)
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 9 | 4/9 |
| P1 Items | 10 | 2/10 |
| P2 Items | 2 | 0/2 |

**Verification Date**: 2026-06-19

**Note:** SA-author-self-boost-guard has implementation and focused verification. Drift/skip build and integration items stay unchecked by design because their durable-substrate gate is still unmet.
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
