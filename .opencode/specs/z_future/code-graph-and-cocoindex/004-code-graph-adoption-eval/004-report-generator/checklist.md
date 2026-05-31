---
title: "Verification Checklist: 004 Report Generator"
description: "Verification checklist for eval report generation."
trigger_phrases:
  - "027 006 004 checklist"
  - "report generator checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-code-graph-and-cocoindex/004-code-graph-adoption-eval/004-report-generator"
    last_updated_at: "2026-05-12T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Scaffolded Level 2 checklist.md"
    next_safe_action: "Implement Report Generator work when dependencies are ready"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "027-006-004-report-generator"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: 004 Report Generator

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

- [ ] CHK-001 [P0] Child 001 result row schema is available.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Token reduction is computed from complete pairs.
- [ ] CHK-011 [P0] File reads avoided is computed from complete pairs.
- [ ] CHK-012 [P0] Skipped and incomplete rows are counted separately.
- [ ] CHK-013 [P1] Markdown output is deterministic.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] Complete pair fixture passes.
- [ ] CHK-021 [P0] Incomplete pair fixture is excluded from paired stats.
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

- [ ] CHK-030 [P0] Report does not include secrets or raw provider credentials.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P0] Strict validation passes.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Report generator lives under `mcp_server/lib/eval`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 0/8 |
| P1 Items | 2 | 0/2 |
| P2 Items | 0 | 0/0 |

**Verification Date**: Pending implementation
<!-- /ANCHOR:summary -->

