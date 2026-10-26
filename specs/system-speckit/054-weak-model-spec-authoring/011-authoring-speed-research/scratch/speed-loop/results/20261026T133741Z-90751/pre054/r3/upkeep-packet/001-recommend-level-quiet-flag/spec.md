---
title: "Feature Specification: Add a quiet flag to recommend-level.sh"
description: "recommend-level.sh always prints a multi-line report, so a caller that only needs the level has to scrape one line out of fifteen. A --quiet flag prints the recommended-level line and nothing else, while every existing invocation stays byte-identical."
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

`recommend-level.sh` is the deterministic level scorer the spec-kit workflow calls before a packet is created. It currently answers with a fifteen-line report — a level line, a score line, a six-row breakdown and an optional phase block — so any caller that only wants the level has to scrape it. This packet adds a `--quiet` flag that prints exactly the recommended-level line and suppresses the rest. Nothing changes for callers that do not pass the flag.

**Key Decisions**: A dedicated `output_quiet()` path rather than an early return inside `output_text()`, so the untouched default path cannot drift. `--quiet` and `--json` are rejected together rather than silently resolved.

**Critical Dependencies**: The script's existing `output_text()` format, which supplies the canonical line text.

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

Every invocation of `recommend-level.sh` writes a fixed-shape report to stdout: a leading blank line, `Recommended Level: N (Name)`, a score and confidence line, a blank line, a six-row breakdown, and — by default — a four-line phase recommendation block. A caller that wants only the level therefore has to pipe the whole report through `head`, `grep` or `sed`, and any of those one-liners silently breaks the moment the surrounding prose changes. The cost is not the extra bytes; it is that the extraction recipe lives in the caller, outside the script's control.

### Purpose

Give callers a supported way to ask for the one line they need, so the level can be consumed without a bespoke parser and without a second source of truth for the output format.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- A `--quiet` flag on `recommend-level.sh` that limits stdout to the recommended-level line.
- A single shared helper that produces the level line, so quiet and full output cannot disagree on its format.
- Help text and the header option block updated to document `--quiet`.
- An automated test that proves quiet output is exactly one line and that default output is unchanged.

### Out of Scope

