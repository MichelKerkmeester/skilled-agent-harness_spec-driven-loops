---
title: "Verification Checklist: mcp-figma skill build and registration"
description: "Verification Date: 2026-06-14"
trigger_phrases:
  - "mcp-figma build checklist"
  - "figma skill build verification"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/151-mcp-figma-with-direct-cli-support/002-skill-build-and-registration"
    last_updated_at: "2026-06-14T17:00:00Z"
    last_updated_by: "orchestrate"
    recent_action: "All P0 and P1 verification items checked against the shipped skill"
    next_safe_action: "Operator reviews the record; both phases are complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-151-002-skill-build-and-registration"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: mcp-figma skill build and registration

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

- [x] CHK-001 [P0] Requirements documented in spec.md (verified) REQ-001 through REQ-006
- [x] CHK-002 [P0] Technical approach defined in plan.md (verified) model-on-sibling skill build
- [x] CHK-003 [P1] Dependencies identified and available (verified) phase 001 research plus the sibling skills
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Skill passes structure check (verified) package_skill.py --check returns PASS
- [x] CHK-011 [P0] No warnings outstanding (verified) SKILL.md under the word cap
- [x] CHK-012 [P1] Failure paths documented (confirmed) troubleshooting reference plus playbook failure scenarios present
- [x] CHK-013 [P1] Follows house patterns (confirmed) sibling terminal-control structure, no em dashes, no new prose semicolons
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All acceptance criteria met (verified) SC-001 through SC-003 satisfied
- [x] CHK-021 [P0] Command policy complete (verified) every command classified read-only, mutating, or destructive
- [x] CHK-022 [P1] Edge cases documented (confirmed) npm naming trap, minimal build, closed Figma, yolo rollback
- [x] CHK-023 [P1] Live verification done (verified) figma-ds-cli 1.2.0 installed, Code Mode figma manual discovered
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Work classified (confirmed) a new skill package plus scripts, not a fix to existing code
- [x] CHK-FIX-002 [P0] Surface inventory complete (verified) SKILL.md, four references, eight scripts, catalog, playbook, README, INSTALL_GUIDE, changelog authored
- [x] CHK-FIX-003 [P0] Consumer inventory complete (verified) skill graph registered plus reciprocal sibling edges added
- [x] CHK-FIX-004 [P0] Adversarial tests scoped [EVIDENCE: N/A - docs-and-scripts skill, gating policy covers the destructive surface]
- [x] CHK-FIX-005 [P1] Matrix axes listed [EVIDENCE: N/A - prose-and-scripts skill, no test matrix]
- [x] CHK-FIX-006 [P1] Hostile env variant [EVIDENCE: N/A - install scripts use explicit no-overwrite paths]
- [x] CHK-FIX-007 [P1] Evidence pinned (confirmed) figma-ds-cli 1.2.0 version and Code Mode discovery recorded in implementation-summary.md
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets (verified) no credentials in any doc or script
- [x] CHK-031 [P0] Input handling reviewed (confirmed) eval, raw, and run treated as arbitrary mutation and gated
- [x] CHK-032 [P1] Auth and patch guidance present (confirmed) safe-default connect, gated yolo patch, and unpatch rollback documented
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan, tasks synchronized (verified) all three reflect the shipped build
- [x] CHK-041 [P1] Comment hygiene held (confirmed) no spec paths or artifact ids in skill or script comments
- [x] CHK-042 [P2] README and INSTALL_GUIDE present (confirmed) narrative overview, troubleshooting, FAQ, and phased install shipped
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] No stray temp files (confirmed) no scratch files created
- [x] CHK-051 [P1] Workspace clean before completion (confirmed) only the skill, the sibling edges, and this packet were written
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-06-14
<!-- /ANCHOR:summary -->
