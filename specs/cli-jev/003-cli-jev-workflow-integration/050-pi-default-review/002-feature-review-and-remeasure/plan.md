---
title: "Implementation Plan: Phase 2: Review, test, re-measure and fix nine Jev features"
description: "One fresh Opus reviewer works the nine features in turn: read, test, re-measure, fix, re-measure again when a fix changes the protocol."
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "architecture decisions"
  - "testing strategy"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 2: Review, test, re-measure and fix nine Jev features

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
| -------- | ------- |
| **Language/Stack** | Node.js, TypeScript and Python scorers |
| **Framework** | None |
| **Storage** | JSONL call records |
| **Testing** | Each scorer's own suite |

### Overview
One fresh Opus reviewer works the nine features in turn: read, test, re-measure, fix, re-measure again when a fix changes the protocol. Workers build larger fixes and review each fix from another model family. The session verifies each claim and commits.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Other: a review loop over offline scorers with recorded runs

### Key Components
- **Reviewer**: Fresh Claude Opus 5.5 at xhigh
- **Workers**: DeepSeek V4.1 Flash max on cli-pi and Luna 6 max fast on cli-codex

### Data Flow
For each feature, the reviewer reads the scorer and its last verdict, runs the suite, runs the live re-measure with `--out` and writes a log row. A defect becomes a fix, reviewed by another family, then a fresh re-measure.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Each feature's own suite runs before and after any fix. Each live re-measure is checked against its recorded run folder.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Pi 0.99.2 and its `typesafe` and `openrouter` classifiers
- Live Jev behind `jev auth status`
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert any fix commit. The earlier verdicts stay on record in their phases.
<!-- /ANCHOR:rollback -->

---

