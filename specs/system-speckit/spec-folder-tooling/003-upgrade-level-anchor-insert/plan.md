---
title: "Implementation Plan: Insert Level 2 sections above the questions anchor on upgrade"
description: "Change the Level 2 insertion in `upgrade-level.sh` to split above the questions anchor when the anchor sits directly above the OPEN QUESTIONS heading, and pin it with one vitest case."
trigger_phrases:
  - "upgrade level anchor insert plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Insert Level 2 sections above the questions anchor on upgrade

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash, TypeScript vitest |
| **Framework** | None |
| **Storage** | None |
| **Testing** | vitest (`cli` project) and `test-upgrade-level.sh` |

### Overview
Change the Level 2 insertion in `upgrade-level.sh` to split above the questions anchor when the anchor sits directly above the OPEN QUESTIONS heading, and pin it with one vitest case.
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
- [x] `upgrade-level-sections.vitest.ts` passes 4 of 4 and `test-upgrade-level.sh` passes 14 of 14
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single function change

### Key Components
- **`upgrade_spec_l1_to_l2` in `upgrade-level.sh`**: writes the upgraded `spec.md`

### Data Flow
The function finds the OPEN QUESTIONS heading, moves the split up one line when the anchor sits above it, then writes the head, the Level 2 fragment, the anchor, the renumbered heading and the rest.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. Setup reproduces the defect, Implementation fixes it with a test, and Verification reruns the suites.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Run `npx vitest run --config ../../vitest.config.ts --project cli tests/upgrade-level-sections.vitest.ts` from `runtime/cli` and `bash runtime/cli/tests/test-upgrade-level.sh`, then upgrade a fresh Level 1 packet and run `validate.sh --strict` on it.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

None. No new package.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the commit. The change is one function and its test.
<!-- /ANCHOR:rollback -->

---
