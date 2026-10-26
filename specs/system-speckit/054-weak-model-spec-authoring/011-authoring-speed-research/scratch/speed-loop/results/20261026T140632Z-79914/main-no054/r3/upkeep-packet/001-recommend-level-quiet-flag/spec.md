---
title: "Feature Specification: Add a quiet flag to recommend-level.sh"
description: "recommend-level.sh always prints a nine-line human report, so any caller that only wants the recommended level has to parse the first line out of the noise. This packet adds a --quiet flag that prints only the recommended-level line while leaving every existing invocation's output byte-for-byte unchanged."
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

`recommend-level.sh` answers one question — which documentation level does this task need — but its text output buries that answer in a nine-line report with a score, a confidence percentage, a per-factor breakdown and a phase-recommendation block. Shell callers that want the level have to cut the first line out with `head -1` and strip the label themselves. A `--quiet` flag gives them a one-line answer, and every existing invocation keeps exactly the output it has today.

**Key Decisions**: `--quiet` affects text output only, so `--json` still wins when both are passed; the suppression lives in `output_text()` rather than in `main` so the output layer stays the only place that decides what is printed.

**Critical Dependencies**: None. The change is confined to one shell script and uses no new binary or library.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P2 |
| **Status** | Draft |
| **Created** | 2026-10-26 |
| **Branch** | current branch (folder created with `--skip-branch`) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

`.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh` prints its answer through `output_text()`, which emits a blank line, the `Recommended Level: N (Name)` line, a score and confidence line, a blank line, a six-row breakdown and, unless `--no-recommend-phases` is passed, a four-to-five-line phase recommendation block. A caller that only needs the level must know the answer sits on line two, must slice it out, and must strip the `Recommended Level: ` prefix before it has a usable value. The JSON mode is the existing machine-readable answer, but it carries the whole scoring model, so it is the wrong shape for a prompt or a log line that wants one word.

### Purpose

Add a `--quiet` flag that makes the script print only its final recommended-level line, so a caller can read the level without parsing, and so no existing caller's output changes.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- A new `--quiet` option accepted by the argument loop in `recommend-level.sh`.
- Text output suppressed to the single `Recommended Level: N (Name)` line when `--quiet` is set.
- `--quiet` documented in both the file-header `OPTIONS` block and the `show_help()` text.
- A stated precedence rule for `--quiet` combined with `--json`.
- Manual verification that output without the flag is unchanged, and that scores, levels, stderr messages and exit codes are untouched by the flag.

### Out of Scope

- A short alias such as `-q` - the operator asked for `--quiet` only, and an alias is a separate decision about the option surface.
- Any change to the scoring algorithm, the level thresholds, the confidence model or the phase recommendation - the flag changes presentation only.
- Any change to `output_json()` or to the JSON schema - `--json` callers already get a machine-readable answer.
- Changes to `create.sh`, `validate.sh` or any other script that may later want to call `recommend-level.sh --quiet` - wiring a caller is a separate packet.
- Automated test fixtures for the new flag - this packet's verification is manual and the existing phase test scripts are used as the regression check.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh` | Modify | Add the `QUIET` global, the `--quiet` case in the argument loop, the single-line branch in `output_text()`, and the help entries |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The argument loop accepts `--quiet` as a boolean flag and does not consume a value, so it composes with every existing option in any position. |
| REQ-002 | With `--quiet` and without `--json`, stdout carries exactly one non-empty line, `Recommended Level: <level> (<name>)`, and nothing else. |
| REQ-003 | Without `--quiet`, text output is unchanged for every input, including the blank lines, the breakdown and the phase recommendation block. |
| REQ-004 | With `--json`, output is the existing JSON document whether or not `--quiet` is also present; `--quiet` never turns JSON into prose. |
| REQ-005 | `--quiet` does not change the computed level, score or confidence, does not suppress `ERROR:` lines on stderr, and does not change any exit code. |
| REQ-008 | With `--quiet`, any warning the script writes to stderr is still written to stderr: the flag trims stdout only and never silences, redirects or reformats a stderr warning. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-006 | Both help surfaces list `--quiet`: the `OPTIONS` block in the file header comment and the `OPTIONS` block printed by `show_help()`. |
| REQ-007 | `--quiet --help` still prints the full help text and exits 0, because an explicit help request outranks a quiet run. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `recommend-level.sh --loc 50 --files 2 --quiet` prints exactly one line, `Recommended Level: 0 (Quick)`, and `wc -l` reports 1.
- **SC-002**: The same invocation without `--quiet` still prints the score line, the breakdown and the phase recommendation block, byte-identical to the pre-change output captured before the edit.
- **SC-003**: `recommend-level.sh --loc 50 --files 2 --json --quiet` still parses as JSON and reports `recommended_level: 0`.
- **SC-004**: The existing phase test scripts (`test-phase-validation.js`, `test-phase-system.js`) pass unchanged.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Bash 3.2 (macOS default) | The new code must avoid bash 4 features such as associative arrays | Follow the existing script's bash 3.2-compatible style; `QUIET=false` is a plain string global |
| Dependency | Existing callers that read line 2 of stdout | A caller that slices by line number breaks if the quiet branch ever runs unasked | `--quiet` defaults to off and the default path is untouched |
| Risk | `--quiet` accidentally applied to JSON output | Machine consumers receive prose instead of JSON and fail to parse | ADR-001 in `plan.md` fixes `--json` precedence, and AC-004 verifies it |
| Risk | Help text drifts from behaviour | A reader cannot discover the flag | REQ-006 updates both help surfaces and AC-007 checks the printed help |
| Risk | Output comparison done by eye rather than by diff | A silent change to the default report goes unnoticed | Capture the pre-change output to a file first and diff after, per AC-003 |
<!-- /ANCHOR:risks -->

