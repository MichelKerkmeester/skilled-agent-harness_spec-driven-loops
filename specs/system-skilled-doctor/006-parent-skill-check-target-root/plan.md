---
title: "Implementation Plan: parent-skill-check reads a hub's canary fixture, commands and guards from the hub's own repository"
description: "Give parent-skill-check a second root, the repository that holds the audited hub, and read the hub's canary fixture, bound commands, drift guard and advisor from it while the checker's own code stays on the checker root."
trigger_phrases:
  - "parent skill check target root plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: parent-skill-check reads a hub's canary fixture, commands and guards from the hub's own repository

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS |
| **Framework** | None |
| **Storage** | None |
| **Testing** | `node --test` |

### Overview
The checker keeps `CHECKER_ROOT` for its own code and gains `ctx.dataRoot`, the repository that holds the hub. The canary fixture, commands tree, drift guard and advisor script resolve against `ctx.dataRoot`. The Barter reproduction, the 7 Skilled hubs and the doctor test suite prove the change.
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
- [x] `node --test .skilled/commands/doctor/scripts/tests/*.test.cjs` prints `pass 1336` and `fail 0`
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Two resolved roots.

### Key Components
- **`CHECKER_ROOT`**: the checkout the checker runs from. It serves `SK_CREATE_SKILL_SCRIPTS`, the leaf-manifest generator, the routing-shape debt ledger keys and the resolution of a relative hub path.
- **`findDataRoot(target)`**: the repository that holds the hub, confirmed by `findSourceRoot`, or `CHECKER_ROOT` when the hub sits in no repository. It serves the canary fixture, the commands tree, the drift guard and the advisor script.

### Data Flow
`main` resolves the hub path, `createContext` stores `dataRoot` and each check that reads hub data joins its path onto `ctx.dataRoot`.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup reproduces the 13 `5k-canary` failures and records a baseline for every Skilled hub and the test suite. Implementation splits the two roots in `parent-skill-check.cjs` and adds four tests. Verification reruns the reproduction, the 7 hubs and the doctor test suite, then updates the README and changelog. The ordered work is in `tasks.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The four new tests in `parent-skill-check-invariants.test.cjs` run once against the unfixed checker, where they must fail, and once against the fixed one, where they must pass.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

None beyond the existing `repo-root.mjs` exports. No new package.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: a Skilled hub's verdict changes. Revert the commit, which restores the single root.
<!-- /ANCHOR:rollback -->

---
