---
title: "Tasks: Phase 7: web-only-frontend"
description: "Remove the React Native layer from canonical sk-code, republish the compiled routes and rerun every routing gate."
trigger_phrases:
  - "web only frontend tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 7: web-only-frontend

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation
<!-- FILL: Keep the prefix table and add the two shell variables this task list uses. GOOD: `R` is `scripts/rotate-logs.sh`. `A` is `logs/archive/`. WEAK: Variables are defined below. -->

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Record the reversal and supersede phase 001's ADR-001 (`decision-record.md`, `../001-frontend-surface-mode/decision-record.md`). Verify: `rg -n "Superseded" ../001-frontend-surface-mode/decision-record.md` hits. Evidence: line 41 reads Superseded.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Delete the six native references and `frontend-native.md`, and rewrite the frontend packet web-only (`sk-code-frontend/`). Verify: `ls sk-code-frontend/references | grep -c native` prints 0. Evidence: 0; the packet holds the core, the web layer, six web topic files, the Figma check and the workflow links.
- [x] T003 Remove the native intents, resource rows and aliases from the hub (`sk-code/ROUTER.md`, `hub-router.json`, `mode-registry.json`, `graph-metadata.json`). Verify: `rg -n "NATIVE_" .skilled/skills/sk-code` prints nothing. Evidence: the one hit is the unrelated `NATIVE_DIST_MISSING` advisor banner.
- [x] T004 Restore React Native to the unsupported lists and rewrite the surface descriptions web-only (hub docs, root README, skills catalog, review README, quality floor). Verify: `rg -n -i "react native" .skilled/skills/sk-code` prints only the unsupported and fork lines. Evidence: the router ownership and DO NOT lines, the quality floor UNKNOWN row and the unknown-fallback scenario, plus old benchmark reports.
- [x] T005 Move the frontend gold scenario to a web prompt (`surface-alone-frontend-compiled-routing.md`). Verify: `validate-compiled-routing-scenarios.cjs --strict` passes. Evidence: pass=9 fail=0; the prompt is "fix the keyboard focus order in this web form".
- [x] T006 Republish the compiled routes, prune orphaned advisor signals and recompile the skill graph. Verify: hub status `compiled-serving` and `fresh`, signal check 0 orphans. Evidence: 9 orphans pruned, then 0; all seven hubs `compiled-serving` and `fresh`; leaf manifest OK.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Run the compiled-route, sk-create-skill and playbook gates (`scratch/final-suites.txt`). Verify: every suite reports `fail 0`. Evidence: 101/101 compiled-route, 103/103 sk-create-skill, both playbooks PASS.
- [x] T008 Run reach on every hub at concurrency 2 (`scratch/reach-final.txt`). Verify: every hub prints `outranked=  0` and `wrong-hub=  0`. Evidence: seven hubs, `RESULT: PASSED`; sk-code declared 92, down from 101.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
<!-- FILL: Keep the three completion lines and add the one artifact that proves the phase is done. GOOD: `--keep 3` leaves 3 archives and the suite passes. WEAK: Work is complete. -->

- [x] All tasks marked `[x]`
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
- [x] CHK-003 [P1] The opencode-go DeepSeek route answers. Evidence: three builds through `opencode run`.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality
<!-- FILL: Write one check per file rule. A command must answer it. GOOD: CHK-010 [P0] `bash -n scripts/rotate-logs.sh` exits 0. WEAK: Code is clean. -->

- [x] CHK-010 [P0] Every edited JSON file parses. Evidence: hub-router, mode-registry and description parse.
- [x] CHK-011 [P0] No broken link to a deleted native file. Evidence: no file outside `specs/` names a deleted native file.
- [x] CHK-012 [P1] Web intents and their resources are unchanged. Evidence: the packet router keeps its eight web and Figma intents.
- [x] CHK-013 [P1] No text names a spec folder, phase or finding id. Evidence: each brief banned it; the diffs were read.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist
<!-- FILL: Write one check per acceptance criterion. GOOD: CHK-020 [P0] `--keep 3` leaves 3 archives. WEAK: Tests pass. -->

- [x] CHK-020 [P0] All acceptance criteria met
- [x] CHK-021 [P0] A web prompt routes to `sk-code-frontend` and a React Native prompt does not. Evidence: the web prompt routes to `sk-code-frontend`, the FlatList prompt defers.
- [x] CHK-022 [P1] A prompt with web and React Native terms routes on its web terms. Evidence: a markup plus React Native prompt routes review plus frontend on its web terms.
- [x] CHK-023 [P1] The signal check reports 0 orphans after the prune. Evidence: `--check` 0 orphans.
<!-- /ANCHOR:testing -->

---
---

<!-- ANCHOR:security -->
## Security
<!-- FILL: Write one check per security surface. Write `N/A` with a reason when none applies. GOOD: CHK-030 [P0] `scripts/rotate-logs.sh` reads no credential. WEAK: Security is fine. -->

- [x] CHK-030 [P0] No credential path is read or written
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation
<!-- FILL: Write one check per document that must agree. GOOD: CHK-040 [P1] `spec.md` and `tasks.md` both name `--keep <n>`. WEAK: Docs are updated. -->

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] The frontend and sk-code changelogs record the removal. Evidence: the unreleased frontend v1.0.0.0, v1.0.1.0 and hub v3.10.0.0 entries describe web only.
- [x] CHK-042 [P1] The parent re-pin section says the fork keeps its native surfaces. Evidence: the parent re-pin row keeps every React Native file Barter-owned.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization
<!-- FILL: Write one check per file location rule. GOOD: CHK-050 [P1] Test copies live under `scratch/test/`. WEAK: Files are organized. -->

- [x] CHK-050 [P1] Temp files in scratch/ only
- [x] CHK-051 [P1] Task-created temporary output is removed before completion. Evidence: no temporary file was created outside `scratch/`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary
<!-- FILL: Count the boxes by priority and write the three totals. GOOD: P0 12, P1 13, P2 1. WEAK: Most items done. -->

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 7 | 7/7 |
| P1 Items | 10 | 10/10 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-11-03
<!-- /ANCHOR:summary -->

---



