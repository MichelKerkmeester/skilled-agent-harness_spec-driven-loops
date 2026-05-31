---
title: "Verification Checklist: Port Upstream Tests"
description: "Verification checklist for Port upstream tests into the fork test tree and adapt them to spec-kit verification conventions."
trigger_phrases:
  - "027 phase 003"
  - "cocoindex tests-port"
  - "003-tests-port"
importance_tier: "important"
contextType: "checklist"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-spec-kit/028-code-graph-and-cocoindex/005-cocoindex-complete-fork/003-tests-port"
    last_updated_at: "2026-05-12T07:20:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Scaffolded child packet for Port Upstream Tests"
    next_safe_action: "Implement scoped tasks for 003-tests-port"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "codex-2026-05-12-027-001-003-tests-port"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Parent decomposition and dependency order are pre-approved by orchestrator."
---
# Verification Checklist: Port Upstream Tests

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| P0 | Hard blocker | Cannot claim child complete until satisfied |
| P1 | Required | Must complete or document approved deferral |
| P2 | Optional | Can defer with rationale |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Scope is documented in `spec.md`.
  - Evidence: scaffold authored on 2026-05-12.
- [x] CHK-002 [P0] Dependencies are documented in `graph-metadata.json`.
  - Evidence: manual.depends_on matches the requested phase table.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Owned files are read before editing.
  - Evidence: pending implementation.
- [ ] CHK-011 [P0] Changes stay inside this child scope.
  - Evidence: pending implementation.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] Child-specific checks pass.
  - Evidence: pending implementation.
- [ ] CHK-021 [P0] Strict validation exits 0 for this child.
  - Evidence: run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <child-folder> --strict`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each scoped requirement has implementation evidence or an explicit deferral.
  - Evidence: pending implementation.
- [ ] CHK-FIX-002 [P1] Handoff evidence is recorded for dependent children.
  - Evidence: pending implementation.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P1] No new unsafe path, network, or credential behavior is introduced.
  - Evidence: pending implementation.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec, plan, tasks, checklist, and summary agree.
  - Evidence: pending implementation.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P0] Child files live under the approved phase folder.
  - Evidence: `Port Upstream Tests` packet exists under the phase parent.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 7 | 3/7 |
| P1 Items | 4 | 0/4 |
| P2 Items | 0 | 0/0 |

**Verification Date**: pending implementation
**Verified By**: pending implementation
<!-- /ANCHOR:summary -->
