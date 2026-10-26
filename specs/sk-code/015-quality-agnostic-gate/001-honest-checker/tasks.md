---
title: "Tasks: Phase 1: honest-checker"
description: "Ordered tasks for the comment-family table, the checker, the ceiling report, the post-edit router, two CI rows, the doctrine-free wording fixes, the version bumps and the 6.4 baseline."
trigger_phrases:
  - "honest checker tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.3 -->
# Tasks: Phase 1: honest-checker

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

**Path shorthand**: `Q/` stands for `.skilled/skills/sk-code/sk-code-quality/` and `H/` stands for `.skilled/skills/sk-code/`. Write the full path when you run a command. Run every command from the repository root. In this worktree, prefix git commands with `GIT_CONFIG_COUNT=1 GIT_CONFIG_KEY_0=core.fsmonitor GIT_CONFIG_VALUE_0=false`.

**Task Format**: `T### Action (file path). Verify: command prints expected output`. Each task names one action, one file and one verify clause.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Run the four quality bash suites before any change and save their output to `scratch/baseline-suites.txt`. Verify: `grep -c '^PASS' scratch/baseline-suites.txt` prints 43 (26 checker, 8 ceiling and 9 typo-flag lines).
- [ ] T002 Run the codex and devin adapter suites and the opencode plugin suite before any change, and save their output to `scratch/baseline-adapters.txt`. The three files are `.skilled/hooks/post-edit-quality/codex/post-edit-quality.test.cjs`, `.skilled/hooks/post-edit-quality/devin/post-edit-quality.test.cjs` and `.opencode/plugins/tests/sk-code-post-edit-quality.test.cjs`. Verify: each of the three `node --test` commands exits 0.
- [ ] T003 Re-check every file and line this phase repeats against the current tree, and record any moved line in `plan.md` section 3 before the first edit. Verify: `rg -n -F 'SOURCE_EXTENSIONS = new Set' .skilled/hooks/post-edit-quality/lib/post-edit-router.cjs` prints one line numbered 44.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Step 1: Make the checker honest

