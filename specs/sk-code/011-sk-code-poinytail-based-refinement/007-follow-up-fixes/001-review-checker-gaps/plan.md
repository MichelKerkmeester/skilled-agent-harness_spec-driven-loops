---
title: "Implementation Plan: Phase 1: review-checker-gaps"
description: "Closes four gaps in the review final-line checker by changing one rule function and one CLI error path, adding five cases to the bash tamper harness and rewriting one README row. The canary reads the same rule function for the example outputs, so one change is tested twice."
trigger_phrases:
  - "review checker gaps plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 1: review-checker-gaps

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JavaScript (Node.js ES module, `node:fs` and `node:url`) and Bash |
| **Framework** | None |
| **Storage** | None |
| **Testing** | `check-rule-copies.test.sh` (tamper harness, 38 PASS lines today) and `check-rule-copies.js` (canary, which also checks the two example outputs) |

### Overview
The fix changes `checkReviewOutput` in `check-review-final-line.js`, the function that decides whether review output ends correctly. It also changes the file-read error path in `runCli`, widens the banner border, adds five tamper cases to the harness and rewrites the checker's README row. The canary imports the same function, so one edit is exercised by the harness and by the example outputs in `SKILL.md` and `README.md`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
In-place change to one exported rule function and one CLI path, plus harness cases and one README row. No new file and no new dependency.

### Key Components
- **`checkReviewOutput(text)`** in `check-review-final-line.js`: returns an array of failure messages, empty on pass. It is exported and imported by `check-rule-copies.js`, so its signature stays the same.
- **`runCli()`** in the same file: reads the file argument or stdin. Its catch branch currently prints only the usage line. It must also print the cause.
- **`check-rule-copies.test.sh`**: its `run_case` helper checks the exit code and its `expect_output` helper checks that the output contains a fixed string. The five new cases use both helpers.
- **Example check in `check-rule-copies.js`**: extracts the fenced block after `**Example output bottom:**` in `SKILL.md` and after `**Step 2: Run the primary workflow.**` in `README.md`, then passes it to `checkReviewOutput`.
- **`scripts/README.md`** row for the checker: states the rules in plain words.

### Rule Set for `checkReviewOutput`
This is the behavior the edits must produce. Every rule that fails adds its message, so an input that breaks two rules reports both.

1. Empty or whitespace-only text fails with `review output is empty`. Unchanged.
2. A text that ends in two newlines fails with `blank line after the status line`. Unchanged.
3. If an `AGENT_IO_RESULT v1` line sits below the last `Review status:` line, fail with `AGENT_IO_RESULT block follows the status line`. Unchanged.
4. The final line must match the bare status pattern or the skip pattern. Otherwise fail with `final line is not an exact status line`. Unchanged.
5. **Skip status (new).** If the final line matches the skip pattern and the output has more than one line, fail with `skip status must be the whole output`. A one-line skip output passes and skips rules 6 and 7.
6. **Bare status, blank line (new).** Count the blank lines directly above the status line, treating a line as blank when it is empty after trimming. Zero blank lines fails with `no blank line above the status line`. Two or more fails with `more than one blank line above the status line`.
7. **Bare status, Not checked line (replaces the current loop).** Take the nearest non-blank line above the status line. It must start with `Not checked: ` followed by text, or fail with `no "Not checked:" line above the status line`. Count the lines in the whole output that start with `Not checked:`. Two or more fails with `more than one "Not checked:" line in the output`. Zero is already covered by the rule above.

A missing line above the status line counts as a missing Not checked line, so the function never reads before the first line.

### Unreadable Input (`runCli`)
The catch branch prints `cannot read <path>: <error message>` when a file argument was given, or `cannot read stdin: <error message>` when it was not. Then it prints `usage: check-review-final-line.js [file]` and sets exit code 2. The error message is the Node error text. The harness matches the prefix and the path, not the Node error tail.

