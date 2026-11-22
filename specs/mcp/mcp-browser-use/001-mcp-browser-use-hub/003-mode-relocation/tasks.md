---
title: "Tasks: Phase 3: mode-relocation"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "mode-relocation tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 3: mode-relocation

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

`T` is `.skilled/skills/mcp-tooling`. `H` is `.skilled/skills/mcp-browser-use`. `G` is `.skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs`. The file classes are the ones in `spec.md` section 3, from `../001-research/research/iterations/iteration-011.md`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Re-run the three Measured Behavior commands (`.skilled`). Verify: the counts are recorded in `goal.md`, and any file not in `spec.md` section 3 is classified before T003. Done 2026-11-21: 41 / 14 / 29, matching `spec.md` section 3 (new hub excluded from the first count). The move added an inventory the commands never covered: 70 files inside the two packets that name `mcp-tooling`, rewritten after the move.
- [x] T002 Get the operator's answer on the sibling-packet question (`spec.md` section 10). Verify: the choice is recorded in the `goal.md` log. Done 2026-11-21: no sibling edits, D3 holds.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Re-point both `skill_dir` values first and name the new hub in the header coverage comment (`.skilled/commands/doctor/assets/mcp-mutation-class-manifest.yaml`). Verify: `rg -n 'skill_dir: ".skilled/skills/mcp-browser-use/mcp-(chrome|aside)-devtools"'` prints 2 lines. Done: the `rg` prints lines 45 and 61.
- [x] T018 Widen the hook and guard hub segment before the move and add the test case (`.skilled/scripts/git-hooks/pre-commit`, `.skilled/commands/doctor/scripts/check-mcp-mutation-class.sh`, `.skilled/commands/doctor/scripts/tests/check-mcp-mutation-class.test.sh`). Verify: `rg -n 'mcp-browser-use' .skilled/scripts/git-hooks/pre-commit .skilled/commands/doctor/scripts/check-mcp-mutation-class.sh` prints the hook line, the `HOOK_PATTERN` line and two `DISCOVERY_GLOBS` lines, and the test file holds a case for a script under `skills/mcp-browser-use/mcp-*`. Done: `rg` prints pre-commit:632, `HOOK_PATTERN` at guard line 124 and `DISCOVERY_GLOBS` at lines 130 and 133. The new case failed against the unwidened guard (35 passed, 2 failed) and passes after (37 passed, 0 failed).
- [x] T004 Drop both modes from the mcp-tooling registry and router (`$T/mode-registry.json`, `$T/hub-router.json`). Verify: `jq '.modes | length' $T/mode-registry.json` prints 6 and `jq '.routerPolicy.tieBreak | length' $T/hub-router.json` prints 6. Done: both print 6. The four vocabulary classes only the two modes used were removed too.
- [x] T005 Delete the two 002 stubs and move the packets (`$H`). Verify: `git mv $T/mcp-chrome-devtools $H/mcp-chrome-devtools` and the Aside equivalent exit 0, and `git diff -M --cached --stat` lists pure renames. Done: both `git mv` exit 0; `git diff -M --cached` lists 176 files, all `R100`. Stubs backed up to `/tmp/mcp-browser-use-003-stubs.tgz` before deletion.
- [x] T006 Register both packets in the new hub (`$H/mode-registry.json`, `$H/hub-router.json`). Verify: `jq -r '.modes[].packet'` prints both folders. Done: 002 already registered both with their real `packet` values; `jq -r '.modes[].packet'` prints mcp-chrome-devtools, mcp-aside-devtools, mcp-bladebro, so no edit was needed.
- [x] T007 Hand-edit the mcp-tooling hub files (`$T/SKILL.md`, `ROUTER.md`, `README.md`, `description.json`, `graph-metadata.json`, feature catalog, playbook). Verify: `rg -l 'mcp-(chrome|aside)-devtools' $T -g '!**/changelog/**' -g '!**/benchmark/reports/**'` lists only the sibling rows T008 owns. Done: the `rg` lists the 12 sibling files plus `graph-metadata.json`, whose advisor vocabulary 005 owns.
- [x] T008 Leave the four sibling packets untouched, per the operator's 2026-11-21 answer (`$T/mcp-{click-up,figma,mobbin,refero}/`). Verify: `git diff --stat -- $T/mcp-click-up $T/mcp-figma $T/mcp-mobbin $T/mcp-refero` prints nothing, and the second `rg` of REQ-002 prints nothing. Done: `git diff --stat` on the four packets prints nothing.
- [x] T009 [P] Rewrite the remaining path references (installer test, `mcp-code-mode` scripts README and two playbook rows, playbook allowlist, `figma-to-code.md`, `web-markup-and-css.md`). Verify: `rg -n 'mcp-tooling.*mcp-(chrome|aside)-devtools' .skilled -g '!**/changelog/**' -g '!**/benchmark/reports/**'` prints nothing. Done: the literal path `rg` finds only the three residuals in `implementation-summary.md` Known Limitations.
- [x] T010 Regenerate both leaf manifests (`$T`, `$H`). Verify: `node $G --write $T` and `node $G --write $H` exit 0. Done: both exit 0 (`79cbdf62…` and `ceb8acb0…`).
- [x] T011 Regenerate the trigger index and its retrieval fixtures (`.skilled/skills/system-spec-kit/runtime/data/trigger-index.json`). Verify: `node .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs` exits 0 and rewrites the index plus `corpus-manifest.json`, `generation-diagnostics.json` and `phrase-variants.json`. Done: exit 0, all four files rewritten; `--check` exits 0 afterwards.
- [x] T012 Regenerate the observability report and the sk-doc code-folder snapshots. Verify: each generator named in `implementation-summary.md` exits 0 and the old path is gone from its output. Done: the sk-doc snapshots were rebuilt with their `--write` generators. The observability files hold bare ids only, and their generator's default corpus is missing, so they were left as they are.
- [x] T013 Record `cite-drift-redirects.json` as pending the operator's commit (D8). Verify: the pending line is in the `goal.md` log. Done: recorded in the `goal.md` log.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T014 Check both hubs (`$T` and `$H`). Verify: `parent-skill-check.cjs` ends with `OK: parent-skill-check` for each path. Done: both end with `OK: parent-skill-check — all hard invariants passed, 0 warnings`.
- [x] T015 Run the mutation-class test (`.skilled/commands/doctor/scripts/tests/check-mcp-mutation-class.test.sh`). Verify: `bash` on it exits 0 including the `mcp-browser-use/` case, and `check-mcp-mutation-class.sh` lists the Chrome DevTools and Aside scripts under their new paths. Done: exit 0, 37 passed; the guard prints `PASS` for both packets' `install.sh` and `doctor.sh` under `mcp-browser-use/`.
- [x] T016 Run the installer test (`.skilled/bin/tests/mcp-installers.test.cjs`). Verify: `node --test .skilled/bin/tests/mcp-installers.test.cjs` exits 0. Done: exit 0, 5 of 5 pass.
- [x] T017 Confirm the id-only files are untouched. Verify: `git diff --stat` on the 22 no-change files prints nothing. Done: 27 of the 41 starting outside files show no diff. The 14 that changed are all rewrite-path or generated.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] The old-path `rg` pair prints no match outside changelogs and benchmark reports
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance**: See `acceptance-criteria.md`
- **Research**: See `../001-research/research/research.md` §6 and `../001-research/research/iterations/iteration-011.md`
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

