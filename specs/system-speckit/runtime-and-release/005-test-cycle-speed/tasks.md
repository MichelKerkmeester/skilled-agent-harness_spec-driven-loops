---
title: "Tasks: Test cycle speed: cut the spec-kit suite time and the gate stacking"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "test cycle speed tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Test cycle speed: cut the spec-kit suite time and the gate stacking

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

`S` is `.skilled/skills/system-spec-kit`. `D` is `.skilled/skills/system-deep-loop/runtime`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Record the baseline (`S/runtime`). Verify: `npm test` reports 299 files and 4511 tests in 1767 s.
- [x] T002 Confirm CI leaves the deep-loop files out of the spec-kit job (`.github/workflows/spec-kit-check.yml`). Verify: the runtime step runs `npx vitest run --config ../vitest.config.ts --project root`, and that project's `include` names no deep-loop path.
- [x] T003 Confirm no deep-loop test needs spec-kit's setup file (`D/tests`). Verify: `grep -rln vitest-setup D/tests` prints nothing.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Cut 1: drop the deep-loop include and setup file (`S/runtime/vitest.config.ts`). Verify: `npm test` in `S/runtime` reports 133 files, and `npm test` in `D` reports 166.
- [ ] T005 Cut 2: make `npm test` run the `root` and `cli` projects (`S/runtime/package.json`). Verify: one `npm test` reports both project names and 2518 `cli` tests.
- [ ] T006 Cut 3: write the rerun rule (`S/references/`). Verify: `rg -n "generated files" S/references` prints the rule.
- [ ] T007 Cut 4: profile the ten slowest deep-loop files (`D/tests`). Verify: a table names each file's time in setup, waits and assertions.
- [ ] T008 Cut 5: per-file temp roots, then file parallelism (`S/runtime/vitest.config.ts`, `D/vitest.config.ts`). Verify: three runs in a row pass with `fileParallelism: true`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Validate this packet. Verify: `validate.sh` on this folder with `--strict` prints `RESULT: PASSED`.
- [ ] T010 Rerun the baseline command after cuts 1 and 2. Verify: `npm test` in `S/runtime` finishes in under 900 s.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] The plan itself is complete. T004 to T008 and T010 are the build, and each waits for its own packet
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---



