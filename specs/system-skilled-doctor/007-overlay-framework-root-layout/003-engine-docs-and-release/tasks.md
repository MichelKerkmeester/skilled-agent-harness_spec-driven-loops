---
title: "Tasks: Phase 3: engine-docs-and-release"
description: "Ordered tasks to document the framework/ and root/ default and the sibling overlay folder, make the relayout route read status --json, move five playbook scenarios to the new paths, add SKD-013, ship system-skilled-doctor 1.2.0.0, commit phases 1-3 and record the id for phase 4."
trigger_phrases:
  - "engine docs and release tasks"
  - "doctor overlay docs task list"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 3: engine-docs-and-release

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

`D` is `.skilled/commands/doctor`. `S` is `.skilled/skills/system-skilled-doctor`. `O` is `$S/manual-testing-playbook/overlays`. All commands run from the Skilled checkout root. Line numbers are the 2026-11-20 lines; each Verify searches by content, so an earlier edit that shifts lines does not break it.

The new rule, as phase 002 ships it: destination `.skilled/X` has its source at `framework/X`, and any other destination `X` has its source at `root/` plus `X` with its leading dots dropped.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
<!-- FILL: Replace the sample tasks with the real setup steps. Each task names a file and a verify command. GOOD: T001 Confirm `logs/archive/` holds 10 archives. Verify: `ls logs/archive | wc -l` prints 10. WEAK: T001 Set up the project. -->

- [x] T001 Confirm phases 001 and 002 are in the working tree and pass (`$D/scripts/tests/`). Verify: `node --test $D/scripts/tests/overlay-engine-*.test.cjs` exits 0 and prints `# fail 0`. Evidence: engine suite 250/250, exit 0, `# fail 0` at `5913aeb`.
- [x] T002 Read the engine's refusal messages for a deeper `../` path and for a folder outside the git repository, and copy each into this task's note (`$D/scripts/overlay-engine.cjs`). Verify: `rg -n 'git repository' $D/scripts/overlay-engine.cjs` prints the outside-the-repository refusal line. Note: deeper path `.skilled-overlays.json names a folder outside the tree root: <value>` (`overlay-engine.cjs:469`); outside the repository `the overlay folder must sit inside the same git repository as the tree; <label> is outside the git repository at <top level>` (`:5817`).
- [x] T003 Read the default rule and the LAYOUT overflow line, and copy the overflow text into this task's note (`$D/scripts/overlay-engine.cjs`). Verify: `rg -n "LAYOUT .*more" $D/scripts/overlay-engine.cjs` prints one line, and `rg -n -e 'source[L]ayout' $D/scripts/overlay-engine.cjs` prints nothing. Note: overflow `LAYOUT   … N more; run node .skilled/commands/doctor/scripts/overlay-engine.cjs apply --relayout`; `rg -n -e 'source[L]ayout'` printed nothing.
- [x] T004 Record the doc and playbook baseline (`spec.md` Measured Behavior). Verify: the Measured Behavior command prints the same 7 doc lines and the counts 3, 4, 5, 6 and 5 for the five scenario files. Evidence: 7 doc lines and counts 6, 3, 4, 5, 5 (`scratch/evidence/baseline-doc-lines.txt`).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
<!-- FILL: Write one implementation task per file change. Add a `Verify:` line with the command and its expected output. GOOD: T002 Add the `--keep <n>` branch. Verify: `--keep 3` leaves 3 archives. WEAK: T002 Implement the feature. -->

