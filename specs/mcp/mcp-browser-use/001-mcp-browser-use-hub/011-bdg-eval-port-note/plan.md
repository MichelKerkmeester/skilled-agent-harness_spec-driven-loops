---
title: "Implementation Plan: Phase 11: bdg-eval-port-note"
description: "Adds one troubleshooting entry to the Chrome DevTools mode for the bdg 0.6.10 dom eval port defect, bumps the guide and mode versions and adds a changelog entry. Proof is a grep count, the browser hub check and strict validation."
trigger_phrases:
  - "bdg eval port note plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 11: bdg-eval-port-note

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
| **Testing** | An `rg` count, `parent-skill-check.cjs` and `validate.sh --strict` |

### Overview
One new entry goes into §6 of the mode's troubleshooting guide, beside the other session errors. It states only what the repros and bdg's source confirm. The guide and the mode `SKILL.md` each move up one version, and a changelog entry keeps the mode version equal to its newest changelog.
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
- [x] `parent-skill-check.cjs .skilled/skills/mcp-browser-use` prints its `OK` line with 0 warnings
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Other: one troubleshooting entry, checked by grep and the hub checker.

### Key Components
- **Troubleshooting guide** (`mcp-chrome-devtools/references/troubleshooting.md` §6): where an agent looks up a bdg session error.
- **Mode version** (`mcp-chrome-devtools/SKILL.md`): the hub checker's rule 13d compares it with the newest changelog entry.

### Data Flow
An agent gets `Session target not found` from `bdg dom eval`, searches the guide for the error, and either restarts the session on 9222 or reads the value through `bdg cdp`.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. Setup confirms the defect in bdg's source. Implementation writes the entry, bumps versions and adds the changelog. Verification reruns the count, the hub checker and strict validation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

`rg -c 'Session target not found|returnByValue'` on the guide must print 3. `parent-skill-check.cjs .skilled/skills/mcp-browser-use` must print its `OK` line with 0 warnings. No browser session is run in this phase, because each `bdg` command starts a daemon and the repros already ran in the sending session.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

Node.js runs the hub checker and the spec validator. The entry describes bdg 0.6.10. No package is added.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: the entry sends agents to a fix that does not work. Rollback: revert this phase's commit, which removes the entry and the changelog and restores both versions. Nothing outside the Chrome DevTools mode and this packet changes.
<!-- /ANCHOR:rollback -->

---