- A short alias such as `-q` — the request names `--quiet` only, and a second spelling doubles the surface to test.
- Quiet variants of `--json` — JSON is already undecorated, so there is nothing for quiet to suppress.
- Any change to the scoring algorithm, the level thresholds, the phase scoring, or the exit-code taxonomy.
- Changes to callers of `recommend-level.sh` — the flag is additive, so no caller needs to opt in.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh` | Modify | Add the `--quiet` flag, the quiet output path, the shared level-line helper, the `--json` conflict guard, and the help/header documentation |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/recommend-level-quiet.vitest.ts` | Create | Assert one-line quiet output, byte-identical default output, and the conflict and help paths |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `recommend-level.sh` accepts `--quiet`. With the flag set, stdout contains exactly one line — `Recommended Level: <N> (<Level Name>)` — followed by a single newline, and nothing else. |
| REQ-002 | Without `--quiet`, stdout is byte-identical to the current script for every existing flag combination, including `--json`, `--no-recommend-phases`, `--phase-threshold`, `--help` and the error paths. |
| REQ-003 | `--quiet` changes output only. Exit codes, stderr diagnostics, the computed score, the recommended level, the confidence value and the phase results are identical with and without the flag for the same inputs. |
| REQ-007 | With `--quiet`, any warning `recommend-level.sh` writes to stderr is still written to stderr, unchanged and in full. `--quiet` trims stdout only: it never suppresses, redirects or reformats a warning bound for stderr. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | `--help` and the header option block list `--quiet`, and `--help` still prints its full text when `--quiet` is also present. |
| REQ-005 | `--quiet` combined with `--json` exits 1 with an `ERROR:` line on stderr and empty stdout, rather than silently honouring one flag and dropping the other. |
| REQ-006 | An automated test covers the quiet path, the default-path regression, the `--json` conflict and the `--help` precedence, and is collected by the existing `cli` vitest project without a config change. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: For each of the four level bands and both phase settings, `--quiet` produces a stdout line count of exactly 1, and that line equals the level line the same invocation prints in default mode.
- **SC-002**: A captured-output diff across a fixture matrix shows zero bytes changed in default mode before and after the implementation.
- **SC-003**: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/zz-bench-authoring/001-recommend-level-quiet-flag --strict` reports `RESULT: PASSED` with no warnings introduced by this packet.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `output_text()` in `recommend-level.sh` | The canonical line text lives there; if it changes, quiet output must follow | Extract the line into one helper that both paths call, so a format edit lands in one place |
| Dependency | The `cli` vitest project | The new test needs to be collected and to run hermetically | Place the test at `runtime/cli/tests/recommend-level-quiet.vitest.ts`, which the `cli` project's `tests/**/*.vitest.ts` include already matches |
| Risk | A refactor of `output_text()` perturbs the default report | High | Add the quiet path as a separate function; verify with a before/after byte diff rather than by reading the diff |
| Risk | An anchored parser downstream depends on the leading blank line in default mode | Medium | Default mode keeps the blank line; quiet is opt-in and is documented as a different contract |
| Risk | Help text drifts from the implemented flags | Low | A test asserts `--help` output contains `--quiet` |
<!-- /ANCHOR:risks -->

---


## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The quiet path performs no additional subprocess, file read or loop iteration; it replaces roughly fifteen `echo` calls with one. Wall-clock time for the script stays within noise of the current run (target: no measurable increase on a warm shell).
- **NFR-P02**: `--quiet` does not short-circuit the scoring or phasing computation, so a quiet call costs the same arithmetic work as a default call. Predictable timing matters more here than shaving microseconds.

### Security
- **NFR-S01**: `--quiet` takes no value and introduces no new parsing of user-supplied data. Argument handling keeps the existing `case`-based dispatch and the existing `--`-prefixed lookahead guards.
- **NFR-S02**: Error diagnostics continue to go to stderr. `--quiet` must never suppress an error message, so a failing invocation under quiet still explains itself.

### Reliability
- **NFR-R01**: The quiet contract holds for all four level values (`0`–`3`), all four level names, and both `--recommend-phases` settings, with no dependence on stdout being a terminal.
- **NFR-R02**: Default-mode output is byte-identical to the pre-change script, verified by diffing captured output rather than by inspection.

---

## 8. EDGE CASES

### Data Boundaries
- Empty input: `--quiet` with neither `--loc` nor `--files` keeps the existing `At least --loc or --files must be provided` error on stderr and exit 1; stdout stays empty.
- Maximum length: level names are at most twelve characters (`Verification`), and the line is a single fixed-shape string, so no wrapping or truncation applies.
- Boundary scores: a total score sitting exactly on 24, 44 or 69 yields one line with the boundary's level, matching default mode.

### Error Scenarios
- External service failure: not applicable — the script has no network or service dependency.
- Network timeout: not applicable.
- Repeated flag: `--quiet --quiet` is idempotent and still prints one line.
- Invalid numeric argument: `--quiet --loc abc` keeps the existing `--loc must be a positive integer` error on stderr and exit 1.
- Conflicting output modes: `--quiet --json` exits 1 with an `ERROR:` line on stderr and empty stdout.
- Help precedence: `--quiet --help` and `--help --quiet` both print the full help text and exit 0, because `show_help` exits during argument parsing before the output dispatch runs.
- Unknown option: `--quiet --bogus` keeps the existing unknown-option error and exit 1.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 6/25 | Files: 2, LOC: ~35, Systems: 1 |
| Risk | 8/25 | Auth: N, API: N, DB: N, Breaking: N — but the file is shared by every spec workflow, so a default-output regression has wide reach |
| Research | 6/20 | Read the 780-line script end to end and confirm how its two output functions and its dispatch are reached |
| Multi-Agent | 3/15 | Workstreams: 1 |
| Coordination | 5/15 | Dependencies: 2 (help/header documentation, test collection) |
| **Total** | **28/100** | **Level 1 on the script's own scale** |

The scoring table above measures the engineering footprint of the change, not the documentation depth. The packet is authored at Level 3 because the request fixed that level, so the table is recorded as evidence rather than used to re-derive the level.

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | The default report changes while adding the quiet path | H | M | Separate output function; before/after byte diff over a fixture matrix |
| R-002 | `--quiet` is unreachable because the dispatch checks `--json` first | M | L | Test the quiet path without `--json`; assert a line count of 1 |
| R-003 | Quiet and default output diverge on the line format | M | L | One shared `format_level_line()` helper called by both paths |
| R-004 | `--help` stops mentioning the new flag | L | M | Test asserts the help text contains `--quiet` |
| R-005 | The `--json` conflict is resolved silently, hiding a caller mistake | M | L | Fail with exit 1 and a named `ERROR:` line |

---

## 11. USER STORIES

### US-001: Single-line answer for a pipeline caller (Priority: P0)

**As a** workflow orchestrator that runs the level scorer inside a larger pipeline, **I want** a flag that prints only the recommended level, **so that** I can capture it directly without maintaining a `grep` recipe that breaks when the report's prose changes.

**Acceptance criteria:** see `acceptance-criteria.md` (rows AC-001, AC-002, AC-003).

---

### US-002: Unchanged report for a human reader (Priority: P1)

**As a** maintainer who reads the full report to understand why a level was recommended, **I want** the existing output to stay exactly as it is, **so that** the flag does not cost me the breakdown I use to sanity-check the score.

**Acceptance criteria:** see `acceptance-criteria.md` (rows AC-004, AC-005).

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- None blocking. The `--quiet`/`--json` interaction is decided in `plan.md` ADR-002 rather than left open, because a silent resolution would be worse than a stated one.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Decision Records**: See `plan.md` section `L3: ARCHITECTURE DECISION RECORD`

---
