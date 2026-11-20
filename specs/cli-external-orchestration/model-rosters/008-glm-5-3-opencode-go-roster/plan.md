---
title: "Implementation Plan: Add GLM 5.3 to the cli-pi and cli-opencode rosters through the opencode-go provider"
description: "Add or rewrite one GLM-5.3 row in each of the cli-pi and cli-opencode roster references, on the opencode-go provider only, from the live catalog entry."
trigger_phrases:
  - "glm 5 3 opencode go roster plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Add GLM 5.3 to the cli-pi and cli-opencode rosters through the opencode-go provider

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown reference docs |
| **Framework** | OpenCode 1 and Pi CLIs |
| **Storage** | None |
| **Testing** | Catalog read, live dispatch attempt and `rg` |

### Overview
Change two reference files, one row each. Take the ladder, limits and price from the opencode-go catalog. Try one live turn per level on each CLI, and record the result in the row.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All P0 acceptance criteria met; the P1 live-reply check is deferred with operator approval
- [x] `rg -c 'Z.AI GLM-5.3, the full model'` prints 1 on each roster file
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Closed roster tables, one per CLI.

### Key Components
- **`cli-opencode/references/providers-and-models.md`**: the cli-opencode roster
- **`cli-pi/references/providers-and-models.md`**: the cli-pi roster

### Data Flow
An operator reads the roster row, then passes the model id and level to `opencode run` or `pi -p`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup reads the catalog entry and tries one turn per level on each CLI. Implementation writes the two rows. Verification runs `rg` for the rows and the strict packet validator. The ordered tasks are in `tasks.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

`opencode1 run -m opencode-go/glm-5.3 --variant <level>` and `pi --offline --model opencode-go/glm-5.3 --thinking <level> -p`, for `low`, `high` and `max`. On 2026-11-19 every one was refused because the Go plan was out of usage. Rerun them after the reset.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The OpenCode 1 and Pi binaries, the opencode-go login, and Go plan usage. No new package.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: the gateway withdraws the id or it fails a live turn after the usage reset. Revert the two rows.
<!-- /ANCHOR:rollback -->

---
