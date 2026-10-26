---
title: "Changelog: Phase 1: honest-checker [015-quality-agnostic-gate/001-honest-checker]"
description: "Chronological changelog for the Phase 1: honest-checker phase."
trigger_phrases:
  - "quality agnostic gate honest checker changelog"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-10-26

> Spec folder: `specs/sk-code/015-quality-agnostic-gate/001-honest-checker` (Level 2)
> Parent packet: `specs/sk-code/015-quality-agnostic-gate`

### Summary

Steps 1 to 4 of plan.md are built, and the Phase 3 verification tasks have run. The baseline at T043 first passed the ADR-010 file limit. The coordinator's ruling, recorded as the ADR-010 amendment, counts only the delta outside specs/, so this pass cleared those lines and left the packet artifacts as debt.

### Added

- Narrow the NNN/NNN pattern at line 161 to \b\d{3}/0\d{2}\b, so the second number must be zero-padded (Q/scripts/check-comment-hygiene.sh). Verify: printf '// retry ratio 100/250\n' > scratch/ratio.js makes the checker exit 0 with no output, and printf '// ratio 042/003\n' > scratch/zero.js makes it exit 1. Evidence 2026-10-26: scratch/ratio.js printed nothing and exited 0, and scratch/zero.js printed scratch/zero.js:1: // ratio 042/003 [packet/phase reference] and exited 1.
- Add one violation case and one clean case each for py, sh, tsx, mts, jsonc, go, rs, yaml, css, toml and sql to the suite (Q/scripts/check-comment-hygiene.test.sh, the run_case rows at lines 39 to 65). Verify: bash Q/scripts/check-comment-hygiene.test.sh prints All comment hygiene test cases passed and exits 0. Evidence 2026-10-26: the suite exited 0 with 80 PASS lines, no FAIL line, and the last line All comment hygiene test cases passed. The 22 language cases are among the 80.
- Add regression cases to the suite for URL spans, docstrings, block bodies, the issue rule, the slash pattern, the pinned patterns, the clean F02 strings without the two residual phrases, the JSON shape, the reason text, usage exit 3 and an unreadable second file in the JSON (Q/scripts/check-comment-hygiene.test.sh). Verify: bash Q/scripts/check-comment-hygiene.test.sh prints All comment hygiene test cases passed and exits 0. Evidence 2026-10-26: the same run exited 0 with 80 PASS lines and the All-passed line. An earlier version of the suite, run against the HEAD checker, failed 32 cases, so the new cases test the changed behavior. The suite also covers glob_in_template_text, the regression for a /** glob inside a template literal that the baseline first surfaced.
- Add a case to the ceiling suite that runs the report from a subfolder of a temporary repository and checks its marker line (Q/scripts/ceiling-report.test.sh). Verify: bash Q/scripts/ceiling-report.test.sh prints All ceiling report test cases passed and exits 0. Evidence 2026-10-26: the suite exited 0 with 9 PASS lines and the last line All ceiling report test cases passed. The new case subfolder_of_foreign_repo failed when run against the HEAD report.
- Read the extension list from the family table, with the built-in set as fallback when the table cannot be read (.skilled/hooks/post-edit-quality/lib/post-edit-router.cjs, line 44). Verify: node --test .skilled/hooks/post-edit-quality/lib/post-edit-router.test.cjs exits 0, including the case falls back to the built-in extension set. Evidence 2026-10-26: the same run exited 0, including ✔ falls back to the built-in extension set and ✔ dispatches the languages the family table adds.
- Add the router unit test beside the router, with cases for the resolution order, the table fallback, one notice and silence (.skilled/hooks/post-edit-quality/lib/post-edit-router.test.cjs). Verify: node --test .skilled/hooks/post-edit-quality/lib/post-edit-router.test.cjs exits 0. Evidence 2026-10-26: node --test exited 0 with tests 6 pass 6 fail 0. Run against a copy of the HEAD router, 5 of the 6 cases failed.

### Changed

- Run the four quality bash suites before any change and save their output to scratch/baseline-suites.txt. Verify: grep -c '^PASS' scratch/baseline-suites.txt prints 43 (26 checker, 8 ceiling and 9 typo-flag lines). Evidence 2026-10-26: grep -c '^PASS' scratch/baseline-suites.txt printed 43, and each of the four suites exited 0 before the first edit.
- Run the codex and devin adapter suites and the opencode plugin suite before any change, and save their output to scratch/baseline-adapters.txt. The three files are .skilled/hooks/post-edit-quality/codex/post-edit-quality.test.cjs, .skilled/hooks/post-edit-quality/devin/post-edit-quality.test.cjs and .opencode/plugins/tests/sk-code-post-edit-quality.test.cjs. Verify: each of the three node --test commands exits 0. Evidence 2026-10-26: the three node --test runs exited 0, and scratch/baseline-adapters.txt records tests 3 pass 3 fail 0, tests 4 pass 4 fail 0 and tests 51 pass 51 fail 0.
- Load the table in the checker from the script's real path, and exit 3 when the table cannot be read (Q/scripts/check-comment-hygiene.sh, the language block at lines 38 to 52). Verify: copy the checker to scratch/no-table/ without an assets folder, then run it on scratch/clean.js, which exits 3. Evidence 2026-10-26: python3 -B scratch/no-table/check-comment-hygiene.sh scratch/clean.js exited 3 and printed ERROR: cannot load the comment family table .../scratch/no-table/../assets/comment-syntax.json: [Errno 2] No such file or directory.
- Choose each file's language from its shebang when the shebang names one, and from its extension otherwise, reading only the first line (Q/scripts/check-comment-hygiene.sh, lines 38 to 52). Verify: printf '#!/usr/bin/env python3\n# ADR-12 x\n' > scratch/shebang.sh and then the checker on that file prints a line ending [ADR reference] and exits 1. Evidence 2026-10-26: the checker printed scratch/shebang.sh:2: # ADR-12 x [ADR reference] and exited 1.
- Remove URL spans from the comment text before the patterns run, in place of the whole-line skip (Q/scripts/check-comment-hygiene.sh, line 153 and the loop at lines 185 to 205). Verify: printf '// see https://example.test/a and specs/042-foo/x.md\n' > scratch/url.js and then the checker prints a line ending [spec path reference] and exits 1. Evidence 2026-10-26: the checker printed scratch/url.js:1: // see https://example.test/a and specs/042-foo/x.md [spec path reference] and exited 1.
- Treat Python docstring text and block-comment body lines as comment text (Q/scripts/check-comment-hygiene.sh, lines 121 to 143). Verify: a file with a docstring line REQ-12 is covered here. prints a line ending [REQ reference] and exits 1, and a block file with the body line ADR-12 body prints a line ending [ADR reference] and exits 1. Evidence 2026-10-26: scratch/doc.py printed scratch/doc.py:3: REQ-12 is covered here. [REQ reference] and exited 1, and scratch/block.js printed scratch/block.js:2: ADR-12 body [ADR reference] and exited 1. Only statement docstrings count, so a triple-quoted data string stays unchecked.

### Fixed

- Re-check every file and line this phase repeats against the current tree, and record any moved line in plan.md section 3 before the first edit. Verify: git show HEAD:.skilled/hooks/post-edit-quality/lib/post-edit-router.cjs | rg -n -F 'SOURCE_EXTENSIONS = new Set' prints one line numbered 44. The check reads HEAD, because T019 replaces that line in the working tree. Evidence 2026-10-26: the rg printed one line, 44:const SOURCE_EXTENSIONS = new Set([...]), and the reworded command printed the same line again after the review fixes and exited 0. The cited lines of the checker (38 to 52, 153, 160 to 181, 204, 217 to 218), the router (35 to 42, 208), the ceiling report (10, 34, 35), the CI job (26), Q/SKILL.md (140) and Q/README.md (116) all matched HEAD, so no moved line needed a record in plan.md.
- Create the family table with the extension, shebang and comment-family entries for the js family, py, sh, go, rs, css, yaml, toml, sql and jsonc (Q/assets/comment-syntax.json). Verify: node -p 'JSON.parse(require("fs").readFileSync(".skilled/skills/sk-code/sk-code-quality/assets/comment-syntax.json","utf8")) && "ok"' prints ok. Evidence 2026-10-26: the node command printed ok and exited 0. The table then held six families (c, rust, css, sql, hash, python) and eleven languages. T043 added the yaml family, and the review fixes added go and toml, so it now holds nine families (c, go, rust, css, sql, hash, yaml, toml, python) and the same eleven languages.
- Add the violation pattern for issue and ticket references, with the reason issue or ticket reference, to the list at lines 160 to 181 (Q/scripts/check-comment-hygiene.sh). The pattern matches fix, fixes, fixed, close, closes, closed, resolve, resolves, resolved, issue, ticket or bug, followed by # and digits, case-insensitively. In the same change, accept three repeatable arguments for repository additions: --ticket-prefix PREFIX, which adds \bPREFIX-[0-9][0-9A-Za-z]*\b, --extension EXT=FAMILY and --extra-pattern REGEX. Phase 003 passes them from the repository config, and this phase reads no config. Verify: printf '// fixes issue #1234\n' > scratch/issue.js and then the checker prints a line ending [issue or ticket reference] and exits 1, and printf '// see JIRA-12\n' > scratch/jira.js checked with --ticket-prefix JIRA exits 1 while the same file without the argument exits 0. Evidence 2026-10-26: scratch/issue.js printed scratch/issue.js:1: // fixes issue #1234 [issue or ticket reference] and exited 1. scratch/jira.js with --ticket-prefix JIRA printed scratch/jira.js:1: // see JIRA-12 [issue or ticket reference] and exited 1, and without the argument it printed nothing and exited 0. The suite cases extension_added and extra_pattern_added cover the other two arguments.
- Keep the T\d{3,4} pattern at line 166 and the phase 0 pattern at line 172 unchanged, as ADR-007 records (Q/scripts/check-comment-hygiene.sh). Verify: git show HEAD:.skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh | rg -n -F -e 'T\d{3,4}' -e 'phase\s+0+\d' prints two lines numbered 166 and 172, and the same rg on the working-tree checker prints the same two regexes. The line numbers come from HEAD, because the rewrite moves the table in the working tree. Evidence 2026-10-26: the rg printed two lines, 79: (task ID reference) with re.compile(r'\bT\d{3,4}\b') and 85: (bounded generic artifact label) with re.compile(r'\bphase\s+0+\d\b|\bspec\s+\d{3}\b', re.IGNORECASE). The same rg on git show HEAD: of the checker printed lines 166 and 172 with the same two regexes. After the review fixes added four constants above the table, the rg printed 89: and 95: with the same two regexes, and exited 0. Deviation: the line numbers moved, first to 79 and 85 and then to 89 and 95, because the checker now builds its pattern table at module level, ahead of the scanning functions. The patterns themselves are unchanged, which is the intent of the task. Rerun 2026-10-26 with the reworded Verify: the git show HEAD: form printed 166: and 172: and exited 0, and the working-tree rg printed 89: and 95: with the same two regexes and exited 0.
- Replace the stub checker in the codex fixture with a line the real checker flags, such as a quoted // see ADR-12, so the positive control runs the real checker (.skilled/hooks/post-edit-quality/codex/post-edit-quality.test.cjs, lines 38 and 57). Verify: node --test .skilled/hooks/post-edit-quality/codex/post-edit-quality.test.cjs exits 0. Evidence 2026-10-26: node --test exited 0 with tests 3 pass 3 fail 0. The edit test now asserts [ADR reference] from the real checker.
- Replace the stub checker in the devin fixture the same way (.skilled/hooks/post-edit-quality/devin/post-edit-quality.test.cjs, line 40). Verify: node --test .skilled/hooks/post-edit-quality/devin/post-edit-quality.test.cjs exits 0. Evidence 2026-10-26: node --test exited 0 with tests 4 pass 4 fail 0. Deviation: the router-first resolution broke 7 cases of .opencode/plugins/tests/sk-code-post-edit-quality.test.cjs, which relied on a stub in the project folder, and one case there asserted that a missing checker gives no finding. That file is not in the spec.md list. Its fixtures now carry content the real checker flags, its missing-checker case expects one quality-notice, and its budget and kill-switch cases run an isolated copy of the hook. node --test on it exited 0 with tests 51 pass 51 fail 0. ADR-009 says the suite already ran the real checker, which held for one case only.

### Verification

- Baseline before change (T001, T002) - 43 PASS lines over the four bash suites, all exit 0. The adapter suites passed 3/3, 4/4 and 51/51.
- Four quality bash suites (T044) - All exit 0 with their final lines, 115 PASS lines (95 checker, 11 ceiling, 9 typo-flag) and no FAIL line, after the review fixes.
- Router, codex, devin and opencode node --test runs (T045) - All exit 0, with 6/6, 3/3, 4/4 and 51/51 passing.
- sk-code-skilled node --test suites, the CI script-tests step - Exit 0, 27/27 passing.
- actionlint on both workflows (T046) - Exit 0, no output. The same binary reported a known-bad workflow.
- Local run of the comment-hygiene step (AC-013) - The step matched scratch/ci-step.sh. It annotated svc.go line 3 with ADR reference and exited 1, and with the table removed it reported checker exit 3 and exited 1.
- Checker on every changed code file (T047) - 40 files after the review fixes, each exit 0 with no output.
- Pre-commit suite (T054) - pre-commit gates: 134 passed, 0 failed, exit 0, against 132 and 0 before the change. Without the -- the two new cases fail.

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.skilled/skills/sk-code/sk-code-quality/assets/comment-syntax.json` | Created | The shared comment-family table, nine families, with YAML block scalars and TOML and Go multi-line strings |
| `.skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh` | Modified | The checker, rewritten around the table, with block scalar, multi-line string and Python statement state |
| `.skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.test.sh` | Modified | 95 cases, up from 26 |
| `.skilled/skills/sk-code/sk-code-quality/scripts/ceiling-report.sh` | Modified | Table extensions and comment tokens, and a working-directory root |
| `.skilled/skills/sk-code/sk-code-quality/scripts/ceiling-report.test.sh` | Modified | The subfolder, SQL and Go cases, 11 cases |
| `.skilled/hooks/post-edit-quality/lib/post-edit-router.cjs` | Modified | Table extensions, router-first resolution, the missing-checker notice |
| `.skilled/hooks/post-edit-quality/lib/post-edit-router.test.cjs` | Created | Six router unit cases |
| `.skilled/hooks/post-edit-quality/codex/post-edit-quality.test.cjs` | Modified | The real checker replaces the stub |
| `.skilled/hooks/post-edit-quality/devin/post-edit-quality.test.cjs` | Modified | The real checker replaces the stub |
| `.opencode/plugins/tests/sk-code-post-edit-quality.test.cjs` | Modified | Fixtures moved onto the real checker after router-first resolution (ADR-009) |
| `.github/workflows/comment-hygiene.yml` | Modified | Checker lookup, annotations, fail above exit 2 |
| `.github/workflows/sk-code-script-tests.yml` | Modified | Runs the four quality bash suites |
| `.skilled/commands/create/assets/*.yaml (20 files), .skilled/commands/design/assets/diagram-auto.yaml, diagram-confirm.yaml` | Modified | One header comment each keeps its meaning without the phase label |
| `.skilled/commands/speckit/assets/speckit-implement.yaml` | Modified | The nesting example shows its shape without a real packet path |
| `.skilled/skills/system-skill-advisor/runtime/tests/python/test_skill_advisor.py, .skilled/skills/sk-doc/sk-create-repo-rule/scripts/rule-experiment.py, .skilled/skills/sk-doc/scripts/tests/test_quick_validate_086.py` | Modified | Docstrings state their purpose without ids |
| `.skilled/skills/sk-code/sk-code-quality/SKILL.md` | Modified | Wording, DEFAULT_RESOURCE, version 1.5.0.0 |
| `.skilled/skills/sk-code/sk-code-quality/README.md` | Modified | The --all row, version 1.2.5.0 |
| `.skilled/skills/sk-code/sk-code-quality/scripts/README.md` | Modified | Four suites, the checker row, version 1.0.1.0 |
| `.skilled/skills/sk-code/sk-code-quality/references/code-style-guide.md` | Modified | specs/ path examples, version 2.2.4.0 |
| `.skilled/skills/sk-code/sk-code-quality/manual-testing-playbook/quality-gate/quality-checklist.md` | Modified | The three-resource loop, version 1.1.2.0 |
| `.skilled/skills/sk-code/sk-code-quality/manual-testing-playbook/manual-testing-playbook.md` | Modified | The node --check claim, version 1.1.1.0 |
| `.skilled/skills/sk-code/sk-code-skilled/assets/checklists/universal-checklist.md` | Modified | Spec-root rows, version 1.0.2.0 |
| `.skilled/skills/sk-code/SKILL.md, description.json, hub-router.json, mode-registry.json` | Modified | Hub version 3.1.0.0 |
| `.skilled/skills/sk-code/leaf-manifest.json` | Regenerated | The new asset, by generate-leaf-manifest.cjs --write |
| `.hermes/skills/sk-code/SKILL.md, .hermes/skills/sk-code-quality/SKILL.md` | Regenerated | By sync-skills-hermes.cjs |
| `.skilled/skills/sk-code/sk-code-quality/changelog/v1.5.0.0.md` | Created | Quality release notes with the final baseline classes |
| `.skilled/skills/sk-code/changelog/v3.1.0.0.md` | Created | Hub release notes |
| `specs/sk-code/015-quality-agnostic-gate/changelog/changelog-015-001-honest-checker.md` | Created | Packet changelog, by nested-changelog.js --write |
| `.skilled/scripts/git-hooks/pre-commit, .skilled/hooks/git/pre-commit` | Modified | -- before the staged paths |
| `.skilled/scripts/git-hooks/tests/pre-commit.test.sh` | Modified | One case per hook for a staged name that starts with -- |
| `.skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-code/manifest.json and its authored copy under specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/013-live-activation/activation/sk-code/` | Re-minted | By compiled-route-manifest.cjs refresh, then copied |

### Follow-Ups

- CHK-FIX-007 Evidence is pinned to the phase's first commit, not to a moving branch range. Open 2026-10-26: the phase is not committed, so no commit exists to pin to. The evidence here is from the working tree on HEAD 1a3e2f8d24.
- The drift-guard wrapper fails on router-sync. DEFAULT_RESOURCE was the only router entry naming assets/code-quality-checklist/naming-init-formatting-and-css.md and verification-quick-reference-and-related.md. The CQ-001 playbook frontmatter still expects both. CI does not run this guard on the real tree, so nothing blocks a push. Workaround: name both assets in the quality mode's RESOURCE_MAP, set the CQ-001 expected_resources to the three DEFAULT_RESOURCE paths, and rerun run-all-drift-guards.sh. Both files sit outside this pass's write scope.
- Packet artifacts carry accepted debt. 19 comments in 13 files under specs/ now fail the checker. Pre-commit and CI check whole files, so each fails when its file is touched. Workaround: rewrite it to its durable reason or mark it hygiene-ok then.
- The ceiling report still reads YAML block scalar text as comments. It takes extensions and comment tokens from the table but tracks no block scalar, multi-line string or docstring state, so a # ceiling: line inside a block scalar is listed. The report never gates, so the gap adds a report line and blocks nothing.
- A string statement in the middle of a Python body is data. Only a docstring in a place Python or its tools read one counts as comment text, so a triple-quoted string used as a block comment after other code is not checked.
- The CI failure path has no live run. The ADR-010 amendment accepts actionlint and a local run of the step's script in its place.
