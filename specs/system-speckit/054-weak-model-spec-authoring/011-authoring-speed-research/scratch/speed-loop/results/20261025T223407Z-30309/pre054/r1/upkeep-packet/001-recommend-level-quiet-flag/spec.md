---
title: "Feature Specification: Add a quiet flag to recommend-level.sh"
description: "recommend-level.sh prints a multi-line report, so a caller that needs only the level has to parse text or add a JSON parser. A --quiet flag prints the single level line and leaves every existing invocation unchanged."
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

`recommend-level.sh` answers one question: which documentation level does this change need? It answers inside a multi-line report. A scripted caller that wants only the answer has to parse that report or pipe the JSON mode through a JSON parser. This packet adds a `--quiet` flag that prints the level line and nothing else, and leaves every existing invocation byte-for-byte unchanged.

**Key Decisions**: `--quiet` is a third output mode and is mutually exclusive with `--json` (ADR-001 in `plan.md`). The quiet line and the text report's level line come from one formatter, so they cannot drift apart.

**Critical Dependencies**: The existing node smoke-test harness (`npm run test:legacy`) must run the new test. No new dependency is added.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P2 |
| **Status** | Draft |
| **Created** | 2026-10-25 |
| **Branch** | `scaffold/001-recommend-level-quiet-flag` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

`recommend-level.sh` prints a level, a score, a confidence figure, a four-line breakdown and a phase section. A caller that needs only the level gets that whole block:

```bash
LEVEL=$(bash .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh --loc 500 --files 15)
```

That assignment holds a blank line, the level line, the score line and the rest. The caller either parses line 2 or adds `--json` plus a JSON parser to the pipeline. Neither fits a shell one-liner, and the JSON mode exists for structured consumers, not for this.

### Purpose

One invocation returns the level line and nothing else, while every existing invocation keeps its current output.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- `--quiet` in the argument parser, the file header OPTIONS block and `show_help`
- One output function that prints only the level line
- A shared level-line formatter used by the text report and the quiet path
- A guard that rejects `--quiet` with `--json`
- A node smoke test covering quiet output, default output and the guard
- Registration of that test in `runtime/cli/package.json` under `test:legacy`

### Out of Scope

- A `-q` short alias - the request names `--quiet` only, and a short flag is a separate compatibility decision
- Changes to scoring, phase scoring, confidence or exit codes - the flag changes output selection only
- Changes to the default text or JSON output - REQ-003 forbids them
- The flag table in `references/workflows/execution-methods.md` - that table already omits `--loc`, `--files`, `--json` and `--no-recommend-phases`, so bringing it up to date is a separate doc pass
- Other spec scripts (`create.sh`, `validate.sh`, `archive.sh`) - each owns its own output contract

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh` | Modify | Parse `--quiet`, add the quiet output path and the mode guard, document the flag |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/test-recommend-level.js` | Create | Assert quiet output, unchanged default output and the `--quiet --json` error |
| `.skilled/skills/system-spec-kit/runtime/cli/package.json` | Modify | Add the new test file to `test:legacy` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `--quiet` is accepted anywhere in argv and turns quiet mode on. |
| REQ-002 | Quiet mode writes exactly one line to stdout, `Recommended Level: <N> (<Name>)`, and nothing else. |
| REQ-003 | Every invocation without `--quiet` keeps its current stdout byte-for-byte, in both text and JSON modes. |
| REQ-004 | Quiet mode keeps the existing exit codes: 0 on success, 1 on a usage error, with the error text on stderr and no stdout. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | `--quiet` appears in the file header OPTIONS block and in `show_help`. |
| REQ-006 | `--quiet` combined with `--json` exits 1 and writes `ERROR: --quiet cannot be combined with --json` to stderr. |
| REQ-007 | The quiet line and the text report's level line come from one formatter, so their bytes match. |
| REQ-008 | A node smoke test covers quiet output, unchanged default output and the `--quiet --json` guard, and runs under `npm run test:legacy`. |
| REQ-011 | With `--quiet`, any warning the script writes to stderr is still written to stderr, so `--quiet` trims stdout only. |

### P2 - Optional