A `[B]` task blocks closure until the operator's answer is recorded in `goal.md`.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] The Measured Behavior counts are re-run and match `spec.md` section 3, or the difference is classified Evidence: 41 / 14 / 29, as T001 records.
- [x] CHK-002 [P0] The operator's sibling-packet answer is recorded (goal.md log, 2026-11-21)
- [x] CHK-003 [P1] 002-hub-scaffold's per-hub check passes on the stub hub Evidence: `parent-skill-check.cjs .skilled/skills/mcp-browser-use` exited 0 on the stub hub before the move.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Every edited JSON file parses: `jq . <file>` exits 0 Evidence: `jq -e .` passed on every edited and regenerated JSON file.
- [x] CHK-011 [P0] The doctor YAML parses and its test passes Evidence: `yaml.safe_load` parsed the manifest and the guard test passed, 37 of 37.
- [x] CHK-012 [P1] No generated file was hand-edited: each one changed only in the generator run that rebuilt it Evidence: the leaf manifests, trigger index files and sk-doc snapshots changed only in their generator runs.
- [x] CHK-013 [P1] No mode id changed: `git diff` shows no `mcp-chrome-devtools` or `mcp-aside-devtools` id edits outside path segments Evidence: `jq -r '.modes[].packetSkillName'` on the new registry prints both ids unchanged; every other id line in the diff is a path-segment rewrite or a removal from the old hub.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] Every row in `acceptance-criteria.md` is `Met`. Evidence: AC-002 closed 2026-11-21 after the three residual files were rewritten; both REQ-002 `rg` runs print nothing
- [x] CHK-021 [P0] `check-mcp-mutation-class.test.sh` and `mcp-installers.test.cjs` exit 0 Evidence: 37 passed, exit 0; 5 of 5 passed, exit 0.
- [x] CHK-022 [P1] Both per-hub checks end with `OK: parent-skill-check` Evidence: both print `OK: parent-skill-check — all hard invariants passed, 0 warnings`.
- [x] CHK-023 [P1] A file added since the inventory is classified, not edited blind Evidence: the 70 in-packet files naming `mcp-tooling`, which the inventory never covered, were classified as path or hub-name prose and rewritten; two cross-hub ClickUp references were re-pointed.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No credential or token moves into a tracked file; the packets move byte for byte Evidence: 176 `R100` renames in the index; the only in-packet edits are path and hub-name strings.
- [x] CHK-031 [P1] The mutation-class guard still covers both packets after the move: the hook and guard patterns name `mcp-browser-use/` Evidence: the guard lists both packets' `install.sh` and `doctor.sh` under `mcp-browser-use/` as PASS.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `spec.md`, `plan.md`, `tasks.md` and `acceptance-criteria.md` name the same file classes Evidence: the four documents still agree with each other. The observability deviation is recorded in `implementation-summary.md`.
- [x] CHK-041 [P1] `implementation-summary.md` names each generator that ran Evidence: the Generators table in `implementation-summary.md`.
- [x] CHK-042 [P2] The `mcp-tooling` README no longer lists the two modes Evidence: `rg -i 'chrome|aside'` on the README matches only the line that points to `mcp-browser-use`.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only Evidence: temporary output went to `/tmp`; nothing was written to the packet.
- [x] CHK-051 [P1] scratch/ cleaned before completion Evidence: `scratch/` holds only `.gitkeep`.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 7 | 7/7 |
| P1 Items | 10 | 10/10 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-21. CHK-020 closed once AC-002 was met.
<!-- /ANCHOR:summary -->

---