- [ ] T004 Create the family table with the extension, shebang and comment-family entries for the js family, py, sh, go, rs, css, yaml, toml, sql and jsonc (`Q/assets/comment-syntax.json`). Verify: `node -p 'JSON.parse(require("fs").readFileSync(".skilled/skills/sk-code/sk-code-quality/assets/comment-syntax.json","utf8")) && "ok"'` prints `ok`.
- [ ] T005 Load the table in the checker from the script's real path, and exit 3 when the table cannot be read (`Q/scripts/check-comment-hygiene.sh`, the language block at lines 38 to 52). Verify: copy the checker to `scratch/no-table/` without an `assets` folder, then run it on `scratch/clean.js`, which exits 3.
- [ ] T006 Choose each file's language from its shebang when the shebang names one, and from its extension otherwise, reading only the first line (`Q/scripts/check-comment-hygiene.sh`, lines 38 to 52). Verify: `printf '#!/usr/bin/env python3\n# ADR-12 x\n' > scratch/shebang.sh` and then the checker on that file prints a line ending `[ADR reference]` and exits 1.
- [ ] T007 Remove URL spans from the comment text before the patterns run, in place of the whole-line skip (`Q/scripts/check-comment-hygiene.sh`, line 153 and the loop at lines 185 to 205). Verify: `printf '// see https://example.test/a and specs/042-foo/x.md\n' > scratch/url.js` and then the checker prints a line ending `[spec path reference]` and exits 1.
- [ ] T008 Treat Python docstring text and block-comment body lines as comment text (`Q/scripts/check-comment-hygiene.sh`, lines 121 to 143). Verify: a file with a docstring line `REQ-12 is covered here.` prints a line ending `[REQ reference]` and exits 1, and a block file with the body line ` ADR-12 body` prints a line ending `[ADR reference]` and exits 1.
- [ ] T009 Add the violation pattern for issue and ticket references, with the reason `issue or ticket reference`, to the list at lines 160 to 181 (`Q/scripts/check-comment-hygiene.sh`). The pattern matches `fix`, `fixes`, `fixed`, `close`, `closes`, `closed`, `resolve`, `resolves`, `resolved`, `issue`, `ticket` or `bug`, followed by `#` and digits, case-insensitively. In the same change, accept three repeatable arguments for repository additions: `--ticket-prefix PREFIX`, which adds `\bPREFIX-[0-9][0-9A-Za-z]*\b`, `--extension EXT=FAMILY` and `--extra-pattern REGEX`. Phase 003 passes them from the repository config, and this phase reads no config. Verify: `printf '// fixes issue #1234\n' > scratch/issue.js` and then the checker prints a line ending `[issue or ticket reference]` and exits 1, and `printf '// see JIRA-12\n' > scratch/jira.js` checked with `--ticket-prefix JIRA` exits 1 while the same file without the argument exits 0.
- [ ] T010 Narrow the `NNN/NNN` pattern at line 161 to `\b\d{3}/0\d{2}\b`, so the second number must be zero-padded (`Q/scripts/check-comment-hygiene.sh`). Verify: `printf '// retry ratio 100/250\n' > scratch/ratio.js` makes the checker exit 0 with no output, and `printf '// ratio 042/003\n' > scratch/zero.js` makes it exit 1.
- [ ] T011 Keep the `T\d{3,4}` pattern at line 166 and the `phase 0` pattern at line 172 unchanged, as ADR-007 records (`Q/scripts/check-comment-hygiene.sh`). Verify: `rg -n -F -e 'T\d{3,4}' -e 'phase\s+0+\d*' Q/scripts/check-comment-hygiene.sh` prints two lines numbered 166 and 172.
- [ ] T012 Print `--json` as the `comment-hygiene/v1` document, with a status of `clean`, `violation`, `skipped` or `unreadable` for every file (`Q/scripts/check-comment-hygiene.sh`, lines 207 to 224). Verify: `python3 -B Q/scripts/check-comment-hygiene.sh --json scratch/issue.js scratch/missing.js` prints a document with `"schema": "comment-hygiene/v1"` and a file with `"status": "unreadable"`, and it exits 1.
- [ ] T013 Append the reason in brackets to each text finding, and change the usage exit from 2 to 3 (`Q/scripts/check-comment-hygiene.sh`, lines 204 and 215 to 218). Verify: the checker with no arguments exits 3, and `python3 -B Q/scripts/check-comment-hygiene.sh scratch/issue.js` prints a line ending `[issue or ticket reference]`.
- [ ] T014 Add one violation case and one clean case each for `py`, `sh`, `tsx`, `mts`, `jsonc`, `go`, `rs`, `yaml`, `css`, `toml` and `sql` to the suite (`Q/scripts/check-comment-hygiene.test.sh`, the `run_case` rows at lines 39 to 65). Verify: `bash Q/scripts/check-comment-hygiene.test.sh` prints `All comment hygiene test cases passed` and exits 0.
- [ ] T015 Add regression cases to the suite for URL spans, docstrings, block bodies, the issue rule, the slash pattern, the pinned patterns, the clean F02 strings without the two residual phrases, the JSON shape, the reason text, usage exit 3 and an unreadable second file in the JSON (`Q/scripts/check-comment-hygiene.test.sh`). Verify: `bash Q/scripts/check-comment-hygiene.test.sh` prints `All comment hygiene test cases passed` and exits 0.

### Step 2: Move the readers onto the table

