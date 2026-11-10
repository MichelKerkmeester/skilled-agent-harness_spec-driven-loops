---
title: "Feature Specification: Add a quiet flag to recommend-level.sh"
description: "Add a --quiet/-q flag to recommend-level.sh so callers get the recommended level in one line instead of a 16-line report. The flag reuses the existing level line and leaves every other invocation byte-identical."
trigger_phrases:
  - "recommend level quiet flag"
  - "add a quiet flag to recommend level sh"
  - "recommend-level quiet mode"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.3 -->
# Feature Specification: Add a quiet flag to recommend-level.sh

<!-- SPECKIT_LEVEL: 3 -->


---

## EXECUTIVE SUMMARY

`recommend-level.sh` answers one question — which documentation level a task needs — but it prints a 16-line report to answer it. A build script that wants the answer must scrape the second line, and `--json` replaces the report with a 36-line document rather than shortening it. This packet adds a `--quiet`/`-q` flag that prints only `Recommended Level: N (Name)`, leaves every other invocation byte-identical, and is proven by line counts on both paths.

**Key Decisions**: `--quiet` is a flag rather than an environment variable; it reuses the existing level line verbatim; `--json` keeps precedence over `--quiet`

**Critical Dependencies**: Bash 3.2 or newer (the macOS default), which the script already requires; the change adds no new dependency

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

The script prints 16 lines for `--loc 500 --files 15` and 36 lines for `--json`, both measured against the current file. A caller that needs the level must pipe the report through `head`, `grep` or a JSON parser. Today `--quiet` is not an option at all: the argument parser rejects it with `ERROR: Unknown option: --quiet` and exits 1.

### Purpose

Add a `--quiet`/`-q` flag that prints exactly the level line the report already carries, so a caller gets the answer in one line without a parser and without changing any existing invocation.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add `--quiet` and `-q` to the argument parser, held in a `QUIET_OUTPUT` global.
- Add an `output_quiet()` function that prints the existing level line.
- Route the output dispatch so quiet sits between JSON and the full report.
- Document the flag in the file header OPTIONS block and in `--help`.
- Prove the default report is unchanged against recorded baseline line counts.

### Out of Scope
- Scoring, thresholds, confidence and phase logic - the flag changes presentation only
- The JSON schema - `--json` keeps precedence and its document is unchanged
- stderr and exit codes - errors still print and exit 1 under `--quiet`
- An environment variable or config file - a flag is explicit, local to the invocation and discoverable in `--help`

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh` | Modify | Parse the flag, add the quiet output function, route the dispatch, document the option |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `--quiet` and `-q` are accepted; with either one, stdout is exactly one line, `Recommended Level: <N> (<Name>)`, and the exit code is 0 |
| REQ-002 | Without `--quiet`, stdout and exit codes are byte-identical to the current script for every documented invocation: 16 lines for the text report, 36 for `--json`, 12 with `--no-recommend-phases` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | `--help` and the file header OPTIONS block list `--quiet`; `--help` still exits 0 |
| REQ-004 | `--quiet --json` emits the JSON document unchanged, because JSON takes precedence over quiet |
| REQ-005 | `--quiet` leaves stderr alone: `--loc 0 --files 0` still prints its error to stderr, prints no level line, and exits 1 |
| REQ-006 | The script keeps `set -euo pipefail` and passes `bash -n` |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `recommend-level.sh --quiet --loc 1000 --files 20 --architectural --api --db` prints one line and exits 0
- **SC-002**: `--loc 500 --files 15 | wc -l` prints 16, `--json | wc -l` prints 36 and `--no-recommend-phases | wc -l` prints 12, matching today's measurements
- **SC-003**: `--quiet --json --loc 100 --files 3` matches `--json --loc 100 --files 3` byte for byte
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Bash 3.2 or newer | The script cannot run on a shell without `[[ ]]` and arrays | Keep the change inside the constructs the script already uses |
| Risk | A caller keys on the exact level line, so a wording change breaks the parse | Med | Reuse the line verbatim and pin its text with AC-001 |
<!-- /ANCHOR:risks -->

---


## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: `--quiet` adds no measurable time: the same one-pass scoring plus one `echo`, with the run staying under 50 ms

### Security
- **NFR-S01**: N/A - the script reads no credentials, files or network; it parses numeric arguments only

### Reliability
- **NFR-R01**: Exit codes are unchanged: 0 on success and 1 on any usage or validation error

---

## 8. EDGE CASES

### Data Boundaries
- Empty input: `--loc 0 --files 0` keeps its current behavior - error to stderr, exit 1, no level line
- Maximum length: `--loc` and `--files` are digit-validated; values above the top threshold cap at 35 and 20 points, and quiet prints the resulting Level 3 line

### Error Scenarios
- External service failure: N/A - the script makes no external calls
- Network timeout: N/A - the script has no network path

### State Transitions
- Partial completion: N/A - the script is a one-shot process with no persisted state
- Session expiry: N/A - the script holds no session

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 3/25 | Files: 1, LOC: ~15, Systems: 1 |
| Risk | 2/25 | Auth: N, API: N, Breaking: N (additive flag) |
| Research | 3/20 | Read one script end to end |
| Multi-Agent | 1/15 | Workstreams: 1 |
| Coordination | 1/15 | Dependencies: 0 |
| **Total** | **10/100 measured** | **Level 0 by score; filed at Level 3** |

The measured score maps to Level 0. `create.sh --level 3` fixed the documentation level for this authoring bench, so the packet carries Level 3 documents for a Level 0 change. The extra documentation is the cost of the bench, not a claim that the change is risky.

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | A caller parses the level line and a wording change breaks it | M | L | Reuse the line verbatim; AC-001 pins the exact text |
| R-002 | `--quiet` accidentally suppresses an error message | M | L | Errors are written before the output dispatch; AC-007 covers the error path |
| R-003 | The quiet line drifts from the report's first line | L | M | Build both from the same globals and compare them during verification |

---

## 11. USER STORIES

### US-001: One line for a build script (Priority: P0)

**As a** build script that picks the documentation level, **I want** one line on stdout, **so that** I can read the level without a parser.

**Acceptance criteria:** see `acceptance-criteria.md` (AC-001, AC-002).

---

### US-002: A discoverable flag (Priority: P1)

**As an** operator running `--help`, **I want** the quiet option listed with the others, **so that** I can find it without reading the source.

**Acceptance criteria:** see `acceptance-criteria.md` (AC-005).

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- None. `--quiet` leaves stderr and exit codes alone (section 8), and `--json` keeps precedence (ADR-002 in `plan.md`).
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Decision Records**: See `plan.md`, ADR-001 and ADR-002

---

