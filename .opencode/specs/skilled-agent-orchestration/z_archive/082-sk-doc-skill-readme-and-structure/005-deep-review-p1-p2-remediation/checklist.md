---
title: "Verification Checklist: deep-review P1+P2 remediation"
description: "Verification checklist for closing all 16 dashboard findings via cli-codex remediation."
trigger_phrases:
  - "102 p1 p2 remediation"
importance_tier: "important"
contextType: "validation"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/skilled-agent-orchestration/z_archive/082-sk-doc-skill-readme-and-structure/005-deep-review-p1-p2-remediation"
    last_updated_at: "2026-05-11T09:35:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored checklist"
    next_safe_action: "Mark items as verification completes"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "102-005-deep-review-p1-p2-remediation"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: deep-review P1+P2 remediation

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

- [ ] CHK-001 [P0] Requirements documented in spec.md.
- [ ] CHK-002 [P0] Technical approach defined in plan.md.
- [ ] CHK-003 [P1] Dependencies identified (cli-codex available, auth green, sandbox config known).
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] All edits are documentation-only (no runtime code or config touched).
- [ ] CHK-011 [P0] No invalid YAML / broken anchor introduced.
- [ ] CHK-012 [P1] Each edit cites file:line in implementation-summary.
- [ ] CHK-013 [P1] No backwards-incompatible changes to dashboard finding IDs.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] All 7 P1 findings have closure rows in implementation-summary.
- [ ] CHK-021 [P0] All 9 P2 findings have closure rows (including accepted-defer for F-002-001).
- [ ] CHK-022 [P1] Strict-validate exit 0 on 004.
- [ ] CHK-023 [P1] Strict-validate exit 0 on 005.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each finding classified: this packet is `cross-consumer` (multi-file metadata sync) + `instance-only` for SD-019 frontmatter.
- [ ] CHK-FIX-002 [P0] Producer inventory: 9 files in scope; no other docs produce these specific status/handoff fields.
- [ ] CHK-FIX-003 [P0] Consumer inventory: dashboard + review-report reference these IDs (read-only consumers; stay valid).
- [ ] CHK-FIX-004 [P0] Not applicable (no security/path/parser/redaction changes).
- [ ] CHK-FIX-005 [P1] Matrix listed in plan.md §AFFECTED SURFACES (Phase × Document × Field = 16 cells).
- [ ] CHK-FIX-006 [P1] No process-state changes; runtime mirrors untouched.
- [ ] CHK-FIX-007 [P1] Evidence pinned to commit SHA after Phase 3 completes (not branch-relative).
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No secrets/tokens/keys introduced.
- [ ] CHK-031 [P0] No input-validation changes (documentation-only).
- [ ] CHK-032 [P1] Agent write-scope boundaries unaffected.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] spec.md / plan.md / tasks.md / checklist.md / implementation-summary.md synchronized.
- [ ] CHK-041 [P1] All ID cross-references (F-NNN-NNN) resolve to the dashboard.
- [ ] CHK-042 [P2] Parent 102 spec.md Status updated to Complete after this packet closes.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] codex transcript stored under `evidence/` only.
- [ ] CHK-051 [P1] `scratch/` cleaned before completion.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 0/12 |
| P1 Items | 8 | 0/8 |
| P2 Items | 1 | 0/1 |

**Verification Date**: [YYYY-MM-DD]
<!-- /ANCHOR:summary -->
