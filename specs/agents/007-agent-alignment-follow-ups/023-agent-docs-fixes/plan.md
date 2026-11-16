---
title: "Implementation Plan: Phase 23: agent-docs-fixes"
description: "Fix the phase 20 doc findings in three parallel DeepSeek dispatches on disjoint files, each with literal replacement text, then check each edit against the file it describes."
trigger_phrases:
  - "agent docs fixes plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 23: agent-docs-fixes

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, YAML, one CommonJS comment |
| **Framework** | Repo docs and the doctor workflow asset |
| **Storage** | None |
| **Testing** | `rg` checks, `node --check`, a YAML parse |

### Overview
The crosswalk is one dispatch, the sync docs a second and the agent behavior notes and citations a third. Each brief states the facts and the exact text, re-measured after phase 22.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Each finding re-measured against the current tree

### Definition of Done
- [x] The REQ-001 search prints nothing
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Text edits only.

### Key Components
- **`agent-mirror-crosswalk.md`**: the contract for how each declaration lands in each tree.
- **The sync and behavior docs**: the places a reader meets the agents first.

### Data Flow
None; no runtime reads these docs except the doctor workflow, whose YAML must still parse.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The REQ-001 search, a check that each new citation lands on the rule it names, `node --check` on the commented script and a YAML parse of the doctor asset.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

None beyond phase 22.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the phase commit.
<!-- /ANCHOR:rollback -->

---

