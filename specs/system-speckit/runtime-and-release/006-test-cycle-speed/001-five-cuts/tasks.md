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

- [x] T004 Cut 1: drop the deep-loop include and setup file (`S/runtime/vitest.config.ts`). Verify: `npx vitest list --filesOnly` in `S/runtime` prints 129 files and none under deep-loop, and in `D` still prints 173.
- [x] T011 Keep `test:council` covering its two deep-loop files (`S/runtime/package.json`). Verify: `npm run --prefix S/runtime test:council` reports 6 files and 10 tests, then 2 files and 16 tests, exit 0.
- [x] T012 Correct the docs that described a combined run (`D/vitest.config.ts`, `D/references/integration-points.md`). Verify: `validate_document.py` on the reference prints `Total issues: 0`.
- [x] T005 Cut 2: make `npm test` run the `root` and `cli` projects (`S/runtime/package.json`, `S/runtime/scripts/run-tests.mjs`, `S/runtime/scripts/run-cli-tests.sh`). Verify: one `npm test` reports the core lane, then `cli` with 202 files passed and 2452 tests, exit 0.
- [x] T006 Cut 3: write the rerun rule (`.skilled/skills/sk-code/sk-code-skilled/references/shared/workflow-guardrails.md`). Verify: `rg -n "generated files"` on that file prints the rule.
- [x] T007 Cut 4: profile the deep-loop suite and share repeated fixtures (`D/tests/unit/`). Verify: the JSON profile ranks all 173 files, and the three edited files keep every `it` and `expect` line.
- [x] T008 Cut 5: per-file coverage database, then file parallelism (`S/runtime/vitest.config.ts`, `S/vitest.config.ts`, `D/vitest.config.ts`, `D/tests/helpers/spawn-cjs.ts`). Verify: `npm test` in `D` passes 173 files three runs in a row, and in `S/runtime` passes three runs.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Validate this packet. Verify: `validate.sh` on this folder with `--strict` prints `RESULT: PASSED`.
- [x] T010 Rerun the baseline commands after all cuts. Verify: `npm test` in `S/runtime` finishes in 841 and 911 s with the `cli` lane included, and in `D` in 504 to 511 s.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] All five cuts are built and measured
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---



