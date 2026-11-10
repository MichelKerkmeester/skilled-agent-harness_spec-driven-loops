---
title: "Feature Specification: Add a min-percent option to calculate-completeness.sh"
description: "calculate-completeness.sh reports a completion percentage but always exits 0, so callers cannot gate on it. A --min-percent <N> option makes the script fail the process when completion falls below a caller-chosen floor, without changing a byte of its report."
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
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-10-26 |
| **Branch** | `scaffold/001-completeness-min-percent` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`calculate-completeness.sh` computes an `Overall Completion` percentage and then unconditionally runs `exit 0`. Any caller that wants to refuse a packet below a quality floor has to scrape the number out of the human-readable report or the `--json` payload and compare it itself, so the check is reimplemented per caller and drifts from the script's own arithmetic. The script already owns the percentage; it should be able to own the comparison too.

### Purpose
Add a `--min-percent <N>` option so the script's exit status answers "is this packet at or above the floor?" while its printed report stays exactly as it is today.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A `--min-percent <N>` option on `calculate-completeness.sh`, accepted anywhere in the argument list alongside the existing options.
- A threshold gate evaluated after the report is written: exit `3` when the reported completion is below `N`, exit `0` when it is at or above `N`.
- Input validation for `N`: a base-10 integer from `0` to `100`, with a missing value reported as a usage error.
- Help text and the script's trailing exit-code comment updated to describe the new option and status.

### Out of Scope
- Any change to how completion is calculated, which files are scanned, or which placeholders are counted - the feature gates the existing number, it does not redefine it.
- Any change to the text or JSON report - the report is the contract callers already parse.
- Changes to `validate.sh`, `check-completion.sh`, or any other script that might later pass the flag - this packet adds the capability, not its adoption.
- Renumbering the repository-wide spec-script exit-code taxonomy - exit `3` is used here because the feature requires it, and the collision is recorded as a risk rather than resolved here.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh` | Modify | Add the option, its validation, the shared reported-percentage value, the post-output exit gate, and the help/exit-code text |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/calculate-completeness-script.vitest.ts` | Modify | Cover below/at/above threshold, unchanged report, invalid input, and the `--json` and `--file` paths |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `calculate-completeness.sh` accepts `--min-percent <N>` as an option in any position among the existing options, and leaves the gate inactive when the option is absent. | `bash calculate-completeness.sh --min-percent 50 specs/001-x` parses without a usage error; the same folder without the flag still exits `0` as it does today. |
| REQ-002 | With `--min-percent <N>`, the script exits `3` when the reported completion percentage is strictly below `N`, and exits `0` when it is at or above `N`. | A packet measured at 40% exits `3` under `--min-percent 50`, exits `0` under `--min-percent 40`, and exits `0` under `--min-percent 30`. |
| REQ-003 | The report is unchanged: text and `--json` output are byte-identical with and without `--min-percent`. | `diff` of the stdout of the two invocations on the same packet is empty, for both the default and `--json` output modes. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | A missing, non-integer, or out-of-range `N` is rejected with a message on stderr and exit `1`, and no report is printed. | `--min-percent`, `--min-percent abc`, `--min-percent -1` and `--min-percent 101` each exit `1` with an error naming the option; stdout stays empty. |
| REQ-005 | The threshold applies to the percentage the run actually reports: `OVERALL_PERCENTAGE` in folder mode and the single file's completion in `--file` mode, with the gate still active under `--json`. | A `--file` run at 0% under `--min-percent 1` exits `3`; the same run under `--json` preserves both the payload and the status. |
| REQ-006 | `--help` lists `--min-percent <N>` in its OPTIONS block, and the script's trailing exit-code comment documents exit `3`. | `--help` output contains the new option line; the comment block at the end of the file names status `3` and its meaning. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The three threshold outcomes are observable as distinct exit statuses, verified by script invocation rather than by reading the source.
- **SC-002**: A byte-for-byte comparison of the report with and without the flag is empty in both output modes.
- **SC-003**: The existing vitest cases in `calculate-completeness-script.vitest.ts` still pass unchanged, and the new cases cover every row of REQ-001 through REQ-006.

**Acceptance scenarios**

- **Given** a packet whose `Overall Completion` is 40%, **When** the script runs with `--min-percent 50`, **Then** it prints the same report it prints without the flag and exits `3`.
- **Given** the same packet, **When** the script runs with `--min-percent 40`, **Then** it prints that report and exits `0`, because the floor is inclusive.
- **Given** any packet, **When** the script runs with no `--min-percent`, **Then** it exits `0` exactly as it did before the change.
- **Given** a `--min-percent` value that is not an integer from `0` to `100`, **When** the script runs, **Then** it writes a usage error to stderr, prints no report, and exits `1`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `bc`, plus the `find`/`grep`/`wc` coreutils the script already requires | None beyond today's baseline; the gate adds no new binary | Reuse the existing `command -v bc` guard; no new dependency is introduced |
| Dependency | `set -euo pipefail` with `trap ... EXIT` | An unset or empty `N` would abort on `$2` under `set -u` with an unhelpful message, and the trap must still clean the temp directory on the new exit path | Read the value as `${2:-}` before use, and exit only after the report is written so the trap runs normally |
| Risk | Exit `3` collides with the repository's spec-script taxonomy, where `3` means a system error | Medium - a caller that branches on `3` cannot distinguish "below floor" from "I/O failure" | The feature fixes the status at `3`; the collision is documented in the script's exit-code comment so the meaning stays discoverable |
| Risk | The gate must not perturb the report | Medium - a stray `echo` or a reordered statement breaks callers that diff output | Gate after both output functions return, and assert byte equality in the test suite |
| Risk | A caller runs the script under `set -e` and now sees a non-zero status it did not handle | Low - only callers that opt in pass the flag | Opt-in only: with no flag, the status is unchanged |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None. The feature statement fixes the option name, its argument, and the two statuses; the remaining choices (validation bounds, the value compared in `--file` mode) are recorded as requirements rather than left open.
<!-- /ANCHOR:questions -->

---
