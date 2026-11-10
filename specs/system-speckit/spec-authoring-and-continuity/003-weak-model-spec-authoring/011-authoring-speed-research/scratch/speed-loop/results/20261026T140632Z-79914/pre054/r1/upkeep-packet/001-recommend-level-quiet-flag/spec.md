---
title: "Feature Specification: Add a quiet flag to recommend-level.sh"
description: "recommend-level.sh always prints its full scored report, so a caller that needs only the level has to parse the block. A --quiet flag prints that one line and nothing else."
trigger_phrases:
  - "recommend level quiet flag"
  - "add a quiet flag to recommend level sh"
  - "quiet level recommendation output"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Add a quiet flag to recommend-level.sh

<!-- SPECKIT_LEVEL: 3 -->


---

## EXECUTIVE SUMMARY

`recommend-level.sh` is the deterministic level scorer every SpecKit packet starts from, and it always writes a human report of five to fifteen lines. Any caller that wants the single recommended level has to parse that report, which couples the caller to the report's layout. `--quiet` makes the one value the script exists to produce available on its own, without changing what the script prints for anyone who does not pass the flag.

**Key Decisions**: `--quiet` is text-mode only and `--json` takes precedence over it, so no machine-readable consumer sees a different document; the suppressed output is the whole human report rather than only its breakdown, so the flag really does leave one line.

**Critical Dependencies**: none outside the script. Bash 3.2 compatibility is the only environmental constraint, and the file already targets it.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-10-26 |
| **Branch** | `HEAD` (detached; the packet was scaffolded with `--skip-branch`) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
recommend-level.sh always prints its full scored report, so a caller that needs only the level has to parse the block. The report is a blank line, the `Recommended Level: N (Name)` line, a score and confidence line, a four-row point breakdown and, unless phase output is disabled, a phase-recommendation block. A shell pipeline that picks a template set, or an agent recording one value, therefore reaches for `grep '^Recommended Level:'` or `sed`, and any future edit to the report silently breaks that parse. There is no supported way to ask the script for the single line it exists to produce.

### Purpose
Add a `--quiet` flag that prints only the final recommended-level line, while every existing invocation keeps its current output byte for byte.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Accept `--quiet` as a valueless flag in the existing argument-parsing loop, in any position among the other flags.
- Suppress the whole human report in quiet mode and print exactly one line: `Recommended Level: <N> (<Name>)`.
- Leave text output, JSON output, help output, error output and exit codes unchanged for every invocation that does not pass `--quiet`.
- Document the flag where the script already documents its flags: the header comment block, the `--help` text and the examples.

