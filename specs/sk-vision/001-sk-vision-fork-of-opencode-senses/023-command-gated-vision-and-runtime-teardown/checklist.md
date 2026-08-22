---
title: "Verification Checklist: Command-gated vision activation and runtime teardown"
description: "Verification Date: 2026-08-22"
trigger_phrases:
  - "verification"
  - "checklist"
  - "sk-vision command-gated"
  - "sk-vision teardown"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "specs/sk-vision/001-sk-vision-fork-of-opencode-senses/023-command-gated-vision-and-runtime-teardown"
    last_updated_at: "2026-08-22T00:00:00.000Z"
    last_updated_by: "claude"
    recent_action: "Design locked from two-pass investigation; authoring 023."
    next_safe_action: "Smoke-test OpenCode command hook, then build."
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-vision-023-command-gated-vision-and-runtime-teardown"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Command-gated vision activation and runtime teardown

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

- [ ] CHK-001 [P0] Requirements documented in spec.md
- [ ] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P1] Host mechanics confirmed (command hook, SDK image fetch, teardown, Pi API)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Typecheck passes in vision-runtime
- [ ] CHK-011 [P0] No new console errors or warnings
- [ ] CHK-012 [P1] Error handling on the `/vision` path (missing image, runtime failure) returns a clear message
- [ ] CHK-013 [P1] Code follows existing sk-vision patterns; comment hygiene clean
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] All acceptance criteria met (spec §5)
- [ ] CHK-021 [P0] Live smoke tests complete in OpenCode and Pi
- [ ] CHK-022 [P1] Bare `/vision` and `/vision <question>` both validated
- [ ] CHK-023 [P1] Runtime-process-gone confirmed after each call
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Finding class identified: class-of-bug (always-on activation) plus resource-lifecycle (runtime creep).
- [ ] CHK-FIX-002 [P0] Same-class producer inventory: both in-process injectors (OpenCode `attachments.ts` + Pi hook) covered; MCP host confirmed out of class.
- [ ] CHK-FIX-003 [P0] Consumer inventory: confirm no caller depends on the removed default tool/inject registration.
- [ ] CHK-FIX-004 [P0] N/A — no path/parser/redaction change (recorded as not applicable).
- [ ] CHK-FIX-005 [P1] Host/flag matrix listed (OpenCode/Pi x default/`SK_VISION_AUTOINSPECT`/`SK_VISION_TEARDOWN`).
- [ ] CHK-FIX-006 [P1] Env-flag variants exercised (default, autoinspect, teardown mode).
- [ ] CHK-FIX-007 [P1] Evidence pinned to a commit SHA or explicit diff range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets
- [ ] CHK-031 [P1] Command argument handled safely (no shell injection into the runtime)
- [ ] CHK-032 [P1] N/A — no auth/authz surface in this change (recorded as not applicable)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
- [ ] CHK-041 [P1] SKILL.md/README/feature-catalog/playbook updated for the new activation model + env flags
- [ ] CHK-042 [P2] New env flags documented in the SK_VISION_* table
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only
- [ ] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 9 | 0/9 |
| P1 Items | 12 | 0/12 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-08-22
<!-- /ANCHOR:summary -->
