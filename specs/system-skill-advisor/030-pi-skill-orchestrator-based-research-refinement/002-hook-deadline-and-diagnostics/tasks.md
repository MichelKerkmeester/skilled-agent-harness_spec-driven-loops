---
title: "Tasks: Hook Deadline and Diagnostics"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "hook deadline tasks"
  - "advisor diagnostics tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Hook Deadline and Diagnostics

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

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Record baseline pass counts for the advisor runtime suite and the shim suite (`runtime/`, `user-prompt-submit-shim.vitest.ts`). Evidence: advisor 888 passed, 3 failed, 6 skipped of 897 (the 3 failures were in command bridges, command metadata and the routing-divergence ratchet, outside the hook code); typecheck exit 0; shim 5/5; plugin 29/29
- [x] T002 Measure child start-up, node start plus module load, on the slowest supported host and fix the R1 margin from it (`system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts`). Evidence: hook run with a 1 ms CLI budget under load average 6.87 took p50 69 ms, max 135 ms; margin set to 300 ms, child budget 2,200 ms
- [x] T003 Sweep the seven readers of the runtime list named in `plan.md` and note any that switch on its values. Evidence: `runtime/lib/metrics.ts:21` held a second copy of the list and validated records against it, now a re-export of the canonical list; the bench matrix is excluded from typecheck and tolerates missing keys; `advisor-observability.vitest.ts:60` pinned the list and was updated; `SPECKIT_RUNTIME` already existed as the scorer's metrics label (`runtime/lib/scorer/fusion.ts:876`) and was reused
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 R1: write the failing slow-stub shim test, then set the child's `SPECKIT_CLAUDE_HOOK_TIMEOUT_MS` to `CHILD_TIMEOUT_MS` minus the margin when unset (`system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts`)
- [x] T005 R3: add `pi`, `codex`, `cursor` and `devin` to the runtime list (`runtime/lib/advisor-runtime-values.ts`)
- [x] T006 R3: add `emittedBytes` and the directives-suppressed flag to the record and its schema (`runtime/lib/metrics.ts:347-394`)
- [x] T007 R3: record delivered bytes and take the runtime from the caller instead of the `'claude'` literal (`hooks/claude/user-prompt-submit.ts:203`)
- [x] T008 [P] R3: pass the runtime name from the Codex, Cursor and Devin adapters and from Pi's in-process call
- [x] T009 [P] R7: add the dist-path contract test (`runtime/tests/hooks/prompt-advisor.vitest.ts`)
- [x] T010 [P] R11: replace the plain trim rewrite with temp-file-and-rename (`runtime/lib/metrics.ts:309-311`)
- [x] T011 [P] R12: race the in-process advisor await against the budget plus the margin (`hooks/pi/prompt-advisor.ts:242-250`)
- [x] T016 Await pending diagnostic writes, capped at 100 ms, before the hook's CLI entry exits, so subprocess turns persist their records (`hooks/claude/user-prompt-submit.ts`). Found during T014: with debug on, Claude and Codex turns persisted nothing because the process exits before the fire-and-forget append settles
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Show each new test failing on the unchanged code, then passing. Evidence: every return reported its failing run before the change, for example the default budget read `null` and the slow stub returned `{}`, adapters recorded `claude`, the trim kept 200 of 301 records, and the R7 test failed on a broken path
- [x] T013 Run `npm run typecheck` and `npm test` in the advisor runtime and the shim suite, and report the delta against T001. Evidence: advisor 903 passed, 1 failed, 6 skipped of 910 (baseline 888, 3, 6 of 897); the 13 added tests are this phase's; the one failure is the `rr-iter3-093` routing divergence, identical at baseline; typecheck exit 0 in both packages; shim and adapter 10/10; plugin 29/29; sk-code drift guards passed
- [x] T014 With debug on, run one Claude turn and one Pi turn and read `emittedBytes` and `runtime` from the diagnostic log. Evidence: after the dist rebuild, records for `claude` (real shim), `codex` (Codex adapter) and `pi` (in-process), each with `emittedBytes` 260
- [x] T015 Run `validate.sh --strict` on this phase and require `RESULT: PASSED`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Research**: `../001-deep-research/research/research.md` R1, R3, R7, R11 and R12
<!-- /ANCHOR:cross-refs -->

---
