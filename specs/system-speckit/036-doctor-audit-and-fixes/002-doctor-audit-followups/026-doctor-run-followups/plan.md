---
title: "Implementation Plan: Phase 26: doctor-run-followups"
description: "Fix the test's assumption, prove each curated block against the sanitizer, stamp the clean ones and report the rest."
trigger_phrases:
  - "doctor run followups plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 26: doctor-run-followups

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Python test, JSON metadata |
| **Framework** | pytest, the advisor sanitizer |
| **Storage** | Skill-root graph metadata |
| **Testing** | sk-doc script suite, advisor suite, graph validation |

### Overview
The test now compares each loaded value with the written one. The stamp went only to the seven skills whose 286 curated labels all pass the sanitizer unchanged.
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
Prove before stamping.

### Key Components
- **Example-line test**: written value equals loaded value, non-zero lines switch on
- **Sanitizer proof**: every trigger phrase, key topic, intent signal and keyword through `sanitizeDerivedValue`

### Data Flow
Diagnose, fix test, prove labels, stamp, verify.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The fixed test passes and still flags a line meant to switch on that stays off. The full sk-doc script suite passes. After stamping, the derived regenerator reports no change, the skill root metadata check passes 14 of 14, routes stay fresh, the advisor suite passes 1004 with 6 skipped and graph validation drops to 7 warnings.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

N/A — record dependencies beyond the components named in the architecture here.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the test edit and remove the seven `sanitizer_version` keys.
<!-- /ANCHOR:rollback -->

---
