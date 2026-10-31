---
title: "Feature Specification: Add a quiet flag to recommend-level.sh"
description: "recommend-level.sh prints a nine-line report for every call, so a caller that only needs the level must parse or filter the output."
trigger_phrases:
  - "recommend level quiet flag"
  - "add a quiet flag to recommend level sh"
  - "recommend-level quiet output"
  - "scripted level recommendation"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Add a quiet flag to recommend-level.sh

<!-- SPECKIT_LEVEL: 3 -->


---

## EXECUTIVE SUMMARY

Adds a --quiet switch to recommend-level.sh so scripted callers read the recommended level from one stdout line instead of parsing the full report. The default report stays byte-identical, and the flag changes no score, no threshold and no exit code.

**Key Decisions**: `--json` keeps precedence over `--quiet`; one shared formatter owns the level line; no short alias is added.

**Critical Dependencies**: The existing bash 3.2 runtime and the two regression suites that already execute this script.

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
recommend-level.sh prints a nine-line report for every call, so a caller that only needs the level must parse or filter the output. The report opens with a blank line, then the level line, then the score, the breakdown and the phase section. A shell caller reaches for `sed`, `grep` or `tail` and binds to a layout the script never promised to keep. The `--json` mode is the only supported machine surface today, and it returns far more than the one value a caller wanted.

### Purpose
Let a caller ask for the recommended level alone, in one line, without changing what every existing invocation prints.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A `--quiet` boolean option on `recommend-level.sh` that prints only the final recommended-level line.
- A shared formatter for that line so the quiet and default paths cannot drift apart.
- Header comment and `show_help` text for the new option.
- A regression test that covers quiet, default, quiet with JSON, quiet with phase output disabled, and quiet with invalid input.

### Out of Scope
- Any change to scoring, thresholds, phase scoring or confidence math. The flag selects output, nothing else.
- A `-q` short alias. The request names `--quiet` only, and a short alias can be added later without breaking anything.
- Changes to `--json` payload shape or key set. Existing tests parse that payload.
- Changes to `create.sh`, the validator, or any caller that already shells out to this script.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh` | Modify | Add the flag, the shared level-line formatter, the quiet output path and the help text |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/recommend-level-quiet.vitest.ts` | Create | Fixture matrix for quiet, default, quiet plus JSON, quiet plus no-phase and invalid input |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Without `--quiet`, stdout and exit codes stay byte-identical to the current script for every existing option combination. |
| REQ-002 | With `--quiet`, stdout carries exactly one line, `Recommended Level: <level> (<name>)`, with no leading blank line, no score line, no breakdown and no phase section. |
| REQ-003 | `--json` keeps precedence. `--quiet --json` emits the unchanged JSON document, and no plain-text level line is added to it. |
| REQ-004 | `--quiet` changes no validation, scoring, error text or exit code. Errors stay on stderr, and an invalid invocation prints nothing to stdout. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | The header comment OPTIONS block and `show_help` both document `--quiet` with the same wording as the implementation. |
| REQ-006 | A regression test covers default output, quiet output, quiet with `--json`, quiet with `--no-recommend-phases`, quiet with invalid input and repeated `--quiet`. |
| REQ-007 | With `--quiet`, every warning the script writes to stderr is still written to stderr; `--quiet` trims stdout only and never suppresses or redirects a diagnostic. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `recommend-level.sh --loc 200 --files 5 --api --quiet` prints `Recommended Level: 1 (Baseline)` and nothing else.
- **SC-002**: `recommend-level.sh --loc 200 --files 5 --api --quiet --json` produces the same JSON document as `--json` alone, and that document still parses.
- **SC-003**: A byte diff of stdout for the six baseline invocations, run with and without the change, reports no difference when `--quiet` is absent.
- **SC-004**: The new test file and both existing suites pass.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `bash` 3.2 or newer, the shell macOS ships | The script cannot run at all if absent | The change adds no bash 4 construct; it reuses the existing `[[ ]]` and `case` forms |
| Dependency | `.skilled/skills/system-spec-kit/runtime/cli/tests/test-phase-system.js` and `test-phase-validation.js` | A parse-arm mistake could break JSON consumers these suites cover | Run both suites in Phase 3 before claiming completion |
| Risk | The quiet line drifts from the default report's level line | Two different formats for the same value | Both paths call one formatter; a test compares the two lines for the same inputs |
| Risk | `--quiet` masks a failure by printing an empty stdout | A caller reads silence as success | Errors keep writing to stderr and keep their exit codes; the test asserts exit 1 and empty stdout |
| Risk | A caller combines `--quiet` and `--json` and gets text where it expected JSON | Broken JSON parse downstream | JSON precedence is explicit, documented and tested |
<!-- /ANCHOR:risks -->

