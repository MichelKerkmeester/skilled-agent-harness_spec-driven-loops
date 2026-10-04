---
title: "Implementation Plan: Jev feature follow-ups"
description: "The session is master orchestrator."
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "architecture decisions"
  - "testing strategy"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Jev feature follow-ups

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
| -------- | ------- |
| **Language/Stack** | Node.js ESM and CommonJS, TypeScript, Python |
| **Framework** | None |
| **Storage** | JSONL call records |
| **Testing** | `node --test`, vitest, pytest |

### Overview
The session is master orchestrator. Three fresh Opus 5.5 leads run in parallel on disjoint files, then a fourth runs 017 R8. Each lead drives DeepSeek V4.1 Flash max workers on cli-pi and reviews their work. The session verifies each stream and commits it.
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
Other: parallel streams on disjoint files, then one follow-on stream

### Key Components
- **Leads**: Fresh Claude Opus 5.5, one per stream
- **Workers**: DeepSeek V4.1 Flash max on cli-pi, Cline then OpenCode Go

### Data Flow
A lead reads its stream's items, briefs DeepSeek workers one change at a time, reviews each diff and runs its tests. The session reruns the suites and checks every claimed number before committing the stream.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Each change gets a case in its suite. Every suite runs with the key set and unset. Each re-measure is checked against its run folder.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Pi 0.99.2 and the Typesafe key read per process
- Live Jev behind `jev auth status`
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Each stream is its own commit, so each reverts alone. `SKDOC_CITE_DRIFT_CHECK=0` or the variable the stream names turns 032's check off without a revert.
<!-- /ANCHOR:rollback -->

---

