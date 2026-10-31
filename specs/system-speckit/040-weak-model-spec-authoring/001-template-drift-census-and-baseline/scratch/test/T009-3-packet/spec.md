---
title: "Feature Specification: Add a quiet flag to recommend-level.sh"
description: "recommend-level.sh prints its answer inside a full text report, so a caller that only wants the level has to parse prose. A --quiet flag makes it print just the recommended-level line and leaves every other output path untouched."
trigger_phrases:
  - "recommend level quiet flag"
  - "add a quiet flag to recommend level sh"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Add a quiet flag to recommend-level.sh

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-10-23 |
| **Branch** | `worktrees/217-weak-model-spec-authoring` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The level recommendation arrives inside a multi-line text report, so a caller that only wants the level has to parse prose. `recommend-level.sh` prints a leading blank line, the level line, a score and confidence line, a seven-line breakdown, and a phase-recommendation block. A workflow step that needs the level greps it out of that report, and an operator scanning a long session log cannot find the answer at a glance. No flag narrows the output, and `--json` is the wrong tool for a caller that wants a readable line rather than a document.

### Purpose
`--quiet` makes the script print only its recommended-level line, while every byte of the default text output and of the JSON output stays exactly as it is today.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A `QUIET_OUTPUT` global beside the existing `JSON_OUTPUT` global in `.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh`.
- A `--quiet` case in the existing argument loop, taking no value.
- A quiet branch in `output_text()` that prints only `Recommended Level: <n> (<name>)`, with no leading blank line, no score line, no breakdown and no phase section.
- `--quiet` documented in both the file-header `OPTIONS` block and the `show_help` heredoc.
- Cases in `.skilled/skills/system-spec-kit/runtime/cli/tests/test-phase-system.js` that pin the quiet line, the unchanged default output and the `--json` precedence.
- A `--quiet` row in the feature-flag table of `.skilled/skills/system-spec-kit/references/workflows/execution-methods.md`.

### Out of Scope
- Any change to scoring, level thresholds, phase scoring or confidence - the feature is an output-format switch, so the numbers must not move.
- A short alias such as `-q` - the script's only short flags are `-j` and `-h`, and a new one is not needed for the feature.
- A `--quiet` variant of the JSON document - JSON is already a single machine document, so `--json` output is left alone.
- Changes to callers that consume `--json` - the three `speckit-*.yaml` command assets read the JSON fields and are unaffected.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh` | Modify | Adds the `--quiet` flag, its global, the quiet branch in `output_text()`, and the header/help entries. |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/test-phase-system.js` | Modify | Adds quiet-mode cases to the existing node harness that already invokes `recommend-level.sh`. |
| `.skilled/skills/system-spec-kit/references/workflows/execution-methods.md` | Modify | Adds a `--quiet` row to the script's feature-flag table. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `--quiet` is accepted anywhere in the argument list and, when set with text output, the script prints exactly one line: `Recommended Level: <n> (<name>)`. No blank line precedes it, no score line, breakdown or phase section follows it, and the exit code is 0. |
| REQ-002 | Without `--quiet`, the text output is byte-for-byte what the script prints today for the same inputs, and the exit codes are unchanged. |
| REQ-003 | `--quiet` never alters the JSON document: with `--json` or `-j` present, the output is byte-for-byte the output of the same command without `--quiet`. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | `--help` lists `--quiet` with a one-line description in `OPTIONS`, and the file-header `OPTIONS` block lists it too, so both the operator-facing help and the source header agree. |
| REQ-005 | `--quiet` never suppresses an error: the two error paths that print to stderr and exit 1 behave identically with and without the flag, and stdout stays empty on those paths. |
| REQ-006 | The quiet line, the unchanged default output and the `--json` precedence are pinned by cases in `test-phase-system.js`, which is already wired into `npm run test:legacy`. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `recommend-level.sh --loc 50 --files 2 --quiet` prints one line, `Recommended Level: 0 (Quick)`, followed by a single newline, and exits 0. The same command without `--quiet` prints the 16-line report it prints today.
- **SC-002**: `recommend-level.sh --loc 500 --files 15 --auth --api --db --architectural --quiet` prints `Recommended Level: 3 (Full)` and no `Phase Recommendation` text, even though the same inputs recommend three phases in the default report.
- **SC-003**: `diff <(recommend-level.sh --loc 50 --files 2 --json) <(recommend-level.sh --loc 50 --files 2 --json --quiet)` is empty, and `node tests/test-phase-system.js` exits 0 with the new cases counted.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The existing argument loop in `recommend-level.sh`, which the new case slots into without restructuring | A rewrite of the loop would widen the diff for no gain | Add one case arm; leave parsing order and every existing arm alone |
| Dependency | `test-phase-system.js` as the test host, already run by `npm run test:legacy` | A new test file would need a `package.json` registration | Add the cases to the existing harness instead of a new file |
| Risk | A caller starts depending on `--quiet` producing a level only, then also passes `--json` | Conflicting expectations about which format wins | Document `--json` precedence in the help text and pin it with a case |
| Risk | The quiet branch drifts from the level line's wording | A caller's grep stops matching | Reuse the exact `Recommended Level: ${RECOMMENDED_LEVEL} (${LEVEL_NAME})` string rather than duplicating a new format |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: `--quiet` adds one boolean test and one string comparison per run, and prints strictly fewer bytes than the default report. No new subshell, external command or file read is introduced, so startup time is unchanged.
- **NFR-P02**: The default path's cost is unchanged; the quiet check sits inside `output_text()`, which the JSON path never calls.

### Security
- **NFR-S01**: The flag takes no value and reads no file or environment variable, so it adds no new input surface beyond one more case arm in the existing parser.
- **NFR-S02**: No secret, credential or path is printed by either output mode; the quiet line carries a level number and a level name only.

### Reliability
- **NFR-R01**: Exit codes are unchanged: 0 on success, 1 on user error. The quiet branch is a single `echo` under `set -euo pipefail`, so it cannot fail on its own.
- **NFR-R02**: Bash 3.2 on macOS stays the floor. The change adds no array, associative array or bash-4-only construct.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- No `--loc` and no `--files`: the existing stderr error and exit 1 stand, and `--quiet` does not suppress them.
- `--loc 0 --files 1 --quiet`: valid input under the existing validation, one line, exit 0.
- Repeated `--quiet`: the boolean is set twice, the output is identical to a single occurrence.
- Trailing newline: exactly one after the line, with no blank line before it and no blank lines after it.

### Error Scenarios
- A lookalike such as `--quietly`: the `*)` arm rejects it with the unknown-option message and exit 1. The new arm matches `--quiet` exactly, never by prefix.
- `--quiet` together with `--json` or `-j`: the JSON document wins, unchanged and parseable, in either flag order.
- `--quiet` together with `--no-recommend-phases`: one line; the phase section was already off, and quiet never re-enables it.
- `--quiet --help`: `show_help` still prints the full help and exits 0, because help is not scored output.

### State Transitions
- No persisted state, no partial-completion state and no recovery path: the script reads arguments, computes, prints and exits in one pass.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | [8/25] | One shell script, one existing test harness, one reference doc; roughly 20 changed lines |
| Risk | [4/25] | The script's text output is a de facto contract for human callers, but JSON, scoring and exit codes stay untouched |
| Research | [3/20] | Reading the existing argument loop, `output_text` and the test harness is enough; no investigation is open |
| **Total** | **[15/70]** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. The quiet line reuses the existing `Recommended Level:` wording so a caller's grep keeps matching, and `--json` precedence is recorded as REQ-003 rather than left to implementation.
<!-- /ANCHOR:questions -->

---
