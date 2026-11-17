---
title: "Implementation Plan: Add Hy4 Flash Free to the cli-opencode roster through the opencode-go provider at both thinking levels"
description: "Add one roster row for opencode-go/hy4-flash-free to the cli-opencode providers reference, after a live dispatch at both thinking levels proves the id answers."
trigger_phrases:
  - "hy4 flash free opencode roster plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Add Hy4 Flash Free to the cli-opencode roster through the opencode-go provider at both thinking levels

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown reference doc |
| **Framework** | OpenCode 1.19.4 CLI |
| **Storage** | None |
| **Testing** | Live `opencode run` dispatch and `rg` |

### Overview
Change one reference file. Add one roster row and one family name. Prove it with a live dispatch at each level and an `rg` for the row.
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
- [x] `rg -n 'hy4-flash-free'` on the roster file prints the row, and both live dispatches print `OK`
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Closed roster table.

### Key Components
- **`cli-opencode/references/providers-and-models.md`**: the closed roster an operator reads before naming a model

### Data Flow
An operator reads the roster row, then passes the model id and level to `opencode run`.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup reads the opencode-go catalog entry and dispatches one turn per level. Implementation adds the row to `providers-and-models.md`. Verification runs `rg` for the row and the strict packet validator. The ordered tasks are in `tasks.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

`opencode1 run -m opencode-go/hy4-flash-free --variant <level> "Reply with exactly: OK"` prints `OK` and exits 0 for `none` and for `high`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The OpenCode 1 binary and its opencode-go login. No new package.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: the gateway withdraws the id or stops answering it. Revert the row and the family name in `providers-and-models.md`.
<!-- /ANCHOR:rollback -->

---
