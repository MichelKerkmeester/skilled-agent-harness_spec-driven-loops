---
title: "Implementation Plan: Phase 7: checker-debt-closeout"
description: "The ceiling report loads the checker and reads comment text through it, the shared extraction learns template literals, heredocs and bare string statements, then the tree is cleared to zero findings and the phase 001 limitations are closed on record."
trigger_phrases:
  - "checker debt closeout plan"
  - "ceiling report shared extraction plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.3 -->
# Implementation Plan: Phase 7: checker-debt-closeout

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Python 3 for the checker and the ceiling report, both kept behind `.sh` entrypoints. Bash for the suite harnesses. Node only for the runner suite this phase must keep green. |
| **Framework** | None. The report loads the checker with `importlib.machinery.SourceFileLoader`, from the standard library. |
| **Storage** | One committed JSON table, `Q/assets/comment-syntax.json`. No cache and no state file. |
| **Testing** | The four quality bash suites, the runner's `node --test` suite, the 6.4 baseline delta over every tracked file, and the strict validator on every touched packet. |

### Overview
The ceiling report stops keeping its own comment rules. It loads `check-comment-hygiene.sh` as a module and takes language, family and comment text from it, so the two tools can no longer disagree. That shared extraction then learns two string forms it misreads today, multi-line template literals and shell heredocs, and the checker learns to read every bare Python string statement as comment text. With the checker final, the whole-tree run is driven from 63 findings to 0: live comments are rewritten, and frozen evidence takes a per-line `hygiene-ok` under ADR-005. The phase closes by recording the live CI failure run and marking phase 001's four limitations closed.

### Dependency on an earlier phase
This plan depends on `001-honest-checker` only, which is on main. Step 1 changes code that phase built. The runner from `002-builtin-runner` reads the checker's `--json` output, so its suite runs as a consumer check in Step 4.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] T002 has re-measured the tree on the current main, and the counts this plan cites are confirmed or replaced.
- [ ] T004 has re-checked every line that section 8 cites.
- [ ] Scope is frozen in `spec.md` section 3, and no file outside it changes.

### Definition of Done
- [ ] Every row of `acceptance-criteria.md` is Met, with its evidence.
- [ ] The whole-tree checker run prints 0 findings, and no touched packet validates worse.
- [ ] `validate.sh --strict` on this folder prints `RESULT: PASSED`, and the quality, hub and packet changelogs exist.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Other: one extraction module with two callers. The checker stays a single self-contained Python file that CI, pre-commit, the runner and the post-edit router call by path. The ceiling report imports it by file path instead of copying its rules.

### Key Components
- **`check-comment-hygiene.sh`**: the blocking engine and the one owner of what counts as comment text. It gains template literal and heredoc state and the bare-string rule.
- **`ceiling-report.sh`**: lists `ceiling:` and `intentional-limit:` markers and never gates. It keeps only its marker grammar, its trigger tags and its tracked-file walk.
- **`comment-syntax.json`**: the family table. The backtick moves from the c family's `quotes` to its `multilineStrings`, and the hash family gains a `heredocs` flag.
- **The flagged files under `specs/`**: 41 files in 31 packets at `f69e5cd2e8`. 14 are live and 27 are frozen evidence.

Consumers of the changed checker, checked before the change:
- Pre-commit (`.skilled/scripts/git-hooks/pre-commit`) runs the checker on staged files with whole-file scope. A narrower extraction can only remove findings there, and the bare-string rule can only add them.
- CI (`.github/workflows/comment-hygiene.yml`) runs the checker with `--json` on each changed file of a pull request. Its file is unchanged.
- The runner (`Q/scripts/quality-gate.cjs`) reads the checker's `--json` document and the table's `languages` block. Neither changes shape.
- The post-edit router reads the table's extensions only.

