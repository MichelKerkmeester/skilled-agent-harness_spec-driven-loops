---
title: "Feature Specification: Add a quiet flag to recommend-level.sh"
description: "recommend-level.sh answers one question with a 17-line report. Add a --quiet flag that prints only the recommended-level line and leaves the default report byte-identical."
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

`recommend-level.sh` writes a 17-line report to stdout, and the single value it exists to produce sits on line 2 of that report. A caller that needs only the level must parse the report text or switch to `--json` and parse a document. This change adds `--quiet`, which prints exactly the `Recommended Level: <N> (<Name>)` line and nothing else, while the default report stays byte-identical; a line count of 1 for the quiet run, 17 for the default run, and a byte comparison of the level line across both modes proves it.

**Key Decisions**: `--quiet` is an output-only flag that changes no scoring, and `--quiet` combined with `--json` exits 1 instead of letting one flag win silently.

**Critical Dependencies**: bash 3.2 or newer, the macOS default; no new packages or tools.

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
Every invocation of `recommend-level.sh` writes a 17-line report to stdout, and the answer — `Recommended Level: <N> (<Name>)` — is line 2. A build script, hook or agent that needs only the level must either parse the report's prose or pass `--json` and parse a JSON document, so a one-value question costs the caller a parser.

### Purpose
Give text-mode callers a `--quiet` flag that prints exactly the one line they need, while every existing invocation keeps its current output and exit status.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add `--quiet` to the argument parser in `recommend-level.sh`.
- Print exactly one line in quiet mode: the same `Recommended Level: <N> (<Name>)` line the default report carries.
- Reject `--quiet` combined with `--json` on stderr with exit status 1.
- Document the flag in the script's header OPTIONS block and in `show_help()`.
- Prove both modes with a line count and a byte comparison of the level line.

