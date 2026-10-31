---
title: "Feature Specification: Add a quiet flag to recommend-level.sh"
description: "recommend-level.sh prints a multi-section report, so a caller that only needs the level has to filter it. Add a --quiet flag that prints the single Recommended Level line and leaves every existing output path unchanged."
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

`recommend-level.sh` scores a task and prints a report: a level line, the score and confidence, a factor breakdown, and a phase recommendation. An agent or shell pipeline that only needs the level has to grep that report. `--quiet` adds one output mode that prints exactly the existing level line and nothing else; without the flag the script behaves as it does today.

**Key Decisions**: `--quiet` reuses the `Recommended Level: N (Name)` line verbatim; `--quiet` outranks `--json` when both are passed; no `-q` alias in this packet.

**Critical Dependencies**: Bash 3.2 compatibility, because the script runs on macOS's default shell. No new runtime dependency.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-10-26 |
| **Branch** | detached HEAD (7433813f54) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The default text output is a report of 16 to 17 lines: a leading blank line, `Recommended Level: N (Name)`, `Score: X/100 | Confidence: Y%`, a six-row factor breakdown, and a phase recommendation section. A caller that needs the level — an agent choosing between a Level 1 and a Level 3 packet, or a shell pipeline — must grep or parse the line out of that report. `--json` is not a substitute because it emits a multi-field object that needs a JSON parser. The flag does not exist today: `recommend-level.sh --loc 50 --files 2 --quiet` prints `ERROR: Unknown option: --quiet` and exits 1.

### Purpose
Add one flag that prints the final recommended-level line and nothing else, without changing any existing output path.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Accept `--quiet` in the argument parser and record it in a quiet-mode global.
- Print the same `Recommended Level: N (Name)` line that `output_text` prints, plus a trailing newline, when quiet mode is on.
- Give quiet mode precedence over `--json` when both flags are passed.
- Document the flag in the script's header comment and in `show_help()`.
- Cover the new mode with a bash test harness beside the existing `test-upgrade-level.sh`.

### Out of Scope
- A `-q` short alias - not requested by this feature, and it widens the surface without a caller. Recorded as ADR-003.
- Changing the wording, spacing or fields of the level line - callers already grep it.
- Suppressing stderr diagnostics - errors stay visible and keep exit 1.
- Changes to scoring, thresholds, phase logic or JSON fields.
- Fixing the stale positional-argument examples in `execution-methods.md` - a separate defect for a separate packet.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh` | Modify | Add `QUIET_MODE`, the `--quiet` case branch, `output_quiet()`, dispatch precedence, and help text in both help surfaces |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/test-recommend-level.sh` | Create | Bash harness pinning the quiet contract and the unchanged default path |
| `.skilled/skills/system-spec-kit/references/workflows/execution-methods.md` | Modify | Add `--quiet` to the recommend-level flag table |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `--quiet` is accepted and turns quiet mode on: no unknown-option error, exit 0 on valid inputs. |
| REQ-002 | With `--quiet`, stdout is exactly one line, `Recommended Level: N (Name)` plus a trailing newline: no leading blank line, no score, no breakdown, no phase section. |
| REQ-003 | Without `--quiet`, stdout is byte-identical to the pre-change output for the same arguments. |
| REQ-004 | `--quiet` outranks `--json`; `--quiet --json` prints the same single line and no JSON document. |
| REQ-005 | Both help surfaces list `--quiet` with a one-line description. |
| REQ-006 | Errors keep going to stderr with exit 1 under `--quiet`; quiet mode never swallows a diagnostic. |
| REQ-007 | `--help` and `-h` still print the full help text and exit 0, with or without `--quiet`. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-008 | The level number and name printed under `--quiet` match the non-quiet run for the same inputs, including the Level 0 and Level 3 boundaries. |
| REQ-009 | A bash test harness covers quiet output, default-output regression, precedence, help and error paths. |
| REQ-010 | `execution-methods.md` names the flag in its recommend-level flag table. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `recommend-level.sh --loc 200 --files 5 --api --quiet` prints exactly `Recommended Level: 1 (Baseline)` and exits 0.
- **SC-002**: The default-output capture for a fixed argument set is unchanged byte for byte against the pre-change capture.
- **SC-003**: `recommend-level.sh --loc 200 --files 5 --api --quiet --json` prints the same single line and contains no `{`.
- **SC-004**: `recommend-level.sh --quiet --bogus` exits 1 and writes `ERROR: Unknown option: --bogus` to stderr, with empty stdout.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Bash 3.2 or newer | The script must keep running on macOS's default shell | Avoid bash-4-only syntax; run the harness under `/bin/bash` |
| Risk | Precedence between `--quiet` and `--json` is unstated | Med | ADR-002 fixes precedence; a test pins the combination |
| Risk | A leading blank line leaks into quiet output | Med | `output_quiet()` uses a single `printf '%s\n'`; the test compares exact content and line count |
| Risk | Help text drifts between the header comment and `show_help()` | Low | One task edits both; the test asserts both list the flag |
<!-- /ANCHOR:risks -->