### Data Flow
The report resolves its own real path, loads the checker file beside it with bytecode writing off, and reads the family table through the checker's `load_table`. For each file it asks the checker's `language_for` for the language, walks the lines through one `ScanState` and the checker's `comment_text`, and applies its own marker grammar to the text that comes back. Nothing is written to disk.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase repairs four recorded limitations, so the surface inventory applies.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `ceiling-report.sh` `family_reader`, `find_unquoted_comment`, `comment_text` (lines 49, 74, 102) | A second copy of the comment rules | delete: the report calls the checker's functions | `rg -c 'def (find_unquoted_comment\|comment_text\|family_reader)'` on the report prints nothing (AC-001) |
| `check-comment-hygiene.sh` `scan_line` multi-line handling (line 261) | Closes a multi-line string at the first closer, with no escape check | update: a backslash before the closer does not close a template literal | `js_template_escaped_backtick` expects exit 0 (AC-003) |
| `check-comment-hygiene.sh` `_opens_docstring` and `DOCUMENTED_STATEMENT` (lines 50, 234) | Comment text only in a documented position | update: any bare string statement, f-strings excluded | `py_string_after_code` expects exit 1 (AC-008) |
| `comment-syntax.json` c and hash families (lines 5 and 38) | The backtick is a one-line quote, and the hash family knows no heredoc | update: `multilineStrings` and `heredocs` | The template literal and heredoc cases pass (AC-003, AC-004) |
| `quality-gate.cjs` hygiene adapter | Reads the checker's `--json` and the table's `languages` | unchanged | The runner suite prints `# fail 0` (AC-021) |
| `post-edit-router.cjs` | Reads the table's extensions | unchanged | `node --test .skilled/hooks/post-edit-quality/lib/post-edit-router.test.cjs` exits 0 (AC-021) |
| The 41 flagged files under `specs/` | Fail pre-commit when touched | update: rewrite or mark | The whole-tree run prints 0 lines (AC-012) |

