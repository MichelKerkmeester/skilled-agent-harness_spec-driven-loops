---
title: "Implementation Plan: Phase 2: parent-goal-budget"
description: "Cut the 011 parent goal under its 4,000-character budget without dropping a criterion, built by DeepSeek V4.1 Flash through cli-pi and verified by the orchestrator."
trigger_phrases:
  - "parent goal budget plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 2: parent-goal-budget

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Files named in spec.md section 3 |
| **Framework** | The repository's own generators, hooks and validators |
| **Storage** | None |
| **Testing** | The checks in goal.md, rerun by the orchestrator |

### Overview
Bring the 011 parent goal to 3,800 characters or fewer, leaving room for the sibling rows, while keeping all six criteria. The orchestrator writes each brief with one change, dispatches it to DeepSeek V4.1 Flash at max effort through cli-pi, and reruns the named check before the next brief.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] All goal.md criteria pass on the orchestrator's rerun
- [ ] Every new test failed once before its change
- [ ] Strict validation passes
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
In-place change to existing files; no new layer.

### Key Components
- **Builder**: DeepSeek V4.1 Flash through cli-pi, one change per brief.
- **Orchestrator**: plans, writes briefs, reruns every check, commits.

### Data Flow
Brief, then builder edit, then orchestrator rerun of the check, then the next brief or the phase close.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The goal.md criteria are the tests. A new test is run once against the unchanged code first and must fail there.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The cli-pi executor and the LLM Gateway route, with the cline route as the fallback.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert this phase's commit. No other phase depends on its files.
<!-- /ANCHOR:rollback -->

---
