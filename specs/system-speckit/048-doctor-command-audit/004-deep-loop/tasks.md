---
title: "Tasks: Phase 4: deep-loop"
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
# Tasks: Phase 4: deep-loop

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

- [x] T001 Confirm the worktree and the bound packet scratch directory, then read the router, route entry, workflow and presentation in full (`scratch/reality-check.md`). Evidence: line-numbered reads of `speckit.md`, `_routes.yaml:49-59`, all 265 lines of `doctor-deep-loop.yaml` and `doctor-speckit-presentation.txt`; every inventory row carries its source line.
- [x] T002 Probe every named path, script, command, flag, database and environment variable (`scratch/reality-check.md`). Evidence: `status.cjs`, `query.cjs` and `convergence.cjs` present; the callable `deep_loop_graph_*` names marked moved to direct CLI entrypoints; no read-only flag; `validate_targets` missing as an executable; `gold_battery.minimum_iterations` absent; coverage database missing and council database present; no environment variable declared.
- [x] T003 [P] Run the safe probes and keep one run log (`scratch/doctor-run.log`). Evidence: `status.cjs`, `query.cjs` and `convergence.cjs` each exit 3 with `INPUT_VALIDATION` on an invalid loop type, stopping before any database open; the council replay helper exits 1 under `--dry-run` on a missing state file; the `find`, `ls`, `stat`, `sqlite3 -readonly` and `route-validate.sh` receipts are recorded; three `NOT RUN` entries explain the skipped normal calls and interactive report phase.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Write the verdict and the minimal edits (`scratch/proposal.md`). Evidence: `Verdict: fix`, with seven proposed edits and three findings; the route lists live scripts and passes its own validator, while the workflow still invokes retired tool names.
- [x] T005 Correct `.skilled/commands/doctor/assets/doctor-deep-loop.yaml`. Evidence: retired tool names replaced by `status.cjs`/`query.cjs`/`convergence.cjs` calls; `upstream_assets` points at the runtime script interface; the `validate_targets` helper name removed; the state-log path and command corrected; the mutation policy and enforcement reworded to name the packet-local state log and the scripts' documented side effects; the forbidden `doctor-*.yaml` glob fixed.
- [x] T006 Correct the deep-loop entry and presentation text (`.skilled/commands/doctor/_routes.yaml`, `.skilled/commands/doctor/assets/doctor-speckit-presentation.txt`). Evidence: gate location now `<active-spec-folder>/scratch/doctor-deep-loop-state.<timestamp>.json`; query gains `--limit 50`; convergence gains `--iteration` and `--persist-snapshot false`; the menu, symptom help and manifest row include the council graph; the Deep-Loop Scope prompt was added.
- [x] T007 Record the scope decision and the findings. Evidence: proposal edit 1 (a `--read-only` flag on the runtime scripts and database adapters) was not applied by orchestrator override because it changes the inspected subsystem; the runtime's database initialization and observability appends, the absent coverage database and the unverified valid read-only path are recorded in `implementation-summary.md` and the goal log.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Re-run the route validator. Evidence: `bash .skilled/commands/doctor/scripts/route-validate.sh` → exit 0, `OK: route-validate — 9 routes validated, 2 warnings`; `I1` and `J1` PASS, and the two warnings are informational flag collisions.
- [x] T009 Re-run the shared doctor gates. Evidence: `python3 yaml.safe_load` → `YAML_OK`; command catalog mirror → `STATUS=OK`, exit 0; mutation-class guard → `GUARD PASS`, exit 0; `skill-advisor-route-contract.test.cjs` passes; the three `parent-skill-check-*.test.cjs` files fail exactly as the pre-batch baseline because their fixtures cannot load `@spec-kit/shared/frontmatter/parse-frontmatter.js` in this worktree.
- [x] T010 Confirm the retired callable names are gone from the edited files. Evidence: `rg -n 'deep_loop_graph_status\(|deep_loop_graph_query\(|deep_loop_graph_convergence\(' .skilled/commands/doctor` matches only `doctor-update.yaml`, outside this target; `deep_loop_graph_upsert` remains only as the forbidden legacy name in the deep-loop workflow's invariant, validator step and halt conditions.
- [x] T011 Record the verdict, decisions and findings, then close the packet docs. Evidence: `implementation-summary.md` opens with `Verdict: fix.`, lists the three changed files and the recorded limitations; `acceptance-criteria.md` shows 4 of 4 `Met`; `spec.md` status is Complete; the goal log carries the progress rows, the override and the findings.
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

