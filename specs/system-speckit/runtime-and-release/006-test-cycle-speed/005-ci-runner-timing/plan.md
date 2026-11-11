---
title: "Implementation Plan: Phase 5: ci-runner-timing"
description: "Every timing so far comes from an 18-core Mac. This phase reads how long both suites take on GitHub's runner and sets a worker cap only if the numbers call for one."
trigger_phrases:
  - "ci runner timing plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 5: ci-runner-timing

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | GitHub Actions, `gh` |
| **Framework** | Actions run history |
| **Storage** | None |
| **Testing** | Existing CI runs |

### Overview
CI already runs both suites on every push. Their step times before and after the cuts answer the question without a new workflow.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met (REQ-001 has one run after the cuts, not two)
- [x] Every check named in `tasks.md` run, with its output recorded
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Read existing evidence before changing anything.

### Key Components
- **`gh run list` and `gh run view`**: list the runs and their step times.

### Data Flow
The runs are listed by workflow, the test steps' times are read, and the before and after medians are compared.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow `tasks.md`. Setup lists the runs. Implementation reads the step times and failures. Verification writes the comparison and the decision.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

No new test. When a cap is added, CI's next two runs must pass and be no slower.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

At least two CI runs after the cuts.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: a cap makes CI slower or fail. Revert the commit that added it.
<!-- /ANCHOR:rollback -->

---

