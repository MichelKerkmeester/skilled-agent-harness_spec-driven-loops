---
title: "Feature Specification: Add a quiet flag to recommend-level.sh"
description: "recommend-level.sh only prints a full human report or a full JSON object, so a caller that needs just the level has to parse prose. A --quiet flag makes the script print only its final recommended-level line, leaving the default output untouched."
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

`recommend-level.sh` is the deterministic level scorer behind `/speckit:plan` and `/speckit:complete`. Today every successful run prints a blank line, the recommended level, the score, a confidence figure, a six-row breakdown and an optional phase recommendation. A caller that only wants the level must parse that report. This packet adds an opt-in `--quiet` flag that prints the single recommended-level line and nothing else, while leaving both existing output modes byte-for-byte unchanged.

**Key Decisions**: `--quiet` prints exactly one line and takes precedence over the full report; `--json --quiet` narrows the JSON object to the two recommended-level fields on one line; the flag is opt-in so no existing caller changes behaviour.

**Critical Dependencies**: None outside the script itself. The scoring pipeline and every caller of `--json` stay untouched.

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
`recommend-level.sh` has two output modes, both of them reports. Text mode prints a blank line, a score line, a confidence figure, a six-row breakdown and an optional phase section; JSON mode prints the whole object including inputs, breakdown details and thresholds. A caller that needs only the level — a shell conditional, a dispatch step, a quick manual check — must either parse prose or pipe the full JSON through a second tool. The cost is small per call and repeated often, because the script is the scoring entry point for every plan and completion workflow.

### Purpose
Give the script a single-line, machine-friendly answer that callers can capture with `$(...)`, without changing what any existing caller sees.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Accept `--quiet` and its short alias `-q` in the argument parser of `.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh`
- Print exactly one line in quiet mode: `Recommended Level: <N> (<Name>)`
- Print one line of reduced JSON when `--quiet` and `--json` are combined
- Document the flag in the file header comment and in `show_help()`
- Add a regression test script covering the new flag and the unchanged default output

### Out of Scope
- Changing the scoring algorithm, thresholds or confidence calculation - the flag changes presentation only
- Changing the default text or JSON output - existing readers must keep working byte for byte
- Adding a `--format` selector or any other new output mode - one flag is the whole request
- Rewriting the `--help` output layout - only one OPTIONS row and one example are added

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh` | Modify | Parse `--quiet`/`-q`, add the quiet output path, extend the header comment and `show_help()` |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/test-recommend-level-quiet.sh` | Create | Regression coverage for the quiet line, the reduced JSON form, error passthrough and unchanged default output |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The argument parser accepts `--quiet` and `-q`, in any position relative to the other flags, and sets a quiet-mode global |
| REQ-002 | In quiet text mode, stdout contains exactly one line matching `Recommended Level: <N> (<Name>)`, with no leading blank line and no other stdout text |
| REQ-003 | Without `--quiet`, text output is byte-identical to the output before the change for the same inputs |
| REQ-004 | `--json` without `--quiet` is byte-identical to the output before the change for the same inputs |
| REQ-005 | `--json --quiet` prints one line of valid JSON containing `recommended_level` and `level_name` and no other fields |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-006 | `show_help()` and the file header comment document `--quiet` alongside the existing options |
| REQ-007 | Input-validation errors still write to stderr and exit 1 in quiet mode; quiet mode never swallows an error or emits a level line for an invalid run |
| REQ-008 | Exit codes are unchanged: 0 on success in every output mode, 1 on input errors, and `--quiet` does not alter either |
| REQ-009 | With `--quiet`, any warning the script writes to stderr is still written to stderr, so `--quiet` trims stdout only |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A caller can capture the level with `LEVEL=$(recommend-level.sh --loc 500 --files 12 --quiet)` and receive a single line with no trimming.
- **SC-002**: A byte-for-byte diff of default text output and of default `--json` output shows zero differences against captures taken before the change.
- **SC-003**: `recommend-level.sh --loc 500 --files 12 --json --quiet | jq -r .recommended_level` prints the same level the full JSON object reports.
- **SC-004**: `--help` lists the flag, so an operator who never reads this packet can still find it.

### Acceptance Scenarios

