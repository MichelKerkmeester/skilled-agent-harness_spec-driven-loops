---
title: "Feature Specification: Add a quiet flag to recommend-level.sh"
description: "Give recommend-level.sh a --quiet flag so a caller can read the recommended level from one line instead of parsing the human-readable breakdown. Default output stays byte-identical."
trigger_phrases:
  - "recommend level quiet flag"
  - "add a quiet flag to recommend level sh"
  - "recommend-level.sh quiet output"
  - "recommend level single line"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Add a quiet flag to recommend-level.sh

<!-- SPECKIT_LEVEL: 3 -->


---

## EXECUTIVE SUMMARY

`recommend-level.sh` prints a 12 to 16 line report built for a human reader. A script that only wants the level has to grep the second line or parse the JSON document. `tail -1` does not work, because the phase section and the score line follow the level line. `--quiet` adds an output mode that prints the level line and nothing else.

The change touches one script and one test file. It adds one state variable, one branch in the option parser, one early return in `output_text()` and one entry in each of the two OPTIONS lists.

**Key Decisions**: `--quiet` changes text output only, so `--json` keeps its full document. The level line keeps coming from the existing `output_text()` code path instead of a second formatter that could drift.

**Critical Dependencies**: The two test suites that invoke this script, `test-phase-system.js` and `test-phase-validation.js`, plus the two speckit command assets that call it with `--json`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P2 |
| **Status** | Draft |
| **Created** | 2026-10-26 |
| **Branch** | `scaffold/001-recommend-level-quiet-flag` |
| **Affected file** | `.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh` |
| **Estimated change** | 10 to 14 added lines, no deleted lines |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The text output of `recommend-level.sh` opens with a blank line, then the level line, then the score line, then a breakdown and a phase section. Measured on 2026-10-26 with `--loc 200 --files 5 --api`, that is 16 lines. With `--no-recommend-phases` it is 12. Nothing in the output is designed for a caller that only needs the number, so every caller writes its own parser. The JSON mode exists for that need, but it returns a 32 to 36 line document, which is a heavy dependency for one integer and one label.

### Purpose

A caller that passes `--quiet` receives the recommended level on a single line and needs no parser.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Accept `--quiet` as a boolean flag in the option parser of `recommend-level.sh`.
- Print only the recommended-level line in text mode when the flag is set.
- Document the flag in both OPTIONS lists, the file header block and the `show_help` heredoc.
- Add one regression case to `test-phase-system.js` that asserts the quiet output shape.
- Prove the default text output and the JSON output are unchanged.

### Out of Scope