---


## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The flag adds one string comparison per invocation, so runtime stays within noise of the current script on the same inputs.

### Security
- **NFR-S01**: No new input is accepted from the environment or from a file; `--quiet` is a literal token with no value, so no new parsing surface exists.

### Reliability
- **NFR-R01**: The default output path is unchanged, so every existing invocation keeps its current behaviour; the flag is additive and reversible by removing one case arm.

---

## 8. EDGE CASES

### Data Boundaries
- Empty input: no `--loc` and no `--files` still fails with `ERROR: At least --loc or --files must be provided` on stderr and exit 1, whether or not `--quiet` is set.
- Maximum length: a level-3 input at the scale ceiling (`--loc 1000 --files 20 --architectural --api --db`) prints `Recommended Level: 3 (Full)` as its single line under `--quiet`.

### Error Scenarios
- External service failure: not applicable - the script reads no network or external service.
- Network timeout: not applicable - no network call exists in the script.
- Missing option value: `--quiet --loc` with no number still prints `ERROR: --loc requires a numeric value` to stderr and exits 1, because the argument loop validates the value before output begins.
- Unknown option: `--quiet --bogus` still prints `ERROR: Unknown option: --bogus` to stderr and exits 1.
- Repeated flag: `--quiet --quiet` is idempotent and still prints one line.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 5/25 | Files: 1, LOC: roughly 15 added, Systems: 1 shell script |
| Risk | 5/25 | Auth: N, API: N, Breaking: N - default output is unchanged |
| Research | 2/20 | The script and its two phase test scripts were read; no external investigation needed |
| Multi-Agent | 0/15 | Workstreams: 1 |
| Coordination | 3/15 | Dependencies: none outside the one script |
| **Total** | **15/100** | **Level 3 by dispatch directive, not by score** |

The feature scores as a Level 1-sized change. Level 3 is the packet level the dispatch that created this folder set with `create.sh --level 3`, and this document records that rather than inventing complexity the work does not have.

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | The quiet branch is placed in `main` and suppresses output a future caller needs | M | L | Put the branch in `output_text()` per ADR-002, so only the text formatter decides text |
| R-002 | `--quiet` silently swallows the JSON document | H | L | ADR-001 gives `--json` precedence; AC-004 asserts the JSON still parses |
| R-003 | The header comment and `show_help()` disagree | L | M | REQ-006 names both surfaces; AC-007 reads the printed help |
| R-004 | Default output shifts by a blank line or a trailing newline | M | L | AC-003 diffs against a captured pre-change baseline |

---

## 11. USER STORIES

### US-001: One-line answer for shell callers (Priority: P0)

**As a** script or agent that needs the documentation level for a task, **I want** `recommend-level.sh --quiet` to print only the recommended-level line, **so that** I can read the level without slicing stdout or stripping a label.

**Acceptance criteria:** see `acceptance-criteria.md` (AC-002, AC-005).

---

### US-002: Existing callers keep their output (Priority: P0)

**As a** maintainer of anything that already runs `recommend-level.sh`, **I want** the default output to stay exactly as it is, **so that** adding the flag cannot break a caller that parses the full report.

**Acceptance criteria:** see `acceptance-criteria.md` (AC-003).

---

### US-003: Discoverable option (Priority: P1)

**As a** person reading `recommend-level.sh --help`, **I want** `--quiet` listed with the other options, **so that** I can find the flag without reading the source.

**Acceptance criteria:** see `acceptance-criteria.md` (AC-007).

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- None. The operator fixed the scope: one flag, one script, default output unchanged. The `--json` precedence question is settled in ADR-001 rather than left open.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Decision Records**: See `plan.md` (ADR-001 and ADR-002)

---
