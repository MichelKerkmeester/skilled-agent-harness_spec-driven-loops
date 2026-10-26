---
title: "Implementation Plan: Phase 1: honest-checker"
description: "Adds a shared comment-family table, language dispatch, span stripping, docstring and block-body tracking, a narrower slash pattern and a JSON mode to the comment-hygiene checker, then points the ceiling report, the post-edit router and two CI rows at the same table."
trigger_phrases:
  - "honest checker plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.3 -->
# Implementation Plan: Phase 1: honest-checker

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Python 3 for the checker and the ceiling report. Node.js for the post-edit router and its tests. Bash for the suite harnesses. |
| **Framework** | None |
| **Storage** | One committed JSON table, `Q/assets/comment-syntax.json`. No database and no cache. |
| **Testing** | Bash harnesses for the checker, ceiling report, typo flags and hook parse test. `node --test` for the router unit test and the adapter suites. actionlint for the workflows. |

### Overview
This phase changes one Python checker and the readers that depend on it, so that they share one comment-family table. The checker gains language dispatch by shebang, URL span stripping, docstring and block-body tracking, the issue and ticket rule, a narrower slash pattern, a `--json` mode and reason text. The ceiling report, the post-edit router and two workflows read the same table or the new exit codes. The proof is the four existing suites with new cases, a router unit test, the three adapter suites, actionlint and a 6.4 baseline run before merge.

Dependencies: none on an earlier phase. This is the first phase. Phase 2 reads the table, the JSON document and the reason field this phase creates.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented (spec.md sections 2 and 3)
- [ ] Success criteria measurable (spec.md section 5, each tied to a command in acceptance-criteria.md)
- [ ] Dependencies identified (spec.md Phase Context: no earlier phase)

### Definition of Done
- [ ] All acceptance criteria met (acceptance-criteria.md, every row Met)
- [ ] Tests passing: the four quality bash suites, the router unit test, and the codex, devin and opencode plugin suites
- [ ] Docs updated: spec.md, plan.md and tasks.md agree, and the quality, hub and packet changelogs exist
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Other: one shared data table, read by independent readers with no shared module. The checker stays a single Python program, because CI and pre-commit call it with `python3`. The router stays Node, because the hook adapters call it.

### Key Components
- **`Q/assets/comment-syntax.json`**: the extension, shebang and comment-family table. Its readers are the checker, the ceiling report, the router and, in Phase 2, the runner.
- **`check-comment-hygiene.sh`**: the blocking engine. CI and pre-commit call it. It reads the table from its own real path and exits 3 when the table cannot be read.
- **`ceiling-report.sh`**: lists shortcut markers and never gates. It takes the repository from the working directory.
- **`post-edit-router.cjs`**: the fail-open dispatch that the Claude, Codex, Devin, Pi and OpenCode adapters call through `resolveDispatch` and `runChecks`. It finds the checker under its own real path first.
- **`comment-hygiene.yml` and `sk-code-script-tests.yml`**: the pull request gate and the suite runner.

Consumers of the checker output, checked before the change:
- Pre-commit (`.skilled/scripts/git-hooks/pre-commit`, lines 142 to 158): copies staged blobs into a temporary directory, runs the checker from there, and treats exit 0 and 2 as clean and every other code as a block. The new reason suffix shows in its printed output. The table path must not depend on the working directory.
- CI (`.github/workflows/comment-hygiene.yml`, lines 36 to 48): runs the checker over each changed file and counts exit 1 only.
- Router adapters: the Claude, Codex, Devin, Pi and OpenCode plugin adapters. Codex and Devin build their checker in the fixture root, so they change with ADR-009.

### Data Flow
An edit or a commit reaches the checker or the router. The caller reads the family table, applies the patterns to the comment text of each line, and prints text or JSON. The exit code tells the hook or the workflow what to show. Nothing writes state, and the table is read once per process.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

