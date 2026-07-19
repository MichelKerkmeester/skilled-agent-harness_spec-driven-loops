---
title: "Verification Checklist: 003 Fixtures"
description: "Verification checklist for labeled eval fixtures."
trigger_phrases:
  - "027 006 003 checklist"
  - "fixtures checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "z_future/code-graph-and-cocoindex/004-code-graph-adoption-eval/003-fixtures"
    last_updated_at: "2026-05-12T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Scaffolded Level 2 checklist.md"
    next_safe_action: "Implement Fixtures work when dependencies are ready"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "027-006-003-fixtures"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: 003 Fixtures

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete or explicitly defer with approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Child 001 fixture loader contract is available.
- [ ] CHK-002 [P0] Candidate task surfaces are local and stable.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] JSONL has 12-20 valid objects.
- [ ] CHK-011 [P0] Every task has expected files and keywords.
- [ ] CHK-012 [P1] Task prompts avoid external network dependencies.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] Fixture parse test passes.
- [ ] CHK-021 [P1] First five labels are manually reviewed.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-060 [P0] Required implementation files are created or updated with evidence in implementation-summary.md.
- [ ] CHK-061 [P0] Verification command output is recorded before claiming completion.

<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] Task prompts do not request secrets or credentials.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P0] Strict validation passes.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Fixtures live under the eval task directory.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 0/8 |
| P1 Items | 3 | 0/3 |
| P2 Items | 0 | 0/0 |

**Verification Date**: Pending implementation
<!-- /ANCHOR:summary -->

