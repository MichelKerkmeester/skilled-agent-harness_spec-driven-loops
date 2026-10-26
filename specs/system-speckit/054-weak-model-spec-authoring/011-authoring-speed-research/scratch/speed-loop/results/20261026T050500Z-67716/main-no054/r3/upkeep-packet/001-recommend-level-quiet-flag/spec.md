---
title: "Feature Specification: Add a quiet flag to recommend-level.sh"
description: "Add a --quiet flag to recommend-level.sh so callers can print only the recommended level line. Default output stays byte-identical."
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

`recommend-level.sh` prints a full report on every run, so a caller that needs only the level must parse or slice that report. This feature adds a `--quiet` flag that prints one line, `Recommended Level: N (Name)`, and leaves the default output byte-identical.

**Key Decisions**: Reject `--quiet` combined with `--json` instead of letting one mode win, and build the quiet line from the same variables as the default report.

**Critical Dependencies**: `output_text()` stays the only human-readable output path.

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

recommend-level.sh always prints a full report, so a caller that needs only the level must parse it. Switching to `--json` avoids the parsing but returns a larger schema, and neither path gives a one-line answer.

### Purpose

Let a caller get the recommended level as one line on stdout without changing the default report.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `--quiet` flag parsing and the one-line output path.
- File header and `--help` text for the new flag.
- Conflict handling when `--quiet` and `--json` are both present.
- A regression test for quiet output, default output and the conflict.

### Out of Scope
- Scoring algorithm and thresholds - the feature only selects output.
- JSON schema and field names - existing machine consumers keep them.
- Other spec scripts - no shared flag parser exists, so this stays local.
- Shell completion - the CLI does not ship one.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh` | Modify | Add the flag, the quiet output branch, the conflict check and the help text |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/test-recommend-level-quiet.sh` | Create | Assert quiet output, unchanged default output and the `--json` conflict |
| `.skilled/skills/system-spec-kit/references/workflows/execution-methods.md` | Modify | Document `--quiet` beside the existing examples |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `--quiet` is accepted as a boolean flag in any argument position. |
| REQ-002 | With `--quiet` and no `--json`, stdout holds exactly one line, `Recommended Level: <level> (<name>)`, and the process exits 0. |
| REQ-003 | Without `--quiet`, stdout for the same inputs is byte-identical to the output before the change. |
| REQ-004 | `--quiet` with `--json` exits 1, writes a clear error to stderr and writes nothing to stdout. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | `--help` lists `--quiet`, and `--quiet --help` still prints the full help text. |
| REQ-006 | Existing validation and error paths keep their messages and exit codes, and `--quiet` does not suppress stderr. |
| REQ-007 | A regression test covers quiet output, default output and the `--json` conflict. |
| REQ-008 | With `--quiet`, any warning the script writes to stderr is still written to stderr, so `--quiet` trims stdout only. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `recommend-level.sh --loc 20 --files 2 --quiet` prints only `Recommended Level: 0 (Quick)` and exits 0.
- **SC-002**: `recommend-level.sh --loc 20 --files 2` matches the baseline captured before the change.
- **SC-003**: `recommend-level.sh --loc 20 --files 2 --quiet --json` exits 1 with the conflict error.
- **SC-004**: `recommend-level.sh --help` shows the flag.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `output_text()` | A second human output path would drift from the report | Branch inside the existing function |
| Dependency | Callers that pass `--json` | A changed default could break their parsing | Quiet is opt-in and the default stays unchanged |
| Risk | Default output drifts | High, existing parsers break | Byte comparison against a captured baseline |
| Risk | Quiet and JSON both requested | Medium, output becomes ambiguous | Reject the pair with exit 1 and cover it in the test |
<!-- /ANCHOR:risks -->

---


## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Quiet mode skips report formatting. Runtime stays under 100 ms for typical inputs on the existing shell.

### Security
- **NFR-S01**: The flag adds no input beyond a boolean switch. No secrets, no new files and no network access.

### Reliability
- **NFR-R01**: Exit codes stay 0 on success and 1 on validation or usage errors. The new conflict uses the existing usage error path.

---

## 8. EDGE CASES

### Data Boundaries
- Empty input: `--loc 0 --files 0` still fails validation with exit 1 and writes nothing to stdout.
- Repeated flag: `--quiet --quiet` behaves as one flag.
- Flag position: `--quiet` before or after `--loc` produces the same output.

### Error Scenarios
- `--quiet --json`: rejected with exit 1 and a stderr message.
- `--quiet --help`: help wins because the caller asked for it.
- `--quiet --no-recommend-phases`: still one line, phase data is not printed.
- Invalid numeric input with `--quiet`: the existing error text and exit code are unchanged.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | [6/25] | Files: 3, LOC: about 20, Systems: 1 |
| Risk | [0/25] | Auth: N, API: N, Breaking: N |
| Research | [0/20] | The output path is already understood |
| Multi-Agent | [0/15] | Workstreams: 1 |
| Coordination | [0/15] | Dependencies: 0 |
| **Total** | **[6/100]** | **Level 3 packet by operator decision** |

`recommend-level.sh --loc 20 --files 2` returns Level 0 with a score of 6. The packet runs at Level 3 because the operator scaffolded it there. The change itself stays small.

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Default output changes for existing callers | H | L | Byte comparison against the captured baseline |
| R-002 | `--quiet` and `--json` produce ambiguous output | M | M | Reject the pair and assert exit 1 |
| R-003 | Help text omits the flag | L | M | Assert the help output in the test |
| R-004 | Quiet line diverges from the default report line | L | L | Build both from `RECOMMENDED_LEVEL` and `LEVEL_NAME` |

---

## 11. USER STORIES

### US-001: One-line level for command workflows (Priority: P0)

**As a** command workflow author, **I want** a one-line output, **so that** I can read the level without parsing the full report.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-002: Unchanged default output (Priority: P0)

**As a** maintainer, **I want** the default output to stay byte-identical, **so that** existing parsers keep working.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-003: Clear conflict error (Priority: P1)

**As a** script author, **I want** a clear error when I combine `--quiet` and `--json`, **so that** I do not silently lose machine output.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- Should `--quiet` override `--json`? Resolved: reject the pair. See ADR-001 in `plan.md`.
- Does `--quiet` suppress errors? Resolved: no, errors stay on stderr.
- Is the quiet line the first or last line of the default report? Resolved: it is the existing `Recommended Level:` line, printed alone.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Decision Records**: See ADR-001 in `plan.md`

---


