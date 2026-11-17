---
title: "Implementation Plan: Phase 52: duplicate-hop-title-numbers"
description: "Change two places in the loop wrapper: name_stem strips every trailing bracketed number, and the launch reset clears an inherited hop count. Prove both with wrapper tests that fail on the old code."
trigger_phrases:
  - "duplicate hop title numbers plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 52: duplicate-hop-title-numbers

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash 3.2 compatible shell, Node.js tests |
| **Framework** | None |
| **Storage** | None |
| **Testing** | node:test, vitest |

### Overview
`name_stem` in `.skilled/bin/skilled-loop` strips every trailing ` (<digits>)` from a name, replacing a rule that stripped only the number the hop count predicted. The launch reset adds `SKILLED_LOOP_HOPS` to the loop variables it clears, so each fresh wrapper counts from 0. Both call sites of `name_stem`, the hop path and the manual command path, get the new rule.
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
- [x] `node --test .skilled/hooks/session-handover/tests/*.test.cjs` prints `fail 0`, and the hooks vitest config prints `509 passed`
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Two small wrapper changes.

### Key Components
- **`name_stem` in `.skilled/bin/skilled-loop`**: turns the sender's live name into the stem the receiver's number is added to.
- **The launch reset in `.skilled/bin/skilled-loop`**: clears loop variables a fresh wrapper must not inherit.

### Data Flow
`prepare` records the sender's live name, `consume` prints it, the wrapper passes it through `name_stem`, exports the result as `SKILLED_LOOP_NAME` and launches the receiver with `--name "<stem> (<hops + 1>)"`. `hops` starts at 0 for each fresh wrapper and counts up inside it.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. Setup reproduces the stacked name, Implementation writes the tests and changes the wrapper, and Verification runs the suites and the strict validation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The new and changed tests run against the original wrapper first, by writing `git show HEAD:.skilled/bin/skilled-loop` over the file and restoring the fixed copy, checked by checksum. Then the whole node suite and the hooks vitest config run with the enclosing loop session's `SKILLED_LOOP_*` and `SESSION_HANDOVER_*` variables removed, since a looped session's environment leaks into two adapter tests.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

`bash` 3.2 at `/bin/bash`, which the wrapper tests run under, and `node`. No new package.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: a looped session's name loses text the operator needs, or a loop that relied on an inherited hop count runs past its intended cap. Revert the two wrapper changes, the test changes and the two doc lines.
<!-- /ANCHOR:rollback -->

---
