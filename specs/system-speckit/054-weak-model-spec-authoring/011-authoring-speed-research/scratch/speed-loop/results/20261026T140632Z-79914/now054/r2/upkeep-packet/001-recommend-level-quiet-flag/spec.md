---
title: "Feature Specification: Add a quiet flag to recommend-level.sh"
description: "The level helper prints a 16-line report for one value. A --quiet flag prints only the recommended-level line, and the default report stays byte-identical."
trigger_phrases:
  - "recommend level quiet flag"
  - "add a quiet flag to recommend level sh"
  - "quiet mode for level recommendation"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.3 -->
# Feature Specification: Add a quiet flag to recommend-level.sh

<!-- SPECKIT_LEVEL: 3 -->


---

## EXECUTIVE SUMMARY

A caller that needs the recommended level from `recommend-level.sh` reads a 16-line report and pulls one value out of it. A `--quiet` flag prints only that line. The proof is a line count and a diff: one line with the flag, 16 lines without, and an unchanged report for the same inputs.

**Key Decisions**: `--quiet` trims the text report and leaves the JSON document alone. The quiet line reuses the string that `output_text()` already prints, so the label keeps one source of truth.

**Critical Dependencies**: `output_text()` in `recommend-level.sh` stays the only place that renders the level line.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-10-26 |
| **Branch** | `scaffold/001-recommend-level-quiet-flag` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

`recommend-level.sh` writes a 16-line text report: a blank line, the level, the score and confidence, a blank line, a breakdown heading with six rows, a blank line, and four phase lines. A script that wants the level has to pipe that through `head -2`, `tail`, `grep` or `sed` and then strip the label. Each caller re-implements the same parse, and a change to the report layout breaks all of them.

### Purpose

One flag prints one line, so a caller reads the level without parsing the report.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Add a `--quiet` flag, with `-q` as its short form, to the argument parser.
- Print only `Recommended Level: <N> (<Name>)` when the flag is set.
- Leave the default text report byte-identical for the same arguments.
- Document the flag in the script header and in `show_help`.
- Verify both modes with commands that a reader can rerun.

### Out of Scope

