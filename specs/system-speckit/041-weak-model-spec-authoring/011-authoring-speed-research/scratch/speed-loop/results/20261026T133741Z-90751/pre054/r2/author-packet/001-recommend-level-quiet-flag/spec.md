---
title: "Feature Specification: Add a quiet flag to recommend-level.sh"
description: "recommend-level.sh always prints a multi-line report, so shell callers that need only the level must filter the output. A --quiet flag prints the recommended-level line alone and leaves the default report unchanged."
trigger_phrases:
  - "recommend level quiet flag"
  - "add a quiet flag to recommend level sh"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Add a quiet flag to recommend-level.sh

<!-- SPECKIT_LEVEL: 3 -->


---

## EXECUTIVE SUMMARY

`recommend-level.sh` is the level-scoring entry point used during SpecKit planning. Every successful run prints a title, a score line, a factor breakdown and an optional phase block, which forces shell callers to filter stdout when they only want the level. A `--quiet` flag prints the single `Recommended Level: N (Name)` line and leaves the default report byte-for-byte unchanged when the flag is absent.

**Key Decisions**: `--quiet` affects text output only and prints exactly one line. `--json` keeps its current payload and takes precedence when both flags appear.

**Critical Dependencies**: Bash 3.2 or newer, the existing `output_text` contract and the phase tests that parse JSON output.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-10-26 |
| **Branch** | `--skip-branch` (no branch created) |
| **Estimated LOC** | ~20 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The text output of `recommend-level.sh` is a report for a person reading a terminal. Scripts that only need the level pipe it through `grep`, `sed` or `tail`, so every one of them hardcodes a line position or a match pattern. When the report gains a section or changes a label, those parsers break without warning.

### Purpose
Give callers a stable one-line contract for the recommended level while leaving the human report exactly as it is today.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add `--quiet` to the argument parser in `recommend-level.sh`.
- Print only `Recommended Level: N (Name)` on stdout when `--quiet` is set.
- Document the flag in the header usage block and in `show_help`.
- Pin the default report and the quiet line with regression tests.

### Out of Scope
- Scoring, threshold or phase logic changes, because the flag must not alter the computed level.
- A short alias such as `-q`, because it was not requested and could collide with a later flag.
- Changes to the `--json` payload or to error messages.
- Edits to downstream docs that merely mention the script.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh` | Modify | Add the flag, the quiet output branch and the help entry |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/test-phase-system.js` | Modify | Add quiet-mode regression cases beside the phase cases |
| `specs/zz-bench-authoring/001-recommend-level-quiet-flag/spec.md` | Modify | This specification |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The argument parser accepts `--quiet` at any position and sets a quiet output mode. |
| REQ-002 | Under `--quiet` without `--json`, stdout is exactly one line matching `Recommended Level: N (Name)` followed by a newline. |
| REQ-003 | Without `--quiet`, stdout is identical to the current output for the same inputs. |
| REQ-004 | `--quiet` does not change the computed level, total score, confidence or phase values. |
| REQ-005 | Exit codes are unchanged. A successful run exits 0 and invalid input exits 1. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-006 | `--json` takes precedence over `--quiet`, and the JSON payload keeps its current fields. |
| REQ-007 | `show_help` lists `--quiet` with a one-line description of its effect. |
| REQ-008 | The header OPTIONS comment lists `--quiet` beside the other output flags. |
| REQ-009 | `--quiet` is idempotent when the flag is repeated. |
| REQ-010 | Errors continue to print to stderr only, with no partial report on stdout. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `recommend-level.sh --quiet --loc 100 --files 3` prints one line and exits 0.
- **SC-002**: The default report diff against the pre-change baseline is empty across the flag matrix.
- **SC-003**: `bash -n` passes and shellcheck reports no new findings.
- **SC-004**: `--quiet --json` parses as JSON with the same keys the phase tests expect.
- **SC-005**: `node tests/test-phase-system.js` and `node tests/test-phase-validation.js` pass.

### Acceptance Scenarios

