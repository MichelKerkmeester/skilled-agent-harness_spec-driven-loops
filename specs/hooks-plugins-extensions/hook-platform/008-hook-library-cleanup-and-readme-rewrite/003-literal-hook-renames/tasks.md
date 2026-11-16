---
title: "Tasks: Phase 3: literal-hook-renames"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "literal hook renames tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 3: literal-hook-renames

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

Every command runs from the worktree root, `/Users/michelkerkmeester/worktrees/public/411-hook-library-cleanup`. `H` is `.skilled/hooks`. `PKT` is this phase folder. `SK` is `.skilled/skills/sk-doc`. `MIR` is `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors`.

- `EXCL` is `-g '!specs/**' -g '!**/changelog/**' -g '!**/node_modules/**' -g '!**/benchmark/reports/**' -g '!**/fixtures/question-screens/**'`.
- `GEN` is `-g '!.claude/settings.json' -g '!.codex/hooks.json' -g '!.cursor/hooks.json' -g '!.devin/hooks.v1.json' -g '!**/code-folder/*.json' -g '!**/runtime/data/trigger-index.json' -g '!**/retrieval/fixtures/*.json'`. It leaves out the files a writer renders.
- `SEARCH` is `rg -n --hidden EXCL -e 'hooks/(dispatch|task-dispatch|completion)/' -e 'claude-posttooluse\.cjs' -e 'ask-capture-post' -e '(^|[^a-z-])dispatch-guard\.cjs' -e '(^|[^a-z-])(compact-pointer|context-nudge|stop-arm|prompt-seed|subagent-guard)\.mjs' .`.
- `REL` is `rg -n --hidden EXCL -P -e '(?<![a-z-])(?<!hooks/)(dispatch|task-dispatch|completion)/(lib|claude|codex|cursor|devin|dsh|pi|opencode|vibe|tests)\b' .`.
- `SEG` is `rg -n -U --hidden EXCL -e "['\"]hooks['\"],\s*['\"](dispatch|task-dispatch|completion)['\"]" .`.
- `BARE` is `rg -n -g '!*.json' -e '(^|[^a-z/.-])(dispatch|task-dispatch|completion)/' .skilled/hooks`.
- `FILES <pattern>` is `rg -l --hidden EXCL GEN -e '<pattern>' .`. `REPLACE <pattern> <substitution>` pipes that list into `xargs perl -pi -e '<substitution>'`.
- `SYNC` is `node $MIR/sync-hook-registrations.cjs`, then `node $MIR/sync-runtime-mirrors.cjs`, then each again with `--check`.
- `LINKS` is `find .skilled/hooks .claude/hooks .codex/hooks .cursor/hooks .devin/hooks .dsh/plugins/repo-guards/adapters .pi/extensions -type l ! -exec test -e {} \; -print`.
- `SUITES` is the hook Vitest tree, the hook `node --test` suites and the OpenCode plugin tests, run as rows 1 to 3 of `../scratch/baseline/baseline.sh` run them.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Rerun every baseline gate before the first rename (`../scratch/baseline/baseline.sh`). Verify: the run's `summary.txt` ends with `BASELINE_DONE`, Vitest prints 501 passed, the `node --test` suites print 1838 pass and 1 fail, the plugin tests print 591 pass and both sync checks print PASS.
- [x] T002 Save the outputs of `SEARCH`, `REL`, `SEG` and `BARE`, the hook id list and the `check_readme_references.py` summary over the hook READMEs (`scratch/search-before.txt`). Verify: `wc -l` on the four search files in `PKT/scratch` prints 558, 20, 7 and 34, and `wc -l < scratch/hook-ids-before.txt` prints 35.
- [x] T003 Save the working-tree patch as the rollback reference (`scratch/pre-phase3.patch`). Verify: `git diff HEAD --binary | diff -q - PKT/scratch/pre-phase3.patch` prints nothing.
- [x] T004 Confirm phase 002 is closed before the first move (`../002-codex-hook-check-merge/spec.md`). Verify: `rg -c '\*\*Status\*\* \| Complete' ../002-codex-hook-check-merge/spec.md` in this phase folder prints 1.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

Rename R1, `dispatch/` to `cli-dispatch/`:

- [x] T010 Move the folder with `git mv` (`.skilled/hooks/dispatch`). Verify: `git ls-files $H/cli-dispatch | wc -l` prints 34, `git ls-files $H/dispatch` prints nothing and `ls -d $H/dispatch` prints `No such file or directory`.
- [x] T011 Run `REPLACE 'hooks/dispatch/' 's{hooks/dispatch/}{hooks/cli-dispatch/}g'` (`.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json`). Verify: `FILES 'hooks/dispatch/'` prints nothing.
- [x] T012 Point the quoted-segment and quoted-relative `dispatch` paths at `cli-dispatch` in three test files (`.skilled/hooks/shared/hook-stdin-deadline.test.mjs`). Verify: `rg -n "'dispatch/" $H/shared/hook-stdin-deadline.test.mjs` prints nothing, and `rg -n "'hooks', 'dispatch'" .skilled/skills/cli-external-orchestration/cli-opencode/scripts/tests/opencode-setup-classify.test.cjs .skilled/commands/doctor/scripts/tests/opencode-version-battery.test.cjs` prints nothing.
- [x] T013 Run `SYNC`, `LINKS` and `SUITES`, then the two segment-path tests and the `sk-git` rule test with `node --test` (`.claude/settings.json`). Verify: both checks print PASS, `LINKS` prints nothing, `SUITES` print the T001 counts and the three `node --test` runs print `fail 0`.

Rename R2, `task-dispatch/` to `subagent-dispatch-guard/`:

- [x] T014 Move the folder with `git mv` (`.skilled/hooks/task-dispatch`). Verify: `git ls-files $H/subagent-dispatch-guard | wc -l` prints 18, `git ls-files $H/task-dispatch` prints nothing and `ls -d $H/task-dispatch` prints `No such file or directory`.
- [x] T015 Run `REPLACE 'hooks/task-dispatch/' 's{hooks/task-dispatch/}{hooks/subagent-dispatch-guard/}g'` (`.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json`). Verify: `FILES 'hooks/task-dispatch/'` prints nothing.
- [x] T016 Point the quoted-segment and quoted-relative `task-dispatch` paths at `subagent-dispatch-guard` in three test files (`.opencode/plugins/tests/claude-task-dispatch-guard.test.cjs`). Verify: `SEG` prints nothing, and `rg -n "'task-dispatch/" $H/shared/hook-stdin-deadline.test.mjs` prints nothing.
- [x] T017 Run `SYNC`, `LINKS` and `SUITES` (`.claude/settings.json`). Verify: both checks print PASS, `LINKS` prints nothing and `SUITES` print the T001 counts.

Rename R3, `dispatch-guard.cjs` to `subagent-dispatch-guard.cjs`:

- [x] T018 Move the core file with `git mv` (`.skilled/hooks/subagent-dispatch-guard/lib/dispatch-guard.cjs`). Verify: `ls $H/subagent-dispatch-guard/lib/subagent-dispatch-guard.cjs` prints the path and `find $H -name 'dispatch-guard.cjs'` prints nothing.
- [x] T019 Run `REPLACE '(^|[^a-z-])dispatch-guard\.cjs' 's{(?<![a-z-])dispatch-guard\.cjs}{subagent-dispatch-guard.cjs}g'` (`.opencode/plugins/system-deep-loop-guard.js`). Verify: `FILES '(^|[^a-z-])dispatch-guard\.cjs'` prints nothing and `rg -c 'task-dispatch-guard\.cjs' $MIR/hook-registry.json` prints 2.
- [x] T020 Run `SYNC`, `LINKS` and `SUITES` (`.claude/settings.json`). Verify: both checks print PASS, `LINKS` prints nothing and `SUITES` print the T001 counts.

Rename R4, `completion/` to `completion-evidence/`:

- [x] T021 Move the folder with `git mv` (`.skilled/hooks/completion`). Verify: `git ls-files $H/completion-evidence | wc -l` prints 19, `git ls-files $H/completion` prints nothing and `ls -d $H/completion` prints `No such file or directory`.
- [x] T022 Run `REPLACE 'hooks/completion/' 's{hooks/completion/}{hooks/completion-evidence/}g'` (`.skilled/skills/system-spec-kit/runtime/tests/completion-evidence-sentinel.vitest.ts`). Verify: `FILES 'hooks/completion/'` prints nothing.
- [x] T023 Run `SYNC`, `LINKS` and `SUITES` (`.dsh/plugins/repo-guards/adapters/completion-evidence.mjs`). Verify: both checks print PASS, `LINKS` prints nothing, `SUITES` print the T001 counts and `find $H/completion-evidence -type l | wc -l` prints 9.