---


## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Quiet mode adds no measurable work: one `printf` replaces roughly a dozen `echo` calls, so wall time stays at or below the current run for the same inputs.

### Security
- **NFR-S01**: No new input surface. The mode prints only values the script already computed and already prints in its report.

### Reliability
- **NFR-R01**: Quiet output is deterministic for fixed inputs and independent of the phase-scoring flags.

---

## 8. EDGE CASES

### Data Boundaries
- Neither `--loc` nor `--files`: the existing validation error wins; quiet mode writes nothing to stdout and exits 1.
- Level 0 and Level 3: the same line format, with the level name from `determine_level`.
- Repeated `--quiet`: idempotent; one line.

### Error Scenarios
- `--quiet --json`: one line, no JSON document.
- `--quiet --help`: full help text, exit 0.
- `--quiet --no-recommend-phases`: one line; the phase section is already suppressed.
- Unknown option with `--quiet`: stderr diagnostic and exit 1, unchanged.
- Closed stdout, such as `| head -0`: existing shell behaviour, no new handling.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 8/25 | Files: 3, LOC: ~35, Systems: 1 |
| Risk | 4/25 | Auth: N, API: N, Breaking: N (output contract only) |
| Research | 2/20 | Script read end to end; no open unknowns |
| Multi-Agent | 2/15 | Workstreams: 1 |
| Coordination | 2/15 | Dependencies: 0 |
| **Total** | **18/100** | **Level 3 declared** |

The scoring algorithm maps 18/100 to Level 0. This packet is Level 3 because `create.sh --level 3` was specified for the authoring task, not because the change is architecturally complex. Scope stays one script, one test file and one documentation row.

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Two callers read quiet/JSON precedence differently | M | L | ADR-002 fixes the rule; AC-005 pins it |
| R-002 | The default report drifts while the new path is added | M | L | Pre-change captures in `scratch/baseline/` and a byte diff in AC-003 and AC-004 |
| R-003 | Only one help surface learns about the flag | L | M | One task edits both; AC-006 asserts both |
| R-004 | Quiet mode suppresses a diagnostic by mistake | L | L | AC-007 asserts empty stdout and the error text on stderr |

---

## 11. USER STORIES

### US-001: One-line level for an agent (Priority: P0)

**As an** agent deciding whether a task needs a Level 1 or a Level 3 packet, **I want** the recommender to print only the level line, **so that** I can read the value without grepping a report.

**Acceptance criteria:** see `acceptance-criteria.md` (AC-001, AC-002, AC-009).

---

### US-002: Existing readers see no change (Priority: P0)

**As a** maintainer of anything that reads the current report, **I want** the default text and JSON output to stay byte-identical, **so that** the new flag costs no downstream edit.

**Acceptance criteria:** see `acceptance-criteria.md` (AC-003, AC-004).

---

### US-003: Predictable combined flags (Priority: P1)

**As a** script author, **I want** a stated rule for `--quiet --json`, **so that** passing both does not depend on flag order or guesswork.

**Acceptance criteria:** see `acceptance-criteria.md` (AC-005).

---

### US-004: Discoverable flag (Priority: P1)

**As a** future contributor, **I want** `--quiet` in the script's help and in the workflow reference, **so that** I can find it without reading the case block.

**Acceptance criteria:** see `acceptance-criteria.md` (AC-006, AC-011).

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- None. ADR-001 through ADR-003 in `plan.md` record the three decisions this feature needed.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Acceptance Criteria**: See `acceptance-criteria.md`

---