| ID | Requirement |
|----|-------------|
| REQ-009 | A repeated `--quiet` is idempotent. |
| REQ-010 | Quiet mode leaves scoring, phase computation and confidence untouched. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: **Given** `--loc 500 --files 15 --auth --api --db --architectural`, **When** the script runs with `--quiet`, **Then** stdout is exactly `Recommended Level: 3 (Full)` plus a newline and the exit code is 0.
- **SC-002**: **Given** the same inputs, **When** the script runs without `--quiet`, **Then** stdout matches the baseline captured before the change, byte for byte.
- **SC-003**: **Given** `--quiet --json`, **When** the script runs, **Then** the exit code is 1, stdout is empty and stderr names the conflict.
- **SC-004**: **Given** `--quiet` with no `--loc` and no `--files`, **When** the script runs, **Then** the exit code is 1 and stdout is empty.
- **SC-005**: **Given** `--quiet --quiet`, **When** the script runs, **Then** stdout holds one line.
- **SC-006**: **Given** `--quiet --no-recommend-phases`, **When** the script runs, **Then** stdout holds the same single level line.
- **SC-007**: **Given** `--help`, **When** the script runs, **Then** the help text lists `--quiet`.
- **SC-008**: **Given** `--loc 50 --files 2 --json`, **When** the script runs, **Then** the JSON keys and values match the baseline.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Node and bash, already required by `npm run test:legacy` | The new test cannot run | Run the script by hand in a shell |
| Dependency | `runtime/cli/package.json` `test:legacy` entry list | The test is not run by CI | Add the entry in the same commit as the test |
| Risk | The shared formatter changes the text report's spacing | Medium | Golden-output assertion in the new test |
| Risk | A caller passes `--quiet` and `--json` together | Low | Exit 1 with a named error (ADR-001) |
<!-- /ANCHOR:risks -->

---


## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance

- **NFR-P01**: No measurable runtime change. Quiet mode adds one string comparison to an invocation that already runs in milliseconds.
- **NFR-P02**: The quiet line is one line of at most 40 bytes for every level name in the table.

### Security

- **NFR-S01**: The flag reads no files, environment variables or secrets. It selects an output path.
- **NFR-S02**: No new value reaches the scoring arithmetic, so the flag cannot shift a recommendation.

### Reliability

- **NFR-R01**: Same inputs produce the same line on every run, with no ordering or locale dependence.
- **NFR-R02**: The script stays bash 3.2 compatible, the default shell on macOS.

---

## 8. EDGE CASES

### Data Boundaries

- Empty argv: `--quiet` alone hits the existing "At least --loc or --files must be provided" error and exits 1.
- Zero values: `--loc 0 --files 0` is the same error.
- Non-numeric input: `--loc abc` exits 1 before any output.
- Flag at the end of argv: the parser consumes it as a standalone flag.
- Repeated flag: idempotent, one line.

### Error Scenarios

- `--quiet --json`: exit 1, named error on stderr, no stdout.
- `--quiet --help`: `show_help` runs during parsing and exits 0 with the help text, so help wins over quiet.
- Unknown option after `--quiet`: exit 1 with the existing unknown-option error.
- `--quiet` with a non-numeric `--phase-threshold`: exit 1 with the existing numeric error.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 8/25 | Files: 3, LOC: about 80, Systems: 1 shared CLI script |
| Risk | 10/25 | Auth: N, API: N, Breaking: N, but the stdout contract is consumed by two command assets |
| Research | 5/20 | Existing output functions, help text and test harness read. No unknowns left |
| Multi-Agent | 0/15 | Workstreams: 1 |
| Coordination | 5/15 | Header comment, help text, formatter and test must agree |
| **Total** | **28/100** | **Level 3 declared**. `recommend-level.sh --loc 80 --files 2` returns 14/100 and Level 0, so the level here is documentation depth for a shared CLI, not a scoring result |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Default text output drifts while the level line moves into a formatter | M | M | Golden-output assertion in the new test |
| R-002 | A caller passes `--quiet` and `--json` together | L | M | Exit 1 with a named error |
| R-003 | The quiet line diverges from the text report's line | L | L | Both call `format_level_line` |
| R-004 | The flag name collides with a later option | L | L | Documented in the header and in `show_help` |
| R-005 | A bash 3.2 incompatibility slips in | L | L | No new builtin or array syntax |

---

## 11. USER STORIES

### US-001: One-line level for a shell caller (Priority: P0)

**As a** script author, **I want** one invocation to print only the recommended level, **so that** I can capture it in a variable without parsing a report.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-002: An unchanged report for everyone else (Priority: P1)

**As a** maintainer of the spec workflow, **I want** the existing report to stay byte-identical, **so that** the two command assets that consume the JSON mode keep working without a change.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- **Resolved 2026-10-25: how `--quiet` and `--json` interact.** They are mutually exclusive, and the pair exits 1 (ADR-001). Silent precedence and a silent no-op both hide the contradiction from the caller.
- **Resolved 2026-10-25: whether to add `-q`.** No. The request names `--quiet`, and a short flag is a separate compatibility decision. It stays out of scope.
- **Resolved 2026-10-25: whether quiet skips phase scoring.** No. Scoring is untouched; only the output selection changes (REQ-010). Skipping the computation would make quiet mode a second code path through the scoring functions.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Decision Records**: See ADR-001 in `plan.md`

---

