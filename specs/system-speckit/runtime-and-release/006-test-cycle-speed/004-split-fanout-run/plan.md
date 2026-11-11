---
title: "Implementation Plan: Phase 4: split-fanout-run"
description: "fanout-run is the largest of the twelve deep-loop files that run one at a time. Splitting it and moving safe pieces into the parallel group could shorten the serial tail."
trigger_phrases:
  - "split fanout run plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 4: split-fanout-run

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Vitest 4.1 |
| **Framework** | Vitest projects with group order |
| **Storage** | Temp roots per file |
| **Testing** | The deep-loop suite |

### Overview
The file splits along its describe blocks. Each piece starts in the serial list. Pieces then move to the parallel group one at a time, and only proven pieces stay.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met (REQ-004 not met; the change was reverted under the rollback rule)
- [x] Every check named in `tasks.md` run, with its output recorded
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Split, then promote one piece at a time.

### Key Components
- **The pieces**: each a self-contained test file.
- **The serial list in `D/vitest.config.ts`**: names the pieces that still need a quiet machine.

### Data Flow
A piece leaves the serial list, the full suite runs three times, and the piece stays or returns.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow `tasks.md`. Setup records the count and time. Implementation splits the file and promotes pieces one at a time. Verification compares count and time.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

`vitest list` counts, three full-suite runs per promoted piece, and the suite time against 504 to 511 s.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

Phase 2's go.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: a promoted piece fails once, or the suite is not 10% faster. Put that piece back on the serial list, or revert the commit.
<!-- /ANCHOR:rollback -->

---

