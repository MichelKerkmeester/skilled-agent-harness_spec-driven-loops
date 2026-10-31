---
title: "Implementation Plan: Phase 25: doctor-scenario-runs"
description: "Pilot one scenario, then run the update fixture batch, the current-code batches and the copy-or-clone batch, one scenario at a time, rerunning only after a named cause is fixed."
trigger_phrases:
  - "doctor scenario runs plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 25: doctor-scenario-runs

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Pi print mode, Bash runner |
| **Framework** | The doctor command contracts |
| **Storage** | Result files per scenario |
| **Testing** | Scenario Pass/Fail criteria |

### Overview
A runner gave each Pi session one scenario, its working copy and a result path, then checked the working copy's git status. DeepSeek v4.1 flash ran at max thinking through opencode-go.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
One scenario per session, sequential, verdict plus evidence per criterion.

### Key Components
- **Runner**: brief template, per-run time limit, clean-status check
- **Update fixture**: six update scenarios
- **Current-code environment**: 26 scenarios
- **Own copy or clone**: four scenarios

### Data Flow
Pilot, batch A, batch B1, fixes and reruns, batch B2, final reruns and batch C.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Each result records every Pass/Fail criterion of its scenario with the observed output. The pilot's numbers were compared with an earlier independent run on the same fixture and matched.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

N/A — record dependencies beyond the components named in the architecture here.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the manifest and README commits. The runs wrote nothing tracked.
<!-- /ANCHOR:rollback -->

---
