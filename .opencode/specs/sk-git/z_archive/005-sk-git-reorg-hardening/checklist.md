---
title: "Verification Checklist: sk-git Large-Reorg + Worktree Hardening [sk-git/z_archive/005-sk-git-reorg-hardening/checklist]"
description: "Verification Date: 2026-05-26"
trigger_phrases:
  - "sk-git reorg hardening checklist"
  - "git worktree gitignored deps"
  - "rename-heavy merge guidance"
  - "scoped staging discipline"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-git/z_archive/005-sk-git-reorg-hardening"
    last_updated_at: "2026-07-15T04:22:47Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored checklist.md for completed sk-git hardening"
    next_safe_action: "Author implementation-summary and validate"
    blockers: []
    key_files:
      - "checklist.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: sk-git Large-Reorg + Worktree Hardening

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

- [x] CHK-001 [P0] Requirements documented in spec.md (REQ-001..004)
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] Dependencies identified and available (sk-git reference docs)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Doc structure coherent across the five edited/added files
- [x] CHK-011 [P0] No broken cross-links between commit_workflows.md and shared_patterns.md
- [x] CHK-012 [P1] New guidance lives in references, SKILL.md carries only pointers
- [x] CHK-013 [P1] Sections follow existing sk-git doc patterns
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] REQ-001 met: leftover-cruft cleanup documented (worktree_workflows.md §8b)
- [x] CHK-021 [P0] REQ-003 met: scoped-staging discipline mandated (commit_workflows.md §3 Step 7)
- [x] CHK-022 [P1] REQ-002 met: worktree dep/DB caveats documented (worktree_workflows.md §8b)
- [x] CHK-023 [P1] REQ-004 met: rename-heavy merge verification documented (shared_patterns.md §10)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each failure mode classified: this is a `class-of-bug` doc-hardening packet covering five distinct git workflow failure modes.
- [x] CHK-FIX-002 [P0] Same-class producer inventory: all five modes mapped to one owning reference section each; no missing sibling docs.
- [x] CHK-FIX-003 [P0] Consumer inventory: SKILL.md pointers added for §3 Step 7 and §10; the playbook references all sections.
- [x] CHK-FIX-004 [P0] Not a security/path/parser/redaction code fix; adversarial table tests N/A (documentation-only packet).
- [x] CHK-FIX-005 [P1] Matrix axes listed: five failure modes x owning section, enumerated in spec REQ table and tasks T004-T007.
- [x] CHK-FIX-006 [P1] Global-state variant: per-worktree DB caveat explicitly documents the single-global-instance behavior (worktree_workflows.md §8b).
- [x] CHK-FIX-007 [P1] Evidence pinned to file paths and section anchors, not a moving range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets (documentation only)
- [x] CHK-031 [P0] No input handling changed (documentation only)
- [x] CHK-032 [P1] No auth/authz surface touched
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] Section cross-links adequate
- [x] CHK-042 [P2] SKILL.md References updated with the new playbook + pointers
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Incident notes kept in scratch/ only
- [x] CHK-051 [P1] No stray temp files outside scratch/
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 10 | 10/10 |
| P1 Items | 13 | 13/13 |
| P2 Items | 2 | 2/2 |

**Verification Date**: 2026-05-26
<!-- /ANCHOR:summary -->
