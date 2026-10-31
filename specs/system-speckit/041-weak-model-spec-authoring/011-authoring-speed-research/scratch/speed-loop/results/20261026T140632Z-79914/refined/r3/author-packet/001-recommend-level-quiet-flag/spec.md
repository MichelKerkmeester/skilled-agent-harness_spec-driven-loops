---
title: "Feature Specification: Add a quiet flag to recommend-level.sh"
description: "Add a --quiet flag to recommend-level.sh that prints only the final recommended-level line, leaving the default report and the JSON payload unchanged."
trigger_phrases:
  - "recommend level quiet flag"
  - "add a quiet flag to recommend level sh"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "zz-bench-authoring/001-recommend-level-quiet-flag"
    last_updated_at: "2026-10-26T15:32:00Z"
    last_updated_by: "devin-cli"
    recent_action: "Authored the specification for this packet"
    next_safe_action: "Review the plan, then start T001"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-10-26-recommend-level-quiet-flag-plan"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.3 -->
# Feature Specification: Add a quiet flag to recommend-level.sh

<!-- SPECKIT_LEVEL: 3 -->


---

## EXECUTIVE SUMMARY

A caller that needs only the level recommendation must parse a 16-line report or a multi-line JSON payload, and every parse site couples itself to the report's shape. A `--quiet` flag prints the single `Recommended Level:` line and nothing else, leaving the default report byte-identical. A line count on both invocations proves it: one line with the flag, 16 without.

**Key Decisions**: `--quiet` reprints the existing `Recommended Level: N (Name)` label rather than a bare number (ADR-001); `--quiet` and `--json` are mutually exclusive and exit 1 (ADR-002)

**Critical Dependencies**: `bash` 3.2 or newer, which the script already requires; no new package

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

`recommend-level.sh` always prints the full report: a blank line, the level line, the score line, a five-row breakdown and a phase section. A caller that needs the level alone must pipe the output through `sed`, `awk` or `grep`, and each of those filters encodes an assumption about the report's shape that a later formatting change breaks without warning. The script offers no supported way to ask for the one value.

### Purpose

Add a `--quiet` flag that prints the final recommended-level line and nothing else, so a caller reads one stable line while the default report and the JSON payload stay exactly as they are.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add a `--quiet` flag to the option parser in `recommend-level.sh`.
- Print exactly one line, `Recommended Level: N (Name)`, when the flag is set.
- Reject `--quiet` combined with `--json`, exiting 1 with an error on stderr and nothing on stdout.
- Document the flag in the script's header comment and in `show_help`.
- Keep the default text report and the JSON payload byte-identical.

### Out of Scope
- Changing the scoring algorithm or the level thresholds - the flag selects output and nothing else
- Adding the same flag to the other `spec/*.sh` scripts - each one is its own packet
- A compact single-line JSON mode - `--json` already produces machine-readable output
- Changing exit codes or stderr text - callers depend on both today

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh` | Modify | Add the flag, its output branch, the mutual-exclusion guard and the help text |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | With `--quiet`, stdout holds exactly one line matching `^Recommended Level: [0-3] \([A-Za-z]+\)$`, and the exit code is 0. |
| REQ-002 | Without `--quiet`, stdout is unchanged: 16 lines for `--loc 500 --files 15`, and the same JSON object for `--json`. |
| REQ-003 | `--quiet` with `--json` exits 1, writes `ERROR: --quiet cannot be combined with --json` to stderr, and writes nothing to stdout. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | `--help` lists `--quiet` in its OPTIONS block, and the script's header comment documents the flag next to the other options. |
| REQ-005 | `--quiet` leaves stderr and the existing input errors untouched: a missing `--loc` and `--files` still prints its current message and exits 1. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `bash recommend-level.sh --loc 500 --files 15 --quiet | wc -l` prints 1.
- **SC-002**: `bash recommend-level.sh --loc 500 --files 15 | wc -l` prints 16, and the output diffs clean against the capture taken before the change.
- **SC-003**: `bash recommend-level.sh --loc 500 --files 15 --quiet --json` writes the documented error to stderr and exits 1.
- **SC-004**: `bash -n recommend-level.sh` exits 0, so the script still parses.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `bash` 3.2 or newer | The script cannot run at all | It already requires bash for `[[ ]]` and `case`; the flag adds no new builtin |
| Risk | A caller parses the level line and the label changes | Med | Keep the existing `Recommended Level:` label and pin the pattern in AC-001 |
| Risk | The flag leaks into the JSON branch and changes that payload | Med | Select the quiet branch before the JSON branch and diff the payload in AC-002 |
| Risk | The flag is accepted and silently ignored next to `--json` | Low | Reject the combination with exit 1, as REQ-003 states |
<!-- /ANCHOR:risks -->

---


## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The flag adds no measurable time; the same single scoring pass runs, and both invocations finish inside the same second.

### Security
- **NFR-S01**: The flag reads no credential, no environment variable and no file; the script's inputs stay the four documented CLI flags.

### Reliability
- **NFR-R01**: The default output path is untouched, so an existing caller sees no behavior change; the flag is purely additive.

---

## 8. EDGE CASES

### Data Boundaries
- Empty input: `--quiet` with neither `--loc` nor `--files` exits 1 with the existing `At least --loc or --files must be provided` error and prints nothing to stdout.
- Maximum length: `--loc 100000 --files 100000 --quiet` prints the single level line (Level 3) and exits 0.

### Error Scenarios
- External service failure: none; the script calls no service.
- Network timeout: none; the script makes no network call.
- Flag conflict: `--quiet` with `--json` exits 1 with the documented error, so neither output mode runs.

### State Transitions
- Partial completion: not applicable; the script is one pass with no persisted state.
- Session expiry: not applicable; there is no session.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 4/25 | Files: 1, LOC: ~15, Systems: 1 |
| Risk | 2/25 | Auth: N, API: N, Breaking: N (the flag is additive) |
| Research | 2/20 | Read the output functions; no external investigation |
| Multi-Agent | 1/15 | Workstreams: 1 |
| Coordination | 2/15 | Dependencies: 1 (the script's own output contract) |
| **Total** | **11/100** | **Level 3 (operator-selected)** |

The score describes the change, not the packet. The operator set Level 3 for documentation depth, so the two differ by design rather than by an arithmetic slip.

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | A caller parses the level line and a label change breaks it | M | L | Keep the existing label; AC-001 pins the pattern |
| R-002 | The flag leaks into the JSON branch and changes that payload | M | L | Select the quiet branch before output dispatch; AC-002 diffs the payload |
| R-003 | The flag is accepted but ignored when `--json` is also passed | L | M | Reject the combination with exit 1 (REQ-003) |

---

## 11. USER STORIES

### US-001: One parseable line (Priority: P0)

**As a** spec-authoring script, **I want** the level on a single line, **so that** I can read it without a filter that knows the report's shape.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-002: Discoverable flag (Priority: P1)

**As a** maintainer, **I want** the flag listed in `--help` and in the header comment, **so that** callers find it without reading the source.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- None. The flag's scope, output shape and conflict behavior are fixed by REQ-001 through REQ-005.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Decision Records**: See `plan.md` (ADR-001 and ADR-002, recorded in the L3 architecture decision record section)

---
