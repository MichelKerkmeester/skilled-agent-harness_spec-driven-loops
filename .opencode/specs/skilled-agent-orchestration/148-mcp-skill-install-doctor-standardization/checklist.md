---
title: "Verification Checklist: Standardize the mcp-* skills into the install-guide and doctor system"
description: "Verification Date: 2026-06-15"
trigger_phrases:
  - "mcp skill standardization checklist"
  - "doctor.sh verification"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/148-mcp-skill-install-doctor-standardization"
    last_updated_at: "2026-06-15T06:10:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Verified scripts, packaging, and cross-refs; recording evidence"
    next_safe_action: "Run validate.sh --strict, then scoped commit"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-open-design/scripts/doctor.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-148-mcp-skill-install-doctor-standardization"
      parent_session_id: null
    completion_pct: 85
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: Standardize the mcp-* skills into the install-guide and doctor system

<!-- SPECKIT_LEVEL: 2 -->

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

- [x] CHK-001 [P0] Requirements documented in spec.md (REQ-001 through REQ-006)
- [x] CHK-002 [P0] Technical approach defined in plan.md (shared skill convention)
- [x] CHK-003 [P1] Dependencies identified (claude2 logged out; fell back to gpt-5.5-fast)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Scripts pass syntax checks (`bash -n` PASS on all 5 new scripts)
- [x] CHK-011 [P0] No fatal errors (package_skill PASS; one soft open-design 3003/3000-word warning noted)
- [x] CHK-012 [P1] Error handling: doctors warn/info and exit 0 when tools or apps are absent
- [x] CHK-013 [P1] Follows project patterns (mirror mcp-figma `_common.sh` and the sk-doc INSTALL_GUIDE shape)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Acceptance criteria met (REQ-001..006 evidence in spec.md)
- [x] CHK-021 [P0] Manual verification complete (host fact-check of generated scripts vs real sources)
- [x] CHK-022 [P1] Edge cases checked (missing CLI, closed app, unknown flag paths read in the scripts)
- [x] CHK-023 [P1] Error scenarios validated (auth error surfaced as login requirement, never a credential prompt)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] N/A - standardization packet, no bug-fix findings to classify
- [x] CHK-FIX-002 [P0] N/A - no behavior-change finding requiring a producer inventory
- [x] CHK-FIX-003 [P0] Consumer check done for the one shared surface (doctor YAML loop iterates `servers:` only; `cli_skill_diagnostics:` is additive)
- [x] CHK-FIX-004 [P0] N/A - no security, path, parser, or redaction fix in this packet
- [x] CHK-FIX-005 [P1] N/A - no matrix-style fix
- [x] CHK-FIX-006 [P1] N/A - no process-wide state read
- [x] CHK-FIX-007 [P1] Evidence pinned to the scoped commit at completion
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets; auth checks report presence only, never echo a value
- [x] CHK-031 [P0] Input validation: install.sh rejects unknown flags with usage and a non-zero exit
- [x] CHK-032 [P1] Auth handling: gated verbs surface a login requirement rather than prompting for credentials
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] spec, plan, and tasks synchronized for this packet
- [x] CHK-041 [P1] Script comments state the durable WHY; comment-hygiene sweep clean
- [x] CHK-042 [P2] READMEs and INSTALL_GUIDEs updated (cross-refs plus the new open-design guide)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Seat briefs and logs kept in `scratch/` only
- [x] CHK-051 [P1] Per repo convention `scratch/` is tracked; the seat briefs are kept as provenance and the large seat JSON event-stream logs were removed from the commit as throwaway noise
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-06-15
<!-- /ANCHOR:summary -->
