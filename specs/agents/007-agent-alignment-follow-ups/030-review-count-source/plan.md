---
title: "Implementation Plan: Phase 30: review-count-source"
description: "Make the verdict script the one source of review finding counts for the report and the closeout, with a closeout check on single-executor runs."
trigger_phrases:
  - "review count source plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 30: review-count-source

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS; Vitest; workflow YAML |
| **Framework** | The deep-loop runtime scripts and the `/deep:*` workflows |
| **Storage** | JSONL state logs and the typed review ledger |
| **Testing** | Vitest in `.skilled/skills/system-deep-loop/runtime` |

### Overview
The workflow binds the script's counts; the closeout compares them with the registry it already reads.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Phase 29 committed
- [x] Gateway probe recorded

### Definition of Done
- [ ] Report and closeout use the script's counts
- [ ] The closeout refuses a mismatch on a single-executor run
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
One count source, checked at the closeout.

### Key Components
- **`review-verdict.cjs`**: the count source
- **`synthesis-closeout.cjs`**: the check

### Data Flow
Registry and state log, then the verdict script, then the report and the closeout.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

A closeout test for mismatch, match and fan-out; contract drift and parity.
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

