# Iteration 3: Q3 Executability by a DeepSeek writer

## Focus

Audit every tasks.md, plan.md and acceptance-criteria.md in phases 001–005 for task-level scope, anchors at the current checkout, proving commands, acceptance mapping and rollback. This iteration answers Q3. It does not edit phase documents.

## Actions Taken

- Read the task, plan and acceptance-criteria documents for all five phase folders, task by task.
- Compared documented line anchors against the current checkout at HEAD 63477170833a096358ad0655f2dbd972954cb7a2. Confirmed the phase 001 pre-commit anchor at line 96, phase 002 mode-registry anchors at lines 19, 61 and 98, phase 002 hub-router anchors at lines 7 and 31, phase 003 compiler discovery at line 200 and phase 005 corpus anchor at line 200.
- Checked command semantics read-only. A ripgrep alternation using an escaped pipe did not match either sample surface name, while the unescaped alternation matched both. A zero-match grep -c printed 0 but returned exit status 1.
- Checked that the validator, advisor CLI, leaf-manifest generator, Hermes sync script and graph compiler paths exist. Did not run project test suites or mutation commands.
- Preserved the pre-existing working-tree changes. Before this iteration, git status showed a modified parent spec.md and the untracked research directory. The phase documents were not changed.

## Findings

### F1. P0: Several leak-proof commands can report a false zero

[CONFIRMED] The phase 002 acceptance criteria use escaped-pipe alternation in ripgrep patterns. Ripgrep treats that pipe as a literal here, so the command can miss both surface names and print no matches even when they exist. Examples include the manifest and metadata checks and the multi-file surface sweep. The phase 003 criteria use the same pattern for the advisor vocabulary sweep. A DeepSeek writer could read the empty output as proof of removal although the expression did not search either alternative. [SOURCE: specs/sk-code/013-private-surface-skills/002-hub-surface-removal/acceptance-criteria.md:57] [SOURCE: specs/sk-code/013-private-surface-skills/002-hub-surface-removal/acceptance-criteria.md:60] [SOURCE: specs/sk-code/013-private-surface-skills/003-advisor-vocabulary-cleanup/acceptance-criteria.md:54]

### F2. P1: Task-to-criterion links and rollback instructions are not consistent at task level

[DOCUMENTED] The phase 001 task format promises file, anchor, edit, branch and proof, but has no acceptance-criterion or rollback field. The five phases mostly put rollback at plan level, leaving a writer to infer which criterion a task proves and how to reverse an individual task. Phase 005 does refer to AC rows for the review and closure tasks, so the gap is inconsistency rather than an absence of AC references everywhere. [SOURCE: specs/sk-code/013-private-surface-skills/001-ignore-and-commit-guard/tasks.md:28] [SOURCE: specs/sk-code/013-private-surface-skills/001-ignore-and-commit-guard/tasks.md:63] [SOURCE: specs/sk-code/013-private-surface-skills/002-hub-surface-removal/tasks.md:67] [SOURCE: specs/sk-code/013-private-surface-skills/003-advisor-vocabulary-cleanup/tasks.md:39] [SOURCE: specs/sk-code/013-private-surface-skills/004-private-local-skills/tasks.md:41] [SOURCE: specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/tasks.md:50] [SOURCE: specs/sk-code/013-private-surface-skills/001-ignore-and-commit-guard/plan.md:316] [SOURCE: specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/plan.md:338]

### F3. P1: These implementation tasks are too broad for one task entry

[DOCUMENTED] Phase 002 T014 asks for a multi-section rewrite of ROUTER.md, while T028–T031 and T034 use directory-wide globs or group several scenarios and checklists. T068 edits four universal references. T058 regenerates metadata and also calls for hand edits. A writer could miss a matching file, change unrelated guidance, or mix generated output with manual edits. [SOURCE: specs/sk-code/013-private-surface-skills/002-hub-surface-removal/tasks.md:107] [SOURCE: specs/sk-code/013-private-surface-skills/002-hub-surface-removal/tasks.md:171] [SOURCE: specs/sk-code/013-private-surface-skills/002-hub-surface-removal/tasks.md:183] [SOURCE: specs/sk-code/013-private-surface-skills/002-hub-surface-removal/tasks.md:199] [SOURCE: specs/sk-code/013-private-surface-skills/002-hub-surface-removal/tasks.md:143] [SOURCE: specs/sk-code/013-private-surface-skills/002-hub-surface-removal/tasks.md:303]

[DOCUMENTED] Phase 003 T002 combines eleven baseline commands with writing results, T027 combines the full sweep with the ambiguity slice and validator, and T030 combines commit and push. Phase 004 groups six symlink replacements, the E/O edit-catalogue ranges and two skill metadata files into individual tasks; T009 covers E-01 through E-17 and E-19 across two documents, and T010 covers O-01 through O-28. Phase 005 T003 combines commit, push and clone, while T007 combines a CI wait, clone update and index count. Multi-command evidence collection is understandable when it writes one evidence file, but these implementation and publishing groups need smaller task boundaries. [SOURCE: specs/sk-code/013-private-surface-skills/003-advisor-vocabulary-cleanup/tasks.md:39] [SOURCE: specs/sk-code/013-private-surface-skills/003-advisor-vocabulary-cleanup/tasks.md:128] [SOURCE: specs/sk-code/013-private-surface-skills/003-advisor-vocabulary-cleanup/tasks.md:131] [SOURCE: specs/sk-code/013-private-surface-skills/004-private-local-skills/tasks.md:43] [SOURCE: specs/sk-code/013-private-surface-skills/004-private-local-skills/tasks.md:56] [SOURCE: specs/sk-code/013-private-surface-skills/004-private-local-skills/tasks.md:57] [SOURCE: specs/sk-code/013-private-surface-skills/004-private-local-skills/tasks.md:58] [SOURCE: specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/tasks.md:50] [SOURCE: specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/tasks.md:78]

