---
title: "Feature Specification: Add a quiet flag to recommend-level.sh"
description: "recommend-level.sh prints a 16-line report to answer one question. A --quiet flag prints the recommended-level line alone, while the default report keeps its exact bytes."
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

`recommend-level.sh` answers one question, which documentation level a task needs, and prints a 16-line report to do it. A caller that needs only the number must grep the report or count lines, and any later report edit can break that parse without a failing test. The `--quiet` flag prints the `Recommended Level:` line alone, and the default report keeps its exact bytes: one line under the flag, 16 lines and 301 bytes without it.

**Key Decisions**: ADR-001 makes `--quiet` a text-output modifier so `--json` keeps precedence. ADR-002 adds a dedicated `output_quiet()` so the default path is never edited.

**Critical Dependencies**: Bash 3.2+ only. The flag adds no package, no file and no stored data.

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
`recommend-level.sh` prints a human report: a leading blank line, the level line, the score and confidence line, a five-row breakdown and a phase-recommendation block. A build script, hook or CLI that needs only the level has to grep that report or count lines, and a later report edit can break the parse silently.

### Purpose
Print the level line and nothing else when the caller passes `--quiet`, while every existing reader sees the same bytes as before.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add `--quiet` to the argument parser and set a `QUIET_OUTPUT` global.
- Add `output_quiet()`, which prints the `Recommended Level:` line alone.
- Route the output section through JSON, quiet and text, in that order.
- Document the flag in the `--help` OPTIONS block and the script header comment.

### Out of Scope
- Changing the scoring algorithm - the flag changes presentation, and the same score still decides the level.
- Changing `--json` output - JSON is already one machine-readable document, and ADR-001 keeps it ahead of quiet.
- Adding the flag to `create.sh` or any other spec script - one script per packet.
- Suppressing stderr diagnostics - an error must stay visible even under quiet.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh` | Modify | Add the flag, the quiet output function and the help text |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `--quiet` is accepted and stdout holds exactly one line, `Recommended Level: <N> (<Name>)`, with exit status 0. |
| REQ-002 | Without `--quiet`, stdout is byte-identical to the recorded baseline for `--loc 200 --files 2`: 16 lines and 301 bytes. |
| REQ-003 | `bash -n` accepts the edited script, and every existing flag keeps its current output. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | `--help` lists `--quiet` in its OPTIONS block. |
| REQ-005 | `--quiet --json` prints the full JSON document, because JSON takes precedence over quiet. |
| REQ-006 | Error paths still write to stderr and exit 1, and quiet does not suppress them. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `recommend-level.sh --quiet --loc 200 --files 2` prints 1 line and exits 0.
- **SC-002**: The same invocation without `--quiet` prints 16 lines and 301 bytes, the recorded baseline.
- **SC-003**: `recommend-level.sh --quiet --json --loc 100 --files 3` prints a JSON document whose `recommended_level` is 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Bash 3.2+ and the scoring helpers already in the script | Green - no install step | The flag is a branch in the existing file, so a missing toolchain is the only blocker |
| Risk | A caller greps the report, and a later edit adds a line above the level line | Med | AC-001 pins the label and AC-002 pins the byte count, so the regression fails a check |
<!-- /ANCHOR:risks -->

---


## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: `--quiet` does no work beyond one print, so the run cannot be slower than the default path that formats 16 lines.

### Security
- **NFR-S01**: The script reads only its own arguments; the flag adds no credential, file or network access.

### Reliability
- **NFR-R01**: The same arguments print the same line; the flag reads no environment variable and no clock.

---

## 8. EDGE CASES

### Data Boundaries
- Empty input: with no `--loc` and no `--files`, the existing `ERROR: At least --loc or --files must be provided` goes to stderr and the exit status stays 1.
- Maximum input: values past the scoring caps clamp to the weight maximum, and `--quiet` prints the resulting level line only.

### Error Scenarios
- Invalid numeric input: `--loc abc` prints `ERROR: --loc must be a positive integer` to stderr and exits 1, with stdout empty.
- Unknown option: an unrecognized flag keeps its error message and exit status 1.

### State Transitions
- `--quiet` with `--json`: JSON wins and quiet is inert, as ADR-001 records.
- `--quiet` with `--help`: `show_help` runs during argument parsing and exits 0, so help wins.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 4/25 | Files: 1, LOC: ~15, Systems: 1 |
| Risk | 3/25 | Auth: N, API: N, Breaking: N - output is additive |
| Research | 2/20 | The script, its tests and its docs are already read; no open question remains |
| Multi-Agent | 0/15 | Workstreams: 1 |
| Coordination | 1/15 | Dependencies: 0 |
| **Total** | **10/100** | **Level 3** |

The script's own scale maps 10 points to Level 0. This packet is Level 3 because the authoring request fixed that level; the level buys the verification record, six criteria and a byte-identical baseline, rather than code volume.

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | A caller parses the report and a later edit adds a line above the level line | M | L | AC-001 pins the label and AC-002 pins the byte count |
| R-002 | The quiet branch leaks into the default path and changes its output | H | L | ADR-002 keeps a separate function, and AC-002 compares the byte count |

---

## 11. USER STORIES

### US-001: One parseable line (Priority: P0)

**As a** build script, **I want** one parseable line from the level helper, **so that** I can set a packet level without parsing a report.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-002: An unchanged report (Priority: P1)

**As a** maintainer, **I want** the default report unchanged, **so that** existing readers and tests see the same output after the flag ships.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- None. The one combination that needs a rule, `--quiet --json`, is decided in ADR-001.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Decision Records**: See ADR-001 and ADR-002 in `plan.md`

---
