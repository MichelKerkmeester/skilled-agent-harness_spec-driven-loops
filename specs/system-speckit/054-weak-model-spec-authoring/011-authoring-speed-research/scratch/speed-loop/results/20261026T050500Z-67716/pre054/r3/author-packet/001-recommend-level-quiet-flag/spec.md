---
title: "Feature Specification: Add a quiet flag to recommend-level.sh"
description: "recommend-level.sh prints a 16-line human report even when the caller only wants the level number. A --quiet flag reduces stdout to the single Recommended Level line, leaving the default report byte-for-byte unchanged."
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

`recommend-level.sh` is the deterministic level picker for the spec-folder workflow, and it always prints a 16-line human report on stdout. A caller that only needs the answer has to parse line two, and a caller that captures stdout gets the breakdown and the phase block along with it. A `--quiet` flag reduces that to the one `Recommended Level:` line, with the default report left byte-for-byte unchanged so nothing that already parses it breaks.

**Key Decisions**: quiet is a text-output mode rather than a global log level; `--json` outranks `--quiet`; both text modes print the level line through one shared formatter.

**Critical Dependencies**: none beyond bash and the existing CLI test harness.

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

`output_text()` in `recommend-level.sh` emits a blank line, the level line, the score line, a six-line breakdown and an optional six-line phase block. Every caller that wants the number either greps the second line or re-implements the score-to-level mapping. A hook, a script or an agent that captures the whole report pays for detail it discards, and the phase block makes the output longer again when phasing is enabled by default.

### Purpose

One opt-in flag that reduces stdout to the single level line, so a caller reads the answer directly instead of extracting it.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- `--quiet` (and its `-q` alias) in `recommend-level.sh`
- A quiet output path that prints exactly one line
- The `--help` OPTIONS entry and the header comment block
- Tests for the quiet contract and for default-output stability

### Out of Scope

- JSON payload changes - `--json` already emits one structured document with nothing to suppress
- Scoring weights, level thresholds and phase logic - untouched by this flag
- Other spec CLI scripts (`create.sh`, `validate.sh`, `archive.sh`) - each would need its own contract
- A verbosity ladder (`-v`, `--verbose`, `--debug`) - a second axis this packet does not need

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh` | Modify | Add the flag, the shared level-line formatter and the quiet output path |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/test-phase-validation.js` | Modify | Add quiet-contract and default-output regression assertions |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The argument parser accepts `--quiet` and `-q`, and neither consumes a following token. |
| REQ-002 | With `--quiet`, stdout is exactly one line, `Recommended Level: <N> (<Name>)`, with no leading blank line and no trailing blank line. |
| REQ-003 | Without `--quiet`, stdout is byte-identical to the current output for every input in the regression set. |
| REQ-004 | `--quiet` changes neither the exit code nor the stderr diagnostics. Invalid input still exits 1 with its message on stderr and nothing on stdout. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | `--json` outranks `--quiet`. The JSON payload is byte-identical whether or not `--quiet` is passed. |
| REQ-006 | The `--help` OPTIONS block lists `--quiet, -q` with a one-line description. |
| REQ-007 | The CLI test suite asserts the quiet line count, the quiet line content, JSON precedence, the error path, and default-output byte stability. |

### P2 - Optional (defer with documented reason)

| ID | Requirement |
|----|-------------|
| REQ-008 | The header comment block's OPTIONS and EXAMPLES sections mention the flag. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `recommend-level.sh --loc 50 --files 2 --quiet | wc -l` prints `1`.
- **SC-002**: A diff of default text output against the pre-change baseline is empty across the fixture matrix.
- **SC-003**: A diff of `--json` output against the pre-change baseline is empty across the fixture matrix.
- **SC-004**: `recommend-level.sh --quiet` with no `--loc` and no `--files` exits 1 and writes nothing to stdout.
- **SC-005**: Both CLI test scripts pass, with the new assertions counted in the pass total.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Bash 3.2+ (the macOS system shell) | The script cannot use bash 4 features | Stick to `[[ ]]`, `printf` and plain functions |
| Dependency | `node` and `git` for the CLI test harness | Tests cannot run without them | Both are already required by the existing suite |
| Risk | Default output drifts while adding the shared formatter | High, because every existing caller parses it | Byte-diff assertion against a captured baseline |
| Risk | `-q` is claimed by a later option | Low, but the alias is public once shipped | Document `--quiet` as canonical and treat `-q` as an alias |
<!-- /ANCHOR:risks -->

