---
title: "Implementation Plan: Warn when a playbook scenario's prompt fields disagree"
description: "One advisory check in the operator validator compares each prompt copy with the scenario contract, after normalizing presentation, and reports each disagreement as a warning."
trigger_phrases:
  - "playbook prompt sync warning"
  - "PROMPT_UNSYNCED"
  - "playbook prompt fields disagree"
  - "turn 1 prompt out of sync"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Warn when a playbook scenario's prompt fields disagree

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS |
| **Framework** | None |
| **Storage** | None |
| **Testing** | The validator's own assertion suite, `scripts/tests/validate-playbook-package.test.cjs` |

### Overview
`validatePackage` builds one index from the root playbook, mapping each scenario file to the prompt its summary states, then compares every scenario's contract prompt with its table cell, its chain's Turn 1 and that root prompt. Each disagreement becomes a `PROMPT_UNSYNCED` warning, which leaves status and exit code untouched.
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
- [x] Tests passing
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
One pure check function per concern, called from the existing package loop.

### Key Components
- **`promptValue`**: reduces a copy to its words, dropping surrounding quotes, backticks, `<br>` and extra spacing
- **`contractPrompt`, `tablePrompt`, `chainTurnOnePrompt`**: read each copy with its line number, fenced code masked
- **`rootPromptIndex`**: walks out from each root link to the smallest heading block holding one prompt, skipping blocks that link several scenarios
- **`promptSyncChecks`**: compares the copies with the contract and emits the warnings

### Data Flow
Root playbook to prompt index, then per scenario file: contract prompt, the three copies, comparison, warnings appended to the package report.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Beyond the suite, the check was run on a scratch copy of a 42-scenario playbook with each copy altered in turn, and on the whole corpus with the previous validator for comparison. The suite was also run against three deliberately broken builds of the check to prove each new assertion can fail.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

None beyond the validator's existing fence masking and link resolution, which the new functions reuse.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the commit. The check only adds warnings, so nothing downstream depends on it.
<!-- /ANCHOR:rollback -->

---