[INFERRED] A DeepSeek writer following those bundled tasks could overlook one catalogue entry, update only some matching files, or push a partially verified phase. Splitting by file or one coherent behavior would make the proof and rollback boundary clear.

### F4. P1: Phase 005 has proof instructions that are not executable as written

[DOCUMENTED] T005's proof command ends with the placeholder text “<the ten paths>” and delegates the real command to plan step 4. T012 expects grep -c to count 11 review rows, but the acceptance table header begins with “AC-ID” and matches the same ^| AC- pattern, so the command counts the header as well. [SOURCE: specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/tasks.md:67] [SOURCE: specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/tasks.md:124] [SOURCE: specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/acceptance-criteria.md:52] [SOURCE: specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/acceptance-criteria.md:54]

[CONFIRMED] The phase 005 trigger-index task expects grep -c to print zero when no names remain. That output is correct, but grep -c exits 1 on zero matches. A writer who relies on command exit status will treat the intended result as failure; a writer who checks only the printed count will not have a conventional successful proof command. [SOURCE: specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/tasks.md:81] [SOURCE: specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/plan.md:237]

### F5. P2: Sampled line anchors match HEAD, but task-level traceability remains uneven

[CONFIRMED] The sampled line anchors listed in Actions Taken match the current checkout. The phase 002 task list also uses explicit target paths for most direct edits, and phase 003 pairs several regression tests with the corresponding code changes. [SOURCE: specs/sk-code/013-private-surface-skills/002-hub-surface-removal/tasks.md:71] [SOURCE: specs/sk-code/013-private-surface-skills/003-advisor-vocabulary-cleanup/plan.md:72] [SOURCE: specs/sk-code/013-private-surface-skills/003-advisor-vocabulary-cleanup/plan.md:73]

[INFERRED] The remaining description-based anchors and catalogue references are more fragile than exact current text anchors, especially in the long phase 004 edit catalogue. A writer could apply a numbered edit to the wrong version of the copied skill unless each catalogue item is checked against its quoted OLD text first. [SOURCE: specs/sk-code/013-private-surface-skills/004-private-local-skills/plan.md:265] [SOURCE: specs/sk-code/013-private-surface-skills/004-private-local-skills/tasks.md:56]

## Questions Answered

- Q3: No. Many tasks identify a target and a proving command, but the packet is not uniformly executable task by task. It lacks consistent task-to-AC and rollback links, includes oversized edit tasks and contains proof commands that can miss matches or cannot be run verbatim.

## Questions Remaining

- Q4: Does phase 005's fresh-clone proof establish that no private bytes or surface signals reach the public repository?
- Q5: What risks remain from Git history, the Obsidian Plugin project's links to this checkout and CI drift checks?

## P0/P1/P2 Amendments

- **P0 — specs/sk-code/013-private-surface-skills/002-hub-surface-removal/acceptance-criteria.md and specs/sk-code/013-private-surface-skills/003-advisor-vocabulary-cleanup/acceptance-criteria.md:** replace escaped-pipe alternation in ripgrep patterns with valid alternation and add a positive-control assertion showing both names are detected before the post-removal zero check.
- **P1 — specs/sk-code/013-private-surface-skills/002-hub-surface-removal/tasks.md:** split T014, T028–T031, T034, T068 and T058 into bounded file-level tasks. Replace broad globs with an explicit current file list. Add an AC ID and a task-specific rollback to each implementation task.
- **P1 — specs/sk-code/013-private-surface-skills/003-advisor-vocabulary-cleanup/tasks.md:** split T002 and T027 into baseline/sweep units, separate T030's commit from push and add explicit AC and rollback links.
- **P1 — specs/sk-code/013-private-surface-skills/004-private-local-skills/tasks.md:** break the E/O catalogue tasks into file-sized units with exact OLD-text anchors, one proving command, an AC ID and a rollback per unit.
- **P1 — specs/sk-code/013-private-surface-skills/005-leak-and-routing-verification/tasks.md:** replace T005's “<the ten paths>” placeholder with the full command. Fix T012's row count so it excludes the header. Wrap expected-zero grep counts so the successful condition has an explicit zero exit status. Split T003 and T017 commit/push actions.
- **P2 — specs/sk-code/013-private-surface-skills/001-ignore-and-commit-guard/tasks.md:** add AC and rollback references to task entries and separate T017's commit and push.

## Next Focus

Q4 fresh-clone proof sufficiency, then Q5 history retention, the Obsidian Plugin checkout link and CI drift checks.
