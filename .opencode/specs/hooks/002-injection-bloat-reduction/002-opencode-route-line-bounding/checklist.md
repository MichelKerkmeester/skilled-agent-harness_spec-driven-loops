---
title: "Verification Checklist: OpenCode Route-Line Bounding"
description: "Verification items for the bounded compiled-route renderer, reveal path, and receipt registration. Planning packet - items are pending until implementation lands."
trigger_phrases:
  - "route line bounding checklist"
  - "compiled route cap verification"
importance_tier: "important"
contextType: "implementation"
parent: "hooks"
_memory:
  continuity:
    packet_pointer: "hooks/002-injection-bloat-reduction/002-opencode-route-line-bounding"
    last_updated_at: "2026-08-06T00:00:00Z"
    last_updated_by: "opus"
    recent_action: "Authored the verification checklist for the route-line bounding phase"
    next_safe_action: "Author implementation-summary.md as a forward-looking not-yet-built placeholder"
    blockers: []
    key_files:
      - ".opencode/plugins/mk-skill-advisor.js"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-06-hooks-002-002"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: OpenCode Route-Line Bounding

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
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md
  - **Evidence**: `spec.md` REQ-001 through REQ-006
- [x] CHK-002 [P0] Technical approach defined in plan.md
  - **Evidence**: `plan.md` sections 3 (Architecture) and 4 (Implementation Phases)
- [x] CHK-003 [P1] Dependencies identified and available
  - **Evidence**: `plan.md` section 6 - phase 001's `policy-plan.ts` registry is the sole blocking dependency, named explicitly
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Code passes lint/format checks
- [ ] CHK-011 [P0] No console errors or warnings
- [ ] CHK-012 [P1] Error handling implemented
- [ ] CHK-013 [P1] Code follows project patterns
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] All acceptance criteria met (REQ-001 through REQ-006)
- [ ] CHK-021 [P0] Manual/negative-control testing complete (flag-off byte-identical parity)
- [ ] CHK-022 [P1] Edge cases tested (target list at exactly the cap boundary, empty target list)
- [ ] CHK-023 [P1] Error scenarios validated (missing/malformed `compiledRouteSummary`)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep.
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests.
- [ ] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases.
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed.
- [ ] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets
- [ ] CHK-031 [P0] Input validation implemented (malformed `summary` objects handled without throwing)
- [ ] CHK-032 [P1] Auth/authz working correctly (not applicable - no auth surface in this module)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
  - **Evidence**: `spec.md`, `plan.md`, and `tasks.md` describe the same planned bounded renderer, reveal path, and receipt registration
- [ ] CHK-041 [P1] Code comments adequate (no spec-path/ADR/REQ/CHK ids embedded per comment-hygiene.md)
- [ ] CHK-042 [P2] README updated (if applicable)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only
  - **Evidence**: No temp files created; all writes confined to `002-opencode-route-line-bounding/`
- [x] CHK-051 [P1] scratch/ cleaned before completion
  - **Evidence**: No `scratch/` folder created or used in this spec-doc packet
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 3/11 (planning-stage items only; implementation items pending) |
| P1 Items | 10 | 3/10 (planning-stage items only; implementation items pending) |
| P2 Items | 1 | 0/1 |

**Verification Date**: Not yet run - this packet is planning-only; implementation has not started.
<!-- /ANCHOR:summary -->
