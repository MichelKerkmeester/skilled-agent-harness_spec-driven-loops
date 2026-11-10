---
title: "Feature Specification: Add a quiet flag to recommend-level.sh"
description: "Callers of recommend-level.sh must read a 16 to 17 line report to recover one number. A --quiet flag prints only the Recommended Level line and leaves the default report byte-identical."
trigger_phrases:
  - "recommend level quiet flag"
  - "add a quiet flag to recommend level sh"
  - "recommend-level.sh quiet output"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.3 -->
# Feature Specification: Add a quiet flag to recommend-level.sh

<!-- SPECKIT_LEVEL: 3 -->


---

## EXECUTIVE SUMMARY

`recommend-level.sh` answers one question — which documentation level a task needs — but prints a 16 to 17 line report to do it, so a caller that needs only the number must locate and parse the `Recommended Level:` line out of a score, a confidence figure and a phase recommendation. The change adds a `--quiet` flag that prints that one line and nothing else, while the default invocation keeps its current output byte for byte. A line count on both invocations proves it: `--quiet` prints 1 line, and the default prints the same 16 or 17 lines it prints today.

**Key Decisions**: `--quiet` is an additive text-output switch rather than a new output mode (ADR-001); `--json` wins when both `--quiet` and `--json` are passed, because a caller that asked for JSON has already named a machine format.

**Critical Dependencies**: the existing argument parser, `output_text()` and `show_help()` in `recommend-level.sh`. No new package, binary or service.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-10-26 |
| **Branch** | None - packet authored in place with `--skip-branch` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`recommend-level.sh` emits a human report: a blank line, the recommended level, a score and confidence line, a six-row point breakdown, and a phase recommendation block. Any caller that only needs the level — a script choosing a template set, a hook deciding whether a packet is required, a person scanning several tasks — must find and parse one line inside that report, and that parse breaks if a label or a row moves. The report also grows: a simple task prints 16 lines and a complex one prints 17, so a caller that assumed a fixed line count is already wrong.

### Purpose
Give callers a one-line, parseable answer without changing what an interactive reader sees.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add `--quiet` to the option parser in `recommend-level.sh`.
- Print exactly `Recommended Level: <N> (<Name>)` when `--quiet` is set.
- Keep the default text report and the `--json` document unchanged.
- Document the flag in the script's usage header comment and in `show_help()`.

