---
title: "Checklist: design-motion references/ conformance"
description: "Verification checklist for the design-motion references/ audit. Unchecked pending execution."
_memory:
  continuity:
    packet_pointer: "sk-design/014-template-conformance/003-design-motion/002-references"
    last_updated_at: "2026-07-27T10:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author references audit checklist"
    next_safe_action: "Read all 7 references files against skill-reference-template.md"
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
# Checklist: design-motion references/ conformance

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

- [ ] CHK-001 [P0] `skill-reference-template.md` read in full — **Evidence**: Pending
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `motion-strategy.md` has `---` before every numbered H2 — **Evidence**: Pending
- [ ] CHK-011 [P0] `micro-interactions.md` has `---` before every numbered H2 — **Evidence**: Pending
- [ ] CHK-012 [P0] `advanced-craft.md` numbered H2s are ALL-CAPS — **Evidence**: Pending
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P1] `animate-presence-patterns.md`, `animation-decision-framework.md`, `corpus-map.md`, `performance-reduced-motion.md` each diffed against the template — **Evidence**: Pending
- [ ] CHK-021 [P1] Any confirmed gap in the 4 files above fixed — **Evidence**: Pending
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed for the separator/casing defect (checked all 7 files, not just the 3 known).
- [ ] CHK-FIX-003 [P1] Consumer inventory: no other doc cross-references the fixed anchors by old heading text.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P1] No content beyond separators/heading casing was altered — **Evidence**: Pending
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized with the final fix set — **Evidence**: Pending
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Only `references/*.md` files changed in this child's diff — **Evidence**: Pending
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 4 | 0/4 |
| P1 Items | 5 | 0/5 |

**Verification Date**: Pending
<!-- /ANCHOR:summary -->
