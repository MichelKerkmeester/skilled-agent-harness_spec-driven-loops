---
title: "Implementation Plan: Add a min-percent option to calculate-completeness.sh"
description: "Change one bash script: add a validated --min-percent option, then pick the exit status from the already-computed overall percentage after the report prints. The proof is a set of observed exit codes plus an empty diff between gated and ungated output."
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
| **Language/Stack** | Bash 3.2-compatible shell |
| **Framework** | None - single script in the spec-kit CLI runtime |
| **Storage** | None |
| **Testing** | Direct invocations checked by exit status and `diff` |

### Overview
This change touches one script, `calculate-completeness.sh`. It adds a `--min-percent <N>` branch to the existing option loop, validates N as an integer from 0 through 100, and after the report is printed exits 3 when `OVERALL_PERCENTAGE` is below N and 0 otherwise. The report is produced by the existing output functions, so the gate cannot alter it.
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
- [ ] Exit codes 3, 0 and 1 observed on the target script
- [ ] Output diff between gated and ungated runs is empty
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single-script exit-status gate.

### Key Components
- **Option loop**: the `while [[ $# -gt 0 ]]` case block that already parses `--verbose`, `--json`, `--quality` and `--file`; gains the `--min-percent` branch.
- **`MIN_PERCENT` global**: empty when the option is absent, which keeps the default path untouched.
- **`show_help`**: the heredoc that documents each option.
- **Final exit block**: the `exit 0` at the end of the script; becomes the place where the threshold comparison selects 3 or 0.

### Data Flow
1. The option loop reads argv and stores N in `MIN_PERCENT`, or leaves it empty.
2. Validation runs before any calculation, so a bad N exits 1 without printing a report.
3. `calculate_spec_completeness` sets the `OVERALL_PERCENTAGE` global from the placeholder-to-line ratio.
4. `output_text` or `output_json` prints the report exactly as it does today.
5. The final block compares `OVERALL_PERCENTAGE` with `MIN_PERCENT` and exits 3 or 0.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

`tasks.md` owns the checkbox state and the ordered task list. The three steps below are the shape of that list.

### Step 1: Parse and validate the option

Acceptance: `--help` lists `--min-percent <N>`, and a non-integer or out-of-range N exits 1 with a stderr message before any report is printed.
Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh --help | rg -c -- '--min-percent <N>'` prints 1, and `bash .skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh --min-percent abc specs/zz-bench-authoring/001-completeness-min-percent >/dev/null 2>&1; echo $?` prints 1.

### Step 2: Gate the exit status after output

Acceptance: the report is printed first and unchanged, then the script exits 3 below the threshold and 0 at or above it.
Verify: `diff <(bash .skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh specs/zz-bench-authoring/001-completeness-min-percent) <(bash .skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh --min-percent 0 specs/zz-bench-authoring/001-completeness-min-percent)` prints nothing.

### Step 3: Verify the three exit paths

Acceptance: exit 3, exit 0 and exit 1 are each observed on the real script, and the ungated run still exits 0.
Verify: the four invocations in `tasks.md` Phase 3 each print the expected code.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Threshold miss | `--min-percent` above the reported figure | Direct invocation, `echo $?` prints 3 |
| Threshold met | `--min-percent 0`, and `--min-percent` equal to the reported figure | Direct invocation, `echo $?` prints 0 |
| Output identity | Gated versus ungated stdout | `diff` of two process substitutions prints nothing |
| Input rejection | `abc`, `101`, `-1` and a missing value | Direct invocation, exit 1 and a stderr message |
| Regression | Plain invocation on an existing packet | `echo $?` prints 0 |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `bash` 3.2 or later | Runtime | Green | Script does not run |
| `bc` | Runtime | Green | Percentage math fails; the existing guard exits 1 before the comparison |
| `rg` and `diff` | Verification only | Green | Verification commands cannot be run; the exit-status checks still stand |

No new package is required.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the default invocation changes its output, or a run without `--min-percent` stops exiting 0.
- **Procedure**: revert the single commit that touches `calculate-completeness.sh`. The script is self-contained and holds no state, so no data or migration needs undoing.
<!-- /ANCHOR:rollback -->

---

