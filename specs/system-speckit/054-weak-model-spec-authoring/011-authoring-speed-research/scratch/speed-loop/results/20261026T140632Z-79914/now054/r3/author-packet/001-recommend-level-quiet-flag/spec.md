---
title: "Feature Specification: Add a quiet flag to recommend-level.sh"
description: "recommend-level.sh prints a 16-line report for every text invocation, so a caller that needs only the level must parse the report or take the JSON payload. A --quiet flag prints just the recommended-level line and leaves the default report unchanged."
trigger_phrases:
  - "recommend level quiet flag"
  - "add a quiet flag to recommend level sh"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.3 -->
# Feature Specification: Add a quiet flag to recommend-level.sh

<!-- SPECKIT_LEVEL: 3 -->


---

## EXECUTIVE SUMMARY

Callers that need the recommended level today either parse a 16-line report or switch to JSON and extract one field. `--quiet` prints the single `Recommended Level: N (Name)` line and leaves every other output path byte-identical. A line count and a baseline diff prove both halves.

**Key Decisions**: `--quiet` selects a text-output branch, so `--json` wins when both are passed; the quiet line is rendered in the output dispatch, leaving `output_text()` untouched.

**Critical Dependencies**: None beyond the bash 3.2+ and coreutils the script already uses.

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
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

`recommend-level.sh` prints a 16-line report for a text invocation, or 12 lines with `--no-recommend-phases`. A caller that needs only the level, such as a CI step or a wrapper choosing a documentation depth, must parse the report or take the 36-line JSON payload and extract `recommended_level` from it.

### Purpose

Add one flag that prints the recommended-level line and nothing else, so a caller can read the level with `awk`, `sed`, or command substitution without parsing the report.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Recognize `--quiet` in the existing argument parser and track it in a `QUIET_OUTPUT` global that defaults to false.
- Print exactly `Recommended Level: <N> (<Name>)` and exit 0 when `--quiet` is set and JSON output is not requested.
- Document the flag in the header OPTIONS block and in the `show_help` heredoc.
- Keep the default report, the JSON payload, scoring, phase logic, stderr messages and exit codes unchanged.

### Out of Scope
- A short alias such as `-q` - not requested, and the parser already spends `-j` and `-h` on other options.
- Suppressing stderr errors - quiet narrows the report, not failure reporting.
- Changes to scoring, thresholds, phase recommendation or the JSON schema - the feature changes rendering only.
- Updating prose docs that mention the script but never read its output (README, workflow references) - their invocation examples stay valid.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh` | Modify | Add the `QUIET_OUTPUT` global, the `--quiet` parser case, the quiet dispatch branch and the two help entries. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The argument parser accepts `--quiet`, alone or alongside existing flags, and sets `QUIET_OUTPUT=true`; unknown-option handling is unchanged. |
| REQ-002 | With `--quiet` and no `--json`, stdout is exactly one line matching `^Recommended Level: [0-3] \((Quick\|Baseline\|Verification\|Full)\)$`, terminated by one newline, and the exit code is 0. |
| REQ-003 | Without `--quiet`, stdout is byte-identical to the pre-change output for the same arguments, including the leading blank line and the phase section. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | `--quiet --json`, in either order, prints the existing JSON payload unchanged; quiet neither truncates nor mixes with JSON. |
| REQ-005 | `--help` lists `--quiet` with a one-line description, and the header OPTIONS comment matches the help text. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh --loc 500 --files 15 --quiet | wc -l` prints `1`.
- **SC-002**: `diff` between a baseline capture and the post-change default invocation prints nothing for the same arguments.
- **SC-003**: `bash -n recommend-level.sh` exits 0 and `--help` output contains a `--quiet` row.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `bash` 3.2+ and coreutils (`grep`, `wc`, `diff`) | None; the script already requires both | No new runtime; keep the implementation to builtins and `echo`. |
| Risk | The quiet line drifts from the label the default report prints | Medium - a caller parses the wrong text | Render both from `RECOMMENDED_LEVEL` and `LEVEL_NAME`; AC-002 pins the exact line. |
<!-- /ANCHOR:risks -->

---


## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The quiet path runs the same scoring and spawns no subprocess; wall time stays within 5% of the default form for the same arguments.

### Security
- **NFR-S01**: No new input, file or credential is read; the flag only selects an output branch, so there is no auth surface to test.

### Reliability
- **NFR-R01**: Exit codes are unchanged - 0 on success, 1 on the existing validation errors - and `--quiet` never suppresses a stderr error.

---

## 8. EDGE CASES

### Data Boundaries
- Empty input: no `--loc` or `--files` still exits 1 with the existing stderr error; quiet does not change validation.
- Maximum length: `--loc 100000 --files 1000 --quiet` still prints one line, because scoring caps are untouched.

### Error Scenarios
- External service failure: N/A - the script makes no network call.
- Network timeout: N/A - the script makes no network call.
- Invalid numeric value: the existing stderr error and exit 1 survive `--quiet`.

### State Transitions
- Partial completion: N/A - the script is a single pass with no saved state.
- Session expiry: N/A - the script holds no session.
- Repeated `--quiet`: idempotent, `QUIET_OUTPUT` stays true.
- `--quiet --json` in either order: JSON output wins, so the combination is harmless.
- `--quiet --help`: help prints in full and exits 0, because help is not the report.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 4/25 | Files: 1, LOC: ~10, Systems: 1 |
| Risk | 2/25 | Auth: N, API: N, Breaking: N |
| Research | 2/20 | Read one script's parser and output dispatch |
| Multi-Agent | 0/15 | Workstreams: 1 |
| Coordination | 1/15 | Dependencies: 0 |
| **Total** | **9/100** | **Level 3** |

The score covers the change itself, which the script's own thresholds would place at Level 0. This packet carries Level 3 because the authoring track scaffolds every packet at that level; the extra documentation is track overhead, not a signal that the change is architecturally risky.

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | The quiet line drifts from the label in the default report | M | L | Both render from the same two variables; AC-002 pins the exact line. |
| R-002 | `--quiet --json` mixes two output formats | M | L | The JSON branch is evaluated first; AC-004 covers both flag orders. |
| R-003 | A caller assumes `--quiet` also hides errors | L | M | State "report only, stderr unchanged" in help and in AC-005. |

---

## 11. USER STORIES

### US-001: One parseable line for callers (Priority: P0)

**As a** CI step or wrapper script, **I want** `recommend-level.sh` to print only the recommended-level line when asked, **so that** I can choose a documentation depth without parsing a report.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-002: Default report stays intact (Priority: P1)

**As a** maintainer of the script, **I want** the default report and the JSON payload untouched, **so that** existing human workflows and documented examples keep working.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- None. The flag scopes to the text report, `--json` takes precedence, and no short alias is added.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Decision Records**: See `decision-record.md`

---
