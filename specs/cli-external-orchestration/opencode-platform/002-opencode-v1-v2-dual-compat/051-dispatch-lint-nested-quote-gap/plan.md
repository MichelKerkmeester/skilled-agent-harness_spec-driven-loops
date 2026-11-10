---
title: "Implementation Plan: Phase 51: dispatch-lint-nested-quote-gap"
description: "Replace the Pi lint's two scan helpers with one context-stack scanner that follows POSIX quoting, refuse what it cannot resolve, and prove each new deny row fails on the engine before the change."
trigger_phrases:
  - "dispatch lint nested quote gap plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 51: dispatch-lint-nested-quote-gap

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, the Pi extension `dispatch-preflight-lint.ts` |
| **Framework** | Pi `tool_call` extension; vitest for its tests |
| **Storage** | None |
| **Testing** | The lint's vitest file, the hooks suites, a mutation run against base `82df5375ba` and a Pi user-text corpus comparison |

### Overview
The old scan kept a quote flag, a depth count and one backtick flag, so a context nested inside a double quote could not hold its own quotes. A stack of frames does: each frame reads characters by its own POSIX rules, and closing it resumes the frame below. The scan walks the whole text, records whether the mention sits inside any frame, and refuses text that ends with a context open or nests past 32.
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
One scanner, one pass, one stack. The frames are `sub` (`$(`), `paren` (a bare `(` inside a substitution), `tick`, `dq` and `sq`.

### Key Components
- **`isEnclosedOrUnresolved`**: inside `'…'` only the closing quote counts. Inside `"…"` a backslash escapes only `$`, a backtick, `"`, `\` and newline, a single quote is a literal, and a backtick or `$(` opens a fresh frame. Inside a backtick or a substitution every quote and substitution opens again, and in a substitution a bare `(` nests and `)` closes. At the top level a bare parenthesis is prose.
- **Fail closed**: depth past 32, or any frame left open at the end, denies. The one exception is a single top-level `'` opened after the mention, the prose apostrophe in `users'`.
- **`isUsableMention`**: calls the scanner on the text with in-word apostrophes already neutralized, before any sentence rule.

### Data Flow
The raw operator text reaches `isUsableMention`, curly quotes become straight quotes, in-word apostrophes become `_`, and the scanner decides whether the mention is plain text. Only plain text goes on to the refusal and reset rules.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The new deny rows run against the base engine through `scratch/mutation.sh`, and each must fail there. The allow and guard rows must pass on both engines. `scratch/pi-corpus-diff.mjs` reads every executor-naming string in the dispatch suites as operator text for a Devin and a Codex dispatch and lists each verdict that moves. `scratch/suites.sh` reruns hooks node, hooks vitest, plugins, the battery, rule-checks and the audit against the baseline. A read-only DeepSeek reviewer probes for leaks.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

`executorSkill` and the refusal rules stay as they are. The audit and rule-check engines in `dispatch/lib` do not call the Pi scanner, so their verdicts cannot move.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the fix commit. The two old helpers return with the recorded gap, and the review and known-gaps records need their P1 restored as recorded.
<!-- /ANCHOR:rollback -->

---