- [x] T005 Rewrite the LAYOUT row for the new default, and say that past 20 lines status prints one overflow line that names the count and the same fix (`$D/assets/doctor-overlay-presentation.txt:115`). Verify: `rg -n '^\| .LAYOUT. \|' $D/assets/doctor-overlay-presentation.txt` prints one line containing `framework/`, `root/` and the overflow text from T003. Evidence: its Verify command prints the expected line.
- [x] T006 Rewrite the adopt "Will copy" line so the copy lands at its `framework/` or `root/` path (`$D/assets/doctor-overlay-presentation.txt:228`). Verify: `rg -n '^Will copy: ' $D/assets/doctor-overlay-presentation.txt` prints a line containing `framework/` and `root/`. Evidence: its Verify command prints the expected line.
- [x] T007 Rewrite the relayout plan paragraph so the plan is the `offLayout` list of `status --json`, one row per move, and each move lands at its `framework/` or `root/` path (`$D/assets/doctor-overlay-presentation.txt:273`). Verify: `rg -n 'no plan mode for .apply --relayout.' $D/assets/doctor-overlay-presentation.txt` prints a line containing `offLayout` and `framework/`. Evidence: its Verify command prints the expected line.
- [x] T008 Rewrite the refusal row so it allows a relative folder inside the tree or a direct sibling `../<name>`, and names a deeper path and a folder outside the git repository as refused, with the messages from T002 (`$D/assets/doctor-overlay-presentation.txt:557`). Verify: `rg -n 'inside the tree' $D/assets/doctor-overlay-presentation.txt` prints only a line that also contains `../<name>`. Evidence: its Verify command prints the expected line.
- [x] T009 Add a sibling value, `"../overlays"`, as the example in the no-manifest row (`$D/assets/doctor-overlay-presentation.txt:552`). Verify: `rg -n '^\| .no overlay manifest at' $D/assets/doctor-overlay-presentation.txt` prints a line containing `../overlays`. Evidence: its Verify command prints the expected line.
- [x] T010 Rewrite the setting description so the folder sits inside the tree or beside it as a direct sibling `../<name>`, and recheck the "lives outside `.skilled`" sentence (`$S/references/overlays.md:51,60`). Verify: `rg -n '\.\./<name>' $S/references/overlays.md` prints a line in the setting section, and `rg -n 'outside the git repository' $S/references/overlays.md` prints one line. Evidence: its Verify command prints the expected line.
- [x] T011 Rewrite the LAYOUT row for the new default, the overflow line and the full list in `offLayout` (`$S/references/overlays.md:92`). Verify: `rg -n '^\| .LAYOUT ' $S/references/overlays.md` prints a line containing `framework/`, `root/` and `offLayout`. Evidence: its Verify command prints the expected line.
- [x] T012 Rewrite the relayout paragraph so each copy moves to its `framework/` or `root/` path (`$S/references/overlays.md:96`). Verify: `rg -n '^.apply --relayout. moves' $S/references/overlays.md` prints a line containing `framework/`. Evidence: its Verify command prints the expected line.
- [x] T013 Rewrite the adopt paragraph so the copy lands at its `framework/` or `root/` path (`$S/references/overlays.md:188`). Verify: `rg -n 'apply --adopt <path>. turns the path' $S/references/overlays.md` prints a line containing `framework/` and `root/`. Evidence: its Verify command prints the expected line.
- [x] T014 Add the passage "Moving an existing tree onto the new layout": after the re-pin status prints LAYOUT notes, at most 20 lines plus one overflow line, `status --json` lists all in `offLayout`, and status still passes; nothing is refused and every overlay keeps applying because sources are read verbatim from the manifest; the one action is `/doctor:overlay apply --relayout` once; skipping it breaks nothing, but `--adopt` then writes new entries at `framework/` or `root/` and the folder is mixed until the relayout (`$S/references/overlays.md`). Verify: `rg -n '^#+ Moving an existing tree onto the new layout' $S/references/overlays.md` prints one line, and the passage below it contains `offLayout`, `apply --relayout` and `--adopt`. Evidence: its Verify command prints the expected line.
- [x] T015 Say in the status step that LAYOUT output stops at 20 lines plus one overflow line and `--json` carries all of them (`$D/overlay.md:99`). Verify: `rg -n '^2\. .status. runs' $D/overlay.md` prints a line containing `20` and `offLayout`. Evidence: its Verify command prints the expected line.
- [x] T016 Say in the adopt step that the copy lands at its `framework/` or `root/` path (`$D/overlay.md:105`). Verify: `rg -n '^8\. With .--adopt' $D/overlay.md` prints a line containing `framework/`. Evidence: its Verify command prints the expected line.
- [x] T017 Make the relayout plan step take its plan from `status --json`, render the full `offLayout` list, and end the run as nothing to move when `offLayout` is empty (`$D/overlay.md:106`). Verify: `rg -n '^9\. With .--relayout.' $D/overlay.md` prints a line containing `status --json` and `offLayout`. Evidence: its Verify command prints the expected line.
- [x] T018 Rewrite relayout step 11 so each source moves to its `framework/` or `root/` path (`$D/overlay.md:108`). Verify: `rg -n '^11\. After that yes' $D/overlay.md` prints a line containing `framework/` and no `leading dot dropped`. Evidence: its Verify command prints the expected line.
- [x] T019 Add to the result step that after a clean re-pin whose re-read shows LAYOUT notes the next commands are `/doctor:update record-base` and `/doctor:overlay apply --relayout` (`$D/overlay.md:116`). Verify: `rg -n '^19\. Render the result' $D/overlay.md` prints a line containing both commands. Evidence: its Verify command prints the expected line.
- [x] T020 Rewrite the relayout write list for the new default (`$D/assets/doctor-overlay-apply.yaml:34`). Verify: `rg -n '"with --relayout, the overlay sources' $D/assets/doctor-overlay-apply.yaml` prints a line containing `framework/` and no `leading dot dropped`. Evidence: its Verify command prints the expected line.
- [x] T021 Make the relayout plan run `status --json` and keep every `offLayout` item, and make an empty `offLayout` the nothing-to-move result (`$D/assets/doctor-overlay-apply.yaml:85-86`). Verify: `rg -n 'With relayout.*offLayout' $D/assets/doctor-overlay-apply.yaml` prints at least two lines, both in `phase_2_plan`. Evidence: its Verify command prints the expected line.
- [x] T022 Make the relayout re-read check each moved copy against `offLayout` in a `status --json` re-read (`$D/assets/doctor-overlay-apply.yaml:125`). Verify: `rg -n 'A re-read after a relayout' $D/assets/doctor-overlay-apply.yaml` prints a line containing `offLayout`. Evidence: its Verify command prints the expected line.
- [x] T023 Confirm the relayout flag stays operator-given only and no workflow stops on LAYOUT (`$D/assets/doctor-overlay-apply.yaml:60`, `$D/assets/doctor-overlay-status.yaml:58`). Verify: `rg -c 'The --relayout flag when the operator gave it' $D/assets/doctor-overlay-apply.yaml` prints 1, and `git diff --quiet -- $D/assets/doctor-overlay-status.yaml; echo $?` prints 0. Evidence: printed 1; `doctor-overlay-status.yaml` has no diff.
- [x] T024 Rewrite the relayout clause of `gate3_location` for the new default and for a plan read from `offLayout` (`$D/_routes.yaml:699`). Verify: `rg -n 'gate3_location: "the overlay destinations' $D/_routes.yaml` prints a line containing `framework/` and `offLayout`, and `bash $D/scripts/route-validate.sh` exits 0. Evidence: its Verify command prints the expected line.
- [x] T025 Make the rollback step resolve a direct-sibling `../<name>` setting against the tree root before its `find` (`$D/assets/doctor-overlay-repin.yaml:76`). Verify: `rg -n 'against the tree root' $D/assets/doctor-overlay-repin.yaml` prints one line in the rollback step. Evidence: its Verify command prints the expected line.
- [x] T026 Make the overlay check resolve the named folder against the tree root, a direct-sibling `../<name>` included (`$D/assets/doctor-update-apply.yaml:187`). Verify: `rg -n 'against the tree root' $D/assets/doctor-update-apply.yaml` prints one line. Evidence: its Verify command prints the expected line.
- [x] T027 Move the fixture source and the adopt expectation to the new paths, `framework/skills/own` and `framework/skills/hub/help.md`, at lines 30, 42, 43, 50, 53 and 58 (`$O/adopt-an-unowned-file.md`). Verify: `rg -c 'skilled-overlays/skilled|source\\?":\\?"skilled/' $O/adopt-an-unowned-file.md` prints nothing, and `rg -c 'framework/skills/' $O/adopt-an-unowned-file.md` prints at least 5. Evidence: its Verify command prints the expected line.
- [x] T028 Move the fixture source and the adopt expectation to the new paths at lines 30, 42, 43, 50 and 65 (`$O/pre-commit-refuses-unowned-change.md`). Verify: `rg -c 'skilled-overlays/skilled|source\\?":\\?"skilled/' $O/pre-commit-refuses-unowned-change.md` prints nothing, and `rg -c 'framework/skills/' $O/pre-commit-refuses-unowned-change.md` prints at least 4. Evidence: its Verify command prints the expected line.
- [x] T029 Move the LAYOUT, `moved`, `relinked` and manifest expectations to `framework/skills/hub/bundle` at lines 30, 51 and 58 (`$O/relayout-moves-sources.md`). Verify: `rg -c 'belongs at skilled|-> skilled/|skilled-overlays/skilled|source\\?":\\?"skilled/' $O/relayout-moves-sources.md` prints nothing, and `rg -c 'framework/skills/hub/bundle' $O/relayout-moves-sources.md` prints at least 3. Evidence: its Verify command prints the expected line.
- [x] T030 Move the owned fixture source to `framework/skills/hub/owned.md` at lines 42, 53, 55 and 68 (`$O/status-audit-lists-unowned-drift.md`). Verify: `rg -c 'skilled-overlays/skilled|source\\?":\\?"skilled/' $O/status-audit-lists-unowned-drift.md` prints nothing, and `rg -c 'framework/skills/hub' $O/status-audit-lists-unowned-drift.md` prints at least 4. Evidence: its Verify command prints the expected line.
- [x] T031 Move the fixture source and the two guard hints to the new paths at lines 30, 41, 42, 44 and 56 (`$O/strict-guard-refuses-unowned-write.md`). Verify: `rg -c 'skilled-overlays/skilled|source\\?":\\?"skilled/' $O/strict-guard-refuses-unowned-write.md` prints nothing, and `rg -c 'framework/skills/' $O/strict-guard-refuses-unowned-write.md` prints at least 4. Evidence: its Verify command prints the expected line.
- [x] T032 Create scenario `SKD-013`, modeled on `SKD-009`: a tree whose `.skilled-overlays.json` names `"../overlays"` with 21 old-layout entries, a status that prints 20 LAYOUT lines, one overflow line and `RESULT: PASSED`, a `status --json` whose `offLayout` holds 21 items, one `apply --relayout`, and a status with no LAYOUT line (`$O/sibling-folder-relayout.md`). Verify: `sed -n 2p $O/sibling-folder-relayout.md` prints a title starting `title: "SKD-013`, and `rg -c 'offLayout' $O/sibling-folder-relayout.md` prints at least 1. Evidence: its Verify command prints the expected line.
- [x] T033 Add `SKD-013` to the wave row at `:95`, a section after `:199` and the coverage row at `:209`, and re-read the `SKD-006` and `SKD-009` summaries at `:147` and `:171`, which name no path (`$S/manual-testing-playbook/manual-testing-playbook.md`). Verify: `rg -c 'SKD-013' $S/manual-testing-playbook/manual-testing-playbook.md` prints 4, as `rg -c 'SKD-012'` does today. Evidence: its Verify command prints the expected line.
- [x] T034 Bump the skill version from `1.1.8.0` to `1.2.0.0` (`$S/SKILL.md:5`). Verify: `sed -n 5p $S/SKILL.md` prints `version: 1.2.0.0`. Evidence: its Verify command prints the expected line.
- [x] T035 Write the release record in the shape of `v1.1.8.0.md`: the intro paragraph leads with the default change and the one action, `/doctor:overlay apply --relayout` once after the re-pin, then says nothing breaks if it is skipped; the body covers the sibling folder and the stage (`$S/changelog/v1.2.0.0.md`). Verify: `rg -n '^version: 1.2.0.0$' $S/changelog/v1.2.0.0.md` prints one line, and `awk '/^# v1.2.0.0/{f=1;next} /^## /{exit} f' $S/changelog/v1.2.0.0.md | rg -c -e 'framework/' -e 'apply --relayout'` prints at least 1. Evidence: its Verify command prints the expected line.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
<!-- FILL: Write one verification task per requirement. Each one runs a command. GOOD: T003 Run both invocations. Verify: `ls logs/archive | wc -l` prints 3 and 10. WEAK: T003 Test everything. -->

