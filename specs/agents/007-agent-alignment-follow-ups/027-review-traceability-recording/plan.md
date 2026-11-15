---
title: "Implementation Plan: Phase 27: review-traceability-recording"
description: "Show the traceability result shape in the iteration prompt and make the reducer accept the shapes iterations already write."
trigger_phrases:
  - "review traceability recording plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 27: review-traceability-recording

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown template; Node.js CommonJS; Vitest |
| **Framework** | The deep-loop runtime scripts and the `/deep:*` workflows |
| **Storage** | JSONL state logs and the typed review ledger |
| **Testing** | Vitest in `.skilled/skills/system-deep-loop/runtime` |

### Overview
The prompt change fixes new runs; the reducer change lets recorded and future variant rows count. The coverage rule in `convergence.cjs` is unchanged.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Phase 26 committed

### Definition of Done
- [x] A variant row counts toward coverage in a test
- [x] The before and after count over recorded packets is in the summary
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Normalize at the one reader that builds the rollup.

### Key Components
- **Prompt pack**: the result example and the core-protocol instruction
- **`buildTraceabilityRollup`**: stores a normalized copy of each result

### Data Flow
Iteration row, then the reducer's rollup in the registry, then the coverage gate.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Unit tests for the rollup and one test through `terminal-gates.cjs`; a before and after count on copies of recorded packets.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

No new package.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the phase commit.
<!-- /ANCHOR:rollback -->

---