1. **Given** valid inputs and no `--quiet`, **When** the script runs, **Then** stdout is the full report exactly as it is today.
2. **Given** valid inputs and `--quiet`, **When** the script runs, **Then** stdout is one line and that line equals the recommended-level line of the full report.
3. **Given** valid inputs, `--quiet` and `--json`, **When** the script runs, **Then** stdout is one line of JSON with only `recommended_level` and `level_name`.
4. **Given** an invalid `--loc` value and `--quiet`, **When** the script runs, **Then** stdout is empty, stderr carries the error, and the exit code is 1.
5. **Given** `--quiet` and `--help` together, **When** the script runs, **Then** the help text prints and the exit code is 0.
6. **Given** the same inputs run with and without `--quiet`, **When** both finish, **Then** the level and its name are identical.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Bash 3.2+ (macOS default) | A construct that needs bash 4 would break the script on the default macOS shell | Keep the implementation to `printf` and `if`, the same primitives the script already uses |
| Dependency | `.skilled/commands/speckit/assets/speckit-plan.yaml`, `speckit-complete.yaml` | They invoke the script with `--json --recommend-phases` and would break if the default JSON changed | Do not touch the default JSON path; the reduced object exists only under `--quiet` |
| Risk | A caller starts relying on quiet output for a shape it does not guarantee | A later change breaks that caller silently | Document the single-line contract in `--help` and pin it with a test |
| Risk | The quiet line drifts from the text report line | Two spellings of the same answer | Build both from one shared line helper and assert equality in the test |
<!-- /ANCHOR:risks -->

---


## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Quiet mode adds no measurable cost: one `printf` and no new process, so a run stays well under the 100 ms the current script takes on a warm shell.

### Security
- **NFR-S01**: The flag adds no input surface beyond a boolean. Existing numeric validation for `--loc`, `--files` and `--phase-threshold` still runs before any output, and quiet mode must not skip it.

### Reliability
- **NFR-R01**: Output is deterministic: the same inputs produce the same single line on every run and in every output mode.

### Maintainability
- **NFR-M01**: The single-line format is produced in one place so the text report and the quiet path cannot disagree.

---

## 8. EDGE CASES

### Data Boundaries
- Score exactly on a threshold (24, 44, 69): quiet mode prints the same level the full report prints, because both read the same `RECOMMENDED_LEVEL` value.
- `--loc 0 --files 1`: valid input, so quiet mode prints a level line rather than an error.
- `--loc 0 --files 0`: invalid input, so quiet mode prints nothing to stdout and exits 1.

### Error Scenarios
- Unknown option with `--quiet`: the unknown-option error still goes to stderr and exits 1.
- `--quiet` repeated twice: the flag is idempotent, and the output is still one line.
- `--quiet --help`: help wins, prints the full help text and exits 0.
- `--quiet --no-recommend-phases`: still one line; the phase block is suppressed by both flags.
- `--quiet` placed before `--loc`: argument order does not matter, because parsing is a `while`/`case` loop.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 8/25 | Files: 2, LOC: ~40, Systems: 1 |
| Risk | 6/25 | Auth: No, API: No, Breaking: No (opt-in flag) |
| Research | 3/20 | One script read; no external investigation |
| Multi-Agent | 2/15 | Workstreams: 1 |
| Coordination | 2/15 | Dependencies: none outside the script |
| **Total** | **21/100** | **Declared Level 3 by the packet contract** |

The declared level is fixed at 3 by the packet contract (`create.sh --level 3`). This table scores the change itself, which is small; the level governs documentation depth, not the size of the edit.

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | An existing caller parses the default text report and breaks | M | L | The flag is opt-in; default output is pinned by a byte-for-byte regression test |
| R-002 | Quiet output and the text report diverge over time | M | M | One shared line helper plus an equality assertion in the test |
| R-003 | `--json --quiet` shape surprises a JSON consumer expecting the full object | L | L | Document the reduced object in `--help` and test the exact key set |
| R-004 | A leading blank line survives into quiet mode and corrupts `$(...)` capture | H | L | The quiet path never calls the text formatter; the test asserts a single line with no leading blank |

---

## 11. USER STORIES

### US-001: Level-only answer for a dispatch step (Priority: P0)

**As a** spec-kit workflow step, **I want** the recommended level on its own line, **so that** I can branch on it without parsing a report.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-002: Existing readers keep working (Priority: P0)

**As a** maintainer of the workflows that call this script, **I want** the default text and JSON output unchanged, **so that** no caller needs an edit for this feature.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-003: Machine-readable one-liner (Priority: P1)

**As an** automation author, **I want** `--json --quiet` to emit one line of JSON, **so that** I can pipe it into `jq` without a second parse step.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-004: Discoverable flag (Priority: P1)

**As an** operator, **I want** `--help` to list `--quiet`, **so that** I can find the flag without reading the source.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- Should `-q` stay reserved for `--quiet`, or be freed for a future query mode? Current stance: keep `-q` for `--quiet`, matching the existing `-j` and `-h` aliases.
- Should `--quiet` also shorten `--help`? Current stance: no. Help is a discovery surface, and quiet is an output mode for results.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Acceptance Criteria**: See `acceptance-criteria.md`

---


