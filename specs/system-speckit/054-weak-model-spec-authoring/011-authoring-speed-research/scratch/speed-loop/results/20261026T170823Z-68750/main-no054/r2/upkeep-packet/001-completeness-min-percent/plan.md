---
title: "Implementation Plan: Add a min-percent option to calculate-completeness.sh"
description: "Adds a --min-percent flag to the completeness calculator: parse and validate an integer floor, then exit 3 when the percentage the report already prints falls below it. The report itself is untouched."
trigger_phrases:
  - "completeness min percent plan"
  - "min percent flag implementation plan"
  - "completeness threshold exit plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Add a min-percent option to calculate-completeness.sh

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash 3.2-compatible shell, `set -euo pipefail`, `bc` for percentages |
| **Framework** | None - a single command-line script |
| **Storage** | None; per-file stats are written to a temporary directory that a trap removes |
| **Testing** | Vitest via `.skilled/skills/system-spec-kit/runtime/cli/tests/calculate-completeness-script.vitest.ts` |

### Overview

The script already computes one percentage per run: `OVERALL_PERCENTAGE` in spec-folder mode and the sourced `percentage` in `--file` mode. The option adds a validated floor and one comparison after the report is written, so the exit status reflects the same integer a caller reads on stdout. No calculation, formatting or output function changes.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Single-pass argument parser feeding a report writer, with the exit status decided at the end of the run. The option adds a value to the parser and a comparison at the exit point; it does not add a stage between calculation and output.

### Key Components

- **Option parser (`while [[ $# -gt 0 ]]` block, §8)**: gains a `--min-percent` case that stores the value in a new `MIN_PERCENT` global and validates it before the report runs.
- **`MIN_PERCENT` global (§3)**: empty by default, which is how "no gate requested" is represented without a second boolean.
- **`show_help` (§4)**: gains the option line, its range and the exit-3 meaning.
- **`output_text` / `output_json` (§7)**: unchanged. They remain the only writers of the report.
- **Exit point (§8, after the report call)**: the existing `exit 0` becomes a conditional that returns 3 when a floor was supplied and the reported percentage is below it.

### Data Flow

Arguments are parsed into globals; the run computes stats; the report function writes stdout; then the gate reads the same percentage variable the report used (`OVERALL_PERCENTAGE` for a folder, the sourced per-file `percentage` for `--file`) and chooses the exit status. Because the gate sits after the report call, stdout is fully written before the status is decided, so a below-floor run still shows the caller why it failed.

### Decisions

- **Gate the printed integer, not the raw ratio.** `printf "%.0f"` already rounds, and the report shows that rounded value. Comparing the unrounded value would let a 79.6% packet fail a `--min-percent 80` gate while printing 80%, which no caller could reconcile.
- **Exit 3, not 2.** The task contract fixes 3 for below-threshold. Exit 2 is reserved for validation errors elsewhere in the spec-script family, and this script validates no packet.
- **`--file` mode gates the per-file percentage.** That mode never computes an Overall Completion, and rejecting the combination would make the option unusable on the one surface where a single document is checked. The alternative, silently ignoring the floor in `--file` mode, would let a gate pass without ever being evaluated.
- **An empty `MIN_PERCENT` means no gate.** A sentinel such as `-1` would need its own validation path; an empty string cannot be mistaken for a floor of 0, and `0` is a legal value that must always pass.
- **Validate during parsing, before the report.** A rejected value exits 1 with no report, so a caller can never mistake an unvalidated run for a passed gate.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Extend the existing Vitest file, which already builds temporary spec folders and runs the script through `spawnSync`. New cases:

- A folder below the floor returns 3; the same folder at the floor returns 0.
- `--min-percent 0` returns 0 on any folder, including an empty one.
- Out-of-range, non-numeric and missing values each return 1 and write an `ERROR:` line to stderr.
- stdout from a text run and a `--json` run is identical with and without the option.
- The existing two cases still pass unchanged, proving the default path is untouched.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

`bc` stays a hard dependency for percentage arithmetic; the gate adds none. The script must keep running under Bash 3.2, so no associative arrays, no `${var,,}` and no `mapfile`.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the two files in the Files to Change table. The option is additive and defaults to off, so no caller needs a migration and no stored state changes.
<!-- /ANCHOR:rollback -->

---
