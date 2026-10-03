---
title: "Tasks: Phase 12: skill-graph-freshness"
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
# Tasks: Phase 12: skill-graph-freshness

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
## Phase 1: Audit

- [x] T001 Inventory every path, script, command, flag and variable the route and workflow name, each with the command that showed it (scratch/reality-check.md)
- [x] T002 Read the route entry, the router table, the workflow asset, the presentation displays and the script with line-numbered reads (.skilled/commands/doctor/_routes.yaml, .skilled/commands/doctor/speckit.md, .skilled/commands/doctor/assets/doctor-skill-graph-freshness.yaml, .skilled/commands/doctor/scripts/skill-graph-freshness.cjs)
- [x] T003 [P] Run the exact route command with no arguments, twice, read-only (scratch/doctor-run.log)
- [x] T004 [P] Probe detection and degradation with real foreign databases and an absent database directory (scratch/doctor-run.log)
- [x] T005 [P] Recompute the panel's five sets with an independently written implementation over the same three sources (scratch/doctor-run.log)
- [x] T006 Confirm read-only in fact with before-and-after hashes of every source (scratch/doctor-run.log)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T007 Record the verdict `keep` with the evidence behind it (scratch/proposal.md)
- [x] T008 Record the four subsystem findings and the non-blocking observations, unfixed by decision (scratch/proposal.md)
- [x] T009 Apply the verdict by leaving the target unchanged: the route entry, the workflow asset, the script and the presentation row (no edit made)
- [x] T010 Confirm the shared batch's changes (startup menu rows 12 and 13, the route count) do not touch this target's surfaces (.skilled/commands/doctor/_routes.yaml, .skilled/commands/doctor/assets/doctor-speckit-presentation.txt)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Rerun route validation on the post-batch manifest (.skilled/commands/doctor/scripts/route-validate.sh)
- [x] T012 Run the batch gates: YAML parse over every doctor asset, the catalog mirror check, the MCP mutation-class guard and the doctor script tests
- [x] T013 Scan the edited doctor files for retired identifiers (`system_skill_advisor.`, `deep_loop_graph_status|query|convergence(`, `doctor_*`)
- [x] T014 Close the phase documentation and validate the packet (specs/system-speckit/048-doctor-command-audit/012-skill-graph-freshness)
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

- [x] CHK-001 [P0] Requirements documented in spec.md — the three P0 requirements and the one P1 requirement are written and each maps to an acceptance row
- [x] CHK-002 [P0] Technical approach defined in plan.md — the audit-then-apply plan, the affected surfaces and the `keep` consequence are recorded
- [x] CHK-003 [P1] Dependencies identified and available — the worktree, the route manifest and validator, Node.js v26.8.2 and PyYAML all resolved
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks — no code changed; `node --check` on the diagnostic script exits 0 (`scratch/doctor-run.log:102`)
- [x] CHK-011 [P0] No console errors or warnings — the panel prints clean rows; `route-validate.sh` prints only its two known informational H1 warnings
- [x] CHK-012 [P1] Error handling implemented — no code changed; the absent-database path degrades without a crash (`scratch/doctor-run.log:272`)
- [x] CHK-013 [P1] Code follows project patterns — no code changed; the panel's report format matches the sibling doctor diagnostics
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met
- [x] CHK-021 [P0] Manual testing complete — two identical read-only runs, two foreign-database probes and an absent-database probe (`scratch/doctor-run.log:107`, `:123`, `:242`, `:257`, `:272`)
- [x] CHK-022 [P1] Edge cases tested — the absent database drops the SQLite-derived sets and keeps the compiled-versus-disk sets with exit 0; the foreign databases exercise genuine three-way disagreement
- [x] CHK-023 [P1] Error scenarios validated — the absent-database error path was executed; the corrupt-database `unreadable` catch was read, not run, and is recorded in `scratch/proposal.md:132`
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class — no finding is actionable for this doctor; the four subsystem findings are recorded in `implementation-summary.md` and `scratch/proposal.md:76`
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep — `scratch/reality-check.md:25` inventories every named surface, and the retired-identifier scan of the edited doctor files returns no matches
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests — no symbol changed; the consumers of the route's declaration are the router table, the presentation displays, the manifest and the validator, and `route-validate.sh` J1/I1/K1/K2 pass
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction adversarial cases — N/A for a keep verdict; the adversarial evidence is the absent-database and foreign-database probes, which the panel survived read-only
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed — plan.md lists source state × run form, and the agreeing, foreign and absent rows were executed
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed — `SYSTEM_SKILL_ADVISOR_DB_DIR` was pointed at foreign and absent directories, and the panel degraded gracefully and stayed read-only
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range — the audit is pinned to `83616db9ba` and to the recorded outputs in `scratch/`
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets — the script's import surface is `fs`, `path` and `node:sqlite`, and it prints counts and sets only
- [x] CHK-031 [P0] Input validation implemented — the script takes no arguments; the only input is the environment override, which resolves a directory path and stays read-only
- [x] CHK-032 [P1] Auth/authz working correctly — N/A; read-only local diagnostic with no auth surface
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized — the phase docs were closed from the recorded evidence in one pass
- [x] CHK-041 [P1] Code comments adequate — no code changed; the script's comments were read during the audit and the dangling `contract:` reference is recorded as a finding
- [x] CHK-042 [P2] README updated (if applicable) — N/A for this target; the batch refreshed the shared doctor README surfaces elsewhere
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only — the audit wrote only `scratch/reality-check.md`, `scratch/doctor-run.log` and `scratch/proposal.md`
- [x] CHK-051 [P1] scratch/ cleaned before completion — the three evidence files stay as this phase's record
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
