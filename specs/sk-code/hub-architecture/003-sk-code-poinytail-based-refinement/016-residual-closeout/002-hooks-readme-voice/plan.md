---
title: "Implementation Plan: Phase 2: hooks-readme-voice"
description: "Bring the HVR hard blockers in both hooks READMEs to 0 without changing a technical claim."
trigger_phrases:
  - "hooks readme voice plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 2: hooks-readme-voice

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
List each blocker with its line and column, write the replacement sentence for each as literal OLD and NEW text, and hand both lists to DeepSeek as one brief per file. A word diff then shows the change is punctuation and joining words only.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All goal.md criteria pass on the orchestrator's rerun
- [x] Every DeepSeek diff reviewed by the orchestrator before the commit
- [x] Strict validation passes
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
In-place change to existing files; no new layer.

### Key Components
- **Orchestrator**: plans, writes each brief, reviews each diff, reruns every check and commits.
- **Builder**: DeepSeek V4.1 Flash at max effort through cli-pi, one change per brief.

### Data Flow
One brief, then the orchestrator's diff review and the rerun of its check, then the next brief or the phase close.
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

None beyond the files named in spec.md.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert this phase's commit. No other phase depends on its files.
<!-- /ANCHOR:rollback -->

---
