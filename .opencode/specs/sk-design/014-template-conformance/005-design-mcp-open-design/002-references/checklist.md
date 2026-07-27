---
title: "Verification Checklist: design-mcp-open-design references conformance"
description: "Verification Date: 2026-07-27"
trigger_phrases:
  - "design-mcp-open-design references conformance"
  - "checklist"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/014-template-conformance/005-design-mcp-open-design/002-references"
    last_updated_at: "2026-07-27T10:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author Level 2 checklist for template-conformance leaf"
    next_safe_action: "Mark CHK-001 once the audit begins"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-mcp-open-design/references/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Verification Checklist: design-mcp-open-design references conformance

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
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented in spec.md
- [ ] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P1] Governing template confirmed reachable and current
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] All 9 in-scope file(s) read and diffed against .opencode/skills/sk-doc/create-skill/assets/skill/skill-reference-template.md
- [ ] CHK-011 [P1] Every known defect closed or explicitly deferred
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] All in-scope files audited (100% coverage, not a sample)
- [ ] CHK-021 [P0] Confirmed defects fixed or explicitly deferred with owner
- [ ] CHK-022 [P1] Out-of-audit items (owned by sibling packets) NOT touched
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P1] Out-of-scope items (sibling-owned decisions) explicitly named, not silently fixed or ignored
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets introduced
- [ ] CHK-031 [P2] N/A — documentation-only leaf, no input surfaces changed
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
- [ ] CHK-041 [P2] Governing template cited by path in spec.md and plan.md
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
| P0 Items | 6 | [ ]/6 |
| P1 Items | 6 | [ ]/6 |
| P2 Items | 3 | [ ]/3 |

**Verification Date**: 2026-07-27 (not yet run — Planned)
<!-- /ANCHOR:summary -->
