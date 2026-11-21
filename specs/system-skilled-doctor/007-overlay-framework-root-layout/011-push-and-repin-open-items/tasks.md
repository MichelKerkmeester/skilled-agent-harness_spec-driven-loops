---
title: "Tasks: Phase 11: push the open-item fixes and re-pin Barter onto them"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "push and repin open items tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 11: push the open-item fixes and re-pin Barter onto them

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation
<!-- FILL: Keep the prefix table and add the two shell variables this task list uses. GOOD: `R` is `scripts/rotate-logs.sh`. `A` is `logs/archive/`. WEAK: Variables are defined below. -->

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
<!-- FILL: Replace the sample tasks with the real setup steps. Each task names a file and a verify command. GOOD: T001 Confirm `logs/archive/` holds 10 archives. Verify: `ls logs/archive | wc -l` prints 10. WEAK: T001 Set up the project. -->

- [x] T001 Push Skilled main with phase 009's merge, done by the operator (Skilled `main`). Verify: after a fetch, `git merge-base --is-ancestor <phase 009 merge> origin/main` exits 0. Evidence: `git merge-base --is-ancestor 1ac1fba6a25 origin/main` and the same for `7ededf2efb1` exit 0; origin/main is `542748515e8`, pushed by the operator with the owner account.
- [x] T002 Record the pushed commit id on the `Target Skilled commit:` line (`spec.md`). Verify: `rg -n '^Target Skilled commit: [0-9a-f]{40}' spec.md` prints one line. Evidence: spec.md carries `Target Skilled commit: 542748515e8d3a391e419b2630b21b270fe2cd20`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
<!-- FILL: Write one implementation task per file change. Add a `Verify:` line with the command and its expected output. GOOD: T002 Add the `--keep <n>` branch. Verify: `--keep 3` leaves 3 archives. WEAK: T002 Implement the feature. -->

- [x] T003 Re-pin Barter onto the pushed commit with `/doctor:overlay repin` (ai-speckit `skilled/`). Verify: the overlay manifest's `pin.commit` equals the recorded id. Evidence: ai-speckit commit `9284f8eaaa1`; `pin.commit` moved from `b5a630c6efa` to `542748515e8`; live run `20261121T071540Z-e1a262`.
- [x] T004 Record the base with `/doctor:update record-base --pin <id>` (ai-speckit `skilled/.skilled/skills/.state/doctor-update/base.json`). Verify: the engine exits 0 and every unit names the pushed id. Evidence: `record-base` exit 0, 74 of 74 units name `542748515e8`, `verified:false`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
<!-- FILL: Write one verification task per requirement. Each one runs a command. GOOD: T003 Run both invocations. Verify: `ls logs/archive | wc -l` prints 3 and 10. WEAK: T003 Test everything. -->

- [x] T005 Check the overlay status after the re-pin (ai-speckit `skilled/`). Verify: `node .skilled/commands/doctor/scripts/overlay-engine.cjs status --json` reports `PASSED`. Evidence: `status --audit` reports `RESULT: PASSED`, `checked=136`, `docs=0`.
- [x] T006 Strict-validate this phase (`validate.sh --strict`). Verify: it prints `RESULT: PASSED`. Evidence: `validate.sh --strict` on this folder prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
<!-- FILL: Keep the three completion lines and add the one artifact that proves the phase is done. GOOD: `--keep 3` leaves 3 archives and the suite passes. WEAK: Work is complete. -->

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
<!-- FILL: Name the spec and plan files. Add the decision record when the packet has one. GOOD: Specification: `spec.md`. Plan: `plan.md`. WEAK: See the other docs. -->

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---



