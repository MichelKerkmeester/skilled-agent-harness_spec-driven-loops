---
title: "Implementation Plan: Phase 2: fresh-timing-profile"
description: "Every speed estimate rests on a profile taken before the five cuts. This phase times every test file again, so the next cuts can aim at real costs."
trigger_phrases:
  - "fresh timing profile plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 2: fresh-timing-profile

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Vitest 4.1 |
| **Framework** | Vitest JSON reporter |
| **Storage** | Scratchpad only |
| **Testing** | The suites themselves |

### Overview
Run each lane once with `--reporter=default --reporter=json --outputFile=<file>`. Rank files by `endTime - startTime`. Vitest's summed `import` figure is not wall time, so it is not used.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met (REQ-002: the overlapping runs were not clean)
- [x] Every check named in `tasks.md` run, with its output recorded
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Measure, then decide.

### Key Components
- **The JSON report**: one record per file, with start and end times and per-test durations.

### Data Flow
A lane runs once, the report lands in the scratchpad, and a short script prints the ranking.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow `tasks.md`. Setup checks the machine is quiet and the build is current. Implementation runs the three profiles. Verification writes the tables and the decision.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The profiling runs are the tests. A run with any failure is discarded and repeated.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

None beyond the installed packages.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Nothing to roll back. No file outside this phase changes.
<!-- /ANCHOR:rollback -->

---

