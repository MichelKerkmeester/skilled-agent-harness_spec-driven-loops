---
title: "Implementation Plan: Build: improve the Jev fan-out merge (030)"
description: "Extend the fan-out pair scorer with two extra baselines, a two-call early stop with a symmetric tiebreak, a self-describing report and a cut sweep."
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "architecture decisions"
  - "testing strategy"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Build: improve the Jev fan-out merge (030)

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
| **Testing** | Vitest |

### Overview
Extend the fan-out pair scorer with two extra baselines, a two-call early stop with a symmetric tiebreak, a self-describing report and a cut sweep. Then re-measure once under the amended protocol.
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
- **Baselines**: constant-same and lexical-rule rows beside the oracle
- **Call protocol**: two orders, a third only on disagreement

### Data Flow
Pairs are read, Jev is called per order until two agree or three have run, and the report writes every baseline and input digest.
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

- `specs/cli-jev/003-cli-jev-workflow-integration/048-jev-feature-improvement-research/001-fanout-merge-research/research/research.md`
- Live Jev for the re-measure, behind `jev auth status`
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the phase's commit. The 047 verdict stays on record, so nothing downstream depends on the new one.
<!-- /ANCHOR:rollback -->

---

