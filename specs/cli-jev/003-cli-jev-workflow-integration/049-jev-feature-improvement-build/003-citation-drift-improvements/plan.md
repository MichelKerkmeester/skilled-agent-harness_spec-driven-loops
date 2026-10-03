---
title: "Implementation Plan: Build: improve the Jev citation drift scan (032)"
description: "Change the scan's flag to the lowest rerun, split live from constructed reporting, check recorded hashes, send paragraph claims, cache document reads and rerun adaptively in the uncertain band."
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "architecture decisions"
  - "testing strategy"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Build: improve the Jev citation drift scan (032)

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
| -------- | ------- |
| **Language/Stack** | Node.js (ES modules) |
| **Framework** | None |
| **Storage** | JSONL run records |
| **Testing** | Node test runner |

### Overview
Change the scan's flag to the lowest rerun, split live from constructed reporting, check recorded hashes, send paragraph claims, cache document reads and rerun adaptively in the uncertain band. Then re-measure.
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
- **Flag rule**: lowest rerun below 0.5, modal for reporting
- **Census**: one read per document

### Data Flow
The census reads each citing document once, draws rows with paragraph claims, checks their hashes and asks Jev, rerunning only in the uncertain band.
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

- `specs/cli-jev/003-cli-jev-workflow-integration/048-jev-feature-improvement-research/003-citation-drift-research/research/research.md`
- Live Jev for the re-measure, behind `jev auth status`
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the phase's commit. The 047 verdict stays on record, so nothing downstream depends on the new one.
<!-- /ANCHOR:rollback -->

---

