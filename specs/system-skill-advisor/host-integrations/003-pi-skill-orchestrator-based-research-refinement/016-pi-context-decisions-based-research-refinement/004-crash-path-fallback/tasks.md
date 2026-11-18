---
title: "Tasks: Crash-Path Fallback and Threshold Doc Line"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "crash path fallback tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Crash-Path Fallback and Threshold Doc Line

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

`A` is `.skilled/skills/system-skill-advisor/`. `HOOKS` is `npx vitest run tests/hooks`, run from `A/runtime/`.

Code comments carry the durable reason only. They name no phase, packet, review item or finding id.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Re-read the catch before editing (`A/hooks/claude/user-prompt-submit.ts`). Verify: `sed -n 468,480p A/hooks/claude/user-prompt-submit.ts` shows `} catch {` and ends with `return {};` and `}`.
  - Evidence: lines 468-480 showed `} catch {`, the `fail_open` diagnostic and `return {};`.
- [x] T002 Record the hook suite baseline (`A/runtime/tests/hooks/`). Verify: `HOOKS` exits 0 and prints its pass count.
  - Evidence: `HOOKS` exit 0, 11 files, 170 of 170.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Add the failing test first: stub `buildCliBrief`, inject a `renderBrief` that throws, expect `additionalContext` to equal `expectedOutageContext('fail_open')` and the diagnostic `errorCode` to be `UNKNOWN` (`A/runtime/tests/hooks/claude-user-prompt-submit-hook.vitest.ts`). Verify: `HOOKS` fails on exactly this test, because the handler still returns `{}`.
  - Evidence: Luna leaf; `HOOKS` then failed only this test, 1 failed and 170 passed, receiving `{}` where the outage context was expected; `renderBrief` was called once.
- [x] T004 Add `renderAdvisorTimeoutFallback` to the render import, and in the catch return it as `additionalContext` inside a nested try whose catch returns `{}` (`A/hooks/claude/user-prompt-submit.ts`). Verify: `HOOKS` exits 0, with the new test passing.
  - Evidence: Luna leaf; `HOOKS` exit 0, 171 of 171.
- [x] T005 [P] Add one sentence to the `SPECKIT_ADVISOR_CONFIDENCE_THRESHOLD` row: the value is read once when the daemon starts, the per-request `confidenceThreshold` option of `advisor_recommend` is the supported override, and hook briefs always send `confidenceThreshold` 0.8 (`A/hooks/lib/skill-advisor-cli-fallback.ts:245`), so the variable never reaches them (`.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md`). Verify: `rg -n 'daemon starts' .skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md` prints line 382, and `rg -n 'never reaches' .skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md` prints the same line.
  - Evidence: Luna leaf, anchored on text unique to line 382 because line 383 ends with the same words; both `rg` commands print line 382. The claim that hooks always send 0.8 was checked: no hook sets `thresholdConfig`, so `skill-advisor-cli-fallback.ts:245` defaults to 0.8.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Run the typecheck (`A/runtime/`). Verify: `npm --prefix A/runtime run typecheck` exits 0.
  - Evidence: typecheck exit 0; `npm run build` exit 0.
- [x] T007 Confirm this phase's own changes touch only the three planned files (`git`). Verify: `git show --name-only --format= 31469e5ee4e cfad65c7c72` prints `user-prompt-submit.ts`, `claude-user-prompt-submit-hook.vitest.ts` and `ENV-REFERENCE.md` paths, and nothing else. A whole-worktree `git diff --stat` also lists phase 002's files while they are uncommitted.
  - Evidence: this phase adds only the three planned files. Phase 002's uncommitted changes share the worktree, so the whole-worktree diff also lists those; none of them is touched here.
- [x] T008 Check comment hygiene in the changed code (`A/hooks/`, `A/runtime/tests/`). Verify: `git diff -U0 -- A | rg -n '^\+.*(R2|N1|016-|phase 0)'` prints nothing.
  - Evidence: `rg` printed nothing (exit 1).
- [x] T009 Record the files, the test result and the 0-fire count (`implementation-summary.md`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <this folder> --strict --quiet` prints `RESULT: PASSED`.
  - Evidence: summary records files, test results, the 0-fire count and the refutation verdicts; strict validation passed.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] `HOOKS` exits 0 with the new test, and the doc sentence is on line 382
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Research**: See `../001-deep-research/research/review-overengineering-opus-high.md`, Groups 1 and 2
<!-- /ANCHOR:cross-refs -->

---
