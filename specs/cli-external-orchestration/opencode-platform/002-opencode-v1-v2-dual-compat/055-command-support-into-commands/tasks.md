---
title: "Tasks: Phase 55: command-support-into-commands"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "command support into commands tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 55: command-support-into-commands

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

- [x] T001 Probe what OpenCode 1.19.3 and 2.0.32 actually scan: `{command,commands}/**/*.md` with `dot:true`, no ignore list and no frontmatter opt-out on either version; a leading underscore, a dot-folder, `README`, `node_modules`, `assets/` and an ignore file are all still registered, while `.markdown`, `.mdx`, `.md.txt` and `.md.bak` are not
- [x] T002 Record the baseline on both versions and across the tracked suites: 40 commands on v1 and 42 on v2, and the suite numbers the after-run is compared with (`scratch/commands-before.json`, `scratch/suites-before.txt`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Move the 12 non-command markdown files from `.skilled/command-support/<sub>/` back into `.skilled/commands/<sub>/`, renaming every `.md` to `.markdown`; the renames are mechanical and were done by hand with `git mv`, and `.skilled/command-support/` is gone with no runtime mirror or symlink pointing at it (`.skilled/commands/deep/assets/compiled/`, `.skilled/commands/deep/assets/legacy/`, `.skilled/commands/doctor/scripts/`, `.skilled/commands/doctor/scripts/tests/`, `.skilled/commands/scripts/`, `.skilled/commands/scripts/fixtures/`)
- [x] T004 Repoint the deep-loop consumers: the manifest path and the six body and contract paths in `render-command-contract.cjs`, `outputPathFor` in `compile-command-contracts.cjs`, `legacy-projection-manifest.ts` and `compile-command-contracts.vitest.ts` (`.skilled/skills/system-deep-loop/runtime/`)
- [x] T005 Update the remaining code and config consumers: the parity fixture paths, the `manifest.jsonl` ignore and the sk-create-command contract (`.skilled/skills/system-spec-kit/runtime/tests/hooks/gate-3-menu-parity.test.mjs`, `.gitignore`, `.skilled/skills/sk-doc/sk-create-command/assets/command-contract.json`)
- [x] T006 Update the six moved `README.markdown` files - paths, file names and the top note - and the checklist that names the suffix (`.skilled/commands/**/README.markdown`, `.skilled/skills/sk-code/sk-code-skilled/assets/checklists/command-authoring.md`)
- [x] T007 Update the two sk-doc fixtures: the 4 old directories replaced in `durable-directory-manifest.json`, and only the 6 moved paths rewritten in `baseline-readme-verdicts.json`, because a full regeneration would have added 7 unrelated READMEs (`.skilled/skills/sk-doc/scripts/tests/code-folder/`)
- [x] T008 Recompile the three contracts with `compile-command-contracts.cjs --command <c> --write` and confirm the output is byte-identical to the moved files (`.skilled/commands/deep/assets/compiled/`)
- [x] T009 Teach the three checks the new suffix rather than leaving the moved files uncovered: the link guard walks `.markdown`, `template-phrase-lint.mjs` stages `*.markdown`, and `audit_readmes.py`, `test_readme_verdict_parity.py` and `validate_document.py` recognise `README.markdown`, with `readme.markdown` classified as `readme` before the commands-folder rule while `.skilled/commands/create/readme.md` stays a `command` (`.skilled/skills/system-spec-kit/runtime/cli/check-markdown-links.cjs`, `.skilled/skills/system-spec-kit/runtime/cli/spec/template-phrase-lint.mjs`, `.skilled/skills/sk-doc/`)
- [x] T010 Update the deep-loop state census row that `legacy-projections.test.ts` compares with the projection manifest (`specs/system-deep-loop/036-deep-loop-innovation/001-research-inputs-and-architecture/003-baseline-taxonomy-and-state-census/state-backend-census.json` line 555)
- [x] T011 Fix the two P2s from review round 1: `audit_readmes.py`'s `readme_exists` also accepts a lowercase `readme.markdown`, and the report scope lists `.skilled/**/README.markdown` (`.skilled/skills/sk-doc/sk-create-readme/scripts/audit_readmes.py`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Read both command lists again with the battery method: v1 40 before and 40 after, v2 42 before and 42 after, nothing added and nothing removed (`scratch/commands-after.json`)
- [x] T013 Run the tracked suites and compare them with the baseline: plugins 516 and 516, hook node tests 889 and 889 over 30 files, battery unit tests 51 and 51, gate-3 parity 17 and 17, deep-loop vitest 2799 passed with 8 skipped both times, and the sk-doc script tests passing both times. The first after-run had 3 deep-loop failures from the census row; the rerun after T010 had 0 (`scratch/suites-after.txt`)
- [x] T014 Confirm the adjacent checks: the README manifest is reproducible, the verdict parity diff is empty, the link guard found 0 broken links over 7794 files and 14204 links, and the full version battery passed 8 of 8 legs on both versions
- [x] T015 Have the change reviewed read-only by a separate DeepSeek v4.1 flash session through cli-pi. Round 1 returned PASS with 2 P2s, both fixed in T011, and a narrow round 2 checked those fixes and the census change. Luna was not used
- [x] T016 Fill this phase's four docs and add the parent map and handoff rows for 055 (`spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md`, `../spec.md`)
- [x] T017 Push to main - `6f0737b56a` on main
- [x] T018 Record CI on the pushed commit (`implementation-summary.md`) - CI green on `6f0737b56a` (18 of 18) and `5565f2aa3c` (13 passed, 1 skipped), Spec-Kit Check 39782205255
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Every task before the push is marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: both versions list the same commands before and after, and no suite regressed
- [x] T017 and T018 closed after the push: `6f0737b56a` on main, CI green on it and on the trigger-index rebuild `5565f2aa3c`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Command lists**: See `scratch/commands-before.json` and `scratch/commands-after.json`
- **Suite transcripts**: See `scratch/suites-before.txt` and `scratch/suites-after.txt`
<!-- /ANCHOR:cross-refs -->

---
