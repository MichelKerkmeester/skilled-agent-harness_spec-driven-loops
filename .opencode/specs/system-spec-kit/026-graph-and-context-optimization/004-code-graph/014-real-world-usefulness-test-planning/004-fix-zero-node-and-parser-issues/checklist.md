---
title: "Verification Checklist: Code-Graph Bug Remediation"
description: "Level 2 checklist for the P0 and top P1 code graph remediation packet."
trigger_phrases:
  - "026/007/012/004 checklist"
  - "code graph remediation verification"
  - "zero-node guard checklist"
  - "parse diagnostics checklist"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/005-code-graph/011-real-world-usefulness-test-planning/004-fix-zero-node-and-parser-issues"
    last_updated_at: "2026-05-06T06:02:52Z"
    last_updated_by: "codex-gpt-5.5"
    recent_action: "Completed remediation checklist evidence"
    next_safe_action: "Review final verification output"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:80ebcf2b6ba9a8bb79b8a24299cba29ed95339bbc73cce0959513bdd5fcab9fd"
      session_id: "026-007-012-004-fix-zero-node-and-parser-issues"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: Code-Graph Bug Remediation

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

- [x] CHK-001 [P0] Requirements documented in `spec.md`. Evidence: REQ-001 through REQ-007.
- [x] CHK-002 [P0] Technical approach defined in `plan.md`. Evidence: fail-safe persistence and promotion gate plan.
- [x] CHK-003 [P1] Dependencies identified and available. Evidence: DB, handler, schema, and vitest surfaces listed in `plan.md`.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] F-002 zero-node guard implemented and scoped. Evidence: `scan.ts:343` and `code-graph-scan.vitest.ts:1034`.
- [x] CHK-011 [P0] F-003 parse-error preservation implemented and scoped. Evidence: `ensure-ready.ts:465` and `code-graph-atomic-persistence.vitest.ts:143`.
- [x] CHK-012 [P1] F-008 metadata promotion gate implemented. Evidence: `scan.ts:468` and `code-graph-scan.vitest.ts:1097`.
- [x] CHK-013 [P1] F-009 orphan-edge filter and cleanup implemented. Evidence: `code-graph-db.ts:672` and `code-graph-indexer.vitest.ts:255`.
- [x] CHK-014 [P1] F-010 nonfatal manifest recording implemented. Evidence: `scan.ts:503` and `code-graph-scan.vitest.ts:1158`.
- [x] CHK-015 [P1] F-011 durable diagnostics implemented. Evidence: `code-graph-db.ts:157`, `scan.ts:550`, and `status.ts:42`.
- [x] CHK-016 [P1] Code follows OpenCode TypeScript/MCP server patterns. Evidence: `npm run build` exit 0 and alignment drift exit 0.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Regression covers F-002 zero-node scan preservation. Evidence: `code-graph-scan.vitest.ts:1034`.
- [x] CHK-021 [P0] Regression covers F-003 parser-error preservation. Evidence: `code-graph-atomic-persistence.vitest.ts:143`.
- [x] CHK-022 [P1] Regression covers F-009 orphan-edge filtering. Evidence: `code-graph-indexer.vitest.ts:255`.
- [x] CHK-023 [P1] Regression covers F-010 candidate manifest recording with nonfatal parse errors. Evidence: `code-graph-scan.vitest.ts:1158`.
- [x] CHK-024 [P1] Regression covers F-011 diagnostics in scan and status responses. Evidence: `code-graph-scan.vitest.ts:1205`.
- [x] CHK-025 [P1] Regression covers F-006 broad scan followed by read-path manifest comparison. Evidence: `code-graph-candidate-manifest.vitest.ts:90`.
- [x] CHK-026 [P1] Existing code graph tests pass. Evidence: `20 passed`, `262 passed`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class. Evidence: F-002/F-008/F-010 are scan promotion policy, F-003/F-011 are diagnostics/persistence policy, F-009 is DB integrity, F-006 is matrix/evidence.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed. Evidence: `scan.ts`, `ensure-ready.ts`, and `code-graph-db.ts` read before edits.
- [x] CHK-FIX-003 [P0] Consumer inventory completed. Evidence: scan/status/schema/test consumers listed in `plan.md`.
- [x] CHK-FIX-004 [P0] Safety table tests cover zero-node, forced reset, parse error, and orphan-edge cases. Evidence: `code-graph-scan.vitest.ts:1034`, `code-graph-scan.vitest.ts:1077`, `code-graph-atomic-persistence.vitest.ts:143`, `code-graph-indexer.vitest.ts:255`.
- [x] CHK-FIX-005 [P1] Matrix axes listed before completion. Evidence: `plan.md` affected-surfaces section.
- [x] CHK-FIX-006 [P1] Hostile state variants executed where process-wide DB/schema state applies. Evidence: temp-DB tests in `code-graph-atomic-persistence.vitest.ts`, `code-graph-indexer.vitest.ts`, and `code-graph-candidate-manifest.vitest.ts`.
- [x] CHK-FIX-007 [P1] Evidence pinned to final diff and validation output in `implementation-summary.md`. Evidence: implementation summary verification table.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets. Evidence: changes are scan/DB/schema/test logic only.
- [x] CHK-031 [P0] Input validation updated for `forceZeroNodeReset`. Evidence: `tool-input-schemas.ts:500`, `tests/tool-input-schema.vitest.ts` passed.
- [x] CHK-032 [P1] Destructive reset requires explicit user-provided boolean. Evidence: `scan.ts:346`, `tool-schemas.ts:586`.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan, tasks, checklist, decision record, and implementation summary synchronized.
- [x] CHK-041 [P1] Parent `children_ids` includes `004-fix-zero-node-and-parser-issues`.
- [x] CHK-042 [P2] Strict child and parent validation pass. Evidence: child and parent strict validation exited 0.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files stay in `scratch/` only. Evidence: no scratch files used beyond `.gitkeep`.
- [x] CHK-051 [P1] Worktree diff contains only intended remediation files plus pre-existing unrelated user changes. Evidence: scoped `git status --short` reviewed after implementation.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 15 | 15/15 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-05-06
<!-- /ANCHOR:summary -->
