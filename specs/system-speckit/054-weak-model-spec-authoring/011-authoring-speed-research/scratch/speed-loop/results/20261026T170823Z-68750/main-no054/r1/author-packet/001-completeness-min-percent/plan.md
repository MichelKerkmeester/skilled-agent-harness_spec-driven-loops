---
title: "Implementation Plan: Add a min-percent option to calculate-completeness.sh"
description: "Parse --min-percent into a new global, validate it as an integer 0-100, publish the percentage the report already computed into one shared value, and exit 3 from a single post-output gate when that value falls below the floor."
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
| **Language/Stack** | Bash 3.2-compatible shell script (`set -euo pipefail`) |
| **Framework** | None - a standalone CLI in `runtime/cli/spec/` |
| **Storage** | None; a `$TMPDIR` scratch directory per run, removed by an `EXIT` trap |
| **Testing** | vitest via `runtime/cli/tests/calculate-completeness-script.vitest.ts`, which spawns the script with `spawnSync` |

### Overview
The change is confined to the script's argument parser, a new global, and the tail of `main`. `--min-percent` stores its argument in a `MIN_PERCENT` global, validated at parse time so a bad value never reaches the report. Both output paths already resolve exactly one percentage; each publishes it into a shared `REPORTED_PERCENTAGE` global, and a single comparison after the output functions return decides the exit status. Nothing in `output_text` or `output_json` changes what it prints.
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
A linear CLI pipeline with one exit point: parse arguments, compute, print, decide status. The gate is appended to that pipeline rather than threaded through the calculator, so the report stays a pure function of the packet.

### Key Components
- **Argument parser** (`§8 MAIN SCRIPT` loop): gains a `--min-percent) MIN_PERCENT="${2:-}"; shift 2 ;;` arm. The `${2:-}` form matters because `set -u` turns a bare `$2` at end-of-args into an unbound-variable abort instead of a usage error.
- **Validation helper**: a small `validate_min_percent()` called once after parsing, before the folder is read. It rejects a value that is not a base-10 integer in `0..100` by writing `ERROR: --min-percent requires an integer from 0 to 100` to stderr and exiting `1`. Placing it before the calculation means a rejected invocation prints no report at all.
- **`REPORTED_PERCENTAGE` global**: initialised to `100` beside `OVERALL_PERCENTAGE`, then assigned by each output path - `OVERALL_PERCENTAGE` in folder mode, the sourced `percentage` in `--file` mode - so the gate reads one value regardless of mode. The `--file` NOT FOUND branch assigns `0`, matching the "nothing completed" reading of a missing file.
- **Exit gate** (new final block): after the output function returns, compare `REPORTED_PERCENTAGE` against `MIN_PERCENT` and `exit 3` when it is lower, otherwise `exit 0`.

### Data Flow
Arguments → `MIN_PERCENT` (validated) → `calculate_spec_completeness` or `calculate_file_completeness` fills the per-file stats and `OVERALL_PERCENTAGE` → `output_text` or `output_json` prints the report and sets `REPORTED_PERCENTAGE` → the gate compares `REPORTED_PERCENTAGE` to `MIN_PERCENT` and sets the process status. The `EXIT` trap removes `$STATS_DIR` on every path, including the new `3`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Extend `runtime/cli/tests/calculate-completeness-script.vitest.ts`, which already builds a throwaway packet in `os.tmpdir()` and runs the script through `spawnSync`. One helper creates a packet with a known placeholder ratio so the expected percentage is deterministic rather than incidental.

- **Threshold outcomes**: the same packet under a floor above, equal to, and below its percentage asserts `3`, `0`, `0`.
- **Report equality**: capture stdout from a run with and without the flag and assert the strings are equal, once in text mode and once with `--json`.
- **Validation**: `--min-percent` with no value, `abc`, `-1`, and `101` each assert status `1`, an empty stdout, and a stderr message naming the option.
- **Mode coverage**: `--file` with a floor above the file's percentage asserts `3`; the same invocation with `--json` asserts the payload parses and the status is preserved.
- **Regression**: the two existing cases in the file must pass untouched.

Manual confirmation runs the script against a real packet, diffing `--min-percent 50` against the bare invocation to prove the report is byte-identical.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- `bc`, already guarded by `command -v bc` in `§8`; the gate introduces no new external binary.
- `find`, `grep`, `wc` and `mktemp`-style `$TMPDIR` handling the script already relies on.
- vitest, already configured for `runtime/cli/tests`.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the two scoped files. The change adds no persisted state, no migration, and no new file outside `runtime/cli/tests`, so restoring the previous revision of `calculate-completeness.sh` returns every caller to today's behaviour, and dropping the new test cases leaves the original two intact.
<!-- /ANCHOR:rollback -->

---
