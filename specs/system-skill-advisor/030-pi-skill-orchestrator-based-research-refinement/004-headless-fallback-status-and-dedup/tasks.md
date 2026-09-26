---
title: "Tasks: Headless Fallback Status and Dedup"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "fallback status tasks"
  - "fallback dedup tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Headless Fallback Status and Dedup

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

- [ ] T001 Record baseline pass counts for the advisor runtime suite and the plugin suite
- [ ] T002 List every test that pins today's fallback text, starting from the five named in `spec.md` section 3
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 R4: write the failing hook tests for the outage, no-match and skipped heads (`runtime/tests/hooks/claude-user-prompt-submit-hook.vitest.ts`)
- [ ] T004 R4: make the fallback renderer status-aware and rewrite the timeout renderer as the outage head (`runtime/lib/render.ts:443-463`)
- [ ] T005 R4: pass the result's status and freshness to the renderer (`hooks/claude/user-prompt-submit.ts:302`)
- [ ] T006 R4: mirror the three heads in the plugin and add the renderer parity test (`.skilled/plugins/system-skill-advisor.js:61`, `:1298-1318`, `:1371-1383`)
- [ ] T007 [P] R4: teach Pi's debug classifier the three heads (`hooks/pi/prompt-advisor.ts:184`)
- [ ] T008 R4: update the tests T002 listed to the headed text
- [ ] T009 R6: write the five-turn repeat test for the hook and the plugin, plus the no-session-id case
- [ ] T010 R6: stop treating a headed fallback as a fall-open case (`hooks/claude/user-prompt-submit.ts:303-308`, plugin `:267-272`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T011 Show each new test failing on the unchanged code, then passing
- [ ] T012 Run `npm run typecheck` and `npm test` in the advisor runtime and the plugin suite, and report the delta against T001
- [ ] T013 With debug on, run five no-route Claude turns and read the directives-suppressed flag and `emittedBytes` from the diagnostic log
- [ ] T014 Run `validate.sh --strict` on this phase and require `RESULT: PASSED`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Research**: `../001-deep-research/research/research.md` R4 and R6, and open questions Q6 and Q7
<!-- /ANCHOR:cross-refs -->

---