### Out of Scope
- `--json` output shape and content - a JSON document is already a single machine-readable artifact, and changing it would break consumers that parse it today.
- Any other script in `runtime/cli/spec/` - `create.sh`, `upgrade-level.sh` and `validate.sh` have their own output contracts and none of them needs this flag.
- A short form such as `-q` - the script uses `-j` and `-h` only, and adding a letter alias is a separate compatibility decision.
- Suppressing stderr diagnostics - errors stay on stderr with their current text and exit code 1.
- Rewriting the scoring algorithm, thresholds or phase logic - the change touches argument parsing and output selection only.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh` | Modify | Add the `QUIET_OUTPUT` global, the `--quiet` parse arm, a quiet branch at the top of `output_text()`, and the flag's entries in the header comment and `--help` text. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `--quiet` is accepted as a valueless flag by the argument-parsing loop, in any argument position, and repeated occurrences are idempotent. |
| REQ-002 | With `--quiet` and text output, stdout holds exactly one line, `Recommended Level: <N> (<Name>)`, with no leading blank line, no score line, no breakdown and no phase block. |
| REQ-003 | Every invocation that does not pass `--quiet` produces output identical to the pre-change script, including the leading and trailing blank lines, the phase block and the `--no-recommend-phases` variant. |
| REQ-004 | Exit codes are unchanged: `0` on success, `1` for a missing flag value, a non-numeric value, both inputs zero and an unknown option. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | `--json` takes precedence over `--quiet`: passing both prints the unchanged JSON document, and the flag is documented as text-mode only. |
| REQ-006 | `--help` lists `--quiet` with its one-line description, and the script's header comment block lists it beside the other options. |
| REQ-007 | `--quiet` composes with `--no-recommend-phases`, `--phase-threshold`, `--auth`, `--api`, `--db` and `--architectural` without altering their scoring. |
| REQ-008 | The flag is implemented with constructs the file already uses, so the script still runs under the Bash 3.2 that ships with macOS. |
| REQ-009 | With `--quiet`, any warning the script writes to stderr is still written to stderr: `--quiet` trims stdout only, and no warning is suppressed, redirected to stdout or reworded. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `recommend-level.sh --loc 500 --files 15 --auth --api --db --architectural --quiet` writes exactly one stdout line, `Recommended Level: 3 (Full)`, and exits `0`.
- **SC-002**: A golden-output capture of the twelve-invocation matrix in `tasks.md` is byte-identical before and after the change for every invocation that omits `--quiet`.
- **SC-003**: `--help` mentions `--quiet`, and `--quiet --help` still prints the full help text.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Bash 3.2 on macOS | A construct the newer shell allows would fail on the developer's own machine | Use only the `case`, `[[ ]]` and `echo` forms already present in the file; run the script under the system bash. |
| Dependency | The existing text report's exact bytes | A stray edit in `output_text()` changes output for every caller | Capture the golden matrix before the edit and diff after it; the diff is the acceptance proof. |
| Risk | Quiet mode drifts from the report's wording | The line a caller parses stops matching the line the full report prints | Derive the quiet line from the same `RECOMMENDED_LEVEL` and `LEVEL_NAME` globals and the same format string; compare both outputs in one task. |
| Risk | A caller passes `--quiet --json` and expects a level line | It receives JSON instead, which is not what the flag's name suggests | Document the precedence in `--help` and in this spec, and assert the JSON-unchanged behaviour in the verification matrix. |
<!-- /ANCHOR:risks -->

---


## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The flag adds no measurable work. The quiet path prints one line where the full path prints at least five, and the script stays far below 100 ms wall time for any input, which is the only budget this CLI has.

### Security
- **NFR-S01**: The flag introduces no input surface. It is a boolean with no value, so it adds no parsing, no path handling and no environment read, and the script continues to read nothing but its own arguments.

### Reliability
- **NFR-R01**: Output is deterministic. The same arguments produce the same bytes on every run, in both modes, because the change introduces no clock, locale or filesystem dependency.

---

## 8. EDGE CASES

### Data Boundaries
- Empty input: `--quiet` with neither `--loc` nor `--files` keeps the existing `ERROR: At least --loc or --files must be provided` path, exit `1`, and prints no level line.
- Maximum length: no new bound. The quiet line's length depends only on the level digit and the level name, both of which come from a fixed four-value set.
- Repeated flag: `--quiet --quiet` behaves as one occurrence, because the parse arm sets a boolean rather than incrementing anything.

### Error Scenarios
- External service failure: not applicable. The script has no network, database or filesystem dependency.
- Network timeout: not applicable, for the same reason.
- Invalid flag value: `--quiet` takes no value, so `--quiet 5` leaves `5` to be rejected by the catch-all arm as `ERROR: Unknown option: 5`, exit `1`, exactly as an unmatched positional argument is rejected today.
- Combined with `--json`: JSON wins and the document is unchanged; the quiet branch lives in `output_text()` and is never reached from the JSON path.
- Combined with `--help`: help exits `0` inside the parse loop before any output mode is chosen, so `--quiet --help` prints the full help text.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 6/25 | Files: 1, LOC: ~20 net, Systems: 1 |
| Risk | 3/25 | Auth: N, API: N, Breaking: N (opt-in flag only) |
| Research | 3/20 | The script, its help text and its callers were read; no external investigation needed |
| Multi-Agent | 1/15 | Workstreams: 1 |
| Coordination | 2/15 | Dependencies: 0 |
| **Total** | **15/100** | **Level 3 (declared by the scaffold instruction; the scoring model would return Level 0)** |

The declared level and the score disagree on purpose. This packet was scaffolded with `--level 3` by the dispatch instruction, not chosen from the score above. The extra structure is documentation depth: the work itself is a single-file, opt-in flag, and a reader should not infer a large change from the level marker.

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | A refactor of `output_text()` changes the default report while adding the branch | H | L | Golden-output diff over the twelve-invocation matrix before and after the edit. |
| R-002 | Quiet line wording diverges from the report's wording | M | L | Both paths print the same format string from the same globals. |
| R-003 | A shell construct breaks under Bash 3.2 | M | L | Copy the existing `case` and `[[ ]]` idioms; run under `/bin/bash`. |
| R-004 | A caller expects `--quiet --json` to yield the level line | L | M | Precedence stated in `--help`, in REQ-005 and in ADR-001, and asserted in the matrix. |
| R-005 | A future flag addition reuses the name | L | L | The name is documented in the header block beside every other option. |

---

## 11. USER STORIES

### US-001: One-line level for a scripted caller (Priority: P0)

**As a** shell script or agent choosing a documentation level, **I want** `recommend-level.sh --quiet` to print only the recommended-level line, **so that** I can read the level without a `grep` or `sed` expression that breaks when the report changes.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-002: Unchanged report for an interactive reader (Priority: P1)

**As a** developer running the script by hand, **I want** the existing report to look exactly as it does today, **so that** I lose no score, breakdown or phase information and my notes and examples stay valid.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- None blocking. The one ambiguity this feature carries - what `--quiet` means when `--json` is also passed - is decided in REQ-005 and recorded as ADR-001 in `plan.md`; reopen it only if a consumer asks for a quiet JSON variant.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Decision Records**: See the L3 Architecture Decision Record in `plan.md`

---


