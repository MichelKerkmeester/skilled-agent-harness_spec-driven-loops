---
title: "Implementation Plan: Consolidate the communication repo rules"
description: "Analyze the five communication rules, get four independent reviews, keep only the changes they support, edit the rules in place and record a compliance baseline."
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "architecture decisions"
  - "testing strategy"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Consolidate the communication repo rules

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown rule files |
| **Framework** | sk-create-repo-rule revise workflow |
| **Storage** | None |
| **Testing** | `check-repo-rules`, `check-rule-copies`, `hvr_scan.py`, rule measurement tests |

### Overview
The analysis went to four reviewers in parallel: Opus 5.5 xhigh, DeepSeek V4.1 Flash max, GPT-6 Luna max fast and SWE-2 max. Only the changes the reviews supported were kept. Each rule was edited in place with its version bumped, and the router rows were matched to the edited text.
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
Revise existing rules in place. No new file.

### Key Components
- **`communication.md`**: the per-reply rule. It now owns the registers and the single answer-first section.
- **`communication-prose.md`**: sentence-level rules, plus identifier and number guidance.

### Data Flow
Gate 6 loads `communication.md` and `communication-prose.md` before every reply, and the other three when they fire.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

N/A — record any testing beyond the verification tasks in `tasks.md` here.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

N/A — record dependencies beyond the components named in the architecture here.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the commit that carries the rule edits.
<!-- /ANCHOR:rollback -->

---

