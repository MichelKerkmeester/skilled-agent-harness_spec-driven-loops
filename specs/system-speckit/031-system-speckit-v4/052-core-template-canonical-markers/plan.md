---
title: "Implementation Plan: Phase 52: Core template canonical markers"
description: "Bring the four core templates and create.sh's phase-mode slots onto the canonical placeholder marker the style guide already prescribes, and make the broad scan recognize that marker, so the existing strict gate catches unfilled slots unchanged."
trigger_phrases:
  - "core template marker plan"
  - "canonical placeholder conformance"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 52: Core template canonical markers

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown templates, Bash |
| **Framework** | None |
| **Storage** | None |
| **Testing** | `test-phase-system.sh`, `test-validation-extended.sh`, vitest, strict validation on fresh scaffolds |

### Overview
The strict gate already fails on the canonical marker, so the cheapest fix is to write the core templates in the form it already checks. This phase rewrites the slots, applies the same form to `create.sh`'s phase-mode output, and closes the broad scan's gap on the marker's punctuation. No new rule is needed.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified
- [x] Open question answered by the operator (2026-09-23)
- [ ] Scaffold-then-validate callers inventoried (T001)
- [ ] Recursive strict baseline recorded (T003)

### Definition of Done
- [ ] REQ-001 to REQ-006 met with evidence
- [ ] All three test suites pass
- [ ] Strict validation passes on this phase
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Change existing values. Widening the broad scan's pattern alone fails, because the strict gate would still pass every unfilled core slot, and a wider pattern starts flagging real bracketed prose in finished docs.

### Key Components
- **Core templates** (`templates/core/*.tmpl`): the source of every new packet's slots.
- **Phase-mode scaffolder** (`create.sh`): writes its own slots into parent maps and child metadata.
- **Broad scan** (`spec/check-placeholders.sh`): the post-edit check, which gains the strict gate's marker pattern.

### Data Flow
`create.sh` renders the templates into a new folder. The post-edit hook runs the broad scan on each write, and `validate.sh --strict` runs `PLACEHOLDER_FILLED` at completion. After this phase, all three meet the same marker.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Scaffold one packet per level into a scratch root and count the `PLACEHOLDER_FILLED` findings against the slots in the templates. Then fill the slots and confirm the pass. Rerun the probe folder from the 2026-09-23 analysis against the broad scan.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

Phase 053 consumes this phase's list of retired default strings (REQ-005), so this phase closes first.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the phase's commit. Packets scaffolded in the meantime keep their canonical markers, which the strict gate reads the same way with or without this phase.
<!-- /ANCHOR:rollback -->

---
