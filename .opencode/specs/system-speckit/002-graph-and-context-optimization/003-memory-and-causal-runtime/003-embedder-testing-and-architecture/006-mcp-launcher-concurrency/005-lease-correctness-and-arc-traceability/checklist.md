---
title: "Verification Checklist: Lease Correctness and Arc Traceability"
description: "Verification evidence for Phase 005 deep-review P1 remediation."
trigger_phrases:
  - "012/005 checklist"
  - "lease correctness verification"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/006-mcp-launcher-concurrency/005-lease-correctness-and-arc-traceability"
    last_updated_at: "2026-05-18T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Authored verification checklist"
    next_safe_action: "Replace pending evidence with final command output"
    blockers: []
    key_files:
      - "implementation-summary.md"
      - ".opencode/skills/system-skill-advisor/mcp_server/tests/launcher-lease.vitest.ts"
      - ".opencode/skills/system-skill-advisor/mcp_server/tests/launcher-bootstrap.vitest.ts"
---
# Verification Checklist: Lease Correctness and Arc Traceability

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

- [x] CHK-001 [P0] Requirements documented in spec.md
  - **Evidence**: `spec.md` lists REQ-001 through REQ-015, covering the 13 P1s and verification/commit hygiene.
- [x] CHK-002 [P0] Technical approach defined in plan.md
  - **Evidence**: `plan.md` records affected surfaces, matrix axes, and verification commands.
- [x] CHK-003 [P1] Dependencies identified and available
  - **Evidence**: Existing npm/vitest/spec-kit tooling is used; no new package dependency added.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Typecheck passes
  - **Evidence**: `npm --prefix .opencode/skills/system-skill-advisor/mcp_server run typecheck` exited 0.
- [x] CHK-011 [P0] Scope lock preserved
  - **Evidence**: Edits are limited to the user-supplied frozen file list and generated phase metadata.
- [x] CHK-012 [P1] Error handling implemented
  - **Evidence**: WAL fallback now matches SQLite base/extended READONLY, CANTOPEN, and IOERR codes plus EACCES, EROFS, EPERM, and ENOSPC.
- [x] CHK-013 [P1] Code follows project patterns
  - **Evidence**: CommonJS launchers keep local helpers; TypeScript tests reuse existing vitest fixture style.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All acceptance criteria met
  - **Evidence**: REQ-001 through REQ-015 are covered by the doc updates, launcher/lib changes, focused vitest suites, typecheck, and strict validations recorded in this checklist.
- [x] CHK-021 [P0] Focused launcher suites pass
  - **Evidence**: Skill-advisor focused suite passed 2 files / 17 tests; code-graph launcher suite passed 1 file / 7 tests; spec-kit launcher suite passed 1 file / 6 tests.
- [x] CHK-022 [P1] Edge cases tested
  - **Evidence**: Coverage includes live owner, dead PID reclaim, clean exit cleanup, SIGQUIT cleanup, strict-disable sibling boot, and shared resolved DB directory ownership.
- [x] CHK-023 [P1] DB-open path evidence exists
  - **Evidence**: `launcher-bootstrap.vitest.ts` verifies `initDb()` WAL+busy_timeout and statically proves watcher refresh plus rebuild-from-source route through the shared DB opener.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class
  - **Evidence**: Doc drift findings are `matrix/evidence`; test gaps are `matrix/evidence`; lease path, SQLite errors, and cleanup are `class-of-bug`.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed
  - **Evidence**: Affected producers are the three launchers, skill-advisor `lease.ts`, and `skill-graph-db.ts`; no extra launcher outside the arc is in scope.
- [x] CHK-FIX-003 [P0] Consumer inventory completed
  - **Evidence**: Consumers are launcher subprocess tests, skill-advisor bootstrap tests, arc specs, child checklists, and lease reference docs.
- [x] CHK-FIX-004 [P0] Path fixes include adversarial cases
  - **Evidence**: Tests cover two different workspace roots pointing at one resolved DB directory.
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed
  - **Evidence**: `plan.md` lists lease owner state, DB path mode, DB open path, and SQLite fallback error axes.
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed
  - **Evidence**: Launcher tests strip parent strict-mode and DB-dir env vars before injecting scoped overrides.
- [x] CHK-FIX-007 [P1] Evidence is pinned to explicit commands
  - **Evidence**: Verification section records exact commands and outputs after final runs.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
  - **Evidence**: No credentials or new secret-bearing env vars introduced.
- [x] CHK-031 [P0] Input validation not applicable
  - **Evidence**: Packet changes launcher filesystem paths, SQLite error classification, tests, and docs only.
- [x] CHK-032 [P1] Auth/authz not applicable
  - **Evidence**: No authentication surface changed.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
  - **Evidence**: `spec.md`, `plan.md`, and `tasks.md` describe the same 13-finding remediation packet.
- [x] CHK-041 [P1] Code comments adequate
  - **Evidence**: Launcher cleanup comment cites REQ-011; launcher tests carry REQ anchors.
- [x] CHK-042 [P2] Reference docs updated
  - **Evidence**: Skill-advisor daemon lease contract states launcher PID file and daemon lease DB are co-located with the resolved database directory.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only
  - **Evidence**: No packet temp files created under the phase folder.
- [x] CHK-051 [P1] scratch/ cleaned before completion
  - **Evidence**: No scratch directory created for this packet.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 13 | 13/13 |
| P1 Items | 12 | 12/12 |
| P2 Items | 1 | 1/1 |

## Command Evidence

| Command | Result |
|---------|--------|
| `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <005> --strict` | Exit 0; `Summary: Errors: 0  Warnings: 0`; `RESULT: PASSED`. |
| `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <arc> --strict --no-recursive` | Exit 0; `Summary: Errors: 0  Warnings: 0`; `RESULT: PASSED`. |
| `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <001> --strict` | Exit 0; `Summary: Errors: 0  Warnings: 0`; `RESULT: PASSED`. |
| `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <004> --strict` | Exit 0; `Summary: Errors: 0  Warnings: 0`; `RESULT: PASSED`. |
| `npm --prefix .opencode/skills/system-skill-advisor/mcp_server run typecheck` | Exit 0. |
| `cd .opencode/skills/system-skill-advisor/mcp_server && npx vitest --run launcher-lease launcher-bootstrap` | Exit 0; 2 files passed; 17 tests passed. |
| `cd .opencode/skills/system-code-graph/mcp_server && npx vitest --run launcher-lease` | Exit 0; 1 file passed; 7 tests passed. |
| `cd .opencode/skills/system-spec-kit/mcp_server && npx vitest --run launcher-lease` | Exit 0; 1 file passed; 6 tests passed. |
| `cd .opencode/skills/system-skill-advisor/mcp_server && npx vitest --run` | Exit 1; 57 files passed, 3 failed; 403 tests passed, 1 failed, 7 skipped. Failures are listed in `implementation-summary.md`. |
| `git add <explicit Phase 005 paths>` | FAIL, exit 128. Git cannot create `.git/index.lock` in this sandbox: `Operation not permitted`. |

**Verification Date**: 2026-05-18
<!-- /ANCHOR:summary -->
