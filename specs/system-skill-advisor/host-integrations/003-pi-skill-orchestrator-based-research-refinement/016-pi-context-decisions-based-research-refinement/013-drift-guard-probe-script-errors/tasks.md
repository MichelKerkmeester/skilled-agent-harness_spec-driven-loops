---
title: "Tasks: Drift-Guard Probe Script Errors"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "drift guard probe script errors tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Drift-Guard Probe Script Errors

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

`R` is `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/`. `GATE` is `bash .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh`, run from the repository root. `SH` is the nine shell probes listed by `git ls-files R | grep -E 'probes/.*\.sh$'`.

Tasks T003 to T012 are Luna leaves, one file per brief, in waves of at most four. Every other task is a conductor task. Each Luna brief pastes the exact new line, and the strict-mode line is exactly `set -uo pipefail` with nothing after it.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Record the failing gate before any edit (conductor, `R`). Verify: `GATE` exits 1, its alignment-drift block prints `Errors: 11`, and all 11 ERROR rows name a file under `R`. Record the `Warnings:` count, 46 at planning. If an ERROR row names a file outside `R`, which phases 006 to 011 could add, record it and stop, because this phase covers only `R`.
- [x] T002 Confirm the probes match `main` and still parse (conductor, `R`). Verify: `git diff --stat main -- R` prints nothing, and `git ls-files R | grep -E 'probes/.*\.sh$' | xargs -n1 bash -n && echo ok` prints `ok`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 [P] Luna wave 1. Replace line 1 `#!/bin/bash` with `#!/usr/bin/env bash` and line 4 `set -u` with `set -uo pipefail` (`R/lineages/noedit-close-3c/probes/hook-probe.sh`). Verify: `sed -n 1p <file>` and `sed -n 4p <file>` print the two new lines, and `bash -n <file>` exits 0.
- [x] T004 [P] Luna wave 1. Insert the three lines `// ───────────────────────────────────────────────────────────────`, `// MODULE: Scorer probe Vitest config` and `// ───────────────────────────────────────────────────────────────` above the import on line 1 (`R/lineages/scorer-attach-4/probes/vitest.config.ts`). Verify: `rg -n 'MODULE:' <file>` prints line 2, and `git diff -U0 -- <file> | rg '^\+[^+]' | rg -v '^\+//'` prints nothing.
- [x] T005 [P] Luna wave 1. Insert `set -uo pipefail` between line 2 and the `cd` on line 3 (`R/verify-4/probes/cli-rows.sh`). Verify: `sed -n 3p <file>` prints `set -uo pipefail`, and `bash -n <file>` exits 0.
- [x] T006 [P] Luna wave 1. Insert `set -uo pipefail` between line 5 and the `RAD=` line on line 6 (`R/verify-4/probes/holdout-guard-emulation.sh`). Verify: `sed -n 6p <file>` prints `set -uo pipefail`, and `bash -n <file>` exits 0.
- [x] T007 [P] Luna wave 2. Insert `set -uo pipefail` between line 4 and the `RAD=` line on line 5 (`R/verify-4/probes/make-heredoc-variant.sh`). Verify: `sed -n 5p <file>` prints `set -uo pipefail`, and `bash -n <file>` exits 0.
- [x] T008 [P] Luna wave 2. Insert `set -uo pipefail` between line 4 and the `RAD=` line on line 5 (`R/verify-4/probes/make-shell-start-variant.sh`). Verify: `sed -n 5p <file>` prints `set -uo pipefail`, and `bash -n <file>` exits 0.
- [x] T009 [P] Luna wave 2. Insert `set -uo pipefail` between line 3 and the `S=` line on line 4 (`R/verify-4/probes/paired-arm.sh`). Verify: `sed -n 4p <file>` prints `set -uo pipefail`, and `bash -n <file>` exits 0.
- [x] T010 [P] Luna wave 2. Insert `set -uo pipefail` between line 3 and the `cd` on line 4 (`R/verify-4/probes/top-only-head.sh`). Verify: `sed -n 4p <file>` prints `set -uo pipefail`, and `bash -n <file>` exits 0.
- [x] T011 [P] Luna wave 3. Insert `set -uo pipefail` between line 4 and the `cd` on line 5 (`R/verify-4/probes/top-only-sweep.sh`). Verify: `sed -n 5p <file>` prints `set -uo pipefail`, and `bash -n <file>` exits 0.
- [x] T012 [P] Luna wave 3. Replace line 6 `set -u` with `set -uo pipefail` (`R/verify-5/probes/arena-provenance.sh`). Verify: `sed -n 6p <file>` prints `set -uo pipefail`, and `bash -n <file>` exits 0.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 Parse every shell probe (conductor, `SH`). Verify: `git ls-files R | grep -E 'probes/.*\.sh$' | xargs -n1 bash -n && echo ok` prints `ok`.
- [x] T014 Confirm the diff holds only the ten files and only top-of-file lines (conductor, `R`). Verify: `git diff --numstat -- R | wc -l` prints 10, and `git diff -U0 -- R | rg '^\+[^+]' | rg -v '^\+(#!/usr/bin/env bash|set -uo pipefail|//.*)$'` prints nothing.
- [x] T015 Confirm the guard was not touched (conductor, `.skilled/skills/sk-code/`). Verify: `git diff --stat -- .skilled/skills/sk-code` prints nothing.
- [x] T016 Run the gate (conductor, `GATE`). Verify: `GATE` exits 0, the alignment-drift block prints `Errors: 0` and the same `Warnings:` count T001 recorded. The last line starts with `run-all-drift-guards: all 4 guards PASSED`.
- [x] T017 Check comment hygiene in the added lines (conductor, `R`). Verify: `git diff -U0 -- R | rg -n '^\+.*(016-|008-|phase [0-9]|scorer-attach-4)'` prints nothing.
- [x] T018 Record the files, the gate output and the bash -n result (conductor, `implementation-summary.md`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <this folder> --strict --quiet` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] `GATE` exits 0 and `bash -n` passes on all nine shell probes
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Guard rules**: `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify_alignment_drift.py`
<!-- /ANCHOR:cross-refs -->

---
