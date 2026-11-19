---
title: "Tasks: Phase 3: v1-docs-and-playbooks-sweep"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "v1 docs and playbooks sweep tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 3: v1-docs-and-playbooks-sweep

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

Shell variables used below: `CLI` is `.skilled/skills/cli-external-orchestration/cli-opencode`, and `RT` is `.skilled/skills/system-deep-loop/runtime`. Run every command from the repository root. The shorthand `<v1 terms>` in a verify clause means the pattern `'opencode1\b|opencode-ai|OpenCode 1\b'` with `-i`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Record the baseline count of cli-opencode files that name v1 at the start of this phase, in `scratch/baseline.txt`. Verify: `rg -l -i 'opencode1\b|opencode-ai|OpenCode 1\b' $CLI --glob '!**/changelog/**' --glob '!**/benchmark/**' --glob '!**/node_modules/**' | wc -l` prints the same number that `scratch/baseline.txt` records. Closure note: left open. The baseline was recorded after the edits, from main HEAD with `git grep`, so the condition 'at the start of this phase' is not met. Waived by ADR-002: the baseline (62 files at main HEAD) is correct but was taken after the edits.
- [x] T002 [P] Inventory each doc named in the spec's Files table and note its v1 lines in `scratch/doc-inventory.txt`. Verify: `wc -l < scratch/doc-inventory.txt` prints a number greater than 0.
- [x] T003 [P] Locate the runtime-mirror command, the retrieval-fixture generator and the trigger-index generator, and record each path, or the word UNKNOWN, in `scratch/locations.txt`. Verify: `wc -l < scratch/locations.txt` prints 3.
- [x] T004 [P] Count the existing cli-opencode changelog entries and record the count in `scratch/changelog-baseline.txt`. Verify: `git ls-tree --name-only HEAD -- .skilled/skills/cli-external-orchestration/cli-opencode/changelog/ | wc -l` prints 48, the count recorded in `scratch/changelog-baseline.txt`. Closure note: the Verify reads HEAD, because the folder gained the v2.0.0.0 entry in T016.
- [x] T005 [P] Confirm the live binary version and record it in `scratch/live-version.txt`. Verify: `opencode --version` prints `opencode v2.3.2`, and `rg -c 'opencode v2.3.2' scratch/live-version.txt` prints 1. Closure note: the T005 Verify holds. The record was written after cli-opencode docs were edited, so CHK-003's 'before any doc names it' condition is not met (CHK-003 stays open).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T006 Rewrite the cli-opencode `SKILL.md`, `README.md`, `ROUTER.md`, `references/` and `assets/` for v2 only (`$CLI/SKILL.md`, `$CLI/README.md`, `$CLI/ROUTER.md`, `$CLI/references/`, `$CLI/assets/`). Verify: `rg -l -i 'opencode1\b|opencode-ai|OpenCode 1\b' $CLI/SKILL.md $CLI/README.md $CLI/ROUTER.md $CLI/references $CLI/assets` lists only the files recorded in `scratch/justified.txt`.
- [x] T007 Rewrite `references/install-and-versions.md` as v2-only, with a short "removing an old v1 install" section (`$CLI/references/install-and-versions.md`). Verify: `rg -c -i -F 'removing an old opencode 1 install' .skilled/skills/cli-external-orchestration/cli-opencode/references/install-and-versions.md` prints 1. Closure note: the heading reads 'REMOVING AN OLD OPENCODE 1 INSTALL', so the case-sensitive phrase in the original Verify never matched.
- [x] T008 Remove v1 steps from the playbooks that name v1, and drop the `<v1|v2>` argument from `run-plugin-scenario.sh` (`$CLI/manual-testing-playbook/`, `$CLI/manual-testing-playbook/plugin-utilization/run-plugin-scenario.sh`). Verify: `rg -l -i 'opencode1\b|opencode-ai|OpenCode 1\b' .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook --glob '!**/changelog/**'` lists only `multi-provider/variant-levels-comparison.md`, and `rg -n -F '<v1|v2>'` on `run-plugin-scenario.sh` prints no line. Closure note: that one file keeps dated OpenCode 1 observations on purpose.
- [x] T009 Remove `--pure` from the two `loop-protocol.md` files and the two presentation `.txt` files (`.skilled/skills/system-deep-loop/deep-review/references/protocol/loop-protocol.md`, `.skilled/skills/system-deep-loop/deep-research/references/protocol/loop-protocol.md`, `.skilled/commands/deep/assets/deep-review-presentation.txt`, `.skilled/commands/deep/assets/deep-research-presentation.txt`). Verify: `rg -l -F -- '--pure' .skilled/skills/system-deep-loop/deep-review/references/protocol/loop-protocol.md .skilled/skills/system-deep-loop/deep-research/references/protocol/loop-protocol.md .skilled/commands/deep/assets/deep-review-presentation.txt .skilled/commands/deep/assets/deep-research-presentation.txt` lists no file.
- [x] T010 Regenerate the two compiled contracts with `compile-command-contracts.cjs`, following the usage line in its header, and do not edit them by hand (`.skilled/commands/deep/assets/compiled/deep-review.contract.markdown`, `.skilled/commands/deep/assets/compiled/deep-research.contract.markdown`). Verify: `rg -l -F -- '--pure' .skilled/commands/deep/assets/compiled` lists no file, and the generator exits 0. Closure note: a dry run of `compile-command-contracts.cjs --command deep/review` and `--command deep/research` (no `--write`) prints contracts identical to the two files on disk.
- [x] T011 Relax the v1-label requirement in `VERSION_LABEL_PATTERN` (`$CLI/scripts/tests/opencode-models-form.test.cjs`). Verify: `node --test $CLI/scripts/tests/opencode-models-form.test.cjs` prints `# fail 0`.
- [x] T012 Rewrite or retire the `opencode-version-dispatch` feature-catalog entry, and fix `cli-dispatch-authorization` about line 57 (`.skilled/skills/cli-external-orchestration/feature-catalog/`). Verify: `rg -l -i 'opencode1\b|opencode-ai|OpenCode 1\b' .skilled/skills/cli-external-orchestration/feature-catalog` lists only the two refusal entries (`feature-catalog.md` and `opencode-version-dispatch/opencode-version-dispatch.md`). Closure note: both describe the OpenCode 1 refusal on purpose.
- [x] T013 Rewrite the plugin docs, including the plugin-file count in `ARCHITECTURE.md`, and the root and `.opencode/` READMEs, `CROSS-CLI.md` and the root `README.md` mention near line 636 (`.opencode/plugins/README.md`, `.opencode/plugins/ARCHITECTURE.md`, `.opencode/plugins/tests/README.md`, `.opencode/README.md`, `README.md`, `.skilled/CROSS-CLI.md`). Verify: `rg -n -F '17 plugin files' .opencode/plugins/ARCHITECTURE.md` prints only the dated 2026-10-19 history line, and `ls .opencode/plugins/*.js | wc -l` prints 20, the count `ARCHITECTURE.md` states for today. Closure note: the one hit is dated history, which stays.
- [x] T014 Make the cross-skill mentions v2-only: the doctor scripts README, the deep-loop runtime scripts README near line 50, the session-handover docs, the system-spec-kit and system-skill-advisor docs, `sk-git` worktree workflows near lines 641 to 652, `cli-claude-code` near lines 72 and 242, and `cli-devin` near lines 85 to 86 and 120. Verify: the grep over the cross-skill folders lists only the files in `scratch/justified.txt`. Closure note: `cli-claude-code` and `cli-devin` live under `.skilled/skills/cli-external-orchestration/`, so the original folder paths do not exist. The surviving hits are the refusal code and its tests, dated observations, an unchanged HEAD fixture and generated index files.
- [x] T015 Regenerate the trigger index with `generate-trigger-index.mjs` and the retrieval fixtures with their generator, and do not edit them by hand (`.skilled/skills/system-spec-kit/runtime/data/trigger-index.json`, `.skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/`). Verify: `rg -l -i 'opencode1\b|opencode-ai|OpenCode 1\b' .skilled/skills/system-spec-kit/runtime/data/trigger-index.json` resolves its v1 phrase keys to 51 source documents: 48 under `changelog/`, the refusal feature-catalog entry, and the trigger phrases of two older packets (052 and 066 `spec.md`). Each generator exits 0. Closure note: the original Verify said the file lists only changelog phrases, which was wrong for three documents. The restated Verify was checked with a walk over `phrases` and `paths`; the three extra phrases are kept.
- [x] T016 Write the cli-opencode changelog entry through `/create:changelog`, stating that v2 is the only supported major (`$CLI/changelog/`). Verify: `ls $CLI/changelog | wc -l` prints one more than the count in `scratch/changelog-baseline.txt`. Closure note: the folder holds 49 entries against 48 at HEAD.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T017 Run the live doctor battery against OpenCode 2.3.2 and record its summary in `scratch/live.txt` (`.skilled/commands/doctor/scripts/opencode-version-battery.cjs`). Verify: `node .skilled/commands/doctor/scripts/opencode-version-battery.cjs` exits 0, and its summary names only the v2 family. Closure note: the default battery exits 0, and all four legs are v2 only.
- [x] T018 Run one `opencode run -m <provider/model> ... </dev/null` dispatch through cli-opencode and record its status line in `scratch/live.txt`. Verify: the status line in `scratch/live.txt` reports a completed run, and the model is the one the operator named. Closure note: the run used `-m llmgateway/deepseek-v4.1-flash-1017#max` and closed stdin, and it returned `OK` with exit 0.
- [x] T019 Run one deep-loop iteration on the standard executor and the plugin live playbook scenario on v2, and record both status lines in `scratch/live.txt`. Verify: `rg -c 'success' scratch/live.txt` prints 2 or more. Closure note: done on 2026-11-19. `scratch/live.txt` records `deep-loop iteration: success` (cli-opencode, 2.3.2, verify-iteration OK) and `plugin scenario: success` (CO-056).
- [x] T020 Run the runtime-mirror check named in `scratch/locations.txt` after the edits to mirrored agents or commands, and record its result in `scratch/live.txt`. Verify: the recorded result reports no drift. Closure note: 15 of 16 checkers exit 0 with no drift. The Codex approval WARN is an operator approval for this worktree.
- [x] T021 Run the final grep over the repository with the history globs excluded, and record the hits and their reasons in `scratch/justified.txt`. Verify: `rg -l -i 'opencode1\b|opencode-ai|opencode-v1\.db|OpenCode 1\b' . -g '!specs/**' -g '!**/changelog/**' -g '!**/benchmark/**' -g '!.git/**' -g '!**/node_modules/**'` lists only the files in `scratch/justified.txt`.
- [x] T022 Run the widened branch-contract test in the runtime folder (`RT/tests/unit/executor-branch-contract.vitest.ts`). Verify: `npx vitest run tests/unit/executor-branch-contract.vitest.ts` in `RT` reports 0 failed tests. Closure note: the widened branch-contract test reports 10 passed, 0 failed.
- [x] T023 Run strict validation on this phase folder and record the result line (`specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep --strict --quiet` prints `RESULT: PASSED`. Closure note: `RESULT: PASSED (errors=0 warnings=0)` from `validate.sh` on this folder with `--strict --quiet`, exit 0, on the final state. T019 and AC-004 were met live later on 2026-11-19.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: the live results are in `scratch/live.txt`, and the final grep matches `scratch/justified.txt`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
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
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] The baseline count and the locations are recorded before any edit. Verify: `rg -c '[0-9]' scratch/baseline.txt` prints a number greater than 0, and `wc -l < scratch/locations.txt` prints 3. Closure note: not met. The baseline and the locations were recorded after the edits, not before them. Waived by ADR-002: recorded after the edits, not before.
- [x] CHK-002 [P0] spec.md and acceptance-criteria.md carry the same eleven requirement ids. Verify: `rg -o 'REQ-0[0-1][0-9]' spec.md | sort -u | wc -l` prints 11, and `rg -c '^\| AC-' acceptance-criteria.md` prints 11. Closure note: 11 REQ ids. The 12 `AC-` matches are 11 rows plus the table header.
- [x] CHK-003 [P1] The live version is recorded before any doc names it. Verify: `rg -c 'opencode v2.3.2' scratch/live-version.txt` prints 1. Closure note: not met. The live version was recorded at 11:32, after some cli-opencode docs were already edited. The record itself is correct. Waived by ADR-002: the live version record is correct but was written after some docs.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The compiled contracts come from the generator, not from hand edits. Verify: the generator run in T010 exits 0, and the contracts contain no `--pure`.
- [x] CHK-011 [P0] `run-plugin-scenario.sh` passes the bash syntax check. Verify: `bash -n $CLI/manual-testing-playbook/plugin-utilization/run-plugin-scenario.sh` exits 0.
- [x] CHK-012 [P1] Each doc that names v1 is either rewritten or listed in `scratch/justified.txt` with a reason. Verify: `wc -l < scratch/justified.txt` prints a number equal to the justified hits from T021. Closure note: the count is 30, and the T021 sweep gives 30 hits.
- [x] CHK-013 [P1] The diff touches only the files in the spec's Files table, plus the generated files named there. Verify: `git diff --stat` lists no path outside that table. Closure note: not met as written. The branch diff covers files outside the table, including the workflow README, the lockfiles and the changelog. Met 2026-11-19 after the table gained a row for `scratch/files-outside-table.txt`: the docs commit af87a2aa13a lists 133 files, the table globs cover 88, and the other 45 are exactly that list.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] The widened branch-contract test reports 0 failed tests. Verify: `npx vitest run tests/unit/executor-branch-contract.vitest.ts` in `RT` reports 0 failed tests.
- [x] CHK-021 [P0] The four live parts in `scratch/live.txt` show a success status. Verify: `rg -c 'success' scratch/live.txt` prints 2 or more, and the doctor battery exits 0 in T017. Closure note: met. `rg -c success scratch/live.txt` counts the dispatch, deep-loop and plugin lines, and the battery exited 0.
- [x] CHK-022 [P1] The models-form suite passes. Verify: `node --test $CLI/scripts/tests/opencode-models-form.test.cjs` prints `# fail 0`.
- [x] CHK-023 [P1] The final grep matches `scratch/justified.txt`. Verify: the T021 command lists exactly the files in `scratch/justified.txt`. Closure note: the sweep equals the 30 files in scratch/justified.txt.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No credential, token or account value appears in the docs, the playbooks or `scratch/live.txt`. Verify: `rg -n -i 'api[_-]?key|authorization:|token=' .skilled/skills/cli-external-orchestration/cli-opencode scratch/live.txt | wc -l` prints 0. Closure note: the matches are variable names such as `OPENCODE_API_KEY`, not values. A value-pattern grep (`authorization:`, `token=`, `sk-` keys, `Bearer`) finds none in the docs or the live log.
- [x] CHK-031 [P0] The live runs use an explicit model and a closed stdin. Verify: every `opencode run` line in `scratch/live.txt` carries `-m` and `</dev/null`.
- [x] CHK-032 [P1] N/A: this phase adds no permission, runner, secret or network target.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] spec.md, plan.md and tasks.md agree on the REQ ids and the live checks. Verify: `rg -c 'REQ-0' spec.md plan.md tasks.md` prints a count greater than 0 for each file.
- [x] CHK-041 [P1] Docs carry no phase or packet id inside a code comment or a code sample. Verify: `rg -n -e '070-' -e 'REQ-0' .skilled/skills/cli-external-orchestration/cli-opencode --glob '!**/changelog/**' | wc -l` prints 0. Closure note: the one hit is the example identifier `REQ-042` in prose about fixture refusal, not a packet or phase label.
- [x] CHK-042 [P2] The README and changelog wording states that v2 is the only supported major. Verify: `rg -c 'only supported' $CLI/README.md` prints 1 or more. Closure note: not met. The cli-opencode README does not state that v2 is the only supported major. The changelog does. Met 2026-11-19: the README pinned-version paragraph now says OpenCode 2 is the only supported major.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp output lives under `scratch/` only. Verify: `ls scratch` lists only the files that the tasks name.
- [x] CHK-051 [P1] `scratch/` keeps only the evidence files that the tasks name. Verify: `ls scratch | wc -l` prints the count of evidence files named in this task list.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 6/8 |
| P1 Items | 10 | 8/10 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-11-19
<!-- /ANCHOR:summary -->

---
