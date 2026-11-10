---
title: "Implementation Plan: Add a min-percent option to calculate-completeness.sh"
description: "Add a threshold flag to the existing argument loop, validate it as an integer percentage, and gate the final exit status on the completion the run already reports. The report path is untouched."
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
| **Language/Stack** | Bash 3.2-compatible shell script, `set -euo pipefail` |
| **Framework** | None - standalone CLI with a hand-rolled `case` argument loop |
| **Storage** | None; per-run stats land in `${TMPDIR}/speckit-completeness-$$` and are removed by the `EXIT` trap |
| **Testing** | vitest, `runtime/cli/tests/calculate-completeness-script.vitest.ts`, driving the script through `spawnSync('bash', ...)` |

### Overview
The script already computes the number the feature needs; what it lacks is a way to act on it. The change adds one branch to the existing argument loop, one validation block beside the other startup guards, and one gate between the report call and the final `exit 0`. No counting, formatting or JSON code is touched, which is what keeps the report byte-identical.
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
Single-file CLI with a linear pipeline: parse arguments, validate inputs, compute, report, then decide the exit status. Each stage already exists; the change extends three of them rather than adding a new structure.

### Key Components
- **Argument loop** (`§8`, currently lines 544-562): gains a `--min-percent` branch that consumes its value. `set -u` makes a bare trailing `--min-percent` an unbound-parameter abort, so the branch tests `$#` before reading `$2` and reports a usage error instead.
- **Startup validation** (beside the existing `bc` check): rejects a value that is not an integer in 0-100. The integer test is `[[ "$MIN_PERCENT" =~ ^[0-9]+$ ]]`, which keeps the script's existing `[[ ]]` idiom and stays inside Bash 3.2.
- **Reported-completion selector**: resolves which number the gate compares. Folder runs use `OVERALL_PERCENTAGE`; `--file` runs re-source the per-file stats and use `percentage`. The selector exists because `OVERALL_PERCENTAGE` is initialised to `100` and only recomputed inside `calculate_spec_completeness`, so reading it in `--file` mode would compare against a constant and always pass.
- **Exit gate** (after `output_text`/`output_json`, replacing the unconditional `exit 0`): compares the selected value against `MIN_PERCENT` and exits `3` when it is lower. Output has already been written at that point, so a failing run still prints its report.

### Data Flow
`argv` → argument loop → `MIN_PERCENT` (unset when the flag is absent) → validation → `calculate_file_completeness` or `calculate_spec_completeness` → `output_text` or `output_json` → gate → exit status.

### Design Decisions

| Decision | Why |
|----------|-----|
| Compare against the completion the run reports, not `OVERALL_PERCENTAGE` unconditionally | `OVERALL_PERCENTAGE` is `100` in `--file` mode because only the folder path recomputes it. Gating on it there would accept every file regardless of threshold - a silent no-op rather than a feature. |
| Reject out-of-range values with exit `1` instead of clamping | Clamping `150` to `100` would report a threshold the caller never asked for. A usage error is honest and matches the script's existing exit-`1` behavior for bad arguments. |
| Gate after the report, not before it | A threshold failure is still a successful measurement. Emitting the report first keeps `--min-percent` usable interactively and keeps stdout identical between a passing and a failing run. |
| Exit `3` rather than `2` | `2` is reserved for validation errors in the sibling `spec/*.sh` scripts, and this script's own `1` already means user error. `3` is the system-error slot in that taxonomy but is unused here, so it carries the new meaning without colliding with either existing code. |
| No short alias | The request names `--min-percent` only, and a single-letter alias risks colliding with a future option. |
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Extend `runtime/cli/tests/calculate-completeness-script.vitest.ts`, which already builds a temporary packet with a known placeholder count and spawns the script through `spawnSync`. New cases:

| Case | Fixture | Assertion |
|------|---------|-----------|
| Threshold met | Folder with one unfinished placeholder line, completion `C` | `--min-percent "$C"` exits `0` |
| Threshold missed | Same folder | `--min-percent $((C + 1))` exits `3` |
| Zero threshold | Same folder | `--min-percent 0` exits `0` |
| Output stability | Same folder | stdout of a text run and of a `--json` run are identical with and without the flag |
| Invalid input | None needed | `abc`, `-1`, `101` and a bare trailing flag each exit `1` |
| Single-file mode | One file passed through `--file` | The per-file percentage decides the status, not a constant `100` |

Manual verification covers what the unit cases cannot: `bash -n` for syntax, and a `diff` of the full text and JSON reports from a before-and-after invocation.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- `bc`, already required at startup for the percentage arithmetic. The new option adds no dependency.
- Bash 3.2 or newer, the script's existing compatibility floor.
- The vitest harness under `runtime/cli/tests/`, already present and already exercising this script.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the two files named in `spec.md` §3. The option is additive and opt-in: a caller that never passes `--min-percent` sees no behavior change, so reverting the script alone restores the previous contract even if the tests are left in place.
<!-- /ANCHOR:rollback -->

---
