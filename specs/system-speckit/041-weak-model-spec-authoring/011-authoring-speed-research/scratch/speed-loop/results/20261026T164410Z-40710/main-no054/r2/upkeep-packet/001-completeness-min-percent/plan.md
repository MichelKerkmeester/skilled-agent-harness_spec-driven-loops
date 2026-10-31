---
title: "Implementation Plan: Add a min-percent option to calculate-completeness.sh"
description: "Add a MIN_PERCENT global and a --min-percent case to the existing argument loop, validate the value as an integer from 0 to 100, and compare it against the percentage the report already prints. The gate runs after the report is written and only changes the exit status."
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
| **Language/Stack** | Bash, 3.2-compatible (the script calls this out at its temp-file block) |
| **Framework** | None — a single-file CLI script under `.skilled/skills/system-spec-kit/runtime/cli/spec/` |
| **Storage** | None; per-run scratch files under `${TMPDIR:-/tmp}/speckit-completeness-$$` |
| **Testing** | vitest driving the script through `spawnSync` in `tests/calculate-completeness-script.vitest.ts` |

### Overview
The script already computes the number the gate needs, so the change adds one global, one case in the argument loop, one validation block, and one comparison placed after the report is emitted and before the final `exit 0`. Keeping the comparison after output is what makes "output is unchanged" structural rather than a promise: the report path is untouched, and the option can only influence the process exit status. The single design question is which value to compare, and the answer is the value the report itself presents — `OVERALL_PERCENTAGE` in folder mode, the sourced stats-file `percentage` in `--file` mode.
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
Single-file filter: parse arguments into globals, calculate, print, exit. The option joins that pipeline rather than adding a second one.

### Key Components
- **Argument loop** (`while [[ $# -gt 0 ]]` / `case`): gains a `--min-percent)` case that captures `$2`, shifts by two, and validates.
- **Globals block**: gains `MIN_PERCENT=""` next to `VERBOSE`, `JSON_OUTPUT`, `QUALITY_CHECK`, `SINGLE_FILE` and `SPEC_FOLDER`. Empty means "no gate".
- **Validation**: a small block right after the loop rejects a non-integer, a value outside 0-100, and a missing value, each with a stderr usage line and `exit 1`.
- **Report path**: unchanged. `output_text` and `output_json` keep their signatures and their arithmetic.
- **Gate**: a final comparison against the reported percentage, written as a full `if` block, placed after the `output_text` / `output_json` dispatch and before the script's last `exit`.

### Data Flow
`argv` → argument loop sets `MIN_PERCENT` and the existing flags → `calculate_spec_completeness` or `calculate_file_completeness` sets the percentage → `output_text` or `output_json` prints it → the gate compares that same percentage against `MIN_PERCENT` → `exit 3` or `exit 0`.

The percentage reaches the gate from two places, and they must not be recomputed independently. In folder mode it is already a global (`OVERALL_PERCENTAGE`). In `--file` mode it lives in the per-run stats file, which both output functions source; the gate must read it the same way, with the same fallback the output path uses when the file is absent.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Extend `tests/calculate-completeness-script.vitest.ts`, which already spawns the script with `spawnSync` and builds fixtures with `mkdtempSync`. A fixture needs one `spec.md` containing a single `[TODO: ...]` line against several filled lines, which yields a percentage strictly between 0 and 100 — the existing first case shows the shape and asserts `overall_completion` is below 100.

Cases to add:
1. **Below threshold** — `--json --min-percent <reported+1>` exits 3.
2. **At threshold** — `--json --min-percent <reported>` exits 0, covering the strict "below" comparison.
3. **Unchanged report** — stdout for `--json <folder>` equals stdout for `--json <folder> --min-percent 0`, and the same for text mode.
4. **Invalid value** — `abc`, `-1`, `101`, and a trailing `--min-percent` each exit 1 and write to stderr.
5. **Single-file mode** — `--file <path> --min-percent` gates on that file's `completion_percentage`.

Run the file alone while iterating:

```
npx vitest run .skilled/skills/system-spec-kit/runtime/cli/tests/calculate-completeness-script.vitest.ts --config .skilled/skills/system-spec-kit/vitest.config.ts --project cli
```

Baseline on the unmodified script: 1 file, 2 tests, both passing.

Manual confirmation outside vitest, on a real packet, is worth one pass because it exercises the text path a caller actually sees:

```
bash .skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh specs/zz-bench-authoring/001-completeness-min-percent; echo "EXIT=$?"
```

That packet currently reports `Overall Completion: 100%` and exits 0, so `--min-percent 100` must still exit 0 and `--min-percent 101` must be rejected as invalid rather than compared.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- `bc`, already required: the script aborts at startup with a clear error when it is missing. The gate adds no `bc` call because `printf "%.0f"` has already produced an integer before any comparison.
- Bash 3.2, already the script's floor: no `${var,,}`, no associative arrays, no `mapfile`.
- No new package, no new file, no change to any caller.

Line anchors that the implementation should confirm before editing, since this plan is written against the current file: the `# Options:` header line, `show_help()`'s option block, the `while [[ $# -gt 0 ]]` loop, the output dispatch near the end, the final `exit 0`, and the trailing exit-code comment block.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the two files in the scope table. The option is additive and no caller passes it until one is updated, so reverting the script cannot break an existing invocation; reverting the test file alone leaves the script's behavior intact. No data, migration or configuration is involved.
<!-- /ANCHOR:rollback -->

---