### Banner
Lines 2 and 4 of `check-review-final-line.js` are the border. Line 3 is the title. The title is 81 code points and the border is 79. Widening the border by two `═` characters on each of lines 2 and 4 makes all three 81. The title text stays as it is.

### Data Flow
Input text goes through CRLF normalization and the trailing-newline strip, then the empty and trailing-blank checks, the result-block check and the final-line match. The rules in the list above decide the failures. `runCli` prints each failure as `FAIL: <message>` on stderr and exits 1. A pass prints `OK: review output ends on the exact status line`.

### Decisions Made in This Plan
- A line counts as blank when it is empty after trimming. The current checker already does this, so the blank-line rule keeps the existing meaning of blank.
- The Not checked count matches the prefix `Not checked:` with no space required after the colon. A bare `Not checked:` line therefore counts toward the total, and rule 7 rejects it for having no text.
- A skip status with a blank line above it fails rule 5. Its whole output must be one line, so the blank line counts as extra output.
- The four messages are fixed text. The existing wording `no "Not checked:" line above the status line` stays, so the existing harness case `final_line_missing_not_checked` still matches.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The proof has three parts. Each one reads output and exit status, and each has a before and an after.

- **Repro inputs (before and after).** Four gap inputs are saved under `scratch/repro/` by the planner: a skip status after a body, a bare status with no blank line, a bare status with two blank lines above it, and a bare status with two Not checked lines. Before the fix, all four exit 0. After the fix, each prints its named message and exits 1. The unreadable-input probes and the banner width are recorded the same way.
- **Harness.** Baseline is 38 PASS lines and exit 0. After the fix it must print 48 PASS lines, end with `All rule-canary test cases passed`, and exit 0. The five new cases are one `run_case` (exit code) plus one `expect_output` (message) each, so each new failure is checked for both its exit status and its wording.
- **Canary and examples.** Both canary runs must print the OK line with `2 example output(s)` and exit 0. The `.opencode/skills` path is a symlink to `.skilled/skills`, so the second run reads the same file. It proves the link resolves, not that a second copy agrees. The two examples were checked during planning. Each has one blank line above its status line, one `Not checked:` line above that blank line, and one `Not checked:` line in total. The SKILL.md example has 8 lines and the README.md example has 32 lines. Neither needs an edit.

Scope check: `diff -rq` against `scratch/before-sk-code-review/` must name exactly the three files in the spec's Files to Change table.

Placeholder check: the search for leftover template tokens prints nothing and exits 1. A positive control runs first on a scratch file that holds a known token, so the search is known to match. The exact commands are in `tasks.md`, task T022.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Node.js and Bash. The builder records `node --version` and `bash --version` in the log before the first run. The planner did not record them.
- Parent phase 007 sets the order. Phase 002 starts after this phase is committed.
- The parent's Files table omits `scripts/README.md`. See the spec's Open Questions.
- `repair-derived.cjs` and `validate.sh` from `system-spec-kit`, run last.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

To undo the edits to the three tracked files, copy the saved originals back:

```bash
cp specs/sk-code/011-sk-code-poinytail-based-refinement/007-follow-up-fixes/001-review-checker-gaps/scratch/before-sk-code-review/scripts/check-review-final-line.js .skilled/skills/sk-code/sk-code-review/scripts/
cp specs/sk-code/011-sk-code-poinytail-based-refinement/007-follow-up-fixes/001-review-checker-gaps/scratch/before-sk-code-review/scripts/check-rule-copies.test.sh .skilled/skills/sk-code/sk-code-review/scripts/
cp specs/sk-code/011-sk-code-poinytail-based-refinement/007-follow-up-fixes/001-review-checker-gaps/scratch/before-sk-code-review/scripts/README.md .skilled/skills/sk-code/sk-code-review/scripts/
```

Then `diff -rq` against the saved copy prints nothing and exits 0. The scratch copy was made before any edit and holds the pre-fix contents. The three files are tracked, so `git restore` also works, but the copies do not depend on git state.
<!-- /ANCHOR:rollback -->

---
