---
title: "Feature Specification: Add a quiet flag to recommend-level.sh"
description: "recommend-level.sh writes a multi-line report, so a caller that needs only the level must locate or strip one line out of sixteen. This packet adds a --quiet flag that prints that single line and leaves every existing output path byte-identical."
trigger_phrases:
  - "recommend level quiet flag"
  - "add a quiet flag to recommend level sh"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.3 -->
# Feature Specification: Add a quiet flag to recommend-level.sh

<!-- SPECKIT_LEVEL: 3 -->

## EXECUTIVE SUMMARY

`recommend-level.sh` prints a report, not a value. A simple invocation writes sixteen lines and a full-risk invocation writes seventeen, and the only field most callers want is the `Recommended Level:` line. This packet adds a `--quiet` flag that prints that one line and nothing else. A byte-comparison of the default output against a pre-change baseline, plus a line count of the quiet output, proves both halves of the contract.

**Key Decisions**: `--quiet` reuses the existing recommended-level line verbatim (ADR-001); `--quiet` takes precedence over `--json` (ADR-002)

**Critical Dependencies**: `bash` 3.2+ and the argument parser already inside `recommend-level.sh`; no new package

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-10-26 |
| **Branch** | none (scaffolded with --skip-branch) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

`recommend-level.sh` writes a report rather than a value. A caller that needs the recommended level has to find the `Recommended Level:` line inside sixteen or seventeen lines of breakdown and phase text, or strip everything else away with `sed` or `grep`. The `--json` mode removes the text parsing but replaces it with a JSON-parser dependency and a coupling to the whole object shape, which is more than one number requires.

### Purpose

Add a `--quiet` flag that prints exactly one line, `Recommended Level: <N> (<Name>)`, and leaves every existing output path byte-identical when the flag is absent.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add a `--quiet` arm to the argument parser, plus the `QUIET_OUTPUT` global that records it
- Add one output branch that prints only the recommended-level line and exits 0
- Document the flag in `show_help()` and in the file-header OPTIONS block
- Fix the flag's precedence against `--json` so the combination has one deterministic answer
- Prove the default output is byte-identical by diffing it against a captured baseline

### Out of Scope
- A `-q` short alias - not requested, and an alias widens the option surface without a caller asking for it
- Changing the `--json` object shape - `.skilled/commands/speckit/assets/speckit-plan.yaml` reads it
- Suppressing or shortening the `--json` output - JSON is already a single machine-readable document
- Rewriting the scoring or phase logic - the flag changes presentation only, not computation

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh | Modify | Add the `--quiet` option, one output branch, and the help and OPTIONS text |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `--quiet` is accepted and prints exactly one line, `Recommended Level: <N> (<Name>)`, then exits 0 |
| REQ-002 | Without `--quiet`, stdout is byte-identical to the pre-change output for the same arguments |
| REQ-003 | `--quiet` changes no computed value: the level it prints equals the level in the full report for the same arguments |
| REQ-004 | `--quiet` leaves stderr and the exit-code contract unchanged, including the unknown-option and missing-value errors |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | `--quiet` takes precedence over `--json`, and `--json` alone keeps its current output |
| REQ-006 | `show_help()` lists `--quiet` in its OPTIONS block with a one-line description |
| REQ-007 | The file-header OPTIONS block lists `--quiet` beside the other flags |
| REQ-008 | `--quiet` is position-independent: it works before, between and after the other options |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `--quiet --loc 50 --files 2` writes one newline-terminated line to stdout and exits 0
- **SC-002**: The simple and full-risk invocations both match their captured pre-change baselines byte for byte
- **SC-003**: The line `--quiet` prints is character-identical to the recommended-level line in the matching full report
- **SC-004**: `--json` output is unchanged, and `--json --quiet` prints the single recommended-level line

### Acceptance Scenarios

