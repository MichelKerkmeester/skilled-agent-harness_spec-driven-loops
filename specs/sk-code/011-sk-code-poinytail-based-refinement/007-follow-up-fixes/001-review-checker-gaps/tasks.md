---
title: "Tasks: Phase 1: review-checker-gaps"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "review checker gaps tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 1: review-checker-gaps

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

**Conventions for every task below.** Run each command from the worktree root. Set these two shell variables first, and the commands below use them:

```bash
P=specs/sk-code/011-sk-code-poinytail-based-refinement/007-follow-up-fixes/001-review-checker-gaps
C=.skilled/skills/sk-code/sk-code-review/scripts
```

Read each command's output and exit status before you mark a task done. Do not run `rm -rf`, `git diff`, `git add`, `git stash` or any other git write. Compare against `$P/scratch/before-sk-code-review/` with `diff -rq` instead of `git diff`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup (capture the before state)

- [x] T001 Confirm the saved copy matches the tree before any edit: `diff -rq $P/scratch/before-sk-code-review .skilled/skills/sk-code/sk-code-review` prints nothing and exits 0. The planner saved this copy before writing any edit. (`$P/scratch/before-sk-code-review/`) Evidence: diff -rq $P/scratch/before-sk-code-review .skilled/skills/sk-code/sk-code-review; echo exit=$? -> exit=0, no diff lines.
- [x] T002 Re-capture the canary baseline: `node $C/check-rule-copies.js > $P/scratch/before-canary.txt 2>&1; echo "exit=$?"`. Expected: `exit=0` and the line `OK: all rule invariants present (5 exact-string file(s) + 2 Iron Law file(s) + 21 delivery-prefix anchor(s) + 2 example output(s)).` (`$C/check-rule-copies.js`) Evidence: node $C/check-rule-copies.js; echo exit=$? -> exit=0; line 1 is OK: all rule invariants present (5 exact-string file(s) + 2 Iron Law file(s) + 21 delivery-prefix anchor(s) + 2 example output(s)).
- [x] T003 Re-capture the harness baseline: `bash $C/check-rule-copies.test.sh > $P/scratch/before-harness.txt 2>&1; echo "exit=$?"; grep -c '^PASS ' $P/scratch/before-harness.txt`. Expected: `exit=0` and the count `38`. (`$C/check-rule-copies.test.sh`) Evidence: bash $C/check-rule-copies.test.sh; echo exit=$?; grep -c '^PASS ' -> exit=0, count 38, last line All rule-canary test cases passed.
- [x] T004 Confirm the four before-fix repro outputs against the saved record: `cat $P/scratch/before-repro.txt`. Expected: the skip-after-body, no-blank, two-blank and two-Not-checked inputs each print `OK: review output ends on the exact status line` with exit 0, the missing file and the stdin-from-directory probe each print only the usage line with exit 2, and the banner widths are `[79, 81, 79]`. The planner recorded these; re-run them with `node $C/check-review-final-line.js $P/scratch/repro/<file>` and compare. (`$P/scratch/before-repro.txt`) Evidence: node $C/check-review-final-line.js on each scratch/repro file -> g1-skip-after-body OK exit 0; g2-no-blank OK exit 0; g2-two-blank OK exit 0; g2-two-notchecked OK exit 0; g2-missing-not-checked FAIL no Not checked line exit 1; missing file and stdin-from-directory print the usage line with exit 2; banner widths [79, 81, 79]. Matches before-repro.txt.
- [x] T005 Record the Node and Bash versions: `node --version; bash --version | head -1`. Write both lines into the log of `goal.md`. (`$P/goal.md`) Evidence: node --version; bash --version | head -1 -> v26.8.2; GNU bash, version 3.2.57(1)-release (arm64-apple-darwin26). Written to the goal.md LOG Environment section.
- [x] T006 Re-check the two example outputs against the new spacing rule before editing: for `SKILL.md` (marker `**Example output bottom:**`) and `README.md` (marker `**Step 2: Run the primary workflow.**`), the fenced block must have one empty line above its `Review status:` line, a `Not checked:` line above that empty line, and exactly one `Not checked:` line in total. The planner found both compliant (SKILL.md block 8 lines, README.md block 32 lines). Record any block that does not comply, and do not edit it in this phase. (`.skilled/skills/sk-code/sk-code-review/SKILL.md`, `.skilled/skills/sk-code/sk-code-review/README.md`) Evidence: python3 -I extract of each fenced block -> SKILL.md 8 lines, README.md 32 lines; each has 1 blank line above its Review status line, Not checked directly above that blank, 1 Not checked line in total.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T007 Add the skip-placement rule (rule 5 in plan.md section 3). Find the line `  if (EXACT_STATUS.test(finalLine)) {` in `checkReviewOutput`. Insert before it a block that returns `['skip status must be the whole output']` when `COMMENTED_SKIP_STATUS.test(finalLine)` is true and `lines.length > 1`. When the output is one line, a skip status passes, so the block returns nothing and the function reaches its existing `return []`. (`$C/check-review-final-line.js`) Evidence: node --check check-review-final-line.js -> exit=0; skip-placement block sits above the EXACT_STATUS branch.
- [x] T008 Replace the bare-status spacing loop (rules 6 and 7 in plan.md section 3). Find this text, which follows the `if (EXACT_STATUS.test(finalLine)) {` line: `    let precedingIndex = lines.length - 2;` through `      return ['no "Not checked:" line above the status line'];` and its closing `  }`. Replace it with: count the blank lines directly above the status line, using `trim() === ''`; return the blank-line message for zero or for two or more; take the nearest non-blank line above the blank run, and fail the Not checked message unless it matches `/^Not checked: \S/`; count the lines that start with `Not checked:` in the whole output, and fail `more than one "Not checked:" line in the output` when the count is two or more. Collect every failure into one array. Guard against an index below zero. (`$C/check-review-final-line.js`) Evidence: node --check check-review-final-line.js -> exit=0; blank-count, Not checked and count messages collected into one failures array.
- [x] T009 Make the file-read error path print its cause. Find this text in `runCli`: `  } catch {` followed by `    console.error('usage: check-review-final-line.js [file]');`. Change it to `  } catch (error) {`, print `cannot read ${inputPath === null ? 'stdin' : inputPath}: ${error.message}` with `console.error` first, then keep the usage line, `process.exitCode = 2` and `return`. (`$C/check-review-final-line.js`) Evidence: node --check check-review-final-line.js -> exit=0; catch block prints the cannot read line before the usage line.
- [x] T010 Widen the banner border to match its title. Lines 2 and 4 of the file are the border, `// ╔` and `// ╚` lines, each with 74 `═` characters. Add two `═` characters to each so both lines are 81 code points. Line 3 is the title, `// ║ check-review-final-line - validates the final status line in review output ║`, and it stays unchanged. (`$C/check-review-final-line.js`, lines 2 and 4) Evidence: python3 -I width check of lines 2 to 4 -> True [81, 81, 81] after the two-character widening of lines 2 and 4 (banner text unchanged).
- [x] T011 Add five tamper cases to the harness. Find this line: `expect_output 'no "Not checked:" line above the status line' "final_line_missing_not_checked_output" node "$FINAL_LINE_CHECKER" "$FINAL_LINE_MISSING_NOT_CHECKED"`. Insert after it, and before the line `# Seeded examples ensure the canary rejects content after status and missing context.`, five cases. Each case writes its input with `printf` into a file under `$TMP_DIR`, then calls `run_case` with the expected exit code and `expect_output` with the message. Case names and inputs: (a) `final_line_skip_after_body`, input `Findings\n\nNot checked: nothing material\n\nReview status: COMMENTED (skipped: diff below evidence threshold of 50 lines, no sensitive paths touched)\n`, exit 1, message `skip status must be the whole output`. (b) `final_line_no_blank_above_status`, input `Findings\nNot checked: nothing material\nReview status: APPROVED\n`, exit 1, message `no blank line above the status line`. (c) `final_line_two_blank_above_status`, input `Findings\n\nNot checked: nothing material\n\n\nReview status: APPROVED\n`, exit 1, message `more than one blank line above the status line`. (d) `final_line_two_not_checked`, input `Not checked: a\n\nNot checked: b\n\nReview status: APPROVED\n`, exit 1, message `more than one "Not checked:" line in the output`. (e) `final_line_unreadable_file`, no input file, the path `$TMP_DIR/no-such-file.md`, exit 2, message `cannot read $TMP_DIR/no-such-file.md: `. Each `expect_output` pattern is double-quoted in bash, so escape the inner double quotes. (`$C/check-rule-copies.test.sh`) Evidence: bash -n check-rule-copies.test.sh -> exit=0; five cases added before the seeded examples. Their run is in T017.
- [x] T012 Rewrite the checker's README row. Find the row that starts `| \`check-review-final-line.js\` |` in `$C/README.md`, at line 20. Replace its description cell, which is the text from `Checks that full reviews end on an exact status line with` through `Exits 0 on pass, 1 on validation failure and 2 when a file cannot be read`, with exactly this text, between the double-backtick delimiters: ``Checks that full reviews end on an exact status line. The line above the status line must be one blank line, and the line above that blank line must start with `Not checked:` followed by text. The output must hold exactly one line that starts with `Not checked:`. A skip status such as `Review status: COMMENTED (skipped: ...)` passes only as the whole output. Trailing text, trailing whitespace on the status line and a result block below the status line also fail. Reads a file argument or stdin. Exits 0 on pass, 1 on validation failure and 2 when a file cannot be read, and prints the cause before the usage line.`` Keep the two-column table shape and the cell's closing ` |`. The text has no em dash, no semicolon and no serial comma. (`$C/README.md`, line 20) Evidence: sed -n 20p scripts/README.md shows the rewritten checker row with the cell text and closing pipe; the grep is in T019.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 REQ-001, skip status after a body fails: `node $C/check-review-final-line.js $P/scratch/repro/g1-skip-after-body.md; echo "exit=$?"`. Expected: `FAIL: skip status must be the whole output` and `exit=1`. Then run the two existing whole-output skip cases through the harness in T017. (`$C/check-review-final-line.js`) Evidence: node check-review-final-line.js scratch/repro/g1-skip-after-body.md -> FAIL: skip status must be the whole output; exit=1.
- [x] T014 REQ-002, spacing and count rules give distinct messages: run each file in `$P/scratch/repro/` through the checker. `g2-no-blank.md` expects `FAIL: no blank line above the status line` and exit 1. `g2-two-blank.md` expects `FAIL: more than one blank line above the status line` and exit 1. `g2-two-notchecked.md` expects `FAIL: more than one "Not checked:" line in the output` and exit 1. `g2-missing-not-checked.md` expects `FAIL: no "Not checked:" line above the status line` and exit 1. (`$P/scratch/repro/`) Evidence: g2-no-blank -> FAIL: no blank line above the status line, exit=1; g2-two-blank -> FAIL: more than one blank line above the status line, exit=1; g2-two-notchecked -> FAIL: more than one "Not checked:" line in the output, exit=1; g2-missing-not-checked -> FAIL: no "Not checked:" line above the status line, exit=1.
- [x] T015 REQ-003, unreadable input reports its cause: `node $C/check-review-final-line.js $P/scratch/repro/missing.md; echo "exit=$?"`. Expected: the first line starts with `cannot read ` followed by the path and `: ENOENT`, the second line is `usage: check-review-final-line.js [file]`, and `exit=2`. Then `node $C/check-review-final-line.js < .skilled; echo "exit=$?"` from the worktree root. Expected: a first line starting `cannot read stdin: `, the usage line, and `exit=2`. Record the exact text printed. (`$C/check-review-final-line.js`) Evidence: missing.md -> first line cannot read .../scratch/repro/missing.md: ENOENT, then usage line, exit=2; stdin from the .skilled directory -> cannot read stdin: EISDIR, then usage line, exit=2.
- [x] T016 REQ-004, banner width matches: `python3 -c "import sys; ls=open('$C/check-review-final-line.js',encoding='utf8').read().split('\n'); w=[len(l) for l in ls[1:4]]; print(w[0]==w[1]==w[2], w)"`. Expected: `True [81, 81, 81]`. Count code points, not bytes, because `awk length` counts bytes under some locales. (`$C/check-review-final-line.js`, lines 2 to 4) Evidence: python3 width check -> True [81, 81, 81].
- [x] T017 REQ-005, harness passes with 48 PASS lines: `bash $C/check-rule-copies.test.sh > $P/scratch/after-harness.txt 2>&1; echo "exit=$?"; grep -c '^PASS ' $P/scratch/after-harness.txt; tail -1 $P/scratch/after-harness.txt`. Expected: `exit=0`, the count `48`, and the last line `All rule-canary test cases passed`. A `grep -c '^FAIL'` on the same file prints `0` and exits 1, which confirms there is no FAIL line. (`$C/check-rule-copies.test.sh`) Evidence: bash check-rule-copies.test.sh; echo exit=$? -> exit=0; grep -c '^PASS ' -> 48; last line All rule-canary test cases passed; grep -c '^FAIL' -> 0 (grep exit 1).
- [x] T018 REQ-006, canary passes on both paths: `node $C/check-rule-copies.js; echo "exit=$?"` and `node .opencode/skills/sk-code/sk-code-review/scripts/check-rule-copies.js; echo "exit=$?"`. Expected for both: the OK line with `2 example output(s)` and `exit=0`. Record that `.opencode/skills` is a symlink with `ls -la .opencode/skills`. (`$C/check-rule-copies.js`) Evidence: node .skilled/.../check-rule-copies.js; echo exit=$? -> exit=0, OK line with 2 example output(s); the .opencode run -> exit=0, same OK line; ls -la .opencode/skills -> symlink to ../.skilled/skills.
- [x] T019 REQ-007, README row states the rules: `grep -c 'must hold exactly one line that starts with' $C/README.md`. Expected: `1`. (`$C/README.md`) Evidence: grep -c 'must hold exactly one line that starts with' scripts/README.md -> 1.
- [x] T020 SC-001, scope holds: `diff -rq $P/scratch/before-sk-code-review .skilled/skills/sk-code/sk-code-review; echo "exit=$?"`. Expected: exactly three lines, each `Files ... differ`, naming `scripts/check-review-final-line.js`, `scripts/check-rule-copies.test.sh` and `scripts/README.md`, and `exit=1`. No `Only in` line appears. (`$P/scratch/before-sk-code-review/`) Evidence: diff -rq scratch/before-sk-code-review .skilled/skills/sk-code/sk-code-review; echo exit=$? -> exit=1; three Files ... differ lines (scripts/README.md, scripts/check-review-final-line.js, scripts/check-rule-copies.test.sh); no Only in line.
- [x] T021 SC-002, example outputs still pass: the canary in T018 already checks both examples through the same function. Confirm by reading its OK line, which must say `2 example output(s)`. (`$C/check-rule-copies.js`) Evidence: scratch/after-canary.txt -> OK line states 2 example output(s), exit=0 from T018.
- [x] T022 Placeholder search has a positive control. The tokens are split inside double quotes so this task line does not match its own search. Run `printf 'TB''D\n' > $P/scratch/control.md && grep -c 'TB''D' $P/scratch/control.md`. Expected: `1`. Then run `grep -rn "YOUR_VALUE""_HERE\|\[Pha""se\|TB""D" $P/*.md; echo "exit=$?"`. Expected: prints nothing and `exit=1`. (`$P/*.md`) Evidence: printf 'TB''D' control -> grep -c 'TB''D' prints 1; grep -rn over the packet top-level *.md -> nothing printed, exit=1.
- [x] T023 Fill `implementation-summary.md` with the receipts from T002, T003, T004, T015, T016, T017, T018 and T020. Each row names the command, the expected output and the observed output. Mark anything not observed as not observed. (`$P/implementation-summary.md`) Evidence: implementation-summary.md filled with the T002, T003, T004, T015, T016, T017, T018 and T020 receipts; the verification table holds one row per goal criterion, C6 pending T025.
- [x] T024 Goal check: `node .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs $P` prints `RESULT: PASSED` and exits 0. Fix each finding and rerun until it passes. (`$P/goal.md`) Evidence: node check-goal.cjs <folder> -> 5/5 PASS, RESULT: PASSED (5/5 checks), exit=0. No goal.md change was needed.
- [x] T025 Derived files and strict validation, last: `node .skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs --folder $P --apply`, then `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh $P --strict`. Expected: the validator prints `RESULT: PASSED`. Fix and rerun until it does. (`$P/graph-metadata.json`, `$P/description.json`) Evidence: repair-derived.cjs --folder <folder> --apply -> repaired=1 failed=0 exit=0; validate.sh <folder> --strict -> Errors: 0  Warnings: 0, RESULT: PASSED (scratch/validate-final.txt).
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` (T001 to T025 checked with evidence)
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed (T013 to T022 ran with their expected output; see the evidence on each line)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
