---
title: "Tasks: Phase 2: mcp-debug-code-mode"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "mcp debug code mode tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 2: mcp-debug-code-mode

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Inventory every path, script, command, flag and environment variable named by the debug route and YAML (scratch/reality-check.md)
- [x] T002 Run the read-only health command once and keep its JSON with the exit code (scratch/doctor-run.log)
- [x] T003 Write the keep, fix or retire verdict with its evidence (scratch/proposal.md)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Rewrite the debug workflow for Code Mode only: scope, inputs, invariants, repair actions, five steps, error handling (.skilled/commands/doctor/assets/doctor-mcp-debug.yaml)
- [x] T005 Extend the doctor checks: launcher, manifest-derived Node engine, dist syntax and mtime staleness, UTCP manual name and type, credentials by name, Hermes INFO row, stale self-paths (.skilled/commands/doctor/scripts/mcp-doctor.sh)
- [x] T006 Add format-aware JSON and TOML registration parsing and prefixed credential inspection to the shared library (.skilled/commands/doctor/scripts/mcp-doctor-lib.sh)
- [x] T007 Narrow the router: description, argument hint `<install [--runtime <name>]|debug [--fix]>`, remove `--server` (.skilled/commands/doctor/mcp.md)
- [x] T008 Narrow the debug presentation rows to Code Mode and remove the invalid example (.skilled/commands/doctor/assets/doctor-mcp-presentation.txt)
- [x] T009 Update the catalog rows and the command contract for `/doctor:mcp` (.skilled/commands/README.txt, .skilled/skills/sk-doc/sk-create-command/assets/command-contract.json)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Run `bash -n` on both scripts and parse both MCP YAML assets
- [x] T011 Run the post-fix doctor and check the seven registration rows, UTCP manuals and credential names
- [x] T012 Grep both YAML assets for retired names, and validate `mcp.md` as a command
- [x] T013 Run the catalog mirror check and `route-validate.sh` from the final state
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed (post-fix doctor run, clean grep, route validation exit 0)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

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
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] Dependencies identified and available (provisioned worktree; `_routes.yaml` validator)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks (`bash -n` on both scripts: SYNTAX_OK)
- [x] CHK-011 [P0] No console errors or warnings (post-fix run exits 2 only on the three expected worktree failures; the Codex WARN is a reported limitation)
- [x] CHK-012 [P1] Error handling implemented (missing manifest, stale build, malformed manual and missing credential paths are reported by name)
- [x] CHK-013 [P1] Code follows project patterns (route validation exit 0; catalog mirror check STATUS=OK)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met (`acceptance-criteria.md`, 5 of 5 Met)
- [x] CHK-021 [P0] Manual testing complete (read-only audit run and post-fix run)
- [x] CHK-022 [P1] Edge cases tested (missing manifest, unreadable engine, missing dist, missing node_modules, absent tomllib)
- [x] CHK-023 [P1] Error scenarios validated (Codex TOML reported unvalidated, missing package.json stops build repair, invalid JSON reported)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each recorded finding has a class: the `.gitignore` rule is class-of-bug and cross-consumer; `install.sh` never building and the `magicpath` manual are instance-only; the validator shape gap is cross-consumer.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed: the two workflow assets and the one diagnostic script; the seven registration files were checked in two formats.
- [x] CHK-FIX-003 [P0] Consumer inventory completed for the router, presentation, catalog rows and command contract; catalog mirror check STATUS=OK and route validation exit 0.
- [x] CHK-FIX-004 [P0] Parser and redaction edges checked: JSON and TOML branches, a missing `tomllib` reports unvalidated instead of PASS, and credentials are emitted by name and presence only.
- [x] CHK-FIX-005 [P1] Matrix axes and row count listed: seven registration files across JSON and TOML, 14 UTCP manuals and nine credential references.
- [x] CHK-FIX-006 [P1] Process-wide state exercised: credential presence is read from the process environment and `.env`; the post-fix run listed nine missing key names and no values.
- [x] CHK-FIX-007 [P1] Evidence is pinned to the recorded pre-fix run and the uncommitted worktree diff; the commit SHA is recorded at commit time.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets (the run reports credential names only; no values)
- [x] CHK-031 [P0] Input validation implemented (JSON and TOML parse; manual name and call_template_type required)
- [x] CHK-032 [P1] Auth/authz working correctly — not applicable to a read-only diagnostic; credential values are neither requested nor written
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] Code comments adequate (changed scripts state the durable why: launcher dependency, manifest guard, credential privacy)
- [x] CHK-042 [P2] README updated (`.skilled/commands/README.txt`; catalog mirror check STATUS=OK)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only (reality-check.md, doctor-run.log, proposal.md)
- [x] CHK-051 [P1] scratch/ cleaned before completion (the three evidence files stay as the audit trail)
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-02
<!-- /ANCHOR:summary -->

---