---


## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The flag adds no measurable work. The script stays a single scoring pass and finishes each documented fixture in under 100 ms on the reference machine.

### Security
- **NFR-S01**: `--quiet` introduces no new input surface. It reads no file, no environment variable and no network resource, and it cannot widen what the script already accepts.

### Reliability
- **NFR-R01**: Exit codes stay `0` for success and `1` for user error, and `set -euo pipefail` stays in force.

---

## 8. EDGE CASES

### Data Boundaries
- Zero inputs: `--loc 0 --files 0 --quiet` fails validation on stderr with exit 1 and prints no stdout line.
- Maximum inputs: `--loc 1000000 --files 1000000 --quiet` hits the score caps and still prints one line.
- Repeated flag: `--quiet --quiet` behaves like a single `--quiet`.

### Error Scenarios
- Unknown option: `--quiet --bogus` keeps the existing `ERROR: Unknown option` message on stderr and exit 1.
- Missing option value: `--quiet --loc` keeps the existing `ERROR: --loc requires a numeric value` message on stderr and exit 1.
- Help ordering: `--quiet --help` prints the full help and exits 0, because the help arm exits during parsing before any output selection runs.
- JSON ordering: `--quiet --json` prints JSON only, and `--json --quiet` does the same, so argument order does not decide the winner.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 6/25 | Files: 2, LOC: about 30, Systems: 1 |
| Risk | 4/25 | Auth: No, API: No, Breaking: No, additive flag only |
| Research | 4/20 | One script read end to end; no external research |
| Multi-Agent | 0/15 | Workstreams: 1 |
| Coordination | 3/15 | One production file plus one test file |
| **Total** | **17/100** | **Declared Level 3 by the authoring request, not by the score** |

The recommender would place a 17-point change at Level 0. This packet is Level 3 because the authoring request asked for a Level 3 packet, and the extra structure is deliberate documentation rather than a complexity claim.

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Quiet and default output diverge as the report changes | M | M | One shared formatter and a test that compares both lines |
| R-002 | A quiet failure looks like an empty success | H | L | Errors stay on stderr with exit 1; the test asserts both |
| R-003 | JSON consumers receive text | H | L | `--json` precedence plus a JSON-parse assertion in the test |
| R-004 | The new parse arm swallows a neighbouring flag | M | L | Place the arm beside the other booleans and run both existing suites |
| R-005 | Help text describes behavior the code does not have | L | M | REQ-005 ties the help wording to the implementation, reviewed in the same diff |

---

## 11. USER STORIES

### US-001: Read the level from a script (Priority: P0)

**As a** shell script or hook that needs one number, **I want** `recommend-level.sh --quiet` to print only the level line, **so that** I can read it without parsing a human report.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-002: Keep the current report (Priority: P0)

**As a** person running the script by hand, **I want** the existing report unchanged when I omit the flag, **so that** nothing I read today moves or disappears.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-003: Discover the flag (Priority: P1)

**As a** person reading `--help`, **I want** `--quiet` listed with the other options, **so that** I can find it without reading the source.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- Should the quiet line ever include the score, for a caller that wants to log both values? The current answer is no, because the request names the level line only.
- Should `-q` become an alias later? Deferred; the flag can gain an alias without a breaking change.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Decision Records**: See `plan.md` L3 Architecture Decision Record, ADR-001

---