- **Given** the arguments `--loc 50 --files 2`, **When** the script runs without `--quiet`, **Then** stdout is the sixteen-line report whose second line reads `Recommended Level: 0 (Quick)`
- **Given** the arguments `--loc 50 --files 2` and the flag `--quiet`, **When** the script runs, **Then** stdout holds exactly one line and `wc -l` prints 1
- **Given** `--loc 500 --files 15 --auth --api --db --architectural` and `--quiet`, **When** the script runs, **Then** the printed line reads `Recommended Level: 3 (Full)` and matches the full report's level line
- **Given** `--quiet` together with `--json`, **When** the script runs, **Then** the output is the single recommended-level line, not a JSON object
- **Given** `--quiet` with neither `--loc` nor `--files`, **When** the script runs, **Then** stderr carries `ERROR: At least --loc or --files must be provided`, stdout is empty, and the exit code is 1
- **Given** `--quiet` placed before `--loc` rather than after it, **When** the script runs, **Then** the output is identical to placing it last
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `bash` 3.2+ and the existing parser in `recommend-level.sh` | The flag cannot ship without either, and both are already in place | No new dependency; the new arm copies the shape of the `--json` arm |
| Dependency | `.skilled/commands/speckit/assets/speckit-plan.yaml`, which invokes `--json` | If the `--json` output moved, phase decomposition would misread it | REQ-005 keeps `--json` untouched, and a verification task diffs it |
| Risk | A caller parses the full report and silently depends on its line order | A new output branch could shift a line | REQ-002 pins byte-identity against a captured baseline |
| Risk | A caller passes `--quiet` and `--json` together by accident | Two plausible outputs, so behaviour would be unpredictable | ADR-002 fixes precedence and a scenario asserts it |
<!-- /ANCHOR:risks -->

---

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: `--quiet` adds no measurable runtime: quiet does strictly less I/O than the full report, and both finish well under 100 ms for any accepted input

### Security
- **NFR-S01**: The flag reads no credential, writes no file and adds no network call; the existing numeric and required-input validation still runs before the output branch

### Reliability
- **NFR-R01**: The output contract is deterministic: the same arguments produce the same bytes on every run, and the branch uses no feature newer than bash 3.2

---

## 8. EDGE CASES

### Data Boundaries
- Empty input: neither `--loc` nor `--files` given, so stderr holds `ERROR: At least --loc or --files must be provided`, stdout is empty and the exit code is 1
- Maximum length: `--loc 100000 --files 100000` caps both scores at their weights, so `--quiet` still prints one line and exits 0

### Error Scenarios
- Unknown option: `--quiet=1` is not the flag, so it reaches the catch-all arm and prints `ERROR: Unknown option: --quiet=1` on stderr with exit 1
- Missing value: `--loc --quiet` prints `ERROR: --loc requires a numeric value` with exit 1, because the parser rejects a following token that starts with `--`

### State Transitions
- Not applicable: the script keeps no state between runs, so every invocation recomputes its scores from its arguments and no partial state can survive a failure

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 4/25 | Files: 1, LOC: ~25, Systems: 1 |
| Risk | 12/25 | Auth: N, API: N, Breaking: N; stdout is a shared contract with one known consumer |
| Research | 6/20 | Call-site inventory plus captured baselines for three invocation shapes |
| Multi-Agent | 0/15 | Workstreams: 1 |
| Coordination | 6/15 | Dependencies: 1 (`speckit-plan.yaml` reads `--json`) |
| **Total** | **28/100** | **Level 3** by operator directive; the dimension score maps to Level 1 |

The dimensions score 28 of 100, which the matrix maps to Level 1. The packet is Level 3 because the operator created it at that level. `recommend-level.sh` decides the documentation level for every other packet, so a change to its output contract is reviewed as shared policy rather than as a local script edit.

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | A caller's line-order parser breaks when a new output branch appears | M | L | REQ-002 pins byte-identity and the baseline diff runs in Phase 3 |
| R-002 | `--quiet` and `--json` disagree about precedence | M | M | ADR-002 fixes the order and a scenario asserts it |
| R-003 | The help text and the header OPTIONS block drift apart | L | M | Both are edited in one task, and one grep shows both lines |

---

## 11. USER STORIES

### US-001: One parseable line for a build script (Priority: P0)

**As a** build or CI script that shells out to `recommend-level.sh`, **I want** a single-line output mode, **so that** I can read the level into a shell variable instead of counting report lines.

**Acceptance criteria:** AC-001, AC-003 and AC-008 in `acceptance-criteria.md`.

---

### US-002: Machine-readable output without a JSON parser (Priority: P0)

**As an** orchestrating agent, **I want** the level as one plain line, **so that** I can capture it with command substitution without depending on `jq` or on the JSON object shape.

**Acceptance criteria:** AC-001 and AC-005 in `acceptance-criteria.md`.

---

### US-003: Unchanged full report for interactive use (Priority: P1)

**As a** developer running the helper by hand, **I want** the existing report to stay exactly as it is when I omit `--quiet`, **so that** the notes and habits I have built around its layout stay valid.

**Acceptance criteria:** AC-002 in `acceptance-criteria.md`.

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- None. The two design choices, reusing the existing line verbatim and putting `--quiet` ahead of `--json`, are recorded as ADR-001 and ADR-002 in `plan.md`.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Decision Records**: See `decision-record.md` (ADR-001 and ADR-002 currently live in `plan.md`)

---
