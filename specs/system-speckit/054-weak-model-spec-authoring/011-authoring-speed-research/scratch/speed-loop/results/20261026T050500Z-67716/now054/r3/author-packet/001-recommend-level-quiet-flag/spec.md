---
title: "Feature Specification: Add a quiet flag to recommend-level.sh"
description: "recommend-level.sh prints a multi-line report, so a caller that needs only the level has to parse the whole thing. This packet adds a --quiet flag that prints the single Recommended Level line and leaves every invocation without the flag byte-identical to today."
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

Callers that need only the recommended level must read a multi-line report to find one line; a full-risk input produces 17 lines before the answer appears. `--quiet` prints that one line and nothing else, while every invocation without the flag keeps the report it prints today. Two line counts prove it: `wc -l` prints 1 with the flag and 17 without, and a captured baseline shows the default output is byte-identical.

**Key Decisions**: `--quiet` is a text-output modifier (ADR-001), and `--quiet --json` is rejected rather than silently resolved (ADR-002)

**Critical Dependencies**: `bash` 3.2 or later, which the script already requires; no new package

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
`recommend-level.sh` prints a human report: a blank line, the level line, the score line, a six-line breakdown, and a phase section that appears by default. A caller that needs the level itself — a hook, a generator, another script — must either parse the report and hope the headings stay put, or read the JSON payload and extract one field from it. Both routes carry parsing code for a value the script already computed.

### Purpose
`recommend-level.sh --quiet` prints exactly one line, `Recommended Level: N (Name)`, and every invocation without the flag prints exactly what it prints today.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add a `--quiet` option to the argument parser in `recommend-level.sh`.
- Print only the `Recommended Level: N (Name)` line when `--quiet` is set.
- Reject `--quiet` combined with `--json` with exit 1 and a stderr message.
- Document the flag in the script header OPTIONS block and in `show_help`.
- Verify line counts, exit codes and the unchanged default output.

### Out of Scope
- Changing the default text report - the requirement is that it stays byte-identical.
- Changing the `--json` payload - a single JSON document is already machine-readable.
- Changing scoring, thresholds or phase logic - unrelated to the shape of the output.
- Adding a quiet option to other spec CLI scripts - each script needs its own packet.
- An environment variable such as `SPEC_RECOMMEND_QUIET` - flags are the interface callers already use (ADR-001).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh` | Modify | Add the flag to the parser and the globals block, branch the output dispatch, document the option in the header and in `show_help` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | With `--quiet`, stdout holds exactly one line, `Recommended Level: <N> (<Name>)`, and the exit code is 0. |
| REQ-002 | Without `--quiet`, stdout and the exit code are identical to the current script for the same arguments. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | `--quiet` combined with `--json` exits 1 with an explanatory stderr message and no stdout. |
| REQ-004 | `show_help` lists `--quiet` in OPTIONS and the script header block documents it. |
| REQ-005 | Every existing diagnostic still reaches stderr with its exit code under `--quiet`; the flag changes stdout only. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `recommend-level.sh --quiet --loc 500 --files 15 --auth --api --db --architectural` prints 1 line and exits 0.
- **SC-002**: The same arguments without `--quiet` print 17 lines that diff clean against a baseline captured before the change.
- **SC-003**: `recommend-level.sh --quiet --json --loc 50 --files 2` prints 0 lines to stdout, names the conflict on stderr, and exits 1.
- **SC-004**: `recommend-level.sh --quiet --loc 50 --files 2` and `--quiet --loc 200 --files 5 --api` each print 1 line.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `bash` 3.2 or later, plus `wc` and `diff` for verification | None: the script already requires bash and adds no runtime | No fallback needed; the flag adds no dependency |
| Risk | A caller parses the quiet line and a later label change breaks it | Med | Pin the exact label in AC-001 and in `show_help`, so a label change fails the criteria before it ships |
<!-- /ANCHOR:risks -->

---


## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: `--quiet` adds no measurable time; both modes finish under 100 ms for the same input, and the flag only selects an output branch.

### Security
- **NFR-S01**: N/A - the script reads no credential, opens no network connection, and validates its numeric inputs before use.

### Reliability
- **NFR-R01**: N/A - the script is a one-shot CLI with no uptime target and no persistent state.

---

## 8. EDGE CASES

### Data Boundaries
- Empty input: no `--loc` and no `--files` keeps the existing exit 1 and the `At least --loc or --files must be provided` stderr message; `--quiet` changes neither.
- Maximum length: `--loc 1000000 --files 1000` scores the capped maximum and still prints exactly one line under `--quiet`.

### Error Scenarios
- External service failure: N/A - the script calls no external service.
- Network timeout: N/A - the script makes no network request.
- Invalid option: an unknown flag keeps the existing `Unknown option` stderr message and exit 1.

### State Transitions
- Partial completion: N/A - the script is stateless and runs to completion in one pass.
- Session expiry: N/A - the script holds no session.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 4/25 | Files: 1, LOC: ~20, Systems: 1 (the spec CLI) |
| Risk | 5/25 | Auth: N, API: N, Breaking: N (the output contract is additive) |
| Research | 6/20 | Read a 780-line script and pin the exact output line and its consumers |
| Multi-Agent | 0/15 | Workstreams: 1 |
| Coordination | 1/15 | Dependencies: 0 new packages, 0 other packets |
| **Total** | **16/100** | **Level 3** |

The change scores 16/100, which the level helper maps to Level 0. The packet runs at Level 3 because `create.sh --level 3` fixed the level for the authoring-pipeline check, so the documentation is deliberately deeper than the change.

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | A caller depends on the quiet line and the label changes later | M | L | Pin the label in AC-001 and in `show_help`; a change then fails the criteria |
| R-002 | `--quiet` suppresses a diagnostic and hides a failure | H | L | Keep every diagnostic on stderr; AC-005 asserts exit 1 and a stderr line under `--quiet` |
| R-003 | Refactoring the output function changes the default report as a side effect | H | L | SC-002 diffs the default output against a pre-change baseline |

---

## 11. USER STORIES

### US-001: One parseable line for callers (Priority: P0)

**As a** build or hook script, **I want** `recommend-level.sh --quiet` to print only the recommended-level line, **so that** I can read the level without parsing a report.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-002: The default report stays stable (Priority: P1)

**As a** maintainer of the spec CLI, **I want** every invocation without `--quiet` to print exactly what it prints today, **so that** existing readers and documentation keep working.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- None. The `--json` interaction is decided in ADR-002 rather than left open.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Decision Records**: See `plan.md` (ADR-001 through ADR-003)

---
