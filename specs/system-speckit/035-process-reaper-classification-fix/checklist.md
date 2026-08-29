---
title: "Checklist: Process-Reaper MCP Classification Fix"
description: "QA checklist for the reaper external-MCP classification fix — all items verified with observed evidence."
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/035-process-reaper-classification-fix"
    last_updated_at: "2026-08-22T19:31:50Z"
    last_updated_by: "claude-code"
    recent_action: "Verified all checklist items with evidence"
    next_safe_action: "Await commit go-ahead"
    blockers: []
    key_files:
      - "specs/system-speckit/035-process-reaper-classification-fix/plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-22-process-reaper-classification-fix"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Verification Checklist: Process-Reaper MCP Classification Fix

<!-- ANCHOR:protocol -->
## Verification Protocol

Every item is verified with observed command evidence (exit code / grep / diff) read before it is checked. The target symptom (2 failing `process-sweep` cases) was reproduced first, then the fix was proven with the same checks.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Negative control reproduced — `process-sweep.vitest.ts` showed 2 failed / 8 passed; both failures got `external-mcp-stdio` where `orphaned-project-daemon` is expected. [evidence: verbose vitest run before the edit]
- [x] CHK-002 [P0] Root cause confirmed — the external-MCP guard's first regex `/(?:^|[\s/])mcp-[^\s/]+/` matches the `mcp-server/` directory in the daemon path and runs before the daemon rules. [evidence: read of `process-memory-harness.ts` classify order + regex]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-003 [P1] The fix tightens only the terminal-segment match (`(?=\s|$)` lookahead); the `--mcp-server` flag branch is untouched. [evidence: `git diff` of the one-line change]
- [x] CHK-004 [P1] A durable WHY comment explains the lookahead intent without embedding spec paths or artifact ids (comment-hygiene compliant). [evidence: comment at `process-memory-harness.ts:139`]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-005 [P0] `process-sweep.vitest.ts` after the fix → 10/10 (both former failures pass). [evidence: vitest summary]
- [x] CHK-006 [P0] Genuine external MCP preserved — the "preserves external MCP stdio processes" case (binary + `--mcp-server` flag) stays green within the 10/10. [evidence: same run]
- [x] CHK-007 [P0] `process-memory-harness.vitest.ts` → 10/10 (no snapshot regression). [evidence: vitest summary]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-008 [P0] P0 requirements (REQ-001, REQ-002) implemented with evidence (rows above). [evidence: both suites 10/10]
- [x] CHK-009 [P1] Live path fixed — `@spec-kit/scripts` rebuilt; the tightened regex is present in `dist/ops/process-memory-harness.js`. [evidence: `tsc --build` + grep of the compiled file]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-010 [P1] No new external calls, credential surfaces, or network access — a single regex lookahead in an existing classifier; command redaction unchanged. [evidence: `git diff`; `tsc --noEmit` exit 0]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-011 [P1] Packet docs (spec/plan/tasks/checklist/implementation-summary) authored at Level 2 and reconciled to the shipped fix state. [evidence: `validate.sh --strict` exit 0 across all 5 core docs]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-012 [P1] Scoped diff holds only `process-memory-harness.ts` (source) plus this packet's docs; the rebuilt dist is gitignored; no task-created residue. [evidence: `git status --short` scripts/ scope]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

- [x] CHK-013 [P0] Both coupled reaper suites green (10/10 each); `tsc` exit 0. [evidence: vitest + typecheck runs]
- [x] CHK-014 [P0] `validate.sh --strict` on this packet → exit 0. [evidence: validate run]
<!-- /ANCHOR:summary -->

---

## Acceptance-Criteria Traceability

| AC ID | Class | Evidence |
|-------|-------|----------|
| AC-001 (REQ-001 daemon classified correctly) | Tested | scripts/tests/process-sweep.vitest.ts:185 |
| AC-002 (REQ-001 ancestor case) | Tested | scripts/tests/process-sweep.vitest.ts:70 |
| AC-003 (REQ-002 external preserved) | Tested | scripts/tests/process-sweep.vitest.ts:141 |
| AC-004 (REQ-003 no snapshot regression) | Tested | scripts/tests/process-memory-harness.vitest.ts:1 |
| AC-005 (REQ-003 live dist carries fix) | Tested | scripts/ops/process-memory-harness.ts:139 |
