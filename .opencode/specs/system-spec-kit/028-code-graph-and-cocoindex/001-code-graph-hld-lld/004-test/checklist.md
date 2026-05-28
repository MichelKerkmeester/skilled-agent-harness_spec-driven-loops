---
title: "Verification Checklist: 004 Tests"
description: "Checklist for the HLD/LLD Vitest suite."
trigger_phrases:
  - "027 phase 002 test checklist"
  - "code graph hld lld vitest checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-spec-kit/028-code-graph-and-cocoindex/001-code-graph-hld-lld/004-test"
    last_updated_at: "2026-05-12T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Scaffolded test checklist"
    next_safe_action: "Wait for 001-contract"
    blockers:
      - "001-contract"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "codex-2026-05-12-027-002-004-test-checklist"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Verification Checklist: 004 Tests

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
- [ ] CHK-002 [P0] Public testable entry points are known.
- [ ] CHK-003 [P1] Fixture strategy avoids private helper coupling.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Tests target public contract exports.
- [ ] CHK-011 [P0] Deterministic ordering is asserted before caps.
- [ ] CHK-012 [P0] Dangling-edge policy is covered.
- [ ] CHK-013 [P0] Primary module selection is covered.
- [ ] CHK-014 [P0] Classifier equality is covered.
- [ ] CHK-015 [P0] JSON serialization is covered.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] Targeted Vitest suite passes.
- [ ] CHK-021 [P0] Coverage is at least 80 percent for new code.
- [ ] CHK-022 [P0] `npm run check` passes.
- [ ] CHK-023 [P0] Handler JSON parse integration test passes if omni remains.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-030 [P0] Every parent P0 audit constraint maps to at least one test.
- [ ] CHK-031 [P1] Deferred P1/P2 assertions have rationale and owner.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-040 [P1] Tests do not require command execution, network access, or unbounded file reads.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-050 [P0] spec.md, plan.md, tasks.md, and checklist.md are synchronized.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-060 [P1] Test files stay under the expected mcp_server test location.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 15 | 0/15 |
| P1 Items | 5 | 0/5 |
| P2 Items | 0 | 0/0 |

**Verification Date**: Pending implementation
<!-- /ANCHOR:summary -->
