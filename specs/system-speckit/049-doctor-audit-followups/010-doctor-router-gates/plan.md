---
title: "Implementation Plan: Phase 10: doctor-router-gates"
description: "Copy the /doctor:git input gate into the two other doctor routers that declare a required target, and pass the detected document type into the extractor's frontmatter parser so commands skip the array-format rule."
trigger_phrases:
  - "doctor router gates plan"
  - "extractor command exemption plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 10: doctor-router-gates

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown routers, Python |
| **Framework** | The sk-create-command router template |
| **Storage** | None |
| **Testing** | pytest regression suite, `validate_document.py`, `route-validate.sh`, the doctor `run-all.sh` |

### Overview
Each router gets the gate `/doctor:git` already carries, placed between its intro and `## 1. ROUTER CONTRACT`. Its own target-binding step now takes the value from the gate. The extractor already detects the document type before parsing frontmatter, so it passes that type in and skips one rule for commands.
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
Thin routers with a router-owned input gate; the presentation asset keeps the prompt wording.

### Key Components
- **Input gate**: binds the target from `$ARGUMENTS`, forbids inference, and shows the presentation's prompt when the target is missing
- **`parse_frontmatter(content, doc_type)`**: the one caller passes the detected type

### Data Flow
`extract_structure()` detects the type, then parses frontmatter with it; the array-format issue is added only when the type is not `command`.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The new regression case was run against a scratch copy of the extractor with the exemption removed, where it failed, before it was accepted.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

N/A — record dependencies beyond the components named in the architecture here.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the phase commit; no data changes.
<!-- /ANCHOR:rollback -->

---
