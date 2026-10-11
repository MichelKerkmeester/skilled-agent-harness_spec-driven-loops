---
title: "Implementation Plan: Phase 1: package-strict"
description: "Make all 13 failing skill units pass package_skill.py --check --strict without losing a routing keyword."
trigger_phrases:
  - "package strict plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 1: package-strict

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
Measure first: run the strict check on each unit, and treat a word-limit error as a mask over later findings. Add version keys mechanically. Trim each SKILL.md by moving text whose detail already lives in a reference, never a keyword line. Fix the RULES check at its pattern, after comparing the old and new patterns over every SKILL.md. Then release each touched skill and regenerate the manifests and Hermes copies.
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
