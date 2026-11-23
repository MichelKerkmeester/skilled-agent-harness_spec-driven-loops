---
title: "Implementation Plan: Phase 10: mcp-tooling-browser-pointers"
description: "Rewrites the browser references in four mcp-tooling modes to name the mcp-browser-use hub, bumps each file's version and adds a changelog entry per mode. Proof is a grep count, the mcp-tooling hub check and strict validation."
trigger_phrases:
  - "mcp tooling browser pointers plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 10: mcp-tooling-browser-pointers

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, with Node.js for the hub checker |
| **Framework** | None |
| **Storage** | None |
| **Testing** | A `git grep` count, `parent-skill-check.cjs` and `validate.sh --strict` |

### Overview
Each stale reference is replaced by exact text, one file at a time, with a check that each old string occurs once. Each changed file's version moves up one step, and each changed mode gets a changelog entry so its `SKILL.md` version matches.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met, as tasks.md records
- [x] `parent-skill-check.cjs .skilled/skills/mcp-tooling` prints its `OK` line with 0 warnings
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Other: documentation pointers, checked by grep and the hub checker.

### Key Components
- **Mode routing prose** (`mcp-mobbin/ROUTER.md`, `mcp-refero/ROUTER.md`): names where browser work goes when a request is not the mode's own.
- **ClickUp's browser notes** (`mcp-click-up/references/mcp-tools.md` §8): name the browser each program drives.
- **Mode versions**: the hub checker's rule 13d compares each mode's `SKILL.md` version with its newest changelog entry.

### Data Flow
A reader or agent follows a browser pointer from an mcp-tooling mode to the `mcp-browser-use` hub, which routes to the installed mode.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. Setup counts the stale lines at HEAD. Implementation rewrites them, bumps versions and adds the changelogs. Verification reruns the count, the hub checker and strict validation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The Measured Behavior grep must print 0 on the working tree. `parent-skill-check.cjs .skilled/skills/mcp-tooling` must print its `OK` line with 0 warnings. No browser program is run, because none changed.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

Node.js runs the hub checker and the spec validator. No package is added.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: a pointer sends readers somewhere wrong, or a route changes. Rollback: revert this phase's commit, which restores the 12 files and removes the four changelog entries. Nothing outside the mcp-tooling modes and this packet changes.
<!-- /ANCHOR:rollback -->

---
