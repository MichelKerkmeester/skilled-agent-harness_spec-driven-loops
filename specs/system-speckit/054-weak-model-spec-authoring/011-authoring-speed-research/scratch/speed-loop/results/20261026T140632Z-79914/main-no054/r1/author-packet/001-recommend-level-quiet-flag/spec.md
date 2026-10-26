---
title: "Feature Specification: Add a quiet flag to recommend-level.sh"
description: "recommend-level.sh prints a full report on every text run, so a caller that needs only the level has to slice the output. A --quiet flag would reduce stdout to the single recommended-level line and leave every existing invocation unchanged."
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

`recommend-level.sh` prints a blank line, the level line, the score line, a breakdown block and a phase section on every text run. A wrapper that needs the level alone has to slice that report, and `head -1` returns the blank line. Adding `--quiet` gives callers one stable line and keeps the current report for everyone else.

**Key Decisions**: `--quiet` governs the text report only, JSON output stays unchanged; the quiet line reuses the existing `Recommended Level:` format.

**Critical Dependencies**: None beyond the script itself.

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

The text report always prints five blocks. A caller that wants the level alone must parse or slice that output. `head -1` returns an empty line, and `grep` couples the caller to the exact label. Both approaches break when the layout moves.

### Purpose

A caller can pass `--quiet` and read one line that names the recommended level and its name, with no other stdout content.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Accept `--quiet` in the argument parser and record the choice in a `QUIET` global.
- In text mode with `--quiet`, print only `Recommended Level: <N> (<Name>)` and nothing else on stdout.
- Leave the no-flag text report and the JSON report byte-identical to their current output.
- Document `--quiet` in the file header OPTIONS block and in `show_help()`.

### Out of Scope
- A short alias such as `-q` - the request names only `--quiet`.
- Changes to scoring, level thresholds or phase recommendation - unrelated to output volume.
- A quiet mode for JSON - the JSON document is already one machine-readable payload.
- Changes to error messages on stderr - `--quiet` never hides a failure.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh` | Modify | Add the flag, the global, the quiet branch and the help text |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The argument parser accepts `--quiet` in any position and sets quiet mode without consuming a value. |
| REQ-002 | With `--quiet` and no `--json`, stdout is exactly one line: `Recommended Level: <N> (<Name>)`. |
| REQ-003 | Without `--quiet`, the text report matches the current output byte for byte. |
| REQ-004 | `--quiet` leaves exit codes unchanged. Validation and unknown-option errors still print to stderr and exit 1. |
| REQ-005 | The quiet line keeps the exact `Recommended Level: <N> (<Name>)` format the full report already uses. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-006 | `show_help()` lists `--quiet` in OPTIONS and shows one example. |
| REQ-007 | The file header comment block lists `--quiet` in OPTIONS. |
| REQ-008 | `--quiet` composes with `--no-recommend-phases` and `--phase-threshold <N>` without adding output. |
| REQ-009 | `--quiet` with `--json` leaves the JSON payload unchanged. The flag is a documented no-op in that mode. |
| REQ-010 | Repeating `--quiet` is accepted and changes nothing. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `bash recommend-level.sh --loc 50 --files 2 --quiet | wc -l` reports `1`.
- **SC-002**: A `diff` between the current text output and the post-change text output, both without `--quiet`, reports no differences.
- **SC-003**: `bash recommend-level.sh --loc 50 --files 2 --quiet --json` matches `--json` alone byte for byte.
- **SC-004**: `--help` output contains the string `--quiet`.

### Acceptance Scenarios

- **Given** `--loc 50 --files 2`, **When** the script runs with `--quiet`, **Then** stdout is `Recommended Level: 0 (Quick)` and exit is 0.
- **Given** `--loc 500 --files 15 --auth --api --db --architectural`, **When** the script runs with `--quiet`, **Then** stdout is one `Recommended Level: 3 (Full)` line.
- **Given** no `--quiet`, **When** the script runs, **Then** the output equals the recorded baseline.
- **Given** `--quiet` and `--json`, **When** the script runs, **Then** the JSON object equals the `--json` baseline.
- **Given** `--quiet` with neither `--loc` nor `--files`, **When** the script runs, **Then** stdout is empty, stderr carries the ERROR line and exit is 1.
- **Given** `--quiet` repeated twice in different positions, **When** the script runs, **Then** it exits 0 and prints one line.
- **Given** `--quiet --no-recommend-phases`, **When** the script runs, **Then** it prints one line and no phase fields.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Bash 3.2 or newer | The flag parser and `[[ ]]` tests already require it | No new shell feature is introduced |
| Risk | The quiet line drifts from the full report line | Callers that parse the line break | Both paths print through one helper |
| Risk | A later edit adds output before the level line | Quiet mode silently prints extra content | AC-002 counts lines, not characters |
<!-- /ANCHOR:risks -->

---


## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: `--quiet` adds no measurable runtime. The script still runs one scoring pass and one `echo`.

### Security
- **NFR-S01**: No new input is read, stored or echoed. The flag carries no value.

### Reliability
- **NFR-R01**: The change adds no failure path. Every existing exit code keeps its trigger.

### Compatibility
- **NFR-C01**: The change stays inside one file and adds no dependency. Callers that omit the flag see no output change.

---

## 8. EDGE CASES

### Data Boundaries
- Empty input: `--quiet` alone reaches the existing required-input check, which writes to stderr and exits 1. Stdout stays empty.
- Maximum length: LOC above 1000 and files above 30 still produce one line. The score caps do not affect formatting.

### Error Scenarios
- Unknown option: the parser still prints `ERROR: Unknown option` to stderr and exits 1, with or without `--quiet`.
- Non-numeric `--loc`, `--files` or `--phase-threshold`: the existing numeric check fires before scoring, so the quiet branch never runs.
- `--quiet` combined with `--json`: JSON wins and the payload is unchanged.
- `--quiet` repeated: the second occurrence sets the same boolean.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 5/25 | Files: 1, LOC: about 20, Systems: 1 |
| Risk | 3/25 | Auth: N, API: N, Breaking: N |
| Research | 2/20 | One read of the existing output path |
| Multi-Agent | 0/15 | Workstreams: 0 |
| Coordination | 1/15 | Dependencies: 0 |
| **Total** | **11/100** | **Level 3 by packet assignment** |

The score lands in the Level 0 band. This packet stays at Level 3 because the authoring request fixed the level. That mismatch is deliberate and does not change the work.

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Quiet output grows past one line after a later edit | M | L | Line-count assertion in AC-002 |
| R-002 | The quiet branch duplicates the level line and the copies drift | M | M | One helper prints the line for both paths |
| R-003 | Help text and header comment fall out of sync with the parser | L | M | AC-006 checks `--help`, AC-007 checks the header block |

---

## 11. USER STORIES

### US-001: Quiet call from a wrapper script (Priority: P0)

**As a** script author, **I want** `recommend-level.sh --quiet` to print only the level line, **so that** my wrapper can read the level without slicing a report.

**Acceptance criteria:** see `acceptance-criteria.md` (rows AC-001 through AC-005).

---

### US-002: Unchanged interactive report (Priority: P1)

**As a** developer running the script by hand, **I want** the full report when I omit `--quiet`, **so that** I keep the score and phase detail I use today.

**Acceptance criteria:** see `acceptance-criteria.md` (rows AC-003, AC-008 and AC-009).

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- Should a later change add a `-q` alias? Not in this scope. Revisit only if a caller asks.
- Should `--quiet` reduce JSON to a single key? No decision is needed now. The current choice keeps JSON unchanged.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Acceptance Criteria**: See `acceptance-criteria.md`

---