1. **Given** `--loc 100 --files 3`, **When** I run the script with `--quiet`, **Then** stdout is one line and `wc -l` reports 1.
2. **Given** the same inputs, **When** I run the script without `--quiet`, **Then** the report matches the pre-change output exactly.
3. **Given** `--quiet` together with `--json`, **When** the command runs, **Then** stdout is the existing JSON payload and no level line is added.
4. **Given** an unknown option, **When** I run the script with `--quiet`, **Then** the error goes to stderr, stdout is empty and the exit code is 1.
5. **Given** `--quiet` passed twice, **When** the command runs, **Then** the output is one line and the exit code is 0.
6. **Given** `--quiet --help`, **When** the command runs, **Then** the full help text prints and the exit code is 0.
7. **Given** `--quiet --loc 0 --files 0`, **When** the command runs, **Then** the missing-input error goes to stderr and the exit code is 1.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Bash 3.2+ on macOS and Bash 5.x on Linux | A newer-only construct would break one platform | Use the same `case` and `[[ ]]` forms the script already uses |
| Dependency | Existing `output_text` line format | A format change would break quiet consumers | Share one format string between both output paths |
| Risk | Quiet and default output drift apart | Callers see a different level than the report | Print the same literal in both paths and test both |
| Risk | JSON callers receive extra output | Parsers fail on a stray line | `--json` wins over `--quiet` and is tested |
<!-- /ANCHOR:risks -->

---


## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: A quiet run finishes under 100 ms on the reference machine, matching the current runtime.
- **NFR-P02**: Quiet mode adds no process spawns, no file reads and no extra network access.

### Security
- **NFR-S01**: The flag adds one boolean branch and no new input parsing or evaluation.
- **NFR-S02**: Output carries only the level number and name, with no environment values or paths.

### Reliability
- **NFR-R01**: Quiet output is deterministic across repeated runs and locales.
- **NFR-R02**: Quiet mode never suppresses errors and never changes the exit code.

---

## 8. EDGE CASES

### Data Boundaries
- Empty input: no `--loc` and no `--files` keeps the current error path and prints nothing to stdout.
- Zero values: `--loc 0 --files 0` stays invalid under quiet mode.
- Large values: `--loc 5000 --files 40` keeps the current scoring and quiet prints the same level the report shows.

### Error Scenarios
- Unknown option: the error goes to stderr and the run exits 1, even with `--quiet` set.
- Missing flag value: `--loc --quiet` treats `--quiet` as a missing value and exits 1, as the current `^--` guard does.
- Repeated flag: a second `--quiet` leaves the mode unchanged.

### Concurrent Operations
- None. The script is a single process that reads no shared state.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 10/25 | Files: 1 script plus 1 test file, LOC: ~20 |
| Risk | 8/25 | Auth: N, API: N, Breaking: N, output contract only |
| Research | 5/20 | One script and two consumer tests read |
| Multi-Agent | 3/15 | Workstreams: 1 |
| Coordination | 4/15 | Dependencies: 2 consumer test suites |
| **Total** | **30/100** | **Level 3 by track contract** |

The change scores below the Level 2 boundary on the script's own scale. Level 3 is the authoring level this track requires, so the packet carries the full document set without widening implementation scope.

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Default report changes while adding the branch | H | L | Diff the default output against a captured baseline |
| R-002 | Quiet line drifts from the report format | M | L | Use one shared format literal and test both paths |
| R-003 | JSON consumers break on new output | H | L | Keep `--json` first in the dispatch and rerun the phase tests |
| R-004 | A future flag reuses `-q` differently | L | L | Ship the long form only, as scoped |

---

## 11. USER STORIES

### US-001: One Line for a CI Script (Priority: P0)

**As a** CI script author, **I want** `recommend-level.sh` to print only the level when I ask for it, **so that** I can capture the value without a text parser.

**Acceptance criteria:** see `acceptance-criteria.md` (rows AC-001, AC-002 and AC-004).

---

### US-002: Default Report Stays Put (Priority: P0)

**As a** developer running the script by hand, **I want** the full report unchanged when I do not pass the flag, **so that** existing habits and docs still hold.

**Acceptance criteria:** see `acceptance-criteria.md` (rows AC-005, AC-006 and AC-012).

---

### US-003: Machine Output Keeps Its Contract (Priority: P1)

**As a** test maintainer, **I want** `--json` to keep its payload, **so that** the phase tests keep parsing the same fields.

**Acceptance criteria:** see `acceptance-criteria.md` (row AC-007).

---

### US-004: Documented Flag, Shared Format (Priority: P1)

**As a** maintainer, **I want** both modes to print the same level line and the flag to be documented, **so that** the two outputs cannot drift and callers can find the option.

**Acceptance criteria:** see `acceptance-criteria.md` (rows AC-003, AC-008, AC-009 and AC-010).

---

### US-005: Predictable Failure (Priority: P1)

**As a** caller, **I want** errors to keep their channel and exit code under quiet mode, **so that** a failed run never looks successful.

**Acceptance criteria:** see `acceptance-criteria.md` (rows AC-011 and AC-013).

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- None. `plan.md` ADR-001 settles the JSON precedence and the single-line format.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Decision Records**: See `plan.md` (L3: ARCHITECTURE DECISION RECORD, ADR-001)

---
