---
title: "Tasks: Phase 8: doctor-ownership-split"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "task breakdown"
  - "implementation tasks"
  - "verification checklist"
  - "task dependencies"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 8: doctor-ownership-split

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

- [x] T001 Map each `/doctor:speckit` target to the skill its workflow touches (`_routes.yaml`, each `doctor-<target>.yaml`)
- [x] T002 Trace every leg of `/doctor:rebuild` and give each a destination (`doctor-rebuild.yaml`)
- [x] T003 Inventory the 81 live files that name a moving or deleted doctor surface
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add a `command` owner to every route, a `tune` and a `rebuild` route, and drop fable-mode and the rebuild entry (`_routes.yaml`)
- [x] T005 Make the validator command-aware: rule B3, per-command F2 and J1, H1 scoped to one command (`route-validate.py`, `route-validate.sh`, `route-validate.test.sh`)
- [x] T006 Write the three routers and presentations, and narrow the speckit router and presentation (`skill-advisor.md`, `deep-loop.md`, `runtime-mirrors.md`, `speckit.md`)
- [x] T007 Write the advisor rebuild workflow and rename the tuning workflow (`doctor-skill-advisor-rebuild.yaml`, `doctor-skill-advisor-tune.yaml`)
- [x] T008 Delete the rebuild and fable-mode files and the orphaned fable metrics module; repoint kept workflows, tests, the contract, READMEs, skill docs, the playbook and the catalog
- [x] T009 Regenerate the runtime mirrors and the Codex, Pi and Hermes prompt and skill copies
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Run the route validator, its self-test and its test suite
- [x] T011 Break a scratch copy of the doctor folder twice and confirm J1 names each break
- [x] T012 Run the doctor suite, the moved-path tests, the contract schema, the router generator, the mirror, prompt and catalog checks, and the link checker
- [x] T013 Search live files for the removed names and confirm only the moved-target notice remains
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
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
- [x] CHK-003 [P1] Dependencies identified and available: the advisor CLI lists `advisor_rebuild`, `skill_graph_scan` and `skill_graph_validate`
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks: `py_compile` and `bash -n` pass on the validator and its wrapper and test
- [x] CHK-011 [P0] No console errors or warnings: the validator's one warning is a real `--dry-run` collision inside `/doctor:skill-advisor`
- [x] CHK-012 [P1] Error handling implemented: B3 fails a route naming a missing router, the rebuild workflow restores its backup on failure
- [x] CHK-013 [P1] Code follows project patterns: each router follows the sk-create-command thin-router shape and validates with 0 issues
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met
- [x] CHK-021 [P0] Manual testing complete: J1 caught a removed router row and a renamed target in a scratch copy
- [x] CHK-022 [P1] Edge cases tested: the B3 fixture names a router that does not exist
- [x] CHK-023 [P1] Error scenarios validated: the mutation tests silence each rule, B3 included, and `--self-test` fails each time
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: the misplaced targets are `cross-consumer` (routers, docs and mirrors all name them)
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed: the 81-file search in T003
- [x] CHK-FIX-003 [P0] Consumer inventory completed: every test naming `doctor-skill-advisor.yaml`, `speckit.md` or a `skill-advisor` route was updated and rerun
- [x] CHK-FIX-004 [P0] Not applicable: no security, path, parser or redaction fix
- [x] CHK-FIX-005 [P1] Matrix axes listed: 4 routed commands by 9 routes, checked by J1 per command
- [x] CHK-FIX-006 [P1] Hostile env variant: the route tests run the validator from a temp copy with `DOCTOR_DIR`, `ASSETS_DIR` and `REPO_ROOT` overrides
- [x] CHK-FIX-007 [P1] Evidence is pinned to the phase commit
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
- [x] CHK-031 [P0] Input validation implemented: each router rejects unknown targets, flags and arguments before loading a workflow
- [x] CHK-032 [P1] The rebuild target writes only after one approval and only through the advisor CLI
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] Code comments adequate: the validator documents the per-command rules it adds
- [x] CHK-042 [P2] README updated: the commands index, the root README and both doctor script READMEs
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only: the J1 break test ran in the session scratchpad and was removed
- [x] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-04
<!-- /ANCHOR:summary -->

---



