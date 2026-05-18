---
title: "Verification Checklist: 003 Handler"
description: "Checklist for the code_graph_hld_lld handler and tool registration."
trigger_phrases:
  - "027 phase 002 handler checklist"
  - "code_graph_hld_lld handler checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-code-graph-hld-lld/003-handler"
    last_updated_at: "2026-05-12T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Scaffolded handler checklist"
    next_safe_action: "Wait for 001-contract"
    blockers:
      - "001-contract"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "codex-2026-05-12-027-002-003-handler-checklist"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Verification Checklist: 003 Handler

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
- [ ] CHK-002 [P0] Existing readiness behavior is understood.
- [ ] CHK-003 [P0] Omni keep/remove decision is explicit.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `code_graph_hld_lld` is registered.
- [ ] CHK-011 [P0] Handler imports contract types.
- [ ] CHK-012 [P0] Handler validates malformed input.
- [ ] CHK-013 [P0] Handler output serializes as JSON.
- [ ] CHK-014 [P0] Readiness failures use existing envelope conventions.
- [ ] CHK-015 [P0] Omni wire contract is all-or-nothing.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] Handler success test passes.
- [ ] CHK-021 [P0] Handler malformed input test passes.
- [ ] CHK-022 [P0] Handler JSON parse integration test passes if omni remains.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-030 [P0] Wire contract drift risk is mapped to an integration test.
- [ ] CHK-031 [P1] Error codes are documented.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-040 [P0] Input validation rejects malformed file paths and symbol IDs.
- [ ] CHK-041 [P1] Handler introduces no command execution or network access.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-050 [P0] spec.md, plan.md, tasks.md, and checklist.md are synchronized.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-060 [P1] Handler and registry changes stay in expected code_graph files.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 16 | 0/16 |
| P1 Items | 4 | 0/4 |
| P2 Items | 0 | 0/0 |

**Verification Date**: Pending implementation
<!-- /ANCHOR:summary -->