- A `-q` short alias. The task names `--quiet` only, so the short form stays free until a caller asks for it.
- Suppressing fields inside the JSON document. JSON already has one consumer shape and truncating it would break machine readers.
- Any change to scoring, thresholds, level mapping, confidence or phase recommendation.
- Any change to `create.sh`, `validate.sh` or the other scripts in the same directory.
- A new log level, a `--verbose` counterpart or a general output-format refactor.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh` | Modify | Add the flag, its help text and the quiet branch in `output_text()` |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/test-phase-system.js` | Modify | Add a quiet-output case beside the existing recommend-level fixtures |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The script accepts `--quiet` as a boolean flag that takes no argument, and accepts it anywhere in the argument list. |
| REQ-002 | With `--quiet` and no `--json`, stdout carries exactly one line, `Recommended Level: <N> (<Name>)`, and nothing else. No leading blank line, no score line, no breakdown and no phase section. |
| REQ-003 | Without `--quiet`, text output and JSON output are byte-identical to the current script for the same arguments. |
| REQ-004 | `--quiet` changes what is printed, not what is computed. Score, recommended level, level name, confidence and phase fields keep their current values. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | `--json` takes precedence over `--quiet`. Passing both prints the full JSON document, so a machine reader never receives a truncated object. |
| REQ-006 | Error paths keep their current stderr text and exit code 1 under `--quiet`. The flag never suppresses a diagnostic. |
| REQ-007 | `--quiet` appears in the file-header OPTIONS block and in the `show_help` OPTIONS list, with matching wording. `--quiet --help` still prints the full help text and exits 0. |
| REQ-008 | Both recommend-level suites keep their baseline counts, `test-phase-system.js` at 27 passed and `test-phase-validation.js` at 51 passed, and a new case asserts the quiet shape: one line, exact text, exit 0. |
| REQ-009 | The change adds no new process, no new dependency and no file beyond the one test edit. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh --loc 200 --files 5 --api --quiet` prints one line, exits 0 and leaves stderr empty.
- **SC-002**: A captured before and after diff of the default text output and of the JSON output over a fixed fixture set is empty.
- **SC-003**: An operator can find the flag in `--help` without opening the script.
- **SC-004**: Both suites report their baseline plus the new quiet case, 27 and 51 passing before the change and 28 and 51 after, with 0 failures.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Both recommend-level suites read JSON only, and the two speckit command assets call the script with `--json`. | A text-mode regression has no existing coverage, and a JSON change would break four consumers. | Add the quiet case in `test-phase-system.js` and leave `output_json()` untouched. |
| Risk | A careless guard suppresses the wrong lines. | Existing human readers lose the breakdown. | Prove the default path with a byte-level diff, not by eye. |
| Risk | The flag is read after the output dispatch instead of before it. | `--quiet` is accepted but has no effect. | Parse it in the existing `while` loop, next to `--json`, and assert the effect in a test. |
<!-- /ANCHOR:risks -->

---


## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance

- **NFR-P01**: The flag adds no measurable runtime. It is one shell comparison on an already parsed argument list, in a script that finishes in milliseconds.

### Security

- **NFR-S01**: No new input surface. `--quiet` takes no value, so it cannot introduce a parsing or injection path.
- **NFR-S02**: Error diagnostics stay on stderr and keep their text, so a quiet run cannot hide a bad argument from a log.

### Reliability

- **NFR-R01**: The same arguments produce the same output on every run. The flag reads no environment variable and no clock.
- **NFR-R02**: The script keeps `set -euo pipefail` and its current exit codes, so a caller's error handling does not change.

---

## 8. EDGE CASES

### Data and Runtime Boundaries

- **Given** the default phase section is on, **When** `--quiet` is passed, **Then** the phase section is not printed at all.
- **Given** `--no-recommend-phases`, **When** `--quiet` is passed, **Then** the output is the same single line as the default case.
- **Given** `--quiet` before the other flags, **When** the script runs, **Then** the result matches the case where it comes last.
- **Given** `--quiet` appears twice, **When** the script runs, **Then** it is accepted and the output is the same single line.

### Error Scenarios

- **Given** no `--loc` and no `--files`, **When** `--quiet` is passed, **Then** the error text and exit code 1 are unchanged.
- **Given** `--json` and `--quiet` together, **When** the script runs, **Then** the full JSON document is printed and no level line is added.
- **Given** `--help` with `--quiet`, **When** the script runs, **Then** help prints and the exit code is 0.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 8/25 | Files: 2, LOC: about 14 added, Systems: 1 |
| Risk | 5/25 | Auth: N, API: N, Breaking: N |
| Research | 5/20 | One script read, one test file read, no external source |
| Multi-Agent | 2/15 | Workstreams: 1 |
| Coordination | 4/15 | Dependencies: the test suite baseline |
| **Total** | **24/100** | **Level 3 by operator instruction** |

The score describes a small change. The packet is Level 3 because the operator set that level when scaffolding it, not because the work scores high. The extra sections record the verification and rollback that a shipped CLI flag needs.

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | The default text output drifts while adding the quiet branch. | High | Low | Capture the current output first, diff it after, and keep the level line in one place. |
| R-002 | `--quiet --json` is read as "print one JSON line". | Medium | Medium | Fix the precedence in REQ-005 and assert it in the new test case. |
| R-003 | The quiet path ships without a regression test because both suites are JSON-only. | Medium | High | Add the case in `test-phase-system.js` in the same change. |

---

## 11. USER STORIES

### US-001: Read the Level From One Line (Priority: P0)

**As a** script author, **I want** `--quiet` to print only the recommended level, **so that** I can capture it with `$(...)` and no parsing.

**Acceptance criteria:** see `acceptance-criteria.md` (rows AC-001, AC-002, AC-004).

---

### US-002: Keep the Existing Report (Priority: P0)

**As a** maintainer, **I want** the default output to stay unchanged, **so that** existing logs, docs and test fixtures remain valid.

**Acceptance criteria:** see `acceptance-criteria.md` (row AC-003).

---

### US-003: Find the Flag in Help (Priority: P1)

**As an** operator, **I want** `--quiet` documented in `--help`, **so that** I can discover it without reading the script.

**Acceptance criteria:** see `acceptance-criteria.md` (row AC-007).

---

### US-004: Trust the Flag to Stay (Priority: P1)

**As a** test owner, **I want** a regression case for the quiet shape, **so that** a later refactor cannot drop the flag without a failure.

**Acceptance criteria:** see `acceptance-criteria.md` (row AC-008).

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

None open at planning time. Three were settled while writing this specification:

- Whether `--quiet` should also cover JSON. It does not, because JSON already has a stable consumer shape. Recorded in REQ-005 and in `plan.md` ADR-001.
- Whether the quiet line should come from a new formatter. It should not, because a second formatter is a second place for the line text to drift. Recorded in `plan.md` ADR-002.
- Whether `--quiet` should disable phase scoring. It should not. The flag controls printing, and computing the phase result costs nothing a caller can observe.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Closure Gate**: See `acceptance-criteria.md`
- **Decisions**: See `plan.md` ADR-001 and ADR-002

---


