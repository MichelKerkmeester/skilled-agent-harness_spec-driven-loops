---
title: "Feature Specification: Add a quiet flag to recommend-level.sh"
description: "recommend-level.sh prints a score breakdown and a phase section every time, so a caller that only wants the level has to filter sixteen lines down to one. A --quiet flag would print the line that carries the answer and leave every existing caller's output untouched."
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

`recommend-level.sh` answers one question, which documentation level a task needs, and spends sixteen lines doing it. A caller that wants only the answer has to parse the report or slice it with `head`. `--quiet` reduces stdout to the single `Recommended Level:` line, and a run without the flag stays byte-identical to what the script prints today.

**Key Decisions**: `--quiet` takes precedence over `--json`, so the flag always means one line of stdout. Only the long form `--quiet` is added; there is no `-q` alias.

**Critical Dependencies**: None. The change is confined to one bash script, its help text and one new test.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P2 |
| **Status** | Planned |
| **Created** | 2026-10-26 |
| **Branch** | `main` (scaffolded with `--skip-branch`; no branch was created) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Every run of `recommend-level.sh` prints the recommended level, the score, the confidence, a six-row factor breakdown and a phase recommendation section. The intake workflow that calls it wants the level itself, and records it as its `level_recommendation`. Today a caller reads all sixteen lines or passes `--json` and parses a thirty-six-line document, and the script has no minimal text mode at all: `--quiet` is rejected as an unknown option with exit 1.

### Purpose
A caller can pass `--quiet` and capture exactly one line, `Recommended Level: <N> (<Name>)`, while every existing caller keeps the report it gets today.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A `--quiet` flag in `.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh`: argument parsing, one output function, the dispatch branch, the `--help` entry and the header comment's OPTIONS block.
- A regression test that pins the quiet line, the quiet-plus-JSON line, the unchanged default output and the exit codes.
- This packet's own validation.

### Out of Scope
- A `-q` short alias - `validate.sh` pairs its long flag with one, but this request names only `--quiet`, and an alias is a second surface to test.
- Changes to `--json` - its document shape stays exactly as it is for every caller that does not pass `--quiet`.
- Scoring, thresholds, confidence and phase logic - no number changes.
- The other `spec/*.sh` scripts - `validate.sh` already has `--quiet`; the rest are not part of this request.
- Rewriting the flag table in `references/workflows/execution-methods.md` §6 - it lists scoring flags only and already omits `--json`, so `--quiet` is not a new omission there.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh` | Modify | Parse `--quiet`, add `output_quiet()`, branch to it before the JSON check, document the flag in `--help` and the header comment |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/recommend-level-quiet.vitest.ts` | Create | Pin the quiet line, the quiet-plus-JSON line, the unchanged default output and the exit codes |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | With `--quiet`, stdout is exactly one line, `Recommended Level: <N> (<Name>)`, with no leading blank line and no other content. |
| REQ-002 | Without `--quiet`, stdout for any accepted argument set is byte-identical to the current script's output. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | `--help` lists `--quiet` with a one-line meaning, and the header comment's OPTIONS block lists it too. |
| REQ-004 | Exit codes and stderr are unchanged; `--quiet` never suppresses an error message. |
| REQ-005 | `--quiet` combined with `--json` prints the single `Recommended Level:` line, and the help text says that quiet wins. |
| REQ-006 | A regression test proves REQ-001 through REQ-005. |
| REQ-007 | With `--quiet`, every warning the script writes to stderr is still written to stderr, so the flag trims stdout only and never silences a warning. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `bash recommend-level.sh --loc 50 --files 2 --quiet` prints `Recommended Level: 0 (Quick)` and nothing else.
- **SC-002**: `bash recommend-level.sh --loc 50 --files 2` still prints the sixteen-line report, byte-identical to the capture taken before the change.
- **SC-003**: `bash recommend-level.sh --loc 50 --files 2 --quiet --json` prints the same single line as SC-001.
- **SC-004**: This packet validates strict with zero errors and zero warnings.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Bash 3.2+ | The script already relies on `readonly`, arrays and `[[ ]]`; a change that used a newer feature would break macOS | Use only the constructs the file already uses |
| Risk | A caller passes `--quiet --json` and expects JSON | It gets one text line instead | The help text names the precedence, and the test pins it |
| Risk | The default report changes by accident while the output path is edited | Existing callers and the docs that quote the report go stale | `output_text()` and `output_json()` are not edited; a byte-compare test guards them |
| Risk | `--quiet` swallows an error message | A caller sees an empty capture and treats it as success | Quiet writes stdout only; errors stay on stderr and keep exit 1 |
<!-- /ANCHOR:risks -->

---


## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The quiet path adds one `echo` and no subprocess, so wall-clock time stays within the noise of bash startup.

### Security
- **NFR-S01**: `--quiet` takes no value, reads no environment variable and writes no file; it changes stdout only.

### Reliability
- **NFR-R01**: The same arguments produce the same single line on every run, and every exit code stays as it is today.

---

## 8. EDGE CASES

### Data Boundaries
- Empty input: `--quiet` with neither `--loc` nor `--files` keeps the usage error on stderr, exits 1 and leaves stdout empty.
- Maximum length: the flag accepts no argument, so it adds no new length boundary.

### Error Scenarios
- External service failure: none, the script calls nothing external.
- Unknown option: `--quiet` is the unknown option today; after the change it is consumed and the remaining arguments decide.
- Repeated flag: `--quiet --quiet` is idempotent and prints the one line.
- Flag order: `--quiet` before or after the other flags behaves the same, because the parser reads the whole argument list before scoring.
- `--quiet --help`: help prints in full and exits 0, because `--help` exits from the parser as soon as it is read.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 8/25 | Files: 2, LOC: ~25, Systems: 1 |
| Risk | 5/25 | Auth: N, API: N, Breaking: N (additive flag) |
| Research | 2/20 | One 780-line script read end to end; no investigation |
| Multi-Agent | 0/15 | Workstreams: 1 |
| Coordination | 2/15 | Dependencies: 0 |
| **Total** | **17/100** | **Level 0 by score** |

The score lands below the 25-point Level 1 threshold, which the recommendation script maps to Level 0. The packet carries Level 3 because `create.sh --level 3` scaffolded it for this track, and the extra sections describe the same single-flag change rather than adding scope.

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | A caller passes both `--quiet` and `--json` and gets text where it expected JSON | L | L | Help text names the precedence; the test pins the combination |
| R-002 | The default report drifts while the dispatch is edited | M | L | `output_text()` is untouched; a byte-compare test covers three inputs |
| R-003 | Quiet hides an error by suppressing stderr | M | L | Quiet writes stdout only; the error paths keep their exit codes |

---

## 11. USER STORIES

### US-001: One-line level for a script caller (Priority: P0)

**As a** workflow author calling `recommend-level.sh`, **I want** a flag that prints only the recommended level, **so that** I can capture it in a variable without parsing the breakdown.

**Acceptance criteria:** see `acceptance-criteria.md` (AC-001, AC-002, AC-006).

---

### US-002: Unchanged report for existing readers (Priority: P1)

**As a** reader of the current report, **I want** the default output to stay exactly as it is, **so that** the docs and habits built on it keep working.

**Acceptance criteria:** see `acceptance-criteria.md` (AC-003).

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

None. The precedence between `--quiet` and `--json` is settled by ADR-001 in `plan.md`, and the alias question is settled by the out-of-scope note in §3.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Acceptance Criteria**: See `acceptance-criteria.md`

---
