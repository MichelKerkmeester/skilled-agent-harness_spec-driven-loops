---
title: "Tasks: Phase 1: dead-hook-file-removal"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "dead hook file removal tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 1: dead-hook-file-removal

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

Every command runs from the worktree root, `/Users/michelkerkmeester/worktrees/public/411-hook-library-cleanup`, unless the task says main checkout. `PC` is `.skilled/scripts/git-hooks/tests/pre-commit.test.sh`. `GT` is `.github/scripts/tests/check-gate-inputs.test.sh`. `SEARCH` is `rg -n --hidden -g '!specs/**' -g '!**/changelog/**' -g '!**/node_modules/**' 'hooks/git($|[^-a-z])|hook-flags\.(ts|\{[^}]*\bts\b)' .`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Capture the baseline of every gate in the worktree before the first edit (`../scratch/baseline/summary.txt`). Verify: `rg -c 'BASELINE_DONE' ../scratch/baseline/summary.txt` prints 1.
- [x] T002 Remove the five untracked stray paths under `.skilled/hooks/` on the main checkout after backing up the one log (`.skilled/hooks/session-relaunch`). Verify: `ls .skilled/hooks/session-relaunch .skilled/hooks/decision-capture/.skilled .skilled/hooks/dispatch/node_modules` on the main checkout prints `No such file or directory` three times.
- [x] T003 Read the legacy helper section and list which assertions each of the nine `run_legacy` calls owns (`.skilled/scripts/git-hooks/tests/pre-commit.test.sh`). Verify: `rg -c 'run_legacy' $PC` prints 10.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Delete the four files of the legacy pre-commit folder with `git rm` (`.skilled/hooks/git/`). Verify: `git ls-files .skilled/hooks/git` prints nothing.
- [x] T005 Remove the legacy helper section, the `run_legacy` function and its nine cases (`.skilled/scripts/git-hooks/tests/pre-commit.test.sh`). Verify: `rg -c 'run_legacy|LEGACY' $PC` prints nothing and `bash $PC` ends with `0 failed`. Result: `152 passed, 0 failed`, the baseline 163 minus the 11 assertions of the nine removed cases.
- [x] T006 Remove `hooks/git/pre-commit` from `GATE_FILES` and the header line that lists the legacy helper (`.github/scripts/check-gate-inputs.sh`). Verify: `bash .github/scripts/check-gate-inputs.sh` prints `files=46` and `RESULT: PASSED`.
- [x] T007 Remove the entry from `GATES` and point cases 14 and 43 to 47 at the fixture `bin/check-git-hooks.sh` (`.github/scripts/tests/check-gate-inputs.test.sh`). Verify: `rg -c 'hooks/git' $GT` prints nothing and `bash $GT` prints `61 passed, 0 failed`.
- [x] T008 Run the negative control on re-pointed case 14 by removing its appended line once and restoring it (`.github/scripts/tests/check-gate-inputs.test.sh`). Verify: `bash $GT` prints `1 failed` without the line and `61 passed, 0 failed` with it. Result: `60 passed, 1 failed` without the line, `61 passed, 0 failed` with it.
- [x] T009 [P] Remove the history lookup of the legacy pre-commit and the two cases that run it (`.github/scripts/tests/broken-move-drill.sh`). Verify: `rg -c 'hooks/git|legacy-pre-commit' .github/scripts/tests/broken-move-drill.sh` prints nothing and `bash -n .github/scripts/tests/broken-move-drill.sh` exits 0.
- [x] T010 [P] Remove `hooks/git/pre-commit` from `SELECTING` and `hooks/git/install-hooks.sh` from `SCANNED` (`.skilled/scripts/git-hooks/tests/source-root-selection.test.sh`). Verify: `rg -c 'hooks/git' .skilled/scripts/git-hooks/tests/source-root-selection.test.sh` prints nothing and the test ends with `0 failed`. Result: `56 passed, 0 failed`, the baseline 60 minus the four checks on the two removed list entries.
- [x] T011 [P] Remove the "Run the hook installer test" step and the comment clause that names it (`.github/workflows/opencode-plugin-tests.yml`). Verify: `rg -c 'install-hooks|installer test' .github/workflows/opencode-plugin-tests.yml` prints nothing and `python3 -c "import yaml;yaml.safe_load(open('.github/workflows/opencode-plugin-tests.yml'))"` exits 0. Result: both commands as stated. Deviation: the row for this workflow in `.github/workflows/README.md` named the installer test, so that clause was removed too.
- [x] T012 Delete the TypeScript flags facade with `git rm` (`.skilled/hooks/shared/hook-flags.ts`). Verify: `git ls-files .skilled/hooks/shared/hook-flags.ts` prints nothing.
- [x] T013 Remove the `ts` binding and its assertions from the three tests that import the facade (`.skilled/hooks/shared/hook-flags.test.cjs`). Verify: `node --test .skilled/hooks/shared/hook-flags.test.cjs` prints `ℹ tests 31` and `ℹ fail 0`.
- [x] T014 [P] Correct lines 45, 60 and 78, which name the facade (`.skilled/hooks/shared/README.md`). Verify: `rg -c 'hook-flags\.ts' .skilled/hooks/shared/README.md` prints nothing.
- [x] T015 [P] Correct the title, the description and the five places that name the `git/` folder (`.skilled/hooks/README.md`). Verify: `rg -c '\./git/|`git/`' .skilled/hooks/README.md` prints nothing.
- [x] T016 [P] Drop the legacy helper from the consumers of `bounded-git.sh` on line 42 (`.skilled/scripts/git-hooks/lib/README.md`). Verify: `rg -c 'hooks/git/' .skilled/scripts/git-hooks/lib/README.md` prints nothing.
- [x] T017 [P] List only the primary pre-commit as the reader of the kill switch on line 104 (`.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md`). Verify: `rg -c 'hooks/git/' .skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md` prints nothing.
- [x] T018 [P] Point lines 54 and 74 at the primary installer and the primary pre-commit (`.skilled/skills/system-spec-kit/manual-testing-playbook/ux-hooks/comment-hygiene-opencode-plugin.md`). Verify: `rg -c 'hooks/git/' .skilled/skills/system-spec-kit/manual-testing-playbook/ux-hooks/comment-hygiene-opencode-plugin.md` prints nothing.
- [x] T019 [P] Remove the legacy pre-commit from the sentence on line 276 (`.skilled/skills/sk-code/sk-code-skilled/references/shared/universal-patterns/naming-and-commenting.md`). Verify: `rg -c 'hooks/git/' .skilled/skills/sk-code/sk-code-skilled/references/shared/universal-patterns/naming-and-commenting.md` prints nothing.
- [x] T020 [P] Remove the legacy pre-commit from the sentence on line 144 (`.skilled/skills/sk-code/sk-code-quality/SKILL.md`). Verify: `rg -c 'hooks/git/' .skilled/skills/sk-code/sk-code-quality/SKILL.md` prints nothing.
- [x] T021 Rebase the durable directory manifest with `test_readme_manifest.py --write` (`.skilled/skills/sk-doc/scripts/tests/code-folder/durable-directory-manifest.json`). Verify: `python3 .skilled/skills/sk-doc/scripts/tests/test_readme_manifest.py` prints `manifest=reproducible` and `git diff --stat` on the file shows one deletion. Result: `manifest=reproducible`. Deviation: the writer also re-sorted the eight `session-handover` rows, so the diff is one deletion plus that reorder.
- [x] T022 Rebase the README verdict baseline with `test_readme_verdict_parity.py --write` (`.skilled/skills/sk-doc/scripts/tests/code-folder/baseline-readme-verdicts.json`). Verify: `python3 .skilled/skills/sk-doc/scripts/tests/test_readme_verdict_parity.py` prints `baseline_files=1136` and `PARITY PASS`. Result: `PARITY PASS`. Deviation: `baseline_files=1142`, not 1136. The committed baseline lacked six READMEs that exist at the base commit, and the writer added them.
- [x] T023 Regenerate the trigger index and its fixture files with `generate-trigger-index.mjs` (`.skilled/skills/system-spec-kit/runtime/data/trigger-index.json`). Verify: `node .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs --check` exits 0 and `rg -c 'hooks/git/README' .skilled/skills/system-spec-kit/runtime/data/trigger-index.json` prints nothing. Deviation: the trigger phrase `hook-flags.ts removal` in this phase's `spec.md` reached a generated fixture and matched `SEARCH`, so the phrase was reworded and the index regenerated.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T024 Run the repo-wide reference search from the final state (`.skilled/hooks/`). Verify: `$SEARCH` prints nothing. Deviation: the second review found three lines that named the deleted facade in brace form, `hook-flags.{cjs,mjs,ts,sh}`, which the first `SEARCH` pattern could not match. They were in `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md`, `.skilled/commands/doctor/assets/doctor-env.yaml` and `.skilled/hooks/hook-flags.env.example`. The last two are not in the `spec.md` file table. All three now read `{cjs,mjs,sh}`, and `SEARCH` was widened to match the brace form. The widened pattern prints 1 match against the base-commit copy of `doctor-env.yaml` and nothing from the final state. The third review found one more line that no path search can match: `.skilled/scripts/git-hooks/tests/README.md` said of `pre-commit.test.sh` that "The legacy hygiene helper gets the same cases". That sentence was deleted. The file is not in the `spec.md` file table. Every other doc line that describes an edited test, script or workflow was then read, and none describes a removed case. After the phase closed, the phase 2 planning read found two more mentions that name the folder only as `git`: the list of git cores in the root `README.md` and a `git` section in `.skilled/hooks/coverage-rationale.md`. Both were removed. Neither file is in the `spec.md` file table. Every file that names another hook folder was then searched for a bare `git` entry, and no other was found. The same read ran `check_readme_references.py` on `.skilled/hooks/README.md`, which failed: the `readme-check` block still allowed the reference `runtime-hooks/`, and the sentence that held it was removed with the `git/` paragraph. The unused allow line was deleted and the checker passes.
- [x] T025 Rerun every gate in the `plan.md` baseline table from the final state (`../scratch/baseline/summary.txt`). Verify: the Vitest tree prints 501 passed, the `node --test` suites print 1 fail naming only the baseline case in `hook-stdin-deadline.test.mjs`, the plugin tests print `fail 0`, both sync checks print PASS, `bash $PC` and `bash $GT` end with `0 failed`, and both README tests exit 0.
- [x] T026 Write what changed, how it was checked and the release-note sentence about the removed standalone pre-commit (`implementation-summary.md`). Verify: `rg -c 'install-git-hooks.sh' implementation-summary.md` prints 1 or more.
- [x] T027 Run strict validation on this phase folder (`spec.md`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <this folder> --strict --quiet` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] `git ls-files .skilled/hooks/git .skilled/hooks/shared/hook-flags.ts` prints nothing and `$SEARCH` prints nothing
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

- [x] CHK-001 [P0] Requirements documented in spec.md. `rg -c '^\| REQ-' spec.md` prints 9.
- [x] CHK-002 [P0] Technical approach defined in plan.md. `rg -c '^### ADR-' plan.md` prints 3.
- [x] CHK-003 [P1] The baseline exists before the first edit. `rg -c 'BASELINE_DONE' ../scratch/baseline/summary.txt` prints 1.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Every edited shell script parses. `bash -n` exits 0 on `check-gate-inputs.sh`, `$GT`, `$PC`, `broken-move-drill.sh` and `source-root-selection.test.sh`. Evidence: `bash -n` exited 0 on all five scripts on 2026-11-15.
- [x] CHK-011 [P0] The edited workflow parses as YAML. The `yaml.safe_load` command in T011 exits 0. Evidence: `yaml.safe_load` printed no error and exited 0.
- [x] CHK-012 [P1] No edited comment names a spec path, packet number or task id. `rg -n 'specs/|T0[0-9][0-9]|REQ-|ADR-' ` over the edited scripts prints no new line. Evidence: The two edited comments, in `check-gate-inputs.sh` and the workflow, name no id. The quality gate reported `p0_blocking: 0`, `p1_open: 0`.
- [x] CHK-013 [P1] The diff touches only the files in `spec.md` section 3. `git status --short` lists no other path outside this packet. Evidence: One exception, recorded as a deviation: `.github/workflows/README.md`, whose row for the edited workflow named the removed step.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met. Every row in `acceptance-criteria.md` reads `Met`. Evidence: `rg -c '\| Met \|' acceptance-criteria.md` printed 11 and `rg -c '\| Unmet \|' acceptance-criteria.md` printed nothing.
- [x] CHK-021 [P0] The reference search is empty. `$SEARCH` prints nothing. Evidence: `SEARCH` printed nothing and exited 1 from the final state.
- [x] CHK-022 [P1] The negative control ran. T008 recorded `1 failed` without the appended line. Evidence: T008 recorded `60 passed, 1 failed` without the appended line.
- [x] CHK-023 [P1] The kill switch still works. The cases in `$PC` that set `SYSTEM_GIT_COMMIT_HOOKS_DISABLED` pass. Evidence: `rg -c` on the switch name printed 4 and the file ended with `152 passed, 0 failed`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets. The diff adds no credential, token or key. Evidence: The quality gate credential check reported no finding.
- [x] CHK-031 [P0] The commit gates stay enforced. `bash $PC` passes its comment-hygiene and mirror-sync cases against the primary pre-commit. Evidence: `bash $PC` printed `152 passed, 0 failed` against the primary pre-commit.
- [x] CHK-032 [P1] N/A. The phase touches no authentication or authorization path. Evidence: N/A as stated.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan and tasks agree on the file list. Each path in `spec.md` section 3 appears in one task. Evidence: Every row of the `spec.md` file table has a task from T004 to T023.
- [x] CHK-041 [P1] Each corrected doc line states current fact. `$SEARCH` prints nothing. Evidence: `SEARCH` printed nothing from the final state.
- [ ] CHK-042 [P2] The two hook READMEs changed only on the named lines. `git diff --stat` shows a single-digit line count for each. Not met as written and deferred: `shared/README.md` shows 8 lines and the root README shows 17, because its title, description and five other places named `git/`. Every changed line names a removed file.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only. `git status --short` shows no stray file outside the packet and the scoped paths. Evidence: `git status --short` lists only the scoped paths, the packet and the one deviation file.
- [x] CHK-051 [P1] The parent `scratch/baseline/` keeps only `summary.txt` and `baseline.sh`, which later phases read and rerun. Evidence: `ls ../scratch/baseline` printed those two names. Deviation: this item first named `summary.txt` alone.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 9 | 9/9 |
| P1 Items | 14 | 14/14 |
| P2 Items | 3 | 2/3 |

**Verification Date**: 2026-11-15
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: Architecture Verification

- [x] CHK-100 [P0] Architecture decisions documented in `plan.md`'s ARCHITECTURE DECISION RECORD section. `rg -c '^### ADR-' plan.md` prints 3.
- [x] CHK-101 [P1] All ADRs have status. `rg -c '^\*\*Status\*\*: Accepted' plan.md` prints 3.
- [x] CHK-102 [P1] Alternatives documented with rejection rationale. `rg -c '^\*\*Alternatives Rejected\*\*' plan.md` prints 3.
- [x] CHK-103 [P2] The replacement for an outside repository is documented. The release-note sentence in `implementation-summary.md` names `.skilled/scripts/install-git-hooks.sh`. Evidence: `rg -c 'install-git-hooks.sh' implementation-summary.md` printed 1.
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification

- [x] CHK-140 [P1] `plan.md` and `tasks.md` agree on the surfaces. Each row of the plan's affected-surfaces table has a task. Evidence: Every row of the affected-surfaces table maps to a task from T004 to T023.
- [x] CHK-141 [P1] N/A. The phase changes no API. Evidence: N/A as stated.
- [x] CHK-142 [P2] The parent phase map shows this phase's status. `rg -n '001-dead-hook-file-removal/' ../spec.md` prints the row with its current status. Evidence: the row ends with `Complete`.
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Operator | Decides commit, merge and push | [ ] Approved | |
<!-- /ANCHOR:sign-off -->
