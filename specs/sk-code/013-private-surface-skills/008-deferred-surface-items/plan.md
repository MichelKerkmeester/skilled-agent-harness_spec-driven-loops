---
title: "Implementation Plan: Phase 8: deferred-surface-items"
description: "Adds four field rules for an external surface_detection block to the skill-root metadata gate, declares blocks in the two private surface skills, trims the public JavaScript and CSS overlay to checks that hold on every public surface, and settles the comment-hygiene allowlist. Each change is proved by its own tests and the CI-form gate run."
trigger_phrases:
  - "deferred surface items plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.3 -->
# Implementation Plan: Phase 8: deferred-surface-items

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS, Bash, Markdown and JSON |
| **Framework** | None |
| **Storage** | None |
| **Testing** | `node --test`, the shell test harnesses beside each script, `validate_document.py` |

### Overview
The metadata gate gains four rules for an external block, each with a failing case. The two private skills get blocks with markers that only their own repositories carry. The public overlay drops the Webflow checks that the private skill already holds, and the comment-hygiene allowlist keeps only the entries something still uses.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented: `spec.md` sections 2 and 3
- [x] Success criteria measurable: `spec.md` section 5 names two commands
- [x] Dependencies identified: phase 007 on `main` and the operator's answers of 2026-10-25

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Validator rule extension

### Key Components
- **`ci-skill-root-metadata.cjs`**: the fleet metadata gate that commit hooks and CI run over every skill's `graph-metadata.json`
- **`sk-code-quality` overlay checklists**: the author-side checks the quality mode loads for a `.js` or `.css` target
- **`check-comment-hygiene.sh`**: the comment checker whose allowlist exempts known section labels

### Data Flow
A skill's `graph-metadata.json` reaches the gate at commit and CI time. A block that breaks a rule fails the gate there, instead of passing the gate and being ignored by every detection reader at run time.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The contract test file gets one failing case per rule, a valid block and the absent key. The gate then runs over the whole tree in its CI form. The overlay change is checked by the quality mode's own tests, `check-rule-copies.test.sh` and `verify-router-sync.cjs`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

None beyond the repository's existing Node.js and Bash toolchain.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: an existing skill fails the gate, or the operator rejects a decision. Revert the commit that carries the change. The two private blocks are restored from the scratchpad backups listed in `implementation-summary.md`.
<!-- /ANCHOR:rollback -->

---
