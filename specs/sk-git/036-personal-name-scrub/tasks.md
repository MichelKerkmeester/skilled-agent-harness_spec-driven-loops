---
title: "Tasks: Remove the operator's personal account name from tracked files outside specs and rename the orphan-sweep launch agent"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "personal name scrub tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Remove the operator's personal account name from tracked files outside specs and rename the orphan-sweep launch agent

<!-- SPECKIT_LEVEL: 1 -->

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

`$(id -un)` stands for the operator's personal account name in every command below. `LA` is `.skilled/scripts/launchagents/`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
<!-- FILL: Replace the sample tasks with the real setup steps. Each task names a file and a verify command. GOOD: T001 Confirm `logs/archive/` holds 10 archives. Verify: `ls logs/archive | wc -l` prints 10. WEAK: T001 Set up the project. -->

- [x] T001 Count the affected tracked files outside `specs/` (`git grep`). Verify: `git grep -il "$(id -un)" HEAD -- ":!specs/" | wc -l` prints 512.
- [x] T002 Record the routing baseline (`.skilled/skills/sk-doc/sk-create-skill/scripts/leaf-route-replay.cjs`). Verify: `node leaf-route-replay.cjs | grep ^total` prints `total gold=65 scored=57 tied=3 mean_f1=0.9176 exact=50`.
- [x] T003 [P] Record the gate baselines (`.skilled/bin/compiled-route-guard.cjs`). Verify: the guard prints `All hubs fresh or excused`, the Hermes check prints `PASS: 65 Hermes skill copies in sync`, the link checker prints `0 broken` and `package_skill.py --check --strict` prints `Result: PASS` on all 23 touched skill roots.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
<!-- FILL: Write one implementation task per file change. Add a `Verify:` line with the command and its expected output. GOOD: T002 Add the `--keep <n>` branch. Verify: `--keep 3` leaves 3 archives. WEAK: T002 Implement the feature. -->

- [x] T004 Rename the launch agent template with `git mv` (`LA/com.skilled.orphan-sweep.plist`). Verify: `git status --short` shows the rename to `com.skilled.orphan-sweep.plist`.
- [x] T005 Rewrite the path forms in every tracked text file outside `specs/` (499 files). Verify: the rewrite reports 2 file URLs, 1,062 repository subpaths, 16 bare repository roots, 2 worktree paths, 24 home paths, 29 bare account tokens and 8 old labels, and every changed JSON and JSONL file parses.
- [x] T006 Hand-edit the four bare repository-root mentions that read wrong as `.` (`skill-advisor-hook-validation.md` and three playbooks). Verify: `rg -n 'cd \.$|REPO_ROOT=.\.|transcript from .\.' .skilled/skills` prints nothing.
- [x] T007 Derive the Claude Code project folder name from the repository root (`migrate-trigger-phrase-residual.ts`). Verify: the derived value for the main checkout equals the old literal, and `rg -c "$(id -un)"` on the file finds no match (exit 1).
- [x] T008 Make the recorded leak check expand its home path (`leak-check.py`). Verify: `python3 -m py_compile leak-check.py` exits 0.
- [x] T009 Replace the template's label and absolute paths with placeholders (`LA/com.skilled.orphan-sweep.plist`). Verify: `plutil -lint` prints OK, and the documented `sed` copy lints OK with no `/absolute/path` left.
- [x] T010 Document the new label, the placeholder install and the upgrade step (`LA/README.md`). Verify: `rg -c "$(id -un)" LA/README.md` prints 1, the upgrade sentence.
- [x] T011 Rewrite the two absolute `spec_folder` values and vacuum the database (`council-graph.sqlite`). Verify: `grep -c -a "$(id -un)"` prints 0, `pragma integrity_check` prints ok and the row counts stay 17 and 11.
- [x] T012 Add the framework changelog entry (`.skilled/changelog/skilled/v4.0.1.1.md`). Verify: `validate_document.py` prints `Total issues: 0` and `hvr_scan.py` prints `hard blockers: 0`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
<!-- FILL: Write one verification task per requirement. Each one runs a command. GOOD: T003 Run both invocations. Verify: `ls logs/archive | wc -l` prints 3 and 10. WEAK: T003 Test everything. -->

- [x] T013 Rescan for residue (`git grep`). Verify: `git grep -il "$(id -un)" -- ":!specs/" | wc -l` prints 10, all kept addresses or the upgrade sentence, and `git ls-files | grep -v '^specs/' | grep -ic "$(id -un)"` prints 0.
- [x] T014 Run the tests for the changed code (`memory-quality-phase6-migration.vitest.ts`). Verify: vitest prints `Tests 1 passed (1)` and `tsc --noEmit` on the cli project exits 0.
- [x] T015 Run the test that reads the rewritten database (`council-graph-script.vitest.ts`). Verify: vitest prints `Tests 10 passed (10)`.
- [x] T016 Rerun the routing replay and the gates (`leaf-route-replay.cjs`). Verify: every Phase 1 reading is unchanged, and each touched leaf manifest `--check` prints `leaf-manifest.json OK`.
- [x] T017 Validate every changed markdown doc (`validate_document.py`). Verify: 243 docs ran and 4 report issues, all of them the same at HEAD.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
<!-- FILL: Keep the three completion lines and add the one artifact that proves the phase is done. GOOD: `--keep 3` leaves 3 archives and the suite passes. WEAK: Work is complete. -->

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: the residue scan lists only the files `spec.md` keeps
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
<!-- FILL: Name the spec and plan files. Add the decision record when the packet has one. GOOD: Specification: `spec.md`. Plan: `plan.md`. WEAK: See the other docs. -->

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---



