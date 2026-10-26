---
title: "Acceptance Criteria: Phase 7: checker-debt-closeout"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "checker debt closeout acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/015-quality-agnostic-gate/007-checker-debt-closeout"
    last_updated_at: "2026-10-26T06:30:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Authored 23 criteria and recorded the live CI run as Met"
    next_safe_action: "Land the phase on main; all criteria are Met"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-007-authoring"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.3 -->
# Acceptance Criteria: Phase 7: checker-debt-closeout

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-code/015-quality-agnostic-gate/007-checker-debt-closeout
**Level:** 2
**Status:** 23 of 23 criteria Met
**Date:** 2026-10-26
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

Commands run from the repository root. Set the variables from `tasks.md` (`Q`, `H`, `P`, `BASE`). A `\|` inside a table cell stands for a plain `|` in the command.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the changed ceiling report, When its source is searched, Then it defines no comment scanner and it names the checker it loads (T005) | `rg -c 'def (find_unquoted_comment\|comment_text\|family_reader)' $Q/scripts/ceiling-report.sh` prints nothing and exits 1, and `rg -c 'check-comment-hygiene\.sh' $Q/scripts/ceiling-report.sh` prints a number of 1 or more. Evidence 2026-10-26: the first command printed nothing and exited 1, and the second printed `2`. | Met | - |
| AC-002 | REQ-001 | Given the ceiling suite has run, When the scripts folder is listed, Then no bytecode folder was written beside the scripts (T011) | `bash $Q/scripts/ceiling-report.test.sh > /dev/null && find $Q/scripts -name __pycache__ \| wc -l` prints `0`. Evidence 2026-10-26: the command printed `0` and exited 0. | Met | - |
| AC-003 | REQ-002 | Given a template literal that spans lines, one with an escaped backtick and a comment after a closed literal, When the checker suite runs, Then the first two are clean and the third is flagged (T009) | `bash $Q/scripts/check-comment-hygiene.test.sh 2>&1 \| rg -c '^PASS (js_template_literal_lines\|js_template_escaped_backtick\|js_comment_after_template\|glob_in_template_text\|go_raw_string_lines)$'` prints `5`. Evidence 2026-10-26: the command printed `5`. | Met | - |
| AC-004 | REQ-003 | Given a heredoc body, a `<<-` opener with a quoted word, a comment after the closer, a here-string and an arithmetic shift, When the checker suite runs, Then the two bodies are clean and the other three are flagged (T010) | `bash $Q/scripts/check-comment-hygiene.test.sh 2>&1 \| rg -c '^PASS (sh_heredoc_body\|sh_heredoc_dash_quoted\|sh_comment_after_heredoc\|sh_here_string\|sh_arith_shift)$'` prints `5`. Evidence 2026-10-26: the command printed `5`. | Met | - |
| AC-005 | REQ-004 | Given a `ceiling:` line inside a YAML block scalar, a docstring, a triple-quoted data string, a template literal and a heredoc, When the ceiling suite runs, Then only the docstring marker is listed (T011) | `bash $Q/scripts/ceiling-report.test.sh 2>&1 \| rg -c '^PASS (yaml_block_scalar_marker\|py_docstring_marker\|py_data_string_marker\|js_template_literal_marker\|sh_heredoc_marker)$'` prints `5`, and the last line reads `All ceiling report test cases passed`. Evidence 2026-10-26: the command printed `5`, and the suite's last line read `All ceiling report test cases passed`. | Met | - |
| AC-006 | REQ-001 | Given an extensionless file with a python3 shebang, and a report copied to a folder with no checker, When the report runs on each, Then the first lists its docstring marker and the second exits 2 with a message (T006, T007) | `bash $Q/scripts/ceiling-report.test.sh 2>&1 \| rg -c '^PASS (shebang_language\|missing_checker)$'` prints `2`. Evidence 2026-10-26: the command printed `2`. | Met | - |
| AC-007 | REQ-005 | Given a block-comment body line that starts with `ceiling:` and a prose comment that holds the word later, When the ceiling suite runs, Then the body line is a marker and the prose is not (T008) | `bash $Q/scripts/ceiling-report.test.sh 2>&1 \| rg -c '^PASS (block_body_marker\|prose)$'` prints `2`. Evidence 2026-10-26: the command printed `2`. | Met | - |
| AC-008 | REQ-006 | Given a bare triple-quoted string after other code in a function body, When the checker runs, Then it reads the string as comment text and flags its label (T012) | `rg -n 'run_case 1 "py_string_after_code"' $Q/scripts/check-comment-hygiene.test.sh` prints one line, and `bash $Q/scripts/check-comment-hygiene.test.sh` prints `All comment hygiene test cases passed`. Evidence 2026-10-26: the first command printed one line at line 114, and the suite's last line read `All comment hygiene test cases passed` with exit 0. | Met | - |
| AC-009 | REQ-007 | Given an assigned string, a call argument, a return value, a dict value, a bare f-string, an f-string first in a def, a bare string in an `if` body and a bare single-quoted string, When the checker suite runs, Then the first six stay data and the last two are flagged (T013, T014) | `bash $Q/scripts/check-comment-hygiene.test.sh 2>&1 \| rg -c '^PASS (py_data_string\|py_call_argument\|py_return_value\|py_dict_value\|py_fstring_statement\|py_fstring_first_in_def\|py_bare_string_in_if\|py_single_quoted_statement)$'` prints `8`. Evidence 2026-10-26: the command printed `8`. | Met | - |
| AC-010 | REQ-012 | Given the `BASE` checker and the working-tree checker over every tracked file, When their findings are compared, Then the delta is saved and every line falls in a class the quality changelog counts (T016) | `wc -l < $P/evidence/delta.txt` prints the delta count named in `$Q/changelog/v1.9.0.0.md`, and the class counts there add up to it. Evidence 2026-10-26: `wc -l` printed `3`, and the changelog reads `The extraction removed 3 findings. One sat inside a template literal and two inside a heredoc body. The f-string count stayed at 0.`, so the classes add to 3. | Met | - |
| AC-011 | REQ-012 | Given the saved delta, When its added lines outside `specs/` are counted, Then they stay within the ADR-006 halt limits (T017) | `awk '/^\t/ && !/^\tspecs\//' $P/evidence/delta.txt \| wc -l` prints a number of 50 or fewer, in 20 files or fewer. Evidence 2026-10-26: the command printed `0`, and the same lines cut to their paths counted `0` files. | Met | - |
| AC-012 | REQ-008 | Given the final checker, When it runs over every tracked file, Then it prints no finding and no error (T021) | `git ls-files -z \| xargs -0 python3 -B $Q/scripts/check-comment-hygiene.sh -- 2>&1 \| wc -l` prints `0`, against `63` at `f69e5cd2e8`. Evidence 2026-10-26: the command printed `0` with exit 0 and the checker itself exited 0, and `wc -l < $P/evidence/tree-before.txt` printed `63` for the `BASE` run. | Met | - |
| AC-013 | REQ-009 | Given every changed file under `specs/`, When each is parsed for its language, Then each still parses, and each YAML or TOML file loads to the same data as at `BASE` (T020) | The parse loop of T020 prints `failed=0`. Evidence 2026-10-26: T020 printed `checked=38 failed=0` over the 38 files under `specs/` outside this packet that had changed at that point. A rerun over the 44 changed files, with `bash -n`, `node --check`, `ast.parse` and `json.load`, printed `checked=44 failed=0`. The extra 6 are the two `graph-metadata.json` files, phase 001's `implementation-summary.md`, the parent `spec.md`, the compiled-route manifest and the packet changelog, all written after T020. YAML and TOML loaded to the same data as at `BASE` in the T020 run, the TOML comparison under `/opt/homebrew/bin/python3` because the `python3` first on PATH has no `tomllib`. | Met | - |
| AC-014 | REQ-010 | Given the frozen files, When their diff is read and the blocking layers are searched, Then every change is the ` hygiene-ok` suffix and no path-wide exclusion was added (T019) | The diff script of T019 prints `suffix-only=yes`, `git diff --stat $BASE -- .github/workflows/comment-hygiene.yml .skilled/scripts/git-hooks/pre-commit .skilled/hooks/git/pre-commit` prints nothing, and `rg -n 'z_archive\|pre-promote-backup\|lineages' $Q/scripts/check-comment-hygiene.sh` prints nothing. Evidence 2026-10-26: the pairing script over the 26 frozen files of `spec.md` section 3 printed `pairs 43 43` and `suffix-only=yes`, `git diff --stat f69e5cd2e8` on the CI job and both pre-commit files printed nothing with exit 0, and the `rg` search printed nothing with exit 1. | Met | - |
| AC-015 | REQ-011 | Given the strict-validate counts of every touched packet before and after, When the two records are joined, Then no packet has more errors or more warnings after the change (T003, T022) | `join -t "$(printf '\t')" <(sort $P/evidence/validate-before.tsv) <(sort $P/evidence/validate-after.tsv) \| awk -F'\t' '$4 > $2 \|\| $5 > $3 { w++ } END { print "worse=" w+0, "rows=" NR }'` prints `worse=0` and the T003 row count. Evidence 2026-10-26: the join printed `worse=0 rows=31`, and `wc -l` on `$P/evidence/validate-before.tsv` and on `$P/evidence/validate-after.tsv` printed `31` each. | Met | - |
| AC-016 | REQ-011 | Given the finished change, When the derived metadata files are listed, Then only the packets the spec-remint gate covers changed them, and the other session's lineage is untouched (T023) | `git status --porcelain -- 'specs/**/graph-metadata.json' 'specs/**/description.json'` lists only files of this phase, `001-honest-checker` and the parent, and `git status --porcelain -- specs/hooks/023-session-relaunch-loop/research/lineages/` prints nothing. Evidence 2026-10-26: the derived-file listing held `001-honest-checker/graph-metadata.json`, the parent `graph-metadata.json`, this phase's `description.json` and this phase's `graph-metadata.json`, and the lineage listing printed nothing with exit 0. | Met | - |
| AC-017 | REQ-013 | Given the changed quality scripts and suites, When the checker runs over them, Then their own comments carry no label (T033) | `python3 -B $Q/scripts/check-comment-hygiene.sh $Q/scripts/ceiling-report.sh $Q/scripts/check-comment-hygiene.sh $Q/scripts/ceiling-report.test.sh $Q/scripts/check-comment-hygiene.test.sh && echo clean` prints `clean`. Evidence 2026-10-26: the command printed `clean` and exited 0. | Met | - |
| AC-018 | REQ-014 | Given the coordinator's proof file, When its run is recorded, Then `tasks.md` holds the run URL, the job conclusion and the annotation lines (T024) | `rg -c 'actions/runs/40276844110' $P/tasks.md` prints a number of 1 or more, and T024 names conclusion `failure` and the annotation at `ci-hygiene-proof.sh:2`. Evidence 2026-10-26: `2`. | Met | - |
| AC-019 | REQ-015 | Given phase 001's implementation summary, When its Known Limitations are read, Then items 1 to 4 each name this phase as what closed them, and no other part changed apart from the continuity block (T025) | `sed -n '/ANCHOR:limitations/,/\/ANCHOR:limitations/p' specs/sk-code/015-quality-agnostic-gate/001-honest-checker/implementation-summary.md \| rg -c '007-checker-debt-closeout'` prints `4`, and every hunk of `git diff -U0` on that file sits in the `_memory` block or in items 1 to 4. Evidence 2026-10-26: the `sed` and `rg` pipeline printed `4`, and `git diff -U0 f69e5cd2e8` on that file showed three hunks, at `_memory` line 11, at `_memory` line 13 and at lines 171 to 174, which are items 1 to 4 inside the limitations anchor that opens at line 168. | Met | - |
| AC-020 | REQ-016 | Given the new versions, When the quality mode and the hub are read, Then they carry 1.9.0.0 and 3.5.0.0, and the quality, hub and packet changelogs exist (T027, T028, T030) | `rg -n '^version: 1\.9\.0\.0$' $Q/SKILL.md && rg -n '^version: 3\.5\.0\.0$' $H/SKILL.md && node -p "[require('./$H/hub-router.json').version, require('./$H/mode-registry.json').version, require('./$H/description.json').version].join(',')"` prints the two version lines and `3.5.0.0,3.5.0.0,3.5.0.0`, and `test -f` on `$Q/changelog/v1.9.0.0.md`, `$H/changelog/v3.5.0.0.md` and `specs/sk-code/015-quality-agnostic-gate/changelog/changelog-015-007-checker-debt-closeout.md` each exit 0. Evidence 2026-10-26: the two `rg` reads printed `5:version: 1.9.0.0` and `5:version: 3.5.0.0`, the `node -p` read printed `3.5.0.0,3.5.0.0,3.5.0.0`, and `test -f` exited 0 on all three changelogs, the packet one written by `nested-changelog.js --write` | Met | - |
| AC-021 | REQ-018 | Given the final tree, When the quality suites, the consumer suites and the hub validators run, Then each passes (T029, T031, T032) | The four bash suites print their pass lines with no `FAIL` line, `node --test --test-reporter=tap $Q/scripts/tests/*.test.cjs 2>&1 \| rg '^# fail'` prints `# fail 0`, the router unit test exits 0, `node .skilled/bin/compiled-route-guard.cjs` prints `All hubs fresh or excused`, and `parent-skill-check.cjs`, `generate-leaf-manifest.cjs --check` and `sync-skills-hermes.cjs --check` each exit 0. Evidence 2026-10-26: the four bash suites exited 0 with `All comment hygiene test cases passed` at 130 PASS lines, `All ceiling report test cases passed` at 23, `All typo-flag test cases passed` at 9 and `Post-edit adapter parse regression fixture passed`, which is 162 PASS lines against T001's 115, each with no `FAIL` line, the runner suite printed `# fail 0`, the router unit test exited 0, the guard printed `All hubs fresh or excused`, `parent-skill-check.cjs` printed `OK` with `0 warnings`, `generate-leaf-manifest.cjs --check` printed `leaf-manifest.json OK`, and `sync-skills-hermes.cjs --check` printed `PASS: 67 Hermes skill copies in sync`, all with exit 0. | Met | - |
| AC-022 | REQ-017 | Given the report, the scripts README and the quality mode, When their text is searched, Then none says the report tracks no string state, and both docs say it reads comment text through the checker (T026) | `rg -n 'not tracked' $Q/scripts/ceiling-report.sh` prints nothing, and `rg -c 'ceiling-report.sh.*comment text' $Q/scripts/README.md $Q/SKILL.md` prints a count of 1 or more for each file. Evidence 2026-10-26: `rg -n 'not tracked' $Q/scripts/ceiling-report.sh` printed nothing with exit 1, and `rg -c 'ceiling-report.sh.*comment text'` printed `1` for `$Q/scripts/README.md` and `1` for `$Q/SKILL.md`. | Met | - |
| AC-023 | All | Given the finished phase, When the strict validator runs on this folder and on the parent alone, Then each last line reads `RESULT: PASSED` (T035) | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh $P --strict --no-recursive \| tail -1` prints `RESULT: PASSED`, and the same command on `specs/sk-code/015-quality-agnostic-gate` prints `RESULT: PASSED`. Evidence 2026-10-26: the final run on this folder printed `Summary: Errors: 0  Warnings: 0` and `RESULT: PASSED`, and the run on the parent alone printed `RESULT: PASSED` | Met | - |

### Status values

| Value | Meaning |
|-------|---------|
| `Met` | Verified. The Verification cell names evidence that was actually observed. |
| `Unmet` | Not yet satisfied. Blocks closure. |
| `Waived` | Deliberately not pursued. Requires an ADR in the Waiver cell. |
| `Superseded` | Replaced by a different criterion or decision. Requires an ADR in the Waiver cell. |

### Waiver cell

Write `-` when the row is `Met` or `Unmet`. Write `ADR-NNN` when the row is
`Waived` or `Superseded`, naming a decision record that exists in
`decision-record.md`. A waiver naming an ADR that is not there fails validation:
the point of a waiver is that someone recorded the reasoning, so an unbacked
waiver is treated as an unmet criterion rather than as a pass.
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** Yes

All 23 criteria are Met, each with the evidence its Verification cell names, and no row carries a waiver. AC-020 closed when T030 wrote the packet changelog, and AC-023 closed when T035 ran the strict validator on this folder and on the parent. The fix round of T037 to T042 landed after that run, so this record was reconciled and the validator was run again before this statement was written.
<!-- /ANCHOR:closure -->
