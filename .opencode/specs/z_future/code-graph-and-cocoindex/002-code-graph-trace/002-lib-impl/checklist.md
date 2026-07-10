---
title: "Verification Checklist: 027/003/002 Trace Library"
description: "Checklist scaffold for code-graph-trace.ts verification."
trigger_phrases:
  - "027 003 002 checklist"
  - "trace library checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "z_future/code-graph-and-cocoindex/002-code-graph-trace/002-lib-impl"
    last_updated_at: "2026-05-12T00:00:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Scaffolded trace library checklist"
    next_safe_action: "Verify resolver implementation after product work"
    blockers:
      - "Implementation not started"
    key_files: ["spec.md", "plan.md", "tasks.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-05-12-027-003-002-lib-impl-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: 027/003/002 Trace Library

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
- [ ] CHK-002 [P0] Upstream `027/002/002-lib-impl` is merged.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `traceSymbol` implements the contract.
- [ ] CHK-011 [P0] File rung comes from `CodeNode.filePath`.
- [ ] CHK-012 [P0] Module rung comes from file-path policy.
- [ ] CHK-013 [P0] Phase 001 classifier supplies `architectural_role`.
- [ ] CHK-014 [P0] Depth cap sets `truncated: true`.
- [ ] CHK-015 [P1] Optional ancestry display handles nested classes by fqName prefix.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] Sparse symbol fixtures pass.
- [ ] CHK-021 [P0] Role equality test passes.
- [ ] CHK-022 [P0] `npm run check` passes.
- [ ] CHK-023 [P0] Strict child validation passes.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-030 [P0] Implementation summary cites file:line evidence for P0 behavior.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-040 [P1] Missing-symbol and malformed-id paths do not expose raw DB errors.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-050 [P1] File-path module policy examples are documented.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-060 [P1] Resolver lives under `mcp_server/code_graph/lib`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 0/12 |
| P1 Items | 4 | 0/4 |
| P2 Items | 0 | 0/0 |

**Verification Date**: Pending implementation
<!-- /ANCHOR:summary -->
