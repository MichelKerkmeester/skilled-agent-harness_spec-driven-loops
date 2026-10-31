---
title: "Feature Specification: Add a quiet flag to recommend-level.sh"
description: "Add a --quiet flag to recommend-level.sh so a caller that needs only the recommended level reads one line instead of parsing a 16-line report, while the default output stays byte-identical."
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

`recommend-level.sh` answers one question - which documentation level a task needs - but prints a 16-line report to answer it. Every caller that wants only the level re-implements a parser for the `Recommended Level:` line, and each parser breaks silently if that label or its spacing changes. A `--quiet` flag prints that single line and leaves every existing invocation byte-identical, proven by a line count on both forms and a diff against a captured baseline.

**Key Decisions**: One shared emitter produces the level line for both the quiet and the default form (ADR-001); `--json` wins when both `--json` and `--quiet` are given (ADR-002)

**Critical Dependencies**: Bash 3.2 or newer, the shell macOS ships; no new package

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
`recommend-level.sh` prints a 16-line human report, so a caller that needs only the recommended level cannot read the answer directly. Callers pipe the report through `grep '^Recommended Level:'` or `awk`, and every new caller writes that parser again; a change to the label or its spacing breaks each copy without an error. The cost is small per caller and repeated across every script that asks the question.

### Purpose
Add a `--quiet` flag that prints exactly the `Recommended Level:` line, so one documented flag replaces the ad-hoc parsers and the default report keeps its current output.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add a `--quiet` boolean to the option parser of `recommend-level.sh`
- Emit only the `Recommended Level: <N> (<Name>)` line when `--quiet` is set
- Reuse one emitter so the quiet line and the report line cannot drift apart
- List `--quiet` in the `--help` OPTIONS block
- Cover quiet, default, JSON precedence and error paths in a scratch test harness

### Out of Scope
- Changing the default report - callers depend on its current 16 lines
- Changing JSON output - it is already a single parseable payload
- Adding a `-q` short alias - no request, and the script keeps short flags for `-j` and `-h` only
- Suppressing stderr - an error must stay visible in quiet mode

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh | Modify | Accept `--quiet`, add one output branch, add one shared level-line emitter and one help line |
| specs/zz-bench-authoring/001-recommend-level-quiet-flag/scratch/test-quiet-flag.sh | Create | Scratch harness asserting line counts, byte equality and exit codes |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `--quiet` is accepted as a flag and exits `0` when `--loc` or `--files` is valid |
| REQ-002 | With `--quiet`, stdout holds exactly one line, `Recommended Level: <N> (<Name>)`, with no leading or trailing blank line |
| REQ-003 | The quiet line is byte-identical to the `Recommended Level:` line the default report prints for the same inputs |
| REQ-004 | Without `--quiet`, stdout is byte-identical to the pre-change output for every invocation that works today |
| REQ-005 | `--quiet` does not alter stderr or exit codes: a missing `--loc`/`--files` still exits `1` with the existing message |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-006 | `--help` lists `--quiet` in its OPTIONS block with a one-line description |
| REQ-007 | When `--quiet` and `--json` are both given, the unchanged JSON object is printed and `--quiet` has no effect (ADR-002) |
| REQ-008 | `--quiet` is position-independent and idempotent; `--quiet --quiet` prints one line |
| REQ-009 | `--quiet` composes with `--no-recommend-phases` and `--phase-threshold` without changing their effect |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: **Given** `--loc 500 --files 15`, **When** the script runs with `--quiet`, **Then** stdout is one line and `wc -l` prints `1`.
- **SC-002**: **Given** the same inputs, **When** both forms run, **Then** the quiet line and line 2 of the default report are byte-identical and `diff` prints nothing.
- **SC-003**: **Given** an invocation that works today, **When** it runs without `--quiet`, **Then** `diff` against the captured baseline prints nothing and exits `0`.
- **SC-004**: **Given** `--loc 100 --files 3 --quiet --json`, **When** the script runs, **Then** stdout is the unchanged JSON object and `jq -r .recommended_level` prints `0`.
- **SC-005**: **Given** no `--loc` and no `--files`, **When** the script runs with `--quiet`, **Then** stderr holds `At least --loc or --files must be provided` and the exit status is `1`.
- **SC-006**: **Given** `--help`, **When** the script runs, **Then** `grep -c '^  --'` prints `12` and the block names `--quiet`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Bash 3.2+ | No run at all on an older shell | The change uses the syntax the script already uses; `bash -n` plus a macOS run covers it |
| Dependency | `diff` and `wc` coreutils | Baseline comparison cannot run | Both ship with macOS and Linux; the harness falls back to `cmp` if `diff` is absent |
| Risk | The default report changes by accident | High - every existing caller sees new output | Capture the baseline before editing and diff it after |
| Risk | The quiet label drifts from the report label | Medium - callers parsing either form break | One emitter function, checked by SC-002 |
<!-- /ANCHOR:risks -->