Rename R5, `claude-posttooluse.cjs` to `post-edit-quality.cjs`:

- [x] T024 Move the adapter with `git mv` (`.skilled/hooks/post-edit-quality/claude/claude-posttooluse.cjs`). Verify: `ls $H/post-edit-quality/claude/post-edit-quality.cjs` prints the path and `find $H -name 'claude-posttooluse.cjs'` prints nothing.
- [x] T025 Run `REPLACE 'claude-posttooluse\.cjs' 's{claude-posttooluse\.cjs}{post-edit-quality.cjs}g'` (`.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json`). Verify: `FILES 'claude-posttooluse\.cjs'` prints nothing, and `git diff --stat HEAD -- .skilled/skills/sk-code/sk-code-quality/scripts/hooks/claude-posttooluse.sh $H/decision-capture/claude/fixtures` prints nothing.
- [x] T026 Run `SYNC`, `LINKS` and `SUITES` (`.claude/hooks/post-edit-quality.cjs`). Verify: both checks print PASS, `LINKS` prints nothing, `SUITES` print the T001 counts and `ls .claude/hooks/claude-posttooluse.cjs` prints `No such file or directory`.

Rename R6, the `handover-` prefix on eight session-handover adapters:

- [x] T027 Move the four Claude adapters and the four Codex adapters with `git mv` (`.skilled/hooks/session-handover/claude/stop-arm.mjs`). Verify: `find $H/session-handover/claude $H/session-handover/codex -name 'handover-*.mjs' | wc -l` prints 8, and `ls $H/session-handover/claude $H/session-handover/codex` lists `shared.mjs` and no other `.mjs` without the prefix.
- [x] T028 Run `REPLACE '(^|[^a-z-])(compact-pointer|context-nudge|stop-arm|prompt-seed|subagent-guard)\.mjs' 's{(?<![a-z-])(compact-pointer|context-nudge|stop-arm|prompt-seed|subagent-guard)\.mjs}{handover-$1.mjs}g'` (`.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json`). Verify: `FILES` with the same pattern prints nothing, `rg -c 'fable-subagent-guard\.mjs' $MIR/hook-registry.json` prints 1 and `ls $H/session-handover/tests/subagent-guard.test.cjs` prints the path.
- [x] T029 Run `SYNC`, `LINKS` and `SUITES` (`.codex/hooks.json`). Verify: both checks print PASS, `LINKS` prints nothing, `SUITES` print the T001 counts and `ls .claude/hooks .codex/hooks | rg -c '^handover-'` prints 8.

Rename R7, `ask-capture-*` to `decision-capture-*`:

- [x] T030 Move the six files with `git mv` (`.skilled/hooks/decision-capture/claude/ask-capture-posttooluse.mjs`). Verify: `find $H/decision-capture -name 'decision-capture-post*' | wc -l` prints 6 and `find $H -name 'ask-capture-*'` prints nothing.
- [x] T031 Run `REPLACE 'ask-capture-post' 's{ask-capture-posttooluse}{decision-capture-posttooluse}g; s{ask-capture-post-tool}{decision-capture-post-tool}g'` (`.vibe/hooks.toml`). Verify: `FILES 'ask-capture-post'` prints nothing and `rg -c 'decision-capture-post-tool\.mjs' .vibe/hooks.toml` prints 1.
- [x] T032 Run `SYNC`, `LINKS` and `SUITES` (`.devin/hooks.v1.json`). Verify: both checks print PASS, `LINKS` prints nothing and `SUITES` print the T001 counts.

Hand-read lines, the spec sub-track and the pinned lists:

