---
title: "Implementation Plan: Phase 1: Make Pi the default Jev transport when it is available"
description: "The transport gains an automatic route used when no transport is named."
trigger_phrases:
  - "pi default transport plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 1: Make Pi the default Jev transport when it is available

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
| -------- | ------- |
| **Language/Stack** | Node.js ESM and CommonJS |
| **Framework** | None |
| **Storage** | JSONL call records |
| **Testing** | `node --test`, vitest |

### Overview
The transport gains an automatic route used when no transport is named. It runs the Pi preflight and calls Pi when every gate passes, otherwise the CLI. Pi learns `noul` through the same classifier context, and each outcome names its route. The eight scorers swap their own CLI spawn for the transport call.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Other: a shared transport module with per-scorer callers

### Key Components
- **Transport**: `jev-transport.mjs` picks the route and maps payloads
- **Scorers**: Eight callers that record each call and its route

### Data Flow
A scorer builds its jev arguments and calls `spawnClassifierCall`. The transport reads the option and `JEV_TRANSPORT`, runs the cached Pi preflight on the automatic route and returns a CLI-shaped outcome with its route name. The scorer writes the call record as before.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Each behavior gets a case in the transport suite or the scorer's suite. Every suite runs with the key set and unset. One live smoke closes the phase.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Pi 0.99.2 and its `typesafe` and `openrouter` classifiers
- Live Jev behind `jev auth status`
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the phase's commit. `JEV_TRANSPORT=jev` restores the CLI route at once without a revert.
<!-- /ANCHOR:rollback -->

---

