---
title: "Verification Checklist: 002 Library Implementation"
description: "Checklist for deterministic HLD/LLD generator implementation."
trigger_phrases:
  - "027 phase 002 lib impl checklist"
  - "code graph hld lld implementation checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-spec-kit/028-code-graph-and-cocoindex/001-code-graph-hld-lld/002-lib-impl"
    last_updated_at: "2026-05-12T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Scaffolded library checklist"
    next_safe_action: "Wait for 001-contract"
    blockers:
      - "001-contract"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "codex-2026-05-12-027-002-002-lib-checklist"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Verification Checklist: 002 Library Implementation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim implemented until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] `001-contract` has validated.
- [ ] CHK-002 [P0] Dangling-edge policy is selected.
- [ ] CHK-003 [P1] Existing DB helper availability is verified.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `generateHLD(filePath, db)` returns deterministic JSON.
- [ ] CHK-011 [P0] `generateLLD(symbolId, db)` handles missing and existing symbols.
- [ ] CHK-012 [P0] Stable sort helper runs before caps.
- [ ] CHK-013 [P0] Dangling-edge policy is implemented.
- [ ] CHK-014 [P0] Primary module selection follows contract.
- [ ] CHK-015 [P0] `classifyFileRole` export matches HLD `file_role`.
- [ ] CHK-016 [P1] Layer classification covers baseline tiers.
- [ ] CHK-017 [P1] High fan-in complexity hint is emitted.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] Determinism fixture passes.
- [ ] CHK-021 [P0] Dangling-edge fixture passes.
- [ ] CHK-022 [P0] Primary module fixture passes.
- [ ] CHK-023 [P0] Serialization test passes.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-030 [P0] Every generator P0 requirement maps to a child 004 test.
- [ ] CHK-031 [P1] Deferred P1/P2 helpers are documented if not implemented.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-040 [P1] Library introduces no command execution, network access, or unbounded file reads.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-050 [P0] spec.md, plan.md, tasks.md, and checklist.md are synchronized.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-060 [P1] Source changes stay in the intended code_graph library file.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 16 | 0/16 |
| P1 Items | 6 | 0/6 |
| P2 Items | 0 | 0/0 |

**Verification Date**: Pending implementation
<!-- /ANCHOR:summary -->
