---
title: "Verification Checklist: Lease Canonicalization and Cleanup Ordering"
description: "Verification evidence for Phase 006 council remediation."
trigger_phrases:
  - "012/006 checklist"
  - "lease canonicalization verification"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/006-mcp-launcher-concurrency/006-lease-canonicalization-and-cleanup-ordering"
    last_updated_at: "2026-05-18T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored verification checklist"
    next_safe_action: "Replace pending evidence with final outputs"
    blockers: []
    key_files:
      - "implementation-summary.md"
---
# Verification Checklist: Lease Canonicalization and Cleanup Ordering

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
  - **Evidence**: `spec.md` lists REQ-001 through REQ-014 mapped to council P1/P2 findings.
- [x] CHK-002 [P0] Technical approach defined in plan.md
  - **Evidence**: `plan.md` records affected surfaces, matrix axes, and verification commands.
- [x] CHK-003 [P1] Dependencies identified and available
  - **Evidence**: Existing Node, Vitest, better-sqlite3, and spec-kit scripts are reused; no new dependency added.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Typecheck passes
  - **Evidence**: `npm --prefix .opencode/skills/system-skill-advisor/mcp_server run typecheck` exited 0.
- [x] CHK-011 [P0] Scope lock preserved
  - **Evidence**: Edits stay within the user-supplied frozen file list plus generated 006 metadata.
- [x] CHK-012 [P1] Error handling implemented
  - **Evidence**: Legacy live owners block startup; stale legacy owners are logged and startup proceeds without auto-migration.
- [x] CHK-013 [P1] Code follows project patterns
  - **Evidence**: Local helpers are kept inside each launcher; TypeScript lease logic preserves existing exported API shape with an additive `legacyPath` field.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All acceptance criteria met
  - **Evidence**: All in-scope P1/P2 findings are covered by code, tests, docs, or the explicit P2-Seat4 scope deferral.
- [x] CHK-021 [P0] Focused launcher suites pass
  - **Evidence**: Skill-advisor focused suite passed 2 files / 20 tests; spec-kit launcher suite passed 1 file / 8 tests; code-graph launcher suite passed 1 file / 9 tests with `--configLoader runner` after the exact command hit Vite temp-file EPERM.
- [x] CHK-022 [P1] Edge cases covered by tests
  - **Evidence**: Added symlink-alias, legacy lease, and SIGKILL-backstop cleanup cases.
- [x] CHK-023 [P1] Runtime DB-open path evidence exists
  - **Evidence**: `launcher-bootstrap.vitest.ts` exercises `advisor_rebuild` through the real DB opener and observes WAL plus busy_timeout.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class
  - **Evidence**: P1-Seat1-A/B and P1-Seat2 are `class-of-bug`; P1-Seat3/4 and P2-Seat3 are `matrix/evidence`; P2-Seat5 is `test-isolation`.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed
  - **Evidence**: Same-class producers are exactly the three launchers and skill-advisor `lease.ts`.
- [x] CHK-FIX-003 [P0] Consumer inventory completed
  - **Evidence**: Consumers are launcher preflight output, launcher subprocess tests, packet docs, and daemon lease reference docs.
- [x] CHK-FIX-004 [P0] Path fixes include adversarial cases
  - **Evidence**: Tests include two symlinks pointing at the same real DB directory.
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed
  - **Evidence**: `plan.md` lists path identity, lease origin, process exit, and permission model axes.
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed
  - **Evidence**: Launcher tests strip parent strict-mode and DB-dir env before injecting test-specific values.
- [x] CHK-FIX-007 [P1] Evidence is pinned to explicit commands
  - **Evidence**: Command evidence table records exact commands, exit status, and the code-graph config-loader workaround.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
  - **Evidence**: No credentials or secret env vars introduced.
- [x] CHK-031 [P0] File permissions tightened
  - **Evidence**: Inline PID lease temp writes use `mode: 0o600`; owned lease/DB dirs use `0o700`; skill-advisor lease DB is chmodded `0o600`.
- [x] CHK-032 [P1] Auth/authz not applicable
  - **Evidence**: No authentication surface changed.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
  - **Evidence**: All three docs describe the 006 council remediation packet.
- [x] CHK-041 [P1] Code comments adequate
  - **Evidence**: Signal mirror cleanup comments cite the council P1 and explain why `process.on('exit')` is insufficient for SIGKILL.
- [x] CHK-042 [P2] Reference docs updated or deferred
  - **Evidence**: `daemon-lease-contract.md` updated; P2-Seat4 direct edits to two `launcher-lease.md` files deferred because the frozen scope says not to touch them.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only
  - **Evidence**: No persistent temp files created in the packet.
- [x] CHK-051 [P1] scratch/ cleaned before completion
  - **Evidence**: No scratch directory created.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 10 | 10/10 |
| P1 Items | 10 | 10/10 |
| P2 Items | 1 | 1/1 |

## Command Evidence

| Command | Result |
|---------|--------|
| `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <006> --strict` | PASS, exit 0. `Summary: Errors: 0  Warnings: 0`; `RESULT: PASSED`. |
| `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <arc> --strict` | PASS, exit 0. `Summary: Errors: 0  Warnings: 0`; `RESULT: PASSED`. |
| `npm --prefix .opencode/skills/system-skill-advisor/mcp_server run typecheck` | PASS, exit 0. |
| `cd .opencode/skills/system-skill-advisor/mcp_server && npx vitest --run launcher-lease launcher-bootstrap` | PASS, exit 0. 2 files passed; 20 tests passed. |
| `cd .opencode/skills/system-code-graph/mcp_server && npx vitest --run launcher-lease` | FAIL before tests: Vite bundle loader could not write `.opencode/skills/system-code-graph/node_modules/.vite-temp/...` (`EPERM`). |
| `cd .opencode/skills/system-code-graph/mcp_server && npx vitest --run --configLoader runner launcher-lease` | PASS, exit 0. 1 file passed; 9 tests passed. |
| `cd .opencode/skills/system-spec-kit/mcp_server && npx vitest --run launcher-lease` | PASS, exit 0. 1 file passed; 8 tests passed. |
| `git add <explicit Phase 006 paths>` | FAIL, exit 128. Git cannot create `.git/index.lock` in this sandbox: `Operation not permitted`. |

**Verification Date**: 2026-05-18
<!-- /ANCHOR:summary -->
