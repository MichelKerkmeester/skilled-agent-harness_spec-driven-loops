---
title: "Feature Specification: Add a min-percent option to calculate-completeness.sh"
description: "calculate-completeness.sh reports a completion percentage but always exits 0, so every caller that wants a threshold has to parse stdout. A --min-percent option moves that verdict into the exit status without touching the report."
trigger_phrases:
  - "completeness min percent"
  - "add a min percent option to calculate completeness"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Add a min-percent option to calculate-completeness.sh

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Draft |
| **Created** | 2026-10-26 |
| **Branch** | `scaffold/001-completeness-min-percent` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`calculate-completeness.sh` computes an overall completion percentage and prints it, then ends with an unconditional `exit 0` on the success path. A caller that wants to know whether a packet has reached some threshold has to capture stdout and re-parse either the human report or the `overall_completion` field of the JSON form. That parsing is repeated in every consumer, and it silently diverges whenever the report formatting changes.

### Purpose
Add one option, `--min-percent <N>`, that turns the percentage the script already computes into an exit status: `3` below the threshold, `0` at or above it, with the report output left exactly as it is.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Accept `--min-percent <N>` in the existing argument-parsing loop and consume its value.
- Validate `N` as an integer in the range 0-100, rejecting anything else as a usage error.
- Exit `3` when the completion the run reports is below `N`, and `0` otherwise.
- Document the option in `show_help` and add exit code `3` to the script's exit-code comment block.
- Extend the existing vitest suite for the script with threshold, output-stability and validation cases.

### Out of Scope
- Changing how completion is computed - placeholder patterns, line counting, `bc` rounding and clamping all stay as they are, because the option only reads the value they produce.
- Changing the report - neither the text layout nor the JSON schema gains a threshold field, and neither may drift.
- Changing the meaning of existing exit codes - `0` and `1` keep their current triggers; `3` is additive.
- Adding a short alias for the option - the request names `--min-percent` only.
- Wiring the option into `archive.sh`, hooks or CI - those are separate changes with their own exit-code contracts.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh` | Modify | Add flag parsing, validation, the threshold gate, help text and exit-code documentation |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/calculate-completeness-script.vitest.ts` | Modify | Cover the pass case, the fail case, invalid input and unchanged output |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `--min-percent <N>` is accepted and consumed with its value; the script exits `3` when the completion it reports is below `N` and `0` otherwise. | Against a folder whose reported completion is `C`: `--min-percent $((C + 1))` exits `3`, `--min-percent "$C"` exits `0`, `--min-percent 0` exits `0`. |
| REQ-002 | The report output is unchanged with and without the option, in both text and `--json` form. | On the same folder, stdout of a `--min-percent` run is byte-identical to stdout of the same run without the flag; a `diff` of the two is empty. |
| REQ-003 | An invalid `N` is a usage error: non-integer, negative, above 100, or a missing value each exit `1` with a message on stderr and no report. | `--min-percent abc`, `--min-percent -1`, `--min-percent 101` and a trailing bare `--min-percent` each exit `1`; stdout carries no report. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The gate runs after the report is written, so a failing run still prints its full report before exiting `3`. | An exit-`3` run emits the same complete report as an exit-`0` run. |
| REQ-005 | Without the option the script behaves exactly as before, including exiting `0` on success. | The pre-existing assertions in `calculate-completeness-script.vitest.ts` pass unmodified. |
| REQ-006 | `show_help` lists `--min-percent <N>` and the exit-code comment block records code `3`. | `--help` output names the option; the trailing comment block lists `3 - Completion below --min-percent`. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A caller gates on a threshold with one invocation and no stdout parsing - exit `3` below `N`, `0` at or above `N`.
- **SC-002**: Report output is byte-identical with and without the flag, for both the text and the JSON form.
- **SC-003**: No existing exit path changes and the full vitest suite for the script passes.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | `--file` mode has no Overall Completion - `OVERALL_PERCENTAGE` is initialised to `100` and only recomputed by `calculate_spec_completeness`, so a gate reading it directly would pass every single-file run. | High - the option would silently do nothing in that mode. | Gate on the completion the run actually reports: `OVERALL_PERCENTAGE` for a folder run, the sourced per-file `percentage` for a `--file` run. Covered by a dedicated test. |
| Risk | A caller treats every non-zero exit as "script broke" rather than "below threshold". | Medium | Exit `3` only occurs when the caller passed the flag; help text and the header comment both name it. |
| Risk | Adding the option to `show_help` changes `--help` output, which a strict output comparison could read as a regression. | Low | The stability requirement is scoped to the completeness report; help text must document a new option or it is undiscoverable. |
| Dependency | `bc` for percentage arithmetic, already required at startup. | Low if present | Unchanged - the script already exits `1` with an install hint when `bc` is missing. |
| Dependency | Bash 3.2 compatibility, already a stated constraint of the script. | Low | Use `[[ =~ ]]` and `if` blocks only; no `local -n`, no associative arrays. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

No blocking questions. Two behaviors the request leaves implicit are decided in `plan.md` §3 and carried by REQ-001 and REQ-002:

- **`--file` mode.** The request names Overall Completion, which only a folder run computes. The gate compares against the completion the run reports, so `--file` runs compare their own per-file percentage rather than a value that is never computed.
- **Help text.** "Output unchanged" is read as the completeness report. `show_help` gains the option and the header comment gains exit code `3`, since an undocumented option is unusable.
<!-- /ANCHOR:questions -->

---