- [x] T036 Run the overlay contract test (`$D/scripts/tests/doctor-overlay-contract.test.cjs`). Verify: `node --test $D/scripts/tests/doctor-overlay-contract.test.cjs` exits 0 and prints `# fail 0`. Evidence: 9/9, `# fail 0`, exit 0 (`scratch/evidence/after-checks.txt`).
- [x] T037 Run the route validator (`$D/scripts/route-validate.sh`). Verify: `bash $D/scripts/route-validate.sh` exits 0. Evidence: exit 0, 32 routes, 11 warnings, the same 11 as `main` before this phase.
- [x] T038 Run the residual naming-rule check (`$D`, `$S`). Verify: `rg -n -e 'leading dot dropped' -e 'without its leading dot' $D $S -g '!**/scripts/**' -g '!**/changelog/**'` prints only lines that contain `root/`. Evidence: printed nothing.
- [x] T039 Run the residual switch check (`$D`, `$S`). Verify: `rg -n -e 'source[L]ayout' -e 'framework-root' -e 'opt[-]in' $D $S -g '!**/scripts/**' -g '!**/changelog/v1.1*'` prints nothing. Evidence: one hit, `doctor-env.yaml:48` "opt-in" about environment settings, a file this phase never touched; no switch is described.
- [x] T040 Run the residual playbook check (`$S/manual-testing-playbook`). Verify: `rg -c 'skilled-overlays/skilled|belongs at skilled|-> skilled/|source\\?":\\?"skilled/' $S/manual-testing-playbook` prints nothing. Evidence: one hit, `sibling-folder-relayout.md`, whose fixture builds the old-layout tree on purpose; with that file excluded the search prints nothing.
- [x] T041 Run scenario `SKD-005` on a `mktemp -d` tree (`$O/strict-guard-refuses-unowned-write.md`). Verify: every step prints the expected signals written at line 30 and the run ends as its pass line says. Evidence: PASS (`scratch/evidence/scenario-runs.md`).
- [x] T042 Run scenario `SKD-006` on a `mktemp -d` tree (`$O/adopt-an-unowned-file.md`). Verify: step 12 prints the `adopted ... as skilled-overlays/framework/skills/hub/help.md` line and step 15 prints `RESULT: PASSED` with no `LAYOUT` line. Evidence: PASS after the quoting fix in the manifest step (`scratch/evidence/scenario-runs.md`, rerun section).
- [x] T043 Run scenario `SKD-007` on a `mktemp -d` tree (`$O/pre-commit-refuses-unowned-change.md`). Verify: step 17 exits 1, step 19 prints the `adopted ... framework/skills/hub/help.md` line and step 21 prints `allow`. Evidence: PASS after the quoting fix.
- [x] T044 Run scenario `SKD-009` on a `mktemp -d` tree (`$O/relayout-moves-sources.md`). Verify: step 7 prints `belongs at framework/skills/hub/bundle` and `RESULT: PASSED`, and step 14 prints `RESULT: PASSED` with no `LAYOUT` line. Evidence: PASS.
- [x] T045 Run scenario `SKD-010` on a `mktemp -d` tree (`$O/status-audit-lists-unowned-drift.md`). Verify: every step prints the expected signals the file names and plain status prints no `LAYOUT` line. Evidence: PASS after the quoting fix.
- [x] T046 Run scenario `SKD-013` on a `mktemp -d` tree (`$O/sibling-folder-relayout.md`). Verify: the first status prints 20 `LAYOUT` lines plus the overflow line and `RESULT: PASSED`, `status --json` lists 21 `offLayout` items, and the last status prints `RESULT: PASSED`, no line starting `LAYOUT`, and exits 0. Evidence: PASS: 20 LAYOUT lines, the overflow line, 21 `offLayout` items, a clean final status.
- [x] T047 Commit the docs as the last commit of phases 1-3 through `sk-git` (Skilled checkout, files in the spec Files to Change table). Verify: `git log -1 --format=%H` prints a 40-hex id, and `git status --porcelain -- $D $S` prints nothing. Evidence: committed as `d42bafc` on the worktree branch, merged into `main` as `063daaee2c1`; `git status --porcelain -- .skilled/commands/doctor .skilled/skills/system-skilled-doctor` on `main` prints nothing.
- [x] T048 Replace the slot line `Target Skilled commit: <C>` with the id T047 printed (`specs/system-skilled-doctor/007-overlay-framework-root-layout/004-barter-repin-and-relayout/spec.md`). Verify: `rg -n 'Target Skilled commit: [0-9a-f]{40}' specs/system-skilled-doctor/007-overlay-framework-root-layout/004-barter-repin-and-relayout/spec.md` prints one line with that id. Evidence: the line holds the merged `main` commit `063daaee2c19a7a8c9a0fb67f84903894bc08043`, the pin the operator named; `git show -m --first-parent --name-only --format= 063daaee2c1` lists `changelog/v1.2.0.0.md`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
<!-- FILL: Keep the three completion lines and add the one artifact that proves the phase is done. GOOD: `--keep 3` leaves 3 archives and the suite passes. WEAK: Work is complete. -->

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] Phase 4's spec names the commit id, and `git -C <Skilled> log -1 --format=%H` printed that id right after T047
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
<!-- FILL: Name the spec and plan files. Add the decision record when the packet has one. GOOD: Specification: `spec.md`. Plan: `plan.md`. WEAK: See the other docs. -->

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Parent**: See `../spec.md`, `../scratch/design-notes.md` for the migration decision and `../scratch/inventory/c-upstream.md` for the docs inventory
<!-- /ANCHOR:cross-refs -->

---



