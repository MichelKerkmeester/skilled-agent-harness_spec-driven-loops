---
title: "Tasks: Crash-Fallback Edge Cases"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "crash fallback edge cases tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Crash-Fallback Edge Cases

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

`A` is `.skilled/skills/system-skill-advisor/`. `ENV` is `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md`. Run every command from the repository root unless it says `from A/runtime/`.

- `FILE` is `npx vitest run tests/hooks/claude-user-prompt-submit-hook.vitest.ts`, run from `A/runtime/`.
- `HOOKS` is `npx vitest run tests/hooks tests/parity`, run from `A/runtime/`.
- The eight tests and their names, the two helper names and the literal doc sentences are fixed in `plan.md` section 3. Every brief pastes them from there.

Luna leaves are T003 to T008 and T010 to T012, one change per brief, following `../delegation-strategy.md`. Every other task is the conductor's. Code comments carry the durable reason only. They name no phase, packet, review item or finding id.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Conductor: re-read the handler, its catch and both doc lines before editing (`A/hooks/claude/user-prompt-submit.ts`, `ENV`, `A/hooks/skill-advisor-hook.md`). Verify: `sed -n 313,317p A/hooks/claude/user-prompt-submit.ts` shows `const startedAt` and `const elapsed` before `try {`. `sed -n 469,492p` on the same file shows the catch with `renderAdvisorTimeoutFallback()` on `:486`. `rg -n "unless \`confidenceOnly\`" ENV` prints line 382, and `rg -n 'exception escapes' A/hooks/skill-advisor-hook.md` prints line 57. A shifted line halts the phase until the briefs are updated.
- [ ] T002 Conductor: record the baselines (`A/runtime/tests/`). Verify: `FILE` exits 0, and `HOOKS` exits 0 with its pass count. `tests/hooks` alone held 171 of 171 on 2026-11-18.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Luna leaf: add the fifth `renderBrief` parameter to `runHookWithStore`, then tests 1 and 2, for setup wording and the skipped prompt (`A/runtime/tests/hooks/claude-user-prompt-submit-hook.vitest.ts`). Verify: `FILE` fails on exactly these two tests, and every existing test still passes.
- [ ] T004 Luna leaf: add tests 3, 4 and 5, for directive dedup, the deferred receipt and the throwing store (`A/runtime/tests/hooks/claude-user-prompt-submit-hook.vitest.ts`). Verify: `FILE` fails on tests 1 to 4, and test 5 passes.
- [ ] T005 Luna leaf: add test 6, the policy observation under `pi` (`A/runtime/tests/hooks/claude-user-prompt-submit-hook.vitest.ts`). Verify: `FILE` also fails on test 6, with the crash record count at 0.
- [ ] T006 Luna leaf: add tests 7 and 8, the throwing clock (`A/runtime/tests/hooks/claude-user-prompt-submit-hook.vitest.ts`). Verify: `FILE` fails on exactly seven tests, numbers 1 to 4 and 6 to 8. The existing tests and test 5 pass.
- [ ] T007 [P] Luna leaf: replace the `confidenceOnly` sentence on line 382 with the literal text from `plan.md` section 3 (`ENV`). Verify: `rg -n "unless \`confidenceOnly\`" ENV` prints nothing. `rg -n 'skips only the uncertainty check' ENV` and `rg -n 'daemon starts' ENV` each print line 382. `git diff --numstat -- ENV` prints 1 added and 1 deleted line.
- [ ] T008 [P] Luna leaf: replace the last sentence of line 57 with the literal text from `plan.md` section 3 (`A/hooks/skill-advisor-hook.md`). Verify: `rg -n 'exception escapes' A/hooks/skill-advisor-hook.md` prints nothing. `rg -n 'outage fallback' A/hooks/skill-advisor-hook.md` prints line 57 alone. `git diff --numstat` on the file prints 1 added and 1 deleted line.
- [ ] T009 Conductor: confirm each red fails for its own reason (`A/runtime/tests/hooks/claude-user-prompt-submit-hook.vitest.ts`). Verify: test 1 shows an outage head without `/doctor:setup`. Test 2 shows `Advisor: outage (fail_open)` where `Advisor: prompt skipped.` was expected. Tests 3 and 4 show the `Directives:` block on the repeat turn. Test 6 shows 0 records. Tests 7 and 8 show a rejection with `clock`. Test 5 passes.
- [ ] T010 Luna leaf: move the dedup block (`:396-432`) into `applyDirectiveLifecycle` and the delivery block (`:448-467`) into `finishAdvisorDelivery`, and call both from the normal path, with no behavior change. Update the moved comment as `plan.md` says (`A/hooks/claude/user-prompt-submit.ts`). Verify: `FILE` fails on the same seven tests as T009 and on nothing else, and `npm --prefix A/runtime run typecheck` exits 0.
- [ ] T011 Luna leaf: hoist `prompt`, `workspaceRoot`, `skippedResult` and `deliveryState` and replace `:313-314` with the guarded `elapsed`. Read the clock after the invalid-payload return (`A/hooks/claude/user-prompt-submit.ts`). Verify: tests 7 and 8 pass and `FILE` fails on exactly tests 1 to 4 and 6. The typecheck exits 0.
- [ ] T012 Luna leaf: rewrite the catch to the literal text in `plan.md` section 3 (`A/hooks/claude/user-prompt-submit.ts`). Verify: `FILE` exits 0, and `rg -n 'renderAdvisorTimeoutFallback\(\)' A/hooks/claude/user-prompt-submit.ts` prints nothing.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T013 Conductor: run the typecheck and the build (`A/runtime/`). Verify: `npm --prefix A/runtime run typecheck` exits 0, then `npm --prefix A/runtime run build` exits 0.
- [ ] T014 Conductor: run the hook and parity suites (`A/runtime/tests/`). Verify: `HOOKS` exits 0, with a pass count 8 above the T002 count.
- [ ] T015 Conductor: rerun the planning probe on the new build (`scratch/probe.mjs`). Verify: from `A/runtime/`, `node <this folder>/scratch/probe.mjs "$PWD/dist"` prints the setup hint on `(a)`, `Advisor: prompt skipped.` on `(b)`, `directives=false` on `(c) turn 2`, a crash record count equal to the timeout-path count on `(d)` and `(e) resolved` with the outage head.
- [ ] T016 Conductor: confirm the diff holds only the four planned files (`git`). Verify: `git diff --stat -- A/hooks A/runtime/tests/hooks ENV` lists `user-prompt-submit.ts`, `skill-advisor-hook.md`, `claude-user-prompt-submit-hook.vitest.ts` and `ENV-REFERENCE.md` and nothing else.
- [ ] T017 Conductor: check comment hygiene in the changed code (`A/hooks/`, `A/runtime/tests/hooks/`). Verify: `git diff -U0 -- A/hooks/claude A/runtime/tests/hooks | rg -n '^\+.*(R2|N1|016-|phase 0|finding)'` prints nothing and exits 1.
- [ ] T018 Conductor: read the catch once more against SC-002 (`A/hooks/claude/user-prompt-submit.ts`). Verify: in `sed -n` over the new catch, every call outside the nested try is `emitDiagnostic` and its arguments name only hoisted values and `elapsed()`. The innermost catch returns `{}`.
- [ ] T019 Conductor: record the files, every red reason, the test counts, the probe output and the 004 amendment (`implementation-summary.md`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <this folder> --strict --quiet` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] `HOOKS` exits 0 with the eight new tests, and the doc checks in T007 and T008 print what they say
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Source findings**: `tmp/p004-briefs/last-refute.txt` at the repository root
- **Amended decision**: `../004-crash-path-fallback/implementation-summary.md:80`
<!-- /ANCHOR:cross-refs -->

---
