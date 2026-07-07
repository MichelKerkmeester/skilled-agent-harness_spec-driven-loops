---
title: "Verification Checklist: Scope-Change Guard"
description: "Verification checklist for Phase 026/007/012/005 F-002 scope-change promotion guard."
trigger_phrases:
  - "026/007/012/005 checklist"
  - "scope-change guard verification"
  - "forceScopeChange verification"
importance_tier: "critical"
contextType: "verification"
_memory:
  continuity:
    packet_pointer: "system-code-graph/007-code-graph-buildout/008-real-world-usefulness-test-planning/006-scope-change-scan-guard"
    last_updated_at: "2026-05-06T07:44:35Z"
    last_updated_by: "cli-codex-gpt-5.5"
    recent_action: "Verified F-002 scope guard"
    next_safe_action: "Review and commit"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/code_graph/tests/code-graph-scan.vitest.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts"
    session_dedup:
      fingerprint: "sha256:3333333333333333333333333333333333333333333333333333333333333333"
      session_id: "026-007-012-006-scope-change-scan-guard"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: Scope-Change Guard

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

- [x] CHK-001 [P0] Requirements documented in spec.md. Evidence: `spec.md` REQ-001 through REQ-007.
- [x] CHK-002 [P0] Technical approach defined in plan.md. Evidence: `plan.md` architecture and phases.
- [x] CHK-003 [P1] Dependencies identified and available. Evidence: `plan.md` dependencies table.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] TypeScript build passes. Evidence: `npm run build` exit 0.
- [x] CHK-011 [P0] Dist output rebuilt from source. Evidence: `dist` contains `forceScopeChange` and `scope_change_scan_rejected`.
- [x] CHK-012 [P1] Error handling follows existing blocked-response envelope. Evidence: scope block mirrors zero-node response shape.
- [x] CHK-013 [P1] Code follows project patterns with no unrelated refactor. Evidence: edits scoped to scan, schemas, tests, and packet docs.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] New F-002 nonzero scope-mismatch test passes. Evidence: targeted scan suite 36 passed.
- [x] CHK-021 [P0] `forceScopeChange` bypass test passes. Evidence: targeted scan suite 36 passed.
- [x] CHK-022 [P1] Same-scope dramatic shrink test passes. Evidence: targeted scan suite 36 passed.
- [x] CHK-023 [P1] Existing zero-node guard and force-zero tests still pass. Evidence: targeted scan suite 36 passed.
- [x] CHK-024 [P1] Tool input schema accepts `forceScopeChange`. Evidence: schema suite 86 passed.
- [x] CHK-025 [P1] Full `code_graph/tests/` suite passes. Evidence: 20 files, 265 tests passed.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class recorded as `class-of-bug`: unsafe scan promotion from scope mismatch.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed for scan promotion side effects.
- [x] CHK-FIX-003 [P0] Consumer inventory completed for schema and scan controls.
- [x] CHK-FIX-004 [P0] Matrix includes mismatch/same-scope, zero/nonzero, and force/no-force rows.
- [x] CHK-FIX-005 [P1] Ratio-based behavior rejected with explicit same-scope shrink test.
- [x] CHK-FIX-006 [P1] Legacy missing fingerprint compatibility documented.
- [x] CHK-FIX-007 [P1] Evidence pinned to commands run in this Phase 005 packet.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets.
- [x] CHK-031 [P0] Input validation implemented for `forceScopeChange`.
- [x] CHK-032 [P1] No auth/authz surface changed.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan, tasks, checklist, ADR, and implementation summary synchronized.
- [x] CHK-041 [P1] Parent `graph-metadata.json` includes `006-scope-change-scan-guard`.
- [x] CHK-042 [P2] README update not required because this is an internal MCP schema control.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files remain in scratch/ only.
- [x] CHK-051 [P1] No unrelated dirty worktree files modified.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 10 | 10/10 |
| P1 Items | 14 | 14/14 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-05-06
<!-- /ANCHOR:summary -->