### Out of Scope
- The `--json` document — it already serves machine callers and does not change.
- Scoring, thresholds, confidence and phase logic — quiet gates output, not computation.
- Skill reference docs (`quick-reference.md`, `runtime/cli/spec/README.md`) — neither enumerates this script's flags.
- A new test harness — the script has no test file today, so verification stays manual and scripted in `tasks.md`.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh` | Modify | Add the `QUIET` global, parser case, conflict check, text-output branch, header entry and help entry |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The argument parser accepts `--quiet` and does not fall through to the `Unknown option` branch. |
| REQ-002 | With `--quiet`, stdout holds exactly one line, and that line equals the `Recommended Level: <N> (<Name>)` line printed by the same invocation without the flag. |
| REQ-003 | With `--quiet`, the score line, the breakdown block and the phase recommendation block are absent from stdout. |
| REQ-004 | Without `--quiet`, stdout and the exit status are byte-identical to the pre-change script for every existing option combination. |
| REQ-005 | `--quiet` leaves scoring untouched: the recommended level, total score and confidence come from the same inputs and the same arithmetic as before. |
| REQ-006 | Exit status is unchanged in quiet mode: 0 on a successful recommendation and 1 on invalid input, with the error on stderr and nothing on stdout. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-007 | `--quiet` appears in the header OPTIONS comment block and in `show_help()`, in the same column format as the neighbouring options. |
| REQ-008 | `--quiet --json` is rejected: stderr names both flags, stdout is empty and the exit status is 1. |
| REQ-009 | `--quiet` is position-independent: first, middle and last argument positions produce the same one line. |
| REQ-010 | Repeating `--quiet` is idempotent and still prints exactly one line. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A quiet run prints one line: `recommend-level.sh --loc 500 --files 15 --auth --api --db --architectural --quiet | wc -l` prints `1`.
- **SC-002**: The default report is unchanged: the same invocation without `--quiet` prints 17 lines and exits 0.
- **SC-003**: The quiet line equals the default report's level line: a `diff` of the two extracted lines prints nothing.
- **SC-004**: `--quiet --json` exits 1 with empty stdout and a stderr message naming both flags.

### Acceptance Scenarios

- **Given** the script at its current revision, **When** it runs with `--loc 500 --files 15 --auth --api --db --architectural --quiet`, **Then** stdout holds exactly one line and `wc -l` prints `1`.
- **Given** the same arguments without `--quiet`, **When** the script runs, **Then** stdout holds 17 lines and the exit status is 0.
- **Given** both runs, **When** the level line is extracted from the default output and compared with the quiet output, **Then** `diff` prints nothing.
- **Given** `--quiet` and `--json` together, **When** the script runs, **Then** the exit status is 1, stdout is empty and stderr names both flags.
- **Given** `--quiet` with neither `--loc` nor `--files`, **When** the script runs, **Then** the exit status is 1, stdout is empty and stderr carries the existing required-input error.
- **Given** `--quiet` as the first, a middle and the last argument, **When** each invocation runs, **Then** all three outputs are identical.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | bash 3.2 or newer (macOS default) | The flag cannot ship without a shell that parses `case` and `[[ ]]` | Use only the constructs the script already uses; no new interpreter |
| Risk | A caller greps `^Recommended Level:` and a later edit renames the label | Quiet callers break silently | AC-002 pins the label and AC-003 asserts byte equality with the report |
| Risk | The quiet branch suppresses the level line along with the report | The flag returns nothing, which is worse than the report | AC-001 asserts one line and AC-003 asserts its content |
<!-- /ANCHOR:risks -->

---


## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Quiet mode does strictly less output work than the default and adds no measurable time; both invocations finish under 100 ms.

### Security
- **NFR-S01**: The flag reads no file, environment variable, network resource or credential; it sets a boolean that gates `echo` calls.

### Reliability
- **NFR-R01**: Quiet and default modes return the same exit status for the same inputs on bash 3.2 and bash 5.x, with no new dependency.

---

## 8. EDGE CASES

### Data Boundaries
- Empty input: `--quiet` alone, with neither `--loc` nor `--files`, keeps the existing required-input error on stderr and exits 1; stdout stays empty.
- Maximum length: `--quiet --loc 5000 --files 100 --auth --api --db --architectural` still prints one line; the level line does not grow with the inputs.

### Error Scenarios
- External service failure: not applicable — the script makes no network or service call.
- Network timeout: not applicable for the same reason.
- Unknown option: `--quiet --bogus` keeps the existing `Unknown option` error on stderr and exits 1.

### State Transitions
- Partial completion: not applicable — the script is stateless and writes no file.
- Session expiry: not applicable — there is no session.
- Repeated flag: `--quiet --quiet` is idempotent and still prints one line.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 5/25 | Files: 1, LOC: ~30, Systems: 1 |
| Risk | 3/25 | Auth: N, API: N, Breaking: N |
| Research | 2/20 | Read one 780-line script; no external investigation |
| Multi-Agent | 0/15 | Workstreams: 1 |
| Coordination | 2/15 | Dependencies: 0 |
| **Total** | **12/100** | **Declared Level 3 by packet policy; the scored change is Level 1 work** |

The score measures the code change, which is small and low-risk. The packet was scaffolded at Level 3, so this table records the gap between the packet level and the change rather than inflating the score to match.

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | A quiet caller pins the level label and a later edit renames it | M | L | AC-002 pins the label and AC-003 asserts byte equality |
| R-002 | The quiet branch suppresses the level line along with the report | H | L | AC-001 asserts one line and AC-003 asserts it equals the default line |
| R-003 | `--quiet --json` resolves silently one way or the other | M | L | AC-008 requires exit 1 with a stderr message naming both flags |

---

## 11. USER STORIES

### US-001: One parseable line for a build script (Priority: P0)

**As a** build script or agent that only needs the level, **I want** `--quiet` to print just the recommended-level line, **so that** I can read the answer without parsing a 17-line report or a JSON document.

**Acceptance criteria:** see `acceptance-criteria.md` (AC-001 through AC-006).

---

### US-002: The existing report stays intact (Priority: P1)

**As a** spec author running the script by hand, **I want** the default report to stay exactly as it is, **so that** the new flag costs me nothing and my existing reading habits keep working.

**Acceptance criteria:** see `acceptance-criteria.md` (AC-002 and AC-004).

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- None. Two ambiguities were settled during authoring: `--quiet --json` exits 1 rather than letting one flag win silently (REQ-008), and phase scoring still runs in quiet mode because quiet gates output, not computation (REQ-005).
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Decision Records**: See `decision-record.md`

---
