---
title: "Implementation Plan: Add a min-percent option to calculate-completeness.sh"
description: "Adds one option branch and one post-report comparison to a single Bash script, leaving the report byte-identical and putting the verdict in the exit code."
trigger_phrases:
  - "completeness min percent plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Add a min-percent option to calculate-completeness.sh

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash 3.2-compatible shell script |
| **Framework** | None |
| **Storage** | None |
| **Testing** | `bash -n` plus command runs against a fixture folder in the packet's `scratch/` |

### Overview
The change adds one `case` branch to the option loop and one comparison after the report is written. The comparison reads the same variable the report prints, so the exit code and the printed percentage cannot disagree. The report functions stay untouched, which is what keeps the output identical with or without the option.
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
- [ ] `bash -n .skilled/skills/system-spec-kit/runtime/cli/spec/calculate-completeness.sh` exits 0
- [ ] `--min-percent 90` exits 3 on the 86% fixture and 0 on the 100% packet
- [ ] `diff` between a run with the option and one without prints nothing
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single-script option branch

### Key Components
- **Option loop (section 8 of the script)**: gains a `--min-percent` branch beside `--file`, storing the value in one global.
- **Report functions**: `output_text` and `output_json` are not modified, so they stay the only place the percentage is formatted.
- **Threshold check**: runs after the report, reads the same percentage the report printed, and sets the process exit status.

### Data Flow
The option loop stores N in `MIN_PERCENT`. The calculation fills `OVERALL_PERCENTAGE` for a folder, or the per-file `percentage` under `--file`. The report functions print. The threshold check then compares that same figure against N, exiting 3 when it is lower and 0 otherwise.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
Build an 86% fixture under the packet's `scratch/` folder and capture the packet's current report as a baseline.

### Phase 2: Implementation
Add the option branch, the value validation and the post-report comparison to `calculate-completeness.sh`.

### Phase 3: Verification
Prove exit 3 below the threshold, exit 0 at or above it, and an unchanged report in both text and JSON.

`tasks.md` owns the ordered work and each task's `Verify:` clause.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

No test framework runs over this script folder, so every check is a command with an expected exit status or an empty diff.

| Check | Command | Expected |
|-------|---------|----------|
| Syntax | `bash -n` on the script | exits 0 |
| Below threshold | `--min-percent 90` on the 86% fixture | exits 3 |
| At or above threshold | `--min-percent 50` on the 86% fixture, `--min-percent 90` on the 100% packet | each exits 0 |
| Report unchanged | `diff` of the run with the option against the run without it | prints nothing |
| Bad value | `--min-percent abc`, `--min-percent 101`, trailing `--min-percent` | each exits 1 |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `bash` 3.2 | Runtime | Green | The script cannot run; this change adds no new requirement |
| `bc` | Runtime | Green | The script already exits 1 before any report is produced |
| `grep`, `find`, `wc` | Runtime | Green | Already required by the counting functions |

No new package is added.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A run that omits `--min-percent` returns a different exit code or a different report than it did before the change.
- **Procedure**: Revert the one commit that touches `calculate-completeness.sh`. The change adds no state, no data and no dependency, so the revert is complete on its own.
<!-- /ANCHOR:rollback -->

---
