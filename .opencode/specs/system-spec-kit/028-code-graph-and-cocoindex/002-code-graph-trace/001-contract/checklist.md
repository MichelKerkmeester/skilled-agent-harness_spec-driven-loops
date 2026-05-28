---
title: "Verification Checklist: 027/003/001 Trace Contract"
description: "Checklist scaffold for TraceTool and trace result contract verification."
trigger_phrases:
  - "027 003 001 checklist"
  - "trace contract checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-code-graph-and-cocoindex/002-code-graph-trace/001-contract"
    last_updated_at: "2026-05-12T00:00:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Scaffolded trace contract checklist"
    next_safe_action: "Verify contract implementation after product work"
    blockers:
      - "Implementation not started"
    key_files: ["spec.md", "plan.md", "tasks.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-05-12-027-003-001-contract-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: 027/003/001 Trace Contract

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

- [ ] CHK-001 [P0] Upstream Phase 001 contract dependency is checked.
- [ ] CHK-002 [P0] Spec, plan, and tasks agree on contract scope.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `TraceTool` interface exists.
- [ ] CHK-011 [P0] Trace result type includes filePath-backed file ownership.
- [ ] CHK-012 [P0] Sparse and truncated trace states are representable.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] Type check passes.
- [ ] CHK-021 [P0] Strict child validation passes.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-030 [P0] Contract has downstream consumer notes for lib, handler, and tests.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-040 [P1] Contract does not expose raw SQL or DB internals to the handler.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-050 [P1] Implementation summary records final contract choices.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-060 [P1] Contract file follows the existing `mcp_server/code_graph/lib` layout.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 7 | 0/7 |
| P1 Items | 3 | 0/3 |
| P2 Items | 0 | 0/0 |

**Verification Date**: Pending implementation
<!-- /ANCHOR:summary -->
