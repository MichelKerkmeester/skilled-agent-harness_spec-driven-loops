---
title: "Verification Checklist: 027/003/004 Trace Tests"
description: "Checklist scaffold for code_graph_trace test verification."
trigger_phrases:
  - "027 003 004 checklist"
  - "trace test checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-code-graph-and-cocoindex/002-code-graph-trace/004-test"
    last_updated_at: "2026-05-12T00:00:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Scaffolded trace test checklist"
    next_safe_action: "Verify test implementation after product work"
    blockers:
      - "Implementation not started"
    key_files: ["spec.md", "plan.md", "tasks.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-05-12-027-003-004-test-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: 027/003/004 Trace Tests

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim implemented until complete |
| **[P1]** | Required | Must complete or explicitly defer |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Local `001-contract` is complete.
- [ ] CHK-002 [P0] Fixture approach is documented.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Tests assert public contract behavior.
- [ ] CHK-011 [P0] Tests avoid overfitting private resolver internals.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] Sparse-containment tests pass.
- [ ] CHK-021 [P0] Nested-class regression test passes.
- [ ] CHK-022 [P0] Role-equality test passes.
- [ ] CHK-023 [P0] Depth-cap test passes.
- [ ] CHK-024 [P0] Missing-symbol test passes.
- [ ] CHK-025 [P0] Coverage is at least 80 percent for new trace code.
- [ ] CHK-026 [P0] Strict child validation passes.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-030 [P0] Implementation summary records exact test command and result.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-040 [P1] Tests cover malformed input or missing-symbol error safety.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-050 [P1] Test matrix maps back to P0 requirements.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-060 [P1] Test file follows existing `mcp_server/tests` naming.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 0/12 |
| P1 Items | 3 | 0/3 |
| P2 Items | 0 | 0/0 |

**Verification Date**: Pending implementation
<!-- /ANCHOR:summary -->
