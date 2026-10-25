---
title: "Implementation Plan: Phase 3: review-remediation"
description: "Apply the deep review's confirmed findings in two passes: re-close the research documents against ADR-002 and a new ADR-003, then fix the sk-code-quality and sk-code-review docs and scripts the review named."
trigger_phrases:
  - "review remediation plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 3: review-remediation

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, Python 3 behind `.sh` names, Node ESM, Bash |
| **Framework** | system-spec-kit packet documents, sk-doc playbook template, sk-code-skilled checklists |
| **Storage** | None |
| **Testing** | `validate.sh --strict`, sk-doc validators, `check-rule-copies.js` and the mode test suites |

### Overview

The packet-side pass writes ADR-003 first, because the goal criteria, AC-009 and CHK-032 all cite its command. It then amends the three goals, the acceptance rows, the task evidence and the research text. The skill-side pass rebuilds the quality playbook root from the template, fixes the review census, adds the COMPONENT headers and adds the Extension Floors section with its canary assertion.
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
Other: documentation and canary maintenance, no runtime code path changes.

### Key Components
- **ADR-003**: the record that scopes the `.skilled` boundary check to the two mode folders over `f8671e07c2..ee8c7e6f24`.
- **Extension Floors**: one list in `sk-code-review/SKILL.md` section 4, pinned line by line by `check-rule-copies.js`.

### Data Flow
`check-rule-copies.js` reads `SKILL.md`, finds the `### Extension Floors` heading, collects the lines up to the next heading or divider and requires each pinned floor inside them.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

`check-rule-copies.test.sh` gains one case that rewords a floor and expects the canary to fail with the floor named. The other changes are documents and headers, covered by the existing validators and suites.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

None beyond the closed research phases and the review report.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the phase's working-tree changes with `git checkout` on the listed files, and restore the four deleted scratch drafts from `git show` where one was tracked.
<!-- /ANCHOR:rollback -->

---
