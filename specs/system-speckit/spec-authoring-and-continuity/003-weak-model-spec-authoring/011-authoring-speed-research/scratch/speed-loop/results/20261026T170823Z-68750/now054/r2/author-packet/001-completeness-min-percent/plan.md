---
title: "Implementation Plan: Add a min-percent option to calculate-completeness.sh"
description: "Add one option and one gate to a single bash script. The option parser stores an integer floor, the output functions record the percentage they printed, and a check after the report turns that pair into exit 3 or 0."
trigger_phrases:
  - "completeness min percent plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.3 -->
# Implementation Plan: Add a min-percent option to calculate-completeness.sh

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash, written to run on the 3.2 shell macOS ships |
| **Framework** | None - a standalone CLI script |
| **Storage** | None; the script writes only a temporary stats directory it already cleans up on exit |
| **Testing** | Direct invocation with `diff` of stdout and explicit checks of `$?` |

### Overview

One file changes: `.skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh`. The option loop gains a `--min-percent` case that validates an integer from 0 to 100 and stores it in a global, each output function records the percentage it rendered, and a gate after the report exits 3 when that recorded percentage is below the floor. The proof is a `diff` of stdout across every output mode plus a boundary run at the reported value and one point above it.
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

Single script branch.

### Key Components

- **Option loop** (section 8 of the script): already dispatches on `--verbose`, `--json`, `--quality` and `--file`. It gains `--min-percent`, which consumes the next argument and rejects anything that is not an integer in 0-100 before any work starts.
- **Output functions** (`output_text`, `output_json`): already resolve the percentage to print, in folder mode from `OVERALL_PERCENTAGE` and in `--file` mode from the per-file stats. Each records that same value in a new global so the gate reads exactly what the report showed rather than recomputing it.
- **Threshold gate** (after the output call, before the final `exit 0`): compares the recorded percentage with the floor and exits 3 when it falls short.
- **`show_help`**: gains one OPTIONS line and one exit-code line so the option is discoverable and its status is distinguishable from the error status 1.

### Data Flow

`argv` → option loop, which validates the floor and stores it → `calculate_spec_completeness` or `calculate_file_completeness` builds the stats → `output_text` or `output_json` renders them and records the percentage it printed → the gate compares the recorded percentage with the floor → `exit 3` or `exit 0`. The report is written before the gate runs, so a failing run still prints its numbers and the output is identical either way.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

### Phase 1: Setup

Read the option loop, both output functions and the exit-code trailer, then build a fixture folder whose placeholder count produces a known percentage. The fixture is what makes the boundary check repeatable; without it every verification run depends on whatever the packet happens to contain that day.

### Phase 2: Implementation

Add the global, the option case with its validation, the recorded percentage in each output function, the gate, and the help and exit-code text. All of it lands in one script, in the order the tasks list, so each step is reviewable on its own.

### Phase 3: Verification

Diff stdout across every output mode with and without the option, walk the boundary at the reported value and one above it, reject four invalid inputs, and re-check the three pre-existing exit paths.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The script has no test harness, so verification is direct invocation with recorded exit statuses. Two properties carry the change:

- **Output parity.** For each of folder, `--verbose`, `--json`, `--quality` and `--file` forms, `diff <(script <args>) <(script --min-percent 100 <args>)` must print nothing. Using a floor of 100 forces the gate to fail while proving the report text is untouched, so parity and the failing path are checked in one command.
- **Boundary.** With the fixture reporting a known percentage `P`, `--min-percent P` must exit 0 and `--min-percent $((P + 1))` must exit 3. Both directions matter: a gate that only ever exits 3 would pass a one-sided test.

Invalid input is checked separately, because it must fail before any report is written: four invocations, each expecting exit 1, a message on stderr and an empty stdout.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

`bash` 3.2 or newer, `bc`, `grep`, `find` and `printf`. Every one is already required by the script today, and `bc` is already guarded by a `command -v` check that exits 1 with an explanatory message. No new package, no new runtime.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: any invocation that passes no option changes its stdout or its exit status. That would mean the recording or the gate leaked into the default path.

Rollback: revert the one commit that touches `calculate-completeness.sh`. The change adds a branch and a check without altering the calculation, the rendering or the temporary-directory handling, so a revert restores the previous behaviour with nothing else to unwind. No data, schema or config is involved.
<!-- /ANCHOR:rollback -->

---

