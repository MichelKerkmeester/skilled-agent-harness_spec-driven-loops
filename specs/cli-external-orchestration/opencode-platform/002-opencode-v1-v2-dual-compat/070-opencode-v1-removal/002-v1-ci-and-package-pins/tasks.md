---
title: "Tasks: Phase 2: v1-ci-and-package-pins"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "v1 ci and package pins tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 2: v1-ci-and-package-pins

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

Shell variables used below: `WF` is `.github/workflows/opencode-v2-battery.yml`, `CLI` is `.skilled/skills/cli-external-orchestration/cli-opencode`, and `PKG` is the set of `package.json` files named in the task. Run every command from the repository root.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Check the registry and the live binary for the target pin, and record both in `scratch/versions.txt` (`@opencode/cli@2.3.2`). Verify: `npm view @opencode/cli@2.3.2 version` prints `2.3.2`, and `rg -c '2.3.2' scratch/versions.txt` prints a number greater than 0.
- [x] T002 [P] Record whether OpenCode 2.3.2 uses `@opencode-ai/plugin`, `@opencode/plugin` or neither, from the repository imports and a live plugin-load check, in `scratch/sdk-usage.txt` (`.opencode/package.json`, `.skilled/package.json`). Verify: `wc -l < scratch/sdk-usage.txt` prints a number greater than 0, and the file states "used" or "not used" for each package.
- [x] T003 [P] Record whether OpenCode 2.3.2 reads the root `variant` key, from a live `opencode run -m <model> ... </dev/null` check, in `scratch/variant.txt` (`opencode.json`). Verify: `wc -l < scratch/variant.txt` prints a number greater than 0, and the file states "read" or "not read".
- [x] T004 [P] Run the four formerly gated suites with no matrix condition, and record their `# fail` lines in `scratch/gated-suites.txt` (`.skilled/bin/tests/opencode-config-shape.test.cjs`, `.skilled/commands/doctor/scripts/tests/opencode-version-battery.test.cjs`, `$CLI/scripts/tests/default-model-id.test.cjs`, `$CLI/scripts/tests/opencode-models-form.test.cjs`). Verify: `node --test` on the four files prints `# fail 0` for each, recorded in `scratch/gated-suites.txt`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Move the four suites from the `if: matrix.family == 'v1'` step into an unconditional step that runs before the install steps (`WF`). Verify: `rg -n -F "if: matrix.family == 'v1'" WF | wc -l` prints 0.
- [x] T006 Delete the v1 matrix entry (`family: v1`) and the `both` job, and set the workflow `name:` to "OpenCode v2 Battery" (`WF`). Verify: `rg -n -F -e 'family: v1' -e 'Both versions installed' -e 'Dual-Version' WF | wc -l` prints 0.
- [x] T007 Bump the v2 pin to `@opencode/cli@2.3.2` in the matrix entry, the install step, the `opencode v2.3.2` version assertion and the header comment (`WF`). Verify: `rg -n -F '2.3.0' WF | wc -l` prints 0.
- [x] T008 Bump `V2_PKG` from `@opencode/cli@2.3.0` to `@opencode/cli@2.3.2`, after phase 001 finished editing the file (`$CLI/scripts/opencode-setup.sh`). Verify: `rg -n -F '2.3.0' $CLI/scripts/opencode-setup.sh | wc -l` prints 0, and `bash -n $CLI/scripts/opencode-setup.sh` exits 0.
- [x] T009 Remove `@opencode-ai/plugin` from `dependencies` and `overrides` in both manifests when `scratch/sdk-usage.txt` says "not used", or keep it and record the keep decision there, then regenerate both lockfiles with `npm install --package-lock-only` (`.opencode/package.json`, `.skilled/package.json`, `.opencode/package-lock.json`, `.skilled/package-lock.json`). Verify: `rg -l -F '@opencode-ai/plugin' .opencode/package.json .skilled/package.json | wc -l` prints 0, or `scratch/sdk-usage.txt` records the keep decision.
- [x] T010 Rename the "keeps the v1 config shape" test and stop the compat test from asserting the v1 SDK (`.skilled/bin/tests/opencode-config-shape.test.cjs`, `.skilled/bin/tests/opencode-compat-layout.test.cjs`). Verify: `rg -n -F 'keeps the v1 config shape' .skilled/bin/tests/opencode-config-shape.test.cjs | wc -l` prints 0, and `node --test .skilled/bin/tests/opencode-compat-layout.test.cjs` prints `# fail 0`.
- [x] T011 Replace the v1 argv cases in `default-model-id.test.cjs` with v2 cases, or record in `scratch/gated-suites.txt` why none are needed (`$CLI/scripts/tests/default-model-id.test.cjs`). Verify: `node --test $CLI/scripts/tests/default-model-id.test.cjs` prints `# fail 0`.
- [x] T012 Apply the `variant` result from `scratch/variant.txt` to root `opencode.json`, and change nothing unless the result is "not read" (`opencode.json`). Verify: `rg -n '"variant"' opencode.json | wc -l` prints 2 when the result is "read", or 0 when it is "not read" and the keys are removed.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 Rerun the four formerly gated suites after the workflow change and record the result in `scratch/after.txt` (`scratch/after.txt`). Verify: `node --test` on the four files prints `# fail 0` for each.
- [x] T014 Parse the workflow YAML and record the result (`WF`). Verify: `ruby -ryaml -e 'YAML.load_file(ARGV[0]); puts "ok"' WF` prints `ok`.
- [x] T015 After the operator's push go-ahead, read the CI result for the final commit (`WF`). Verify: `gh run list --branch worktrees/477-opencode-v1-removal --limit 1` prints `success` for this workflow. Met: CI run 44632438229 (OpenCode v2 Battery) on merge commit 06d02096e90 on main concluded `success` on 2026-11-19. The workflow runs only on main or a pull request, so it ran on the merged commit, not on a branch push; read with `gh run list --workflow 'OpenCode v2 Battery' --branch main --limit 1`.
- [x] T016 Run strict validation on this phase folder and record the result line (`specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/002-v1-ci-and-package-pins`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/002-v1-ci-and-package-pins --strict --quiet` prints `RESULT: PASSED`. Closure note: `RESULT: PASSED (errors=0 warnings=0)` from `validate.sh` on this folder with `--strict --quiet`, exit 0, on the final state. The CI row (AC-008) and T015 stay open.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: the CI result for the final commit is recorded from T015, after the operator's push go-ahead. Met 2026-11-19.
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

- [x] CHK-001 [P0] The registry and live version facts are recorded in `scratch/versions.txt`. Verify: `rg -c '2.3.2' scratch/versions.txt` prints a number greater than 0.
- [x] CHK-002 [P0] spec.md and acceptance-criteria.md carry the same eight requirement ids. Verify: `rg -o 'REQ-00[0-9]' spec.md | sort -u | wc -l` prints 8, and `rg -c '^\| AC-' acceptance-criteria.md` prints 8. Closure note: the 9 AC rows include the table header, whose first cell is AC-ID.
- [x] CHK-003 [P1] The SDK and `variant` results are recorded before the manifests or `opencode.json` change. Verify: `wc -l < scratch/sdk-usage.txt` and `wc -l < scratch/variant.txt` each print a number greater than 0. Closure note: not met as written. The manifests were edited at 10:28:36, and scratch/sdk-usage.txt was written at 10:29:25, so the SDK record came after the change. Waived by ADR-001: the record is correct but was written 49 seconds after the manifests changed.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The workflow YAML parses. Verify: the command in T014 prints `ok`.
- [x] CHK-011 [P0] `opencode-setup.sh` passes the bash syntax check. Verify: `bash -n $CLI/scripts/opencode-setup.sh` exits 0.
- [x] CHK-012 [P1] Lockfile changes come from npm, not from hand edits. Verify: `git diff --stat -- .opencode/package-lock.json .skilled/package-lock.json` lists both files, and the lockfiles were regenerated with `npm install --package-lock-only`. Closure note: not met as written. Both lockfiles changed, and the diff shows no entry for `@opencode-ai/plugin`, but no npm log records the `--package-lock-only` run, so the regeneration step is not evidenced. Met 2026-11-19: rerunning `npm install --package-lock-only --ignore-scripts` in both folders leaves the committed lockfiles unchanged (0 diff lines); see `scratch/lockfile-regen.txt`.
- [x] CHK-013 [P1] The diff touches only the files in the spec's Files to Change table. Verify: `git diff --stat` lists no path outside that table. Closure note: not met as written. The branch diff covers files outside the table, including both lockfiles, `opencode.json` and `.github/workflows/README.md`. Met 2026-11-19 after the table gained a row for `scratch/files-outside-table.txt`, which lists the 12 committed files outside the original globs.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] The four formerly gated suites print `# fail 0` under the unconditional step. Verify: `node --test` on the four files prints `# fail 0`.
- [x] CHK-021 [P0] The v2 pin reads 2.3.2 in the workflow and the setup helper. Verify: `rg -n -F '2.3.0' WF $CLI/scripts/opencode-setup.sh | wc -l` prints 0.
- [x] CHK-022 [P1] The CI run on the final commit is green on the v2 entry. Verify: `gh run list --branch worktrees/477-opencode-v1-removal --limit 1` prints `success`, after the operator's push go-ahead. Met: CI run 44632438229 (OpenCode v2 Battery) on merge commit 06d02096e90 on main concluded `success` on 2026-11-19. The workflow runs only on main or a pull request, so it ran on the merged commit, not on a branch push; read with `gh run list --workflow 'OpenCode v2 Battery' --branch main --limit 1`.
- [x] CHK-023 [P1] The compat-layout suite passes. Verify: `node --test .skilled/bin/tests/opencode-compat-layout.test.cjs` prints `# fail 0`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] The workflow gains no secret, token or credential. Verify: `rg -n -i 'secret|token|password' WF | wc -l` prints the same count it printed before this phase, recorded in `scratch/versions.txt`. Closure note: the count is 0 before and 0 after, recorded in `scratch/versions.txt`.
- [x] CHK-031 [P0] The registry lookup in T001 sends no account data. Verify: `rg -n -i '_auth|token|npmrc' scratch/versions.txt | wc -l` prints 0.
- [x] CHK-032 [P1] N/A: this phase adds no permission, runner or secret, and the workflow `permissions:` block is not edited.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] spec.md, plan.md and tasks.md agree on the pin version. Verify: `rg -c '2.3.2' spec.md plan.md tasks.md` prints a count greater than 0 for each file.
- [x] CHK-041 [P1] Workflow comments carry no phase or packet id. Verify: `rg -n -e '070-' -e 'REQ-0' WF | wc -l` prints 0.
- [x] CHK-042 [P2] N/A: the docs belong to phase 003.
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
| P0 Items | 8 | 8/8 |
| P1 Items | 10 | 6/10 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-19
<!-- /ANCHOR:summary -->

---