---


## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The flag adds no measurable runtime; both forms finish within 5 ms of each other on identical inputs, because the quiet path skips work rather than adding it.

### Security
- **NFR-S01**: `--quiet` is a boolean switch; it adds no input parsing, file access, network call or credential surface.

### Reliability
- **NFR-R01**: Exit codes are unchanged for every existing invocation; the flag never turns a non-zero exit into zero.

---

## 8. EDGE CASES

### Data Boundaries
- Empty input: `--quiet` alone still exits `1` and prints `At least --loc or --files must be provided` to stderr; quiet mode never hides it.
- Maximum length: `--loc 100000 --files 1000` scores the same in both forms; quiet prints the level line only.
- Repeated flag: `--quiet --quiet` is accepted and prints exactly one line.

### Error Scenarios
- Unknown option: `--quiet=1` is rejected as an unknown option with exit `1`, the same as any other unknown flag today.
- Missing flag value: `--loc --quiet --files 3` still reports `--loc requires a numeric value`, because the parser rejects a `--`-prefixed value.
- JSON combined: `--quiet --json` prints the JSON object unchanged; `--quiet` is ignored (ADR-002).

### State Transitions
- Partial completion: N/A - the script is stateless and exits after one report.
- Session expiry: N/A - the script holds no session state.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 4/25 | Files: 1, LOC: ~25, Systems: 1 |
| Risk | 5/25 | Auth: N, API: N, Breaking: N (default output preserved) |
| Research | 2/20 | One 780-line script to read; no external investigation |
| Multi-Agent | 0/15 | Workstreams: 1 |
| Coordination | 2/15 | Dependencies: 1 (the shared emitter) |
| **Total** | **13/100** | **Level 3 fixed by the dispatch instruction** |

The measured score maps to Level 0. This packet is authored at Level 3 because the dispatch
instruction fixes the level (`create.sh --level 3`); the L2 and L3 sections below record
proportionate analysis of a one-file change rather than padding for its own sake.

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | The default report changes while adding the branch | H | L | Capture the baseline first and diff it after every edit |
| R-002 | The quiet label drifts from the report label | M | L | One emitter, ADR-001, asserted by SC-002 |
| R-003 | A caller combines `--quiet` and `--json` and parses a text line | L | L | JSON precedence documented in `--help` and ADR-002 |
| R-004 | `--quiet` is swallowed as a value for `--loc` or `--files` | M | L | The existing `^--` guard rejects it; SC-005 and the harness cover it |

---

## 11. USER STORIES

### US-001: Caller reads one line (Priority: P0)

**As a** build script that asks for a documentation level, **I want** a flag that prints only the level line, **so that** I stop carrying a `grep`-based parser that breaks without an error.

**Acceptance criteria:** see `acceptance-criteria.md` (AC-001, AC-002, AC-003).

---

### US-002: Maintainer keeps the default report (Priority: P0)

**As a** maintainer of `recommend-level.sh`, **I want** the default report to stay byte-identical, **so that** existing callers and readers see no change from a flag they did not ask for.

**Acceptance criteria:** see `acceptance-criteria.md` (AC-004).

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- None blocking. `--quiet --json` precedence is resolved in ADR-002: JSON wins because it is already one parseable payload.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Decision Records**: See `plan.md` (ADR-001 and ADR-002 under L3: ARCHITECTURE DECISION RECORD)