- [x] T033 Read every `BARE` and `REL` line and name the new folder where the line means a folder (`.skilled/hooks/README.md`). Verify: `REL` prints nothing and `BARE` prints 3 lines, each holding `dispatch/spawn`.
- [x] T034 Read every bare `task-dispatch`, and every bare `dispatch` and `completion` in the hook docs and the root `README.md` core list, and record each as a folder or a concern key (`scratch/bare-words.txt`). Verify: `rg -c 'cli-dispatch|subagent-dispatch-guard|completion-evidence' README.md` prints 1, and `rg -n '^### .task-dispatch' $H/coverage-rationale.md` prints nothing. [DEVIATION: the root `README.md` count is 2, not 1. Line 1141 held "completion-evidence nudge" at `HEAD`, and line 1166 is the edited list.]
- [x] T035 Read the diff of every code file and every workflow the seven replacements changed (`.github/workflows/opencode-dual-version.yml`). Verify: `git diff HEAD --stat -- '*.mjs' '*.cjs' '*.js' '*.ts' '*.yml' '*.yaml' '*.toml'` lists no file outside the surfaces table in `plan.md`, and each changed line differs from its old line only in the replaced string.
- [x] T036 Dry-run the spec sub-track move with `relocate.mjs --from specs/hooks-plugins-extensions/dispatch --to specs/hooks-plugins-extensions/cli-dispatch` (`scratch/relocate-dry-run.txt`). Verify: the saved output lists the planned moves and `ls -d specs/hooks-plugins-extensions/dispatch` still prints the folder. [DEVIATION: `relocate.mjs` refuses a sub-track path ("is not NNN-slug"). The dry run and the apply named the one packet inside it, `dispatch/001-dispatch-adapter-test-repair` to `cli-dispatch/001-dispatch-adapter-test-repair`, and the tool declared the new sub-track. The refused output is `scratch/relocate-dry-run-refused.txt`.]
- [x] T037 Apply the spec sub-track move with `--apply` (`specs/hooks-plugins-extensions/dispatch`). Verify: `ls -d specs/hooks-plugins-extensions/cli-dispatch` prints the folder and `ls -d specs/hooks-plugins-extensions/dispatch` prints `No such file or directory`. [DEVIATION: the apply left the old sub-track as an empty container of three tracked files. `git rm -r -f` removed it and `refresh-track-roots.mjs --track hooks-plugins-extensions --apply` printed `remove dispatch (written)`. The first apply was refused because `scratch/relocate-dry-run.txt` named the moved path, so the saved outputs sat outside the tree during the apply. Output: `scratch/relocate-apply.txt`.]
- [x] T041 Rebase the durable directory manifest with `test_readme_manifest.py --write` (`.skilled/skills/sk-doc/scripts/tests/code-folder/durable-directory-manifest.json`). Verify: `python3 $SK/scripts/tests/test_readme_manifest.py` prints `manifest=reproducible` with 920 directories, and `rg -c 'hooks/(dispatch|task-dispatch|completion)(/|")' $SK/scripts/tests/code-folder/durable-directory-manifest.json` prints nothing.
- [x] T042 Rebase the README verdict baseline with `test_readme_verdict_parity.py --write` (`.skilled/skills/sk-doc/scripts/tests/code-folder/baseline-readme-verdicts.json`). Verify: `python3 $SK/scripts/tests/test_readme_verdict_parity.py` prints `PARITY PASS` with `baseline_files=1141`.
- [x] T043 Regenerate the trigger index and its fixture files with `generate-trigger-index.mjs` (`.skilled/skills/system-spec-kit/runtime/data/trigger-index.json`). Verify: `node .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs --check` prints `trigger index matches the corpus`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T050 Run the four searches from the final state (`.skilled/hooks/`). Verify: `SEARCH`, `REL` and `SEG` print nothing, and `BARE` prints 3 lines that hold `dispatch/spawn`.
- [x] T051 Compare the hook id list with the saved one and confirm the flag resolver is unchanged (`.skilled/hooks/shared/hook-flags.cjs`). Verify: `diff` of the id list against `scratch/hook-ids-before.txt` prints nothing and `git diff --stat HEAD -- $H/shared/hook-flags.cjs` prints nothing.
- [x] T052 Confirm the recorded output is unchanged (`.skilled/skills/cli-classifier/cli-jev/benchmark/reports`). Verify: `git diff --stat HEAD -- ':(glob)**/benchmark/reports/**' ':(glob)**/fixtures/question-screens/**'` prints nothing.
- [x] T053 Run the registered command of each Claude adapter whose path changed, from the worktree root with a payload on stdin (`.claude/settings.json`). Verify: each of the ten commands exits 0: the two CLI dispatch adapters, the two sub-agent guards, the post-edit-quality adapter, the four handover adapters and the decision-capture adapter. Evidence: `scratch/t053-adapter-runs.txt` shows 10 commands at exit 0 with no `mk-hook-drift` line. A registered command also exits 0 when its adapter is missing, so the run adds a control that names a path with no file, and the control did print the drift line.
- [x] T054 Rerun `check_readme_references.py` over the hook READMEs (`.skilled/hooks/README.md`). Verify: its `SUMMARY` line shows a `fail=` count no higher than the one T002 saved. [DEVIATION: the first rerun printed `fail=96` against 95. Two sibling links, `../dispatch/README.md` in `permission-policy/README.md` and `../completion/README.md` in `session-lifecycle/README.md`, start with `../`, a form none of the four searches matches. Both were pointed at the new folders, a search for `../<old folder>` then printed nothing, and the rerun printed `fail=95` with the same per-file rows. Output: `scratch/readme-refs-after.txt`.]
- [x] T055 Rerun every gate in the `plan.md` baseline table from the final state (`../scratch/baseline/baseline.sh`). Verify: each row prints its expected column, and the one failing `node --test` case has the name T001 saved. Evidence: `scratch/baseline-after/summary.txt` equals the T001 summary row for row, and the failing case has the saved name with `0 !== 2` at `hook-stdin-deadline.test.mjs:200`.
- [x] T056 Write what changed and how it was checked (`implementation-summary.md`). Verify: `rg -c 'YOUR_VALUE_HERE' implementation-summary.md` in this phase folder prints nothing.
- [x] T057 Run strict validation on this phase folder (`spec.md`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <this folder> --strict --quiet` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] `SEARCH`, `REL` and `SEG` print nothing, both sync checks print PASS and `LINKS` prints nothing
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`. Its ARCHITECTURE DECISION RECORD section holds ADR-001 to ADR-004.
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

A task that hits three failed fixes for the same symptom is marked `[B]` with the failing command and its output, and the phase stops for the operator. A rename whose `SYNC`, `LINKS` or `SUITES` step fails is repaired or rolled back before the next rename starts.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md. `rg -c '^\| REQ-' spec.md` prints 12. Evidence: printed 12.
- [x] CHK-002 [P0] Technical approach defined in plan.md. `rg -c '^### ADR-' plan.md` prints 4. Evidence: printed 4.
- [x] CHK-003 [P1] The before-state exists before the first move. `ls PKT/scratch` lists the four search files, `hook-ids-before.txt` and `pre-phase3.patch`. Evidence: `scratch/` holds `search-before.txt`, `rel-before.txt`, `seg-before.txt`, `bare-before.txt`, `hook-ids-before.txt` and `pre-phase3.patch`, saved by T002 and T003 before T010.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] No link dangles. `LINKS` prints nothing from the final state. Evidence: the dangling-link `find` printed nothing before its `LINKS_DONE` marker, after T055.
- [x] CHK-011 [P0] No code line changed beyond a path string. T035 recorded the diff read. Evidence: `scratch/diff-residual.txt` compares the working-tree diff with `pre-phase3.patch` after mapping old names to new on both sides. Eight lines remain, the four doc lines T034 judged, old and new. No code line is among them.
- [x] CHK-012 [P1] No code comment names a spec path, a packet number or a task id. `git diff HEAD -- '*.mjs' '*.cjs' '*.js' '*.ts'` adds no such comment. Evidence: a search of the added lines in the code diff for a spec path, an ADR, REQ, CHK or task id printed nothing.
- [x] CHK-013 [P1] The diff touches only the surfaces in `plan.md`. `git status --short` lists no other path outside this packet and the phase 1 and phase 2 paths. Evidence: `git status --short` lists the plan surfaces, this packet and the phase 1 and phase 2 paths. Three test files outside the spec file counts changed because they name a renamed path: `.opencode/plugins/tests/sk-code-post-edit-quality.test.cjs`, `decision-capture/lib/capture-core.test.mjs` and `sk-code-quality/scripts/tests/claude-posttooluse.test.sh`. `relocate.mjs` wrote `relocation-ledger.json` and `specs/descriptions.json`.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met. Every row in `acceptance-criteria.md` reads `Met`. Evidence: 12 rows read `Met` and none reads `Unmet`.
- [x] CHK-021 [P0] The old-name search is empty. `SEARCH` prints nothing. It printed 558 lines before the first rename. Evidence: printed 0 lines after T055.
- [x] CHK-022 [P0] The suites keep their counts. T055 recorded Vitest, `node --test` and the plugin tests. Evidence: 501 passed, 1838 pass with 1 fail, and 591 pass, the T001 counts.
- [x] CHK-023 [P1] Each Claude adapter whose path changed answers its registered command. T053 recorded ten exit codes. Evidence: `scratch/t053-adapter-runs.txt` ends with `registered=10 exit0_no_drift=10 control_exit=0 control_drift=true`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets. The diff adds no credential, token or key. Evidence: the phase replaces path strings only. The quality gate printed `gate=NO_BLOCKER_FOUND`. Its two `secret.private-key` findings are fixture lines 885 and 889 of `cli-dispatch/lib/dispatch-audit.test.mjs`, which `HEAD` holds unchanged under the old folder.
- [x] CHK-031 [P0] Every guard hook stays registered. The hook id list is unchanged and both sync checks print PASS. Evidence: the id list diff printed nothing with 35 ids on each side, and both sync checks printed PASS.
- [x] CHK-032 [P1] Every kill switch keeps its name and reader. The T051 diff on `hook-flags.cjs` prints nothing. Evidence: the diff printed nothing.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan and tasks agree on the file list. Each row of the Files to Change table in `spec.md` maps to a task. Evidence: the moves map to T010, T014, T018, T021, T024, T027 and T030, the registry and the hand-written files to the replacement tasks, the rendered files and links to the `SYNC` tasks, the sub-track to T036 and T037, and the pinned lists to T041 to T043.
- [x] CHK-041 [P1] Each bare folder mention was read. `scratch/bare-words.txt` holds one verdict per line T034 read. Evidence: `scratch/bare-words.txt` holds 23 lines of verdicts.
- [x] CHK-042 [P2] No README changed beyond a path or file name. `git diff HEAD --stat -- '*.md'` against the phase 2 state shows only replaced strings and the T033 and T034 lines. Evidence: `scratch/diff-residual.txt` shows the four T034 lines as the only doc lines that differ beyond a replaced string. T054 added two sibling-link lines, each a folder name inside a link.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only. `git status --short` shows no stray file outside the packet and the scoped paths. Evidence: every file this phase created sits in `scratch/` of this folder. `git status --short` lists no stray path.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 10 | 10/10 |
| P1 Items | 12 | 12/12 |
| P2 Items | 2 | 2/2 |