- A JSON change: `--json` already emits one machine-readable document, so it needs no quiet variant.
- A `--quiet` variant for `create.sh`, `validate.sh` or any other spec script.
- Changing the scoring weights, thresholds or the level vocabulary.
- A new test harness: no automated suite covers `recommend-level.sh` today, and this packet does not add one.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh` | Modify | Add the `QUIET` global, the `--quiet` parser case, the quiet branch in `output_text()`, and the two help blocks |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The argument parser accepts `--quiet` and `-q`, and both set quiet mode. |
| REQ-002 | With `--quiet`, stdout holds exactly one line and that line reads `Recommended Level: <N> (<Name>)`. The line carries no leading blank line, so `wc -l` prints 1. |
| REQ-003 | With `--quiet`, the level line is character-for-character the line the default report prints for the same arguments. |
| REQ-004 | Without `--quiet`, stdout for a given argument set is byte-identical to the output before this change. |
| REQ-005 | Exit codes do not change: 0 on success and 1 on invalid input, in both modes. |
| REQ-006 | stderr does not change: `--quiet` still prints validation errors such as `ERROR: --loc must be a positive integer`. |
| REQ-007 | `QUIET` is initialized before the parser runs, so `set -u` cannot abort the script on an unset read. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-008 | `--quiet` composes with `--no-recommend-phases` and `--phase-threshold` and still prints one line. |
| REQ-009 | `--json` takes precedence when both `--json` and `--quiet` are passed, and the JSON document is unchanged. |
| REQ-010 | The script header OPTIONS block and `show_help` both list `--quiet, -q` with a one-line description, and at least one example uses the flag. |
| REQ-011 | `--quiet` changes no score: the level, score and confidence match a default run with the same arguments. |
| REQ-012 | `--quiet` trims stdout only: any warning the script writes to stderr is still written to stderr. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: **Given** the default inputs `--loc 50 --files 2`, **When** the script runs with `--quiet`, **Then** it exits 0 and prints one line, `Recommended Level: 0 (Quick)`.
- **SC-002**: **Given** the same inputs, **When** the script runs without `--quiet`, **Then** `wc -l` prints 16 and the report matches the pre-change output byte for byte.
- **SC-003**: **Given** a Level 3 input set, **When** the script runs with `--quiet --loc 500 --files 15 --auth --api --db --architectural`, **Then** it prints `Recommended Level: 3 (Full)` and nothing else.
- **SC-004**: **Given** both runs, **When** you diff the quiet line against the level line of the default report, **Then** the diff is empty.
- **SC-005**: **Given** an invalid input such as `--loc abc`, **When** the script runs with `--quiet`, **Then** stderr carries the same error text as a default run and the exit code is 1.
- **SC-006**: **Given** the edited script, **When** `bash -n recommend-level.sh` runs, **Then** it exits 0.
- **SC-007**: **Given** `--help`, **When** the help text prints, **Then** it lists `--quiet, -q` and exits 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `output_text()` stays the single renderer of the level line | The quiet line drifts from the report if the label is copied instead of reused | Put the quiet branch inside `output_text()` and reuse the existing string |
| Dependency | `set -euo pipefail` at the top of the script | An unset `QUIET` read aborts every run under `set -u` | Initialize `QUIET=false` with the other globals |
| Risk | A caller already scrapes the report with `head -2` and breaks when a line disappears | Medium | Keep the default report untouched, and test the byte diff |
| Risk | The flag name collides with a future verbose mode | Low | Reserve the pair now: `--quiet` trims output, and no `--verbose` is planned |
<!-- /ANCHOR:risks -->

---


## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance

- **NFR-P01**: The flag adds no measurable time. The script stays a single bash process and the quiet path prints one `echo`.

### Security

- **NFR-S01**: The change reads no credential and adds no file access. The script already takes numbers and booleans only.

### Reliability

- **NFR-R01**: Both modes exit 0 for every valid argument set and 1 for every invalid one, with no partial output on the quiet path.

---

## 8. EDGE CASES

### Data Boundaries

- Empty input: `--quiet` with neither `--loc` nor `--files` prints `ERROR: At least --loc or --files must be provided` on stderr and exits 1, with nothing on stdout.
- Maximum length: a very large `--loc` or `--files` value caps the score at the weight ceilings, so the quiet line still prints one line.

### Error Scenarios

- External service failure: none, because the script calls no network or external process.
- Network timeout: none, for the same reason.

### State Transitions

- Partial completion: if `--quiet` is parsed but the input validation fails, the script exits 1 before any output, so no half line is written.
- Session expiry: not applicable, because the script keeps no state between runs.

### Argument Combinations

- **Given** `--quiet --no-recommend-phases`, **When** the script runs, **Then** stdout still holds exactly one line.
- **Given** `--quiet --json`, **When** the script runs, **Then** the JSON document prints in full and no text line is added.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 4/25 | Files: 1, LOC: about 12, Systems: 1 shell script |
| Risk | 3/25 | Auth: N, API: N, Breaking: N, one shared output contract |
| Research | 2/20 | Read one output function and count lines |
| Multi-Agent | 1/15 | Workstreams: 1 |
| Coordination | 2/15 | Dependencies: 0 |
| **Total** | **12/100** | **Level 3** |

The score maps to Level 0. The declared level is 3 because the dispatch that created this packet set `--level 3`, not because the change is complex. Section 12 records the mismatch rather than hiding it.

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | A caller parses the default report and breaks when the layout changes | H | L | Keep the default report untouched and prove it with a byte diff |
| R-002 | The quiet line drifts from the report line | M | L | Render both from the same string inside `output_text()` |
| R-003 | An unset `QUIET` aborts the script under `set -u` | H | M | Initialize the variable with the other globals and run both modes |
| R-004 | `--quiet` and `--json` conflict and a caller gets the wrong format | M | L | State the precedence in the spec, in the help text and in ADR-001 |

---

## 11. USER STORIES

### US-001: One parseable line for a build script (Priority: P0)

**As a** build script that picks a documentation level, **I want** one line with the level, **so that** I read the value without parsing a 16-line report.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-002: The full report stays for a human reader (Priority: P1)

**As an** operator running the helper by hand, **I want** the default report unchanged, **so that** the score, the confidence and the phase advice stay where they are.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-003: Stable exit codes in a pipeline (Priority: P1)

**As a** CI step that gates on the exit code, **I want** `--quiet` to keep the exit code and the stderr messages, **so that** a failure still fails the step.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-004: One label for maintainers (Priority: P2)

**As a** maintainer of the spec scripts, **I want** the quiet line and the report line rendered from one string, **so that** a label change lands in both places at once.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- Does any caller need `--quiet` on the JSON path? Answer: no. `--json` already emits one document, and REQ-009 makes it win.
- Should the level be 1 for a change this size? Answer: yes by the score, but the packet was created at `--level 3` by dispatch, so the level stays 3 and this row records why.
- Should `--quiet` suppress warnings on stderr? Answer: no. stderr carries failures only, and REQ-006 keeps it.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Decision Records**: See `plan.md` (ADR-001)


