---
title: "Verification Checklist: Cross-Skill Routing Sweep"
description: "QA checklist for the cross-skill routing sweep: correct fix class per skill, no gaming, no regression, and the two-shape optimizer proof."
trigger_phrases:
  - "cross-skill routing sweep checklist"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/031-smart-routing-benchmark-program/004-cross-skill-routing-sweep"
    last_updated_at: "2026-07-09T06:41:48Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Ran Phase 0 read-only triage for the cross-skill routing sweep"
    next_safe_action: "Hand-sweep deep-improvement, then build the optimizer from two shapes"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/deep-improvement/references/skill_benchmark/routing_optimization.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session_01Ht7J9NZTEBBXwzTeNvras9"
      parent_session_id: null
    completion_pct: 45
    open_questions: []
    answered_questions:
      - "D3 = Option G + non-scoring diagnostic; detector-first / hand-sweep-hardest — two fresh reviews converged"
---
# Verification Checklist: Cross-Skill Routing Sweep

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol
| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get approval |
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
- [x] CHK-001 [P0] Diagnostic separates artifact from genuine over-routing [EVIDENCE: deep-research/review/ai-council/webflow waste-ex-default=0; code-opencode 31/45 genuine] (verified)
- [x] CHK-002 [P0] All flagged skills have a lean 1-2 file DEFAULT tier (gold=design non-tautological) (verified)
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality
- [ ] CHK-003 [P0] No index/catalog file wired into an intent (exempt allowlist)
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing
- [ ] CHK-004 [P0] Optimizer proven on 2 shapes + a negative (planted over-router) test
- [ ] CHK-005 [P0] Per-skill parent union + re-benchmark clean
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness
- [ ] CHK-FIX-001 [P0] Each flagged skill receives the diagnostic-backed fix class before implementation proceeds
- [ ] CHK-FIX-002 [P0] Routable, exempt, and prune classifications are preserved through the hand-sweep
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security
- [ ] CHK-030 [P0] No hardcoded secrets or environment-specific credentials introduced during sweep edits
- [ ] CHK-031 [P1] Intent-gate changes do not broaden access to unrelated skill resources
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation
- [ ] CHK-006 [P1] routing_optimization.md updated for the diagnostic
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization
- [ ] CHK-050 [P1] New sweep evidence stays in the packet-owned assets or documented skill-local locations
- [ ] CHK-051 [P1] No non-routable index/catalog file is moved into an intent-owned resource list
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:sign-off -->
### Sign-off
- [~] CHK-007 [P1] Phase 0 triage reviewed before any mutation
<!-- /ANCHOR:sign-off -->

<!-- ANCHOR:summary -->
## Verification Summary
| Category | Status |
|----------|--------|
| Phase 0 diagnostic + triage | In progress |
| Sweep + optimizer | Not started |
<!-- /ANCHOR:summary -->