**Verification Date**: 2026-11-15
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: Architecture Verification

- [x] CHK-100 [P0] Architecture decisions documented in `plan.md`'s ARCHITECTURE DECISION RECORD section. `rg -c '^### ADR-' plan.md` prints 4. Evidence: printed 4.
- [x] CHK-101 [P1] All ADRs have status. `rg -c '^\*\*Status\*\*: Accepted' plan.md` prints 4. Evidence: printed 4.
- [x] CHK-102 [P1] Alternatives documented with rejection rationale. `rg -c '^\*\*Alternatives Rejected\*\*' plan.md` prints 4. Evidence: printed 4.
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification

- [x] CHK-140 [P1] `plan.md` and `tasks.md` agree on the surfaces. Each row of the plan's affected-surfaces table that has an action has a task. Evidence: each surface row with an action maps to a task group R1 to R7, T033 to T037 or T041 to T043. The three rows marked unchanged have no task.
- [x] CHK-141 [P1] N/A. The phase changes no API. No exported symbol, hook id or command changes. Evidence: no exported symbol, hook id or command changed. The hook id list is equal before and after.
- [x] CHK-142 [P2] The parent phase map shows this phase's status. `rg -n '003-literal-hook-renames/' ../spec.md` prints the row with its current status. Evidence: the row reads `Complete`.
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Operator | Decides commit, merge and push | [ ] Approved | |
<!-- /ANCHOR:sign-off -->
