---
title: "Implementation Plan: Phase 9: repo-rules-readme"
description: "Teach the repo-rules checker and card builder to skip the folder README, the same match the document validator already uses, then write the README under the alert and fold rule and gate it."
trigger_phrases:
  - "repo rules readme plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 9: repo-rules-readme

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js scripts, Python tests, Markdown |
| **Framework** | sk-create-repo-rule scripts, sk-doc `validate_document.py` |
| **Storage** | None |
| **Testing** | pytest, `node --test`, `run-script-tests.sh` |

### Overview
Two scripts list the rules folder and read every `.md` file as a rule. Each gets one filter that skips a case-insensitive `readme.md`, with a test that fails first. The README is then written from the general template, and the full README and repo-rules gates run with it in place.
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
- [x] `check-repo-rules.cjs` prints `RESULT: PASSED (11/11 checks)` with the README in place, and `run-script-tests.sh` prints `all sk-doc script tests passed`
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
One filter per lister.

### Key Components
- **`loadContext` in `check-repo-rules.cjs`**: lists the rule files every check reads
- **`listRules` in `build-rule-cards.cjs`**: lists the rule files that get a card

### Data Flow
Both listers now drop `readme.md` before any check or card sees the file list. The document validator types the same file as a README, so it gets README rules there.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. Setup probes the checker with a README in place. Implementation adds the two filters, their tests and the README. Verification runs the gates.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

One fixture test per script, each run red before the filter and green after. The doctor AGENTS.md suites copy the real folder and run the checker, so they test the README in place.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

None beyond the components named in the architecture.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the phase commit. The README, both filters and both tests sit in it, and removing the README alone also leaves the checker passing.
<!-- /ANCHOR:rollback -->

---