### Out of Scope
- Changing the scoring algorithm, thresholds or level names - the flag selects output, it does not compute a different answer.
- Suppressing stderr diagnostics or changing exit codes - callers already branch on both, and a quiet success must stay distinguishable from a quiet failure.
- Adding a matching flag to `create.sh`, `validate.sh` or `archive.sh` - each script owns its own flag surface, and this packet does not audit the others.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh` | Modify | Add `--quiet` to the parser, add the quiet output branch, extend the usage header and `show_help()` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `--quiet` is accepted in any argument position and exits 0 when `--loc` or `--files` supplies a valid number. |
| REQ-002 | With `--quiet`, stdout is exactly one line: `Recommended Level: <N> (<Name>)`, where `<N>` is 0-3 and `<Name>` is the matching label. |
| REQ-003 | Without `--quiet`, stdout is byte-identical to the pre-change output for the same inputs. |
| REQ-004 | The level number and level name printed under `--quiet` match the values the default report prints for the same inputs. |
| REQ-005 | `--quiet` changes neither the exit code nor stderr for any input the script accepts today. |
| REQ-011 | With `--quiet`, any warning the script writes to stderr is still written to stderr, so `--quiet` trims stdout only. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-006 | `show_help()` lists `--quiet` with a one-line description beside the other options. |
| REQ-007 | When `--quiet` and `--json` are both passed, the JSON document is printed and `--quiet` has no effect. |
| REQ-008 | `--quiet` composes with `--no-recommend-phases`, `--phase-threshold` and every risk flag without changing the level line. |

### P2 - Optional (can defer with documented reason)

| ID | Requirement |
|----|-------------|
| REQ-009 | The script's usage header comment documents `--quiet` beside the other options. |
| REQ-010 | `bash -n` reports no syntax error, and the change introduces no new dependency. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `recommend-level.sh --quiet --loc 500 --files 15 --auth --api --db --architectural` prints one line and exits 0.
- **SC-002**: The same invocation without `--quiet` still prints its current 17 lines, unchanged.
- **SC-003**: `recommend-level.sh --quiet --loc 50 --files 2` prints `Recommended Level: 0 (Quick)`.
- **SC-004**: `recommend-level.sh --quiet --loc 200 --files 5 --api` prints `Recommended Level: 1 (Baseline)`.

**Given** a caller passes `--quiet` with `--loc 500 --files 15 --auth --api --db --architectural`, **When** the script runs, **Then** stdout is the single line `Recommended Level: 3 (Full)` and the exit code is 0.

**Given** the same inputs without `--quiet`, **When** the script runs, **Then** stdout is the 17-line report the script prints today, byte for byte.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `output_text()` in `recommend-level.sh` | The quiet branch has no level line to reuse if that function changes shape | Build the line from `RECOMMENDED_LEVEL` and `LEVEL_NAME`, the same two variables the report reads |
| Risk | A caller parses the quiet line and breaks when the label moves | Silent wrong level in downstream tooling | Keep the label `Recommended Level:` unchanged and pin it with a line-count and text assertion |
| Risk | `--quiet` and `--json` both passed, and the caller gets the format it did not expect | Confusing output for a mixed flag set | Define JSON as the winner in `spec.md`, `plan.md` and the acceptance criteria, and test the combination |
<!-- /ANCHOR:risks -->

---


## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The flag adds no measurable time: both modes complete in the same run, because the scoring path is untouched and the quiet branch skips only the `echo` calls the report would make.

### Security
- **N/A**: the script reads no credential, writes no file and opens no network connection; `--quiet` changes only which lines reach stdout.

### Reliability
- **NFR-R01**: The quiet line is derived from the same `RECOMMENDED_LEVEL` and `LEVEL_NAME` variables the report prints, so the two modes cannot disagree about the level.

---

## 8. EDGE CASES

### Data Boundaries
- Empty input: the existing guard still fires first, printing `ERROR: At least --loc or --files must be provided` to stderr and exiting 1, with no quiet line on stdout.
- Maximum length: `--loc` and `--files` keep their current integer validation; a non-numeric value exits 1 on stderr before any output branch is reached.

### Error Scenarios
- Unknown option: an unrecognised flag still prints `ERROR: Unknown option:` to stderr and exits 1, so a mistyped `--quie` fails loudly instead of silently printing the full report.
- Both `--quiet` and `--json`: the JSON document is printed, matching REQ-007.

### State Transitions
- Partial completion: not applicable - the script is a single pass with no persisted state.
- Session expiry: not applicable - there is no session and no cached result.

### Acceptance Scenarios

**Given** `--quiet` and a valid `--loc` or `--files`, **When** the script runs, **Then** stdout holds exactly one line and the exit code is 0.

**Given** no `--quiet`, **When** the script runs, **Then** stdout is byte-identical to the pre-change output for that input.

**Given** `--quiet` and `--json` together, **When** the script runs, **Then** stdout is the JSON document and the quiet line is not printed.

**Given** `--quiet` with `--no-recommend-phases`, **When** the script runs, **Then** the single line is unchanged, because phase scoring never reaches the level line.

**Given** `--quiet` with no `--loc` and no `--files`, **When** the script runs, **Then** the usage error goes to stderr, stdout stays empty and the exit code is 1.

**Given** `--quiet` placed before `--loc`, **When** the script runs, **Then** the flag is parsed and the one line is still printed.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 6/25 | Files: 1, LOC: ~25, Systems: 1 script |
| Risk | 10/25 | Auth: N, API: N, Breaking: N - the default output must stay byte-identical |
| Research | 6/20 | Read the whole 780-line script to find every output path and the help text |
| Multi-Agent | 0/15 | Workstreams: 1 |
| Coordination | 4/15 | Dependencies: 1 - the shared parser and `output_text()` |
| **Total** | **26/100** | **Level 3** |

The score reads 26/100, which maps to Level 1. The packet keeps Level 3 because the authoring request fixed the level before the score was computed; the row records that pin rather than re-scoring the work to fit it.

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | The default report changes while the quiet branch is added | H | L | Diff the default output before and after; the acceptance criteria require a byte-identical report |
| R-002 | A caller parses the quiet line by position and breaks when the label is reworded | M | L | Keep the `Recommended Level:` label and pin it in AC-002 |
| R-003 | `--quiet` is accepted but ignored in the `--json` path, surprising a caller who wanted text | L | M | Document the precedence in `show_help()` and test the combination in AC-007 |

---

## 11. USER STORIES

### US-001: One parseable line for a script (Priority: P0)

**As a** build script that chooses a documentation level, **I want** `--quiet` to print only the level line, **so that** I can read one value instead of parsing a report.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-002: The interactive report stays whole (Priority: P0)

**As a** developer running the script by hand, **I want** the default report unchanged, **so that** the score, the breakdown and the phase advice are still there when I want them.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-003: Stable label for a CI check (Priority: P1)

**As a** CI check that asserts a level, **I want** the quiet line to keep the same label and exit code, **so that** the assertion does not break on unrelated script edits.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-004: A predictable answer for mixed flags (Priority: P1)

**As a** tooling integrator, **I want** a documented winner when `--quiet` and `--json` are both passed, **so that** the output format is a contract rather than a coin flip.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- Should `--quiet` also suppress the blank leading line? **RESOLVED: Yes - the quiet branch prints one line and no leading blank, so `wc -l` reads 1.**
- Should `--quiet` beat `--json` when both are passed? **RESOLVED: No - JSON wins, because the caller already named a machine format.**
- Should the packet carry Level 3 when the complexity score reads 26/100? **RESOLVED: Yes - the authoring request fixed Level 3; section 9 records the pin instead of inflating the score.**
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Decision Records**: See `decision-record.md`

---
