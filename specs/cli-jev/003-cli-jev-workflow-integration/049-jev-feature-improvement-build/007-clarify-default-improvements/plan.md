---
title: "Implementation Plan: Build: improve the Jev routing clarify default (020)"
description: "Make the clarify scorer replay each row on the pinned routers before scoring, record its instrument, report by class and hub against stronger baselines, and stop after two agreeing orders.."
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "architecture decisions"
  - "testing strategy"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Build: improve the Jev routing clarify default (020)

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
| -------- | ------- |
| **Language/Stack** | Node.js (CommonJS) |
| **Framework** | None |
| **Storage** | JSONL run records |
| **Testing** | Node test runner |

### Overview
Make the clarify scorer replay each row on the pinned routers before scoring, record its instrument, report by class and hub against stronger baselines, and stop after two agreeing orders.
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
Other: an offline scorer with a recorded run

### Key Components
- **Eligibility**: replay on the pinned build
- **Report**: digests, class and hub, baselines

### Data Flow
Rows are replayed through `runCensus`, eligible ones are scored with the early stop, and the report writes digests and class and hub tables.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Each behavior gets a case in the existing suite. Replays of the recorded 047 run check that a protocol change keeps its picks. One live re-measure closes the phase.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- `specs/cli-jev/003-cli-jev-workflow-integration/048-jev-feature-improvement-research/007-clarify-default-research/research/research.md`
- Live Jev for the re-measure, behind `jev auth status`
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the phase's commit. The 047 verdict stays on record, so nothing downstream depends on the new one.
<!-- /ANCHOR:rollback -->

---