- [ ] T016 Take the ceiling report's repository root from the working directory, not from the script folder (`Q/scripts/ceiling-report.sh`, lines 153 to 163), and read its extensions from the family table (lines 10, 34 and 35). Verify: running the report from `Q/scripts` and from the repository root prints the same summary line.
- [ ] T017 Add a case to the ceiling suite that runs the report from a subfolder of a temporary repository and checks its marker line (`Q/scripts/ceiling-report.test.sh`). Verify: `bash Q/scripts/ceiling-report.test.sh` prints `All ceiling report test cases passed` and exits 0.
- [ ] T018 Resolve the checker from the router's own real path first, and from the project folder second (`.skilled/hooks/post-edit-quality/lib/post-edit-router.cjs`, lines 35 to 42 and 208). Verify: `node --test .skilled/hooks/post-edit-quality/lib/post-edit-router.test.cjs` exits 0, including the case `resolves the checker from the router folder`.
- [ ] T019 Read the extension list from the family table, with the built-in set as fallback when the table cannot be read (`.skilled/hooks/post-edit-quality/lib/post-edit-router.cjs`, line 44). Verify: `node --test .skilled/hooks/post-edit-quality/lib/post-edit-router.test.cjs` exits 0, including the case `falls back to the built-in extension set`.
- [ ] T020 Return one de-duplicated `quality-notice` when the checker is missing, and keep writing nothing to stdout or stderr (`.skilled/hooks/post-edit-quality/lib/post-edit-router.cjs`, lines 11 to 13, 373 to 375 and 411). Verify: `node --test .skilled/hooks/post-edit-quality/lib/post-edit-router.test.cjs` exits 0, including the case `returns one quality-notice for a missing checker`.
- [ ] T021 Add the router unit test beside the router, with cases for the resolution order, the table fallback, one notice and silence (`.skilled/hooks/post-edit-quality/lib/post-edit-router.test.cjs`). Verify: `node --test .skilled/hooks/post-edit-quality/lib/post-edit-router.test.cjs` exits 0.
- [ ] T022 Replace the stub checker in the codex fixture with a line the real checker flags, such as a quoted `// see ADR-12`, so the positive control runs the real checker (`.skilled/hooks/post-edit-quality/codex/post-edit-quality.test.cjs`, lines 38 and 57). Verify: `node --test .skilled/hooks/post-edit-quality/codex/post-edit-quality.test.cjs` exits 0.
- [ ] T023 Replace the stub checker in the devin fixture the same way (`.skilled/hooks/post-edit-quality/devin/post-edit-quality.test.cjs`, line 40). Verify: `node --test .skilled/hooks/post-edit-quality/devin/post-edit-quality.test.cjs` exits 0.

### Step 3: Wire CI and fix the doctrine-free wording

- [ ] T024 Find the checker under `.skilled/` and then `.opencode/` (`.github/workflows/comment-hygiene.yml`, line 26), keep stderr visible (line 42), fail on exit 3 and on any exit code above 2 (lines 41 to 46), and annotate each violation with its line and reason from `--json` (line 45). Verify: `actionlint .github/workflows/comment-hygiene.yml` exits 0 with no output.
- [ ] T025 Add a step after line 48 of the script-tests workflow that runs the four quality bash suites (`.github/workflows/sk-code-script-tests.yml`). Verify: `rg -c 'sk-code-quality/scripts/(hooks/)?[a-z-]+[.]test[.]sh' .github/workflows/sk-code-script-tests.yml` prints 4.
- [ ] T026 Replace `.opencode/specs/` with `specs/` at lines 27, 106 and 120 of the quality mode, and replace the word "OpenCode" in the trigger lines 27 and 30 with surface wording such as "SKILLED", which changes no doctrine (`Q/SKILL.md`). Verify: `rg -n -F '.opencode/specs' Q/SKILL.md` prints no line, and `sed -n -e 27p -e 30p Q/SKILL.md | grep -c OpenCode` prints `0`.
- [ ] T027 Remove the claim "verified by a unit test" from line 140 of `Q/SKILL.md`, and the words "covered by a unit" from line 144, so the comment reads cleanly across lines 144 and 145. Verify: `rg -n -e 'unit test' -e 'covered by a unit' Q/SKILL.md` prints no line.
- [ ] T028 Replace the `DEFAULT_RESOURCE` list at lines 147 to 151 of `Q/SKILL.md` with the three always-loaded resources from the loading table at line 100: `../sk-code-skilled/assets/checklists/universal-checklist.md`, `../shared/references/universal/code-quality-standards.md` and `references/code-style-guide.md`. Verify: `sed -n '/^DEFAULT_RESOURCE/,/^]/p' Q/SKILL.md` lists three quoted paths and no `verification-quick-reference` path.
- [ ] T029 Name the acting agent applying `workflow-implement.md` in place of `sk-code-skilled` on the handback lines 15, 35, 186 and 278 of `Q/SKILL.md`. Verify: `rg -n 'workflow-implement.md' Q/SKILL.md` lists lines 15, 35, 186 and 278.
- [ ] T030 Remove the `--all` recommendation at line 116 of `Q/README.md`, and point the row at the per-file form of `check-dist-staleness.sh`, which never rebuilds. Verify: `rg -n -F -- '--all' Q/README.md` prints no line.
- [ ] T031 Raise the frontmatter `version` of `Q/README.md` from 1.2.4.0 to 1.2.5.0. Verify: `rg -n '^version:' Q/README.md` prints a line ending `version: 1.2.5.0`.
- [ ] T032 Replace the two-command list in the VALIDATION section of `Q/scripts/README.md` (lines 31 to 40) with the four bash suites. Verify: `sed -n '/## 3. VALIDATION/,/## 4/p' Q/scripts/README.md` lists four `.test.sh` paths.
- [ ] T033 Replace `.opencode/specs` with `specs/` in the path examples at lines 147 and 151 of `Q/references/code-style-guide.md`, and leave the neutral pointers at lines 40 and 105 for Phase 4. Verify: `rg -n -F '.opencode/specs' Q/references/code-style-guide.md` prints no line.
- [ ] T034 Replace `.opencode/specs/` with `specs/` and `.skilled/specs/` on the spec-root rows at lines 89 and 114 of `.skilled/skills/sk-code/sk-code-skilled/assets/checklists/universal-checklist.md`. Verify: `rg -n -F '.opencode/specs' .skilled/skills/sk-code/sk-code-skilled/assets/checklists/universal-checklist.md` prints no line.
- [ ] T035 Replace the three-path loop at line 73 of `Q/manual-testing-playbook/quality-gate/quality-checklist.md` with the three always-loaded resources from T028, and keep the expected text at lines 77 to 79 consistent with it. Verify: running the line 73 loop from the repository root prints `OK` for each of the three paths.
- [ ] T036 Narrow the claim at line 178 of `Q/manual-testing-playbook/manual-testing-playbook.md` to a syntax check of the adapter with `node --check`, which is what `Q/scripts/hooks/claude-posttooluse.test.sh` runs at its line 13. Verify: `sed -n '178p' Q/manual-testing-playbook/manual-testing-playbook.md` contains `node --check`.

