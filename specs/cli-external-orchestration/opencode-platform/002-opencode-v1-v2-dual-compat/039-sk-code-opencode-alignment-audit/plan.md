---
title: "Implementation Plan: sk-code alignment audit of every OpenCode plugin and hook file"
description: "Review every tracked OpenCode plugin and hook file in batches against sk-code's SKILLED surface, confirm each finding with an independent reviewer, fix it in one-change briefs and rerun the suites that cover it."
trigger_phrases:
  - "sk code opencode alignment audit plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: sk-code alignment audit of every OpenCode plugin and hook file

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JavaScript (ESM and CommonJS), TypeScript, shell, JSON, Markdown |
| **Framework** | OpenCode 1 and 2 plugin API, runtime hook adapters |
| **Storage** | None |
| **Testing** | node:test, vitest, the dual-version battery |

### Overview
The files split into batches by tree and family. A writer reviews each batch against the SKILLED surface and its language checklists and writes candidate findings. An independent reviewer confirms or rejects each one. Confirmed findings become one-change fix briefs, each checked by the reviewer and by the suites that cover the file. `verify_alignment_drift.py` with its opt-in checks gives a mechanical baseline before and after.
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
Review pipeline: batch review, independent confirmation, one-change fixes, suite reruns.

### Key Components
- **Batch review**: candidate findings per file, each citing the sk-code rule by file and section
- **Confirmation**: a read-only reviewer accepts or rejects each finding and checks each fix
- **review.md**: one row per file, the record the handoff criteria read

### Data Flow
File list from `git ls-files`, batch findings, confirmed findings, fix commits, final rows in `review.md`.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

N/A — record any testing beyond the verification tasks in `tasks.md` here.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

N/A — record dependencies beyond the components named in the architecture here.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

N/A — record rollback steps beyond reverting the scoped change here.
<!-- /ANCHOR:rollback -->

---

