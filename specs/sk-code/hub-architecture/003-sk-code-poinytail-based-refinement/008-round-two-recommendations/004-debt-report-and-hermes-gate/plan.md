---
title: "Implementation Plan: Phase 4: debt-report-and-hermes-gate"
description: "A Python report with a bash fixture harness for shortcut markers, and two Hermes --check commands added to the pre-commit mirror gate."
trigger_phrases:
  - "debt report and hermes gate plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 4: debt-report-and-hermes-gate

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Python 3 behind a `.sh` entrypoint for the report, the same form as `check-comment-hygiene.sh`. Bash for the report test, the pre-commit hook and its harness. Node.js for the Hermes checks |
| **Framework** | None |
| **Storage** | None |
| **Testing** | Bash fixture harnesses (`ceiling-report.test.sh`, `pre-commit.test.sh`), the two Hermes `--check` commands, `ci-leaf-manifest-freshness.cjs`, `check-rule-copies.js` and `validate.sh --strict` |

### Overview
One new report reads the shortcut-marker comments, tags the two kinds whose trigger cannot be checked, and prints a summary. It is a report and never a gate. The pre-commit mirror gate gains the two Hermes `--check` commands and their two output trees, following the pattern that closed the Codex gap. Each change has a fixture or a direct command that proves it.
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
A standalone checker with its own fixture harness, and a list of checks in one gate. The report decides which comment lines are markers and how each marker is tagged. The gate decides which generated mirrors are compared on each commit.

### Report Contract
The builder implements these rules exactly. The tests in `ceiling-report.test.sh` prove each one.

- **File selection.** With no arguments, the report reads `git ls-files` from the repository root. It keeps the extensions `.ts .tsx .js .mjs .cjs .py .sh .bash`, and it drops any path with a `node_modules` component and any path with a `context` component below `specs/`. Markdown and JSON are never read. With arguments, each argument is a file path and is read as given, without those filters.
- **Bad arguments exit 2.** An unknown option (an argument starting with `-`), a path that does not exist, and a path that is a directory each print a message to stderr and exit 2. An unreadable or undecodable file prints a warning to stderr, decodes with replacement characters, and does not change the exit code.
- **Marker match.** Each line's comment is found with the quote-aware detection of `check-comment-hygiene.sh`, copied into the report and not imported: `find_unquoted_hash_comment` for `.py` and `.sh`, `find_unquoted_js_line_comment` for the JavaScript family, and `is_comment_line` for a block-comment body line. Text inside a quoted string is never a comment, so a fixture written as `printf '%s\n' '# ceiling: x'` does not count. The comment text must then start with a prefix (`#`, `//`, `/*` or `*`), optional whitespace, and a marker word, `ceiling` or `intentional-limit`, followed by a colon. A trailing comment such as `code(); // ceiling: ...` counts. Prose such as `// The ceiling: a longer section` does not, because the comment text does not start with the marker word.
- **Trigger clause.** The text after the marker colon is split at its first `;`. Without a `;`, it is split at its first `,`. The part after that split is the trigger clause. The part before it is the ceiling and is not checked.
- **Tags.** A marker whose trigger clause is empty or missing gets `no-trigger`. A marker whose trigger clause has no digit and no measurable term gets `no-signal`. The measurable terms are, matched as whole words in any case: `throughput`, `latency`, `row` and `rows`, `request` and `requests`, `user` and `users`, `size`, `count`, `memory`, `load`, `rate`, `ms`, `second` and `seconds`, `MB`, and the `%` sign. A marker has at most one tag, and a marker with a measurable trigger has none.
- **Output.** One line per marker, in scan order, in the form `path:line  text  [tags]`. The text is the stripped line. The tags field is the comma-joined tag names, or empty. The last line is `markers=N no-trigger=N no-signal=N`.
- **Exit codes.** Exit 0 whenever the report ran, whatever it found. It is a report, not a gate.

### Key Components
- **Report script** (`ceiling-report.sh`, new): file selection, marker match, trigger parse, tags, output and summary. It copies the quote-aware comment detection from `check-comment-hygiene.sh` and does not import that file, because the neighbour is a `.sh` entrypoint with no importable module.
- **Report test** (`ceiling-report.test.sh`, new): fixture cases in the style of `check-comment-hygiene.test.sh`, each case writing a file from a single-quoted string.
- **Gate lists** (`.skilled/scripts/git-hooks/pre-commit`): `MIRROR_CHECKS` gains two Hermes entries, `MIRROR_OUTPUTS` gains `.hermes/skills` and `.hermes/prompts`, and the gate comment is rewritten with the real count and the measured time.
- **Harness section** (`.skilled/scripts/git-hooks/tests/pre-commit.test.sh`): stub Hermes checkers in a toolchain fixture. One stub exits 1 with a DRIFT line, and the other records its argument, so the section proves that drift blocks and that the prompts check receives `--check`.
- **Leaf manifest** (`.skilled/skills/sk-code/leaf-manifest.json`): regenerated by `generate-leaf-manifest.cjs --write`. The `sk-code-quality` mode declares only `assets/code-quality-checklist/` leaves, so the new script is not a leaf and the expected result is no byte change.

