---
title: "Verification Checklist: 027/005 Skill Advisor First-Action Mandate"
description: "QA validation checklist for the skill advisor mandate-rendering phase."
trigger_phrases:
  - "027 phase 005 checklist"
  - "skill advisor first action checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/005-skill-advisor-first-action-mandate"
    last_updated_at: "2026-05-09T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Aligned optional checklist with active spec-kit anchors and pt-02 mandate guards"
    next_safe_action: "Implement render.ts mandate wording and fixture updates"
---
# Verification Checklist: 027/005 Skill Advisor First-Action Mandate

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim the phase implemented until complete |
| **[P1]** | Required | Must complete or explicitly defer with approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements REQ-001 through REQ-009 are present in spec.md.
- [ ] CHK-002 [P0] Plan preserves existing confidence and token-cap logic.
- [ ] CHK-003 [P0] Tasks include high-uncertainty and boundary fixture coverage.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `FIRST_ACTION_HINT` map and fallback exist in render.ts.
- [ ] CHK-011 [P0] High-confidence/low-uncertainty output uses `MUST invoke {label} FIRST (...) - {hint}` wording.
- [ ] CHK-012 [P0] Confidence threshold logic remains unchanged.
- [ ] CHK-013 [P0] `capText` safety net remains unchanged.
- [ ] CHK-014 [P0] High-uncertainty recommendations do not render mandate wording.
- [ ] CHK-015 [P0] Legacy exact-string fixtures are migrated to directive-shape assertions.
- [ ] CHK-016 [P1] Action hints reflect each skill's real first action.
- [ ] CHK-017 [P1] Boundary fixtures cover confidence values around 0.80 and uncertainty at/above threshold.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-030 [P0] All known skills have render fixture coverage.
- [ ] CHK-031 [P0] Non-string coverage for poisoning, null, freshness, cache, cap, and ambiguous output is preserved.
- [ ] CHK-032 [P0] `npx vitest run skill_advisor/tests/render.vitest.ts` passes.
- [ ] CHK-033 [P0] `npm run check` passes.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-040 [P0] Every P0 requirement has file:line evidence in implementation-summary.md after implementation.
- [ ] CHK-041 [P0] pt-02 mandate wording and high-uncertainty guard are both verified.
- [ ] CHK-042 [P1] Manual hint review is recorded or explicitly deferred.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-050 [P1] Rendering handles unexpected labels without exposing `undefined` or raw object content.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-060 [P0] spec.md, plan.md, tasks.md, checklist.md, and implementation-summary.md remain synchronized.
- [ ] CHK-061 [P0] Strict spec-kit validation passes for the phase folder.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-070 [P1] Changes remain scoped to skill advisor render logic and tests.
- [ ] CHK-071 [P1] No generated snapshots or scratch files are committed accidentally.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 20 | 0/20 |
| P1 Items | 6 | 0/6 |
| P2 Items | 0 | 0/0 |

**Verification Date**: Pending implementation
<!-- /ANCHOR:summary -->
