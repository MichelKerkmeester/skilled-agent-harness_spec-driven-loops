---
title: "Verification Checklist: MCP shared dependency startup fix"
description: "Verification checklist for restoring mk_skill_advisor and mk_code_index startup after @spec-kit/shared dependency repair."
trigger_phrases:
  - "mcp startup verification"
  - "shared dependency checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/030-mcp-shared-dependency-startup-fix"
    last_updated_at: "2026-05-16T10:18:19Z"
    last_updated_by: "main_agent"
    recent_action: "Recorded doctor and install-guide prevention evidence"
    next_safe_action: "Packet complete; monitor next Codex startup"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0300000000000000000000000000000000000000000000000000000000000004"
      session_id: "030-checklist"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: MCP Shared Dependency Startup Fix

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

- [x] CHK-001 [P0] Requirements documented in spec.md. Evidence: `spec.md` REQ-001 through REQ-005.
- [x] CHK-002 [P0] Technical approach defined in plan.md. Evidence: `plan.md` affected-surfaces matrix.
- [x] CHK-003 [P1] Dependencies identified and available. Evidence: `@spec-kit/shared` package exists under `system-spec-kit/shared`.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Package manifests declare runtime dependencies where compiled JS imports them. Evidence: both package manifests and lockfiles contain local `@spec-kit/shared` entries.
- [x] CHK-011 [P0] No new startup console errors for the prior `ERR_MODULE_NOT_FOUND` crash sites. Evidence: both launcher smokes exited 0.
- [x] CHK-012 [P1] Existing package patterns are preserved. Evidence: fix uses existing package-local npm install and TypeScript config patterns.
- [x] CHK-013 [P1] No unrelated dirty worktree files are modified by this packet. Evidence: scoped diff inspection before final response.
- [x] CHK-014 [P1] Doctor covers the recurring failure mode. Evidence: `shared_dependency` and `shared_import` checks pass for `mk_skill_advisor` and `mk_code_index`.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] `system-skill-advisor` crash-site import passes. Evidence: `skill-advisor import ok`.
- [x] CHK-021 [P0] `system-code-graph` crash-site import passes. Evidence: `code-graph import ok`.
- [x] CHK-022 [P1] Package build/typecheck checks run. Evidence: advisor and code-graph `npm run typecheck` and `npm run build` passed.
- [x] CHK-023 [P1] Spec strict validation passes. Evidence: `validate.sh ... --strict` passed with 0 errors and 0 warnings.
- [x] CHK-024 [P1] Doctor script syntax and YAML assets validate. Evidence: `bash -n mcp-doctor.sh` and Ruby YAML load both passed.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class assigned: `cross-consumer`.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed. Evidence: both crash sites emit bare `@spec-kit/shared` imports.
- [x] CHK-FIX-003 [P0] Consumer inventory completed. Evidence: `system-skill-advisor` and `system-code-graph` are runtime consumers; `system-spec-kit/shared` is producer.
- [x] CHK-FIX-004 [P0] Security/path/parser adversarial tests are not applicable; this is package dependency resolution, not input parsing.
- [x] CHK-FIX-005 [P1] Matrix axes listed in `plan.md`: package root x crash-site import.
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant not applicable; fix does not read process-wide state.
- [x] CHK-FIX-007 [P1] Evidence pinned to explicit diff and command outputs in implementation summary.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets added.
- [x] CHK-031 [P0] Input validation not applicable; no input-handling code changed.
- [x] CHK-032 [P1] Auth/authz not applicable; MCP package startup only.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized after implementation.
- [x] CHK-041 [P1] Implementation summary records final evidence.
- [x] CHK-042 [P2] Install guide updates completed for both affected MCP servers.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only; no temp files created.
- [x] CHK-051 [P1] scratch/ clean before completion except scaffold `.gitkeep`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 13 | 13/13 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-05-16
<!-- /ANCHOR:summary -->