### Data Flow
Git lists the tracked files. Each file's lines are scanned for a quote-aware comment, and each comment is matched against the marker pattern at its start. Each marker gives its text after the colon, the trigger clause, and then the tags. Each marker prints one line, and the counts print last. In the gate, a commit that stages anything runs the eight checks in list order, and any failure blocks the commit. The Hermes checks read the source trees and compare the `.hermes` outputs. They write nothing in `--check` mode.

### Decisions
- **D1, quote-aware and anchored marker match.** The brief says "comment lines containing" the marker. The bare word matches code identifiers and prose. Measured at planning, the bare word matches twelve code files, among them `audit_descriptions.py:326` (`project_ceiling: int`) and `classifier-screen-fetched-text.mjs:95` (prose). A pattern that is not anchored would still count fixture strings such as `'# ceiling: ...'` inside the test file, which the repo run would then report as debt. The quote-aware, anchored form matches none of these in the repo today. It still reads trailing comments such as `code(); // ceiling: ...`.
- **D2, trigger split at `;` first.** The style guide writes `ceiling: <ceiling>; <upgrade path>`. The Ponytail convention writes `shortcut: <ceiling>, <upgrade path>`. Both forms are accepted, with `;` read first.
- **D3, only the trigger clause is checked for a measurable term.** The brief's rule is about the upgrade trigger. A ceiling can be a fixed quantity, so a number in it does not count as a trigger signal.
- **D4, `intentional-limit:` is handled like `ceiling:`.** The brief requires the prefix, and the two words share one code path.
- **D5, the Hermes pair joins the existing list.** The gate's comment says it runs on every commit so no mirror is masked. A separate gate would need its own list and would lose that property, so the pair joins `MIRROR_CHECKS`.
- **D6, the doctor doc is corrected, not extended.** The doctor's `doctor-runtime-mirrors.yaml` names no Hermes asset. The brief asks for the overclaim to be removed only.

### Known gaps, not fixed here
- The global hook runs the main checkout's copy of the gate. Its file lacks the Hermes entries until the change reaches that checkout.
- `sk-code-quality/SKILL.md` lists the existing checkers at lines 315 to 317. The proposed addition is one line per new file, `- [`scripts/ceiling-report.sh`](scripts/ceiling-report.sh) - Ceiling-marker report.` and the matching test line. It is not made, because the brief forbids SKILL.md edits. The packet version at line 5 would also move, for example from 1.0.1.0 to 1.0.2.0, with a matching `changelog/` entry. The operator decides that release.
- The doctor's runtime-mirrors workflow does not check the Hermes copies. Adding that check is a separate decision.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- **Red first for the report.** `ceiling-report.test.sh` is written before `ceiling-report.sh`, and its first run must fail because the report is missing. After the report is written, the same file must pass.
- **Fixture cases.** Each case writes one file from a single-quoted string and runs the report on that path. The quote-aware detection skips text inside those strings, so the repo run does not count the fixtures. The cases are: a measurable trigger (`// ceiling: global lock; switch to per-account locks if throughput matters`, expected tag `[]`), no trigger (`# ceiling: global lock`, expected `[no-trigger]`), an unmeasurable trigger (`// ceiling: global lock; switch to per-account locks when the team agrees`, expected `[no-signal]`), the `intentional-limit:` prefix (`# intentional-limit: single writer; add a queue if rows arrive faster than 100 per second`, expected `[]`), a bare prose mention (`// the ceiling: a longer section`, expected not counted), and a missing path (exit 2).
- **Harness case.** `pre-commit.test.sh` gets one section that plants two Hermes stubs in the toolchain fixture. The skills stub prints a DRIFT line and exits 1, so the log must contain `sync-skills-hermes.cjs failed`. The prompts stub appends its arguments to a file, so that file must contain `--check`. The section adds two passes, and the harness total goes from 69 to 71.
- **Repo checks.** The report runs on the repo and ends with the summary line. The two Hermes checks run in `--check` mode. The timing of the eight checks is measured with a script that runs each command once, and the result is saved in scratch.
- **Shell and syntax checks.** `bash -n` on the pre-commit file, `python3 -m py_compile` on the report, and `check-comment-hygiene.sh` on each new or changed comment-capable file. Exit 1 from that checker is a failure. Exit 0 or 2 passes, and 2 means the file was skipped, as it is for the extensionless hook.
- **Scope check.** `git status --porcelain` over the touched paths is compared with the copy saved in scratch/before. Each changed file is compared with its before copy with `diff`, which shows only the planned hunks.
- **Not covered here.** The live hook in the main checkout is not run, because the brief says never to install hooks. Its copy must be verified after the change lands there.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- `.skilled/skills/system-spec-kit/node_modules/@spec-kit/shared`, required by the two Hermes scripts. Present in this worktree.
- `python3` for the report and its harness, and `rg` (ripgrep) for one verification command. Both are present in this worktree.
- The sibling children of this parent. They may regenerate `.hermes/` and other mirrors in the same worktree. This phase does not touch those outputs, and a sibling's stale copy shows up as a failed Hermes check in this phase's runs.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Each edited file has a pre-edit copy in `scratch/before/`, saved by task T001. To roll back, copy each copy back to its path with `cp`. The two new files are moved into `scratch/rollback/` with `mv`, which takes them out of the tree without a deletion command. The leaf manifest is restored from its copy if the regeneration changed it. No git command is needed.
<!-- /ANCHOR:rollback -->

---
