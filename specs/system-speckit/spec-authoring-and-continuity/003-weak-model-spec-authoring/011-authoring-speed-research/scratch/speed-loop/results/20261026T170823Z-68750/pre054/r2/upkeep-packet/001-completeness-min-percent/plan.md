---
title: "Implementation Plan: Add a min-percent option to calculate-completeness.sh"
description: "One new global, one option case and one comparison after the report, so the exit code carries the threshold while every printed byte stays the same."
trigger_phrases:
  - "completeness min percent plan"
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
| **Language/Stack** | Bash, 3.2-compatible, run under `set -euo pipefail` |
| **Framework** | The system-spec-kit runtime CLI `spec/*.sh` scripts |
| **Storage** | None - reads a spec folder's markdown and writes only a temp stats directory |
| **Testing** | Manual command matrix; `runtime/cli/tests/` has no suite for this script |

### Overview
The change adds a `MIN_PERCENT` global, a `--min-percent` case in the existing option loop, a validator for its value and a single comparison that runs after the report has been printed. Nothing on the report path moves: the calculation functions, the stats files and both output functions are untouched, so the option can only change the exit status.
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
Monolith - one script, sectioned by the numbered comment banners it already carries.

### Key Components
- **`MIN_PERCENT`** (new, §3 GLOBALS): empty by default. Empty means the option was not passed, which is why the comparison is guarded on `-n` rather than on a numeric default.
- **`--min-percent` case** (§8 MAIN SCRIPT option loop): `MIN_PERCENT="${2:-}"` then `shift 2`, so a missing value reaches the validator instead of tripping `set -u` first.
- **`validate_min_percent`** (new, §4 HELPER FUNCTIONS): accepts an integer from 0 to 100 and exits 1 with the script's `ERROR:` plus `Use --help` shape for anything else. Called once, before any calculation.
- **`reported_percentage`** (new, §4 HELPER FUNCTIONS): echoes `OVERALL_PERCENTAGE` in folder mode and, in `--file` mode, sources the same `${STATS_DIR}/<basename>.stats` file `output_text` reads. One source for the gate and the printed line.
- **Gate** (new, end of §8): compares the value with `MIN_PERCENT` and exits 3 when below it, 0 otherwise. It sits after `output_json` or `output_text` returns, so the report is fully written before the status changes.

### Data Flow
`argv` → option loop sets `MIN_PERCENT` and `SPEC_FOLDER` or `SINGLE_FILE` → `validate_min_percent` → `calculate_file_completeness` or `calculate_spec_completeness` fills the stats files and `OVERALL_PERCENTAGE` → `output_json` or `output_text` prints the report → `reported_percentage` reads the same number → the gate exits 3 or 0.

The order matters: printing first is what keeps REQ-003 true, because a caller redirecting stdout still receives the full report on a below-threshold run. `archive.sh` relies on that shape already - it captures the JSON before it decides anything - so a gate that printed nothing would be a regression even though the exit code would be right.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

No automated suite covers `calculate-completeness.sh`; `runtime/cli/tests/` exercises validation, not this script. Verification is a recorded command matrix in the packet's `scratch/` folder, in three parts:

| Part | Commands | Expected |
|------|----------|----------|
| Output identity | Each fixture run twice, with and without `--min-percent`, text and `--json`, plus `--verbose` and `--quality` | `diff` empty on stdout and stderr, identical exit status when the threshold is met |
| Exit matrix | Below, exactly at and above the threshold, in folder mode and `--file` mode | 3, 0 and 0 respectively, with the report printed in every case |
| Input rejection | Missing value, `abc`, `-1`, `101`, empty string | Exit 1, `ERROR:` on stderr, no report on stdout |

The fixtures are chosen so both outcomes are reachable: one folder whose report lands below the chosen threshold and one whose report lands at or above it. `archive.sh`'s `--json` call is rerun against a complete folder as the regression check for SC-002.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

`bc` for the percentage arithmetic, which the script already requires and already refuses to run without. Bash 3.2 on macOS is the floor, so the new code uses only `case`, `${2:-}` and integer `[[ ]]` comparisons - no associative arrays, no `mapfile`.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the one file. The option is additive and no caller passes it yet, so a revert cannot strand a caller; the report path is unchanged in either direction.
<!-- /ANCHOR:rollback -->

---
