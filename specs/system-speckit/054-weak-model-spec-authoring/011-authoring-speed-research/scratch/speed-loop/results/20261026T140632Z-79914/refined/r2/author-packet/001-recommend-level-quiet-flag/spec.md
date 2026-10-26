---
title: "Feature Specification: Add a quiet flag to recommend-level.sh"
description: "Callers that need only the level must parse a 16-line report to read one number. The --quiet flag prints only the recommended-level line and leaves every other mode byte-identical."
trigger_phrases:
  - "recommend level quiet flag"
  - "add a quiet flag to recommend level sh"
  - "recommend-level quiet output"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.3 -->
# Feature Specification: Add a quiet flag to recommend-level.sh

<!-- SPECKIT_LEVEL: 3 -->


---

## EXECUTIVE SUMMARY

`recommend-level.sh` prints a 16-line human report for every run. A caller that needs the level alone has to capture and parse the whole report. The `--quiet` flag prints one stable line, `Recommended Level: N (Name)`, and a line count plus a byte diff on the default output prove the change is confined to that branch.

**Key Decisions**: `--quiet` is a text-report modifier rather than a global silence switch (ADR-001), and JSON output stays unchanged under it (ADR-002)

**Critical Dependencies**: Bash 3.2 or newer, which the script already requires

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
Callers that need only the level must parse a 16-line report to read one number. A shell caller using command substitution receives the score, the breakdown and the phase section along with the value it asked for, so it either scrapes line 2 or filters with `sed`. Both approaches break when the report gains a line.

### Purpose
Give callers one stable line to capture, while every existing invocation keeps its current output byte for byte.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add `--quiet` to the argument parser in `recommend-level.sh`.
- Print only `Recommended Level: N (Name)` when `--quiet` is set and `--json` is not.
- Document the flag in the script header and in `show_help`.
- Keep the default text report and the JSON document byte-identical.
- Cover the flag combinations with command-level checks.

### Out of Scope
- Changing the scoring weights, thresholds or level mapping - the feature selects output, it does not change the score.
- Adding a bare-number mode such as `--level-only` - JSON already serves structured consumers.
- Editing other spec CLI scripts - each change gets its own packet.
- Adding a test framework to the script - the verification uses shell commands the repository already has.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh` | Modify | Add flag parsing, one output guard and the help text |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `--quiet` is accepted by the argument parser and a valid run that uses it exits 0. |
| REQ-002 | With `--quiet` and no `--json`, stdout holds exactly one line, `Recommended Level: N (Name)`, with N and Name taken from the same scoring path as today. |
| REQ-003 | Without `--quiet`, stdout is unchanged from the pre-change script: same 16 lines, same order, same values, 310 bytes for `--loc 500 --files 15`. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | `--help` lists `--quiet` in its OPTIONS block with a one-line description. |
| REQ-005 | With `--quiet` and `--json`, the JSON document is unchanged from a `--json`-only run, because JSON mode already emits one structured document. |
| REQ-006 | `--quiet` leaves stderr diagnostics and exit codes alone: invalid input still prints the existing message and exits 1. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `recommend-level.sh --quiet --loc 500 --files 15` prints one line, `Recommended Level: 2 (Verification)`, and exits 0.
- **SC-002**: `recommend-level.sh --loc 500 --files 15` produces output identical to the captured baseline, proven by an empty `diff`.
- **SC-003**: `recommend-level.sh --quiet --json --loc 100 --files 3` produces output identical to `recommend-level.sh --json --loc 100 --files 3`.
- **SC-004**: `recommend-level.sh --help` names `--quiet` once in the OPTIONS block.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Bash 3.2 or newer, already required by the script | The script cannot run | No new requirement is introduced, so the fallback is the current interpreter |
| Risk | A caller parses the level line and breaks when its label changes | Med | REQ-002 fixes the label and AC-002 pins the exact text |
| Risk | `--quiet` leaks into JSON consumers and changes their document | Med | REQ-005 and AC-005 diff the JSON output against a `--json`-only run |
| Risk | The help text drifts from the parser | Low | AC-004 reads `--help` and T008 edits both in one task |
<!-- /ANCHOR:risks -->

---


## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: `--quiet` adds no measurable time. The run stays below the 10 ms resolution of `/usr/bin/time -p`, the same as the current script.

### Security
- **NFR-S01**: The script reads no credentials, makes no network calls and writes no files. The flag adds no input that reaches the shell unquoted.

### Reliability
- **NFR-R01**: Output is deterministic for the same inputs. Repeated runs of the same invocation print identical bytes.

---

## 8. EDGE CASES

### Data Boundaries
- Empty input: no `--loc` and no `--files` prints the existing two-line stderr message and exits 1 in both text and quiet modes.
- Maximum length: `--loc 100000 --files 1000` prints the same single line under `--quiet` that the full report names on line 2.

### Error Scenarios
- External service failure: N/A, the script calls no service.
- Network timeout: N/A, the script opens no socket.

### State Transitions
- Partial completion: N/A, the script scores once and exits.
- Session expiry: N/A, the script holds no session.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 22/25 | Files: 1, LOC: ~20, Systems: 1 |
| Risk | 16/25 | Auth: N, API: N, Breaking: N |
| Research | 18/20 | Both output functions and the help text must be read before editing |
| Multi-Agent | 10/15 | Workstreams: 1 |
| Coordination | 10/15 | Dependencies: 1, the shared output dispatch |
| **Total** | **76/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | A caller depends on the exact 16-line layout of the default report | M | L | AC-003 diffs the default output against the captured baseline |
| R-002 | The flag is wired into JSON mode and changes a machine contract | M | L | AC-005 diffs the JSON document against a `--json`-only run |
| R-003 | `--quiet` is accepted in one flag position and rejected in another | L | M | AC-001 and T013 exercise order and repetition |

---

## 11. USER STORIES

### US-001: One line for a build script (Priority: P0)

**As a** build script that needs the level, **I want** a single parseable line, **so that** I can read the value without parsing the report.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-002: A discoverable flag (Priority: P1)

**As a** maintainer reading `--help`, **I want** `--quiet` listed with its effect, **so that** I can use it without reading the source.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- None. `--quiet` suppresses the whole text report, so it needs no interaction with `--no-recommend-phases`.
- Should a future `--level-only` print the bare number? Not in this packet. JSON covers structured consumers today.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Decision Records**: See `plan.md` ADR-001 and ADR-002
