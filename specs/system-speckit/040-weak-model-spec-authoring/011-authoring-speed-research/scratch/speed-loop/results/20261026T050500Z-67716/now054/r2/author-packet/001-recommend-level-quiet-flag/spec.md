---
title: "Feature Specification: Add a quiet flag to recommend-level.sh"
description: "recommend-level.sh answers every call with a 16-line human report or a 36-line JSON document, so a caller that needs only the recommended level must parse text or carry a JSON parser. A --quiet flag will print the single level line and leave every existing invocation byte-identical."
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

`recommend-level.sh` computes one value, the level it recommends, but prints a 16-line report when that value is requested. This packet adds a `--quiet` flag that prints only the `Recommended Level: N (Name)` line and leaves the default report and the `--json` document untouched. The proof is a line count of one for the flag, an empty diff against a captured baseline for the default path, and a passing strict validation run.

**Key Decisions**: `--quiet` reuses the existing level-line label instead of inventing a format (ADR-001); `--quiet` takes precedence over `--json` so the flag always means exactly one line (ADR-001).

**Critical Dependencies**: None beyond the bash 3.2+ and ripgrep that the spec-kit runtime already requires.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-10-26 |
| **Branch** | N/A - created with `--skip-branch`; no branch was cut |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`recommend-level.sh` is called by planning workflows that need one value, the level it recommends. The default text output is a 16-line report and the only machine-readable alternative is a 36-line JSON document, so a shell caller must either parse the report or carry a JSON parser. Neither is a one-line contract, and both couple the caller to formatting it does not need.

### Purpose
Add a `--quiet` flag that prints only the recommended-level line, with no change to any existing invocation.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add a `--quiet` case to the option parser that sets `QUIET_OUTPUT=true`.
- Print exactly `Recommended Level: <level> (<name>)` and nothing else when the flag is set.
- Leave the default text report and the `--json` document byte-identical when the flag is absent.
- Give `--quiet` precedence over `--json` so the flag always means one line.
- Document the flag in the header comment and in `show_help()`.

### Out of Scope
- Changing the scoring algorithm or the level thresholds - the flag changes presentation, not the recommendation.
- Adding another output format such as CSV or TSV - no caller asked for one.
- Changing exit codes or stderr text - the existing 0/1 contract stays.
- Refactoring `output_text()` or `output_json()` - the diff stays in the parser and the dispatch.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh` | Modify | Add the flag, the quiet branch and the help entry |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `--quiet` is accepted in any argument position and sets quiet output. |
| REQ-002 | With `--quiet`, stdout holds exactly one line, `Recommended Level: <0-3> (<Name>)`, and the process exits 0. |
| REQ-003 | Without `--quiet`, stdout is byte-identical to the current output for the same inputs. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | `--quiet` takes precedence over `--json`: passing both still prints the single level line and no JSON. |
| REQ-005 | `show_help()` and the header comment list `--quiet` with a one-line description. |
| REQ-006 | `--quiet` leaves input validation, stderr and exit codes unchanged. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `bash recommend-level.sh --quiet --loc 500 --files 15 | wc -l` prints `1`.
- **SC-002**: `diff` between the captured baseline and a fresh `--loc 500 --files 15` run prints nothing and exits 0.
- **SC-003**: `bash recommend-level.sh --quiet --loc 1000 --files 20 --architectural --api --db` prints `Recommended Level: 3 (Full)`.
- **SC-004**: `bash -n recommend-level.sh` exits 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | bash 3.2+ | The script cannot run | None needed; the script already declares this floor and uses no newer construct |
| Risk | A caller parses the default 16-line report and the change perturbs it | Medium | The quiet branch is additive, and SC-002 diffs the default output against a captured baseline |
| Risk | `--quiet` and `--json` are both passed and a caller expects JSON | Low | ADR-001 fixes precedence to quiet, REQ-004 pins it, and the help text states it |
<!-- /ANCHOR:risks -->

---

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The flag adds no measurable time; three default runs measured 0.00 s real, and the quiet path prints 1 line instead of 16.

### Security
- **NFR-S01**: N/A - the script reads no credential, opens no network connection and writes no file; `--quiet` takes no value, so it adds no input surface.

### Reliability
- **NFR-R01**: Output is deterministic and stateless: the same inputs produce the same line, and the change introduces no temp file or persisted state.

---

## 8. EDGE CASES

### Data Boundaries
- Empty input: `--quiet` with no `--loc` and no `--files` still exits 1 with the existing stderr message; quiet affects stdout only.
- Maximum length: no new value is accepted, because `--quiet` is a boolean, so there is no length boundary to exercise.

### Error Scenarios
- External service failure: N/A - the script calls no external service.
- Network timeout: N/A - the script makes no network call.

### State Transitions
- Partial completion: N/A - the script is stateless and writes no file.
- Session expiry: N/A - there is no session.

### Flag Interactions
- `--help` wins over `--quiet`: `show_help()` runs during parsing and exits 0 before the output dispatch is reached.
- Repeated `--quiet` is idempotent: the second occurrence sets the same global to the same value.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 4/25 | Files: 1, LOC: ~15, Systems: 1 |
| Risk | 3/25 | Auth: N, API: N, Breaking: N |
| Research | 2/20 | One script read; no external research |
| Multi-Agent | 0/15 | Workstreams: 1 |
| Coordination | 1/15 | Dependencies: 0 |
| **Total** | **10/100** | **Level 3** |

The score describes the code change. The packet is Level 3 because the track's level contract asks for the full document set; the extra documents are a documentation obligation, not a complexity signal.

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | A caller parses the default report and the change moves its lines | M | L | The quiet branch is additive; SC-002 diffs the default output against the captured baseline |
| R-002 | Both `--quiet` and `--json` are passed and the caller expects JSON | L | M | ADR-001 fixes precedence and the help text states it |
| R-003 | The flag is accepted but never documented, so it is undiscoverable | L | M | T007 updates the header comment and `show_help()`; CHK-041 checks both |

---

## 11. USER STORIES

### US-001: One parseable level line (Priority: P0)

**As a** planning script that needs the recommended level, **I want** a flag that prints only that line, **so that** I can read the value without parsing a report or carrying a JSON parser.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-002: A discoverable flag (Priority: P1)

**As an** operator reading `--help`, **I want** `--quiet` documented beside the other options, **so that** I can find it without reading the source.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- None. The flag name, the output label and the precedence are fixed in ADR-001, and `--quiet` changes stdout only.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Decision Records**: See ADR-001 in `plan.md`

---
