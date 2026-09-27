---
title: "Implementation Plan: Docs and Standards Alignment for the Advisor Refinements"
description: "Audit the phase 2 to 5 code against the sk-code checklists, inventory every document that describes a changed surface, then have MiMo v2.6 Pro at high effort rewrite each stale passage from a one-file brief that names the code lines behind it."
trigger_phrases:
  - "docs alignment plan"
  - "advisor docs update plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Docs and Standards Alignment for the Advisor Refinements

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown feature-catalog leaves, playbook scenarios and READMEs; one TypeScript Pi extension |
| **Framework** | sk-doc packets sk-create-feature-catalog, sk-create-manual-testing-playbook and sk-create-readme; sk-code quality mode with the OpenCode surface |
| **Storage** | None changed |
| **Testing** | `validate_document.py` per edited document, `validate_catalog_package.py` per catalog package, `validate-playbook-package.cjs` per playbook package; Vitest for the Pi extension fix |

### Overview
The orchestrator runs the mechanical sk-code gates itself and sends MiMo two read-only jobs: a checklist audit of the added lines and a document inventory against a facts sheet. It opens every cited line before a finding counts. Each confirmed stale passage becomes a one-file brief for MiMo, three running at a time, and the orchestrator checks every changed sentence against its code. Files the phase 6 review reads are edited only after that review closes.
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
Audit, inventory, brief, write, verify. The writer never decides what is true. It receives each fact with the code line that proves it.

### Key Components
- **Facts sheet**: the behavior changes of phases 2 to 5, each with its code lines, confirmed by the orchestrator.
- **Inventory**: a read-only MiMo pass that quotes each stale doc line against a fact.
- **Briefs**: one per document or small document group, naming the sentences to change and the validator to run.

### Data Flow
Code, then facts sheet, then inventory, then orchestrator checks, then briefs, then MiMo edits, then validators and an orchestrator read of every diff.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The validators above run before and after the edits, and the delta is recorded. The two edited playbook scenarios were run by hand before their briefs were written, so the commands and signals they list are observed ones. The Pi budget fix gets a Vitest case for a negative budget value.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The phase 6 review must close before the Pi extension, `hooks/skill-advisor-hook.md` and `ARCHITECTURE.md` change.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Every change is a text edit on a tracked file. Revert the phase commit.
<!-- /ANCHOR:rollback -->

---
