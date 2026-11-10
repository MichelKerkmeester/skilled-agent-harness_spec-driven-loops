---
title: "Feature Specification: Add a min-percent option to calculate-completeness.sh"
description: "calculate-completeness.sh computes a completion percentage but always exits 0, so a caller that needs a threshold has to parse its text or JSON output. A --min-percent <N> option lets the caller gate on that percentage with one flag and an exit-status check, while the report itself stays byte-identical."
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
| **Status** | Planned |
| **Created** | 2026-10-26 |
| **Branch** | detached HEAD (packet created with `--skip-branch`) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`calculate-completeness.sh` already knows the one number a caller wants: it prints `Overall Completion: <N>%` in text mode and `"overall_completion": <N>` in JSON mode, then ends with an unconditional `exit 0`. A caller that needs to know whether a packet clears a threshold therefore has to capture stdout and parse it, and that parsing differs per output mode (`--json`, `--verbose`, `--file`) and per locale-sensitive status word. Every such caller re-implements the same fragile extraction, and a text-format change breaks them silently.

### Purpose
A caller passes `--min-percent <N>` once and branches on the exit status, so "is this packet at least N% complete?" becomes a single command with no stdout parsing, and the report it already prints is unchanged.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Parse `--min-percent <N>` (long form, space-separated value) in the existing argument loop, alongside `--verbose`, `--json`, `--quality` and `--file`.
- Reject an invalid `N` — non-integer, negative, greater than 100, or a missing value — with a usage error on stderr and exit 1.
- Apply the threshold after the report is written: exit 3 when the reported completion percentage is below `N`, exit 0 otherwise. A percentage exactly equal to `N` passes.
- Apply the same gate in text mode, JSON mode, and `--file` single-file mode.
- List the option in the `show_help()` output and the header `# Options:` line, and document exit code 3 in the trailing exit-code comment block.

"Output is unchanged" here means the completeness report — the text block and the JSON document. The `--help` listing and the header comment gain the new option, which is the only user-visible text difference.

### Out of Scope
- The `--min-percent=<N>` equals form and a short alias such as `-m` — not requested; the space-separated long form is enough for a first version.
- Any change to the percentages, status words, JSON keys, or per-file breakdown the report already prints.
- Gating on individual per-file percentages in `--verbose` mode — only the percentage the report presents as the overall result is compared.
- Changing the existing exit codes 0 (success) and 1 (error), or the error paths that produce them.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh` | Modify | Option parsing, `N` validation, threshold gate, help and exit-code documentation |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/calculate-completeness-script.vitest.ts` | Modify | Cases for pass, below-threshold, invalid value, and unchanged report output |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `--min-percent <N>` is accepted without changing the report | stdout and stderr for `--json <folder>` are byte-identical to `--json <folder> --min-percent 0`; same comparison in text mode with `diff` reporting no difference |
| REQ-002 | Exit 3 when the reported completion is below `N` | On a fixture whose report says `Overall Completion: 80%`, `--min-percent 81` exits 3 |
| REQ-003 | Exit 0 when the reported completion is at or above `N` | On the same 80% fixture, `--min-percent 80` and `--min-percent 0` both exit 0 |
| REQ-004 | Behavior without the option is untouched | The two existing cases in `calculate-completeness-script.vitest.ts` pass without edits; a missing folder still exits 1 and a valid folder still exits 0 |
| REQ-005 | Invalid `N` is a usage error, never a threshold verdict | `--min-percent abc`, `--min-percent -1`, `--min-percent 101` and a trailing `--min-percent` with no value each exit 1 with a message on stderr |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | The gate covers `--file` and `--json` modes using the percentage the report presents | A single file reporting `Completion: 80%` exits 3 with `--min-percent 81` and 0 with `--min-percent 80`; the JSON mode verdict matches the text mode verdict for the same fixture |
| REQ-007 | The option is discoverable | `--help` output contains `--min-percent` and states the exit-3 condition |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A caller gates on completion with one flag and one exit-status comparison, with no stdout parsing.
- **SC-002**: For a given folder state, the report bytes are identical with and without the option, in both text and JSON modes.
- **SC-003**: The script's exit-status vocabulary stays unambiguous: 0 means success and at-or-above threshold, 1 means it could not run, 3 means it ran and the result is below the threshold.
- **SC-004**: `npx vitest run .skilled/skills/system-spec-kit/runtime/cli/tests/calculate-completeness-script.vitest.ts --config .skilled/skills/system-spec-kit/vitest.config.ts --project cli` passes with the new cases included.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `bc`, already required by the script | None new — the script aborts with a clear error if `bc` is absent | The comparison itself is integer-only, so the gate adds no `bc` call |
| Risk | `set -euo pipefail` at the top of the script | A bare `[[ ... ]]` test as the last command of a branch can exit early before the report is written; the file already documents this at the percentage clamp | Write the gate as a full `if` block and keep an explicit `exit` as the script's last statement |
| Risk | Comparing the wrong percentage in `--file` mode | The verdict disagrees with the number the report printed | Derive the gate value from the same source the output path uses, rather than recomputing it |
| Risk | An invalid `N` surfacing as 3 | "Below threshold" and "bad input" become indistinguishable to a caller | Validate `N` during argument parsing, before any calculation, and exit 1 there |
| Risk | Bash 3.2 compatibility | A construct such as `${var,,}` or an associative array fails on the macOS system bash | Keep to `[[ =~ ]]`, integer comparison, and the globals the script already declares |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking. One interpretive decision was made during authoring and is worth confirming before implementation:

- The request says the script exits 3 when "its Overall Completion" is below `N`. In `--file` mode the report has no `Overall Completion` line — it prints `Completion: <N>%` for that one file. REQ-006 reads the rule as "the percentage the report presents as the result", so `--file` plus `--min-percent` gates on the single file. If the intent was folder-only gating, the alternative is to reject the combination as a usage error (exit 1) instead.
<!-- /ANCHOR:questions -->

---