- [x] CHK-001 [P0] Requirements documented in spec.md — the four requirements and two success criteria are written, and each maps to an acceptance row
- [x] CHK-002 [P0] Technical approach defined in plan.md — the audit-then-apply plan, the affected surfaces and the testing strategy
- [x] CHK-003 [P1] Dependencies identified and available — the worktree and the route validator exist; the read-only flag and the coverage database are absent, both recorded as findings rather than treated as blockers
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks — `python3 yaml.safe_load` → `YAML_OK` for the edited workflow and route manifest, and `route-validate.sh` passes every check
- [x] CHK-011 [P0] No console errors or warnings — the route validator reports only two informational flag-collision warnings; the script probes emit one structured `INPUT_VALIDATION` object on stdout and nothing on stderr
- [x] CHK-012 [P1] Error handling implemented — a missing database is reported by name rather than masked, and the workflow now states the scripts' real initialization and observability writes instead of claiming read-only behavior they do not have
- [x] CHK-013 [P1] Code follows project patterns — the workflow keeps its phase, gate, output-contract and halt-condition shape, and the route manifest keeps its schema; no ephemeral ids were added to code comments
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met — every row in `acceptance-criteria.md` is `Met`
- [x] CHK-021 [P0] Manual testing complete — the route, presentation-parity, catalog, guard and script-test gates were all re-run after the change
- [x] CHK-022 [P1] Edge cases tested — the missing coverage database, the present council database and the empty packet source folders are in the inventory; the absent read-only flag is reported as a finding
- [x] CHK-023 [P1] Error scenarios validated — the invalid-loop-type probes return `INPUT_VALIDATION` before any database open, and the council replay returns a missing-state-file error under `--dry-run`
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. — the contract drift is `cross-consumer` (workflow, route entry and presentation); the runtime defects are `instance-only` findings recorded and not fixed here
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. — the retired-name scan over the edited files returns no callable matches, and `scratch/reality-check.md` inventories every named producer
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests. — the route manifest, workflow and presentation were updated in one pass; `route-validate.sh` `I1` and `J1` confirm the consumers agree
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases. — N/A: no security, parser or redaction fix; the one path change is the state-log path under the packet scratch, and `route-validate.sh` `K1/K2` confirms no read-only route declares a write
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. — the affected-surfaces section lists graph scope × artifact state × check class, and the post-change gates cover each edited artifact
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. — the route validator ran against the worktree's actual route set (9 routes after the embeddings retirement), so the shared-manifest state was exercised rather than assumed
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range. — the tree is uncommitted by instruction; evidence is pinned to the working-tree diff of the three deep-loop files plus the shared batch diff for `_routes.yaml` and the presentation
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets — the run log and inventory carry no secret value; the audit read only file contents, paths and statuses
- [x] CHK-031 [P0] Input validation implemented — the scripts reject an invalid loop type with `INPUT_VALIDATION`, and `route-validate.sh` validates the route manifest schema, flags and script resolution
- [x] CHK-032 [P1] Auth/authz working correctly — N/A; the command has no auth or authz surface
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized — `spec.md` status Complete, every task ticked, and `acceptance-criteria.md` all `Met`
- [x] CHK-041 [P1] Code comments adequate — the workflow comments describe the invariant, boundaries and halt conditions; no ephemeral spec or packet ids were added
- [x] CHK-042 [P2] README updated (if applicable) — N/A for this target; the phase changed no README, and the shared doctor README rows were handled by the batch's other targets
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only — the three audit artifacts and `.gitkeep` live in `scratch/`; no other temp files were created
- [x] CHK-051 [P1] scratch/ cleaned before completion — the three audit artifacts are kept as this phase's evidence, not deleted
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
