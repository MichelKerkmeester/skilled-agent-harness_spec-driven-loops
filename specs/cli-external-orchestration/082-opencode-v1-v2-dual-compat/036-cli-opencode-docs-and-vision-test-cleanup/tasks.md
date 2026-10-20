---
title: "Tasks: Phase 36: cli-opencode-docs-and-vision-test-cleanup"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "cli opencode docs and vision test cleanup tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 36: cli-opencode-docs-and-vision-test-cleanup

<!-- SPECKIT_LEVEL: 1 -->

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

- [x] T001 Record the baselines (`scratch/baseline/`) Done: cli-opencode script tests 13 of 13; sk-vision `bun test tests` 80 of 80, adding 7 `sk-vision-flags-*` and 10 other `sk-vision-*` directories per run; the speckit-completion step 6 snippet exits 1 with `mod.default is not a function`.
- [x] T002 Find every in-process plugin snippet that calls the default export (`manual-testing-playbook/`) Done: seven playbooks, ten calls.
- [x] T003 Find every note that sends a reader to the standalone listing without a prefix (`cli-opencode/`, `cli-devin/`) Done: 39 lines carry `opencode2 models --standalone` without the words prefix, filter or grep; the command lines and tables among them stay.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Quote-aware comment stripping and the listing-source check (`cli-opencode/scripts/tests/opencode2-models-form.test.cjs`) Done: `activeShellLines` walks quote state; `standaloneListingProblem` requires each prefix grep to read the standalone listing; two unit tests.
- [x] T005 Prose guard and prefix-note guard (`cli-opencode/scripts/tests/opencode2-models-form.test.cjs`) Done: `unquotedListingCommands` and `unprefixedListingNotes`, each with a doc scan and a unit test; the prefix guard reads its exemption words from prose only.
- [x] T006 Name the prefix in the listing notes (`cli-opencode/**/*.md`, `cli-devin/references/providers-and-models.md`) Done: 43 notes in 28 files.
- [x] T007 Kill-switch tests create no directory (`sk-vision/vision-runtime/tests/plugin.test.ts`) Done: the switch-file path sits under a parent that is never created.
- [x] T008 Playbook snippets call `default.server(...)` (seven playbooks) Done: ten calls; CO-038 step 2 also copies `hard-rules.json` and the source-root sentinel.
- [x] T009 Register this phase in the parent (`../spec.md`) Done: phase map row, handoff row and child id in `../graph-metadata.json`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Run the cli-opencode script tests and each guard's mutant Done: 19/19; six mutants each fail 1 test.
- [x] T011 Run `bun test tests` and count the temp directories it adds Done: 80/80; no `sk-vision-flags-*` entry added.
- [x] T012 Run each changed playbook snippet Done: all run from the worktree root (`scratch/after/`) and print their expected signal, except the speckit-completion step 3 "Level-2 EVIDENCE_MISSING" fixture, which now reports `level: 1` and `P0_INCOMPLETE` because the fixture packet moved (Known Limitation 2).
- [x] T013 Run the doc checks: cli-opencode playbook validator, link integrity, sk-doc script tests Done: validator and link integrity pass; sk-doc script tests pass after the manifest refresh.
- [ ] T014 Luna review, read-only
- [ ] T015 Validate 082 strict and recursive
- [ ] T016 Push to main and confirm CI
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Review Fixes

- [x] T017 Check the prefix of the model passed to `-m` in every v2 note (`cli-opencode/**/*.md`, `cli-devin/references/providers-and-models.md`) Done: 41 notes; the MiMo note keeps `llmgateway/`.
- [x] T018 Parse pre-flight lines into top-level shell segments (`opencode2-models-form.test.cjs`) Done: `$(...)` nesting, quoted operators, last assignment wins; three mutants each fail 1 test.
- [x] T019 Load the goal and watchdog plugins through `server` (`goal-hook.md`, `.skilled/hooks/codex-watchdog/README.md`) Done: CO-039 prints `"verdict":"PASS"`; the watchdog snippet prints `ok`.
- [x] T020 Load checks expect `ok object` (four hook READMEs) Done: all five checks print `ok object`.
- [x] T021 Outside fix: refresh the durable-directory manifest (`sk-doc/scripts/tests/code-folder/durable-directory-manifest.json`) Done: adds `.skilled/hooks/session-relaunch/lib` only; `test_readme_manifest.py` passes.
- [x] T022 Record the type-check output (`scratch/after/sk-vision-tsc.txt`) Done: exit 0.
- [x] T023 Join continuations as bash does and require the bare listing (`opencode2-models-form.test.cjs`) Done: 21/21; three mutants each fail at least 1 test.
- [x] T024 Record the full sk-doc rerun and the manifest test (`scratch/after/`) Done: all sk-doc script tests pass; `reproduced=True`.
- [x] T025 Record why the v2 default-model examples stay (`implementation-summary.md`) Done: Known Limitation 5.
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
