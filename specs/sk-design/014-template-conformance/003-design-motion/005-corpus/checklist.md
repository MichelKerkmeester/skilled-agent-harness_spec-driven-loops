---
title: "Checklist: design-motion corpus/ conformance"
description: "Verification checklist for the design-motion corpus/ audit. Unchecked pending execution."
_memory:
  continuity:
    packet_pointer: "sk-design/014-template-conformance/003-design-motion/005-corpus"
    last_updated_at: "2026-07-27T10:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author corpus audit checklist"
    next_safe_action: "Read corpus/ tree against overview.md directory rules"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: design-motion corpus/ conformance

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

- [ ] CHK-001 [P0] `overview.md` directory rules read in full — **Evidence**: Pending
- [ ] CHK-002 [P0] `package_skill.py` naming/file-type checks identified — **Evidence**: Pending
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `corpus/` placement/purpose checked against `overview.md` — **Evidence**: Pending
- [ ] CHK-011 [P0] Every filename checked against kebab-case/file-type rules — **Evidence**: Pending
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] Confirmed gaps fixed or explicitly deferred with reason — **Evidence**: Pending
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
- [ ] CHK-FIX-002 [P1] Any rename verified not to break `motion-evidence.mjs` import paths or test fixtures.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P1] No test/fixture logic altered beyond structural/naming fixes — **Evidence**: Pending
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized with the final audit outcome — **Evidence**: Pending
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Only `corpus/**` changed in this child's diff — **Evidence**: Pending
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 5 | 0/5 |
| P1 Items | 3 | 0/3 |

**Verification Date**: Pending
<!-- /ANCHOR:summary -->