N/A: this phase adds behavior and narrows two rules. It does not repair a reported defect, so the fix addendum does not apply. The consumer inventory the change needs is in section 3, Key Components.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`, which owns the Setup, Implementation and Verification checkboxes and their state. The four steps below group those tasks. Each step ends with a command that must pass before the next step starts.

### Step 1: Make the checker honest

Acceptance: The checker reads the family table, dispatches by shebang, strips URL spans, tracks docstrings and block bodies, flags the issue and ticket rule, uses the narrowed slash pattern, keeps the two pinned patterns, emits `--json` and reasons, and exits 3 for usage errors.
Verify: `bash .skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.test.sh` prints `All comment hygiene test cases passed` and exits 0.

### Step 2: Move the readers onto the table

Acceptance: The ceiling report reads the repository from the working directory. The router resolves its checker from its own real path, returns one `quality-notice` when none is found, and prints nothing. The codex and devin fixtures use a line the real checker flags.
Verify: `bash .skilled/skills/sk-code/sk-code-quality/scripts/ceiling-report.test.sh` prints `All ceiling report test cases passed` and exits 0, and `node --test .skilled/hooks/post-edit-quality/lib/post-edit-router.test.cjs` exits 0.

### Step 3: Wire CI and fix the doctrine-free wording

Acceptance: The comment-hygiene workflow finds the checker under either root, fails on exit 3 and above, and annotates each violation. The script-tests workflow runs the four quality suites. The quality mode names `specs/`, drops the unit-test claim, hands back to `workflow-implement.md`, and lists three always-loaded resources in `DEFAULT_RESOURCE`.
Verify: `actionlint .github/workflows/comment-hygiene.yml .github/workflows/sk-code-script-tests.yml` exits 0 with no output, and `rg -n -e '\.opencode/specs' -e 'verified by a unit test' .skilled/skills/sk-code/sk-code-quality/SKILL.md` prints no line.

### Step 4: Release and measure

Acceptance: The quality mode is 1.5.0.0 and the hub is 3.1.0.0 in four files. The changelogs exist and name the baseline counts. The 6.4 delta is classed, and its new-language class stays within ADR-010.
Verify: `rg -n '^version:' .skilled/skills/sk-code/sk-code-quality/SKILL.md` prints `5:version: 1.5.0.0`, and `rg -n 'baseline' .skilled/skills/sk-code/sk-code-quality/changelog/v1.5.0.0.md` prints the class counts.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Checker cases for the eleven families, URL spans, docstrings, block bodies, the issue rule, the slash pattern, JSON, reasons and the usage exit. Ceiling report subfolder case. Router resolution, table fallback, one notice and silence. | Bash harnesses and `node:test` |
| Integration | Codex, devin and opencode plugin suites through the router. actionlint on both changed workflows. The 6.4 baseline over every tracked file. | node, actionlint, python3 |
| Manual | The five probes that the design evidence cites: a URL line, a docstring, a block body, an issue reference and a `.go` file. Each runs against a scratch file that is deleted afterward. | python3 |

Each changed test carries its own expected output in `tasks.md`. A failing case is a stop, not a skip.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| python3 (`/usr/bin/python3`) | External, on PATH | Green | The checker and its suites cannot run. |
| node | External, on PATH | Green | The router, its unit test and the adapter suites cannot run. |
| actionlint (`/opt/homebrew/bin/actionlint`) | External, on PATH | Green. Exit 0 on both workflows at baseline. | Workflow lint cannot run. |
| Synthesized build design | Internal source, kept outside the repository | Green | The phase scope would be ambiguous. Its decisions are copied into `decision-record.md`. |

No tool is installed in this phase. An install needs a named rollback and the operator's yes (AGENTS.md section 3).
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A suite named in section 5 fails after its step and the cause is not fixed within three attempts. Or the 6.4 new-language class passes the ADR-010 threshold.
- **Procedure**: Revert the phase commit with `git revert`, or restore the files listed in `spec.md` section 3 from the commit before it. The table file and the router test leave with the revert. Then rerun the four quality suites, the router test and actionlint to confirm the pre-phase state.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

The build order is linear (design section 7). Each phase lists the one before it as its dependency. This phase has no earlier phase.

```
001-honest-checker (this phase, no earlier phase)
  -> 002-builtin-runner
  -> 003-config-and-doctor
  -> 004-doctrine
  -> 005-consumers-and-routing
  -> 006-measurement
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| 001-honest-checker | None | 002-builtin-runner |
| 002-builtin-runner | 001-honest-checker, for the table, the JSON document and the reason field | 003-config-and-doctor |
| 003-config-and-doctor | 002-builtin-runner | 004-doctrine |
| 004-doctrine | 003-config-and-doctor, and the decisions in ADR-001 and ADR-002 | 005-consumers-and-routing |
| 005-consumers-and-routing | 004-doctrine | 006-measurement |
| 006-measurement | 005-consumers-and-routing | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

N/A: No effort was measured for this phase, and the build run sets the actual effort. The plan gives no hour estimate, so no estimate is presented as fact.
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

N/A: This phase ships no deployable service and changes no data. Its rollback is the revert in section 7.
<!-- /ANCHOR:enhanced-rollback -->

---
