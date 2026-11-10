---
title: "Feature Specification: Add a quiet flag to recommend-level.sh"
description: "The recommend-level script prints a 16-line report, so a caller that needs only the level must parse one value out of it. A --quiet flag prints the single recommended-level line and leaves every other invocation byte-identical."
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

`recommend-level.sh` has one human-readable mode: a leading blank line, the level line, the score line, a six-row breakdown and a phase block, which is sixteen or seventeen lines depending on the inputs. A caller that needs only the level — a wrapper script, a test, a prompt — has to grep one value out of that report, and any reformatting of the report breaks it. This packet adds a `--quiet` flag that prints `Recommended Level: N (Name)` and nothing else, while every invocation without the flag stays byte-identical. The proof is a line count of one on the quiet path and an empty `diff` against a baseline captured before the change.

**Key Decisions**: `--quiet` reuses the existing level label instead of printing a bare number (ADR-001); `--quiet` combined with `--json` exits 1 instead of silently changing format (ADR-002)

**Critical Dependencies**: None beyond `bash`; the script has no external packages

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P2 |
| **Status** | Draft |
| **Created** | 2026-10-26 |
| **Branch** | none (scaffolded with `--skip-branch`) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The script has one human-readable output mode, and it is the full report: a leading blank line, the level line, the score and confidence line, a six-row breakdown and a phase section. A simple task produces sixteen lines and a task with phase factors produces seventeen, so a caller that wants the level has to grep a label out of a report it does not otherwise care about. That coupling means any change to the report's wording or line order silently breaks every caller that parses it.

### Purpose
Give callers one flag that prints the level line and nothing else, without changing the report that existing callers already read.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add a `--quiet` boolean flag to the argument parser
- Add a quiet output path that prints the existing `Recommended Level: N (Name)` line exactly once
- Reject `--quiet` combined with `--json` with exit 1 and a named stderr error
- Document the flag in the script's header OPTIONS block and in `show_help`
- Prove parity: the quiet level equals the default level for the same inputs on all four level bands

### Out of Scope
- Changing the default report, its wording or its line order - existing callers read it and the change must stay additive
- Adding a short alias (`-q`) - not requested; a second public name is a separate contract decision
- Suppressing stderr diagnostics under `--quiet` - errors must stay visible to the caller
- Changing `--json` output or its schema - the machine format is untouched and its fixtures must keep passing

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh | Modify | Add the flag, the quiet output path, the conflict guard and the help text |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `--quiet` is accepted anywhere in the argument list and sets quiet mode; an invocation without it behaves exactly as before |
| REQ-002 | In quiet mode stdout holds exactly one line, `Recommended Level: N (Name)`, where N is 0-3 and Name is Quick, Baseline, Verification or Full |
| REQ-003 | Quiet mode prints the same level as the default invocation for the same inputs, on all four level bands |
| REQ-004 | Quiet mode exits 0 on valid input and writes nothing to stderr |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | `--quiet` combined with `--json` exits 1, writes a named usage error to stderr and writes nothing to stdout |
| REQ-006 | `--help` lists `--quiet`; `--quiet --help` still prints the full help text and exits 0 |
| REQ-007 | Validation failures (missing `--loc`/`--files`, non-numeric values, unknown option) keep their current exit code 1 and stderr message in quiet mode, with stdout empty |
| REQ-008 | The header OPTIONS block documents `--quiet` in the same style as the other flags |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `recommend-level.sh --quiet --loc 500 --files 15 --auth --api --db --architectural` prints one line, `Recommended Level: 3 (Full)`, and exits 0
- **SC-002**: For the four fixtures in `tasks.md`, `diff` between the default output after the change and a baseline captured before it prints nothing
- **SC-003**: `bash -n` on the script exits 0, and the existing phase-system suite still reports 12 passed, 0 failed
- **SC-004**: `--quiet --json` exits 1 with empty stdout
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `bash` 3.2+ (the macOS default) | The script cannot run at all | No new dependency: the change uses only parameter expansion and `case`, as the rest of the script does |
| Risk | A caller parses the report and the quiet branch disturbs it | Med | The quiet path is a separate function; the default path keeps calling `output_text`, proven by a baseline diff |
| Risk | A wrapper passes `--quiet` and `--json` together | Low | The guard exits 1 with a named error instead of silently changing format |
<!-- /ANCHOR:risks -->

---


## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The flag adds no measurable time: it selects an output path after scoring, and scoring dominates the run

### Security
- **NFR-S01**: The flag reads no new input; it is a boolean switch, so the change adds no parsing surface for untrusted data

### Reliability
- **NFR-R01**: Exit codes stay unchanged: 0 on success, 1 on user error, with the error text on stderr in both modes

---

## 8. EDGE CASES

### Data Boundaries
- Empty input: `--quiet` alone, with no `--loc` or `--files`, still exits 1 with `ERROR: At least --loc or --files must be provided` on stderr and no stdout
- Maximum length: the flag takes no value, so a repeated `--quiet` is idempotent and still prints one line
- Zero values: `--loc 0 --files 5` is valid today and stays valid; quiet mode prints the level the default mode would print

### Error Scenarios
- `--quiet --json`: exit 1, `ERROR: --quiet and --json cannot be combined` on stderr, empty stdout
- Unknown option after `--quiet`: the existing `ERROR: Unknown option` message and exit 1 are unchanged
- Non-numeric value: the existing `ERROR: --loc must be a positive integer` message and exit 1 are unchanged

### State Transitions
- `--quiet --help`: help is an explicit information request, so the full help prints and exits 0; quiet does not suppress it
- Flag order: `--json --quiet` and `--quiet --json` produce the same error, because the guard runs after parsing

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 5/25 | Files: 1, LOC: ~40, Systems: 1 |
| Risk | 8/25 | Auth: N, API: N, Breaking: N, public CLI contract: Y |
| Research | 4/20 | Read one script and its callers; no external research |
| Multi-Agent | 2/15 | Workstreams: 1 |
| Coordination | 4/15 | Dependencies: 1 script, 2 command assets that call `--json`, 1 test fixture file |
| **Total** | **23/100** | **Level 1 by score; declared Level 3** |

The score alone would place this change at Level 1. The packet is declared Level 3 by the scaffolding directive, so the architecture sections are filled rather than dropped.

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | The quiet path drifts from the default label, giving callers two formats | M | L | Both paths read `RECOMMENDED_LEVEL` and `LEVEL_NAME`; AC-003 compares them |
| R-002 | The default report changes as a side effect of the refactor | H | L | The default path keeps calling `output_text`; a baseline diff proves it |
| R-003 | A machine caller's format changes silently under `--quiet --json` | M | L | The guard exits 1; AC-005 tests it |
| R-004 | Help text and header drift from the parser | L | M | REQ-008 and one edit keep both lists in step |

---

## 11. USER STORIES

### US-001: One parseable line for a wrapper (Priority: P0)

**As a** build wrapper, **I want** one line that names the level, **so that** I can read the level without parsing a report.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-002: Keep the report for human readers (Priority: P1)

**As an** operator reading the output, **I want** the default report unchanged, **so that** the transcripts and habits I already have still make sense.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

None. The flag name, the quiet line format and the `--json` interaction are settled in `plan.md` ADR-001 and ADR-002.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Decision Records**: See `decision-record.md`

---

