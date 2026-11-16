---
title: "Tasks: Phase 2: codex-hook-check-merge"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "codex hook check merge tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 2: codex-hook-check-merge

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

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

Every command runs from the worktree root, `/Users/michelkerkmeester/worktrees/public/411-hook-library-cleanup`. `NEW` is `.skilled/hooks/codex-global-hooks-check`. `SEARCH` is `rg -n --hidden -g '!specs/**' -g '!**/changelog/**' -g '!**/node_modules/**' 'hooks/(codex-watchdog|hook-install)|(codex-watchdog|hook-install)/' .`. `BARE` is `rg -c --hidden -g '!specs/**' -g '!**/changelog/**' -g '!**/node_modules/**' -g '!*.json' -g '!.skilled/hooks/codex-global-hooks-check/**' -g '!.skilled/hooks/codex-watchdog/**' -g '!.skilled/hooks/hook-install/**' -e 'codex-watchdog' -e 'hook-install\b' . | sort`. `SK` is `.skilled/skills/sk-doc`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Save the bare-name counts per file before the move (`scratch/bare-before.txt`). Verify: `wc -l < scratch/bare-before.txt` in this phase folder prints 14. Result: 14.
- [x] T002 Confirm phase 001 is closed before the first move (`../001-dead-hook-file-removal/spec.md`). Verify: `rg -c '\*\*Status\*\* \| Complete' ../001-dead-hook-file-removal/spec.md` in this phase folder prints 1. Result: 1.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Move the OpenCode folder into the new folder with `git mv` (`.skilled/hooks/codex-watchdog/opencode`). Verify: `readlink $NEW/opencode/codex-hooks-watchdog.js` prints `../../../../.opencode/plugins/codex-hooks-watchdog.js` and `test -e $NEW/opencode/codex-hooks-watchdog.js` exits 0. Result: `readlink` printed `../../../../.opencode/plugins/codex-hooks-watchdog.js` and `test -e` exited 0.
- [x] T004 Move the Claude, Cursor and Devin folders into the new folder with `git mv` (`.skilled/hooks/hook-install`). Verify: `find $NEW -type l | wc -l` prints 4 and `find $NEW -type l ! -exec test -e {} \; -print` prints nothing. Result: 4 links, none dangling.
- [x] T005 Move the installer feature README to the new folder with `git mv` (`.skilled/hooks/hook-install/README.md`). Verify: `git ls-files .skilled/hooks/hook-install` prints nothing. Result: nothing printed.
- [x] T006 Delete the watchdog feature README with `git rm` (`.skilled/hooks/codex-watchdog/README.md`). Verify: `git ls-files .skilled/hooks/codex-watchdog` prints nothing and `ls -d .skilled/hooks/codex-watchdog .skilled/hooks/hook-install` prints `No such file or directory` twice. Result: `git ls-files` printed nothing. `git mv` left `hook-install/` as an empty folder, so `rmdir` removed it, and `ls -d` then printed `No such file or directory` twice.
- [x] T007 Rewrite the feature README to cover both checks, with each runtime row checked against the registry, the plugin and the installer (`.skilled/hooks/codex-global-hooks-check/README.md`). Verify: `python3 $SK/shared/scripts/validate_document.py $NEW/README.md` prints `VALID`, `python3 $SK/sk-create-with-human-voice/scripts/hvr_scan.py $NEW/README.md` prints `hard blockers: 0`, and `rg -c 'install-codex-hooks.mjs --check|CODEX_HOOKS_WATCHDOG_DISABLED|SYSTEM_HOOK_INSTALL_DISABLED' $NEW/README.md` prints 3 or more. Result: `VALID`, `hard blockers: 0` and a count of 8. Each runtime row was written from `hook-registry.json`, the plugin and the installer.
- [x] T008 [P] Correct the folder name in the four moved leaf READMEs (`.skilled/hooks/codex-global-hooks-check/claude/README.md`). Verify: `rg -c 'hook-install/|codex-watchdog/' $NEW` prints nothing. Result: nothing printed. The overview line of each leaf README now writes the full path, `.skilled/hooks/codex-global-hooks-check/<runtime>/`, because the short form did not resolve in `check_readme_references.py` before or after the move.
- [x] T009 [P] Name the new folder in the list of symlink-only concern folders on line 215 (`.skilled/hooks/README.md`). Verify: `rg -c 'codex-global-hooks-check/' .skilled/hooks/README.md` prints 1 or more and `rg -c 'codex-watchdog/' .skilled/hooks/README.md` prints nothing. Result: 1, and nothing for the old name.
- [x] T010 [P] Head the `codex-watchdog` section with the new folder and name its four runtime folders (`.skilled/hooks/coverage-rationale.md`). Verify: `rg -c 'codex-global-hooks-check' .skilled/hooks/coverage-rationale.md` prints 1 or more and `rg -c '^### .codex-watchdog' .skilled/hooks/coverage-rationale.md` prints nothing. Result: 1, and nothing for the old heading. The section now states which runtimes hold a folder and how Pi and DSH run the check.
- [x] T011 [P] Name the new folder once in the core list of "Shared Hook Cores" (`README.md`). Verify: `rg -c 'codex-global-hooks-check' README.md` prints 1 and `rg -c 'hook-install|codex-watchdog' README.md` prints nothing. Result: 1, and nothing for the old names.
- [x] T012 Check every link and path in the READMEs this phase wrote or edited (`.skilled/hooks/codex-global-hooks-check/README.md`). Verify: `python3 $SK/sk-create-readme/scripts/check_readme_references.py $NEW/README.md $NEW/*/README.md .skilled/hooks/README.md README.md` prints `SUMMARY files=7 pass=7 fail=0`. Result: `SUMMARY files=7 pass=7 fail=0`.
- [x] T013 Rebase the durable directory manifest with `test_readme_manifest.py --write` (`.skilled/skills/sk-doc/scripts/tests/code-folder/durable-directory-manifest.json`). Verify: `python3 $SK/scripts/tests/test_readme_manifest.py` prints `manifest=reproducible`, and `rg -c 'hooks/(codex-watchdog|hook-install)' $SK/scripts/tests/code-folder/durable-directory-manifest.json` prints nothing. Result: the writer printed `directories=920` and the test printed `manifest=reproducible`. The `rg -c` printed nothing.
- [x] T014 Rebase the README verdict baseline with `test_readme_verdict_parity.py --write` (`.skilled/skills/sk-doc/scripts/tests/code-folder/baseline-readme-verdicts.json`). Verify: `python3 $SK/scripts/tests/test_readme_verdict_parity.py` prints `PARITY PASS`. Result: the writer printed `1141 tracked README files` and the test printed `PARITY baseline_files=1141 post_files=1141 diff_entries=0` and `PARITY PASS`. A row diff against the phase 1 file shows six old rows out and five new rows in.
- [x] T015 Regenerate the trigger index and its fixture files with `generate-trigger-index.mjs` (`.skilled/skills/system-spec-kit/runtime/data/trigger-index.json`). Verify: `node .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs --check` prints `trigger index matches the corpus`. Result: `trigger index matches the corpus`, with 0 stale documents and 0 obsolete paths.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T016 Run the old-folder search from the final state (`.skilled/hooks/`). Verify: `$SEARCH` prints nothing. Result: nothing printed. The same search printed 42 lines before the move.
- [x] T017 Compare the bare-name counts with the expected column of the `plan.md` table (`scratch/bare-after.txt`). Verify: `$BARE` prints 13 lines, with `coverage-rationale.md:1`, `.skilled/hooks/README.md:4` and no `./README.md` line, and every other line equal to its line in `scratch/bare-before.txt`. Result: 13 lines. `diff scratch/bare-before.txt scratch/bare-after.txt` shows only `coverage-rationale.md` 2 to 1, `.skilled/hooks/README.md` 5 to 4 and the `./README.md` line gone.
- [x] T018 Confirm no code, registry entry or switch changed (`.skilled/hooks/shared/hook-flags.cjs`). Verify: `git diff --stat HEAD -- .skilled/hooks/shared/hook-flags.cjs .opencode/plugins/codex-hooks-watchdog.js .skilled/bin/install-codex-hooks.mjs .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json` prints nothing. Result: nothing printed.
- [x] T019 Rerun every gate in the `plan.md` baseline table from the final state (`../scratch/baseline/baseline.sh`). Verify: the Vitest tree prints 501 passed, the `node --test` suites print 1 fail naming only the case in `hook-stdin-deadline.test.mjs`, the plugin tests print `fail 0`, both sync checks print PASS, the three bash test files end with `0 failed` and both README tests exit 0. Result: Vitest 501 passed. `node --test` 1839 tests, 1838 pass and 1 fail, the named case. Plugin tests 591 pass and `fail 0`. Both sync checks PASS. `files=46` and `RESULT: PASSED`, then 61, 152 and 56 passed with `0 failed`. `PARITY PASS` at 1141 files and `manifest=reproducible` at 920 directories. Hook READMEs: `validate_document.py` 183 of 183, `hvr_scan.py` 158 pass and 25 fail, down from 27.
- [x] T020 Write what changed and how it was checked (`implementation-summary.md`). Verify: `rg -c 'YOUR_VALUE_HERE' implementation-summary.md` in this phase folder prints nothing.
- [x] T021 Run strict validation on this phase folder (`spec.md`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <this folder> --strict --quiet` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] `find $NEW -type l` lists 4 links that resolve and `$SEARCH` prints nothing
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`. Its ARCHITECTURE DECISION RECORD section holds ADR-001 to ADR-003.
- **Acceptance criteria**: See `acceptance-criteria.md`
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

A task that hits three failed fixes for the same symptom is marked `[B]` with the failing command and its output, and the phase stops for the operator.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md. `rg -c '^\| REQ-' spec.md` prints 8.
- [x] CHK-002 [P0] Technical approach defined in plan.md. `rg -c '^### ADR-' plan.md` prints 3.
- [x] CHK-003 [P1] The bare-name counts exist before the first move. `wc -l < scratch/bare-before.txt` prints 14. Evidence: printed 14, before the first `git mv`.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Every moved link resolves. `find $NEW -type l ! -exec test -e {} \; -print` prints nothing. Evidence: printed nothing from the final state, with 4 links listed.
- [x] CHK-012 [P1] N/A. The phase edits no code file, so no comment changes. Evidence: the diff holds no `.js`, `.mjs`, `.cjs`, `.ts` or `.sh` content change. The four moved links are renames with no content.
- [x] CHK-013 [P1] The diff touches only the files in `spec.md` section 3. `git status --short` lists no other path outside this packet and the phase 1 paths. Evidence: `git status --short` lists the moved folder, `.skilled/hooks/README.md`, `coverage-rationale.md`, `README.md` and the six pinned files. Every other path is a phase 1 path or this packet.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met. Every row in `acceptance-criteria.md` reads `Met`. Evidence: `rg -c` found 9 `Met` rows and no `Unmet` row.
- [x] CHK-021 [P0] The old-folder search is empty. `$SEARCH` prints nothing. Evidence: printed nothing from the final state. It printed 42 lines before the move.
- [x] CHK-022 [P1] The bare-name counts match the `plan.md` table. T017 recorded the 13 lines. Evidence: `scratch/bare-after.txt` holds the 13 lines of the expected column.
- [x] CHK-023 [P1] The new feature README passes its three checkers. T007 and T012 recorded `VALID`, `hard blockers: 0` and `pass=7`. Evidence: `VALID`, `hard blockers: 0` and `SUMMARY files=7 pass=7 fail=0`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets. The diff adds no credential, token or key. Evidence: the diff adds README text and regenerated lists only.
- [x] CHK-031 [P0] Both kill switches keep their names and readers. The T018 diff prints nothing. Evidence: the T018 diff printed nothing, and the new README names both switches.
- [x] CHK-032 [P1] N/A. The phase touches no authentication or authorization path. Evidence: no such path is in `git status --short`.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan and tasks agree on the file list. Each path in `spec.md` section 3 appears in one task. Evidence: each row of the Files to Change table maps to T003 to T015.
- [x] CHK-041 [P1] Each runtime row of the feature README states current fact. Each was checked against `hook-registry.json`, the plugin source or the installer source. Evidence: events, slots and timeouts come from `hook-registry.json:746-790`. The OpenCode row comes from `codex-hooks-watchdog.js`. The Pi and DSH rows come from the two `session-start-advisories` files. The modes, flags and the worktree guard come from `install-codex-hooks.mjs`, and `--check`, the kill switch and `--dry-run` were run.
- [x] CHK-042 [P2] The three docs outside the new folder changed only on the named lines. `git diff --stat` against the phase 1 state shows a single-digit line count for each. Evidence: one line changed in `.skilled/hooks/README.md`, one in `README.md` and the three lines of one section in `coverage-rationale.md`.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only. `git status --short` shows no stray file outside the packet and the scoped paths. Evidence: `scratch/bare-before.txt` and `scratch/bare-after.txt` are the only files this phase created outside the scoped paths.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 8/8 |
| P1 Items | 13 | 13/13 |
| P2 Items | 2 | 2/2 |

**Verification Date**: 2026-11-15
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: Architecture Verification

- [x] CHK-100 [P0] Architecture decisions documented in `plan.md`'s ARCHITECTURE DECISION RECORD section. `rg -c '^### ADR-' plan.md` prints 3.
- [x] CHK-101 [P1] All ADRs have status. `rg -c '^\*\*Status\*\*: Accepted' plan.md` prints 3.
- [x] CHK-102 [P1] Alternatives documented with rejection rationale. `rg -c '^\*\*Alternatives Rejected\*\*' plan.md` prints 3.
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification

- [x] CHK-140 [P1] `plan.md` and `tasks.md` agree on the surfaces. Each row of the plan's affected-surfaces table that has an action has a task. Evidence: the six rows with an action map to T003 to T015. The five rows marked unchanged or not a consumer have no task.
- [x] CHK-141 [P1] N/A. The phase changes no API. Evidence: no exported symbol or command changed.
- [x] CHK-142 [P2] The parent phase map shows this phase's status. `rg -n '002-codex-hook-check-merge/' ../spec.md` prints the row with its current status. Evidence: the row reads `Complete`.
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Operator | Decides commit, merge and push | [ ] Approved | |
<!-- /ANCHOR:sign-off -->
