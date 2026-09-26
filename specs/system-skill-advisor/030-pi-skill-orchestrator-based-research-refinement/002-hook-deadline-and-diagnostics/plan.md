---
title: "Implementation Plan: Hook Deadline and Diagnostics"
description: "Nest the shim and hook deadlines through the child environment, add bytes and the real runtime to the advisor's diagnostic record, and add three small guards: a Pi dist-path test, a temp-and-rename log trim and a deadline race on Pi's in-process call."
trigger_phrases:
  - "hook deadline plan"
  - "advisor diagnostics plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Hook Deadline and Diagnostics

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript on Node, ESM |
| **Framework** | Runtime hook adapters in system-spec-kit, advisor runtime and hooks in system-skill-advisor |
| **Storage** | Bounded JSONL diagnostic logs |
| **Testing** | Vitest: `npm test` in `.skilled/skills/system-skill-advisor/runtime`, and `user-prompt-submit-shim.vitest.ts` under `.skilled/skills/system-spec-kit/runtime/tests` |

### Overview
The shim already passes `process.env` to the child (`system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts:105`), and the advisor hook already reads its budget from `SPECKIT_CLAUDE_HOOK_TIMEOUT_MS` (`system-skill-advisor/hooks/claude/user-prompt-submit.ts:164`). So R1 is one environment entry set by the shim when the operator has not set one. R3 extends one record and one list. R7, R11 and R12 are one guard each.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Nested deadlines: every inner deadline ends before the outer one that would kill it, so the inner layer always gets to emit its own fallback.

### Key Components
- **Claude shim** (`system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts`): outer kill at `CHILD_TIMEOUT_MS`. It gains the child budget entry.
- **Advisor Claude hook** (`system-skill-advisor/hooks/claude/user-prompt-submit.ts`): inner budget and fallback emitter. It records bytes and takes the runtime from its caller.
- **Advisor Pi hook** (`system-skill-advisor/hooks/pi/prompt-advisor.ts`): in-process path. It gains a deadline race and a runtime field.
- **Diagnostic record** (`system-skill-advisor/runtime/lib/metrics.ts:347-394`) and **runtime list** (`runtime/lib/advisor-runtime-values.ts:10-14`).

### Data Flow
Codex, Cursor and Devin spawn the Claude shim with a 2,800 ms limit. The shim spawns the advisor hook with a 2,500 ms kill. After this phase the hook's CLI budget sits below 2,500 ms by the measured margin, so the hook returns its fallback to the shim before the kill. Each layer passes the runtime name down through the environment, and the hook writes it into the diagnostic record with the byte count it delivered.

### Readers of the runtime list
Sweep each before editing `advisor-runtime-values.ts`: `hooks/lib/skill-advisor-cli-fallback.ts`, `runtime/lib/normalize-adapter-output.ts`, `runtime/lib/metrics.ts`, `runtime/lib/skill-advisor-brief.ts`, `runtime/lib/scorer/fusion.ts`, `runtime/bench/hook-brief-signal-noise.bench.ts` and `runtime/tests/legacy/advisor-observability.vitest.ts`.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Capture a baseline first: the pass counts of the advisor runtime suite and of `user-prompt-submit-shim.vitest.ts`. Each requirement gets a test that fails before its change. REQ-001's slow-stub test must return `{}` on the unchanged shim, and REQ-004's dist test must fail with the path renamed. Rerun both whole suites at the end and report the delta.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

No other phase. The margin measurement in the first task needs the slowest host the operator supports.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Every change is a tracked source edit plus tests. To undo it, revert this phase's commit. Setting `SPECKIT_CLAUDE_HOOK_TIMEOUT_MS` explicitly also overrides the new shim default without a revert.
<!-- /ANCHOR:rollback -->

---