**Required inventories**
- Same-class producers: every comment form the extraction reads is listed in the family table. The two misread forms this phase fixes, template literals and heredocs, are the ones the five probes found. YAML block scalars and Python data strings already read as strings in the checker.
- Consumers of changed symbols: `rg -n 'comment-syntax' -g '!specs/**' -g '!**/changelog/**' .` lists the checker, the report, the runner, the router and their docs. Only the checker and the report read the `families` block.
- Matrix axes: language (JavaScript, TypeScript, shell, Python, YAML), string form (template literal, heredoc, docstring, data string, bare statement, f-string), position (after code, in an `if` body, in a call, in a return, in a dict), and tool (checker, report).
- Algorithm invariant: a line inside a string is never comment text, and a bare string statement always is. The adversarial cases are an escaped backtick, a here-string, an arithmetic shift, a `<<-` opener with a tab-indented closer, and an f-string in a docstring position.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`, which owns the Setup, Implementation and Verification checkboxes and their state. The four steps below group those tasks. Each step ends with a command that must pass before the next step starts.

### Step 1: One extraction for both tools

Acceptance: The ceiling report reads language, family and comment text through the checker, and it holds no scanner of its own. Template literals and heredoc bodies read as strings in both tools. A marker may start without a comment prefix. The ceiling suite holds the five string cases.
Verify: `bash .skilled/skills/sk-code/sk-code-quality/scripts/ceiling-report.test.sh` prints `All ceiling report test cases passed` and exits 0, and `bash .skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.test.sh` prints `All comment hygiene test cases passed` and exits 0.

### Step 2: Check every bare string statement

Acceptance: A bare string statement is comment text in every position, and an f-string is data in every position. The data cases stay at exit 0.
Verify: `bash .skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.test.sh` exits 0, and `rg -n 'run_case 1 "py_string_after_code"' .skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.test.sh` prints one line.

### Step 3: Clear the tree

Acceptance: The baseline delta is saved and classed. Every live finding is rewritten, every frozen finding is marked, and every touched packet validates no worse.
Verify: `git ls-files -z | xargs -0 python3 -B .skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh -- | wc -l` prints `0`, and the comparison in T022 prints `worse=0`.

### Step 4: Record, release and close

Acceptance: The live CI run is recorded, phase 001's items 1 to 4 read as closed, the versions and changelogs exist, and the hub validators pass.
Verify: `rg -n '^version: 1\.9\.0\.0$' .skilled/skills/sk-code/sk-code-quality/SKILL.md` prints one line, and `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/sk-code` exits 0.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Checker cases for template literals, heredocs, bare strings and the data positions. Ceiling cases for the five string forms, the shebang language and the missing checker | Bash harnesses |
| Integration | The 6.4 baseline delta over every tracked file, the whole-tree run, the runner suite and the router unit test | python3, node |
| Regression | The four quality bash suites against their T001 counts, and the strict validator on every touched packet against its T003 counts | bash, `validate.sh` |
| Manual | Each delta line the extraction removes is read to confirm it sits inside a real string. Each live rewrite is read to confirm it keeps the comment's meaning | Reading, recorded in `tasks.md` |

Every new case is run against the code before its change as a negative control, and a case that passes there is rewritten until it fails for the reason it names.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `001-honest-checker` outputs: the checker, the table, the ceiling report and the suites | Internal, earlier phase | Green. On main | Nothing to change |
| python3 (`/usr/bin/python3`, 3.9.6) | External, on PATH | Green. `SourceFileLoader` loaded the checker file in a probe and wrote no bytecode | The checker, the report and the suites cannot run |
| node | External, on PATH | Green | The runner suite and the router test cannot run |
| The coordinator's proof file `ci-hygiene-proof.md` in the session scratchpad | Internal | Green. It exists, and `gh run view 40276844110` confirmed its conclusion | T023 would stay open with that reason |
| `validate.sh` and `repair-derived.cjs` | Internal | Green | Touched packets cannot be compared |

No tool is installed in this phase. An install needs a named rollback and the operator's yes (AGENTS.md section 3).
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A suite fails after its step and the cause is not fixed within three attempts, the delta removes a finding that is not inside a string, or ADR-006's halt fires.
- **Procedure**: Revert the phase commits with `git revert`, newest first. The comment rewrites and the `hygiene-ok` suffixes revert with them. Then rerun the four quality suites and the whole-tree run, and confirm the counts match T001 and T002.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:citations -->
## 8. CITATION CHECK

Each line this phase cites was read at `f69e5cd2e8` on 2026-10-26. T004 re-reads them before the first edit.

| Reference | Result at `f69e5cd2e8` | Used in |
|-----------|------------------------|---------|
| `Q/scripts/ceiling-report.sh:46`, `:49`, `:71-73`, `:74`, `:102` | Holds: the fallback family, `family_reader`, the comment that says the report tracks no block, docstring or block scalar state, `find_unquoted_comment` and `comment_text` | ADR-001, REQ-001 |
| `Q/scripts/check-comment-hygiene.sh:46`, `:50`, `:234`, `:261`, `:344`, `:373`, `:122` | Holds: the docstring prefixes with `f`, the documented-statement rule, `_opens_docstring`, the escape-blind closer search, `comment_text`, `language_for` and `load_table` | ADR-001, ADR-002, ADR-004 |
| `Q/assets/comment-syntax.json:5-11`, `:38-43` | Holds: the c family with the backtick in `quotes`, and the hash family | ADR-002 |
| `Q/scripts/check-comment-hygiene.test.sh:104`, `:120` | Holds: `py_string_after_code` expects 0, and `glob_in_template_text` expects 0 | ADR-004, REQ-007 |
| `.skilled/scripts/git-hooks/pre-commit:721-725` | Holds: the spec-remint gate reads staged `specs/**/*.md` and skips `scratch/` and `z_archive/` | REQ-011 |
| `.github/workflows/comment-hygiene.yml:2-4` | Holds: the job runs on `pull_request` to `main` only | REQ-014 |
| `specs/sk-code/015-quality-agnostic-gate/001-honest-checker/implementation-summary.md:171-174` | Holds: Known Limitations items 1 to 4 | REQ-015 |
<!-- /ANCHOR:citations -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

This phase depends on 001 only, and it lands before 006, which measures the checker it leaves. Phases 003 and 004 build in parallel and share only the version files with it.

```
001-honest-checker ──► 007-checker-debt-closeout ──► 006-measurement
002-builtin-runner ──► 003-config-and-doctor, 004-doctrine, 005-consumers-and-routing ──► 006-measurement
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| 001-honest-checker | None | 002 and 007 |
| 007-checker-debt-closeout | 001-honest-checker | 006-measurement, which measures the final checker |
| 006-measurement | 003, 004, 005 and 007 | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

N/A: No effort was measured for this phase, and the build run sets the actual effort. The plan gives no hour estimate, so no estimate is presented as fact.
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] The main commit this phase starts from is recorded in T002.
- [ ] `evidence/validate-before.tsv` exists before the first edit to another packet.
- [ ] No feature flag applies. The checker change takes effect for CI and pre-commit as soon as it lands.

### Rollback Procedure
1. Revert the phase commits with `git revert`, newest first.
2. Rerun the four quality suites and confirm each prints its pass line with its T001 count.
3. Rerun the whole-tree run and confirm it prints the T002 count again.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A. The phase writes no data. The comment edits in other packets revert with the commits.
<!-- /ANCHOR:enhanced-rollback -->

---
