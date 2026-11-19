---
title: "Tasks: Phase 19: ollama-lane-honest-and-closeout"
description: "Flake reruns and the orphan map first, then six Luna leaves behind failing tests, the ablation and its outcome, then every suite, the orphan writes and the merge."
trigger_phrases:
  - "ollama lane honest and closeout tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 19: ollama-lane-honest-and-closeout

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

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

`R` is `.skilled/skills/system-skill-advisor/runtime`. `L` is `.skilled/bin/system-skill-advisor-launcher.cjs`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
<!-- FILL: Replace the sample tasks with the real setup steps. Each task names a file and a verify command. GOOD: T001 Confirm `logs/archive/` holds 10 archives. Verify: `ls logs/archive | wc -l` prints 10. WEAK: T001 Set up the project. -->

- [x] T001 Rerun the Python suite 10 times and the runtime suite 4 times on quiet main (`R`). Verify: `implementation-summary.md` records every run's count and any failing test name. Evidence: Python 122/0 on all 10 runs; runtime 2537 passed 8 skipped on runs 1-3 and 2539/6 on run 4, no failure.
- [x] T002 Map each orphan session to its packet and mark live or ended (`.skilled/skills/.state/decision-capture/`). Verify: the map lists every session from `--scan-orphans`. Evidence: Agent map covered every scanned session; 58 inferred mappings rechecked by a second agent.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
<!-- FILL: Write one implementation task per file change. Add a `Verify:` line with the command and its expected output. GOOD: T002 Add the `--keep <n>` branch. Verify: `--keep 3` leaves 3 archives. WEAK: T002 Implement the feature. -->

- [x] T003 Keep vectors through an outage and add the lane-live refresh helper (`R/lib/skill-graph/skill-graph-db.ts`). Verify: the new and outage tests fail before and pass after. Evidence: Refresh, coverage and outage tests failed on the reverted source and passed after.
- [x] T004 Daemon refresh after startup and watcher reindex, heartbeat first at startup (`R/advisor-server.ts`, `R/lib/daemon`). Verify: a live daemon with the lane on reaches full coverage. Evidence: Isolated daemon at weight 0 went from 0/14 and 0/47 to 14/14 and 47/47 within 5 s; watcher refreshed a changed description within 5 s.
- [x] T005 Full-coverage gate (`R/lib/scorer/lanes/semantic-shadow.ts`). Verify: the new cosine test fails before and passes after. Evidence: Cosine gate test failed before, passed after.
- [x] T006 Outage marks the lane degraded (`R/handlers/advisor-recommend.ts`). Verify: the new handler test fails before and passes after. Evidence: `semantic-outage-degraded.vitest.ts` failed before, passed after.
- [x] T007 `OLLAMA_*` forwarding, database directory pin and startup grace (`L`). Verify: the new bin tests fail before and pass after. Evidence: Bin suite 86 to 94 passed; the new watchdog and child-env tests failed before.
- [x] T008 Harness scores the full arm at 0.05 and counts none-gold fires (`R/tests/scorer/semantic-shadow-ablation.vitest.ts`). Verify: `rg -n CANDIDATE_SEMANTIC_WEIGHT` prints lines. Evidence: `rg -n CANDIDATE_SEMANTIC_WEIGHT` prints the constant and its use.
- [x] T009 Run the ablation twice with a local `ollama serve` and apply the outcome. Verify: both runs print the same summary and flips, and the default weight matches the pass bar. Evidence: Runs 3 and 4: 156 vs 161, 7 flips, no new none-gold fire, identical lists; weight stays 0 and the test asserts it.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
<!-- FILL: Write one verification task per requirement. Each one runs a command. GOOD: T003 Run both invocations. Verify: `ls logs/archive | wc -l` prints 3 and 10. WEAK: T003 Test everything. -->

- [x] T010 Rerun every baseline suite on the final tree. Verify: each passes, with deltas named. Evidence: Runtime 2553/6 skipped (baseline 2537/8), Python 122/0, bin 94 (86), spec-kit 202/2, DSH 18/0.
- [x] T011 Write each ended session's pending answers into its packet. Verify: `match-decision-table --scan-orphans` lists only live or skipped sessions. Evidence: Scan lists only the running session, this session and 2 held answers.
- [x] T012 Docs, `SKILL.md` and changelogs. Verify: the docs state the shipped weight and the new behavior. Evidence: 22 doc files, ENV-REFERENCE, SKILL.md 1.3.0.0 and both changelogs state weight 0 and the background refresh.
- [ ] T014 Commit the change and one commit per spec track, then run `/local-skilled-alignment` over the branch and `/local-doc-alignment` over a new advisor topic (`evidence/`). Verify: both `report.md` files exist.
- [ ] T015 Fix or accept each alignment finding, test first for a code fix. Verify: `implementation-summary.md` names every finding id with its outcome.
- [ ] T016 Stop only the `ollama serve` this phase started and rerun the suites. Verify: port 11434 refuses and each suite matches its no-Ollama baseline.
- [ ] T013 Merge to main, push, restart the daemon and check the status block. Verify: `includeSemanticHealth` shows the decided lane state.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
<!-- FILL: Keep the three completion lines and add the one artifact that proves the phase is done. GOOD: `--keep 3` leaves 3 archives and the suite passes. WEAK: Work is complete. -->

