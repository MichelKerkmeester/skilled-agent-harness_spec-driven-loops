---
title: "Implementation Plan: Phase 44: skill-advisor-stress-ci"
description: "Point the advisor stress harness and three runtime tests at the `.server` factory the plugin's dual export carries, add a test that pins the export shape, and prove the change with before and after suite counts plus a mutation."
trigger_phrases:
  - "skill advisor stress ci plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 44: skill-advisor-stress-ci

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript under vitest, Node 22 and 26 |
| **Framework** | OpenCode plugin API through the `dualPlugin` bridge |
| **Storage** | None; the advisor child process is mocked in every touched test |
| **Testing** | vitest (stress config and default config), node tap for the plugin suite, the `/doctor:opencode` battery |

### Overview
The plugin's default export became a `{ id, setup, server }` object in commit `32e1f92687`, and four test files kept calling that object as a function. Each now calls `.server(input, options)`, the v1 factory the object carries, and one new stress test asserts the export keeps the shape the harness depends on.
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
Test-only repair inside the existing harness and the existing suite; no new module, no source change.

### Key Components
- **Dual-export contract**: `dualPlugin` in `.opencode/plugins/lib/v2-bridge.js` returns `{ id, setup, server }`, where `server` is the OpenCode 1 plugin factory.
- **Stress harness**: `opencode-plugin-bridge-stress.vitest.ts` builds the hooks through that factory and drives them with a mocked advisor child.
- **Runtime callers**: the three tests that build the same hooks directly.

### Data Flow
The harness imports the default export object, calls `server({ directory }, options)` to get hooks, feeds a prompt through the bridged transform, and reads what the plugin wrote to the mocked child's stdin. A direct call on the object short-circuits that flow at the first line, which is the `TypeError` the workflow was reporting.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The counts are taken before the first edit (`scratch/baseline/`) and after the last (`scratch/after/`), across the stress suite, the runtime vitest suite, the plugin suite, the purity test and the dual-version battery. The fix is proven by reverting the harness call and showing the original four failures return (`scratch/mutation/m1-call-default-directly.txt`).
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The dual-export object on the plugin's default export, and the purity test that enforces it. Neither changes in this phase, so the harness follows the contract rather than the contract following the harness.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the four test files. Nothing outside them changes, so a revert restores the pre-phase red workflow and touches no plugin, no bridge and no runtime source.
<!-- /ANCHOR:rollback -->

---
