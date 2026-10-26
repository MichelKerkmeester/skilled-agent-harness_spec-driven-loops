---
title: "Feature Specification: Add a min-percent option to calculate-completeness.sh"
description: "Give calculate-completeness.sh a single documented exit-code verdict so a caller can gate on packet completeness without parsing the report."
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
| **Branch** | n/a (packet created with `--skip-branch`) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

`calculate-completeness.sh` reports an Overall Completion percentage and then always exits 0. A caller that needs completeness to gate anything — a CI step, a completion hook, a wrapper script — has to capture the report, parse either the text line or the JSON field, and perform the comparison itself. Every caller re-implements that comparison, and a caller that forgets it treats a half-filled packet as a pass.

### Purpose

Give the script one documented exit-code verdict so completeness can be gated with a single status check instead of output parsing.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- A `--min-percent <N>` option parsed by the existing argument loop in `.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh`
- Validation of `N` as an integer between 0 and 100, with a usage error for anything else
- One post-report comparison that exits 3 below the threshold and 0 at or above it
- Documentation of the option and of exit code 3 in `show_help` and in the script's exit-code footer
- Vitest coverage in the script's existing test file

### Out of Scope

- Any change to the report itself — text body, JSON shape, percentages, status bands and quality warnings must stay byte-identical, because the feature is a verdict only
- A short alias such as `-m` — the request names `--min-percent` only, and the script's other long options carry aliases only where a caller already uses one
- A `--max-percent` counterpart, a config file, or an environment variable for a default threshold — no caller has asked for one
- Changes to any other `spec/*.sh` script or to the repository-wide exit-code taxonomy
- New dependencies — the comparison is integer arithmetic in bash, not a new `bc` call

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh` | Modify | Parse `--min-percent`, validate `N`, apply the post-report verdict, document the option and exit code 3 |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/calculate-completeness-script.vitest.ts` | Modify | Cover threshold pass, threshold fail, invalid `N`, and unchanged output |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `--min-percent <N>` is accepted by the argument loop and is order-independent, so it works before or after the spec folder argument. | `calculate-completeness.sh --min-percent 90 <folder>` and `calculate-completeness.sh <folder> --min-percent 90` both run and report normally. |
| REQ-002 | With `--min-percent N` supplied, the process exits 3 when the completion figure the report presents is below `N`. In folder mode that figure is `Overall Completion`; in `--file` mode it is that file's `Completion`. | A fixture reporting 50% exits 3 with `--min-percent 90` in both folder and `--file` mode. |
| REQ-003 | At or above the threshold the process exits 0, and equality passes. | The same 50% fixture exits 0 with `--min-percent 50` and with `--min-percent 10`. |
| REQ-004 | Output is unchanged by the option: identical stdout, identical stderr, identical JSON, for every invocation that already works. | Byte-compare stdout and stderr from a run with and without `--min-percent` on the same fixture, in text and in `--json` mode; expect no differences. |
| REQ-005 | Without the option the script keeps its current behaviour and exits 0 after a completed report. | The existing test file passes unchanged. |
| REQ-006 | A malformed `N` exits 1 with a usage message on stderr and produces no report. Malformed means missing value, non-integer, or outside 0-100. | `--min-percent abc`, `--min-percent 101`, `--min-percent -1` and a trailing `--min-percent` with no value each exit 1. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | `--help` documents the option and exit code 3, and the footer comment block lists 3 alongside 0 and 1. | `calculate-completeness.sh --help` output contains `--min-percent` and a 3 exit-code line; the footer in the source lists 3. |
| REQ-008 | The verdict runs after the report is written, so a failed gate still emits the full report. | A below-threshold run prints the complete report and then exits 3. |
| REQ-009 | When `--json` and `--min-percent <N>` are passed together, the JSON output gains a boolean field `min_percent_met`, `true` when `Overall Completion` is at or above `N` and `false` otherwise. | A `--json --min-percent 90` run on a fixture reporting 50% emits `"min_percent_met": false`; the same fixture with `--json --min-percent 50` emits `"min_percent_met": true`. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A caller gates on completeness with one status check — exit 3 below the threshold, exit 0 at or above it — and never parses the report.
- **SC-002**: stdout and stderr for any invocation with the option are byte-identical to the same invocation without it, so existing consumers see no change.
- **SC-003**: The option and exit code 3 are discoverable from `--help` and the script footer, without reading the implementation.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Existing `bash` integer arithmetic and the current `bc` percentage path | None — the comparison is integer-only and runs on the value `bc` already produced | n/a |
| Risk | Exit 3 already means "system error" in the repository-wide `spec/*.sh` taxonomy | Medium — a wrapper that reads 3 as "infrastructure broke" could mistake a threshold verdict for a failure to run | Document 3 in `--help` and the footer, keep usage and I/O failures on exit 1, and note that 3 is only reachable after a complete report was written |
| Risk | A bare `[[ ... ]] && exit 3` under `set -euo pipefail` leaves a non-zero status on the false branch | Low — the script's final `exit 0` would mask it today, but the pattern is fragile | Use the explicit `if` form the script already uses for its percentage clamp |
| Risk | `--file` mode never assigns `OVERALL_PERCENTAGE`, which stays at its 100 initial value | Medium — a naive gate would pass a 50% single file against a 90 threshold | Compare against the figure the report prints for the mode, never the global alone |
| Risk | `--min-percent` followed by a path consumes the path as `N` | Low — the run stops with a usage error rather than silently gating on a nonsense value | Reject non-integers explicitly and name the option in the error message |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None outstanding. The two decisions a reader might expect to find here are settled in the sections above: the threshold applies to the figure the report presents in both folder and `--file` mode (REQ-002), and the exit-3 taxonomy collision is accepted with the mitigations listed in §6.
<!-- /ANCHOR:questions -->

---
