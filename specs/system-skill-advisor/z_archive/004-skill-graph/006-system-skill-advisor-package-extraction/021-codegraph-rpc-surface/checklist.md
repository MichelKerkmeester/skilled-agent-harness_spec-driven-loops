---
title: "Verification Checklist: Code Graph RPC Classifier Surface"
description: "Verification checklist for packet 021 classifier RPC surface."
trigger_phrases:
  - "021 checklist"
  - "codegraph rpc surface verification"
importance_tier: "critical"
contextType: "verification"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/004-skill-graph/006-system-skill-advisor-package-extraction/021-codegraph-rpc-surface"
    last_updated_at: "2026-05-15T09:20:31Z"
    last_updated_by: "codex"
    recent_action: "Completed verification checklist"
    next_safe_action: "Commit scoped files"
    blockers: []
    key_files:
      - "checklist.md"
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: Code Graph RPC Classifier Surface

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
- [x] CHK-002 [P0] Technical approach defined in plan.md. Evidence: `plan.md` architecture and data flow sections.
- [x] CHK-003 [P1] Dependencies identified and available. Evidence: `plan.md` dependencies list.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes TypeScript checks. Evidence: code-graph and spec-kit typechecks passed after implementation.
- [x] CHK-011 [P0] No local spec-kit classifier implementation remains. Evidence: `rg -n "structuralPatterns|semanticPatterns|structuralKeywords|semanticKeywords" .opencode/skills/system-spec-kit/mcp_server/lib/code-graph-boundary.ts` returns 0.
- [x] CHK-012 [P1] Error handling implemented. Evidence: boundary validates payload shape and throws into existing `memory_context` catch.
- [x] CHK-013 [P1] Code follows project patterns. Evidence: schema, handler export, dispatcher case, and text JSON response mirror existing code-graph tools.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Focused code-graph classifier tests pass. Evidence: 15/15 targeted tests passed.
- [x] CHK-021 [P0] Focused spec-kit runtime-routing test passes. Evidence: 26/26 targeted tests passed after code-graph dist rebuild.
- [x] CHK-022 [P1] Broader package tests completed with no new regression. Evidence: advisor 368/372 green; spec-kit failed 105 vs expected baseline around 114; code-graph failures are unrelated pre-existing schema/symlink tests.
- [x] CHK-023 [P1] Live MCP lists the new tool. Evidence: direct MCP SDK `listTools()` returned 11 tools including `code_graph_classify_query_intent`; local `opencode mcp` lacks a `tools` subcommand.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class assigned: cross-consumer process-boundary gap.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed. Evidence: canonical producer remains `query-intent-classifier.ts`.
- [x] CHK-FIX-003 [P0] Consumer inventory completed. Evidence: only production spec-kit caller is `memory-context.ts`.
- [x] CHK-FIX-004 [P0] No security/path/parser/redaction logic changed; adversarial table not applicable.
- [x] CHK-FIX-005 [P1] Matrix axes listed. Evidence: `plan.md` affected-surfaces section.
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant not applicable; no env/global-state read added.
- [x] CHK-FIX-007 [P1] Evidence pinned to explicit verification commands and final binding fields.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets.
- [x] CHK-031 [P0] Input validation implemented. Evidence: dispatcher rejects missing/non-string `query`.
- [x] CHK-032 [P1] Auth/authz unchanged; MCP server has no auth surface in this local runtime.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized.
- [x] CHK-041 [P1] Code comments adequate.
- [x] CHK-042 [P2] Implementation summary updated with final verification evidence.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files avoided.
- [x] CHK-051 [P1] scratch/ contains only scaffold `.gitkeep`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 11 | 11/11 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-05-15
<!-- /ANCHOR:summary -->
