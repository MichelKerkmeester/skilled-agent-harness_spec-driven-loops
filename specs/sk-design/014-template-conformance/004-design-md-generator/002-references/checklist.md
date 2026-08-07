---
title: "Checklist: design-md-generator references/ conformance"
description: "Verification checklist for the design-md-generator references/ audit. Unchecked pending execution."
_memory:
  continuity:
    packet_pointer: "sk-design/014-template-conformance/004-design-md-generator/002-references"
    last_updated_at: "2026-07-27T10:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author references audit checklist"
    next_safe_action: "Read all 10 root references files and the 4-vendor examples/ tree"
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
# Checklist: design-md-generator references/ conformance

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

- [ ] CHK-001 [P0] `skill-reference-template.md` read in full, including frontmatter enum rules — **Evidence**: Pending
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `extraction-workflow.md`'s `importance_tier` is a valid enum value — **Evidence**: Pending
- [ ] CHK-011 [P0] `quality-checklist.md`, `writing-style-guide.md`, `design-md-format.md` have ALL-CAPS numbered H2s — **Evidence**: Pending
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P1] Remaining 6 root files diffed against the template — **Evidence**: Pending
- [ ] CHK-021 [P1] Any confirmed gap in the 6 files fixed — **Evidence**: Pending
- [ ] CHK-022 [P0] Exemplar placement decision recorded in `decision-record.md` — **Evidence**: Pending
- [ ] CHK-023 [P0] Decision executed (files relocated, or exemption note added) — **Evidence**: Pending
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory: confirmed no other `references/*.md` in this packet carries an invalid `importance_tier` or `contextType` value.
- [ ] CHK-FIX-003 [P0] Consumer inventory: cross-references to `references/examples/` (from `SKILL.md`, `extraction-workflow.md`, or elsewhere) checked and updated if the relocation path is chosen.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P1] No exemplar content rewritten — only placement/exemption changed — **Evidence**: Pending
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized with the final fix set and decision — **Evidence**: Pending
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Only `references/**` files changed (or moved) in this child's diff — **Evidence**: Pending
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 7 | 0/7 |
| P1 Items | 4 | 0/4 |

**Verification Date**: Pending
<!-- /ANCHOR:summary -->
