---
title: "Feature Specification: Add a quiet flag to recommend-level.sh"
description: "recommend-level.sh answers one question but prints a 16-line report to do it. A --quiet flag prints the recommended-level line alone, and the default report stays byte-identical."
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

`recommend-level.sh` exists to answer one question, yet every invocation prints a 12-to-18-line text
report: a level line, a score line, a four-line breakdown and a phase-recommendation block. A
caller that needs only the level parses the second line of that report or asks for `--json` and
pulls `recommended_level` out of a 36-line JSON document for the same inputs. Adding `--quiet` prints
the single `Recommended Level:` line and leaves the default output byte-identical, which a line
count on both invocations proves.

**Key Decisions**: A separate `output_quiet` renderer, so the default report is never edited in
place; `--json` wins when both output flags are passed.

**Critical Dependencies**: None beyond `bash` 3.2 or newer, which the script already targets.

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

Every invocation of `recommend-level.sh` prints a 12-to-18-line text report: a level line, a score
line, a four-line factor breakdown and a phase-recommendation block. A caller that only needs the
level, such as a scaffolder choosing `--level` or a shell test asserting a recommendation, must
either parse the second line of that report or request `--json` and pull `recommended_level` out of
a 36-line JSON document for the same inputs. Both routes make the caller depend on a shape it does
not want.

### Purpose

Give callers a one-line answer that is the same string the full report already prints, without
changing a byte of what the full report prints.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Add a `--quiet` option that prints only the recommended-level line and exits 0.
- Keep the level label in one place, so the quiet line and the default report cannot drift apart.
- Dispatch the output mode in section 7 of the script, with `--json` taking precedence.
- Document the flag in the header comment block and in the `--help` text.
- Verify both output shapes with line counts and a byte comparison of the default report.

### Out of Scope

- Changing scoring, thresholds or phase logic - the flag must not alter the recommendation.
- Adding a short `-q` alias - the script's short aliases are `-j` and `-h`, and a new one is a
  separate decision with its own collision risk.
- Suppressing stderr - errors and warnings stay visible, because `--quiet` governs stdout only.
- Changing the JSON schema - `--json` output is untouched by this packet.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh` | Modify | Add the flag, the quiet renderer, the shared level-line helper and the help text |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `--quiet` writes exactly one line to stdout, in the form `Recommended Level: 2 (Verification)`, and exits 0. |
| REQ-002 | Without `--quiet`, stdout is byte-identical to the current output for the same arguments. |
| REQ-003 | `--quiet` changes no computed value: level, score, confidence and phase fields are identical to the default run's. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | `--quiet` together with `--json` emits the JSON document unchanged; `--json` wins and `--quiet` is a no-op for that invocation. |
| REQ-005 | `--help` lists `--quiet` and still exits 0, and every error path still writes to stderr and exits 1. |
| REQ-006 | With `--quiet`, any warning the script writes to stderr is still written to stderr, so `--quiet` trims stdout only. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `bash recommend-level.sh --loc 500 --files 15 --quiet | wc -l` prints `1`.
- **SC-002**: `bash recommend-level.sh --loc 500 --files 15 | wc -l` prints `16`, and that output matches the pre-change capture byte for byte.
- **SC-003**: For `--loc 50 --files 2`, `--loc 500 --files 15` and `--loc 500 --files 15 --auth --api --db --architectural`, the quiet line equals the level line the default report prints.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `bash` 3.2 or newer | The script cannot run at all on an older shell; nothing new is introduced | The script already targets that floor and uses `set -euo pipefail` today |
| Risk | The default report regresses while the shared level-line helper is extracted | Med | Capture three baseline invocations before editing and diff them after |
| Risk | A caller assumes `--quiet` also silences stderr | Low | Document stdout-only scope and test an error path with `--quiet` |
<!-- /ANCHOR:risks -->

---


## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: `--quiet` adds no measurable time; the quiet path is one `printf` and skips the report, so it can only be faster than the default run.

### Security
- **NFR-S01**: N/A - the flag reads no input, opens no file and handles no secret; it adds no attack surface.

### Reliability
- **NFR-R01**: Output is deterministic for identical arguments; the change adds no state, no file I/O and no randomness.

---

## 8. EDGE CASES

### Data Boundaries
- Empty input: `--quiet` with no `--loc` and no `--files` exits 1 with the existing usage error on stderr and writes nothing to stdout.
- Maximum length: `--loc 100000 --files 5000` saturates the LOC and file-count factors at their weight caps and still prints one line, with the same shape as any other quiet run.

### Error Scenarios
- External service failure: N/A - the script calls no external service.
- Network timeout: N/A - the script performs no network access.

### State Transitions
- Partial completion: N/A - the script is a single pass with no persisted state.
- Session expiry: N/A - the script has no session.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 4/25 | Files: 1, LOC: ~25, Systems: 1 |
| Risk | 5/25 | Auth: N, API: N, Breaking: N (the default report is preserved) |
| Research | 4/20 | Read one script and capture three baselines |
| Multi-Agent | 0/15 | Workstreams: 1 |
| Coordination | 2/15 | Dependencies: 0 |
| **Total** | **15/100** | **Level 3 (assigned by dispatch)** |

The measured score is 15/100, well under the 70-point Level 3 threshold. The packet is authored at
Level 3 because the dispatch fixed the level before authoring began, and the score is recorded as
measured rather than inflated to match the contract. The documentation contract, not the change's
size, is what the level describes here.

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Extracting the shared level-line helper changes the default report | H | L | Add the helper first, diff the three baselines immediately, and keep the helper's format string identical to the current `echo` |
| R-002 | A caller expects `--quiet` to hide stderr warnings | M | M | State stdout-only scope in `--help` and in this spec; test an error path under `--quiet` |
| R-003 | `--quiet --json` silently picks a winner the caller did not expect | M | L | Define `--json` precedence explicitly, document it, and test the pair |

---

## 11. USER STORIES

### US-001: One-line answer for scripts (Priority: P0)

**As a** scaffolder or shell test that needs only the level, **I want** `--quiet` to print the recommended-level line alone, **so that** I can read the answer with `$(...)` instead of parsing a report.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-002: Unchanged report for humans (Priority: P0)

**As a** developer running the script by hand, **I want** the default report to stay exactly as it is, **so that** a convenience flag cannot cost me the breakdown I read today.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-003: Predictable composition with the other flags (Priority: P1)

**As a** caller that combines output flags, **I want** `--json` and `--help` to keep their current behavior when `--quiet` is present, **so that** adding the flag never changes an existing pipeline's output.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- None blocking. Whether `--quiet` deserves a `-q` alias is deliberately out of scope here; a caller that needs one can ask for a follow-up packet.
- None blocking. Whether stderr should ever be silenced is a separate decision; this packet leaves stderr untouched.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Decision Records**: See `decision-record.md`

---