---


## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance

- **NFR-P01**: No measurable change to default-mode runtime. Quiet mode does less work, since it skips the breakdown and phase block.

### Security

- **NFR-S01**: `--quiet` takes no value, so it adds no input surface and no new path through the argument parser.

### Reliability

- **NFR-R01**: Exit codes stay at 0 for success and 1 for validation errors, with or without the flag.
- **NFR-R02**: Repeating the flag (`--quiet --quiet`) is idempotent.

---

## 8. EDGE CASES

### Data Boundaries

- Empty input: no `--loc` and no `--files` prints the error to stderr, exits 1, and writes no level line.
- Repeated flag: `--quiet --quiet` still prints one line.
- Piped capture: the line ends with a single newline, so `$(...)` yields the text with no trailing blank line to strip.
- Zero values: `--loc 0 --files 2` is valid input and prints `Recommended Level: 0 (Quick)` in quiet mode.

### Error Scenarios

- Invalid number with `--quiet`: `--loc abc` exits 1 with `ERROR: --loc must be a positive integer` on stderr and an empty stdout.
- Typo'd flag: `--quie` exits 1 with the unknown-option error. The parser matches whole tokens, so a prefix never selects a mode.
- `--quiet --help`: help wins and exits 0, matching how `--help` already short-circuits.
- `--quiet --json`: the JSON payload is emitted unchanged. The flag is a no-op there, by decision rather than by accident.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 8/25 | Files: 2, LOC: ~35, Systems: 1 |
| Risk | 4/25 | Auth: N, API: N, Breaking: N |
| Research | 4/20 | One script read end to end, one test file |
| Multi-Agent | 3/15 | Workstreams: 1 |
| Coordination | 3/15 | Dependencies: 0 |
| **Total** | **22/100** | **Level 3** |

The declared level comes from the authoring brief, not from this score. The edit itself lands in Level 0 territory; what fills the packet is the verification burden, since the default output is a public surface that existing callers parse.

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Default text output changes while the level line is refactored | H | L | Byte-diff against a baseline captured before the edit |
| R-002 | A consumer parses a fixed line number and the blank line shifts | M | L | The quiet path is opt-in; the default path keeps its leading blank line |
| R-003 | The quiet formatter and the report formatter drift apart | M | M | One `format_level_line()` function serves both, and a grep asserts a single producer |
| R-004 | The `-q` alias collides with a future option | L | L | `--quiet` is documented as canonical; the alias is a convenience |

---

## 11. USER STORIES

### US-001: Read the level without parsing a report (Priority: P0)

**As a** script or hook that needs the recommended level, **I want** one line on stdout, **so that** I can read the answer without extracting it from a breakdown.

**Acceptance criteria:** see `acceptance-criteria.md` (AC-001, AC-002, AC-007).

---

### US-002: Keep existing callers working (Priority: P0)

**As a** maintainer of anything that already reads the full report, **I want** the default output unchanged, **so that** adding the flag costs nobody a migration.

**Acceptance criteria:** see `acceptance-criteria.md` (AC-003).

---

### US-003: Keep a tool result small (Priority: P1)

**As an** agent running the script inside a tool call, **I want** the quiet form to stay one line, **so that** the result does not crowd out the work it informs.

**Acceptance criteria:** see `acceptance-criteria.md` (AC-005, AC-006).

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- Should `--quiet` also trim the JSON payload? Resolved: no. `--json` already emits one structured document, so a third payload shape would be a second schema to keep in step (ADR-001 in `plan.md`).
- Should quiet mode keep the score line alongside the level line? Resolved: no. One line, because the point of the flag is a stable single-line answer (ADR-002 in `plan.md`).
- Does the short alias earn its place? Resolved: yes, `-q`, matching the existing `-j` and `-h` precedent (ADR-003 in `plan.md`).
- Remaining questions: none.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Decision Records**: See the ADR section of `plan.md`. `decision-record.md` is an on-demand document and this packet does not add one.

---