### Step 4: Release and measure

- [ ] T037 Set the frontmatter `version` of the quality mode to 1.5.0.0 (`Q/SKILL.md`, line 5). Verify: `rg -n '^version:' Q/SKILL.md` prints a line ending `version: 1.5.0.0`.
- [ ] T038 Write `Q/changelog/v1.5.0.0.md` with the new languages, `--json`, the narrowed pattern, the router notice and the baseline counts from T042. Verify: `test -f Q/changelog/v1.5.0.0.md` exits 0, and `rg -n 'baseline' Q/changelog/v1.5.0.0.md` prints at least one line.
- [ ] T039 Set the hub version to 3.1.0.0 in `H/SKILL.md` line 5, `H/description.json` line 4, `H/hub-router.json` line 3 and `H/mode-registry.json` line 3. Verify: `rg -n '3[.]1[.]0[.]0' H/SKILL.md H/description.json H/hub-router.json H/mode-registry.json` prints four lines.
- [ ] T040 Write the hub changelog `H/changelog/v3.1.0.0.md`, with the release notes at hub level. Verify: `test -f H/changelog/v3.1.0.0.md` exits 0.
- [ ] T041 Write the packet changelog `changelog-015-001-honest-checker.md` in the parent packet's changelog folder, which this task creates (`specs/sk-code/015-quality-agnostic-gate/changelog/`). Verify: `test -f specs/sk-code/015-quality-agnostic-gate/changelog/changelog-015-001-honest-checker.md` exits 0.
- [ ] T042 Run the design 6.4 baseline, with the HEAD checker and the working-tree checker over every tracked file, and keep the outputs in `scratch/`. Verify: `wc -l < scratch/delta.txt` prints the delta count, and each delta line is classed in `Q/changelog/v1.5.0.0.md`.
- [ ] T043 Apply the ADR-010 halt rule to the baseline delta. Count the new-language delta lines and the files they touch, and stop to ask the operator when the count passes 50 lines or 20 files. Verify: the distinct-file count from `scratch/delta.txt` is 20 or fewer, and the new-language class in `Q/changelog/v1.5.0.0.md` counts 50 or fewer lines.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T044 Re-run the four quality bash suites and compare them with T001. Verify: each suite's last line is its All-passed line and exits 0, and `grep -c '^PASS' scratch/after-suites.txt` prints the new count recorded in `Q/changelog/v1.5.0.0.md`.
- [ ] T045 Run the router unit test and the codex, devin and opencode plugin suites. Verify: all four `node --test` commands exit 0.
- [ ] T046 Run actionlint on both changed workflows. Verify: `actionlint .github/workflows/comment-hygiene.yml .github/workflows/sk-code-script-tests.yml` exits 0 with no output.
- [ ] T047 Run the checker over every changed code file, to confirm the phase's own comments carry no ephemeral label (REQ-014). Verify: `python3 -B Q/scripts/check-comment-hygiene.sh` on each changed `.sh`, `.js`, `.cjs` and `.py` file exits 0 with no output.
- [ ] T048 Run the strict validator on this phase folder after the implementation tasks. Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/015-quality-agnostic-gate/001-honest-checker --strict` prints `RESULT: PASSED` as its last line.
- [ ] T049 Delete the scratch files this phase wrote, and keep `scratch/.gitkeep`. Verify: `ls -A scratch` prints `.gitkeep` only.
- [ ] T050 Confirm that `DEFAULT_RESOURCE` and the CQ-001 loop name the same three resources. Verify: `sed -n '/^DEFAULT_RESOURCE/,/^]/p' Q/SKILL.md` and the line 73 loop of `quality-checklist.md` list the same three paths.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Every row of `acceptance-criteria.md` is Met, with its evidence
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Decisions**: See `decision-record.md` for ADR-001 to ADR-010
- **Acceptance**: See `acceptance-criteria.md` for AC-001 to AC-028
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

- [ ] CHK-001 [P0] Requirements documented in `spec.md` section 4 (REQ-001 to REQ-020).
- [ ] CHK-002 [P0] Technical approach defined in `plan.md` section 4 (four steps) and section 3 (consumer inventory).
- [ ] CHK-003 [P1] Dependencies identified and available: python3, node and actionlint, each on PATH.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] The checker and the ceiling report parse as Python: `python3 -B -c "[__import__('ast').parse(open(p).read()) for p in __import__('sys').argv[1:]]" Q/scripts/check-comment-hygiene.sh Q/scripts/ceiling-report.sh` exits 0.
- [ ] CHK-011 [P0] The four quality suites print no `FAIL` line on either stream.
- [ ] CHK-012 [P1] Error handling is covered by tests: the missing table exits 3, and an unreadable file appears in the JSON with status `unreadable`.
- [ ] CHK-013 [P1] Code keeps the existing style of each file: the checker's pattern table, and the router's single dispatch table.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] Every acceptance criterion in `acceptance-criteria.md` is Met, with evidence named in its row.
- [ ] CHK-021 [P0] The five probes in `spec.md` section 3 were rerun after the change, and the results are in the quality changelog.
- [ ] CHK-022 [P1] Edge cases are tested: no arguments, an unreadable file, a missing table, a missing checker, and a shebang without a known extension.
- [ ] CHK-023 [P1] Error scenarios are validated, including the CI rule for exit codes above 2 (REQ-012).
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each false positive or miss this phase fixes names its class: `class-of-bug` for the pattern families, and `instance-only` for the two residual false positives that ADR-007 keeps.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory: each violation pattern is searched across the tracked files by the 6.4 baseline.
- [ ] CHK-FIX-003 [P0] Consumer inventory: pre-commit, the CI job, the ceiling report and the five router adapters are checked against the changed output, as `plan.md` section 3 lists.
- [ ] CHK-FIX-004 [P0] Adversarial cases cover a delimiter inside a string, a URL with a spec path, an id inside a docstring, and a file outside the repository root.
- [ ] CHK-FIX-005 [P1] Matrix axes listed before completion is claimed: language, comment family and pattern.
- [ ] CHK-FIX-006 [P1] Hostile environment variant: the router test runs once with the checker folder missing from the hub, which is the process-state variant.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to the phase's first commit, not to a moving branch range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets: the phase adds none, and no fixture builds a secret literal.
- [ ] CHK-031 [P0] Input validation: the checker takes file paths only, and the table reader rejects a root that is not an object.
- [ ] CHK-032 [P1] N/A: this phase adds no authentication or authorization surface.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] `spec.md`, `plan.md` and `tasks.md` name the same reason strings, the same exit codes and the same file list.
- [ ] CHK-041 [P1] Code comments state durable reasons only (REQ-014).
- [ ] CHK-042 [P2] The quality README edition is 1.2.5.0, and the scripts README lists the four bash suites.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temporary files for the probes and the baseline are in `scratch/` only.
- [ ] CHK-051 [P1] `scratch/` is cleaned before completion (T049).
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 0/12 |
| P1 Items | 13 | 0/13 |
| P2 Items | 1 | 0/1 |

**Verification Date**: Not yet verified. Authored 2026-10-26.
<!-- /ANCHOR:summary -->

---
