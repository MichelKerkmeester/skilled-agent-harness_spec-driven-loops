---
title: "Tasks: Phase 8: drift after closure"
description: "Measure both gates and run every phase check first; then fix the three loader paths, retire one signal, record two findings with owners, and reconcile phase 007 and the parent."
trigger_phrases:
  - "drift after closure tasks"
  - "gate rerun tasks"
  - "loader path tasks"
  - "reconcile parent packet"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 8: drift after closure

<!-- SPECKIT_LEVEL: 3 -->

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

- [x] T001 Confirm the daemon is live and note the generation (`advisor_status`: live, generation 593 at start, 597 at the end)
- [x] T002 [P] Re-run Gate B: 180 prompts through `advisor_recommend`, top skill and compiled target per row (`research/gate-b-rerun-2026-09-05.tsv`, 180 rows, 0 errors)
- [x] T003 [P] Re-run Gate A: 388 signals through `advisor_recommend`, classified by the phase 002 rules, recorded bucket kept beside the new one (`research/gate-a-rerun-2026-09-05.tsv`, 388 rows)
- [x] T004 [P] Run every check the phases added: voice-scanner checks, doctor hub check on all five hubs, compiled-route guard, three skill-root gates, the advisor routing suites, the spec-kit CLI tests the phases touched (`ALL PASS`, `OK` on five hubs, `All hubs fresh`, `14 of 14` three times, `6 passed | 1 failed` in the advisor suites, `56 passed | 1 failed` in the CLI tests)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Reproduce the scaffold failure in scratch: `create.sh --level 3 --with-lazy-addons` writes `description.json`, `graph-metadata.json`, `scratch/` and nothing else, and prints template text where the file tree should be (scratch run, 2026-09-05)
- [x] T006 Name the mechanism: the wrapper resolves `SKILL_ROOT` one directory up from itself, which after `b4c2484696` is `runtime/cli`, a directory with no `node_modules`; the loader test fails and the inline fallback prints the last template to stdout, ignoring `--out-dir` (`inline-gate-renderer.sh:10`, loader present only at the skill root)
- [x] T007 Fix the three loader spellings that were one level short (`runtime/cli/templates/inline-gate-renderer.sh:10`, `runtime/cli/spec/create.sh:1678`, `runtime/cli/spec/validate.sh:28`; the identical edit landed concurrently in `743e626543`, so no diff remains in this tree)
- [x] T008 Retire `spec kit runtime` from the CLI hub's two intent-signal lists, mint, and read the guard (`cli-external-orchestration/graph-metadata.json`, mint `already-exists`, guard `All hubs fresh or excused`)
- [x] T009 Record the parity-pin movement under both regimes rather than re-pinning (`decision-record.md` ADR-002: 113/108/5 and 114/108/6 on consecutive local runs, 114/107/7 with the database directory pointed at an empty folder)
- [x] T010 Record the `trigger_phrases` loss with the evidence and an owner (`decision-record.md` ADR-003)
- [x] T011 [P] Repoint phase 007's six continuity key files under `runtime/cli/` (`../007-spec-kit-residue/implementation-summary.md`, all six paths exist on disk)
- [x] T012 [P] Fill phase 007's template sections from its own record (`../007-spec-kit-residue/spec.md` §4 to §6, §10, §11)
- [x] T013 [P] Reconcile the parent: template sections filled, phase map statuses, goal criteria and continuity, roadmap against 049 Complete (`../spec.md`, `../goal.md`, `../roadmap.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T014 Scaffold suite from the final tree (`scaffold-golden-snapshots.vitest.ts`: 9 passed, where the pre-fix run had 1 failed on `before-after.md`)
- [x] T015 Scratch scaffold with add-ons renders the full set (11 documents: spec, plan, tasks, acceptance-criteria, implementation-summary, decision-record, before-after, timeline, roadmap, description.json, graph-metadata.json)
- [x] T016 Live replay after the retirement (`spec kit runtime` gives `system-spec-kit` 0.93 then the CLI hub 0.467; `delegate to opencode for code generation` still gives the CLI hub at 0.811 with target `cli-opencode`)
- [x] T017 Hub gates after the retirement (doctor check on the CLI hub `OK`, guard fresh, derived freshness `14 fresh`)
- [x] T018 Regenerate the generated metadata for every edited folder and run the strict recursive validation on the parent (`RESULT: PASSED` on all nine folders)
- [x] T019 Placeholder checker on the parent, phase 007, and this phase (zero patterns on each)
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
- [x] CHK-003 [P1] Dependencies identified and available
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks (three path literals; `bash -n` clean on all three files, and each script ran to completion afterwards)
- [x] CHK-011 [P0] No console errors or warnings (the scaffold's only remaining warning is the backfill skip outside a specs root, which is the guard working)
- [x] CHK-012 [P1] Error handling implemented (unchanged; the wrapper still falls back when no loader exists anywhere)
- [x] CHK-013 [P1] Code follows project patterns (the three-level root is the spelling `template-utils.sh` already used)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met
- [x] CHK-021 [P0] Manual testing complete (scratch scaffold, live replays)
- [x] CHK-022 [P1] Edge cases tested (Level 3 with and without add-ons through the suite; a packet outside a specs root through the scratch run)
- [x] CHK-023 [P1] Error scenarios validated (the pre-fix failure reproduced before the edit, and the same test proves the fix)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: the loader paths are `class-of-bug` (three spellings, one cause), the signal retirement is `instance-only`, the parity pin and the dead signal are `matrix/evidence`
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed: one grep over `runtime/` found six loader spellings; three fixed, two absolute, one already correct
- [x] CHK-FIX-003 [P0] Consumer inventory completed: the edits change path literals only; `create.sh` and `validate.sh` are the two consumers of the loader and both were fixed in the same pass
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests: not applicable, the write-inside-target guard is untouched and the suite's temp-root case exercises it
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed (`plan.md` affected surfaces: level by add-ons)
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed: the parity suite was run with `SYSTEM_SKILL_ADVISOR_DB_DIR` pointed at an empty directory, which is the CI regime
- [x] CHK-FIX-007 [P1] Evidence is pinned: the nesting commit is `b4c2484696`, the parity pin commit is `35721a4db7`, the Gate A recording is the 2026-09-04 artifact in phase 002
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
- [x] CHK-031 [P0] Input validation implemented (unchanged guards)
- [x] CHK-032 [P1] Auth/authz working correctly (not applicable)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] Code comments adequate (no comment added; each edit is a path literal whose reason is the directory layout)
- [x] CHK-042 [P2] README updated (not applicable)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only (the runners and their JSON stayed in the session scratchpad outside the repository)
- [x] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 14 | 14/14 |
| P1 Items | 15 | 15/15 |
| P2 Items | 8 | 8/8 |

**Verification Date**: 2026-09-05
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: Architecture Verification

- [x] CHK-100 [P0] Architecture decisions documented in decision-record.md
- [x] CHK-101 [P1] All ADRs have status (Proposed/Accepted)
- [x] CHK-102 [P1] Alternatives documented with rejection rationale
- [x] CHK-103 [P2] Migration path documented (not applicable)
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: Performance Verification

- [x] CHK-110 [P1] Response time targets met (NFR-P01: each sweep completed inside one generation window)
- [x] CHK-111 [P1] Throughput targets met (not applicable beyond NFR-P01)
- [x] CHK-112 [P2] Load testing completed (not applicable)
- [x] CHK-113 [P2] Performance benchmarks documented (not applicable)
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: Deployment Readiness

- [x] CHK-120 [P0] Rollback procedure documented and tested (`plan.md` §7; a `git checkout` of four files)
- [x] CHK-121 [P0] Feature flag configured (not applicable)
- [x] CHK-122 [P1] Monitoring/alerting configured (the scaffold suite and the route guard are the alerts)
- [x] CHK-123 [P1] Runbook created (`plan.md` enhanced rollback)
- [x] CHK-124 [P2] Deployment runbook reviewed
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: Compliance Verification

- [x] CHK-130 [P1] Security review completed (path literals only)
- [x] CHK-131 [P1] Dependency licenses compatible (no dependency added)
- [x] CHK-132 [P2] OWASP Top 10 checklist completed (not applicable)
- [x] CHK-133 [P2] Data handling compliant with requirements (no data written outside the packet tree)
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification

- [x] CHK-140 [P1] All spec documents synchronized
- [x] CHK-141 [P1] API documentation complete (not applicable)
- [x] CHK-142 [P2] User-facing documentation updated (not applicable)
- [x] CHK-143 [P2] Knowledge transfer documented (`implementation-summary.md`)
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Operator | Technical Lead | [x] Approved on the measured evidence | 2026-09-05 |
| Operator | Product Owner | [x] Approved | 2026-09-05 |
| Operator | QA Lead | [x] Approved | 2026-09-05 |
<!-- /ANCHOR:sign-off -->
