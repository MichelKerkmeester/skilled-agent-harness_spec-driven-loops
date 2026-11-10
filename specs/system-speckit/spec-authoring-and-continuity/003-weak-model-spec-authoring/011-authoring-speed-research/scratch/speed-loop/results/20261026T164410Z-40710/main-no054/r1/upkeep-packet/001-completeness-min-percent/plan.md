---
title: "Implementation Plan: Add a min-percent option to calculate-completeness.sh"
description: "Add one global, one parser arm, one validation guard and one exit decision to a bash script that already computes the number. The reporters stay untouched so the printed output cannot drift."
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
| **Language/Stack** | Bash, kept compatible with the 3.2 shell macOS ships |
| **Framework** | None - a standalone CLI script with POSIX tool dependencies |
| **Storage** | None; per-file stats live in a temp directory for the length of one run |
| **Testing** | vitest, spawning the script through `spawnSync` and asserting on status and stdout |

### Overview

The change is additive in one direction only: it reads a number the script already computed and turns it into an exit status. A `MIN_PERCENT` global stays empty by default, the parser gains one arm, a guard rejects bad values before any analysis runs, and the tail compares the reported figure against the threshold. The two reporter functions are not touched, which is what makes "output unchanged" true by construction rather than by inspection.
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

Single-pass CLI: parse arguments, compute, report, then decide the exit status. No new stage is introduced; the decision is appended to the stage the script already ends with.

### Key Components

- **Option parser (section 8)**: gains one arm for `--min-percent`, so flag order stays free and the positional folder/file handling is untouched.
- **Value guard**: rejects a missing value, a non-integer and anything outside 0-100 before any file is read, so a bad invocation cannot print a report and then fail.
- **Threshold decision (tail of section 8)**: reads the figure the reporter just printed and maps it to exit 3 or exit 0. Written as an explicit `if`, because a bare arithmetic test returning false under `set -e` would abort the script with no message - the same trap the existing clamp at lines 294-299 documents.
- **Reporters (section 7)**: unchanged. `output_text` and `output_json` never read `MIN_PERCENT`, so neither the text block nor the JSON body can differ when the flag is present.

### Data Flow

`argv` -> parser sets `MIN_PERCENT`, `SPEC_FOLDER` and `SINGLE_FILE` -> `calculate_spec_completeness` or `calculate_file_completeness` writes the per-file stats and sets `OVERALL_PERCENTAGE` -> `output_text` or `output_json` prints -> the tail compares the printed figure against `MIN_PERCENT` and exits.

The tail cannot read `output_text`'s `percentage` local, and a `source` of a stats file inside a function binds to that function's locals. So the decision re-reads the single-file stats file at global scope and uses `${percentage:-0}`, which is exactly the default `output_text` applies when the file is absent; folder mode uses `OVERALL_PERCENTAGE`. Two defaults follow and are intentional: a packet with no analyzed lines reports 100% and passes any threshold, and a `--file` target that does not exist reports 0% and fails any threshold above 0.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Extend the existing suite at `.skilled/skills/system-spec-kit/runtime/cli/tests/calculate-completeness-script.vitest.ts`, which already builds temp packets and spawns the script. New cases, each asserting on `status` and, where output matters, on `stdout`:

- Below the threshold: a packet holding one TODO placeholder reports less than 100 and exits 3 when N is above that figure.
- At the threshold: the same packet with N equal to its reported integer exits 0, which pins the inclusive boundary.
- Above the threshold: a fully filled packet with N of 100 exits 0.
- Invalid input: `--min-percent` with no value, `abc`, `101` and `-5` each exit 1 and write an `ERROR:` line to stderr.
- Output equality: `--json` stdout with and without the flag is compared as a string, and the text report likewise, so REQ-003 fails loudly if a reporter ever starts reading the flag.
- Missing `--file` target with `--min-percent 1` exits 3, which documents the 0% default.

Run from `.skilled/skills/system-spec-kit/runtime`:

```bash
npx vitest run cli/tests/calculate-completeness-script.vitest.ts --config ../vitest.config.ts
```
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- `bc`, already required for every percentage the script prints. No new runtime dependency is introduced.
- Bash 3.2 or newer, unchanged from today; the new code avoids arrays and `local -n`.
- vitest and its existing config at `.skilled/skills/system-spec-kit/vitest.config.ts`, already a dev dependency of the runtime package.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the two files in the Files to Change table. The option is additive and nothing calls it yet, so a revert cannot strand a caller or change a report: without the flag the script behaves exactly as it does today, and with it the only observable difference is an exit status.
<!-- /ANCHOR:rollback -->

---
