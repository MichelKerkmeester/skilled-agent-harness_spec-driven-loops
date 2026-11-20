---
title: "Implementation Plan: Phase 15: reducer-test-focus-contract"
description: "Update three cases in the spec-kit CLI deep-research reducer test so they assert the leaf-first Next Focus contract phase 004 shipped. The reducer stays unchanged; the full CLI vitest project proves the fix."
trigger_phrases:
  - "reducer test focus contract plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 15: reducer-test-focus-contract

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript test over a CommonJS reducer |
| **Framework** | Vitest |
| **Storage** | None (temporary fixture folders) |
| **Testing** | Vitest, `cli` project of the spec-kit runtime config |

### Overview
Three test cases change in one file. One expectation moves to the leaf recommendation; two fixtures set the leaf recommendation to a resolved question so their original branch assertions still hold. The full CLI vitest project proves it.
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
- [x] `npx vitest run --config ../../vitest.config.ts --project cli` from `.opencode/skills/system-spec-kit/runtime/cli` reports 0 failed
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Test expectation alignment

### Key Components
- **`deep-research-reducer.vitest.ts`**: the only file that changes

### Data Flow
Each case writes a fixture research folder, runs `reduceResearchState`, and reads the rendered strategy `11. NEXT FOCUS` section.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup reproduces the 3 failures and bisects them to the phase 004 commit. Implementation edits the three cases in the test file. Verification runs the reducer test file and the full CLI project. Ordered work is in `tasks.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The reducer test file must print `Tests  13 passed (13)`, and the full CLI project must report 0 failed with the same test total as the baseline.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

None. No new package.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: the phase 004 Next Focus rule is reverted. Revert this phase's commit with `git revert`.
<!-- /ANCHOR:rollback -->

---
