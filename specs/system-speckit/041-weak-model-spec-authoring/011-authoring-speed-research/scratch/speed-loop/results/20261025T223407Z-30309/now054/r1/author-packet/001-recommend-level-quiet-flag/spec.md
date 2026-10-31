---
title: "Feature Specification: Add a quiet flag to recommend-level.sh"
description: "recommend-level.sh prints a multi-line human report, so a caller that needs only the level has to parse it. A --quiet flag prints the single recommended-level line and leaves every other output path unchanged."
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

`recommend-level.sh` answers one question — which SpecKit level fits this task — but prints a sixteen-line report to say it, so a script that needs the level must grep a human document. The `--quiet` flag prints that one recommendation line and nothing else, while every existing invocation keeps its current output. A line count on both forms proves the change: one line with the flag, sixteen without it.

**Key Decisions**: `--quiet` is a presentation flag on the text renderer, not a global output mode; `--json` wins when both flags are passed, because JSON is already the machine-readable form.

**Critical Dependencies**: `bash` 3.2 or newer, already required by the script's `set -euo pipefail` shebang contract.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P2 |
| **Status** | Draft |
| **Created** | 2026-10-25 |
| **Branch** | `scaffold/001-recommend-level-quiet-flag` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`recommend-level.sh` writes a human report: a blank line, the recommendation, the score and confidence, a six-row breakdown and a phase section. A caller that wants only the level — a build step, a hook, a dispatch wrapper — must pipe that report through `grep` or `awk` and hold the label text in its own source. The parsing is fragile in the way all human-output parsing is fragile: a wording change in the report silently breaks the caller.

### Purpose
Give callers one stable line they can read directly, without changing what any existing invocation prints.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add a `--quiet` option to the argument parser that sets a quiet output mode.
- Render only `Recommended Level: <N> (<Name>)` when quiet mode is active and `--json` is not.
- Name `--quiet` in the script's header usage block and in `show_help()`.

### Out of Scope
- Changing the default report - existing callers and readers depend on its current shape.
- Changing the JSON document - it is already machine-readable, so a second machine form adds nothing.
- Adding or changing scoring inputs - the flag affects presentation only, never the score.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh` | Modify | Add the flag, the quiet branch in `output_text()`, and the help text |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | With `--quiet` and no `--json`, stdout holds exactly one line, `Recommended Level: <N> (<Name>)`, and the exit status is 0. |
| REQ-002 | Without `--quiet`, stdout for a given input is byte-identical to the current output. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | `show_help()` and the header usage block both list `--quiet`. |
| REQ-004 | `--quiet` combined with `--json` leaves the JSON document unchanged; quiet applies to the text renderer only. |
| REQ-005 | `--quiet` never suppresses an error: a missing `--loc`/`--files` still prints the usage error to stderr and exits 1. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `bash recommend-level.sh --loc 50 --files 2 --quiet` prints exactly one line and exits 0.
- **SC-002**: `bash recommend-level.sh --loc 50 --files 2` still prints the sixteen-line report, unchanged.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `bash` 3.2+ | The script cannot run without it, and the change adds no new requirement | No fallback needed; the interpreter requirement predates this change |
| Risk | A caller parses the report and depends on the recommendation line's position | Low - the quiet line keeps the same text and label | Emit the existing `Recommended Level: <N> (<Name>)` string verbatim and pin it in a test |
<!-- /ANCHOR:risks -->

---


## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The flag adds no measurable time; the same scoring runs and only the printing shrinks, so a run stays well under 100 ms for typical inputs.

### Security
- **NFR-S01**: N/A - the script reads no credential, opens no network connection and writes no file.

### Reliability
- **NFR-R01**: N/A - a single-shot CLI with no service, no state and no retry surface; failure is a non-zero exit with a stderr message.

---

## 8. EDGE CASES

### Data Boundaries
- Empty input: `--quiet` with neither `--loc` nor `--files` still exits 1 with the existing `At least --loc or --files must be provided` error, because validation runs before any renderer.
- Maximum length: inputs above the scoring ceilings (`--loc 2000 --files 40`) cap at the weights and still print one line.

### Error Scenarios
- External service failure: N/A - no external call exists.
- Network timeout: N/A - no network call exists.

### State Transitions
- Partial completion: N/A - the script holds no state between runs.
- Session expiry: N/A - no session exists.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 6/25 | Files: 1, LOC: ~20, Systems: 1 |
| Risk | 4/25 | Auth: N, API: N, Breaking: N |
| Research | 2/20 | One script read; no external investigation |
| Multi-Agent | 0/15 | Workstreams: 1 |
| Coordination | 3/15 | Dependencies: 0 |
| **Total** | **15/100** | **Level 3 as scaffolded; the change itself measures Level 1** |

The packet was scaffolded at Level 3 by the dispatch instruction (`create.sh --level 3`), so the Level 3 document contract applies. The table records the change's measured complexity, which is Level 1; the two disagree by design, and the level contract — not this table — sets the documentation depth.

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | A caller's parser assumes the recommendation line is line 2 of a report | L | L | Emit the identical label string and assert it in a test |
| R-002 | Quiet leaks into JSON mode and breaks a machine consumer | M | L | Branch inside `output_text()` only; a test runs `--json --quiet` and compares it to `--json` |
| R-003 | The default report drifts while the branch is added | M | M | Diff default output against a captured baseline for two inputs |

---

## 11. USER STORIES

### US-001: One line for a caller (Priority: P0)

**As a** build script or dispatch wrapper, **I want** the recommendation on one line, **so that** I can read the level without parsing a human report.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-002: Unchanged report for a human (Priority: P1)

**As a** developer reading the recommendation in a terminal, **I want** the full report to stay exactly as it is, **so that** my reading of the score breakdown does not change.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- None. The one design question — what `--quiet --json` does — is settled in REQ-004: JSON wins and quiet is ignored.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Decision Records**: See `decision-record.md`
