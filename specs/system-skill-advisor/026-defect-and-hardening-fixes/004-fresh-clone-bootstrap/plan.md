---
title: "Implementation Plan: Fix advisor launcher bootstrap on a fresh clone"
description: "Make the advisor launcher bootstrap install the system-spec-kit workspace before building its runtime, so a fresh clone starts cleanly."
trigger_phrases:
  - "fresh clone bootstrap plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Fix advisor launcher bootstrap on a fresh clone

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS launcher, npm workspaces |
| **Framework** | None |
| **Storage** | None |
| **Testing** | vitest launcher suites plus a clean-clone run |

### Overview
`buildIfNeeded` gains one step before the runtime install: when `system-spec-kit/node_modules/.bin/tsc` is missing, run `npm ci` (or `npm install` without a lockfile) in the spec-kit workspace. The spec-kit path is resolved from `runtimeDir` the same way the runtime build script resolves it.
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
Other (launcher bootstrap)

### Key Components
- **`buildIfNeeded`**: installs and builds the advisor runtime when its dist is missing or stale.
- **Advisor runtime build script**: compiles `system-spec-kit/shared`, then runs the spec-kit workspace `tsc`.

### Data Flow
Launcher start -> artifacts stale -> install spec-kit workspace if its `tsc` is missing -> install runtime -> build runtime -> start daemon.
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

Revert the launcher change with `git revert`. No persisted state changes.
<!-- /ANCHOR:rollback -->

---

