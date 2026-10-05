---
title: "Implementation Plan: Phase 27: derived-sanitizer-instruction-shape"
description: "Rewrite the instruction pattern around phrasing, bump the version, prove all curated labels and stamp all 14 blocks."
trigger_phrases:
  - "derived sanitizer instruction shape plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 27: derived-sanitizer-instruction-shape

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, JSON metadata |
| **Framework** | Vitest, the advisor runtime |
| **Storage** | Skill-root graph metadata |
| **Testing** | Advisor suite, graph validation, derived regenerator |

### Overview
The pattern now needs a phrase: an override verb within 48 characters of an instruction noun, a fixed instruction phrase, a known injection term, or a call to a tool that is not followed by a routing word such as chain or flow.
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
Match the shape of an instruction, never a word it shares with a label.

### Key Components
- **Instruction pattern**: five phrase alternatives, case-insensitive
- **Markup pattern**: unchanged
- **Label proof**: every trigger phrase, key topic, intent signal and keyword through `sanitizeDerivedValue`

### Data Flow
Rewrite pattern, add tests, rebuild, prove labels, stamp, restart the advisor daemon, verify.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The new test keeps 11 routing labels and rejects 5 attacks, and the existing attack tests still pass. The advisor suite passes 1005 with 6 skipped. All 14 blocks pass the sanitizer with 0 labels changed. The derived regenerator reports no change, the skill root metadata check passes 14 of 14, routes stay fresh and graph validation reports 0 warnings once the advisor daemon runs the new build.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

N/A — record dependencies beyond the components named in the architecture here.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the sanitizer, version and test edits and set the 14 stamps back to v1, removing the seven that phase 026 did not add.
<!-- /ANCHOR:rollback -->

---