- [ ] All tasks marked `[x]` (T013 to T016 wait on finalization)
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
<!-- FILL: Name the spec and plan files. Add the decision record when the packet has one. GOOD: Specification: `spec.md`. Plan: `plan.md`. WEAK: See the other docs. -->

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist
<!-- FILL: Fill each checklist section below. GOOD: Each CHK line names the command that answers it. WEAK: The checklist is done. -->

<!-- ANCHOR:protocol -->
## Verification Protocol
<!-- FILL: Keep the three rows and add the rule this packet uses for a blocked task. GOOD: P0 blocks close. P1 needs a recorded reason. WEAK: Follow the priorities. -->

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
<!-- FILL: Write one check per setup fact, each with a command. GOOD: CHK-001 [P0] The start commit is in `goal.md` section 4. WEAK: Setup is ready. -->

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] Dependencies identified and available
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality
<!-- FILL: Write one check per file rule. A command must answer it. GOOD: CHK-010 [P0] `bash -n scripts/rotate-logs.sh` exits 0. WEAK: Code is clean. -->

- [x] CHK-010 [P0] Code passes lint/format checks Evidence: `npm run build` exits 0 with no TS errors.
- [x] CHK-011 [P0] No console errors or warnings Evidence: No new warnings in the suite logs.
- [x] CHK-012 [P1] Error handling implemented Evidence: Refresh failures keep vectors and log; probe failure returns a warning.
- [x] CHK-013 [P1] Code follows project patterns Evidence: Follows the existing refresh and handler patterns.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist
<!-- FILL: Write one check per acceptance criterion. GOOD: CHK-020 [P0] `--keep 3` leaves 3 archives. WEAK: Tests pass. -->

- [x] CHK-020 [P0] All acceptance criteria met Evidence: Every AC row is Met except AC-011 and AC-013, which wait on finalization.
- [x] CHK-021 [P0] Manual testing complete Evidence: Live isolated daemon and watcher checks recorded in implementation-summary.md.
- [x] CHK-022 [P1] Edge cases tested Evidence: Opt-out env, complete coverage and an empty description are tested.
- [x] CHK-023 [P1] Error scenarios validated Evidence: Outage keeps vectors; prompt-embed failure degrades the lane.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS
<!-- FILL: Write this section when the packet fixes a reported finding. Delete it otherwise. GOOD: CHK-FIX-001 [P0] Every finding names one class. WEAK: All findings handled. -->

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. Evidence: Vector deletion on failure is `class-of-bug`.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. Evidence: All four failure-path deletes removed; the two intended deletes remain.
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests. Evidence: Status, gate, doctor and docs consumers updated.
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases. Evidence: N/A: no path, parser or redaction change.
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. Evidence: Ablation axes: two seedings by two weights, two runs each.
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. Evidence: Opt-out env and DB_DIR env tested.
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range. Evidence: Evidence is pinned to the worktree diff on base `f2f03c90fb6`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security
<!-- FILL: Write one check per security surface. Write `N/A` with a reason when none applies. GOOD: CHK-030 [P0] `scripts/rotate-logs.sh` reads no credential. WEAK: Security is fine. -->

- [x] CHK-030 [P0] No hardcoded secrets Evidence: No secrets added.
- [x] CHK-031 [P0] Input validation implemented Evidence: Env opt-out compares to `off` only; status schema stays strict.
- [x] CHK-032 [P1] Auth/authz working correctly Evidence: N/A: no auth surface.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation
<!-- FILL: Write one check per document that must agree. GOOD: CHK-040 [P1] `spec.md` and `tasks.md` both name `--keep <n>`. WEAK: Docs are updated. -->

- [x] CHK-040 [P1] Spec/plan/tasks synchronized Evidence: Spec, plan and tasks carry the scope amendment.
- [x] CHK-041 [P1] Code comments adequate Evidence: Comments state the durable why, with no ids.
- [x] CHK-042 [P2] README updated (if applicable) Evidence: README and INSTALL-GUIDE updated.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization
<!-- FILL: Write one check per file location rule. GOOD: CHK-050 [P1] Test copies live under `scratch/test/`. WEAK: Files are organized. -->

- [x] CHK-050 [P1] Temp files in scratch/ only Evidence: Temp files stayed in the session scratchpad.
- [x] CHK-051 [P1] scratch/ cleaned before completion Evidence: `scratch/` holds only the scaffold placeholder.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary
<!-- FILL: Count the boxes by priority and write the three totals. GOOD: P0 12, P1 13, P2 1. WEAK: Most items done. -->

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-19
<!-- /ANCHOR:summary -->

---

